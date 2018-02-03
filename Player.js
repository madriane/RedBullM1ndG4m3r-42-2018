
class Player {
	constructor(_type, _x, _y, _mw, _mh, _ps) {
		this.type = _type;
		this.pos = {x: _x, y: _y};
		this.mw = _mw;
		this.mh = _mh;
		this.w = _ps;
		this.moves = Array(clony(this.pos));
	}

	move(_x, _y) {
		let x = max(1, min(this.pos.x + _x, this.mw));
		let y = max(1, min(this.pos.y + _y, this.mh));

		this.pos = {x: x, y: y};
		this.savePos();
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
			this.pos = clony(this.moves[nb]);
		}
	}

	color() {
		switch (this.type) {
			case "FIRE":
				return (color(200, 15, 36));
			case "WATER":
				return (color(100, 100, 200));
				break;
		}
	}

	colorWithAlpha(alpha) {
		switch (this.type) {
			case "FIRE":
				return (color(200, 15, 36, alpha * 255));
			case "WATER":
				return (color(100, 100, 200, alpha * 255));
				break;
		}
	}

	show() {
		fill(this.color());
		rect(this.pos.x * this.w + this.w / 4, this.pos.y * this.w + this.w / 4, this.w / 2, this.w / 2);
	}
}
