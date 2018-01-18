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
			try {
				if (type == "noun") {
					var nouns = ["people", "work", "film", "water", "money", "example", "business", "study", "game", "life", "form", "air", "day", "place", "number", "part", "field", "fish", "back", "process", "heat", "hand", "experience", "job", "book", "end", "point", "type", "home", "economy", "value", "body", "market", "guide", "interest", "state", "radio", "course", "company", "price", "size", "card", "list", "mind", "trade", "line", "care", "group", "risk", "word", "fat", "force", "key", "light", "training", "name", "school", "top", "amount", "level", "order", "practice", "research", "sense", "service", "piece", "web", "boss", "sport", "fun", "house", "page", "term", "test", "answer", "sound", "focus", "matter", "kind", "soil", "board", "oil", "picture", "access", "garden", "range", "rate", "reason", "future", "site", "demand", "exercise", "image", "case", "cause", "coast", "action", "age", "bad", "boat", "record", "result", "section", "building", "mouse", "cash", "class", "nothing", "period", "plan", "store", "tax", "side", "subject", "space", "rule", "stock", "weather", "chance", "figure", "man", "model", "source", "beginning", "earth", "program", "chicken", "design", "feature", "head", "material", "purpose", "question", "rock", "salt", "act", "birth", "car", "dog", "object", "scale", "sun", "note", "profit", "rent", "speed", "style", "war", "bank", "craft", "half", "inside", "outside", "standard", "bus", "exchange", "eye", "fire", "position", "pressure", "stress", "advantage", "benefit", "box", "frame", "issue", "step", "cycle", "face", "item", "metal", "paint", "review", "room", "screen", "structure", "view", "account", "ball", "discipline", "medium", "share", "balance", "bit", "black", "bottom", "choice", "gift", "impact", "machine", "shape", "tool", "wind", "address", "average", "career", "culture", "morning", "pot", "sign", "table", "task", "condition", "contact", "credit", "egg", "hope", "ice", "network", "north", "square", "attempt", "date", "effect", "link", "post", "star", "voice", "capital", "challenge", "friend", "self", "shot", "brush", "couple", "debate", "exit", "front", "function", "lack", "living", "plant", "plastic", "spot", "summer", "taste", "theme", "track", "wing", "brain", "button", "click", "desire", "foot", "gas", "influence", "notice", "rain", "wall", "base", "damage", "distance", "feeling", "pair", "savings", "staff", "sugar", "target", "text", "animal", "author", "budget", "discount", "file", "ground", "lesson", "minute", "officer", "phase", "reference", "register", "sky", "stage", "stick", "title", "trouble", "bowl", "bridge", "campaign", "character", "club", "edge", "evidence", "fan", "letter", "lock", "maximum", "novel", "option", "pack", "park", "plenty", "quarter", "skin", "sort", "weight", "baby", "background", "carry", "dish", "factor", "fruit", "glass", "joint", "master", "muscle", "red", "strength", "traffic", "trip", "vegetable", "appeal", "chart", "gear", "ideal", "kitchen", "land", "log", "mother", "net", "party", "principle", "relative", "sale", "season", "signal", "spirit", "street", "tree", "wave", "belt", "bench", "commission", "copy", "drop", "minimum", "path", "progress", "project", "sea", "south", "status", "stuff", "ticket", "tour", "angle", "blue", "breakfast", "confidence", "daughter", "degree", "doctor", "dot", "dream", "duty", "essay", "father", "fee", "finance", "hour", "juice", "limit", "luck", "milk", "mouth", "peace", "pipe", "seat", "stable", "storm", "substance", "team", "trick", "afternoon", "bat", "beach", "blank", "catch", "chain", "consideration", "cream", "crew", "detail", "gold", "interview", "kid", "mark", "match", "mission", "pain", "pleasure", "score", "screw", "sex", "shop", "shower", "suit", "tone", "window", "agent", "band", "block", "bone", "calendar", "cap", "coat", "contest", "corner", "court", "cup", "district", "door", "east", "finger", "garage", "guarantee", "hole", "hook", "implement", "layer", "lecture", "lie", "manner", "meeting", "nose", "parking", "partner", "profile", "respect", "rice", "routine", "schedule", "swimming", "telephone", "tip", "winter", "airline", "bag", "battle", "bed", "bill", "bother", "cake", "code", "curve", "designer", "dimension", "dress", "ease", "emergency", "evening", "extension", "farm", "fight", "gap", "grade", "holiday", "horror", "horse", "host", "husband", "loan", "mistake", "mountain", "nail", "noise", "occasion", "package", "patient", "pause", "phrase", "proof", "race", "relief", "sand", "sentence", "shoulder", "smoke", "stomach", "string", "tourist", "towel", "vacation", "west", "wheel", "wine", "arm", "aside", "associate", "bet", "blow", "border", "branch", "breast", "brother", "buddy", "bunch", "chip", "coach", "cross", "document", "draft", "dust", "expert", "floor", "god", "golf", "habit", "iron", "judge", "knife", "landscape", "league", "mail", "mess", "native", "opening", "parent", "pattern", "pin", "pool", "pound", "request", "salary", "shame", "shelter", "shoe", "silver", "tackle", "tank", "trust", "assist", "bake", "bar", "bell", "bike", "blame", "boy", "brick", "chair", "closet", "clue", "collar", "comment", "conference", "devil", "diet", "fear", "fuel", "glove", "jacket", "lunch", "monitor", "mortgage", "nurse", "pace", "panic", "peak", "plane", "reward", "row", "sandwich", "shock", "spite", "spray", "surprise", "till", "transition", "weekend", "welcome", "yard", "alarm", "bend", "bicycle", "bite", "blind", "bottle", "cable", "candle", "clerk", "cloud", "concert", "counter", "flower", "grandfather", "harm", "knee", "lawyer", "leather", "load", "mirror", "neck", "pension", "plate", "purple", "ruin", "ship", "skirt", "slice", "snow", "specialist", "stroke", "switch", "trash", "tune", "zone", "anger", "award", "bid", "bitter", "boot", "bug", "camp", "candy", "carpet", "cat", "champion", "channel", "clock", "comfort", "cow", "crack", "engineer", "entrance", "fault", "grass", "guy", "hell", "highlight", "incident", "island", "joke", "jury", "leg", "lip", "mate", "motor", "nerve", "passage", "pen", "pride", "priest", "prize", "promise", "resident", "resort", "ring", "roof", "rope", "sail", "scheme", "script", "sock", "station", "toe", "tower", "truck", "witness", "a", "you", "it", "can", "will", "if", "one", "many", "most", "other", "use", "make", "good", "look", "help", "go", "great", "being", "few", "might", "still", "public", "read", "keep", "start", "give", "human", "local", "general", "she", "specific", "long", "play", "feel", "high", "tonight", "put", "common", "set", "change", "simple", "past", "big", "possible", "particular", "today", "major", "personal", "current", "national", "cut", "natural", "physical", "show", "try", "check", "second", "call", "move", "pay", "let", "increase", "single", "individual", "turn", "ask", "buy", "guard", "hold", "main", "offer", "potential", "professional", "international", "travel", "cook", "alternative", "following", "special", "working", "whole", "dance", "excuse", "cold", "commercial", "low", "purchase", "deal", "primary", "worth", "fall", "necessary", "positive", "produce", "search", "present", "spend", "talk", "creative", "tell", "cost", "drive", "green", "support", "glad", "remove", "return", "run", "complex", "due", "effective", "middle", "regular", "reserve", "independent", "leave", "original", "reach", "rest", "serve", "watch", "beautiful", "charge", "active", "break", "negative", "safe", "stay", "visit", "visual", "affect", "cover", "report", "rise", "walk", "white", "beyond", "junior", "pick", "unique", "anything", "classic", "final", "lift", "mix", "private", "stop", "teach", "western", "concern", "familiar", "fly", "official", "broad", "comfortable", "gain", "maybe", "rich", "save", "stand", "young", "fail", "heavy", "hello", "lead", "listen", "valuable", "worry", "handle", "leading", "meet", "release", "sell", "finish", "normal", "press", "ride", "secret", "spread", "spring", "tough", "wait", "brown", "deep", "display", "flow", "hit", "objective", "shoot", "touch", "cancel", "chemical", "cry", "dump", "extreme", "push", "conflict", "eat", "fill", "formal", "jump", "kick", "opposite", "pass", "pitch", "remote", "total", "treat", "vast", "abuse", "beat", "burn", "deposit", "print", "raise", "sleep", "somewhere", "advance", "anywhere", "consist", "dark", "double", "draw", "equal", "fix", "hire", "internal", "join", "kill", "sensitive", "tap", "win", "attack", "claim", "constant", "drag", "drink", "guess", "minor", "pull", "raw", "soft", "solid", "wear", "weird", "wonder", "annual", "count", "dead", "doubt", "feed", "forever", "impress", "nobody", "repeat", "round", "sing", "slide", "strip", "whereas", "wish", "combine", "command", "dig", "divide", "equivalent", "hang", "hunt", "initial", "march", "mention", "smell", "spiritual", "survey", "tie", "adult", "brief", "crazy", "escape", "gather", "hate", "prior", "repair", "rough", "sad", "scratch", "sick", "strike", "employ", "external", "hurt", "illegal", "laugh", "lay", "mobile", "nasty", "ordinary", "respond", "royal", "senior", "split", "strain", "struggle", "swim", "train", "upper", "wash", "yellow", "convert", "crash", "dependent", "fold", "funny", "grab", "hide", "miss", "permit", "quote", "recover", "resolve", "roll", "sink", "slip", "spare", "suspect", "sweet", "swing", "twist", "upstairs", "usual", "abroad", "brave", "calm", "concentrate", "estimate", "grand", "male", "mine", "prompt", "quiet", "refuse", "regret", "reveal", "rush", "shake", "shift", "shine", "steal", "suck", "surround", "anybody", "bear", "brilliant", "dare", "dear", "delay", "drunk", "female", "hurry", "inevitable", "invite", "kiss", "neat", "pop", "punch", "quit", "reply", "representative", "resist", "rip", "rub", "silly", "smile", "spell", "stretch", "stupid", "tear", "temporary", "tomorrow", "wake", "wrap", "yesterday"]
					return chooseRandom(nouns)
				}
				else if (type == "verb") {
					var verbs = ["be", "have", "get", "see", "need", "know", "find", "take", "want", "do", "learn", "become", "come", "include", "thank", "provide", "create", "add", "understand", "consider", "choose", "develop", "remember", "determine", "grow", "allow", "supply", "bring", "improve", "maintain", "begin", "exist", "tend", "enjoy", "perform", "decide", "identify", "continue", "protect", "require", "occur", "write", "approach", "avoid", "prepare", "build", "achieve", "believe", "receive", "seem", "discuss", "realize", "contain", "follow", "refer", "solve", "describe", "prefer", "prevent", "discover", "ensure", "expect", "invest", "reduce", "speak", "appear", "explain", "explore", "involve", "lose", "afford", "agree", "hear", "remain", "represent", "apply", "forget", "recommend", "rely", "vary", "generate", "obtain", "accept", "communicate", "complain", "depend", "enter", "happen", "indicate", "suggest", "survive", "appreciate", "compare", "imagine", "manage", "differ", "encourage", "expand", "prove", "react", "recognize", "relax", "replace", "borrow", "earn", "emphasize", "enable", "operate", "reflect", "send", "anticipate", "assume", "engage", "enhance", "examine", "install", "participate", "intend", "introduce", "relate", "settle", "assure", "attract", "distribute", "overcome", "owe", "succeed", "suffer", "throw", "acquire", "adapt", "adjust", "argue", "arise", "confirm", "encouraging", "incorporate", "justify", "organize", "ought", "possess", "relieve", "retain", "shut", "calculate", "compete", "consult", "deliver", "extend", "investigate", "negotiate", "qualify", "retire", "rid", "weigh", "arrive", "attach", "behave", "celebrate", "convince", "disagree", "establish", "ignore", "imply", "insist", "pursue", "remaining", "specify", "warn", "accuse", "admire", "admit", "adopt", "announce", "apologize", "approve", "attend", "belong", "commit", "criticize", "deserve", "destroy", "hesitate", "illustrate", "inform", "manufacturing", "persuade", "pour", "propose", "remind", "shall", "submit", "suppose", "translate", "be", "have", "use", "make", "look", "help", "go", "being", "think", "read", "keep", "start", "give", "play", "feel", "put", "set", "change", "say", "cut", "show", "try", "check", "call", "move", "pay", "let", "increase", "turn", "ask", "buy", "guard", "hold", "offer", "travel", "cook", "dance", "excuse", "live", "purchase", "deal", "mean", "fall", "produce", "search", "spend", "talk", "upset", "tell", "cost", "drive", "support", "remove", "return", "run", "appropriate", "reserve", "leave", "reach", "rest", "serve", "watch", "charge", "break", "stay", "visit", "affect", "cover", "report", "rise", "walk", "pick", "lift", "mix", "stop", "teach", "concern", "fly", "born", "gain", "save", "stand", "fail", "lead", "listen", "worry", "express", "handle", "meet", "release", "sell", "finish", "press", "ride", "spread", "spring", "wait", "display", "flow", "hit", "shoot", "touch", "cancel", "cry", "dump", "push", "select", "conflict", "die", "eat", "fill", "jump", "kick", "pass", "pitch", "treat", "abuse", "beat", "burn", "deposit", "print", "raise", "sleep", "advance", "connect", "consist", "contribute", "draw", "fix", "hire", "join", "kill", "sit", "tap", "win", "attack", "claim", "drag", "drink", "guess", "pull", "wear", "wonder", "count", "doubt", "feed", "impress", "repeat", "seek", "sing", "slide", "strip", "wish", "collect", "combine", "command", "dig", "divide", "hang", "hunt", "march", "mention", "smell", "survey", "tie", "escape", "expose", "gather", "hate", "repair", "scratch", "strike", "employ", "hurt", "laugh", "lay", "respond", "split", "strain", "struggle", "swim", "train", "wash", "waste", "convert", "crash", "fold", "grab", "hide", "miss", "permit", "quote", "recover", "resolve", "roll", "sink", "slip", "suspect", "swing", "twist", "concentrate", "estimate", "prompt", "refuse", "regret", "reveal", "rush", "shake", "shift", "shine", "steal", "suck", "surround", "bear", "dare", "delay", "hurry", "invite", "kiss", "marry", "pop", "pray", "pretend", "punch", "quit", "reply", "resist", "rip", "rub", "smile", "spell", "stretch", "tear", "wake", "wrap", "was", "like", "even", "film", "water", "been", "well", "were", "example", "own", "study", "must", "form", "air", "place", "number", "part", "field", "fish", "process", "heat", "hand", "experience", "job", "book", "end", "point", "type", "value", "body", "market", "guide", "interest", "state", "radio", "course", "company", "price", "size", "card", "list", "mind", "trade", "line", "care", "group", "risk", "word", "force", "light", "name", "school", "amount", "order", "practice", "research", "sense", "service", "piece", "web", "boss", "sport", "page", "term", "test", "answer", "sound", "focus", "matter", "soil", "board", "oil", "picture", "access", "garden", "open", "range", "rate", "reason", "according", "site", "demand", "exercise", "image", "case", "cause", "coast", "age", "boat", "record", "result", "section", "building", "mouse", "cash", "class", "dry", "plan", "store", "tax", "involved", "side", "space", "rule", "weather", "figure", "man", "model", "source", "earth", "program", "design", "feature", "purpose", "question", "rock", "act", "birth", "dog", "object", "scale", "sun", "fit", "note", "profit", "related", "rent", "speed", "style", "war", "bank", "content", "craft", "bus", "exchange", "eye", "fire", "position", "pressure", "stress", "advantage", "benefit", "box", "complete", "frame", "issue", "limited", "step", "cycle", "face", "interested", "metal", "paint", "review", "room", "screen", "structure", "view", "account", "ball", "concerned", "discipline", "ready", "share", "balance", "bit", "black", "bottom", "gift", "impact", "machine", "shape", "tool", "wind", "address", "average", "career", "culture", "pot", "sign", "table", "task", "condition", "contact", "credit", "egg", "hope", "ice", "network", "separate", "attempt", "date", "effect", "link", "perfect", "post", "star", "voice", "challenge", "friend", "warm", "brush", "couple", "debate", "exit", "experienced", "function", "lack", "plant", "spot", "summer", "taste", "theme", "track", "wing", "brain", "button", "click", "correct", "desire", "fixed", "foot", "gas", "influence", "notice", "rain", "wall", "base", "damage", "distance", "pair", "staff", "sugar", "target", "text", "author", "complicated", "discount", "file", "ground", "lesson", "officer", "phase", "reference", "register", "secure", "sky", "stage", "stick", "title", "trouble", "advanced", "bowl", "bridge", "campaign", "club", "edge", "evidence", "fan", "letter", "lock", "option", "organized", "pack", "park", "quarter", "skin", "sort", "weight", "baby", "carry", "dish", "exact", "factor", "fruit", "muscle", "traffic", "trip", "appeal", "chart", "gear", "land", "log", "lost", "net", "season", "spirit", "tree", "wave", "belt", "bench", "commission", "copy", "drop", "firm", "frequent", "progress", "project", "stuff", "ticket", "tour", "angle", "blue", "breakfast", "doctor", "dot", "dream", "essay", "father", "fee", "finance", "juice", "limit", "luck", "milk", "mixed", "mouth", "pipe", "please", "seat", "stable", "storm", "team", "amazing", "bat", "beach", "blank", "busy", "catch", "chain", "cream", "crew", "detail", "detailed", "interview", "kid", "mark", "match", "pain", "pleasure", "score", "screw", "sharp", "shop", "shower", "suit", "tone", "window", "wise", "band", "block", "bone", "calendar", "cap", "coat", "contest", "court", "cup", "district", "finger", "garage", "guarantee", "hole", "hook", "implement", "layer", "lecture", "lie", "married", "narrow", "nose", "partner", "profile", "respect", "rice", "schedule", "telephone", "tip", "bag", "battle", "bed", "bill", "bother", "cake", "code", "curve", "dimension", "ease", "farm", "fight", "gap", "grade", "horse", "host", "husband", "loan", "mistake", "nail", "occasion", "package", "pause", "phrase", "race", "sand", "sentence", "shoulder", "smoke", "stomach", "string", "surprised", "vacation", "wheel", "arm", "associate", "bet", "blow", "border", "branch", "breast", "buddy", "bunch", "chip", "coach", "cross", "document", "draft", "dust", "floor", "golf", "habit", "iron", "judge", "knife", "landscape", "league", "mail", "mess", "parent", "pattern", "pin", "pool", "pound", "request", "salary", "shame", "shelter", "shoe", "tackle", "tank", "trust", "assist", "bake", "bar", "bell", "bike", "blame", "brick", "chair", "closet", "clue", "collar", "comment", "conference", "devil", "diet", "fear", "fuel", "glove", "jacket", "lunch", "monitor", "mortgage", "nurse", "pace", "panic", "peak", "provided", "reward", "row", "sandwich", "shock", "spite", "spray", "surprise", "till", "transition", "weekend", "yard", "alarm", "bend", "bicycle", "bite", "blind", "bottle", "cable", "candle", "clerk", "cloud", "concert", "counter", "dirty", "flower", "grandfather", "harm", "knee", "lawyer", "load", "loose", "mirror", "neck", "pension", "plate", "pleased", "proposed", "ruin", "ship", "skirt", "slice", "snow", "stroke", "switch", "tired", "trash", "tune", "worried", "zone", "anger", "award", "bid", "boot", "bug", "camp", "candy", "carpet", "cat", "champion", "channel", "clock", "comfort", "cow", "crack", "disappointed", "empty", "engineer", "entrance", "fault", "grass", "highlight", "island", "joke", "jury", "leg", "lip", "mate", "nerve", "passage", "pen", "pride", "priest", "promise", "resort", "ring", "roof", "rope", "sail", "scheme", "script", "slight", "smart", "sock", "station", "toe", "tower", "truck", "witness"]
					return chooseRandom(verbs)
				}
				else if (type == "adjective") {
					var adjectives = ["abnormal", "adorable", "adventurous", "affectionate", "affordable", "afraid", "aggressive", "agile", "agreeable", "alarming", "alert", "alien", "alluring", "amazed", "amazing", "ambitious", "amiable", "amicable", "amused", "amusing", "ancient", "angelic", "angry", "animated", "annoyed", "annoying", "anxious", "appreciative", "apprehensive", "arrogant", "artificial", "artistic", "ashamed", "assertive", "attentive", "attracted", "attractive", "average", "awesome", "awful", "awkward", "bad", "balanced", "barbaric", "barbecued", "beatable", "beaten", "beautiful", "belated", "believing", "belligerent", "beneficent", "best", "better", "bewildered", "big", "bigheaded", "bighearted", "biting", "bitter", "biweekly", "bizarre", "black", "blessed", "blindfolded", "blinding", "blissful", "bloodcurdling", "bloody", "blunt", "blushing", "boiling", "boisterous", "bold", "boney", "borderline", "bored", "boundless", "brainy", "brave", "breakable", "breathless", "breeze", "breezy", "brief", "bright", "brilliant", "british", "broad", "broken", "brokenhearted", "buff", "bullying", "bumpy", "bungling", "bushy", "businesslike", "busy", "calm", "candid", "candy", "cantankerous", "capable", "careful", "careless", "carved", "caustic", "cautious", "center", "centralized", "certifiable", "chainlike", "chancy", "chaotic", "charming", "cheerful", "cheering", "cheery", "cheesy", "chewable", "chic", "chicken", "childish", "childlike", "chilling", "chilly", "chintzy", "chivalrous", "churlish", "circumspect", "civil", "clean", "clear", "clenched", "clever", "clinical", "cloudy", "clumsy", "cobwebby", "coherent", "coincidental", "cold", "coldhearted", "colorful", "colossal", "comatose", "combatant", "combative", "combinable", "combinatory", "combined", "combustible", "combustive", "comfortable", "comforted", "comfortless", "communicative", "compassionate", "competent", "composed", "conceited", "concerned", "condemned", "condescending", "confident", "conscientious", "considerate", "content", "controlling", "convivial", "cool", "cooperative", "cordial", "courageous", "course", "courteous", "cowardly", "crabby", "crafty", "cranky", "crazy", "creative", "credal", "credible", "credulous", "creepy", "critical", "crooked", "crowded", "crucial", "cruel", "crushing", "cuddly", "cultured", "curious", "curly", "curved", "cute", "dainty", "damaged", "damn", "damned", "damp", "dangerous", "daredevil", "dark", "darkish", "dashing", "dated", "dazzling", "dead", "deadpan", "deafening", "decisive", "deep", "defeated", "defiant", "delicate", "delicious", "delightful", "demolished", "demonic", "demoralized", "demure", "dependent", "depressed", "detailed", "determined", "deviant", "devilish", "devoted", "dextrous", "different", "difficult", "diligent", "diplomatic", "direct", "dirty", "disagreeable", "disappointed", "discerning", "discreet", "disguised", "disgusted", "disruptive", "distant", "distinct", "distracted", "distraught", "distrustful", "disturbed", "divine", "dizzy", "doubtful", "dowdy", "dramatic", "dreadful", "drooling", "drowsy", "drugged", "drunk", "dry", "dull", "dusty", "dutiful", "dynamic", "eager", "early", "easy", "easygoing", "eerie", "efficient", "elated", "elderly", "elegant", "elfin", "embarrassed", "eminent", "emotional", "empowered", "empowering", "empty", "enchanting", "encouraging", "endurable", "energetic", "engrossed", "enlightened", "enterprising", "entertaining", "enthusiastic", "envious", "evasive", "evil", "exacting", "exasperating", "excellent", "exceptionable", "excitable", "excited", "exclusive", "expectant", "expedient", "expensive", "experienced", "extraordinary", "extreme", "exuberant", "fabulous", "faint", "fainthearted", "fair", "faith", "faithful", "famous", "fanciful", "fancy", "fanlike", "fantabulous", "fantastic", "farming", "fast", "fastidious", "fat", "ferocious", "fervent", "festive", "fierce", "fiery", "fighting", "filthy", "fine", "flaky", "flashy", "flat", "flighty", "flowing", "fluffy", "foolish", "forceful", "fortunate", "fragile", "frail", "frank", "frantic", "free", "freezing", "fresh", "friendly", "frightened", "frightening", "frightful", "furry", "fusion", "fussy", "fuzzy", "gasping", "generous", "gentle", "genuine", "geographic", "geometrical", "ghastly", "ghostly", "ghoulish", "giant", "gifted", "gigantic", "glamorous", "gleaming", "glinting", "glistening", "gloomy", "glorious", "glottal", "glued", "glutinous", "gobsmacked", "good", "goosey", "gorgeous", "gory", "gossipy", "graceful", "gracious", "grave", "greasy", "great", "green", "gregarious", "grieving", "grim", "grisly", "gritty", "groggy", "groping", "grotesque", "grouchy", "groveling", "grubby", "gruesome", "grumpy", "guarded", "gullible", "hairless", "hairy", "hallucinating", "hallucinogenic", "handsewn", "handsome", "handwritten", "happy", "hard", "hardheaded", "harmless", "harmonious", "harsh", "hateful", "haunted", "hawaiian", "healing", "healthful", "healthy", "heartbroken", "heartfelt", "heartsick", "hearty", "heavy", "helpful", "hesitant", "high", "hilarious", "hippie", "hissing", "hollow", "homely", "honest", "honorable", "hope", "horrible", "hot", "howling", "huge", "humorous", "hungry", "hushed", "husky", "hypercritical", "hysterical", "icy", "idiotic", "ill", "illogical", "imaginative", "immature", "immense", "immodest", "impartial", "impatient", "imperturbable", "important", "impractical", "impressionable", "impressive", "impulsive", "inactive", "inappropriate", "incisive", "incompetent", "inconsiderate", "inconsistent", "indefatigable", "independent", "indiscreet", "indolent", "industrious", "inexpensive", "innocent", "inquisitive", "insane", "insensitive", "inspiring", "instinctive", "intent", "interesting", "intolerant", "intuitive", "inventive", "involved", "irascible", "irresistible", "irritating", "itchy", "jealous", "jittery", "jolly", "joyful", "joyous", "judgmental", "juicy", "keen", "kind", "knowledgeable", "kooky", "lame", "large", "late", "lazy", "leery", "lethargic", "level", "light", "likeable", "liking", "listless", "lithe", "little", "lively", "local", "logical", "lonely", "long", "loose", "loud", "lovable", "lovely", "loving", "low", "loyal", "lucky", "lusting", "magic", "magnificent", "mammoth", "many", "masked", "massive", "maternal", "mature", "mean", "meddlesome", "melodic", "mercurial", "methodical", "meticulous", "mighty", "mild", "miniature", "misbehaving", "miserable", "misty", "moaning", "modern", "modest", "monster", "moody", "moonlit", "morbid", "moronic", "morose", "motionless", "motivated", "muddy", "mushy", "musical", "mute", "mysterious", "naked", "narrow", "nasty", "naughty", "neat", "negative", "nervous", "new", "nice", "normal", "nosy", "numb", "numerous", "nutty", "obedient", "obnoxious", "odd", "open", "optimistic", "orange", "orderly", "ordinary", "ostentatious", "otherworldly", "outgoing", "outrageous", "outspoken", "overcome", "overjoyed", "painful", "painstaking", "passionate", "passive", "paternalistic", "patient", "peaceful", "peevish", "pensive", "perfect", "persevering", "persistent", "persnickety", "petite", "petulant", "philosophical", "picky", "pioneering", "placid", "plain", "plastic", "playful", "pleasant", "plucky", "pointed", "poised", "pokey", "polite", "poor", "popular", "positive", "powerful", "practical", "precious", "prejudiced", "pretend", "pretty", "prickly", "pride", "productive", "proficient", "protective", "proud", "provocative", "prudent", "punctual", "puny", "purple", "purring", "puzzled", "quaint", "quarrelsome", "querulous", "quick", "quickest", "quiet", "rainy", "rapid", "rare", "raspy", "rational", "ratty", "real", "realistic", "reassuring", "receptive", "reclusive", "reflective", "reliable", "relieved", "reluctant", "repulsive", "resentful", "reserved", "resigned", "resolute", "resonant", "resourceful", "respected", "respectful", "responsible", "restless", "revered", "revolting", "rich", "ridiculous", "righteous", "ripe", "roasted", "robust", "romantic", "rotten", "rough", "salty", "sassy", "saucy", "scary", "scattered", "scrawny", "screaming", "screeching", "sedate", "seemly", "selfish", "sensible", "sensitive", "sentimental", "serene", "serious", "sexy", "shadowy", "shaggy", "shaky", "shallow", "sharp", "shiny", "shivering", "shocking", "short", "shrewd", "shrill", "shy", "silent", "silky", "silly", "sincere", "sizzling", "skillful", "skinny", "sleepy", "slight", "slimy", "slippery", "sloppy", "slothful", "slovenly", "slow", "small", "smart", "smelly", "smiling", "smoggy", "smokey", "smooth", "snazzy", "sneaky", "sneering", "snobby", "snooping", "sociable", "soft", "solid", "somber", "sophisticated", "sore", "soulful", "soulless", "sour", "sparkling", "spastic", "spicy", "spinning", "spirited", "splendid", "spontaneous", "spooky", "spotless", "spotty", "square", "squealing", "squeamish", "stable", "staid", "stained", "stale", "staring", "startling", "steadfast", "steady", "steep", "stern", "sticky", "stimulating", "stingy", "stinky", "stoic", "stormy", "straight", "straightforward", "strange", "striking", "striped", "strong", "stupid", "sturdy", "stylish", "subtle", "successful", "succinct", "sudden", "sulky", "sullen", "super", "supercilious", "superficial", "supernatural", "supportive", "surly", "suspicious", "sweet", "swift", "sympathetic", "tactful", "tactless", "talented", "tall", "tasteless", "tasty", "teasing", "tender", "terrible", "terrifying", "testy", "thankful", "thinking", "thoughtful", "thoughtless", "thrifty", "thrilled", "thrilling", "thundering", "tidy", "tight", "timid", "tiny", "tolerant", "touchy", "tough", "tranquil", "tricky", "triple", "troubled", "twisted", "ugliest", "ugly", "unassuming", "unbalanced", "uncertain", "uncooperative", "undependable", "understanding", "unearthly", "unemotional", "uneven", "unfriendly", "unguarded", "unhelpful", "unimaginative", "uninterested", "unmotivated", "unnatural", "unnerving", "unpleasant", "unpopular", "unreliable", "unsightly", "unsophisticated", "unstable", "unsure", "unthinking", "unusual", "unwilling", "upbeat", "upset", "uptight", "vast", "versatile", "vicious", "victorious", "vigilant", "vigorous", "vivacious", "vivid", "voiceless", "volcanic", "vulnerable", "wandering", "warm", "warmhearted", "warming", "wary", "wasteful", "watchful", "watery", "weak", "weary", "weird", "well", "wet", "whispering", "wicked", "wide", "wild", "willing", "witty", "wonderful", "wooden", "worried", "worrisome", "wrong", "yellow", "young", "yummy", "zany", "zealous"]
					return chooseRandom(adjectives)
				}
				else {
					return false
				}
			}
			catch (error) {
				logError(error)
				return false
			}
		}

/*** checks ***/
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
			try {
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
			catch (error) {
				logError(error)
				callback(false)
			}
		}

	/* cleanDatabase */
		module.exports.cleanDatabase = cleanDatabase
		function cleanDatabase(db) {
			try {
				var games = Object.keys(db)
				var time = new Date().getTime() - (1000 * 60 * 60 * 6)

				for (var g in games) {
					if (games[g].updated < time) {
						delete db[games[g]]
					}
				}
			}
			catch (error) {
				logError(error)
			}
		}