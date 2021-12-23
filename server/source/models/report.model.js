import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Users',
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		tag: {
			type: [String],
			trim: true,
			require: true,
		},
		cover: {
			type: String,
			default: '',
		},
		isPublic: {
			type: Boolean,
			default: true,
		},
		likes: {
			type: Number,
			default: 0,
		},
		played: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: {
			currentTime: () => {
				let timeNow = new Date();
				let timeAddGMT = new Date(
					timeNow.getTime() + -timeNow.getTimezoneOffset() * 60000,
				);
				return timeAddGMT;
			},
		},
	},
);

const report = mongoose.model('report', reportSchema);
export default report;
