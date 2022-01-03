import { gql } from 'apollo-server-express';

export default gql`
	extend type Query {
		DownloadReport(reportId: String!): String
		GetAllReports(
			page: Int
			limit: Int
			sort: Int
			typeSort: typeSortReport
		): ReportPaginator! @auth

		GetDetailReport(reportId: String!): Report! @auth
		SearchReport(
			textSearch: String!
			page: Int
			limit: Int
			sort: Int
			typeSort: typeSortReport
		): ReportPaginator! @auth
	}

	extend type Mutation {
		helloReport: String
		DeleteReport(reportId: String!): MessageUpdateReport! @auth
		EditReport(reportId: String!, name: String!): MessageUpdateReport! @auth
	}

	type MessageUpdateReport {
		message: String!
		report: Report
	}

	type ReportPaginator {
		reports: [Report]!
		totalPages: Int!
		page: Int!
	}

	type Report {
		_id: ID
		userId: ID
		name: String
		nameUser: String
		gameMode: String
		gameStart: String
		createdAt: String
		players: [PlayerReport]!
		questions: [QuestionReport]!
		difficultQuestions: [QuestionReport]!
		needHelp: [PlayerReport]!
		playersDidNotFinish: [PlayerReport]!
	}

	type PlayerReport {
		_id: ID
		name: String
		rank: Int
		correctPercentAnswers: Float
		unAnswered: Int
		finalScore: Int
		detailAllQuestions: [DetailAllQuestions]
	}

	type DetailAllQuestions {
		_id: ID
		content: String
		type: Int
		correct: Boolean
		time: Float
		score: Int
	}

	type QuestionReport {
		_id: ID
		dataQuestion: DataQuestionReport
		percentRight: Float
		avgAnswersTime: Float
		detailAllPlayers: [DetailAllPlayers]
	}

	type DataQuestionReport {
		image: String
		video: String
		audio: String
		time: Int
		explanation: String
		doubleScore: Boolean
		haveScore: Boolean
		content: String
		type: Int
		answers: [AnswerReport]
		countPlayerNoAnswer: Int
		typeAnswers: [String]
	}

	type AnswerReport {
		_id: ID
		image: String
		isCorrect: Boolean
		votes: Float
		content: String
		countPlayerAnswer: Int
	}

	type DetailAllPlayers {
		_id: ID
		answered: [String]
		name: String
		correct: Boolean
		time: Float
		score: Int
	}

	enum typeSortReport {
		name
		createdAt
		playerLength
	}
`;
