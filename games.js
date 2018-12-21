const crypto = require('crypto');
const cnst = require('./constants');

const EVENT = {
    createGame: 0,
    joinGame: 1,
    startGame: 2,
    nextPlayer: 3,
    redeemCards: 4,
    receiveReinforcement: 5,
    attack: 6,
    fortify: 7,
    issueCard: 8,
    nextTurn: 9,
    winGame: 10,
    quitGame: 11
};

module.exports = {
	EVENT
};