import mongoose from "mongoose";
import pkg from "validator";

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
		required: [true, "Name is required"],
		minlength: [3, "Name cannot be less than 3 characters"],
		maxlength: [50, "Name cannot be greater than 50 characters"],
		trim: true,
	},
	email: {
		type: String,
		unique: true,
		required: [true, "Email is required"],
		lowercase: true,
		trim: true,
		validate: [isEmail, "Please enter a valid email"],
	},
	role: {
		type: String,
		default: "Attendee",
		enum: ["Attendee", "Manager", "Admin"],
	},
	password: {
		type: String,
		// required: [true, 'Password is required'],
	},
	passwordConfirm: {
		type: String,
		// required: [true, 'Password confirmation is required']
	},
});

const User = mongoose.model("User", userSchema);
export default User;
