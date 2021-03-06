﻿Types = {


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
		},
	
	
};

var language = window.navigator.userLanguage || window.navigator.language || 'en';
if (language.length > 2) language = language[0]+language[1];	// first 2 letters 
//language = 'zh';
//alert(language); //works IE/SAFARI/CHROME/FF https://msdn.microsoft.com/en-us/library/ms533052(v=vs.85).aspx
if (language != 'en' && language != 'zh') language = 'en';



g_texts = {

	"en" : {
		"Title"	   : "MINE OF SIGHT",
		"New Game" : "MENU",
		"Tutorial" : "TUTORIAL",
		"Sound"	   : "Sound",
		"Music"	   : "Music",

		"tut1"	   : "Drop new peices onto the grid",
		"tut2"	   : "Match fires next to bombs",
		"tut3"	   : "Or on top",
		"tut4"	   : "Some blocks have extra armor",
		"tut5"	   : "Blocks extinguish fires",
		"tut6"	   : "Blocks also squish bombs",
		"tut7"     : "Fires can be stacked",
		"tut8"	   : "Let's make a combo",
		"tut9"	   : "And clear the screen!",
	},

	zh : {
		"Title"	   : "火加弹",
		"New Game" : "新游戏",
		"Tutorial" : "教程",
		"Sound"	   : "声音",
		"Music"	   : "音乐",
	}

};

g_click_to_dig = true;
g_hold_to_flag = true;

MenuItems = [

	// 0 - subheading,	1 - menu item		2 - 2nd menu item (small, social, icon only)
	
	//[1, Types.Events.NEW_GAME, g_texts[language]["New Game"],"new_icon.png",],

	//[0, "Game"],
	[1, Types.Events.NEW_GAME, g_texts[language]["New Game"],"home_icon.png",],

	[1, Types.Events.CLICK_TO_DIG, "MARK FIRST","redflag.png",],

	[1, Types.Events.HOLD_TO_FLAG, "HOLD TO\nFLAG","redflag.png",],

	[1, Types.Events.RIGHT_TO_FLAG, "RIGHT TO\nFLAG","redflag.png",],

	//[1, Types.Events.TUTORIAL, g_texts[language]["Tutorial"],"tut_icon.png",],

	//[1, Types.Events.GAME_OVER, "GAME OVER","games_icon.png"],

	// 
	//[1, Types.Events.SOUND_ONOFF, g_texts[language]["Sound"],"sound_on_icon.png","sound_off_icon.png"],
	//[1, Types.Events.MUSIC_ONOFF, g_texts[language]["Music"],"music_on_icon.png","sound_off_icon.png"],

	// Only include the bookmark if we are on zblip.com
	//[1, Types.Events.BOOKMARK, "Bookmark","games_icon.png"],	// on iphone

	//[0, "Social"],[0, "Social"],[0, "Social"],[0, "Social"],[0, "Social"],[0, "Social"],
	

	
	
	//[1, Types.Events.WEB_LINK, "Our Games","games_icon.png","http://www.zblip.com"],

	

	//[1, Types.Events.TWEET_SCORE, "Tweet", "button_empty.png"],

	//[1, Types.Events.WEB_LINK, "Legal","ic_list_white_24dp_2x.png","http://www.zblip.com/legal"],

	//[1, Types.Events.WEB_LINK, "Credits","ic_list_white_24dp_2x.png","http://www.zblip.com/fireplusbomb/credits"],

	//[1, Types.Events.WEB_LINK, "THEMES","button_empty.png","http://www.twitter.com"],

	//[1, Types.Events.WEB_LINK, "SETTINGS","button_empty.png","http://www.twitter.com"],

	//[1, Types.Events.WEB_LINK, "IOS","button_empty.png","http://www.twitter.com"],

	//[1, Types.Events.WEB_LINK, "ANDROID","button_empty.png","http://www.twitter.com"],

	//[1, Types.Events.WEB_LINK, "APP","button_empty.png","http://www.twitter.com"],
	// either outgoing web links or trigger something inside

	// new game
	// restart
	// tutorial

	// get apps (ios, android, chrome)
	// share on fb

	// settings, sound, music
	
	// more games
	// feedback
	// TOS, privacy, legal
	// credits
	
	// social - fb, twitter, tumbler, g+

	
	

];

