
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
var max_move_nbr = 15;

var gameOver = false;

function preload() {img = loadImage('tilesetbase.png'); sprites = loadImage('sprite.png');}

function setup() {
	gameMap = new Map(img, blockIds, gameCanvas, 4);
	gameMap.init();
	players = [
		new Player('AIR', 1, 1, gameMap.getMapWidth(), gameMap.getMapHeight(), gameMap.getTilesz(), sprites, 0),
		new Player('WATER', 1, gameMap.getMapHeight(), gameMap.getMapWidth(), gameMap.getMapHeight(), gameMap.getTilesz(), sprites, 1),
		new Player('EARTH', gameMap.getMapWidth(), 1, gameMap.getMapWidth(), gameMap.getMapHeight(), gameMap.getTilesz(), sprites, 2),
		new Player('FIRE', gameMap.getMapWidth(), gameMap.getMapHeight(), gameMap.getMapWidth(), gameMap.getMapHeight(), gameMap.getTilesz(), sprites, 3)
	];
	takenObjectives = [];
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
			;
		else
			p.showDirection(move_number + 1);
		p.show();
	});
	stroke(0);
	players.forEach((p, i) => {
		fill(p.colorWithAlpha(i === activePlayerId ? 1 : 0.5));
		gameMap.getObjectives(i).forEach((objective, j) => {
			if (i === activePlayerId && isInArray(objective, takenObjectives))
				fill('yellow');
			ellipse(objective.x * gameMap.getTilesz() + gameMap.getTilesz() / 2, objective.y * gameMap.getTilesz() + gameMap.getTilesz() / 2, gameMap.getTilesz() / 2);
			fill(p.colorWithAlpha(i === activePlayerId ? 1 : 0.5));
		});
	});
	fill(255);
	textSize(32);
	text(move_number + '/' + max_move_nbr + ' MOVES', 0, 30);
	if (gameOver) {
		fill('#E23');
		text('Game Over', 250, 30);
	}
}

function keyPressed() {
	if (players[activePlayerId].isMoving || gameOver)
		return ;
	let player = players[activePlayerId];
	switch (keyCode) {
		case 37:
			if (!gameMap.isMovable(activePlayerId, players, 0))
				return ;
			player.move(-1, 0);
			break;
		case 38:
			if (!gameMap.isMovable(activePlayerId, players, 1))
				return ;
			player.move(0, -1);
			break;
		case 39:
			if (!gameMap.isMovable(activePlayerId, players, 2))
				return ;
			player.move(1, 0);
			break;
		case 40:
			if (!gameMap.isMovable(activePlayerId, players, 3))
				return ;
			player.move(0, 1);
			break;
		default:
			return ;
	}
	move_number++;
	players.forEach((p, i)=> {
		if (i != activePlayerId)
			p.getNMove(move_number);
	});
}

function testForObjectives() {
		if (isInArray(players[activePlayerId].pos, gameMap.getObjectives(activePlayerId))
			&& !isInArray(players[activePlayerId].pos, takenObjectives)) {
			takenObjectives.push(players[activePlayerId].pos);
		}
		if (takenObjectives.length === gameMap.getObjectives(activePlayerId).length)
		{
			takenObjectives = [];
			move_number = 0;
			gameMap.getNextObjectives(activePlayerId);
			activePlayerId = (activePlayerId + 1) % players.length;
			if (activePlayerId === 0) {
				max_move_nbr += 5;
			}
			players[activePlayerId].clearOldMoves();
			players.forEach((p, i)=> {
				p.resetPos();
			});
		}
		else if (move_number === max_move_nbr)
		{
			gameOver = true;
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
