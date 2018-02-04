
class Player {
	constructor(_type, _pos, _ps, _sprite, e_id) {
		this.type = _type;
		this.pos = clony(_pos);
		this.w = _ps;

		this.moves = Array(clony(this.pos));
		this.animationFrame = 0;
		this.isMoving = false;
		this.direction = {x: 0, y: 0};
		this.takenObjectives = Array();
		this.objectiveNbr = 1;
	}

	move(_x, _y) {
		if (this.type === "earth")
			newAnimation(this.elementAnimation());
		let x = max(1, min(this.pos.x + _x, gameMap.getMapWidth()));
		let y = max(1, min(this.pos.y + _y, gameMap.getMapHeight()));
		this.pos = {x: x, y: y};
		this.savePos();
		this.isMoving = true;
		this.direction = {x: _x, y: _y};
		this.animationFrame = 0;
	}

	savePos() {
		this.moves.push(clony(this.pos));
	}

	resetPos() {
		this.pos = clony(this.moves[0]);
		if (this.moves.length >  1)
			this.direction = {x: this.moves[1].x - this.pos.x, y: this.moves[1].y - this.pos.y};
		else
			this.direction = {x: 0, y: 0};
	}

	clearOldMoves() {
		this.moves = [this.moves[0]];
	}

	clearObjectives() {
		this.takenObjectives = [];
	}

	getNMove(nb) {
		if (this.moves.length > nb) {
			if (this.type === "earth")
				newAnimation(this.elementAnimation());
			this.direction = {x: this.moves[nb].x - this.pos.x, y: this.moves[nb].y - this.pos.y};
			this.pos = clony(this.moves[nb]);
			this.isMoving = true;
			this.animationFrame = 0;
		}
	}

	willBeOccupied(pos, move_number) {
		if (this.moves.length > move_number && comp(pos, this.moves[move_number + 1]))
			return (true);
		else if (!(this.moves.length > move_number + 1) && comp(pos, this.pos))
			return (true);
		let occupied = false;
		switch (this.type) {
			case "air":
				if (move_number + 1 < this.moves.length) {
					let currentTile = clony(this.moves[move_number + 1]);
					while (gameMap.isMovableDirection(currentTile, this.direction)) {
						currentTile = {x: currentTile.x + this.direction.x, y: currentTile.y + this.direction.y};
						if (comp(pos, currentTile))
							occupied = true;
					}
				}
				break;
			case "fire":
				if (move_number + 1 < this.moves.length) {
					[{x:-1, y:0}, {x:0, y:-1}, {x:1, y:0}, {x:0, y:1}].forEach((axis, i) => {
						let currentTile = clony(this.moves[move_number + 1]);
						let j = 0;
						while (gameMap.isMovableDirection(currentTile, axis) && j++ < 2) {
							currentTile = {x: currentTile.x + axis.x, y: currentTile.y + axis.y};
							if (comp(pos, currentTile))
								occupied = true;
						}
					});
				}
				break;
			case "earth":
				let tiles = this.moves.slice(max(0, move_number - 9), move_number + 1);
				tiles.forEach((currentTile, i) => {
					if (comp(pos, currentTile))
						occupied = true;
				});
				break;
			case "water":
				if (move_number + 1 < this.moves.length) {
					[{x:-1, y:0}, {x:-1, y:-1}, {x:0, y:-1}, {x:1, y:-1}, {x:1, y:0},
					 {x:1, y:1}, {x:0, y:1}, {x:-1, y:1}].forEach((axis, i) => {
						let currentTile = {x: this.pos.x, y: this.pos.y};
						if (gameMap.isMovableDirection(currentTile, axis)) {
							currentTile = {x: currentTile.x + axis.x, y: currentTile.y + axis.y};
						if (comp(pos, currentTile))
							occupied = true;
						}
					});
				}
				break;
			default:
				break;
		}
		return (occupied);
	}

