g_cache_as_bitmap = true;

var on_coolmath = false;

Types = {


		Events: {
			MOUSE_MOVE: 0,
			MOUSE_CLICK: 1,
			MOUSE_CLICK_RIGHT: 2,
			MOUSE_UP:7,
			KEY_LEFT:3,
			KEY_RIGHT:4,
			KEY_UP:5,
			KEY_DOWN:6,

			WEB_LINK: 7,
			NEW_GAME: 8,
			SOUND_ONOFF: 9,
			TWEET_SCORE: 10,
			MUSIC_ONOFF: 11,
			BOOKMARK: 12,
			GAME_OVER: 13,

			WHEEL: 20,

			CLICK_TO_DIG: 30,
			HOLD_TO_FLAG: 31,
			RIGHT_TO_FLAG: 32,

			GOTO_LEVELS: 40,
			GOTO_AUTOGEN: 41,
			GOTO_EDITOR: 42,
			GOTO_COMMUNITY_LEVELS: 43,
			GOTO_CREDITS: 44,
			GOTO_NEG_MODE: 45,

			NO_EVENT: 0,

			MOUSE_DOWN:  14,
		},

		Fonts: {
			SMALL: 0,
			MEDIUM: 1,
			SMALL_WHITE: 2,
			XSMALL: 3,
			MED_SMALL: 4,
		},

		Layer: {
			BACKGROUND: 0,
			TILE: 1,
			GAME: 2,
			HUD: 3,
			POP_MENU: 4,
			GAME_MENU: 5,
			GAME_SCREEN: 6,
			LEVEL_TEXT: 7,
		},
	
	
};

var language = window.navigator.userLanguage || window.navigator.language || 'en';
if (language.length > 2) language = language[0]+language[1];	// first 2 letters 
//language = 'zh';
//alert(language); //works IE/SAFARI/CHROME/FF https://msdn.microsoft.com/en-us/library/ms533052(v=vs.85).aspx
if (language != 'en' && language != 'zh' && language != 'ja') language = 'en';

//language = 'ja';

if (using_cocoon_js == true) language = 'en';

language = 'en';

function g_get_text (tx) {
	if (g_texts[language] == null) return g_texts['en'][tx];
	if (g_texts[language][tx] == null) return g_texts['en'][tx];
	return g_texts[language][tx];
}

