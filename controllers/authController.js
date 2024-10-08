import catchAsync from '../utils/catchAsync.js';

import { OAuth2Client } from 'google-auth-library';

import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import Email from '../utils/email.js';

import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const client = new OAuth2Client(
    '113791688981-b5a07o1kd42vuuio655fosap0e61of10.apps.googleusercontent.com'
);
const signToken = (id, res) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.cookie('jwt', token, {
        maxAge: 90 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
    });
    return token;
};

function generatePassword(length = 8) {
    return crypto
        .randomBytes(length)
        .toString('base64') // Convert to base64 string
        .slice(0, length) // Trim to the required length
        .replace(/[^a-zA-Z0-9]/g, ''); // Remove non-alphanumeric characters
}

export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(
            new AppError(
                'No account for given email found. Please register first and then try again',
                400
            )
        );
    }

    if (!(await user.arePasswordsEqual(password, user.password))) {
        return next(new AppError('Invalid email or password'));
    }

    const token = signToken(user?.id, res);
    user.password = undefined;

    res.json({
        status: 'success',
        token,
        user,
    });
});

export const register = catchAsync(async (req, res, next) => {
    const { name, email, password } = req.body;

    const newUser = await User.create({ name, email, password });

    const token = signToken(newUser?.id, res);

    newUser.password = undefined;

    res.json({
        status: 'success',
        token,
        user: newUser,
    });
});

export const googleAuth = catchAsync(async (req, res, next) => {
    const { accessToken } = req.body;

    // Verify the access token by sending a request to the token info endpoint
    const tokenInfoResponse = await fetch(
        `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
    );
    const tokenInfo = await tokenInfoResponse.json();

    if (tokenInfo.error) {
        return new AppError('Invalid access token', 401);
    }

    // Fetch user profile information using the access token
    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const profile = await profileResponse.json();

    if (profile.error) {
        return new AppError('Failed to fetch user profile', 401);
    }

    const { id, email, name, picture } = profile;

    const user = await User.findOne({ googleId: id });

    let token;

    if (user) {
        token = signToken(user._id, res);
        user.googleId = undefined;
        return res.status(200).json({
            status: 'success',
            user,
            token,
        });
    }

    const newUser = await User.create({
        googleId: id,
        email,
        name,
        imgUrl: picture,
        password: 'does not matter',
    });

    token = signToken(newUser._id, res);

    res.status(200).json({
        status: 'success',
        user: newUser,
        token,
    });
});

export const forgotPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) return next(new AppError('No user with this email exits', 400));

    const token = user.createResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.BASE_URL}/reset-password/${token}`;

    console.log('Reset URL', resetUrl);

    try {
        const emailSender = new Email(user, resetUrl);
        await emailSender.sendPasswordReset();

        res.status(200).json({
            status: 'success',
            message: 'Check your email for resetting password',
        });
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiresIn = undefined;
        await user.save({ validateBeforeSave: false });

        console.log(err);

        return next(new AppError('An error occured while sending email. Try again later'));
    }
});

export const resetPassword = catchAsync(async (req, res, next) => {
    const { password, passwordConfirm } = req.body;
    const resetToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken: resetToken,
        resetPasswordTokenExpiresIn: { $gt: Date.now() },
    });

    if (!user) {
        return next(new AppError('No such user exists or token expired'));
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiresIn = undefined;
    await user.save();

    const token = signToken(user._id, res);
    res.status(200).json({
        status: 'success',
        token,
        user,
    });
});

export const uploadImage = (req, res, next) => {
    console.log(req.file);
    console.log(req.body);
    res.json('Whatever');
};
