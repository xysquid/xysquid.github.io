

g_block_sprites = {
	1: "block0.png",
	2: "bomb.png",
	3: "g_block2.png",
	4: "block3.png",
	5: "bomb.png",
	6: "fire.png",
	7: "block4.png",
	8: "block5.png",
	9: "block6.png",
	10: "G10.png",
	11: "fire.png",
	12: "undo.png",
	
	13: "S10.png"
};

g_block_shadow_sprites = {
	1: "block1_shadow.png",
	2: "bomb.png",
	3: "block1_shadow.png",
	4: "block1_shadow.png",
	5: "bomb_shadow.png",
	6: "fire_shadow.png",
	7: "block1_shadow.png",
	8: "block1_shadow.png",
	9: "block1_shadow.png",
	10: "S10.png",
	11: "fire_shadow.png",
	12: "S1.png",

	13: "S10.png"
};

g_block_blink_sprites = {
	1: "block0_blink.png",
	2: "g_block1_blink.png",
	3: "g_block1_blink.png",
	4: "g_block1_blink.png",
	5: "bomb_shadow.png",
	6: "fire_shadow.png",
	7: "g_block1_blink.png",
	8: "g_block1_blink.png",
	9: "g_block1_blink.png",
	10: "S10.png",
	11: "fire_shadow.png",
	12: "S1.png",

	13: "S10.png"
};

TableAreaClass = Class.extend({

	text: null,	// text object
	box: null,	// pixi graphics object

	line: null,

	left_x: 0,
	right_x: 0,
	top_y: 0,
	bottom_y: 0,

	hidden: 0,

	game_state: null,

	close_loop: false,

	colour: 0xeeeeee,

	init: function(game_state, text_str) {

		this.game_state = game_state;
	
		this.box = draw_rect_perm(0,0,1,1,0x161423,Types.Layer.BACKGROUND);	// dunno if BACKGROUND works yet
		this.text = new TextClass(Types.Layer.HUD);			// dunno if BACKGROUND works yet

		
		this.text.set_font(Types.Fonts.SMALL);
		this.text.set_text(text_str);


		this.line = new PIXI.Graphics();
		
		menu_container.addChild(this.line);

	},


	resize: function(x,y,xx,yy) {

		

		this.left_x = x;
		this.right_x = xx;
		this.top_y = y;
		this.bottom_y = yy;

		this.box.width = xx - x;
		this.box.height = yy - y;
		this.box.x = x;
		this.box.y = y;

		this.text.update_pos(this.left_x + 12, this.bottom_y - 0.5*this.text.pixitext.height);

		// line
		this.line.clear();
		this.line.lineStyle(6, this.colour);
		this.line.moveTo(this.left_x + 8, this.bottom_y);
		this.line.lineTo(this.left_x, this.bottom_y);
		this.line.lineTo(this.left_x, this.top_y);
		this.line.lineTo(this.right_x, this.top_y);
		this.line.lineTo(this.right_x, this.bottom_y);
		this.line.lineTo(this.left_x + 8 + this.text.pixitext.width + 8, this.bottom_y);
		if (this.close_loop == true) this.line.lineTo(this.left_x, this.bottom_y);
		this.line.endFill();
        	this.line.alpha = 1;
	},
	
});


ExplosionClass = Class.extend({

	game_state: null,

	x: -1,
	y: -1,		// permanent

	frames: [],	// 6 explosion .pngs


	curr_frame: 99,

	init: function(x,y,game_state) {
		
		this.game_state = game_state;

		this.x = x;
		this.y = y;

		this.add_frame("bang.png");
		this.add_frame("bang2.png");
	},

	add_frame: function(spritename_ ) {

		var spr = new SpriteClass();
		spr.setup_sprite(spritename_,Types.Layer.GAME);
		spr.update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size , 										       this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size);
		spr.hide();
		this.frames.push(spr);
	},

	start_anim: function () {
		//console.log('ecplode start anim');
		this.curr_frame = 0;
	},

	stop_anim: function () {
		this.curr_frame = 99;
		for (var i = 0; i < this.frames.length; i++) {
				this.frames[i].hide();
		}
	},

	draw: function() {

		//console.log('ecplode draw');
		if (this.curr_frame < this.frames.length &&
		    this.curr_frame >= 0) {
			for (var i = 0; i < this.frames.length; i++) {
				this.frames[i].hide();
			}
			this.frames[this.curr_frame].make_vis();
		}

		if (this.curr_frame < this.frames.length) {
			
			this.curr_frame++;

			

		} else this.stop_anim();
	}

});

LevelEditorTileSelectClass = Class.extend({


	build_x: [],
	build_y: [],
	build_codes: [],
	build_sprites: [],
	build_sprite_rotate: [],

	selected: -1,

	size_: 60,

	left_arrow: null,
	right_arrow: null,

	left_arrow_x: 0,
	right_arrow_x: 0,
	left_arrow_y: 0,
	right_arrow_y: 0,

	init: function(game_state) {
		this.left_arrow = new ButtonClass();
		this.left_arrow.setup_sprite('leftarrow.png', Types.Layer.GAME_MENU);

		this.right_arrow = new ButtonClass();
		this.right_arrow.setup_sprite('rightarrow.png', Types.Layer.GAME_MENU);
	},

	add_new: function(spritename, code) {
		var sprite_ = new SpriteClass();
		sprite_.setup_sprite(spritename,Types.Layer.GAME_MENU);

		this.build_codes.push(code);
		this.build_sprites.push(sprite_);
		this.build_x.push(0);
		this.build_y.push(0);
		this.build_sprite_rotate.push(0);

		var index = this.build_sprites.length - 1;
		

		return index;
		
	},

	
	rotate_sprite : function (index, times) {

		this.build_sprite_rotate[index] = times;
		
		for (var i = 0; i < times; i++) {
			
			this.build_sprites[index].rotate_ninety();

		}
	},
	

	scroll: function () {
		
		for (var i = 0; i < this.build_x.length; i++) {
			this.build_sprites[i].hide();
			
			
		}

		for (var i = this.scrolled; i < Math.min(this.build_x.length, this.scrolled + this.icons_in_row); i++) {
			this.build_sprites[i].make_vis();
			this.build_x[i] = i*this.size_ + 3*this.size_ - this.scrolled*this.size_;
			this.build_y[i] = screen_height - 0.5*this.size_;
			this.build_sprites[i].update_pos(this.build_x[i], this.build_y[i]);
			
			this.rotate_sprite(i, this.build_sprite_rotate[i]);
		}


	},

	click : function (x, y) {

		if (x > this.left_arrow_x - this.size_*0.5 &&
		x < this.left_arrow_x + this.size_*0.5 &&
		y > this.left_arrow_y - this.size_*0.5 &&
		y < this.left_arrow_y + this.size_*0.5 && this.scrolled > 0) {
			this.scrolled--;
			//this.scrolled =  Math.min(0, this.scrolled);
			this.scroll();
			return;
		} else if (x > this.right_arrow_x - this.size_*0.5 &&
		x < this.right_arrow_x + this.size_*0.5 &&
		y > this.right_arrow_y - this.size_*0.5 &&
		y < this.right_arrow_y + this.size_*0.5 && this.scrolled <= this.build_x.length + 1) {
			this.scrolled++;
			//this.scrolled = Math.min(this.build_x.length, this.scrolled);
			//this.scrolled = Math.min(this.scrolled, this.icons_in_row);
			this.scroll();
			return;
		}

		//this.selected = -1;
		for (var i = 0; i < this.build_x.length; i++) {

			//this.highlight_off();
			
		
			if (x > this.build_x[i] - this.size_*0.5 &&
			    x < this.build_x[i] + this.size_*0.5 &&
			    y > this.build_y[i] - this.size_*0.5 &&
			    y < this.build_y[i] + this.size_*0.5) {
			
				this.selected = i;

				

				return;
			}

		}

		
	},

	hide: function() {
		for (var i = 0; i < this.build_x.length; i++) {
			this.build_sprites[i].hide();
		}

		this.left_arrow.hide();
		this.right_arrow.hide();
	},

	icons_in_row: 9,
	scrolled: 0,

  	make_vis: function() {

		this.scrolled = 0;

		this.left_arrow.make_vis();
		this.right_arrow.make_vis();

		this.left_arrow_x = 2*this.size_;
		this.right_arrow_x = (2 + this.icons_in_row + 1)*this.size_;
		this.left_arrow_y = screen_height - 0.5*this.size_;
		this.right_arrow_y = screen_height - 0.5*this.size_;

		this.left_arrow.update_pos(this.left_arrow_x, this.left_arrow_y);
		this.right_arrow.update_pos(this.right_arrow_x, this.right_arrow_y);

		for (var i = 0; i < Math.min(this.build_x.length, this.scrolled + this.icons_in_row); i++) {
			this.build_sprites[i].make_vis();
			this.build_x[i] = i*this.size_ + 3*this.size_;
			this.build_y[i] = screen_height - 0.5*this.size_;
			this.build_sprites[i].update_pos(this.build_x[i], this.build_y[i]);
			
			this.rotate_sprite(i, this.build_sprite_rotate[i]);
		}
	},

	screen_resized: function() {
		
	}

});