g_texts = {

	"en" : {
		"Title"	   : "MATHSWEEPER",
		"New Game" : "NEW GAME",
		"Tutorial" : "TUTORIAL",
		"Sound"	   : "SOUND",
		"Music"	   : "Music",
		"LEVELS"   : "LEVELS",
		"COMMUNITY LEVELS"   : "COMMUNITY LEVELS",
		"LEVEL EDITOR"   : "LEVEL EDITOR",

		"ON"	   : " ON",
		"OFF"	   : " OFF",

		"digflag" : "TAP TO DIG the safe tile\nPRESS TO FLAG the unsafe tile",

		"hold": "HOLD TO FLAG",	
		"mark": "MARK FIRST",
		"right": "RIGHT TO FLAG",


		"hold_long": "HOLD TO FLAG, CLICK TO DIG",
		"mark_long": "MARK TILES, THEN FLAG OR DIG",
		"right_long": "RIGHT CLICK TO FLAG, LEFT TO DIG",


		"hand"	   : "      Number of mines in the 4 surrounding tiles.",
		"eye"	   : "      Number of mines in line of sight, this row and column. Blocked by walls.",
		"eighthand": "      Number of mines in the 8 surrounding tiles.",
		"heart"	   : "      Like the eye, but only counts LONELY mines. Lonely mines have no other mines in the 4 tiles around them.",
		"compass"	   : "      Number of DIRECTIONS in which mines are seen. Same range as the eye.",
		"crown"	   : "      BIGGEST unbroken sequence of mines seen. Same range as the eye.",
		"eyebracket"	   : "      How many unbroken GROUPS of mines seen. Same range as the eye.",
		"ghost"	   : "      Counts EMPTY tiles. Same range as the eye. Vision is BLOCKED BY MINES.",



		"tut0"	   : "EACH COVERED SQUARE HAS EITHER 1 MINE\nOR IT IS SAFE",
		"tut0a"	   : "IF IT IS SAFE THEN REMOVE IT \nIF IT IS UNSAFE THEN FLAG IT (CLICK AND HOLD)",

		"tut1"	   : "EACH COVERED SQUARE HAS EITHER 2 MINES\nOR IT IS SAFE",
		"tut1a"	   : "DOUBLE OR NOTHING",

		"tut2"	   : "EACH COVERED SQUARE HAS EITHER 3 MINES\nOR IT IS SAFE",
		"tut2a"	   : "TRIPLE OR NOTHING",

		"tut3"	   : "GOOD LUCK!",
		"tut3a"	   : "YOU CAN CHANGE THE CONTROL MODE FROM THE SIDE MENU",

		"tut5"	   : "THIS ONE IS TRICKY",
		"tut5a"	   : "But you still don't need to guess",

		"tut6"	   : "WALLS BLOCK THE LINE OF SIGHT",
		"tut6a"	   : "",

		"tut7"	   : "YOU MUST DIG OR FLAG EVERY TILE TO WIN",

		"tut8"	   : "You can click on a hint tile if you forget how it works",

		"tut13"	   : "WALLS BLOCK THE LINE OF SIGHT",
		"tut13a"   : "",

		"tut18"	   : "WELCOME TO 1992 ;)",

		"tut28"	   : "TWO TILES BECOME ONE BIG TILE",
		"tut28a"   : "HOW MANY MINES CAN THIS ONE BIG TILE SEE?",

		"tut53"	   : "SOME MINES FEEL VERY LONELY",
		"tut53a"   : "But the heart cares\nThe heart sees ONLY mines who are all alone.",

		"tut_compass"	   : "HOW MANY DIRECTIONS?",
		"tut_compassa"   : "The compass only tells you how many\nDIRECTIONS (0-4) it sees mines in.",

		"tut_crown"	   : "ONLY THE BEST FOR THE KING",
		"tut_crowna"   : "The crown tells you the highest\nunbroken sequence of mines that it can see.",

		"tut_share"	   : "SHARING OUR MINES",
		"tut_sharea"   : "One mine is shared between two clues.",

		"tut_noshare"	   : "NOT SHARING OUR MINES",
		"tut_nosharea"   : "These two clues are sharing 0 mines.",
		
	},

	// th thai
	// ko korean
	// ar arabic	

	// hindi
	"hi" : {
		"Title"	   : "MINE OF SIGHT",
		"New Game" : "मेन्यू",
		"Tutorial" : "TUTORIAL",
		"Sound"	   : "ध्वनि",
		"Music"	   : "Music",
		"LEVELS"   : "स्तरों",
		"COMMUNITY LEVELS"   : "समुदाय का स्तर",
		"LEVEL EDITOR"   : "स्तर संपादक",

		"ON"	   : " पर",
		"OFF"	   : " बंद",

		"hold": "झंडा पकड़ क्लिक करें",	
		"mark": "MARK FIRST",
		"right": "सही ध्वज क्लिक करें",


		"hold_long": "झंडा पकड़ क्लिक करें, CLICK TO DIG",
		"mark_long": "MARK TILES, THEN FLAG OR DIG",
		"right_long": "सही ध्वज क्लिक करें, खोदो क्लिक करें छोड़ दिया",


		"hand"	   : "           चार आसपास टाइल्स में खानों की संख्या",
		"eye"	   : "           दृष्टि, इस पंक्ति और स्तंभ की लाइन में खानों की संख्या। दीवारों से अवरोधित।",
		"eighthand": "      आठ आसपास के टाइल्स में खानों की संख्या",
		"heart"	   : "      आँख की तरह है, लेकिन केवल अकेला खानों को देखता है। लोनली खानों उन्हें चारों ओर 4 टाइल्स में कोई अन्य खानों है।",
		"compass"	   : "           निर्देश (नॉर्थ + ईस्ट + वेस्ट + साउथ = 0 से 4), जो खानों की संख्या में देखा जाता है। आंख के रूप में एक ही श्रेणी।",
		"crown"	   : "      BIGGEST unbroken sequence of mines seen. Same range as the eye.",
		"eyebracket"	   : "      How many unbroken GROUPS of mines seen. Same range as the eye.",


		"tut0"	   : "जहां खानों छिपा रहे हैं?",
		"tut0a"	   : "टाइल झंडा असुरक्षित है, और सुरक्षित खुदाई टाइल",

		"tut1"	   : "नहीं तिरछे",
		"tut1a"	   : "बस के ऊपर और नीचे और बाएँ और दाएँ",

		"tut2"	   :   "आंख कितने खानों देख सकते हैं?",
		"tut2a"	   : "आंख सुराग के एक अलग प्रकार है",

		"tut3"	   : "सुराग का पालन करें",
		"tut3a"	   : "तुम भाग्य की जरूरत नहीं",

		"tut5"	   : "इस पहेली मुश्किल है",
		"tut5a"	   : "लेकिन अभी भी आपको भाग्य की जरूरत नहीं",

		"tut6"	   : "दीवारों दृष्टि की लाइन ब्लॉक",
		"tut6a"	   : "",

		"tut7"	   : "YOU MUST DIG OR FLAG EVERY TILE TO WIN",

		"tut8"	   : "You can click on a hint tile if you forget how it works",

		"tut13"	   : "दीवारों दृष्टि की लाइन ब्लॉक",
		"tut13a"   : "",

		"tut18"	   : "WELCOME TO 1992 ;)",

		"tut28"	   : "TWO TILES BECOME ONE BIG TILE",
		"tut28a"   : "HOW MANY MINES CAN THIS ONE BIG TILE SEE?",

		"tut53"	   : "SOME MINES FEEL VERY LONELY",
		"tut53a"   : "But the heart cares\nThe heart sees ONLY mines who are all alone.",

		"tut_compass"	   : "HOW MANY DIRECTIONS?",
		"tut_compassa"   : "The compass only tells you how many\nDIRECTIONS (0-4) it sees mines in.",

		"tut_crown"	   : "ONLY THE BEST FOR THE KING",
		"tut_crowna"   : "The crown tells you the highest\nunbroken sequence of mines that it can see.",

		"tut_share"	   : "SHARING OUR MINES",
		"tut_sharea"   : "One mine is shared between two clues.",

		"tut_noshare"	   : "NOT SHARING OUR MINES",
		"tut_nosharea"   : "These two clues are sharing 0 mines.",
		
	},

	// simplified
	"zh" : {
		"Title"	   : "MINE OF SIGHT",
		"New Game" : "MENU",
		"Tutorial" : "教程",
		"Sound"	   : "声音",
		"Music"	   : "音乐",
		"LEVELS"   : "水平",
		"COMMUNITY LEVELS"   : "社区层面",
		"LEVEL EDITOR"   : "级别编辑器",

		"ON"	   : " 上",
		"OFF"	   : " 关闭",

		"hold": "HOLD TO FLAG",	
		"mark": "MARK FIRST",
		"right": "右键单击放置一个标志",


		"hold_long": "HOLD TO FLAG, CLICK TO DIG",
		"mark_long": "MARK TILES, THEN FLAG OR DIG",
		"right_long": "右键单击放置一个标志, LEFT TO DIG",

		
		"hand"	   : "      在4个最近的地砖中的地雷数.",
		"eye"	   : "      视线中的地雷数，此行和列。被墙壁阻挡。",
		"eighthand": "      在8个最近的地砖中的地雷数.",
		"heart"	   : "      像眼睛，但只看到孤独的地雷。孤独的地雷在他们周围的4个地砖中没有其他地雷。",
		"compass"	   : "      计算地雷的所有方向（北+南+东+西等于0到4）。与眼睛相同的范围。",
		"crown"	   : "      看到最大的不间断矿井序列。与眼睛相同的范围。",
		"eyebracket"	   : "      看到了多少不间断的矿山。这些组由间隙分开。与眼睛相同的范围。",


		"tut0"	   : "炸弹隐藏在哪里？",
		"tut0a"	   : "如果白色瓷砖是安全的，然后删除它 \n如果白色瓷砖不安全，请标记它",

		"tut1"	   : "只有四个方向",
		"tut1a"	   : "不是八",

		"tut2"	   : "眼睛可以看到炸弹",
		"tut2a"	   : "眼睛是不同类型的线索",

		
		"tut3"	   : "跟着线索",
		"tut3a"	   : "没有必要猜测",

		"tut5"	   : "这是一个艰难的时刻",
		"tut5a"	   : "但你不需要猜测",

		"tut6"	   : "墙壁阻挡视线T",
		"tut6a"	   : "",

		"tut7"	   : "你必须挖或标记每个瓷砖",

		"tut8"	   : "你可以点击一个线索，如果你忘记了线索的工作原理",

		"tut13"	   : "墙壁阻挡视线",
		"tut13a"   : "",

		"tut18"	   : "欢迎来到1992年 ;)",

		"tut28"	   : "两个瓦片变成单个大瓦片",
		"tut28a"   : "新瓷砖看到了什么？",

		"tut53"	   : "一些矿山非常孤独",
		"tut53a"   : "但心脏关心。心脏看到只有地雷是孤独的。",

		"tut_compass"	   : "多少方向？",
		"tut_compassa"   : "The compass only tells you how many DIRECTIONS (0-4) it sees mines in.",

		"tut_crown"	   : "国王只得到最好的",
		"tut_crowna"   : "The crown tells you the highest\nunbroken sequence of mines that it can see.",

		"tut_share"	   : "他们正在分享一个地雷",
		"tut_sharea"   : "One mine is shared between two clues.",

		"tut_noshare"	   : "他们不共享一个矿",
		"tut_nosharea"   : "These two clues are sharing 0 mines.",

	},

	// traditional
	"zhtrad" : {
		"Title"	   : "MINE OF SIGHT",
		"New Game" : "MENU",
		"Tutorial" : "教程",
		"Sound"	   : "聲音",

		"LEVELS"   : "水平",
		"COMMUNITY LEVELS"   : "社區層面",
		"LEVEL EDITOR"   : "級別編輯器",

		"ON"	   : " 上",
		"OFF"	   : " 關閉",

		"hold": "HOLD TO FLAG",	
		"mark": "MARK FIRST",
		"right": "右鍵單擊放置一個標誌",


		"hold_long": "HOLD TO FLAG, CLICK TO DIG",
		"mark_long": "MARK TILES, THEN FLAG OR DIG",
		"right_long": "右鍵單擊放置一個標誌, LEFT TO DIG",

		
		"hand"	   : "      在4個最近的地磚中的地雷數.",
		"eye"	   : "      視線中的地雷數，此行和列。被牆壁阻擋。",
		"eighthand": "      在8個最近的地磚中的地雷數.",
		"heart"	   : "      像眼睛，但只看到孤獨的地雷。孤獨的地雷在他們周圍的4個地磚中沒有其他地雷。",
		"compass"	   : "      計算地雷的所有方向（北+南+東+西等於0到4）。與眼睛相同的範圍。",
		"crown"	   : "      看到最大的不間斷礦井序列。與眼睛相同的範圍。",
		"eyebracket"	   : "      看到了多少不間斷的礦山。這些組由間隙分開。與眼睛相同的範圍。",


		"tut0"	   : "炸彈隱藏在哪裡？",
		"tut0a"	   : "如果白色瓷磚是安全的，然後刪除它 \n如果白色瓷磚不安全，請標記它",
// simp:
		"tut1"	   : "只有四个方向",
		"tut1a"	   : "不是八",

		"tut2"	   : "眼睛可以看到炸弹",
		"tut2a"	   : "眼睛是不同类型的线索",

		
		"tut3"	   : "跟着线索",
		"tut3a"	   : "没有必要猜测",

		"tut5"	   : "这是一个艰难的时刻",
		"tut5a"	   : "但你不需要猜测",

		"tut6"	   : "墙壁阻挡视线T",
		"tut6a"	   : "",

		"tut7"	   : "你必须挖或标记每个瓷砖",

		"tut8"	   : "你可以点击一个线索，如果你忘记了线索的工作原理",

		"tut13"	   : "墙壁阻挡视线",
		"tut13a"   : "",

		"tut18"	   : "欢迎来到1992年 ;)",

		"tut28"	   : "两个瓦片变成单个大瓦片",
		"tut28a"   : "新瓷砖看到了什么？",

		"tut53"	   : "一些矿山非常孤独",
		"tut53a"   : "但心脏关心。心脏看到只有地雷是孤独的。",

		"tut_compass"	   : "多少方向？",
		"tut_compassa"   : "The compass only tells you how many DIRECTIONS (0-4) it sees mines in.",

		"tut_crown"	   : "国王只得到最好的",
		"tut_crowna"   : "The crown tells you the highest\nunbroken sequence of mines that it can see.",

		"tut_share"	   : "他们正在分享一个地雷",
		"tut_sharea"   : "One mine is shared between two clues.",

		"tut_noshare"	   : "他们不共享一个矿",
		"tut_nosharea"   : "These two clues are sharing 0 mines.",

	},

	"ja" : {
		"Title"	   : "MINE OF SIGHT",
		"New Game" : "メニュー",
		"Tutorial" : "TUTORIAL",
		"Sound"	   : "音",
		"Music"	   : "Music",
		"LEVELS"   : "レベル",
		"LEVEL EDITOR"   : "レベル 設計",
		"COMMUNITY LEVELS"   : "コミュニティレベル",

		"ON"	   : " に",
		"OFF"	   : " オフ",

		"hold": "旗を置くために押す",	
		"mark": "最初にマークする",
		"right": "右クリックしてフラグを立てる",

		"hold_long": "旗を置くために押す, クリックして掘る",
		"mark_long": "最初に多くの場所にマークを付け、次に多くの旗を置くか、すべてを掘るかを決める",
		"right_long": "右クリックしてフラグを設定し、左クリックして掘る",

		"hand"	   : "      4つの最も近い隣人。どれくらいの爆弾？.",
		"eye"	   : "      視線内の爆弾の数。この行と列。それは壁によってブロックされています。",
		"eighthand": "      8つの最も近い隣人。どれくらいの爆弾？.",
		"heart"	   : "      目のように見えますが、孤独な爆弾だけが見えます. 孤独な爆弾は、4つの密接なタイルで友人がいません.",
		"compass"	   : "      爆弾が存在する方向（北、南、東、西）の数. 目と同じ範囲.",
		"crown"	   : "      ギャップのない最大の一連の爆弾. 目と同じ範囲.",
		"eyebracket"	   : "      見た爆弾のグループ数. ギャップで隔てられた. 目と同じ範囲.",

		"tut0"	   : "どこに爆弾が隠れているの？",
		"tut0a"	   : "白いタイルが安全な場合は、それを取り外します \n白いタイルが危険な場合は、それにフラグを立てます",

		"tut1"	   : "唯一の4つの側面",
		"tut1a"	   : "上、下、左、右のみ",

		"tut2"	   : "目は遠くの爆弾を見ることができます",
		"tut2a"	   : "目は新しい種類の手がかりです",

		"tut3"	   : "手がかりを使ってパズルを解く",
		"tut3a"	   : "あなたは推測する必要はありません",

		"tut5"	   : "このパズルは難しい",
		"tut5a"	   : "しかし、あなたは推測する必要はありません",

		"tut6"	   : "壁が視界を止める",
		"tut6a"	   : "",

		"tut7"	   : "あなたが勝つためには\nすべてのタイルに印をつけたり掘ったりする必要があります",

		"tut8"	   : "その行動を覚えているヒントをクリックしてください",

		"tut13"	   : "壁が視界を止める",
		"tut13a"   : "",

		"tut18"	   : "1992年へようこそ ;)",

		"tut28"	   : "2つのタイルが1つの大きなタイルになる",
		"tut28a"   : "大男は何匹の爆弾を見ることができますか？",

		"tut53"	   : "いくつかの爆弾は孤独を感じる",
		"tut53a"   : "しかし、「愛の心」は孤独な爆弾を気にする\n「愛の心」は一人で感じる爆弾だけを見る",

		"tut_compass"	   : "多くの方法は？",
		"tut_compassa"   : "The compass only tells you how many\nDIRECTIONS (0-4) it sees mines in.",

		"tut_crown"	   : "王は最高の報酬を得る",
		"tut_crowna"   : "王冠は最大量しか報告しない",

		"tut_share"	   : "彼らは爆弾を共有している",
		"tut_sharea"   : "One mine is shared between two clues.",

		"tut_noshare"	   : "彼らは爆弾を共有しない",
		"tut_nosharea"   : "OThese two clues are sharing 0 mines.",

	}

};



