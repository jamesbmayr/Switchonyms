/*** modules ***/
	var http     = require("http")
	var fs       = require("fs")
	module.exports = {}

/*** logs ***/
	/* logError */
		module.exports.logError = logError
		function logError(error) {
			console.log("\n*** ERROR @ " + new Date().toLocaleString() + " ***")
			console.log(" - " + error)
			console.dir(arguments)
		}

	/* logStatus */
		module.exports.logStatus = logStatus
		function logStatus(status) {
			console.log("\n--- STATUS @ " + new Date().toLocaleString() + " ---")
			console.log(" - " + status)
		}

	/* logMessage */
		module.exports.logMessage = logMessage
		function logMessage(message) {
			console.log(" - " + new Date().toLocaleString() + ": " + message)
		}

/*** maps ***/
	/* getEnvironment */
		module.exports.getEnvironment = getEnvironment
		function getEnvironment(index) {
			try {
				if (process.env.DOMAIN !== undefined) {
					var environment = {
						port:              process.env.PORT,
						domain:            process.env.DOMAIN,
					}
				}
				else {
					var environment = {
						port:              3000,
						domain:            "localhost",
					}
				}

				return environment[index]
			}
			catch (error) {
				logError(error)
				return false
			}
		}

	/* getAsset */
		module.exports.getAsset = getAsset
		function getAsset(index) {
			try {
				switch (index) {
					case "logo":
						return "logo.png"
					break
					
					case "google fonts":
						return '<link href="https://fonts.googleapis.com/css?family=Amatic+SC:400,700" rel="stylesheet">'
					break

					case "meta":
						return '<meta charset="UTF-8"/>\
								<meta name="description" content="Switchonyms is a chaotic party game of words and guesses."/>\
								<meta name="keywords" content="game,word,guess,party,chaos,switch,swap,play"/>\
								<meta name="author" content="James Mayr"/>\
								<meta property="og:title" content="Switchonyms: a chaotic party game of words and guesses"/>\
								<meta property="og:url" content="http://www.specterinspectors.com"/>\
								<meta property="og:description" content="Switchonyms is a chaotic party game of words and guesses."/>\
								<meta property="og:image" content="http://www.switchonyms.com/banner.png"/>\
								<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>'
					break

					case "colors":
						return ["red", "orange", "yellow", "green", "blue", "purple", "magenta", "cyan", "brown", "gray"]
					break

					default:
						return null
					break
				}
			}
			catch (error) {
				logError(error)
				return false
			}
		}

	/* getWord */
		module.exports.getWord = getWord
		function getWord(type) {
			if (type == "noun") {
				var nouns = ["cat", "dog", "bunny", "yarn", "etsy"]
				return chooseRandom(nouns)
			}
			else if (type == "verb") {
				var verbs = ["knit", "crochet", "create", "code", "love"]
				return chooseRandom(verbs)
			}
			else if (type == "adjective") {
				var adjectives = ["soft", "cute", "James-like", "funny", "intelligent"]
				return chooseRandom(adjectives)
			}
			else {
				return false
			}
		}

/*** checks ***/
	/* isReserved */
		module.exports.isReserved = isReserved
		function isReserved(string) {
			try {
				var reservations = ["home","welcome","admin","test","feedback","help","preferences","settings","data","database",
					"signup","signin","signout","login","logout","verify","validate","verification","validation","verified","validated",
					"user","users","game","games","tutorial","tutorials","statistic","statistics","guest","guests","example","examples",
					"create","new","delete","read","start","go","all"]

				return (reservations.indexOf(string.toLowerCase().replace(/\s/g,"")) > -1)
			}
			catch (error) {
				logError(error)
				return true
			}
		}

	/* isNumLet */
		module.exports.isNumLet = isNumLet
		function isNumLet(string) {
			try {
				return (/^[a-z0-9A-Z_\s]+$/).test(string)
			}
			catch (error) {
				logError(error)
				return false
			}
		}

	/* isBot */
		module.exports.isBot = isBot
		function isBot(agent) {
			try {
				switch (true) {
					case (agent.indexOf("Googlebot") !== -1):
						return "Googlebot"
					break
				
					case (agent.indexOf("Google Domains") !== -1):
						return "Google Domains"
					break
				
					case (agent.indexOf("Google Favicon") !== -1):
						return "Google Favicon"
					break
				
					case (agent.indexOf("https://developers.google.com/+/web/snippet/") !== -1):
						return "Google+ Snippet"
					break
				
					case (agent.indexOf("IDBot") !== -1):
						return "IDBot"
					break
				
					case (agent.indexOf("Baiduspider") !== -1):
						return "Baiduspider"
					break
				
					case (agent.indexOf("facebook") !== -1):
						return "Facebook"
					break

					case (agent.indexOf("bingbot") !== -1):
						return "BingBot"
					break

					case (agent.indexOf("YandexBot") !== -1):
						return "YandexBot"
					break

					default:
						return null
					break
				}
			}
			catch (error) {
				logError(error)
				return false
			}
		}

