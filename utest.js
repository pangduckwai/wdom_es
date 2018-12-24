const assert = require('assert');
const cnst = require('./constants');

const Player = require('./playerEvent');
const PSnapshot = require('./players');
const Game = require('./games');

const PLAYERS = ['Paul','Jon','Eric','Peter','Wilson','Ben','Eli','Patrick','Rod','Wes',
				 'Ian','James','Alan','Dan','Tony','Jack','Kelvin','Cecil','Dick','Richard'];

const GAMES = ['My game', 'Cephas', 'Game0', 'Game1', 'Game2', 'Game3', 'Game4', 'Game5', 'Game6', 'Game7',
			  'Rick', 'Domination', 'Game8', 'Game9', 'GameA', 'GameB', 'GameC', 'GameD', 'GameE', 'GameF'];

let testPlayers = () => {
	console.log(JSON.stringify(
		Player.receive({"type": "createUser", "id": "123456789", "name": "Paul"})
	));
	console.log(JSON.stringify(
		Player.receive({"type": Player.EVENT.createPlayer, "name": "Paul"})
	));
	console.log(JSON.stringify(
		Player.receive({"type": Player.EVENT.createPlayer, "name": "Paul"})
	));
	console.log(JSON.stringify(
		Player.receive({"type": Player.EVENT.createPlayer, "name": "John"})
	));
	console.log(JSON.stringify(
		Player.receive({"type": Player.EVENT.createPlayer, "name": "Pete"})
	));
	console.log(JSON.stringify(
		Player.receive({"type": Player.EVENT.createPlayer, "name": "Eric"})
	));
	console.log(JSON.stringify(
		Player.receive({"type": Player.EVENT.createPlayer, "id": "123456789"})
	));
	console.log(JSON.stringify(
		Player.receive({"type": Player.EVENT.deletePlayer, "id": "123456789"})
	));
	console.log(JSON.stringify(
		Player.receive({"type": Player.EVENT.deletePlayer, "name": "Paul"})
	));
	console.log(JSON.stringify(
		Player.receive({"type": Player.EVENT.deletePlayer, "id": PSnapshot.retrieve("John").id})
	));
};

module.exports = () => {
	testPlayers()
};