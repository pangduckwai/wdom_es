const http = require('http');
const path = require('path');
const url = require('url');
const fs = require('fs');
const qstring = require('querystring');
const contentType = require('content-type');
const sockio = require('socket.io');

const consts = require('./constants');
const xsite = require('./xsite-dev'); // TODO - for DEV only

let responseNormal = (response, body, type) => {
	response.setHeader(consts.CONTENT_TYPE_KEY, (!type) ? 'text/plain' : type);
	response.end(body);
};

let responseError = (response, message, status) => {
	console.log(status, message);
	response.statusCode = status;
	response.setHeader(consts.CONTENT_TYPE_KEY, 'text/plain');
	response.end(message);
};

let responseRedirect = (response, redirectTo) => {
	response.writeHead(302, { 'Location': (redirectTo) ? redirectTo : '/index.html' });
	response.end();
};

let serveFile = (pathname, succ, fail) => {
	let extn = path.parse(pathname).ext;
	let ctyp = 'text/plain';
	let encd = null;
	if (extn) {
		let map = consts.CONTENT_MAP[extn];
		if (map) {
			ctyp = map.mime || 'text/plain';
			encd = (map.encoding !== '') ? map.encoding : null;
		}
	}

	fs.readFile(path.join('.', pathname), encd, (error, data) => {
			if (error) {
				if (error.code === 'ENOENT') {
					fail(302, '');
				} else {
					throw error;
				}
			} else {
				succ(200, data, ctyp);
			}
	});
};

let server = http.createServer((req, res) => {
	if (xsite.enable(req, res)) { // TODO - for DEV only
		return;
	}

	req.on('error', err => responseError(res, err, 500));
	res.on('error', err => responseError(res, err, 500));

	let buff = '';
	req.on('data', (chunk) => {
			buff += chunk;
			if (buff.length > 1e6) req.connection.destroy(); // data larger than 1M
	}).on('end', () => {
			let request = url.parse(req.url, true);
			let data = {};
			if (buff.trim().length > 0) data = JSON.parse(buff);

			if ((req.method !== 'GET') && (req.method !== 'PUT')) {
				responseError(res, req.method + ' not supported', 405);
				return;
			}

			switch (request.pathname) {
			case '/':
				responseRedirect(res);
				break;

			case '/time':
				let now = new Date();
				let dttm = now.getFullYear() + '-' + ('0'+(now.getMonth() + 1)).slice(-2) + '-' + ('0'+now.getDate()).slice(-2) + ' ' +
					('0'+now.getHours()).slice(-2) + ':' + ('0'+now.getMinutes()).slice(-2) + ':' + ('0'+now.getSeconds()).slice(-2)

				for (let key in channels) {
					if (consts.DEBUG) console.log("Sync clock with " + key);
					channels[key].channel.emit('time', dttm);
				}

				responseNormal(res, '{"time":"' + dttm + '"}', 'application/json');
				break;

			default:
				const REGEX = /[/]([0-9a-zA-Z/_]+?)([/]([0-9a-zA-Z_]+))?[/]?$/g;
		
				// First try to interpret the URL
				let mth = REGEX.exec(request.pathname);
				if (mth == null) {
					serveFile(request.pathname,
						(sts, ctn, typ) => responseNormal(res, ctn, typ),
						(sts, msg) => {
							if (sts === 302) {
								responseRedirect(res);
							} else {
								responseError(res, msg, sts);
							}
						}
					);
					return;
				}
		
				switch (mth[1]) {
				case 'room':
					switch (mth[3]) {
						case 'list':
							if (req.method === 'GET') {
								let rtrn = [];
								for (let key in channels) {
									let item = {};
									item.room = key;
									item.users = Object.keys(channels[key].userNames);
									rtrn.push(item);
								}
								responseNormal(res, JSON.stringify(rtrn), 'application/json');
							} else {
								responseError(res, 'Invalid request', 500);
							}
							break;
		
						case 'open':
							if (req.method === 'PUT') {
								if ((data.user) && (data.room)) {
									let error = openRoom(data.room, data.user);
									if (!error) {
										responseNormal(res, JSON.stringify({
											room: data.room, user: data.user, success: true
										}), 'application/json');
									} else {
										responseError(res, error, 500);
									}
								} else {
									responseError(res, 'Invalid request data', 500);
								}
							} else {
								responseError(res, 'Invalid request', 500);
							}
							break;
		
						case 'close':
							if (req.method === 'PUT') {
								if ((data.owner) && (data.room)) {
									let error = closeRoom(data.room, data.owner);
									if (!error) {
										responseNormal(res, JSON.stringify({
											room: data.room, user: data.owner, success: true
										}), 'application/json');
									} else {
										responseError(res, error, 500);
									}
								} else {
									responseError(res, 'Invalid request data', 500);
								}
							} else {
								responseError(res, 'Invalid request', 500);
							}
							break;

						case 'start':
							if (req.method === 'PUT') {
								if ((data.owner) && (data.room)) {
									let error = startRoom(data.room, data.owner);
									if (!error) {
										responseNormal(res, JSON.stringify({
											room: data.room, user: data.owner, success: true
										}), 'application/json');
									} else {
										responseError(res, error, 500);
									}
								} else {
									responseError(res, 'Invalid request data', 500);
								}
							} else {
								responseError(res, 'Invalid request', 500);
							}
							break;
					}
					break;

				case 'map':
					switch (mth[3]) {
					case 'continents':
						if (req.method === 'GET') {
							responseNormal(res, JSON.stringify(consts.CONTINENTS), 'application/json');
						} else {
							responseError(res, 'Invalid request', 500);
						}
						break;
					case 'countries':
						if (req.method === 'GET') {
							responseNormal(res, JSON.stringify(consts.COUNTRIES), 'application/json');
						} else {
							responseError(res, 'Invalid request', 500);
						}
						break;
					}
					break;
		
				case 'room/users':
					if (req.method === 'GET') {
						if (mth[3]) {
							responseNormal(res, JSON.stringify(Object.keys(channels[mth[3]].userNames)), 'application/json');
						} else {
							responseError(res, 'Invalid request parameter', 500);
						}
					} else {
						responseError(res, 'Invalid request', 500);
					}
					break;

				case 'room/start':
					if (req.method === 'GET') {
						if (mth[3]) {
							responseNormal(res, JSON.stringify(games[mth[3]]), 'application/json');
						} else {
							responseError(res, 'Invalid request parameter', 500);
						}
					} else {
						responseError(res, 'Invalid request', 500);
					}
					break;

				default:
					let rtrn = [];
					for (let i = 1; i < mth.length; i += 2) {
						rtrn.push(mth[i]);
					}
					responseNormal(res, JSON.stringify(rtrn), 'application/json');
					break;
				}
				break;
			}
	});
});

