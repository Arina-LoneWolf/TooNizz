import { gql } from 'apollo-server-express';

export default gql`
	extend type Query {
		getAllPosts: [Post!]!
	}

	extend type Mutation {
		createNewPost(newPost: newPost!): Post!
	}

	input newPost {
		title: String!
		content: String!
		featuredImage: String
	}

	type Post {
		id: ID!
		title: String! @upper
		content: String!
		featuredImage: String
		createdAt: String
		updatedAt: String
	}
`;
