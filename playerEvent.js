const PSnapshot = require('./players');

const EVENT = {
	createPlayer: "createPlayer",
	deletePlayer: "deletePlayer",
	createGame: "createGame",
	joinGame: "joinGame",
	leaveGame: "leaveGame",
	startTurn: "startTurn",
	endTurn: "endTurn",
	receiveBasicReinforcement: "receiveBasicReinforcement",
	receiveContinentReinforcement: "receiveContinentReinforcement",
	receiveCardReinforcement: "receiveCardReinforcement",
	attack: "attack",
	fortify: "fortify",
	sustainCasualty: "sustainCasualty",
	winBattle: "winBattle",
	loseBattle: "loseBattle",
	earnCard: "earnCard",
	redeemCard: "redeemCards",
	winGame: "winGame",
	loseGame: "loseGame"
};

// {
// 	"type": "event type",
// 	"id"  : "player id",
//	"name": "player name",
//	"gameId"  : "joined game id",
//	"gameName": "joined game name"
// 	...
// }
let events = [];

let receive = (event) => {
	if (typeof EVENT[event.type] !== 'undefined') {
		events[events.length] = event;

		let ret;
		switch (event.type) {
			case EVENT.createPlayer:
				if (typeof event.name !== 'undefined') ret = PSnapshot.createPlayer(event.name, event.type);
				break;
			case EVENT.deletePlayer:
				if (typeof event.id !== 'undefined') ret = PSnapshot.deletePlayer(event.id, event.type);
				break;
			case EVENT.createGame:
				if ((typeof event.id !== 'undefined') && (typeof event.gameName !== 'undefined'))
					ret = PSnapshot.createGame(event.id, event.gameName, event.type);
				break;
			case EVENT.joinGame:
				if ((typeof event.id !== 'undefined') && (typeof event.gameId !== 'undefined'))
					ret = PSnapshot.joinGame(event.id, event.gameId, event.type);
				break;
		}

		if (typeof ret !== 'undefined') {
			return ret;
		} else {
			return {"error" : `Invalid '${event.type}' event`};
		}
	} else {
		return {"error" : `Unknown event type '${event.type}'`};
	}
};

let retrieve = (player) => {
	return events.filter(event => (event.id === player.id));
};

module.exports = {
	receive,
	retrieve,
	EVENT
};