import { ApolloServer, SchemaDirectiveVisitor } from 'apollo-server-express';
import { defaultFieldResolver } from 'graphql';
import { graphqlUploadExpress } from 'graphql-upload';
import express from 'express';
import consola from 'consola';
import {
	PORT,
	IN_PRO,
	CLIENT_URL,
	ACCESS_TOKEN_SECRET,
} from './source/config/index.js';

// import resolvers from './source/graphql/resolvers/index.js';
// import typeDefs from './source/graphql/typeDefs/index.js';

import { resolvers, typeDefs } from './source/graphql/index.js';

import connectMongoDB from './source/config/mongo.connect.js';
import * as appModels from './source/models/index.js';
import { schemaDirectives } from './source/graphql/directive/index.js';

import http from 'http';
import { Server } from 'socket.io';
import { classisModeAll } from './source/utils/classicMode/index.js';

import jwt from 'jsonwebtoken';

const players = [];
const games = [];

const server = new ApolloServer({
	typeDefs,
	resolvers,
	schemaDirectives,
	playground: IN_PRO,
	uploads: false,
	context: ({ req }) => {
		const token = req.headers.authorization || '';
		return {
			token,
			...appModels,
		};
	},
});
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
	cors: {
		// origin: 'http://localhost:3006',
	},
});
//viết socket
const classicMode = io.of('/classic');
const onConnectionClassicMode = (socket) => {
	console.log('co nguoi ket noi ', socket.id);
	console.log('so nguoi ket noi namespace classic ', classicMode.sockets.size);
	//console.log('so nguoi ket noi ', io.engine.clientsCount);
	classisModeAll(classicMode, socket, players, games);
};
classicMode.on('connection', onConnectionClassicMode);

app.use(express.json());
app.use(graphqlUploadExpress());
server.start();
server.applyMiddleware({ app });

app.use('/api/user/confirm/:id', async (req, res) => {
	try {
		const { User } = appModels;
		const token = req.params.id;
		const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
		await User.findByIdAndUpdate({ _id: decodedToken.id }, { confirmed: true });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
	return res.redirect(CLIENT_URL);
});

connectMongoDB();

httpServer.listen({ port: PORT }, () => {
	consola.success({
		badge: true,
		message: `Server ready at http://localhost:${PORT}${server.graphqlPath}`,
	});
});
