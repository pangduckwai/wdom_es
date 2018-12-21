const crypto = require('crypto');
const Player = require('./players');

let events = [];

let receive = (event) => {
    if (Player.EVENT[event.type] !== 'undefined') {
        events[events.length] = event;
        return event;
    } else {
        return {"error" : `Undefined event type ${event.type}`};
    }
};

let retrieve = (player) => {
    return events.filter(event => (event.id === player.id));
};

module.exports = {
    receive,
    retrieve
};