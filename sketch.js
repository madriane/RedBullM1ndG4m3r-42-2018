
var players;
var gameMap;
var spriteSz = 128;
var gameStarted = false;

var move_number;
var gameOver;
var activePlayer;
var animationFrame;
var animations;
var playersNbr;
var playersStart;

var tileSize;
var h;
var w;

var elements = {
	air: 0,
	water: 1,
	earth: 2,
	fire: 3
	};
var elementsArray = [
	'air',
	'water',
	'earth',
	'fire'
	];

function preload() {
	menu = loadImage('menu.png');
	img = loadImage('tilesetbase.png');
	sprites = loadImage('sprite.png');
	misc = loadImage('misc.png');
	ghost_fx = loadImage('ghost_fx.png');
}

function setup() {
	var win = window,
	d = document,
	e = d.documentElement,
	g = d.getElementsByTagName('body')[0],
	x = (win.innerWidth || e.clientWidth || g.clientWidth) - 20,
	y = (win.innerHeight|| e.clientHeight|| g.clientHeight) - 20;

	let size_x = 24;
	let size_y = 16;

	tileSize = min(x / size_x, y / size_y);

	w = tileSize * size_x;
	h = tileSize * size_y;

	canvas = createCanvas(w, h);
//	loadGame(map1);
}

function loadGame(map) {
	gameStarted = true;
	move_number = 0;
	gameOver = false;
	activePlayer = 'air';
	animationFrame = 0;
	animations = [];
	playersNbr = map.pawns;
	playersStart = map.starts;

	gameMap = new Map(img, map.tiles, map.objectives, playersNbr);
	gameMap.init();
	max_move_nbr = floor((gameMap.getMapWidth() + gameMap.getMapHeight() * 1.5) / 5) * 5;
	players = {};
	for (e in elements) {
		if (elements[e] < playersNbr) {
			players[e] = new Player(e, playersStart[e], gameMap.getTilesz(), 0);
		}
	}
}

function draw() {
	background(2);
	stroke(0);
	fill(51);
	stroke(255);
	if (gameStarted)
		drawGame();
	else
		drawMenu();
	animationFrame++;
}

function drawMenu() {
	rect(0, 0, w * tileSize, h * tileSize);
	image(menu, w / 2 - tileSize * 9.5, 2 * tileSize, tileSize * 19, tileSize * 2, 0, 0, spriteSz * 38, spriteSz * 4);
	if (mouseX > w / 2 - tileSize * 3.5 && mouseX < w / 2 - tileSize * 3.5 + tileSize * 7 &&
		mouseY > tileSize * 10 && mouseY < tileSize * 10 + tileSize * 1.5)
		image(menu, w / 2 - tileSize * 3.5, 10 * tileSize, tileSize * 7, tileSize * 1.5, 0, 8 * spriteSz, 14 * spriteSz, 3 * spriteSz);
	else
		image(menu, w / 2 - tileSize * 3.5, 10 * tileSize, tileSize * 7, tileSize * 1.5, 0, 5 * spriteSz, 14 * spriteSz, 3 * spriteSz);
}

function drawGame() {
	rect(0, 0, gameMap.getMapWidth() * gameMap.getTilesz(), gameMap.getMapHeight() * gameMap.getTilesz());
//		Show map
	gameMap.drawMap();
//		Show objectives
	for (var e in players) {
		fill(players[e].colorWithAlpha(e === activePlayer ? 1 : 0.5));
		for (var i = 0; i < players[e].objectiveNbr; i++) {
			var objective = gameMap.getObjectives(e)[i];
			if (!isInArray(objective, players[e].takenObjectives)) {
				image(sprites, objective.x * gameMap.getTilesz(), objective.y * gameMap.getTilesz(),
					gameMap.getTilesz(), gameMap.getTilesz(),
					floor((animationFrame % 20) / 4 + 3) * spriteSz, (16 + elements[e]) * spriteSz,
					spriteSz, spriteSz);
				if (e === activePlayer)
					image(misc, objective.x * gameMap.getTilesz(), objective.y * gameMap.getTilesz(),
						gameMap.getTilesz(), gameMap.getTilesz(), 1 * spriteSz, elements[e] * spriteSz,
						spriteSz, spriteSz);
			}
			else {
				image(sprites, objective.x * gameMap.getTilesz(), objective.y * gameMap.getTilesz(),
					gameMap.getTilesz(), gameMap.getTilesz(),
					floor((animationFrame % 12) / 4) * spriteSz, (16 + elements[e]) * spriteSz,
					spriteSz, spriteSz);
			}
		}
	}
//		Show players
	for (var e in players) {
		var p = players[e];
		if (activePlayer != e && !p.isMoving)
			p.elementAnticipation();
		if (activePlayer != e)
			p.showDirection(move_number + 1);
		p.show();
		if (activePlayer === e)
			image(misc, p.pos.x * gameMap.getTilesz(), p.pos.y * gameMap.getTilesz(),
				gameMap.getTilesz(), gameMap.getTilesz(), 0, p.elementId * spriteSz, spriteSz, spriteSz);
	}
	animations.forEach((anim, i) => {
		anim.run();
		if (anim.shouldStop())
			animations.splice(i, 1);
	});
//		Shows text
	fill(255, 255, 255);
	textSize(32);
	text(move_number + '/' + max_move_nbr + ' MOVES', 50, 30);
	if (gameOver) {
		fill('#E23');
		text('Game Over', 350, 30);
	}
}

