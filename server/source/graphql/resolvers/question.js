import { ApolloError } from 'apollo-server-express';

export default {
	Query: {
		getQuestionByQuestionSetId: async (
			parent,
			{ questionSetId, page, limit },
			{ Question },
			info,
		) => {
			try {
				const options = {
					page: page || 1,
					limit: limit || 10,
				};
				const startIndex = (options.page - 1) * options.limit;
				const questions = await Question.find({ questionSetId })
					.skip(startIndex)
					.limit(options.limit)
					.exec();
				const countQuestions = await Question.countDocuments({
					questionSetId,
				}).exec();

				return {
					questions,
					totalPages: Math.ceil(countQuestions / options.limit),
					page: options.page,
				};
			} catch (error) {
				console.log(error);
				throw new ApolloError(error.message, '500');
			}
		},
	},
	Mutation: {
		createQuestion: async (parent, { newQuestion }, { Question }, info) => {
			try {
				const res = await Question.create(newQuestion);
				return { message: 'Create question success' };
			} catch (error) {
				console.log(error);
			}
		},

		EditQuestion: async (parent, { infoQuestion }, { Question }, info) => {
			try {
				//console.log(infoQuestion);
				const id = infoQuestion.id;
				delete infoQuestion.id;
				const newQuestion = await Question.findByIdAndUpdate(
					{
						_id: id,
					},
					infoQuestion,
					{ new: true },
				);

				return { message: 'Edit question success', question: newQuestion };
			} catch (error) {
				throw new ApolloError(error.message, '500');
			}
		},

		DeleteQuestion: async (parent, { questionId }, { Question }, info) => {
			try {
				await Question.findByIdAndDelete({
					_id: questionId,
				});
				return { message: 'Delete question success' };
			} catch (error) {
				throw new ApolloError(error.message, '500');
			}
		},
	},
};
