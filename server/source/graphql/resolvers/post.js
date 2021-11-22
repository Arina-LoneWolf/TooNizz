export default {
	Query: {
		getAllPosts: async (parent, args, { Post }, info) => {
			try {
				const res = await Post.find();
				return res;
			} catch (error) {
				console.log(error);
			}
		},
	},
	Mutation: {
		createNewPost: async (parent, { newPost }, { Post }, info) => {
			try {
				const res = await Post.create(newPost);
				return res;
			} catch (error) {
				console.log(error);
			}
		},
	},
};
