import catchAsync from "../utils/catchAsync.js";

import { OAuth2Client } from "google-auth-library";

import User from "../models/userModel.js";
import AppError from "../utils/appError.js";

const client = new OAuth2Client(
	"113791688981-b5a07o1kd42vuuio655fosap0e61of10.apps.googleusercontent.com"
);

export const login = catchAsync(async (req, res, next) => {
	console.log(req.body);
	res.json({
		message: "Successfully logged you in.",
	});
});

export const googleAuth = catchAsync(async (req, res, next) => {
	console.log(req.body);

	const { accessToken } = req.body;

	// Verify the access token by sending a request to the token info endpoint
	const tokenInfoResponse = await fetch(
		`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
	);
	const tokenInfo = await tokenInfoResponse.json();

	if (tokenInfo.error) {
		return new AppError("Invalid access token", 401);
	}

	// Fetch user profile information using the access token
	const profileResponse = await fetch(
		"https://www.googleapis.com/oauth2/v2/userinfo",
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		}
	);
	const profile = await profileResponse.json();

	if (profile.error) {
		return new AppError("Failed to fetch user profile", 401);
	}

	// Extract user information
	const userId = profile.id; // Google user ID
	const email = profile.email;
	const name = profile.name;
	const picture = profile.picture;

	const user = await User.create({
		googleId: userId,
		email,
		name,
		imgUrl: picture,
	});

	console.log("User in database", user);
	// Authenticate the user in your system, create a session, etc.
	console.log(profile);

	res.status(200).json({
		message: "Authentication successful",
		userId,
		email,
		name,
		picture,
	});
});
