let games = [
	{
		gamePin: '7034645',
	},
	{
		gamePin: '7034647',
	},
	{
		gamePin: '7034612',
	},
	{
		gamePin: '7034609',
	},
	{
		gamePin: '7034621',
	},
];

let kool = [
	{
		gamePin: '10',
		list: [
			{
				isCorrect: '1',
				isFalse: false,
			},
			{
				isCorrect: '3',
				isFalse: true,
			},
			{
				isCorrect: '5',
				isFalse: false,
			},
		],
	},
	{
		gamePin: '20',
		list: [
			{
				isCorrect: '10',
				isFalse: false,
			},
			{
				isCorrect: '30',
				isFalse: true,
			},
			{
				isCorrect: '50',
				isFalse: false,
			},
		],
	},
];
let sad = kool.filter((k) => k.gamePin === '10')[0];
//let sad = { ...kool[0] };
let test1 = { ...sad };
delete test1.list[0].isCorrect;
// delete test1.isCorrect;
// for (let j = 0; j < test1.length; j++) {
// 	delete test1.list[j].isCorrect;
// }

let kool11 = [
	{
		isCorrect: 0 === 'boolean' ? `0` : 0,
		isFalse: false,
	},
	{
		isCorrect: '10',
		isFalse: false,
	},
	{
		isCorrect: '30',
		isFalse: true,
	},
	{
		isCorrect: '50',
		isFalse: false,
	},
];
let koko = ['dasd', undefined, 'kol'];
let countUn = 0;
kool11 = kool11.filter((value) => {
	if (value.isCorrect !== undefined) return value;
});

function ordinal_suffix_of(i) {
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

// let rankScore = [900, 805, 741, 620, 400, 324, 236, 172, 90];
// for (let i = 0; i < rankScore.length; i++) {
// 	let indexArr = i + 1; //rankScore.indexOf(rankScore[i]) + 1;
// 	console.log(indexArr);
// 	//if()
// }

// console.log('dem un', 0 === undefined);
//console.log('kool11', kool11);

let date = new Date(1641227223622);
date = date.toUTCString(); //.split(' ');
console.log(date);

// let timeNow = new Date('2022-01-03T16:26:13.088Z');
// let timeAddGMT = new Date(
// 	timeNow.getTime() + -timeNow.getTimezoneOffset() * 60000,
// );
// console.log(timeAddGMT.toUTCString());
//--inspect
