const assert = require('assert');

const cnst = require('./constants');
const players = require('./players'); // Unit Test: players.js
const games = require('./games'); // Unit Test: games.js

const PLAYERS = ['Paul','Jon','Eric','Peter','Wilson','Ben','Eli','Patrick','Rod','Wes',
				 'Ian','James','Alan','Dan','Tony','Jack','Kelvin','Cecil','Dick','Richard'];

const GAMES = ['My game', 'Cephas', 'Game0', 'Game1', 'Game2', 'Game3', 'Game4', 'Game5', 'Game6', 'Game7',
			  'Rick', 'Domination', 'Game8', 'Game9', 'GameA', 'GameB', 'GameC', 'GameD', 'GameE', 'GameF'];

module.exports = () => {
	testPlayers();
	testGames();
}

// Unit Test: player.js
function testPlayers() {
	let count = 0, prgss = 0, off = 5, max = cnst.MAX_PLAYER * cnst.MAX_GAME + 10;
	let i0 = 0, j0 = 0;
	let i1 = 0, j1 = 0;
	let plyrs = [];
	let ts0 = (new Date()).getTime();
	while (prgss < (max + off)) {
		if (count < (max)) {
			let obj = players.add(PLAYERS[i0] + j0);
			assert((obj !== null) && (typeof obj.exceed === "undefined"), "Add player");
			plyrs.push(obj);
			count ++;
			i0 ++;
			if (i0 >= PLAYERS.length) {
				i0 = 0;
				j0 ++;
			}
		}
		if (prgss >= off) {
			assert.equal(players.add(PLAYERS[i1] + j1), null, "Add player again");
			i1 ++;
			if (i1 >= PLAYERS.length) {
				i1 = 0;
				j1 ++;
			}
		}
		prgss ++;
	}
	j0 ++;
	for (let k = 0; k < 5; k ++) {
		let obj = players.add(PLAYERS[k] + j0);
		assert.notEqual(typeof obj.exceed, 'undefined', "Add too many players");
		count ++;
	}
	console.log("test Players - Added " + count + " players in", ((new Date()).getTime() - ts0), "ms");

	count = 0;
	let ts1 = (new Date()).getTime();
	for (let k = 0; k < plyrs.length; k ++) {
		assert.notEqual(players.get(plyrs[k].id), null, "Get player by ID");
		count ++;
	}
	for (let k = 0; k < plyrs.length; k ++) {
		assert.notEqual(players.get(plyrs[k].token), null, "Get player by token");
		count ++;
	}
	for (let k = 0; k < PLAYERS.length; k ++) {
		assert.notEqual(players.get(PLAYERS[k] + '0'), null, "Get player by name");
		count ++;
	}
	assert.equal(players.get('XYZ1234zypo849kg'), null, "Get non-existing player");
	for (let k = 0; k < PLAYERS.length; k ++) {
		assert.equal(players.get(PLAYERS[k]), null, "Get non-existing player");
		count ++;
	}
	console.log("test Players - Retrieved " + (count) + " players in", ((new Date()).getTime() - ts1), "ms");

	let ts2 = (new Date()).getTime();
	players.testPrepareIdx(); // Mess up indices
	let rst = players.checkIdx();
	assert(!((rst.p === rst.i.count) && (rst.p === rst.n.count) && (rst.p === rst.t.count) &&
			 (rst.i.missed.length === 0) && (rst.n.missed.length === 0) && (rst.t.missed.length === 0)),
		"Corrupted indices");
	players.buildIdx(); // Repair indices
	rst = players.checkIdx();
	assert((rst.p === rst.i.count) && (rst.p === rst.n.count) && (rst.p === rst.t.count) &&
			 (rst.i.missed.length === 0) && (rst.n.missed.length === 0) && (rst.t.missed.length === 0),
		"Rebuilt indices");
	console.log("test Players - Checked indices in", ((new Date()).getTime() - ts2), "ms");

	let ts3 = (new Date()).getTime();
	let lst = players.list();
	assert.equal(lst.length, max, "There are " + max + " players");
	console.log("test Players - Listed " + max + " players in", ((new Date()).getTime() - ts3), "ms");

	count = 0
	let ts4 = (new Date()).getTime();
	for (let k = 0; k < lst.length; k ++) {
		assert(!players.delete('=' + lst[k].id.slice(0, lst[k].id.length - 1)), "Delete non-existing player");
		count ++;
	}
	for (let k = 0; k < lst.length; k ++) {
		if (lst[k].name === "admin") continue;
		assert(players.delete(lst[k].id), "Delete existing player");
		count ++;
	}
	assert.equal(players.list().length, 0, "There are no more players");
	console.log("test Players - Deleted " + count + " players in", ((new Date()).getTime() - ts4), "ms");

	console.log("Players tested in", ((new Date()).getTime() - ts0), "ms");
};

