import { gql } from 'apollo-server-express';

export default gql`
	extend type Query {
		getQuestionSetsByUserId(
			userId: String!
			page: Int
			limit: Int
			sort: Int
		): QuestionSetPaginator!
	}

	extend type Mutation {
		createQuestionSet(newQuestionSet: newQuestionSet!): Message!
	}

	input newQuestionSet {
		userId: ID!
		name: String!
		tag: [String!]!
		cover: String
		isPublic: Boolean
		played: Int
	}

	type QuestionSetPaginator {
		questionSets: [QuestionSet]!
		totalPages: Int!
		page: Int!
	}

	type QuestionSet {
		id: ID!
		userId: ID!
		name: String!
		tag: [String!]!
		cover: String
		isPublic: Boolean
		played: Int
		createdAt: String
		updatedAt: String
	}
`;
