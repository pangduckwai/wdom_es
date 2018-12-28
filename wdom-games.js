const Snapshot = require('./games');

const EVENT = {
	   playerLeft: {
		id: "playerLeft"
	}, gameCreated: {
		id: "gameCreated"
	}, gameJoined: {
		id: "gameJoined"
	}, gameStarted: {
		id: "gameStarted",
		next: ["claimStarted"]
	}, claimStarted: {
		id: "claimStarted",
		next: ["playerClaimStarted"]
	}, territoryClaimed: {
		id: "territoryClaimed",
		option: {
			hasMorePlayer: ["playerClaimStarted"],
			isLastPlayer: ["claimStarted"]
		}
	}, claimEnded: {
		id: "claimEnded",
		next: ["roundStarted"]
	}, roundStarted: {
		id: "roundStarted",
		next: ["playerTurnStarted"]
	}, turnEnded: {
		id: "turnEnded",
		option: {
			hasMorePlayer: ["playerTurnStarted"],
			isLastPlayer: ["roundStarted"]
		}
	}, gameEnded: {
		id: "gameEnded"
	}
};
//next: ["roundStarted"]

module.exports = {
	EVENT
};