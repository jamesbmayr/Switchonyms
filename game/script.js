/*** onload ***/
	var socket = null
	// createSocket()

/*** submits ***/
	/* submitBegin */
		document.getElementById("begin").addEventListener("click", submitBegin)
		function submitBegin(event) {
			if (event.target.className == "hidden") {
				displayError("Game already started...")
			}
			else {
				var post = {
					action: "submitBegin"
				}
				socket.send(post)
			}
		}

	/* submitSwitch */
		document.getElementById("switch").addEventListener("click", submitSwitch)
		function submitSwitch(event) {
			if (event.target.className == "hidden") {
				displayError("Unable to switch at this time...")
			}
			else {
				if (event.target.className == "active") {
					event.target.className == ""
					var active = false
				}
				else {
					event.target.className == "active"
					var active = true
				}

				var post = {
					action: "submitSwitch",
					active: active
				}
				socket.send(post)
			}
		}

	/* submitOpponent */
		var buttons = Array.from(document.querySelectorAll(".opponent"))
			buttons.forEach(function (b) { b.addEventListener("click", submitOpponent) })
		function submitOpponent(event) {
			var opponent = event.target.id

			if (document.getElementById("word").className == "hidden") {
				displayError("Unable to switch at this time...")
			}
			else if (!isNumLet(opponent)) {
				displayError("Invalid opponent id...")
			}
			else {
				if (event.target.className == "active") {
					event.target.className == ""
					var active = false
				}
				else {
					event.target.className == "active"
					var active = true
				}

				var post = {
					action: "submitOpponent",
					opponent: opponent,
					active: active
				}
				socket.send(post)
			}
		}

/*** receives ***/
	/* routeSocket */
		function routeSocket(post) {
			switch (true) {
				case (post.words):
					receiveWord(post)
				break

				case (post.ellipsis):
					receiveEllipsis(post)
				break

				case (post.points):
					receivePoints(post)
				break

				default:
					//
				break
			}

			if (post.message) {
				displayError(post.message)
			}

		}

	/* receiveWord */
		function receiveWords(post) {
			// update elements
				document.getElementById("ellipsis").className = "hidden"
				document.getElementById("word").innerHTML = post.words.join("<br>")
				document.getElementById("word").className = ""
				if (post.phase == 0) {
					document.getElementById("switch").className = "hidden"
				}
				else if (post.phase == 1) {
					document.getElementById("switch").className = ""
				}

			// points ?
				if (post.points) {
					receivePoints(post)
				}
		}

	/* receiveEllipsis */
		function receiveEllipsis(post) {
			// update elements
				document.getElementById("ellipsis").className = ""
				document.getElementById("word").innerHTML = ""
				document.getElementById("word").className = "hidden"
				document.getElementById("switch").className = "hidden"
				
			// points ?
				if (post.points) {
					receivePoints(post)
				}
		}

	/* receivePoints */
		function receivePoints(post) {
			// update elements
				var score = Array.from(Array.from(document.querySelectorAll(".player"))[0].querySelectorAll(".score"))[0]
				score.innerText = post.points || 0
		}
