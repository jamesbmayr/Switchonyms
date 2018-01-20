/*** modules ***/
	var http = require("http")
	var fs   = require("fs")
	var qs   = require("querystring")
	var ws   = require("websocket").server
	var main = require("./main/logic")
	var game = require("./game/logic")
	var home = require("./home/logic")

/*** server ***/
	var port = main.getEnvironment("port")
	var server = http.createServer(handleRequest)
		server.listen(port, function (error) {
			if (error) {
				main.logError(error)
			}
			else {
				main.logStatus("listening on port " + port)
			}
		})

/*** socket ***/
	var socket = new ws({
		httpServer: server,
		autoAcceptConnections: false
	})
		socket.on("request", handleSocket)

/*** database ***/
	var db   = {}
	var dbLoop = setInterval(function() {
		main.cleanDatabase(db)
	}, (1000 * 60 * 60))

/*** handleRequest ***/
	function handleRequest(request, response) {
		// collect data
			var data = ""
			request.on("data", function (chunk) {
				data += chunk
			})
			request.on("end", parseRequest)

		/* parseRequest */
			function parseRequest() {
				try {
					// get request info
						request.get    = qs.parse(request.url.split("?")[1]) || {}
						request.path   = request.url.split("?")[0].split("/") || []
						request.url    = request.url.split("?")[0] || "/"
						request.post   = data ? JSON.parse(data) : {}
						request.cookie = request.headers.cookie ? qs.parse(request.headers.cookie.replace(/; /g, "&")) : {}
						request.ip     = request.headers["x-forwarded-for"] || request.connection.remoteAddress || request.socket.remoteAddress || request.connection.socket.remoteAddress

					// log it
						if (request.url !== "/favicon.ico") {
							main.logStatus((request.cookie.session || "new") + " @ " + request.ip + "\n[" + request.method + "] " + request.path.join("/") + "\n" + JSON.stringify(request.method == "GET" ? request.get : request.post))
						}

					// where next ?
						if ((/[.](ico|png|jpg|jpeg|gif|svg|pdf|txt|css|js)$/).test(request.url)) { // serve asset
							routeRequest()
						}
						else { // get session and serve html
							main.determineSession(request, routeRequest)
						}
				}
				catch (error) {
					_403("unable to parse request")
				}
			}

		/* routeRequest */
			function routeRequest() {
				try {
					// assets
						if (!request.session) {
							switch (true) {
								// logo
									case (/\/favicon[.]ico$/).test(request.url):
									case (/\/icon[.]png$/).test(request.url):
									case (/\/logo[.]png$/).test(request.url):
									case (/\/apple\-touch\-icon[.]png$/).test(request.url):
									case (/\/apple\-touch\-icon\-precomposed[.]png$/).test(request.url):
										try {
											response.writeHead(200, {"Content-Type": "image/png"})
											fs.readFile("./main/logo.png", function (error, file) {
												if (error) {
													_404(error)
												}
												else {
													response.end(file, "binary")
												}
											})
										}
										catch (error) {_404(error)}
									break

								// banner
									case (/\/banner[.]png$/).test(request.url):
										try {
											response.writeHead(200, {"Content-Type": "image/png"})
											fs.readFile("./main/banner.png", function (error, file) {
												if (error) {
													_404(error)
												}
												else {
													response.end(file, "binary")
												}
											})
										}
										catch (error) {_404(error)}
									break

								// stylesheet
									case (/\/stylesheet[.]css$/).test(request.url):
										try {
											response.writeHead(200, {"Content-Type": "text/css"})
											fs.readFile("./main/stylesheet.css", "utf8", function (error, data) {
												if (error) {
													_404(error)
												}
												else {
													fs.readFile("./" + request.path[1] + "/stylesheet.css", "utf8", function (error, file) {
														if (error) {
															_404(error)
														}
														else {
															response.end(data + file)
														}
													})
												}
											})
										}
										catch (error) {_404(error)}
									break

								// script
									case (/\/script[.]js$/).test(request.url):
										try {
											response.writeHead(200, {"Content-Type": "text/javascript"})
											fs.readFile("./main/script.js", "utf8", function (error, data) {
												if (error) {
													_404(error)
												}
												else {
													fs.readFile("./" + request.path[1] + "/script.js", "utf8", function (error, file) {
														if (error) {
															_404(error)
														}
														else {
															response.end("window.onload = function() { \n" + data + "\n\n" + file + "\n}")
														}
													})
												}
											})
										}
										catch (error) {_404(error)}
									break

								// others
									default:
										_404()
									break
							}
						}
						
					// get
						else if (request.method == "GET") {
							response.writeHead(200, {
								"Set-Cookie": String( "session=" + request.session.id + "; expires=" + (new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 7)).toUTCString()) + "; path=/; domain=" + main.getEnvironment("domain") ),
								"Content-Type": "text/html; charset=utf-8"
							})

							switch (true) {
								// home
									case (/^\/$/).test(request.url):
										try {
											main.renderHTML(request, "./home/index.html", function (html) {
												response.end(html)
											})
										}
										catch (error) {_404(error)}
									break

								// about
									case (/^\/about\/?$/).test(request.url):
										try {
											main.renderHTML(request, "./about/index.html", function (html) {
												response.end(html)
											})
										}
										catch (error) {_404(error)}
									break

								// game
									case (/^\/game\/[a-zA-Z0-9]{4}$/).test(request.url):
										try {
											var id = request.path[2].toLowerCase()
											request.game = db[id] || false

											if (!request.game) {
												_302("../../")
											}
											else if (!request.game.players[request.session.id]) {
												_302("../../")
											}
											else {
												main.renderHTML(request, "./game/index.html", function (html) {
													response.end(html)
												})
											}
										}
										catch (error) {_404(error)}
									break

								// others
									default:
										_404()
									break
							}
						}

					// post
						else if (request.method == "POST" && request.post.action) {
							response.writeHead(200, {"Content-Type": "text/json"})

							switch (request.post.action) {
								// home
									case "createGame":
										try {
											do {
												id = main.generateRandom(null, 4)
											}
											while (db[id])
											request.game = {id: id}
											db[request.game.id] = request.game

											home.createGame(request, function (data) {
												response.end(JSON.stringify(data))
											})
										}
										catch (error) {_403(error)}
									break

									case "joinGame":
										try {
											if (!request.post.gameid || (request.post.gameid.length !== 4) || !main.isNumLet(request.post.gameid)) {
												response.end(JSON.stringify({success: false, message: "gameid must be 4 letters and numbers"}))
											}
											else if (!db[request.post.gameid]) {
												response.end(JSON.stringify({success: false, message: "game not found"}))
											}
											else {
												request.game = db[request.post.gameid]

												home.joinGame(request, function (data) {
													response.end(JSON.stringify(data))
												})
											}
										}
										catch (error) {_403(error)}
									break

								// others
									default:
										_403()
									break
							}
						}

					// others
						else {
							_403("unknown route")
						}
				}
				catch (error) {
					_403("unable to route request")
				}
			}

		/* _302 */
			function _302(data) {
				main.logStatus("redirecting to " + (data || "/"))
				var id = request.session ? request.session.id : 0
				response.writeHead(302, {
					"Set-Cookie": String( "session=" + id + "; expires=" + (new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 7)).toUTCString()) + "; path=/; domain=" + main.getEnvironment("domain") ),
					Location: data || "../../../../"
				})
				response.end()
			}

		/* _403 */
			function _403(data) {
				main.logError(data)
				var id = request.session ? request.session.id : 0
				response.writeHead(403, {
					"Set-Cookie": String( "session=" + id + "; expires=" + (new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 7)).toUTCString()) + "; path=/; domain=" + main.getEnvironment("domain") ),
					"Content-Type": "text/json"
				})
				response.end( JSON.stringify({success: false, error: data}) )
			}

		/* _404 */
			function _404(data) {
				main.logError(data)
				var id = request.session ? request.session.id : 0
				response.writeHead(404, {
					"Set-Cookie": String( "session=" + id + "; expires=" + (new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 7)).toUTCString()) + "; path=/; domain=" + main.getEnvironment("domain") ),
					"Content-Type": "text/html; charset=utf-8"
				})
				main.renderHTML(request, "./main/_404.html", function (html) {
					response.end(html)
				})
			}
	}

