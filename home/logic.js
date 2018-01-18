/*** modules ***/
	var main = require("../main/logic")
	var game = require("../game/logic")
	module.exports = {}

/*** creates ***/
	/* createGame */
		module.exports.createGame = createGame
		function createGame(request, callback) {
			try {
				if (!request.game || !request.game.id) {
					callback({success: false, message: "no game"})
				}
				else {
					// create game
						request.game.created = new Date().getTime()
						request.game.updated = new Date().getTime()
						request.state = {
							start:   false,
							end:     false,
							victory: [],
							count:   0,
							phase:   0,
							round:   0
						}
						request.game.players = []
						request.game.words = {
							nouns:      [],
							verbs:      [],
							adjectives: []
						}

					// create player
						var player = createPlayer(request)
						request.game.players[request.session.id] = player

					// add to database
						while (db[request.game.id]) {
							request.game.id = main.generateRandom(null, 4)
						}
						db[request.game.id] = request.game
					
					callback({success: true, message: "game created", location: "../../game/" + request.game.id})
				}
			}
			catch (error) {
				main.logError(error)
				callback({success: false, message: "unable to create game"})
			}
		}
	
	/* createPlayer */
		module.exports.createPlayer = createPlayer
		function createPlayer(request) {
			try {
				// get color
					var colors = main.getAsset("colors") || []
					var players = Object.keys(request.game.players)
					for (var p in players) {
						colors = colors.filter(function(c) {
							return c !== request.game.players[players[p]].color
						})
					}

				// get name
					var name = main.sanitizeString(request.post.name) || null
						name = name || "player " + (Object.keys(request.game.players).length + 1)
					if (name.length > 16) {
						name = name.slice(0,16)
					}
					else if (name.length < 4) {
						while (name.length < 4) {
							name = name + "_"	
						}
					}

				// create player
					var player = {id: request.session.id}
						player.name = name
						player.color = main.chooseRandom(colors)
						player.state = {
							points:    0,
							words:     [null, null],
							matches:   [null, null],
							selecting: null,
							switching: false,
							counter:   0,
							loop:      null
						}
						player.connection = null
					}

				// return value
					return player || {}
			}
			catch (error) {
				main.logError(error)
				callback({success: false, message: "unable to create player"})
			}
		}	

/*** joins ***/
	/* joinGame */
		module.exports.joinGame = joinGame
		function joinGame(request, callback) {
			try {
				if (request.game.state.end) {
					callback({success: false, message: "game already ended"})
				}
				else if (!request.game.players[request.session.id] && (Object.keys(request.game.players).length >= 10)) {
					callback({success: false, message: "game is at capacity"})
				}
				else if (!request.game.players[request.session.id] && request.game.state.start) {
					callback({success: false, message: "game already started"})
				}
				else if (request.game.players[request.session.id]) {
					callback({success: true, message: "rejoining game", location: "../../game/" + request.game.id})
				}
				else {
					// create player
						request.game.players[request.session.id] = createPlayer(request)

					callback({success: true, message: "game joined", location: "../../game/" + request.game.id})
				}
			}
			catch (error) {
				main.logError(error)
				callback({success: false, message: "unable to join game"})
			}
		}
