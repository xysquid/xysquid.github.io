




TutHighlightClass = Class.extend({
	pixi_rect: null,

	game_state: null,

	x_min: 0,
	y_min: 0,
	x_max: 0,
	y_max: 0,

	pixiline: null,
	tiles_x: [],
	tiles_y: [],

	init: function(game_state) {
		this.game_state = game_state;
		// x, y, xx, yy,layer, colour, filled)	0xF8BC28
		this.pixi_rect = new SquareClass(0, 0, this.game_state.tile_size, this.game_state.tile_size,Types.Layer.HUD, 0xF8BC28, false);	
		this.pixi_rect.hide();

		this.pixiline = new PIXI.Graphics();
		// which Layer?
		menu_group.add(this.pixiline); // HUD
	},

	reset: function() {
		this.x_max = -99*this.game_state.tile_size;;
		this.y_max = -99*this.game_state.tile_size;;
		this.x_min = 99*this.game_state.tile_size;
		this.y_min = 99*this.game_state.tile_size;
		this.pixi_rect.hide();

		this.pixiline.clear();
		this.tiles_x = [];
		this.tiles_y = [];
	},

	// we are on the top left of line_x/y
	line_x: 0,	
	line_y: 0,
	//line_corner: 0,	// 0 1 2 3  topleft topright bottomright bottomleft

	done: function() {

		for (var b = 0; b < this.game_state.blocks.length; b++) {
			this.game_state.blocks[b].tut_highlight = false;
		}

		for (var t = 0; t < this.tiles_x.length; t++) {
			var x_ = this.tiles_x[t];
			var y_ = this.tiles_y[t];
			this.game_state.blocks[this.game_state.tiles[x_][y_]].tut_highlight = true;
		}

		if (this.tiles_x.length == 0) return;

		this.pixiline.lineStyle(8,0xF8BC28);	// 0xF8BC28
		
		this.line_x = this.tiles_x[0];  
		this.line_y = this.tiles_y[0];
		//this.line_corner = 0;
		this.pixiline.moveTo(this.tiles_x[0]*this.game_state.tile_size, this.tiles_y[0]*this.game_state.tile_size);

		var loops_ = 30;

		var start_x = this.line_x;
		var start_y = this.line_y;

		//console.log('line_x ' + this.line_x + ' line_y ' + this.line_y);
		this.do_line_step();
		//console.log('line_x ' + this.line_x + ' line_y ' + this.line_y);
		
		//while(loops_ > 0 && (this.line_x != start_x && this.line_y != start_y)) {
		while(loops_ > 0){				
			//console.log('LOOP ' + loops_ + 'line_x ' + this.line_x + ' line_y ' + this.line_y);
			this.do_line_step();
		
			loops_--;
		}

		this.pixiline.endFill();				
	},

	fill : function() {
		for (var t = 0; t < this.tiles_x.length; t++) {
			var x_ = this.tiles_x[t];
			var y_ = this.tiles_y[t];
			this.game_state.blocks[this.game_state.tiles[x_][y_]].put_flag_on();
			this.game_state.blocks[this.game_state.tiles[x_][y_]].calc_sprite();
		}
	},

	dig : function() {
		for (var t = 0; t < this.tiles_x.length; t++) {
			var x_ = this.tiles_x[t];
			var y_ = this.tiles_y[t];
			this.game_state.blocks[this.game_state.tiles[x_][y_]].put_x_on();
			this.game_state.blocks[this.game_state.tiles[x_][y_]].calc_sprite();
		}
	},

	allow_diag: false,
	dir_x: 0,
	dir_y: 0,

	do_line_step : function() {
		var x_off = 0;
		var y_off = 0;

		//console.log('do line step > ' + this.line_x + ' ' + this.line_y);
		var upright = false;
		var upleft = false;
		var downright = false;
		var downleft = false;
		
		if (this.line_y > 0) {
			upright = this.game_state.blocks[this.game_state.tiles[this.line_x][this.line_y - 1]].tut_highlight;
		}
		if (this.line_x > 0 && this.line_y > 0) {
			upleft = this.game_state.blocks[this.game_state.tiles[this.line_x - 1][this.line_y - 1]].tut_highlight;
		}
		if (this.line_x <= 10 && this.line_y <= 10) {
			downright = this.game_state.blocks[this.game_state.tiles[this.line_x][this.line_y]].tut_highlight;
		}
		if (this.line_x > 0 && this.line_y <= 10) {
			downleft = this.game_state.blocks[this.game_state.tiles[this.line_x - 1][this.line_y]].tut_highlight;
		}

		

		if (this.allow_diag == true) {
			if (this.dir_x = 0 && this.dir_y == 0) this.dir_x = 1;
			// 16 different configs?
			if (upright == true && upleft == false && downleft == false) y_off = -1;
			else if (upleft == true && downleft == false && downright == false) x_off = -1;
			else if (downleft == true && downright == false && upright == false) y_off = 1;
			else if (downright == true && upright == false && upleft == false) x_off = 1;	// caught by 2nd else if -> x = -1
		} else {

			if (upright == true && upleft == false) y_off = -1;
			else if (upleft == true && downleft == false) x_off = -1;
			else if (downleft == true && downright == false) y_off = 1;
			else if (downright == true && upright == false) x_off = 1;		
		
		}

		//if (this.line_corner == 0) {
			// check for edges of grid!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		//	upright = this.game_state.blocks[this.game_state.tiles[this.line_x][this.line_y]].tut_highlight;
		//}

		/*if (this.line_corner == 0 && 		    
		    this.game_state.blocks[this.game_state.tiles[this.line_x][this.line_y]].tut_highlight == true &&
		    this.game_state.blocks[this.game_state.tiles[this.line_x][this.line_y - 1]].tut_highlight == false) {
			x_off = this.game_state.tile_size;
			// this.line_x & line_y unchanged
			this.line_corner = 1;
		}*/

		//console.log('x_off ' + x_off + ' y_off ' + y_off);

		
		this.pixiline.moveTo(this.line_x*this.game_state.tile_size, this.line_y*this.game_state.tile_size);

		this.line_x += x_off;
		this.line_y += y_off;

	

		this.pixiline.lineTo(this.line_x*this.game_state.tile_size, this.line_y*this.game_state.tile_size); 		
	},

	add_tile: function(b) {
		//console.log('tut highlight rect class > add tile ' + b);
		if (b >= this.game_state.blocks[b].length) return;
		if (b < 0) return; 
		var x = this.game_state.blocks[b].x;
		var y = this.game_state.blocks[b].y;
		this.add_tile_xy(x, y);

		this.tiles_x.push(x);
		this.tiles_y.push(y);
	},

	add_tile_xy: function(x, y) {
		//console.log('tut highlight rect class > add tile xy');
		var xx = x*this.game_state.tile_size;
		var yy = y*this.game_state.tile_size;

		//console.log('xx ' + xx + ' yy ' + yy );

		this.x_max = Math.max(xx + this.game_state.tile_size, this.x_max);
		this.y_max = Math.max(yy + this.game_state.tile_size, this.y_max);
		this.x_min = Math.min(xx, this.x_min);
		this.y_min = Math.min(yy, this.y_min);

		var w = this.x_max - this.x_min;
		var h = this.y_max - this.y_min;

		this.tiles_x.push(x);
		this.tiles_y.push(y);
		
	
		//this.pixi_rect.update_rect(this.x_min, this.y_min, w, h);
		//this.pixi_rect.update_pos(this.x_min, this.y_min);

		//this.pixi_rect.make_vis();
	},

	hide: function () {
		this.pixi_rect.hide();
	}
});

