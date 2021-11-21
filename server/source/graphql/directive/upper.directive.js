import { ApolloError, SchemaDirectiveVisitor } from 'apollo-server-express';
import { defaultFieldResolver } from 'graphql';

export class UpperCaseDirective extends SchemaDirectiveVisitor {
	visitFieldDefinition(field) {
		//dung để gán resolve = defaultFieldResolver khi resolve ko dc định nghĩa
		const { resolve = defaultFieldResolver } = field;
		//console.log('FIELD', field);
		field.resolve = async function (...args) {
			console.log('ARG', args);
			const result = await resolve.apply(this, args);
			//console.log('result', result);
			if (typeof result === 'string') {
				return result.toUpperCase();
			}
			return result;
		};
	}
}