open_url = function(url) {
	
	if (using_cocoon_js == true) {
		//document.addEventListener("deviceready", onDeviceReady, false);
		//function onDeviceReady() {
    			// Cocoon Canvas+ code here
			//Cocoon.App.openURL(url);
			Cocoon.App.openURL(url);
		//}  

		
	} else {
		window.open(url);
	
	}

};

g_sound_on = true;

g_click_to_dig = true;
g_hold_to_flag = true;

MenuItems = [

	// 0 - subheading,	1 - menu item		2 - 2nd menu item (small, social, icon only)
	//			3 - control scheme
	
	//[1, Types.Events.NEW_GAME, g_texts[language]["New Game"],"new_icon.png",],

	[0, "MATHSWEEPER"],

	//[0, "Game"],
	
	[1, Types.Events.NEW_GAME, g_get_text("New Game"),"home_icon.png",],
	[1, Types.Events.GOTO_LEVELS, "HOW TO PLAY","home_icon.png",],
	//[1, Types.Events.GOTO_LEVELS, g_get_text("LEVELS"),"home_icon.png",],
	//[1, Types.Events.GOTO_AUTOGEN, "MINES++","home_icon.png",],

	[0, "CHALLENGE MODES"],
	[1, Types.Events.GOTO_NEG_MODE, "NEGATIVE NUMS","home_icon.png",],

];

