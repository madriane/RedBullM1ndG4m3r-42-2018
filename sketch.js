
var players;
var gameMap;
var spriteSz = 128;

function preload() {
	img = loadImage('tiles_grey_bg.png');
	sprites = loadImage('sprite.png');
	misc = loadImage('misc.png');
	ghost_fx = loadImage('ghost_fx.png');
}

function setup() {
	move_number = 0;
	gameOver = false;
	blockIds = map1;
	activePlayerId = 0;
	animationFrame = 0;
	animations = [];

	gameMap = new Map(img, blockIds, 4);
	gameMap.init();
	max_move_nbr = floor((gameMap.getMapWidth() + gameMap.getMapHeight() * 1.5) / 5) * 5;
	players = [
		new Player('AIR', 1, 1, gameMap.getMapWidth(), gameMap.getMapHeight(), gameMap.getTilesz(), sprites, 0),
		new Player('WATER', 1, gameMap.getMapHeight() - 2, gameMap.getMapWidth(), gameMap.getMapHeight(), gameMap.getTilesz(), sprites, 1),
		new Player('EARTH', gameMap.getMapWidth() - 2, 1, gameMap.getMapWidth(), gameMap.getMapHeight(), gameMap.getTilesz(), sprites, 2),
		new Player('FIRE', gameMap.getMapWidth() - 2, gameMap.getMapHeight() - 2, gameMap.getMapWidth(), gameMap.getMapHeight(), gameMap.getTilesz(), sprites, 3)
	];
}

function draw() {
//		Show map
	background(2);
	stroke(0);
	fill(51);
	rect(0, 0, gameMap.getMapWidth() * gameMap.getTilesz(), gameMap.getMapHeight() * gameMap.getTilesz());
	stroke(255);
	gameMap.drawMap();
//		Show objectives
	players.forEach((p, i) => {
		fill(p.colorWithAlpha(i === activePlayerId ? 1 : 0.5));
		gameMap.getObjectives(i).forEach((objective, j) => {
			if (!isInArray(objective, p.takenObjectives)) {
				image(sprites, objective.x * gameMap.getTilesz(), objective.y * gameMap.getTilesz(),
					gameMap.getTilesz(), gameMap.getTilesz(),
					floor((animationFrame % 20) / 4 + 3) * spriteSz, (16 + p.elementId) * spriteSz,
					spriteSz, spriteSz);
				if (i === activePlayerId)
					image(misc, objective.x * gameMap.getTilesz(), objective.y * gameMap.getTilesz(),
						gameMap.getTilesz(), gameMap.getTilesz(), 1 * spriteSz, p.elementId * spriteSz,
						spriteSz, spriteSz);
			}
			else {
				image(sprites, objective.x * gameMap.getTilesz(), objective.y * gameMap.getTilesz(),
					gameMap.getTilesz(), gameMap.getTilesz(),
					floor((animationFrame % 12) / 4) * spriteSz, (16 + p.elementId) * spriteSz,
					spriteSz, spriteSz);
			}
		});
	});
//		Show players
	players.forEach((p, i)=>{
		if (activePlayerId === i)
			image(misc, p.pos.x * gameMap.getTilesz(), p.pos.y * gameMap.getTilesz(),
				gameMap.getTilesz(), gameMap.getTilesz(), 0, p.elementId * spriteSz, spriteSz, spriteSz);
		else
			p.showDirection(move_number + 1);
		if (activePlayerId != i && !p.isMoving)
			p.elementAnticipation();
		p.show();
	});
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

	animationFrame++;
}

function newAnimation(anim) {
	if (anim instanceof Animation == true) {
		animations.push(anim);
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
	players.forEach((p, i)=> {
		if (i != activePlayerId)
			p.getNMove(move_number + 1);
	});
	move_number++;
}

function testForObjectives(elementId) {
	player = players[elementId];
	if (isInArray(player.pos, gameMap.getObjectives(elementId))
		&& !isInArray(player.pos, player.takenObjectives)) {
		player.takenObjectives.push(player.pos);
	}
	if (elementId === activePlayerId &&
		player.takenObjectives.length === gameMap.getObjectives(activePlayerId).length)
	{
		move_number = 0;
		animations = [];
		gameMap.getNextObjectives(activePlayerId);
		activePlayerId = (activePlayerId + 1) % players.length;
		if (activePlayerId === 0) {
			max_move_nbr += 10;
		}
		players[activePlayerId].clearOldMoves();
		players.forEach((p, i)=> {
			p.clearObjectives();
			p.resetPos();
		});
	}
	else {
		let canMove = false;
		for (let i = 0; i < 4; i++)
			if (gameMap.isMovable(activePlayerId, players, i))
				canMove = true;
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
