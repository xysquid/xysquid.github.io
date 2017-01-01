

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

LevelEditorTileSelectClass = Class.extend({


	build_x: [],
	build_y: [],
	build_codes: [],
	build_sprites: [],

	selected: -1,

	size_: 64,

	init: function(game_state) {
		
	},

	add_new: function(spritename, code) {
		var sprite_ = new SpriteClass;
		sprite_.setup_sprite(spritename,Types.Layer.GAME_MENU);

		this.build_codes.push(code);
		this.build_sprites.push(sprite_);
		this.build_x.push(0);
		this.build_y.push(0);
		
	},

	click : function (x, y) {
		//this.selected = -1;
		for (var i = 0; i < this.build_x.length; i++) {

			//this.highlight_off();
			
		
			if (x > this.build_x[i] - this.size_*0.5 &&
			    x < this.build_x[i] + this.size_*0.5 &&
			    y > this.build_y[i] - this.size_*0.5 &&
			    y < this.build_y[i] + this.size_*0.5) {
			
				this.selected = i;
				//alert('selected ' + i);

				return;
			}

		}

		
	},

	hide: function() {
		for (var i = 0; i < this.build_x.length; i++) {
			this.build_sprites[i].hide();
		}
	},

  	make_vis: function() {
		for (var i = 0; i < this.build_x.length; i++) {
			this.build_sprites[i].make_vis();
			this.build_x[i] = i*this.size_ + 2*this.size_;
			this.build_y[i] = screen_height - 0.5*this.size_;
			this.build_sprites[i].update_pos(this.build_x[i], this.build_y[i]);
			
			
		}
	},

	screen_resized: function() {
		
	}

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
				this.level_sprite[i].update_pos(x - 20, y);

			}

			if (this.level_status[i] != 0) {
				this.status_sprite[i].update_pos(x + 45, y - 23);
			} else this.status_sprite[i].hide();

			if (this.special_code[i] == 0) {
				this.level_text[i].update_pos(x + 20, y - 20,96,999);
				this.level_text[i].center_x(x + 20);
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
				this.text.change_text("      Number of mines in the 4 surrounding tiles.");
			} else if (hint_ == 2) {
				this.block_obj.set_texture('eye.png');
				this.text.change_text("      Number of mines in line of sight, this row and column. Blocked by walls.");
			} else if (hint_ == 3) {
				this.block_obj.set_texture('eyeplustouch.png');
				this.text.change_text("      The number of mines seen PLUS the number of mines touched. Touched mines will be counted 2X");
			} else if (hint_ == 4) {
				this.block_obj.set_texture('8hand.png');
				this.text.change_text("      Number of mines in the 8 surrounding tiles.");
			} else if (hint_ == 5) {
				this.block_obj.set_texture('heart.png');
				this.text.change_text("      Like the eye, but only sees lonely mines. Lonely mines have no other mines in the 8 tiles around them.");
			} else {
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

	flag_sprite: null,

	joined_with: -1,
	join_group: 0,

	join_h_sprite: null,
	join_v_sprite: null,

	editor_mode: 0,		// draw half covered

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


		this.flag_sprite = new SpriteClass();
		this.flag_sprite.setup_sprite("flagblock.png",Types.Layer.GAME);
		this.flag_sprite.hide();

		this.hint_eye_num_text = new CounterClass(Types.Layer.TILE);
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
					if (tile_ == 1) return 0;
					else if (yy == y) return 1;
				}

				// look down
				for (var yy = this.y; yy < this.game_state.grid_h; yy++) {
					var tile_ = this.game_state.get_block_type(this.x,yy);
					if (tile_ == 1) return 0;
					else if (yy == y) return 1;
				}

			} else if (y == this.y) {
				// look right
				
				for (var xx = this.x; xx < this.game_state.grid_w; xx++) {
					var tile_ = this.game_state.get_block_type(xx, this.y);
					if (tile_ == 1) return 0;
					else if (xx == x) return 1;
				}

				// look left
				for (var xx = this.x; xx >= 0; xx--) {
					var tile_ = this.game_state.get_block_type(xx, this.y);
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
			else if (x == this.x - 1&& y == this.y - 1) return 1;
			else if (x == this.x + 1&& y == this.y + 1) return 1;
			else if (x == this.x + 1 && y == this.y - 1) return 1;
			else if (x == this.x - 1 && y == this.y + 1) return 1;

		}

		return 0;
	},

	reset: function() {
		this.join_group = 0;
		this.join_h_sprite.hide();
		this.join_v_sprite.hide();


		this.join_h = false;
		this.join_v = false;

		//this.hint_touch_sprite.hide();
		//this.hint_add_sprite.hide();
		//this.hint_eye_num_text.update_pos(-999,-999);

		this.editor_mode = 0;
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
		this.block_shadow_sprite.hide();

		if (this.editor_mode == 0) {
			this.hint_eye_sprite.hide();
			this.hint_touch_sprite.hide();
			this.hint_add_sprite.hide();
			this.hint_eight_touch_sprite.hide();
			this.hint_heart_sprite.hide();
		

			this.hint_touch_num_text.update_pos(-999,-999);
			this.hint_eye_num_text.update_pos(-999,-999);
			this.hint_add_num_text.update_pos(-999,-999);
			this.hint_heart_num_text.update_pos(-999,-999);
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
			
		}
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
			
			
		} else if (hinttype == 5) {
			var only_count_lonely_mines = true;
			num = this.calc_hint_eye_num(only_count_lonely_mines);
			
			
		}

		return num;
	},

	uncover_joined: function() {

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

			// 
		
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

	is_lonely: function() {
		if (this.x > 0 && this.game_state.get_block_type(this.x - 1,this.y) == 2) return false;

		if (this.x < this.game_state.grid_w - 1 && this.game_state.get_block_type(this.x + 1,this.y) == 2) return false;

		if (this.y > 0 && this.game_state.get_block_type(this.x,this.y - 1) == 2) return false;

		if (this.y < this.game_state.grid_h - 1 && this.game_state.get_block_type(this.x,this.y + 1) == 2) return false;

		// diag
		if (this.x > 0 && this.y > 0 && this.game_state.get_block_type(this.x - 1,this.y - 1) == 2) return false;

		if (this.x < this.game_state.grid_w - 1 && this.y > 0 && this.game_state.get_block_type(this.x + 1,this.y - 1) == 2) return false;

		if (this.x < this.game_state.grid_w - 1 && this.y < this.game_state.grid_h - 1 && this.game_state.get_block_type(this.x + 1,this.y + 1) == 2) return false;

		if (this.y > 0 && this.y < this.game_state.grid_h - 1 && this.game_state.get_block_type(this.x - 1,this.y + 1) == 2) return false;

		return true; // so lonely

	},

	calc_hint_eye_num: function (only_count_lonely_mines, only_horiz, only_vert) {

		if (only_count_lonely_mines == null) only_count_lonely_mines = false;
		if (only_horiz == null) only_horiz = false;
		if (only_vert == null) only_vert = false;

		var mines_seen = 0;
		// look up

		for (var y = this.y; y >= 0; y--) {
			if (only_horiz == true) break;
			var tile_ = this.game_state.get_block_type(this.x,y);
			if (only_count_lonely_mines == true && tile_ == 2 &&
			    this.game_state.blocks[this.game_state.tiles[this.x][y]].is_lonely() == false) continue;
			if (tile_ == 2) mines_seen++;
			else if (tile_ == 1) break;
		}

		// look left
		for (var x = this.x; x >= 0; x--) {
			if (only_vert == true) break;
			var tile_ = this.game_state.get_block_type(x,this.y);
			if (only_count_lonely_mines == true && tile_ == 2 &&
			    this.game_state.blocks[this.game_state.tiles[x][this.y]].is_lonely() == false) continue;
			if (tile_ == 2) mines_seen++;
			else if (tile_ == 1) break;
		}

		// look right
		for (var x = this.x; x < this.game_state.grid_w; x++) {
			if (only_vert == true) break;
			var tile_ = this.game_state.get_block_type(x, this.y);
			if (only_count_lonely_mines == true && tile_ == 2 &&
			    this.game_state.blocks[this.game_state.tiles[x][this.y]].is_lonely() == false) continue;
			if (tile_ == 2) mines_seen++;
			else if (tile_ == 1) break;
		}

		// look down
		for (var y = this.y; y < this.game_state.grid_h; y++) {
			if (only_horiz == true) break;
			var tile_ = this.game_state.get_block_type(this.x,y);
			if (only_count_lonely_mines == true && tile_ == 2 &&
			    this.game_state.blocks[this.game_state.tiles[this.x][y]].is_lonely() == false) continue;
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

			this.block_shadow_sprite.set_texture('block2_shadow.png');

			if (this.editor_mode == 1) {
				this.block_sprite.set_texture('qn_half.png');
				this.block_shadow_sprite.hide();
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
			this.block_sprite.hide();
			this.block_shadow_sprite.hide();
			return;
		}


		
		this.block_sprite.make_vis();
		this.block_shadow_sprite.make_vis();

		this.block_sprite.set_texture(g_block_sprites[gemtype]);
		this.block_shadow_sprite.set_texture(g_block_shadow_sprites[gemtype]);

		if (gemtype == 2) this.block_shadow_sprite.hide();	// bomb
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
