/*** onload ***/
	var socket = null
	if ([0,1,2,3].includes(Number(document.getElementById("card").getAttribute("round")))) {
		createSocket()
	}

/*** submits ***/
	/* submitBegin */
		document.getElementById("begin").addEventListener("click", submitBegin)
		function submitBegin(event) {
			if (event.target.id !== "begin") {
				//
			}
			else if (Number(document.getElementById("card").getAttribute("round"))) {
				displayError("Game already started...")
			}
			else {
				var post = {
					action: "submitBegin"
				}
				socket.send(JSON.stringify(post))
			}
		}

	/* submitSwitch */
		document.getElementById("switch").addEventListener("click", submitSwitch)
		function submitSwitch(event) {
			if (event.target.id !== "switch") {
				//
			}
			else if (document.getElementById("card").getAttribute("ellipse")) {
				displayError("Unable to switch at this time...")
			}
			else {
				if (event.target.getAttribute("active")) {
					event.target.removeAttribute("active")
					var active = false
				}
				else {
					event.target.setAttribute("active", true)
					var active = true
				}

				var post = {
					action: "submitSwitch",
					active: active
				}
				socket.send(JSON.stringify(post))
			}
		}

	/* submitOpponent */
		var buttons = Array.from(document.querySelectorAll(".opponent"))
			buttons.forEach(function (b) { b.addEventListener("click", submitOpponent) })
		function submitOpponent(event) {
			if (event.target.className !== "opponent") {
				//
			}
			else if (document.getElementById("card").getAttribute("ellipse")) {
				displayError("Unable to select opponent at this time...")
			}
			else if (!isNumLet(event.target.id)) {
				displayError("Invalid opponent id...")
			}
			else {
				if (event.target.getAttribute("selected")) {
					event.target.removeAttribute("selected")
					var selecting = false
				}
				else {
					var opponents = Array.from(document.querySelectorAll(".opponent"))
					for (var o in opponents) {
						opponents[o].removeAttribute("selected")
					}
					event.target.setAttribute("selected", true)

					var selecting = true
				}

				var post = {
					action: "submitOpponent",
					opponent: event.target.id,
					selecting: selecting
				}
				socket.send(JSON.stringify(post))
			}
		}

/*** receives ***/
	/* receivePost */
		function receivePost(post) {
			// content
				if (post.points !== undefined) {
					var score = Array.from(Array.from(document.querySelectorAll(".player"))[0].querySelectorAll(".score"))[0]
					score.innerText = post.points || 0
					
					score.setAttribute("flash", true)
					setTimeout(function() {
						score.removeAttribute("flash")
					}, 1000)
				}
				if (post.words !== undefined) {
					document.getElementById("card").removeAttribute("ellipsis")
					document.getElementById("word").innerHTML = post.words.join("<br>")
					document.getElementById("switch").removeAttribute("active")
					
					document.getElementById("word").setAttribute("flash", true)
					setTimeout(function() {
						document.getElementById("word").removeAttribute("flash")
					}, 1000)

				}
				if (post.ellipsis !== undefined) {
					document.getElementById("card").setAttribute("ellipsis", true)
					document.getElementById("switch").removeAttribute("active")
					document.getElementById("word").innerHTML = ""
				}

			// opponents
				if (post.opponents !== undefined) {
					for (var o in post.opponents) {
						receiveOpponent(post.opponents[o])
					}
				}

			// parameters
				if (post.phase !== undefined) {
					document.getElementById("card").setAttribute("phase", Number(post.phase))

					var opponents = Array.from(document.querySelectorAll(".opponent"))
					for (var o in opponents) {
						opponents[o].removeAttribute("selected")
					}
				}
				if (post.round !== undefined) {
					document.getElementById("card").setAttribute("round", Number(post.round))

					var opponents = Array.from(document.querySelectorAll(".opponent"))
					for (var o in opponents) {
						opponents[o].removeAttribute("selected")
					}
				}

			// message
				if (post.message) {
					displayError(post.message)
				}
		}

	/* receiveOpponent */
		function receiveOpponent(opponent) {
			// find opponent
				var block = document.getElementById(opponent.id) || null

			// add opponent
				if (!block) {
					var block = document.createElement("button")
						block.id = opponent.id
						block.className = "opponent"
						block.setAttribute("color", opponent.color)
						block.addEventListener("click", submitOpponent)

					var score = document.createElement("div")
						score.className = "score"
						score.innerText = opponent.points || ""
					block.appendChild(score)

					var name = document.createElement("div")
						name.className = "name"
						name.innerText = opponent.name
					block.appendChild(name)

					document.getElementById("opponents").appendChild(block)
				}

			// remove opponent
				else if (opponent.remove) {
					block.remove()
				}

			// update opponent
				else if (block.className == "opponent") {
					var score = Array.from(block.querySelectorAll(".score"))[0]
					if (opponent.points) {
						score.setAttribute("points", true)
						score.innerText = opponent.points || 0
					}
					else {
						score.removeAttribute("points")
						score.innerText = ""
					}
				}
		}
