const crypto = require('crypto');
const cnst = require('./constants');

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

exports.retrieve = (id) => {
    if (typeof pidIdx[id] !== 'undefined') {
		return players[pidIdx[id]];
	} else {
		return {"error" : `Players with ID '${id}' not found`};
	}
};

exports.retrieveByName = (name) => {
    if (typeof nameIdx[name] !== 'undefined') {
		return players[nameIdx[name]];
	} else {
		return {"error" : `Players with name '${name}' not found`};
	}
};

exports.insert = (name, status) => {
	if ((name === 'player') || (name === 'game')) return null; // reserved word not allowed
	if (typeof nameIdx[name] !== 'undefined') { // Name already exists
		return {"error" : `Players '${name}' already exists`};
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

exports.delete = (id, status) => {
	if (typeof pidIdx[id] !== 'undefined') {
		let ret = players.splice(pidIdx[id], 1);
		_buildIdx();
		ret[0].status = status;
		return ret[0];
	} else {
		return {"error" : `Players with ID '${id}' not found`};
	}
};

// exports.deleteByName = (name) => {
//     if (typeof nameIdx[name] !== 'undefined') {
// 		let ret = players.splice(nameIdx[name], 1);
// 		_buildIdx();
// 		return ret[0];
// 	} else {
// 		return { "error" : `Players with name ${name} not found` };
// 	}
// };

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