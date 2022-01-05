import { gql } from 'apollo-server-express';

export default gql`
	extend type Query {
		getQuestionSetsByUserId(
			page: Int
			limit: Int
			sort: Int
			typeSort: typeSortQuestionSet
		): QuestionSetPaginator! @auth

		getQuestionSetsHome(
			page: Int
			limit: Int
			sort: Int
			typeSort: typeSortQuestionSet
		): QuestionSetPaginator! @auth

		GetQuestionSetsUserLiked(
			page: Int
			limit: Int
			sort: Int
			typeSort: typeSortQuestionSet
		): QuestionSetPaginator! @auth

		SearchQuestionSets(
			textSearch: String!
			page: Int
			limit: Int
			sort: Int
			typeSort: typeSortQuestionSetSearch
			tag: String
			userId: String
		): QuestionSetPaginator!
	}

	extend type Mutation {
		createQuestionSet(newQuestionSet: newQuestionSet!): Message!
		editQuestionSet(infoQuestionSet: editQuestionSet): MessageUpdateQuestionSet!
		likeQuestionSet(questionSetId: String!): MessageUpdateQuestionSet! @auth
		DeleteQuestionSet(questionSetId: String!): MessageUpdateQuestionSet! @auth
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
		textSearch: String
	}

	type QuestionSet {
		id: ID!
		userId: ID
		name: String!
		tag: [String!]!
		cover: String
		isPublic: Boolean
		played: Int
		likes: Int
		liked: Boolean
		nameUser: String
		questionLength: Int
		createdAt: String
		updatedAt: String
	}

	type MessageUpdateQuestionSet {
		message: String!
		questionSet: QuestionSet
	}

	enum typeSortQuestionSetSearch {
		played
		createdAt
		likes
	}

	enum typeSortQuestionSet {
		name
		createdAt
	}
`;
