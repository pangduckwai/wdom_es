const express = require('express');
const body = require('body-parser');
const players = require('./players');
// players();

const router = express.Router();
router.use(body.json());
router.use((req, res, next) => {
	let strict = false;
	switch (req.method) {
	case 'GET':
	case 'DELETE':
		let tok = req.get('acctoken');
		players.access(tok, true
			, (nxt) => {
				res.locals.acctoken = nxt; // For local use
				res.set('acctoken', nxt); // For passing back to client
			}, (err) => res.send({ "err": err, "msg": "Invalid token" }), next);
		break;
	default:
		next();
		break;
	}
});
router
	.get('/', (req, res) => {
		let rtn = players.get(res.locals.acctoken);
		res.send((rtn !== null) ? rtn : { "err": 3, "msg": "Player not found" });
	})
	.put('/', (req, res) => {
		let dat = req.body; // { "name" : "[new player name]" }
		if (typeof dat.name !== 'undefined') {
			let obj = players.add(dat.name);
			if (obj === null) {
				res.send({ "err": 4, "msg": "Player already exists" });
			} else if (typeof obj.exceed !== 'undefined') {
				res.send({ "err": 5, "msg": "Maximum players " + obj.exceed + " reached" });
			} else {
				res.set('acctoken', obj.token); // New token
				res.send({ "id": obj.id, "name": obj.name });
			}
		} else {
			res.send({ "err": 6, "msg": "Invalid input, expecting { 'name' : '[new player name]' }" });
		}
	})
	.delete('/', (req, res) => {
		let ply = players.get(res.locals.acctoken);
		if (ply !== null) {
			if (players.delete(ply.id)) {
				res.send({ "err": 0, "msg": "Player '" + ply.name + "' deleted" });
			} else {
				res.send({ "err": 7, "msg": "Player not found" });
			}
		} else {
			res.send({ "err": 8, "msg": "Invalid input, expecting { 'id' : '[id of player to be deleted]' }" });
		}
	});

module.exports = router;
