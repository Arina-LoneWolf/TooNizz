export default {
	Query: {
		getQuestionSetsByUserId: async (
			parent,
			{ userId, page, limit, sort },
			{ questionSet },
			info,
		) => {
			try {
				const options = {
					page: page || 1,
					limit: limit || 10,
					sort: {
						createdAt: sort || -1,
					},
				};
				const startIndex = (options.page - 1) * options.limit;

				const data = await questionSet
					.find({ userId })
					.sort(options.sort)
					.skip(startIndex)
					.limit(options.limit)
					.exec();
				const countQuestionSets = await questionSet
					.countDocuments({ userId })
					.exec();
				return {
					questionSets: data,
					totalPages: Math.ceil(countQuestionSets / options.limit),
					page: options.page,
				};
			} catch (error) {
				console.log(error);
			}
		},
	},
	Mutation: {
		createQuestionSet: async (
			parent,
			{ newQuestionSet },
			{ questionSet },
			info,
		) => {
			try {
				const res = await questionSet.create(newQuestionSet);
				return { message: 'Create questionSet success' };
			} catch (error) {
				console.log(error);
			}
		},
	},
};
