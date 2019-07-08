const crypto = require('crypto');
const cnst = require('./constants');
const players = require('./players');

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
}

exports.checkIdx = () => {
	let rpti = [], rptn = [], rptp = [];
	for (let i = 0; i < games.length; i ++) {
		if (typeof gidIdx[games[i].id] === "undefined") rpti.push(games[i].id);
		if (typeof nameIdx[games[i].name] === "undefined") rptn.push(games[i].name);
		for (let j = 0; j < games[i].players.length; j ++) {
			if (typeof pidIdx[games[i].players[j].id] === "undefined") { //found a player in a game, but index does not have corresponding record...
				rptp.push(games[i].players[j].id);
				break;
			}
		}
	}

	let cnti = 0, cntn = 0, cntp = 0, obj = {};
	for (let key in gidIdx)  { if (gidIdx.hasOwnProperty(key)) cnti ++; }
	for (let key in nameIdx) { if (nameIdx.hasOwnProperty(key)) cntn ++; }
	for (let key in pidIdx) {
		if (pidIdx.hasOwnProperty(key)) {
			if (typeof obj[pidIdx[key]] === "undefined") {
				cntp ++;
				obj[pidIdx[key]] = 'Y';
			}
		}
	}

	return {
		"p": games.length,
		"i": { "count": cnti, "missed": rpti },
		"n": { "count": cntn, "missed": rptn },
		"t": { "count": cntp, "missed": rptp }
	}
};
exports.buildIdx = () => {
	_buildIdx();
};
exports.testPrepareIdx = () => { // Corrupt the indices for unit test
	delete gidIdx[games[5].id];
	delete pidIdx[games[6].players[1].id];
	delete nameIdx[games[7].name];
}

exports.list = () => {
	let list = [];
	for (let i = 0; i < games.length; i ++) {
		list.push({ "id": games[i].id, "name": games[i].name, "status": games[i].status });
	}
	return list;
};

exports.get = (key) => {
	if (typeof gidIdx[key] !== 'undefined') {
		return { "id": key, "name": games[gidIdx[key]].name, "status": games[gidIdx[key]].status }; // if key is game ID
	} else if (typeof nameIdx[key] !== 'undefined') {
		return { "id": games[nameIdx[key]].id, "name": key, "status": games[nameIdx[key]].status }; // if key is Game Name
	} else if (typeof pidIdx[key] !== 'undefined') {
		return { "id": games[pidIdx[key]].id, "name": games[pidIdx[key]].name, "status": games[pidIdx[key]].status }; // if key is player ID
	} else {
		return null;
	}
};
exports.getPlayers = (id) => {
	if (typeof gidIdx[id] !== 'undefined') {
		let rtn = [];
		for (let i = 0; i < games[gidIdx[id]].players.length; i ++) {
			rtn.push({ "id": games[gidIdx[id]].players[i].id, "color": games[gidIdx[id]].players[i].color });
		}
		return rtn;
	} else {
		return null;
	}
};

exports.add = (name, token) => {
	if ((name === 'player') || (name === 'game')) return null; // reserved word not allowed
	if (typeof nameIdx[name] !== 'undefined') { // Name already exists
		return null;
	} else {
		let idx = games.length;
		if (idx < cnst.MAX_GAME) {
			let plyr = players.get(token);
			if (plyr.name === cnst.ADMIN) return null; // Admin don't start games
			if (typeof pidIdx[plyr.id] !== 'undefined') {
				return { "joined" : games[pidIdx[plyr.id]].id }; // player already joined another game
			} else {
				let id = crypto.createHash('sha256').update(name + idx.toString()).digest('base64');
				let plys = [];
				plys[0] = { "id": plyr.id, "color": 0 }; // player [0] is game owner // TODO set color
				games[idx] = { "id": id, "name": name, "status": "N", "players": plys};
				gidIdx[id] = idx;
				nameIdx[name] = idx;
				pidIdx[plyr.id] = idx;
				return { "id": id, "name": name, "status": "N" };
			}
		} else {
			return { "exceed" : idx }; // max no. of games already opened
		}
	}
};

exports.join = (id, token) => {
	if (typeof gidIdx[id] !== 'undefined') {
		let plyr = players.get(token);
		if (plyr.name === cnst.ADMIN) return null; // Admin don't join games
		if (typeof pidIdx[plyr.id] !== 'undefined') {
			return { "joined" : games[pidIdx[plyr.id]].id }; // player already joined another game
		} else {
			let idx = gidIdx[id];
			if (games[idx].players.length < cnst.MAX_PLAYER) {
				let plys = { "id": plyr.id, "color": 0 }; // TODO set color
				games[idx].players.push(plys);
				pidIdx[plyr.id] = idx;
				return { "id": id, "name": games[idx].name, "status": games[idx].status };
			} else {
				return { "exceed" : games[idx].players.length };
			}
		}
	} else {
		return null;
	}
};

exports.delete = (id) => {
	if (typeof gidIdx[id] !== 'undefined') {
		let idx = gidIdx[id];
		games.splice(idx, 1);
		_buildIdx();
		return true;
	} else {
		return false;
	}
};