if (using_cocoon_js == false) {
	//MenuItems.push([1, Types.Events.GOTO_EDITOR, g_get_text("LEVEL EDITOR"),"home_icon.png"]);

	//MenuItems.push([1, Types.Events.GOTO_COMMUNITY_LEVELS, g_get_text("COMMUNITY LEVELS"),"home_icon.png"]);
}

var app_exists = false;
if (app_exists) {
MenuItems.push([0, "APP VERSION"]);

var country_code = window.navigator.userLanguage || window.navigator.language || 'en';
country_code = country_code.slice(-2);  // 
if (country_code == null) country_code = 'a';
 
if (using_cocoon_js == false && on_coolmath == false) {
	MenuItems.push([1, Types.Events.WEB_LINK, "Get Android App","ic_list_white_24dp_2x.png","https://play.google.com/store/apps/details?id=com.zblip.mineofsight&hl=en"]);


}

} // if (app_exists)


MenuItems.push([0, "CONTROLS"]);
	
MenuItems.push([3, Types.Events.HOLD_TO_FLAG, g_get_text("hold"),"redflag.png",]);

MenuItems.push([3, Types.Events.CLICK_TO_DIG, g_get_text("mark"),"redflag.png",]);

if (using_cocoon_js == false) {
	MenuItems.push([3, Types.Events.RIGHT_TO_FLAG, g_get_text("right"),"redflag.png",]);
	
	MenuItems.push([1, Types.Events.SOUND_ONOFF, g_texts[language]["Sound"] + g_texts[language]["ON"],"sound_on_icon.png","sound_off_icon.png"]);
	
	// Only include the bookmark if we are on zblip.com
	//[1, Types.Events.BOOKMARK, "Bookmark","games_icon.png"],	// on iphone

}



if(location.hostname != "www.facebook.com"){
	// gotta check for mobile as well
	MenuItems.push([0, "MORE GAMES"]);
	MenuItems.push([1, Types.Events.WEB_LINK, "www.zblip.com","games_icon.png","http://www.zblip.com"]);
}

	
MenuItems.push([0, "LINKS"]);




if(true || location.hostname == "www.zblip.com") {
	MenuItems.push([1, Types.Events.WEB_LINK, "LEGAL","ic_list_white_24dp_2x.png","http://www.zblip.com/legal"]);
}


var credits_via_web = true;

if (credits_via_web == false) {
MenuItems.push([1, Types.Events.GOTO_CREDITS, "CREDITS","ic_list_white_24dp_2x.png"]);

} else {
MenuItems.push([1, Types.Events.WEB_LINK, "CREDITS","ic_list_white_24dp_2x.png","http://www.zblip.com/mathsweeper/credits"]);

}



if(location.hostname == "www.zblip.com"){
	// gotta check for mobile as well
	//MenuItems.push([1, Types.Events.BOOKMARK, "Homescreen","games_icon.png"]);
}

//social buttons:
//MenuItems.push([2, Types.Events.WEB_LINK, "Facebook","facebook-24x24.png","https://www.facebook.com/Mine-of-Sight-1037635096381976/"]);

//MenuItems.push([2, Types.Events.WEB_LINK, "Tumblr","tumblr-24x24.png","https://zblip.tumblr.com/"]);

if (using_cocoon_js == false) {
	MenuItems.push([1, Types.Events.WEB_LINK, "Facebook","fblogo.png","https://www.facebook.com/mathsweeper"]);
	MenuItems.push([1, Types.Events.WEB_LINK, "Twitter","twitter-24x24.png","https://twitter.com/ZBlipGames"]);
	MenuItems.push([1, Types.Events.WEB_LINK, "Tumblr","tumblr-24x24.png","https://zblip.tumblr.com/"]);
}
//

var pic_url = 'https://pbs.twimg.com/media/CvuK418VYAEm5g_.jpg'

function tweetscore(score) {        

	//share score on twitter        
	// including the url will automatically use Twitter Cards, because I put meta tags in index.html
	// Need to make an image for the Twitter Card & put in the meta tag

	// Just want to settle on a name for this game before I validate the page url

	// Maybe tweet @ZBlipGames 
	// pop up after game over: tweet us your score!
	// Maybe only IF you get a good score - means more engaged player

	var tweetbegin = 'http://twitter.com/home?status=';        
	
	var tweettxt = 'I got '+ score +' in this game: www.zblip.com/fireplusbomb @ZBlipGames';    
	//var tweettxt = 'www.zblip.com/fireplusbomb';
	var finaltweet = tweetbegin +encodeURIComponent(tweettxt);        
	window.open(finaltweet,'_blank');    
}

function sharegoog() {
	window.open('plus.google.com/share?url=www.zblip.com/mineofsight');
}



MenuPositions = Class.extend({

	menu_item_pos_x: [],
	menu_item_pos_y: [],
	menu_item_num: [],
	menu_item_type: [],

	menu_item_width: 148,
	menu_item_height: 32,

	menu_width: 0,
	menu_height: 0,

	menu_item_scale: 1,

	social_y: 0,	// where the social buttons sta

	init: function() {

		if (using_cocoon_js == true) this.menu_item_height = 42;
	},

	add_item: function (item_num, menu_type) {
		this.menu_item_pos_x.push(0);
		this.menu_item_pos_y.push(0);
		this.menu_item_num.push(item_num);
		this.menu_item_type.push(menu_type);
		
		this.recalc();
	},

	recalc : function() {
		for(var i = 0; i < this.menu_item_pos_x.length; i++) {

			if (this.menu_item_type[i] == 2) continue;

			

			this.menu_item_pos_x[i] = 12;
			this.menu_item_pos_y[i] = (i+0.5)*this.menu_item_height;

			
		}

		this.menu_height = this.menu_item_pos_y.length*this.menu_item_height;
	},

	

	check_for_click: function(x,y) {


		var w_ = this.menu_item_width;
		var h_ = this.menu_item_height;	

		for(var i = 0; i < this.menu_item_pos_x.length; i++) {

			if (this.menu_item_type[i] == 2) {
				w_ = 24;
				h_ = 24;
			} else if (this.menu_item_type[i] == 1) {
				w_ = this.menu_item_width;
				h_ = this.menu_item_height;
			}

			if (y > this.menu_item_pos_y[i] - 0.5*h_ &&
			    y < this.menu_item_pos_y[i] + 0.75*h_) {
				return this.menu_item_num[i];
			}
		}

		return -1;
	}
});

