/*** modules ***/
	var main = require("../main/logic")
	module.exports = {}

/*** submits ***/
	/* submitBegin */
		module.exports.submitBegin = submitBegin
		function submitBegin (request, callback) {
			try {
				request.game.updated = new Date().getTime()

				// errors
					if (request.game.state.start) {
						callback([request.session.id], {success: false, message: "game already started"})
					}
					else if (Object.keys(request.game.players).length < 4) {
						callback([request.session.id], {success: false, message: "game requires 4 players"})
					}
					else if (Object.keys(request.game.players).length > 10) {
						callback([request.session.id], {success: false, message: "game cannot exceed 10 players"})
					}

				// begin
					else {
						request.game.updated = request.game.state.start = new Date().getTime()
						var players = Object.keys(request.game.players)
						callback(players, {success: true, message: "game will launch in...", ellipsis: true, round: 1})

						// instructions
							beginCountdown(request, callback, function() {
								setTimeout(function() {
									callback(players, {success: true, message: "welcome to switchonyms!"})	
								}, 0)

								setTimeout(function() {
									callback(players, {success: true, message: "the rules are simple: guess words!"})
								}, 3000)

								setTimeout(function() {
									callback(players, {success: true, message: "if you have a word..."})
								}, 7000)

								setTimeout(function() {
									callback(players, {success: true, message: "...give clues until someone guesses!"})
								}, 10000)

								setTimeout(function() {
									callback(players, {success: true, message: "if you don't have a word..."})
								}, 14000)

								setTimeout(function() {
									callback(players, {success: true, message: "...listen to those clues to get one!"})
								}, 17000)

								setTimeout(function() {
									callback(players, {success: true, message: "if you get stuck, touch the [S] button to switch words."})
								}, 21000)

								setTimeout(function() {
									beginCountdown(request, callback, function() {
										beginGuessing(request)
										
										for (var p in players) {
											if (request.game.players[players[p]].state.word) {
												callback([players[p]], {success: true, message: "here's your word...", round: 1, word: request.game.players[players[p]].state.word})
											}
											else {
												callback([players[p]], {success: true, message: "guessing time...", round: 1, ellipsis: true})
											}
										}
									})
								}, 25000)
							})
					}
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to submit begin"})
			}
		}

	/* submitSwitch */
		module.exports.submitSwitch = submitSwitch
		function submitSwitch (request, callback) {
			try {
				request.game.updated = new Date().getTime()
				
				// errors
					if (!request.game.state.start || request.game.state.end) {
						callback([request.session.id], {success: false, message: "game not in play"})
					}

				// new word
					else {
						assignWord(request, request.game.players[request.session.id])
						callback([request.session.id], {success: true, message: "switched!", word: request.game.players[request.session.id].state.word})
					}
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to submit switch"})
			}
		}

	/* submitOpponent */
		module.exports.submitOpponent = submitOpponent
		function submitOpponent (request, callback) {
			try {
				request.game.updated = new Date().getTime()
				var players = Object.keys(request.game.players)

				// errors
					if (!request.game.state.start || request.game.state.end) {
						callback([request.session.id], {success: false, message: "game not in play"})
					}
					else if (!request.post.opponent || !main.isNumLet(request.post.opponent) || !request.game.players[request.post.opponent]) {
						callback([request.session.id], {success: false, message: "invalid opponent selection"})
					}

				// guess
					else {
						// errors
							if (!request.game.players[request.session.id].state.word) {
								callback([request.session.id], {success: false, message: "you have no word"})
							}
							else if (request.game.players[request.post.opponent].state.word) {
								callback([request.session.id], {success: false, message: "opponent has a word"})
							}
						
						// unselecting opponent
							else if (!request.post.selecting) {
								var wordee = request.game.players[request.session.id].state.selecting
								if (wordee) {
									request.game.players[wordee].state.selecting = null
									request.game.players[request.session.id].state.selecting = null
									callback([wordee], {success: true, ellipsis: true, confirm: false, message: "false alarm"})
								}
								
								callback([request.session.id], {success: true})
							}
						
						// selecting opponent
							else {
								var wordee = request.game.players[request.session.id].state.selecting
								if (wordee) {
									request.game.players[wordee].state.selecting = null
									callback([wordee], {success: true, message: "false alarm", confirm: false})
								}

								request.game.players[request.session.id].state.selecting = request.post.opponent
								request.game.players[request.post.opponent].state.selecting = request.session.id
							
								callback([request.session.id], {success: true, message: "waiting for confirmation"})
								callback([request.post.opponent], {success: true, message: "did you guess?", confirm: true})
							}
					}
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to submit opponent"})
			}
		}
	
	/* submitConfirm */
		module.exports.submitConfirm = submitConfirm
		function submitConfirm(request, callback) {
			try {
				request.game.updated = new Date().getTime()
				var players = Object.keys(request.game.players)

				// errors
					if (!request.game.state.start || request.game.state.end) {
						callback([request.session.id], {success: false, message: "game not in play"})
					}
					else if (request.game.players[request.session.id].state.word) {
						callback([request.session.id], {success: false, message: "you have a word"})
					}
					else if (!request.game.players[request.session.id].state.selecting || (request.game.players[ request.game.players[request.session.id].state.selecting ].state.selecting !== request.session.id)) {
						callback([request.session.id], {success: false, message: "you were not selected"})
					}
				
				// guess & reset
					else {
						var worder = request.game.players[request.session.id].state.selecting
						resetPlayer(request.game.players[worder])
						guessWord(request)

						// new word
							if (request.game.state.count < 10) {
								assignWord(request, request.game.players[request.session.id])

								createPointsdown(request.game.players[request.session.id], callback)

								callback([request.session.id], {success: true, message: "new word", confirm: false, word: request.game.players[request.session.id].state.word, points: request.game.players[request.session.id].state.points})
								callback([worder],             {success: true, message: "got it!",  ellipsis: true})
							}

						// round end ?
							else {
								// clear pointsLoops & show points
									var pointsList = []
									var clearList  = []
									for (var p in players) {
										pointsList.push({id: players[p], points: request.game.players[players[p]].state.points})
										clearList.push( {id: players[p], points: null})
										resetPlayer(request.game.players[players[p]])
									}

								// message
									var others = players.filter(function (p) {
										return ((p !== request.session.id) && (p !== worder))
									})

									callback([request.session.id], {success: true, message: "great guess! that's the last word!", confirm: false, ellipsis: true, points: request.game.players[request.session.id].state.points, opponents: pointsList})
									callback([worder],             {success: true, message: "got it! that's the last word!", ellipsis: true, opponents: pointsList})
									callback(others,               {success: true, message: "that's the last word!", ellipsis: true, opponents: pointsList})

								// next round
									if (request.game.state.round < 3) {
										beginCountdown(request, callback, function() {
											callback(players, {success: true, message: ("ready for the " + (request.game.state.round == 1 ? "next" : "final") + " round?") })
												
											// begin round
												beginCountdown(request, callback, function() {
													beginGuessing(request)

													for (var p in players) {
														if (request.game.players[players[p]].state.word) {
															callback([players[p]], {success: true, message: "here's your word...", round: request.game.state.round, word: request.game.players[players[p]].state.word, opponents: clearList})
														}
														else {
															callback([players[p]], {success: true, message: "guessing time...", round: request.game.state.round, ellipsis: true, opponents: clearList})
														}
													}
												})
										})
									}

								// game end
									else {
										beginCountdown(request, callback, function() {
											callback(players, {success: true, message: "here are the final scores...", ellipsis: true})

											// begin end		
												beginCountdown(request, callback, function() {
													// find winners
														var winners = beginVictory(request) || []

													// get pointsList
														var pointsList = []
														var clearList  = []
														for (var p in players) {
															pointsList.push({id: players[p], points: request.game.players[players[p]].state.points})
															clearList.push( {id: players[p], points: null})
														}

													// send message
														callback(players, {success: true, victory: winners, round: 4, ellipsis: true, opponents: clearList})
												})
										})
									}
							}
					}
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to submit confirm"})
			}
		}

