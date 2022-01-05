import ExcelJS from 'exceljs';
import { ApolloError } from 'apollo-server-express';
import escapeStringRegexp from 'escape-string-regexp';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import fs from 'fs';
import cloudinary from 'cloudinary';
import { CLOUD_NAME, CLOUD_KEY, CLOUD_SECRET } from '../../config/index.js';

cloudinary.config({
	cloud_name: CLOUD_NAME,
	api_key: CLOUD_KEY,
	api_secret: CLOUD_SECRET,
});

export default {
	Query: {
		DownloadReport: async (parent, { reportId }, { Report }, info) => {
			try {
				let dataReport = await Report.findById(reportId).lean();
				//console.log(dataReport.createdAt);
				//console.log(dataReport.gameStart);

				dataReport.players = dataReport.players.sort((a, b) => {
					return a.name.localeCompare(b.name);
				});

				for (let i = 0; i < dataReport.questions.length; i++) {
					dataReport.questions[i].detailAllPlayers = dataReport.questions[
						i
					].detailAllPlayers.sort((a, b) => {
						return a.name.localeCompare(b.name);
					});
				}

				let averageScore = 0;
				let totalCorrectAnswers = 0;
				let totalWrongAnswers = 0;
				for (let i = 0; i < dataReport.players.length; i++) {
					averageScore += dataReport.players[i].finalScore;
				}
				if (dataReport.players.length !== 0) {
					averageScore = Number.parseFloat(
						averageScore / dataReport.players.length,
					).toFixed(2);
				}

				for (let i = 0; i < dataReport.questions.length; i++) {
					totalCorrectAnswers += dataReport.questions[i].percentRight;
				}
				if (dataReport.questions.length !== 0) {
					totalCorrectAnswers = Number.parseFloat(
						totalCorrectAnswers / dataReport.questions.length,
					).toFixed(2);
					totalWrongAnswers = Number.parseFloat(
						100 - totalCorrectAnswers,
					).toFixed(2);
				}

				const workbook = new ExcelJS.Workbook();
				workbook.views = [
					{
						x: 0,
						y: 0,
						width: 10000,
						height: 20000,
						firstSheet: 0,
						activeTab: 0,
						visibility: 'visible',
					},
				];
				const sheet = workbook.addWorksheet('Overview', {
					views: [{ showGridLines: false, zoomScale: 90 }],
				});

				const sheetPlayer = workbook.addWorksheet('Player Data', {
					views: [{ showGridLines: false, zoomScale: 90 }],
				});

				const sheetQuestion = workbook.addWorksheet('Question Data', {
					views: [{ showGridLines: false, zoomScale: 90 }],
				});

				sheet.columns = [
					{
						header: dataReport.name,
						key: 'nameRP',
						width: 55,
					},
				];

				sheet.getColumn('H').width = 35;

				sheet.getColumn('nameRP').font = {
					name: 'Arial',
					//family: 4,
					size: 19,
					color: {
						argb: 'FFFFFF',
					},
					bold: true,
				};
				sheet.getRow(1).height = 32.5;
				sheet.mergeCells('A1:H1');
				sheet.getCell('A1').fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: '46178F' },
				};
				sheet.getCell('A1').alignment = {
					vertical: 'middle',
					horizontal: 'left',
				};
				sheet.getCell('A1').border = {
					top: { style: 'thin', color: { argb: 'AAAAAA' } },
					left: { style: 'thin', color: { argb: 'AAAAAA' } },
					bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
					right: { style: 'thin', color: { argb: 'AAAAAA' } },
				};

				//A2
				sheet.getCell('A2').value = 'Game started on';
				sheet.getCell('A2').font = {
					name: 'Arial',
					size: 12,
					color: {
						argb: 'FFFFFF',
					},
					bold: true,
				};
				sheet.getCell('A2').fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: '7232B1' },
				};
				sheet.getRow(2).height = 26;
				sheet.getCell('A2').alignment = {
					vertical: 'middle',
					horizontal: 'left',
				};
				sheet.getCell('A2').border = {
					top: { style: 'thin', color: { argb: 'AAAAAA' } },
					left: { style: 'thin', color: { argb: 'AAAAAA' } },
					bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
					right: { style: 'thin', color: { argb: 'AAAAAA' } },
				};

				//A3
				sheet.getCell('A3').value = 'Played with';
				sheet.getCell('A3').font = {
					name: 'Arial',
					size: 12,
					color: {
						argb: 'FFFFFF',
					},
					bold: true,
				};
				sheet.getCell('A3').fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: '7232B1' },
				};
				sheet.getRow(3).height = 26;
				sheet.getCell('A3').alignment = {
					vertical: 'middle',
					horizontal: 'left',
				};
				sheet.getCell('A3').border = {
					top: { style: 'thin', color: { argb: 'AAAAAA' } },
					left: { style: 'thin', color: { argb: 'AAAAAA' } },
					bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
					right: { style: 'thin', color: { argb: 'AAAAAA' } },
				};

				//A4
				sheet.getCell('A4').value = 'Hosted by';
				sheet.getCell('A4').font = {
					name: 'Arial',
					size: 12,
					color: {
						argb: 'FFFFFF',
					},
					bold: true,
				};
				sheet.getCell('A4').fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: '7232B1' },
				};
				sheet.getRow(4).height = 26;
				sheet.getCell('A4').alignment = {
					vertical: 'middle',
					horizontal: 'left',
				};
				sheet.getCell('A4').border = {
					top: { style: 'thin', color: { argb: 'AAAAAA' } },
					left: { style: 'thin', color: { argb: 'AAAAAA' } },
					bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
					right: { style: 'thin', color: { argb: 'AAAAAA' } },
				};

				//A5
				sheet.getCell('A5').value = 'Game mode';
				sheet.getCell('A5').font = {
					name: 'Arial',
					size: 12,
					color: {
						argb: 'FFFFFF',
					},
					bold: true,
				};
				sheet.getCell('A5').fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: '7232B1' },
				};
				sheet.getRow(5).height = 26;
				sheet.getCell('A5').alignment = {
					vertical: 'middle',
					horizontal: 'left',
				};
				sheet.getCell('A5').border = {
					top: { style: 'thin', color: { argb: 'AAAAAA' } },
					left: { style: 'thin', color: { argb: 'AAAAAA' } },
					bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
					right: { style: 'thin', color: { argb: 'AAAAAA' } },
				};

				//A6
				sheet.getCell('A6').value = 'Game end on';
				sheet.getCell('A6').font = {
					name: 'Arial',
					size: 12,
					color: {
						argb: 'FFFFFF',
					},
					bold: true,
				};
				sheet.getCell('A6').fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: '7232B1' },
				};
				sheet.getRow(6).height = 26;
				sheet.getCell('A6').alignment = {
					vertical: 'middle',
					horizontal: 'left',
				};
				sheet.getCell('A6').border = {
					top: { style: 'thin', color: { argb: 'AAAAAA' } },
					left: { style: 'thin', color: { argb: 'AAAAAA' } },
					bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
					right: { style: 'thin', color: { argb: 'AAAAAA' } },
				};

				//A9
				sheet.getCell('A9').value = 'Total correct answers (%)';
				sheet.getCell('A9').font = {
					name: 'Arial',
					size: 12,
				};
				sheet.getCell('A9').fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: 'F4F4F4' },
				};
				sheet.getRow(9).height = 26;
				sheet.getCell('A9').alignment = {
					vertical: 'middle',
					horizontal: 'left',
				};
				sheet.getCell('A9').border = {
					top: { style: 'thin', color: { argb: 'AAAAAA' } },
					left: { style: 'thin', color: { argb: 'AAAAAA' } },
					bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
					right: { style: 'thin', color: { argb: 'AAAAAA' } },
				};

				//A10
				sheet.getCell('A10').value = 'Total incorrect answers (%)';
				sheet.getCell('A10').font = {
					name: 'Arial',
					size: 12,
				};
				sheet.getCell('A10').fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: 'F4F4F4' },
				};
				sheet.getRow(10).height = 26;
				sheet.getCell('A10').alignment = {
					vertical: 'middle',
					horizontal: 'left',
				};
				sheet.getCell('A10').border = {
					top: { style: 'thin', color: { argb: 'AAAAAA' } },
					left: { style: 'thin', color: { argb: 'AAAAAA' } },
					bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
					right: { style: 'thin', color: { argb: 'AAAAAA' } },
				};

				//A9
				// sheet.getCell('A9').value = 'Average score (points)';
				// sheet.getCell('A9').font = {
				// 	name: 'Arial',
				// 	size: 12,
				// };
				// sheet.getCell('A9').fill = {
				// 	type: 'pattern',
				// 	pattern: 'solid',
				// 	fgColor: { argb: 'F4F4F4' },
				// };
				// sheet.getRow(9).height = 26;
				// sheet.getCell('A9').alignment = {
				// 	vertical: 'middle',
				// 	horizontal: 'left',
				// };
				// sheet.getCell('A9').border = {
				// 	top: { style: 'thin', color: { argb: 'AAAAAA' } },
				// 	left: { style: 'thin', color: { argb: 'AAAAAA' } },
				// 	bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
				// 	right: { style: 'thin', color: { argb: 'AAAAAA' } },
				// };

				//A11
				sheet.getCell('A11').value = 'Average score (points)';
				sheet.getCell('A11').font = {
					name: 'Arial',
					size: 12,
				};
				sheet.getCell('A11').fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: 'F4F4F4' },
				};
				sheet.getRow(11).height = 26;
				sheet.getCell('A11').alignment = {
					vertical: 'middle',
					horizontal: 'left',
				};
				sheet.getCell('A11').border = {
					top: { style: 'thin', color: { argb: 'AAAAAA' } },
					left: { style: 'thin', color: { argb: 'AAAAAA' } },
					bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
					right: { style: 'thin', color: { argb: 'AAAAAA' } },
				};

				//A13
				sheet.getCell('A13').value = {
					text: 'View Player Data',
					hyperlink: "#'Player Data'!A1",
				};

				sheet.getCell('A13').font = {
					name: 'Arial',
					size: 15,
					color: {
						argb: '7232B1',
					},
					bold: true,
				};
				sheet.getCell('A13').fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: 'E7DDF2' },
				};
				sheet.getRow(13).height = 42;
				sheet.getCell('A13').alignment = {
					vertical: 'middle',
					horizontal: 'center',
					wrapText: true,
				};
				sheet.getCell('A13').border = {
					top: { style: 'thin', color: { argb: 'AAAAAA' } },
					left: { style: 'thin', color: { argb: 'AAAAAA' } },
					bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
					right: { style: 'thin', color: { argb: 'AAAAAA' } },
				};

				//CDEF13
				sheet.mergeCells('C13:F13');
				sheet.getCell('C13').value = {
					text: 'View Question Data',
					hyperlink: "#'Question Data'!A1",
				};

				sheet.getCell('C13').font = {
					name: 'Arial',
					size: 15,
					color: {
						argb: '7232B1',
					},
					bold: true,
				};
				sheet.getCell('C13').fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: 'E7DDF2' },
				};

				sheet.getCell('C13').alignment = {
					vertical: 'middle',
					horizontal: 'center',
					wrapText: true,
				};
				sheet.getCell('C13').border = {
					top: { style: 'thin', color: { argb: 'AAAAAA' } },
					left: { style: 'thin', color: { argb: 'AAAAAA' } },
					bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
					right: { style: 'thin', color: { argb: 'AAAAAA' } },
				};

				//BCDEFGH2
				// sheetconsole.log(dataReport.gameStart);
				let dateTimeRP = new Date(dataReport.gameStart);
				dateTimeRP = dateTimeRP.toUTCString().split(' ');
				sheet.mergeCells('B2:H2');
				//sheet.getCell('B2').numFmt = 'dd/mm/yyyy';
				sheet.getCell(
					'B2',
				).value = `${dateTimeRP[1]} ${dateTimeRP[2]} ${dateTimeRP[3]}, ${dateTimeRP[4]}`;
				sheet.getCell('B2').font = {
					name: 'Arial',
					size: 12,
					color: {
						argb: 'FFFFFF',
					},
					bold: true,
				};
				sheet.getCell('B2').fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: '7232B1' },
				};
				sheet.getCell('B2').alignment = {
					vertical: 'middle',
					horizontal: 'left',
				};
				sheet.getCell('B2').border = {
					top: { style: 'thin', color: { argb: 'AAAAAA' } },
					left: { style: 'thin', color: { argb: 'AAAAAA' } },
					bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
					right: { style: 'thin', color: { argb: 'AAAAAA' } },
				};

				//BCDEFGH3
				sheet.mergeCells('B3:H3');
				sheet.getCell('B3').value = `${dataReport.players.length} players`;
				sheet.getCell('B3').font = {
					name: 'Arial',
					size: 12,
					color: {
						argb: 'FFFFFF',
					},
					bold: true,
				};
				sheet.getCell('B3').fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: '7232B1' },
				};
				sheet.getCell('B3').alignment = {
					vertical: 'middle',
					horizontal: 'left',
				};
				sheet.getCell('B3').border = {
					top: { style: 'thin', color: { argb: 'AAAAAA' } },
					left: { style: 'thin', color: { argb: 'AAAAAA' } },
					bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
					right: { style: 'thin', color: { argb: 'AAAAAA' } },
				};

				//BCDEFGH4
				sheet.mergeCells('B4:H4');
				sheet.getCell('B4').value = `bokool789`;
				sheet.getCell('B4').font = {
					name: 'Arial',
					size: 12,
					color: {
						argb: 'FFFFFF',
					},
					bold: true,
				};
				sheet.getCell('B4').fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: '7232B1' },
				};
				sheet.getCell('B4').alignment = {
					vertical: 'middle',
					horizontal: 'left',
				};
				sheet.getCell('B4').border = {
					top: { style: 'thin', color: { argb: 'AAAAAA' } },
					left: { style: 'thin', color: { argb: 'AAAAAA' } },
					bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
					right: { style: 'thin', color: { argb: 'AAAAAA' } },
				};

				//BCDEFGH5
				sheet.mergeCells('B5:H5');
				sheet.getCell('B5').value = `${dataReport.gameMode}`;
				sheet.getCell('B5').font = {
					name: 'Arial',
					size: 12,
					color: {
						argb: 'FFFFFF',
					},
					bold: true,
				};
				sheet.getCell('B5').fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: '7232B1' },
				};
				sheet.getCell('B5').alignment = {
					vertical: 'middle',
					horizontal: 'left',
				};
				sheet.getCell('B5').border = {
					top: { style: 'thin', color: { argb: 'AAAAAA' } },
					left: { style: 'thin', color: { argb: 'AAAAAA' } },
					bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
					right: { style: 'thin', color: { argb: 'AAAAAA' } },
				};

				//BCDEFGH6
				let dateTimeRPEnd = new Date(dataReport.createdAt);
				dateTimeRPEnd = dateTimeRPEnd.toUTCString().split(' ');
				sheet.mergeCells('B6:H6');
				sheet.getCell(
					'B6',
				).value = `${dateTimeRPEnd[1]} ${dateTimeRPEnd[2]} ${dateTimeRPEnd[3]}, ${dateTimeRPEnd[4]}`;
				sheet.getCell('B6').font = {
					name: 'Arial',
					size: 12,
					color: {
						argb: 'FFFFFF',
					},
					bold: true,
				};
				sheet.getCell('B6').fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: '7232B1' },
				};
				sheet.getCell('B6').alignment = {
					vertical: 'middle',
					horizontal: 'left',
				};
				sheet.getCell('B6').border = {
					top: { style: 'thin', color: { argb: 'AAAAAA' } },
					left: { style: 'thin', color: { argb: 'AAAAAA' } },
					bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
					right: { style: 'thin', color: { argb: 'AAAAAA' } },
				};

				//ABCDEFGH8
				sheet.mergeCells('A8:H8');
				sheet.getRow(8).height = 26;
				sheet.getCell('A8').value = `Overall Performance`;
				sheet.getCell('A8').font = {
					name: 'Arial',
					size: 15,
					color: {
						argb: 'FFFFFF',
					},
					bold: true,
				};
				sheet.getCell('A8').fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: '7232B1' },
				};
				sheet.getCell('A8').alignment = {
					vertical: 'middle',
					horizontal: 'left',
				};
				sheet.getCell('A8').border = {
					top: { style: 'thin', color: { argb: 'AAAAAA' } },
					left: { style: 'thin', color: { argb: 'AAAAAA' } },
					bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
					right: { style: 'thin', color: { argb: 'AAAAAA' } },
				};

				//BCDEFGH9
				sheet.mergeCells('B9:H9');
				sheet.getCell('B9').value = `${totalCorrectAnswers}%`;
				sheet.getCell('B9').font = {
					name: 'Arial',
					size: 12,
				};
				sheet.getCell('B9').fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: 'F4F4F4' },
				};
				sheet.getCell('B9').alignment = {
					vertical: 'middle',
					horizontal: 'left',
				};
				sheet.getCell('B9').border = {
					top: { style: 'thin', color: { argb: 'AAAAAA' } },
					left: { style: 'thin', color: { argb: 'AAAAAA' } },
					bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
					right: { style: 'thin', color: { argb: 'AAAAAA' } },
				};

				//BCDEFGH10
				sheet.mergeCells('B10:H10');
				sheet.getCell('B10').value = `${totalWrongAnswers}%`;
				sheet.getCell('B10').font = {
					name: 'Arial',
					size: 12,
				};
				sheet.getCell('B10').fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: 'F4F4F4' },
				};
				sheet.getCell('B10').alignment = {
					vertical: 'middle',
					horizontal: 'left',
				};
				sheet.getCell('B10').border = {
					top: { style: 'thin', color: { argb: 'AAAAAA' } },
					left: { style: 'thin', color: { argb: 'AAAAAA' } },
					bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
					right: { style: 'thin', color: { argb: 'AAAAAA' } },
				};

				//BCDEFGH11
				sheet.mergeCells('B11:H11');
				sheet.getCell('B11').value = `${averageScore} points`;
				sheet.getCell('B11').font = {
					name: 'Arial',
					size: 12,
				};
				sheet.getCell('B11').fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: 'F4F4F4' },
				};
				sheet.getCell('B11').alignment = {
					vertical: 'middle',
					horizontal: 'left',
				};
				sheet.getCell('B11').border = {
					top: { style: 'thin', color: { argb: 'AAAAAA' } },
					left: { style: 'thin', color: { argb: 'AAAAAA' } },
					bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
					right: { style: 'thin', color: { argb: 'AAAAAA' } },
				};

				//A1 player data
				sheetPlayer.getCell('A1').value = 'Rank';
				sheetPlayer.getCell('A1').font = {
					name: 'Arial',
					size: 13,
					color: {
						argb: '7232B1',
					},
					bold: true,
				};
				sheetPlayer.getCell('A1').fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: 'E7DDF2' },
				};
				sheetPlayer.getRow(1).height = 40;
				sheetPlayer.getColumn(1).width = 10;
				sheetPlayer.getCell('A1').alignment = {
					vertical: 'middle',
					horizontal: 'center',
				};
				sheetPlayer.getCell('A1').border = {
					top: { style: 'thin', color: { argb: 'AAAAAA' } },
					left: { style: 'thin', color: { argb: 'AAAAAA' } },
					bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
					right: { style: 'thin', color: { argb: 'AAAAAA' } },
				};

				//B1 player data
				sheetPlayer.getCell('B1').value = 'Player Name';
				sheetPlayer.getCell('B1').font = {
					name: 'Arial',
					size: 13,
					color: {
						argb: '7B3F04',
					},
					bold: true,
				};
				sheetPlayer.getCell('B1').fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: 'FFEDCC' },
				};
				sheetPlayer.getColumn(2).width = 30;
				sheetPlayer.getCell('B1').alignment = {
					vertical: 'middle',
					horizontal: 'center',
				};
				sheetPlayer.getCell('B1').border = {
					top: { style: 'thin', color: { argb: 'AAAAAA' } },
					left: { style: 'thin', color: { argb: 'AAAAAA' } },
					bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
					right: { style: 'thin', color: { argb: 'AAAAAA' } },
				};

				//C1 player data
				sheetPlayer.getCell('C1').value = 'Accuracy';
				sheetPlayer.getCell('C1').font = {
					name: 'Arial',
					size: 13,
					color: {
						argb: '7232B1',
					},
					bold: true,
				};
				sheetPlayer.getCell('C1').fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: 'E7DDF2' },
				};
				sheetPlayer.getColumn(3).width = 18;
				sheetPlayer.getCell('C1').alignment = {
					vertical: 'middle',
					horizontal: 'center',
				};
				sheetPlayer.getCell('C1').border = {
					top: { style: 'thin', color: { argb: 'AAAAAA' } },
					left: { style: 'thin', color: { argb: 'AAAAAA' } },
					bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
					right: { style: 'thin', color: { argb: 'AAAAAA' } },
				};

				//D1 player data
				sheetPlayer.getCell('D1').value = 'Total Score';
				sheetPlayer.getCell('D1').font = {
					name: 'Arial',
					size: 13,
					color: {
						argb: '7232B1',
					},
					bold: true,
				};
				sheetPlayer.getCell('D1').fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: 'E7DDF2' },
				};
				sheetPlayer.getColumn(4).width = 20;
				sheetPlayer.getCell('D1').alignment = {
					vertical: 'middle',
					horizontal: 'center',
				};
				sheetPlayer.getCell('D1').border = {
					top: { style: 'thin', color: { argb: 'AAAAAA' } },
					left: { style: 'thin', color: { argb: 'AAAAAA' } },
					bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
					right: { style: 'thin', color: { argb: 'AAAAAA' } },
				};

				//E1 player data
				sheetPlayer.getCell('E1').value = 'Correct';
				sheetPlayer.getCell('E1').font = {
					name: 'Arial',
					size: 13,
					bold: true,
				};
				sheetPlayer.getCell('E1').fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: 'D9F7ED' },
				};
				sheetPlayer.getColumn(5).width = 18;
				sheetPlayer.getCell('E1').alignment = {
					vertical: 'middle',
					horizontal: 'center',
				};
				sheetPlayer.getCell('E1').border = {
					top: { style: 'thin', color: { argb: 'AAAAAA' } },
					left: { style: 'thin', color: { argb: 'AAAAAA' } },
					bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
					right: { style: 'thin', color: { argb: 'AAAAAA' } },
				};

				//F1 player data
				sheetPlayer.getCell('F1').value = 'Incorrect';
				sheetPlayer.getCell('F1').font = {
					name: 'Arial',
					size: 13,
					bold: true,
				};
				sheetPlayer.getCell('F1').fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: 'FCDBE3' },
				};
				sheetPlayer.getColumn(6).width = 18;
				sheetPlayer.getCell('F1').alignment = {
					vertical: 'middle',
					horizontal: 'center',
				};
				sheetPlayer.getCell('F1').border = {
					top: { style: 'thin', color: { argb: 'AAAAAA' } },
					left: { style: 'thin', color: { argb: 'AAAAAA' } },
					bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
					right: { style: 'thin', color: { argb: 'AAAAAA' } },
				};

				//G1 player data
				sheetPlayer.getCell('G1').value = 'Unanswered';
				sheetPlayer.getCell('G1').font = {
					name: 'Arial',
					size: 13,
					bold: true,
				};
				sheetPlayer.getCell('G1').fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: 'E5E5E5' },
				};
				sheetPlayer.getColumn(7).width = 18;
				sheetPlayer.getCell('G1').alignment = {
					vertical: 'middle',
					horizontal: 'center',
				};
				sheetPlayer.getCell('G1').border = {
					top: { style: 'thin', color: { argb: 'AAAAAA' } },
					left: { style: 'thin', color: { argb: 'AAAAAA' } },
					bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
					right: { style: 'thin', color: { argb: 'AAAAAA' } },
				};

				let countRowDataPlayer = 2;
				//const arrColDataPlayer = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
				for (let i = 0; i < dataReport.players.length; i++) {
					let countCorrect = 0;
					let countInCorrect = 0;
					let countUnanswered = 0;
					for (
						let j = 0;
						j < dataReport.players[i].detailAllQuestions.length;
						j++
					) {
						if (dataReport.players[i].detailAllQuestions[j].correct) {
							countCorrect += 1;
						} else {
							countInCorrect += 1;
						}

						if (dataReport.players[i].detailAllQuestions[j].time === -1) {
							countUnanswered += 1;
						}
					}

					//A
					sheetPlayer.getCell(`A${countRowDataPlayer}`).value =
						dataReport.players[i].rank;
					sheetPlayer.getCell(`A${countRowDataPlayer}`).font = {
						name: 'Arial',
						size: 13,
					};
					sheetPlayer.getCell(`A${countRowDataPlayer}`).alignment = {
						vertical: 'middle',
						horizontal: 'center',
					};
					sheetPlayer.getCell(`A${countRowDataPlayer}`).border = {
						top: { style: 'thin', color: { argb: 'AAAAAA' } },
						left: { style: 'thin', color: { argb: 'AAAAAA' } },
						bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
						right: { style: 'thin', color: { argb: 'AAAAAA' } },
					};

					//B
					sheetPlayer.getCell(`B${countRowDataPlayer}`).value =
						dataReport.players[i].name;
					sheetPlayer.getCell(`B${countRowDataPlayer}`).font = {
						name: 'Arial',
						size: 13,
					};
					sheetPlayer.getCell(`B${countRowDataPlayer}`).alignment = {
						vertical: 'middle',
						horizontal: 'center',
					};
					sheetPlayer.getCell(`B${countRowDataPlayer}`).border = {
						top: { style: 'thin', color: { argb: 'AAAAAA' } },
						left: { style: 'thin', color: { argb: 'AAAAAA' } },
						bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
						right: { style: 'thin', color: { argb: 'AAAAAA' } },
					};

					//C
					sheetPlayer.getCell(`C${countRowDataPlayer}`).value =
						dataReport.players[i].correctPercentAnswers + '%';
					sheetPlayer.getCell(`C${countRowDataPlayer}`).font = {
						name: 'Arial',
						size: 13,
					};
					sheetPlayer.getCell(`C${countRowDataPlayer}`).alignment = {
						vertical: 'middle',
						horizontal: 'center',
					};
					sheetPlayer.getCell(`C${countRowDataPlayer}`).border = {
						top: { style: 'thin', color: { argb: 'AAAAAA' } },
						left: { style: 'thin', color: { argb: 'AAAAAA' } },
						bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
						right: { style: 'thin', color: { argb: 'AAAAAA' } },
					};

					//D
					sheetPlayer.getCell(`D${countRowDataPlayer}`).value =
						dataReport.players[i].finalScore;
					sheetPlayer.getCell(`D${countRowDataPlayer}`).font = {
						name: 'Arial',
						size: 13,
					};
					sheetPlayer.getCell(`D${countRowDataPlayer}`).alignment = {
						vertical: 'middle',
						horizontal: 'center',
					};
					sheetPlayer.getCell(`D${countRowDataPlayer}`).border = {
						top: { style: 'thin', color: { argb: 'AAAAAA' } },
						left: { style: 'thin', color: { argb: 'AAAAAA' } },
						bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
						right: { style: 'thin', color: { argb: 'AAAAAA' } },
					};

					//E
					sheetPlayer.getCell(`E${countRowDataPlayer}`).value = countCorrect;

					sheetPlayer.getCell(`E${countRowDataPlayer}`).font = {
						name: 'Arial',
						size: 13,
					};
					sheetPlayer.getCell(`E${countRowDataPlayer}`).alignment = {
						vertical: 'middle',
						horizontal: 'center',
					};
					sheetPlayer.getCell(`E${countRowDataPlayer}`).border = {
						top: { style: 'thin', color: { argb: 'AAAAAA' } },
						left: { style: 'thin', color: { argb: 'AAAAAA' } },
						bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
						right: { style: 'thin', color: { argb: 'AAAAAA' } },
					};

					//F
					sheetPlayer.getCell(`F${countRowDataPlayer}`).value = countInCorrect;

					sheetPlayer.getCell(`F${countRowDataPlayer}`).font = {
						name: 'Arial',
						size: 13,
					};
					sheetPlayer.getCell(`F${countRowDataPlayer}`).alignment = {
						vertical: 'middle',
						horizontal: 'center',
					};
					sheetPlayer.getCell(`F${countRowDataPlayer}`).border = {
						top: { style: 'thin', color: { argb: 'AAAAAA' } },
						left: { style: 'thin', color: { argb: 'AAAAAA' } },
						bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
						right: { style: 'thin', color: { argb: 'AAAAAA' } },
					};

					//G
					sheetPlayer.getCell(`G${countRowDataPlayer}`).value = countUnanswered;

					sheetPlayer.getCell(`G${countRowDataPlayer}`).font = {
						name: 'Arial',
						size: 13,
					};
					sheetPlayer.getCell(`G${countRowDataPlayer}`).alignment = {
						vertical: 'middle',
						horizontal: 'center',
					};
					sheetPlayer.getCell(`G${countRowDataPlayer}`).border = {
						top: { style: 'thin', color: { argb: 'AAAAAA' } },
						left: { style: 'thin', color: { argb: 'AAAAAA' } },
						bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
						right: { style: 'thin', color: { argb: 'AAAAAA' } },
					};

					countRowDataPlayer++;
				}

				//A1 QUESTION DATA
				sheetQuestion.getCell('A1').value = '#';
				sheetQuestion.getCell('A1').font = {
					name: 'Arial',
					size: 13,
					color: {
						argb: '7232B1',
					},
					bold: true,
				};
				sheetQuestion.getCell('A1').fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: 'E7DDF2' },
				};
				sheetQuestion.getRow(1).height = 50;
				sheetQuestion.getColumn(1).width = 7;
				sheetQuestion.getCell('A1').alignment = {
					vertical: 'middle',
					horizontal: 'center',
				};
				sheetQuestion.getCell('A1').border = {
					top: { style: 'thin', color: { argb: 'AAAAAA' } },
					left: { style: 'thin', color: { argb: 'AAAAAA' } },
					bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
					right: { style: 'thin', color: { argb: 'AAAAAA' } },
				};

				//B1 QUESTION DATA
				sheetQuestion.getCell('B1').value = 'Question';
				sheetQuestion.getCell('B1').font = {
					name: 'Arial',
					size: 13,
					color: {
						argb: '7232B1',
					},
					bold: true,
				};
				sheetQuestion.getCell('B1').fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: 'E7DDF2' },
				};
				sheetQuestion.getColumn(2).width = 60;
				sheetQuestion.getCell('B1').alignment = {
					vertical: 'middle',
					horizontal: 'center',
					wrapText: true,
				};
				sheetQuestion.getCell('B1').border = {
					top: { style: 'thin', color: { argb: 'AAAAAA' } },
					left: { style: 'thin', color: { argb: 'AAAAAA' } },
					bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
					right: { style: 'thin', color: { argb: 'AAAAAA' } },
				};

				//C1 QUESTION DATA
				sheetQuestion.getCell('C1').value = 'Question Type';
				sheetQuestion.getCell('C1').font = {
					name: 'Arial',
					size: 13,
					color: {
						argb: '7232B1',
					},
					bold: true,
				};
				sheetQuestion.getCell('C1').fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: 'E7DDF2' },
				};
				sheetQuestion.getColumn(3).width = 35;
				sheetQuestion.getCell('C1').alignment = {
					vertical: 'middle',
					horizontal: 'center',
					wrapText: true,
				};
				sheetQuestion.getCell('C1').border = {
					top: { style: 'thin', color: { argb: 'AAAAAA' } },
					left: { style: 'thin', color: { argb: 'AAAAAA' } },
					bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
					right: { style: 'thin', color: { argb: 'AAAAAA' } },
				};

				//D1 QUESTION DATA
				sheetQuestion.getCell('D1').value = 'Question Accuracy';
				sheetQuestion.getCell('D1').font = {
					name: 'Arial',
					size: 13,
					color: {
						argb: '7232B1',
					},
					bold: true,
				};
				sheetQuestion.getCell('D1').fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: 'E7DDF2' },
				};
				sheetQuestion.getColumn(4).width = 15;
				sheetQuestion.getCell('D1').alignment = {
					vertical: 'middle',
					horizontal: 'center',
					wrapText: true,
				};
				sheetQuestion.getCell('D1').border = {
					top: { style: 'thin', color: { argb: 'AAAAAA' } },
					left: { style: 'thin', color: { argb: 'AAAAAA' } },
					bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
					right: { style: 'thin', color: { argb: 'AAAAAA' } },
				};

				//E1 QUESTION DATA
				sheetQuestion.getCell('E1').value = 'Average Time per Question (s)';
				sheetQuestion.getCell('E1').font = {
					name: 'Arial',
					size: 13,
					color: {
						argb: '7232B1',
					},
					bold: true,
				};
				sheetQuestion.getCell('E1').fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: 'E7DDF2' },
				};
				sheetQuestion.getColumn(5).width = 25;
				sheetQuestion.getCell('E1').alignment = {
					vertical: 'middle',
					horizontal: 'center',
					wrapText: true,
				};
				sheetQuestion.getCell('E1').border = {
					top: { style: 'thin', color: { argb: 'AAAAAA' } },
					left: { style: 'thin', color: { argb: 'AAAAAA' } },
					bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
					right: { style: 'thin', color: { argb: 'AAAAAA' } },
				};

				//F1 QUESTION DATA
				sheetQuestion.getCell('F1').value = 'Correct';
				sheetQuestion.getCell('F1').font = {
					name: 'Arial',
					size: 13,
					bold: true,
				};
				sheetQuestion.getCell('F1').fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: 'D9F7ED' },
				};
				sheetQuestion.getColumn(6).width = 18;
				sheetQuestion.getCell('F1').alignment = {
					vertical: 'middle',
					horizontal: 'center',
					wrapText: true,
				};
				sheetQuestion.getCell('F1').border = {
					top: { style: 'thin', color: { argb: 'AAAAAA' } },
					left: { style: 'thin', color: { argb: 'AAAAAA' } },
					bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
					right: { style: 'thin', color: { argb: 'AAAAAA' } },
				};

				//G1 QUESTION DATA
				sheetQuestion.getCell('G1').value = 'Incorrect';
				sheetQuestion.getCell('G1').font = {
					name: 'Arial',
					size: 13,
					bold: true,
				};
				sheetQuestion.getCell('G1').fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: 'FCDBE3' },
				};
				sheetQuestion.getColumn(7).width = 18;
				sheetQuestion.getCell('G1').alignment = {
					vertical: 'middle',
					horizontal: 'center',
					wrapText: true,
				};
				sheetQuestion.getCell('G1').border = {
					top: { style: 'thin', color: { argb: 'AAAAAA' } },
					left: { style: 'thin', color: { argb: 'AAAAAA' } },
					bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
					right: { style: 'thin', color: { argb: 'AAAAAA' } },
				};

				//H1 QUESTION DATA
				sheetQuestion.getCell('H1').value = 'Unanswered';
				sheetQuestion.getCell('H1').font = {
					name: 'Arial',
					size: 13,
					bold: true,
				};
				sheetQuestion.getCell('H1').fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: 'E5E5E5' },
				};
				sheetQuestion.getColumn(8).width = 18;
				sheetQuestion.getCell('H1').alignment = {
					vertical: 'middle',
					horizontal: 'center',
					wrapText: true,
				};
				sheetQuestion.getCell('H1').border = {
					top: { style: 'thin', color: { argb: 'AAAAAA' } },
					left: { style: 'thin', color: { argb: 'AAAAAA' } },
					bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
					right: { style: 'thin', color: { argb: 'AAAAAA' } },
				};

				let countRowDataQuestion = 2;
				let countQuestionAccuracy = 0;
				let countAverageTime = 0;
				let countTotalCorrectQuestion = 0;
				let countTotalIncorrectQuestion = 0;
				let countTotalUnAnsweredQuestion = 0;
				for (let i = 0; i < dataReport.questions.length; i++) {
					let countCorrectAnswered = 0;
					let countIncorrectAnswered = 0;
					countQuestionAccuracy += dataReport.questions[i].percentRight;
					countAverageTime += dataReport.questions[i].avgAnswersTime;

					let countColQuestionPlayer = 9;
					for (
						let j = 0;
						j < dataReport.questions[i].detailAllPlayers.length;
						j++
					) {
						if (dataReport.questions[i].detailAllPlayers[j].correct) {
							countCorrectAnswered += 1;
						} else {
							countIncorrectAnswered += 1;
						}
						let dataAnswer = '';

						for (
							let z = 0;
							z < dataReport.questions[i].detailAllPlayers[j].answered.length;
							z++
						) {
							if (
								z !==
								dataReport.questions[i].detailAllPlayers[j].answered.length - 1
							) {
								dataAnswer +=
									dataReport.questions[i].detailAllPlayers[j].answered[z] + ',';
							} else {
								dataAnswer +=
									dataReport.questions[i].detailAllPlayers[j].answered[z];
							}
						}
						sheetQuestion.getColumn(countColQuestionPlayer).width = 20;

						sheetQuestion
							.getRow(countRowDataQuestion)
							.getCell(countColQuestionPlayer).font = {
							name: 'Arial',
							size: 13,
						};

						sheetQuestion
							.getRow(countRowDataQuestion)
							.getCell(countColQuestionPlayer).alignment = {
							vertical: 'middle',
							horizontal: 'left',
							wrapText: true,
						};
						sheetQuestion
							.getRow(countRowDataQuestion)
							.getCell(countColQuestionPlayer).border = {
							top: { style: 'thin', color: { argb: 'AAAAAA' } },
							left: { style: 'thin', color: { argb: 'AAAAAA' } },
							bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
							right: { style: 'thin', color: { argb: 'AAAAAA' } },
						};
						if (dataReport.questions[i].detailAllPlayers[j].time !== -1) {
							sheetQuestion
								.getRow(countRowDataQuestion)
								.getCell(countColQuestionPlayer).value = dataAnswer;
							sheetQuestion
								.getRow(countRowDataQuestion)
								.getCell(countColQuestionPlayer).fill = {
								type: 'pattern',
								pattern: 'solid',
								fgColor: {
									argb: dataReport.questions[i].detailAllPlayers[j].correct
										? 'D9F7ED'
										: 'FCDBE3',
								},
							};
						} else {
							sheetQuestion
								.getRow(countRowDataQuestion)
								.getCell(countColQuestionPlayer).fill = {
								type: 'pattern',
								pattern: 'solid',
								fgColor: { argb: 'E5E5E5' },
							};
						}

						countColQuestionPlayer++;
					}

					countTotalCorrectQuestion += countCorrectAnswered;
					countTotalIncorrectQuestion += countIncorrectAnswered;
					countTotalUnAnsweredQuestion +=
						dataReport.questions[i].dataQuestion.countPlayerNoAnswer;

					sheetQuestion.getRow(countRowDataQuestion).height = 23;
					//A
					sheetQuestion.getCell(`A${countRowDataQuestion}`).value = i + 1;
					sheetQuestion.getCell(`A${countRowDataQuestion}`).font = {
						name: 'Arial',
						size: 13,
						wrapText: true,
					};
					sheetQuestion.getCell(`A${countRowDataQuestion}`).alignment = {
						vertical: 'middle',
						horizontal: 'center',
					};
					sheetQuestion.getCell(`A${countRowDataQuestion}`).border = {
						top: { style: 'thin', color: { argb: 'AAAAAA' } },
						left: { style: 'thin', color: { argb: 'AAAAAA' } },
						bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
						right: { style: 'thin', color: { argb: 'AAAAAA' } },
					};

					//B
					sheetQuestion.getCell(`B${countRowDataQuestion}`).value =
						dataReport.questions[i].dataQuestion.content;
					sheetQuestion.getCell(`B${countRowDataQuestion}`).font = {
						name: 'Arial',
						size: 13,
					};
					sheetQuestion.getCell(`B${countRowDataQuestion}`).alignment = {
						vertical: 'middle',
						horizontal: 'center',
						wrapText: true,
					};
					sheetQuestion.getCell(`B${countRowDataQuestion}`).border = {
						top: { style: 'thin', color: { argb: 'AAAAAA' } },
						left: { style: 'thin', color: { argb: 'AAAAAA' } },
						bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
						right: { style: 'thin', color: { argb: 'AAAAAA' } },
					};

					//C
					sheetQuestion.getCell(`C${countRowDataQuestion}`).value =
						checkTypeQuestion(dataReport.questions[i].dataQuestion.type);
					sheetQuestion.getCell(`C${countRowDataQuestion}`).font = {
						name: 'Arial',
						size: 13,
					};
					sheetQuestion.getCell(`C${countRowDataQuestion}`).alignment = {
						vertical: 'middle',
						horizontal: 'center',
						wrapText: true,
					};
					sheetQuestion.getCell(`C${countRowDataQuestion}`).border = {
						top: { style: 'thin', color: { argb: 'AAAAAA' } },
						left: { style: 'thin', color: { argb: 'AAAAAA' } },
						bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
						right: { style: 'thin', color: { argb: 'AAAAAA' } },
					};

					//D
					sheetQuestion.getCell(`D${countRowDataQuestion}`).value =
						dataReport.questions[i].percentRight + '%';
					sheetQuestion.getCell(`D${countRowDataQuestion}`).font = {
						name: 'Arial',
						size: 13,
					};
					sheetQuestion.getCell(`D${countRowDataQuestion}`).alignment = {
						vertical: 'middle',
						horizontal: 'center',
						wrapText: true,
					};
					sheetQuestion.getCell(`D${countRowDataQuestion}`).border = {
						top: { style: 'thin', color: { argb: 'AAAAAA' } },
						left: { style: 'thin', color: { argb: 'AAAAAA' } },
						bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
						right: { style: 'thin', color: { argb: 'AAAAAA' } },
					};

					//E
					sheetQuestion.getCell(`E${countRowDataQuestion}`).value =
						dataReport.questions[i].avgAnswersTime;
					sheetQuestion.getCell(`E${countRowDataQuestion}`).font = {
						name: 'Arial',
						size: 13,
					};
					sheetQuestion.getCell(`E${countRowDataQuestion}`).alignment = {
						vertical: 'middle',
						horizontal: 'center',
						wrapText: true,
					};
					sheetQuestion.getCell(`E${countRowDataQuestion}`).border = {
						top: { style: 'thin', color: { argb: 'AAAAAA' } },
						left: { style: 'thin', color: { argb: 'AAAAAA' } },
						bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
						right: { style: 'thin', color: { argb: 'AAAAAA' } },
					};

					//F
					sheetQuestion.getCell(`F${countRowDataQuestion}`).value =
						countCorrectAnswered;
					sheetQuestion.getCell(`F${countRowDataQuestion}`).font = {
						name: 'Arial',
						size: 13,
					};
					sheetQuestion.getCell(`F${countRowDataQuestion}`).alignment = {
						vertical: 'middle',
						horizontal: 'center',
						wrapText: true,
					};
					sheetQuestion.getCell(`F${countRowDataQuestion}`).border = {
						top: { style: 'thin', color: { argb: 'AAAAAA' } },
						left: { style: 'thin', color: { argb: 'AAAAAA' } },
						bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
						right: { style: 'thin', color: { argb: 'AAAAAA' } },
					};

					//G
					sheetQuestion.getCell(`G${countRowDataQuestion}`).value =
						countIncorrectAnswered;
					sheetQuestion.getCell(`G${countRowDataQuestion}`).font = {
						name: 'Arial',
						size: 13,
					};
					sheetQuestion.getCell(`G${countRowDataQuestion}`).alignment = {
						vertical: 'middle',
						horizontal: 'center',
						wrapText: true,
					};
					sheetQuestion.getCell(`G${countRowDataQuestion}`).border = {
						top: { style: 'thin', color: { argb: 'AAAAAA' } },
						left: { style: 'thin', color: { argb: 'AAAAAA' } },
						bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
						right: { style: 'thin', color: { argb: 'AAAAAA' } },
					};

					//H
					sheetQuestion.getCell(`H${countRowDataQuestion}`).value =
						dataReport.questions[i].dataQuestion.countPlayerNoAnswer;
					sheetQuestion.getCell(`H${countRowDataQuestion}`).font = {
						name: 'Arial',
						size: 13,
					};
					sheetQuestion.getCell(`H${countRowDataQuestion}`).alignment = {
						vertical: 'middle',
						horizontal: 'center',
						wrapText: true,
					};
					sheetQuestion.getCell(`H${countRowDataQuestion}`).border = {
						top: { style: 'thin', color: { argb: 'AAAAAA' } },
						left: { style: 'thin', color: { argb: 'AAAAAA' } },
						bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
						right: { style: 'thin', color: { argb: 'AAAAAA' } },
					};

					countRowDataQuestion++;
				}

				///XỬ LÝ DATA TỪNG LOẠI NGƯỜI CHƠI CHO TỪNG CÂU HỎI
				let countColumPlayerQuestion = 9;
				for (let i = 0; i < dataReport.players.length; i++) {
					//sheetQuestion.getColumn(countColumPlayerQuestion).width = 20;
					sheetQuestion.getRow(1).getCell(countColumPlayerQuestion).value =
						dataReport.players[i].name;

					sheetQuestion.getRow(1).getCell(countColumPlayerQuestion).font = {
						name: 'Arial',
						color: {
							argb: '7B3F04',
						},
						size: 13,
						bold: true,
					};
					sheetQuestion.getRow(1).getCell(countColumPlayerQuestion).fill = {
						type: 'pattern',
						pattern: 'solid',
						fgColor: { argb: 'FFEDCC' },
					};
					sheetQuestion.getRow(1).getCell(countColumPlayerQuestion).alignment =
					{
						vertical: 'middle',
						horizontal: 'center',
						wrapText: true,
					};
					sheetQuestion.getRow(1).getCell(countColumPlayerQuestion).border = {
						top: { style: 'thin', color: { argb: 'AAAAAA' } },
						left: { style: 'thin', color: { argb: 'AAAAAA' } },
						bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
						right: { style: 'thin', color: { argb: 'AAAAAA' } },
					};

					countColumPlayerQuestion++;
				}

				//---------
				if (dataReport.questions.length !== 0) {
					countQuestionAccuracy = Number.parseFloat(
						countQuestionAccuracy / dataReport.questions.length,
					).toFixed(2);
				}

				//DÒNG TỔNG KẾT BÊN QUESTION DÀNH CHO NGƯỜI CHƠI
				let startColumPlayerQuestionSheet = 9;
				for (let i = 0; i < dataReport.players.length; i++) {
					sheetQuestion
						.getRow(countRowDataQuestion)
						.getCell(startColumPlayerQuestionSheet).value =
						dataReport.players[i].correctPercentAnswers + '%';

					sheetQuestion
						.getRow(countRowDataQuestion)
						.getCell(startColumPlayerQuestionSheet).font = {
						name: 'Arial',
						size: 13,
						color: {
							argb: 'FFFFFF',
						},
						bold: true,
					};
					sheetQuestion
						.getRow(countRowDataQuestion)
						.getCell(startColumPlayerQuestionSheet).fill = {
						type: 'pattern',
						pattern: 'solid',
						fgColor: { argb: '864CBF' },
					};
					sheetQuestion
						.getRow(countRowDataQuestion)
						.getCell(startColumPlayerQuestionSheet).alignment = {
						vertical: 'middle',
						horizontal: 'center',
						wrapText: true,
					};
					sheetQuestion
						.getRow(countRowDataQuestion)
						.getCell(startColumPlayerQuestionSheet).border = {
						top: { style: 'thin', color: { argb: 'AAAAAA' } },
						left: { style: 'thin', color: { argb: 'AAAAAA' } },
						bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
						right: { style: 'thin', color: { argb: 'AAAAAA' } },
					};
					startColumPlayerQuestionSheet++;
				}

				//dòng tổng kết bên question
				sheetQuestion.mergeCells(
					`A${countRowDataQuestion}:C${countRowDataQuestion}`,
				);
				sheetQuestion.getCell(`A${countRowDataQuestion}`).font = {
					name: 'Arial',
					size: 13,
					color: {
						argb: 'FFFFFF',
					},
					bold: true,
				};
				sheetQuestion.getCell(`A${countRowDataQuestion}`).fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: '864CBF' },
				};
				sheetQuestion.getRow(countRowDataQuestion).height = 23;
				sheetQuestion.getCell(`A${countRowDataQuestion}`).alignment = {
					vertical: 'middle',
					horizontal: 'left',
				};
				sheetQuestion.getCell(`A${countRowDataQuestion}`).border = {
					top: { style: 'thin', color: { argb: 'AAAAAA' } },
					left: { style: 'thin', color: { argb: 'AAAAAA' } },
					bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
					right: { style: 'thin', color: { argb: 'AAAAAA' } },
				};

				//D
				sheetQuestion.getCell(`D${countRowDataQuestion}`).value =
					countQuestionAccuracy + '%';
				sheetQuestion.getCell(`D${countRowDataQuestion}`).font = {
					name: 'Arial',
					size: 13,
					color: {
						argb: 'FFFFFF',
					},
					bold: true,
				};
				sheetQuestion.getCell(`D${countRowDataQuestion}`).fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: '864CBF' },
				};
				sheetQuestion.getRow(countRowDataQuestion).height = 23;
				sheetQuestion.getCell(`D${countRowDataQuestion}`).alignment = {
					vertical: 'middle',
					horizontal: 'center',
				};
				sheetQuestion.getCell(`D${countRowDataQuestion}`).border = {
					top: { style: 'thin', color: { argb: 'AAAAAA' } },
					left: { style: 'thin', color: { argb: 'AAAAAA' } },
					bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
					right: { style: 'thin', color: { argb: 'AAAAAA' } },
				};

				//E
				sheetQuestion.getCell(`E${countRowDataQuestion}`).value =
					countAverageTime;
				sheetQuestion.getCell(`E${countRowDataQuestion}`).font = {
					name: 'Arial',
					size: 13,
					color: {
						argb: 'FFFFFF',
					},
					bold: true,
				};
				sheetQuestion.getCell(`E${countRowDataQuestion}`).fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: '864CBF' },
				};
				sheetQuestion.getRow(countRowDataQuestion).height = 23;
				sheetQuestion.getCell(`E${countRowDataQuestion}`).alignment = {
					vertical: 'middle',
					horizontal: 'center',
				};
				sheetQuestion.getCell(`E${countRowDataQuestion}`).border = {
					top: { style: 'thin', color: { argb: 'AAAAAA' } },
					left: { style: 'thin', color: { argb: 'AAAAAA' } },
					bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
					right: { style: 'thin', color: { argb: 'AAAAAA' } },
				};

				//F
				sheetQuestion.getCell(`F${countRowDataQuestion}`).value =
					countTotalCorrectQuestion;
				sheetQuestion.getCell(`F${countRowDataQuestion}`).font = {
					name: 'Arial',
					size: 13,
					color: {
						argb: 'FFFFFF',
					},
					bold: true,
				};
				sheetQuestion.getCell(`F${countRowDataQuestion}`).fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: '864CBF' },
				};
				sheetQuestion.getRow(countRowDataQuestion).height = 23;
				sheetQuestion.getCell(`F${countRowDataQuestion}`).alignment = {
					vertical: 'middle',
					horizontal: 'center',
				};
				sheetQuestion.getCell(`F${countRowDataQuestion}`).border = {
					top: { style: 'thin', color: { argb: 'AAAAAA' } },
					left: { style: 'thin', color: { argb: 'AAAAAA' } },
					bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
					right: { style: 'thin', color: { argb: 'AAAAAA' } },
				};

				//G
				sheetQuestion.getCell(`G${countRowDataQuestion}`).value =
					countTotalIncorrectQuestion;
				sheetQuestion.getCell(`G${countRowDataQuestion}`).font = {
					name: 'Arial',
					size: 13,
					color: {
						argb: 'FFFFFF',
					},
					bold: true,
				};
				sheetQuestion.getCell(`G${countRowDataQuestion}`).fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: '864CBF' },
				};
				sheetQuestion.getRow(countRowDataQuestion).height = 23;
				sheetQuestion.getCell(`G${countRowDataQuestion}`).alignment = {
					vertical: 'middle',
					horizontal: 'center',
				};
				sheetQuestion.getCell(`G${countRowDataQuestion}`).border = {
					top: { style: 'thin', color: { argb: 'AAAAAA' } },
					left: { style: 'thin', color: { argb: 'AAAAAA' } },
					bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
					right: { style: 'thin', color: { argb: 'AAAAAA' } },
				};

				//H
				sheetQuestion.getCell(`H${countRowDataQuestion}`).value =
					countTotalUnAnsweredQuestion;
				sheetQuestion.getCell(`H${countRowDataQuestion}`).font = {
					name: 'Arial',
					size: 13,
					color: {
						argb: 'FFFFFF',
					},
					bold: true,
				};
				sheetQuestion.getCell(`H${countRowDataQuestion}`).fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: '864CBF' },
				};
				sheetQuestion.getRow(countRowDataQuestion).height = 23;
				sheetQuestion.getCell(`H${countRowDataQuestion}`).alignment = {
					vertical: 'middle',
					horizontal: 'center',
				};
				sheetQuestion.getCell(`H${countRowDataQuestion}`).border = {
					top: { style: 'thin', color: { argb: 'AAAAAA' } },
					left: { style: 'thin', color: { argb: 'AAAAAA' } },
					bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
					right: { style: 'thin', color: { argb: 'AAAAAA' } },
				};

				const d = new Date();
				const __filename = fileURLToPath(import.meta.url);
				const __dirname = dirname(__filename);
				// const pathFile = path.join(
				// 	__dirname,
				// 	`../../../FileUpload/${d.getTime()}.xlsx`,
				// );

				const pathFile = path.join(__dirname, '../../../FileUpload/KOOL.xlsx');
				await workbook.xlsx.writeFile(pathFile);

				let upload_stream = await cloudinary.v2.uploader.upload(
					pathFile,
					{
						resource_type: 'raw',
					},
					// 	// function (err, file) {
					// 	// 	console.log('** Stream Upload');
					// 	// 	if (err) {
					// 	// 		console.warn(err);
					// 	// 		return;
					// 	// 	}
					// 	// 	console.log('* Same image, uploaded via stream');
					// 	// 	// console.log('* ' + image.public_id);
					// 	// 	console.log('* ', file);
					// 	// 	url = file.secure_url;
					// 	// },
				);

				// fs.createReadStream(pathFile).pipe(upload_stream);

				// await Report.findByIdAndUpdate(
				// 	{ _id: dataReport._id },
				// 	{ exist: upload_stream.public_id },
				// );

				if (fs.existsSync(pathFile)) {
					console.log('vào xóa file');
					fs.unlink(pathFile, (err) => {
						if (err) throw err;
						console.log('successfully deleted');
					});
				}

				//console.log('chua ton tai', upload_stream);

				return upload_stream.secure_url; //'Done';
			} catch (error) {
				console.log(error);
			}
		},

		GetAllReports: async (
			parent,
			{ page, limit, sort, typeSort },
			{ idUser, Report },
			info,
		) => {
			try {
				const pageA = page || 1;
				const limitA = limit || 10;
				const startIndex = (pageA - 1) * limitA;
				let sortData = { createdAt: -1 };
				if (typeSort) {
					if (typeSort === 'name') {
						sortData = { name: sort };
					} else if (typeSort === 'createdAt') {
						sortData = { createdAt: sort };
					} else {
						sortData = {
							players: sort,
						};
					}
				}

				let countReports = await Report.countDocuments({
					userId: idUser,
				}).exec();

				countReports = Math.ceil(countReports / limitA);

				const newReports = await Report.find({ userId: idUser })
					.skip(startIndex)
					.limit(limitA)
					.sort(sortData)
					.lean()
					.exec();

				//console.log(newReports);

				return {
					reports: newReports,
					totalPages: countReports,
					page: pageA,
				};
			} catch (error) {
				throw new ApolloError(error.message, '500');
			}
		},

		GetDetailReport: async (parent, { reportId }, { idUser, Report }, info) => {
			try {
				console.log('dddd', reportId)

				const newReports = await Report.findById({ _id: reportId })
					.populate({
						path: 'userId',
						select: 'name -_id',
					})
					.lean()
					.exec();

				const difficultQuestions = [];
				const needHelp = [];
				const playersDidNotFinish = [];

				for (let i = 0; i < newReports.questions.length; i++) {
					if (newReports.questions[i].percentRight < 30) {
						difficultQuestions.push(newReports.questions[i]);
					}
				}

				for (let i = 0; i < newReports.players.length; i++) {
					if (newReports.players[i].correctPercentAnswers < 30) {
						needHelp.push(newReports.players[i]);
					}

					if (
						newReports.players[i].unAnswered >
						newReports.questions.length / 2
					) {
						playersDidNotFinish.push(newReports.players[i]);
					}
				}

				newReports.nameUser = newReports.userId.name;
				newReports.difficultQuestions = difficultQuestions;
				newReports.needHelp = needHelp;
				newReports.playersDidNotFinish = playersDidNotFinish;

				return newReports;
			} catch (error) {
				throw new ApolloError(error.message, '500');
			}
		},

		SearchReport: async (
			parent,
			{ textSearch, page, limit, sort, typeSort },
			{ idUser, Report },
			info,
		) => {
			try {
				const pageA = page || 1;
				const limitA = limit || 10;
				const startIndex = (pageA - 1) * limitA;

				let searchText = textSearch.trim();
				const $regex = escapeStringRegexp(searchText);
				let sortData = { createdAt: -1 };
				if (typeSort) {
					if (typeSort === 'name') {
						sortData = { name: sort };
					} else if (typeSort === 'createdAt') {
						sortData = { createdAt: sort };
					} else {
						sortData = {
							players: sort,
						};
					}
				}

				let countReports = await Report.countDocuments({
					name: { $regex, $options: '$i' },
					userId: idUser,
				}).exec();

				countReports = Math.ceil(countReports / limitA);

				const newReports = await Report.find({
					name: { $regex, $options: '$i' },
					userId: idUser,
				})
					.skip(startIndex)
					.limit(limitA)
					.sort(sortData)
					.lean()
					.exec();

				return {
					reports: newReports,
					totalPages: countReports,
					page: pageA,
				};
			} catch (error) {
				throw new ApolloError(error.message, '500');
			}
		},
	},
	Mutation: {
		EditReport: async (parent, { reportId, name }, { Report }, info) => {
			try {
				const newReport = await Report.findByIdAndUpdate(
					{
						_id: reportId,
					},
					{ name },
					{ new: true },
				);

				return {
					message: 'Edit report success',
					report: newReport,
				};
			} catch (error) {
				throw new ApolloError(error.message, '500');
			}
		},

		DeleteReport: async (parent, { reportId, name }, { Report }, info) => {
			try {
				console.log("ID report", reportId)
				await Report.findByIdAndDelete({ _id: reportId });
				return {
					message: 'Delete report success',
				};
			} catch (error) {
				throw new ApolloError(error.message, '500');
			}
		},
	},
};

function checkTypeQuestion(type) {
	if (type === 1) {
		return 'Single Choice';
	} else if (type === 2) {
		return 'Multiple Choice';
	} else if (type === 3) {
		return 'True False';
	} else if (type === 4) {
		return 'Fill-in-the-Blank';
	} else {
		return 'Poll';
	}
}
