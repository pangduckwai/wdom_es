const cnst = require('./constants');

const COMMAND = {
	attack: {
		event: ["attackCommenced", "beingAttacked"]
	}
};

const EVENT = {
	attackCommenced: {
		exec: (...args) => {
			battle(args[0], args[1]);
		}
	}, beingAttacked: {
		exec: (...args) => { }
	}
};

let execute = (command, ...args) => {
	command.event.forEach((eid) => {
		EVENT[eid].exec(...args);
	});
};

let throwDice = () => {
	return Math.floor(Math.random() * Math.floor(6)) + 1;
};

let battle = (attacker, defender) => {
	if ((typeof attacker === 'undefined') || (typeof defender === 'undefined'))
		return {"error": "Attacker and defender must be defined"};
	if (attacker.army <= 1)
		return {"message": "Insufficient army"};

	let redDice, whiteDice;
	switch (attacker.army) {
		case 2:  redDice = [throwDice()]; break;
		case 3:  redDice = [throwDice(), throwDice()]; break;
		default: redDice = [throwDice(), throwDice(), throwDice()]; break;
	}
	whiteDice = (defender.army > 1) ? [throwDice(), throwDice()] : [throwDice()];

	redDice.sort().reverse();
	whiteDice.sort().reverse();

	for (let i = 0; i < Math.min(redDice.length, whiteDice.length); i ++) {
		
	}
};

let runTests = () => {
	let t1 = {army: 10};
	let t2 = {army: 7};
	execute(COMMAND['attack'], t1, t2);
};

module.exports = () => {
	runTests()
};