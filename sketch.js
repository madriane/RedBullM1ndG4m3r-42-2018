
var players;
var activePlayerId = 0;
var gameMap;
var gameCanvas = {w:680, h:480};
var blockIds = [
	[129,19,19,19,19,19,19,19,113],
	[51,15,15,15,15,15,15,15,67],
	[51,15,15,15,15,15,15,15,67],
	[51,15,15,15,15,15,15,15,67],
	[51,15,15,15,15,15,15,15,67],
	[97,35,35,35,35,35,35,35,81]
];

var move_number = 0;

function preload() {img = loadImage('tilesetbase.png');}

function setup() {
	gameMap = new Map(img, blockIds, gameCanvas, 2);
	gameMap.init();
	players = [
		new Player('WATER', 1, 1, gameMap.getMapWidth(), gameMap.getMapHeight(), gameMap.getTilesz()),
		new Player('FIRE', gameMap.getMapWidth(), gameMap.getMapHeight(), gameMap.getMapWidth(), gameMap.getMapHeight(), gameMap.getTilesz())
	];
}

function draw() {
	translate((gameCanvas.w - gameMap.getGameWidth() * gameMap.getTilesz())/2, (gameCanvas.h - gameMap.getGameHeight() * gameMap.getTilesz())/2);
	background(2);
	stroke(0);
	fill(51);
	rect(0, 0, gameMap.getGameWidth() * gameMap.getTilesz(), gameMap.getGameHeight() * gameMap.getTilesz());
	stroke(255);
	gameMap.drawMap();
	players.forEach((p, i)=>{
		if (activePlayerId === i)
			stroke(255);
		else
			stroke(0);
		p.show();
	});
	noFill();
	stroke('#E33');
	gameMap.getObjectives(activePlayerId).forEach((objective, i) => {
		rect(objective.x * gameMap.getTilesz(), objective.y * gameMap.getTilesz(), gameMap.getTilesz(), gameMap.getTilesz());
	});

}

function keyPressed() {
	let player = players[activePlayerId];
	switch (keyCode) {
		case 39:
			player.move(1, 0);
			break;
		case 37:
			player.move(-1, 0);
			break;
		case 38:
			player.move(0, -1);
			break;
		case 40:
			player.move(0, 1);
			break;
		default:
			break;
	}
	move_number++;
	players.forEach((p, i)=> {
		if (i != activePlayerId)
			p.getNMove(move_number);
	});
	
	if (isInArray(player.pos, gameMap.getObjectives(activePlayerId)))
	{
		move_number = 0;
		activePlayerId = (activePlayerId + 1) % players.length;
		players[activePlayerId].clearOldMoves();
		if (0==activePlayerId)
			gameMap.getNextObjectives();
		players.forEach((p, i)=> {
			p.resetPos();
		});
	}
}

clony = (obj) => JSON.parse(JSON.stringify(obj))
comp = (obj1, obj2) => (JSON.stringify(obj1) === JSON.stringify(obj2))

function isInArray(value, arr) {
	let found = false;
	arr.forEach((elem, i)=>{
		if (comp(elem, value)) {
			found = true;
		}
	});
	return (found);
}

function isIn2DArray(value, arr) {
	let found = false;
	arr.forEach((elems, i)=>{
		elems.forEach((elem, i)=>{
			if (comp(elem, value)) {
				found = true;
			}
		});
	});
	return (found);
}
