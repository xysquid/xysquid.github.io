g_tetro_shapes = [
	// coming sooooon
	[[1,1,0,0],
	[1,1,0,0],
	[0,0,0,0],
	[0,0,0,0],],

	[[1,0,0,0],
	[1,1,1,0],
	[0,0,0,0],
	[0,0,0,0],],

	[[0,0,1,0],
	[1,1,1,0],
	[0,0,0,0],
	[0,0,0,0],],

	[[1,0,0,0],
	[1,0,0,0],
	[1,0,0,0],
	[1,0,0,0],],

	[[1,0,0,0],
	[1,1,0,0],
	[1,0,0,0],
	[0,0,0,0],],	

];

g_wall_patterns = [

	[[0,0,0,0,0],
	[0,0,0,0,0],
	[0,0,1,0,0],
	[0,0,0,0,0],
	[0,0,0,0,0]],

	[[0,0,0,0,0],
	[0,1,0,1,0],
	[0,0,0,0,0],
	[0,1,0,1,0],
	[0,0,0,0,0]],

	[[0,0,0,0,0],
	[0,1,0,1,0],
	[0,0,0,0,0],
	[0,0,1,0,0],
	[0,0,0,0,0]],

	
	[[0,0,1,0,0],
	[1,0,0,0,0],
	[0,0,0,1,0],
	[0,1,0,0,0],
	[0,0,0,0,1]],

	
	[[0,0,1,0,0],
	[0,0,1,0,0],
	[0,0,1,0,0],
	[0,0,0,0,0],
	[0,0,0,0,0]],

	[[0,0,0,0,0],
	[0,1,1,1,0],
	[0,0,0,0,0],
	[0,1,1,1,0],
	[0,0,0,0,0]],

	[[0,0,0,0,0],
	[0,0,0,0,0],
	[0,1,1,1,0],
	[0,0,0,0,0],
	[0,0,0,0,0]],

	[[0,0,0,0,0],
	[0,0,1,0,0],
	[0,1,1,1,0],
	[0,0,1,0,0],
	[0,0,0,0,0]],
];

rotate_wall_pattern = function (pattern) {
	//g_wall_patterns[pattern][x][y]
	for (var x = 0; x < 5; x++) {
		for (var y = 0; y < 5; y++) {

		}
	}
};

flip_wall_pattern = function (pattern) {

};

g_multi_sprite_cover = {
	1: "g_block2.png",
	2: "g_block2_double.png",
};

g_multi_sprite_flag = {
	1: "flagblock.png",
	2: "flagblock_double.png",
};

