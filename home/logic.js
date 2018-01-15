/*** modules ***/
	var main = require("../main/logic")
	var game = require("../game/logic")
	module.exports = {}

/*** creates ***/
	/* createGame */
		module.exports.createGame = createGame
		function createGame(request, db, callback) {
			try {
				// create game
					request.game = {
						id: main.generateRandom(null, 4),
						created: new Date().getTime(),
						updated: new Date().getTime(),
						state: {
							locked:  false,
							start:   false,
							end:     false,
							victory: false,
							round:   0
						},
						players: [],
						words: {
							nouns: [],
							verbs: [],
							adjectives: []
						}
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
					var player = {
						id: request.session.id,
						name: name,
						color: main.chooseRandom(colors),
						points: 0,
						word: null,
						connection: null
					}

				// return value
					return player
			}
			catch (error) {
				main.logError(error)
				callback({success: false, message: "unable to create player"})
			}
		}	

/*** joins ***/
	/* joinGame */
		module.exports.joinGame = joinGame
		function joinGame(request, db, callback) {
			try {
				if (!request.post || !request.post.gameid) {
					callback({success: false, message: "invalid game id"})
				}
				else if (!main.isNumLet(request.post.gameid) || (request.post.gameid.length !== 4)) {
					callback({success: false, message: "gameid must be 4 letters and numbers"})
				}
				else if (!db[request.post.gameid]) {
					callback({success: false, message: "game not found"})
				}
				else if (db[request.post.gameid].state.end) {
					callback({success: false, message: "game already ended"})
				}
				else if (!db[request.post.gameid].players[request.session.id] && (db[request.post.gameid].players.length >= 10)) {
					callback({success: false, message: "game is at capacity"})
				}
				else if (!db[request.post.gameid].players[request.session.id] && db[request.post.gameid].state.start) {
					callback({success: false, message: "game already started"})
				}
				else if (db[request.post.gameid].players[request.session.id]) {
					callback({success: true, message: "rejoining game", location: "../../game/" + request.post.gameid})
				}
				else {
					request.game = db[request.post.gameid]

					// create player
						var player = createPlayer(request)
						request.game.players[request.session.id] = player

					callback({success: true, message: "game joined", location: "../../game/" + request.game.id})
				}
			}
			catch (error) {
				main.logError(error)
				callback({success: false, message: "unable to join game"})
			}
		}