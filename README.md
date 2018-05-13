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

• Every round, 2 players will each have a secret word.

• But the longer you have a word, the more points you lose - so give good clues so someone will guess it.

• If you don't have a word, listen to those clues to guess one.

• You get a whole bunch of points - but now you have a word too!



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
    |- logic.js (submitBegin, submitSwitch, submitOpponent; addPlayer, removePlayer, resetPlayer, createPointsdown; assignWord, guessWord; beginCountdown, beginGuessing, beginVictory)
    |- index.html
    |- stylesheet.css
    |- script.js (submitBegin, submitSwitch, submitOpponent; receivePost, receiveOpponent)
</pre>
