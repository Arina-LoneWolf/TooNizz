import _ from 'lodash';
import { Question } from '../../models/index.js';

export const classisModeAll = (io, socket, players, games) => {
	socket.on('disconnect', () => {
		console.log(socket.id + 'da thoat');

		let checkGamePin = games.filter(
			(game) => game.gamePin === socket.gamePin,
		)[0];
		if (checkGamePin) {
			console.log('là host');
			//cập nhâp lại mảng game
			games = games.filter((game) => game.gamePin !== socket.gamePin);

			//cập nhập lại danh sách player
			players = players.filter((player) => player.gamePin !== socket.gamePin);

			//nhắn cho từng ng trong phòng là host đã out
			io.to(socket.gamePin).emit('classic:host-disconnected');

			//kick tất cả socket(client) ra khỏi room
			io.socketsLeave(socket.gamePin);

			socket.gamePin = null;
		} else {
			console.log('có thể là player');
			let player = players.filter((player) => player.id === socket.id)[0];
			if (player) {
				console.log('chắc chắn là player đã vào phòng');
				//cập nhập lại ds player
				players = players.filter((player) => player.id !== socket.id);

				//kích player đã disconnect ra khỏi phòng
				io.in(socket.id).socketsLeave(socket.infoRoom.gamePin);
				socket.infoRoom = null;
			}
		}
	});

	socket.on('classic:disconnect', (data) => {
		let checkGamePin = games.filter(
			(game) => game.gamePin === socket.gamePin,
		)[0];
		if (checkGamePin) {
			console.log('là host');
			//cập nhâp lại mảng game
			games = games.filter((game) => game.gamePin !== socket.gamePin);

			//cập nhập lại danh sách player
			players = players.filter((player) => player.gamePin !== socket.gamePin);

			//nhắn cho từng ng trong phòng là host đã out
			io.to(socket.gamePin).emit('classic:host-disconnected');

			//kick tất cả socket(client) ra khỏi room
			io.socketsLeave(socket.gamePin);

			socket.gamePin = null;
		} else {
			console.log('có thể là player');
			let player = players.filter((player) => player.id === socket.id)[0];
			if (player) {
				console.log('chắc chắn là player đã vào phòng');
				//cập nhập lại ds player
				players = players.filter((player) => player.id !== socket.id);

				//kích player đã disconnect ra khỏi phòng
				io.in(socket.id).socketsLeave(socket.infoRoom.gamePin);
				socket.infoRoom = null;
			}
		}
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
		socket.emit('classic:sv-send-game-pin', gamePin); //trả gamePin //classic:sv-send-gamePin
		//thông tin câu hỏi
		socket.emit('classic:sv-send-info-list-questions', {
			//classic:sv-send-infoListQuestions
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
		let checkGamePin = false;
		if (games.length !== 0) {
			for (let i = 0; i < games.length; i++) {
				if (gamePin.toString() === games[i].gamePin) {
					checkGamePin = true;
					socket.infoRoom = {
						idHost: games[i].idHost,
						gamePin: gamePin.toString(),
					};
					socket.emit('classic:check-game-pin', 'PASS');
					//classic:check-gamePin
					break;
				}
			}
		}
		if (!checkGamePin) {
			socket.emit('classic:check-game-pin', 'gamePin wrong');
			//classic:check-gamePin
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
				io.to(idHost).emit('classic:update-list-players', playersInRoom);
				//classic:update-listPlayers
				//mọi thành viên trong room
				console.log(
					'danh sach phong thanh vien trong phong',
					io.in(socket.infoRoom?.gamePin).allSockets(),
				);
			}
		}
	});

	//host gửi lên khi câu hỏi bắt đầu tính thời gian
	socket.on('classic:countdown-start-host', () => {
		let infoGame = games.filter((game) => game.gamePin === socket.gamePin)[0];
		if (infoGame) {
			io.in(infoGame.gamePin).emit('classic:countdown-start-player');
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
			const indexQuestion = infoGame.gameData.currentQuestion;
			//dùng lodash để deep copy nested object
			let newListQuestion = _.cloneDeep(infoGame.listQuestions[indexQuestion]);

			//xóa trường isCorrect trong phần đáp án
			for (let j = 0; j < newListQuestion.answers.length; j++) {
				delete newListQuestion.answers[j].isCorrect;
			}

			// for (let j = 0; j < newListQuestion.answers.length; j++) {
			// 	delete newListQuestion.answers[j].isCorrect;
			// }

			socket.emit('classic:sv-send-info-list-questions', {
				lengthListQuestions: infoGame.listQuestions.length,
				currentQuestion: indexQuestion,
			});

			io.in(infoGame.gamePin).emit('classic:sv-send-question', newListQuestion);
		}
	});

	socket.on('classic:player-answer', (data) => {
		console.log(data);

		// data(câutrlời của ng chơi) ở đây chắc nên là object
		//{time:7,89,answers:['id123w12','id786','id321']}
		//{time:-1,answers:[]}
		// gồm id của câutrlời và time vói loại 1 , 2 ,3 ,5
		// với loại 4 là dạng [{string,time}] <string> là đáp án và time là thời gian
		let infoGame = games.filter(
			(game) => game.gamePin === socket.infoRoom?.gamePin,
		)[0];

		let indexQuestion = infoGame.gameData.currentQuestion;
		let currentQuestion = infoGame.listQuestions[/*3*/ indexQuestion]; //indexQuestion

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

		//người số người đã trả lời về cho host
		io.to(infoGame.idHost).emit(
			'classic:number-players-answered',
			infoGame.gameData.numberPlayerAnswered,
		);

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

		//trừ thời gian
		const timeScore = currentQuestion.time - data.time;

		if (data.time === -1 || timeScore <= 0) {
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
					(answer) => answer._id == data.answers[0],
				)[0];

				//nếu player trả lời đúng
				if (answer.isCorrect) {
					let score = currentQuestion.doubleScore
						? Math.ceil(timeScore * 100 * 2)
						: Math.ceil(timeScore * 100);
					currentQuestion.listPlayersAnswer.push({
						id: socket.id,
						indexQuestion,
						name: socket.infoRoom?.name,
						answer: answer.content,
						correct: true,
						time: data.time,
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
						time: data.time,
						score: 0,
					});
					//đếm số lượng ng chơi chọn câu này
					answer.countPlayerAnswer += 1;
				}
			} else if (currentQuestion.type === 2) {
				let listContentAnswers = [];
				//đếm số ng chơi chọn những câu này
				for (let i = 0; i < data.answers.length; i++) {
					currentQuestion.answers.filter((answer) => {
						if (answer._id == data.answers[i]) {
							answer.countPlayerAnswer += 1;
							listContentAnswers.push(answer.content);
						}
					});
				}

				//danh sách ID những đáp án đúng
				let listIdAnswers = [];
				for (let i = 0; i < currentQuestion.answers.length; i++) {
					if (currentQuestion.answers[i].isCorrect) {
						listIdAnswers.push(currentQuestion.answers[i]._id.toString());
					}
				}

				let checkAnswers = listIdAnswers.every((v) => data.answers.includes(v));
				if (checkAnswers) {
					console.log('ng choi trả lời đúng loại 2');
					//nếu player trả lời đúng
					let score = currentQuestion.doubleScore
						? Math.ceil(timeScore * 100 * 2)
						: Math.ceil(timeScore * 100);
					currentQuestion.listPlayersAnswer.push({
						id: socket.id,
						indexQuestion,
						name: socket.infoRoom?.name,
						answer: listContentAnswers, //answer.content,
						correct: true,
						time: data.time,
						score,
					});

					currentPlayer.totalScore += score;
				} else {
					console.log('ng choi trả lời sai loại 2');
					//nếu player trả lời sai
					currentQuestion.listPlayersAnswer.push({
						id: socket.id,
						indexQuestion,
						name: socket.infoRoom?.name,
						answer: listContentAnswers, //answer.content,
						correct: false,
						time: data.time,
						score: 0,
					});
				}
			} else if (currentQuestion.type === 4) {
				let checkAnswers = currentQuestion.typeAnswers.includes(
					data.answers[0],
				);

				if (checkAnswers) {
					console.log('ng choi trả lời đúng loại 4');
					//nếu player trả lời đúng
					let score = currentQuestion.doubleScore
						? Math.ceil(timeScore * 100 * 2)
						: Math.ceil(timeScore * 100);
					currentQuestion.listPlayersAnswer.push({
						id: socket.id,
						indexQuestion,
						name: socket.infoRoom?.name,
						answer: data.answers[0],
						correct: true,
						time: data.time,
						score,
					});

					currentPlayer.totalScore += score;
				} else {
					console.log('ng choi trả lời sai loại 4');
					//nếu player trả lời sai
					currentQuestion.listPlayersAnswer.push({
						id: socket.id,
						indexQuestion,
						name: socket.infoRoom?.name,
						answer: data.answers[0],
						correct: false,
						time: data.time,
						score: 0,
					});
				}
			} else if (currentQuestion.type === 5) {
			}

			//nếu mọi ng trả lời xong
			if (allPlayersInRoom.length === infoGame.gameData.numberPlayerAnswered) {
				for (let i = 0; i < currentQuestion.listPlayersAnswer.length; i++) {
					io.to(currentQuestion.listPlayersAnswer[i].id).emit(
						'classic:all-players-answered',
						currentQuestion.listPlayersAnswer[i].score,
					);
					//classic:allPlayers-answered
				}

				let sortScore = allPlayersInRoom.sort((a, b) =>
					a.totalScore < b.totalScore ? 1 : -1,
				);

				for (let i = 0; i < sortScore.length; i++) {
					let indexArr = i + 1;
					io.to(sortScore[i].id).emit('classic:totalscore-rank-player', {
						totalScore: sortScore[i].totalScore,
						rank: ordinalSuffixOf(indexArr),
					});
				}

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

				// là khi mọi ng trả lời xong hết thì sv sẽ gửi sk này
				// trả về đáp án đúng
				// số ng trả lời
				// rank điểm top 5
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

function ordinalSuffixOf(i) {
	let j = i % 10,
		k = i % 100;
	if (j == 1 && k != 11) {
		return i + 'st';
	}
	if (j == 2 && k != 12) {
		return i + 'nd';
	}
	if (j == 3 && k != 13) {
		return i + 'rd';
	}
	return i + 'th';
}
