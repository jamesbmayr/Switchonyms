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
	/* receivePost */
		function receivePost(post) {
			// content
				if (post.points) {
					var score = Array.from(Array.from(document.querySelectorAll(".player"))[0].querySelectorAll(".score"))[0]
					score.innerText = post.points || 0
					
					score.setAttribute("flash", true)
					setTimeout(function() {
						score.removeAttribute("flash")
					}, 500)
				}
				if (post.words) {
					document.getElementById("card").setAttribute("ellipsis", false)
					document.getElementById("word").innerText = post.words.join(" & ")
					
					document.getElementById("word").setAttribute("flash", true)
					setTimeout(function() {
						document.getElementById("word").removeAttribute("flash")
					}, 500)

				}
				if (post.ellipsis) {
					document.getElementById("card").setAttribute("ellipsis", true)
					document.getElementById("word").innerText = ""
				}

			// parameters
				if (post.phase !== undefined) {
					document.getElementById("card").setAttribute("phase", Number(post.phase))
				}
				if (post.round !== undefined) {
					document.getElementById("card").setAttribute("round", Number(post.round))
				}

			// message
				if (post.message) {
					displayError(post.message)
				}
		}
