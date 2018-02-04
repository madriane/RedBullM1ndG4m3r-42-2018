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

		this.canvas = createCanvas(this.game_canvas.w, this.game_canvas.h);
		this.canvas.drawingContext.canvas.style.imageRendering = 'crisp_edge';

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
		image(this.texture, x - 1, y - 1, this.getTilesz() + 2, this.getTilesz() + 2, sx + 1, sy + 1, this.texture.height / 16 - 1, this.texture.height / 16 - 1);
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

	getTileAt(x, y) {
		if (y < 0 || x < 0 || this.getMapHeight() <= y || this.getMapWidth <= x)
			return ;
		return (floor(this.block_ids[y][x] / 16));
	}

	isMovableDirection(tile, direction) {
		if (comp({x: 0, y: 0}, direction) || tile.x + direction.x < 0 || tile.y + direction.y < 0 ||
			tile.x + direction.x > gameMap.getMapWidth() || tile.y + direction.y > gameMap.getMapHeight())
			return (false);
		else {
			if (abs(direction.x) === abs(direction.y) &&
				(((1 << (direction.x < 0 ? 0 : 2)) | (1 << (direction.y < 0 ? 1 : 3))) !=
				(lineToMovesMap[gameMap.getTileAt(tile.x, tile.y)] &
				((1 << (direction.x < 0 ? 0 : 2)) | (1 << (direction.y < 0 ? 1 : 3)))) ||
				0 == (lineToMovesMap[gameMap.getTileAt(tile.x, tile.y + direction.y)] &
				(1 << (direction.x < 0 ? 0 : 2))) ||
				0 == (lineToMovesMap[gameMap.getTileAt(tile.x + direction.x, tile.y)] &
				(1 << (direction.y < 0 ? 1 : 3)))))
				return (false);
			if (abs(direction.x) > abs(direction.y) &&
				0 == (lineToMovesMap[gameMap.getTileAt(tile.x, tile.y)] &
				(1 << (direction.x < 0 ? 0 : 2))))
				return (false);
			else if (abs(direction.x) < abs(direction.y) &&
				0 == (lineToMovesMap[gameMap.getTileAt(tile.x, tile.y)] &
				(1 << (direction.y < 0 ? 1 : 3))))
				return (false);
		}
		return (true);
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
			_x = floor(random(this.getMapWidth() - 2)) + 1;
			_y = floor(random(this.getMapHeight() - 2)) + 1;
			newobjective = {x: _x, y: _y};
			found = isIn2DArray(newobjective, this.objectives);
			if (floor(this.block_ids[_y][_x] / 16) === 15)
				found = true;
		}
		return newobjective;
	}
}
