

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
		console.log('ecplode start anim');
		this.curr_frame = 0;
	},

	stop_anim: function () {
		this.curr_frame = 99;
		for (var i = 0; i < this.frames.length; i++) {
				this.frames[i].hide();
		}
	},

	draw: function() {

		console.log('ecplode draw');
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


OverworldSpritesClass = Class.extend({
	
	level_tile_size: 124,

	// where to draw, where to click
	level_x: [],
	level_y: [],

	level_text: [],		// number
	level_box: [],	// TableAreaClass

	level_sprite: [],

	status_sprite: [],	// tick, lock, timer

	game_state: null,

	selected: -1,

	highlight_sprite: null,
	
	init: function(game_state) {
		this.game_state = game_state;

		this.highlight_sprite = new SpriteClass();
		this.highlight_sprite.setup_sprite('level_button_on.png',Types.Layer.HUD);
		this.highlight_sprite.hide();
	},

	highlight_on: function(x,y) {

		for (var i = 0; i < this.level_x.length; i++) {
			if (x > this.level_x[i] - 45 &&
			    x < this.level_x[i] + 45 &&
			    y > this.level_y[i] - 45 &&
			    y < this.level_y[i] + 45) {
				this.highlight_sprite.update_pos(this.level_x[i],this.level_y[i]);
				this.highlight_sprite.make_vis();
				return;
			}
		}

		
	},

	highlight_off: function() {
		this.highlight_sprite.hide();
	},

	set_status: function(level, status_) {

		if (status_ == 2) {
			this.status_sprite[level].set_texture('timer.png');
		} else if (status_ == 3) {
			this.status_sprite[level].set_texture('lock.png');
		} else if (status_ == 4) {
			this.status_sprite[level].set_texture('tick.png');
		}

		this.status_sprite[level].make_vis();
	},	

	no_status: function(level) {

		if (level > this.status_sprite.length - 1) return;

		this.status_sprite[level].hide();
	},

	add_level: function (spritename) {

		var x = this.level_x.length % 5;
		var y = Math.floor(this.level_y.length / 5);

		x = x*this.level_tile_size;
		y = y*this.level_tile_size + 200;

		this.level_x.push(x);
		this.level_y.push(y);

		var box_ = new SpriteClass();//TableAreaClass(this.game_state, "");
		//box_.close_loop = true;
		//box_.resize(-999,-999,
		//	     		 -999,-999);
		//box_.colour = 0xB21D96;

		box_.setup_sprite('level_button_on.png',Types.Layer.TILE)

		var text_ = new TextClass(Types.Layer.HUD);			// dunno if BACKGROUND works yet
		text_.set_font(Types.Fonts.MEDIUM);
		text_.set_text(this.level_x.length.toString());
		text_.update_pos(-999,-999);

		this.level_text.push(text_);
		this.level_box.push(box_);
		

		if (spritename == null) {
			this.level_sprite.push(null);
		} else {
			var sprite_ = new SpriteClass();
			sprite_.setup_sprite(spritename,Types.Layer.HUD);
			sprite_.hide();
			this.level_sprite.push(sprite_);
		}

		var status_ = new SpriteClass();
		status_.setup_sprite(spritename,Types.Layer.HUD);
		status_.hide();
		this.status_sprite.push(status_);
	},

	

	click: function(x,y) {
		this.highlight_off();
		this.selected = -1;
		for (var i = 0; i < this.level_x.length; i++) {
			if (x > this.level_x[i] - 45 &&
			    x < this.level_x[i] + 45 &&
			    y > this.level_y[i] - 45 &&
			    y < this.level_y[i] + 45) {
				this.selected = i;
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
		for (var i = 0; i < this.level_x.length; i++) {

			var x = this.level_x[i];
			var y = this.level_y[i];

			this.level_box[i].make_vis();
			this.level_box[i].update_pos(x, y);

			this.level_text[i].update_pos(x, y + 10);
			this.level_text[i].center_x(x);

			if (this.level_sprite[i] != null) {
				this.level_sprite[i].make_vis();
				this.level_sprite[i].update_pos(x, y - 10);

			}

			this.status_sprite[i].update_pos(x + 45, y - 45);
			
		}
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
		this.text.set_font(Types.Fonts.SMALL);
		this.text.set_text("");
		

		//this.box = new TableAreaClass(game_state, "");
		//this.box.close_loop = true;

		
	},

	set_hint_type: function(hint_) {
		if (hint_ == 1) {
				this.block_obj.set_texture('hand.png');
				this.text.change_text("Number of mines in the 4 surrounding tiles");
			} else if (hint_ == 2) {
				this.block_obj.set_texture('eye.png');
				this.text.change_text("Number of mines in line of sight, this row and column");
			} else if (hint_ == 3) {
				this.block_obj.set_texture('plus.png');
				this.text.change_text("Addition");
			} else if (hint_ == 4) {
				this.block_obj.set_texture('8hand.png');
				this.text.change_text("Number of mines in the 8 surrounding tiles");
			} else {
				// uncovered, no hint, empty
				
			}
	},

	set_block: function (x , y) {
		// hint types (block type empty, uncovered)
		if (this.game_state.get_block_type(x,y) == 0 &&
		    this.game_state.blocks[this.game_state.tiles[x][y]].covered_up == false) {

			// exposed hint
			var hint_ = this.game_state.blocks[this.game_state.tiles[x][y]].preset_hint_type;
			this.set_hint_type(hint_);
			
		} else {
			
		}
	},

	draw_once: function() {
		if (this.hidden == true) {
			this.block_obj.hide();
			this.text.update_pos(-999,-999);
			//this.box.resize(-999,-999,-999,-999);
		} else if (screen_width > screen_height) {
			this.block_obj.make_vis();
			this.block_obj.update_pos(12*this.game_state.tile_size, 4*this.game_state.tile_size);
			this.text.update_pos(12*this.game_state.tile_size, 5*this.game_state.tile_size, 200, 200);
			//this.box.resize(11.5*this.game_state.tile_size, 3.5*this.game_state.tile_size,
			//		11.5*this.game_state.tile_size + 240, 6.5*this.game_state.tile_size);
		} else {
			this.block_obj.make_vis();
			this.block_obj.update_pos(1*this.game_state.tile_size, 11*this.game_state.tile_size);
			this.text.update_pos(1*this.game_state.tile_size, 12*this.game_state.tile_size, 200, 200);
			//this.box.resize(0.5*this.game_state.tile_size, 10.5*this.game_state.tile_size,
			//		0.5*this.game_state.tile_size + 240, 15*this.game_state.tile_size);
		}
	}

});

BlockClass = Class.extend({

	index: -1,	
	block_type: -1,

	block_blink_sprite: null,
	block_sprite: null,
	block_shadow_sprite: null,
	
	

	x: -1,
	y: -1,

	y_vel: 0,

	game_state: null,	

	y_scale: 1,	// for fire effect

	blink_timer: 0,

	covered_up: true,
	flag_on :false,

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

	flag_sprite: null,

	joined_with: -1,
	join_group: 0,

	join_h_sprite: null,
	join_v_sprite: null,
	join_screen_sprite: null,

	init: function(game_state) {

		this.game_state = game_state;

		this.block_type = 1;

		this.block_blink_sprite = new SpriteClass();
		this.block_blink_sprite.setup_sprite("select.png",Types.Layer.HUD);
		this.block_blink_sprite.hide();
		
		this.block_shadow_sprite = new SpriteClass();
		this.block_shadow_sprite.setup_sprite("block1_shadow.png",Types.Layer.TILE);
		this.block_shadow_sprite.hide();

		this.block_sprite = new SpriteClass();
		this.block_sprite.setup_sprite("block0.png",Types.Layer.GAME);
		this.block_sprite.hide();

		this.join_v_sprite = new SpriteClass();
		this.join_v_sprite.setup_sprite('joiner_v.png',Types.Layer.TILE);
		this.join_v_sprite.hide();

		this.join_h_sprite = new SpriteClass();
		this.join_h_sprite.setup_sprite('joiner_h.png',Types.Layer.TILE);
		this.join_h_sprite.hide();

		this.join_screen_sprite = new SpriteClass();
		this.join_screen_sprite.setup_sprite('joiner_sign.png',Types.Layer.TILE);
		this.join_screen_sprite.hide();

		this.flag_sprite = new SpriteClass();
		this.flag_sprite.setup_sprite("flagblock.png",Types.Layer.GAME);
		this.flag_sprite.hide();

		this.hint_eye_num_text = new TextClass(Types.Layer.TILE);
		this.hint_eye_num_text.set_font(Types.Fonts.MEDIUM);
		this.hint_eye_num_text.set_text("");
		this.hint_eye_num_text.update_pos(-999,-999);

		this.hint_eye_sprite = new SpriteClass();
		this.hint_eye_sprite.setup_sprite("eye.png",Types.Layer.GAME);
		this.hint_eye_sprite.hide();

		this.hint_touch_num_text = new TextClass(Types.Layer.TILE);
		this.hint_touch_num_text.set_font(Types.Fonts.MEDIUM);
		this.hint_touch_num_text.set_text("");
		this.hint_touch_num_text.update_pos(-999,-999);

		this.hint_touch_sprite = new SpriteClass();
		this.hint_touch_sprite.setup_sprite("hand.png",Types.Layer.GAME);
		this.hint_touch_sprite.hide();

		this.hint_eight_touch_sprite = new SpriteClass();
		this.hint_eight_touch_sprite.setup_sprite("8hand.png",Types.Layer.GAME);
		this.hint_eight_touch_sprite.hide();

		this.hint_add_num_text = new TextClass(Types.Layer.TILE);
		this.hint_add_num_text.set_font(Types.Fonts.MEDIUM);
		this.hint_add_num_text.set_text("");
		this.hint_add_num_text.update_pos(-999,-999);

		this.hint_add_sprite = new SpriteClass();
		this.hint_add_sprite.setup_sprite("eyeplustouch.png",Types.Layer.GAME);
		this.hint_add_sprite.hide();

		
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

	reset: function() {
		this.join_group = 0;
		this.join_h_sprite.hide();
		this.join_v_sprite.hide();

		this.join_screen_sprite.hide();

		this.join_h = false;
		this.join_v = false;

		//this.hint_touch_sprite.hide();
		//this.hint_add_sprite.hide();
		//this.hint_eye_num_text.update_pos(-999,-999);
	},

	join_h: false,
	join_v: false,

	set_join_h_sprite: function() {
		this.join_h_sprite.make_vis();
		this.join_h_sprite.update_pos(this.x*this.game_state.tile_size + 1*this.game_state.tile_size, 
					     this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size + 3);

		this.join_screen_sprite.update_pos(this.x*this.game_state.tile_size + 1*this.game_state.tile_size, 
					           this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size - 16);
		//this.join_screen_sprite.make_vis();
		
	},

	set_join_v_sprite: function() {
		this.join_v_sprite.make_vis();
		this.join_v_sprite.update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 
					     this.y*this.game_state.tile_size + 1*this.game_state.tile_size + 3);

		this.join_screen_sprite.update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 
					     	   this.y*this.game_state.tile_size + 1*this.game_state.tile_size - 16);
		//this.join_screen_sprite.make_vis();
	},

	cover: function() {

		

		this.deselect();

		this.covered_up = true;
		this.flag_on = false;

		this.block_sprite.hide();
		this.block_shadow_sprite.hide();

		this.hint_eye_sprite.hide();
		this.hint_touch_sprite.hide();
		this.hint_add_sprite.hide();
		this.hint_eight_touch_sprite.hide();
		

		this.hint_touch_num_text.update_pos(-999,-999);
		this.hint_eye_num_text.update_pos(-999,-999);
		this.hint_add_num_text.update_pos(-999,-999);

		this.set_type(this.block_type);

	},

	show_hint: function(hinttype, hint_) {
		if (hinttype == 2) {

			this.hint_eye_num_text.change_text(hint_.toString());
			this.hint_eye_num_text.update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 
							  this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size);
			this.hint_eye_num_text.center_x(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size);

			this.hint_eye_sprite.make_vis();
			this.hint_eye_sprite.update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 
							this.y*this.game_state.tile_size + 0.25*this.game_state.tile_size);
		} else if (hinttype == 1) {

			this.hint_touch_num_text.change_text(hint_.toString());
			this.hint_touch_num_text.update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 
							    this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size);
			this.hint_touch_num_text.center_x(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size);

			this.hint_touch_sprite.make_vis();
			this.hint_touch_sprite.update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 
							 this.y*this.game_state.tile_size + 0.25*this.game_state.tile_size);
		} else if (hinttype == 3) {

			this.hint_add_num_text.change_text(hint_.toString());
			this.hint_add_num_text.update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 
							    this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size);
			this.hint_add_num_text.center_x(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size);

			this.hint_add_sprite.make_vis();
			this.hint_add_sprite.update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 
							 this.y*this.game_state.tile_size + 0.25*this.game_state.tile_size);
		} else if (hinttype == 4) {
			
			this.hint_touch_num_text.change_text(hint_.toString());
			this.hint_touch_num_text.update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 
							    this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size);
			this.hint_touch_num_text.center_x(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size);

			this.hint_eight_touch_sprite.make_vis();
			this.hint_eight_touch_sprite.update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 
							 this.y*this.game_state.tile_size + 0.25*this.game_state.tile_size);
			
		}
	},

	a_calc_hint: function(hinttype) {

		var num = 0;

		if (hinttype == 2) {
			num = this.calc_hint_eye_num();

			this.hint_eye_num_text.change_text(this.hint_eye_num.toString());
			this.hint_eye_num_text.update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 
							  this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size);
			this.hint_eye_num_text.center_x(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size);

			this.hint_eye_sprite.make_vis();
			this.hint_eye_sprite.update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 
							this.y*this.game_state.tile_size + 0.25*this.game_state.tile_size);
		} else if (hinttype == 1) {
			num = this.calc_hint_touch_num();

			this.hint_touch_num_text.change_text(this.hint_touch_num.toString());
			this.hint_touch_num_text.update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 
							    this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size);
			this.hint_touch_num_text.center_x(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size);

			this.hint_touch_sprite.make_vis();
			this.hint_touch_sprite.update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 
							 this.y*this.game_state.tile_size + 0.25*this.game_state.tile_size);
		} else if (hinttype == 3) {
			this.calc_hint_eye_num();
			this.calc_hint_touch_num();

			num = this.hint_add_num = this.hint_touch_num + this.hint_eye_num;

			this.hint_add_num_text.change_text(this.hint_add_num.toString());
			this.hint_add_num_text.update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 
							    this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size);
			this.hint_add_num_text.center_x(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size);

			this.hint_add_sprite.make_vis();
			this.hint_add_sprite.update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 
							 this.y*this.game_state.tile_size + 0.25*this.game_state.tile_size);
		} else if (hinttype == 4) {
			num = this.calc_hint_eight_touch_num();
			
			this.hint_touch_num_text.change_text(this.hint_touch_num.toString());
			this.hint_touch_num_text.update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 
							    this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size);
			this.hint_touch_num_text.center_x(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size);

			this.hint_eight_touch_sprite.make_vis();
			this.hint_eight_touch_sprite.update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 
							 this.y*this.game_state.tile_size + 0.25*this.game_state.tile_size);
			
		}

		return num;
	},

	calc_hint: function(hinttype) {

		var num = 0;

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
			
			
		}

		return num;
	},

	uncover_joined: function() {

	},

	uncover: function (show_hint) {

		

		this.deselect();

		

		this.covered_up = false;
		this.flag_on = false;
		this.set_type(this.block_type);

		var join_add = 0;

		if (this.join_group != 0) {

			

			if (this.join_h == true) {
				this.set_join_h_sprite();
			}

			if (this.join_v == true) {
				this.set_join_v_sprite();
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
		}

		if (this.block_type == 2 || show_hint == false) {
			return;		// dont show the hint
		}

		var hint_ = this.calc_hint(this.preset_hint_type);
		hint_ += join_add;
		
		this.show_hint(this.preset_hint_type, hint_);
		
		return;

		
	},

	preset_hint_type: 0,

	preset_hint: function (hinttype) {
		// 1 touch
		// 2 see
		// 3 touch + see
		// 4 eight touch

		this.preset_hint_type = hinttype;
	},

	

	calc_hint_eight_touch_num: function() {

		// double using this variable, hope thats okay
		this.calc_hint_touch_num();

		var mines_touching = 0;

		if (this.game_state.get_block_type(this.x - 1, this.y - 1) == 2) mines_touching++;
		if (this.game_state.get_block_type(this.x + 1, this.y - 1) == 2) mines_touching++;
		if (this.game_state.get_block_type(this.x + 1, this.y + 1) == 2) mines_touching++;
		if (this.game_state.get_block_type(this.x - 1, this.y + 1) == 2) mines_touching++;

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

		this.hint_touch_num = mines_touching;

		return mines_touching;
	},

	calc_hint_eye_num: function () {
		var mines_seen = 0;
		// look up

		for (var y = this.y; y >= 0; y--) {
			var tile_ = this.game_state.get_block_type(this.x,y);
			if (tile_ == 2) mines_seen++;
			else if (tile_ == 1) break;
		}

		// look left
		for (var x = this.x; x >= 0; x--) {
			var tile_ = this.game_state.get_block_type(x,this.y);
			if (tile_ == 2) mines_seen++;
			else if (tile_ == 1) break;
		}

		// look right
		for (var x = this.x; x < this.game_state.grid_w; x++) {
			var tile_ = this.game_state.get_block_type(x, this.y);
			if (tile_ == 2) mines_seen++;
			else if (tile_ == 1) break;
		}

		// look down
		for (var y = this.y; y < this.game_state.grid_h; y++) {
			var tile_ = this.game_state.get_block_type(this.x,y);
			if (tile_ == 2) mines_seen++;
			else if (tile_ == 1) break;
		}

		this.hint_eye_num = mines_seen;

		return mines_seen;
	},

	set_position_grid: function(x,y) {
		this.x = x;
		this.y = y;


		if (x == -1) {
			this.block_sprite.hide();
			this.block_shadow_sprite.hide();
			this.flag_sprite.hide();
		} else {
			this.block_sprite.make_vis();
			this.block_shadow_sprite.make_vis();
			//this.flag_sprite.make_vis();

			

			this.block_blink_sprite.update_pos(x*this.game_state.tile_size + 0.5*this.game_state.tile_size, y*this.game_state.tile_size + 0.5*this.game_state.tile_size);

			

			this.block_sprite.update_pos(x*this.game_state.tile_size + 0.5*this.game_state.tile_size, y*this.game_state.tile_size + 0.5*this.game_state.tile_size);
			this.block_shadow_sprite.update_pos(x*this.game_state.tile_size + 0.5*this.game_state.tile_size, y*this.game_state.tile_size + 6 + 0.5*this.game_state.tile_size);

			this.flag_sprite.update_pos(x*this.game_state.tile_size + 0.5*this.game_state.tile_size, y*this.game_state.tile_size + 0.5*this.game_state.tile_size);
		}

		

	},

	get_type: function() {
		return this.block_type;
	},

	set_type: function(gemtype) {

		this.block_type = gemtype;
		

		if (gemtype == 1) this.covered_up = false;	// its a wall

		if (this.covered_up == true) {

			this.block_sprite.make_vis();
			this.block_shadow_sprite.make_vis();

			this.block_sprite.set_texture('g_block2.png');
			this.block_shadow_sprite.set_texture('block2_shadow.png');
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
			this.block_sprite.hide();
			this.block_shadow_sprite.hide();
			return;
		}


		
		this.block_sprite.make_vis();
		this.block_shadow_sprite.make_vis();

		this.block_sprite.set_texture(g_block_sprites[gemtype]);
		this.block_shadow_sprite.set_texture(g_block_shadow_sprites[gemtype]);
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





