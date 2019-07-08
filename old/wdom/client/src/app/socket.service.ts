import { Injectable, OnDestroy } from '@angular/core';
import * as io from "socket.io-client";

@Injectable()
export class SocketService implements OnDestroy {
	sockpubc: io.SocketIOClient.Socket;
	sockchnl: io.SocketIOClient.Socket; //Not an array or map, since 1 browser should join 1 room at a time

	constructor () { }

	ngOnDestroy() {
		if (this.sockpubc) {
			this.sockpubc.disconnect();
			this.sockpubc = null;
		}

		if (this.sockchnl) {
			this.sockchnl.disconnect();
			this.sockchnl = null;
		}
	}

	listenRoomsUpdated(update: Function, cleanup: Function) {
		if (!this.sockpubc) {
			this.sockpubc = io.connect('localhost:8080');//TODO - TEMP! Should be: this.sockpubc = io.connect();
		}

		this.sockpubc.on('roomsUpdated', (updates) => {
			let rooms = JSON.parse(updates).sort((a: any, b: any) => {
				if (a.room < b.room) {
					return -1;
				} else if (a.room > b.room) {
					return 1;
				} else {
					return 0;
				}
			});

			update(rooms);
			cleanup(rooms);
		});
	}

	registerJoinRoom(roomToJoin: string, joiningUser: string, reconnect: boolean, 
			joinedHandler: Function, chattedHandler: Function, leftHandler: Function, closedHandler: Function,
			gameStartHandler: Function) {
		if (!this.sockchnl) {
			// Connect to channel (a.k.a. room)
			this.sockchnl = io.connect("localhost:8080/" + roomToJoin);//TODO - TEMP! Should be: this.sockchnl = io.connect("/" + roomToJoin);
		}

		// Listeners
		this.sockchnl.on('joined',  (owner, members) => joinedHandler(roomToJoin, owner, joiningUser, members));
		this.sockchnl.on('chatted', (user, message) => chattedHandler(user, message));
		this.sockchnl.on('started', (room) => gameStartHandler(roomToJoin, joiningUser, room));
		// this.sockchnl.on('mapClicked'), (user, country) => mapClickedHandler(user, country);
		this.sockchnl.on('left',    (user, members) => {
			leftHandler(user, members);
			if (joiningUser === user) this.sockchnl = null;
		});
		this.sockchnl.on('closed',  (owner) => {
			closedHandler(owner);
			this.sockchnl = null;
		});

		// Join room
		if (!reconnect) this.sockchnl.emit('join', joiningUser);
	}

	leave(user: string) {
		if (this.sockchnl) {
			this.sockchnl.emit('leave', user);
		}
	}

	chat(message: string) {
		if (this.sockchnl) {
			this.sockchnl.emit('chat', message);
		}
	}

	mapClick(country: string) {
		if (this.sockchnl) {
			this.sockchnl.emit('mapClick', country);
		}
	}
}