	elementAnimation() {
		let list = [];
		switch (this.type) {
			case "air":
				let currentTile = clony(this.pos);
				while (gameMap.isMovableDirection(currentTile, this.direction)) {
					currentTile = {x: currentTile.x + this.direction.x, y: currentTile.y + this.direction.y};
					list.push(clony(currentTile));
				}
				if (list.length > 0) {
					return  (new Animation({tileList: list, direction: this.direction},
						(anim) => {
							anim.parms.tileList.forEach((currentTile) => {
								push();
								let w = gameMap.getTilesz();
								translate(currentTile.x * w + w / 2, currentTile.y * w + w / 2);
								rotate(radians((anim.parms.direction.x ?
									(anim.parms.direction.x < 0 ? 180 : 0) :
									(anim.parms.direction.y < 0 ? -90 : 90))));
								image(ghost_fx, -w / 2, -w / 2, w, w,
									floor(anim.frame / 5) * spriteSz,
									0 * spriteSz, spriteSz, spriteSz);
								pop();
							});
						},
						(anim) => {
							return (anim.frame >= 25);
						}
					));
				}
				break;
			case "fire":
				[{x:-1, y:0}, {x:0, y:-1}, {x:1, y:0}, {x:0, y:1}].forEach((axis, i) => {
					let currentTile = clony(this.pos);
					let j = 0;
					while (gameMap.isMovableDirection(currentTile, axis) && j++ < 2) {
						currentTile = {x: currentTile.x + axis.x, y: currentTile.y + axis.y};
						list.push(clony(currentTile));
					}
				});
				if (list.length > 0) {
					return  (new Animation({tileList: list},
						(anim) => {
							anim.parms.tileList.forEach((currentTile) => {
								push();
								let w = gameMap.getTilesz();
								translate(currentTile.x * w + w / 2, currentTile.y * w + w / 2);
								image(ghost_fx, -w / 2, -w / 2, w, w,
									floor(anim.frame / 5) * spriteSz,
									3 * spriteSz, spriteSz, spriteSz);
								pop();
							});
						},
						(anim) => {
							return (anim.frame >= 25);
						}
					));
				}
				break;
			case "earth":
				return (new Animation({tile: this.pos, move_nb: move_number},
					(anim) => {
						let w = gameMap.getTilesz();
						image(ghost_fx, anim.parms.tile.x * w, anim.parms.tile.y * w, w, w,
							floor((move_number - anim.parms.move_nb - 1) / 2) * spriteSz,
							2 * spriteSz, spriteSz, spriteSz);
					},
					(anim) => {
						return (move_number > anim.parms.move_nb + 10);
					}
				));
				break;
			case "water":
				[{x:-1, y:0}, {x:-1, y:-1}, {x:0, y:-1}, {x:1, y:-1}, {x:1, y:0},
				 {x:1, y:1}, {x:0, y:1}, {x:-1, y:1}].forEach((axis, i) => {
					let currentTile = {x: this.pos.x - this.direction.x, y: this.pos.y - this.direction.y};
					if (gameMap.isMovableDirection(currentTile, axis)) {
						currentTile = {x: currentTile.x + axis.x, y: currentTile.y + axis.y};
						list.push(clony(currentTile));
					}
				});
				if (list.length > 0) {
					return  (new Animation({tileList: list},
						(anim) => {
							anim.parms.tileList.forEach((currentTile) => {
								push();
								let w = gameMap.getTilesz();
								translate(currentTile.x * w + w / 2, currentTile.y * w + w / 2);
								image(ghost_fx, -w / 2, -w / 2, w, w,
									floor(anim.frame / 5) * spriteSz,
									1 * spriteSz, spriteSz, spriteSz);
								pop();
							});
						},
						(anim) => {
							return (anim.frame >= 25);
						}
					));
				}
				break;
			default:
				break;
		}
		return (false);
	}

	elementAnticipation() {
		switch (this.type) {
			case "air":
				if (move_number + 1 < this.moves.length) {
					let currentTile = clony(this.moves[move_number + 1]);
					while (gameMap.isMovableDirection(currentTile, this.direction)) {
						currentTile = {x: currentTile.x + this.direction.x, y: currentTile.y + this.direction.y};
						push();
						translate(currentTile.x * this.w + this.w / 2, currentTile.y * this.w + this.w / 2);
						rotate(radians((this.direction.x ?
							(this.direction.x < 0 ? 180 : 0) : (this.direction.y < 0 ? -90 : 90))));
						fill(this.colorWithAlpha(0.5));
						stroke(this.color('dark'));
						if (gameMap.isMovableDirection(currentTile, this.direction))
							rect(-this.w / 2, -this.w / 4, this.w , this.w / 2);
						else
							rect(-this.w / 2, -this.w / 4, this.w * 3 / 4 , this.w / 2);
						pop();
					}
				}
				break;
			case "fire":
				if (move_number + 1 < this.moves.length) {
					[{x:-1, y:0}, {x:0, y:-1}, {x:1, y:0}, {x:0, y:1}].forEach((axis, i) => {
						let currentTile = clony(this.moves[move_number + 1]);
						let j = 0;
						while (gameMap.isMovableDirection(currentTile, axis) && j++ < 2) {
							currentTile = {x: currentTile.x + axis.x, y: currentTile.y + axis.y};
							push();
							translate(currentTile.x * this.w + this.w / 2, currentTile.y * this.w + this.w / 2);
							rotate(radians((axis.x ?
								(axis.x < 0 ? 180 : 0) : (axis.y < 0 ? -90 : 90))));
							fill(this.colorWithAlpha(0.5));
							stroke(this.color('dark'));
							if (j == 1)
								rect(-this.w / 2, -this.w / 4, this.w , this.w / 2);
							else
								rect(-this.w / 2, -this.w / 4, this.w * 3 / 4 , this.w / 2);
							pop();
						}
					});
				}
				break;
			case "earth":
				if (this.moves.length > 1) {
					let tiles = this.moves.slice(max(0, move_number - 9), move_number + 1);
					tiles.forEach((tile, i) => {
						push();
						translate(tile.x * this.w + this.w / 2, tile.y * this.w + this.w / 2);
						fill(this.colorWithAlpha(0.5));
						stroke(this.color('dark'));
						rect(-this.w / 4, -this.w / 4, this.w / 2, this.w / 2);
						pop();
					});
				}
				break;
			case "water":
				if (move_number + 1 < this.moves.length) {
					[{x:-1, y:0}, {x:-1, y:-1}, {x:0, y:-1}, {x:1, y:-1}, {x:1, y:0},
					 {x:1, y:1}, {x:0, y:1}, {x:-1, y:1}].forEach((axis, i) => {
						let currentTile = {x: this.pos.x, y: this.pos.y};
						if (gameMap.isMovableDirection(currentTile, axis)) {
							currentTile = {x: currentTile.x + axis.x, y: currentTile.y + axis.y};
							push();
							translate(currentTile.x * this.w + this.w / 2, currentTile.y * this.w + this.w / 2);
							fill(this.colorWithAlpha(0.5));
							stroke(this.color('dark'));
							rect(-this.w / 4, -this.w / 4, this.w / 2, this.w / 2);
							pop();
						}
					});
				}
				break;
			default:
				break;
		}
	}

