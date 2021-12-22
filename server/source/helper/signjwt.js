import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '../config/index.js';

export const signJwt = (id) => {
	const accessToken = jwt.sign({ id }, ACCESS_TOKEN_SECRET, {
		expiresIn: '100d',
	});
	return accessToken;
};