if(location.hostname != "www.facebook.com"){
	// gotta check for mobile as well
	MenuItems.push([1, Types.Events.WEB_LINK, "Our Games","games_icon.png","http://www.zblip.com"]);
}

if(true || location.hostname == "www.zblip.com") {
	MenuItems.push([1, Types.Events.WEB_LINK, "Legal","ic_list_white_24dp_2x.png","http://www.zblip.com/legal"]);
}
MenuItems.push([1, Types.Events.WEB_LINK, "Credits","ic_list_white_24dp_2x.png","http://www.zblip.com/mineofsight/credits"]);

if(location.hostname == "www.zblip.com"){
	// gotta check for mobile as well
	//MenuItems.push([1, Types.Events.BOOKMARK, "Homescreen","games_icon.png"]);
}

//social buttons:
//MenuItems.push([2, Types.Events.WEB_LINK, "Facebook","facebook-24x24.png","https://www.facebook.com/Mine-of-Sight-1037635096381976/"]);
MenuItems.push([2, Types.Events.WEB_LINK, "@ZBlipGames","twitter-24x24.png","https://twitter.com/ZBlipGames"]);
MenuItems.push([2, Types.Events.WEB_LINK, "Tumblr","tumblr-24x24.png","https://zblip.tumblr.com/"]);



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
	window.open('plus.google.com/share?url=www.zblip.com/fireplusbomb');
}

MenuPositions = Class.extend({

	menu_item_pos_x: [],
	menu_item_pos_y: [],
	menu_item_num: [],
	menu_item_type: [],

	menu_item_width: 148,
	menu_item_height: 96,

	menu_width: 0,
	menu_height: 0,

	menu_item_scale: 1,

	social_y: 0,	// where the social buttons start

	init: function() {},

	add_item: function (item_num, menu_type) {
		this.menu_item_pos_x.push(0);
		this.menu_item_pos_y.push(0);
		this.menu_item_num.push(item_num);
		this.menu_item_type.push(menu_type);
		
		this.recalc();
	},

	recalc: function () {

		this.menu_item_height = 124;
		this.menu_item_width = 96;	// we will try for this size

		this.menu_width = screen_width;///options_menu_group.scale.x;

		var icons_per_row = Math.round(this.menu_width/this.menu_item_width) - 1;
		icons_per_row = Math.max(1,icons_per_row);

		

		this.menu_height = this.menu_item_height*Math.ceil(this.menu_item_num.length/icons_per_row);//*options_menu_group.scale.x;

		this.menu_height += 84;	// for row of social icons

		if (false && this.menu_height > screen_height*1.1) {	// this.menu_item_height*2
			// out of space!
			
			options_menu_group.scale.x = options_menu_group.scale.y = 0.8*options_menu_group.scale.x;	// 0.5

			

			this.menu_width = 2*this.menu_width;
			icons_per_row = 2*icons_per_row;
			

			//this.menu_height = screen_height*0.8;

			this.menu_height = this.menu_item_height*Math.ceil(this.menu_item_num.length/icons_per_row)*options_menu_group.scale.x;

			this.menu_height += 84*options_menu_group.scale.x;	// for row of social icons
			
			var area = this.menu_height*this.menu_width;

			var icon_area = area / (this.menu_item_pos_x.length + 1);	// +1 just to prevent div by zero

			

			


		} else {
			this.menu_item_scale = 1;
		}

		

		var x = 0;
		var y = 0;

		for(var i = 0; i < this.menu_item_pos_x.length; i++) {

			if (this.menu_item_type[i] != 1) continue;

			x++;
			if (x > icons_per_row) {
				x = 1;
				y++;
			}

			this.menu_item_pos_x[i] = x*this.menu_item_width - 8;
			this.menu_item_pos_y[i] = y*this.menu_item_height + 0.5*this.menu_item_height;

			
		}

		x = 1;
		y++;

		this.social_y = y*this.menu_item_height + 18;

		for(var i = 0; i < this.menu_item_pos_x.length; i++) {
			// social buttons
			if (this.menu_item_type[i] != 2) continue;
			
			this.menu_item_pos_x[i] = x*this.menu_item_width - 8;//x*42;
			this.menu_item_pos_y[i] = (y)*this.menu_item_height + 42;

			x++;
		}

		if (this.menu_height > this.menu_item_pos_y[this.menu_item_pos_y.length - 1] + 42) {
			this.menu_height = this.menu_item_pos_y[this.menu_item_pos_y.length - 1] + 42;
		}

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

			if (x > this.menu_item_pos_x[i] - 0.5*w_  &&
			    x < this.menu_item_pos_x[i] + 0.5*w_  &&
			    y > this.menu_item_pos_y[i] - 0.5*h_ &&
			    y < this.menu_item_pos_y[i] + 0.5*h_) {
				return this.menu_item_num[i];
			}
		}

		return -1;
	}
});

