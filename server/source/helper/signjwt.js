import jwt from 'jsonwebtoken';

export const signJwt = (id) => {
	const accessToken = jwt.sign({ id }, '123', { expiresIn: '7d' });
	return accessToken;
};
