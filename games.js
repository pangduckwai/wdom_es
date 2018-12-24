const crypto = require('crypto');
const cnst = require('./constants');

let games   = []; // [{"id":[id value], "name":"[game name]", "status","N|S|E", "players":[{"id":i, "color":c},...]}, ...}
let gidIdx  = {}; // {[id value] : idx, ...}
let nameIdx = {}; // {[game name] : idx, ...}
let pidIdx  = {}; // {[playerId] : idx, ...}

let _buildIdx = function() {
	gidIdx = {};
	nameIdx = {};
	pidIdx = {};
	for (let i = 0; i < games.length; i ++) {
		gidIdx[games[i].id]    = i;
		nameIdx[games[i].name] = i;
		for (let j = 0; j < games[i].players.length; j ++) {
			pidIdx[games[i].players[j].id] = i;
		}
	}
};

exports.retrieve = (key) => {
	if (typeof gidIdx[key] !== 'undefined') {
		return { "id": key, "name": games[gidIdx[key]].name, "status": games[gidIdx[key]].status }; // if key is game ID
	} else if (typeof pidIdx[key] !== 'undefined') {
		return { "id": games[pidIdx[key]].id, "name": games[pidIdx[key]].name, "status": games[pidIdx[key]].status }; // if key is player ID
	} else if (typeof nameIdx[key] !== 'undefined') {
		return { "id": games[nameIdx[key]].id, "name": key, "status": games[nameIdx[key]].status }; // if key is Game Name
	} else {
		return {"error" : `Game '${key}' not found`};
	}
};

exports.createGame = (name, plyr, status) => {
	if ((name === 'player') || (name === 'game')) {
		return {"error" : `Reserved word '${name}' not allowed as game names`};
	} else if (typeof nameIdx[name] !== 'undefined') {
		return {"error" : `Game '${name}' already exists`};
	} else {
		let idx = games.length;
		if (idx < cnst.MAX_GAME) {
			if (typeof pidIdx[plyr.id] !== 'undefined') {
				return {"error" : `Player '${plyr.name}' already joined game ${games[pidIdx[plyr.id]].name}`};
			} else {
				let id = crypto.createHash('sha256').update(name + idx.toString()).digest('base64');
				let plys = [];
				plys[0] = { "id": plyr.id, "color": 0 }; // player [0] is game owner // TODO set color
				games[idx] = { "id": id, "name": name, "status": status, "players": plys};
				gidIdx[id] = idx;
				nameIdx[name] = idx;
				pidIdx[plyr.id] = idx;
				return games[idx];
			}
		} else {
			return {"error" : `Maximum no. of games ${idx} opened`};
		}
	}
};

exports.joinGame = (id, plyr) => {
	if (typeof gidIdx[id] !== 'undefined') {
		if (typeof pidIdx[plyr.id] !== 'undefined') {
			return {"error" : `Player '${plyr.name}' already joined game ${games[pidIdx[plyr.id]].name}`};
		} else {
			let idx = gidIdx[id];
			if (games[idx].players.length < cnst.MAX_PLAYER) {
				let plys = { "id": plyr.id, "color": 0 }; // TODO set color
				games[idx].players.push(plys);
				pidIdx[plyr.id] = idx;
				return games[idx];
			} else {
				return {"error" : `Game '${games[idx].name}' already full`};
			}
		}
	} else {
		return {"error" : `Game '${id}' not found`};
	}
};