g_menu_font_height = 24;


function g_set_game_screen_y(newy) {
	play_group.y = newy;
	game_menu_group.y = newy;
};

function g_set_menu_screen_y(newy) {
	options_menu_group.y = newy;
};


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
	spr_menu_button: null,

	sprites_buttons: [],

	menu_texts: [],

	line_above_social: null,

	menu_positions: null,

	menu_y: 0,
	game_y:	0,
	menu_y_target: 0,
	game_y_target: 0,
	moving: 0,

	setup: false,
	
	init: function() {
		

		this.menu_positions = new MenuPositions();
	},

	setup: function() {

		update_webfonts();

		this.game_engine = new GameEngineClass();

		

		this.game_engine.push_state(new BootStateClass());

		

		// Draw the menu. Once. Here.
		// options_menu_container is the PIXI.js container

		console.log('make a pop up rect');
		this.graphics_menu_body = new SpriteClass();
		this.graphics_menu_body.setup_sprite('menubody.png',Types.Layer.POP_MENU, -100, 0);
		//draw_rect_perm(0,0,1,1,0x333333,Types.Layer.POP_MENU, 0, 0);
		this.graphics_menu_body.phasersprite.anchor.setTo(0,0);
		console.log('   done');
		this.spr_menu_button = new SpriteClass();
		
		this.spr_menu_button.setup_sprite('menu_button.png',Types.Layer.POP_MENU);
		
		//this.line_above_social = new PIXI.Graphics();
		
		//options_menu_container.addChild(this.line_above_social);
		
		


		for (var i = 0; i < MenuItems.length; i++) {

			if (MenuItems[i][0] != 1) continue;	// Only the first type of menu items

			// add button
			this.menu_positions.add_item(i, 1);	// type 1, big icons in a row

			this.sprites_buttons.push(new ButtonClass());
			this.sprites_buttons[i].setup_sprite(MenuItems[i][3],Types.Layer.POP_MENU);
			//this.sprites_buttons[i].set_scale(1);

			this.menu_texts.push(new TextClass(Types.Layer.POP_MENU));
			this.menu_texts[i].set_font(Types.Fonts.XSMALL);
			this.menu_texts[i].set_text(MenuItems[i][2]);
		}

		for (var i = 0; i < MenuItems.length; i++) {

			if (MenuItems[i][0] != 2) continue;	// Only the SECOND type of menu items

			this.menu_positions.add_item(i, 2);

			this.sprites_buttons.push(new SpriteClass());
			this.sprites_buttons[i].setup_sprite(MenuItems[i][3],Types.Layer.POP_MENU);
			//this.sprites_buttons[i].set_scale(1);

			// Text wont actually be used - dummy
			this.menu_texts.push(new TextClass(Types.Layer.POP_MENU));
			this.menu_texts[i].set_font(Types.Fonts.XSMALL);
			this.menu_texts[i].set_text("");	//MenuItems[i][2]
		}

		this.setup = true;

		console.log('lets resize');

		this.on_screen_resize();

		console.log('		done');

		this.pop_down();

		// instantly set the containers in place
		this.game_y = this.game_y_target;
		this.menu_y = this.menu_y_target;
		g_set_game_screen_y(this.game_y_target);
		g_set_menu_screen_y(this.menu_y_target);

		console.log('gBlipFrogEngine setup done');
	},

	pop_up: function() {

		console.log('POP UP');
		this.menu_up = true;

		this.menu_y = screen_height;
		this.game_y = 0;

		this.menu_y_target = screen_height - this.menu_positions.menu_height*menu_ratio;
		//*devicePixelRatio;//g_menu_font_height*MenuItems.length;
		this.game_y_target = -this.menu_positions.menu_height;//*options_menu_group.scale.y;
		this.moving = 12;

		update_webfonts();
	},

	pop_down: function() {

		console.log('POP down');
		this.menu_up = false;

		this.menu_y = screen_height - this.menu_positions.menu_height;//*devicePixelRatio;//g_menu_font_height*MenuItems.length;
		this.game_y = -this.menu_positions.menu_height*1;

		this.game_y_target = 0;
		this.menu_y_target = screen_height*options_menu_group.scale.y;
		this.moving = 12;
	},

	on_screen_resize: function() {

		

		this.pop_down();
		// instantly set the containers in place
		this.game_y = this.game_y_target;
		this.menu_y = this.menu_y_target;
		g_set_game_screen_y(this.game_y_target);
		g_set_menu_screen_y(this.menu_y_target);

		

		if (this.setup == false ||
		    this.graphics_menu_body == null) return;

		

		this.menu_icon_y = -this.menu_icon_size;

		this.menu_positions.recalc();

		for (var i = 0; i < this.sprites_buttons.length; i++) {
			var x = this.menu_positions.menu_item_pos_x[i];
			var y = this.menu_positions.menu_item_pos_y[i];
			this.sprites_buttons[i].update_pos(x,y);
			//this.sprites_buttons[i].set_scale(this.menu_positions.scale);

			var spr_x = MenuItems[i][2].length*14*0.5 - 7;
			this.menu_texts[i].update_pos(x,y + 42,999,999);
			this.menu_texts[i].center_x(x);

		}

		//this.graphics_menu_body.width = 9*this.menu_positions.menu_width;
		//this.graphics_menu_body.height = 9*this.menu_positions.menu_height;

		//this.graphics_menu_body.update_pos(this.menu_icon_size,this.menu_icon_y);
		this.graphics_menu_body.scale(9*this.menu_positions.menu_width/50, 9*this.menu_positions.menu_height/50);

		if (this.menu_up == true) {
			this.pop_up();
			// instantly set the containers in place
			this.game_y = this.game_y_target;
			this.menu_y = this.menu_y_target;
			g_set_game_screen_y(this.game_y_target);
			g_set_menu_screen_y(this.menu_y_target);
		}

		this.spr_menu_button.update_pos(this.menu_icon_size,this.menu_icon_y);
		
		//this.spr_menu_button.set_scale(1/ratio);
		
		this.game_engine.on_screen_resize();

		if (this.menu_up == true) g_set_menu_screen_y(screen_height - g_menu_font_height*MenuItems.length);
		else g_set_menu_screen_y(screen_height);

		

		return;

		// 
		this.line_above_social.clear();
		this.line_above_social.lineStyle(2, 0xaaaaaa);
		this.line_above_social.moveTo(24, this.menu_positions.social_y);
		this.line_above_social.lineTo(screen_width - 24, this.menu_positions.social_y);
		this.line_above_social.endFill();
	},

	pop_down_click: false,

	handle_events: function(x, y, event_type) {

		

		// x and y were divided by the 'ratio' on the mouse/touch event
		// here we are restoring the true on-screen x and y values

		if (event_type == Types.Events.MOUSE_UP && 
		    this.pop_down_click == true) {
			this.pop_down_click = false;
			return;
		} 

		

		

		if (this.menu_up == false) {
			
			//x = mouse.x;//(x*ratio);//options_menu_container.scale.y;
			//y = mouse.y;//(y*ratio);//options_menu_container.scale.y;

			if (event_type == Types.Events.MOUSE_UP &&
			    mouse.x/options_menu_group.scale.x < 2*this.menu_icon_size &&
			    mouse.y > screen_height + this.menu_icon_y - this.menu_icon_size*options_menu_group.scale.x) {
				this.pop_up();
			} else {

				
				this.game_engine.handle_events(x, y, event_type);

			}

		} else this.handle_menu_event(x, y, event_type);
	},

	handle_menu_event: function(x,y,event_type) {

		
		//if (event_type == Types.Events.WHEEL) 
		
		y = mouse.y;//y*ratio;
		x = mouse.x;//x*ratio;

		if (event_type == Types.Events.MOUSE_DOWN && 
		    y < screen_height - this.menu_positions.menu_height){//*devicePixelRatio) {
			this.pop_down();
			this.pop_down_click = true;
			return;
		} 
		
		if (event_type != Types.Events.MOUSE_UP) return;


		//y = y/ratio;
		//y = y - screen_height + this.menu_positions.menu_height;
		y = y - (screen_height - this.menu_positions.menu_height)*menu_ratio;//*devicePixelRatio);
			
		//y = y / options_menu_group.scale.x;
		//x = x / options_menu_group.scale.x;

		var menu_i = this.menu_positions.check_for_click(x,y);

		if (menu_i < 0 || menu_i >= MenuItems.length || menu_i == undefined) {
			return;

		}

		if (MenuItems[menu_i][0] == 0) return;	// subheading
		
		if (MenuItems[menu_i][1] == Types.Events.NEW_GAME) {
			// lower_state?
			//this.menu_selected = Types.Events.NEW_GAME;
			this.game_engine.handle_events(0, 0, Types.Events.NEW_GAME);

			this.pop_down();
			
		} else if (MenuItems[menu_i][1] == Types.Events.TUTORIAL) {

			this.game_engine.handle_events(0, 0, Types.Events.TUTORIAL);

			this.pop_down();
			
		} else if (MenuItems[menu_i][1] == Types.Events.GAME_OVER) {

			this.game_engine.handle_events(0, 0, Types.Events.GAME_OVER);

			this.pop_down();
			
		} else if (MenuItems[menu_i][1] == Types.Events.WEB_LINK) {
			// MenuItems[menu_i][4]	// url
			//window.open("http://www.w3schools.com");
			window.open(MenuItems[menu_i][4]);
			//var newWin = window.open();
			//newWin.location = MenuItems[menu_i][4];
			
		} else if (MenuItems[menu_i][1] == Types.Events.TWEET_SCORE) {
			tweetscore(99);
		} else if (MenuItems[menu_i][1] == Types.Events.SOUND_ONOFF) {
			gSM.togglemute();
			
		} else if (MenuItems[menu_i][1] == Types.Events.MUSIC_ONOFF) {
			gSM.toggle_music();
			
		} else if (MenuItems[menu_i][1] == Types.Events.BOOKMARK) {
			if (addtohomescreen_js_loaded == false) return;
			addtohome = addToHomescreen({
  				 autostart: false
			});
			addtohome.show(true);
			//addToHomescreen();
			console.log('ADD TO HOMESCREEN');
		} else if (MenuItems[menu_i][1] == Types.Events.CLICK_TO_DIG) {
			g_click_to_dig = false;
			// mark first

			this.game_engine.on_screen_resize();

			this.pop_down();
		} else if (MenuItems[menu_i][1] == Types.Events.HOLD_TO_FLAG) {
			g_hold_to_flag = true;
			g_click_to_dig = true;			

			this.game_engine.on_screen_resize();

			this.pop_down();
		} else if (MenuItems[menu_i][1] == Types.Events.RIGHT_TO_FLAG) {
			g_hold_to_flag = false;
			g_click_to_dig = true;

			this.game_engine.on_screen_resize();

			this.pop_down();
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

			var menu_dist = this.menu_y_target - this.menu_y;
			var game_dist = this.game_y_target - this.game_y;

			
			this.menu_y += 0.33*menu_dist;
			this.game_y += 0.33*game_dist;
			

			g_set_game_screen_y(this.game_y);
			g_set_menu_screen_y(this.menu_y);

			if (this.moving == 0) {
				
				g_set_game_screen_y(this.game_y_target);
				g_set_menu_screen_y(this.menu_y_target);
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
		console.log('game engine screen resize');
		if(this.state_stack.length == 0) return;
		this.state_stack[this.state_stack.length - 1].screen_resized();
		console.log('game engine screen resize  -- done');
	},

	handle_events: function(x, y, event_type) {

		if (event_type == Types.Events.NEW_GAME) {
			while(this.state_stack.length > 2) {
				var state_ = this.state_stack.pop();
				state_.cleanup();
			}
			//this.change_state(new RestartGameStateClass(this, this.state_stack[1]));
			//this.push_state(new RestartGameStateClass(this, this.state_stack[1]));
			this.push_state(new MenuStateClass(this, this.state_stack[1]));
		} else if (event_type == Types.Events.TUTORIAL) {

			while(this.state_stack.length > 2) {
				var state_ = this.state_stack.pop();
				state_.cleanup();
			}
			this.push_state(new TutStateClass(this, this.state_stack[1]));

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