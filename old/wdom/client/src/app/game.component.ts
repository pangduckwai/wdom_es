import { Component, Input, OnInit, OnDestroy, Inject } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import * as d3 from 'd3';

import { HttpService, Continent, Country, Player, Board } from './http.service';
import { SocketService } from './socket.service';

@Component({
	selector: 'app-game',
	templateUrl: './game.component.html',
	styleUrls: ['./app.component.css']
})
export class GameComponent implements OnInit, OnDestroy {
	s: string = '';
	ready: boolean = false;
	continents: { [id: string]: Continent };
	countries: { [id: string]: Country };
	game: { players: { [id: string]: Player }, board: { [id: string]: Board }};
	room: string;
	user: string;
	owner: string;
	users: string[];

	constructor(
		private httpService: HttpService,
		private socketService: SocketService,
		public snackBar: MdSnackBar) { }

	ngOnInit() {
		this.httpService.getContinents().then(continents => {
			this.continents = continents;
			this.httpService.getCountries().then(countries => {
				this.countries = countries;

				let stts = sessionStorage.getItem('states');
				if (stts) {
					let state = JSON.parse(stts);
					this.room = state.room;
					this.owner = state.owner;
					this.user = state.user;
					this.users = state.users;
				}
		
				stts = sessionStorage.getItem('game');
				if (stts) {
					let state = JSON.parse(stts);
					this.game = state.game;
					this.ready = true;

					setTimeout(() => {
						let grph = d3.select("svg");
						grph.select("#self").attr("class", "badge player" + this.game.players[this.user].index);
						grph.select("#room").text("Game '" + this.room + "'");
						grph.select("#user").text("Player: " + this.user);

						for (let key in this.game.board) {
							let slct = grph.select("#" + key);
							slct.select(".carmy").text(this.game.board[key].armies);
							slct.select("polyline").attr("class", "player" + this.game.players[this.game.board[key].ruler].index);

							// TEMP!!!
							// grph.append("rect").attr("class", "badge")
							// 	.attr("x", 5).attr("y", -25).attr("width", 15).attr("height", 15);
							// grph.append("text").attr("class", "title")
							// 	.attr("x", 25).attr("y", -25).text("Paul");
						}
						console.log(JSON.stringify(this.game));
					}, 100);
				}
			});
		});

		// setTimeout(() => {
		// 	d3.select("svg").selectAll(".carmy").each((d, i, self) => {
		// 		d3.select(self[i]).text("9999");
		// 	});
		// }, 500);

		// TEMP!!!
		//   <text class=\"carmy\" x=\"([0-9]+)\" y=\"([0-9]+)\">0</text></g>
		//   "<text class=\"carmy\" x=\"" + _1 + "\" y=\"" + _2 + "\">0</text><polyline class=\"player0\" points=\"0,0 0,-20 20,-15 0,-10\" transform=\"translate(" + (Integer.parseInt(_1) + 10) + "," + (Integer.parseInt(_2) - 10) + ")\"></polyline></g>"
		//   <polyline class="player0" points="0,0 0,-20 20,-15 0,-10"
		// setTimeout(() => {
		// 	let shape =
		// 	[[1000, 235].join(","),
		// 	[1000, 215].join(","),
		// 	[1020, 220].join(","),
		// 	[1000, 225].join(",")
		// 	].join(" ");
		// 	d3.select("svg").select("#China").append("polyline").attr("class", "player1").attr("points", shape);
		/////////
		// 	d3.select("svg").select("#testp").attr("transform", "translate(646,368)");
		// }, 1000);
	}

	ngOnDestroy() {
	}

	// Get css class for display
	dsp(elem: any) {
		if (elem.id === this.s) {
			return "c s"; // selected
		} else {
			if ((this.s) && (this.s !== '')) {
				let country = this.countries[this.s];
				if (country) {
					for (let id of country.connected) {
						if (elem.id === id) {
							return "c l"; // connected
						}
					}
				}
			}
			return "c";
		}
	}

	// Click a country
	ck(elem: any) {
		if (this.s === elem.id) {
			this.s = '';
		} else {
			this.s = elem.id;
			setTimeout(() => {
				let grph = d3.select("svg");
				grph.select("#other").attr("class", "badge player" + this.game.players[this.game.board[elem.id].ruler].index);
				grph.select("#country").text(elem.id);
				grph.select("#ruler").text("Owner: " + (this.game.board[elem.id].ruler === this.user ? '[yourself]' : this.game.board[elem.id].ruler));
				grph.select("#armies").text("Armies: " + this.game.board[elem.id].armies);
			}, 100);
		}
		this.socketService.mapClick(elem.id);
	}
}