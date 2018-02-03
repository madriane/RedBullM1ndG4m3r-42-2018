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
	1 | 4,
	2 | 8,
	2,
	8,
	1,
	4,
	0
];

class Map {
	constructor(_texture, _block_ids, _game_canvas, _nbr_player) {
		this.texture = _texture;
		this.block_ids = _block_ids;
		this.game_canvas = _game_canvas;
		this.nbr_player = _nbr_player;
		this.tiles_sz;
		this.objectives = [];
	}

	init() {
		createCanvas(this.game_canvas.w, this.game_canvas.h);
		this.tiles_sz = Math.min(this.game_canvas.w / this.getGameWidth(), this.game_canvas.h / this.getGameHeight());
		for (let i = 0; i < this.nbr_player; i++)
			this.objectives.push(Array(this.getNewObjective()));
	}

	isMovable(player_id, players, destination) {
		if (typeof destination === 'object')
			;//teleport
		else {
			let playerpos = players[player_id].pos;
			let move = lineToMovesMap[parseInt(floor(this.block_ids[playerpos.y - 1][playerpos.x - 1] / 16))];
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
				this.drawTile((j + 1) * this.getTilesz(), (i + 1) * this.getTilesz(), texture_id)
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
	
	getGameHeight() {
		return this.block_ids.length + 2;
	}

	getGameWidth() {
		return this.block_ids[0].length + 2;
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
			_x = floor(random(this.getMapWidth()) + 1);
			_y = floor(random(this.getMapHeight()) + 1);
			newobjective = {x: _x, y:_y};
			found = isIn2DArray(newobjective, this.objectives)
		}
		return newobjective;
	}
}
