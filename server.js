const express = require('express');

const session = require('cookie-session')
const helmet = require('helmet');
// const safe = require('safe-regex');
// const csrf = require('csurf');
// const limit = require('express-rate-limit');

const app = express();
const cnst = require('./constants');

app.set('trust proxy', 1); // trust first proxy
app.use(session({
		name: 'session',
		keys: ['097yohgffyr65', 'q4vqwdaasd23q4'],
		cookie: {
			secure: true,
			httpOnly: true,
			domain: 'sea9.org',
			path: '/',
			expires: new Date(Date.now() + 60 * 60 * 1000)
		}
}));

app.use(helmet());

// app.use(csrf());
// app.use(function( req, res, next ) {
// 	res.locals.csrftoken = req.csrfToken() ;
// 	next() ;
// });

// **** Disabled for development ****
// let limiter = new limit({
// 	windowMs: 900000, // 900,000 == 15*60*1000 == 15 minutes
// 	max: 300,
// 	delayMs: 0 // disabled
// });
// app.use(limiter);

app.use(express.static('html', { index: false }));

// const player = require('./player');
// app.use('/player', player);

// const game = require('./game');
// app.use('/game', game);

//Main
require('./utest2')(); // Run unit tests

app.listen(cnst.SERVER_PORT, () => {
	console.log(`WDOM_ES on port ${cnst.SERVER_PORT}; Max no. of games: ${cnst.MAX_GAME}; Max no. of players per game: ${cnst.MAX_PLAYER}`);
});