g_menu_font_height = 24;


//alert('new game_engine.js - will shift options_menu_group.x, ignore menu_ratio ');

function g_set_game_screen_x(newx) {
	game_screen_group.set_x(newx*menu_ratio);
	game_menu_group.set_x(newx*menu_ratio);
	
};

function g_set_menu_screen_x(newx) {
	//return;
	options_menu_group.set_x(newx*menu_ratio);// = newx*menu_ratio;
};


function g_set_menu_screen_y(newy) {
	
	options_menu_group.set_y(newy);// = newy;
};

function draw_rect_perm_bg (x,y,xx,yy,colour,layer) {
	
}

function draw_rect_perm (x,y,xx,yy,colour,layer) {

	// http://www.html5gamedevs.com/topic/20487-adding-geometry-to-groups/

	var recto = new Phaser.Rectangle(x, y, xx, yy);

	var t = game.add.text(game.world.centerX, 100, '', {
        font: '64px Arial',
        fill: '#ff0000'
    	});
	 t.hitArea = recto;

	recto.graphic.beginFill(colour);
	
	if (layer == Types.Layer.GAME) game_group.add(t);
	else if(layer == Types.Layer.POP_MENU) options_menu_group.add(t);
	else if(layer == Types.Layer.GAME_MENU) game_menu_group.add(t);
	else if(layer == Types.Layer.HUD) menu_group.add(t);
	else if(layer == Types.Layer.TILE) tile_group.add(t);
	else if(layer == Types.Layer.BACKGROUND) background_group.add(t);

	return recto;
	


};

