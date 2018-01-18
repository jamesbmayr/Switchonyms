/*** tools ***/
	/* isNumLet */
		function isNumLet(string) {
			return (/^[a-z0-9A-Z_\s]+$/).test(string)
		}

	/* sanitizeString */
		function sanitizeString(string) {
			if (string.length > 0) {
				return string.replace(/[^a-zA-Z0-9_\s\!\@\#\$\%\^\&\*\(\)\+\=\-\[\]\\\{\}\|\;\'\:\"\,\.\/\<\>\?]/gi, "")
			}
			else {
				return ""
			}
		}

	/* chooseRandom */
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

/*** displays ***/
	/* displayError */
		function displayError(message) {
			var error = document.getElementById("error")
				error.textContent = message || "unknown error"
				error.className = ""
				error.style.opacity = 0
			
			var errorFadein = setInterval(function() { // fade in
				error.className = ""
				var opacity = Number(error.style.opacity) * 100

				if (opacity < 100) {
					error.style.opacity = Math.ceil( opacity + ((100 - opacity) / 10) ) / 100
				}
				else {
					clearInterval(errorFadein)
					
					var errorFadeout = setInterval(function() { // fade out
						var opacity = Number(error.style.opacity) * 100

						if (opacity > 0) {
							error.style.opacity = Math.floor(opacity - ((101 - opacity) / 10) ) / 100
						}
						else {
							clearInterval(errorFadeout)
							error.className = "hidden"
							error.style.opacity = 0
						}
					}, 100)
				}
			}, 100)
		}

	/* buildWords */
		function buildWords(count, infinite) {
			wordWait     = 0
			wordMax      = count || 20
			wordContinue = infinite ? 1 : (-1 * count)
			wordLoop  = setInterval(animateWords, 50)
		}

	/* animateWords */
		function animateWords() {
			window.requestAnimationFrame(function() {
				// get words
					var words = Array.prototype.slice.call( document.getElementsByClassName("word") )
					var wordZone = document.getElementById("wordzone")
					var wordCount = words.length

				// reduce wordWait
					if (wordWait) {
						wordWait--
					}
					else {
						wordWait = 5
					}

				// create words
					if (!wordWait && (wordCount < wordMax) && wordContinue) {
						wordCount++
						wordContinue++

						var word = document.createElement("div")
							word.className = "word"
							word.style.left = Math.round(Math.random() * (window.innerWidth - 200)) + "px"
							word.style.top = -100 + "px"
							word.setAttribute("speed", Math.round(Math.random() * 5) + 10)
							if (window.nouns && window.verbs && window.adjectives) {
								word.innerText = chooseRandom(window[chooseRandom(["nouns", "verbs", "adjectives"])])
							}
							else {
								word.innerText = "error"
							}

						wordZone.appendChild(word)
					}

				// end ?
					if (!wordContinue && !wordCount) {
						clearInterval(wordLoop)
					}

				// move words
					else {
						for (var w in words) {
							var speed = Number(words[w].getAttribute("speed"))
							var top   = Number(words[w].style.top.replace("px", ""))

							if (top - speed > window.innerHeight + 100) {
								wordZone.removeChild(words[w])
							}
							else {
								words[w].style.top = top + speed + "px"

								// safari hack
									words[w].style.display = "none"
									words[w].offsetHeight
									words[w].style.display = "block"
							}
						}
					}


			})
		}

/*** connections ***/
	/* sendPost */
		function sendPost(post, callback) {
			var request = new XMLHttpRequest()
				request.open("POST", location.pathname, true)
				request.onload = function() {
					if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
						callback(JSON.parse(request.responseText) || {success: false, message: "unknown error"})
					}
					else {
						callback({success: false, readyState: request.readyState, message: request.status})
					}
				}
				request.send(JSON.stringify(post))
		}
		
	/* socket */
		function createSocket() {
			socket = new WebSocket(location.href.replace("http","ws"))

			// open
				socket.onopen = function() {
					socket.send(null)
				}

			// error
				socket.onerror = function(error) {
					console.log(error)
				}

			// close
				socket.onclose = function() {
					socket = null
				}

			// message
				socket.onmessage = function(message) {
					try {
						var post = JSON.parse(message.data)
						if (post && (typeof post == "object") && post.action) {
							routeSocket(post)
						}
						else {
							console.log(error)
						}
					}
					catch (error) {
						console.log(error)
					}
				}
		}
