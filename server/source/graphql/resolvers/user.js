import { ApolloError } from 'apollo-server-express';
import bcrypt from 'bcrypt';
import { signJwt } from '../../helper/signjwt.js';
import { sendMail } from '../../helper/sendmail.js';

export default {
	Query: {
		getInfo: async (parent, args, { idUser, User }, info) => {
			try {
				const infoUser = await User.findById(idUser).select('-password');
				return {
					id: infoUser._id,
					name: infoUser.name,
					avatar: infoUser.avatar,
					collection: infoUser.questionCollection,
					email: infoUser.email,
					createdAt: infoUser.createdAt,
					updatedAt: infoUser.updatedAt,
				};
			} catch (error) {
				throw new ApolloError(error.message, '500');
			}
		},
	},
	Mutation: {
		login: async (parent, { email, password }, { User }, info) => {
			try {
				let user = await User.findOne({ email });
				if (!user) throw new ApolloError('User does not exist', '404');

				if (!user.confirmed) {
					throw new ApolloError('Please active account', '403');
				}

				const isMatch = await bcrypt.compare(password, user.password);
				if (!isMatch) throw new ApolloError('User does not exist', '404');
				const token = signJwt(user._id);
				return {
					accessToken: token,
				};
			} catch (error) {
				throw new ApolloError(error.message, '500');
			}
		},
		register: async (parent, { user }, { User }, info) => {
			try {
				let { name, email, password } = user;

				let newUser = await User.findOne({
					email,
				});

				if (newUser) {
					throw new ApolloError('Email is already taken', '403');
				}
				const passwordHash = await bcrypt.hash(password, 10);
				newUser = new User({
					name,
					email,
					password: passwordHash,
				});

				await newUser.save();
				const token = signJwt(newUser._id);
				const url = `http://localhost:4000/api/user/confirm/${token}`;
				sendMail(email, url);

				return {
					message: 'Register success',
				};
			} catch (error) {
				throw new ApolloError(error.message, '500');
			}
		},
	},
};
