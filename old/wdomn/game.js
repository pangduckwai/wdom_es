const express = require('express');
const body = require('body-parser');
const games = require('./games');
const players = require('./players');

const router = express.Router();

router.use(body.json());
router.use((req, res, next) => {
	let strict = false;
	switch (req.method) {
	case 'GET':
	case 'PUT':
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
		let rtn = games.list();
		res.send(rtn);
	})
	.get('/:key', (req, res) => {
		let rtn = games.get(req.params.key);
		res.send((rtn !== null) ? rtn : { "err": 3, "msg": "Game not found" });
	})
	.put('/', (req, res) => {
		// console.log(req.body);
		// res.send({'err': 0, 'msg': 'Not ready'});
		let dat = req.body; // { "name" : "[new game name]" }
		if (typeof dat.name !== 'undefined') {
			console.log("Name", dat.name, "Token", res.locals.acctoken);
			console.log("Player", players.get(res.locals.acctoken).name);
			let obj = games.add(dat.name, res.locals.acctoken);
			if (obj === null) {
				res.send({ "err": 4, "msg": "Game already exists" });
			} else if (typeof obj.joined !== "undefined") {
				res.send({ "err": 5, "msg": "Player already joined another game" });
			} else if (typeof obj.exceed !== "undefined") {
				res.send({ "err": 6, "msg": "Maximum games " + obj.exceed + " reached" });
			} else {
				res.send(obj);
			}
		} else {
			res.send({ "err": 6, "msg": "Invalid input, expecting { 'name' : '[new game name]' }" });
		}
	})
	.delete('/', (req, res) => {
		//
	});

module.exports = router;