/*** players ***/
	/* addPlayer */
		module.exports.addPlayer = addPlayer
		function addPlayer(request, callback) {
			try {
				if (!request.game) {
					callback([request.session.id], {success: false, message: "unable to find game"})
				}
				else if (!request.game.players[request.session.id]) {
					callback([request.session.id], {success: false, message: "unable to find player in game"})
				}
				else {
					// save connection
						request.game.players[request.session.id].connected  = true
						request.game.players[request.session.id].connection = request.connection

					// new player
						var player = {
							id: request.session.id,
							name: request.game.players[request.session.id].name,
							color: request.game.players[request.session.id].color
						}

					// send
						var opponents = Object.keys(request.game.players).filter(function (p) {
							return p !== request.session.id
						})
						callback(opponents, {success: true, opponents: [player]})
				}
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to add player"})
			}
		}

	/* removePlayer */
		module.exports.removePlayer = removePlayer
		function removePlayer(request, callback) {
			try {
				main.logStatus("[CLOSED]: " + request.path.join("/") + " @ " + (request.ip || "?"))
				if (request.game) {

					// remove player or connection?
						if (request.game.state.start) {
							request.game.players[request.session.id].connected = false
						}
						else {
							delete request.game.players[request.session.id]
						}

					// delete game ?
						var opponents = Object.keys(request.game.players).filter(function (p) {
							return request.game.players[p].connected
						}) || []

						if (!opponents.length) {
							callback([], {success: true, delete: true})
						}
					
					// still players
						else {
							var player = {
								id: request.session.id,
								remove: true
							}

							callback(opponents, {success: true, opponents: [player]})
						}
				}
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to remove player"})
			}
		}

	/* resetPlayer */
		module.exports.resetPlayer = resetPlayer
		function resetPlayer(player) {
			try {
				player.state.word      = null
				player.state.selecting = null
				player.state.counter   = 0
				clearInterval(player.state.loop)
				player.state.loop = null
			}
			catch (error) {
				main.logError(error)
			}
		}

	/* createPointsdown */
		module.exports.createPointsdown = createPointsdown
		function createPointsdown(player, callback) {
			try {
				clearInterval(player.state.loop)
				player.state.counter = 10000 / (player.state.points + 1) / 10

				player.state.loop = setInterval(function() {
					if (player.state.counter > 0) {
						player.state.counter--
					}
					else {
						player.state.points = player.state.points - 1
						player.state.counter = 10000 / (player.state.points + 1)

						if (player.state.points <= 0) {
							clearInterval(player.state.loop)
						}

						callback([player.id], {success: true, points: player.state.points})
					}
				}, 100)
			}
			catch (error) {
				main.logError(error)
			}
		}

