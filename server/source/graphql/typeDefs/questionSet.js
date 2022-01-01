import { gql } from 'apollo-server-express';

export default gql`
	extend type Query {
		getQuestionSetsByUserId(
			userId: String!
			page: Int
			limit: Int
			sort: Int
		): QuestionSetPaginator!

		GetQuestionSetsUserLiked: [QuestionSet]! @auth

		SearchQuestionSets(
			textSearch: String!
			page: Int
			limit: Int
			sort: Int
			typeSort: typeSortQuestionSetSearch
			tag: String
			userId: String
		): [QuestionSet]!
	}

	extend type Mutation {
		createQuestionSet(newQuestionSet: newQuestionSet!): Message!
		editQuestionSet(infoQuestionSet: editQuestionSet): MessageUpdateQuestionSet!
		likeQuestionSet(questionSetId: String!): MessageUpdateQuestionSet! @auth
	}

	input editQuestionSet {
		id: ID!
		name: String
		tag: [String]
		cover: String
		isPublic: Boolean
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
		likes: Int
		liked: Boolean
		createdAt: String
		updatedAt: String
	}

	type MessageUpdateQuestionSet {
		message: String!
		questionSet: QuestionSet!
	}

	enum typeSortQuestionSetSearch {
		played
		createdAt
		likes
	}
`;