	color(tone) {
		if (tone === 'dark') {
			switch (this.type) {
				case "air":
					return (color(150, 150, 150));
				case "fire":
					return (color(130, 15, 25));
				case "earth":
					return (color(25, 15, 25));
				case "water":
					return (color(50, 50, 130));
				default:
					break;
			}
		}
		else {
			switch (this.type) {
				case "air":
					return (color(200, 200, 200));
				case "fire":
					return (color(200, 15, 36));
				case "earth":
					return (color(70, 50, 50));
				case "water":
					return (color(100, 100, 200));
				default:
					break;
			}
		}
	}

	colorWithAlpha(alpha) {
		switch (this.type) {
			case "air":
				return (color(200, 200, 200, alpha * 255));
			case "fire":
				return (color(200, 15, 36, alpha * 255));
			case "earth":
				return (color(36, 15, 36, alpha * 255));
			case "water":
				return (color(100, 100, 200, alpha * 255));
			default:
				break;
		}
	}

	showDirection(move_number) {
		stroke('#EE2');
		if (!this.isMoving && this.moves.length > move_number)
			if (!comp({x: 0, y: 0}, this.direction))
			image(misc, ((this.pos.x + 1 / 2) - 1 / 2 + this.direction.x / 2) * this.w,
				((this.pos.y + 1 / 2) - 1 / 2 + this.direction.y / 2) * this.w,
				this.w, this.w,
				spriteSz * (((this.direction.x ? (this.direction.x < 0 ? 0 : 2) :
					(this.direction.y < 0 ? 1 : 3)) + 2)),
				spriteSz * elements[this.type], spriteSz, spriteSz);
	}

	show() {
		if (this.isMoving) {
			let framePos = {x: this.pos.x - (this.direction.x * (1 - this.animationFrame / 15)),
							y: this.pos.y - (this.direction.y * (1 - this.animationFrame / 15))};
			image(sprites, (framePos.x) * this.w, (framePos.y) * this.w,
				this.w, this.w, (2 + floor(this.animationFrame / 2)) * spriteSz,
				elements[this.type] * 4 * spriteSz + spriteSz *
				(((this.direction.x == 1) ? 1 : 0) + ((this.direction.x == -1) ? 2 : 0) +
				((this.direction.y == 1) ? 0 : 0) + ((this.direction.y == -1) ? 3 : 0)), spriteSz, spriteSz);
//			image(sprites, (framePos.x) * this.w, (framePos.y) * this.w,
//				this.w, this.w, (floor(this.animationFrame / 8) % 3) * spriteSz,
//				elements[this.type] * 4 * spriteSz + spriteSz *
//				(((this.direction.x == 1) ? 1 : 0) + ((this.direction.x == -1) ? 2 : 0) +
//				((this.direction.y == 1) ? 0 : 0) + ((this.direction.y == -1) ? 3 : 0)), spriteSz, spriteSz);
			if (this.animationFrame === 0 && this.type === "water")
				newAnimation(this.elementAnimation());
			if (this.animationFrame === 6 && this.type === "air")
				newAnimation(this.elementAnimation());
			if (this.animationFrame === 15 && this.type === "fire")
				newAnimation(this.elementAnimation());
			if (this.animationFrame++ >= 15) {
				if (this.moves.length > move_number + 1)
					this.direction = {x: this.moves[move_number + 1].x - this.pos.x,
										y: this.moves[move_number + 1].y - this.pos.y};
				else if (players[activePlayer] != this)
					this.direction = {x: 0, y: 0};
				this.isMoving = false;
				testForObjectives(this.type);
			}
		} else {
			fill(this.color());
			image(sprites, this.pos.x * this.w, this.pos.y * this.w, this.w, this.w,
				floor(this.animationFrame / 8) * spriteSz,
				elements[this.type] * 4 * spriteSz, spriteSz, spriteSz);
			image(sprites, this.pos.x * this.w, this.pos.y * this.w, this.w, this.w,
				floor(this.animationFrame / 8) * spriteSz,
				elements[this.type] * 4 * spriteSz, spriteSz, spriteSz);
			this.animationFrame = (this.animationFrame + 1) % 24;
		}
	}
}
