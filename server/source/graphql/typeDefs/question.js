import { gql } from 'apollo-server-express';

export default gql`
	extend type Query {
		getQuestionByQuestionSetId(
			questionSetId: String!
			page: Int
			limit: Int
		): QuestionPaginator!
	}

	extend type Mutation {
		createQuestion(newQuestion: [newQuestion!]!): Message!
	}

	input newQuestion {
		questionSetId: ID!
		content: String!
		image: String
		video: String
		audio: String
		type: Int!
		answers: [newAnswers!]!
		played: Int
		time: Float
		score: Float
		typeAnswers: [String]
		explanation: String
		doubleScore: Boolean
	}

	input newAnswers {
		content: String!
		image: String
		isCorrect: Boolean
		votes: Int
	}

	type QuestionPaginator {
		questions: [Question]!
		totalPages: Int!
		page: Int!
	}

	type Question {
		id: ID!
		questionSetId: ID!
		content: String!
		image: String
		video: String
		audio: String
		type: Int!
		answers: [Answers!]!
		played: Int
		time: Float
		score: Float
		typeAnswers: [String]
		explanation: String
		doubleScore: Boolean
	}

	type Answers {
		id: ID!
		content: String!
		image: String
		isCorrect: Boolean
		votes: Int
	}
`;