BlipFrogMenuClass = Class.extend({

	game_engine: null,

	menu_up: false,	// show menu or game (or ad?)
	menu_icon_x: 0,
	menu_icon_y: 0,
	menu_icon_size: 29,

	graphics_menu_body: null,
	//menu_highlight_sprite: null,
	spr_menu_button: null,

	engine_fb: null,
	engine_fb_rect: null,

	sprites_buttons: [],

	menu_texts: [],

	line_above_social: null,

	menu_positions: null,

	menu_x: 0,
	game_x:	0,
	menu_x_target: 0,
	game_x_target: 0,
	moving: 0,

	menu_y: 0,	// scroll up + down
	

	setup: false,
	
	fb_x: 0,
	fb_y: 0,

	init: function() {
		
		

		this.menu_positions = new MenuPositions();
	},

	setup: function() {

		update_webfonts();

		this.game_engine = new GameEngineClass();

		if (using_cocoon_js == true) g_cache_as_bitmap = true;

		this.game_engine.push_state(new BootStateClass());

		

		// Draw the menu. Once. Here.
		// options_menu_container is the PIXI.js container

		this.graphics_menu_body = new SpriteClass();
		this.graphics_menu_body.setup_sprite('menubody.png',Types.Layer.POP_MENU, 0, 0);
		//draw_rect_perm(0,0,1,1,0x333333,Types.Layer.POP_MENU, 0, 0);
		this.graphics_menu_body.set_anchor(0,0);
		this.graphics_menu_body.update_pos(0,0);
		// this.graphics_menu_body.scale(2*this.menu_width/50, 4*screen_height/50);

		if (using_phaser == true) {

			var graphics_obj = game.add.graphics(0,0);
			options_menu_group.add(graphics_obj);



			graphics_obj.beginFill(0xFFD08E);
			graphics_obj.lineStyle(0, 0xffd900, 0);
			graphics_obj.moveTo(0,0);
    			graphics_obj.lineTo(this.menu_width, 0);
    			graphics_obj.lineTo(this.menu_width,  4*screen_height);
    			graphics_obj.lineTo(0, 4*screen_height);
			graphics_obj.lineTo(0, 0);
			graphics_obj.endFill();

		} else {
			var graphics = new PIXI.Graphics();
			graphics.beginFill(0x546D6F);
			graphics.drawRect(0, 0,this.menu_width, 4*screen_height);
			options_menu_group.add(graphics);


			var graphicstop = new PIXI.Graphics();
			graphicstop.beginFill(0x112829);
			graphicstop.drawRect(0, -1,this.menu_width,  this.menu_positions.menu_item_height);
			options_menu_group.add(graphicstop);

		}
		

		this.spr_menu_button = new SpriteClass();
		
		this.spr_menu_button.setup_sprite('menu_button.png', Types.Layer.GAME_MENU);//Types.Layer.POP_MENU); //


		
		

		this.engine_fb_rect = new SquareClass(0,0,29*4,29*4,Types.Layer.POP_MENU,0x000000,true);

		this.engine_fb = new SpriteClass();
		this.engine_fb.setup_sprite('fblogo.png',Types.Layer.POP_MENU);

		
		
		//this.line_above_social = new PIXI.Graphics();
		
		//options_menu_container.addChild(this.line_above_social);
		
		


		for (var i = 0; i < MenuItems.length; i++) {

		/*	var graphics_line = game.add.graphics(0,0);
			options_menu_group.add(graphics_line);
			graphics_line.lineStyle(2, 0x112829, 1);
			var y_pos = (i+1.33)*this.menu_positions.menu_item_height;
			graphics_line.moveTo(0,y_pos);
    			graphics_line.lineTo(this.menu_width, y_pos);
		*/
			var box_h = this.menu_positions.menu_item_height;

			if (using_phaser == true && MenuItems[i][0] == 0) {
				var graphics_obj = game.add.graphics(0,0);
				options_menu_group.add(graphics_obj);

				var y_pos = (i+0.33)*this.menu_positions.menu_item_height;

				//if (i == 0) y_pos -= ;

				
				graphics_obj.beginFill(0xE28E1C);
				graphics_obj.lineStyle(0, 0xE28E1C, 0);
				if (i != 0) {
					graphics_obj.moveTo(0,y_pos);
    					graphics_obj.lineTo(this.menu_width, y_pos);
				} else {
					graphics_obj.moveTo(0,-1);
    					graphics_obj.lineTo(this.menu_width, -1);

				}
    				graphics_obj.lineTo(this.menu_width, y_pos + box_h);
    				graphics_obj.lineTo(0, y_pos + box_h);
				graphics_obj.lineTo(0, y_pos);
				graphics_obj.endFill();

			}  else if (using_pixi == true && MenuItems[i][0] == 0) {
				
				var graphics = new PIXI.Graphics();
				graphics.beginFill(0x112829);
				var y_pos = (i+0.33)*this.menu_positions.menu_item_height;
				
				graphics.drawRect(0, y_pos,this.menu_width,  box_h);
				
				options_menu_group.add(graphics);
				
			}



			

			if (MenuItems[i][0] != 1 && MenuItems[i][0] != 0 && MenuItems[i][0] != 3) continue;	
			// Only the first type of menu items

			// add button
			this.menu_positions.add_item(i, MenuItems[i][0]);	// type 1, big icons in a row

			this.sprites_buttons.push(new ButtonClass());
			this.sprites_buttons[i].setup_sprite(MenuItems[i][3],Types.Layer.POP_MENU);
			//this.sprites_buttons[i].set_scale(1);

			this.menu_texts.push(new TextClass(Types.Layer.POP_MENU));
			this.menu_texts[i].set_font(Types.Fonts.MED_SMALL);

			if (MenuItems[i][0] == 0) {
				


				

				this.menu_texts[i].set_text(MenuItems[i][1]);		// heading
				//this.menu_texts[i].set_colour("#112829");
				this.menu_texts[i].set_colour("#000000");		// bl

			} else {
				this.menu_texts[i].set_text(MenuItems[i][2]);

				this.menu_texts[i].set_colour("#000000");
			}
		}

		for (var i = 0; i < MenuItems.length; i++) {

			if (MenuItems[i][0] != 2) continue;	// Only the SECOND type of menu items

			this.menu_positions.add_item(i, 2);

			this.sprites_buttons.push(new SpriteClass());
			this.sprites_buttons[i].setup_sprite(MenuItems[i][3],Types.Layer.POP_MENU);
			//this.sprites_buttons[i].set_scale(1);

			// Text wont actually be used - dummy
			this.menu_texts.push(new TextClass(Types.Layer.POP_MENU));
			this.menu_texts[i].set_font(Types.Fonts.SMALL);
			this.menu_texts[i].set_text("");	//MenuItems[i][2]
		}

		this.setup = true;


		this.on_screen_resize();


		this.pop_down();

		// instantly set the containers in place
		this.game_x = this.game_x_target;
		this.menu_x = this.menu_x_target;
		g_set_game_screen_x(this.game_x_target);
		g_set_menu_screen_x(this.menu_x_target);

	},

	pop_up: function() {

		this.show_all_menu_text();

		this.menu_up = true;

		this.menu_x = -this.menu_width;//screen_height;
		this.game_x = 0;

		this.menu_x_target = 0;
		this.game_x_target = this.menu_width;
		this.moving = 12;

		update_webfonts();
	},

	hurry_menu: function () {
		// instantly set the containers in place
		this.game_x = this.game_x_target;
		this.menu_x = this.menu_x_target;
		g_set_game_screen_x(this.game_x_target);
		g_set_menu_screen_x(this.menu_x_target);
	},

	hide_all_menu_text: function() {
		for (var i = 0; i < this.sprites_buttons.length; i++) {
			this.menu_texts[i].update_pos(-999,-999);

		}
	},

	show_all_menu_text: function() {
		for (var i = 0; i < this.sprites_buttons.length; i++) {


			

			var x = this.menu_positions.menu_item_pos_x[i];
			var y = this.menu_positions.menu_item_pos_y[i];
			this.sprites_buttons[i].hide();

			if( MenuItems[i][0] != 0) var spr_x = MenuItems[i][2].length*14*0.5 - 7;

			if( MenuItems[i][0] == 0) this.menu_texts[i].update_pos(16,y,999,999);
			else this.menu_texts[i].update_pos(32,y,999,999);
			//this.menu_texts[i].center_x(x);

			if (MenuItems[i][0] == 0) {

				this.menu_texts[i].set_colour("#ffffff");		// white

			} else {

				this.menu_texts[i].set_colour("#000000");
			}

		}
	},

	menu_width: 250,

	pop_down: function() {

		//this.hide_all_menu_text();

		this.menu_up = false;

		this.menu_x = 0;//screen_height - this.menu_positions.menu_height;
		this.game_x = this.menu_width;//-this.menu_positions.menu_height*1;

		this.game_x_target = 0;
		this.menu_x_target = -this.menu_width;
		this.moving = 12;

		this.menu_y = 0;
		g_set_menu_screen_y(this.menu_y);
	},

	on_screen_resize: function() {

		

		this.pop_down();
		// instantly set the containers in place
		this.game_x = this.game_x_target;
		this.menu_x = this.menu_x_target;
		g_set_game_screen_x(this.game_x_target);
		g_set_menu_screen_x(this.menu_x_target);

		

		if (this.setup == false ||
		    this.graphics_menu_body == null) return;

		
		this.menu_icon_x = 0 + this.menu_icon_size; // + this.menu_width + this.menu_icon_size;
		this.menu_icon_y = screen_height - this.menu_icon_size;//-this.menu_icon_size;

		this.menu_positions.recalc();

		

		//this.graphics_menu_body.width = 9*this.menu_positions.menu_width;
		//this.graphics_menu_body.height = 9*this.menu_positions.menu_height;

		//this.graphics_menu_body.update_pos(this.menu_icon_size,this.menu_icon_y);
		// for some reason it needs to be 2*this.menu_width/50 ... should be 1*
		this.graphics_menu_body.scale(2*this.menu_width/50, 4*screen_height/50);

		if (this.menu_up == true) {
			this.pop_up();
			// instantly set the containers in place
			this.game_x = this.game_x_target;
			this.menu_x = this.menu_x_target;
			g_set_game_screen_x(this.game_x_target);
			g_set_menu_screen_x(this.menu_x_target);
		}

		this.spr_menu_button.update_pos(this.menu_icon_x,this.menu_icon_y);
		
		
		this.game_engine.on_screen_resize();

		if (this.menu_up == true) g_set_menu_screen_x(0);//screen_height - g_menu_font_height*MenuItems.length);
		else g_set_menu_screen_x(-this.menu_width);//screen_height);

		if (screen_width > screen_height) {
			this.fb_x = screen_width - 29 - 0.5*29;
			this.fb_y = screen_height - 29 - 0.5*29;
		} else {
			this.fb_x = -999;
			this.fb_y = -999;
		} 
		this.engine_fb.update_pos(this.fb_x + this.menu_width, this.fb_y);
		this.engine_fb_rect.update_pos(this.fb_x - 29 - 0.5*29 + this.menu_width, this.fb_y - 29 - 0.5*29);

		return;

		// 
		this.line_above_social.clear();
		this.line_above_social.lineStyle(2, 0xaaaaaa);
		this.line_above_social.moveTo(24, this.menu_positions.social_y);
		this.line_above_social.lineTo(screen_width - 24, this.menu_positions.social_y);
		this.line_above_social.endFill();
	},

	pop_down_click: false,

	clicked_fb: false,

	handle_events: function(x, y, event_type) {

		

		// x and y were divided by the 'ratio' on the mouse/touch event
		// here we are restoring the true on-screen x and y values

		if (event_type == Types.Events.MOUSE_UP && 
		    this.pop_down_click == true) {
			this.pop_down_click = false;
			return;
		} 

		if (event_type == Types.Events.MOUSE_DOWN &&
			this.pop_down_click == true) return;
		

		if (this.menu_up == false) {

			// fb?
			if (event_type == Types.Events.MOUSE_UP &&
			    mouse.x > this.fb_x - 29*0.5 &&
			    mouse.y > this.fb_y - 29*0.5 && this.clicked_fb == false) {
				this.clicked_fb = true;
				open_url('https://www.facebook.com/mathsweeper/');
				return;
			}
			

			if (event_type == Types.Events.MOUSE_UP &&
			    mouse.x < 2*this.menu_icon_size &&
			    mouse.y > this.menu_icon_y - this.menu_icon_size) {
				this.pop_up();
			} else {

				
				this.game_engine.handle_events(x, y, event_type);

			}

		} else this.handle_menu_event(x, y, event_type);
	},

	mouse_down: 0,
	mouse_down_y: 0,
	menu_scroll: 0,

	handle_menu_event: function(x,y,event_type) {

		
		y = mouse.y;//*menu_ratio;//y*ratio;
		x = mouse.x;///menu_ratio;//x*ratio;		

		if (event_type == Types.Events.MOUSE_DOWN && 
			x > this.menu_width) {
		   
			this.pop_down();
			this.pop_down_click = true;
			this.mouse_down = 0;
			return;
		} else if (event_type == Types.Events.MOUSE_DOWN && x < this.menu_width && this.mouse_down < 2) {
			
				
	
			this.mouse_down++;
			this.mouse_down_y = y*menu_ratio;

			//return;

			//console.log(' DOWN    y = ' + y);

			//this.menu_scroll = 1;

			//if (y < 32) this.menu_y += 4;
			//else if (y > screen_height - 32) this.menu_y -= 4;
			//else this.menu_scroll = 0;

			

			

				
			//g_set_menu_screen_y(this.menu_y);

			//var need = screen_height - 32;

			//alert('y is ' + y + ' ' + ' but needs to be > ' + need);

			return;

		} else if (event_type == Types.Events.MOUSE_DOWN && x < this.menu_width && this.mouse_down >= 2 && 
				this.mouse_down_y != y*menu_ratio) {

			
			
			
				
			console.log(' SCROLL    y == ' + y );
				
			this.menu_y += y*menu_ratio - this.mouse_down_y;

			this.menu_y = Math.max(this.menu_y, (-this.menu_positions.menu_height - 32 + screen_height)*menu_ratio - 200);
			this.menu_y = Math.min(0, this.menu_y);

			this.mouse_down_y = y*menu_ratio;
			this.menu_scroll = 1;
			g_set_menu_screen_y(this.menu_y);

			
				

				
				//this.menu_y = Math.max(this.menu_y, this.menu_positions.menu_height);

				

			
			

		} 
		
		if (event_type != Types.Events.MOUSE_UP) return;
		//alert('MOUSEUP');
		

		this.mouse_down = 0;
		

		if (this.menu_scroll == 1) {
			this.menu_scroll = 0;
			return;	// we wereonly scrolling
		}

		this.menu_scroll = 0;

		console.log('this.menu_y ' + this.menu_y);

		var menu_i = this.menu_positions.check_for_click(x,y - this.menu_y/menu_ratio);

		//alert('menu_i ' + menu_i);

		if (menu_i < 0 || menu_i >= MenuItems.length || menu_i == undefined) {
			return;

		}

		if (MenuItems[menu_i][0] == 0) return;	// subheading
		
		if (MenuItems[menu_i][1] == Types.Events.NEW_GAME) {
			// lower_state?
			//this.menu_selected = Types.Events.NEW_GAME;
			this.game_engine.handle_events(0, 0, Types.Events.NEW_GAME);

			this.pop_down();
			
		} else if (MenuItems[menu_i][1] == Types.Events.GOTO_NEG_MODE) {

			this.game_engine.handle_events(0, 0, Types.Events.GOTO_NEG_MODE);

			this.pop_down();
			
		} else if (MenuItems[menu_i][1] == Types.Events.TUTORIAL) {

			this.game_engine.handle_events(0, 0, Types.Events.TUTORIAL);

			this.pop_down();
			
		} else if (MenuItems[menu_i][1] == Types.Events.GOTO_LEVELS) {

			this.game_engine.handle_events(0, 0, Types.Events.GOTO_LEVELS);

			this.pop_down();
			
		} else if (MenuItems[menu_i][1] == Types.Events.GOTO_CREDITS) {

			this.game_engine.handle_events(0, 0, Types.Events.GOTO_CREDITS);

			this.pop_down();
			
		} else if (MenuItems[menu_i][1] == Types.Events.GOTO_AUTOGEN) {

			this.game_engine.handle_events(0, 0, Types.Events.GOTO_AUTOGEN);

			this.pop_down();
			
		} else if (MenuItems[menu_i][1] == Types.Events.GOTO_EDITOR) {

			this.game_engine.handle_events(0, 0, Types.Events.GOTO_EDITOR);

			this.pop_down();
			
		} else if (MenuItems[menu_i][1] == Types.Events.GOTO_COMMUNITY_LEVELS) {

			this.game_engine.handle_events(0, 0, Types.Events.GOTO_COMMUNITY_LEVELS);

			this.pop_down();
			
		} else if (MenuItems[menu_i][1] == Types.Events.GAME_OVER) {

			this.game_engine.handle_events(0, 0, Types.Events.GAME_OVER);

			this.pop_down();
			
		} else if (MenuItems[menu_i][1] == Types.Events.WEB_LINK &&
				x > 64) {
			// MenuItems[menu_i][4]	// url
			//window.open("http://www.w3schools.com");
			//window.open();

			open_url(MenuItems[menu_i][4]);

			//var newWin = window.open();
			//newWin.location = MenuItems[menu_i][4];
			
		} else if (MenuItems[menu_i][1] == Types.Events.TWEET_SCORE) {
			tweetscore(99);
		} else if (MenuItems[menu_i][1] == Types.Events.SOUND_ONOFF) {
			//gSM.togglemute();
			if (g_sound_on) {
				g_sound_on = false;
				this.menu_texts[menu_i].change_text(g_texts[language]["Sound"] + g_texts[language]["OFF"]);
			} else {
				g_sound_on = true;
				this.menu_texts[menu_i].change_text(g_texts[language]["Sound"] + g_texts[language]["ON"]);
			}

			

		} else if (MenuItems[menu_i][1] == Types.Events.MUSIC_ONOFF) {
			gSM.toggle_music();
			
		} else if (MenuItems[menu_i][1] == Types.Events.BOOKMARK) {
			if (addtohomescreen_js_loaded == false) return;
			addtohome = addToHomescreen({
  				 autostart: false
			});
			addtohome.show(true);
			//addToHomescreen();
		} else if (MenuItems[menu_i][1] == Types.Events.CLICK_TO_DIG) {
			g_click_to_dig = false;
			
			// mark first

			for (var m = 0; m < MenuItems.length; m++) {
				if (MenuItems[m][0] == 3) this.menu_texts[m].set_colour("#000000");	
			}

			this.menu_texts[menu_i].set_colour("#ffffff");	

			this.game_engine.on_screen_resize();

			//this.pop_down();
		} else if (MenuItems[menu_i][1] == Types.Events.HOLD_TO_FLAG) {
			g_hold_to_flag = true;
			g_click_to_dig = true;

			for (var m = 0; m < MenuItems.length; m++) {
				if (MenuItems[m][0] == 3) this.menu_texts[m].set_colour("#000000");	
			}
			this.menu_texts[menu_i].set_colour("#ffffff");			

			this.game_engine.on_screen_resize();

			//this.pop_down();
		} else if (MenuItems[menu_i][1] == Types.Events.RIGHT_TO_FLAG) {
			g_hold_to_flag = false;
			g_click_to_dig = true;

			this.game_engine.on_screen_resize();

			for (var m = 0; m < MenuItems.length; m++) {
				if (MenuItems[m][0] == 3) this.menu_texts[m].set_colour("#000000");	
			}

			this.menu_texts[menu_i].set_colour("#ffffff");	

			//this.pop_down();
		}

		


	},

	update: function () {
		if (this.menu_up == false) {
			this.game_engine.update();
		}

		
	},

	draw: function() {
		this.game_engine.draw();

		if(this.moving > 0) {


			this.moving--;

			var menu_dist = this.menu_x_target - this.menu_x;
			var game_dist = this.game_x_target - this.game_x;

			
			this.menu_x += 0.33*menu_dist;
			this.game_x += 0.33*game_dist;
			

			g_set_game_screen_x(this.game_x);
			g_set_menu_screen_x(this.menu_x);

			if (this.moving == 0) {
				
				g_set_game_screen_x(this.game_x_target);
				g_set_menu_screen_x(this.menu_x_target);

				if (this.menu_up == false) this.hide_all_menu_text();
			}
		}
	}

});




