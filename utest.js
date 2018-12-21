const assert = require('assert');
const cnst = require('./constants');
const Player = require('./players');
const Game = require('./games');

const PLAYERS = ['Paul','Jon','Eric','Peter','Wilson','Ben','Eli','Patrick','Rod','Wes',
				 'Ian','James','Alan','Dan','Tony','Jack','Kelvin','Cecil','Dick','Richard'];

const GAMES = ['My game', 'Cephas', 'Game0', 'Game1', 'Game2', 'Game3', 'Game4', 'Game5', 'Game6', 'Game7',
			  'Rick', 'Domination', 'Game8', 'Game9', 'GameA', 'GameB', 'GameC', 'GameD', 'GameE', 'GameF'];

let testPlayers = () => {
    Player.handle({
        "type": 21, "id": 123456789, "name": "Paul"
    });
    Player.handle({
        "type": Player.EVENT.createPlayer,
        "name": "Paul"
    });
    Player.handle({
        "type": Player.EVENT.createPlayer,
        "name": "Paul"
    });
};

module.exports = () => {
	testPlayers()
};