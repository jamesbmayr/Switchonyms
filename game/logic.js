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
						callback(players, {success: true, message: "game will launch in...", ellipsis: true, phase: 0, round: 1})

						// instructions
							beginCountdown(request, function() {
								callback(players, {success: true, message: "find a player who shares a word with you!"})

								// begin round
									beginCountdown(request, function() {
										beginMatchPhase(request)
										
										for (var p in players) {
											callback([players[p]], {success: true, message: "matching time", phase: 0, round: 1, words: request.game.players[players[p]].state.words})
										}
									})
							})
					}
			}
			catch (error) {
				callback([request.session.id], {success: false, message: "unable to submit begin"})
			}
		}

	/* submitSwitch */
		module.exports.submitSwitch = submitSwitch
		function submitSwitch (request, callback) {
			try {
				request.game.updated = new Date().getTime()

				// unrequesting switch
					if (!request.post.active) {
						request.game.players[request.session.id].state.switching = false
						callback([request.session.id], {success: true})
					}

				// requesting switch
					else {
						// find switchee
							var switchee = Object.keys(request.game.players).find(function (o) {
								return ((o !== request.session.id) && request.game.players[o].state.words[0] && request.game.players[o].state.switching)
							}) || null

						// not ready to switch
							if (!switchee) {
								request.game.players[request.session.id].state.switching = true
								callback([request.session.id], {success: true})
							}
						
						// ready to switch
							else {
								switchWords(request.game.players[request.session.id], request.game.players[switchee])
								callback([request.session.id], {success: true, message: "switched!", phase: 1, words: request.game.players[request.session.id].state.words})
								callback([switchee          ], {success: true, message: "switched!", phase: 1, words: request.game.players[switchee].state.words})
							}
					}
			}
			catch (error) {
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
					if (!request.post.opponent || !isNumLet(request.post.opponent) || !request.game.players[request.post.opponent]) {
						callback([request.session.id], {success: false, message: "invalid opponent selection"})
					}

				// match 
					else if (!request.game.state.phase) {
						// unselecting opponent
							if (!request.post.active) {
								request.game.players[request.session.id].state.selecting = null
								callback([request.session.id], {success: true})
							}

						// selecting opponent
							else {
								request.game.players[request.session.id].state.selecting = request.post.opponent

								// no match
									if (!request.game.players[request.session.id].state.matches.includes(request.post.opponent)) {
										callback([request.session.id], {success: true})
									}
									else if (request.game.players[request.post.opponent].selecting !== request.session.id) {
										callback([request.session.id], {success: true})
									}

								// match
									else {
										// match & reset
											matchWords(request)

											for (var p in players) {
												resetPlayer(request.game.players[players[p]])
											}

										// message
											var others = players.filter(function (p) {
												return ((p !== request.session.id) && (p !== request.post.opponent))
											}) || []

											callback([request.session.id   ], {success: true, message: "matched with " + request.game.players[request.post.opponent].name + "!",                                       ellipsis: true, points: request.game.players[request.session.id   ].state.points})
											callback([request.post.opponent], {success: true, message: "matched with " + request.game.players[request.session.id   ].name + "!",                                       ellipsis: true, points: request.game.players[request.post.opponent].state.points})
											callback(others,                  {success: true, message: request.game.players[request.session.id] + " matched with " + request.game.players[request.post.opponent].name, ellipsis: true})

										// instructions
											beginCountdown(request, function() {
												callback([request.session.id, request.post.opponent], {success: true, message: "get someone to guess your word - but don't say it!"})
												callback(others, {success: true, message: "guess the clue-givers' words to get points!"})

												// begin round
													beginCountdown(request, function() {
														beginGuessPhase(request)

														createPointsdown(request.game.players[request.session.id   ], callback)
														createPointsdown(request.game.players[request.post.opponent], callback)

														callback([request.session.id   ], {success: true, message: "round " + request.game.state.round, phase: 1, round: request.game.state.round, words: request.game.players[request.session.id   ].state.words})
														callback([request.post.opponent], {success: true, message: "round " + request.game.state.round, phase: 1, round: request.game.state.round, words: request.game.players[request.post.opponent].state.words})
														callback(others,                  {success: true, message: "round " + request.game.state.round, phase: 1, round: request.game.state.round, ellipsis: true})
													})
											})
									}
							}
					}

				// guess
					else {
						if (!request.game.players[request.session.id].state.words[0]) {
							callback([request.session.id], {success: false, message: "you have no word"})
						}
						else if (request.game.players[request.post.opponent].state.words[0]) {
							callback([request.session.id], {success: false, message: "opponent has a word"})
						}
						else {
							// guess & reset
								guessWord(request)

							// new word
								if (request.game.state.count < 10) {
									resetPlayer(request.game.players[request.post.opponent])
									assignWord(request.game.players[request.post.opponent])

									// switch words ?
										var active = players.find(function (p) {
											return ((p !== request.post.opponent) && request.game.players[p].state.words[0] && request.game.players[p].state.switching)
										}) || null
										if (active) {
											switchWords(request.game.players[active], request.game.players[request.post.opponent])
										}

									callback([request.post.opponent], {success: true, message: "great guess!", phase: 1, words: request.game.players[request.post.opponent].state.words, points: request.game.players[request.post.opponent].state.points})
									callback([request.session.id   ], {success: true, message: "got it!",      phase: 1, ellipsis: true})
								}

							// round end ?
								else {
									// clear pointsLoops
										for (var p in players) {
											resetPlayer(request.game.players[players[p]])
										}

									// message
										var others = players.filter(function (p) {
											return ((p !== request.session.id) && (p !== request.post.opponent))
										})

										callback([request.post.opponent], {success: true, message: "great guess! that's the last word!", points: request.game.players[request.post.opponent].state.points})
										callback([request.session.id   ], {success: true, message: "got it! that's the last word!"})
										callback([others[o]],             {success: true, message: "that's the last word!"})

									// match phase
										if (request.game.state.round < 3) {
											// instructions
												beginCountdown(request, function() {
													callback(players, {success: true, message: "find a player who shares a word with you!"})
													
													// begin round
														beginCountdown(request, function() {
															beginMatchPhase(request)

															for (var p in players) {
																callback(players, {success: true, message: "matching time", phase: 0, round: request.game.state.round, words: request.game.players[players[p]].state.words})
															}
														})
												})
										}

									// game end
										else {
											// instructions
												beginCountdown(request, function() {
													callback(players, {success: true, message: "tallying up the final scores...", phase: 2, round: 4, ellipsis: true})

													// begin end		
														beginCountdown(request, function() {
															var winners = beginVictoryPhase(request)
															callback(players, {success: true, message: "victory: " + winners.join(" & ") + "", phase: 2, round: 4, ellipsis: true})
														})
												})
										}
								}
						}
					}
			}
			catch (error) {
				callback([request.session.id], {success: false, message: "unable to submit opponent"})
			}
		}

