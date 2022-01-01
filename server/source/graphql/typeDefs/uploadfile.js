import { gql } from 'apollo-server-express';

export default gql`
	scalar Upload

	extend type Query {
		greetings: String
	}

	extend type Mutation {
		uploadFileExcel(file: Upload!, questionSetId: String!): Message
		uploadImage(file: Upload!): Message
	}
`;