// community level mode > show ~5 in a page
//	name, author, rating, attempts, wins
CommunityLevelBrowser = Class.extend({

	levels_added: 0,	// up to 6, resets to 0

	game_state: null,

	// toggles - hint types, newest, popular, random
	toggle_hand: null,
	toggle_eighthand: null,
	toggle_eye: null,
	toggle_heart: null,
	toggle_join: null,
	toggle_compass: null,
	toggle_crown: null,

	hint_toggles: [],

	toggle_rating: null,	// get the best rated of all time
	toggle_random: null,	// get 6 randoms that fit the clue-toggles
	

	level_name: [6],
	level_author: [6],
	level_rating: [6],
	level_attempts: [6],
	level_wins: [6],
	level_play_sprite: [6],
	level_id: [6],

	levels_added: 0,

	search_button: null,

	rating_text: null,
	wins_text: null,
	downloads_text: null,


	init: function(game_state) {
		this.game_state = game_state;

		
		this.search_button = new ButtonClass();
		this.search_button.setup_sprite('new_icon.png',Types.Layer.GAME_MENU);

		var toggle_hand = new ToggleClass();
		toggle_hand.setup_sprite("hand.png",Types.Layer.GAME_MENU);
		toggle_hand.code = 3;
		toggle_hand.three_toggle = true;

		var toggle_eighthand = new ToggleClass();
		toggle_eighthand.setup_sprite("8hand.png",Types.Layer.GAME_MENU);
		toggle_eighthand.code = 5;
		toggle_eighthand.three_toggle = true;

		var toggle_heart = new ToggleClass();
		toggle_heart.setup_sprite("heart.png",Types.Layer.GAME_MENU);	
		toggle_heart.code = 10;	
		toggle_heart.three_toggle = true;

		var toggle_crown = new ToggleClass();
		toggle_crown.setup_sprite("crown.png",Types.Layer.GAME_MENU);		
		toggle_crown.code = 12;
		toggle_crown.three_toggle = true;


		var toggle_compass = new ToggleClass();
		toggle_compass.setup_sprite("compass.png",Types.Layer.GAME_MENU);
		toggle_compass.code = 11;	
		toggle_compass.three_toggle = true;

		//var toggle_join = new ToggleClass();
		//toggle_join.setup_sprite("join_tut.png",Types.Layer.GAME_MENU);
		//toggle_join.code = 		

		var toggle_eye = new ToggleClass();
		toggle_eye.setup_sprite("eye.png",Types.Layer.GAME_MENU);
		toggle_eye.code = 4;
		toggle_eye.three_toggle = true;

		var toggle_eyebracket = new ToggleClass();
		toggle_eyebracket.setup_sprite("eyebracket.png",Types.Layer.GAME_MENU);
		toggle_eyebracket.code = 13;
		toggle_eyebracket.three_toggle = true;

		/*
		this.toggle_hand.horiz = false;
		this.toggle_eighthand.horiz = false;
		this.toggle_eye.horiz = false;
		this.toggle_heart.horiz = false;
		this.toggle_join.horiz = false;
		this.toggle_compass.horiz = false;
		this.toggle_crown.horiz = false;
		*/

		this.hint_toggles.push(toggle_hand);
		this.hint_toggles.push(toggle_eighthand);
		this.hint_toggles.push(toggle_heart);
		this.hint_toggles.push(toggle_crown);
		this.hint_toggles.push(toggle_compass);
		//this.hint_toggles.push(toggle_join);
		this.hint_toggles.push(toggle_eye);
		this.hint_toggles.push(toggle_eyebracket);
		

		for (var i = 0; i < this.hint_toggles.length; i++) {
			this.hint_toggles[i].horiz = false;
		}

		for (var i = 0; i < 6; i++) {
			this.level_id[i] = -1;

			this.level_name[i] = new TextClass(Types.Layer.GAME_MENU);
			this.level_author[i] = new TextClass(Types.Layer.GAME_MENU);
			this.level_rating[i] = new TextClass(Types.Layer.GAME_MENU);
			this.level_attempts[i] = new TextClass(Types.Layer.GAME_MENU);
			this.level_wins[i] = new TextClass(Types.Layer.GAME_MENU);

			this.level_name[i].set_font(Types.Fonts.SMALL);
			this.level_author[i].set_font(Types.Fonts.XSMALL);
			this.level_rating[i].set_font(Types.Fonts.SMALL);
			this.level_attempts[i].set_font(Types.Fonts.SMALL);
			this.level_wins[i].set_font(Types.Fonts.SMALL);

			this.level_name[i].set_text('');
			this.level_author[i].set_text('');
			this.level_rating[i].set_text('');
			this.level_attempts[i].set_text('');
			this.level_wins[i].set_text('');

			this.level_play_sprite[i] = new ButtonClass();
			this.level_play_sprite[i].setup_sprite("play_icon.png",Types.Layer.GAME_MENU);
		}

		this.rating_text = new TextClass(Types.Layer.GAME_MENU);
		this.wins_text = new TextClass(Types.Layer.GAME_MENU);
		this.downloads_text = new TextClass(Types.Layer.GAME_MENU);

		this.rating_text.set_font(Types.Fonts.XSMALL);
		this.wins_text.set_font(Types.Fonts.XSMALL);
		this.downloads_text.set_font(Types.Fonts.XSMALL);

		this.rating_text.set_text('RATING');
		this.wins_text.set_text('WINS');
		this.downloads_text.set_text('ATTEMPTS');


	},

	get_hint_status: function (hintcode) {
		for (var i = 0; i < this.hint_toggles.length; i++) {
			if (hintcode == this.hint_toggles[i].code) {
				if (this.hint_toggles[i].toggled == 0) return 1;
				else if (this.hint_toggles[i].toggled == 1) return -1;
				else if (this.hint_toggles[i].toggled == 2) return 0;
			}
		}
	},

	make_vis: function() {

		this.rating_text.update_pos(200+ 64,140);
		//this.wins_text.update_pos(400+ 64,140);
		//this.downloads_text.update_pos(300+ 64,140);

		for (var i = 0; i < this.level_name.length; i++) {


			if (i >= this.levels_added) break;


			var y = 150 + i*52;

			this.level_name[i].make_vis();
			this.level_author[i].make_vis();
			this.level_rating[i].make_vis();
			//this.level_attempts[i].make_vis();
			//this.level_wins[i].make_vis();
			this.level_play_sprite[i].make_vis();

			this.level_name[i].update_pos(6 + 64,y);
			this.level_author[i].update_pos(6+ 64,y + 20);
			this.level_rating[i].update_pos(200+ 64,y);
			this.level_attempts[i].update_pos(300+ 64,y);
			this.level_wins[i].update_pos(400+ 64,y);
			this.level_play_sprite[i].update_pos(500+ 64,y + 16);
		}

		for (var i = 0; i < this.hint_toggles.length; i++) {
			this.hint_toggles[i].make_vis();
			this.hint_toggles[i].update_pos(1*32 + i*32, 96);
		}

		/*
		this.toggle_hand.make_vis();
		this.toggle_eighthand.make_vis();
		this.toggle_eye.make_vis();
		this.toggle_heart.make_vis();
		this.toggle_join.make_vis();
		this.toggle_compass.make_vis();
		this.toggle_crown.make_vis();

		this.toggle_hand.update_pos(1*32, 96);
		this.toggle_eighthand.update_pos(2*32, 96);
		this.toggle_eye.update_pos(3*32, 96);
		this.toggle_heart.update_pos(4*32, 96);
		this.toggle_join.update_pos( 5*32, 96);
		this.toggle_compass.update_pos( 6*32, 96);
		this.toggle_crown.update_pos( 7*32, 96);
		*/

		this.search_button.make_vis();
		this.search_button.update_pos( this.search_x, this.search_y);

		//this.toggle_rating.make_vis();
		//this.toggle_random.make_vis();

	},

	search_x: 11*32,
	search_y: 96,

	hide: function() {

		this.rating_text.hide();
		this.wins_text.hide();
		this.downloads_text.hide();


		for (var i = 0; i < this.level_name.length; i++) {

			
			this.level_name[i].hide();
			this.level_author[i].hide();
			this.level_rating[i].hide();
			this.level_attempts[i].hide();
			this.level_wins[i].hide();
			this.level_play_sprite[i].hide();
		}

		for (var i = 0; i < this.hint_toggles.length; i++) {
			this.hint_toggles[i].hide();
		}
		//this.toggle_hand.hide();
		//this.toggle_eighthand.hide();
		//this.toggle_eye.hide();
		//this.toggle_heart.hide();
		//this.toggle_join.hide();
		//this.toggle_compass.hide();
		//this.toggle_crown.hide();

		//this.toggle_rating.hide();
		//this.toggle_random.hide();

		this.search_button.hide();
	},

	reset: function() {
		this.hide();
		this.levels_added = 0;
	},

	add_level: function (name, author, rating, attempts, wins, id) {

		

		if (this.levels_added >= this.level_name.length) return -1;

		

		this.level_name[this.levels_added].change_text(name);
		this.level_author[this.levels_added].change_text('BY ' +author);
		this.level_rating[this.levels_added].change_text(rating.toString());
		this.level_attempts[this.levels_added].change_text(attempts.toString());
		this.level_wins[this.levels_added].change_text(wins.toString());
		this.level_play_sprite[this.levels_added].make_vis();
		this.level_id[this.levels_added] = id;

		this.levels_added++;
	},

	selected_level_id: -1,
	clicked_fetch: false,

	click : function (x, y) {

		this.clicked_fetch = false;
		this.selected_level_id = -1;;

		//this.selected = -1;
		for (var i = 0; i < this.levels_added; i++) {

			//this.highlight_off();
			var y_level = 150 + i*52;
		
			if (x > 500+64 - 28 &&
			    x < 500+64 + 28 &&
			    y > y_level - 25 &&
			    y < y_level + 25) {
			
				this.selected_level_id = this.level_id[i];
				
				

				return;
			}

		}

		if (x < this.search_x + 32 && x > this.search_x - 32 && 
		    y < this.search_y + 32 && y > this.search_y - 32) {
			this.clicked_fetch = true;
			return;
		}

		for (var i = 0; i < this.hint_toggles.length; i++) {
			if (x > this.hint_toggles[i].x - 20 &&
			    x < this.hint_toggles[i].x + 20 &&
			    y > this.hint_toggles[i].y - 20 &&
			    y < this.hint_toggles[i].y + 20) {
				this.hint_toggles[i].toggle();
				return;
			}

		}		

		
	},

});

// levels 1-20, 31-60
// challenge modes
// 1992 rand gen mode
// endless mode
//
// daily challenge > new overworld: 30 days in a month, each month is an overworld
// community levels > new overworld of community levels (seeds?)


OverworldSpritesClassReuseable = Class.extend({

	level_tile_size: 120,

	// where to draw, where to click
	level_x: [30],
	level_y: [30],

	level_text: [30],		// number
	level_box: [30],	// TableAreaClass

	level_sprite: [30],

	status_sprite: [30],	// tick, lock, timer
	level_status: [30],

	levels_added: 0,	// up to 30, resets to 0
	

	game_state: null,

	selected: -1,


	
	special_code: [30],
	selected_special: -1,
		// 1 == '1992 mode'


	highlight_sprite: null,

	init: function(game_state) {
		this.game_state = game_state;

		
		this.highlight_sprite = new SpriteClass();
		this.highlight_sprite.setup_sprite('level_button_on.png',Types.Layer.HUD);
		this.highlight_sprite.hide();

		for (var i = 0; i < 30; i++) {
			
			var x = i % 5;
			var y = Math.floor(i / 5);

			x = x*this.level_tile_size;
			y = y*0.5*this.level_tile_size + 120;

			this.level_x[i] = x;
			this.level_y[i] = y;

			var box_ = new SpriteClass();

			box_.setup_sprite('level_button_on.png',Types.Layer.TILE);	// default sprite, may need to change

			var text_ = new TextClass(Types.Layer.HUD);			// dunno if BACKGROUND works yet
			text_.set_font(Types.Fonts.MEDIUM);
			text_.set_text(i.toString());
			text_.update_pos(-999,-999);

			this.level_text[i] = text_;
			this.level_box[i] = box_;
			this.special_code[i] = 0;	// not special

			var icon_ = new SpriteClass();
			icon_.setup_sprite('eye.png',Types.Layer.TILE);
			icon_.hide();

			this.level_sprite[i] = icon_;

			var status_ = new SpriteClass();
			status_.setup_sprite("tick.png",Types.Layer.HUD);
			status_.hide();
			this.status_sprite[i] = status_;

			this.level_status[i] = 0;

		}

	},

	special_mode: 0,	// challenge levels - only use every 4th slot

	reset: function() {
		this.special_mode = 0;
		this.levels_added = 0;
		for (var i = 0; i < 30; i++) {
			this.status_sprite[i].hide();
			this.level_status[i] = 0;
			this.level_sprite[i].hide();
			this.level_box[i].hide();
			this.level_text[i].update_pos(-999,-999);
			this.special_code[i] = 0; // not special
			
		}
	},

	add_special: function(name, special_code) {

		if (this.levels_added >= 30) return;

		this.special_mode = 1;

		this.add_level();
		this.levels_added--;	// add_level increments it
		this.level_text[this.levels_added].change_text(name);
		this.level_box[this.levels_added].set_texture('special_button_on.png');

		this.special_code[this.levels_added] = special_code;

		

		this.levels_added += 5;
	},

	do_level_sprite: [30],

	add_level: function (spritename, text) {

		if (this.levels_added >= 30) return;

		var x = this.levels_added % 5;
		var y = Math.floor(this.levels_added / 5);

		x = x*this.level_tile_size + 0.5*this.level_tile_size;
		y = y*0.5*this.level_tile_size + 120;

		this.level_x[this.levels_added] = x;
		this.level_y[this.levels_added] = y;

		if (text != null) this.level_text[this.levels_added].change_text(text);

		this.level_box[this.levels_added].set_texture('level_button_on.png');

		if (spritename == null) {
				//this.level_sprite[this.levels_added].hide();
			this.do_level_sprite[this.levels_added] = false;
		} else {
			this.do_level_sprite[this.levels_added] = true;
			this.level_sprite[this.levels_added].set_texture(spritename);
			//this.level_sprite[this.levels_added].make_vis();
			//this.level_sprite[this.levels_added].update_pos(this.level_x[this.levels_added] - 20, this.level_y[this.levels_added]);
			
		}

		this.levels_added++;

	},

	set_status: function(level, status_) {

		if (level >= this.status_sprite.length) return;

		this.level_status[level] = status_;

		if (status_ == 2) {
			//this.status_sprite[level].set_texture('timer.png');
			this.level_status[level] = 0;
		} else if (status_ == 3) {
			//this.status_sprite[level].set_texture('lock.png');
			this.level_status[level] = 0;
		} else if (status_ == 4) {
			this.status_sprite[level].set_texture('tick.png');
		}

		this.status_sprite[level].make_vis();
	},	

	no_status: function(level) {

		if (level > this.status_sprite.length - 1) return;

		this.level_status[level] = 0;

		this.status_sprite[level].hide();
	},

	click: function(x,y) {
		//this.highlight_off();
		this.selected = -1;
		this.selected_special = -1;
		for (var i = 0; i < this.levels_added; i++) {
			if (x > this.level_x[i] - 45 &&
			    x < this.level_x[i] + 45 &&
			    y > this.level_y[i] - 0.5*45 &&
			    y < this.level_y[i] + 0.5*45) {

				if (this.special_mode == 1 && this.special_code[i] == 0) return;  // ignore click
			
				this.selected = i;

				this.selected_special = this.special_code[i];	

				return;
			}
		}
	},

	hide: function() {
		for (var i = 0; i < this.level_x.length; i++) {

			this.level_text[i].update_pos(-999,-999);

			this.level_box[i].hide();

			if (this.level_sprite[i] != null) {
				this.level_sprite[i].hide();

			}

			this.status_sprite[i].hide();
		}
	},

  	make_vis: function() {
		for (var i = 0; i < this.levels_added; i++) {

			var x = this.level_x[i];
			var y = this.level_y[i];

			this.level_box[i].make_vis();
			this.level_box[i].update_pos(x, y);

			

			if (this.do_level_sprite[i] == true) {
				this.level_sprite[i].make_vis();
				this.level_sprite[i].update_pos(x + 20, y);

			}

			if (this.level_status[i] != 0) {
				this.status_sprite[i].update_pos(x + 45, y - 23);
			} else this.status_sprite[i].hide();

			if (this.special_code[i] == 0) {
				this.level_text[i].update_pos(x - 35, y - 20,96,999);
				//this.level_text[i].center_x(x + 20);
			} else {
				this.level_text[i].update_pos(3.5*this.level_tile_size, y - 0.125*this.level_tile_size,999,999);
				///this.level_text[i].center_x(x + 20);
				i += 4;

			}
			
		}
	},

	highlight_on: function(x,y) {

		
	},

	highlight_off: function() {
	},

});