/*** words ***/
	/* assignWord */
		module.exports.assignWord = assignWord
		function assignWord(request, player) {
			try {
				var wordType = (request.game.state.round == 1 ? "noun" : (request.game.state.round == 2 ? "verb" : "adjective"))
											
				do {
					player.state.word = main.getWord(wordType)
				}
				while (request.game.words[wordType].includes(player.state.word))
				
				request.game.words[wordType].push(player.state.word)
			}
			catch (error) {
				main.logError(error)
			}
		}

	/* guessWord */
		module.exports.guessWord = guessWord
		function guessWord(request) {
			try {
				// count word
					request.game.state.count++
					resetPlayer(request.game.players[request.session.id])

				// award points
					request.game.players[request.session.id].state.points += (request.game.state.round * 100)
			}
			catch (error) {
				main.logError(error)
			}
		}

/* begins */
	/* beginCountdown */
		module.exports.beginCountdown = beginCountdown
		function beginCountdown(request, callback, then) {
			try {
				var beginCounter = 5
				var beginLoop = setInterval(function () {
					if (beginCounter > 3) {
						beginCounter--
					}
					else if (beginCounter) {
						callback(Object.keys(request.game.players), {success: true, message: beginCounter})
						beginCounter--
					}
					else {
						clearInterval(beginLoop)
						beginLoop = null
						then()
					}
				}, 1000)
			}
			catch (error) {
				main.logError(error)
			}
		}

	/* beginGuessing */
		module.exports.beginGuessing = beginGuessing
		function beginGuessing(request) {
			try {
				// set state
					request.game.state.round++
					request.game.state.count = 0

				// pick players
					var allPlayers      = Object.keys(request.game.players)
					var previousPlayers = request.game.state.starters
					var otherPlayers    = allPlayers.filter(function(p) {
						return !previousPlayers.includes(p)
					}) || []

				// assign words
					var count = 0
					var escape = 0

					while (count < 2 && escape < 100) {
						escape++

						if (otherPlayers.length) {
							var nextPlayer = main.chooseRandom(otherPlayers)
							previousPlayers.push(nextPlayer)
							otherPlayers = otherPlayers.filter(function(p) {
								return p !== nextPlayer
							})

							assignWord(request, request.game.players[nextPlayer])
							count++
						}
						else {
							previousPlayers = []
							otherPlayers = allPlayers
						}
					}
			}
			catch (error) {
				main.logError(error)
			}
		}

	/* beginVictory */
		module.exports.beginVictory = beginVictory
		function beginVictory(request) {
			try {
				// reset state
					request.game.state.count = 0
					request.game.state.round = 4

				// reset players, find max score
					var max = 0
					var players = Object.keys(request.game.players)
					for (var p in players) {
						resetPlayer(request.game.players[players[p]])

						if (request.game.players[players[p]].state.points > max) {
							max = request.game.players[players[p]].state.points
						}
					}

				// find winner
					var victors = players.filter(function (p) {
						return request.game.players[p].state.points == max
					}) || []

					var names = []
					for (var v in victors) {
						names.push(request.game.players[victors[v]].name)
					}

				// save & return
					request.game.state.victory = names
					request.game.state.end = new Date().getTime()

					return names || []
			}
			catch (error) {
				main.logError(error)
			}
		}
