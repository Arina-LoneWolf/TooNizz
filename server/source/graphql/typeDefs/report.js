import { gql } from 'apollo-server-express';

export default gql`
	extend type Query {
		downloadReport(reportId: String!): String
	}

	extend type Mutation {
		helloReport: String
	}
`;
