
const COMMAND = {
	   signIn: {
		id: "signIn",
		event: ["playerSignedIn"]
	}, createGame: {
		id: "createGame",
		prerequisite: "playerSignedIn",
		event: ["gameCreated", "playerCreated"]
	}, joinGame: {
		id: "joinGame",
		prerequisite: "playerSignedIn",
		event: ["gameJoined", "playerJoined"]
	}, startGame: {
		id: "startGame",
		prerequisite: "playerCreated",
		event: ["gameStarted", "playerStarted"]
	}, claimTerritory: {
		id: "claimTerritory",
		prerequisite: "playerClaimStarted",
		event: ["territoryClaimed"]
	// }, startRound: {
	// 	id: "startRound",
	// 	event: ["roundStarted"]
	// }, endRound: {
	// 	id: "endRound"
	// }, nextRound: {
	// 	id: "nextRound",
	// 	event: ["roundStarted"]
	// }, startTurn: {
	// 	id: "startTurn"
	// }, nextTurn: {
	// 	id: "nextTurn"
	}, redeemCards: {
		id: "redeemCards",
		prerequisite: "playerTurnStarted",
		event: ["cardsRedeemed"]
	}, deployReinforcement: {
		id: "deployReinforcement",
		prerequisite: "playerTurnStarted",
		event: ["reinforcementDeployed"]
	}, endDeployment: {
		id: "endDeployment",
		prerequisite: "playerTurnStarted",
		event: ["deploymentEnded"]
	}, attack: {
		id: "attack",
		prerequisite: "deploymentEnded",
		event: ["attackCommenced", "beingAttacked"]
	}, fortify: {
		id: "fortify",
		prerequisite: "deploymentEnded"
	}, endTurn: {
		id: "endTurn",
		prerequisite: "deploymentEnded",
		event: ["turnEnded"]
	}, endGame: {
		id: "endGame",
		event: ["gameEnded", "playerWon", "playerLost"]
	}, quitGame: {
		id: "quitGame",
		event: ["playerLeft", "playerQuit"]
	}, signOff:	{
		id: "signOff",
		event: ["playerSignedOff"]
	}
};
