import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			require: true,
		},
		password: {
			type: String,
			require: true,
		},
		avatar: {
			type: String,
			require: true,
			default: '',
		},
		questionCollection: {
			type: [String],
			trim: true,
			default: [],
		},
	},
	{
		timestamps: true,
	},
);

const User = mongoose.model('users', userSchema);
export default User;