InfoClass = Class.extend({

	block_obj: null,

	text: null,

	hidden: true,

	game_state: null,

	box: null,

	

	init: function(game_state) {
	
		this.game_state = game_state;

		this.block_obj = new SpriteClass();
		this.block_obj.setup_sprite("eye.png",Types.Layer.HUD);
		this.block_obj.hide();

		this.text = new TextClass(Types.Layer.HUD);			// dunno if BACKGROUND works yet
		this.text.set_font(Types.Fonts.MED_SMALL);
		this.text.set_text("");
		

		//this.box = new TableAreaClass(game_state, "");
		//this.box.close_loop = true;

		
	},

	set_hint_type: function(hint_) {
		if (hint_ == 1) {
				this.block_obj.set_texture('hand.png');
				this.text.change_text(g_get_text("hand"));
			} else if (hint_ == 2) {
				this.block_obj.set_texture('eye.png');
				this.text.change_text(g_get_text("eye"));
			} else if (hint_ == 3) {
				this.block_obj.set_texture('eyeplustouch.png');
				this.text.change_text("      The number of mines seen PLUS the number of mines touched, by this tile. So any adjacent mines will be counted 2X");
			} else if (hint_ == 4) {
				this.block_obj.set_texture('8hand.png');
				this.text.change_text(g_get_text("eighthand"));
			} else if (hint_ == 5) {
				this.block_obj.set_texture('heart.png');
				this.text.change_text(g_get_text("heart"));
			} else if (hint_ == 11) {
				this.block_obj.set_texture('compass.png');
				this.text.change_text(g_get_text("compass"));
			}else if (hint_ == 12) {
				this.block_obj.set_texture('crown.png');
				this.text.change_text(g_get_text("crown"));
			}else if (hint_ == 13) {
				this.block_obj.set_texture('eyebracket.png');
				this.text.change_text(g_get_text("eyebracket"));
			}else {
				// uncovered, no hint, empty
				
			}
	},

	set_block: function (x , y) {
		// hint types (block type empty, uncovered)

		

		if (this.game_state.get_block_type(x,y) == 0 &&
		    this.game_state.blocks[this.game_state.tiles[x][y]].covered_up == false && 
		    this.game_state.blocks[this.game_state.tiles[x][y]].preset_hint_type != 0) {

			// exposed hint
			var hint_ = this.game_state.blocks[this.game_state.tiles[x][y]].preset_hint_type;
			this.set_hint_type(hint_);
			
		} else {
			this.hidden = true;
		}
	},

	draw_once: function() {
		if (this.hidden == true) {
			this.block_obj.hide();
			this.text.update_pos(-999,-999);
			//this.box.resize(-999,-999,-999,-999);
			return;
		} 

		this.block_obj.make_vis();
		this.block_obj.update_pos(0.75*this.game_state.tile_size + 8, 10.5*this.game_state.tile_size + 8);
		this.text.update_pos(0.75*this.game_state.tile_size, 10.5*this.game_state.tile_size, 10*this.game_state.tile_size, 200);
		return;

		if (screen_width > screen_height) {
			this.block_obj.make_vis();
			this.block_obj.update_pos(12*this.game_state.tile_size + 8, 5*this.game_state.tile_size + 8);
			this.text.update_pos(12*this.game_state.tile_size, 5*this.game_state.tile_size, 200, 200);
			//this.box.resize(11.5*this.game_state.tile_size, 3.5*this.game_state.tile_size,
			//		11.5*this.game_state.tile_size + 240, 6.5*this.game_state.tile_size);
		} else {
			this.block_obj.make_vis();
			this.block_obj.update_pos(1*this.game_state.tile_size + 8, 11*this.game_state.tile_size + 8);
			this.text.update_pos(1*this.game_state.tile_size, 11*this.game_state.tile_size, 200, 200);
			//this.box.resize(0.5*this.game_state.tile_size, 10.5*this.game_state.tile_size,
			//		0.5*this.game_state.tile_size + 240, 15*this.game_state.tile_size);
		}
	}

});

GameTypes = {
	Clues: {
		NO_CLUE: 0,
		FOUR_TOUCH: 1,
		EYE: 2,
		EIGHT_TOUCH: 3,
		HEART: 4,
		COMPASS: 5,
		CROWN: 6

	}

};

newBlockClass = Class.extend({
	index: -1,	
	block_type: -1,

	block_blink_sprite: null,	// select highlight
	block_sprite: null,		// wall, tile, flag .. or clue
	hint_num_obj: null,

	hint_num: 0,

	x: -1,
	y: -1,

	covered_up: true,
	flag_on :false,

	joined_with: -1,
	join_group: 0,
	join_sprite_any: null,

	init: function(game_state) {

		this.game_state = game_state;

		this.block_type = 1;

		this.block_sprite = new SpriteClass();
		this.block_sprite.setup_sprite("block0.png",Types.Layer.GAME);
		this.block_sprite.hide();

		this.hint_num_obj = new CounterClass(Types.Layer.TILE);
		this.hint_num_obj.set_font(Types.Fonts.MEDIUM);
		this.hint_num_obj.set_text("");
		this.hint_num_obj.update_pos(-999,-999);

		
		this.join_sprite_any = new SpriteClass();
		this.join_sprite_any.setup_sprite('joiner_up.png',Types.Layer.TILE);
		this.join_sprite_any.hide();


	}

});


