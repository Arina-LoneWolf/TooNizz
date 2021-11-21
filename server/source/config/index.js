import { config } from 'dotenv';

const { parsed } = config();

export const { PORT, NODE_ENV, DB, IN_PRO = NODE_ENV !== 'prod' } = parsed;
