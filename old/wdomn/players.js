const crypto = require('crypto');
const cnst = require('./constants');

const MAXP = cnst.MAX_PLAYER * cnst.MAX_GAME + 10;
let players  = []; // [ { "id": "[id value]", "name" : "[player name]", "token" : "[access token]", "status" : "A|E" } ]
let pidIdx   = {}; // { "[id value]"     : [array idx], ... }
let nameIdx  = {}; // { "[player name]"  : [array idx], ... }
let tokenIdx = {}; // { "[access token]" : [array idx], ... }

let _buildIdx = function() {
	pidIdx = {};
	nameIdx = {};
	tokenIdx = {};
	for (let i = 0; i < players.length; i ++) {
		pidIdx[players[i].id]      = i;
		nameIdx[players[i].name]   = i;
		tokenIdx[players[i].token] = i;
	}
}

let _add = function(name) {
	if ((name === 'player') || (name === 'game')) return null; // reserved word not allowed
	if (typeof nameIdx[name] !== 'undefined') { // Name already exists
		return null;
	} else {
		let idx = players.length;
		if (idx < MAXP) {
			let id = crypto.createHash('sha256').update(name + idx.toString()).digest('base64');
			let token = crypto.createHash('sha256').update(name + (new Date()).getTime()).digest('base64');
			players[idx] = { "id": id, "name": name, "token" : token, "status" : "A" };
			pidIdx[id] = idx;
			nameIdx[name] = idx;
			tokenIdx[token] = idx;
			return { "id" : id, "name" : name, "status": "A", "token": token };
		} else {
			return { "exceed" : idx }; // max no. of players already reached
		}
	}
};

let _nextToken = function(cur) {
	let idx = tokenIdx[cur];
	if ((idx >= 0) && (idx < players.length) && (players[idx].status === "A")) {
		let nxt = crypto.createHash('sha256').update(players[idx].name + (new Date()).getTime()).digest('base64');
		players[idx].token = nxt;
		tokenIdx[nxt] = idx;
		delete tokenIdx[cur];
		return nxt;
	} else {
		return null;
	}
}

module.exports = exports = () => {
	// _add(cnst.ADMIN);
}

exports.access = (cur, strict, succ, fail, next) => {
	if (typeof cur === 'undefined') { // No token given
		if (strict) { // If not allow to bypass
			fail(1);
		} else {
			next();
		}
	} else {
		let nxt = _nextToken(cur);
		if (nxt !== null) { // Successfully validated with next token generated
			succ(nxt);
			next();
		} else {
			if (strict) { // If not allow to bypass
				fail(2);
			} else {
				next();
			}
		}
	}
}

exports.checkIdx = () => {
	let rpti = [], rptn = [], rptt = [];
	for (let i = 0; i < players.length; i ++) {
		if (typeof pidIdx[players[i].id] === "undefined") rpti.push(players[i].id);
		if (typeof nameIdx[players[i].name] === "undefined") rptn.push(players[i].name);
		if (typeof tokenIdx[players[i].token] === "undefined") rptt.push(players[i].token);
	}

	let cnti = 0, cntn = 0, cntt = 0;
	for (let key in pidIdx)   { if (pidIdx.hasOwnProperty(key)) cnti ++; }
	for (let key in nameIdx)  { if (nameIdx.hasOwnProperty(key)) cntn ++; }
	for (let key in tokenIdx) { if (tokenIdx.hasOwnProperty(key)) cntt ++; }

	return {
		"p": players.length,
		"i": { "count": cnti, "missed": rpti },
		"n": { "count": cntn, "missed": rptn },
		"t": { "count": cntt, "missed": rptt }
	}
};
exports.buildIdx = () => {
	_buildIdx();
};
exports.testPrepareIdx = () => { // Corrupt the indices for unit test
	delete tokenIdx[players[5].token];
	delete pidIdx[players[6].id];
	delete nameIdx[players[7].name];
}

exports.list = () => {
	let list = [];
	for (let i = 0; i < players.length; i ++) {
		list.push({ "id": players[i].id, "name": players[i].name, "status": players[i].status });
	}
	return list;
};

exports.get = (key) => {
	if (typeof pidIdx[key] !== 'undefined') {
		return { "id": key, "name": players[pidIdx[key]].name, "status": players[pidIdx[key]].status }; // if key is player ID
	} else if (typeof nameIdx[key] !== 'undefined') {
		return { "id": players[nameIdx[key]].id, "name": key, "status": players[nameIdx[key]].status }; // if key is player Name
	} else if (typeof tokenIdx[key] !== 'undefined') {
		return { "id": players[tokenIdx[key]].id, "name": players[tokenIdx[key]].name, "status": players[tokenIdx[key]].status } // if key is player access token
	} else {
		return null;
	}
}

exports.add = (name) => {
	return _add(name);
};

exports.delete = (id) => {
	if (typeof pidIdx[id] !== 'undefined') {
		let idx = pidIdx[id];
		players.splice(idx, 1);
		_buildIdx();
		return true;
	} else {
		return false;
	}
};
