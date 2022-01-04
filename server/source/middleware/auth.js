import { ApolloError } from 'apollo-server-express';
import { ACCESS_TOKEN_SECRET } from '../config/index.js';
import jwt from 'jsonwebtoken';
export const auth = (token) => {


	console.log('AAA', token)
	if (token === '') {
		throw new ApolloError('You must be login', '404');
	}

	token = token.split(' ')[1];
	if (!token || token === '') {
		throw new ApolloError('You must be login', '404');
	}

	let decodedToken;
	try {
		decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
	} catch (err) {
		throw new ApolloError('Error token', '401');
	}

	if (!decodedToken) {
		throw new ApolloError('You must be login', '404');
	}
	return decodedToken.id;
};
