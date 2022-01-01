import path from 'path';
import fs from 'fs';
import xlsx from 'xlsx';
import { fileURLToPath } from 'url';
import { dirname, parse } from 'path';
import { finished } from 'stream/promises';
import { ApolloError } from 'apollo-server-express';
import cloudinary from 'cloudinary';
import { CLOUD_NAME, CLOUD_KEY, CLOUD_SECRET } from '../../config/index.js';

import { GraphQLUpload } from 'graphql-upload';

cloudinary.config({
	cloud_name: CLOUD_NAME,
	api_key: CLOUD_KEY,
	api_secret: CLOUD_SECRET,
});

export default {
	Upload: GraphQLUpload,
	Query: {
		greetings: () => {
			//console.log('greetings');
			return 'Hello upload file';
		},
	},
	Mutation: {
		uploadFileExcel: async (parent, { file, questionSetId }, { Question }) => {
			try {
				const { createReadStream, filename, mimetype, encoding } = await file;

				const { ext, name } = parse(filename);
				// console.log('ext', ext);
				// console.log('name', name);

				console.log(questionSetId);

				if (ext !== '.xlsx') {
					return {
						message: 'Wrong ext file',
					};
				}

				const stream = createReadStream();
				const __filename = fileURLToPath(import.meta.url);
				const __dirname = dirname(__filename);
				const out = fs.createWriteStream(
					path.join(__dirname, `../../../FileUpload/${filename}`),
				);

				let dirFile = path.join(__dirname, `../../../FileUpload/${filename}`);
				await stream.pipe(out);
				await finished(out);

				const workBook = xlsx.readFile(dirFile);

				let workSheet = workBook.Sheets[workBook.SheetNames[0]];
				//console.log(xlsx.utils.sheet_to_json(workSheet));
				console.log(xlsx.utils.sheet_to_row_object_array(workSheet));

				const excelRows = xlsx.utils.sheet_to_row_object_array(workSheet);
				const dataQuestion = [];

				for (let i = 0; i < excelRows.length; i++) {
					if (excelRows[i]['Question Text'] === 'undefined') {
						continue;
					}

					if (excelRows[i]['Question Type'] === 'Single-choice') {
						if (
							!excelRows[i]['Correct Answer'] ||
							!Number.isInteger(excelRows[i]['Correct Answer'])
						) {
							console.log('vao day Single-choice');
							continue;
						}
						let answers = [];

						answers.push({
							content:
								typeof excelRows[i]['Option 1'] === 'boolean'
									? `${excelRows[i]['Option 1']}`
									: excelRows[i]['Option 1'],
							op: 1,
						});
						answers.push({
							content:
								typeof excelRows[i]['Option 2'] === 'boolean'
									? `${excelRows[i]['Option 2']}`
									: excelRows[i]['Option 2'],
							op: 2,
						});
						answers.push({
							content:
								typeof excelRows[i]['Option 3'] === 'boolean'
									? `${excelRows[i]['Option 3']}`
									: excelRows[i]['Option 3'],
							op: 3,
						});
						answers.push({
							content:
								typeof excelRows[i]['Option 4'] === 'boolean'
									? `${excelRows[i]['Option 4']}`
									: excelRows[i]['Option 4'],
							op: 4,
						});

						console.log(typeof answers[1].content);

						let countUndefined = 0;
						answers = answers.filter((value) => {
							if (value.content === undefined) {
								countUndefined++;
							} else {
								return value;
							}
						});

						console.log('single choice', answers[1]);

						if (countUndefined >= 2) {
							console.log('qua nhieu cau tra loi undefined Single-choice');
							continue;
						}

						let countIsCorrect = 0;
						for (let j = 0; j < answers.length; j++) {
							if (answers[j].op === excelRows[i]['Correct Answer']) {
								answers[j].isCorrect = true;
								countIsCorrect++;
							}
							delete answers[j].op;
						}

						//console.log('imageLink', excelRows[i]['Image Link']);

						if (countIsCorrect === 0) {
							console.log('ko co dap an dung Single-choice');
							continue;
						}

						let data = {
							questionSetId,
							content: excelRows[i]['Question Text'],
							answers,
							image: !excelRows[i]['Image Link']
								? ''
								: excelRows[i]['Image Link'],
							time: !excelRows[i]['Time in second']
								? 15
								: excelRows[i]['Time in second'],
							type: 1,
						};

						// if (data.answers.length < excelRows[i]['Correct Answer']) {
						// 	console.log('vị trí đáp án > mảng');
						// 	continue;
						// }

						// console.log(
						// 	'loai corectaws',
						// 	typeof excelRows[i]['Correct Answer'],
						// );
						// console.log('vi tri', excelRows[i]['Correct Answer'] - 1);

						// data.answers[excelRows[i]['Correct Answer'] - 1].isCorrect = true;

						//await Question.create(data);

						//dataQuestion.push(data);

						console.log(data);
						continue;
					}

					if (excelRows[i]['Question Type'] === 'Multiple-choice') {
						if (!excelRows[i]['Correct Answer']) {
							console.log('vao day Multiple-choice');
							continue;
						}
						const arrCorrectAnswers = excelRows[i]['Correct Answer']
							.trim()
							.split(',');

						const arrCorrectAnswersNumber = arrCorrectAnswers.map(function (x) {
							return parseInt(x, 10);
						});

						let answers = [];

						answers.push({
							content:
								typeof excelRows[i]['Option 1'] === 'boolean'
									? `${excelRows[i]['Option 1']}`
									: excelRows[i]['Option 1'],
							op: 1,
						});
						answers.push({
							content:
								typeof excelRows[i]['Option 2'] === 'boolean'
									? `${excelRows[i]['Option 2']}`
									: excelRows[i]['Option 2'],
							op: 2,
						});
						answers.push({
							content:
								typeof excelRows[i]['Option 3'] === 'boolean'
									? `${excelRows[i]['Option 3']}`
									: excelRows[i]['Option 3'],
							op: 3,
						});
						answers.push({
							content:
								typeof excelRows[i]['Option 4'] === 'boolean'
									? `${excelRows[i]['Option 4']}`
									: excelRows[i]['Option 4'],
							op: 4,
						});

						let countUndefined = 0;
						answers = answers.filter((value) => {
							if (value.content === undefined) {
								countUndefined++;
							} else {
								return value;
							}
						});

						if (countUndefined >= 2) {
							console.log('qua nhieu dap an undefined Multiple-choice');
							continue;
						}

						let countIsCorrect = 0;
						for (let j = 0; j < answers.length; j++) {
							for (let z = 0; z < arrCorrectAnswersNumber.length; z++) {
								if (answers[j].op == arrCorrectAnswersNumber[z]) {
									answers[j].isCorrect = true;
									countIsCorrect++;
									break;
								}
							}

							delete answers[j].op;
						}

						// console.log('imageLink', excelRows[i]['Image Link']);

						if (countIsCorrect === 0) {
							console.log('ko co dap an dung Multiple-choice');
							continue;
						}

						let data = {
							questionSetId,
							content: excelRows[i]['Question Text'],
							answers,
							image: !excelRows[i]['Image Link']
								? ''
								: excelRows[i]['Image Link'],
							time: !excelRows[i]['Time in second']
								? 15
								: excelRows[i]['Time in second'],
							type: 2,
						};

						console.log(data);
						continue;
					}

					if (excelRows[i]['Question Type'] === 'True-false') {
						//console.log('dap an true false', excelRows[i]['Correct Answer']);
						if (
							excelRows[i]['Correct Answer'] !== 1 &&
							excelRows[i]['Correct Answer'] !== 2
						) {
							console.log('vao day True-false');
							continue;
						}
						let answers = [];

						answers.push({
							content:
								typeof excelRows[i]['Option 1'] === 'boolean'
									? `${excelRows[i]['Option 1']}`
									: excelRows[i]['Option 1'],
							op: 1,
						});
						answers.push({
							content:
								typeof excelRows[i]['Option 2'] === 'boolean'
									? `${excelRows[i]['Option 2']}`
									: excelRows[i]['Option 2'],
							op: 2,
						});

						console.log(answers);

						answers = answers.filter((value) => {
							if (value.content !== undefined) {
								return value;
							}
						});

						if (answers.length !== 2) {
							console.log('dap an qua nhieu undefined True-false');
							continue;
						}

						let countIsCorrect = 0;
						for (let j = 0; j < answers.length; j++) {
							if (answers[j].op === excelRows[i]['Correct Answer']) {
								answers[j].isCorrect = true;
								answers[j].content = 'True';
								countIsCorrect++;
							} else {
								answers[j].content = 'False';
							}
							delete answers[j].op;
						}

						if (countIsCorrect === 0) {
							continue;
						}

						let data = {
							questionSetId,
							content: excelRows[i]['Question Text'],
							answers,
							image: !excelRows[i]['Image Link']
								? ''
								: excelRows[i]['Image Link'],
							time: !excelRows[i]['Time in second']
								? 15
								: excelRows[i]['Time in second'],
							type: 3,
						};

						console.log(data);
						continue;
					}

					if (excelRows[i]['Question Type'] === 'Fill-in-the-Blank') {
						if (excelRows[i]['Correct Answer']) {
							console.log('vao day Fill-in-the-Blank');
							continue;
						}

						let answers = [];

						answers.push(
							typeof excelRows[i]['Option 1'] === 'boolean'
								? `${excelRows[i]['Option 1']}`
								: excelRows[i]['Option 1'],
						);
						answers.push(
							typeof excelRows[i]['Option 2'] === 'boolean'
								? `${excelRows[i]['Option 2']}`
								: excelRows[i]['Option 2'],
						);
						answers.push(
							typeof excelRows[i]['Option 3'] === 'boolean'
								? `${excelRows[i]['Option 3']}`
								: excelRows[i]['Option 3'],
						);
						answers.push(
							typeof excelRows[i]['Option 4'] === 'boolean'
								? `${excelRows[i]['Option 4']}`
								: excelRows[i]['Option 4'],
						);

						let countUndefined = 0;
						answers = answers.filter((value) => {
							if (value === undefined) {
								countUndefined++;
							} else {
								return value;
							}
						});

						if (countUndefined >= 4) {
							console.log('ko co dap an dung Fill-in-the-Blank');
							continue;
						}

						let data = {
							questionSetId,
							content: excelRows[i]['Question Text'],
							typeAnswers: answers,
							image: !excelRows[i]['Image Link']
								? ''
								: excelRows[i]['Image Link'],
							time: !excelRows[i]['Time in second']
								? 15
								: excelRows[i]['Time in second'],
							type: 4,
						};

						console.log(data);
						continue;
					}

					if (excelRows[i]['Question Type'] === 'Poll') {
					}
				}

				if (fs.existsSync(dirFile)) {
					console.log('vào xóa file');
					fs.unlink(dirFile, (err) => {
						if (err) throw err;
						console.log('successfully deleted');
					});
				}

				// if (fs.existsSync(dirFile)) {
				// 	console.log('da ton tai file');
				// } else {
				// 	console.log(dirFile);
				// 	console.log('chua ton tai file');
				// 	return;
				// }
				return {
					message: 'Read file ok',
				};
			} catch (error) {
				console.error(error);
				throw new ApolloError(error.message, '500');
			}
		},

		uploadImage: async (parent, { file }, _) => {
			try {
				const { createReadStream, filename, mimetype, encoding } = await file;
				const { ext, name } = parse(filename);
				if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
					console.log('vao day image', ext);
					return {
						message: 'Wrong ext file',
					};
				}

				const stream = createReadStream();
				const __filename = fileURLToPath(import.meta.url);
				const __dirname = dirname(__filename);
				const out = fs.createWriteStream(
					path.join(__dirname, `../../../FileUpload/${filename}`),
				);

				let dirFile = path.join(__dirname, `../../../FileUpload/${filename}`);
				await stream.pipe(out);
				await finished(out);

				let upload_stream = await cloudinary.v2.uploader.upload(dirFile, {
					resource_type: 'image',
				});

				if (fs.existsSync(dirFile)) {
					console.log('vào xóa file image');
					fs.unlink(dirFile, (err) => {
						if (err) throw err;
						console.log('successfully deleted image');
					});
				}

				return {
					message: upload_stream.secure_url,
				};
			} catch (error) {
				throw new ApolloError(error.message, '500');
			}
		},
	},
};