// ***********************************
//    npm install --save socket.io
// ***********************************

let io = sockio.listen(server);
let channels = {};
let games = {};

let roomsUpdated = () => {
	let rtrn = [];
	for (let key in channels) {
		let item = {};
		item.room = key;
		item.users = Object.keys(channels[key].userNames);
		rtrn.push(item);
	}
	io.emit('roomsUpdated', JSON.stringify(rtrn)); // Broadcast changes
};

let joinHndlr = (socket, timeoutId, roomToJoin, roomOwner, newUser) => {
	if (!newUser) {
		console.log('User name missing');
		socket.disconnect(true); // Seems to be malicious, disconnect everything...
	} else if (channels[roomToJoin].userNames[newUser]) {
		console.log("User", newUser, "already exists");
		socket.disconnect(false);
	} else {
		channels[roomToJoin].userNames[newUser] = socket.id;
		channels[roomToJoin].socketIds[socket.id] = newUser;
		roomsUpdated();
		clearTimeout(timeoutId);
		channels[roomToJoin].channel.emit('joined', roomOwner, JSON.stringify(Object.keys(channels[roomToJoin].userNames)));
		if (roomOwner === newUser) {
			channels[roomToJoin].channel.emit('chatted', roomOwner, "Room '" + roomToJoin + "' ready");
		} else {
			channels[roomToJoin].channel.emit('chatted', roomOwner, newUser + ", welcome to room '" + roomToJoin + "'");
		}
	}
};

let leaveHndlr = (socket, roomToLeave, roomOwner, exUser) => {
	if (!exUser) {
		console.log('User name missing');
		socket.disconnect(true);
	} else {
		let idx = channels[roomToLeave].userNames.indexOf(exUser);
		if (idx < 0) {
			console.log("User", exUser, "not found");
			socket.disconnect(true);
		} else if (exUser === roomOwner) {
			console.log("Owner cannot leave room");
		} else {
			delete channels[room].socketIds[socket.id];
			delete channels[room].userNames[exUser];
			channels[roomToLeave].channel.emit('left', exUser, JSON.stringify(Object.keys(channels[roomToLeave].userNames)));
			channels[roomToLeave].channel.emit('chatted', roomOwner, exUser + " left room '" + roomToLeave + "'");
			socket.disconnect(false);
			roomsUpdated();
		}
	}
};

