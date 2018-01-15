/*** modules ***/
	var http = require("http")
	var fs   = require("fs")
	var qs   = require("querystring")
	var ws   = require("websocket").server
	var main = require("./main/logic")
	var game = require("./game/logic")
	var home = require("./home/logic")
	var db   = {}

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

/*** handleRequest ***/
	function handleRequest(request, response) {
		// collect data
			var data = ""
			request.on("data", function (chunk) { data += chunk })
			request.on("end", parseRequest)

		/* parseRequest */
			function parseRequest(data) {
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
												console.log("WHAT ABOUT HERE")
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
											request.game = db[id] || {}

											main.renderHTML(request, "./game/index.html", function (html) {
												response.end(html)
											})
										}
										catch (error) {_404(error)}
									break

								// data
									case (/^\/data\/?$/).test(request.url):
										try {
											main.renderHTML(db, "./about/data.html", function (html) {
												response.end(html)
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

					// post
						else if (request.method == "POST" && request.post.action !== undefined) {
							response.writeHead(200, {"Content-Type": "text/json"})

							switch (request.post.action) {
								// home
									case "createGame":
										try {
											home.createGame(request, db, function (data) {
												response.end(JSON.stringify(data))
											})
										}
										catch (error) {_403(error)}
									break

									case "joinGame":
										try {
											home.joinGame(request, db, function (data) {
												response.end(JSON.stringify(data))
											})
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
							_403()
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
			if ((request.origin.replace("https://","").replace("http://","") !== main.getEnvironment("domain")) && (request.origin !== "http://" + main.getEnvironment("domain") + ":" + main.getEnvironment("port"))) {
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
					// on connect
						request.game = db[request.path[2]] || false
						
						if (!request.game) {
							request.reject()
							_400("unable to find game")
						}
						else {
							request.game.players[request.session.id].connection = request.connection
						}

					// on close
						request.connection.on("close", function (reasonCode, description) {
							// remove player from game
								main.logStatus("[CLOSED]: " + request.path.join("/") + " @ " + (request.ip || "?"))
								request.game.players[request.session.id].connection = null

							// if no players
								var connections = Object.keys(request.game.players).filter(function (p) {
									return request.game.players[p].connection
								})
								if (!connections.length) {
									delete db[request.game.id]
								}
						})
					
					// on message
						request.connection.on("message", function (message) {
							// get post data
								try {
									request.post = JSON.parse(message.utf8Data) || null
								}
								catch (error) {
									request.post = null
								}

							if (!request.post || !request.post.action) {
								_400("no action specified")
							}
							else {
								switch (request.post.action) {
									case "selectSwitch":
										try {
											game.selectSwitch(request, function(data) {
												var players = Object.keys(request.game.players)
												for (var p in players) {
													var connection = request.game.players[players[p]].connection
														connection.sendUTF(JSON.stringify(data))
												}
											})
										}
										catch (error) {
											_400(error)
										}
									break

									case "selectOpponent":
										try {
											game.selectOpponent(request, function(data) {
												var players = Object.keys(request.game.players)
												for (var p in players) {
													var connection = request.game.players[players[p]].connection
														connection.sendUTF(JSON.stringify(data))
												}
											})
										}
										catch (error) {
											_400(error)
										}
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
				request.connection.sendUTF(data || "unknown websocket error")
			}
	}
