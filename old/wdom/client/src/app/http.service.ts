import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

const URL_HOST = 'http://localhost:8080';
const URL_LIST_ROOMS = URL_HOST + '/room/list';
const URL_OPEN_ROOMS = URL_HOST + '/room/open';
const URL_CLOSE_ROOM = URL_HOST + '/room/close';
const URL_START_ROOM = URL_HOST + '/room/start';
const URL_GET_CONTINENTS = URL_HOST + '/map/continents';
const URL_GET_COUNTRIES = URL_HOST + '/map/countries';

@Injectable()
export class HttpService {
	private headers = new Headers({'Content-Type': 'application/json'});

	constructor (private http: Http) { }

	getRooms(): Promise<[{room: string, users: string[]}]> {
		return this.http.get(URL_LIST_ROOMS).toPromise()
			.then(rspn => rspn.json())
			.catch(error => Promise.reject(error.text()));
	}

	openRoom(room: string, name: string): Promise<{ success: boolean, message: string }> {
		let rqst = { room: room, user: name };
		return this.http.put(URL_OPEN_ROOMS, JSON.stringify(rqst), { headers: this.headers }).toPromise()
			.then((response) => {
				let rspn = response.json();
				if (rspn.success) {
					return { success: true, message: null };
				} else {
					return { success: false, message: 'Open room failed' };
				}
			}, error => {
				return { success: false, message: error.text() };
			});
	}

	closeRoom(room: string, name: string): Promise<{ success: boolean, message: string }> {
		let rqst = { room: room, owner: name };
		return this.http.put(URL_CLOSE_ROOM, JSON.stringify(rqst), { headers: this.headers }).toPromise()
			.then((response) => {
				let rspn = response.json();
				if (rspn.success) {
					return { success: true, message: null };
				} else {
					return { success: false, message: 'Close room failed' };
				}
			}, error => {
				return { success: false, message: error.text() };
			});
	}

	getContinents(): Promise<{ [id: string]: Continent }> {
		return this.http.get(URL_GET_CONTINENTS).toPromise()
			.then(rspn => rspn.json())
			.catch(error => Promise.reject(error.text()));
	}

	getCountries(): Promise<{ [id: string]: Country }> {
		return this.http.get(URL_GET_COUNTRIES).toPromise()
			.then(rspn => rspn.json())
			.catch(error => Promise.reject(error.text()));
	}

	startGame(room: string, owner: string): Promise<{ success: boolean, message: string }> {
		let rqst = {room: room, owner: owner};
		return this.http.put(URL_START_ROOM, JSON.stringify(rqst), { headers: this.headers }).toPromise()
			.then((response) => {
				let rspn = response.json();
				if (rspn.success) {
					return { success: true, message: null };
				} else {
					return { success: false, message: 'Start game failed' };
				}
			}, error => {
				return { success: false, message: error.text() };
			});
	}

	getGame(room): Promise<{ players: { [id: string]: Player }, board: { [id: string]: Board }}> {
		return this.http.get(URL_START_ROOM + "/" + room).toPromise()
			.then(rspn => rspn.json())
			.catch(error => Promise.reject(error.text()));
	}
}

export class Continent {
	army: number;
	countries: string[];
}

export class Country {
	continent: string;
	connected: string[];
}

export class Player {
	index: number;
	newArmies: number;
}

export class Board {
	ruler: string;
	armies: number;
}