import { gql } from 'apollo-server-express';

export default gql`
	extend type Query {
		#getAuthor(id: Int): User
		getInfo: infoUser! @auth
	}

	extend type Mutation {
		register(user: newUser!): Message!
		login(email: String!, password: String!): AuthUser!
	}

	input newUser {
		name: String!
		email: String!
		password: String!
	}

	type AuthUser {
		accessToken: String!
	}

	type Message {
		message: String!
	}

	type infoUser {
		id: ID!
		name: String!
		avatar: String
		collection: [String]
		email: String!
		createdAt: String
		updatedAt: String
	}
`;
