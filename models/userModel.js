import mongoose from 'mongoose';
import pkg from 'validator';
import bcrypt from 'bcrypt';

const { isEmail } = pkg;

const userSchema = new mongoose.Schema({
    imgUrl: {
        type: String,
    },
    googleId: {
        type: String,
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [3, 'Name cannot be less than 3 characters'],
        maxlength: [50, 'Name cannot be greater than 50 characters'],
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        validate: [isEmail, 'Please enter a valid email'],
    },
    role: {
        type: String,
        default: 'Attendee',
        enum: ['Attendee', 'Manager', 'Admin'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false,
    },
});

userSchema.methods.arePasswordsEqual = async function (candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
};

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

const User = mongoose.model('User', userSchema);
export default User;