/*** players ***/
	/* resetPlayer */
		module.exports.resetPlayer = resetPlayer
		function resetPlayer(player) {
			try {
				player.state.words     = [null, null]
				player.state.matches   = [null, null]
				player.state.selecting = null
				player.state.switching = false
				player.state.counter   = 0
				clearInterval(player.state.loop)
				player.state.loop = null
			}
			catch (error) {
				logError(error)
			}
		}

	/* createPointsdown */
		module.exports.createPointsdown = createPointsdown
		function createPointsdown(player, callback) {
			clearInterval(player.state.loop)
			player.state.counter = 1000 / (player.state.points + 1)

			player.state.loop = setInterval(function() {
				if (player.state.counter) {
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

/*** words ***/
	/* assignWord */
		module.exports.assignWord = assignWord
		function assignWord(request, player) {
			try {
				var wordType = (request.game.state.round == 1 ? "noun" : (request.game.state.round == 2 ? "verb" : "adjective"))
											
				do {
					player.state.words[0] = main.getWord(wordType)
				}
				while (request.game.words[wordType].includes(player.state.words[0]))
				
				request.game.words[wordType].push(player.state.words[0])
			}
			catch (error) {
				logError(error)
			}
		}

	/* matchWords */
		module.exports.matchWords = matchWords
		function matchWords(request) {
			try {
				// award points
					request.game.players[request.session.id   ].state.points += (request.game.state.round * 100)
					request.game.players[request.post.opponent].state.points += (request.game.state.round * 100)
			}
			catch (error) {
				logError(error)
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
					request.game.players[request.post.opponent].state.points += (request.game.state.round * 100)
			}
			catch (error) {
				logError(error)
			}
		}

	/* switchWords */
		module.exports.switchWords = switchWords
		function switchWords(player, opponent) {
			try {
				// exchange words
					var tempWord = player.state.words[0]
					player.state.words[0] = opponent.state.words[0]
					opponent.state.words[0] = tempWord

				// unset switching
					player.state.switching = false
					opponent.state.switching = false
			}
			catch (error) {
				logError(error)
			}
		}

/* begins */
	/* beginCountdown */
		module.exports.beginCountdown = beginCountdown
		function beginCountdown(request, callback) {
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
					callback()
				}
			})
		}

	/* beginMatchPhase */
		module.exports.beginMatchPhase = beginMatchPhase
		function beginMatchPhase(request) {
			try {
				// set state
					request.game.state.round++
					request.game.state.count = 0
					request.game.state.phase = 0

				// assign first words
					var players = Object.keys(request.game.players)
					for (var p in players) {
						assignWord(request, request.game.players[players[p]])
					}

				// assign second words
					players = main.sortRandom(players)
					for (var i = 0; i < players.length; i++) {
						if (i) {
							request.game.players[players[i]].state.words[1] = request.game.players[players[i - 1]].state.words[0]
							request.game.players[players[i]].state.matches[0] = players[i - 1]
							request.game.players[players[i - 1]].state.matches[1] = players[i]
						}
						else {
							request.game.players[players[i]].state.words[1] = request.game.players[players[players.length - 1]].state.words[0]
							request.game.players[players[i]].state.matches[0] = players[players.length - 1]
							request.game.players[players[players.length - 1]].state.matches[1] = players[i]
						}
					}
			}
			catch (error) {
				logError(error)
			}
		}

	/* beginGuessPhase */
		module.exports.beginGuessPhase = beginGuessPhase
		function beginGuessPhase(request) {
			try {
				// set state
					request.game.state.count = 0
					request.game.state.phase = 1

				// assign words
					assignWord(request, request.game.players[request.session.id])
					assignWord(request, request.game.players[request.post.opponent])
			}
			catch (error) {
				logError(error)
			}
		}

	/* beginVictoryPhase */
		module.exports.beginVictoryPhase = beginVictoryPhase
		function beginVictoryPhase(request) {
			try {
				// reset state
					request.game.state.count = 0
					request.game.state.phase = 0
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
						return request.game.players[players[p]].state.points == max
					}) || []

					var ids   = []
					var names = []
					for (var v in victors) {
						ids.push(victors[v].id)
						names.push(victors[v].name)
					}

				// save & return
					request.game.state.victory = ids
					request.game.state.end = request.game.updated = new Date().getTime()

					return names || []
			}
			catch (error) {
				logError(error)
			}
		}
