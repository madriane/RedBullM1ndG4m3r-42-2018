
class Player {
	constructor(_type, _x, _y, _mw, _mh, _ps, _sprite, s_row) {
		this.type = _type;
		this.pos = {x: _x, y: _y};
		this.mw = _mw;
		this.mh = _mh;
		this.w = _ps;
		this.moves = Array(clony(this.pos));
		this.animationFrame = 0;
		this.sprite = _sprite;
		this.spriteRow = s_row;
		this.isMoving = false;
		this.direction = {x: 0, y: 0};
	}

	move(_x, _y) {
		let x = max(1, min(this.pos.x + _x, this.mw));
		let y = max(1, min(this.pos.y + _y, this.mh));
		this.pos = {x: x, y: y};
		this.savePos();
		this.isMoving = true;
		this.animationFrame = 0;
		this.direction = {x: _x, y: _y};
	}

	savePos() {
		this.moves.push(clony(this.pos));
	}

	resetPos() {
		this.pos = clony(this.moves[0]);
	}

	clearOldMoves() {
		this.moves = [this.moves[0]];
	}

	getNMove(nb) {
		if (this.moves.length > nb)
		{
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
		switch (this.type) {
			case "AIR":
				break ;
			case "FIRE":
				break ;
			case "EARTH":
				break ;
			case "WATER":
				break ;
			default:
				return (false);
		}
		return (false);
	}

	color() {
		switch (this.type) {
			case "AIR":
				return (color(200, 200, 200));
			case "FIRE":
				return (color(200, 15, 36));
			case "EARTH":
				return (color(36, 15, 36));
			case "WATER":
				return (color(100, 100, 200));
			default:
				break;
		}
	}

	colorWithAlpha(alpha) {
		switch (this.type) {
			case "AIR":
				return (color(200, 200, 200, alpha * 255));
			case "FIRE":
				return (color(200, 15, 36, alpha * 255));
			case "EARTH":
				return (color(36, 15, 36, alpha * 255));
			case "WATER":
				return (color(100, 100, 200, alpha * 255));
			default:
				break;
		}
	}

	showDirection(move_number) {
		stroke('#EE2');
		if (!this.isMoving && this.moves.length > move_number)
			line(this.pos.x * this.w + this.w / 2, this.pos.y * this.w + this.w / 2,
				this.moves[move_number].x * this.w + this.w / 2,
				this.moves[move_number].y * this.w + this.w / 2);
	}

	show() {
		if (this.isMoving) {
			let framePos = {x: this.pos.x - (this.direction.x * (1 - this.animationFrame / 15)),
							y: this.pos.y - (this.direction.y * (1 - this.animationFrame / 15))};
			console.table(framePos);
			image(this.sprite, (framePos.x) * this.w, (framePos.y) * this.w,
			this.w, this.w, (2 + floor(this.animationFrame / 2)) * 128,
			this.spriteRow * 128 + 128 *
			(((this.direction.x == 1) ? 1 : 0) + ((this.direction.x == -1) ? 2 : 0) +
			((this.direction.y == 1) ? 0 : 0) + ((this.direction.y == -1) ? 3 : 0)), 128, 128);
			if (this.animationFrame++ >= 15) {
				this.isMoving = false;
				testForObjectives();
			}
		} else {
			fill(this.color());
			image(this.sprite, this.pos.x * this.w, this.pos.y * this.w, this.w, this.w,
				floor(this.animationFrame / 8) * 128, this.spriteRow * 128, 128, 128);
			this.animationFrame = (this.animationFrame + 1) % 24;
		}
	}
}
