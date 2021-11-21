import { SchemaDirectiveVisitor } from 'apollo-server-express';
import { defaultFieldResolver } from 'graphql';
import { auth } from '../../middleware/auth.js';

export class AuthDirective extends SchemaDirectiveVisitor {
	visitFieldDefinition(field) {
		const { resolve = defaultFieldResolver } = field;
		field.resolve = async function (...args) {
			//console.log('ARG', args);
			let { token } = args[2];
			const idUser = auth(token);

			args[2].idUser = idUser;

			// args[2].infoUser = {
			// 	id: authUser._id,
			// 	name: authUser.name,
			// 	avatar: authUser.avatar,
			// 	collection: authUser.questionCollection,
			// 	email: authUser.email,
			// 	createdAt: authUser.createdAt,
			// 	updatedAt: authUser.updatedAt,
			// };
			const data = await resolve.apply(this, args);
			return data;
		};
	}
}
