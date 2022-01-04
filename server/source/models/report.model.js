import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'users',
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		gameStart: Date,
		gameMode: {
			type: String,
			required: true,
		},
		players: [
			{
				name: {
					type: String,
					require: true,
				},
				rank: {
					type: Number,
					require: true,
				},
				correctPercentAnswers: {
					type: Number,
					require: true,
				},
				unAnswered: {
					type: Number,
					require: true,
				},
				finalScore: {
					type: Number,
					require: true,
				},
				detailAllQuestions: [
					{
						content: {
							type: String,
							require: true,
						},
						type: {
							type: Number,
							require: true,
						},
						answered: [String],
						correct: Boolean,
						time: Number,
						score: Number,
					},
				],
			},
		],
		questions: [
			{
				dataQuestion: {
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
							countPlayerAnswer: Number,
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
						type: [
							{
								value: String,
								countPlayerAnswer: Number,
							},
						],
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
					haveScore: {
						type: Boolean,
						default: true,
					},
					countPlayerNoAnswer: Number,
				},

				percentRight: Number,
				avgAnswersTime: Number,
				detailAllPlayers: [
					{
						name: String,
						answered: [String],
						correct: Boolean,
						time: Number,
						score: Number,
					},
				],
			},
		],
		exist: {
			type: String,
			default: '',
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