function newAnimation(anim) {
	if (anim instanceof Animation == true) {
		animations.push(anim);
	}
}

function mouseClicked() {
	if (!gameStarted && mouseX > w / 2 - tileSize * 3.5 && mouseX < w / 2 - tileSize * 3.5 + tileSize * 7 &&
		mouseY > tileSize * 10 && mouseY < tileSize * 10 + tileSize * 1.5)
		loadGame(CastleRock);
}

function keyPressed() {
	if (gameStarted) {
		if (players[activePlayer].isMoving || gameOver)
			return ;
		let player = players[activePlayer];
		switch (keyCode) {
			case 37:
				if (!gameMap.isMovable(activePlayer, pos(-1, 0)))
					return ;
				player.move(-1, 0);
				break;
			case 38:
				if (!gameMap.isMovable(activePlayer, pos(0, -1)))
					return ;
				player.move(0, -1);
				break;
			case 39:
				if (!gameMap.isMovable(activePlayer, pos(1, 0)))
					return ;
				player.move(1, 0);
				break;
			case 40:
				if (!gameMap.isMovable(activePlayer, pos(0, 1)))
					return ;
				player.move(0, 1);
				break;
			default:
				return ;
		}
		for (e in elements) {
			if (e != activePlayer)
				players[e].getNMove(move_number + 1);
		}
		move_number++;
	}
}

function touchStarted() {
	if (touches.length == 0)
		return ;
	let direction = pos(touches[0].x, touches[0].y);
	if (gameStarted) {
		if (players[activePlayer].isMoving || gameOver)
			return ;
		direction = (((this.direction.x ? (this.direction.x < 0 ? 0 : 2) :
					(this.direction.y < 0 ? 1 : 3)) + 2));
		let player = players[activePlayer];
		switch (direction) {
			case 0:
				if (!gameMap.isMovable(activePlayer, pos(-1, 0)))
					return ;
				player.move(-1, 0);
				break;
			case 1:
				if (!gameMap.isMovable(activePlayer, pos(0, -1)))
					return ;
				player.move(0, -1);
				break;
			case 2:
				if (!gameMap.isMovable(activePlayer, pos(1, 0)))
					return ;
				player.move(1, 0);
				break;
			case 3:
				if (!gameMap.isMovable(activePlayer, pos(0, 1)))
					return ;
				player.move(0, 1);
				break;
			default:
				return ;
		}
		for (e in elements) {
			if (e != activePlayer)
				players[e].getNMove(move_number + 1);
		}
		move_number++;
	} else {
		if (!gameStarted && direction.x > w / 2 - tileSize * 3.5 && direction.x < w / 2 - tileSize * 3.5 + tileSize * 7 &&
			direction.y > tileSize * 10 && direction.y < tileSize * 10 + tileSize * 1.5)
			loadGame(CastleRock);
	}
}

function testForObjectives(element) {
	player = players[element];
	if (isInArray(player.pos, gameMap.getObjectives(element).slice(0, player.objectiveNbr))
		&& !isInArray(player.pos, player.takenObjectives)) {
		player.takenObjectives.push(player.pos);
	}
	if (element === activePlayer &&
		player.takenObjectives.length === player.objectiveNbr)
	{
		move_number = 0;
		animations = [];
		player.objectiveNbr++;
		if (player.objectiveNbr > gameMap.getObjectives(activePlayer).length)
			gameMap.getNextObjectives(activePlayer);
		activePlayer = elementsArray[(elements[activePlayer] + 1) % elementsArray.length];
		if (activePlayer === 'air') {
			max_move_nbr += 10;
		}
		players[activePlayer].clearOldMoves();
		for (e in elements) {
			players[e].clearObjectives();
			players[e].resetPos();
		}
	}
	else {
		let canMove = false;
		[{x:-1, y:0}, {x:0, y:-1}, {x:1, y:0}, {x:0, y:1}].forEach((axis, i) => {
			if (gameMap.isMovable(activePlayer, axis))
				canMove = true;
		});
		if (canMove === false || move_number === max_move_nbr)
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

