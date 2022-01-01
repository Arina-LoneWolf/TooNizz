import { ApolloError } from 'apollo-server-express';
import escapeStringRegexp from 'escape-string-regexp';

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
				throw new ApolloError(error.message, '500');
			}
		},

		GetQuestionSetsUserLiked: async (
			parent,
			{ page, limit, sort },
			{ idUser, questionSet },
			info,
		) => {
			try {
				const newQuestionSets = await questionSet
					.find({
						likes: { $in: [idUser] },
					})
					.lean();

				for (let i = 0; i < newQuestionSets.length; i++) {
					newQuestionSets[i].id = newQuestionSets[i]._id;
					delete newQuestionSets[i]._id;
				}

				//console.log(newQuestionSets);

				return newQuestionSets;
			} catch (error) {
				throw new ApolloError(error.message, '500');
			}
		},

		SearchQuestionSets: async (
			parent,
			{ textSearch, page, limit, sort, typeSort, tag, userId },
			{ questionSet },
			info,
		) => {
			try {
				const pageA = page || 1;
				const limitA = limit || 10;
				let sortData = null;
				if (typeSort) {
					if (typeSort === 'played') {
						sortData = { played: sort };
					} else if (typeSort === 'createdAt') {
						sortData = { createdAt: sort };
					} else {
						sortData = {
							likes: sort,
						};
					}
				}

				console.log('pageA', pageA);
				//console.log('typeSort', typeSort);

				const startIndex = (pageA - 1) * limitA;
				let searchText = textSearch.trim();
				const $regex = escapeStringRegexp(searchText);

				let countQuestionSets = 0;
				let newQuestionSets = [];
				if (tag) {
					console.log('Có tag');
					countQuestionSets = await questionSet.countDocuments({
						name: { $regex, $options: '$i' },
						isPublic: true,
						tag: { $in: [tag] },
					});

					countQuestionSets = Math.ceil(countQuestionSets / limitA);

					newQuestionSets = await questionSet
						.find({
							name: { $regex, $options: '$i' },
							isPublic: true,
							tag: { $in: [tag] },
						})
						.skip(startIndex)
						.limit(limitA)
						.sort(sortData)
						.lean();
				} else {
					console.log('Không tag');

					countQuestionSets = await questionSet.countDocuments({
						name: { $regex, $options: '$i' },
						isPublic: true,
					});

					countQuestionSets = Math.ceil(countQuestionSets / limitA);
					newQuestionSets = await questionSet
						.find({
							name: { $regex, $options: '$i' },
							isPublic: true,
						})
						.skip(startIndex)
						.limit(limitA)
						.sort(sortData)
						.lean();
				}

				//if (userId) {
				for (let i = 0; i < newQuestionSets.length; i++) {
					newQuestionSets[i].id = newQuestionSets[i]._id;
					delete newQuestionSets[i]._id;
					if (newQuestionSets[i].likes.includes(userId)) {
						newQuestionSets[i].liked = true;
					} else {
						newQuestionSets[i].liked = false;
					}
					newQuestionSets[i].likes = newQuestionSets[i].likes.length;
				}
				// } else {
				// 	for (let i = 0; i < newQuestionSets.length; i++) {
				// 		newQuestionSets[i].id = newQuestionSets[i]._id;
				// 		delete newQuestionSets[i]._id;
				// 		newQuestionSets[i].likes = newQuestionSets[i].likes.length;
				// 	}
				// }

				console.log('tong so', countQuestionSets);
				//console.log(newQuestionSets);

				return newQuestionSets;
			} catch (error) {
				throw new ApolloError(error.message, '500');
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

		editQuestionSet: async (
			parent,
			{ infoQuestionSet },
			{ questionSet },
			info,
		) => {
			try {
				const id = infoQuestionSet.id;

				delete infoQuestionSet.id;
				delete infoQuestionSet.likes;
				delete infoQuestionSet.played;

				console.log(infoQuestionSet);
				if (infoQuestionSet.userId) delete infoQuestionSet.userId;
				const newQuestionSet = await questionSet.findByIdAndUpdate(
					{
						_id: id,
					},
					infoQuestionSet,
					{ new: true },
				);

				console.log(newQuestionSet);
				return {
					message: 'Edit questionSet success',
					questionSet: newQuestionSet,
				};
			} catch (error) {
				throw new ApolloError(error.message, '500');
			}
		},

		likeQuestionSet: async (
			parent,
			{ questionSetId },
			{ idUser, questionSet },
			info,
		) => {
			try {
				console.log('info', idUser);

				let newQuestionSet = await questionSet
					.findById({
						_id: questionSetId,
					})
					.lean();

				if (newQuestionSet.likes.includes(idUser)) {
					newQuestionSet.likes = newQuestionSet.likes.filter(
						(id) => id !== idUser,
					);
				} else {
					newQuestionSet.likes.push(idUser);
				}

				const newLikes = newQuestionSet.likes;
				newQuestionSet.likes = newQuestionSet.likes.length;

				await questionSet.findByIdAndUpdate(
					{
						_id: questionSetId,
					},
					{
						likes: newLikes,
					},
					{ new: true },
				);

				console.log(newQuestionSet);
				return {
					message: 'Like questionSet success',
					questionSet: newQuestionSet,
				};
			} catch (error) {
				throw new ApolloError(error.message, '500');
			}
		},
	},
};
