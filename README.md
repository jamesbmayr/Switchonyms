# Switchonyms

a chaotic party game of words and guesses: http://www.switchonyms.com

<pre style='line-height: 0.5; text-align: center'>
             |\ 
  -----------  \
 /  ---------  /
/  /         |/ 
\  \            
 \  ----------  
  ----------  \ 
            \  \
 /|         /  /
/  ---------  / 
\  -----------  
 \|             
</pre>
<hr>

# Rules


## Requirements

• 4-10 players

• 1 smartphone/computer each

• 30-60 minutes



## Setup

• Each player inputs a name.

• One player creates a game using the "new" button.

• All other players join using the 4-letter gamecode and the "join" button.



## Gameplay

• The game is divided into 3 rounds: nouns (x1), verbs (x2), and adjectives (x3).

• Each round is divided into 2 phases: matching and guessing.



## Matching

• Each player has 2 words - each word is shared with 1 opponent.

• Without saying either of the words shown, players must find a match.

• The first pair to match up get points.



## Guessing

• The players who matched begin this phase - each has 1 word.

• Without saying the word, players must get their opponents to guess the word.

• The player who guesses the word gets points. But players lose points while they have a word.

• When players get stuck, they can switch words using the "S" button.



## Ending

• The player with the most points at the end of the game wins.




<hr>

# App Structure

<pre>
|- package.json
|- index.js (handleRequest, parseRequest, routeRequest; _302, _403, _404; handleSocket, parseSocket, routeSocket; _400)
|
|- /node-modules/
|   |- websocket
|
|- /main/
|   |- logic.js (logError, logStatus, logMessage; getEnvironment, getAsset, getWord; isNumLet, isBot; renderHTML; generateRandom, chooseRandom, sortRandom; sanitizeString; determineSession, cleanDatabase)
|   |- stylesheet.css
|   |- script.js (isNumLet, isEmail, sanitizeString, chooseRandom; displayError, buildWords, animateWords; sendPost, createSocket)
|   |
|   |- banner.png
|   |- logo.png
|   |- _404.html
|
|- / (home)
|   |- logic.js (createGame, createPlayer; joinGame)
|   |- index.html
|   |- stylesheet.css
|   |- script.js (createGame, joinGame)
|
|- /about/
|   |- index.html
|   |- stylesheet.css
|   |- script.js (submitFeedback)
|
|- /game/
    |- logic.js (submitBegin, submitSwitch, submitOpponent; addPlayer, removePlayer, resetPlayer, createPointsdown; assignWord, matchWords, guessWord; beginCountdown, beginMatchPhase, beginGuessPhase, beginVictoryPhase)
    |- index.html
    |- stylesheet.css
    |- script.js (submitBegin, submitSwitch, submitOpponent; receivePost, receiveOpponent)
</pre>
