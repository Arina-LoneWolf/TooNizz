import _ from 'lodash';
import { Question, questionSet, Report } from '../../models/index.js';

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

	socket.on('classic:host-join', async ({ questionSetId, userHostId }) => {

		console.log('ID CUA HOST', userHostId)
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

		const nameQuestionSet = await questionSet
			.findById({ _id: questionSetId })
			.select({ name: 1 });

		console.log(questionSetId);

		gamePin = gamePin.toString();
		socket.gamePin = gamePin;
		games.push({
			questionSetId,
			userHostId: userHostId ? userHostId : '',//'61c1f9548190d91c9867bf65',
			live: false,
			name: nameQuestionSet.name,
			mode: 'Classic',
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

	socket.on('classic:host-start-game', async (data) => {
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

			await questionSet.findByIdAndUpdate(
				{
					_id: infoGame.questionSetId,
				},
				{
					$inc: {
						played: 1,
					},
				},
			);

			let timeNow = new Date();
			let timeAddGMT = new Date(
				timeNow.getTime() + -timeNow.getTimezoneOffset() * 60000,
			);
			infoGame.gameStart = timeAddGMT;

			// if (infoGame.gameData.currentQuestion + 1 < infoGame.listQuestions.length)
			// 	infoGame.gameData.currentQuestion += 1;
			//console.log(newListQuestion);
		}
	});

	socket.on('classic:host-next-question', (data) => {
		let infoGame = games.filter((game) => game.gamePin === socket.gamePin)[0];
		let allPlayersInRoom = players.filter(
			(player) => player.gamePin === socket.gamePin,
		);
		let indexQuestion = infoGame.gameData.currentQuestion;
		if (infoGame.gameData.currentQuestion + 1 < infoGame.listQuestions.length) {
			infoGame.gameData.currentQuestion += 1;
			/*const*/ indexQuestion = infoGame.gameData.currentQuestion;
			//dùng lodash để deep copy nested object
			let newListQuestion = _.cloneDeep(infoGame.listQuestions[indexQuestion]);

			//xóa trường isCorrect trong phần đáp án
			for (let j = 0; j < newListQuestion.answers.length; j++) {
				delete newListQuestion.answers[j].isCorrect;
			}

			// for (let j = 0; j < newListQuestion.answers.length; j++) {
			// 	delete newListQuestion.answers[j].isCorrect;
			// }

			console.log('indexQ', indexQuestion)
			infoGame.gameData.numberPlayerAnswered = 0;


			socket.emit('classic:sv-send-info-list-questions', {
				lengthListQuestions: infoGame.listQuestions.length,
				currentQuestion: indexQuestion,
			});

			io.in(infoGame.gamePin).emit('classic:sv-send-question', newListQuestion);
		} else {
			console.log("vao tra report")
			if (indexQuestion === infoGame.listQuestions.length - 1) {
				const allQuestions = infoGame.listQuestions;

				let namePlayersArr = [];
				let nameQuestionsArr = [];
				let playersNeedHelp = [];
				let difficultQuestions = [];
				let playersDidNotFinish = [];

				//currentQuestion.listPlayersAnswer;
				let sortScore = allPlayersInRoom.sort((a, b) =>
					a.totalScore < b.totalScore ? 1 : -1,
				);

				//cho ng chơi
				for (let i = 0; i < sortScore.length; i++) {
					let countNoAnswered = 0;
					let countCorrectAnswered = 0;
					let detailAllQuestions = [];

					for (let j = 0; j < allQuestions.length; j++) {
						//cho ng chơi
						for (let z = 0; z < allQuestions[j].listPlayersAnswer.length; z++) {
							if (sortScore[i].id === allQuestions[j].listPlayersAnswer[z].id) {
								detailAllQuestions.push({
									content: allQuestions[j].content,
									type: allQuestions[j].type,
									answered: allQuestions[j].listPlayersAnswer[z].answer,
									correct: allQuestions[j].listPlayersAnswer[z].correct,
									time: allQuestions[j].listPlayersAnswer[z].time.toFixed(2),
									score: allQuestions[j].listPlayersAnswer[z].score,
								});

								if (allQuestions[j].listPlayersAnswer[z].time === -1) {
									countNoAnswered++;
								}

								if (allQuestions[j].listPlayersAnswer[z].correct) {
									countCorrectAnswered++;
								}
							}
						}
					}

					//tỉ lệ đúng của player
					let correctPercentAnswers = 0;
					if (allQuestions.length !== 0) {
						correctPercentAnswers = Math.round(
							(countCorrectAnswered / allQuestions.length) * 100,
						);
					}

					namePlayersArr.push({
						name: sortScore[i].name,
						rank: i + 1,
						correctPercentAnswers: correctPercentAnswers,
						unAnswered: countNoAnswered,
						finalScore: sortScore[i].totalScore,
						detailAllQuestions: detailAllQuestions,
					});

					if (countNoAnswered > allQuestions.length / 2) {
						playersDidNotFinish.push({
							name: sortScore[i].name,
							rank: i + 1,
							correctPercentAnswers: correctPercentAnswers,
							unAnswered: countNoAnswered,
							finalScore: sortScore[i].totalScore,
							detailAllQuestions: detailAllQuestions,
						});
					}

					if (correctPercentAnswers < 30) {
						playersNeedHelp.push({
							name: sortScore[i].name,
							rank: i + 1,
							correctPercentAnswers: correctPercentAnswers,
							unAnswered: countNoAnswered,
							finalScore: sortScore[i].totalScore,
							detailAllQuestions: detailAllQuestions,
						});
					}
				}

				//cho câu hỏi
				for (let j = 0; j < allQuestions.length; j++) {
					let countCorrectForQuestion = 0;
					let countWrongForQuestion = 0;
					let avgAnswersTime = 0;
					let detailAllPlayers = [];

					//cho câu hỏi
					for (let k = 0; k < allQuestions[j].answers.length; k++) {
						// đếm những ng trả lời đúng cho 1 câu
						if (allQuestions[j].answers[k].isCorrect) {
							countCorrectForQuestion +=
								allQuestions[j].answers[k].countPlayerAnswer;
						} else {
							// đếm những ng trả lời sai cho 1 câu
							countWrongForQuestion +=
								allQuestions[j].answers[k].countPlayerAnswer;
						}
					}
					//tỉ lệ đúng của câu hỏi
					countWrongForQuestion += allQuestions[j].countPlayerNoAnswer;
					let percentRight = 0;
					if (countCorrectForQuestion + countWrongForQuestion !== 0) {
						percentRight = Math.round(
							(countCorrectForQuestion /
								(countCorrectForQuestion + countWrongForQuestion)) *
							100,
						);
					}

					for (let z = 0; z < allQuestions[j].listPlayersAnswer.length; z++) {
						//tính thời gian trlời tb cho 1 câu hỏi (B1)
						if (allQuestions[j].listPlayersAnswer[z].time !== -1) {
							avgAnswersTime += allQuestions[j].listPlayersAnswer[z].time;
						}

						/*if ((allQuestions[j].type === 1) | (allQuestions[j].type === 3))*/
						detailAllPlayers.push({
							name: allQuestions[j].listPlayersAnswer[z].name,
							answered: allQuestions[j].listPlayersAnswer[z].answer,
							correct: allQuestions[j].listPlayersAnswer[z].correct,
							time: allQuestions[j].listPlayersAnswer[z].time,
							score: allQuestions[j].listPlayersAnswer[z].score,
						});
					}

					//tính thời gian trlời tb cho 1 câu hỏi (B2)
					if (allQuestions[j].listPlayersAnswer.length !== 0) {
						avgAnswersTime = (
							avgAnswersTime / allQuestions[j].listPlayersAnswer.length
						).toFixed(2);
					}

					let cloneNewQuestion = _.cloneDeep(allQuestions[j]);
					delete cloneNewQuestion.listPlayersAnswer;

					if (cloneNewQuestion.type === 4) {
						cloneNewQuestion.typeAnswers = cloneNewQuestion.countTypeAnswers;
						delete cloneNewQuestion.countTypeAnswers;
					} else {
						delete cloneNewQuestion.typeAnswers;
					}

					nameQuestionsArr.push({
						dataQuestion: cloneNewQuestion,
						percentRight,
						avgAnswersTime,
						// này thống kê ra đươc ko lưu (detailAllPlayers.length-countPlayerNoAnswer)
						// playersAnswered:
						// 	allQuestions[j].listPlayersAnswer.length -
						// 	allQuestions[j].countPlayerNoAnswer,

						// này thống kê ra đươc ko lưu  (detailAllPlayers.length)
						//allPlayers: allQuestions[j].listPlayersAnswer.length,
						detailAllPlayers: detailAllPlayers,
					});

					if (percentRight < 30) {
						difficultQuestions.push({
							dataQuestion: cloneNewQuestion,
							percentRight,
							avgAnswersTime,
							playersAnswered:
								allQuestions[j].listPlayersAnswer.length -
								allQuestions[j].countPlayerNoAnswer,
							//allPlayers: allQuestions[j].listPlayersAnswer.length,
							detailAllPlayers: detailAllPlayers,
						});
					}
				}

				//console.log(namePlayersArr);

				const dataReport = {
					userId: infoGame.userHostId ? infoGame.userHostId : '',
					name: infoGame.name,
					gameMode: infoGame.mode,
					players: namePlayersArr,
					questions: nameQuestionsArr,
					// numberPlayers: allPlayersInRoom.length, // này thống kê ra đươc ko lưu
					// numberQuestions: allQuestions.length, // này thống kê ra đươc ko lưu
					// playersNeedHelp, // này thống kê ra đươc ko lưu
					// playersDidNotFinish, // này thống kê ra đươc ko lưu
					// difficultQuestions, // này thống kê ra đươc ko lưu
				};
				if (infoGame.userHostId !== '') {
					dataReport.gameStart = infoGame.gameStart;
					Report.create(dataReport, (error, data) => {
						if (error) {
							console.log(error);
							return;
						}
					});
				}
				io.in(infoGame.gamePin).emit('classic:sv-send-report', dataReport);
				console.log(dataReport);
			}

		}
	});

	socket.on('classic:player-answer', (data) => {
		console.log(data);

		//{time:7,89,answers:['id123w12','id786','id321']}
		//{time:-1,answers:[]}

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
				answer: ['No answer'],
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
						answer: [answer.content],
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
						answer: [answer.content],
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

				if (currentQuestion.countTypeAnswers === 'undefined') {
					let countTypeAnswers = currentQuestion.typeAnswers.map((str) => {
						return {
							value: str,
							countPlayerAnswer: 0,
						};
					});
					currentQuestion.countTypeAnswers = countTypeAnswers;
				}

				for (let i = 0; i < currentQuestion.countTypeAnswers.length; i++) {
					if (currentQuestion.countTypeAnswers[i].value === data.answers[0]) {
						currentQuestion.countTypeAnswers[i].countPlayerAnswer += 1;
					}
				}

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
						answer: data.answers,
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
						answer: data.answers,
						correct: false,
						time: data.time,
						score: 0,
					});
				}
			} else if (currentQuestion.type === 5) {
				console.log('ng choi trả lời loại 5');
				let answer = currentQuestion.answers.filter(
					(answer) => answer._id == data.answers[0],
				)[0];

				currentQuestion.listPlayersAnswer.push({
					id: socket.id,
					indexQuestion,
					name: socket.infoRoom?.name,
					answer: [answer.content],
					correct: true,
					time: data.time,
					score: 0,
				});

				//đếm số lượng ng chơi chọn câu này
				answer.countPlayerAnswer += 1;
			}
		}

		//nếu mọi ng trả lời xong
		if (allPlayersInRoom.length === infoGame.gameData.numberPlayerAnswered) {
			// for (let i = 0; i < currentQuestion.listPlayersAnswer.length; i++) {
			// 	io.to(currentQuestion.listPlayersAnswer[i].id).emit(
			// 		'classic:all-players-answered',
			// 		currentQuestion.listPlayersAnswer[i].score,
			// 	);
			// }

			let sortScore = allPlayersInRoom.sort((a, b) =>
				a.totalScore < b.totalScore ? 1 : -1,
			);

			for (let i = 0; i < sortScore.length; i++) {
				let score = 0;
				for (let j = 0; j < currentQuestion.listPlayersAnswer.length; j++) {
					if (currentQuestion.listPlayersAnswer[j].id === sortScore[i].id) {
						score = currentQuestion.listPlayersAnswer[j].score;
					}
				}
				//let indexArr = i + 1;
				io.to(sortScore[i].id).emit('classic:all-players-answered', {
					score,
					totalScore: sortScore[i].totalScore,
					rank: ordinalSuffixOf(i + 1),
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

			let percentAnsweredArr = [];
			//if (currentQuestion.type === 1 || currentQuestion.type === 3) {
			for (let i = 0; i < currentQuestion.answers.length; i++) {
				if (currentQuestion.answers[i].isCorrect) {
					correctAnswer.push(currentQuestion.answers[i]);
				}

				percentAnsweredArr.push(currentQuestion.answers[i].countPlayerAnswer);
				dataPlayersAnswered.push(currentQuestion.answers[i]);
			}


			let maxPercentAnswered = Math.max(...percentAnsweredArr);
			let cloneCurrentQuestion = _.cloneDeep(currentQuestion);

			for (let i = 0; i < cloneCurrentQuestion.answers.length; i++) {
				let percentAnswered = (
					cloneCurrentQuestion.answers[i].countPlayerAnswer / maxPercentAnswered
				) * 100;
				cloneCurrentQuestion.answers[i].percentAnswered = percentAnswered;
			}
			//}

			// là khi mọi ng trả lời xong hết thì sv sẽ gửi sk này
			// trả về đáp án đúng
			// số ng trả lời
			// rank điểm top 5
			io.to(infoGame.idHost).emit('classic:time-up', {
				correctAnswer,
				countAnswer: cloneCurrentQuestion,//dataPlayersAnswered,
				playerRank: sortScore,
			});
			console.log('countAnswer', dataPlayersAnswered);

			//nếu là câu hỏi cuối cùng
			// if (indexQuestion === infoGame.listQuestions.length - 1) {
			// 	const allQuestions = infoGame.listQuestions;

			// 	let namePlayersArr = [];
			// 	let nameQuestionsArr = [];
			// 	let playersNeedHelp = [];
			// 	let difficultQuestions = [];
			// 	let playersDidNotFinish = [];

			// 	//currentQuestion.listPlayersAnswer;
			// 	let sortScore = allPlayersInRoom.sort((a, b) =>
			// 		a.totalScore < b.totalScore ? 1 : -1,
			// 	);

			// 	//cho ng chơi
			// 	for (let i = 0; i < sortScore.length; i++) {
			// 		let countNoAnswered = 0;
			// 		let countCorrectAnswered = 0;
			// 		let detailAllQuestions = [];

			// 		for (let j = 0; j < allQuestions.length; j++) {
			// 			//cho ng chơi
			// 			for (let z = 0; z < allQuestions[j].listPlayersAnswer.length; z++) {
			// 				if (sortScore[i].id === allQuestions[j].listPlayersAnswer[z].id) {
			// 					detailAllQuestions.push({
			// 						content: allQuestions[j].content,
			// 						type: allQuestions[j].type,
			// 						answered: allQuestions[j].listPlayersAnswer[z].answer,
			// 						correct: allQuestions[j].listPlayersAnswer[z].correct,
			// 						time: allQuestions[j].listPlayersAnswer[z].time.toFixed(2),
			// 						score: allQuestions[j].listPlayersAnswer[z].score,
			// 					});

			// 					if (allQuestions[j].listPlayersAnswer[z].time === -1) {
			// 						countNoAnswered++;
			// 					}

			// 					if (allQuestions[j].listPlayersAnswer[z].correct) {
			// 						countCorrectAnswered++;
			// 					}
			// 				}
			// 			}
			// 		}

			// 		//tỉ lệ đúng của player
			// 		let correctPercentAnswers = 0;
			// 		if (allQuestions.length !== 0) {
			// 			correctPercentAnswers = Math.round(
			// 				(countCorrectAnswered / allQuestions.length) * 100,
			// 			);
			// 		}

			// 		namePlayersArr.push({
			// 			name: sortScore[i].name,
			// 			rank: i + 1,
			// 			correctPercentAnswers: correctPercentAnswers,
			// 			unAnswered: countNoAnswered,
			// 			finalScore: sortScore[i].totalScore,
			// 			detailAllQuestions: detailAllQuestions,
			// 		});

			// 		if (countNoAnswered > allQuestions.length / 2) {
			// 			playersDidNotFinish.push({
			// 				name: sortScore[i].name,
			// 				rank: i + 1,
			// 				correctPercentAnswers: correctPercentAnswers,
			// 				unAnswered: countNoAnswered,
			// 				finalScore: sortScore[i].totalScore,
			// 				detailAllQuestions: detailAllQuestions,
			// 			});
			// 		}

			// 		if (correctPercentAnswers < 30) {
			// 			playersNeedHelp.push({
			// 				name: sortScore[i].name,
			// 				rank: i + 1,
			// 				correctPercentAnswers: correctPercentAnswers,
			// 				unAnswered: countNoAnswered,
			// 				finalScore: sortScore[i].totalScore,
			// 				detailAllQuestions: detailAllQuestions,
			// 			});
			// 		}
			// 	}

			// 	//cho câu hỏi
			// 	for (let j = 0; j < allQuestions.length; j++) {
			// 		let countCorrectForQuestion = 0;
			// 		let countWrongForQuestion = 0;
			// 		let avgAnswersTime = 0;
			// 		let detailAllPlayers = [];

			// 		//cho câu hỏi
			// 		for (let k = 0; k < allQuestions[j].answers.length; k++) {
			// 			// đếm những ng trả lời đúng cho 1 câu
			// 			if (allQuestions[j].answers[k].isCorrect) {
			// 				countCorrectForQuestion +=
			// 					allQuestions[j].answers[k].countPlayerAnswer;
			// 			} else {
			// 				// đếm những ng trả lời sai cho 1 câu
			// 				countWrongForQuestion +=
			// 					allQuestions[j].answers[k].countPlayerAnswer;
			// 			}
			// 		}
			// 		//tỉ lệ đúng của câu hỏi
			// 		countWrongForQuestion += allQuestions[j].countPlayerNoAnswer;
			// 		let percentRight = 0;
			// 		if (countCorrectForQuestion + countWrongForQuestion !== 0) {
			// 			percentRight = Math.round(
			// 				(countCorrectForQuestion /
			// 					(countCorrectForQuestion + countWrongForQuestion)) *
			// 				100,
			// 			);
			// 		}

			// 		for (let z = 0; z < allQuestions[j].listPlayersAnswer.length; z++) {
			// 			//tính thời gian trlời tb cho 1 câu hỏi (B1)
			// 			if (allQuestions[j].listPlayersAnswer[z].time !== -1) {
			// 				avgAnswersTime += allQuestions[j].listPlayersAnswer[z].time;
			// 			}

			// 			/*if ((allQuestions[j].type === 1) | (allQuestions[j].type === 3))*/
			// 			detailAllPlayers.push({
			// 				name: allQuestions[j].listPlayersAnswer[z].name,
			// 				answered: allQuestions[j].listPlayersAnswer[z].answer,
			// 				correct: allQuestions[j].listPlayersAnswer[z].correct,
			// 				time: allQuestions[j].listPlayersAnswer[z].time,
			// 				score: allQuestions[j].listPlayersAnswer[z].score,
			// 			});
			// 		}

			// 		//tính thời gian trlời tb cho 1 câu hỏi (B2)
			// 		if (allQuestions[j].listPlayersAnswer.length !== 0) {
			// 			avgAnswersTime = (
			// 				avgAnswersTime / allQuestions[j].listPlayersAnswer.length
			// 			).toFixed(2);
			// 		}

			// 		let cloneNewQuestion = _.cloneDeep(allQuestions[j]);
			// 		delete cloneNewQuestion.listPlayersAnswer;

			// 		if (cloneNewQuestion.type === 4) {
			// 			cloneNewQuestion.typeAnswers = cloneNewQuestion.countTypeAnswers;
			// 			delete cloneNewQuestion.countTypeAnswers;
			// 		} else {
			// 			delete cloneNewQuestion.typeAnswers;
			// 		}

			// 		nameQuestionsArr.push({
			// 			dataQuestion: cloneNewQuestion,
			// 			percentRight,
			// 			avgAnswersTime,
			// 			// này thống kê ra đươc ko lưu (detailAllPlayers.length-countPlayerNoAnswer)
			// 			// playersAnswered:
			// 			// 	allQuestions[j].listPlayersAnswer.length -
			// 			// 	allQuestions[j].countPlayerNoAnswer,

			// 			// này thống kê ra đươc ko lưu  (detailAllPlayers.length)
			// 			//allPlayers: allQuestions[j].listPlayersAnswer.length,
			// 			detailAllPlayers: detailAllPlayers,
			// 		});

			// 		if (percentRight < 30) {
			// 			difficultQuestions.push({
			// 				dataQuestion: cloneNewQuestion,
			// 				percentRight,
			// 				avgAnswersTime,
			// 				playersAnswered:
			// 					allQuestions[j].listPlayersAnswer.length -
			// 					allQuestions[j].countPlayerNoAnswer,
			// 				//allPlayers: allQuestions[j].listPlayersAnswer.length,
			// 				detailAllPlayers: detailAllPlayers,
			// 			});
			// 		}
			// 	}

			// 	//console.log(namePlayersArr);

			// 	const dataReport = {
			// 		userId: infoGame.userHostId ? infoGame.userHostId : '',
			// 		name: infoGame.name,
			// 		gameMode: infoGame.mode,
			// 		players: namePlayersArr,
			// 		questions: nameQuestionsArr,
			// 		// numberPlayers: allPlayersInRoom.length, // này thống kê ra đươc ko lưu
			// 		// numberQuestions: allQuestions.length, // này thống kê ra đươc ko lưu
			// 		// playersNeedHelp, // này thống kê ra đươc ko lưu
			// 		// playersDidNotFinish, // này thống kê ra đươc ko lưu
			// 		// difficultQuestions, // này thống kê ra đươc ko lưu
			// 	};
			// 	if (infoGame.userHostId !== '') {
			// 		dataReport.gameStart = infoGame.gameStart;
			// 		Report.create(dataReport, (error, data) => {
			// 			if (error) {
			// 				console.log(error);
			// 				return;
			// 			}
			// 		});
			// 	}
			// 	io.in(infoGame.gamePin).emit('classic:sv-send-report', dataReport);
			// 	console.log(dataReport);
			// }
		}

		console.log('số ng đa trả lời', infoGame.gameData.numberPlayerAnswered);
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
