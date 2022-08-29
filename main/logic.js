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
						return '<link href="https://fonts.googleapis.com/css?family=Reem+Kufi" rel="stylesheet">'
					break

					case "meta":
						return '<meta charset="UTF-8"/>\
								<meta name="description" content="Switchonyms is a chaotic party game of words and guesses."/>\
								<meta name="keywords" content="game,word,guess,party,chaos,switch,swap,play"/>\
								<meta name="author" content="James Mayr"/>\
								<meta property="og:title" content="Switchonyms: a chaotic party game of words and guesses"/>\
								<meta property="og:url" content="https://jamesmayr.com/switchonyms"/>\
								<meta property="og:description" content="Switchonyms is a chaotic party game of words and guesses."/>\
								<meta property="og:image" content="https://jamesmayr.com/switchonyms/banner.png"/>\
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
					var nouns = ["people", "work", "film", "water", "money", "example", "business", "study", "game", "life", "form", "air", "day", "place", "number", "part", "field", "fish", "back", "process", "heat", "hand", "experience", "job", "book", "end", "point", "type", "home", "economy", "value", "body", "market", "guide", "interest", "state", "radio", "course", "company", "price", "size", "card", "list", "mind", "trade", "line", "care", "group", "risk", "word", "fat", "force", "key", "light", "training", "name", "school", "top", "amount", "level", "order", "practice", "research", "sense", "service", "piece", "web", "boss", "sport", "fun", "house", "page", "term", "test", "answer", "sound", "focus", "matter", "kind", "soil", "board", "oil", "picture", "access", "garden", "range", "rate", "reason", "future", "site", "demand", "exercise", "image", "case", "cause", "coast", "action", "age", "bad", "boat", "record", "result", "section", "building", "mouse", "cash", "class", "nothing", "period", "plan", "store", "tax", "side", "subject", "space", "rule", "stock", "weather", "chance", "figure", "man", "model", "source", "beginning", "earth", "program", "chicken", "design", "feature", "head", "material", "purpose", "question", "rock", "salt", "act", "birth", "car", "dog", "object", "scale", "sun", "note", "profit", "rent", "speed", "style", "war", "bank", "craft", "half", "inside", "outside", "standard", "bus", "exchange", "eye", "fire", "position", "pressure", "stress", "advantage", "benefit", "box", "frame", "issue", "step", "cycle", "face", "item", "metal", "paint", "review", "room", "screen", "structure", "view", "account", "ball", "discipline", "medium", "share", "balance", "bit", "bottom", "choice", "gift", "impact", "machine", "shape", "tool", "wind", "address", "average", "career", "culture", "morning", "pot", "sign", "table", "task", "condition", "contact", "credit", "egg", "hope", "ice", "network", "north", "square", "attempt", "date", "effect", "link", "post", "star", "voice", "capital", "challenge", "friend", "self", "shot", "brush", "couple", "debate", "exit", "front", "function", "lack", "living", "plant", "plastic", "spot", "summer", "taste", "theme", "track", "wing", "brain", "button", "click", "desire", "foot", "gas", "influence", "notice", "rain", "wall", "base", "damage", "distance", "feeling", "pair", "savings", "staff", "sugar", "target", "text", "animal", "author", "budget", "discount", "file", "ground", "lesson", "minute", "officer", "phase", "register", "sky", "stage", "stick", "title", "trouble", "bowl", "bridge", "campaign", "character", "club", "edge", "evidence", "fan", "letter", "lock", "maximum", "novel", "option", "pack", "park", "quarter", "skin", "sort", "weight", "baby", "background", "carry", "dish", "factor", "fruit", "glass", "joint", "master", "muscle", "red", "strength", "traffic", "trip", "vegetable", "appeal", "chart", "gear", "ideal", "kitchen", "land", "log", "mother", "net", "party", "principle", "relative", "sale", "season", "signal", "spirit", "street", "tree", "wave", "belt", "bench", "commission", "copy", "drop", "minimum", "path", "progress", "project", "sea", "south", "status", "stuff", "ticket", "tour", "angle", "blue", "breakfast", "confidence", "daughter", "degree", "doctor", "dot", "dream", "duty", "essay", "father", "fee", "finance", "hour", "juice", "limit", "luck", "milk", "mouth", "peace", "pipe", "seat", "stable", "storm", "substance", "team", "trick", "afternoon", "bat", "beach", "blank", "catch", "chain", "cream", "crew", "detail", "gold", "interview", "kid", "mark", "match", "mission", "pain", "pleasure", "score", "screw", "shop", "shower", "suit", "tone", "window", "agent", "band", "block", "bone", "calendar", "cap", "coat", "contest", "corner", "court", "cup", "district", "door", "east", "finger", "garage", "guarantee", "hole", "hook", "implement", "layer", "lecture", "lie", "manner", "meeting", "nose", "parking", "partner", "profile", "respect", "rice", "routine", "schedule", "swimming", "telephone", "tip", "winter", "airline", "bag", "battle", "bed", "bill", "bother", "cake", "code", "curve", "designer", "dimension", "dress", "ease", "emergency", "evening", "farm", "fight", "gap", "grade", "holiday", "horror", "horse", "host", "husband", "loan", "mistake", "mountain", "nail", "noise", "occasion", "package", "patient", "pause", "phrase", "proof", "race", "relief", "sand", "sentence", "shoulder", "smoke", "stomach", "string", "tourist", "towel", "vacation", "west", "wheel", "wine", "arm", "aside", "bet", "blow", "border", "branch", "brother", "buddy", "bunch", "chip", "coach", "cross", "document", "draft", "dust", "expert", "floor", "god", "golf", "habit", "iron", "judge", "knife", "landscape", "league", "mail", "mess", "native", "opening", "parent", "pattern", "pin", "pool", "pound", "request", "salary", "shame", "shelter", "shoe", "silver", "tank", "trust", "bake", "bar", "bell", "bike", "blame", "boy", "brick", "chair", "closet", "clue", "collar", "comment", "devil", "diet", "fear", "fuel", "glove", "jacket", "lunch", "monitor", "mortgage", "nurse", "pace", "panic", "peak", "plane", "reward", "row", "sandwich", "shock", "spite", "spray", "surprise", "transition", "weekend", "welcome", "yard", "alarm", "bend", "bicycle", "bite", "bottle", "cable", "candle", "cloud", "concert", "counter", "flower", "grandfather", "harm", "knee", "lawyer", "leather", "load", "mirror", "neck", "plate", "purple", "ruin", "ship", "skirt", "slice", "snow", "stroke", "switch", "trash", "tune", "zone", "anger", "award", "bid", "bitter", "boot", "bug", "camp", "candy", "carpet", "cat", "champion", "channel", "clock", "comfort", "cow", "crack", "engineer", "entrance", "fault", "grass", "guy", "hell", "highlight", "incident", "island", "joke", "jury", "leg", "lip", "mate", "motor", "nerve", "passage", "pen", "pride", "priest", "prize", "promise", "resident", "resort", "ring", "roof", "rope", "sail", "scheme", "script", "sock", "station", "toe", "tower", "truck", "witness", "you", "can", "will", "other", "help", "public", "start", "human", "general", "tonight", "change", "past", "today", "current", "cut", "show", "check", "second", "call", "increase", "single", "individual", "turn", "guard", "travel", "cook", "dance", "excuse", "commercial", "purchase", "deal", "worth", "fall", "present", "cost", "support", "glad", "reserve", "watch", "charge", "break", "safe", "stay", "visit", "cover", "report", "rise", "walk", "pick", "anything", "lift", "mix", "private", "stop", "concern", "fly", "official", "gain", "stand", "fail", "lead", "worry", "handle", "finish", "press", "ride", "secret", "spread", "spring", "wait", "display", "flow", "hit", "objective", "shoot", "touch", "chemical", "dump", "conflict", "jump", "kick", "opposite", "pass", "pitch", "remote", "total", "treat", "beat", "burn", "deposit", "raise", "somewhere", "advance", "dark", "equal", "fix", "tap", "win", "attack", "claim", "constant", "drag", "drink", "guess", "minor", "pull", "solid", "count", "doubt", "forever", "nobody", "round", "slide", "strip", "command", "dig", "march", "smell", "survey", "tie", "adult", "brief", "escape", "hate", "scratch", "strike", "laugh", "mobile", "senior", "split", "strain", "struggle", "swim", "train", "wash", "crash", "hide", "miss", "permit", "quote", "resolve", "roll", "sink", "slip", "spare", "suspect", "swing", "twist", "upstairs", "calm", "estimate", "male", "mine", "prompt", "quiet", "regret", "rush", "shake", "shift", "steal", "bear", "dare", "dear", "delay", "drunk", "female", "kiss", "pop", "punch", "reply", "rip", "smile", "spell", "stretch", "tear", "tomorrow", "wake", "wrap", "yesterday"]
					return chooseRandom(nouns)
				}
				else if (type == "verb") {
					var verbs = ["have", "get", "see", "need", "know", "find", "take", "want", "do", "learn", "become", "come", "include", "thank", "provide", "create", "add", "understand", "consider", "choose", "develop", "remember", "grow", "allow", "supply", "bring", "improve", "maintain", "begin", "exist", "tend", "enjoy", "perform", "decide", "identify", "continue", "protect", "require", "write", "approach", "avoid", "prepare", "build", "achieve", "believe", "receive", "seem", "discuss", "realize", "contain", "follow", "refer", "solve", "describe", "prefer", "prevent", "discover", "ensure", "expect", "invest", "reduce", "speak", "appear", "explain", "explore", "involve", "lose", "afford", "agree", "hear", "remain", "represent", "apply", "forget", "recommend", "rely", "vary", "generate", "obtain", "accept", "communicate", "complain", "depend", "enter", "happen", "indicate", "suggest", "survive", "appreciate", "compare", "imagine", "manage", "encourage", "expand", "prove", "react", "recognize", "relax", "replace", "borrow", "earn", "emphasize", "enable", "operate", "reflect", "send", "anticipate", "assume", "engage", "enhance", "examine", "install", "participate", "intend", "introduce", "relate", "settle", "assure", "attract", "distribute", "overcome", "owe", "succeed", "suffer", "throw", "acquire", "adapt", "adjust", "argue", "arise", "confirm", "justify", "organize", "possess", "relieve", "retain", "shut", "calculate", "compete", "consult", "deliver", "extend", "investigate", "negotiate", "qualify", "retire", "weigh", "arrive", "attach", "behave", "celebrate", "convince", "disagree", "establish", "ignore", "imply", "insist", "pursue", "specify", "warn", "accuse", "admire", "admit", "adopt", "announce", "apologize", "approve", "attend", "belong", "commit", "criticize", "deserve", "destroy", "hesitate", "illustrate", "inform", "manufacture", "persuade", "pour", "propose", "remind", "submit", "translate", "use", "make", "look", "help", "go", "think", "read", "keep", "start", "give", "play", "feel", "set", "change", "say", "cut", "show", "try", "check", "call", "move", "pay", "let", "increase", "turn", "ask", "buy", "guard", "hold", "offer", "travel", "cook", "dance", "live", "purchase", "deal", "mean", "fall", "produce", "search", "spend", "talk", "upset", "tell", "cost", "drive", "support", "remove", "return", "run", "reserve", "leave", "reach", "rest", "serve", "watch", "charge", "break", "stay", "visit", "affect", "cover", "report", "rise", "walk", "pick", "lift", "mix", "stop", "teach", "concern", "fly", "born", "gain", "save", "stand", "fail", "lead", "listen", "worry", "express", "handle", "meet", "release", "sell", "finish", "press", "ride", "spread", "spring", "wait", "display", "flow", "hit", "shoot", "touch", "cancel", "cry", "dump", "push", "select", "die", "eat", "fill", "jump", "kick", "pass", "pitch", "treat", "abuse", "beat", "burn", "deposit", "print", "raise", "sleep", "advance", "connect", "consist", "contribute", "draw", "fix", "hire", "join", "kill", "sit", "tap", "win", "attack", "claim", "drag", "drink", "guess", "pull", "wear", "wonder", "count", "doubt", "feed", "impress", "repeat", "seek", "sing", "slide", "strip", "wish", "collect", "combine", "command", "dig", "divide", "hang", "hunt", "march", "mention", "smell", "survey", "tie", "escape", "expose", "gather", "hate", "repair", "scratch", "strike", "employ", "hurt", "laugh", "lay", "respond", "split", "strain", "struggle", "swim", "train", "wash", "waste", "convert", "crash", "fold", "grab", "hide", "miss", "quote", "recover", "roll", "sink", "slip", "suspect", "swing", "twist", "concentrate", "estimate", "prompt", "refuse", "regret", "reveal", "rush", "shake", "shift", "shine", "steal", "suck", "surround", "dare", "delay", "hurry", "invite", "kiss", "marry", "pop", "pray", "pretend", "punch", "quit", "reply", "resist", "rip", "rub", "smile", "spell", "stretch", "tear", "wake", "wrap", "like", "film", "own", "study", "form", "fish", "heat", "experience", "end", "point", "type", "value", "guide", "interest", "state", "list", "mind", "trade", "care", "group", "risk", "force", "light", "name", "order", "practice", "research", "sense", "test", "answer", "sound", "focus", "matter", "board", "access", "garden", "open", "rate", "demand", "exercise", "cause", "coast", "age", "record", "dry", "plan", "store", "tax", "involve", "rule", "model", "source", "program", "design", "feature", "question", "rock", "act", "object", "scale", "fit", "note", "profit", "relate", "rent", "speed", "war", "bank", "content", "craft", "exchange", "fire", "pressure", "stress", "benefit", "box", "complete", "frame", "limit", "step", "cycle", "face", "paint", "review", "room", "structure", "view", "concern", "share", "balance", "impact", "shape", "wind", "address", "average", "career", "sign", "contact", "credit", "hope", "network", "separate", "attempt", "date", "link", "post", "challenge", "warm", "brush", "debate", "exit", "function", "lack", "plant", "spot", "taste", "track", "wing", "click", "correct", "desire", "influence", "notice", "rain", "wall", "base", "damage", "distance", "pair", "staff", "target", "author", "complicate", "discount", "file", "ground", "secure", "stage", "stick", "title", "advance", "bowl", "bridge", "campaign", "club", "fan", "lock", "pack", "park", "sort", "carry", "factor", "trip", "appeal", "chart", "gear", "land", "log", "wave", "copy", "drop", "progress", "project", "stuff", "ticket", "tour", "angle", "dream", "limit", "milk", "mix", "please", "seat", "storm", "team", "amaze", "bat", "blank", "catch", "chain", "crew", "detail", "interview", "mark", "match", "pain", "score", "screw", "shop", "shower", "suit", "band", "block", "cap", "coat", "contest", "court", "cup", "guarantee", "hole", "hook", "implement", "layer", "lecture", "lie", "nose", "partner", "profile", "respect", "schedule", "tip", "bag", "battle", "bill", "bother", "cake", "code", "curve", "farm", "fight", "grade", "host", "loan", "mistake", "nail", "package", "pause", "phrase", "race", "sand", "sentence", "shoulder", "smoke", "stomach", "string", "surprise", "vacation", "wheel", "arm", "associate", "bet", "blow", "border", "branch", "bunch", "chip", "coach", "cross", "document", "draft", "dust", "floor", "golf", "habit", "iron", "judge", "knife", "landscape", "mail", "mess", "pattern", "pin", "pool", "pound", "request", "shame", "shelter", "shoe", "tackle", "tank", "trust", "assist", "bake", "bar", "bell", "bike", "blame", "comment", "diet", "fear", "fuel", "monitor", "nurse", "pace", "panic", "peak", "provide", "reward", "row", "sandwich", "shock", "spite", "spray", "surprise", "transition", "alarm", "bend", "bite", "blind", "bottle", "cloud", "counter", "flower", "harm", "load", "mirror", "please", "propose", "ruin", "ship", "slice", "snow", "stroke", "switch", "tire", "trash", "worry", "anger", "award", "bid", "boot", "bug", "camp", "champion", "channel", "clock", "comfort", "crack", "disappoint", "empty", "engineer", "highlight", "joke", "mate", "pen", "promise", "resort", "ring", "rope", "sail", "scheme", "slight", "truck", "witness"]
					return chooseRandom(verbs)
				}
				else if (type == "adjective") {
					var adjectives = ["abnormal", "adorable", "adventurous", "affectionate", "affordable", "afraid", "aggressive", "agile", "agreeable", "alarming", "alert", "alien", "amazing", "ambitious", "amusing", "ancient", "angry", "animated", "annoyed", "annoying", "anxious", "appreciative", "arrogant", "artificial", "artistic", "ashamed", "assertive", "attentive", "attractive", "average", "awesome", "awful", "awkward", "bad", "balanced", "barbaric", "barbecued", "beaten", "beautiful", "belated", "belligerent", "best", "better", "bewildered", "big", "bitter", "bizarre", "black", "blessed", "blindfolded", "blinding", "blissful", "bloody", "blunt", "blushing", "boiling", "boisterous", "bold", "borderline", "bored", "boundless", "brainy", "brave", "breakable", "breathless", "breezy", "brief", "bright", "brilliant", "broad", "broken", "bumpy", "busy", "calm", "candid", "capable", "careful", "careless", "carved", "cautious", "center", "centralized", "chaotic", "charming", "cheerful", "cheesy", "chewable", "chic", "chicken", "childish", "chilly", "chivalrous", "churlish", "circumspect", "civil", "clean", "clear", "clenched", "clever", "clinical", "cloudy", "clumsy", "coherent", "cold", "coldhearted", "colorful", "colossal", "comatose", "combative", "combined", "combustible", "comfortable", "comfortless", "communicative", "compassionate", "competent", "conceited", "concerned", "condemned", "condescending", "confident", "conscientious", "considerate", "content", "controlling", "cool", "cooperative", "cordial", "courageous", "courteous", "cowardly", "crabby", "crafty", "cranky", "crazy", "creative", "credible", "creepy", "critical", "crooked", "crowded", "crucial", "cruel", "cuddly", "curious", "curly", "curved", "cute", "dainty", "damaged", "damp", "dangerous", "dark", "dated", "dazzling", "dead", "deadpan", "deafening", "decisive", "deep", "defeated", "defiant", "delicate", "delicious", "delightful", "demolished", "demonic", "demoralized", "demure", "dependent", "depressed", "detailed", "determined", "deviant", "devilish", "devoted", "dextrous", "different", "difficult", "diligent", "diplomatic", "direct", "dirty", "disagreeable", "disappointed", "discerning", "discreet", "disguised", "disgusted", "disruptive", "distant", "distinct", "distracted", "distraught", "distrustful", "disturbed", "divine", "dizzy", "doubtful", "dramatic", "dreadful", "drooling", "drowsy", "drugged", "drunk", "dry", "dull", "dusty", "dutiful", "dynamic", "eager", "early", "easy", "easygoing", "eerie", "efficient", "elated", "elderly", "elegant", "embarrassed", "emotional", "empowered", "empowering", "empty", "enchanting", "encouraging", "endurable", "energetic", "engrossed", "enlightened", "enterprising", "entertaining", "enthusiastic", "envious", "evasive", "evil", "exacting", "exasperating", "excellent", "excitable", "excited", "exclusive", "expectant", "expedient", "expensive", "experienced", "extraordinary", "extreme", "exuberant", "fabulous", "faint", "fair", "faithful", "famous", "fancy", "fantabulous", "fantastic", "fast", "fastidious", "fat", "ferocious", "fervent", "festive", "fierce", "fiery", "fighting", "filthy", "fine", "flaky", "flashy", "flat", "flowing", "fluffy", "foolish", "forceful", "fortunate", "fragile", "frail", "frank", "frantic", "free", "freezing", "fresh", "friendly", "frightened", "frightening", "furry", "fusion", "fussy", "fuzzy", "gasping", "generous", "gentle", "genuine", "geographic", "geometrical", "ghastly", "ghostly", "ghoulish", "giant", "gifted", "gigantic", "glamorous", "gleaming", "glinting", "glistening", "gloomy", "glorious", "glued", "glutinous", "gobsmacked", "good", "gorgeous", "gory", "gossipy", "graceful", "gracious", "grave", "greasy", "great", "green", "gregarious", "grieving", "grim", "grisly", "gritty", "groggy", "grotesque", "grouchy", "groveling", "gruesome", "grumpy", "guarded", "gullible", "hairless", "hairy", "hallucinating", "hallucinogenic", "handsome", "handwritten", "happy", "hard", "harmless", "harmonious", "harsh", "hateful", "haunted", "healing", "healthy", "heartbroken", "heartfelt", "heavy", "helpful", "hesitant", "high", "hilarious", "hissing", "hollow", "honest", "honorable", "horrible", "hot", "howling", "huge", "humorous", "hungry", "hushed", "husky", "hypocritical", "hysterical", "icy", "idiotic", "ill", "illogical", "imaginative", "immature", "immense", "immodest", "impartial", "impatient", "important", "impractical", "impressionable", "impressive", "impulsive", "inactive", "inappropriate", "incompetent", "inconsiderate", "inconsistent", "independent", "indiscreet", "indolent", "industrious", "inexpensive", "innocent", "inquisitive", "insane", "insensitive", "inspiring", "instinctive", "intent", "interesting", "intolerant", "intuitive", "inventive", "involved", "irascible", "irresistible", "irritating", "itchy", "jealous", "jittery", "jolly", "joyful", "joyous", "judgmental", "juicy", "keen", "kind", "lame", "large", "late", "lazy", "leery", "lethargic", "level", "light", "likeable", "liking", "listless", "lithe", "little", "lively", "local", "logical", "lonely", "long", "loose", "loud", "lovable", "lovely", "loving", "low", "loyal", "lucky", "magic", "magnificent", "mammoth", "masked", "massive", "maternal", "mature", "mean", "meddlesome", "melodic", "mercurial", "methodical", "meticulous", "mighty", "mild", "miniature", "misbehaving", "miserable", "misty", "modern", "modest", "moody", "moonlit", "morbid", "morose", "motionless", "motivated", "muddy", "mushy", "musical", "mute", "mysterious", "naked", "narrow", "nasty", "naughty", "neat", "negative", "nervous", "new", "nice", "normal", "nosy", "numb", "numerous", "nutty", "obedient", "obnoxious", "odd", "open", "optimistic", "orange", "orderly", "ordinary", "ostentatious", "otherworldly", "outgoing", "outrageous", "outspoken", "overcome", "overjoyed", "painful", "painstaking", "passionate", "passive", "patient", "peaceful", "pensive", "perfect", "persevering", "persistent", "persnickety", "petite", "petulant", "philosophical", "picky", "pioneering", "placid", "plain", "plastic", "playful", "pleasant", "plucky", "pointed", "poised", "polite", "poor", "popular", "positive", "powerful", "practical", "precious", "prejudiced", "pretend", "pretty", "prickly", "pride", "productive", "proficient", "protective", "proud", "provocative", "prudent", "punctual", "puny", "purple", "purring", "puzzled", "quaint", "quarrelsome", "quick", "quiet", "rainy", "rapid", "rare", "raspy", "rational", "real", "realistic", "reassuring", "receptive", "reflective", "reliable", "relieved", "reluctant", "repulsive", "resentful", "reserved", "resigned", "resolute", "resonant", "resourceful", "respected", "respectful", "responsible", "restless", "revered", "revolting", "rich", "ridiculous", "righteous", "ripe", "roasted", "robust", "romantic", "rotten", "rough", "salty", "sassy", "saucy", "scary", "scattered", "scrawny", "screaming", "screeching", "selfish", "sensible", "sensitive", "sentimental", "serene", "serious", "shadowy", "shaggy", "shaky", "shallow", "sharp", "shiny", "shivering", "shocking", "short", "shrewd", "shrill", "shy", "silent", "silky", "silly", "sincere", "sizzling", "skillful", "skinny", "sleepy", "slimy", "slippery", "sloppy", "slow", "small", "smart", "smelly", "smiling", "smokey", "smooth", "snazzy", "sneaky", "snobby", "sociable", "soft", "solid", "somber", "sophisticated", "sore", "soulful", "soulless", "sour", "sparkling", "spastic", "spicy", "spinning", "spirited", "splendid", "spontaneous", "spooky", "spotless", "spotty", "square", "squeamish", "stable", "staid", "stained", "stale", "startling", "steadfast", "steady", "steep", "stern", "sticky", "stimulating", "stingy", "stinky", "stoic", "stormy", "straight", "strange", "striped", "strong", "stupid", "sturdy", "stylish", "subtle", "successful", "succinct", "sudden", "sulky", "sullen", "super", "superficial", "supernatural", "supportive", "suspicious", "sweet", "swift", "sympathetic", "tactful", "talented", "tall", "tasteless", "tasty", "tender", "terrible", "terrifying", "thankful", "thoughtful", "thoughtless", "thrifty", "thrilled", "thundering", "tidy", "tight", "timid", "tiny", "tolerant", "touchy", "tough", "tranquil", "tricky", "twisted", "ugly", "unbalanced", "uncertain", "understanding", "unemotional", "uneven", "unimaginative", "unnatural", "unnerving", "unpleasant", "unpopular", "unreliable", "unstable", "unusual", "upbeat", "upset", "uptight", "vast", "versatile", "vicious", "victorious", "vigilant", "vigorous", "vivacious", "vivid", "voiceless", "volcanic", "vulnerable", "wandering", "warm", "wary", "wasteful", "watery", "weak", "weary", "weird", "wet", "wicked", "wide", "wild", "willing", "witty", "wonderful", "wooden", "worried", "wrong", "yellow", "young", "yummy", "zany", "zealous"]
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
					case (typeof agent == "undefined" || !agent):
						return "no-agent"
					break
					
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
