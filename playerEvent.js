const Snapshot = require('./players');

const EVENT = {
	createPlayer: "createPlayer",
	deletePlayer: "deletePlayer",
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
// 	...
// }
let events = [];

let receive = (event) => {
	if (typeof EVENT[event.type] !== 'undefined') {
		let ret;
		switch (event.type) {
			case EVENT.createPlayer:
				if (typeof event.name !== 'undefined') ret = Snapshot.insert(event.name, event.type);
				break;
			case EVENT.deletePlayer:
				if (typeof event.id !== 'undefined') ret = Snapshot.delete(event.id, event.type);
				break;
		}

		if (typeof ret !== 'undefined') {
			events[events.length] = event;
			return ret;
		} else {
			return {"error" : `Invalid '${event.type}' event`};
		}
	} else {
		return {"error" : `Event type '${event.type}' not supported`};
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