/*** onload ***/
	buildWords(30, true)

/*** actions ***/
	/* createGame */
		document.getElementById("createGame").addEventListener("click", createGame)
		function createGame() {
			// get values
				var name = document.getElementById("createName").value || null

			if (!name || name.length < 4 || name.length > 16) {
				displayError("Enter a name between 4 and 16 characters.")
			}
			else if (!isNumLet(name)) {
				displayError("Your name can be letters and numbers only.")
			}
			else {
				// data
					var post = {
						action: "createGame",
						name: name
					}

				// submit
					sendPost(post, function(data) {
						if (!data.success) {
							displayError(data.message || "Unable to create a game...")
						}
						else {
							window.location = data.location
						}
					})
			}
		}

	/* joinGame */
		document.getElementById("joinGame").addEventListener("click", joinGame)
		document.getElementById("gameCode").addEventListener("keyup", function (event) { if (event.which == 13) { joinGame() } })
		function joinGame() {
			// get values
				var gameCode = document.getElementById("gameCode").value.replace(" ","").trim().toLowerCase() || false
				var name = document.getElementById("createName").value || null

			if (gameCode.length !== 4) {
				displayError("The game code must be 4 characters.")
			}
			else if (!isNumLet(gameCode)) {
				displayError("The game code can be letters and numbers only.")
			}
			else if (!name || !name.length || name.length > 10) {
				displayError("Enter a name between 1 and 10 characters.")
			}
			else if (!isNumLet(name)) {
				displayError("Your name can be letters and numbers only.")
			}
			else {
				// data
					var post = {
						action: "joinGame",
						gameid: gameCode,
						name: name
					}

				// submit
					sendPost(post, function(data) {
						if (!data.success) {
							displayError(data.message || "Unable to join this game...")
						}
						else {
							window.location = data.location
						}
					})
			}
		}
		
