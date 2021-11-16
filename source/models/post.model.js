import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		featuredImage: {
			type: String,
			required: false,
		},
	},
	{
		timestamps: true,
	},
);

const Post = mongoose.model('posts', postSchema);
export default Post;
