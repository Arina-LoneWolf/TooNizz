import _ from 'lodash';
import { Question } from '../../models/index.js';

export const classisModeAll = (io, socket, players, games) => {
	socket.on('disconnect', () => {
		console.log(socket.id + 'da thoat');
	});

	socket.on('classic:host-join', async (questionSetId) => {
		let gamePin;
		while (true) {
			let sameGamePin = false;
			gamePin = Math.floor(Math.random() * 9000000) + 1000000;
			for (let i = 0; i < games.length; i++) {
				if (gamePin.toString() === games[i].gamePin) {
					sameGamePin = true;
					break;
				}
			}
			if (!sameGamePin) break;
		}
		let listQuestions = await Question.find({
			questionSetId: questionSetId,
		}).lean();

		gamePin = gamePin.toString();
		socket.gamePin = gamePin;
		games.push({
			live: false,
			mode: 'classic',
			gamePin,
			idHost: socket.id,
			listQuestions,
			gameData: {
				questionSetId,
				currentQuestion: 0,
				numberPlayerAnswered: 0,
				countAnswer: [],
			},
		});
		socket.join(gamePin); //vào phòng
		socket.emit('classic:sv-send-gamePin', gamePin); //trả gamePin
		//thông tin câu hỏi
		socket.emit('classic:sv-send-infoListQuestions', {
			lengthListQuestions: listQuestions.length,
			currentQuestion: 0,
		});

		//mọi thành viên trong room
		// console.log(
		// 	'danh sach phong thanh vien trong phong',
		// 	io.in(gamePin).allSockets(),
		// );
	});

	socket.on('classic:player-join', (gamePin) => {
		console.log('gamePin', gamePin);
		let checkGamePin = false;
		if (games.length !== 0) {
			for (let i = 0; i < games.length; i++) {
				if (gamePin.toString() === games[i].gamePin) {
					checkGamePin = true;
					socket.infoRoom = {
						idHost: games[i].idHost,
						gamePin: gamePin.toString(),
					};
					socket.emit('classic:check-gamePin', 'PASS');
					break;
				}
			}
		}
		if (!checkGamePin) {
			console.log('vao loi gamePin 1')
			socket.emit('classic:check-gamePin', 'gamePin wrong');
			console.log('vao loi gamePin 2')
		}
	});

	socket.on('classic:player-input-name', (playerName) => {
		//lọc tất cả những user cùng phòng với socket này
		let playersInRoom = players.filter(
			(player) => player.gamePin === socket.infoRoom.gamePin,
		);

		let checkPlayerName = playersInRoom.filter(
			(player) => player.name === playerName,
		)[0];

		if (checkPlayerName) {
			socket.emit('classic:namesake', playerName);
		} else {
			console.log('vào phòng');
			if (socket.infoRoom !== null) {
				let idHost = socket.infoRoom?.idHost;
				socket.infoRoom.name = playerName;
				players.push({
					id: socket.id,
					name: playerName,
					idHost,
					gamePin: socket.infoRoom?.gamePin,
					totalScore: 0,
					gameData: [],
				});

				playersInRoom = players.filter(
					(player) => player.gamePin === socket.infoRoom?.gamePin,
				);
				//console.log('ds trong phòng', playersInRoom);
				//vào phòng
				socket.join(socket.infoRoom?.gamePin);
				//hiện trang xem tên đã có chưa
				socket.emit('classic:entered-the-room', '1');
				//gửi thông tin của ng chơi về cho host
				io.to(idHost).emit('classic:update-listPlayers', playersInRoom);
				//mọi thành viên trong room
				console.log(
					'danh sach phong thanh vien trong phong',
					io.in(socket.infoRoom?.gamePin).allSockets(),
				);
			}
		}
	});

	socket.on('classic:host-start-game', (data) => {
		let infoGame = games.filter((game) => game.gamePin === socket.gamePin)[0];
		//console.log(infoGame);
		if (infoGame) {
			infoGame.live = true;

			io.in(infoGame.gamePin).emit('classic:player-start-game');
			//lấy ra 1 câu hỏi
			//dùng lodash để deep copy nested object
			let newListQuestion = _.cloneDeep(infoGame.listQuestions[0]); //{ ...infoGame }; //.listQuestions[0] };

			//xóa trường isCorrect trong phần đáp án
			for (let j = 0; j < newListQuestion.answers.length; j++) {
				delete newListQuestion.answers[j].isCorrect;
			}

			io.in(infoGame.gamePin).emit('classic:sv-send-question', newListQuestion);
			// if (infoGame.gameData.currentQuestion + 1 < infoGame.listQuestions.length)
			// 	infoGame.gameData.currentQuestion += 1;
			//console.log(newListQuestion);
		}
	});

	socket.on('classic:host-next-question', (data) => {
		let infoGame = games.filter((game) => game.gamePin === socket.gamePin)[0];
		if (infoGame.gameData.currentQuestion + 1 < infoGame.listQuestions.length) {
			infoGame.gameData.currentQuestion += 1;
			let newListQuestion = {
				...infoGame.listQuestions[infoGame.gameData.currentQuestion],
			};
			for (let j = 0; j < newListQuestion.answers.length; j++) {
				delete newListQuestion.answers[j].isCorrect;
			}

			io.in(infoGame.gamePin).emit('classic:sv-send-question', newListQuestion);
		}
	});

	socket.on('classic:player-answer', (data) => {
		// data(câutrlời của ng chơi) ở đây chắc nên là array object
		// gồm id của câutrlời và time vói loại 1 , 2 ,3 ,5
		// với loại 4 là dạng [{string,time}] <string> là đáp án và time là thời gian
		let infoGame = games.filter(
			(game) => game.gamePin === socket.infoRoom?.gamePin,
		)[0];

		let indexQuestion = infoGame.gameData.currentQuestion;
		let currentQuestion = infoGame.listQuestions[indexQuestion];

		//danh sách toàn bộ ng chơi
		let allPlayersInRoom = players.filter(
			(player) => player.gamePin === socket.infoRoom?.gamePin,
		);
		//ng chơi hiện tại
		let currentPlayer = allPlayersInRoom.filter(
			(player) => player.id === socket.id,
		)[0];

		// console.log('all-player', allPlayersInRoom);
		// console.log('current-player', currentPlayer);

		// cộng số player đã trả lời câu hỏi này
		infoGame.gameData.numberPlayerAnswered += 1;

		//nếu câu hỏi này chưa có mảng listPlayersAnswer
		//dùng để lưu toàn bộ kq của player trong câu hỏi này
		if (typeof currentQuestion.listPlayersAnswer === 'undefined') {
			currentQuestion.listPlayersAnswer = [];
			currentQuestion.countPlayerNoAnswer = 0;
			for (let i = 0; i < currentQuestion.answers.length; i++) {
				// console.log('answer', currentQuestion.answers[i].countPlayerAnswer);
				if (
					typeof currentQuestion.answers[i].countPlayerAnswer === 'undefined'
				) {
					currentQuestion.answers[i].countPlayerAnswer = 0;
				}
			}
		}

		if (data.length === 0) {
			//những ng ko trả lời
			currentQuestion.listPlayersAnswer.push({
				id: socket.id,
				indexQuestion,
				name: socket.infoRoom?.name,
				answer: 'No answer',
				correct: false,
				time: -1,
				score: 0,
			});

			//đếm có bao nhiêu ng chơi đã KHÔNG trả lời câu này
			currentQuestion.countPlayerNoAnswer += 1;
		} else {
			if (currentQuestion.type === 1 || currentQuestion.type === 3) {
				//những ng có trả lời
				//console.log('data', data[0].id);

				let answer = currentQuestion.answers.filter(
					(answer) => answer._id == data[0].id,
				)[0];

				//nếu player trả lời đúng
				if (answer.isCorrect) {
					let score = currentQuestion.doubleScore
						? Math.ceil(data[0].time * 100 * 2)
						: Math.ceil(data[0].time * 100);
					currentQuestion.listPlayersAnswer.push({
						id: socket.id,
						indexQuestion,
						name: socket.infoRoom?.name,
						answer: answer.content,
						correct: true,
						time: data[0].time,
						score,
					});

					currentPlayer.totalScore += score;

					//đếm số lượng ng chơi chọn câu này
					answer.countPlayerAnswer += 1;
				} else {
					//nếu player trả lời sai
					currentQuestion.listPlayersAnswer.push({
						id: socket.id,
						indexQuestion,
						name: socket.infoRoom?.name,
						answer: answer.content,
						correct: false,
						time: data[0].time,
						score: 0,
					});
					//đếm số lượng ng chơi chọn câu này
					answer.countPlayerAnswer += 1;
				}
			} else if (currentQuestion.type === 2) {
			} else if (currentQuestion.type === 4) {
			} else if (currentQuestion.type === 5) {
			}

			//nếu mọi ng trả lời xong
			if (allPlayersInRoom.length === infoGame.gameData.numberPlayerAnswered) {
				for (let i = 0; i < currentQuestion.listPlayersAnswer.length; i++) {
					io.to(currentQuestion.listPlayersAnswer[i].id).emit(
						'classic:allPlayers-answered',
						currentQuestion.listPlayersAnswer[i].score,
					);
				}

				let sortScore = allPlayersInRoom.sort((a, b) =>
					a.score < b.score ? 1 : -1,
				);
				if (sortScore.length < 5) {
					sortScore = sortScore.slice(0, sortScore.length);
				} else {
					sortScore = sortScore.slice(0, 5);
				}
				sortScore = sortScore.map((player) => {
					return { name: player.name, score: player.totalScore };
				});

				let dataPlayersAnswered = [];
				let correctAnswer = [];
				//if (currentQuestion.type === 1 || currentQuestion.type === 3) {
				for (let i = 0; i < currentQuestion.answers.length; i++) {
					if (currentQuestion.answers[i].isCorrect) {
						correctAnswer.push(currentQuestion.answers[i]);
					}
					dataPlayersAnswered.push(currentQuestion.answers[i]);
				}
				//}

				io.to(infoGame.idHost).emit('classic:time-up', {
					correctAnswer,
					countAnswer: dataPlayersAnswered,
					playerRank: sortScore,
				});
				console.log('countAnswer', dataPlayersAnswered);
			} else {
			}
			console.log('số ng đa trả lời', infoGame.gameData.numberPlayerAnswered);
		}
	});
};
