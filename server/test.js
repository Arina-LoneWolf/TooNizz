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
// console.log('test1', test1);
// console.log('sad', sad);
let array1 = ['nhat', 'vip', 'pro'],
	array2 = ['nhat'],
	array3 = ['vip', 'pro', 'nhat'];
let checker = (arr, target) => target.every((v) => arr.includes(v));
console.log(checker(array1, array3));
//arr3 đáp án đúng
//ar1 đáp án ng chơi
