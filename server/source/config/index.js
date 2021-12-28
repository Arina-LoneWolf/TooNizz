import { config } from 'dotenv';

const { parsed } = config();

export const {
	PORT,
	NODE_ENV,
	DB,
	USERNAME_GMAIL,
	PASS_GMAIL,
	ACCESS_TOKEN_SECRET,
	CLIENT_URL,
	CLOUD_NAME,
	CLOUD_KEY,
	CLOUD_SECRET,
	IN_PRO = NODE_ENV !== 'prod',
} = parsed;
