const crypto = require('crypto');
const cnst = require('./constants');
const snapshot = require('./playerSnapshot');
const store = require('./playerEventStore');

const EVENT = {
	createPlayer: 0,
	joinGame: 1,
	startTurn: 2,
	endTurn: 3,
	receiveBasicReinforcement: 4,
	receiveContinentReinforcement: 5,
	receiveCardReinforcement: 6,
	attack: 7,
	fortify: 8,
	sustainCasualty: 9,
	winBattle: 10,
	loseBattle: 11,
	earnCard: 12,
	redeemCards: 13,
	winGame: 14,
	loseGame: 15
};

// {
// 	"type": "event type",
// 	"id"  : "player id",
//	"name": "player name",
// 	...
// }
let handle = (event) => {
	if (EVENT[event.type] !== 'undefined') {
		store.receive(event);

		let ret;
		switch (event.type) {
			case EVENT.createPlayer:
				ret = snapshot.insert(event.name);
				break;
		}

		if (ret !== 'undefined') {
			if (ret.error !== 'undefined') {
				console.log(`ERROR! ${ret.error}`);
			}
		} else {
			console.log('TEMP! return result undefined!');
		}
	}
}

module.exports = {
	handle,
	EVENT
};