BlockClass = Class.extend({

	index: -1,	
	block_type: -1,

	block_blink_sprite: null,
	block_sprite: null,
	//block_shadow_sprite: null,
	
	

	x: -1,
	y: -1,

	y_vel: 0,

	game_state: null,	

	y_scale: 1,	// for fire effect

	blink_timer: 0,

	covered_up: true,
	flag_on :false,

	hint_heart_sprite: null,
	hint_heart_num: -1,
	hint_heart_num_text: null,

	hint_eye_sprite: null,
	hint_eye_num: -1,
	hint_eye_num_text: null,

	hint_touch_sprite: null,
	hint_eight_touch_sprite: null,
	hint_touch_num: -1,
	hint_touch_num_text: null,

	hint_add_sprite: null,
	hint_add_num: -1,
	hint_add_num_text: null,

	hint_compass_sprite: null,
	hint_compass_num: -1,
	hint_compass_num_text: null,

	hint_eyebracket_sprite: null,
	hint_eyebracket_num: -1,
	hint_eyebracket_num_text: null,

	hint_crown_sprite: null,
	hint_crown_num: -1,
	hint_crown_num_text: null,

	flag_sprite: null,

	joined_with: -1,
	join_group: 0,

	join_h_sprite: null,
	join_v_sprite: null,

	join_sprite_any: null,	
	// using this for:
	// blue join rectange
	// share box / lines

	mines_seen_xy: [],	// [{x:2,y:3}, {x:5,y:1}, ... ]
	share_groups: [],	// includes the sharesquare, pipes, and hints
				// hints can belong to multiple share-groups
	sharesquare: false,	
	sharesquare_num: 0,
	// cosmetic as far as this class knows
	share_connect_left: false,
	share_connect_right: false,
	share_connect_up: false,	
	share_connect_down: false,
	share_pipe: false,

	math_equalbox: false,
	math_group: -1,
	math_sign: 1, // 1 is +, -1 is -
	math_equal_num: 0,
	math_connect_left: false,
	math_connect_right: false,
	math_connect_up: false,	
	math_connect_down: false,

	editor_mode: 0,		// draw half covered

	needed: false,	// used by solver in solutiion

	hints_that_see_me: [],

	init: function(game_state) {

		this.game_state = game_state;

		this.block_type = 1;

		this.block_blink_sprite = new SpriteClass();
		this.block_blink_sprite.setup_sprite("select.png",Types.Layer.HUD);
		this.block_blink_sprite.hide();
		
		//this.block_shadow_sprite = new SpriteClass();
		//this.block_shadow_sprite.setup_sprite("block1_shadow.png",Types.Layer.TILE);
		//this.block_shadow_sprite.hide();

		this.block_sprite = new SpriteClass();
		this.block_sprite.setup_sprite("block0.png",Types.Layer.GAME);
		this.block_sprite.hide();

		this.join_v_sprite = new SpriteClass();
		//this.join_v_sprite.setup_sprite('joiner_v.png',Types.Layer.TILE);
		//this.join_v_sprite.hide();

		this.join_h_sprite = new SpriteClass();
		//this.join_h_sprite.setup_sprite('joiner_h.png',Types.Layer.TILE);
		//this.join_h_sprite.hide();

		this.join_sprite_any = new SpriteClass();
		this.join_sprite_any.setup_sprite('joiner_up.png',Types.Layer.TILE);
		this.join_sprite_any.hide();

		this.flag_sprite = new SpriteClass();
		this.flag_sprite.setup_sprite("flagblock.png",Types.Layer.GAME);
		this.flag_sprite.hide();

		this.hint_eye_num_text = new CounterClass(Types.Layer.GAME);
		this.hint_eye_num_text.set_font(Types.Fonts.MEDIUM);
		this.hint_eye_num_text.set_text("");
		this.hint_eye_num_text.update_pos(-999,-999);


		this.hint_eye_sprite = new SpriteClass();
		this.hint_eye_sprite.setup_sprite("eye.png",Types.Layer.GAME);
		this.hint_eye_sprite.hide();

		
		this.hint_heart_num_text = new CounterClass(Types.Layer.TILE);
		this.hint_heart_num_text.set_font(Types.Fonts.MEDIUM);
		this.hint_heart_num_text.set_text("");
		this.hint_heart_num_text.update_pos(-999,-999);

		
		this.hint_heart_sprite = new SpriteClass();
		this.hint_heart_sprite.setup_sprite("heart.png",Types.Layer.GAME);
		this.hint_heart_sprite.hide();


		this.hint_touch_num_text = new CounterClass(Types.Layer.TILE);
		this.hint_touch_num_text.set_font(Types.Fonts.MEDIUM);
		this.hint_touch_num_text.set_text("");
		this.hint_touch_num_text.update_pos(-999,-999);

		this.hint_touch_sprite = new SpriteClass();
		this.hint_touch_sprite.setup_sprite("hand.png",Types.Layer.GAME);
		this.hint_touch_sprite.hide();

		this.hint_eight_touch_sprite = new SpriteClass();
		this.hint_eight_touch_sprite.setup_sprite("8hand.png",Types.Layer.GAME);
		this.hint_eight_touch_sprite.hide();

		this.hint_add_num_text = new CounterClass(Types.Layer.TILE);
		this.hint_add_num_text.set_font(Types.Fonts.MEDIUM);
		this.hint_add_num_text.set_text("");
		this.hint_add_num_text.update_pos(-999,-999);

		this.hint_add_sprite = new SpriteClass();
		this.hint_add_sprite.setup_sprite("eyeplustouch.png",Types.Layer.GAME);
		this.hint_add_sprite.hide();
		
		this.hint_compass_sprite = new SpriteClass();
		this.hint_compass_sprite.setup_sprite("compass.png",Types.Layer.GAME);
		this.hint_compass_sprite.hide();

		this.hint_compass_num_text = new CounterClass(Types.Layer.TILE);
		this.hint_compass_num_text.set_font(Types.Fonts.MEDIUM);
		this.hint_compass_num_text.set_text("");
		this.hint_compass_num_text.update_pos(-999,-999);

		this.hint_crown_sprite = new SpriteClass();
		this.hint_crown_sprite.setup_sprite("crown.png",Types.Layer.GAME);
		this.hint_crown_sprite.hide();

		this.hint_crown_num_text = new CounterClass(Types.Layer.TILE);
		this.hint_crown_num_text.set_font(Types.Fonts.MEDIUM);
		this.hint_crown_num_text.set_text("");
		this.hint_crown_num_text.update_pos(-999,-999);

		this.hint_eyebracket_sprite = new SpriteClass();
		this.hint_eyebracket_sprite.setup_sprite("eyebracket.png",Types.Layer.GAME);
		this.hint_eyebracket_sprite.hide();

		this.hint_eyebracket_num_text = new CounterClass(Types.Layer.TILE);
		this.hint_eyebracket_num_text.set_font(Types.Fonts.MEDIUM);
		this.hint_eyebracket_num_text.set_text("");
		this.hint_eyebracket_num_text.update_pos(-999,-999);
		
	},

	

	set_sharepipe_sprite: function (up_,left_,right_,down_) {
		
	},

	calc_joiner_sprite: function () {
		if (this.join_group == 0) return;

		var left = 0;
		var right = 0;
		var up = 0;
		var down = 0;

		if (this.x > 0 && 
		    this.game_state.blocks[this.game_state.tiles[this.x - 1][this.y]].join_group == this.join_group) {	
			left = 1;
		}

		if (this.y > 0 && 
		    this.game_state.blocks[this.game_state.tiles[this.x][this.y - 1]].join_group == this.join_group) {	
			up = 1;
		}

		if (this.x < this.game_state.grid_w - 1 && 
		    this.game_state.blocks[this.game_state.tiles[this.x + 1][this.y]].join_group == this.join_group) {	
			right = 1;
		}

		if (this.y < this.game_state.grid_h - 1 && 
		    this.game_state.blocks[this.game_state.tiles[this.x][this.y + 1]].join_group == this.join_group) {	
			down = 1;
		}

		this.join_sprite_any.update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 									this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size + 3);

		if (left == 0 && right == 0 && up == 0 && down == 0) {}	// all alone?
		else if (left == 1 && right == 0 && up == 0 && down == 0) {
			this.join_sprite_any.set_texture("joiner_up.png");
			this.join_sprite_any.rotate_ninety();
		} else if (left == 0 && right == 1 && up == 0 && down == 0) {
			//this.join_sprite_any.set_texture("joiner_left.png");
			this.join_sprite_any.set_texture("joiner_up.png");
			this.join_sprite_any.rotate_ninety();
			this.join_sprite_any.rotate_ninety();
			this.join_sprite_any.rotate_ninety();
		} else if (left == 0 && right == 0 && up == 1 && down == 0) {
			//this.join_sprite_any.set_texture("joiner_down.png");
			this.join_sprite_any.set_texture("joiner_up.png");
			this.join_sprite_any.rotate_ninety();
			this.join_sprite_any.rotate_ninety();
		} else if (left == 0 && right == 0 && up == 0 && down == 1) this.join_sprite_any.set_texture("joiner_up.png");
		else if (left == 1 && right == 1 && up == 0 && down == 0) this.join_sprite_any.set_texture("joiner_tube_h.png");
		else if (left == 1 && right == 0 && up == 1 && down == 0) this.join_sprite_any.set_texture("joiner_corner_DR.png");
		else if (left == 1 && right == 0 && up == 0 && down == 1) this.join_sprite_any.set_texture("joiner_corner_UR.png");
		else if (left == 0 && right == 1 && up == 1 && down == 0) this.join_sprite_any.set_texture("joiner_corner_DL.png");
		else if (left == 0 && right == 1 && up == 0 && down == 1) this.join_sprite_any.set_texture("joiner_corner_UL.png");
		else if (left == 0 && right == 0 && up == 1 && down == 1) this.join_sprite_any.set_texture("joiner_tube_v.png");
		else if (left == 1 && right == 1 && up == 1 && down == 0) {
			this.join_sprite_any.set_texture("joiner_side_h.png");
			this.join_sprite_any.update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size  + 25.5);
		}
		else if (left == 1 && right == 1 && up == 0 && down == 1) {
			this.join_sprite_any.set_texture("joiner_side_h.png");
			this.join_sprite_any.update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size  - 25.5);
		}
		else if (left == 1 && right == 0 && up == 1 && down == 1) {
			this.join_sprite_any.set_texture("joiner_side_v.png");
			this.join_sprite_any.update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size   + 25.5, this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size);
		}
		else if (left == 0 && right == 1 && up == 1 && down == 1) {
			this.join_sprite_any.set_texture("joiner_side_v.png");
			this.join_sprite_any.update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size   - 25.5, this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size);
		}
		else if (left == 1 && right == 1 && up == 1 && down == 1) this.join_sprite_any.hide();
		else {}	// none left!
	},

	select: function() {
		this.block_blink_sprite.make_vis();
		//this.block_blink_sprite.update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 						  	//				   this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size);
	},

	deselect: function() {
		this.block_blink_sprite.hide();
	},

	put_flag_on: function() {
		if (this.covered_up == false) return;
		this.flag_on = true;
		this.set_type(this.block_type);
		this.deselect();
	},

	take_flag_off: function() {
		this.flag_on = false;
		this.set_type(this.block_type);
		this.deselect();
	},

	include_range_of_joined_tile: function (otherx, othery) {

		console.log('include_range_of_joined_tile this.x' + this.x + 'this.y' + this.y);

		// check that other tile is in the same join group as me..
		if (this.join_group == 0) return;
		if (this.join_group != this.game_state.blocks[this.game_state.tiles[otherx][othery]].join_group) return;

		// for each entry in the other guys range, IF its not already in mine, ADD it
		for (var r = 0; r < this.game_state.blocks[this.game_state.tiles[otherx][othery]].x_in_range.length; r++) {
			var x = this.game_state.blocks[this.game_state.tiles[otherx][othery]].x_in_range[r];
			var y = this.game_state.blocks[this.game_state.tiles[otherx][othery]].y_in_range[r];

			var already_got = 0;

			for (var j = 0; j < this.x_in_range.length; j++) {
				if (x == this.x_in_range[j] &&
				    y == this.y_in_range[j]) {
					already_got = 1;

				}

				if (this.game_state.blocks[this.game_state.tiles[x][y]].join_group == this.join_group) {
					already_got = 1;	// inside the group ... lets exclude from range

				}

				

				// should also splice out this.x this.y - is this included in basic hints??

			}

			if (already_got == 0) {
				this.x_in_range.push(x);
				this.y_in_range.push(y);
			}
		}
		
	},

	is_in_range: function(x,y) {

		if (x == this.x && y == this.y) return 0;


		if (this.game_state.blocks[this.game_state.tiles[x][y]].block_type == 1) return 0;

		if (this.preset_hint_type == 0) return 0;

		else if (this.preset_hint_type == 1) {
			// 4 touch
			if (x == this.x && y == this.y - 1) return 1;
			else if (x == this.x && y == this.y + 1) return 1;
			else if (x == this.x + 1 && y == this.y) return 1;
			else if (x == this.x - 1 && y == this.y) return 1;

		} else if (this.preset_hint_type == 2 || this.preset_hint_type == 5) {
			// eye or heart
			if (x != this.x && y != this.y) return 0;

			if (x == this.x) {

				// look up
				for (var yy = this.y; yy >= 0; yy--) {
					var tile_ = this.game_state.get_block_type(this.x,yy);
					////console.log('eye raange ' + x + ' ' + yy);
					if (tile_ == 1) return 0;
					else if (yy == y) return 1;
				}

				// look down
				for (var yy = this.y; yy < this.game_state.grid_h; yy++) {
					var tile_ = this.game_state.get_block_type(this.x,yy);
					////console.log('eye raange ' + x + ' ' + yy);
					if (tile_ == 1) return 0;
					else if (yy == y) return 1;
				}

			} else if (y == this.y) {
				// look right
				
				for (var xx = this.x; xx < this.game_state.grid_w; xx++) {
					var tile_ = this.game_state.get_block_type(xx, this.y);
					////console.log('eye raange ' + xx + ' ' + y);
					if (tile_ == 1) return 0;
					else if (xx == x) return 1;
				}

				// look left
				for (var xx = this.x; xx >= 0; xx--) {
					var tile_ = this.game_state.get_block_type(xx, this.y);
					////console.log('eye raange ' + xx + ' ' + y);
					if (tile_ == 1) return 0;
					else if (xx == x) return 1;
				}

			}
			

			

			

		} else if (this.preset_hint_type == 4) {
			// 8 touch
			if (x == this.x && y == this.y - 1) return 1;
			else if (x == this.x && y == this.y + 1) return 1;
			else if (x == this.x + 1 && y == this.y) return 1;
			else if (x == this.x - 1 && y == this.y) return 1;
			else if (x == this.x - 1 && y == this.y - 1) return 1;
			else if (x == this.x + 1 && y == this.y + 1) return 1;
			else if (x == this.x + 1 && y == this.y - 1) return 1;
			else if (x == this.x - 1 && y == this.y + 1) return 1;

		}

		return 0;
	},

	link_hint_to_sharegroup : function (s_group) {

		this.share_groups.push(s_group);

		if (this.join_group != 0 && this.i_know_join_leader_xy == true) {
			this.game_state.blocks[this.game_state.tiles[this.my_join_leader_x][this.my_join_leader_y]].link_hint_to_sharegroup(s_group);
			return;
		}

		
	},

	calc_sharesquare: function() {

		var all_the_mines = [];
		var num_hints_in_group = 0;

		console.log('calc sharesquare at : this.x ' + this.x + ' this.y ' + this.y);

		for (var b = 0; b < this.game_state.grid_w*this.game_state.grid_h; b++) {

			if (this.game_state.blocks[b].preset_hint_type == 0) continue;

			var not_in_my_group = 1;
		
			for (var s = 0; s < this.game_state.blocks[b].share_groups.length; s++) {
				if (this.game_state.blocks[b].share_groups[s] == this.share_groups[0]) not_in_my_group = 0;
			}

			if (not_in_my_group == 1) continue;

			num_hints_in_group++;

			console.log('hint ' + num_hints_in_group + ' is at x: ' + this.game_state.blocks[b].x + ' y: ' + this.game_state.blocks[b].y + ' hintype: ' + this.game_state.blocks[b].preset_hint_type + ' mines_seen_xy.length ' + this.game_state.blocks[b].mines_seen_xy.length + ' this hint has ' +this.game_state.blocks[b].x_in_range.length + ' tiles in its range: ');
			console.dir(this.game_state.blocks[b].x_in_range);
			console.dir(this.game_state.blocks[b].y_in_range);

			//console.log('hint in MY group at x: ' +this.game_state.blocks[b].x + '  y: ' + this.game_state.blocks[b].y);

			for (var m = 0; m < this.game_state.blocks[b].mines_seen_xy.length; m++) {
				all_the_mines.push(this.game_state.blocks[b].mines_seen_xy[m]);
			}

			
		}

		console.log('this.share_groups.length ' + this.share_groups.length);
		console.log('this.share_groups[0] ' + this.share_groups[0]);
		console.log('num_hints_in_group ' + num_hints_in_group);
		console.log('all_the_mines.length ' + all_the_mines.length);
		console.dir(all_the_mines);

		console.log('this.share_connect_up ' + this.share_connect_up);
		console.log('this.share_connect_left ' + this.share_connect_left);
		console.log('this.share_connect_down ' + this.share_connect_down);
		console.log('this.share_connect_right ' + this.share_connect_right);

		if (num_hints_in_group <= 1) {
			// error !!!
			
		}

		// a mine in all_the_mines needs to be present X num_hints_in_group
		// i don't think its possible to appear more times than that

		var shared = 0;

		for (var m = 0; m < all_the_mines.length; m++) {
			var num_of_m = 1;
			for (var n = m + 1; n < all_the_mines.length; n++) {
				if (all_the_mines[m].x == all_the_mines[n].x &&
				    all_the_mines[m].y == all_the_mines[n].y) num_of_m++;
			}

			//console.log('num_of_m ' + num_of_m);

			if (num_of_m == num_hints_in_group) shared++;
		}

		this.sharesquare_num = shared;

		console.log('this.sharesquare_num ' + this.sharesquare_num);
	},

	

	show_sharesquare: function () {

		


		if (this.share_groups.length == 0) return;

		if (this.join_group != 0) return;	// blue-joined tiles getting wiped by being in a share group 

		if (this.preset_hint_type != 0) return;

		this.join_sprite_any.update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 									this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size + 1);

		var left = this.share_connect_left;
		var right = this.share_connect_right;
		var up = this.share_connect_up;
		var down = this.share_connect_down;

		

		if (this.sharesquare) {

			console.log('show_sharesquare on x ' +this.x+ ' y ' + this.y);

			if (this.x > 0 && !this.game_state.blocks[this.game_state.tiles[this.x - 1][this.y]].is_in_share_group(this.share_groups[0])) left = false;

			if (this.x < this.game_state.grid_w - 1 && !this.game_state.blocks[this.game_state.tiles[this.x + 1][this.y]].is_in_share_group(this.share_groups[0])) right = false;
		
			if (this.y > 0 && !this.game_state.blocks[this.game_state.tiles[this.x][this.y - 1]].is_in_share_group(this.share_groups[0])) up = false;
			
			if (this.y < this.game_state.grid_h - 1 && !this.game_state.blocks[this.game_state.tiles[this.x][this.y + 1]].is_in_share_group(this.share_groups[0])) down = false;

			if (this.x == 0) left = false;
			if (this.y == 0) up = false;
			if (this.x == this.game_state.grid_w - 1) right = false;
			if (this.y == this.game_state.grid_h - 1) down = false;

			if (up && down && left && right) this.join_sprite_any.set_texture("sharesquare.png");
			else if (!up && !down && left && right) {
				this.join_sprite_any.set_texture("sharesquareUD.png");
				this.join_sprite_any.rotate_ninety();
			} else if (up && down && !left && !right) {
				this.join_sprite_any.set_texture("sharesquareUD.png");
				
			} else if (up && down && left && !right) {
				this.join_sprite_any.set_texture("sharesquareRDL.png");
				this.join_sprite_any.rotate_ninety();
			} else if (up && down && !left && right) {
				this.join_sprite_any.set_texture("sharesquareRDL.png");
				this.join_sprite_any.rotate_ninety();
				this.join_sprite_any.rotate_ninety();
				this.join_sprite_any.rotate_ninety();
			} else if (up && !down && left && right) {
				this.join_sprite_any.set_texture("sharesquareRDL.png");
				this.join_sprite_any.rotate_ninety();
				this.join_sprite_any.rotate_ninety();
			} else if (!up && down && left && right) {
				this.join_sprite_any.set_texture("sharesquareRDL.png");
			} else if (!up && down && !left && right) {
				this.join_sprite_any.set_texture("sharesquareRD.png");
			} else if (!up && down && left && !right) {
				this.join_sprite_any.set_texture("sharesquareRD.png");
				this.join_sprite_any.rotate_ninety();
			} else if (up && !down && left && !right) {
				this.join_sprite_any.set_texture("sharesquareRD.png");
				this.join_sprite_any.rotate_ninety();
				this.join_sprite_any.rotate_ninety();
			} else if (up && !down && !left && right) {
				this.join_sprite_any.set_texture("sharesquareRD.png");
				this.join_sprite_any.rotate_ninety();
				this.join_sprite_any.rotate_ninety();
				this.join_sprite_any.rotate_ninety();
			} else {
				// error - maybe connected to only 1 neighbour - just hide
				this.join_sprite_any.hide();
				this.hint_eye_num_text.update_pos(-999,-999);
			}


			this.hint_eye_num_text.change_text(this.sharesquare_num.toString());

			var text_x = this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size;
			var text_y = this.y*this.game_state.tile_size + 0.25*this.game_state.tile_size;

			this.hint_eye_num_text.update_pos(text_x, 
							  text_y);
			this.hint_eye_num_text.center_x(text_x);
			return;
		}

		

		

		var pos_x = this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size;
		var pos_y = this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size + 1;

		if (left == false && right == false  && up == false && down == false ) this.join_sprite_any.hide();	// all alone?
		else if (left == true && right == true && up == false && down == false) this.join_sprite_any.set_texture("sharejoin_horiz.png");
		else if (left == false && right == false && up == true && down == true) {
			//this.join_sprite_any.set_texture("sharejoin_vert.png");
			this.join_sprite_any.set_texture("sharejoin_horiz.png");
			this.join_sprite_any.rotate_ninety();
		} else if (left == false && right == true && up == true && down == false) {
			this.join_sprite_any.set_texture("sharejoin_UR.png");
			pos_y = pos_y - 13;
			pos_x = pos_x + 13;
			this.join_sprite_any.update_pos(pos_x, 	pos_y);
		} else if (left == true && right == false && up == true && down == false) {
			this.join_sprite_any.set_texture("sharejoin_LU.png");
			pos_y = pos_y - 13;
			pos_x = pos_x - 13;
			this.join_sprite_any.update_pos(pos_x, 	pos_y);
		} else if (left == true && right == false && up == false && down == true) {
			this.join_sprite_any.set_texture ("sharejoin_DL.png");
			pos_y = pos_y + 13;
			pos_x = pos_x - 13;
			this.join_sprite_any.update_pos(pos_x, 	pos_y);
		} else if (left == false && right == true && up == false && down == true) {
			this.join_sprite_any.set_texture("sharejoin_RD.png");
			pos_y = pos_y + 13;
			pos_x = pos_x + 13;
			this.join_sprite_any.update_pos(pos_x, 	pos_y);
		} else this.join_sprite_any.hide();
		
		//this.join_sprite_any.hide();

	},

	identify_mines_in_range: function () {

		if (this.join_group != 0 && this.join_leader == true) this.get_range_for_joined();

		this.mines_seen_xy = [];

		// used for the sharesquare hint
		for (var i = 0; i < this.x_in_range.length; i++) {
			var x = this.x_in_range[i];
			var y = this.y_in_range[i];

			if (this.game_state.get_block_type(this.x_in_range[i], this.y_in_range[i]) == 2) {
				this.mines_seen_xy.push({x: x, y: y});
			}
		}
 
		console.log('this.mines_seen_xy ' + this.mines_seen_xy.length + ' from hint at x ' +this.x + ' y ' + this.y + ' which has in range ' + this.x_in_range.length);
	},

	show_math_stuff : function () {
		if (this.math_group == -1) return;

		this.hint_touch_num_text.update_pos(-999,-999);
		this.hint_eye_num_text.update_pos(-999,-999);
		this.hint_add_num_text.update_pos(-999,-999);
		this.hint_heart_num_text.update_pos(-999,-999);
		this.hint_compass_num_text.update_pos(-999,-999);
		this.hint_crown_num_text.update_pos(-999,-999);
		this.hint_eyebracket_num_text.update_pos(-999,-999);

		var pos_x = this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size - 3;
		var pos_y = this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size + 3;

		this.join_sprite_any.update_pos(pos_x, 	pos_y);

		if (this.math_equalbox == true) {
			if (this.math_connect_left == true) {
				this.join_sprite_any.set_texture("math_joiner_left_equals.png");
				this.join_sprite_any.rotate_ninety();
				this.join_sprite_any.rotate_ninety();
			}
			//else if (this.math_connect_right == true) this.join_sprite_any.set_texture("math_joiner_left_equals.png");
			//else if (this.math_connect_up == true) this.join_sprite_any.set_texture("math_joiner_down_equals.png");
			//else if (this.math_connect_down == true) this.join_sprite_any.set_texture("math_joiner_up_equals.png");

			this.hint_eye_num_text.change_text(this.math_equal_num.toString());

			var text_x = this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size;
			var text_y = this.y*this.game_state.tile_size + 0.25*this.game_state.tile_size + 3;

			this.hint_eye_num_text.update_pos(text_x, 
							  text_y);
			this.hint_eye_num_text.center_x(text_x);
			

		} else if (this.x == 0) {
			// automatically we must be leftmost
			this.join_sprite_any.set_texture("math_joiner_left.png");
		} else if (this.game_state.blocks[this.game_state.tiles[this.x - 1][this.y]].math_group != this.math_group) {
			// left most of this math_group
			this.join_sprite_any.set_texture("math_joiner_left.png");
		} else if (this.math_sign == 1) {
			// plus
			this.join_sprite_any.set_texture("math_joiner_tube_h.png");
		} else if (this.math_sign == -1) {
			// negative
			this.join_sprite_any.set_texture("math_joiner_tube_h_minus.png");
		} else {
			// impossible
		}

		
	},

	calc_math : function () {
		if (this.math_equalbox == false) return;

		var sum = 0;

		for (var b = 0; b < this.game_state.grid_w*this.game_state.grid_h; b++) {
			if (this.game_state.blocks[b].math_group == -1) continue;
			if (this.game_state.blocks[b].math_group == this.math_group) {

				sum += this.game_state.blocks[b].math_sign*this.game_state.blocks[b].stored_hint_num;
			}

		}

		this.math_equal_num = sum;
	},

	propagate_math_group: function (group_num, covered_up) {

		if (group_num == -1) return;

		this.math_group = group_num;
		if (covered_up == true) this.cover();

		if (this.x > 0 && this.math_connect_left == true &&
		    this.game_state.blocks[this.game_state.tiles[this.x-1][this.y]].math_connect_right == true &&
		    this.game_state.blocks[this.game_state.tiles[this.x-1][this.y]].math_group == -1) {

			this.game_state.blocks[this.game_state.tiles[this.x-1][this.y]].propagate_math_group(group_num, covered_up);

		}

		
		if (this.x > 0 && this.math_connect_right == true &&
		    this.game_state.blocks[this.game_state.tiles[this.x+1][this.y]].math_connect_left == true &&
		    this.game_state.blocks[this.game_state.tiles[this.x+1][this.y]].math_group == -1) {

			this.game_state.blocks[this.game_state.tiles[this.x+1][this.y]].propagate_math_group(group_num, covered_up);

		}

	},

	reset_math_stuff: function () {
		this.math_equalbox = false;
		this.math_group = -1;
		this.math_sign = 1; // 1 is +, -1 is -
		this.math_equal_num = 0;

		this.math_connect_left = false;
		this.math_connect_right = false;
		this.math_connect_up = false;	
		this.math_connect_down = false;
	},

	reset_share_stuff: function () {
		this.mines_seen_xy = [];	// [{x:2,y:3}, {x:5,y:1}, ... ]
		this.share_groups = [];	// includes the sharesquare, pipes, and hints
					// hints can belong to multiple share-groups
		this.sharesquare = false;	
		this.sharesquare_num = 0;

		// cosmetic as far as this class knows
		this.share_connect_left = false;
		this.share_connect_right = false;
		this.share_connect_up = false;	
		this.share_connect_down = false;

		this.share_pipe = false;
	},

	reset: function() {
		this.join_group = 0;
		//this.join_h_sprite.hide();
		////this.join_v_sprite.hide();

		this.join_sprite_any.hide();
		this.hint_eye_num_text.update_pos(-999,-999);	// sharesquare num

		this.join_leader = false;	// show the hint - store the range
		this.join_second_leader = false;	// show the number

		this.i_know_join_leader_xy = false;
		this.my_join_leader_x = -1;
		this.my_join_leader_y = -1;


		this.join_h = false;
		this.join_v = false;

		//this.hint_touch_sprite.hide();	// why commented out? why not clear stuff here
		//this.hint_add_sprite.hide();
		//this.hint_eye_num_text.update_pos(-999,-999);

		this.editor_mode = 0;

		this.reset_share_stuff();
		this.reset_math_stuff();

		this.hints_that_see_me = [];
	},

	join_h: false,
	join_v: false,

	set_join_h_sprite: function() {
		this.join_h_sprite.make_vis();
		this.join_h_sprite.update_pos(this.x*this.game_state.tile_size + 1*this.game_state.tile_size, 
					      this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size + 3);

	
		//this.join_screen_sprite.make_vis();
		
	},

	set_join_v_sprite: function() {
		this.join_v_sprite.make_vis();
		this.join_v_sprite.update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 
					     this.y*this.game_state.tile_size + 1*this.game_state.tile_size + 3);

		
		//this.join_screen_sprite.make_vis();
	},

	cover: function() {

		

		this.deselect();

		this.covered_up = true;
		this.flag_on = false;

		

		this.block_sprite.hide();
		//this.block_shadow_sprite.hide();

		if (this.editor_mode == 0) {
			this.hint_eye_sprite.hide();
			this.hint_touch_sprite.hide();
			this.hint_add_sprite.hide();
			this.hint_eight_touch_sprite.hide();
			this.hint_heart_sprite.hide();
			this.hint_compass_sprite.hide();
			this.hint_crown_sprite.hide();
			this.hint_eyebracket_sprite.hide();
			this.join_sprite_any.hide();
			

			this.hint_touch_num_text.update_pos(-999,-999);
			this.hint_eye_num_text.update_pos(-999,-999);
			this.hint_add_num_text.update_pos(-999,-999);
			this.hint_heart_num_text.update_pos(-999,-999);
			this.hint_compass_num_text.update_pos(-999,-999);
			this.hint_crown_num_text.update_pos(-999,-999);
			this.hint_eyebracket_num_text.update_pos(-999,-999);
		}


		

		this.set_type(this.block_type);

		


if (this.editor_mode == 1 && this.block_type == 2) this.put_flag_on();

	},

	show_hint: function(hinttype, hint_) {

		var text_x = this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size;
		var text_y = this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size;

		var icon_x = this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size;
		var icon_y = this.y*this.game_state.tile_size + 0.25*this.game_state.tile_size;


		// for JOINT TILES - leader? is this how i distinguish
		if (this.join_h) {

			var text_x = this.x*this.game_state.tile_size + 1.5*this.game_state.tile_size;
			var text_y = this.y*this.game_state.tile_size + 0.25*this.game_state.tile_size;

			var icon_x = this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size;
			var icon_y = this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size;
				
		} else if (this.join_v) {

			var text_x = this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size;
			var text_y = this.y*this.game_state.tile_size + 1.25*this.game_state.tile_size;

			var icon_x = this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size;
			var icon_y = this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size;

		}


		if (hinttype == 2) {

			this.hint_eye_num_text.change_text(hint_.toString());
			this.hint_eye_num_text.update_pos(text_x, 
							  text_y);
			this.hint_eye_num_text.center_x(text_x);

			this.hint_eye_sprite.make_vis();
			this.hint_eye_sprite.update_pos(icon_x, 
							icon_y);
		} else if (hinttype == 1) {

			this.hint_touch_num_text.change_text(hint_.toString());
			this.hint_touch_num_text.update_pos(text_x, 
							    text_y);
			this.hint_touch_num_text.center_x(text_x);

			this.hint_touch_sprite.make_vis();
			this.hint_touch_sprite.update_pos(icon_x, 
							  icon_y);
		} else if (hinttype == 3) {

			this.hint_add_num_text.change_text(hint_.toString());
			this.hint_add_num_text.update_pos(text_x, 
							  text_y);
			this.hint_add_num_text.center_x(text_x);

			this.hint_add_sprite.make_vis();
			this.hint_add_sprite.update_pos(icon_x, 
							icon_y);
		} else if (hinttype == 4) {
			
			this.hint_touch_num_text.change_text(hint_.toString());
			this.hint_touch_num_text.update_pos(text_x, 
							    text_y);
			this.hint_touch_num_text.center_x(text_x);

			this.hint_eight_touch_sprite.make_vis();
			this.hint_eight_touch_sprite.update_pos(icon_x, 
							        icon_y);
			
		} else if (hinttype == 5) {

			
			
			this.hint_heart_num_text.change_text(hint_.toString());
			this.hint_heart_num_text.update_pos(text_x, 
							  text_y);
			this.hint_heart_num_text.center_x(text_x);

			this.hint_heart_sprite.make_vis();
			this.hint_heart_sprite.update_pos(icon_x, 
							  icon_y);
			
		} else if (hinttype == 11) {

			
			
			this.hint_compass_num_text.change_text(hint_.toString());
			this.hint_compass_num_text.update_pos(text_x, 
							  text_y);
			this.hint_compass_num_text.center_x(text_x);

			this.hint_compass_sprite.make_vis();
			this.hint_compass_sprite.update_pos(icon_x, 
							  icon_y);
			
		} else if (hinttype == 12) {

			//alert('this.hint_compass_num_text ' + hint_.toString());
			
			this.hint_crown_num_text.change_text(hint_.toString());
			this.hint_crown_num_text.update_pos(text_x, 
							  text_y);
			this.hint_crown_num_text.center_x(text_x);

			this.hint_crown_sprite.make_vis();
			this.hint_crown_sprite.update_pos(icon_x, 
							  icon_y);
			
		} else if (hinttype == 13) {

			//alert('this.hint_compass_num_text ' + hint_.toString());
			
			this.hint_eyebracket_num_text.change_text(hint_.toString());
			this.hint_eyebracket_num_text.update_pos(text_x, 
							  text_y);
			this.hint_eyebracket_num_text.center_x(text_x);

			this.hint_eyebracket_sprite.make_vis();
			this.hint_eyebracket_sprite.update_pos(icon_x, 
							  icon_y);
			
		}
	},

	stored_crown_num: 0,

	calc_hint: function(hinttype) {


		var num = 0;

		this.x_in_range = [];
		this.y_in_range = [];

		if (hinttype == 2) {
			num = this.calc_hint_eye_num();

		} else if (hinttype == 1) {
			num = this.calc_hint_touch_num();

		} else if (hinttype == 3) {
			this.calc_hint_eye_num();
			this.calc_hint_touch_num();

			num = this.hint_add_num = this.hint_touch_num + this.hint_eye_num;

		} else if (hinttype == 4) {
			num = this.calc_hint_eight_touch_num();
			
			
		} else if (hinttype == 5) {
			var only_count_lonely_mines = true;
			num = this.calc_hint_eye_num(only_count_lonely_mines);
			
			
		} else if (hinttype == 6) {
			
			
			
		} else if (hinttype == 11) {
			var only_count_lonely_mines = false;
			var count_directions_with_mines = true;
			num = this.calc_hint_eye_num(only_count_lonely_mines, count_directions_with_mines ); // get range
			
			
		}  else if (hinttype == 12) {
			var only_count_lonely_mines = false;
			var count_directions_with_mines = false;
			var count_highest_sequence = true;
			num = this.calc_hint_eye_num(only_count_lonely_mines, count_directions_with_mines, count_highest_sequence ); // get range

			this.stored_crown_num = num;
			
			
		}  else if (hinttype == 13) {

			// counts groups - eyebracket

			var only_count_lonely_mines = false;
			var count_directions_with_mines = false;
			var count_highest_sequence = false;
			var only_count_groups = true;
			num = this.calc_hint_eye_num(only_count_lonely_mines, count_directions_with_mines, count_highest_sequence , only_count_groups); // get range
			
			
		}

		

		return num;
	},

	join_leader: false,	// show the hint - 
	join_second_leader: false,	// show the number

	i_know_join_leader_xy: false,
	my_join_leader_x: -1,
	my_join_leader_y: -1,

	uncover_math: function() {

		
	
		this.take_flag_off();
		
		if (this.block_type == 1) return;	// wall
		this.deselect();
		this.covered_up = false;
		this.flag_on = false;
		this.set_type(this.block_type);

		var hint_ = this.calc_hint(this.preset_hint_type);
		
		this.show_hint(this.preset_hint_type, hint_);

		this.stored_hint_num = hint_;

		this.show_math_stuff();
	},

	uncover_joined: function() {

		this.join_sprite_any.make_vis();
	
		this.take_flag_off();
		if (this.block_type == 1) return;	// wall
		this.deselect();
		this.covered_up = false;
		this.flag_on = false;
		this.set_type(this.block_type);
	},

	uncover_shared: function() {

		

		if (this.sharesquare == true ||
		    this.share_pipe == true) this.join_sprite_any.make_vis();

		
	
		this.take_flag_off();
		//if (this.block_type == 1) return;	// wall
		this.deselect();
		this.covered_up = false;
		this.flag_on = false;
		this.set_type(this.block_type);

		if (this.preset_hint_type != 0) {
			var hint_ = this.calc_hint(this.preset_hint_type);
		
			this.show_hint(this.preset_hint_type, hint_);

			this.stored_hint_num = hint_;

		} else if (this.sharesquare == true) {
			console.log('uncover_shared...');
			this.calc_sharesquare();
			
		}

		
		this.show_sharesquare();	// applies to pipes + square
	},

	is_in_share_group: function(group_num) {

		if (this.join_group != 0 && this.i_know_join_leader_xy == true) {
			var ask_leader = this.game_state.blocks[this.game_state.tiles[this.my_join_leader_x][this.my_join_leader_y]].is_in_share_group(group_num);
			return ask_leader;
		}

		


		for (var s = 0; s < this.share_groups.length; s++) {
			if (group_num == this.share_groups[s]) return true;
		}

		return false;
	},


	uncover: function (show_hint) {


		this.take_flag_off();

		if (this.block_type == 1) return;	// wall

		this.deselect();

		this.covered_up = false;
		this.flag_on = false;
		this.set_type(this.block_type);

		var join_add = 0;

		
		if (this.join_group != 0) {

			this.join_sprite_any.make_vis();

			var leader_x = -1;
			var leader_y = -1;
			var leader_b = -1;

			var sec_leader_x = -1;
			var sec_leader_y = -1;
			var sec_leader_b = -1;

			var hint_type = -1;

			for (var b = 0; b < this.game_state.grid_w*this.game_state.grid_h; b++) {
				
				if (this.game_state.blocks[b].join_group == this.join_group) {
					if (this.game_state.blocks[b].covered_up == true) this.game_state.blocks[b].uncover_joined();

					//if (this.preset_hint_type != 0) join_add = this.game_state.blocks[b].calc_hint(this.preset_hint_type);

					

					if (this.game_state.blocks[b].preset_hint_type > 0) {
						hint_type = this.game_state.blocks[b].preset_hint_type;

						
					}

					if (this.game_state.blocks[b].join_leader == true) {
						leader_x = this.game_state.blocks[b].x;
						leader_y = this.game_state.blocks[b].y;
						leader_b = b;
						//hint_type = this.game_state.blocks[b].preset_hint_type;
					} else if (this.game_state.blocks[b].join_second_leader == true) {
						sec_leader_x = this.game_state.blocks[b].x;
						sec_leader_y = this.game_state.blocks[b].y;
						sec_leader_b = b;
					}

				} 
			} // blocks


			if (leader_b == -1) return;

			this.game_state.blocks[leader_b].calc_hint(hint_type);


			// now combine the ranges of all in this group
			for (var b = 0; b < this.game_state.grid_w*this.game_state.grid_h; b++) {
				if (this.game_state.blocks[b].join_group == this.join_group && b != leader_b) {

					var otherx = this.game_state.blocks[b].x;
					var othery = this.game_state.blocks[b].y;	
					this.game_state.blocks[b].calc_hint(hint_type);	// stores range	

					// so... calc_hint on join leader, wipes range...

					this.game_state.blocks[leader_b].include_range_of_joined_tile(otherx, othery);


				}

			} // blocks

			if (this.game_state.blocks[leader_b].x < this.game_state.blocks[sec_leader_b].x) {
				this.game_state.blocks[leader_b].join_h = true;
			} else {
				this.game_state.blocks[leader_b].join_v = true;
			}

			var hint_ = 0;
			
			
			// for certain hint types we need a different approach - get the max of the individual tiles
			if (hint_type == 12) {
				// crown - get best of this group
				for (var b = 0; b < this.game_state.grid_w*this.game_state.grid_h; b++) {
					if (this.game_state.blocks[b].join_group != this.join_group) continue;

					if (this.game_state.blocks[b].stored_crown_num > hint_) hint_ = this.game_state.blocks[b].stored_crown_num;
				}
			} else {
	
			
				// calc_hint_from_range just counts the mines in range
				// then how is this working for hearts?
				// IN calc_hint_eye_num, if we're only counting lonely mines, only lonely mines get added to range
				hint_ = this.game_state.blocks[leader_b].calc_hint_from_range();	// use range


			}

			this.game_state.blocks[leader_b].show_hint(hint_type, hint_);

			this.stored_hint_num = hint_;


			// 
			this.game_state.blocks[leader_b].mines_seen_xy = [];
			this.game_state.blocks[leader_b].identify_mines_in_range();


			return;

		}

		if (this.share_groups.length == 1 && this.preset_hint_type == 0) {
			// its possible for a hint that belongs to a share clue to be uncovered while the share clue is covered
			// but not vice versa

			//alert('uncovered a share group tile ' + this.share_groups[0]);

			var share_group = this.share_groups[0];

			this.uncover_shared();

			for (var b = 0; b < this.game_state.grid_w*this.game_state.grid_h; b++) {

				//if (this.game_state.blocks[b].covered_up == false) continue;

				for (var s = 0; s < this.game_state.blocks[b].share_groups.length; s++) {

					if (this.game_state.blocks[b].share_groups[s] != share_group) continue;

					this.game_state.blocks[b].uncover_shared();	

					// may be blue-join tiles on the ends of this share-tentacle:
					if (this.game_state.blocks[b].join_group != 0) this.game_state.blocks[b].uncover();
				}

				
			}

			
			 
		}

		if (this.math_group != -1) {
			//var hint_ = this.calc_hint(this.preset_hint_type);

			//this.stored_hint_num = hint_;

			this.uncover_math();
			
			for (var b = 0; b < this.game_state.grid_w*this.game_state.grid_h; b++) {

				if (this.game_state.blocks[b].covered_up == false) continue; // excludes this entity, so gotta call uncover_math as above 

				

				if (this.game_state.blocks[b].math_group != this.math_group) continue;

				this.game_state.blocks[b].uncover_math();	
				
			}
			
			return;

		} // math_group

		if (this.block_type == 2 || show_hint == false) {
			return;		// dont show the hint
		}

		var hint_ = this.calc_hint(this.preset_hint_type);
		
		this.show_hint(this.preset_hint_type, hint_);

		this.stored_hint_num = hint_;

		
	},

	get_range_for_joined : function () {
		if (this.join_leader == false) return;

		console.log('get_range_for_joined ' + this.x + ' ' + this.y);

		this.calc_hint(this.preset_hint_type);  // wipes and recalcs range


			// now combine the ranges of all in this group
			for (var b = 0; b < this.game_state.grid_w*this.game_state.grid_h; b++) {
				if (this.game_state.blocks[b].join_group == this.join_group && 
					(this.game_state.blocks[b].x != this.x || this.game_state.blocks[b].y != this.y)) {

					var otherx = this.game_state.blocks[b].x;
					var othery = this.game_state.blocks[b].y;	
					this.game_state.blocks[b].calc_hint(this.preset_hint_type);	// stores range	

					// so... calc_hint on join leader, wipes range...

					this.include_range_of_joined_tile(otherx, othery);


				}

			} // blocks
	},

	calc_hint_from_range: function () {
		var num = 0;
		for (var i = 0; i < this.x_in_range.length; i++) {
			if (this.game_state.get_block_type(this.x_in_range[i], this.y_in_range[i]) == 2) num++;

		}

		//alert('calc_hint_from_range this.present_hint_type' + this.preset_hint_type + ' num ' + num );
		return num;

	},

	olduncover: function (show_hint) {

		this.take_flag_off();

		if (this.block_type == 1) return;	// wall

		this.deselect();

		

		this.covered_up = false;
		this.flag_on = false;
		this.set_type(this.block_type);

		var join_add = 0;

		if (this.join_group != 0) {

			// 
		
			if (this.join_h == true) {
				//this.set_join_h_sprite();
			}

			if (this.join_v == true) {
				//this.set_join_v_sprite();
			}

			// only the 'leader' tile has join_h or join_v

			if (this.join_h == false && this.join_v == false) {

			}

			for (var b = 0; b < this.game_state.grid_w*this.game_state.grid_h; b++) {
				if (this.game_state.blocks[b].join_group == this.join_group) {
					if (this.game_state.blocks[b].covered_up == true) this.game_state.blocks[b].uncover();

					if (this.preset_hint_type != 0) join_add  = this.game_state.blocks[b].calc_hint(this.preset_hint_type);

				}
			}

			if (this.preset_hint_type == 2) {
				// for the case of EYE hint, we need to avoid counting the same mine 2x
				// therefore, find out how many mines are in our 'axis', then subtract from join_add
				// calc_hint_eye_num: function (only_count_lonely_mines, only_horiz, only_vert)
				var only_horiz = false;
				var only_vert = false;
				if (this.join_h == true) {
					var only_horiz = true;
				} else if (this.join_v == true) {
					var only_vert = true;
				}

				join_add -= this.calc_hint_eye_num(false, only_horiz, only_vert);

			}
		}

		if (this.block_type == 2 || show_hint == false) {
			return;		// dont show the hint
		}

		var hint_ = this.calc_hint(this.preset_hint_type);
		hint_ += join_add;
		
		this.show_hint(this.preset_hint_type, hint_);

		// graphically - need to rearrage things for joint tiles
		if (this.join_group != 0) {

			//this.hint_eye_sprite.update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 
			//				        this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size);

			//this.hint_touch_sprite.update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 
			//				        this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size);

			// leader? is this how i distinguish
			if (this.join_h) {
				
			} else if (this.join_v) {

			}
		}
		
		return;

		
	},

	preset_hint_type: 0,

	preset_hint: function (hinttype) {
		// 1 touch
		// 2 see
		// 3 touch + see
		// 4 eight touch
		// 5 heart - like eye but sees only lonely mines

		this.preset_hint_type = hinttype;

		this.happy = false;
	},

	inform_tiles_in_range : function () {
		for(var i = 0; i < this.x_in_range.length; i++) {
			var x = this.x_in_range[i];
			var y = this.y_in_range[i];

			this.game_state.blocks[this.game_state.tiles[x][y]].hints_that_see_me.push({x: this.x, y: this.y});
		}

		
	},

	calc_hint_eight_touch_num: function() {

		// double using this variable, hope thats okay
		this.calc_hint_touch_num();

		var mines_touching = 0;

		if (this.game_state.get_block_type(this.x - 1, this.y - 1) == 2) mines_touching++;
		if (this.game_state.get_block_type(this.x + 1, this.y - 1) == 2) mines_touching++;
		if (this.game_state.get_block_type(this.x + 1, this.y + 1) == 2) mines_touching++;
		if (this.game_state.get_block_type(this.x - 1, this.y + 1) == 2) mines_touching++;

		if (this.x - 1 >= 0 && this.y - 1 >= 0) {
			this.x_in_range.push(this.x - 1);
			this.y_in_range.push(this.y - 1);
		}

		if (this.x < this.game_state.grid_w - 1 && this.y - 1 >= 0) {
			this.x_in_range.push(this.x + 1);
			this.y_in_range.push(this.y - 1);
		}		

		if (this.x < this.game_state.grid_w - 1 && this.y < this.game_state.grid_h - 1) {
			this.x_in_range.push(this.x + 1);
			this.y_in_range.push(this.y + 1);
		}

		if (this.x - 1 >= 0 && this.y < this.game_state.grid_h - 1) {
			this.x_in_range.push(this.x - 1);
			this.y_in_range.push(this.y + 1);
		}

		// PLUS equals
		this.hint_touch_num += mines_touching;

		return this.hint_touch_num;
	},

	calc_hint_touch_num: function () {
		var mines_touching = 0;

		if (this.x > 0 && this.game_state.get_block_type(this.x - 1, this.y) == 2) mines_touching++;
		if (this.y > 0 && this.game_state.get_block_type(this.x, this.y - 1) == 2) mines_touching++;
		if (this.x < this.game_state.grid_w - 1 && this.game_state.get_block_type(this.x + 1, this.y) == 2) mines_touching++;
		if (this.y < this.game_state.grid_h - 1 && this.game_state.get_block_type(this.x, this.y + 1) == 2) mines_touching++;

		//if (this.game_state.get_block_type(this.x - 1, this.y - 1) == 2) mines_touching++;
		//if (this.game_state.get_block_type(this.x + 1, this.y - 1) == 2) mines_touching++;
		//if (this.game_state.get_block_type(this.x + 1, this.y + 1) == 2) mines_touching++;
		//if (this.game_state.get_block_type(this.x - 1, this.y + 1) == 2) mines_touching++;

		if (this.x > 0) {
			this.x_in_range.push(this.x - 1);
			this.y_in_range.push(this.y);
		}

		if (this.x < this.game_state.grid_w - 1) {
			this.x_in_range.push(this.x + 1);
			this.y_in_range.push(this.y);
		}

		if (this.y < this.game_state.grid_h - 1) {
			this.x_in_range.push(this.x);
			this.y_in_range.push(this.y + 1);
		}

		if (this.y > 0) {
			this.x_in_range.push(this.x);
			this.y_in_range.push(this.y - 1);
		}

		this.hint_touch_num = mines_touching;

		return mines_touching;
	},

	is_flag_lonely: function() {
		if (this.x > 0 && (this.game_state.blocks[this.game_state.tiles[this.x-1][this.y]].flag_on ||
				   this.game_state.blocks[this.game_state.tiles[this.x-1][this.y]].covered_up)) return false;

		if (this.x < this.game_state.grid_w - 1 && (this.game_state.blocks[this.game_state.tiles[this.x+1][this.y]].flag_on ||
				   this.game_state.blocks[this.game_state.tiles[this.x+1][this.y]].covered_up)) return false;

		if (this.y > 0 && (this.game_state.blocks[this.game_state.tiles[this.x][this.y-1]].flag_on ||
				   this.game_state.blocks[this.game_state.tiles[this.x][this.y-1]].covered_up)) return false;

		if (this.y < this.game_state.grid_h - 1 && (this.game_state.blocks[this.game_state.tiles[this.x][this.y+1]].flag_on ||
				   this.game_state.blocks[this.game_state.tiles[this.x][this.y+1]].covered_up)) return false;
	},

	is_lonely: function() {
		if (this.x > 0 && this.game_state.get_block_type(this.x - 1,this.y) == 2) return false;

		if (this.x < this.game_state.grid_w - 1 && this.game_state.get_block_type(this.x + 1,this.y) == 2) return false;

		if (this.y > 0 && this.game_state.get_block_type(this.x,this.y - 1) == 2) return false;

		if (this.y < this.game_state.grid_h - 1 && this.game_state.get_block_type(this.x,this.y + 1) == 2) return false;

		return true; // so lonely

		// diag
		if (this.x > 0 && this.y > 0 && this.game_state.get_block_type(this.x - 1,this.y - 1) == 2) return false;

		if (this.x < this.game_state.grid_w - 1 && this.y > 0 && this.game_state.get_block_type(this.x + 1,this.y - 1) == 2) return false;

		if (this.x < this.game_state.grid_w - 1 && this.y < this.game_state.grid_h - 1 && this.game_state.get_block_type(this.x + 1,this.y + 1) == 2) return false;

		if (this.y > 0 && this.y < this.game_state.grid_h - 1 && this.game_state.get_block_type(this.x - 1,this.y + 1) == 2) return false;

		return true; // so lonely

	},

	calc_hint_eye_num: function (only_count_lonely_mines, only_count_directions, count_highest_sequence, only_count_groups) {

		var only_vert = false;
		var only_horiz = false;
	
		if (only_count_directions == null) only_count_directions = false;
		if (only_count_lonely_mines == null) only_count_lonely_mines = false;
		if (only_horiz == null) only_horiz = false;
		if (only_vert == null) only_vert = false;
		if (only_count_groups == null) only_count_groups = false;

		var mines_seen = 0;
		// look up

		var left_= 0;
		var right_= 0;
		var up_= 0;
		var down_ = 0;

		var best_sequence = 0;
		var current_sequence = 0;

		var num_groups = 0;

		for (var y = this.y; y >= 0; y--) {
			if (only_horiz == true) break;
			var tile_ = this.game_state.get_block_type(this.x,y);
			if (only_count_lonely_mines == true && tile_ == 2 &&
			    this.game_state.blocks[this.game_state.tiles[this.x][y]].is_lonely() == false) continue;


			if (tile_ != 2) {

				


				best_sequence = Math.max(best_sequence, current_sequence);
				current_sequence = 0;
			}

			if (tile_ == 2) {

				if (current_sequence == 0) num_groups++;

				current_sequence++;
				best_sequence = Math.max(best_sequence, current_sequence);
				mines_seen++;
				up_ = 1;
			} else if (tile_ == 1) break;

			this.x_in_range.push(this.x);
			this.y_in_range.push(y);
		}

		// look left
		for (var x = this.x; x >= 0; x--) {
			if (only_vert == true) break;
			var tile_ = this.game_state.get_block_type(x,this.y);
			if (only_count_lonely_mines == true && tile_ == 2 &&
			    this.game_state.blocks[this.game_state.tiles[x][this.y]].is_lonely() == false) continue;

			if (tile_ != 2) {
				best_sequence = Math.max(best_sequence, current_sequence);
				current_sequence = 0;
			}

			if (tile_ == 2) {

				if (current_sequence == 0) num_groups++;

				current_sequence++;
				best_sequence = Math.max(best_sequence, current_sequence);
				mines_seen++;
				left_ = 1;
			} else if (tile_ == 1) break;

	
			this.x_in_range.push(x);
			this.y_in_range.push(this.y);
		}

		// look right
		for (var x = this.x; x < this.game_state.grid_w; x++) {
			if (only_vert == true) break;
			var tile_ = this.game_state.get_block_type(x, this.y);
			if (only_count_lonely_mines == true && tile_ == 2 &&
			    this.game_state.blocks[this.game_state.tiles[x][this.y]].is_lonely() == false) continue;

			if (tile_ != 2) {
				best_sequence = Math.max(best_sequence, current_sequence);
				current_sequence = 0;
			}

			if (tile_ == 2) {

				if (current_sequence == 0) num_groups++;

				current_sequence++;
				best_sequence = Math.max(best_sequence, current_sequence);
				mines_seen++;
				right_ = 1;
			} else if (tile_ == 1) break;


			this.x_in_range.push(x);
			this.y_in_range.push(this.y);
		}

		// look down
		for (var y = this.y; y < this.game_state.grid_h; y++) {
			if (only_horiz == true) break;
			var tile_ = this.game_state.get_block_type(this.x,y);
			if (only_count_lonely_mines == true && tile_ == 2 &&
			    this.game_state.blocks[this.game_state.tiles[this.x][y]].is_lonely() == false) continue;

			if (tile_ != 2) {
				best_sequence = Math.max(best_sequence, current_sequence);
				current_sequence = 0;
			}

			if (tile_ == 2) {

				if (current_sequence == 0) num_groups++;

				current_sequence++;
				best_sequence = Math.max(best_sequence, current_sequence);
				mines_seen++;
				down_ = 1;
			} else if (tile_ == 1) break;


			this.x_in_range.push(this.x);
			this.y_in_range.push(y);
		}

		this.hint_eye_num = mines_seen;

		if (count_highest_sequence == true) return best_sequence;

		if (only_count_groups == true) return num_groups;

		if (only_count_directions == true) {
			var dirs_ = up_ + down_ + left_ + right_;
			//alert('only directions ' + dirs_);
			return dirs_;
		}

		return mines_seen;
	},

	set_position_grid: function(x,y) {
		this.x = x;
		this.y = y;


		if (x == -1) {
			this.block_sprite.hide();
			//this.block_shadow_sprite.hide();
			this.flag_sprite.hide();
			this.join_sprite_any.hide();
		} else {
			this.block_sprite.make_vis();
			//this.block_shadow_sprite.make_vis();
			//this.flag_sprite.make_vis();

			

			this.block_blink_sprite.update_pos(x*this.game_state.tile_size + 0.5*this.game_state.tile_size, y*this.game_state.tile_size + 0.5*this.game_state.tile_size);

			

			this.block_sprite.update_pos(x*this.game_state.tile_size + 0.5*this.game_state.tile_size, y*this.game_state.tile_size + 0.5*this.game_state.tile_size);
			

			this.flag_sprite.update_pos(x*this.game_state.tile_size + 0.5*this.game_state.tile_size, y*this.game_state.tile_size + 0.5*this.game_state.tile_size);
		}

		

	},

	grey_status: 0,

	ungrey: function () {

		this.grey_status = 0;

		this.player_grey = 0;

		this.hint_eye_num_text.set_alpha(1);
		this.hint_eye_sprite.set_alpha(1);

		this.hint_touch_num_text.set_alpha(1);
		this.hint_touch_sprite.set_alpha(1);

		this.hint_eight_touch_sprite.set_alpha(1);

		this.hint_add_sprite.set_alpha(1);
		this.hint_add_num_text.set_alpha(1);

		
		this.hint_heart_num_text.set_alpha(1);

		this.hint_heart_sprite.set_alpha(1);

		this.hint_crown_sprite.set_alpha(1);
		this.hint_compass_sprite.set_alpha(1);
		this.hint_eyebracket_sprite.set_alpha(1);

		this.hint_crown_num_text.set_alpha(1);
		this.hint_compass_num_text.set_alpha(1);
		this.hint_eyebracket_num_text.set_alpha(1);
	},

	grey_out: function () {

		this.grey_status = 1;
		
		this.hint_eye_num_text.set_alpha(0.5);
		this.hint_eye_sprite.set_alpha(0.5);

		this.hint_touch_num_text.set_alpha(0.5);
		this.hint_touch_sprite.set_alpha(0.5);

		this.hint_add_sprite.set_alpha(0.5);
		this.hint_add_num_text.set_alpha(0.5);

		this.hint_eight_touch_sprite.set_alpha(0.5);

		this.hint_heart_num_text.set_alpha(0.5);

		this.hint_heart_sprite.set_alpha(0.5);

		this.hint_crown_sprite.set_alpha(0.5);
		this.hint_compass_sprite.set_alpha(0.5);
		this.hint_eyebracket_sprite.set_alpha(0.5);

		this.hint_crown_num_text.set_alpha(0.5);
		this.hint_compass_num_text.set_alpha(0.5);
		this.hint_eyebracket_num_text.set_alpha(0.5);
	},

	x_in_range: [],
	y_in_range: [],

	happy: false,

	player_grey: 0,

	calc_happiness: function () {

		if (this.math_group != -1) return;

		if (this.player_grey == 1) return;  // player set to grey

		if (this.preset_hint_type == 3) {
			var undugs_ = 0;
			//if (this.x > 0 && this.game_state.get_block_type(this.x - 1,this.y))

		}

		if (this.preset_hint_type == 0 || this.covered_up == true || this.block_type == 1)  return;

		if (this.preset_hint_type == 5) return;

		//if (this.preset_hint_type != 2 && this.preset_hint_type != 1 && this.preset_hint_type != 4) return;
		if (this.join_group != 0 && this.join_leader == false) {
				
				return;
			
		} 

		

		var hint_ = this.stored_hint_num;//this.calc_hint(this.preset_hint_type);

		var actual = 0;

		var still_undug = 0;

		var lonely_ = 0;

		for (var i = 0; i < this.x_in_range.length; i++) {

			var x = this.x_in_range[i];
			var y = this.y_in_range[i];

			

			if (x < 0 || y < 0 || x >= this.game_state.grid_w || y >= this.game_state.grid_h ) return;

			if (x == null || x == undefined || y == null || y == undefined) return


			if (this.game_state.get_block_type(x,y) == 1) continue; // wall

			var flagged_ = this.game_state.blocks[this.game_state.tiles[x][y]].flag_on;

			if (flagged_ == true) actual++;

			var covered_ = this.game_state.blocks[this.game_state.tiles[x][y]].covered_up;

			if (covered_ == true && flagged_ == false) {
				still_undug++;	
				
			}			

			if (this.preset_hint_type == 5 && flagged_ == true) {

				
				var lone = this.game_state.blocks[this.game_state.tiles[x][y]].is_flag_lonely();

				if (lone == true) lonely_++;

			}
		}

		//console.log('still_undug ' + still_undug + ' this.preset_hint_type ' + this.preset_hint_type + ' hintnum ' + hint_ + ' this.x_in_range ' + this.x_in_range.length );

		if (hint_ == actual) this.happy = true;
		else this.happy = false;

				

		if (this.preset_hint_type == 5) this.happy = false;
		if (this.preset_hint_type == 5 && still_undug == 0) this.happy = true;
		if (this.preset_hint_type == 5 && hint_ != lonely_) this.happy = false;

		//if (this.preset_hint_type == 12 && still_undug == 0) this.happy = true;

		if (still_undug > 0) this.happy = false;

		

		if (this.happy) {


			this.grey_out();
			//if (this.preset_hint_type == 2) this.hint_eye_sprite.set_texture('button_eye_happy.png');
			//if (this.preset_hint_type == 4) this.hint_eight_touch_sprite.set_texture('button_dotted_happy.png');
		} else {
			
			this.ungrey();
			//if (this.preset_hint_type == 2) this.hint_eye_sprite.set_texture('button_eye.png');
			//if (this.preset_hint_type == 4) this.hint_eight_touch_sprite.set_texture('button_dotted.png');
		}

		
	},

	get_type: function() {
		return this.block_type;
	},

	show_grid: false,

	set_type: function(gemtype) {

		this.block_type = gemtype;
		

		if (gemtype == 1) this.covered_up = false;	// its a wall

		if (this.covered_up == true) {

			this.block_sprite.make_vis();
			//this.block_shadow_sprite.make_vis();

			//this.block_shadow_sprite.set_texture('block2_shadow.png');

			if (this.editor_mode == 1) {
				this.block_sprite.set_texture('qn_half.png');
				//this.block_shadow_sprite.hide();
			} else this.block_sprite.set_texture('g_block2.png');

			
			//this.block_blink_sprite.set_texture(g_block_blink_sprites[gemtype]);

			
			if (this.flag_on == true) {
				this.flag_sprite.make_vis();
				this.block_sprite.hide();
			} else {
				this.flag_sprite.hide();
				this.block_sprite.make_vis();
			}

			return;
		}

		
		if (gemtype == 0) {
			if (this.show_grid == false) this.block_sprite.hide();
			else this.block_sprite.set_texture('griddot.png');
			return;
		}


		
		this.block_sprite.make_vis();
		

		this.block_sprite.set_texture(g_block_sprites[gemtype]);

		//this.block_blink_sprite.set_texture(g_block_blink_sprites[gemtype]);

		
	},

	

	// only called when effects are being done
	draw: function() {
		

	}

});



