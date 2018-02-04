function pos(_x, _y) {
	return ({x: _x, y: _y});
}

class Map {
	constructor(_texture, _block_ids, objectives, _nbr_player) {
		this.block_ids = _block_ids;
		this.nbr_player = _nbr_player;
		this.tiles_sz;
		this.objectives = objectives;
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

		for (e in elements) {
			if (this.objectives[e].length == 0)
				this.objectives[e].push(Array(this.getNewObjective()));
		}
	}

	isObstacle(x, y) {
		if (x < 0 || x >= this.getMapWidth() || y < 0 || y >= this.getMapHeight())
			return (true);
		if (this.block_ids[y][x] / 3 < 1)
			return (false);
		return (true);
	}

	isMovable(player_elem, destination) {
		let playerpos = players[player_elem].pos;
		if (!this.isObstacle(playerpos.x + destination.x, playerpos.y + destination.y))
		{
			let dest = pos(playerpos.x + destination.x, playerpos.y + destination.y);
			let movable = true;
			for (var e in players) {
				if (e != player_elem && players[e].willBeOccupied(dest, move_number))
					movable = false;
			}
			if (movable)
				return (true);
			else
				return (false);
		}
		else
			return (false);
	}

	drawMap() {
		this.block_ids.forEach((row, i)=>{
			row.forEach((texture_id, j)=>{
				this.drawTile(j * this.getTilesz(), i * this.getTilesz(), texture_id)
			})
		});
	}

	drawTile(x, y, tile_nb) {
		let sx = 32 * (tile_nb % 3);
		let sy = 32 * floor(tile_nb / 3);
		image(img, x - 1, y - 1, this.getTilesz() + 2, this.getTilesz() + 2, sx + 1, sy + 1, 32 - 1, 32 - 1);
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
				(this.isObstacle(tile.x + direction.x, tile.y) ||
				this.isObstacle(tile.x, tile.y + direction.y) ||
				this.isObstacle(tile.x + direction.x, tile.y + direction.y)))
				return (false);
			if (abs(direction.x) > abs(direction.y) &&
				this.isObstacle(tile.x + direction.x, tile.y))
				return (false);
			else if (abs(direction.x) < abs(direction.y) &&
				this.isObstacle(tile.x, direction.y + tile.y))
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

	objectiveExists(objective) {
	let found = false;
	for (var elem in this.objectives) {
		this.objectives[elem].forEach((obj, i)=>{
			if (comp(obj, objective)) {
				found = true;
			}
		});
	}
	return (found);
	}

	getNewObjective() {
		let found = true;
		let _x, _y, newobjective;
		while ( found ) {
			found = false;
			_x = floor(random(this.getMapWidth() - 2)) + 1;
			_y = floor(random(this.getMapHeight() - 2)) + 1;
			newobjective = {x: _x, y: _y};
			found = this.objectiveExists(newobjective);
			if (floor(this.block_ids[_y][_x] / 16) === 15)
				found = true;
		}
		return newobjective;
	}
}