GameEngineClass = Class.extend({

	state_stack: null,

	//factory: {},
	//entities: [],	// moved to play state

	//-----------------------------

	init: function() {
		this.state_stack = new Array();

		
	},

	setup: function () {

		update_webfonts();

		// Call our input setup method to bind
		// our keys to actions and set the
		// event listeners.
		gInputEngine.setup();

		// Notice that we don't setup the factory
		// here! We set it up in each individual
		// Entity's defining file.
		// e.g: At the bottom of LandmineClass.js
		// gGameEngine.factory['Landmine'] = LandmineClass;
	},

	change_state: function(new_state) {
		this.pop_state();
		this.push_state(new_state);
	},

	push_state: function(new_state) {
		//console.log("Pushed new state");
		this.state_stack.push(new_state);
	},

	pop_state: function() {
		
		var s = this.state_stack.pop();
		s.cleanup();
		// Garbage collector will handle this state?
	},

	get_state:function() {
		return this.state_stack[this.state_stack.length - 1];
	},

	on_screen_resize: function() {
		if(this.state_stack.length == 0) return;
		this.state_stack[this.state_stack.length - 1].screen_resized();
		
	},

	handle_events: function(x, y, event_type) {

		if (event_type == Types.Events.NEW_GAME) {
			g_allow_negatives = false;
			while(this.state_stack.length > 2) {
				var state_ = this.state_stack.pop();
				state_.cleanup();
			}
			//this.change_state(new RestartGameStateClass(this, this.state_stack[1]));
			//this.push_state(new RestartGameStateClass(this, this.state_stack[1]));
			this.push_state(new GenerateRandStateClass(this, this.state_stack[1]));
		} else if (event_type == Types.Events.GOTO_NEG_MODE) {
			g_allow_negatives = true;
			while(this.state_stack.length > 2) {
				var state_ = this.state_stack.pop();
				state_.cleanup();
			}
			//this.change_state(new RestartGameStateClass(this, this.state_stack[1]));
			//this.push_state(new RestartGameStateClass(this, this.state_stack[1]));
			this.push_state(new GenerateRandStateClass(this, this.state_stack[1]));
		} else if (event_type == Types.Events.TUTORIAL) {

			while(this.state_stack.length > 2) {
				var state_ = this.state_stack.pop();
				state_.cleanup();
			}
			this.push_state(new TutStateClass(this, this.state_stack[1]));

		} else if (event_type == Types.Events.GOTO_LEVELS) {

			while(this.state_stack.length > 2) {
				var state_ = this.state_stack.pop();
				state_.cleanup();
			}
			//this.push_state(new OverworldStateClass(this, this.state_stack[1]));
			// need to set game mode == 0
			this.state_stack[1].game_mode = 0;
			this.state_stack[1].current_level = 0;
			this.state_stack[1].reset();
			//this.push_state(new StartGameStateClass(this, this.state_stack[1]));
			this.push_state(new LoadingLevelStateClass(this, this.state_stack[1], 0));

		} else if (event_type == Types.Events.GOTO_CREDITS) {

			while(this.state_stack.length > 2) {
				var state_ = this.state_stack.pop();
				state_.cleanup();
			}
			this.push_state(new CreditsStateClass(this, this.state_stack[1]));

		} else if (event_type == Types.Events.GOTO_AUTOGEN) {

			while(this.state_stack.length > 2) {
				var state_ = this.state_stack.pop();
				state_.cleanup();
			}
			this.push_state(new SetupRandStateClass(this, this.state_stack[1]));

		} else if (event_type == Types.Events.GOTO_EDITOR) {

			while(this.state_stack.length > 2) {
				var state_ = this.state_stack.pop();
				state_.cleanup();
			}
			this.push_state(new LevelEditorStateClass(this, this.state_stack[1]));

		} else if (event_type == Types.Events.GOTO_COMMUNITY_LEVELS) {

			while(this.state_stack.length > 2) {
				var state_ = this.state_stack.pop();
				state_.cleanup();
			}

			// For now, just load and jump in to the levels:			

			// will check if there are zero unsolved levels fetched, fetch more if needed
			// otherwise just show what is already downloaded
			// no need to reconnect each time I click 'community levels'
			
			if (g_community_list_data.length > 0) { 
				this.push_state(new CommunityOverworldStateClass(this, this.state_stack[1]));
			} else {
				this.push_state(new CommunityFetchStateClass(this, this.state_stack[1]));
			}

		} else if (event_type == Types.Events.GAME_OVER) {

			while(this.state_stack.length > 2) {
				var state_ = this.state_stack.pop();
				state_.cleanup();
			}
			this.push_state(new GameOverStateClass(this, this.state_stack[1]));

		} 
		
		
		// Call handle_eventson the topmost element of the state stack
		//console.log("Event received by game engine");
		this.state_stack[this.state_stack.length - 1].handle_events(this, x, y, event_type);

	
		
	},

	update: function () {
		// Call update on the topmost element of the state stack
		this.state_stack[this.state_stack.length - 1].update(this);	
	},

	reset:function() {

		this.state_stack = new Array();

		menu_state = new MainMenuStateClass();

		gGameEngine.push_state(menu_state);
	},

	draw: function() {
		// Call draw on the topmost element of the state stack
		this.state_stack[this.state_stack.length - 1].draw(this);	

		
	}	

});


gBlipFrogMenu = new BlipFrogMenuClass();
gGameEngine = new GameEngineClass();




pBar.value += 10;