/*** handleSocket ***/
	function handleSocket(request) {
		// collect data
			if ((request.origin.replace("https://","").replace("http://","").replace("www.","") !== main.getEnvironment("domain")) && (request.origin !== "http://" + main.getEnvironment("domain") + ":" + main.getEnvironment("port"))) {
				request.reject()
				main.logStatus("[REJECTED]: " + request.origin + " @ " + (request.socket._peername.address || "?"))
			}
			else {
				request.connection = request.accept(null, request.origin)
				parseSocket()
			}

		/* parseSocket */
			function parseSocket() {
				try {
					// get request info
						request.url     = (request.httpRequest.headers.host || "") + (request.httpRequest.url || "")
						request.path    = request.httpRequest.url.split("?")[0].split("/") || []
						request.cookie  = request.httpRequest.headers.cookie ? qs.parse(request.httpRequest.headers.cookie.replace(/; /g, "&")) : {}
						request.headers = {}
						request.headers["user-agent"] = request.httpRequest.headers['user-agent']
						request.headers["accept-language"] = request.httpRequest.headers['accept-language']
						request.ip      = request.connection.remoteAddress || request.socket._peername.address

					// log it
						main.logStatus((request.cookie.session || "new") + " @ " + request.ip + "\n[WEBSOCKET] " + request.path.join("/"))

					// get session and wait for messages
						main.determineSession(request, routeSocket)
				}
				catch (error) {
					_400("unable to parse socket")
				}
			}

		/* routeSocket */
			function routeSocket() {
				try {
					request.game = db[request.path[2]] || false
					
					// on connect
						game.addPlayer(request, function (recipients, data) {
							if (!data.success) {
								_400(data.message || "unable to connect")
							}
							else {
								for (var r in recipients) {
									try {
										request.game.players[recipients[r]].connection.sendUTF(JSON.stringify(data))
									}
									catch (error) { main.logError(error) }
								}
							}
						})

					// on close
						request.connection.on("close", function (reasonCode, description) {
							game.removePlayer(request, function (recipients, data) {
								if (data.delete) {
									delete db[request.game.id]
								}
								else {
									for (var r in recipients) {
										try {
											request.game.players[recipients[r]].connection.sendUTF(JSON.stringify(data))
										}
										catch (error) { main.logError(error) }
									}
								}
							})
						})
					
					// on message
						request.connection.on("message", function (message) {
							// get post data
								try {
									request.post = JSON.parse(message.utf8Data) || null
								}
								catch (error) {
									request.post = null
									main.logError(error)
								}

							if (request.post && request.post.action) {
								main.logStatus(request.session.id + " @ " + request.ip + "\n[WEBSOCKET] " + request.path.join("/") + "\n" + message.utf8Data)
								
								switch (request.post.action) {
									case "submitBegin":
										try {
											game.submitBegin(request, function (recipients, data) {
												for (var r in recipients) {
													try {
														request.game.players[recipients[r]].connection.sendUTF(JSON.stringify(data))
													}
													catch (error) { main.logError(error) }
												}
											})
										}
										catch (error) {_400(error)}
									break

									case "submitSwitch":
										try {
											game.submitSwitch(request, function (recipients, data) {
												for (var r in recipients) {
													try {
														request.game.players[recipients[r]].connection.sendUTF(JSON.stringify(data))
													}
													catch (error) { main.logError(error) }
												}
											})
										}
										catch (error) {_400(error)}
									break

									case "submitOpponent":
										try {
											game.submitOpponent(request, function (recipients, data) {
												for (var r in recipients) {
													try {
														request.game.players[recipients[r]].connection.sendUTF(JSON.stringify(data))
													}
													catch (error) { main.logError(error) }
												}
											})
										}
										catch (error) {_400(error)}
									break
									
									case "submitConfirm":
										try {
											game.submitConfirm(request, function (recipients, data) {
												for (var r in recipients) {
													try {
														request.game.players[recipients[r]].connection.sendUTF(JSON.stringify(data))
													}
													catch (error) { main.logError(error) }
												}
											})
										}
										catch (error) {_400(error)}
									break

									default:
										_400("invalid action")
								}
							}
						})
				}
				catch (error) {
					_400("unable to route socket")
				}
			}

		/* _400 */
			function _400(data) {
				main.logError(data)
				request.connection.sendUTF(JSON.stringify({success: false, message: (data || "unknown websocket error")}))
			}
	}
