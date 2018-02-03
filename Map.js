var lineToMovesMap = [
	1 | 2 | 4 | 8,
	1 | 4 | 8,
	1 | 2 | 4,
	2 | 4 | 8,
	1 | 2 | 8,
	1 | 2,
	2 | 4,
	1 | 8,
	4 | 8,
	2 | 8,
	1 | 4,
	2,
	8,
	1,
	4,
	0
];

class Map {
	constructor(_texture, _block_ids, _nbr_player) {
		console.log("lihb");
		this.texture = _texture;
		this.block_ids = _block_ids;
		this.nbr_player = _nbr_player;
		this.tiles_sz;
		this.objectives = [];
		this.game_canvas = [];
	}

	init() {
		var w = window,
		d = document,
		e = d.documentElement,
		g = d.getElementsByTagName('body')[0],
		x = (w.innerWidth || e.clientWidth || g.clientWidth) - 20,
		y = (w.innerHeight|| e.clientHeight|| g.clientHeight) - 20;

		var size_x = this.block_ids[1].length;
		var size_y = this.block_ids.length;

		this.tiles_sz = Math.min(x / size_x, y / size_y);

		this.game_canvas.w = this.tiles_sz * size_x;
		this.game_canvas.h = this.tiles_sz * size_y;
		this.border_x = ((x > this.game_canvas.w) ? ((x - this.game_canvas.w) / 2) : null);
		this.border_y = ((y > this.game_canvas.h) ? ((y - this.game_canvas.h) / 2) : null);

		createCanvas(this.game_canvas.w, this.game_canvas.h);

		console.log(this.game_canvas.w);
		console.log(this.game_canvas.h);
		for (let i = 0; i < this.nbr_player; i++)
			this.objectives.push(Array(this.getNewObjective()));
	}

	isMovable(player_id, players, destination) {
		if (typeof destination === 'object')
			;//teleport
		else {
			let playerpos = players[player_id].pos;
			let move = lineToMovesMap[parseInt(floor(this.block_ids[playerpos.y][playerpos.x] / 16))];
			if (move & (1 << destination))
			{
				let dest = {x: playerpos.x - (destination == 0 ? 1 : 0) + (destination == 2 ? 1 : 0), y: playerpos.y - (destination == 1 ? 1 : 0) + (destination == 3 ? 1 : 0)};
				let movable = true;
				players.forEach((p, i) => {
					if (i != player_id && p.willBeOccupied(dest, move_number))
						movable = false;
				});
				if (movable)
					return (true);
				else
					return (false);
			}
			else
				return (false);
		}
	}

	drawMap() {
		blockIds.forEach((row, i)=>{
			row.forEach((texture_id, j)=>{
				this.drawTile(j * this.getTilesz(), i * this.getTilesz(), texture_id)
			})
		});
	}

	drawTile(x, y, tile_nb) {
		let sx = this.texture.height / 16 * (tile_nb % 16);
		let sy = this.texture.height / 16 * parseInt(tile_nb / 16);
		image(this.texture, x, y, this.getTilesz(), this.getTilesz(), sx, sy, this.texture.height / 16, this.texture.height / 16);
	}

	getTilesz() {
		return this.tiles_sz;
	}

	getMapHeight() {
		return this.block_ids.length;
	}

	getMapWidth() {
		return this.block_ids[0].length;
	}

	getObjectives(player_id) {
		if (player_id === undefined)
			return this.objectives;
		return this.objectives[player_id];
	}

	getNextObjectives(playerId) {
		let objective = this.getNewObjective();
		this.objectives[playerId].push(objective);
		return this.objectives;
	}

	getNewObjective() {
		let found = true;
		let _x, _y, newobjective;
		while ( found ) {
			found = false;
			_x = floor(random(this.getMapWidth()));
			_y = floor(random(this.getMapHeight()));
			newobjective = {x: _x, y: _y};
			found = isIn2DArray(newobjective, this.objectives);
			console.table(newobjective);
			if (floor(this.block_ids[_y][_x] / 16) === 15)
				found = true;
		}
		return newobjective;
	}
}
