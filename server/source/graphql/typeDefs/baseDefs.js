import { gql } from 'apollo-server-express';

export default gql`
	directive @upper on FIELD_DEFINITION
	directive @auth on FIELD_DEFINITION

	type Query {
		_: String
	}

	type Mutation {
		_: String
	}
`;
