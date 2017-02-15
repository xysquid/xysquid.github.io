
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
		"Sound"	   : "SOUND",
		"Music"	   : "Music",

		"ON"	   : " ON",
		"OFF"	   : " OFF",

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

g_sound_on = true;

g_click_to_dig = true;
g_hold_to_flag = true;

MenuItems = [

	// 0 - subheading,	1 - menu item		2 - 2nd menu item (small, social, icon only)
	//			3 - control scheme
	
	//[1, Types.Events.NEW_GAME, g_texts[language]["New Game"],"new_icon.png",],

	[0, "MINE OF SIGHT"],

	//[0, "Game"],
	
	[1, Types.Events.NEW_GAME, g_texts[language]["New Game"],"home_icon.png",],
	[1, Types.Events.GOTO_LEVELS, "LEVELS","home_icon.png",],
	[1, Types.Events.GOTO_AUTOGEN, "MINESWEEPER++","home_icon.png",],
	[1, Types.Events.GOTO_EDITOR, "LEVEL EDITOR","home_icon.png",],
	[1, Types.Events.GOTO_COMMUNITY_LEVELS, "COMMUNITY LEVELS","home_icon.png",],
	

	[0, "CONTROLS"],
	//[3,
	[3, Types.Events.HOLD_TO_FLAG, "HOLD TO FLAG","redflag.png",],

	[3, Types.Events.CLICK_TO_DIG, "MARK FIRST","redflag.png",],
	
	[3, Types.Events.RIGHT_TO_FLAG, "RIGHT TO FLAG","redflag.png",],
	//],  // 3

	//[1, Types.Events.TUTORIAL, g_texts[language]["Tutorial"],"tut_icon.png",],

	//[1, Types.Events.GAME_OVER, "GAME OVER","games_icon.png"],

	// 
	[1, Types.Events.SOUND_ONOFF, g_texts[language]["Sound"] + g_texts[language]["ON"],"sound_on_icon.png","sound_off_icon.png"],
	//[1, Types.Events.MUSIC_ONOFF, g_texts[language]["Music"],"music_on_icon.png","sound_off_icon.png"],

	// Only include the bookmark if we are on zblip.com
	//[1, Types.Events.BOOKMARK, "Bookmark","games_icon.png"],	// on iphone

	//[0, "Social"],[0, "Social"],[0, "Social"],[0, "Social"],[0, "Social"],[0, "Social"],
	

	
	
	//[1, Types.Events.WEB_LINK, "www.zblip.com","games_icon.png","http://www.zblip.com"],

	

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

	
	[0, "LINKS"],

];


if(true || location.hostname == "www.zblip.com") {
	MenuItems.push([1, Types.Events.WEB_LINK, "LEGAL","ic_list_white_24dp_2x.png","http://www.zblip.com/legal"]);
}
MenuItems.push([1, Types.Events.WEB_LINK, "CREDITS","ic_list_white_24dp_2x.png","http://www.zblip.com/mineofsight/credits"]);



if(location.hostname != "www.facebook.com"){
	// gotta check for mobile as well
	MenuItems.push([1, Types.Events.WEB_LINK, "www.zblip.com","games_icon.png","http://www.zblip.com"]);
}

if(location.hostname == "www.zblip.com"){
	// gotta check for mobile as well
	//MenuItems.push([1, Types.Events.BOOKMARK, "Homescreen","games_icon.png"]);
}

//social buttons:
//MenuItems.push([2, Types.Events.WEB_LINK, "Facebook","facebook-24x24.png","https://www.facebook.com/Mine-of-Sight-1037635096381976/"]);
MenuItems.push([1, Types.Events.WEB_LINK, "@ZBlipGames","twitter-24x24.png","https://twitter.com/ZBlipGames"]);
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
	window.open('plus.google.com/share?url=www.zblip.com/mineofsight');
}



