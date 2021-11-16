import mongoose from 'mongoose';
import { DB } from './index.js';
const connectMongoDB = () => {
	mongoose
		.connect(DB, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true,
			//autoIndex: true,
		})
		.then(() => {
			console.log('Successfully connected to mongoDB');
		})
		.catch((err) => console.error('Connect error to mongoDB'));
};

export default connectMongoDB;
