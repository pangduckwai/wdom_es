const crypto = require('crypto');
const cnst = require('./constants');

const EVENT = {
    createGame: "createGame",
    joinGame: "joinGame",
    startGame: "startGame",
    nextPlayer: "nextPlayer",
    redeemCards: "redeemCards",
    receiveReinforcement: "receiveReinforcement",
    attack: "attack",
    fortify: "fortify",
    issueCard: "issueCard",
    nextTurn: "nextTurn",
    winGame: "winGame",
    quitGame: "quitGame"
};

module.exports = {
	EVENT
};