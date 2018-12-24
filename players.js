const crypto = require('crypto');
const cnst = require('./constants');
const GSnapshot = require('./games');

const MAXP = cnst.MAX_PLAYER * cnst.MAX_GAME + 10;

// {
//	"id"		  : "id value",
//	"name"		  : "player name",
//	"status"	  : "status",
//	"game"		  : "game id",
//	"territories" : ["territory id #1", "territory id #2", ...]
// }
let players = [];
let pidIdx  = {}; // { "[id value]"     : [array idx], ... }
let nameIdx = {}; // { "[player name]"  : [array idx], ... }

let _buildIdx = () => {
	pidIdx = {};
	nameIdx = {};
	for (let i = 0; i < players.length; i ++) {
		pidIdx[players[i].id]    = i;
		nameIdx[players[i].name] = i;
	}
}

exports.retrieve = (key) => {
    if (typeof pidIdx[key] !== 'undefined') {
		return players[pidIdx[key]];
	} else if (typeof nameIdx[key] !== 'undefined') {
		return players[nameIdx[key]];
	} else {
		return {"error" : `Player '${key}' not found`};
	}
};

exports.createPlayer = (name, status) => {
	if ((name === 'player') || (name === 'game')) return null; // reserved word not allowed
	if (typeof nameIdx[name] !== 'undefined') { // Name already exists
		return {"error" : `Player '${name}' already exists`};
	} else {
		let idx = players.length;
		if (idx < MAXP) {
			let id = crypto.createHash('sha256').update(name + idx.toString()).digest('base64');
			players[idx] = {"id": id, "name": name, "status" : status};
			pidIdx[id] = idx;
			nameIdx[name] = idx;
			return players[idx];
		} else {
			return {"error" : `Maximum no. of players ${idx} reached`};
		}
	}
};

exports.deletePlayer = (id, status) => {
	if (typeof pidIdx[id] !== 'undefined') {
		let gam = GSnapshot.retrieve(id);
		if (typeof gam.error === 'undefined') {
			let ret = players.splice(pidIdx[id], 1);
			_buildIdx();
			ret[0].status = status;
			return ret[0];
		} else {
			return {"error" : `Player '${players[pidIdx[id]].name}' is still in the game '${gam.name}'`};
		}
	} else {
		return {"error" : `Player with ID '${id}' not found`};
	}
};

exports.createGame = (id, name, status) => {
	if (typeof pidIdx[id] !== 'undefined') {
		let gam = GSnapshot.createGame(name, players[pidIdx[id]], status);
		if (typeof gam.error !== 'undefined') {
			return gam; // Contains error
		} else {
			players[pidIdx[id]].gameId = gam.id;
			players[pidIdx[id]].status = status;
		}
	} else {
		return {"error" : `Player with ID '${id}' not found`};
	}
};

exports.joinGame = (pid, gid, status) => {
	if (typeof pidIdx[pid] !== 'undefined') {
		let gam = GSnapshot.joinGame(gid, players[pidIdx[pid]]);
		if (typeof gam.error !== 'undefined') {
			return gam; // Contains error
		} else {
			players[pidIdx[pid]].gameId = gam.id;
			players[pidIdx[pid]].status = status;
		}
	} else {
		return {"error" : `Player with ID '${pid}' not found`};
	}
};

// exports.update = (id, status) => {
//     if (typeof pidIdx[id] !== 'undefined') {
// 		let idx = pidIdx[id];
// 		players[idx].status = status;
// 		return players[idx];
// 	} else {
// 		return { "error" : `Players with ID ${id} not found` };
// 	}
// };

// exports.updateByName = (name, status) => {
//     if (typeof nameIdx[name] !== 'undefined') {
// 		let idx = nameIdx[name];
// 		players[idx].status = status;
// 		return players[idx];
// 	} else {
// 		return { "error" : `Players with name ${name} not found` };
// 	}
// };