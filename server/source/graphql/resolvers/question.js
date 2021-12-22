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
	},
};