//--------------------------------------------------------------------------------------
//
//	Entities
//
//
//----------------------------------------------------------------------------------




EntityClass = Class.extend({
	
	pooled: null,

	pos : {x:0,y:0},	// Can be referenced by child classes
	prev_pos: {x:null,y:null},

	tile: {x:0,y:0},

	currSpriteName : null,

	attacker: false,

	_killed : false,

	pool_next_frame: false,

	update : function() {	// Can be overloaded by child functions

		this.prev_pos['x'] = this.pos['x'];		// Save old position
		this.prev_pos['y'] = this.pos['y'];
		this.behavior.go(this);

	},

	turn: function() {},
	
	draw : function() {
        	if(!this.currSpriteName) return;
		
		drawSprite(this.currSpriteName, this.tile.x*this.game_state.tile_size - map_x, this.tile.y*this.game_state.tile_size - map_y);
    	},

	kill : function () {
		this._killed = true;

		//if(this.game_state.entity_map[this.tile.x][this.tile.y] == this) {
		//	this.game_state.entity_map[this.tile.x][this.tile.y] = null;
		//}

		this.clean_up();	// Maybe should be called by removeEntity
	},

	

	clean_up:function() {
	}

});

// Global entity factory
g_entity_factory = {};

// LandmineClass.js

LandmineClass = EntityClass.extend({});

g_entity_factory['Landmine'] = LandmineClass;




pBar.value += 10;
