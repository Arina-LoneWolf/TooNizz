import ExcelJS from 'exceljs';
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
		downloadReport: async (parent, { reportId }, { Report }, info) => {
			try {
				let dataReport = await Report.findById(reportId).lean();
				// console.log(dataReport.createdAt);
				// console.log(dataReport);

				if (dataReport.exist !== '') {
					const data = await cloudinary.v2.search
						.expression(`public_id=${dataReport.exist}`)
						.execute();

					console.log('da ton tai rp', data);
					let strUrl = data.resources[0].secure_url;
					return strUrl;
				} else {
					const workbook = new ExcelJS.Workbook();
					workbook.views = [
						{
							x: 0,
							y: 0,
							width: 10000,
							height: 20000,
							firstSheet: 0,
							activeTab: 1,
							visibility: 'visible',
						},
					];
					const sheet = workbook.addWorksheet('Overview', {
						views: [{ showGridLines: false }],
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
					sheet.getCell('A2').value = 'Played on';
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

					//A7
					sheet.getCell('A7').value = 'Total correct answers (%)';
					sheet.getCell('A7').font = {
						name: 'Arial',
						size: 12,
					};
					sheet.getCell('A7').fill = {
						type: 'pattern',
						pattern: 'solid',
						fgColor: { argb: 'F4F4F4' },
					};
					sheet.getRow(7).height = 26;
					sheet.getCell('A7').alignment = {
						vertical: 'middle',
						horizontal: 'left',
					};
					sheet.getCell('A7').border = {
						top: { style: 'thin', color: { argb: 'AAAAAA' } },
						left: { style: 'thin', color: { argb: 'AAAAAA' } },
						bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
						right: { style: 'thin', color: { argb: 'AAAAAA' } },
					};

					//A8
					sheet.getCell('A8').value = 'Total incorrect answers (%)';
					sheet.getCell('A8').font = {
						name: 'Arial',
						size: 12,
					};
					sheet.getCell('A8').fill = {
						type: 'pattern',
						pattern: 'solid',
						fgColor: { argb: 'F4F4F4' },
					};
					sheet.getRow(8).height = 26;
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

					//A9
					sheet.getCell('A9').value = 'Average score (points)';
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

					//BCDEFGH2
					let dateTimeRP = new Date(dataReport.createdAt);
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

					//ABCDEFGH6
					sheet.mergeCells('A6:H6');
					sheet.getRow(6).height = 26;
					sheet.getCell('A6').value = `Overall Performance`;
					sheet.getCell('A6').font = {
						name: 'Arial',
						size: 15,
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

					const d = new Date();
					const __filename = fileURLToPath(import.meta.url);
					const __dirname = dirname(__filename);
					// const pathFile = path.join(
					// 	__dirname,
					// 	`../../../FileUpload/${d.getTime()}.xlsx`,
					// );

					const pathFile = path.join(
						__dirname,
						'../../../FileUpload/KOOL.xlsx',
					);
					await workbook.xlsx.writeFile(pathFile);

					// let upload_stream = await cloudinary.v2.uploader.upload(
					// 	pathFile,
					// 	{
					// 		resource_type: 'raw',
					// 	},
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
					// );

					// fs.createReadStream(pathFile).pipe(upload_stream);

					// await Report.findByIdAndUpdate(
					// 	{ _id: dataReport._id },
					// 	{ exist: upload_stream.public_id },
					// );

					// if (fs.existsSync(pathFile)) {
					// 	console.log('vào xóa file');
					// 	fs.unlink(pathFile, (err) => {
					// 		if (err) throw err;
					// 		console.log('successfully deleted');
					// 	});
					// }

					//console.log('chua ton tai', upload_stream);

					return /*upload_stream.secure_url*/ 'Done';
				}
			} catch (error) {
				console.log(error);
			}
		},
	},
	Mutation: {},
};
