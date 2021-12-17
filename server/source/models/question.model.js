import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
	{
		questionSetId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'questionSet',
			required: true,
		},
		content: {
			type: String,
			require: true,
		},
		image: {
			type: String,
			default: '',
		},
		video: {
			type: String,
			default: '',
		},
		audio: {
			type: String,
			default: '',
		},
		type: {
			type: Number,
			require: true,
		},
		answers: [
			{
				id: mongoose.Schema.Types.ObjectId,
				content: {
					type: String,
					require: true,
				},
				image: {
					type: String,
					default: '',
				},
				isCorrect: {
					type: Boolean,
					default: false,
				},
				votes: {
					type: Number,
					default: 0,
				},
			},
		],
		time: {
			type: Number,
			default: 15,
		},
		score: {
			type: Number,
		},
		typeAnswers: {
			type: [String],
			trim: true,
			default: [],
		},
		explanation: {
			type: String,
			default: '',
		},
		doubleScore: {
			type: Boolean,
			default: false,
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

const Question = mongoose.model('questions', questionSchema);
export default Question;