let chatHndlr = (socket, room, message) => {
	let user = channels[room].socketIds[socket.id];
	if (user) {
		channels[room].channel.emit('chatted', user, message);
	}
}

let mapClickHndlr = (socket, room, country) => {
	console.log(country, 'clicked');
	// TODO: depends on game stage clicking on countries have different results
	// e.g. in prepare phase it just add 1 army to the country
	let user = channels[room].socketIds[socket.id];
	if (user) {
		channels[room].channel.emit('mapClicked', user, country); // TODO: TEMP
	}
}

let openRoom = (room, owner) => {
	if (channels[room]) {
		return "Room '" + room + "' already opened";
	}

	channels[room] = {};
	channels[room].channel = io.of('/' + room);
	channels[room].userNames = {}; // key -- name, value -- socket id
	channels[room].socketIds = {}; // key -- socket id, value -- name
	roomsUpdated();

	// Registrying listeners of the {room} channel
	channels[room].channel.on('connection', (socket) => {
		console.log(socket.id, 'connected to', room);

		// Disconnect if the client does not join a room in 5 seconds
		let toid = setTimeout(() => {
			console.log("Connection timeout");
			socket.disconnect(true);
		 }, 5000);

		socket.on('chat', (msg) => chatHndlr(socket, room, msg));
		socket.on('leave', (user) => leaveHndlr(socket, room, owner, user));
		socket.on('join', (user) => joinHndlr(socket, toid, room, owner, user));
		socket.on('mapClick', (country) => mapClickHndlr(socket, room, country));

		socket.on('disconnect', () => {
			let exUser = channels[room].socketIds[socket.id];
			if (exUser) {
				delete channels[room].socketIds[socket.id];
				delete channels[room].userNames[exUser];
				channels[room].channel.emit('left', exUser, JSON.stringify(Object.keys(channels[room].userNames)));
				channels[room].channel.emit('chatted', owner, exUser + " left room '" + room + "'");
				roomsUpdated();
				console.log(socket.id, exUser, 'disconnected from', room);
			} else {
				console.log(socket.id, 'disconnected from', room);
			}
		});
	});
};

let startRoom = (room, owner) => {
	if (!channels[room]) {
		return "Room '" + room + "' not found";
	}

	let cards = [];
	games[room] = {};
	games[room].board = {};
	for (let key in consts.COUNTRIES) {
		cards.push(key);
		games[room].board[key] = {};
		games[room].board[key].ruler = '';
		games[room].board[key].armies = 1;
	}

	games[room].players = {};
	let players = [];
	let value = Math.floor(Math.random() * 6) + 1; //Roll dice
	for (let key in channels[room].userNames) {
		games[room].players[key] = {};
		games[room].players[key].index = value;
		games[room].players[key].newArmies = 20; //TODO
		players.push(key);
		value ++;
		if (value > consts.MAX_PLAYER) value = 1;
	}
	let cnt = players.length;
	for (let i = 1; i <= (consts.MAX_PLAYER - cnt); i ++) {
		let player = 'Comp' + i;
		games[room].players[player] = {};
		games[room].players[player].index = value;
		games[room].players[player].newArmies = 20; //TODO
		players.push(player);
		value ++;
		if (value > consts.MAX_PLAYER) value = 1;
	}

	let idx = 0;
	while (cards.length > 0) {
		let rnd = Math.floor(Math.random() * cards.length); // Random of 1 to len, then -1 for the index of array
		games[room].board[cards[rnd]].ruler = players[idx];
		games[room].players[players[idx]].newArmies --;

		cards.splice(rnd, 1);

		idx++;
		if (idx >= consts.MAX_PLAYER) idx = 0;
	}

	channels[room].channel.emit('started', room);
}

let closeRoom = (room, owner) => {
	if (!channels[room]) {
		return "Room '" + room + "' not found";
	}

	channels[room].channel.emit('closed', owner);

	for (let socketId in channels[room].channel.connected) {
		channels[room].channel.connected[socketId].disconnect(false);
	}

	channels[room].channel.removeListener('join', joinHndlr);
	channels[room].channel.removeListener('leave', leaveHndlr);
	channels[room].channel.removeListener('chat', chatHndlr);
	channels[room].channel.removeListener('mapClick', mapClickHndlr);

	delete io.nsps['/' + room];
	delete channels[room];
	roomsUpdated();
};

// Registrying listener of the public channel
io.on('connection', (socket) => {
	console.log(socket.id, 'connected to PUBLIC');

	socket.on('disconnect', () => {
		console.log(socket.id, 'disconnected from PUBLIC');
	});

	roomsUpdated();
});

server.listen(consts.SERVER_PORT);