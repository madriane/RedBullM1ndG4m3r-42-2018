
var players;
var gameMap;
var spriteSz = 128;

function preload() {
	img = loadImage('tilesetbase.png');
	sprites = loadImage('sprite.png');
	misc = loadImage('miscellious.png');
}

function setup() {
	move_number = 0;
	gameOver = false;
	blockIds = map1;
	activePlayerId = 0;
	animationFrame = 0;

	console.log(img);
	console.log(blockIds);
	gameMap = new Map(img, blockIds, 4);
	console.log('Map:', gameMap.getMapWidth(), gameMap.getMapHeight());
	gameMap.init();
	max_move_nbr = floor((gameMap.getMapWidth() + gameMap.getMapHeight() * 1.5) / 5) * 5;
	players = [
		new Player('AIR', 1, 1, gameMap.getMapWidth(), gameMap.getMapHeight(), gameMap.getTilesz(), sprites, 0),
		new Player('WATER', 1, gameMap.getMapHeight() - 2, gameMap.getMapWidth(), gameMap.getMapHeight(), gameMap.getTilesz(), sprites, 1),
		new Player('EARTH', gameMap.getMapWidth() - 2, 1, gameMap.getMapWidth(), gameMap.getMapHeight(), gameMap.getTilesz(), sprites, 2),
		new Player('FIRE', gameMap.getMapWidth() - 2, gameMap.getMapHeight() - 2, gameMap.getMapWidth(), gameMap.getMapHeight(), gameMap.getTilesz(), sprites, 3)
	];
	takenObjectives = [];
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
			if (i === activePlayerId)
			{
				if (isInArray(objective, takenObjectives)) {
					image(sprites, objective.x * gameMap.getTilesz(), objective.y * gameMap.getTilesz(),
						gameMap.getTilesz(), gameMap.getTilesz(),
						floor((animationFrame % 20) / 4 + 3) * spriteSz, (16 + p.spriteRow) * spriteSz,
						spriteSz, spriteSz);
				} else {
					image(misc, objective.x * gameMap.getTilesz(), objective.y * gameMap.getTilesz(),
						gameMap.getTilesz(), gameMap.getTilesz(), 0, p.spriteRow * spriteSz, spriteSz, spriteSz);
					image(sprites, objective.x * gameMap.getTilesz(), objective.y * gameMap.getTilesz(),
						gameMap.getTilesz(), gameMap.getTilesz(),
						floor((animationFrame % 12) / 4) * spriteSz, (16 + p.spriteRow) * spriteSz,
						spriteSz, spriteSz);
				}
			}
			else {
				image(sprites, objective.x * gameMap.getTilesz(), objective.y * gameMap.getTilesz(),
					gameMap.getTilesz(), gameMap.getTilesz(),
					floor((animationFrame % 12) / 4) * spriteSz, (16 + p.spriteRow) * spriteSz,
					spriteSz, spriteSz);
			}
		});
	});
//		Show players
	players.forEach((p, i)=>{
		if (activePlayerId === i)
			image(misc, p.pos.x * gameMap.getTilesz(), p.pos.y * gameMap.getTilesz(),
				gameMap.getTilesz(), gameMap.getTilesz(), 0, p.spriteRow * spriteSz, spriteSz, spriteSz);
		else
			p.showDirection(move_number + 1);
		p.show();
	});
//		Shows text
	fill(255, 255, 255);
	textSize(32);
	text(move_number + '/' + max_move_nbr + ' MOVES', 50, 30);
	if (gameOver) {
		console.log('GAME OVER')
		fill('#E23');
		text('Game Over', 350, 30);
	}

	animationFrame++;
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