GamepadClass = Class.extend({

	
	arrow_sprites: [4],
	arrow_states: [4],	// internal on/off
	arrow_pos_x: [4],
	arrow_pos_y: [4],
	
	visible: false,

	

	x_dir: 0,	// -1 0 +1
	y_dir: 0,	// this is what external clients check
	

	init : function () {
		for (var i = 0; i < 4; i++) {
			this.arrow_sprites[i] = new SpriteClass();
			this.arrow_sprites[i].setup_sprite("gamepadarrow_up.png",Types.Layer.GAME_MENU);
			this.arrow_sprites[i].hide();

			this.arrow_states[i] = 0;
		}

		this.arrow_sprites[1].rotate_ninety();

		this.arrow_sprites[2].rotate_ninety();
		this.arrow_sprites[2].rotate_ninety();

		this.arrow_sprites[3].rotate_ninety();
		this.arrow_sprites[3].rotate_ninety();
		this.arrow_sprites[3].rotate_ninety();
	},

	screen_resized : function () {
		if (this.visible == false) {
			return;
		}
		
		

		

		if (screen_width > screen_height) {
			this.arrow_pos_x[0] = 64 + 16;
			this.arrow_pos_y[0] = screen_height*0.5 - 32 - 16;

			this.arrow_pos_x[1] = 64 + 32 + 16 + 16;
			this.arrow_pos_y[1] = screen_height*0.5;

			this.arrow_pos_x[2] = 64 + 16;
			this.arrow_pos_y[2] = screen_height*0.5 + 32 + 16;

			this.arrow_pos_x[3] = 64 - 32;
			this.arrow_pos_y[3] = screen_height*0.5;
		} else {
			this.arrow_pos_x[0] = screen_width*0.33 - 32;
			this.arrow_pos_y[0] = screen_height - 32 - 16 - 32 - 32 - 16;

			this.arrow_pos_x[1] = screen_width*0.33 + 32 - 32;
			this.arrow_pos_y[1] = screen_height - 32- 32 - 32;

			this.arrow_pos_x[2] =  screen_width*0.33 - 32;
			this.arrow_pos_y[2] = screen_height + 32 - 32- 32- 32;

			this.arrow_pos_x[3] =  screen_width*0.33- 32- 32;
			this.arrow_pos_y[3] = screen_height - 32- 32- 32;
		}

		if (screen_width > screen_height &&
		    screen_width < screen_height*1.55) {
			this.arrow_pos_x[0] = -999;
			this.arrow_pos_y[0] = -999;

			this.arrow_pos_x[1] = -999;
			this.arrow_pos_y[1] = -999;

			this.arrow_pos_x[2] =  -999;
			this.arrow_pos_y[2] = -999;

			this.arrow_pos_x[3] =  -999;
			this.arrow_pos_y[3] = -999;
		} 

		this.set_pos();
	},

	set_pos: function() {
		for (var i = 0; i < 4; i++) {
			this.arrow_sprites[i].update_pos(this.arrow_pos_x[i], this.arrow_pos_y[i]);
			////console.log('gamepad > ' + this.arrow_pos_x[i] + ' ' + this.arrow_pos_y[i]);
		}
	},

	hide : function() {
		this.visible = false;
		for (var i = 0; i < 4; i++) {
			this.arrow_sprites[i].hide();
		}
	},

	make_vis : function () {
		////console.log('gamepad > make vis');
		
		this.visible = true;
		this.screen_resized();
		for (var i = 0; i < 4; i++) {
			this.arrow_sprites[i].make_vis();
		}
	},

	

	input_down : function (x, y) {
		if (this.visible == false) return;
		
		

		this.x_dir = 0;
		this.y_dir = 0;
		for (var i = 0; i < 4; i++) {
			
			this.arrow_states[i] = 0;
		}

		

		var up_off = Math.abs(x - this.arrow_pos_x[0]) + Math.abs(y - this.arrow_pos_y[0]);
		var down_off = Math.abs(x - this.arrow_pos_x[2]) + Math.abs(y - this.arrow_pos_y[2]);
		var left_off = Math.abs(x - this.arrow_pos_x[3]) + Math.abs(y - this.arrow_pos_y[3]);
		var right_off = Math.abs(x - this.arrow_pos_x[1]) + Math.abs(y - this.arrow_pos_y[1]);

		if (up_off > 48 && left_off > 48 && down_off > 48 && right_off > 48) return;

		if (up_off < down_off &&
			up_off < left_off &&
			up_off < right_off) this.arrow_states[0] = 1;
		else if (down_off < left_off &&
			 down_off < right_off) this.arrow_states[2] = 1;
		else if (left_off < right_off) this.arrow_states[3] = 1;
		else this.arrow_states[1] = 1; 

		if (this.arrow_states[0] == 1) {
			this.x_dir = 0;
			this.y_dir = -1;
			////console.log('gamepad > up!');
		} else if (this.arrow_states[1] == 1) {
			this.x_dir = 1;
			this.y_dir = 0;
			////console.log('gamepad > right!');
		} else if (this.arrow_states[2] == 1) {
			this.x_dir = 0;
			this.y_dir = 1;
			////console.log('gamepad > down!');
		} else if (this.arrow_states[3] == 1) {
			this.x_dir = -1;
			this.y_dir = 0;
			////console.log('gamepad > left!');
		} //else //console.log('gamepad > nope!');
	},

	input_up : function () {
		this.x_dir = 0;
		this.y_dir = 0;
		
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
		this.max_radius += 0.5*this.game_state.tile_size;

		this.big_circle = new CircleClass(Types.Layer.HUD, "0x9F2172", this.max_radius, false);  // layer, colour, radius, filled

		this.grow_circle = new CircleClass(Types.Layer.HUD, "0x9F2172", 1, true);  // layer, colour, radius, filled
		
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
		    xtile >= this.game_state.level_w || ytile >= this.game_state.level_h) return;

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


g_UI = new UserInterfaceClass();

	

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

	set_hint_type: function(hint_) {
		return;
		this.hint = hint_;
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
			} else if (hint_ == 13) {
				this.block_obj.set_texture('eyebracket.png');
				this.text.change_text(g_get_text("eyebracket"));
			} else if (hint_ == 47) {
				this.block_obj.set_texture('ghost.png');
				this.text.change_text(g_get_text("ghost"));
			} else if (hint_ == 32) {
				this.block_obj.set_texture('sharetut.png');
				this.text.change_text("	    Number of mines SHARED by both/all of the connected hints");
			} else if (hint_ == 49) {
				this.block_obj.set_texture('zap.png');
				this.text.change_text("	    Number of mines reachable via mine-to-mine contact");
			} else if (hint_ == 50) {
				this.block_obj.set_texture('zapbracket.png');
				this.text.change_text("	    Number of STEPS reachable via mine-to-mine contact");
			} else if (hint_ == 51) {
				this.block_obj.set_texture('eyerepeat.png');
				this.text.change_text("	    Mines seen by this eye AND the mines seen by those mines.");
			} else if (hint_ == 52) {
				this.block_obj.set_texture('walker.png');
				this.text.change_text("	    Of all mines seen, what is the LARGEST DISTANCE between any two mines? Same range as the eye");
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
		return;
		

		if (this.game_state.get_block_type(x,y) == 0 &&
		    this.game_state.blocks[this.game_state.tiles[x][y]].covered_up == false && 
		    this.game_state.blocks[this.game_state.tiles[x][y]].preset_hint_type != 0) {

			// exposed hint
			var hint_ = this.game_state.blocks[this.game_state.tiles[x][y]].preset_hint_type;
			this.set_hint_type(hint_);
			
		} else if (this.game_state.blocks[this.game_state.tiles[x][y]].sharesquare == true) {
			var hint_ = 32;
			this.set_hint_type(hint_);
		} else {
			this.hidden = true;
		}
	},

	draw_once: function() {
		return;
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


g_nono_tile_sprites = {
	0: "bluetile.png",
	1: "bluetileheart.png",
	2: "bluetilestar.png",
	3: "bluetilezap.png",
	// {0: unsat,  1: satisfied} ...

	4: "bluetile8touch.png",
	5: "bluetile.png",
	6: "bluetilelightbulb.png",
	7: "bluetilelock.png",

	9: "blueequalhoriz.png",
	10: "blueequalvert.png",

	11: "blueconnections.png",
	12: "bluesquares.png",

	13: "blueinequalhoriz.png",

	14: "bluetilesmile.png",
	15: "bluetileneutral.png",
	16: "bluetileneutral.png",

	20: "blue2multi.png"
};

g_nono_tile_sprites_grey = {
	0: "greytile.png",
	1: "greytileheart.png",
	3: "greytilezap.png",

	4: "greytile8touch.png",
	5: "greytile.png",
	6: "greytilelightbulb.png",
	7: "greytilelock.png",

	9: "greyequalhoriz.png",
	10: "greyequalvert.png",

	11: "greyconnections.png",
	12: "greysquares.png",

	13: "greyinequalhoriz.png",

	14: "greytilesmile.png",
	15: "greytileneutral.png",
	16: "greytileneutral.png",

	20: "grey2multi.png"
};

g_nono_tile_sprites_flag = {
	0: "redtile.png",
	1: "redtileheart.png",
	2: "redtilestar.png",
	3: "redtilezap.png",

	4: "redtile8touch.png",
	5: "redtile.png",
	6: "redtilelightbulb.png",
	7: "redtilelock.png",

	9: "redequalhoriz.png",
	10: "redequalvert.png",
	
	11: "redconnections.png",
	12: "redsquares.png",

	13: "redinequalhoriz.png",

	14: "redtilesmile.png",
	15: "redtileneutral.png",
	16: "redtileneutral.png",

	20: "red2multi.png"
};


GameTypes = {
	Clues: {
		NO_CLUE: 0,
		FOUR_TOUCH: 1,
		EYE: 2,
		EIGHT_TOUCH: 3,
		HEART: 4,
		COMPASS: 5,
		CROWN: 6

	},

	EdgeClues : {
		NO_CLUE: 0,
		TOTAL: 1,
		NONOGRAM: 2,
		EMBED_SEQ: 3,	// ... 101100 ...
		COMPRESSED: 4,	// [aabab]
		HIGHLOW: 5,
		NONOGRAM_PERP_ONES: 6,
		PAIRED: 7,	// n with n + 1
		PORTIONS: 8,	
		DNA_MATCH: 9,
		RECTANGLE_MATCH: 10,

		ANYSIZE_MATCH: 11,

		CROWN: 12,
		EYEBRACKET: 13,

		HEART: 14,
		SMILEY: 15,

		NO_SPACE: 100,	// space is taken by another clue (multi line clues)
	},

	PixelClues : {
		NO_CLUE: 0,
		HEART: 1,
		STAR: 2,
		ZAP: 3,

		EIGHTTOUCH: 4,
		CLOSEST_ARROWS: 5,
		LIGHTBULB: 6,
		LOCKED: 7,
		COMPASS: 8,
		EQUAL_HORIZ: 9,
		
		EQUAL_VERT: 10,

		CONNECTIONS: 11,
		FOUR_SQUARES: 12,

		INEQUAL_HORIZ: 13,

		SMILE: 14,
		NEUTRAL: 15,
		CORNER: 16,
		
			
		// not really 'clues' but maybe include here:
		// multi x2
		MULTI: 20
		// linked up
	},

	Colours: {
		RED: 1,
		YELLOW: 3,
		ORANGE: 2,
		GREEN: 4,
		LIGHTBLUE: 5,
		PURPLE: 6,
		PINK: 7,
		DARKBLUE: 8,
		WHITE: 9,
		BLACK: 10,
		BROWN: 11,
		GREY: 12

		// skin colour?	
	}
};

g_secret_colours = {
	0: "colourtile_purple.png",
	1: "colourtile_red.png",
	2: "colourtile_orange.png",
	3: "colourtile_yellow.png",

	4: "colourtile_green.png",
	5: "colourtile_lightblue.png",
	6: "colourtile_purple.png",
	7: "colourtile_pink.png",
	8: "colourtile_darkblue.png",
	9: "bluetile.png",
	10: "colourtile_purple.png",
	
	11: "colourtile_brown.png",
	12: "colourtile_brown.png"

};

TileNono = Class.extend({

	

	block_sprite: null,
	symbol_sprite: null,	// unsure yet if ill use this as it adds more sprites
	//x_sprite: null,	//

	hint_num_obj: null,
	hint_num: 0,

	index: -1,	
	block_type: -1,		// underlying 'mine' or empty ... what the awnser is
	symbol_type: 0,		// GameTypes.PixelClues.HEART
	x: -1,
	y: -1,
	game_state: null,
	flag_on :false,		// marked
	x_on: false,

	my_vert_seq_length: -1,
	my_horiz_seq_length: -1,

	linked_up: false,
	linked_down: false,
	linked_left: false,
	linked_right: false,
	linked_group: -1,
	linked_blocks: [],

	b_in_range: [],

	locked_solver: false,	// only used by offline solver

	happy: false,

	mine_multi: 1,

	locked: false,		// used by solver
	num_of_solutions_in_which_im_flagged: 0,
	num_of_solutions_in_which_im_x: 0,

	prev_colour_history: [],	// for undo button
	prev_colour: 0,

	init: function(game_state) {

		this.game_state = game_state;

		this.block_type = 0;

		this.block_sprite = new SpriteClass();
		this.block_sprite.setup_sprite("bluetiletut.png",Types.Layer.GAME);
		this.block_sprite.hide();

		this.symbol_sprite = new SpriteClass();
		this.symbol_sprite.setup_sprite("crossout.png",Types.Layer.GAME);
		this.symbol_sprite.hide();

		this.hint_num_obj = new CounterClass(Types.Layer.GAME);
		this.hint_num_obj.set_font(Types.Fonts.SMALL);
		this.hint_num_obj.set_text("");
		this.hint_num_obj.update_pos(-999,-999);

		this.secret_colour = 0;//Math.round(8*Math.random());

	},

	

	reset: function() {
		this.flag_on = false;
		this.block_type = 0;
		this.symbol_type = 0;
		this.take_x_off();
		this.locked = false;
		this.happy = false;

		this.linked_group = -1;
		this.linked_up = false;
		this.linked_down = false;
		this.linked_left = false;
		this.linked_right = false;
		this.linked_blocks = [];

		this.b_in_range = [];	

		this.prev_colour_history = [];

		this.secret_colour = 0;
		this.colour_mode = false;

		this.zap_number = 999;
	},

	get_code : function() {
		return this.symbol_type;
	},

	set_from_code : function (code_) {
		this.preset_hint(code_);
	},

	solver_put_flag_on: function() {
		if (this.symbol_type == GameTypes.PixelClues.LOCKED) return;
		//if (this.symbol_type == GameTypes.PixelClues.ZAP) return;
		this.flag_on = true;
		this.x_on = false;
		this.set_type(this.block_type);
		//this.calc_sprite();
		if (this.linked_group != -1) this.solver_sync_linked();
	},

	solver_put_x_on: function() {
		if (this.symbol_type == GameTypes.PixelClues.LOCKED) return;
		//if (this.symbol_type == GameTypes.PixelClues.ZAP) return;
		this.flag_on = false;
		this.x_on = true;
		this.set_type(this.block_type);
		//this.calc_sprite();
		if (this.linked_group != -1) this.solver_sync_linked();
	},

	solver_mark_safe: function () {
		if(this.locked == false) return false;
		if(this.x_on == true) return true;
		return false;
	},

	solver_mark_flag: function () {
		if(this.locked == false) return false;
		if(this.flag_on == true) return true;
		return false;
	},

	solver_sync_linked: function () {
		if (this.linked_group == -1) return;
		for (var b = 0; b < this.game_state.blocks.length; b++) {
			if (this.game_state.blocks[b].linked_group != this.linked_group) continue;
			this.game_state.blocks[b].flag_on = this.flag_on;
			this.game_state.blocks[b].x_on = this.x_on;
			this.game_state.blocks[b].set_type(this.game_state.blocks[b].block_type);
			//this.game_state.blocks[b].calc_sprite();
		}
	},

	coupled_hints: [],	// used by solver to speed up tile-tile solving

	solver_lock: function () {
		this.locked = true;

		if (this.linked_group == -1) return;
		this.solver_sync_linked();
		for (var b = 0; b < this.game_state.blocks.length; b++) {
			if (this.game_state.blocks[b].linked_group != this.linked_group) continue;
			this.game_state.blocks[b].locked = true;
		}
	},

	solver_attempt_trivial : function (solver) {
		//var changes_ = 0;
		var w = this.game_state.level_w;
		var y = this.game_state.level_h;
		if (this.symbol_type == GameTypes.PixelClues.HEART &&
		    this.hint_num == 5) {
			// 21 pixels solved!
			//this.game_state.blocks[this.x][this.y].num_of_solutions_in_which_im_flagged = 1;
			//if (x > 0 && y > 0) this.game_state.blocks[this.x - 1][this.y - 1].num_of_solutions_in_which_im_flagged = 1;
			//if (x < w && y > 0) this.game_state.blocks[this.x - 1][this.y - 1].num_of_solutions_in_which_im_flagged = 1;
			
			//solver.pixels_solved_this_step.push(b);
		} else if (this.symbol_type == GameTypes.PixelClues.SMILE &&
		    this.hint_num == 9) {
			// 21 pixels solved!
		} else if (this.symbol_type == GameTypes.PixelClues.EIGHTTOUCH &&
		    this.hint_num == 9) {
			// 9 pixels solved!
		}
	},

	put_flag_on: function() {
		if (this.symbol_type == GameTypes.PixelClues.LOCKED) return;
		//if (this.symbol_type == GameTypes.PixelClues.ZAP &&
		//    this.block_type == 0) return;
		this.flag_on = true;
		this.x_on = false;
		this.set_type(this.block_type);
		this.calc_sprite();
		if (this.linked_group != -1) this.sync_linked();
	},

	take_flag_off: function() {
		if (this.symbol_type == GameTypes.PixelClues.LOCKED) return;
		//if (this.symbol_type == GameTypes.PixelClues.ZAP) return;
		this.flag_on = false;
		this.set_type(this.block_type);
		this.calc_sprite();
		if (this.linked_group != -1) this.sync_linked();
	},

	put_x_on : function () {
		if (this.symbol_type == GameTypes.PixelClues.LOCKED) return;
		//if (this.symbol_type == GameTypes.PixelClues.ZAP &&
		//    this.block_type != 0) return;
		this.flag_on = false;
		this.x_on = true;
		this.set_type(this.block_type);
		this.calc_sprite();
		if (this.linked_group != -1) this.sync_linked();
	},

	take_x_off: function() {
		if (this.symbol_type == GameTypes.PixelClues.LOCKED) return;
		//if (this.symbol_type == GameTypes.PixelClues.ZAP) return;
		this.flag_on = false;
		this.x_on = false;
		this.set_type(this.block_type);
		this.calc_sprite();
		if (this.linked_group != -1) this.sync_linked();
	},

	sync_linked: function () {
		if (this.linked_group == -1) return;
		for (var b = 0; b < this.game_state.blocks.length; b++) {
			if (this.game_state.blocks[b].linked_group != this.linked_group) continue;
			this.game_state.blocks[b].flag_on = this.flag_on;
			this.game_state.blocks[b].x_on = this.x_on;
			this.game_state.blocks[b].set_type(this.game_state.blocks[b].block_type);
			this.game_state.blocks[b].calc_sprite();
		}
	},

	mimic : function (other_guy) {
		// used only in the test clue
		this.symbol_type = other_guy.symbol_type;
		this.block_type = other_guy.block_type;
		this.x = other_guy.x;
		this.y = other_guy.y;
		this.flag_on = other_guy.flag_on;		

		//this.my_vert_seq_length = other_guy.my_vert_seq_length;
		//this.my_horiz_seq_length = other_guy.my_horiz_seq_length;
	},

	compare : function (other_guy) {
		var hinttype = this.symbol_type;
		if (hinttype == GameTypes.PixelClues.CLOSEST_ARROWS) {
			if (this.close_arrow_up == other_guy.close_arrow_up &&
			    this.close_arrow_down == other_guy.close_arrow_down &&
			    this.close_arrow_left == other_guy.close_arrow_left &&
			    this.close_arrow_right == other_guy.close_arrow_right) return true;
			else return false;
		} else if (hinttype == GameTypes.PixelClues.EIGHTTOUCH ||
			   hinttype == GameTypes.PixelClues.LIGHTBULB ||
			   hinttype == GameTypes.PixelClues.ZAP ||
			   hinttype == GameTypes.PixelClues.HEART ||
			   hinttype == GameTypes.PixelClues.SMILE ||
			   hinttype == GameTypes.PixelClues.NEUTRAL ||
			   hinttype == GameTypes.PixelClues.CORNER ||
			   hinttype == GameTypes.PixelClues.CONNECTIONS ||
			   hinttype == GameTypes.PixelClues.FOUR_SQUARES) {
			////console.log('tile compare > other_guy.hint_num ' + other_guy.hint_num + ' this.hint_num ' + this.hint_num + 'this.symbol_type ' + this.symbol_type + ' other_guy.symbol_type ' + other_guy.symbol_type);
			if (this.hint_num == other_guy.hint_num) return true;
			else return false;
		} else if (hinttype == GameTypes.PixelClues.LOCKED) {
			//if (this.x_on ==)
		} else if (hinttype == GameTypes.PixelClues.EQUAL_HORIZ) {
			if (this.hint_num == other_guy.hint_num) return true;
			else return false;
		} else {
			//console.log('tile entity > compare > hinttype not setup');
		}

		if (this.pixel_clue_true == other_guy.pixel_clue_true) return true;
		else return false;
	},

	pixel_clue_true: false,

	pixel_mode: 1,

	get_pixel : function (x, y) {
		if (this.pixel_mode == 1) {
			// calc actual mines
			return this.game_state.get_pixel(x,y);
		} else {
			// calc players pixels - check for satisfaction
			return this.game_state.get_player_pixel(x,y);
		}
	},

	is_pixel_corner: function (x,y) {
		if (this.pixel_mode == 1) {
			// calc actual mines
			return this.game_state.is_pixel_corner(x,y);
		} else {
			// calc players pixels - check for satisfaction
			var lonely_ = this.game_state.is_player_pixel_corner(x,y);
			////console.log('is_player_pixel_lonely ' + lonely_);
			return lonely_
		}
	},

	is_pixel_elbow: function (x,y) {
		if (this.pixel_mode == 1) {
			// calc actual mines
			return this.game_state.is_pixel_elbow(x,y);
		} else {
			// calc players pixels - check for satisfaction
			var lonely_ = this.game_state.is_player_pixel_elbow(x,y);
			////console.log('is_player_pixel_lonely ' + lonely_);
			return lonely_
		}
	},

	is_pixel_social: function (x,y) {
		if (this.pixel_mode == 1) {
			// calc actual mines
			return this.game_state.is_pixel_social(x,y);
		} else {
			// calc players pixels - check for satisfaction
			var lonely_ = this.game_state.is_player_pixel_social(x,y);
			////console.log('is_player_pixel_lonely ' + lonely_);
			return lonely_
		}
	},

	is_pixel_lonely: function (x,y) {
		if (this.pixel_mode == 1) {
			// calc actual mines
			return this.game_state.is_pixel_lonely(x,y);
		} else {
			// calc players pixels - check for satisfaction
			var lonely_ = this.game_state.is_player_pixel_lonely(x,y);
			////console.log('is_player_pixel_lonely ' + lonely_);
			return lonely_
		}
	},

	is_pixel_same_as: function (value, x, y) {
		if (this.pixel_mode == 1) {
			// calc actual mines
			return this.game_state.is_pixel_same_as(value,x,y);
		} else {
			// calc players pixels - check for satisfaction
			return this.game_state.is_player_pixel_same_as(value,x,y);
		}
	},

	
	is_pixel_same_colour_as: function (value, x, y) {
		if (this.pixel_mode == 1) {
			// calc actual mines
			return this.game_state.is_pixel_same_colour_as(value,x,y);
		} else {
			// calc players pixels - check for satisfaction
			return this.game_state.is_player_pixel_colour_same_as(value,x,y);
		}
	},

	grey: function() {
		this.happy = true;
		
		this.symbol_sprite.set_alpha(0.5);
		this.hint_num_obj.set_alpha(0.5);
		
	},

	ungrey: function() {
		this.happy = false;
		this.symbol_sprite.set_alpha(1);
		this.hint_num_obj.set_alpha(1);
	},

	grey_if_range_is_clear: function() {
		if (this.happy == true) return;
		for (var b = 0; b < this.b_in_range.length; b++) {
			if (this.game_state.blocks[b].flag_on == false && 
			    this.game_state.blocks[b].x_on == false) return;
		}
		this.happy = true;
		this.grey();
	},

	// either filled or unsure
	// doesnt block flowfill
	is_pixel_not_x : function (x, y) {
		var b = this.game_state.tiles[x][y];
		if (this.game_state.blocks[b].locked == false) return true;
		if (this.game_state.blocks[b].x_on == true) return false;
		return true; 
	},

	is_pixel_flowable : function (x, y, pix) {
		
		var b = this.game_state.tiles[x][y];
		if (this.game_state.blocks[b].locked == false) return true;
		if (pix > 0) {
			
			if (this.game_state.blocks[b].x_on == true) return false;
			return true; 
		} else {
			if (this.game_state.blocks[b].flag_on == true) return false;
			return true; 
		}
	},

	calc_range_zap : function (steps) {
		var linked_groups = []; 	// count each group 1x

		var fringe_x = [];
		var fringe_y = [];

		this.game_state.reset_flowfill();

		fringe_x.push(this.x);
		fringe_y.push(this.y);
		this.game_state.mark_as_seen_by_flowfill(this.x, this.y);

		var start_x = this.x;
		var start_y = this.y;

		var my_pixel = this.get_pixel(this.x, this.y);
		////console.log('calc_range_zap > steps ' + steps + ' my_pixel ' + my_pixel);
		if (my_pixel > 0) my_pixel = 1;

		var loops = this.game_state.level_h*this.game_state.level_w + 1;
		while (loops > 0 && fringe_x.length > 0) {
			loops--;
			var x = fringe_x.pop();
			var y = fringe_y.pop();

			var xdist = Math.abs(start_x - x);
			var ydist = Math.abs(start_y - y);
			if (xdist + ydist > steps) continue;

			var b = this.game_state.tiles[x][y];
			var link_g = this.game_state.blocks[b].linked_group;
			var already_in = 0;
			if (link_g > -1) {
				for (var i = 0; i < linked_groups.length; i++) {
					if (link_g == linked_groups[i]) already_in = 1;
				}	
			}
			if (already_in == 0) {
				if (link_g > -1) linked_groups.push(link_g);
				this.b_in_range.push(b);

			}

			if (x < this.game_state.level_w - 1 &&
			    this.is_pixel_flowable(x + 1, y, my_pixel) == true &&
			    this.game_state.is_seen_by_flowfill(x + 1, y) == 0) {
				fringe_x.push(x + 1);
				fringe_y.push(y);
				this.game_state.mark_as_seen_by_flowfill(x + 1, y);
			}

			if (x > 0 && 
			     this.is_pixel_flowable(x - 1, y, my_pixel) == true &&
			    this.game_state.is_seen_by_flowfill(x - 1, y) == 0) {
				fringe_x.push(x - 1);
				fringe_y.push(y);
				this.game_state.mark_as_seen_by_flowfill(x - 1, y);
			}

			if (y < this.game_state.level_h - 1 &&
			     this.is_pixel_flowable(x, y + 1, my_pixel) == true &&
			    this.game_state.is_seen_by_flowfill(x, y + 1) == 0) {
				fringe_x.push(x);
				fringe_y.push(y + 1);
				this.game_state.mark_as_seen_by_flowfill(x, y + 1);
			}

			if (y > 0 &&
			     this.is_pixel_flowable(x, y - 1, my_pixel) == true &&
			    this.game_state.is_seen_by_flowfill(x, y - 1) == 0) {
				fringe_x.push(x);
				fringe_y.push(y - 1);
				this.game_state.mark_as_seen_by_flowfill(x, y - 1);
			}
			
		}

		
	},

	b_in_exact_range: [],	// ignore joins

	calc_range: function() {

		////console.log('tile > calc range');
		
		// can I exclude solved (locked) tiles from the range??????????????????
		// could reaaaly speed up the solver
		// locked tiles do get skipped over by the exhaustive scan...
		var ignore_solved = true;

		//if (!g_solver_class) return;	// only seem to be using this for the offline solver
		this.b_in_range = [];
		this.b_in_exact_range = [];

		var w = this.game_state.level_w;
		var h = this.game_state.level_h;

		var hinttype = this.symbol_type;

		var linked_groups = [];

		var range = 1;	// EIGHTTOUCH CONNECTIONS
		if (hinttype == GameTypes.PixelClues.HEART) range = 2;
		if (hinttype == GameTypes.PixelClues.SMILE) range = 2;
		if (hinttype == GameTypes.PixelClues.NEUTRAL) range = 2;
		if (hinttype == GameTypes.PixelClues.CORNER) range = 2;

		var cut_out_corners = false;
		if (hinttype == GameTypes.PixelClues.HEART) cut_out_corners = true;
		if (hinttype == GameTypes.PixelClues.SMILE) cut_out_corners = true;
		if (hinttype == GameTypes.PixelClues.NEUTRAL) cut_out_corners = true;
		if (hinttype == GameTypes.PixelClues.CORNER) cut_out_corners = true;

		if (hinttype == GameTypes.PixelClues.EQUAL_HORIZ) {
			for (var x = 0; x < w; x++) {
				var b = this.game_state.tiles[x][this.y];
				// linked groups will only appear 1x
				var link_g = this.game_state.blocks[b].linked_group;
				var already_in = 0;
				if (link_g > -1) {
					for (var i = 0; i < linked_groups.length; i++) {
						if (link_g == linked_groups[i]) already_in = 1;
					}	
				}
				if (already_in == 1) continue;
				if (link_g > -1) linked_groups.push(link_g);
				this.b_in_range.push(b);
			}
			return;
		} else if (hinttype == GameTypes.PixelClues.ZAP) {
			// flow out BUT only n + 1 steps
			// n == mines reported
			// //console.log('calc range > GameTypes.PixelClues.ZAP');
			//var n = 999;//this.game_state.blocks[this.game_state.tiles[this.x][this.y]].calc_zap_num();
			//n+=2;

			
			
			var n = this.game_state.blocks[this.game_state.tiles[this.x][this.y]].zap_number;

			this.calc_range_zap(n);
			return;

			////alert('range of zap at ' + this.x + ' ' + this.y + ' is ' + n);
			for (var x = 0; x < w; x++) {
			for (var y = 0; y < h; y++) {
				var xdist = Math.abs(this.x - x);
				var ydist = Math.abs(this.y - y);
				if (n >= xdist + ydist) this.b_in_range.push(this.game_state.tiles[x][y]);
				//this.b_in_range.push(this.game_state.tiles[x][y]);
			}	
			}
			return;
		}

		// if 3x3 type:
		for (var x = Math.max(0, this.x - range); x < Math.min(w, this.x + range + 1); x++) {
			for (var y = Math.max(0, this.y - range); y < Math.min(h, this.y + range + 1); y++) {
				var xdist = Math.abs(this.x - x);
				var ydist = Math.abs(this.y - y);
				if (cut_out_corners == true) {
					if (xdist == range && ydist == range) continue;
				}
				
				var b = this.game_state.tiles[x][y];
				
				
				if (xdist < 2 && ydist < 2) this.b_in_exact_range.push(b);	// 3x3
				
				if (ignore_solved == true &&
				    this.game_state.blocks[b].locked == true) continue;
				// linked groups will only appear 1x
				var link_g = this.game_state.blocks[b].linked_group;
				var already_in = 0;
				if (link_g > -1) {
					for (var i = 0; i < linked_groups.length; i++) {
						if (link_g == linked_groups[i]) already_in = 1;
					}	
				}
				if (already_in == 1) continue;
				if (link_g > -1) linked_groups.push(link_g);
				this.b_in_range.push(b);

				
			}
		}

		
		return;


		
	},

	inform_seen_tiles : function () {
		for (var b = 0; b < this.b_in_range.length; b++) {
			this.game_state.blocks[this.b_in_range[b]].num_clues_that_see_me++;
			var linkg = this.game_state.blocks[this.b_in_range[b]].linked_group;
			if (linkg != -1) {
				for (var bb = 0; bb < this.game_state.blocks.length; bb++) {
					if (bb == this.b_in_range[b]) continue;
					this.game_state.blocks[bb].num_clues_that_see_me++;
				}
			}
		}
	},
	

	close_arrow_up: false,
	close_arrow_right: false,
	close_arrow_down: false,
	close_arrow_left: false,

	zap_number: 0,

	calc_hint: function (hinttype) {
		var on_pixel = 1;
		var hint_number = 0;
		
		if (g_solver_class) this.calc_range();

		if (hinttype == GameTypes.PixelClues.EIGHTTOUCH) {
			hint_number = 0;
			// need to count doubles too!! currently only single
			
			hint_number += this.get_pixel(this.x, this.y);

			hint_number += this.get_pixel(this.x, this.y + 1);
			hint_number += this.get_pixel(this.x - 1, this.y);
			hint_number += this.get_pixel(this.x + 1, this.y);
			hint_number += this.get_pixel(this.x, this.y - 1);

			hint_number += this.get_pixel(this.x - 1, this.y - 1);
			hint_number += this.get_pixel(this.x + 1, this.y + 1);
			hint_number += this.get_pixel(this.x - 1, this.y + 1);
			hint_number += this.get_pixel(this.x + 1, this.y - 1);

			/*
			if (this.is_pixel_same_as(on_pixel, this.x, this.y) == true) hint_number++;

			if (this.is_pixel_same_as(on_pixel, this.x - 1, this.y) == true) hint_number++;
			if (this.is_pixel_same_as(on_pixel, this.x + 1, this.y) == true) hint_number++;
			if (this.is_pixel_same_as(on_pixel, this.x, this.y + 1) == true) hint_number++;
			if (this.is_pixel_same_as(on_pixel, this.x, this.y - 1) == true) hint_number++;

			if (this.is_pixel_same_as(on_pixel, this.x - 1, this.y - 1) == true) hint_number++;
			if (this.is_pixel_same_as(on_pixel, this.x + 1, this.y + 1) == true) hint_number++;
			if (this.is_pixel_same_as(on_pixel, this.x - 1, this.y + 1) == true) hint_number++;
			if (this.is_pixel_same_as(on_pixel, this.x + 1, this.y - 1) == true) hint_number++;
			*/
		} else if (hinttype == GameTypes.PixelClues.CONNECTIONS) {
			hint_number = 0;
			// need to count doubles too!! currently only single
			var five = this.is_pixel_same_as(on_pixel, this.x, this.y);

			var four = this.is_pixel_same_as(on_pixel, this.x - 1, this.y);
			var six = this.is_pixel_same_as(on_pixel, this.x + 1, this.y);
			var eight = this.is_pixel_same_as(on_pixel, this.x, this.y + 1);
			var two = this.is_pixel_same_as(on_pixel, this.x, this.y - 1);

			var one = this.is_pixel_same_as(on_pixel, this.x - 1, this.y - 1);
			var nine = this.is_pixel_same_as(on_pixel, this.x + 1, this.y + 1);
			var seven = this.is_pixel_same_as(on_pixel, this.x - 1, this.y + 1);
			var three = this.is_pixel_same_as(on_pixel, this.x + 1, this.y - 1);

			if (one == true) {
				if (two == true) hint_number++;
				if (four == true) hint_number++;
			}
			if (two == true) {
				if (three == true) hint_number++;
				if (five == true) hint_number++;
			}
			if (three == true && six == true) hint_number++;
			if (four == true) {
				if (five == true) hint_number++;
				if (seven == true) hint_number++;
			}
			if (five == true) {
				if (six == true) hint_number++;
				if (eight == true) hint_number++;
			}
			if (six == true && nine == true) hint_number++;
			if (seven == true && eight == true) hint_number++;
			if (eight == true && nine == true) hint_number++;
			
		} else if (hinttype == GameTypes.PixelClues.FOUR_SQUARES) {
			hint_number = 0;
			// need to count doubles too!! currently only single
			var five = this.is_pixel_same_as(on_pixel, this.x, this.y);

			var four = this.is_pixel_same_as(on_pixel, this.x - 1, this.y);
			var six = this.is_pixel_same_as(on_pixel, this.x + 1, this.y);
			var eight = this.is_pixel_same_as(on_pixel, this.x, this.y + 1);
			var two = this.is_pixel_same_as(on_pixel, this.x, this.y - 1);

			var one = this.is_pixel_same_as(on_pixel, this.x - 1, this.y - 1);
			var nine = this.is_pixel_same_as(on_pixel, this.x + 1, this.y + 1);
			var seven = this.is_pixel_same_as(on_pixel, this.x - 1, this.y + 1);
			var three = this.is_pixel_same_as(on_pixel, this.x + 1, this.y - 1);

			if (one == true && two == true && four == true && five == true) hint_number++;
			
			if (two == true && three == true && five == true && six == true) hint_number++;

			if (four == true && five == true && seven == true && eight == true) hint_number++;

			if (five == true && six == true && eight == true && nine == true) hint_number++;
			
		} else if (hinttype == GameTypes.PixelClues.HEART) {
			hint_number = 0;
			// need to count doubles too!! currently only single
			if (this.is_pixel_lonely(this.x, this.y) == true) hint_number += this.get_pixel(this.x, this.y);

			if (this.is_pixel_lonely(this.x - 1, this.y) == true) hint_number  += this.get_pixel(this.x - 1, this.y);
			if (this.is_pixel_lonely(this.x + 1, this.y) == true) hint_number  += this.get_pixel(this.x + 1, this.y);
			if (this.is_pixel_lonely(this.x, this.y + 1) == true) hint_number  += this.get_pixel(this.x, this.y + 1);
			if (this.is_pixel_lonely(this.x, this.y - 1) == true) hint_number  += this.get_pixel(this.x, this.y - 1);

			if (this.is_pixel_lonely(this.x - 1, this.y - 1) == true) hint_number  += this.get_pixel(this.x - 1, this.y - 1);
			if (this.is_pixel_lonely(this.x + 1, this.y + 1) == true) hint_number  += this.get_pixel(this.x + 1, this.y + 1);
			if (this.is_pixel_lonely(this.x - 1, this.y + 1) == true) hint_number  += this.get_pixel(this.x - 1, this.y + 1);
			if (this.is_pixel_lonely(this.x + 1, this.y - 1) == true) hint_number  += this.get_pixel(this.x + 1, this.y - 1);
		} else if (hinttype == GameTypes.PixelClues.SMILE) {
			hint_number = 0;
			// need to count doubles too!! currently only single
			if (this.is_pixel_social(this.x, this.y) == true) hint_number += this.get_pixel(this.x, this.y);

			if (this.is_pixel_social(this.x - 1, this.y) == true) hint_number += this.get_pixel(this.x - 1, this.y);
			if (this.is_pixel_social(this.x + 1, this.y) == true) hint_number += this.get_pixel(this.x + 1, this.y);
			if (this.is_pixel_social(this.x, this.y + 1) == true) hint_number += this.get_pixel(this.x, this.y + 1);
			if (this.is_pixel_social(this.x, this.y - 1) == true) hint_number += this.get_pixel(this.x, this.y - 1);

			if (this.is_pixel_social(this.x - 1, this.y - 1) == true) hint_number += this.get_pixel(this.x - 1, this.y - 1);
			if (this.is_pixel_social(this.x + 1, this.y + 1) == true) hint_number += this.get_pixel(this.x + 1, this.y + 1);
			if (this.is_pixel_social(this.x - 1, this.y + 1) == true) hint_number += this.get_pixel(this.x - 1, this.y + 1);
			if (this.is_pixel_social(this.x + 1, this.y - 1) == true) hint_number += this.get_pixel(this.x + 1, this.y - 1);
		} else if (hinttype == GameTypes.PixelClues.NEUTRAL) {
			hint_number = 0;
			// need to count doubles too!! currently only single
			if (this.is_pixel_elbow(this.x, this.y) == true) hint_number++;

			if (this.is_pixel_elbow(this.x - 1, this.y) == true) hint_number++;
			if (this.is_pixel_elbow(this.x + 1, this.y) == true) hint_number++;
			if (this.is_pixel_elbow(this.x, this.y + 1) == true) hint_number++;
			if (this.is_pixel_elbow(this.x, this.y - 1) == true) hint_number++;

			if (this.is_pixel_elbow(this.x - 1, this.y - 1) == true) hint_number++;
			if (this.is_pixel_elbow(this.x + 1, this.y + 1) == true) hint_number++;
			if (this.is_pixel_elbow(this.x - 1, this.y + 1) == true) hint_number++;
			if (this.is_pixel_elbow(this.x + 1, this.y - 1) == true) hint_number++;
		} else if (hinttype == GameTypes.PixelClues.CORNER) {
			hint_number = 0;
			// need to count doubles too!! currently only single
			if (this.is_pixel_elbow(this.x, this.y) == true) hint_number++;

			if (this.is_pixel_corner(this.x - 1, this.y) == true) hint_number++;
			if (this.is_pixel_corner(this.x + 1, this.y) == true) hint_number++;
			if (this.is_pixel_corner(this.x, this.y + 1) == true) hint_number++;
			if (this.is_pixel_corner(this.x, this.y - 1) == true) hint_number++;

			if (this.is_pixel_corner(this.x - 1, this.y - 1) == true) hint_number++;
			if (this.is_pixel_corner(this.x + 1, this.y + 1) == true) hint_number++;
			if (this.is_pixel_corner(this.x - 1, this.y + 1) == true) hint_number++;
			if (this.is_pixel_corner(this.x + 1, this.y - 1) == true) hint_number++;
		} else if (hinttype == GameTypes.PixelClues.CLOSEST_ARROWS) {
			this.calc_direction_arrow_hint();
			
		} else if (hinttype == GameTypes.PixelClues.LIGHTBULB) {
			hint_number = this.calc_lightbulb();
			if (hint_number == 0) this.symbol_type = GameTypes.PixelClues.NO_CLUE
			else {
				this.flag_on = false;
				this.x_on = true;
			}
		} else if (hinttype == GameTypes.PixelClues.ZAP) {
			hint_number = this.calc_zap_num();
			this.zap_number = hint_number;

		
			
			// self is already solved
			var self_pix = 0;
			if (this.is_pixel_same_as(on_pixel, this.x, this.y) == true) self_pix = 1;

			if (self_pix == 1) {
				this.flag_on = true;
				this.x_on = false;
			} else {
				this.flag_on = false;
				this.x_on = true;
			}

			this.solver_lock();
			
		} else if (hinttype == GameTypes.PixelClues.EQUAL_HORIZ) {
			var before_me = 0;
			var after_me = 0;
			for (var x = this.x + 1; x < this.game_state.level_w; x++) {
				if (this.game_state.blocks[this.game_state.tiles[x][this.y]].symbol_type == GameTypes.PixelClues.EQUAL_HORIZ ||
				this.game_state.blocks[this.game_state.tiles[x][this.y]].symbol_type == GameTypes.PixelClues.INEQUAL_HORIZ) break;
				if (this.is_pixel_same_as(on_pixel, x, this.y) == true) {
					//if (x < this.x) before_me++;
					if (x > this.x) after_me++;
				}
			}
			for (var x = this.x - 1; x >= 0; x--) {
				if (this.game_state.blocks[this.game_state.tiles[x][this.y]].symbol_type == GameTypes.PixelClues.EQUAL_HORIZ ||
				this.game_state.blocks[this.game_state.tiles[x][this.y]].symbol_type == GameTypes.PixelClues.INEQUAL_HORIZ) break;
				if (this.is_pixel_same_as(on_pixel, x, this.y) == true) {
					if (x < this.x) before_me++;
					//if (x > this.x) after_me++;
				}
			}
			if (after_me == before_me) hint_number = 1;	// true
			else hint_number = 0;				// false, inequal
		} else if (hinttype == GameTypes.PixelClues.EQUAL_VERT) {
			var before_me = 0;
			var after_me = 0;
			for (var y = 0; y < this.game_state.level_h; y++) {
				if (this.is_pixel_same_as(on_pixel, this.x, y) == true) {
					if (y < this.y) before_me++;
					if (y > this.y) after_me++;
				}
			}
			if (after_me == before_me) hint_number = 1;	// true
		} else if (hinttype == GameTypes.PixelClues.LOCKED) {
			
			hint_number = 0;
			if (this.is_pixel_same_as(on_pixel, this.x, this.y) == true) hint_number = 1;

			if (hint_number == 1) {
				this.flag_on = true;
				this.x_on = false;
			} else {
				this.flag_on = false;
				this.x_on = true;
			}
		} else if (hinttype == GameTypes.PixelClues.LINKED) {
			// every linked tile of this group must have same value
			// else hint_number = 0
			hint_number = 1;
			var my_pixel = this.get_pixel(this.x, this.y);
			for (var b = 0; b < this.linked_blocks.length; b++) {
				if (this.is_pixel_same_as(my_pixel, 
							  this.linked_blocks[b].x, 
							  this.linked_blocks[b].y) == false) hint_number = 0;
			}
		}
		this.hint_num = hint_number;
	},

	calc_lightbulb: function () {
		var num_empties = -3;	// we count ourselves four times
		var on_pixel = 1;
		
		if (this.is_pixel_same_as(on_pixel, this.x, this.y) == true) return 0;

		for (var y = this.y; y >= 0; y--) {
			if (this.is_pixel_same_as(on_pixel, this.x, y) == true) break;
			num_empties++;
		}

		for (var y = this.y; y < this.game_state.level_h; y++) {
			if (this.is_pixel_same_as(on_pixel, this.x, y) == true) break;
			num_empties++;
		}

		for (var x = this.x; x >= 0; x--) {
			if (this.is_pixel_same_as(on_pixel, x, this.y) == true) break;
			num_empties++;
		}

		for (var x = this.x; x < this.game_state.level_w; x++) {
			if (this.is_pixel_same_as(on_pixel, x, this.y) == true) break;
			num_empties++;
		}

		return num_empties;
	},

	calc_direction_arrow_hint: function () {
		this.close_arrow_up = false;
		this.close_arrow_left = false;
		this.close_arrow_down = false;
		this.close_arrow_right = false;

		var nearest_left = 99;
		var nearest_right = 99;
		var nearest_up = 99;
		var nearest_down = 99;

		var num_right = 0;
		var num_left = 0;
		var num_up = 0;
		var num_down = 0;

		var on_pixel = 1;
		// if (this.block_type == 0) on_pixel = 0;

		// higest amount of on-pixels, ignoring self

		for (var x = this.x + 1; x < this.game_state.grid_w; x++) {
			if (this.is_pixel_same_as(on_pixel, x, this.y) > 0) {
				//nearest_right = Math.abs(x - this.x);
				//break;
				num_right++;
			}
		}

		for (var x = this.x - 1; x >= 0; x--) {
			if (this.is_pixel_same_as(on_pixel, x, this.y) > 0) {
				//nearest_left = Math.abs(x - this.x);
				//break;
				num_left++;
			}
		}

		for (var y = this.y + 1; y < this.game_state.grid_h; y++) {
			if (this.is_pixel_same_as(on_pixel, this.x, y) > 0) {
				//nearest_down = Math.abs(y - this.y);
				//break;
				num_down++;
			}
		}

		for (var y = this.y - 1; y >= 0; y--) {
			if (this.is_pixel_same_as(on_pixel, this.x, y) > 0) {
				//nearest_up = Math.abs(y - this.y);
				//break;
				num_up++;
			}
		}

		var dirs = [];
		dirs.push({d: num_left, x: -1, y: 0});
		dirs.push({d: num_right, x: 1, y: 0});
		dirs.push({d: num_up, x: 0, y: -1});
		dirs.push({d: num_down, x: 0, y: 1});

		
		// Sort by value
		dirs.sort(function (a,b) {
			return a.d - b.d;
		});

		var best = dirs.pop();
		this.set_dir_arrow(best.x, best.y);

		var second = dirs.pop();
		if (second.d == best.d) this.set_dir_arrow(second.x, second.y);

		var third = dirs.pop();
		if (third.d == best.d) this.set_dir_arrow(third.x, third.y);

		var last = dirs.pop();
		if (last.d == best.d) this.set_dir_arrow(last.x, last.y);
	},

	set_dir_arrow: function(x, y) {
		if (x == -1) this.close_arrow_left = true;
		else if (x == 1) this.close_arrow_right = true;
		else if (y == -1) this.close_arrow_up = true;
		else if (y == 1) this.close_arrow_down = true;

	},

	calc_hint_old:function(hinttype) { 

		this.pixel_clue_true = false;

		var my_pixel = 0;
		if (this.block_type == 2) my_pixel = 1;

		

		if (hinttype == GameTypes.PixelClues.HEART) {
			var buddies = 0;
			if (this.is_pixel_same_as(my_pixel, this.x - 1, this.y) == true ||
			    this.x == 0) buddies++;
			if (this.is_pixel_same_as(my_pixel, this.x + 1, this.y) == true ||
			    this.x + 1 == this.game_state.level_w) buddies++;
			if (this.is_pixel_same_as(my_pixel, this.x, this.y + 1) == true ||
			    this.y + 1 == this.game_state.level_h) buddies++;
			if (this.is_pixel_same_as(my_pixel, this.x, this.y - 1) == true ||
			    this.y == 0) buddies++;

			

			if (buddies == 4) this.pixel_clue_true = true;
		} else if (hinttype == GameTypes.PixelClues.STAR) {
			var my_vert = this.get_vert_seq_length();
			var my_horiz = this.get_horiz_seq_length();

			var best_vert = this.get_best_vert_seq();
			var best_horiz = this.get_best_horiz_seq();

			if (my_vert >= best_vert) this.pixel_clue_true = true;

			//if (my_vert >= best_vert ||
			//    my_horiz >= best_horiz) this.pixel_clue_true = true;
		} else if (hinttype == GameTypes.PixelClues.ZAP) {
			if (this.is_connected_to_edge() == true) this.pixel_clue_true = true;
		}
	},

	seen_by_flowfill: 0,
	is_seen_by_flowfill: function() { return this.seen_by_flowfill;},

	calc_zap_num: function() {
		var fringe_x = [];
		var fringe_y = [];

		this.game_state.reset_flowfill();

		fringe_x.push(this.x);
		fringe_y.push(this.y);
		this.game_state.mark_as_seen_by_flowfill(this.x, this.y);
		

		var my_pixel = this.get_pixel(this.x, this.y);
		//if (this.block_type == 0) return 0;
		////console.log(' calc_zap_num > my_pixel ' + my_pixel );
		var zap_num = 0;
		
		if (my_pixel >= 1) my_pixel = 1;	

		var loops = this.game_state.level_h*this.game_state.level_w + 1;
		while (loops > 0 && fringe_x.length > 0) {
			loops--;
			var x = fringe_x.pop();
			var y = fringe_y.pop();

			var multi = this.game_state.blocks[this.game_state.tiles[x][y]].mine_multi;

			//zap_num += this.get_pixel(x, y);

			zap_num += multi;

			//if (x == 0 || x == this.game_state.level_w - 1) return true;
			//if (y == 0 || y == this.game_state.level_h - 1) return true;

			if (x < this.game_state.level_w - 1 &&
			    this.is_pixel_same_colour_as(my_pixel, x + 1, y) == true &&
			    this.game_state.is_seen_by_flowfill(x + 1, y) == 0) {
				fringe_x.push(x + 1);
				fringe_y.push(y);
				this.game_state.mark_as_seen_by_flowfill(x + 1, y);
			}

			if (x > 0 && 
			    this.is_pixel_same_colour_as(my_pixel, x - 1, y) == true &&
			    this.game_state.is_seen_by_flowfill(x - 1, y) == 0) {
				fringe_x.push(x - 1);
				fringe_y.push(y);
				this.game_state.mark_as_seen_by_flowfill(x - 1, y);
			}

			if (y < this.game_state.level_h - 1 &&
			    this.is_pixel_same_colour_as(my_pixel, x, y + 1) == true &&
			    this.game_state.is_seen_by_flowfill(x, y + 1) == 0) {
				fringe_x.push(x);
				fringe_y.push(y + 1);
				this.game_state.mark_as_seen_by_flowfill(x, y + 1);
			}

			if (y > 0 &&
			    this.is_pixel_same_colour_as(my_pixel, x, y - 1) == true &&
			    this.game_state.is_seen_by_flowfill(x, y - 1) == 0) {
				fringe_x.push(x);
				fringe_y.push(y - 1);
				this.game_state.mark_as_seen_by_flowfill(x, y - 1);
			}
		}
		return zap_num;
	},

	is_connected_to_edge: function() {
		var fringe_x = [];
		var fringe_y = [];

		this.game_state.reset_flowfill();

		fringe_x.push(this.x);
		fringe_y.push(this.y);
		this.seen_by_flowfill = 1;

		var my_pixel = this.get_pixel(this.x, this.y);

		var zap_num = 0;

		var loops = this.game_state.level_h*this.game_state.level_w + 1;
		while (loops > 0 && fringe_x.length > 0) {
			loops--;
			var x = fringe_x.pop();
			var y = fringe_y.pop();

			if (x == 0 || x == this.game_state.level_w - 1) return true;
			if (y == 0 || y == this.game_state.level_h - 1) return true;

			if (this.is_pixel_same_as(my_pixel, x + 1, y) == true &&
			    this.game_state.is_seen_by_flowfill(x + 1, y) == 0) {
				fringe_x.push(x + 1);
				fringe_y.push(y);
				this.game_state.mark_as_seen_by_flowfill(x + 1, y);
			}

			if (this.is_pixel_same_as(my_pixel, x - 1, y) == true &&
			    this.game_state.is_seen_by_flowfill(x - 1, y) == 0) {
				fringe_x.push(x - 1);
				fringe_y.push(y);
				this.game_state.mark_as_seen_by_flowfill(x - 1, y);
			}

			if (this.is_pixel_same_as(my_pixel, x, y + 1) == true &&
			    this.game_state.is_seen_by_flowfill(x, y + 1) == 0) {
				fringe_x.push(x);
				fringe_y.push(y + 1);
				this.game_state.mark_as_seen_by_flowfill(x, y + 1);
			}

			if (this.is_pixel_same_as(my_pixel, x, y - 1) == true &&
			    this.game_state.is_seen_by_flowfill(x, y - 1) == 0) {
				fringe_x.push(x);
				fringe_y.push(y - 1);
				this.game_state.mark_as_seen_by_flowfill(x, y - 1);
			}
		}
		return false;
	},

	preset_hint: function (hinttype) {

		if (hinttype == GameTypes.PixelClues.EQUAL_HORIZ) {
			this.symbol_type = 0;
			if (this.x == 0 || this.x >= this.game_state.level_w - 1) return;
			if (this.game_state.blocks[this.game_state.tiles[this.x -1][this.y]].symbol_type == GameTypes.PixelClues.EQUAL_HORIZ) return;
			if (this.game_state.blocks[this.game_state.tiles[this.x +1][this.y]].symbol_type == GameTypes.PixelClues.EQUAL_HORIZ) return;
		}
		    

		if (g_nono_tile_sprites[hinttype] == null) {
			this.symbol_type = 0;
			return;	
		}


		
		
		this.symbol_type = hinttype;
	},

	select: function () {},
	deselect: function () {},

	cover: function() {
		this.flag_on = false;
	},

	uncover: function() {
		this.flag_on = false;
	},

	get_type: function() {
		return this.block_type;
	},

	get_num_mines: function () {
		if (this.block_type != 2) return 0;
		else return this.mine_multi;
	},

	get_player_pixel: function () {
		
		if (this.flag_on == true) return this.mine_multi;
		return 0;
	},

	hide : function () {
		this.block_sprite.hide();
		this.symbol_sprite.hide();
		this.hint_num_obj.hide();
	},

	make_vis : function () {
		this.block_sprite.make_vis();
		//this.symbol_sprite.make_vis();
		//this.hint_num_obj.make_vis();
	},

	set_position_grid: function(x,y) {
		this.x = x;
		this.y = y;


		if (x == -1) {
			//this.block_sprite.hide();
			//this.block_shadow_sprite.hide();
			//this.flag_sprite.hide();
			//this.symbol_sprite.hide();
		} else {
			//this.block_sprite.make_vis();
			//this.block_shadow_sprite.make_vis();
			//this.flag_sprite.make_vis();

			this.block_sprite.update_pos(x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 						     					y*this.game_state.tile_size + 0.5*this.game_state.tile_size);
			

			this.symbol_sprite.update_pos(x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 						     					y*this.game_state.tile_size + 0.5*this.game_state.tile_size);
		}

		this.block_sprite.hide();
		this.symbol_sprite.hide();
	},

	secret_colour: 1,
	colour_mode: false,

	calc_sprite: function () {
		//this.calc_hint(this.symbol_type);
		
		this.symbol_sprite.hide();
		this.hint_num_obj.hide();

		// yes, no, or unknown
		if (this.x_on == true) {
			this.block_sprite.set_texture("greytile.png");
		} else if (this.flag_on == true) {
			// or whatever my secret colour is...
			if (this.colour_mode == true &&
			    g_secret_colours[this.secret_colour] != null) {
				this.block_sprite.set_texture(g_secret_colours[this.secret_colour]);
			} else {
				this.block_sprite.set_texture("redtile.png");
			}
		} else {
			this.block_sprite.set_texture("bluetile.png");
		}

		if (this.symbol_type == GameTypes.PixelClues.CLOSEST_ARROWS) {
			this.show_direction_arrow_hint();
			this.hint_num_obj.hide();
			return;
		}

		if (this.linked_group != -1) {
			this.hint_num_obj.hide();
			this.calc_link_sprite();	// look at neighbours & fill out linked_left etc
			this.show_link_sprite();
			return;
		}

		var icon_x = this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size;
		var icon_y = this.y*this.game_state.tile_size + 0.25*this.game_state.tile_size;

		if (this.mine_multi == 2) {
			
			if (this.x_on == true) {
				this.symbol_sprite.set_texture('grey2multi.png');
			} else if (this.flag_on == true) {
				this.symbol_sprite.set_texture('red2multi.png');
			} else {
				this.symbol_sprite.set_texture('blue2multi.png');
			}
			this.symbol_sprite.make_vis();
			this.symbol_sprite.update_pos(icon_x, this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size);
			return;
		}

		if (this.symbol_type == GameTypes.PixelClues.NO_CLUE) {
			this.symbol_sprite.hide();
			this.hint_num_obj.hide();
			
			if (this.x_on == true) this.symbol_sprite.set_texture("grey_x.png");
				
			return;
		}

		if (this.x_on == true) {
			this.symbol_sprite.set_texture(g_nono_tile_sprites_grey[this.symbol_type]);
			//if (this.symbol_type == GameTypes.PixelClues.LOCKED) //console.log('show grey lock');
		} else if (this.flag_on == true) {
			this.symbol_sprite.set_texture(g_nono_tile_sprites_flag[this.symbol_type]);
		} else {
			this.symbol_sprite.set_texture(g_nono_tile_sprites[this.symbol_type]);
		}

		

		if (this.symbol_type == GameTypes.PixelClues.EQUAL_HORIZ) {
			icon_y = this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size;
			
			if (this.hint_num == 0) {
				if (this.x_on == true) {
					this.symbol_sprite.set_texture(g_nono_tile_sprites_grey[GameTypes.PixelClues.INEQUAL_HORIZ]);
			
				} else if (this.flag_on == true) {
					this.symbol_sprite.set_texture(g_nono_tile_sprites_flag[GameTypes.PixelClues.INEQUAL_HORIZ]);
				} else {
					this.symbol_sprite.set_texture(g_nono_tile_sprites[GameTypes.PixelClues.INEQUAL_HORIZ]);
				}
			}
						
		}

		if (this.symbol_type == GameTypes.PixelClues.LOCKED) {
			icon_y = this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size;
		}

		this.symbol_sprite.make_vis();
		this.symbol_sprite.update_pos(icon_x, icon_y + 4);

		
		//this.hint_num_obj.set_num(this.hint_num);
		var colour_ = 1;
		if (this.x_on == true) colour_ = 0;
		else if (this.flag_on == true) colour_ = 2;
		this.hint_num_obj.set_colour(colour_);
		this.hint_num_obj.change_text(this.hint_num.toString());
		this.hint_num_obj.update_pos(icon_x, icon_y + 4);
		
		//this.hint_num_obj.make_vis();

		if (this.symbol_type == GameTypes.PixelClues.EQUAL_VERT ||
		    this.symbol_type == GameTypes.PixelClues.EQUAL_HORIZ ||
		    this.symbol_type == GameTypes.PixelClues.LOCKED) this.hint_num_obj.hide();

		if (this.colour_mode == true) {
			this.symbol_sprite.hide();
			this.hint_num_obj.hide();
		}

	},

	calc_sprite_old : function () {

		this.calc_hint(this.symbol_type);

		if (g_nono_tile_sprites[this.symbol_type] == null) {
			//console.log('g_nono_tile_sprites[this.symbol_type] == null');
			return;	
		}

		// only multipliers
		this.pixel_clue_true = true;
		this.symbol_type = 10 + this.mine_multi;

		if (this.flag_on == false) {
			if (this.pixel_clue_true == true) this.block_sprite.set_texture(g_nono_tile_sprites[this.symbol_type]);
			else this.block_sprite.set_texture(g_nono_tile_sprites_nope[this.symbol_type]);
		} else {
			if (this.pixel_clue_true == true) this.block_sprite.set_texture(g_nono_tile_sprites_flag[this.symbol_type]);
			else this.block_sprite.set_texture(g_nono_tile_sprites_flag_nope[this.symbol_type]);
		}

		this.block_sprite.make_vis();

		if (this.x_on == true) this.x_sprite.make_vis();
		else this.x_sprite.hide();
	},

	calc_link_sprite : function () {
		if (this.x > 0 && this.game_state.blocks[this.game_state.tiles[this.x - 1][this.y]].linked_group == this.linked_group) {
			this.linked_left = true;
		}
		if (this.x < this.game_state.level_w - 1 && 
		    this.game_state.blocks[this.game_state.tiles[this.x + 1][this.y]].linked_group == this.linked_group) {
			this.linked_right = true;
		}
		if (this.y > 0 && this.game_state.blocks[this.game_state.tiles[this.x][this.y - 1]].linked_group == this.linked_group) {
			this.linked_up = true;
		}
		if (this.y < this.game_state.level_h - 1 && 
		    this.game_state.blocks[this.game_state.tiles[this.x][this.y + 1]].linked_group == this.linked_group) {
			this.linked_down = true;
		}
	},

	show_link_sprite : function () {
		var up = this.linked_up;
		var down = this.linked_down;
		var left = this.linked_left;
		var right = this.linked_right;

		var spritename = "";

		if (this.x_on == true) spritename += "greyjoin";
		else if (this.flag_on == true) spritename += "redjoin";
		else spritename += "bluejoin";

		if (up && down && left && right) this.symbol_sprite.set_texture(spritename + "URDL.png");
		else if (!up && !down && left && right) {
			this.symbol_sprite.set_texture(spritename + "UD.png");	// spritename += UD, rotate once
			this.symbol_sprite.rotate_ninety();	
		} else if (up && down && !left && !right) {
			this.symbol_sprite.set_texture(spritename + "UD.png");	
		} else if (up && down && left && !right) {
			this.symbol_sprite.set_texture(spritename + "URD.png");
			this.symbol_sprite.rotate_ninety();
			this.symbol_sprite.rotate_ninety();
		} else if (up && down && !left && right) {
			this.symbol_sprite.set_texture(spritename + "URD.png");
		} else if (up && !down && left && right) {
			this.symbol_sprite.set_texture(spritename + "URD.png");
			this.symbol_sprite.rotate_ninety();
			this.symbol_sprite.rotate_ninety();
			this.symbol_sprite.rotate_ninety();
		} else if (!up && down && left && right) {
			this.symbol_sprite.set_texture(spritename + "URD.png");
			this.symbol_sprite.rotate_ninety();
		} else if (!up && down && !left && right) {
			this.symbol_sprite.set_texture(spritename + "UR.png");
			this.symbol_sprite.rotate_ninety();
		} else if (!up && down && left && !right) {
			this.symbol_sprite.set_texture(spritename + "UR.png");
			this.symbol_sprite.rotate_ninety();
			this.symbol_sprite.rotate_ninety();
		} else if (up && !down && left && !right) {
			this.symbol_sprite.set_texture(spritename + "UR.png");
			this.symbol_sprite.rotate_ninety();
			this.symbol_sprite.rotate_ninety();
			this.symbol_sprite.rotate_ninety();
		} else if (up && !down && !left && right) {
			this.symbol_sprite.set_texture(spritename + "UR.png");
		} else if (up && !down && !left && !right) {
			this.symbol_sprite.set_texture(spritename + "U.png");
		} else if (!up && down && !left && !right) {
			this.symbol_sprite.set_texture(spritename + "U.png");
			this.symbol_sprite.rotate_ninety();
			this.symbol_sprite.rotate_ninety();
		} else if (!up && !down && left && !right) {
			this.symbol_sprite.set_texture(spritename + "U.png");
			this.symbol_sprite.rotate_ninety();
			this.symbol_sprite.rotate_ninety();
			this.symbol_sprite.rotate_ninety();
		} else if (!up && !down && !left && right) {
			this.symbol_sprite.set_texture(spritename + "U.png");
			this.symbol_sprite.rotate_ninety();
		}else {
			// error - - just hide
			this.symbol_sprite.hide();
		}

		icon_x = this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size;
		icon_y = this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size;

		this.symbol_sprite.make_vis();
		this.symbol_sprite.update_pos(icon_x, icon_y);
	},

	show_direction_arrow_hint : function () {
		var up = this.close_arrow_up;
		var down = this.close_arrow_down;
		var left = this.close_arrow_left;
		var right = this.close_arrow_right;

		
		//this.symbol_sprite.set_texture('4arrow.png');
		var spritename = "";
		var rotations = 0;

		if (this.x_on == true) spritename += "grey_arrow_";
		else if (this.flag_on == true) spritename += "red_arrow_";
		else spritename += "blue_arrow_";
		

		if (up && down && left && right) this.symbol_sprite.set_texture(spritename + "URDL.png");
		else if (!up && !down && left && right) {
			this.symbol_sprite.set_texture(spritename + "UD.png");	// spritename += UD, rotate once
			this.symbol_sprite.rotate_ninety();	
		} else if (up && down && !left && !right) {
			this.symbol_sprite.set_texture(spritename + "UD.png");	
		} else if (up && down && left && !right) {
			this.symbol_sprite.set_texture(spritename + "URD.png");
			this.symbol_sprite.rotate_ninety();
			this.symbol_sprite.rotate_ninety();
		} else if (up && down && !left && right) {
			this.symbol_sprite.set_texture(spritename + "URD.png");
		} else if (up && !down && left && right) {
			this.symbol_sprite.set_texture(spritename + "URD.png");
			this.symbol_sprite.rotate_ninety();
			this.symbol_sprite.rotate_ninety();
			this.symbol_sprite.rotate_ninety();
		} else if (!up && down && left && right) {
			this.symbol_sprite.set_texture(spritename + "URD.png");
			this.symbol_sprite.rotate_ninety();
		} else if (!up && down && !left && right) {
			this.symbol_sprite.set_texture(spritename + "UR.png");
			this.symbol_sprite.rotate_ninety();
		} else if (!up && down && left && !right) {
			this.symbol_sprite.set_texture(spritename + "UR.png");
			this.symbol_sprite.rotate_ninety();
			this.symbol_sprite.rotate_ninety();
		} else if (up && !down && left && !right) {
			this.symbol_sprite.set_texture(spritename + "UR.png");
			this.symbol_sprite.rotate_ninety();
			this.symbol_sprite.rotate_ninety();
			this.symbol_sprite.rotate_ninety();
		} else if (up && !down && !left && right) {
			this.symbol_sprite.set_texture(spritename + "UR.png");
		} else if (up && !down && !left && !right) {
			this.symbol_sprite.set_texture(spritename + "U.png");
		} else if (!up && down && !left && !right) {
			this.symbol_sprite.set_texture(spritename + "U.png");
			this.symbol_sprite.rotate_ninety();
			this.symbol_sprite.rotate_ninety();
		} else if (!up && !down && left && !right) {
			this.symbol_sprite.set_texture(spritename + "U.png");
			this.symbol_sprite.rotate_ninety();
			this.symbol_sprite.rotate_ninety();
			this.symbol_sprite.rotate_ninety();
		} else if (!up && !down && !left && right) {
			this.symbol_sprite.set_texture(spritename + "U.png");
			this.symbol_sprite.rotate_ninety();
		}else {
			// error - - just hide
			this.symbol_sprite.hide();
		}

		icon_x = this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size;
		icon_y = this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size;

		this.symbol_sprite.make_vis();
		this.symbol_sprite.update_pos(icon_x, icon_y);
	},

	set_type: function(gemtype) {
		////console.log('set_type > x ' + this.x + ' y ' + this.y + ' > ' + gemtype);

		
		this.block_type = gemtype;

		

		////console.log('symboltype' + this.symbol_type + ' gemtype ' + gemtype);

		

		
	},

	


	get_best_vert_seq: function() {
		// of the same colour as me
		var my_pixel = this.get_pixel(this.x, this.y);	
		var best_length = 0;
		var current_length = 0;
		for (var y = 0; y < this.game_state.level_h; y++) {
			if (this.is_pixel_same_as(my_pixel, this.x, y) == true) {
				current_length++;
				best_length = Math.max(best_length, current_length);
			} else current_length = 0;
			
		}
		return best_length;
	},

	get_best_horiz_seq: function() {
		var my_pixel = this.get_pixel(this.x, this.y);	
		var best_length = 0;
		var current_length = 0;
		for (var x = 0; x < this.game_state.level_w; x++) {
			if (this.is_pixel_same_as(my_pixel, x, this.y) == true) {
				current_length++;
				best_length = Math.max(best_length, current_length);
			} else current_length = 0;
			
		}
		return best_length;
	},

	get_vert_seq_length: function() {
		var seq_length = 0;
		var my_pixel = this.get_pixel(this.x, this.y);	
		for (var y = this.y; y < this.game_state.level_h; y++) {
			if (this.is_pixel_same_as(my_pixel, this.x, y) == true) seq_length++;
			else break;
		}
		for (var y = this.y - 1; y >= 0; y--) {
			if (this.is_pixel_same_as(my_pixel, this.x, y) == true) seq_length++;
			else break;
		}
		return seq_length;
	},

	get_horiz_seq_length: function() {
		var seq_length = 0;
		var my_pixel = this.get_pixel(this.x, this.y);
		for (var x = this.x; x < this.game_state.level_w; x++) {
			if (this.is_pixel_same_as(my_pixel, x, this.y) == true) seq_length++;
			else break;
		}
		for (var x = this.x - 1; x >= 0; x--) {
			if (this.is_pixel_same_as(my_pixel, x, this.y) == true) seq_length++;
			else break;
		}
		return seq_length;

	},
});

repeat_codes = [
	[0,0],
	[0,1],
	[1,0],
	[1,1],
	[0,0,0],
	[0,0,1],
	[0,1,0],
	[0,1,1],
	[1,0,0],
	[1,0,1],
	[1,1,0],
	[1,1,1],
	[0,0,0,0],
	[0,0,0,1],
	[0,0,1,0],
	[0,0,1,1],
	[0,1,0,0],
	[0,1,0,1],
	[0,1,1,0],
	[0,1,1,1],
	[1,0,0,0],
	[1,0,0,1],
	
];

// these cannot overlap
g_four_tile_patterns = [
	[0,0,0,1],
	[0,0,1,1],
	[0,1,1,1],
	[1,1,1,0],
	[1,1,0,0],
	[1,0,0,0]
];

g_three_tile_patterns = [
	[0,0,1],
	[0,1,1],
	[1,1,0],
	[1,0,0]
];

g_rectangle_patterns = [
	[[1,1],
	 [1,0]],
	[[0,1],
	 [1,0]],
	[[0,0],
	 [0,1]],

//	[[1,0],
//	 [1,1],
//	 [0,1]],	

];

// ANYSIZE_MATCH
// p: pattern matrix
// o: overlap yes = 1 no = 0
// ov: overlap vert (when rotated 90)
// for right/horiz scan
// for vert scan, rotate clockwise 90
g_anysize_patterns = [
	{p: [[1]], o: 0, ov: 0},

	{p: [[1,1]], o: 1, ov: 0},
	{p: [[0,0]], o: 1, ov: 0},
	{p: [[1,0]], o: 0, ov: 0},
	{p: [[0,1]], o: 0, ov: 0},

	{p: [[1],[1]], o: 0, ov: 1},	// paired
	{p: [[1],[0]], o: 0, ov: 0},
	{p: [[0],[1]], o: 0, ov: 0},	

	//{p: [[1,1,1]], o: 1},	// overlap
	//{p: [[0,0,0]], o: 1},	// overlap
	//{p: [[1,0,0]], o: 0},
	//{p: [[0,1,0]], o: 1},	// overlap
	//{p: [[0,0,1]], o: 0},
	
/*	{p: [[1,1],
	    [1,0]], o: 0},
	{p: [[0,1],
	    [1,0]], o: 0},
	{p: [[0,0],
	    [0,1]], o: 0},

	{p: [[0,0],
	    [0,0]], o: 1},	// overlap
	{p: [[1,1],
	    [1,1]], o: 1},	// overlap
*/
];
EdgeNono = Class.extend({
	x: -1,
	y: -1,
	east: false,
	south: false,
	game_state: null,

	nono_type: 1,
	nono_subtype: 0,

	total: 0,
	paired: 0,	// with n + 1 line

	crown_num: 0,

	heart_num: 0,
	smiley_num: 0,

	nonogram_hint: [],	// [1,5,6, ...]
				// [1,5,6,'p_end',3, 'p_start', 1, 7, 'p_end', 2]		// perpendicular
				// [{'g': 1}, {'g': 5}, {'g' : 6, 'p_end' : 3}, {'g': 1, 'p_start': 7, 'p_end': 2}]
				// [1,5,6,{'g' : 6, 'p_end' : 3}, {'g': 1, 'p_start': 7, 'p_end': 2}]
	nonogram_perp_ones_hint: [],	// after each 1 follows the perp length

	portions_hint: [],	//	[2,3,2,4,2,3,2,5]	2 of 3, 2 of 4, 2 of 3, 2 of 5

	compressed_hint: [],	// [a,a,b,a...]
	compressed_code: {},
	
	sequence_start: 0,
	sequence_end: 0,
	sequence_hint: [],	// [0,1,1,0,1, ...]

	dna_hint_sequence: 0,
	dna_hint_repeats: 0,

	// reusable by different hint-modes
	sprites: [15],
	number_objs: [15],

	// NONOGRAM_A:	contains ? (unknown length) and * (unknown num of groups)
	nonogram_a_hint: [],	// length of nonogram_hint:		
				// 0 == no change, 1 == ?, 2 == *
				// maybe: 3 == perp_1, 4 == 

	happy: false,

	grey: function() {
		this.happy = true;
		for (var i = 0; i < this.sprites.length; i++) {
			this.number_objs[i].set_alpha(0.5);
			this.sprites[i].set_alpha(0.5);
		}
	},

	ungrey: function() {
		this.happy = false;
		for (var i = 0; i < this.sprites.length; i++) {
			this.number_objs[i].set_alpha(1);
			this.sprites[i].set_alpha(1);
		}
	},

	init: function(game_state, x, y, east, south) {

		this.game_state = game_state;
		this.x = x;
		this.y = y;

		for (var i = 0; i < 10; i++) {
			this.sprites[i] = new SpriteClass();
			this.sprites[i].setup_sprite("select.png",Types.Layer.GAME);
			this.sprites[i].hide();

			this.number_objs[i] = new CounterClass(Types.Layer.GAME);
			this.number_objs[i].set_font(Types.Fonts.MEDIUM);
			this.number_objs[i].set_text("");
			this.number_objs[i].update_pos(-999,-999);
		}

		

		/*
		if (Math.random() < 0.33) this.nono_type = GameTypes.EdgeClues.NONOGRAM;
		else if (Math.random() < 0.25) {
			this.nono_type = GameTypes.EdgeClues.DNA_MATCH;
			this.nono_subtype = Math.floor(4*Math.random());
		} else if (Math.random() < 0.25) this.nono_type = GameTypes.EdgeClues.NONOGRAM_PERP_ONES;

		if (Math.random() < 0.125) this.nono_type = GameTypes.EdgeClues.EMBED_SEQ;
		*/

		

		if (Math.random() < 0.66) this.nono_type = GameTypes.EdgeClues.NO_CLUE;
			
		// right east side

		
		
		this.nono_type = GameTypes.EdgeClues.TOTAL;
	},

	get_code : function() {
		return this.nono_type;
	},

	set_from_code : function (code_) {
		this.nono_type = code_;
	},

	calc_space_needed : function () {
		if (this.nono_type == GameTypes.EdgeClues.NO_CLUE) return 0;

		if (this.nono_type == GameTypes.EdgeClues.TOTAL) return 1;
		if (this.nono_type == GameTypes.EdgeClues.CROWN) return 1;
		if (this.nono_type == GameTypes.EdgeClues.EYEBRACKET) return 1;
		if (this.nono_type == GameTypes.EdgeClues.HEART) return 1;
		if (this.nono_type == GameTypes.EdgeClues.SMILEY) return 1;

		if (this.nono_type == GameTypes.EdgeClues.ANYSIZE_MATCH) {
			
			if (this.y < 0) {
				var matrix_num = this.dna_hint_sequence;
				var rect_y = g_anysize_patterns[matrix_num].p[0].length + 1;
				return rect_y;
			} else {
				var matrix_num = this.dna_hint_sequence;
				var rect_x = g_anysize_patterns[matrix_num].p[0].length + 1;
				return rect_x;
			}
		}

		return 0;
	},

	grey_if_range_is_clear: function() {
		if (this.happy == true) return;
		for (var b = 0; b < this.b_in_range.length; b++) {
			if (this.game_state.blocks[b].flag_on == false && 
			    this.game_state.blocks[b].x_on == false) return;
		}
		this.happy = true;
		this.grey();
	},

	add_row_range: function(y, linked_groups) {
		var ignore_solved = true;
		var w = this.game_state.level_w;
		var h = this.game_state.level_h;

		//var linked_groups = [];
		for (var x = 0; x < this.game_state.level_w; x++) {
			var b = this.game_state.tiles[x][y];
			this.b_in_exact_range.push(b);
			if (ignore_solved == true &&
			    this.game_state.blocks[b].locked == true) continue;
			// linked groups will only appear 1x
			var link_g = this.game_state.blocks[b].linked_group;
			var already_in = 0;
			if (link_g > -1) {
				for (var i = 0; i < linked_groups.length; i++) {
					if (link_g == linked_groups[i]) already_in = 1;
				}	
			}
			if (already_in == 1) continue;
			if (link_g > -1) linked_groups.push(link_g);
			this.b_in_range.push(b);
		}
	},

	add_column_range: function( x, linked_groups) {
		var ignore_solved = true;
		var w = this.game_state.level_w;
		var h = this.game_state.level_h;

		//var linked_groups = [];
		for (var y = 0; y < this.game_state.level_h; y++) {
			var b = this.game_state.tiles[x][y];
			this.b_in_exact_range.push(b);
			if (ignore_solved == true &&
				    this.game_state.blocks[b].locked == true) continue;
			// linked groups will only appear 1x
			var link_g = this.game_state.blocks[b].linked_group;
			var already_in = 0;
			if (link_g > -1) {
				for (var i = 0; i < linked_groups.length; i++) {
					if (link_g == linked_groups[i]) already_in = 1;
				}	
			}
			if (already_in == 1) continue;
			if (link_g > -1) linked_groups.push(link_g);
			this.b_in_range.push(b);
		}
	},

	b_in_range: [],
	b_in_exact_range: [],

	calc_range: function() {
		var ignore_solved = true;
		var get_adjacent = false;
		if (this.nono_type == GameTypes.EdgeClues.HEART ||
		    this.nono_type == GameTypes.EdgeClues.SMILEY) get_adjacent = true;

		//if (!g_solver_class) return;	// only seem to be using this for the offline solver
		this.b_in_range = [];
		this.b_in_exact_range = [];	// ignore linked groups

		var w = this.game_state.level_w;
		var h = this.game_state.level_h;

		var linked_groups = [];

		if (this.x < 0) {
			this.add_row_range(this.y, linked_groups);
			if (get_adjacent && this.y > 0) this.add_row_range(this.y - 1, linked_groups);
			if (get_adjacent && this.y < this.game_state.level_h - 1) this.add_row_range(this.y + 1, linked_groups);
			
		} else if (this.y < 0) {
			
			this.add_column_range(this.x, linked_groups);
			if (get_adjacent && this.x > 0) this.add_column_range(this.x - 1, linked_groups);
			if (get_adjacent && this.x < this.game_state.level_w - 1) this.add_column_range(this.x + 1, linked_groups);
		}

		//for (var b = 0; b < this.b_in_range.length; b++) this.game_state.blocks[this.b_in_range[b]].num_clues_that_see_me++;
		this.inform_seen_tiles();

	},

	inform_seen_tiles : function () {
		for (var b = 0; b < this.b_in_range.length; b++) {
			this.game_state.blocks[this.b_in_range[b]].num_clues_that_see_me++;
			var linkg = this.game_state.blocks[this.b_in_range[b]].linked_group;
			if (linkg != -1) {
				for (var bb = 0; bb < this.game_state.blocks.length; bb++) {
					if (bb == this.b_in_range[b]) continue;
					this.game_state.blocks[bb].num_clues_that_see_me++;
				}
			}
		}
	},

	scan_for_repeat_code : function (start_at, a, b, c, d, e) {
		// 0 - empty	 1 - mine	2- endcode	
		// return num of non-overlapping repeats

		if (this.x < 0) {
			var current = 0;
			for (var x = start_at; x < this.game_state.level_w; x++) {
				
			}
			
		} else if (this.y < 0) {
			var current = 0;
			for (var y = start_at; y < this.game_state.level_h; y++) {
				//if (this.get_pixel(this.x, y) == 1) 
			}
			
		}
			
	},

	

	calc_compress : function () {
		// search for a segment with length <= 0.5*level_w that appears more than once, non-overlapping
		// and length > 1
		// if we cant compress, this hint just becomes 'total pixels'

		this.compressed_hint = [];	// [a,a,b,a...]
		this.compressed_code = {};

		
		
		
	},

	get_anysize_pattern : function (pattern, x, y) {
		if (pattern >= g_anysize_patterns.length) return -1;	
		if (pattern < 0) return -1;
		if (y >= g_anysize_patterns[pattern].p.length) return -1;
		return g_anysize_patterns[pattern].p[y][x];
	},
	
	calc_anysize_match : function (matrix_num) {
		// Overhanging clues on smaller maps (I think this is about that)
		if (this.x < 0 && this.y == this.game_state.level_h ||
		    this.y < 0 && this.x == this.game_state.level_w) {
			this.dna_hint_sequence = matrix_num;
			this.dna_hint_repeats = 0;
		}

		var matches = 0;

		if (this.x < 0) {
			var rect_x = g_anysize_patterns[matrix_num].p[0].length;
			var rect_y = g_anysize_patterns[matrix_num].p.length;
			for (var x = 0; x < this.game_state.level_w - rect_x + 1; x++) {
				var match = 1;
				

				for (var ss = 0; ss < rect_x; ss++) {
					for (var yy = 0; yy < rect_y; yy++) {
						if (this.get_pixel(x + ss, this.y + yy) != this.get_anysize_pattern(matrix_num,ss,yy)) match = 0;
					}
					
				}
				if (match == 1) {
					matches++;
						
				}
			}
		} else {
			var rect_x = g_anysize_patterns[matrix_num].p.length;
			var rect_y = g_anysize_patterns[matrix_num].p[0].length;
			for (var y = 0; y < this.game_state.level_h; y++) {
				var match = 1;
				

				for (var ss = 0; ss < rect_y; ss++) {
					for (var xx = 0; xx < rect_x; xx++) {
						// consider rotation

						// the following is unrotated ? or rotated wrong ?
						if (this.get_pixel(this.x + xx, y + ss) != this.get_anysize_pattern(matrix_num,ss,xx))match = 0;			
					}
				}
				if (match == 1) {
					matches++;
						
				}
			}
		}

		this.dna_hint_sequence = matrix_num;
		this.dna_hint_repeats = matches;
	},

	calc_rect_match : function (matrix_num) {
		if (this.x < 0 && this.y == this.game_state.level_h ||
		    this.y < 0 && this.x == this.game_state.level_w) {
			this.dna_hint_sequence = matrix_num;
			this.dna_hint_repeats = 0;
		}

		var matches = 0;

		if (this.x < 0) {
			for (var x = 0; x < this.game_state.level_w - 1; x++) {
				var match = 1;
				for (var ss = 0; ss < 2; ss++) {
					if (this.get_pixel(x + ss, this.y) != g_rectangle_patterns[matrix_num][ss][0]) match = 0;
					if (this.get_pixel(x + ss, this.y + 1) != g_rectangle_patterns[matrix_num][ss][1]) match = 0;
				}
				if (match == 1) {
					matches++;
						
				}
			}
		} else {
			for (var y = 0; y < this.game_state.level_h - 1; y++) {
				var match = 1;
				for (var ss = 0; ss < 2; ss++) {
					if (this.get_pixel(this.x, y + ss) != g_rectangle_patterns[matrix_num][ss][0]) match = 0;
					if (this.get_pixel(this.x + 1, y + ss) != g_rectangle_patterns[matrix_num][ss][1]) match = 0;
				}
				if (match == 1) {
					matches++;
						
				}
			}
		}
		this.dna_hint_sequence = matrix_num;
		this.dna_hint_repeats = matches;
	},

	calc_dna_match_for_sequence : function (seq_num) {
		var high_score = 0;
		var matches_this_seq = 0;
		var s = seq_num;

		
		
		if (this.x < 0) {
				
				for (var x = 0; x < this.game_state.level_w - 2; x++) {
					var match = 1;
					for (var ss = 0; ss < 3; ss++) {
						if (this.get_pixel(x + ss, this.y) != g_three_tile_patterns[s][ss]) match = 0;
					}
					if (match == 1) {
						matches_this_seq++;
						
					}
				}
			
		} else if (this.y < 0) {
				
				for (var y = 0; y < this.game_state.level_h - 2; y++) {
					var match = 1;
					for (var ss = 0; ss < 3; ss++) {
						if (this.get_pixel(this.x, y + ss) != g_three_tile_patterns[s][ss]) match = 0;
						
					}
					if (match == 1) {
						matches_this_seq++;
					
					}
				}
				
			
		} 
		this.dna_hint_sequence = s;
		this.dna_hint_repeats = matches_this_seq;

		
	},

	calc_dna_match : function () {
		var best_seq = 0;
		var high_score = 0;
		for (var s = 0; s < g_three_tile_patterns.length; s++) {
			var matches_this_seq = 0;
			if (this.x < 0) {
				
				for (var x = 0; x < this.game_state.level_w - 2; x++) {
					var match = 1;
					for (var ss = 0; ss < 3; ss++) {
						if (this.get_pixel(x + ss, this.y) != g_three_tile_patterns[s][ss]) match = 0;
					}
					if (match == 1) {
						matches_this_seq++;
						if (matches_this_seq >= high_score) {
							high_score = matches_this_seq;
							best_seq = s;
						}
					}
				}
			
			} else if (this.y < 0) {
				
				for (var y = 0; y < this.game_state.level_h - 2; y++) {
					var match = 1;
					for (var ss = 0; ss < 3; ss++) {
						if (this.get_pixel(this.x, y + ss) != g_three_tile_patterns[s][ss]) match = 0;
					}
					if (match == 1) {
						matches_this_seq++;
						if (matches_this_seq >= high_score) {
							high_score = matches_this_seq;
							best_seq = s;
						}
					}
				}
				
			
			}
		}

		this.dna_hint_sequence = best_seq;
		this.dna_hint_repeats = high_score;
	},

	calc_hint: function () {

		////console.log('nono > calc_hint');

		//this.calc_range();
		
		this.happy = false;

		if (this.nono_type == 1) {
			this.calc_total();
		} else if (this.nono_type == GameTypes.EdgeClues.NONOGRAM) {
			this.calc_nonogram();
		} else if (this.nono_type == GameTypes.EdgeClues.EMBED_SEQ) {
			this.calc_embed_seq();
		} else if (this.nono_type == GameTypes.EdgeClues.NONOGRAM_PERP_ONES) {
			this.calc_nonogram_perp();
		}  else if (this.nono_type == GameTypes.EdgeClues.PAIRED) {
			
			this.calc_paired();
		} else if (this.nono_type == GameTypes.EdgeClues.COMPRESSED) {
			
			this.calc_compress();
		} else if (this.nono_type == GameTypes.EdgeClues.DNA_MATCH) {
			this.calc_dna_match_for_sequence(this.nono_subtype);
			//this.calc_dna_match();
		} else if (this.nono_type == GameTypes.EdgeClues.PORTIONS) {
			this.calc_portions();
		} else if (this.nono_type == GameTypes.EdgeClues.RECTANGLE_MATCH) {
			
			this.calc_rect_match(this.nono_subtype);
		} else if (this.nono_type == GameTypes.EdgeClues.ANYSIZE_MATCH) {
			
			this.calc_anysize_match(this.nono_subtype);
		} else if (this.nono_type == GameTypes.EdgeClues.NONOGRAM_A) {
			this.calc_nonogram();
			

			
			
		} else if (this.nono_type == GameTypes.EdgeClues.HEART) {
			
			this.calc_heart();
		}else if (this.nono_type == GameTypes.EdgeClues.SMILEY) {
			
			this.calc_smiley();
		}else if (this.nono_type == GameTypes.EdgeClues.CROWN) {
			
			this.calc_crown();
		} else if (this.nono_type == GameTypes.EdgeClues.EYEBRACKET) {
			
			this.calc_eyebracket();
		} else {

		}
	},

	

	calc_portions : function () {	
		this.portions_hint = [];
		if (this.x < 0) {
			var size = 4;//Math.floor(this.game_state.level_w / 4);
			var current_portion = 0;
			for (var x = 0; x < this.game_state.level_w; x ++) {
				if (this.get_pixel(x, this.y) == 1) current_portion++;
				if ((x + 1)% size == 0) {
					this.portions_hint.push(current_portion);
					this.portions_hint.push(size);
					current_portion = 0;
				}
			}
			if (current_portion > 0) {
				this.portions_hint.push(current_portion);
				this.portions_hint.push(this.game_state.level_w % size);
			}
		} else if (this.y < 0) {
			var size = 4;//Math.floor(this.game_state.level_h / 4);
			var current_portion = 0;
			for (var y = 0; y < this.game_state.level_h; y ++) {
				if (this.get_pixel(this.x, y) == 1) current_portion++;
				if ((y + 1) % size == 0) {
					this.portions_hint.push(current_portion);
					this.portions_hint.push(size);
					current_portion = 0;
				}
			}
			if (current_portion > 0) {
				this.portions_hint.push(current_portion);
				this.portions_hint.push(this.game_state.level_h % size);
			}
		}
	},

	calc_embed_seq : function () {

		this.sequence_hint = [];
		var length = 0;
		if (this.x < 0) length = Math.round(this.game_state.level_w*0.5);
		else length = Math.round(this.game_state.level_h*0.5);
		var seed = this.game_state.get_pixel(0,0) 
				+ this.game_state.get_pixel(1,0) 
				+ this.game_state.get_pixel(0,1)
				+ Math.abs(this.x) + Math.abs(this.y);

		var seed_two = this.game_state.get_pixel(this.game_state.level_w - 1,0) 
				+ this.game_state.get_pixel(this.game_state.level_w - 1,1) 
				+ this.game_state.get_pixel(0,this.game_state.level_h - 1)
				+ Math.abs(this.x) + Math.abs(this.y);

		var start = this.game_state.level_w + seed;
		var end = this.game_state.level_w*start + seed_two + start;

		start = start % this.game_state.level_w;
		if (start > length) start = start % length;
		end = (start + length) % this.game_state.level_w;
		
		if (end <= start) {
			var temp = start;
			start = end;
			end = temp;
		}
	
		if (end > this.game_state.level_w ||
		    end > this.game_state.level_h) end = Math.min(this.game_state.level_w, this.game_state.level_h);
		if (start < 0) start = 0;
		


		if (this.x < 0) {
			
			for (var x = start; x < end; x++) {
				if (this.get_pixel(x, this.y) == 1) this.sequence_hint.push(1);
				else this.sequence_hint.push(0);
			}
			
		} else if (this.y < 0) {
			
			for (var y = start; y < end; y++) {
				if (this.get_pixel(this.x, y) == 1) this.sequence_hint.push(1);
				else this.sequence_hint.push(0);
			}
			
		}

		
	},

	mimic : function (other_guy) {
		// used only in the test clue
		this.nono_type = other_guy.nono_type;
		this.nono_subtype = other_guy.nono_subtype;
		this.x = other_guy.x;
		this.y = other_guy.y;
		this.east = other_guy.east;
		this.south = other_guy.south;
	},

	compare : function (other_guy) {
		if (this.nono_type == GameTypes.EdgeClues.TOTAL) { 
			if (this.total == other_guy.total) return true;
		} else if (this.nono_type == GameTypes.EdgeClues.NONOGRAM) {
			
			if (this.nonogram_hint.length != other_guy.nonogram_hint.length) return false;
			for (var i = 0; i < this.nonogram_hint.length; i++) {
				if (this.nonogram_hint[i] != other_guy.nonogram_hint[i]) return false;
			}
			return true;
		} else if (this.nono_type == 3) {
			
		} else if (this.nono_type == GameTypes.EdgeClues.NONOGRAM_PERP_ONES) {
			
		} else if (this.nono_type == GameTypes.EdgeClues.PAIRED) {
			if (this.paired != other_guy.paired) return false;
			return true;
		} else if (this.nono_type == GameTypes.EdgeClues.DNA_MATCH) {
			if (this.nono_subtype != other_guy.nono_subtype) return false;
			if (this.dna_hint_repeats != other_guy.dna_hint_repeats) return false;
			return true;
		} else if (this.nono_type == GameTypes.EdgeClues.CROWN) {
			if (this.crown_num == other_guy.crown_num) return true;
		}  else if (this.nono_type == GameTypes.EdgeClues.HEART) {
			if (this.heart_num == other_guy.heart_num) return true;
		}  else if (this.nono_type == GameTypes.EdgeClues.SMILEY) {
			if (this.smiley_num == other_guy.smiley_num) return true;
		}else if (this.nono_type == GameTypes.EdgeClues.EYEBRACKET) {
			if (this.eyebracket_num == other_guy.eyebracket_num) return true;
		}

		return false;
	},

	pixel_mode: 1,

	get_pixel : function (x, y) {
		if (this.pixel_mode == 1) {
			// calc actual mines
			return this.game_state.get_pixel(x, y);
		} else {
			// calc players pixels - check for satisfaction
			return this.game_state.get_player_pixel(x, y);
		}
	},

	calc_paired : function () { 
		this.paired = 0;
		if (this.x < 0) {
			if (this.y >= this.game_state.level_h) return;
			for (var x = 0; x < this.game_state.level_w; x++) {
				if (this.get_pixel(x, this.y) == 1 &&
				    this.get_pixel(x, this.y + 1) == 1) this.paired++;
			}
		} else if (this.y < 0) {
			if (this.x >= this.game_state.level_w) return;
			for (var y = 0; y < this.game_state.level_h; y++) {
				if (this.get_pixel(this.x, y) == 1 &&
				    this.get_pixel(this.x + 1, y) == 1) this.paired++;
			}
		}
	},

	show_paired : function () { 
		if (this.east == true) {
			this.draw_num(this.game_state.level_w, this.y + 0.5, 0, this.paired);
			this.sprites[0].set_texture('paired_east.png');
			this.sprites[0].make_vis();
			this.sprites[0].update_pos(this.game_state.level_w*this.game_state.tile_size + 0.5*this.game_state.tile_size, 								   this.y*this.game_state.tile_size + 1*this.game_state.tile_size);
		} if (this.south == true) this.draw_num(this.x, this.game_state.level_h, 0, this.paired);
	},

	calc_total : function () {
		this.total = 0;
		if (this.x < 0) {
			for (var x = 0; x < this.game_state.level_w; x++) {
				 this.total += this.get_pixel(x, this.y);
			}
		} else if (this.y < 0) {
			for (var y = 0; y < this.game_state.level_h; y++) {
				this.total += this.get_pixel(this.x, y);
			}
		}
	},

	is_pixel_social: function (x,y) {
		if (this.pixel_mode == 1) {
			// calc actual mines
			return this.game_state.is_pixel_social(x,y);
		} else {
			// calc players pixels - check for satisfaction
			var lonely_ = this.game_state.is_player_pixel_social(x,y);
			////console.log('is_player_pixel_lonely ' + lonely_);
			return lonely_
		}
	},

	is_mine_lonely: function (x,y) {
		if (this.pixel_mode == 1) {
			// calc actual mines
			return this.game_state.is_mine_lonely(x,y);
		} else {
			// calc players pixels - check for satisfaction
			var lonely_ = this.game_state.is_player_flag_lonely(x,y);
			////console.log('is_player_pixel_lonely ' + lonely_);
			return lonely_
		}
	},

	calc_smiley : function () {
		this.smiley_num = 0;
		if (this.x < 0) {
			for (var x = 0; x < this.game_state.level_w; x++) {
				if (this.is_pixel_social(x, this.y)) this.smiley_num += this.get_pixel(x, this.y);
				
			}
		} else if (this.y < 0) {
			for (var y = 0; y < this.game_state.level_h; y++) {
				if (this.is_pixel_social(this.x, y)) this.smiley_num += this.get_pixel(this.x, y);
			}
		}

		
	},


	calc_heart : function () {
		this.heart_num = 0;
		if (this.x < 0) {
			for (var x = 0; x < this.game_state.level_w; x++) {
				if (this.is_pixel_lonely(x, this.y)) this.heart_num += this.get_pixel(x, this.y);
				
			}
		} else if (this.y < 0) {
			for (var y = 0; y < this.game_state.level_h; y++) {
				if (this.is_pixel_lonely(this.x, y)) this.heart_num += this.get_pixel(this.x, y);
			}
		}

		
	},

	is_pixel_social: function (x,y) {
		if (this.pixel_mode == 1) {
			// calc actual mines
			return this.game_state.is_pixel_social(x,y);
		} else {
			// calc players pixels - check for satisfaction
			var lonely_ = this.game_state.is_player_pixel_social(x,y);
			////console.log('is_player_pixel_lonely ' + lonely_);
			return lonely_
		}
	},

	is_pixel_lonely: function (x,y) {
		if (this.pixel_mode == 1) {
			// calc actual mines
			return this.game_state.is_pixel_lonely(x,y);
		} else {
			// calc players pixels - check for satisfaction
			var lonely_ = this.game_state.is_player_pixel_lonely(x,y);
			////console.log('is_player_pixel_lonely ' + lonely_);
			return lonely_
		}
	},
	
	calc_crown : function () {
		this.crown_num = 0;
		var current = 0;
		var best = 0;
		if (this.x < 0) {
			for (var x = 0; x < this.game_state.level_w; x++) {
				if (this.get_pixel(x, this.y) > 0) current += this.get_pixel(x, this.y);
				else current = 0;
				if (current > best) best = current;
				
			}
		} else if (this.y < 0) {
			for (var y = 0; y < this.game_state.level_h; y++) {
				if (this.get_pixel(this.x, y) > 0) current += this.get_pixel(this.x, y);
				else current = 0;
				if (current > best) best = current;
			}
		}

		this.crown_num = best;
	},
	
	eyebracket_num: 0,
	calc_eyebracket : function () {
		this.eyebracket_num = 0;
		var groups = 0;
		var prev_ = 0;
		if (this.x < 0) {
			for (var x = 0; x < this.game_state.level_w; x++) {
				if (this.get_pixel(x, this.y) > 0 && prev_ == 0) groups++;
				prev_ = this.get_pixel(x, this.y) ;
				
			}
		} else if (this.y < 0) {
			for (var y = 0; y < this.game_state.level_h; y++) {
				if (this.get_pixel(this.x, y) > 0 && prev_ == 0) groups++;
				prev_ = this.get_pixel(this.x, y);
			}
		}

		this.eyebracket_num = groups;
	},


	nonogram_perp_mode: false,
	calc_nonogram : function () {
		this.nonogram_hint = [];
		//this.perp_hint = [];
		if (this.x < 0) {
			var current = 0;
			for (var x = 0; x < this.game_state.level_w; x++) {
				
				if (this.get_pixel(x, this.y) == 1) current++;
				else if (current > 0) {
					this.nonogram_hint.push(current);
					current = 0;
				}
			}
			if (current > 0) this.nonogram_hint.push(current);
			
		} else if (this.y < 0) {
			var current = 0;
			for (var y = 0; y < this.game_state.level_h; y++) {
				
				if (this.get_pixel(this.x, y) == 1) current++;
				else if (current > 0) {
					this.nonogram_hint.push(current);
					current = 0;
				}
			}
			if (current > 0) this.nonogram_hint.push(current);
		}
	},

	calc_nonogram_perp : function () {
		this.nonogram_hint = [];
		//this.perp_hint = [];
		if (this.x < 0) {
			var current = 0;
			for (var x = 0; x < this.game_state.level_w; x++) {
				
				if (this.get_pixel(x, this.y) == 1) current++;
				else if (current > 0) {
					this.nonogram_hint.push(current);
					if (current == 1) {
						var b = this.game_state.tiles[x - 1][this.y];
						var perp = this.game_state.blocks[b].get_vert_seq_length();
						this.nonogram_hint.push(perp);
					}
					current = 0;
				}
				
			}
			if (current > 0) {
				this.nonogram_hint.push(current);
				if (current == 1) {
					var b = this.game_state.tiles[this.game_state.level_w - 1][this.y];
					var perp = this.game_state.blocks[b].get_vert_seq_length();
					this.nonogram_hint.push(perp);
				}
			}
			
		} else if (this.y < 0) {
			var current = 0;
			for (var y = 0; y < this.game_state.level_h; y++) {
				
				if (this.get_pixel(this.x, y) == 1) current++;
				else if (current > 0) {
					this.nonogram_hint.push(current);
					if (current == 1) {
						var b = this.game_state.tiles[this.x][y - 1];
						var perp = this.game_state.blocks[b].get_horiz_seq_length();
						this.nonogram_hint.push(perp);
					}
					current = 0;
				}
				
			}
			if (current > 0) {
				this.nonogram_hint.push(current);
				if (current == 1) {
					var b = this.game_state.tiles[this.x][this.game_state.level_h - 1];
					var perp = this.game_state.blocks[b].get_horiz_seq_length();
					this.nonogram_hint.push(perp);
				}
			}
		}
	},

	

	show_hint : function () { 
		this.hide();	// refresh
		this.make_vis();
	},

	hide : function () {
		for (var i = 0; i < 10; i++) {
			this.sprites[i].hide();
			this.number_objs[i].hide();
		}
	},

	make_vis : function () {
		if (this.x >= this.game_state.level_w || this.y >= this.game_state.level_h) return;
		if (this.nono_type == 1) {
			this.show_total();
		} else if (this.nono_type == GameTypes.EdgeClues.CROWN) {
			this.show_crown();
		} else if (this.nono_type == GameTypes.EdgeClues.EYEBRACKET) {
			this.show_eyebracket();
		} else if (this.nono_type == GameTypes.EdgeClues.HEART) {
			this.show_heart();
		} else if (this.nono_type == GameTypes.EdgeClues.SMILEY) {
			this.show_smiley();
		} else if (this.nono_type == GameTypes.EdgeClues.NONOGRAM) {
			this.show_nonogram();
		}  else if (this.nono_type == GameTypes.EdgeClues.NONOGRAM_PERP_ONES) {
			
			this.show_nonogram_perp();
		} else if (this.nono_type == GameTypes.EdgeClues.PAIRED) {
			if (this.x >= this.game_state.level_w - 1 || this.y >= this.game_state.level_h - 1) return;
			this.show_paired();
		} else if (this.nono_type == GameTypes.EdgeClues.DNA_MATCH) {
			
			this.show_dna_match();
		} else if (this.nono_type == GameTypes.EdgeClues.PORTIONS) {
			
			this.show_portions();
		} else if (this.nono_type == GameTypes.EdgeClues.EMBED_SEQ) {
			this.show_embed_seq();
		} else if (this.nono_type == GameTypes.EdgeClues.RECTANGLE_MATCH) {
			this.show_rect_match();
		} else if (this.nono_type == GameTypes.EdgeClues.ANYSIZE_MATCH) {
			this.show_anysize_match();
		} else if (this.nono_type == GameTypes.EdgeClues.NONOGRAM_A) {
			this.show_nonogram_a();
		} else {

		}
	},

	draw_sprite : function (xtile, ytile, sprite_index, filename, rots) {
		if (rots == null) rots = 0;
		this.sprites[sprite_index].set_texture(filename);
		this.sprites[sprite_index].make_vis();
		for (var r = 0; r < rots; r++) this.sprites[sprite_index].rotate_ninety();
		this.sprites[sprite_index].update_pos(xtile*this.game_state.tile_size + 0.5*this.game_state.tile_size, 						   				      ytile*this.game_state.tile_size + 0.5*this.game_state.tile_size);
	},

	draw_num : function (xtile, ytile, text_obj_index, number) {
		if (this.number_objs.length <= text_obj_index) return;
		var text_x = xtile*this.game_state.tile_size + 0.5*this.game_state.tile_size;
		var text_y = ytile*this.game_state.tile_size + 0.25*this.game_state.tile_size - 2;
		this.number_objs[text_obj_index].set_font(Types.Fonts.SMALL);
		this.number_objs[text_obj_index].set_colour(-1);
		this.number_objs[text_obj_index].change_text(number.toString());

		if (number < 10) this.number_objs[text_obj_index].update_pos(text_x - 0,  text_y - 2);
		else this.number_objs[text_obj_index].update_pos(text_x - 2, text_y - 2);
	},

	

	show_total : function () {
		if (this.x < 0) this.draw_num(this.x - 0.2, this.y, 0, this.total);
		else this.draw_num(this.x, this.y - 0.2, 0, this.total);

		if (this.x < 0) this.draw_sprite(this.x + 0.25, this.y, 0, "eye.png", 3);
		else this.draw_sprite(this.x, this.y + 0.25, 0, "eye.png");

		return;

		this.number_objs[0].change_text(this.total.toString());
		this.number_objs[0].update_pos(this.x*this.game_state.tile_size, this.y*this.game_state.tile_size, 999,999);
		//this.number_objs[0].update_pos(20, 20);
		//this.number_objs[0].make_vis();
		
	},

	show_smiley : function () {
		if (this.x < 0) this.draw_num(this.x - 0.2, this.y, 0, this.smiley_num);
		else this.draw_num(this.x, this.y - 0.2, 0, this.smiley_num);
		if (this.x < 0) this.draw_sprite(this.x + 0.25, this.y, 0, "smiley.png", 3);
		else this.draw_sprite(this.x, this.y + 0.25, 0, "smiley.png");
	},

	show_heart : function () {
		if (this.x < 0) this.draw_num(this.x - 0.2, this.y, 0, this.heart_num);
		else this.draw_num(this.x, this.y - 0.2, 0, this.heart_num);
		if (this.x < 0) this.draw_sprite(this.x + 0.25, this.y, 0, "heart.png", 3);
		else this.draw_sprite(this.x, this.y + 0.25, 0, "heart.png");
	},

	show_crown : function () {
		if (this.x < 0) this.draw_num(this.x - 0.2, this.y, 0, this.crown_num);
		else this.draw_num(this.x, this.y - 0.2, 0, this.crown_num);
		if (this.x < 0) this.draw_sprite(this.x + 0.25, this.y, 0, "crown.png", 3);
		else this.draw_sprite(this.x, this.y + 0.25, 0, "crown.png");
	},

	show_eyebracket : function () {
		if (this.x < 0) this.draw_num(this.x - 0.2, this.y, 0, this.eyebracket_num);
		else this.draw_num(this.x, this.y - 0.2, 0, this.eyebracket_num);
		if (this.x < 0) this.draw_sprite(this.x + 0.25, this.y, 0, "eyebracket.png", 3);
		else this.draw_sprite(this.x, this.y + 0.25, 0, "eyebracket.png");
	},
	
	show_anysize_match : function () {
		var w = this.game_state.level_w;
		var h = this.game_state.level_h;
		var matrix_num = this.dna_hint_sequence;

		if (this.x < 0) {
			var rect_x = g_anysize_patterns[matrix_num].p[0].length;
			var rect_y = g_anysize_patterns[matrix_num].p.length;
			var y_offset = 0;
			if (rect_y == 2) y_offset = 0.5;
			else if (rect_y == 3) y_offset = 1;
			this.draw_num(this.x, this.y + y_offset, 0, this.dna_hint_repeats);
			//this.sprites[0].set_texture('nono_bracket_right.png');
			//this.sprites[0].make_vis();
			//this.sprites[0].update_pos((w+1)*this.game_state.tile_size + 0.5*this.game_state.tile_size, 							//	   		this.y*this.game_state.tile_size + (y_offset + 0.5)*this.game_state.tile_size);
			var num_i = 1;
			for (var x = 0; x < rect_x; x++) {
				for (var y = 0; y < rect_y; y++) {
					var m = rect_x - x;
					//this.draw_num(this.x - m, this.y + y, num_i, g_anysize_patterns[matrix_num].p[y][rect_x - x - 1]);
					var tile_ = g_anysize_patterns[matrix_num].p[y][rect_x - x - 1];
					if (tile_ == 1) this.draw_sprite(this.x - m, this.y + y, num_i, "redtile.png");
					else this.draw_sprite(this.x - m, this.y + y, num_i, "greytile.png");
					num_i++;
				}
			}

		} else if (this.y < 0) {
			var rect_x = g_anysize_patterns[matrix_num].p.length;
			var rect_y = g_anysize_patterns[matrix_num].p[0].length;
			//this.draw_num(this.x, this.y, 0, this.dna_hint_repeats);
			
			var x_offset = 0;
			if (rect_x == 2) x_offset = 0.5;
			else if (rect_x == 3) x_offset = 1;
			this.draw_num(this.x + x_offset, this.y, 0, this.dna_hint_repeats);
			//this.sprites[0].set_texture('nono_bracket_right.png');
			//this.sprites[0].make_vis();
			//this.sprites[0].update_pos(this.x*this.game_state.tile_size + (x_offset + 0.5)*this.game_state.tile_size, 					//			   (h+1)*this.game_state.tile_size + 0.5*this.game_state.tile_size);
			var num_i = 1;
			for (var x = 0; x < rect_x; x++) {
				for (var y = 0; y < rect_y; y++) {

					var m = rect_y - y;
					//this.draw_num(w + m + 1, this.y + y, num_i, g_anysize_patterns[matrix_num].p[y][rect_x - x - 1]);					
					this.draw_num(this.x + x, this.y - m , num_i, g_anysize_patterns[matrix_num].p[x][rect_y - y - 1]);
					var tile_ = g_anysize_patterns[matrix_num].p[x][rect_y - y - 1];				
					if (tile_ == 1) this.draw_sprite(this.x + x, this.y - m, num_i, "redtile.png");
					else this.draw_sprite(this.x + x, this.y - m, num_i, "greytile.png");
					num_i++;
				}
			}
		}
	},

	// always right & bottom
	show_rect_match : function () { 

		var w = this.game_state.level_w;

		if (this.east == true) {
			
			this.draw_num(this.game_state.level_w, this.y + 0.5, 0, this.dna_hint_repeats);
			this.sprites[0].set_texture('nono_bracket_right.png');
			this.sprites[0].make_vis();
			this.sprites[0].update_pos((w+1)*this.game_state.tile_size + 0.5*this.game_state.tile_size, 								   this.y*this.game_state.tile_size + 1*this.game_state.tile_size);
			for (var n = 0; n < g_rectangle_patterns[this.dna_hint_sequence].length; n++) {
				var m = 2 - n;
				this.draw_num(w + m + 1, this.y, n + 1, g_rectangle_patterns[this.dna_hint_sequence][n][0]);
				this.draw_num(w + m + 1, this.y + 1, n + 4, g_rectangle_patterns[this.dna_hint_sequence][n][1]);
			}

		} else if (this.south == true) {
			this.draw_num(this.x, this.game_state.level_h, 0, this.dna_hint_repeats);
		}
		
		return;

		if (this.x < 0) {
			this.draw_num(this.x, this.y + 0.5, 0, this.dna_hint_repeats);

			this.sprites[0].set_texture('nono_bracket_right.png');
			this.sprites[0].make_vis();
			this.sprites[0].update_pos(this.x*this.game_state.tile_size - 0.5*this.game_state.tile_size, 						   				   this.y*this.game_state.tile_size + 1*this.game_state.tile_size);

			for (var n = 0; n < g_rectangle_patterns[this.dna_hint_sequence].length; n++) {
				var m = 2 - n;
				this.draw_num(this.x - m - 1, this.y, n + 1, g_rectangle_patterns[this.dna_hint_sequence][n][0]);
				this.draw_num(this.x - m - 1, this.y + 1, n + 4, g_rectangle_patterns[this.dna_hint_sequence][n][1]);
			}
		} else {
			
			this.draw_num(this.x + 0.5, this.y, 0, this.dna_hint_repeats);

			this.sprites[0].set_texture('nono_bracket_right.png');
			this.sprites[0].rotate_ninety();
			this.sprites[0].make_vis();
			this.sprites[0].update_pos(this.x*this.game_state.tile_size + 1*this.game_state.tile_size, 						   				   this.y*this.game_state.tile_size - 0.5*this.game_state.tile_size);

			for (var n = 0; n < g_rectangle_patterns[this.dna_hint_sequence].length; n++) {
				var m = 2 - n;
				this.draw_num(this.x, this.y - m - 1, n + 1, g_rectangle_patterns[this.dna_hint_sequence][n][0]);
				this.draw_num(this.x + 1, this.y - m - 1, n + 4, g_rectangle_patterns[this.dna_hint_sequence][n][1]);
			}
		}
	},

	show_dna_match : function () { 
		if (this.x < 0) {
			this.draw_num(this.x, this.y, 0, this.dna_hint_repeats);

			this.sprites[0].set_texture('nono_bracket_right.png');
			this.sprites[0].make_vis();
			this.sprites[0].update_pos(this.x*this.game_state.tile_size - 0.5*this.game_state.tile_size, 						   				   this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size);

			for (var n = 0; n < g_three_tile_patterns[this.dna_hint_sequence].length; n++) {

				var m = 3 - n;
				this.draw_num(this.x - m - 1, this.y, n + 1, g_three_tile_patterns[this.dna_hint_sequence][n]);
			}
		} else {
			this.draw_num(this.x, this.y, 0, this.dna_hint_repeats);

			this.sprites[0].set_texture('nono_bracket_right.png');
			this.sprites[0].rotate_ninety();
			this.sprites[0].make_vis();
			this.sprites[0].update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 						   				   this.y*this.game_state.tile_size - 0.5*this.game_state.tile_size);

			for (var n = 0; n < g_three_tile_patterns[this.dna_hint_sequence].length; n++) {

				var m = 3 - n;
				this.draw_num(this.x, this.y - m - 1, n + 1, g_three_tile_patterns[this.dna_hint_sequence][n]);
			}
		}
	},

	show_embed_seq : function () { 
		if (this.x < 0) { 

			this.sprites[0].set_texture('zap.png');
			this.sprites[0].make_vis();
			this.sprites[0].update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 						   				   this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size);

			for (var n = 0; n < this.sequence_hint.length; n++) {
		
				var m = this.sequence_hint.length - n - 1;
				this.draw_num(this.x - m - 1, this.y, n, this.sequence_hint[n]);
				// sprites 2 - 10 for commas or '+'
				continue;
				this.number_objs[n].change_text(this.sequence_hint[n].toString());
				this.number_objs[n].update_pos(this.x*this.game_state.tile_size - 20 - n*26, 
							       this.y*this.game_state.tile_size, 999,999);
			}

			this.sprites[1].set_texture('zap.png');
			this.sprites[1].rotate_ninety();
			this.sprites[1].rotate_ninety();
			this.sprites[1].make_vis();
			var n = this.sequence_hint.length + 1;
			this.sprites[1].update_pos((this.x - n)*this.game_state.tile_size + 0.5*this.game_state.tile_size, 					   				   this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size);


		} else if (this.y < 0) {
			this.sprites[0].set_texture('zap.png');
			this.sprites[0].rotate_ninety();
			this.sprites[0].make_vis();
			this.sprites[0].update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 						   				   this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size);

			for (var n = 0; n < this.sequence_hint.length; n++) {
			//for (var n = this.sequence_hint.length - 1; n >= 0; n--) {
				var m = this.sequence_hint.length - n - 1;
				this.draw_num(this.x, this.y - m - 1, n, this.sequence_hint[n]);
				continue;
				this.number_objs[n].change_text(this.sequence_hint[n].toString());
				this.number_objs[n].update_pos(this.x*this.game_state.tile_size, 
							       this.y*this.game_state.tile_size - 20 - n*26, 999,999);
			}

			this.sprites[1].set_texture('zap.png');
			this.sprites[1].rotate_ninety();
			this.sprites[1].rotate_ninety();
			this.sprites[1].rotate_ninety();
			this.sprites[1].make_vis();
			var n = this.sequence_hint.length + 1;
			this.sprites[1].update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 					   				   (this.y - n)*this.game_state.tile_size + 0.5*this.game_state.tile_size);
		}
	},

	show_portions : function () {
		// this.portions_hint
		if (this.x < 0) {
			for (var n = 0; n < this.portions_hint.length; n++) {
				var m = this.portions_hint.length - n - 1;
				this.draw_num(this.x - m - 1, this.y, n, this.portions_hint[n]);
			}
		} else {
			for (var n = 0; n < this.portions_hint.length; n++) {
				var m = this.portions_hint.length - n - 1;
				this.draw_num(this.x, this.y - m - 1, n, this.portions_hint[n]);
			}
		}
	},

	show_nonogram_a : function () {
		if (this.x < 0) {

			this.sprites[0].set_texture('nono_bracket_right.png');
			this.sprites[0].make_vis();
			this.sprites[0].update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 						   				   this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size);

			for (var n = 0; n < this.nonogram_hint.length; n++) {
			//for (var n = this.nonogram_hint.length - 1; n >= 0; n--) {
				var m = this.nonogram_hint.length - n - 1;
				var group_type = this.nonogram_a_hint[n];
				if (group_type == 0) this.draw_num(this.x - m - 1, this.y, n, this.nonogram_hint[n]);
				else if (group_type == 1) this.draw_sprite(this.x - m - 1, this.y, n + 2, 'qnmark.png');
				// sprites 2 - 10 for commas or '+'
				continue;
				this.number_objs[n].change_text(this.nonogram_hint[n].toString());
				this.number_objs[n].update_pos(this.x*this.game_state.tile_size - 20 - n*26, 
							       this.y*this.game_state.tile_size, 999,999);
			}

			this.sprites[1].set_texture('nono_bracket_right.png');
			this.sprites[1].rotate_ninety();
			this.sprites[1].rotate_ninety();
			this.sprites[1].make_vis();
			var n = this.nonogram_hint.length + 1;
			this.sprites[1].update_pos((this.x - n)*this.game_state.tile_size + 0.5*this.game_state.tile_size, 					   				   this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size);


		} else if (this.y < 0) {
			this.sprites[0].set_texture('nono_bracket_right.png');
			this.sprites[0].rotate_ninety();
			this.sprites[0].make_vis();
			this.sprites[0].update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 						   				   this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size);

			for (var n = 0; n < this.nonogram_hint.length; n++) {
			//for (var n = this.nonogram_hint.length - 1; n >= 0; n--) {
				var m = this.nonogram_hint.length - n - 1;
				var group_type = this.nonogram_a_hint[n];
				if (group_type == 0) this.draw_num(this.x, this.y - m - 1, n, this.nonogram_hint[n]);
				else if (group_type == 1) this.draw_sprite(this.x, this.y - m - 1, n + 2, 'qnmark.png');
				continue;
				this.number_objs[n].change_text(this.nonogram_hint[n].toString());
				this.number_objs[n].update_pos(this.x*this.game_state.tile_size, 
							       this.y*this.game_state.tile_size - 20 - n*26, 999,999);
			}

			this.sprites[1].set_texture('nono_bracket_right.png');
			this.sprites[1].rotate_ninety();
			this.sprites[1].rotate_ninety();
			this.sprites[1].rotate_ninety();
			this.sprites[1].make_vis();
			var n = this.nonogram_hint.length + 1;
			this.sprites[1].update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 					   				   (this.y - n)*this.game_state.tile_size + 0.5*this.game_state.tile_size);
		}
	},

	show_nonogram : function () {
		if (this.x < 0) {

			this.sprites[0].set_texture('nono_bracket_right.png');
			this.sprites[0].make_vis();
			this.sprites[0].update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 						   				   this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size);

			for (var n = 0; n < this.nonogram_hint.length; n++) {
			//for (var n = this.nonogram_hint.length - 1; n >= 0; n--) {
				var m = this.nonogram_hint.length - n - 1;
				this.draw_num(this.x - m - 1, this.y, n, this.nonogram_hint[n]);
				// sprites 2 - 10 for commas or '+'
				continue;
				this.number_objs[n].change_text(this.nonogram_hint[n].toString());
				this.number_objs[n].update_pos(this.x*this.game_state.tile_size - 20 - n*26, 
							       this.y*this.game_state.tile_size, 999,999);
			}

			this.sprites[1].set_texture('nono_bracket_right.png');
			this.sprites[1].rotate_ninety();
			this.sprites[1].rotate_ninety();
			this.sprites[1].make_vis();
			var n = this.nonogram_hint.length + 1;
			this.sprites[1].update_pos((this.x - n)*this.game_state.tile_size + 0.5*this.game_state.tile_size, 					   				   this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size);


		} else if (this.y < 0) {
			this.sprites[0].set_texture('nono_bracket_right.png');
			this.sprites[0].rotate_ninety();
			this.sprites[0].make_vis();
			this.sprites[0].update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 						   				   this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size);

			for (var n = 0; n < this.nonogram_hint.length; n++) {
			//for (var n = this.nonogram_hint.length - 1; n >= 0; n--) {
				var m = this.nonogram_hint.length - n - 1;
				this.draw_num(this.x, this.y - m - 1, n, this.nonogram_hint[n]);
				continue;
				this.number_objs[n].change_text(this.nonogram_hint[n].toString());
				this.number_objs[n].update_pos(this.x*this.game_state.tile_size, 
							       this.y*this.game_state.tile_size - 20 - n*26, 999,999);
			}

			this.sprites[1].set_texture('nono_bracket_right.png');
			this.sprites[1].rotate_ninety();
			this.sprites[1].rotate_ninety();
			this.sprites[1].rotate_ninety();
			this.sprites[1].make_vis();
			var n = this.nonogram_hint.length + 1;
			this.sprites[1].update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 					   				   (this.y - n)*this.game_state.tile_size + 0.5*this.game_state.tile_size);
		}
	},

	show_nonogram_perp : function () {
		
		var show_perp = 0;
		var num_perps = 0;
		var perps_seen = 0;
		
		for (var n = 0; n < this.nonogram_hint.length; n++) {
			if (this.nonogram_hint[n] == 1) {
				num_perps++;
				n++;
			}
		}
		if (this.x < 0) {

			this.sprites[0].set_texture('nono_bracket_right.png');
			this.sprites[0].make_vis();
			this.sprites[0].update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 						   				   this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size);

			for (var n = 0; n < this.nonogram_hint.length; n++) {
				show_perp = 0;
				if (this.nonogram_hint[n] == 1) {
					n++;
					perps_seen++;
					show_perp = 1;
				}
				var m = this.nonogram_hint.length - num_perps - n - 1 + perps_seen;
				this.draw_num(this.x - m - 1, this.y, n - perps_seen, this.nonogram_hint[n]);

				//if (show_perp == 1) num_perps++;
				if (show_perp == 1) {
					this.sprites[1 + perps_seen].set_texture('ghost.png');
					this.sprites[1 + perps_seen].make_vis();
					this.sprites[1 + perps_seen].update_pos((this.x - m - 1)*this.game_state.tile_size + 0.5*this.game_state.tile_size, 					   				   this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size);


				}
				
			}

			this.sprites[1].set_texture('nono_bracket_right.png');
			this.sprites[1].rotate_ninety();
			this.sprites[1].rotate_ninety();
			this.sprites[1].make_vis();
			var n = this.nonogram_hint.length + 1 - num_perps;
			this.sprites[1].update_pos((this.x - n)*this.game_state.tile_size + 0.5*this.game_state.tile_size, 					   				   this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size);


		} else if (this.y < 0) {
			this.sprites[0].set_texture('nono_bracket_right.png');
			this.sprites[0].rotate_ninety();
			this.sprites[0].make_vis();
			this.sprites[0].update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 						   				   this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size);

			for (var n = 0; n < this.nonogram_hint.length; n++) {
				show_perp = 0;
				if (this.nonogram_hint[n] == 1) {
					n++;
					perps_seen++;
					show_perp = 1;
				}
				var m = this.nonogram_hint.length - num_perps - n - 1 + perps_seen;
				this.draw_num(this.x, this.y - m - 1, n  - perps_seen, this.nonogram_hint[n]);

				if (show_perp == 1) {
					this.sprites[1 + perps_seen].set_texture('ghost.png');
					this.sprites[1 + perps_seen].make_vis();
					this.sprites[1 + perps_seen].update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 					   				   (this.y - m - 1)*this.game_state.tile_size + 0.5*this.game_state.tile_size);

				}
				
			}

			this.sprites[1].set_texture('nono_bracket_right.png');
			this.sprites[1].rotate_ninety();
			this.sprites[1].rotate_ninety();
			this.sprites[1].rotate_ninety();
			this.sprites[1].make_vis();
			var n = this.nonogram_hint.length + 1 - num_perps;
			this.sprites[1].update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 					   				   (this.y - n)*this.game_state.tile_size + 0.5*this.game_state.tile_size);
		}
	},
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
			x-=2;	
			var y = Math.floor(i / 5);

			x = x*this.level_tile_size;
			y = y*0.5*this.level_tile_size + 120;

			this.level_x[i] = x;
			this.level_y[i] = y;

			var box_ = new SpriteClass();

			box_.setup_sprite('level_button_on.png',Types.Layer.HUD);	// default sprite, may need to change

			var text_ = new TextClass(Types.Layer.HUD);			// dunno if BACKGROUND works yet
			text_.set_font(Types.Fonts.SMALL_WHITE);
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
		x--;
		var y = Math.floor(this.levels_added / 5);
		y++;

		x = x*this.level_tile_size + 0.5*this.level_tile_size;
		y = y*0.5*this.level_tile_size + 120;

		this.level_x[this.levels_added] = x;
		this.level_y[this.levels_added] = y;

		if (text == 'APP') {
			this.level_text[this.levels_added].set_font(Types.Fonts.XSMALL);
		} else {
			this.level_text[this.levels_added].set_font(Types.Fonts.SMALL_WHITE);
		}
		if (text != null) this.level_text[this.levels_added].set_text(text);

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

		////alert('overworld level ' + level + ' status ' + status_);

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
			//console.log('this.status_sprite[level] == null ' + level);
		}

		this.status_sprite[level].hide();
	},

	click: function(x,y) {
		//this.highlight_off();
		this.selected = -1;
		this.selected_special = -1;
		//x = mouse.x;
		//y = mouse.y;
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


// Global entity factory
g_entity_factory = {};

// LandmineClass.js

LandmineClass = EntityClass.extend({});

g_entity_factory['Landmine'] = LandmineClass;

RewardedVideoClass = EntityClass.extend({


	init: function() {

	},

	show : function() {

	},

	on_reward : function () {
		// give the player some extra hints
	}

});


pBar.value += 10;
