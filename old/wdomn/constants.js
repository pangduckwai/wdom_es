module.exports = Object.freeze({
SERVER_PORT: 54322,
MAX_PLAYER: 6,
MAX_GAME: 20,
ADMIN: "admin",
CONTINENTS: {
	"Africa": {
		army: 3,
		countries: ["Congo", "East-Africa", "Egypt", "Madagascar", "North-Africa", "South-Africa"]
	}, "Asia": {
		army: 7,
		countries: ["Afghanistan", "China", "India", "Irkutsk", "Japan", "Kamchatka", "Manchuria", "Middle-East", "Siam", "Siberia", "Ural", "Yakutsk"]
	}, "Australia": {
		army: 2,
		countries: ["Eastern-Australia", "Indonesia", "New-Guinea", "Western-Australia"]
	}, "Europe": {
		army: 5,
		countries: ["Great-Britain", "Iceland", "Northern-Europe", "Scandinavia", "Southern-Europe", "Ukraine", "Western-Europe"]
	}, "North-America": {
		army: 5,
		countries: ["Alaska", "Alberta", "Eastern-United-States", "Greenland", "Mexico", "Northwest-Territory", "Ontario", "Quebec", "Western-United-States"]
	}, "South-America": {
		army: 2,
		countries: ["Argentina", "Brazil", "Peru", "Venezuela"]
	},
},
COUNTRIES: {
	"Congo": {
		continent: "Africa", connected: ["East-Africa", "North-Africa", "South-Africa"]
	}, "East-Africa": {
		continent: "Africa", connected: ["Congo", "Egypt", "Madagascar", "North-Africa", "South-Africa", "Middle-East"]
	}, "Egypt": {
		continent: "Africa", connected: ["East-Africa", "North-Africa", "Middle-East", "Southern-Europe"]
	}, "Madagascar": {
		continent: "Africa", connected: ["East-Africa", "South-Africa"]
	}, "North-Africa": {
		continent: "Africa", connected: ["Congo", "Egypt", "East-Africa", "Southern-Europe", "Western-Europe", "Brazil"]
	}, "South-Africa": {
		continent: "Africa", connected: ["Congo", "East-Africa", "Madagascar"]
	}, "Afghanistan": {
		continent: "Asia", connected: ["China", "India", "Middle-East", "Ural", "Ukraine"]
	}, "China": {
		continent: "Asia", connected: ["Afghanistan", "India", "Manchuria", "Siam", "Siberia", "Ural"]
	}, "India": {
		continent: "Asia", connected: ["Afghanistan", "China", "Middle-East", "Siam"]
	}, "Irkutsk": {
		continent: "Asia", connected: ["Kamchatka", "Manchuria", "Siberia", "Yakutsk"]
	}, "Japan": {
		continent: "Asia", connected: ["Kamchatka", "Manchuria"]
	}, "Kamchatka": {
		continent: "Asia", connected: ["Irkutsk", "Japan", "Manchuria", "Yakutsk", "Alaska"]
	}, "Manchuria": {
		continent: "Asia", connected: ["China", "Irkutsk", "Japan", "Kamchatka", "Siberia"]
	}, "Middle-East": {
		continent: "Asia", connected: ["Afghanistan", "India", "Egypt", "East-Africa", "Southern-Europe", "Ukraine"]
	}, "Siam": {
		continent: "Asia", connected: ["China", "India", "Indonesia"]
	}, "Siberia": {
		continent: "Asia", connected: ["China", "Irkutsk", "Manchuria", "Ural", "Yakutsk"]
	}, "Ural": {
		continent: "Asia", connected: ["Afghanistan", "China", "Siberia", "Ukraine"]
	}, "Yakutsk": {
		continent: "Asia", connected: ["Irkutsk", "Kamchatka", "Siberia"]
	}, "Eastern-Australia": {
		continent: "Australia", connected: ["New-Guinea", "Western-Australia"]
	}, "Indonesia": {
		continent: "Australia", connected: ["New-Guinea", "Western-Australia", "Siam"]
	}, "New-Guinea": {
		continent: "Australia", connected: ["Eastern-Australia", "Indonesia", "Western-Australia"]
	}, "Western-Australia": {
		continent: "Australia", connected: ["Eastern-Australia", "Indonesia", "New-Guinea"]
	}, "Great-Britain": {
		continent: "Europe", connected: ["Iceland", "Northern-Europe", "Scandinavia", "Western-Europe"]
	}, "Iceland": {
		continent: "Europe", connected: ["Great-Britain", "Scandinavia", "Greenland"]
	}, "Northern-Europe": {
		continent: "Europe", connected: ["Great-Britain", "Scandinavia", "Southern-Europe", "Ukraine", "Western-Europe"]
	}, "Scandinavia": {
		continent: "Europe", connected: ["Great-Britain", "Iceland", "Northern-Europe", "Ukraine"]
	}, "Southern-Europe": {
		continent: "Europe", connected: ["Northern-Europe", "Ukraine", "Western-Europe", "Egypt", "North-Africa", "Middle-East"]
	}, "Ukraine": {
		continent: "Europe", connected: ["Northern-Europe", "Scandinavia", "Southern-Europe", "Afghanistan", "Middle-East", "Ural"]
	}, "Western-Europe": {
		continent: "Europe", connected: ["Great-Britain", "Northern-Europe", "Southern-Europe", "North-Africa"]
	}, "Alaska": {
		continent: "North-America", connected: ["Alberta", "Northwest-Territory", "Kamchatka"]
	}, "Alberta": {
		continent: "North-America", connected: ["Alaska", "Northwest-Territory", "Ontario", "Western-United-States"]
	}, "Eastern-United-States": {
		continent: "North-America", connected: ["Mexico", "Ontario", "Quebec", "Western-United-States"]
	}, "Greenland": {
		continent: "North-America", connected: ["Northwest-Territory", "Ontario", "Quebec", "Iceland"]
	}, "Mexico": {
		continent: "North-America", connected: ["Eastern-United-States", "Western-United-States", "Venezuela"]
	}, "Northwest-Territory": {
		continent: "North-America", connected: ["Alaska", "Alberta", "Greenland", "Ontario"]
	}, "Ontario": {
		continent: "North-America", connected: ["Alberta", "Eastern-United-States", "Greenland", "Northwest-Territory", "Quebec", "Western-United-States"]
	}, "Quebec": {
		continent: "North-America", connected: ["Eastern-United-States", "Greenland", "Ontario"]
	}, "Western-United-States": {
		continent: "North-America", connected: ["Alberta", "Eastern-United-States", "Mexico", "Ontario"]
	}, "Argentina": {
		continent: "South-America", connected: ["Brazil", "Peru"]
	}, "Brazil": {
		continent: "South-America", connected: ["Argentina", "Peru", "Venezuela", "North-Africa"]
	}, "Peru": {
		continent: "South-America", connected: ["Argentina", "Brazil", "Venezuela"]
	}, "Venezuela": {
		continent: "South-America", connected: ["Brazil", "Peru", "Mexico"]
	}
}});