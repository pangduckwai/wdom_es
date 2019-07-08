import { Component, Input, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import * as io from "socket.io-client";

import { HttpService, Board } from './http.service';
import { SocketService } from './socket.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./app.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
	rooms: [{room: string, users: string[]}];
	roomJoin: string;
	userJoin: string;
	roomOpen: string;
	userOpen: string;
	room: string;
	user: string;
	owner: string;
	users: string[];
	joined: boolean;
	chatMsg: string;
	chatMsgs: [{user: string, message: string}];

	constructor(
		private httpService: HttpService,
		private socketService: SocketService,
		private router: Router,
		public snackBar: MdSnackBar) {
			this.joined = false;
		}

	ngOnInit() {
		this.chatMsgs = [] as [{user: string, message: string}];

		this.httpService.getRooms().then(rooms => {
			this.rooms = rooms.sort((a: any, b: any) => {
				if (a.room < b.room) {
					return -1;
				} else if (a.room > b.room) {
					return 1;
				} else {
					return 0;
				}
			});

			// Remember the states during page refresh
			let stts = sessionStorage.getItem('states');
			if (stts) {
				let state = JSON.parse(stts);
				this.room = state.room;
				this.owner = state.owner;
				this.user = state.user;
				this.users = state.users;
				if (this.user === this.owner) {
					this.roomOpen = state.room;
					this.userOpen = state.user;
				} else {
					this.roomJoin = state.room;
					this.userJoin = state.user;
				}
				this.joined = true;
				this.join(state.room, state.user, true);
			}
		});

		this.socketService.listenRoomsUpdated(
			(rooms) => { this.rooms = rooms; },
			(rooms) => {
				let found = false;
				for (let rm of rooms) {
					if ((rm.room === this.roomOpen) || (rm.room === this.roomJoin)) {
						found = true;
					}
				}
				if (!found) {
					// Room no longer exists after room list updated
					this.closedHndlr(null);
				}
			}
		);
	}

	ngOnDestroy() {
	}

	select(selected: string, elem: any) {
		this.roomJoin = selected;
		elem.focus();
	}

	join(room, user, reconnect) {
		let errs = [];
		if (!reconnect) {
			if (!this.rooms || (this.rooms.length <= 0)) {
				errs.push('No room available');
			} else {
				if (!room) errs.push('Please select a room to join');

				if (!user) {
					errs.push('Please specify an alias');
				} else {
					let found = false;
					for (let rm of this.rooms) {
						if (rm.room === room) {
							found = true;
							if (rm.users.length >= 6) {
								errs.push('Room full');
							} else if (rm.users.indexOf(user) >= 0) {
								errs.push("Alias '" + user + "' already been used, please choose another one");
							}
						}
					}
					if (!found) {
						errs.push(this.room + ' not found');
					}
				}
			}
		}
		console.log(room, user, reconnect, errs.length);
		
		if (errs.length > 0) {
			let errmsg = '';
			let spr = '';
			for (let err of errs) {
				errmsg += (spr + err);
				spr = ' / ';
			}
			let ref = this.snackBar.open(errmsg);
			setTimeout(() => {
				ref.dismiss();
			}, 3500);
		} else {
			this.socketService.registerJoinRoom(room, user, reconnect,
				(room, owner, user, members) => this.joinedHndlr(room, owner, user, members),
				(user, message) => this.chattedHndlr(user, message),
				(user, members) => this.leftHndlr(user, members),
				(owner) => this.closedHndlr(owner),
				(room) => this.gameStartHndlr(room, user));
			if (!reconnect) this.chatMsgs = [] as [{user: string, message: string}];
		}
	}

	leave() {
		if (!this.user) {
			let ref = this.snackBar.open('Please specify an alias');
			setTimeout(() => ref.dismiss(), 3500);
		} else {
			this.socketService.leave(this.user);
			this.chatMsgs = [] as [{user: string, message: string}];
		}
	}

	open() {
		let errs = []
		if (!this.roomOpen) errs.push('Please specify a room name');
		if (!this.userOpen) errs.push('Please specify an alias');

		if (errs.length > 0) {
			let errmsg = '';
			let spr = ''
			for (let err of errs) {
				errmsg += (spr + err);
				spr = ' / ';
			}
			let ref = this.snackBar.open(errmsg);
			setTimeout(() => ref.dismiss(), 3500);
		} else {
			this.httpService.openRoom(this.roomOpen, this.userOpen).then(result => {
				if (!result.success) {
					let ref = this.snackBar.open(result.message);
					setTimeout(() => ref.dismiss(), 3500);
				} else {
					this.chatMsgs = [] as [{user: string, message: string}];
					this.socketService.registerJoinRoom(this.roomOpen, this.userOpen, false,
						(room, owner, user, members) => this.joinedHndlr(room, owner, user, members),
						(user, message) => this.chattedHndlr(user, message),
						(user, members) => this.leftHndlr(user, members),
						(owner) => this.closedHndlr(owner),
						(room) => this.gameStartHndlr(room, this.userOpen));
				}
			});
		}
	}

	close(elem: any) {
		let errs = [];
		if (!this.room) errs.push('Unknown room');
		if (!this.owner) errs.push('Unknown owner');
		if (this.owner !== this.user) errs.push('Only the owner can close a room');

		if (errs.length > 0) {
			let errmsg = '';
			let spr = ''
			for (let err of errs) {
				errmsg += (spr + err);
				spr = ' / ';
			}
			let ref = this.snackBar.open(errmsg);
			setTimeout(() => ref.dismiss(), 3500);
		} else {
			this.httpService.closeRoom(this.room, this.owner).then(result => {
				if (!result.success) {
					let ref = this.snackBar.open(result.message);
					setTimeout(() => ref.dismiss(), 3500);
				} else {
					elem.focus();
					this.chatMsgs = [] as [{user: string, message: string}];
				}
			});
		}
	}

	send() {
		this.socketService.chat(this.chatMsg);
		this.chatMsg = '';
	}

	start() {
		this.httpService.startGame(this.room, this.owner).then(result => {
			if (!result.success) {
				let ref = this.snackBar.open(result.message);
				setTimeout(() => ref.dismiss(), 3500);
			}
		});
	}

	joinedHndlr(room: string, owner: string, user: string, members: string) {
		console.log('Joined', room, user, owner, members);
		this.room = room;
		this.owner = owner;
		this.user = user;
		this.users = JSON.parse(members);
		this.joined = true;
		sessionStorage.setItem('states', JSON.stringify({
			room: room, owner: owner, user: user, users: this.users
		}));
	}

	chattedHndlr(user: string, message: string) {
		this.chatMsgs.unshift({user: user, message: message});
		if (this.chatMsgs.length > 6) {
			this.chatMsgs.pop();
		}
		console.log("Chat", this.chatMsgs.length);
	}

	leftHndlr(user: string, members: string) {
		console.log('Left', user, members);
		if (this.userJoin === user) {
			this.roomJoin = null;
			this.userJoin = null;
			this.room = null;
			this.user = null;
			this.owner = null;
			this.users = null;
			this.joined = false;
			sessionStorage.removeItem('states');
			sessionStorage.removeItem('game');
		} else {
			this.users = JSON.parse(members);
		}
	}

	closedHndlr(owner: string) {
		console.log('Closed', owner);
		this.roomJoin = null;
		this.userJoin = null;
		this.roomOpen = null;
		this.userOpen = null;
		this.room = null;
		this.user = null;
		this.owner = null;
		this.users = null;
		this.joined = false;
		sessionStorage.removeItem('states');
		sessionStorage.removeItem('game');
	}

	gameStartHndlr(room: string, user: string) {
		this.httpService.getGame(room).then(game => {
			sessionStorage.setItem('game', JSON.stringify({
				room: room, user: user, game: game
			}));
			this.router.navigateByUrl('/game');
		});
	}
}