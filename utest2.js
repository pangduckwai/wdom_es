const cnst = require('./constants');

const COMMAND = {
    attack: {
        exec: (attacker, defender) => {
            if (attacker.army <= 1) return null;

            let redDice, whiteDice;
            switch (attacker.army) {
                case 2:  redDice = [throwDice()]; break;
                case 3:  redDice = [throwDice(), throwDice()]; break;
                default: redDice = [throwDice(), throwDice(), throwDice()]; break;
            }
            whiteDice = (defender.army > 1) ? [throwDice(), throwDice()] : [throwDice()];

            redDice.sort().reverse();
            whiteDice.sort().reverse();

            console.log("Red", redDice);
            console.log("White", whiteDice);
        },
        event: ["attackCommenced", "beingAttacked"]
    }
};

const EVENT = {
       attackCommenced: {

    }, beingAttacked: {

    }
};

let throwDice = () => {
    return Math.floor(Math.random() * Math.floor(6)) + 1;
};

let runTests = () => {
    let p1 = {army: 2};
    let p2 = {army: 2};
    COMMAND['attack'].exec(p1, p2);
};

module.exports = () => {
	runTests()
};