// Unit Test: games.js
function testGames() {
	let plyrs = [];
	let p = 0, q = 0;
	for (let i = 0; i < (cnst.MAX_PLAYER * cnst.MAX_GAME + 10); i ++) {
		let obj = players.add(PLAYERS[p] + q);
		assert((obj !== null) && (typeof obj.exceed === "undefined"), "Add player");
		plyrs.push(obj);
		p ++;
		if (p >= PLAYERS.length) {
			p = 0;
			q ++;
		}
	}

	let obj, count = 0, gams = [];
	p = GAMES.length - 1;
	let ts0 = (new Date()).getTime();
	for (let i = 0; i < GAMES.length; i ++) {
		obj = games.add(GAMES[i], plyrs[p].token);
		assert((obj !== null) && (typeof obj.exceed === "undefined") && (typeof obj.joined === "undefined"), "Add game");
		gams.push(obj);
		count ++;
		p --;
	}
	obj = games.add("Extra game", plyrs[GAMES.length].token);
	assert((typeof obj.exceed !== "undefined"), "Add too many games");

	p = 0;
	for (let i = 0; i < GAMES.length; i ++) {
		obj = games.join(gams[i].id, plyrs[p].token);
		assert((typeof obj.joined !== "undefined"), "Already joined");
		p ++;
	}
	for (let i = 0; i < 5; i ++) {
		obj = games.join(gams[0].id, plyrs[p].token);
		assert((obj !== null) && (typeof obj.joined === "undefined") && (typeof obj.exceed === "undefined"), "Join game 0");
		count ++;
		p ++;
	}
	obj = games.join(gams[0].id, plyrs[p].token);
	assert((typeof obj.exceed !== "undefined"), "Too many players joining");

	for (let i = 1; i < gams.length; i ++) {
		for (let j = 0; j < 5; j ++) {
			obj = games.join(gams[i].id, plyrs[p].token);
			assert((obj !== null) && (typeof obj.joined === "undefined") && (typeof obj.exceed === "undefined"), "Join game 1");
			count ++;
			p ++;
		}
	}
	console.log("test Games - " + count + " players joined " + GAMES.length + " games in", ((new Date()).getTime() - ts0), "ms");

	let ts1 = (new Date()).getTime();
	count = 0
	for (let i = 0; i < plyrs.length; i ++) {
		if (i < p) {
			assert.notEqual(games.get(plyrs[i].id), null, "Find game by players")
		} else {
			assert.equal(games.get(plyrs[i].id), null, "Find game by players not joining any game yet")
		}
		count ++;
	}

	q = gams.length - 1;
	for (let i = 0; i < gams.length; i ++) {
		assert.notEqual(games.get(gams[i].id), null, "Find game by ID");
		count ++;
		assert.notEqual(games.get(gams[q].name), null, "Find game by name");
		count ++;
		q --;

		let plst = games.getPlayers(gams[i].id);
		assert((plst !== null) && (plst.length === 6), "Find players in games");
		count ++;
	}
	console.log("test Games - Retrieved " + count + " games in", ((new Date()).getTime() - ts1), "ms");

	let ts2 = (new Date()).getTime();
	games.testPrepareIdx(); // Mess up indices
	let rst = games.checkIdx();
	assert(!((rst.p === rst.i.count) && (rst.p === rst.n.count) && (rst.p === rst.t.count) &&
			(rst.i.missed.length === 0) && (rst.n.missed.length === 0) && (rst.t.missed.length === 0)),
		"Corrupted indices");
	games.buildIdx(); // Repair indices
	rst = games.checkIdx();
	assert((rst.p === rst.i.count) && (rst.p === rst.n.count) && (rst.p === rst.t.count) &&
			(rst.i.missed.length === 0) && (rst.n.missed.length === 0) && (rst.t.missed.length === 0),
		"Rebuilt indices");
	console.log("test Games - Checked indices in", ((new Date()).getTime() - ts2), "ms");

	let ts3 = (new Date()).getTime();
	let lst = games.list();
	assert.equal(lst.length, gams.length, "There are " + gams.length + " games");
	console.log("test Games - Listed " + gams.length + " games in", ((new Date()).getTime() - ts3), "ms");

	count = 0
	let ts4 = (new Date()).getTime();
	for (let k = 0; k < lst.length; k ++) {
		assert(!games.delete('=' + lst[k].id.slice(0, lst[k].id.length - 1)), "Delete non-existing game");
		count ++;
	}
	for (let k = 0; k < lst.length; k ++) {
		assert(games.delete(lst[k].id), "Delete existing game");
		count ++;
	}
	assert.equal(games.list().length, 0, "There are no more game");
	console.log("test Games - Deleted " + count + " games in", ((new Date()).getTime() - ts4), "ms");

	// Final
	console.log("Games tested in", ((new Date()).getTime() - ts0), "ms");

	// Clean up
	for (let k = 0; k < plyrs.length; k ++) {
		assert(players.delete(plyrs[k].id), "Delete existing player");
	}
};