MenuPositions = Class.extend({

	menu_item_pos_x: [],
	menu_item_pos_y: [],
	menu_item_num: [],
	menu_item_type: [],

	menu_item_width: 148,
	menu_item_height: 28,

	menu_width: 0,
	menu_height: 0,

	menu_item_scale: 1,

	social_y: 0,	// where the social buttons sta

	init: function() {},

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
	return;
	//game_screen_group.x = newx;
	play_group.x = (newx + x_shift_screen)/menu_ratio; // horrid coupling i know
	game_menu_group.x = (newx)/menu_ratio;
};

function g_set_menu_screen_x(newx) {
	//return;
	options_menu_group.x = newx*menu_ratio;
};


function g_set_menu_screen_y(newy) {
	return;
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
	//menu_highlight_sprite: null,
	spr_menu_button: null,

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
	
	init: function() {
		

		this.menu_positions = new MenuPositions();
	},

	setup: function() {

		update_webfonts();

		this.game_engine = new GameEngineClass();

		

		this.game_engine.push_state(new BootStateClass());

		

		// Draw the menu. Once. Here.
		// options_menu_container is the PIXI.js container

		this.graphics_menu_body = new SpriteClass();
		this.graphics_menu_body.setup_sprite('menubody.png',Types.Layer.POP_MENU, 0, 0);
		//draw_rect_perm(0,0,1,1,0x333333,Types.Layer.POP_MENU, 0, 0);
		this.graphics_menu_body.phasersprite.anchor.setTo(0,0);
		this.graphics_menu_body.update_pos(0,0);
		
		

		this.spr_menu_button = new SpriteClass();
		
		this.spr_menu_button.setup_sprite('menu_button.png', Types.Layer.GAME_MENU);//Types.Layer.POP_MENU); //
		
		//this.line_above_social = new PIXI.Graphics();
		
		//options_menu_container.addChild(this.line_above_social);
		
		


		for (var i = 0; i < MenuItems.length; i++) {

			if (MenuItems[i][0] == 3) {

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
				this.menu_texts[i].set_colour("#112829");
			} else {
				this.menu_texts[i].set_text(MenuItems[i][2]);

				this.menu_texts[i].set_colour("#ffffff");
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
			

			if (event_type == Types.Events.MOUSE_UP &&
			    mouse.x/options_menu_group.scale.x < 2*this.menu_icon_size &&
			    mouse.y > this.menu_icon_y - this.menu_icon_size*options_menu_group.scale.x) {
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

		
		//if (event_type == Types.Events.WHEEL) 
		
		y = mouse.y/menu_ratio;//y*ratio;
		x = mouse.x/menu_ratio;//x*ratio;

		

		if (event_type == Types.Events.MOUSE_DOWN && 
			x > this.menu_width) {
		   
			this.pop_down();
			this.pop_down_click = true;
			this.mouse_down = 0;
			return;
		} else if (event_type == Types.Events.MOUSE_DOWN && x < this.menu_width && this.mouse_down == 0) {
			
				
	
			//this.mouse_down = 1;
			this.mouse_down_y = y;

			//return;

			//alert(' DOWN    y = ' + y);

			this.menu_scroll = 1;

			if (y < 32) this.menu_y += 4;
			else if (y > screen_height - 32) this.menu_y -= 4;
			else this.menu_scroll = 0;

			this.menu_y = Math.min(0, this.menu_y);
			//this.menu_y = Math.max(this.menu_y, this.menu_positions.menu_height);

			

				
			g_set_menu_screen_y(this.menu_y);

			//var need = screen_height - 32;

			//alert('y is ' + y + ' ' + ' but needs to be > ' + need);

			return;

		} else if (event_type == Types.Events.MOUSE_DOWN && x < this.menu_width && this.mouse_down == 1) {

			if (Math.abs(y - this.mouse_down_y) > 6) {}
			
			if (false && Math.abs(y - this.mouse_down_y) > 3) { //&& 
			   // Math.abs(y - this.mouse_down_y) > 3 && 
			   // Math.abs(y - this.mouse_down_y) < 32) {
				
				//alert(' SCROLL    y = ' + y);
				
				//this.menu_y += y - this.mouse_down_y;

				if (y > this.mouse_down_y + 4) {
					this.menu_y -= 4;
					this.menu_scroll = 1;
					this.menu_y = Math.min(0, this.menu_y);
					g_set_menu_screen_y(this.menu_y);
					//this.mouse_down_y = y;
				} else if (y < this.mouse_down_y - 4) {
					this.menu_y += 4;
					this.menu_scroll = 1;
					this.menu_y = Math.min(0, this.menu_y);
					g_set_menu_screen_y(this.menu_y);
				}
				//this.mouse_down_y = y;
				

				
				//this.menu_y = Math.max(this.menu_y, this.menu_positions.menu_height);

				
				//g_set_menu_screen_y(this.menu_y);

			}
			

		} 
		
		if (event_type != Types.Events.MOUSE_UP) return;
		//alert('MOUSEUP')
		

		this.mouse_down = 0;

		if (this.menu_scroll == 1) {
			this.menu_scroll = 0;
			return;	// we wereonly scrolling
		}

		this.menu_scroll = 0;

		

		var menu_i = this.menu_positions.check_for_click(x,y - this.menu_y);

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
			
		} else if (MenuItems[menu_i][1] == Types.Events.TUTORIAL) {

			this.game_engine.handle_events(0, 0, Types.Events.TUTORIAL);

			this.pop_down();
			
		} else if (MenuItems[menu_i][1] == Types.Events.GOTO_LEVELS) {

			this.game_engine.handle_events(0, 0, Types.Events.GOTO_LEVELS);

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
			
		} else if (MenuItems[menu_i][1] == Types.Events.WEB_LINK) {
			// MenuItems[menu_i][4]	// url
			//window.open("http://www.w3schools.com");
			window.open(MenuItems[menu_i][4]);
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
				if (MenuItems[m][0] == 3) this.menu_texts[m].set_colour("#ffffff");	
			}

			this.menu_texts[menu_i].set_colour("#112829");	

			this.game_engine.on_screen_resize();

			//this.pop_down();
		} else if (MenuItems[menu_i][1] == Types.Events.HOLD_TO_FLAG) {
			g_hold_to_flag = true;
			g_click_to_dig = true;

			for (var m = 0; m < MenuItems.length; m++) {
				if (MenuItems[m][0] == 3) this.menu_texts[m].set_colour("#ffffff");	
			}
			this.menu_texts[menu_i].set_colour("#112829");			

			this.game_engine.on_screen_resize();

			//this.pop_down();
		} else if (MenuItems[menu_i][1] == Types.Events.RIGHT_TO_FLAG) {
			g_hold_to_flag = false;
			g_click_to_dig = true;

			this.game_engine.on_screen_resize();

			for (var m = 0; m < MenuItems.length; m++) {
				if (MenuItems[m][0] == 3) this.menu_texts[m].set_colour("#ffffff");	
			}

			this.menu_texts[menu_i].set_colour("#112829");	

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

		} else if (event_type == Types.Events.GOTO_LEVELS) {

			while(this.state_stack.length > 2) {
				var state_ = this.state_stack.pop();
				state_.cleanup();
			}
			this.push_state(new OverworldStateClass(this, this.state_stack[1]));

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

			//this.push_state(new CommunityOverworldStateClass(this, this.state_stack[1]));
			
			this.push_state(new CommunityFetchStateClass(this, this.state_stack[1]));

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