/*** tools ***/		
	/* renderHTML */
		module.exports.renderHTML = renderHTML
		function renderHTML(request, path, callback) {
			try {
				var html = {}
				fs.readFile(path, "utf8", function (error, file) {
					if (error) {
						logError(error)
						callback("")
					}
					else {
						html.original = file
						html.array = html.original.split(/<script\snode>|<\/script>node>/gi)

						for (html.count = 1; html.count < html.array.length; html.count += 2) {
							try {
								html.temp = eval(html.array[html.count])
							}
							catch (error) {
								html.temp = ""
								logError("<sn>" + Math.ceil(html.count / 2) + "</sn>\n" + error)
							}
							html.array[html.count] = html.temp
						}

						callback(html.array.join(""))
					}
				})
			}
			catch (error) {
				logError(error)
				callback("")
			}
		}

	/* generateRandom */
		module.exports.generateRandom = generateRandom
		function generateRandom(set, length) {
			try {
				set = set || "0123456789abcdefghijklmnopqrstuvwxyz"
				length = length || 32
				
				var output = ""
				for (var i = 0; i < length; i++) {
					output += (set[Math.floor(Math.random() * set.length)])
				}

				if ((/[a-zA-Z]/).test(set)) {
					while (!(/[a-zA-Z]/).test(output[0])) {
						output = (set[Math.floor(Math.random() * set.length)]) + output.substring(1)
					}
				}

				return output
			}
			catch (error) {
				logError(error)
				return null
			}
		}

	/* chooseRandom */
		module.exports.chooseRandom = chooseRandom
		function chooseRandom(options) {
			try {
				if (!Array.isArray(options)) {
					return false
				}
				else {
					return options[Math.floor(Math.random() * options.length)]
				}
			}
			catch (error) {
				logError(error)
				return false
			}
		}

	/* sortRandom */
		module.exports.sortRandom = sortRandom
		function sortRandom(input) {
			try {
				// duplicate array
					var array = []
					for (var i in input) {
						array[i] = input[i]
					}

				// fisher-yates shuffle
					var x = array.length
					while (x > 0) {
						var y = Math.floor(Math.random() * x)
						x = x - 1
						var temp = array[x]
						array[x] = array[y]
						array[y] = temp
					}

				return array
			}
			catch (error) {
				logError(error)
				return false
			}
		}

	/* sanitizeString */
		module.exports.sanitizeString = sanitizeString
		function sanitizeString(string) {
			try {
				return string.replace(/[^a-zA-Z0-9_\s\!\@\#\$\%\^\&\*\(\)\+\=\-\[\]\\\{\}\|\;\'\:\"\,\.\/\<\>\?]/gi, "")
			}
			catch (error) {
				logError(error)
				return ""
			}
		}

/*** database ***/
	/* determineSession */
		module.exports.determineSession = determineSession
		function determineSession(request, callback) {
			if (isBot(request.headers["user-agent"])) {
				request.session = null
			}
			else if (!request.cookie.session || request.cookie.session == null || request.cookie.session == 0) {
				request.session = {
					id: generateRandom(),
					updated: new Date().getTime(),
					info: {
						"ip":         request.ip,
			 			"user-agent": request.headers["user-agent"],
			 			"language":   request.headers["accept-language"],
					}
				}
			}
			else {
				request.session = {
					id: request.cookie.session,
					updated: new Date().getTime(),
					info: {
						"ip":         request.ip,
			 			"user-agent": request.headers["user-agent"],
			 			"language":   request.headers["accept-language"],
					}
				}
			}

			callback()
		}