g_block_sprites = {
	0: "blockempty",
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

OnFlagEffect = Class.extend({
	game_state: null,

	sprite_up: null,
	sprite_down: null,
	sprite_left: null,
	sprite_right: null,

	grow_circle: null,
	big_circle: null,

	timer: 0,

	max_radius: 0,

	init : function (game_state) {
		this.game_state = game_state;

		this.sprite_up = new SpriteClass();
		this.sprite_down = new SpriteClass();
		this.sprite_left = new SpriteClass();
		this.sprite_right = new SpriteClass();

		this.sprite_up.setup_sprite('redflag.png', Types.Layer.HUD);
		this.sprite_down.setup_sprite('redflag.png', Types.Layer.HUD);
		this.sprite_left.setup_sprite('redflag.png', Types.Layer.HUD);
		this.sprite_right.setup_sprite('redflag.png', Types.Layer.HUD);
			
		this.sprite_up.hide();
		this.sprite_down.hide();
		this.sprite_left.hide();
		this.sprite_right.hide();

		this.max_radius = this.game_state.tile_size*1.25;
		this.max_radius += 0.25*this.game_state.tile_size;

		this.big_circle = new CircleClass(Types.Layer.HUD, "0xD94699", this.max_radius, false);  // layer, colour, radius, filled

		this.grow_circle = new CircleClass(Types.Layer.HUD, "0xD94699", 1, true);  // layer, colour, radius, filled
		
		this.big_circle.update_pos(-999,-999);
		this.grow_circle.update_pos(-999,-999);

		this.cancel();
	},

	

	

	x_start: 0,
	y_start: 0,

	x_off: 0,
	y_off: 0,

	timer_max: 15,

	go : function (xtile, ytile, timerset) {

		

		if (g_hold_to_flag == false && g_click_to_dig == false) return;
		if (g_click_to_dig == false) return;
		if (g_hold_to_flag == false) return;

		if (xtile < 0 || ytile < 0 ||
		    xtile >= this.game_state.grid_w || ytile >= this.game_state.grid_h) return;

		if (this.game_state.blocks[this.game_state.tiles[xtile][ytile]].covered_up == false) return;

		this.timer = timerset;
		this.timer_max = timerset;

		var x = xtile*this.game_state.tile_size + 0.5*this.game_state.tile_size;
		var y = ytile*this.game_state.tile_size + 0.5*this.game_state.tile_size;

		this.x_start = x;
		this.y_start = y;

		this.pop_scale = 1;

		return;

		this.sprite_up.update_pos(x, y);
		this.sprite_down.update_pos(x, y);
		this.sprite_left.update_pos(x, y);
		this.sprite_right.update_pos(x, y);

		this.sprite_up.make_vis();
		this.sprite_down.make_vis();
		this.sprite_left.make_vis();
		this.sprite_right.make_vis();
	},

	

	

	cancel : function() {
		this.timer = -99;
		this.big_circle.update_pos(-999,-999);
		this.grow_circle.update_pos(-999,-999);
	},

	radius: 1,
	pop_scale: 1,

	draw : function () {
		if (this.timer <= -25) return;
		this.timer--;

		if (this.timer == 8) {

			this.big_circle.update_pos(this.x_start, this.y_start);
			this.grow_circle.update_pos(this.x_start, this.y_start);

			this.grow_circle.set_scale(1,1);
			this.big_circle.set_scale(1,1);
		}

		var timeleft = 15 - this.timer;
		var dist_ = 60 - this.timer*(60/15);
		var vel = 60 - 0.3*dist_;
		dist_ += vel;
		var dist = 15 - this.timer;
		dist = dist;

		this.radius = this.max_radius - this.timer*(this.max_radius/this.timer_max);

		var scale_ = Math.max(0, this.radius);

		if (this.timer > 0) this.grow_circle.set_scale(scale_, scale_);

		if (this.timer < 0) {
			this.grow_circle.update_pos(-999,-999);
			this.big_circle.update_pos(this.x_start, this.y_start);

			var time_after = - this.timer;
			var vel_out = 5 - time_after;
			this.pop_scale += vel_out*0.01;
			this.pop_scale = Math.max(1, this.pop_scale);
	
			
			
			this.big_circle.set_scale(this.pop_scale, this.pop_scale);

		}
		
		//this.sprite_up.update_pos(this.x_start, this.y_start - dist_);
		//this.sprite_down.update_pos(this.x_start, this.y_start + dist_);
		//this.sprite_left.update_pos(this.x_start - dist, this.y_start);
		//this.sprite_right.update_pos(this.x_start + dist, this.y_start);

		if (this.timer <= -20) {
			this.big_circle.update_pos(-999,-999);
			this.grow_circle.update_pos(-999,-999);

			this.sprite_up.hide();
			this.sprite_down.hide();
			this.sprite_left.hide();
			this.sprite_right.hide();
		}
	}
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
		spr.setup_sprite(spritename_,Types.Layer.HUD);
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


UserInterfaceClass = Class.extend({
	
	// buttons (w text), toggles (w text), texts

	// so what about positioning?

	// maybe i'll use this class only for ui stuff that can be easily positioned

	// different types of text:
	// TOP (tut levels) ignores screen rotation
	// SIDE (solved! whoops!) on portait it goes to bottom

	// buttons
	button_x: [],
	button_y: [],

	button_text_x: [],
	button_text_y: [],

	button_obj: [],

	button_text_obj: [],

	// toggles
	toggle_x: [],
	toggle_y: [],

	toggle_text_x: [],
	toggle_text_y: [],

	toggle_obj: [],

	toggle_text_obj: [],

	// text
	text_x: [],
	text_y: [],
	text_size: [],
	text_obj: [],
	

	init : function () {

	},

	screen_resized : function () {

	},

	add_button : function () {

	},

	clear : function () {
		for (var i = 0; i < this.text_obj.length; i++) {
			this.button_text_obj.hide();
			this.button_obj.hide();
		}
	}

});

g_UI = new UserInterfaceClass();

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

	add_new: function(spritename, code, rotate) {
		var sprite_ = new SpriteClass();
		sprite_.setup_sprite(spritename,Types.Layer.GAME_MENU);

		this.build_codes.push(code);
		this.build_sprites.push(sprite_);
		this.build_x.push(0);
		this.build_y.push(0);

		if (rotate == null) this.build_sprite_rotate.push(0);
		else this.build_sprite_rotate.push(rotate);

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

	level_minimap: [6],

	level_tick: [6],
	level_done: [0,0,0,0,0,0],

	levels_added: 0,

	search_button: null,
	up_button: null,
	down_button: null,

	rating_text: null,
	wins_text: null,
	downloads_text: null,

	h_text: null,

	scroll_offset: 0,

	init: function(game_state) {
		this.game_state = game_state;

		
		this.search_button = new ButtonClass();
		this.search_button.setup_sprite('new_icon.png',Types.Layer.GAME_MENU);

		this.up_button = new ButtonClass();
		this.up_button.setup_sprite('uparrow.png',Types.Layer.GAME_MENU);

		this.down_button = new ButtonClass();
		this.down_button.setup_sprite('uparrow.png',Types.Layer.GAME_MENU);

		

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

			this.level_tick[i] = new SpriteClass();
			this.level_tick[i].setup_sprite('tick.png',Types.Layer.GAME_MENU);
			this.level_tick[i].hide();

			this.level_minimap[i] = new BitmapClass(Types.Layer.GAME_MENU, 100, 100);
			
			//this.level_minimap[i].update_pos(60,50);
		}

		this.rating_text = new TextClass(Types.Layer.GAME_MENU);
		this.wins_text = new TextClass(Types.Layer.GAME_MENU);
		this.downloads_text = new TextClass(Types.Layer.GAME_MENU);

		this.rating_text.set_font(Types.Fonts.XSMALL);
		this.wins_text.set_font(Types.Fonts.XSMALL);
		this.downloads_text.set_font(Types.Fonts.XSMALL);

		this.rating_text.set_text('RATING');
		this.wins_text.set_text('VOTERS');
		this.downloads_text.set_text('ATTEMPTS');

		this.h_text = new TextClass(Types.Layer.GAME_MENU);
		this.h_text.set_font(Types.Fonts.MEDIUM);
		this.h_text.set_text('COMMUNITY LEVELS');

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

		this.h_text.update_pos(16,16);

		this.rating_text.update_pos(200+ 164,140 - 8);
		this.wins_text.update_pos(400+ 64,140 - 8);
		//this.downloads_text.update_pos(300+ 64,140);

		for (var i = 0; i < this.level_name.length; i++) {


			if (i >= this.levels_added) break;


			var y = 150 + i*52; 

			this.level_name[i].hide();
			this.level_author[i].make_vis();
			this.level_rating[i].make_vis();
			//this.level_attempts[i].make_vis();
			this.level_wins[i].make_vis();
			this.level_play_sprite[i].make_vis();

			this.level_name[i].update_pos(-999 + 6 + 64,-999 + y);
			this.level_author[i].update_pos(6+ 64 + 100,y - 8);
			this.level_rating[i].update_pos(200+ 164 ,y - 8);
			if (this.level_done[i] == 1) this.level_tick[i].update_pos(200+ 116, y);
			//this.level_attempts[i].update_pos(300+ 64,y);
			this.level_wins[i].update_pos(400+ 64,y - 8);
			this.level_play_sprite[i].update_pos(500+ 64,y + 8);

		
			
			

			

			this.level_minimap[i].update_pos(64 + 32, y - 20);

			

			
			
			
		}

		
		
		// 

		for (var i = 0; i < this.hint_toggles.length; i++) {
			this.hint_toggles[i].make_vis();
			
			//this.hint_toggles[i].update_pos(1*32 + i*32, 96);
			this.hint_toggles[i].update_pos(-999, -999);	// for now
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

		this.up_button.make_vis();
		this.up_button.update_pos( this.up_x, this.up_y);

		this.down_button.make_vis();
		this.down_button.update_pos( this.down_x, this.down_y);

		//this.toggle_rating.make_vis();
		//this.toggle_random.make_vis();

		this.down_button.rotate_ninety();
		this.down_button.rotate_ninety();

	},

	search_x: -999,//11*32,
	search_y: -999,//screen_height - 64,

	up_x: 32,
	up_y: 150,

	down_x: 32,
	down_y: 150 + 32*7.5,

	hide: function() {

		this.rating_text.hide();
		this.wins_text.hide();
		this.downloads_text.hide();
		this.h_text.hide();

		for (var i = 0; i < this.level_name.length; i++) {

			
			this.level_name[i].hide();
			this.level_author[i].hide();
			this.level_rating[i].hide();
			this.level_attempts[i].hide();
			this.level_wins[i].hide();
			this.level_play_sprite[i].hide();
			this.level_tick[i].hide();
			this.level_done[i] = 0;
			this.level_minimap[i].update_pos(-999,-999);
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
		this.up_button.hide();
		this.down_button.hide();
	},

	reset: function() {
		this.hide();
		this.levels_added = 0;
	},

	juggle_minimap_on_scroll: function(y_off) {

	},

	add_to_minimap_data: function(data_) {

		return;
		
		if (this.levels_added - 1 >= this.level_name.length) return -1;
		if (this.levels_added - 1 <= 0) return -1;

		//console.log('entity add_to_minimap x ' + x + ' y ' + y);
		
		this.level_minimap[this.levels_added - 1].fill_map(data_, this.game_state.grid_w, this.game_state.grid_h);
	},


	add_to_minimap: function(x, y, blocktype) {

		

		//this.level_minimap[i].draw_sprite(this.blocksprites[blocktype], x*this.game_state.tile_size, y*this.game_state.tile_size);
		
		if (this.levels_added - 1>= this.level_name.length) return -1;

		//console.log('entity add_to_minimap x ' + x + ' y ' + y);
		
		this.level_minimap[this.levels_added - 1].add_tile(x,y,blocktype);
	},

	add_level: function (name, author, rating, attempts, wins, id, tick) {

		

		if (this.levels_added >= this.level_name.length) return -1;

		

		this.level_name[this.levels_added].change_text(name);
		this.level_author[this.levels_added].change_text('BY ' +author);
		//rating = rating / g_community_list_data[level].num_ratings;
		rating = Math.round(rating*10)/10;
		this.level_rating[this.levels_added].change_text(rating.toString());
		this.level_attempts[this.levels_added].change_text(attempts.toString());
		this.level_wins[this.levels_added].change_text(wins.toString());
		this.level_play_sprite[this.levels_added].make_vis();
		this.level_id[this.levels_added] = id;

		if (tick == true) this.level_done[this.levels_added] = 1;
		else this.level_done[this.levels_added] = 0;

		// get ready to be drawn to:
		//this.level_minimap[this.levels_added].resize(10*this.game_state.tile_size, 10*this.game_state.tile_size);
		this.level_minimap[this.levels_added].clear();
		//this.level_minimap[this.levels_added].update_pos(0,0);

		this.levels_added++;
	},

	selected_level_id: -1,
	clicked_fetch: false,
	clicked_scrollup: false,
	clicked_scrolldown: false,

	click : function (x, y) {

		this.clicked_scrolldown = false;
		this.clicked_scrollup = false;
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
		} else if (x < this.up_x + 32 && x > this.up_x - 32 && 
		    	   y < this.up_y + 32 && y > this.up_y - 32) {
			this.clicked_scrollup = true;
			return;
		} else if (x < this.down_x + 32 && x > this.down_x - 32 && 
		    	   y < this.down_y + 32 && y > this.down_y - 32) {
			this.clicked_scrolldown = true;
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

			box_.setup_sprite('level_button_on.png',Types.Layer.HUD);	// default sprite, may need to change

			var text_ = new TextClass(Types.Layer.HUD);			// dunno if BACKGROUND works yet
			text_.set_font(Types.Fonts.MEDIUM);
			text_.set_text(i.toString());
			text_.update_pos(-999,-999);

			this.level_text[i] = text_;
			this.level_box[i] = box_;
			this.special_code[i] = 0;	// not special

			var icon_ = new SpriteClass();
			icon_.setup_sprite('eye.png',Types.Layer.HUD);
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

		//alert('overworld level ' + level + ' status ' + status_);

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

		if (this.status_sprite[level] == null){
			console.log('this.status_sprite[level] == null ' + level);
		}

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

	hint: 0,

	set_hint_type: function(hint_, x, y) {
		this.hint = hint_;
		if (hint_ == 1) {
				this.block_obj.set_texture('hand.png');
				this.text.change_text(g_get_text("hand"));
			} else if (hint_ == 2) {
				this.block_obj.set_texture('eye.png');
				this.text.change_text(g_get_text("eye"));
				//this.text.change_text("           MINESWEEPER'S WEIRD COUSIN");
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
			} else if (hint_ == 13) {
				this.block_obj.set_texture('eyebracket.png');
				this.text.change_text(g_get_text("eyebracket"));
			} else if (hint_ == 47) {
				this.block_obj.set_texture('ghost.png');
				this.text.change_text(g_get_text("ghost"));
			} else if (hint_ == 32) {
				this.block_obj.set_texture('sharetut.png');
				this.text.change_text("	    Number of mines SHARED by both of the connected hints");

				if (this.game_state.blocks[this.game_state.tiles[x][y]].shared_crown == true) {
					this.block_obj.set_texture('sharecrowntut.png');
					this.text.change_text("	    Number of mines that are IN THE LARGEST SEQUENCE(S), as seen by the crown, that are SHARED by the other hint");
				}

				if (this.game_state.blocks[this.game_state.tiles[x][y]].shared_eyebracket == true) {
					this.block_obj.set_texture('sharetutbracket.png');
					this.text.change_text("	    Number of GROUPS, seen by the bracket-eye, SHARED with the other hint. The other hint only needs to see part of a group.");
				}

			} else if (hint_ == 49) {
				this.block_obj.set_texture('zap.png');
				this.text.change_text("	    Number of mines reachable via mine-to-mine contact");
			} else if (hint_ == 50) {
				this.block_obj.set_texture('zapbracket.png');
				this.text.change_text("	    Number of STEPS reachable via mine-to-mine contact");
			} else if (hint_ == 51) {
				this.block_obj.set_texture('eyerepeat.png');
				this.text.change_text("	    Mines seen by this eye AND the mines seen by THOSE mines.");
			} else if (hint_ == 52) {
				this.block_obj.set_texture('walker.png');
				this.text.change_text("	    Of all mines seen from here, what is the LARGEST DISTANCE between any two of those mines? Same range as the eye");
			} else if (hint_ == 80) {
				this.block_obj.set_texture('totalnum.png');
				
				this.game_state.count_up_flags();	// this.game_state.num_flagged  this.game_state.num_mines

				var remaining = this.game_state.num_mines - this.game_state.num_flagged;

				this.text.change_text("	    Total number of mines: " + this.game_state.num_mines + "\nUnflagged mines (assuming you've flagged correctly): " + remaining);
			} else if (hint_ == 81) {
				this.block_obj.set_texture('minecontacts.png');
				this.text.change_text("	     Total number of MINE TO MINE CONTACTS. Horizontal and vertical. No diagonals.");
			} else if (hint_ == 90) {
				this.block_obj.set_texture('timer.png');
				this.text.change_text("	     Time remaining. No pressure.");
			} else {
				// uncovered, no hint, empty
				
			}
	},

	on_digorflag : function () {
		if (this.hint == 80) {
			this.game_state.count_up_flags();

			var remaining = this.game_state.num_mines - this.game_state.num_flagged;

			this.text.change_text("	    Total number of mines: " + this.game_state.num_mines + "\nUnflagged mines (assuming you've flagged correctly): " + remaining);
			
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
			
		} else if (this.game_state.blocks[this.game_state.tiles[x][y]].sharesquare == true) {
			var hint_ = 32;
			this.set_hint_type(hint_, x, y);
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

		if (screen_width > screen_height) {
			this.block_obj.make_vis();
			this.block_obj.update_pos(0.75*this.game_state.tile_size + 8, 10.5*this.game_state.tile_size + 8);
			this.text.update_pos(0.75*this.game_state.tile_size, 10.5*this.game_state.tile_size, 10*this.game_state.tile_size, 200);
		} else {
			this.block_obj.make_vis();
			this.block_obj.update_pos(0.25*this.game_state.tile_size, 10.5*this.game_state.tile_size + 8);
			this.text.update_pos(0.25*this.game_state.tile_size - 8, 10.5*this.game_state.tile_size, 10*this.game_state.tile_size, 200);

		}
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

	hint_ghost_sprite: null,
	hint_ghost_num: -1,
	hint_ghost_num_text: null,

	hint_zap_sprite: null,
	hint_zap_num: -1,
	hint_zap_num_text: null,

	hint_zapbracket_sprite: null,

	hint_eyerepeat_sprite: null,

	hint_walker_sprite: null,

	hint_gem_sprite: null,
	hint_gem_num: -1,
	hint_gem_num_text: null,

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

	hint_global_sprite: null,

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

	// tetromino shape detection
	// some clues report the number of shapes that match a mine pattern

	flowfill_seen: false,
	flowfill_dist: 0,

	mine_multi: 1,

	init: function(game_state) {

		this.game_state = game_state;

		this.block_type = 1;

		this.block_blink_sprite = new SpriteClass();
		this.block_blink_sprite.setup_sprite("select.png",Types.Layer.HUD);
		this.block_blink_sprite.hide();
		
		//this.block_shadow_sprite = new SpriteClass();
		//this.block_shadow_sprite.setup_sprite("block1_shadow.png",Types.Layer.GAME);
		//this.block_shadow_sprite.hide();

		this.block_sprite = new SpriteClass();
		this.block_sprite.setup_sprite("block0.png",Types.Layer.GAME);
		this.block_sprite.hide();

		this.join_v_sprite = new SpriteClass();
		//this.join_v_sprite.setup_sprite('joiner_v.png',Types.Layer.GAME);
		//this.join_v_sprite.hide();

		this.join_h_sprite = new SpriteClass();
		//this.join_h_sprite.setup_sprite('joiner_h.png',Types.Layer.TILE);
		//this.join_h_sprite.hide();

		this.join_sprite_any = new SpriteClass();
		this.join_sprite_any.setup_sprite('joiner_up.png',Types.Layer.GAME);
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

		
		this.hint_heart_num_text = new CounterClass(Types.Layer.GAME);
		this.hint_heart_num_text.set_font(Types.Fonts.MEDIUM);
		this.hint_heart_num_text.set_text("");
		this.hint_heart_num_text.update_pos(-999,-999);

		
		this.hint_heart_sprite = new SpriteClass();
		this.hint_heart_sprite.setup_sprite("heart.png",Types.Layer.GAME);
		this.hint_heart_sprite.hide();

		this.hint_ghost_num_text = new CounterClass(Types.Layer.GAME);
		this.hint_ghost_num_text.set_font(Types.Fonts.MEDIUM);
		this.hint_ghost_num_text.set_text("");
		this.hint_ghost_num_text.update_pos(-999,-999);

		
		this.hint_ghost_sprite = new SpriteClass();
		this.hint_ghost_sprite.setup_sprite("ghost.png",Types.Layer.GAME);
		this.hint_ghost_sprite.hide();

		this.hint_zap_num_text = new CounterClass(Types.Layer.TILE);
		this.hint_zap_num_text.set_font(Types.Fonts.MEDIUM);
		this.hint_zap_num_text.set_text("");
		this.hint_zap_num_text.update_pos(-999,-999);

		
		this.hint_zap_sprite = new SpriteClass();
		this.hint_zap_sprite.setup_sprite("zap.png",Types.Layer.GAME);
		this.hint_zap_sprite.hide();

		this.hint_walker_sprite = new SpriteClass();
		this.hint_walker_sprite.setup_sprite("walker.png",Types.Layer.GAME);
		this.hint_walker_sprite.hide();

		this.hint_zapbracket_sprite = new SpriteClass();
		this.hint_zapbracket_sprite.setup_sprite("zapbracket.png",Types.Layer.GAME);
		this.hint_zapbracket_sprite.hide();

		this.hint_eyerepeat_sprite = new SpriteClass();
		this.hint_eyerepeat_sprite.setup_sprite("eyerepeat.png",Types.Layer.GAME);
		this.hint_eyerepeat_sprite.hide();
		
		this.hint_gem_num_text = new CounterClass(Types.Layer.GAME);
		this.hint_gem_num_text.set_font(Types.Fonts.MEDIUM);
		this.hint_gem_num_text.set_text("");
		this.hint_gem_num_text.update_pos(-999,-999);

		
		this.hint_gem_sprite = new SpriteClass();
		this.hint_gem_sprite.setup_sprite("gem.png",Types.Layer.GAME);
		this.hint_gem_sprite.hide();


		this.hint_touch_num_text = new CounterClass(Types.Layer.GAME);
		this.hint_touch_num_text.set_font(Types.Fonts.MEDIUM);
		this.hint_touch_num_text.set_text("");
		this.hint_touch_num_text.update_pos(-999,-999);

		this.hint_touch_sprite = new SpriteClass();
		this.hint_touch_sprite.setup_sprite("hand.png",Types.Layer.GAME);
		this.hint_touch_sprite.hide();

		this.hint_eight_touch_sprite = new SpriteClass();
		this.hint_eight_touch_sprite.setup_sprite("8hand.png",Types.Layer.GAME);
		this.hint_eight_touch_sprite.hide();

		this.hint_add_num_text = new CounterClass(Types.Layer.GAME);
		this.hint_add_num_text.set_font(Types.Fonts.MEDIUM);
		this.hint_add_num_text.set_text("");
		this.hint_add_num_text.update_pos(-999,-999);

		this.hint_add_sprite = new SpriteClass();
		this.hint_add_sprite.setup_sprite("eyeplustouch.png",Types.Layer.GAME);
		this.hint_add_sprite.hide();
		
		this.hint_compass_sprite = new SpriteClass();
		this.hint_compass_sprite.setup_sprite("compass.png",Types.Layer.GAME);
		this.hint_compass_sprite.hide();

		this.hint_compass_num_text = new CounterClass(Types.Layer.GAME);
		this.hint_compass_num_text.set_font(Types.Fonts.MEDIUM);
		this.hint_compass_num_text.set_text("");
		this.hint_compass_num_text.update_pos(-999,-999);

		this.hint_crown_sprite = new SpriteClass();
		this.hint_crown_sprite.setup_sprite("crown.png",Types.Layer.GAME);
		this.hint_crown_sprite.hide();

		this.hint_crown_num_text = new CounterClass(Types.Layer.GAME);
		this.hint_crown_num_text.set_font(Types.Fonts.MEDIUM);
		this.hint_crown_num_text.set_text("");
		this.hint_crown_num_text.update_pos(-999,-999);

		this.hint_eyebracket_sprite = new SpriteClass();
		this.hint_eyebracket_sprite.setup_sprite("eyebracket.png",Types.Layer.GAME);
		this.hint_eyebracket_sprite.hide();

		this.hint_eyebracket_num_text = new CounterClass(Types.Layer.GAME);
		this.hint_eyebracket_num_text.set_font(Types.Fonts.MEDIUM);
		this.hint_eyebracket_num_text.set_text("");
		this.hint_eyebracket_num_text.update_pos(-999,-999);

		this.hint_global_sprite = new SpriteClass();
		this.hint_global_sprite.setup_sprite("totalnum.png",Types.Layer.GAME);
		this.hint_global_sprite.hide();
		
		
	},

	get_num_mines: function () {
		if (this.block_type != 2) return 0;

		else return this.mine_multi;
	},

	shared_hint: 0,

	is_shareable : function () {
		var hint_ = 0;
		if (this.join_group != 0) hint_ = this.shared_hint;
		else hint_ = this.preset_hint_type;

		if (hint_ == 1 || hint_ == 2 || hint_ == 4 || hint_ == 5 || hint_ == 12 || hint_ == 49 || hint_ == 51) return true;
		return false;

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

	add_to_range : function (x, y) {
		if (x == this.x && y == this.y) return;

		this.x_in_range.push(x);
		this.y_in_range.push(y);
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

	shared_crown: false,
	shared_heart: false,
	shared_eyebracket: false,

	calc_sharesquare: function() {

		var all_the_mines = [];
		var num_hints_in_group = 0;

		this.shared_crown = false;
		this.shared_heart = false;
		this.shared_eyebracket = false;

		//console.log('calc sharesquare at : this.x ' + this.x + ' this.y ' + this.y);

		for (var b = 0; b < this.game_state.grid_w*this.game_state.grid_h; b++) {

			if (this.game_state.blocks[b].preset_hint_type == 0) continue;

			var not_in_my_group = 1;
		
			for (var s = 0; s < this.game_state.blocks[b].share_groups.length; s++) {
				if (this.game_state.blocks[b].share_groups[s] == this.share_groups[0]) not_in_my_group = 0;
			}

			if (not_in_my_group == 1) continue;

			if (this.game_state.blocks[b].preset_hint_type == 12) this.shared_crown = true;
			else if (this.game_state.blocks[b].preset_hint_type == 5) this.shared_heart = true;
			else if (this.game_state.blocks[b].preset_hint_type == 13) {
				// this.game_state.blocks[b].which_eyebracket_groups_do_i_see();
				this.game_state.calc_sequence_lengths();
				this.shared_eyebracket = true;
			}
			num_hints_in_group++;

			//console.log('hint ' + num_hints_in_group + ' is at x: ' + this.game_state.blocks[b].x + ' y: ' + this.game_state.blocks[b].y + ' hintype: ' + this.game_state.blocks[b].preset_hint_type + ' mines_seen_xy.length ' + this.game_state.blocks[b].mines_seen_xy.length + ' this hint has ' +this.game_state.blocks[b].x_in_range.length + ' tiles in its range: ');
			//console.dir(this.game_state.blocks[b].x_in_range);
			//console.dir(this.game_state.blocks[b].y_in_range);

			//console.log('hint in MY group at x: ' +this.game_state.blocks[b].x + '  y: ' + this.game_state.blocks[b].y);

			for (var m = 0; m < this.game_state.blocks[b].mines_seen_xy.length; m++) {
				all_the_mines.push(this.game_state.blocks[b].mines_seen_xy[m]);
			}

			
		}

		//console.log('this.share_groups.length ' + this.share_groups.length);
		//console.log('this.share_groups[0] ' + this.share_groups[0]);
		//console.log('num_hints_in_group ' + num_hints_in_group);
		//console.log('all_the_mines.length ' + all_the_mines.length);
		//console.dir(all_the_mines);

		//console.log('this.share_connect_up ' + this.share_connect_up);
		//console.log('this.share_connect_left ' + this.share_connect_left);
		//console.log('this.share_connect_down ' + this.share_connect_down);
		//console.log('this.share_connect_right ' + this.share_connect_right);

		if (num_hints_in_group <= 1) {
			// error !!!
			
		}

		// a mine in all_the_mines needs to be present X num_hints_in_group
		// i don't think its possible to appear more times than that

		var shared = 0;

		var horiz_eyebracket_groups_counted = [];	// ONLY IF one hint is eyebracket
		var vert_eyebracket_groups_counted = [];	// ONLY IF one hint is eyebracket

		// look for mines in all_the_mines that are counted 2x
		for (var m = 0; m < all_the_mines.length; m++) {
			var num_of_m = 1;
			
			
			for (var n = m + 1; n < all_the_mines.length; n++) {
				if (all_the_mines[m].x == all_the_mines[n].x &&
				    all_the_mines[m].y == all_the_mines[n].y) num_of_m++;
			}

			//console.log('num_of_m ' + num_of_m);

			// how many mines in this tiile? is it a double? usually just 1
			var multi_ = this.game_state.get_num_mines(all_the_mines[m].x, all_the_mines[m].y);

			if (num_of_m == num_hints_in_group && 
			    this.shared_eyebracket == true) {

				multi_ = 0;
				var counted_v_group = 0;
				var counted_h_group = 0;
				var b = this.game_state.tiles[all_the_mines[m].x][all_the_mines[m].y];
				for (var j = 0; j < horiz_eyebracket_groups_counted.length; j++) {
					if (this.game_state.blocks[b].my_horiz_seq_id == horiz_eyebracket_groups_counted[j]) {
						counted_h_group = 1;
					} 
				}
				for (var j = 0; j < vert_eyebracket_groups_counted.length; j++) {
					if (this.game_state.blocks[b].my_vert_seq_id == vert_eyebracket_groups_counted[j]) {
						
						counted_v_group = 1;
					} 
				}
				
				// this is working, but i'm not 100% clear if its correct
				if (counted_h_group == 0 && counted_v_group == 0) {
					//alert('counting horiz group ' + this.game_state.blocks[b].my_horiz_seq_id + ' and vert group ' + this.game_state.blocks[b].my_vert_seq_id);
					horiz_eyebracket_groups_counted.push(this.game_state.blocks[b].my_horiz_seq_id);
					vert_eyebracket_groups_counted.push(this.game_state.blocks[b].my_vert_seq_id);
					multi_ = 1;
				}

			

			}

			if (num_of_m == num_hints_in_group) shared += multi_;		// shared++
		}

		// for eyebracket - a group is one unit
		// how many groups (from the eyebracket persepective) are shared
		// will result in subtracting the num of groups that are counted > 1
		if (this.shared_eyebracket == true) {
		
			
			
			
		}

		this.sharesquare_num = shared;

		console.log('this.sharesquare_num ' + this.sharesquare_num);
	},

	horiz_eyebracket_groups_seen: [],
	vert_eyebracket_groups_seen: [],

	which_eyebracket_groups_do_i_see : function () {
		this.game_state.calc_sequence_lengths();

		this.horiz_eyebracket_groups_seen = [];
		this.vert_eyebracket_groups_seen = [];

		for (var i = 0; i < this.x_in_range.length; i++) {
			var x = this.x_in_range[i];
			var y = this.y_in_range[i];
			var b = this.game_state.tiles[x][y];
			if (this.game_state.blocks[b].block_type != 2) continue;
			if (x == this.x) {
				// vert_eyebracket_groups_seen
				var vert_id = this.game_state.blocks[b].my_vert_seq_id;
				var present_ = 0;
				for (var j = 0; j < this.vert_eyebracket_groups_seen.length; j++) {
					if (this.vert_eyebracket_groups_seen[j] == vert_id) present_ = 1;
				}
				if (present_ == 0) this.vert_eyebracket_groups_seen.push(vert_id);
			} else if (y == this.y) {
				// horiz_eyebracket_groups_seen
				var horiz_id = this.game_state.blocks[b].my_horiz_seq_id;
				var present_ = 0;
				for (var j = 0; j < this.horiz_eyebracket_groups_seen.length; j++) {
					if (this.horiz_eyebracket_groups_seen[j] == horiz_id) present_ = 1;
				}
				if (present_ == 0) this.horiz_eyebracket_groups_seen.push(horiz_id);
			}
		}
	},


	show_sharesquare: function () {

		


		if (this.share_groups.length == 0) return;

		if (this.join_group != 0) return;	// blue-joined tiles getting wiped by being in a share group 

		if (this.preset_hint_type != 0) return;

		this.join_sprite_any.update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 									this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size + 1);

		this.join_sprite_any.make_vis();

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

			if (this.shared_crown == true) this.hint_eye_num_text.change_text(this.sharesquare_num.toString() + 'K');
			else if (this.shared_eyebracket == true) this.hint_eye_num_text.change_text(this.sharesquare_num.toString() + 'B');
			else if (this.shared_heart == true) this.hint_eye_num_text.change_text(this.sharesquare_num.toString() + 'L');
			else this.hint_eye_num_text.change_text(this.sharesquare_num.toString());

			if (this.shared_crown == true && this.shared_eyebracket == true) this.hint_eye_num_text.change_text('');

			// NO eyebracket
			if (this.shared_eyebracket == true) this.hint_eye_num_text.change_text('');

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

			if (this.can_i_actually_see(x,y) == false) continue;	// hearts only see lonely, kings only see biggest

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

		
		this.mine_multi = 1;

		
	},

	sharesquare_code : 0,

	set_sharesquare_code : function (floortile) {
		this.sharesquare_code = floortile;
		if (floortile == 16) {
			// sharesquare
			this.sharesquare = true;
			this.share_connect_left = true;
			this.share_connect_down = true;
			this.share_connect_right = true;
			this.share_connect_up = true;
		} else if (floortile == 17) {
			// sharepipe horiz
			this.share_pipe = true;
			this.share_connect_left = true;
			this.share_connect_right = true;
		} else if (floortile == 18) {
			// sharepipe vert
			this.share_pipe = true;
			this.share_connect_up = true;
			this.share_connect_down = true;
		} else if (floortile == 19) {
			// sharepipe corner L D
			this.share_pipe = true;
			this.share_connect_left = true;
			this.share_connect_down = true;
		} else if (floortile == 20) {
			// sharepipe corner L U
			this.share_pipe = true;
			this.share_connect_left = true;
			this.share_connect_up = true;
		} else if (floortile == 21) {
			// sharepipe corner R D
			this.share_pipe = true;
			this.share_connect_right = true;
			this.share_connect_down = true;
		} else if (floortile == 22) {
			// sharepipe corner R U
			this.share_pipe = true;
			this.share_connect_right = true;
			this.share_connect_up = true;
		} else if (floortile == 23) {
			// sharepipe cross L D R U
			this.share_pipe = true;
			this.share_connect_left = true;
			this.share_connect_down = true;
			this.share_connect_right = true;
			this.share_connect_up = true;
		} else if (floortile == 29) {
			// sharesquare
			this.sharesquare = true;
			//this.share_connect_left = true;
			this.share_connect_down = true;
			this.share_connect_right = true;
			//this.share_connect_up = true;
		} else if (floortile == 31) {
			// sharesquare
			this.sharesquare = true;
			this.share_connect_down = true;
			this.share_connect_up = true;
		} else if (floortile == 26) {
			// sharesquare
			this.sharesquare = true;
			this.share_connect_left = true;
			this.share_connect_right = true;
		} else if (floortile == 32) {
			// sharesquare
			this.sharesquare = true;
			//this.share_connect_left = true;
			this.share_connect_right = true;
			this.share_connect_up = true;
		} else if (floortile == 27) {
			// sharesquare
			this.sharesquare = true;
			this.share_connect_left = true;
			//this.share_connect_down = true;
			//this.share_connect_right = true;
			this.share_connect_up = true;
		} else if (floortile == 24) {
			// sharesquare
			this.sharesquare = true;
			this.share_connect_left = true;
			this.share_connect_down = true;
			//this.share_connect_right = true;
			//this.share_connect_up = true;
		} 
	},

	get_sharesquare_code : function () {
		if (this.sharesquare == true) {
			// six different kinds of bubble
			return this.sharesquare_code;
			//if (this.share_connect_left == true &&
			//    this.share_connect_right == true) tilecode = 26;	// horiz bubble

		} else if (this.share_pipe == true) {
			// six different kinds of pipe
			return this.sharesquare_code;
			//if (this.share_connect_left == true &&
			//    this.share_connect_right == true) tilecode = 17;	// horiz pipe
		} else {
			return 0;
		}
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
			this.hint_ghost_sprite.hide();
			this.hint_gem_sprite.hide();
			this.hint_zap_sprite.hide();
			this.hint_zapbracket_sprite.hide();
			this.hint_eyerepeat_sprite.hide();
			this.hint_walker_sprite.hide();
			this.join_sprite_any.hide();
			this.hint_global_sprite.hide();
			

			this.hint_touch_num_text.update_pos(-999,-999);
			this.hint_eye_num_text.update_pos(-999,-999);
			this.hint_add_num_text.update_pos(-999,-999);
			this.hint_heart_num_text.update_pos(-999,-999);
			this.hint_compass_num_text.update_pos(-999,-999);
			this.hint_crown_num_text.update_pos(-999,-999);
			this.hint_eyebracket_num_text.update_pos(-999,-999);
			this.hint_ghost_num_text.update_pos(-999,-999);
			this.hint_zap_num_text.update_pos(-999,-999);
			this.hint_gem_num_text.update_pos(-999,-999);
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
			
		} else if (hinttype == 47) {

			//alert('this.hint_compass_num_text ' + hint_.toString());
			
			this.hint_ghost_num_text.change_text(hint_.toString());
			this.hint_ghost_num_text.update_pos(text_x, 
							  text_y);
			this.hint_ghost_num_text.center_x(text_x);

			this.hint_ghost_sprite.make_vis();
			this.hint_ghost_sprite.update_pos(icon_x, 
							  icon_y);
			
		} else if (hinttype == 48) {

			//alert('this.hint_compass_num_text ' + hint_.toString());
			
			this.hint_gem_num_text.change_text(hint_.toString());
			this.hint_gem_num_text.update_pos(text_x, 
							  text_y);
			this.hint_gem_num_text.center_x(text_x);

			this.hint_gem_sprite.make_vis();
			this.hint_gem_sprite.update_pos(icon_x, 
							  icon_y);
			
		} else if (hinttype == 49) {

			//alert('this.hint_compass_num_text ' + hint_.toString());
			
			this.hint_zap_num_text.change_text(hint_.toString());
			this.hint_zap_num_text.update_pos(text_x, 
							  text_y);
			this.hint_zap_num_text.center_x(text_x);

			this.hint_zap_sprite.make_vis();
			this.hint_zap_sprite.update_pos(icon_x, 
							  icon_y);
			
		} else if (hinttype == 50) {

			//alert('this.hint_compass_num_text ' + hint_.toString());
			
			this.hint_zap_num_text.change_text(hint_.toString());
			this.hint_zap_num_text.update_pos(text_x, 
							  text_y);
			this.hint_zap_num_text.center_x(text_x);

			this.hint_zapbracket_sprite.make_vis();
			this.hint_zapbracket_sprite.update_pos(icon_x, 
							  icon_y);
			
		} else if (hinttype == 51) {

			//alert('this.hint_compass_num_text ' + hint_.toString());
			
			this.hint_zap_num_text.change_text(hint_.toString());
			this.hint_zap_num_text.update_pos(text_x, 
							  text_y);
			this.hint_zap_num_text.center_x(text_x);

			this.hint_eyerepeat_sprite.make_vis();
			this.hint_eyerepeat_sprite.update_pos(icon_x, 
							  icon_y);
			
		} else if (hinttype == 52) {

			//alert('this.hint_compass_num_text ' + hint_.toString());

			
			
			this.hint_zap_num_text.change_text(hint_.toString());
			this.hint_zap_num_text.update_pos(text_x, 
							  text_y);
			this.hint_zap_num_text.center_x(text_x);

			this.hint_walker_sprite.make_vis();
			this.hint_walker_sprite.update_pos(icon_x, 
							  icon_y);
			
		} else if (hinttype == 80) {
			this.hint_global_sprite.set_texture("totalnum.png");
			this.hint_global_sprite.make_vis();
			this.hint_global_sprite.update_pos(icon_x, 
							  icon_y);

			this.hint_eye_num_text.change_text(hint_.toString());
			this.hint_eye_num_text.update_pos(text_x, 
							  text_y);
			this.hint_eye_num_text.center_x(text_x);
		} else if (hinttype == 81) {
			this.hint_global_sprite.set_texture("minecontacts.png");
			this.hint_global_sprite.make_vis();
			this.hint_global_sprite.update_pos(icon_x, 
							  icon_y);

			this.hint_eye_num_text.change_text(hint_.toString());
			this.hint_eye_num_text.update_pos(text_x, 
							  text_y);
			this.hint_eye_num_text.center_x(text_x);
		} else if (hinttype == 90) {
			this.hint_global_sprite.set_texture("timer.png");
			this.hint_global_sprite.make_vis();
			this.hint_global_sprite.update_pos(icon_x, 
							  icon_y);

			this.hint_eye_num_text.change_text('0');
			this.hint_eye_num_text.update_pos(text_x, 
							  text_y);
			this.hint_eye_num_text.center_x(text_x);
		}
	},

	timer_num : 0,

	set_timer : function (new_num) {
		this.timer_num = new_num;

		var text_x = this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size;
		var text_y = this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size;
		
		this.hint_eye_num_text.change_text(this.timer_num.toString());
		this.hint_eye_num_text.update_pos(text_x, text_y);
		this.hint_eye_num_text.center_x(text_x);

		
	},

	stored_crown_num: 0,

	wanted_num: 0,

	count_flags: 0,	// not using ...


	calc_hint: function(hinttype, remember) {

		if (remember == null) remember = true;


		

		// two modes: count MINES and EMPTY
		//	      count FLAGS and DUG (which == EMPTY)

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
			
			
		} else if (hinttype == 47) {

			// counts emtpys until mines (or walls) - ghost

			var only_count_lonely_mines = false;
			var count_directions_with_mines = false;
			var count_highest_sequence = false;
			var only_count_groups = false;
			var only_count_empties = true;
			var mines_are_walls = true;
			num = this.calc_hint_eye_num(only_count_lonely_mines, count_directions_with_mines, count_highest_sequence , only_count_groups, only_count_empties, mines_are_walls); // get range
			
			
		}  else if (hinttype == 48) {

			// counts emtpys until mines (or walls) - gem

			var only_count_lonely_mines = false;
			var count_directions_with_mines = false;
			var count_highest_sequence = false;
			var only_count_groups = false;
			var only_count_empties = false;
			var mines_are_walls = true;
			var only_count_gems = true; // gems are preset_hint == 48
			num = this.calc_hint_eye_num(only_count_lonely_mines, count_directions_with_mines, count_highest_sequence , only_count_groups, only_count_empties, mines_are_walls, only_count_gems); // get range
			
			
		} else if (hinttype == 49) {
			// zap
			num = this.game_state.flowfill_mines(this.game_state.tiles[this.x][this.y]);
			// this function also fills out my range
		} else if (hinttype == 52) {
			// walker
			num = this.calc_hint_eye_num(); // get range
			//num = this.calc_walker_num_from_range();
			//num = this.calc_eye_dist_from_range();
			num = this.calc_walker_manhattan_num_from_range();

			
			
		} else if (hinttype == 50) {
			// zapbracket - gets the same range as zap would
			num = this.game_state.flowfill_mines(this.game_state.tiles[this.x][this.y]);
			num = this.game_state.flowfill_tot_steps;
			// this function also fills out my range
		} else if (hinttype == 51) {
			// eyerepeat
			num = this.calc_eyerepeat(2);
		} else if (hinttype == 80) {
			num = this.count_total_mines();
		} else if (hinttype == 81) {
			num = this.count_total_mine_contacts();
		} else if (hinttype == 90) {	// timer
			num = 0;
		}

		if (remember == true) this.wanted_num = num;

		return num;
	},


	calc_eye_dist_from_range : function () {
		var num = 0;

		var best_dist = 0;
		var lowest_dist = 99;

		for (var i = 0; i < this.x_in_range.length; i++) {
			var x = this.x_in_range[i];
			var y = this.y_in_range[i];
			if (this.game_state.blocks[this.game_state.tiles[x][y]].block_type != 2) continue;

			var dist_ = Math.abs(this.x - x) + Math.abs(this.y - y);

			best_dist =  Math.max(best_dist, dist_);
			lowest_dist =  Math.min(lowest_dist, dist_);

			num += dist_;
		}

		//return num;

		return best_dist + lowest_dist;
	},

	calc_walker_manhattan_num_from_range : function () {
		
		var best_dist = 0;
		for (var i = 0; i < this.x_in_range.length; i++) {
			var x = this.x_in_range[i];
			var y = this.y_in_range[i];

			if (this.game_state.blocks[this.game_state.tiles[x][y]].block_type != 2) continue;

			for (var j = 0; j < this.x_in_range.length; j++) {
				var xx = this.x_in_range[j];
				var yy = this.y_in_range[j];

				if (this.game_state.blocks[this.game_state.tiles[xx][yy]].block_type != 2) continue;

				//var d = (this.x_in_range[i] - this.x_in_range[j])*(this.x_in_range[i] - this.x_in_range[j]) +
					(this.y_in_range[i] - this.y_in_range[j])*(this.y_in_range[i] - this.y_in_range[j]);

				//var dist_ = Math.sqrt(d);
				
				// Manhattan distance:
				var dist_ = Math.abs(this.x_in_range[i] - this.x_in_range[j]) +
					    Math.abs(this.y_in_range[i] - this.y_in_range[j]);

				

				best_dist = Math.max(best_dist, dist_);
			}

		}

		return best_dist;
	},

	calc_walker_num_from_range : function () {

		// assuming single orign - not joined
		var lowest_x = 99;
		var highest_x = -1;
		var lowest_y = 99;
		var highest_y = -1;

		for (var i = 0; i < this.x_in_range.length; i++) {
			var x = this.x_in_range[i];
			var y = this.y_in_range[i];

			if (this.game_state.blocks[this.game_state.tiles[x][y]].block_type != 2) continue;

			if (x == this.x) {
				lowest_y = Math.min(lowest_y, y);
				highest_y =  Math.max(highest_y, y);
			} else if (y == this.y) {
				lowest_x = Math.min(lowest_x, x);
				highest_x =  Math.max(highest_x, x);
			}
		}

		if (lowest_x == 99 && lowest_y == 99) return 0;

		var y_dist = highest_y - lowest_y + 1;
		var x_dist = highest_x - lowest_x + 1;

		return Math.max(y_dist, x_dist);
	},

	eyerepeat_steps: 0,

	calc_eyerepeat : function (max_steps) {
		

		for (var b = 0; b < this.game_state.grid_w*this.game_state.grid_h; b++) {
			this.game_state.blocks[b].flowfill_seen = false;
			this.game_state.blocks[b].eyerepeat_steps = 0;
		}

		var num = this.calc_hint_eye_num();	// fills out range

		//alert('eye at ' + this.x + ' ' + this.y + ' this.x_in_range.length ' + this.x_in_range.length);

		var fringe_ = [];

		for (var i = 0; i < this.x_in_range.length; i++) {
			var b = this.game_state.tiles[this.x_in_range[i]][this.y_in_range[i]];
			this.game_state.blocks[b].eyerepeat_steps = 1;
			fringe_.push(b);
		}

		//alert('eye at ' + this.x + ' ' + this.y + ' initial fringe ' + fringe_);

		this.x_in_range = [];	// clear
		this.y_in_range = [];	// add a tile back ONLY if its flowfill_seen = false

		var loops = 0;

		
		
		while (fringe_.length > 0 && loops < 110) {
			loops++;

			var b = fringe_.pop();
			var x = this.game_state.blocks[b].x;
			var y = this.game_state.blocks[b].y;

			//alert('pushing ' + x + ' ' + y);
			//alert('b ' + b);

			if (this.game_state.blocks[b].flowfill_seen == true) continue; 
			this.game_state.blocks[b].flowfill_seen = true;

			

			this.x_in_range.push(x);
			this.y_in_range.push(y);

			if (this.game_state.blocks[b].block_type == 2 &&
			    this.game_state.blocks[b].eyerepeat_steps < max_steps) {

				var steps_ = this.game_state.blocks[b].eyerepeat_steps;
				//this.game_state.blocks[b].eyerepeat_steps = steps_ + 1;

				this.game_state.blocks[b].x_in_range = [];	// clear the mine's range
				this.game_state.blocks[b].y_in_range = [];	// 
				var num_mine_sees = this.game_state.blocks[b].calc_hint_eye_num(); // calc range

				for (var i = 0; i < this.game_state.blocks[b].x_in_range.length; i++) {
					
					var xx = this.game_state.blocks[b].x_in_range[i];
					var yy = this.game_state.blocks[b].y_in_range[i];
					var bb = this.game_state.tiles[xx][yy];

					if (this.game_state.blocks[bb].flowfill_seen == true) continue;
					//this.game_state.blocks[bb].flowfill_seen = true;
					if (this.game_state.blocks[bb].eyerepeat_steps == 0) this.game_state.blocks[bb].eyerepeat_steps = steps_ + 1;
					

					fringe_.push(bb);
				} 
				
			} // if mine
		
			
			
		} // while

		console.log('repeater at ' + this.x + ' ' + this.y);
		console.dir(this.x_in_range);
		console.dir(this.y_in_range);

		return this.calc_hint_from_range(2);	// 'eye' type - only if you pass in 5 (heart) it filters non-lonely
	},

	count_total_mines: function () {
		var total_mines = 0;
		for (var b = 0; b < this.game_state.grid_w*this.game_state.grid_h; b++) {
			if (this.game_state.blocks[b].block_type == 2) total_mines+= this.game_state.blocks[b].get_num_mines();
		}
		return total_mines;
		
	},

	count_total_mine_contacts: function () {
		var total_mine_contacts = 0;
		for (var x = 0; x < this.game_state.grid_w; x++) {
			for (var y = 0; y < this.game_state.grid_h; y++) {

				if (x < this.game_state.grid_w - 1 &&
				    this.game_state.blocks[this.game_state.tiles[x][y]].block_type == 2 &&
			    	    this.game_state.blocks[this.game_state.tiles[x + 1][y]].block_type == 2) total_mine_contacts++;

				if (y < this.game_state.grid_h - 1 && 
				    this.game_state.blocks[this.game_state.tiles[x][y]].block_type == 2 &&
			    	    this.game_state.blocks[this.game_state.tiles[x][y + 1]].block_type == 2) total_mine_contacts++;
			}
			
		}

		
		return total_mine_contacts;
		
	},

	
	counted_already: false,	// general purpose

	reset_all_counted_already: function() {
		//for (var x = 0)
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

			this.identify_mines_in_range();	// tally up the individual mines

		} else if (this.sharesquare == true) {
			console.log('uncover_shared...');
			//this.calc_sharesquare();
			
		}
		// the sharesquare needs to be handled last, after all clues are calculated
		
		if (this.sharesquare == false) this.show_sharesquare();	// applies to pipes + square
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

	// for lines of mines
	my_vert_seq_length: 0,
	my_horiz_seq_length: 0,

	my_vert_seq_id: 0,
	my_horiz_seq_id: 0,

	can_i_actually_see: function (x, y) {

		
		if (this.preset_hint_type == 5) {
			// heart
			
			if (this.game_state.blocks[this.game_state.tiles[x][y]].is_lonely() == true) return true;
			else return false;
		} else if (this.preset_hint_type == 12) {
			// crown
			
			this.game_state.calc_sequence_lengths();	// will only execute one per level after a reset

			//alert('crown at x: ' + x + ', y: ' + y + ',this.stored_hint_num: ' + this.stored_hint_num);

			if (this.x != x && this.y == y &&
			    this.game_state.blocks[this.game_state.tiles[x][y]].my_horiz_seq_length == this.stored_hint_num) return true;
			else if (this.y != y &&  this.x == x &&
			    this.game_state.blocks[this.game_state.tiles[x][y]].my_vert_seq_length == this.stored_hint_num) return true;
			else return false;
			
		}

		return true;
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
				hint_ = this.game_state.blocks[leader_b].calc_hint_from_range(hint_type);	// use range

				
			}

			this.game_state.blocks[leader_b].show_hint(hint_type, hint_);
			this.game_state.blocks[leader_b].shared_wanted_num = hint_; // for calculating happines

			

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

			var sharesq_b = 0;

			for (var b = 0; b < this.game_state.grid_w*this.game_state.grid_h; b++) {

				//if (this.game_state.blocks[b].covered_up == false) continue;

				for (var s = 0; s < this.game_state.blocks[b].share_groups.length; s++) {

					if (this.game_state.blocks[b].share_groups[s] != share_group) continue;

					this.game_state.blocks[b].uncover_shared();	

					// may be blue-join tiles on the ends of this share-tentacle:
					if (this.game_state.blocks[b].join_group != 0) this.game_state.blocks[b].uncover();
				}

				// also: find and calculate the share bubble for THIS share group
				if (this.game_state.blocks[b].share_groups.length == 1 &&
				    this.game_state.blocks[b].share_groups[0] == share_group &&
				    this.game_state.blocks[b].sharesquare == true) {
					sharesq_b = b;
				}
				
			}

			
			this.game_state.blocks[sharesq_b].calc_sharesquare();
			this.game_state.blocks[sharesq_b].show_sharesquare();	// again cos just calc'd number

			//this.game_state.calc_share_groups();

			
			 
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

		if (this.preset_hint_type == 90) {
			// timer
			//this.timer_num = 0;
			this.game_state.add_timer(this.x, this.y);
		}

		
	},

	shared_wanted_num: 0,

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

	calc_hint_from_range: function (hint_type) {
		var num = 0;

		
		for (var i = 0; i < this.x_in_range.length; i++) {

			if (hint_type == 5) {
				// hearts - only count lonely mines
				if (this.game_state.get_block_type(this.x_in_range[i], this.y_in_range[i]) == 2 &&
				    this.game_state.blocks[this.game_state.tiles[this.x_in_range[i]][this.y_in_range[i]]].is_lonely() == true) num++;

				
			} else {
				// all other hints
				if (this.game_state.get_block_type(this.x_in_range[i], this.y_in_range[i]) == 2) {
					num += this.game_state.blocks[this.game_state.tiles[this.x_in_range[i]][this.y_in_range[i]]].get_num_mines();
				}
			}
				
				

			

		}

		//alert('calc_hint_from_range this.present_hint_type' + this.preset_hint_type + ' num ' + num + ' this.x ' + this.x + ' this.y ' + this.y );
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

		if (this.game_state.get_block_type(this.x - 1, this.y - 1) == 2) mines_touching += this.game_state.get_num_mines(this.x - 1, this.y - 1);
		if (this.game_state.get_block_type(this.x + 1, this.y - 1) == 2) mines_touching += this.game_state.get_num_mines(this.x + 1, this.y - 1);
		if (this.game_state.get_block_type(this.x + 1, this.y + 1) == 2) mines_touching += this.game_state.get_num_mines(this.x + 1, this.y + 1);
		if (this.game_state.get_block_type(this.x - 1, this.y + 1) == 2) mines_touching += this.game_state.get_num_mines(this.x - 1, this.y + 1);

		if (this.count_flags == 1) {

			mines_touching = 0;

			if (this.x > 0 && this.game_state.blocks[this.game_state.tiles[this.x - 1][this.y - 1]].flag_on == true) mines_touching++;
			if (this.y > 0 && this.game_state.blocks[this.game_state.tiles[this.x + 1][this.y - 1]].flag_on == true) mines_touching++;
			if (this.x < this.game_state.grid_w - 1 && this.game_state.blocks[this.game_state.tiles[this.x + 1][this.y + 1]].flag_on == true) mines_touching++;
			if (this.y < this.game_state.grid_h - 1 && this.game_state.blocks[this.game_state.tiles[this.x - 1][this.y + 1]].flag_on == true) mines_touching++;

				
		}

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

		if (this.x > 0 && this.game_state.get_block_type(this.x - 1, this.y) == 2) mines_touching += this.game_state.get_num_mines(this.x - 1, this.y);
		if (this.y > 0 && this.game_state.get_block_type(this.x, this.y - 1) == 2) mines_touching += this.game_state.get_num_mines(this.x, this.y - 1);
		if (this.x < this.game_state.grid_w - 1 && this.game_state.get_block_type(this.x + 1, this.y) == 2) mines_touching += this.game_state.get_num_mines(this.x + 1, this.y);

		if (this.y < this.game_state.grid_h - 1 && this.game_state.get_block_type(this.x, this.y + 1) == 2) mines_touching += this.game_state.get_num_mines(this.x, this.y + 1);


		if (this.count_flags == 1) {
			alert('this.count_flags == 1');
			mines_touching = 0;

			if (this.x > 0 && this.game_state.blocks[this.game_state.tiles[this.x - 1][this.y]].flag_on == true) mines_touching++;
			if (this.y > 0 && this.game_state.blocks[this.game_state.tiles[this.x ][this.y - 1]].flag_on == true) mines_touching++;
			if (this.x < this.game_state.grid_w - 1 && this.game_state.blocks[this.game_state.tiles[this.x + 1][this.y]].flag_on == true) mines_touching++;
			if (this.y < this.game_state.grid_h - 1 && this.game_state.blocks[this.game_state.tiles[this.x][this.y + 1]].flag_on == true) mines_touching++;

				
		}

		

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

	is_flag_lonelyOLD: function() {
		if (this.x > 0 && (this.game_state.blocks[this.game_state.tiles[this.x-1][this.y]].flag_on ||
				   this.game_state.blocks[this.game_state.tiles[this.x-1][this.y]].covered_up)) return false;

		if (this.x < this.game_state.grid_w - 1 && (this.game_state.blocks[this.game_state.tiles[this.x+1][this.y]].flag_on ||
				   this.game_state.blocks[this.game_state.tiles[this.x+1][this.y]].covered_up)) return false;

		if (this.y > 0 && (this.game_state.blocks[this.game_state.tiles[this.x][this.y-1]].flag_on ||
				   this.game_state.blocks[this.game_state.tiles[this.x][this.y-1]].covered_up)) return false;

		if (this.y < this.game_state.grid_h - 1 && (this.game_state.blocks[this.game_state.tiles[this.x][this.y+1]].flag_on ||
				   this.game_state.blocks[this.game_state.tiles[this.x][this.y+1]].covered_up)) return false;
	},

	is_covered : function () {
		return this.covered_up;
	},

	is_undug_and_unflagged : function () {
		if (this.covered_up == true && this.flag_on == false) return true;
	},

	is_solved : function () {
		if (this.block_type == 2 && this.flag_on == false) return false;
		if (this.block_type == 0 && this.covered_up == true) return false;
		return true;
	},

	is_neighbours_solved : function () {

		var all_good = true;

		if (this.x > 0 && this.game_state.is_solved(this.x - 1,this.y) != true) all_good = false;

		if (this.x < this.game_state.grid_w - 1 && this.game_state.is_solved(this.x + 1,this.y) != true) all_good = false;

		if (this.y > 0 && this.game_state.is_solved(this.x,this.y - 1) != true) all_good = false;

		if (this.y < this.game_state.grid_h - 1 && this.game_state.is_solved(this.x,this.y + 1) != true) all_good = false;
		
		return all_good;
	},

	is_flag_lonely: function () {

		// returns -1 notlonely  0 unsure  1 yeslonely

		if (this.x > 0 && this.game_state.is_flagged(this.x - 1,this.y) == true) return -1;

		if (this.x < this.game_state.grid_w - 1 && this.game_state.is_flagged(this.x + 1,this.y) == true) return -1;

		if (this.y > 0 && this.game_state.is_flagged(this.x,this.y - 1) == true) return -1;

		if (this.y < this.game_state.grid_h - 1 && this.game_state.is_flagged(this.x,this.y + 1) == true) return -1;

		// covered?

		if (this.x > 0 && this.game_state.is_covered(this.x - 1,this.y) == true) return 0;

		if (this.x < this.game_state.grid_w - 1 && this.game_state.is_covered(this.x + 1,this.y) == true) return 0;

		if (this.y > 0 && this.game_state.is_covered(this.x,this.y - 1) == true) return 0;

		if (this.y < this.game_state.grid_h - 1 && this.game_state.is_covered(this.x,this.y + 1) == true) return 0;

		return 1; // so lonely

		
	},

	

	is_lonely: function() {

		

		if (this.x > 0 && this.game_state.get_block_type(this.x - 1,this.y) == 2) return false;

		if (this.x < this.game_state.grid_w - 1 && this.game_state.get_block_type(this.x + 1,this.y) == 2) return false;

		if (this.y > 0 && this.game_state.get_block_type(this.x,this.y - 1) == 2) return false;

		if (this.y < this.game_state.grid_h - 1 && this.game_state.get_block_type(this.x,this.y + 1) == 2) return false;

		return true; // so lonely

		

	},

	calc_hint_eye_num: function (only_count_lonely_mines, only_count_directions, count_highest_sequence, only_count_groups,
					only_count_empties, mines_are_wall, only_count_gems) {

		var only_vert = false;
		var only_horiz = false;
	
		if (only_count_directions == null) only_count_directions = false;
		if (only_count_lonely_mines == null) only_count_lonely_mines = false;
		if (only_horiz == null) only_horiz = false;
		if (only_vert == null) only_vert = false;
		if (only_count_groups == null) only_count_groups = false;
		if (only_count_empties == null) only_count_empties = false;
		if (mines_are_wall == null ) mines_are_wall = false;
		if (only_count_gems == null) only_count_gems = false;

		

		var mines_seen = 0;

		var lonely_mines = 0;
		// look up

		var left_= 0;
		var right_= 0;
		var up_= 0;
		var down_ = 0;

		var best_sequence = 0;
		var current_sequence = 0;

		var num_groups = 0;

		var num_empties = -4;	// we count ourselves four times
		var num_gems = -4;

		for (var y = this.y; y >= 0; y--) {
			if (only_horiz == true) break;

			var tile_ = this.game_state.get_block_type(this.x,y);

			var multi_ = this.game_state.get_num_mines(this.x,y);

			if (this.count_flags == 1) {
				var flagged_ = this.game_state.blocks[this.game_state.tiles[this.x][y]].flag_on;
				var covered_ = this.game_state.blocks[this.game_state.tiles[this.x][y]].covered_up;

				if (covered_ == true && flagged_ == true) tile_ = 2;
				else tile_ = 0;		// dug or unflagged : any undug tiles in range == not satisified
							//		      which we check elsewhere
			}

			if (only_count_lonely_mines == true && tile_ == 2 &&
			    this.game_state.blocks[this.game_state.tiles[this.x][y]].is_lonely() == true) lonely_mines++;

			

			if (tile_ != 2) {

				


				best_sequence = Math.max(best_sequence, current_sequence);
				current_sequence = 0;
			}

			if (tile_ == 2 && mines_are_wall == true) break;

			if (tile_ == 2) {

				if (current_sequence == 0) num_groups++;

				current_sequence += multi_;
				best_sequence = Math.max(best_sequence, current_sequence);

				
				

				mines_seen += multi_;
				up_ = 1;
			} else if (tile_ == 1) break;
			else if (tile_ == 0) num_empties++;

			

			if (only_count_gems == true &&
			    this.game_state.blocks[this.game_state.tiles[this.x][y]].preset_hint_type == 48) num_gems++;

			
			this.x_in_range.push(this.x);
			this.y_in_range.push(y);
			
		}

		// look left
		for (var x = this.x; x >= 0; x--) {
			if (only_vert == true) break;
			var tile_ = this.game_state.get_block_type(x,this.y);
			var multi_ = this.game_state.get_num_mines(x,this.y);

			if (this.count_flags == 1) {
				var flagged_ = this.game_state.blocks[this.game_state.tiles[x][this.y]].flag_on;
				var covered_ = this.game_state.blocks[this.game_state.tiles[x][this.y]].covered_up;

				if (covered_ == true && flagged_ == true) tile_ = 2;
				else tile_ = 0;		// dug or unflagged : any undug tiles in range == not satisified
							//		      which we check elsewhere
			} // if counting flags


			if (only_count_lonely_mines == true && tile_ == 2 &&
			    this.game_state.blocks[this.game_state.tiles[x][this.y]].is_lonely() == true) lonely_mines++;

			if (tile_ != 2) {
				best_sequence = Math.max(best_sequence, current_sequence);
				current_sequence = 0;
			}

			if (tile_ == 2 && mines_are_wall == true) break;

			if (tile_ == 2) {

				if (current_sequence == 0) num_groups++;

				current_sequence += multi_;
				best_sequence = Math.max(best_sequence, current_sequence);
				mines_seen += multi_;
				left_ = 1;
			} else if (tile_ == 1) break;
			else if (tile_ == 0) num_empties++;

			if (only_count_gems == true &&
			    this.game_state.blocks[this.game_state.tiles[x][this.y]].preset_hint_type == 48) num_gems++;
	
			
			this.x_in_range.push(x);
			this.y_in_range.push(this.y);
			
		}

		// look right
		for (var x = this.x; x < this.game_state.grid_w; x++) {
			if (only_vert == true) break;
			var tile_ = this.game_state.get_block_type(x, this.y);
			var multi_ = this.game_state.get_num_mines(x, this.y);

			if (this.count_flags == 1) {
				var flagged_ = this.game_state.blocks[this.game_state.tiles[x][this.y]].flag_on;
				var covered_ = this.game_state.blocks[this.game_state.tiles[x][this.y]].covered_up;

				if (covered_ == true && flagged_ == true) tile_ = 2;
				else tile_ = 0;		// dug or unflagged : any undug tiles in range == not satisified
							//		      which we check elsewhere
			} // if counting flags 


			if (only_count_lonely_mines == true && tile_ == 2 &&
			    this.game_state.blocks[this.game_state.tiles[x][this.y]].is_lonely() == true) lonely_mines++;

			if (tile_ != 2) {
				best_sequence = Math.max(best_sequence, current_sequence);
				current_sequence = 0;
			}

			if (tile_ == 2 && mines_are_wall == true) break;

			if (tile_ == 2) {

				if (current_sequence == 0) num_groups++;

				current_sequence += multi_;
				best_sequence = Math.max(best_sequence, current_sequence);
				mines_seen += multi_;
				right_ = 1;
			} else if (tile_ == 1) break;
			else if (tile_ == 0) num_empties++;

			if (only_count_gems == true &&
			    this.game_state.blocks[this.game_state.tiles[x][this.y]].preset_hint_type == 48) num_gems++;

			
			this.x_in_range.push(x);
			this.y_in_range.push(this.y);
			
		}

		// look down
		for (var y = this.y; y < this.game_state.grid_h; y++) {
			if (only_horiz == true) break;
			var tile_ = this.game_state.get_block_type(this.x,y);
			var multi_ = this.game_state.get_num_mines(this.x,y);

			if (this.count_flags == 1) {
				var flagged_ = this.game_state.blocks[this.game_state.tiles[this.x][y]].flag_on;
				var covered_ = this.game_state.blocks[this.game_state.tiles[this.x][y]].covered_up;

				if (covered_ == true && flagged_ == true) tile_ = 2;
				else tile_ = 0;		// dug or unflagged : any undug tiles in range == not satisified
							//		      which we check elsewhere
			} // if counting flags


			if (only_count_lonely_mines == true && tile_ == 2 &&
			    this.game_state.blocks[this.game_state.tiles[this.x][y]].is_lonely() == true) lonely_mines++;

			if (tile_ != 2) {
				best_sequence = Math.max(best_sequence, current_sequence);
				current_sequence = 0;
			}

			if (tile_ == 2 && mines_are_wall == true) break;

			if (tile_ == 2) {

				if (current_sequence == 0) num_groups++;

				current_sequence += multi_;
				best_sequence = Math.max(best_sequence, current_sequence);

				

				mines_seen += multi_;
				down_ = 1;
			} else if (tile_ == 1) break;
			else if (tile_ == 0) num_empties++;


			//for (var mine_y = y - current_sequence + 1; mine_y < y; mine_y++) {
			//	this.game_state.blocks[this.game_state.tiles[this.x][mine_y]].my_vert_seq_length = current_sequence;
			//}

			if (only_count_gems == true &&
			    this.game_state.blocks[this.game_state.tiles[this.x][y]].preset_hint_type == 48) num_gems++;

			
			this.x_in_range.push(this.x);
			this.y_in_range.push(y);
			
		}

		if (only_count_lonely_mines == true) mines_seen = lonely_mines;

		this.hint_eye_num = mines_seen;

		if (only_count_empties == true) return num_empties;

		if (only_count_gems == true) return num_gems;

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

			

			this.block_blink_sprite.update_pos(x*this.game_state.tile_size + 0.5*this.game_state.tile_size, y*this.game_state.tile_size + 0.5*this.game_state.tile_size - 4);

			

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
		this.hint_zap_sprite.set_alpha(1);
		this.hint_walker_sprite.set_alpha(1);

		this.hint_crown_sprite.set_alpha(1);
		this.hint_compass_sprite.set_alpha(1);
		this.hint_eyebracket_sprite.set_alpha(1);
		this.hint_eyerepeat_sprite.set_alpha(1);

		this.hint_crown_num_text.set_alpha(1);
		this.hint_compass_num_text.set_alpha(1);
		this.hint_eyebracket_num_text.set_alpha(1);
		this.hint_zap_num_text.set_alpha(1);
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
		this.hint_zap_sprite.set_alpha(0.5);
		this.hint_walker_sprite.set_alpha(0.5);

		this.hint_crown_sprite.set_alpha(0.5);
		this.hint_compass_sprite.set_alpha(0.5);
		this.hint_eyebracket_sprite.set_alpha(0.5);
		this.hint_eyerepeat_sprite.set_alpha(0.5);

		this.hint_crown_num_text.set_alpha(0.5);
		this.hint_compass_num_text.set_alpha(0.5);
		this.hint_eyebracket_num_text.set_alpha(0.5);
		this.hint_zap_num_text.set_alpha(0.5);
	},

	x_in_range: [],
	y_in_range: [],

	happy: false,

	player_grey: 0,

	calc_happiness_by_flags: function () {

		if (this.math_group != -1) return;

		if (this.preset_hint_type == 0) {
			this.happy = true;
			return;
		}

		var store_calc = false;
		this.count_flags = 1;
		g_count_flags = true;
		var num_calc = this.calc_hint(this.preset_hint_type, store_calc);
		this.count_flags = 0;
		g_count_flags = false;

		if (num_calc == this.wanted_num) this.happy = true;
		else this.happy = false;

		if (this.happy) this.grey_out();
		else this.ungrey();
		
	},	

	

	calc_happiness_zap : function () {

		

		var good_ = true;

		if (this.is_neighbours_solved() == false) good_ = false;

		for (var i = 0; i < this.x_in_range.length; i++) {

			var x = this.x_in_range[i];
			var y = this.y_in_range[i];

			if (this.game_state.blocks[this.game_state.tiles[x][y]].block_type != 2) {
				alert('error here: x ' + x + ' y ' + y + ' is falsely in the range of zap at ' + this.x + ' ' + this.y);

			}

			if (this.game_state.is_flagged(x,y) == false) good_ = false;

			if (this.game_state.blocks[this.game_state.tiles[x][y]].is_neighbours_solved() == false) good_ = false;

		}

		this.happy = good_;

		if (this.happy) this.grey_out();
		else this.ungrey();	
	},

	calc_happiness_heart : function () {

		var lonely_ = 0;
		var unknown_ = 0;

		//alert('calc_happiness_heart');

		for (var i = 0; i < this.x_in_range.length; i++) {

			var x = this.x_in_range[i];
			var y = this.y_in_range[i];
			if (x < 0 || y < 0 || x >= this.game_state.grid_w || y >= this.game_state.grid_h ) return;
			if (x == null || x == undefined || y == null || y == undefined) return
			if (this.game_state.get_block_type(x,y) == 1) continue; // wall
			if (this.game_state.is_covered(x,y) == false) continue;
			if (this.game_state.is_flagged(x,y) == false) unknown_++;	
			

			var lone = this.game_state.blocks[this.game_state.tiles[x][y]].is_flag_lonely();

			if (lone == 1) lonely_++;
			else if (lone == 0) unknown_++;	

		}
	
		if (lonely_ == this.wanted_num) this.happy = true;
		else this.happy = false;

		if (this.join_group != 0 && this.join_leader == true) {
			if (lonely_ == this.shared_wanted_num) this.happy = true;
			else this.happy = false;
		}
		

		if (unknown_ > 0) this.happy = false;

		//alert('x ' + this.x + ' y ' + this.y +'\nlonely_ ' +lonely_ + '\nthis.wanted_num ' + this.wanted_num + '\nunknown_'+unknown_);

		if (this.happy) this.grey_out();
		else this.ungrey();		

	},

	calc_happiness: function () {

		if (this.covered_up == true) return;

		if (this.preset_hint_type == 90) return; // timer

		
		if (this.join_group != 0 && this.join_leader == false) {
				
				return;
			
		} 

		if (this.preset_hint_type == 5) {
			this.calc_happiness_heart();
			return;
		} else if (this.preset_hint_type == 49) {
			this.calc_happiness_zap();
			return;
		
		}

		if (this.preset_hint_type == 80) return;

		if (this.math_group != -1) return;

		if (this.player_grey == 1) return;  // player set to grey

		

		if (this.preset_hint_type == 0 || this.covered_up == true || this.block_type == 1)  return;

		


		

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

			if (flagged_ == true) actual += this.game_state.blocks[this.game_state.tiles[x][y]].mine_multi; // actual++

			var covered_ = this.game_state.blocks[this.game_state.tiles[x][y]].covered_up;

			if (covered_ == true && flagged_ == false) {
				still_undug++;	
				
			}			

			if (this.preset_hint_type == 5) {

				if (flagged_ == true) {
					var lone = this.game_state.blocks[this.game_state.tiles[x][y]].is_flag_lonely();

					if (lone == true) lonely_++;
					
				}

			} 
		}

		//console.log('still_undug ' + still_undug + ' this.preset_hint_type ' + this.preset_hint_type + ' hintnum ' + hint_ + ' this.x_in_range ' + this.x_in_range.length );



		if (hint_ == actual && still_undug == 0) this.happy = true;
		else this.happy = false;

		//if (still_undug == 0) this.happy = true;
		//else this.happy = false;

		
		
		

		//if (this.preset_hint_type == 12 && still_undug == 0) this.happy = true;


		var need_all_dug = true;
		//if (this.preset_hint_type == 11) need_all_dug = false;

		if (this.preset_hint_type == 11 && still_undug == 0) this.happy = true;
		if (this.preset_hint_type == 12 && still_undug == 0) this.happy = true;
		if (this.preset_hint_type == 13 && still_undug == 0) this.happy = true;
		if (this.preset_hint_type == 52 && still_undug == 0) this.happy = true;

		if (still_undug > 0 && need_all_dug == true) this.happy = false;
		else if (this.join_group == 0) {
			//this.calc_happiness_by_flags();
			//return;
		}
		
		
		

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

	//show_grid: false,

	show_grid: function () {
		if (this.block_type != 0) return;
		if (this.preset_hint_type != 0) return;
		if (this.join_group != 0) return;
		if (this.sharesquare != false) return;
		if (this.share_pipe != false) return;
		if (this.covered_up == true) return;

		if (g_show_grid == true) this.block_sprite.set_texture("blockemptysmall.png");
		else this.block_sprite.hide();
	},

	set_type: function(gemtype) {

		this.block_type = gemtype;
		

		if (gemtype == 1) this.covered_up = false;	// its a wall

		
		
		if (this.covered_up == true) {

			this.block_sprite.make_vis();
			//this.block_shadow_sprite.make_vis();

			//this.block_shadow_sprite.set_texture('block2_shadow.png');

			if (this.editor_mode == 1) {
				this.block_sprite.set_texture('qn_half.png');
				
			} else {
				//this.block_sprite.set_texture('g_block2.png');
				this.block_sprite.set_texture(g_multi_sprite_cover[this.mine_multi]);
				
			}
			
			

			this.flag_sprite.set_texture(g_multi_sprite_flag[this.mine_multi]);
			

			
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
			
			//else this.block_sprite.set_texture('griddot.png');
		
			//if ((this.x + this.y) % 2 == 0) this.block_sprite.set_texture("blockempty.png");
			    
			if (this.preset_hint_type == 0 &&
			    this.join_group == 0 && this.sharesquare == false &&
			    g_show_grid == true) this.block_sprite.set_texture("blockemptysmall.png");
			else this.block_sprite.hide();
			

			return;
		}


		
		this.block_sprite.make_vis();
		
		

		this.block_sprite.set_texture(g_block_sprites[gemtype]);

		if (gemtype == 2 && this.mine_multi == 2) this.block_sprite.set_texture("2bomb.png");

		//this.block_blink_sprite.set_texture(g_block_blink_sprites[gemtype]);

		
	},

	

	// only called when effects are being done
	draw: function() {
		

	}

});

var g_count_flags = false;

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
