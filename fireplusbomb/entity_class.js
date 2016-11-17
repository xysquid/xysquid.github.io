
block_patterns = [
	[1,1,1,0,0,
	1,1,0,0,0,
	0,0,0,0,0,
	0,0,0,0,0,
	0,0,0,0,0,],

	[1,1,0,0,0,
	1,1,1,0,0,
	0,0,0,0,0,
	0,0,0,0,0,
	0,0,0,0,0,],	



	/*

	[1,1,1,0,0,
	1,1,0,0,0,
	0,0,0,0,0,
	0,0,0,0,0,
	0,0,0,0,0,],

	[1,1,1,0,0,
	0,0,1,0,0,
	0,0,1,0,0,
	0,0,0,0,0,
	0,0,0,0,0,],

	[1,0,0,0,0,
	1,1,1,1,0,
	0,0,0,0,0,
	0,0,0,0,0,
	0,0,0,0,0,],

	[0,0,1,0,0,
	1,1,1,0,0,
	1,0,0,0,0,
	0,0,0,0,0,
	0,0,0,0,0,],
	
	[1,0,1,0,0,
	1,1,1,0,0,
	0,0,0,0,0,
	0,0,0,0,0,
	0,0,0,0,0,],

	[0,0,1,0,0,
	1,1,1,0,0,
	0,0,1,0,0,
	0,0,0,0,0,
	0,0,0,0,0,],

	[0,0,1,0,0,
	0,1,1,0,0,
	1,1,0,0,0,
	0,0,0,0,0,
	0,0,0,0,0,],
	
	[1,0,0,0,0,
	1,1,1,0,0,
	0,1,0,0,0,
	0,0,0,0,0,
	0,0,0,0,0,],

	[1,1,1,1,0,
	0,1,0,0,0,
	0,0,0,0,0,
	0,0,0,0,0,
	0,0,0,0,0,],

	[0,1,0,0,0,
	1,1,1,0,0,
	0,1,0,0,0,
	0,0,0,0,0,
	0,0,0,0,0,],

	[1,1,0,0,0,
	1,1,0,0,0,
	0,0,0,0,0,
	0,0,0,0,0,
	0,0,0,0,0,],

	[1,1,1,1,0,
	0,0,0,0,0,
	0,0,0,0,0,
	0,0,0,0,0,
	0,0,0,0,0,],

	[1,0,0,0,0,
	1,1,1,0,0,
	0,0,0,0,0,
	0,0,0,0,0,
	0,0,0,0,0,],

	[0,1,0,0,0,
	1,1,1,0,0,
	0,0,0,0,0,
	0,0,0,0,0,
	0,0,0,0,0,],

	[0,1,0,0,0,
	1,1,0,0,0,
	1,0,0,0,0,
	0,0,0,0,0,
	0,0,0,0,0,],

	[1,1,1,0,0,
	0,0,0,0,0,
	0,0,0,0,0,
	0,0,0,0,0,
	0,0,0,0,0,],

	[1,1,0,0,0,
	0,1,0,0,0,
	0,0,0,0,0,
	0,0,0,0,0,
	0,0,0,0,0,],

	[1,1,0,0,0,
	0,0,0,0,0,
	0,0,0,0,0,
	0,0,0,0,0,
	0,0,0,0,0,],

	[1,0,0,0,0,
	0,0,0,0,0,
	0,0,0,0,0,
	0,0,0,0,0,
	0,0,0,0,0,],

	*/

	
];


g_block_sprites = {
	1: "block0.png",
	2: "g_block1.png",
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
	1: "block0_shadow.png",
	2: "g_block1_sh.png",
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

BombClass = Class.extend({

	game_state: null,

	x: -1,
	y: -1,		// permanent

	bomb_sprite_shadow: null,
	bomb_sprite: null,
	white_bomb_sprite: null,

	timer: 99,

	init: function(x,y,game_state) {
		
		this.game_state = game_state;

		this.x = x;
		this.y = y;

		//return;
		this.bomb_sprite_shadow = new SpriteClass();
		this.bomb_sprite_shadow.setup_sprite("bomb_shadow.png",Types.Layer.GAME);
		this.bomb_sprite_shadow.update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size + 6, 									this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size + 6);
		this.bomb_sprite_shadow.hide();

		this.bomb_sprite = new SpriteClass();
		this.bomb_sprite.setup_sprite("bomb.png",Types.Layer.GAME);
		this.bomb_sprite.update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 									this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size);
		this.bomb_sprite.hide();

		this.white_bomb_sprite = new SpriteClass();
		this.white_bomb_sprite.setup_sprite("bomb_white.png",Types.Layer.GAME);
		this.white_bomb_sprite.update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size, 									this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size);
		this.white_bomb_sprite.hide();
	},

	horiz: 1,
	vert: 1,

	start_anim: function (horiz, vert) {
		this.timer = 0;//return;
		this.bomb_sprite_shadow.make_vis();
		this.bomb_sprite.make_vis();
		this.white_bomb_sprite.make_vis();
		this.white_bomb_sprite.set_alpha(0);

		this.horiz = horiz;
		this.vert = vert;
	},

	stop_anim: function () {
		this.timer = 99;//return;
		this.bomb_sprite_shadow.hide();
		this.bomb_sprite.hide();
		this.white_bomb_sprite.hide();
	},

	update: function() {

		


		if (this.timer < 12) {
			this.timer++;
			this.white_bomb_sprite.set_alpha(this.timer/12);

			if (this.timer == 12) this.game_state.start_explosion(this.x,this.y, this.horiz, this.vert);

		} else this.stop_anim();
	},

	
	draw: function() {

		

	}

});

ExplosionClass = Class.extend({

	game_state: null,

	x: -1,
	y: -1,		// permanent

	frames: [],	// 6 explosion .pngs
	frames_shadow: [],


	curr_frame: 99,

	init: function(x,y,game_state) {
		
		this.game_state = game_state;

		this.x = x;
		this.y = y;

		this.add_frame("explode1.png","explode1_shadow.png");
		this.add_frame("explode1.png","explode1_shadow.png");
		this.add_frame("explode2.png","explode2_shadow.png");
		this.add_frame("explode3.png","explode3_shadow.png");
		this.add_frame("explode4.png","explode4_shadow.png");
		this.add_frame("explode5.png","explode5_shadow.png");
	},

	add_frame: function(spritename_ , shadow_spritename_) {
		

		var shadowspr = new SpriteClass();
		shadowspr.setup_sprite(shadow_spritename_,Types.Layer.GAME);
		shadowspr.update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size + 6, 									this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size + 6);
		shadowspr.hide();
		this.frames.push(shadowspr);

		var spr = new SpriteClass();
		spr.setup_sprite(spritename_,Types.Layer.GAME);
		spr.update_pos(this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size , 								this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size);
		spr.hide();
		this.frames_shadow.push(spr);
	},

	start_anim: function () {
		this.curr_frame = 0;
	},

	stop_anim: function () {
		this.curr_frame = 99;
		for (var i = 0; i < this.frames.length; i++) {
				this.frames[i].hide();
				this.frames_shadow[i].hide();
		}
	},

	draw: function() {

		
		if (this.curr_frame < this.frames.length &&
		    this.curr_frame >= 0) {
			for (var i = 0; i < this.frames.length; i++) {
				this.frames[i].hide();
				this.frames_shadow[i].hide();
			}
			this.frames[this.curr_frame].make_vis();
			this.frames_shadow[this.curr_frame].make_vis();
		}

		if (this.curr_frame < this.frames.length) {
			
			this.curr_frame++;

			

		} else this.stop_anim();
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

	init: function(game_state) {

		this.game_state = game_state;

		this.block_type = 1;

		this.block_blink_sprite = new SpriteClass();
		this.block_blink_sprite.setup_sprite(g_block_blink_sprites[this.block_type],Types.Layer.GAME);
		this.block_blink_sprite.hide();
		
		this.block_shadow_sprite = new SpriteClass();
		this.block_shadow_sprite.setup_sprite(g_block_shadow_sprites[this.block_type],Types.Layer.GAME);
		this.block_shadow_sprite.hide();

		this.block_sprite = new SpriteClass();
		this.block_sprite.setup_sprite(g_block_sprites[this.block_type],Types.Layer.GAME);
		this.block_sprite.hide();

		
	},

	// only for those block objects used in the grid
	// NOT in the new peice
	set_position_grid: function(x,y) {
		this.x = x;
		this.y = y;


		if (x == -1) {
			this.block_sprite.hide();
			this.block_shadow_sprite.hide();
		} else {
			this.block_sprite.make_vis();
			this.block_shadow_sprite.make_vis();

			this.block_blink_sprite.update_pos(x*this.game_state.tile_size + 0.5*this.game_state.tile_size, y*this.game_state.tile_size + 0.5*this.game_state.tile_size);

			this.block_sprite.update_pos(x*this.game_state.tile_size + 0.5*this.game_state.tile_size, y*this.game_state.tile_size + 0.5*this.game_state.tile_size);
			this.block_shadow_sprite.update_pos(x*this.game_state.tile_size + 6 + 0.5*this.game_state.tile_size, y*this.game_state.tile_size + 6 + 0.5*this.game_state.tile_size);
		}

		

	},

	screen_x: 0,
	screen_y: 0,

	// used for new piece that player picks up and drops in
	set_position_screen: function(x,y) {

		this.screen_x = x;
		this.screen_y = y;

		if (this.block_type == 0) {
			this.block_sprite.hide();
			this.block_shadow_sprite.hide();
			return;
		}


		this.block_sprite.make_vis();
		this.block_shadow_sprite.make_vis();

		
		this.block_sprite.update_pos(x,y);
		this.block_shadow_sprite.update_pos(x + 6, y + 6);
	},

	get_type: function() {
		return this.block_type;
	},

	set_type: function(gemtype) {

		
		this.y_scale = 1;
		this.block_sprite.set_scale_y(this.y_scale);
		this.block_shadow_sprite.set_scale_y(this.y_scale);
		

		if (gemtype == 0) {
			this.block_type = 0;
			return;
		}

		if (this.block_type != gemtype) {
			this.block_type = gemtype;


			this.block_sprite.set_texture(g_block_sprites[gemtype]);
			this.block_shadow_sprite.set_texture(g_block_shadow_sprites[gemtype]);
			this.block_blink_sprite.set_texture(g_block_blink_sprites[gemtype]);

		}
	},

	draw_fire: function () {

		// on adding 2 fires

		if (this.block_type == 6) {
			//this.y_scale = 1 + 0.1*Math.random() - 0.1*Math.random();
			//this.block_sprite.set_scale_y(this.y_scale);
			//this.block_shadow_sprite.set_scale_y(this.y_scale);

			if (this.y_scale > 1) {
				this.y_scale -= 0.05;
				this.block_sprite.set_scale_y(this.y_scale);
				this.block_shadow_sprite.set_scale_y(this.y_scale);
				
			}

		}

	},

	// only called when effects are being done
	draw: function() {
		if (this.block_type == 6) {
			//this.y_scale = 1 + 0.1*Math.random() - 0.1*Math.random();
			//this.block_sprite.set_scale_y(this.y_scale);
			//this.block_shadow_sprite.set_scale_y(this.y_scale);

			if (this.y_scale > 1) {
				//this.y_scale -= 0.1;
				//this.block_sprite.set_scale_y(this.y_scale);
				//this.block_shadow_sprite.set_scale_y(this.y_scale);
				
			}

			if (this.x != -1) {
				this.screen_x = this.x*this.game_state.tile_size + 0.5*this.game_state.tile_size;
				this.screen_y = this.y*this.game_state.tile_size + 0.5*this.game_state.tile_size;
			}

			if (Math.random() < 0.33) this.game_state.set_fire_bit_effect(this.screen_x, this.screen_y - 0.25*this.game_state.tile_size);
		}

		if (this.blink_timer > 0) {
			this.block_blink_sprite.make_vis();
			this.block_blink_sprite.set_alpha(this.blink_timer/40);
			this.blink_timer--;
	


			if(this.blink_timer == 0) this.blink_timer.hide();
			
		}

	}

});


// This could be useful for rotation effects, etc
// Singleton
NewPieceClass = Class.extend({

	block_objs: new Array(5),	// 5x5 sprites
	tiles: new Array(5),	// 5x5

	temp_rotation_grid: new Array(5),

	highlight_squares: new Array(5),

	ok_squares: new Array(5),	// should this highlight square be red?

	draw_x: 0,
	draw_y: 0,

	game_state: null,

	wait_timer: 0,		// for tutorial

	turns: 0,

	init: function(game_state) {
		this.game_state = game_state;

		for(var i = 0; i < 5; i++) {
			this.block_objs[i] = new Array(5);
			this.tiles[i] = new Array(5);
			this.temp_rotation_grid[i] = new Array(5);
			this.highlight_squares[i] = new Array(5);
			this.ok_squares[i] = new Array(5);

		}

		for(var x = 0; x < 5; x++) {
			for(var y = 0; y < 5; y++) {
				this.block_objs[x][y] = new BlockClass(this.game_state);
				this.block_objs[x][y].set_type(0);
				this.tiles[x][y] = 0;

				this.temp_rotation_grid[x][y] = 0;

				this.highlight_squares[x][y] = new SquareClass();
				this.highlight_squares[x][y].setup();
				this.highlight_squares[x][y].hide();

				this.ok_squares[x][y] = 1;
			}
		}

	},

	clear: function() {
		for(var x = 0; x < 5; x++) {
			for(var y = 0; y < 5; y++) {
				this.block_objs[x][y].set_type(0);
				this.tiles[x][y] = 0;

			}
		}
	},

	rotate_with_effect: function() {
		this.rotate();
	},

	rotate: function() {
		for (var x = 0; x < 5; x++) {
			for (var y = 0; y < 5; y++) {
				this.temp_rotation_grid[x][y] = this.tiles[x][y];
			}
		}

		for (var x = 0; x < 5; x++) {
			for (var y = 0; y < 5; y++) {
				this.tiles[x][y] = this.temp_rotation_grid[y][4 - x];
			}
		}

		this.shift();
	},

	scan_for_matches: function() {
		return 1;
	},	

	flip: function() {
		var p_piece = this.tiles;
		for (var x = 0; x < 5; x++) {
			for (var y = 0; y < 5; y++) {
				this.temp_rotation_grid[x][y] = p_piece[x][y];
			}
		}

		
		for (var y = 0; y < 5; y++) {
			p_piece[0][y] = this.temp_rotation_grid[4][y];
			p_piece[1][y] = this.temp_rotation_grid[3][y];
			p_piece[2][y] = this.temp_rotation_grid[2][y];
			p_piece[3][y] = this.temp_rotation_grid[1][y];
			p_piece[4][y] = this.temp_rotation_grid[0][y];
		}

		this.shift();
	},

	shift: function() {
		var p_piece = this.tiles;

		while (p_piece[0][0] == 0 && p_piece[1][0] == 0 && p_piece[2][0] == 0 && p_piece[3][0] == 0 && p_piece[4][0] == 0) {
			// top row empty, move up one
			p_piece[0][0] = p_piece[0][1];
			p_piece[1][0] = p_piece[1][1];
			p_piece[2][0] = p_piece[2][1];
			p_piece[3][0] = p_piece[3][1];
			p_piece[4][0] = p_piece[4][1];



			p_piece[0][1] = p_piece[0][2];
			p_piece[1][1] = p_piece[1][2];
			p_piece[2][1] = p_piece[2][2];
			p_piece[3][1] = p_piece[3][2];
			p_piece[4][1] = p_piece[4][2];

			p_piece[0][2] = p_piece[0][3];
			p_piece[1][2] = p_piece[1][3];
			p_piece[2][2] = p_piece[2][3];
			p_piece[3][2] = p_piece[3][3];
			p_piece[4][2] = p_piece[4][3];

			p_piece[0][3] = p_piece[0][4];
			p_piece[1][3] = p_piece[1][4];
			p_piece[2][3] = p_piece[2][4];
			p_piece[3][3] = p_piece[3][4];
			p_piece[4][3] = p_piece[4][4];


			p_piece[0][4] = 0;
			p_piece[1][4] = 0;
			p_piece[2][4] = 0;
			p_piece[3][4] = 0;
			p_piece[4][4] = 0;
		}

		while (p_piece[0][0] == 0 && p_piece[0][1] == 0 && p_piece[0][2] == 0 && p_piece[0][3] == 0 && p_piece[0][4] == 0) {
			// left column empty, move left one
			p_piece[0][0] = p_piece[1][0];
			p_piece[0][1] = p_piece[1][1];
			p_piece[0][2] = p_piece[1][2];
			p_piece[0][3] = p_piece[1][3];
			p_piece[0][4] = p_piece[1][4];
		
			p_piece[1][0] = p_piece[2][0];
			p_piece[1][1] = p_piece[2][1];
			p_piece[1][2] = p_piece[2][2];
			p_piece[1][3] = p_piece[2][3];
			p_piece[1][4] = p_piece[2][4];

			p_piece[2][0] = p_piece[3][0];
			p_piece[2][1] = p_piece[3][1];
			p_piece[2][2] = p_piece[3][2];
			p_piece[2][3] = p_piece[3][3];
			p_piece[2][4] = p_piece[3][4];

			p_piece[3][0] = p_piece[4][0];
			p_piece[3][1] = p_piece[4][1];
			p_piece[3][2] = p_piece[4][2];
			p_piece[3][3] = p_piece[4][3];
			p_piece[3][4] = p_piece[4][4];


			p_piece[4][0] = 0;
			p_piece[4][1] = 0;
			p_piece[4][2] = 0;
			p_piece[4][3] = 0;
			p_piece[4][4] = 0;
			
		}

		// set sprites:
		for(var x = 0; x < 5; x++) {
			for(var y = 0; y < 5; y++) {
				this.block_objs[x][y].set_type(this.tiles[x][y]);
			}
		}
	},

	load_tut_pattern: function(tut_num) {

		if (tut_num > tut_block_patterns.length - 1) return;

		if (screen_width < screen_height) {
			this.draw_x = 3.5*this.game_state.tile_size;
			this.draw_y = 20*this.game_state.tile_size;

		} else {
			this.draw_x = 40*this.game_state.tile_size;
			this.draw_y = 3.5*this.game_state.tile_size;
		}

		for (var i = 0; i < 25; i++) {
			var x = i % 5;
			var y = Math.floor (i / 5);
			this.tiles[x][y] = tut_block_patterns[tut_num][i];

			
		}

		// set sprites:
		for(var x = 0; x < 5; x++) {
			for(var y = 0; y < 5; y++) {
				this.block_objs[x][y].set_type(this.tiles[x][y]);
			}
		}
	},

	generate_new: function() {


		if (screen_width < screen_height) {
			this.draw_x = 3.5*this.game_state.tile_size;
			this.draw_y = 20*this.game_state.tile_size;

		} else {
			this.draw_x = 40*this.game_state.tile_size;
			this.draw_y = 3.5*this.game_state.tile_size;
		}


		var rand = Math.floor(Math.random()*block_patterns.length);

		for (var i = 0; i < 25; i++) {
			var x = i % 5;
			var y = Math.floor (i / 5);
			this.tiles[x][y] = block_patterns[rand][i];

			
		}

		if (Math.random() < 0.5) this.flip();

		


		// evaluate game grid
		var total_hp = 0;
		var total_bombs = 0;
		var total_fire = 0;
		for(var y = 0; y < this.game_state.grid_h; y++) {
            		for(var x = 0; x < this.game_state.grid_w; x++) {
				if (this.game_state.get_block_type(x,y) == 5) total_bombs++;

				if (this.game_state.get_block_type(x,y) == 2) total_hp+= 1;

				if (this.game_state.get_block_type(x,y) == 1) total_hp+= 0.25;

				if (this.game_state.get_block_type(x,y) == 3) total_hp+=2;
				
				if (this.game_state.get_block_type(x,y) == 4) total_hp+=3;

				if (this.game_state.get_block_type(x,y) == 6) total_fire+=1;

				if (this.game_state.get_block_type(x,y) == 7) total_hp+=4;
				if (this.game_state.get_block_type(x,y) == 8) total_hp+=5;
				if (this.game_state.get_block_type(x,y) == 9) total_hp+=6;
			}
		}

		// try to put in 1 initial fire
		if (total_fire <= 1) {
			var init_fire_ = 0;
			for(var i = 0; i < 52; i++) {
				if (init_fire_ == 0) init_fire_ = this.add_rand_fire();
				else break;
			}
		}

		// add bombs and fire - random for now...............................

		// 5 is bomb
		// 6 is fire
		for(var y = 0; y < 5; y++) {
            		for(var x = 0; x < 5; x++) {
				if(this.tiles[x][y] == 0 || this.tiles[x][y] == 6) continue;

				

				if (Math.random() < 0.66) {
					if (Math.random() < 0.5 && total_bombs <= 0.66*total_hp) {  // 1.33

						if ((x > 0 && this.tiles[x-1][y] == 6) || 
				    		(x < 4 && this.tiles[x+1][y] == 6) || 
				   		 (y > 0 && this.tiles[x][y-1] == 6) || 
				    		(y < 4 && this.tiles[x][y+1] == 6)) continue;

						this.tiles[x][y] = 5;
						total_bombs++;
						//bomb++;
					} else {
						this.tiles[x][y] = 6;
						//fire++;
					}
				}
			}
		}

		
		if (Math.random() < 0.5) {
			for(var x = 0; x < 5; x++) {
				for(var y = 0; y < 5; y++) {

					if (this.tiles[x][y] == 5) {
						this.tiles[x][y] = 6;
						total_bombs--;
					} else if (this.tiles[x][y] == 6 && total_bombs <= 1*total_hp) {
						this.tiles[x][y] = 5;
						total_bombs++;
					}

				}
			}
		}

		for(var x = 0; x < 5; x++) {
			for(var y = 0; y < 5; y++) {
				if (this.tiles[x][y] == 6 && 
				    ((x > 0 && this.tiles[x-1][y] == 5) || 
					(x < 4 && this.tiles[x+1][y] == 5) || 
					(y > 0 && this.tiles[x][y-1] == 5) || 
					(y < 4 && this.tiles[x][y+1] == 5))) {
						this.tiles[x][y] = 2;

						total_hp++;

				
				// 3.5*total_bombs + 4
				// 3.25*	   + 6    (+8 is too hard)
				// 3.33*total_bombs + 7		// this was the first version on NG, up to ~500 views, 3 stars, 2 comments
				// 3*total_bombs + 4		// 2nd version, up to ~ 1200 views, still 3 stars

				// 3*total_bombs + 0, no ||| blocks	// up to ~ 1600, incl 'boring' comment
				// 3.5*		 + 4			// up to 2200, still 3 stars
				// 3.5*total_bombs + 2		up to 2583,	still 3 stars but score is creeping up (2.89 to 2.98)
				// 3.33*total_bombs + 3, ONLY 5 member peices, up to 3200 views, still lukewarm feedback
				// 3.33*total_bombs + 4, ~ 4000 views	no trying to give only peices that fit

				} else if (this.tiles[x][y] == 1 && Math.random() < 1 && total_hp <= 3.66*total_bombs + 10) {
					   this.tiles[x][y] = 2;

						total_hp++;

					// go up to 3 HP blocks - new code
					if (false && this.tiles[x][y] == 2 && Math.random() < 1 && total_hp <= 4*total_bombs + 12) {
						this.tiles[x][y] = 3;

						total_hp++;

					
					}

					// go up to 4 HP blocks - new code
					if (false && this.tiles[x][y] == 3 && Math.random() < 1 && total_hp <= 4*total_bombs + 12) {
						this.tiles[x][y] = 4;

						total_hp++;
					}

					// go up to 5 HP blocks - new code
					if (this.tiles[x][y] == 4 && Math.random() < 1 && total_hp <= 4*total_bombs + 12) {
						this.tiles[x][y] = 7;

						total_hp++;
					}

					// go up to 5 HP blocks - new code
					if (this.tiles[x][y] == 7 && Math.random() < 1 && total_hp <= 4*total_bombs + 12) {
						this.tiles[x][y] = 8;

						total_hp++;
					}

					// go up to 5 HP blocks - new code
					if (this.tiles[x][y] == 8 && Math.random() < 1 && total_hp <= 4*total_bombs + 12) {
						this.tiles[x][y] = 9;

						total_hp++;
					}
				}
			}
		}

		for(var x = 0; x < 5; x++) {
			for(var y = 0; y < 5; y++) {
				 if (this.tiles[x][y] == 2 && Math.random() < 1 && total_hp <= 3.66*total_bombs + 10) { // 2*total_bombs
					this.tiles[x][y] = 3;

					total_hp++;

					if (this.tiles[x][y] == 8 && Math.random() < 0.33) {
						this.tiles[x][y] = 10;

						total_hp++;
			
					}
			
				}
			}
		}

		// for when the grid is filled up, not much space
		// 
		if (total_hp > 40) {
			for(var x = 0; x < 5; x++) {
				for(var y = 0; y < 5; y++) {
					if (this.tiles[x][y] == 0) continue;
					if (this.tiles[x][y] == 2 || this.tiles[x][y] == 3) this.tiles[x][y] = 1;
				
				}
			}
		}

		// try to put in 1 more fire
		var fire_ = 0;
		for(var i = 0; i < 12; i++) {
			if (fire_ == 0) fire_ = this.add_rand_fire();
			else break;
		}

		// early in game,
		
		for(var x = 0; x < 5; x++) {
			for(var y = 0; y < 5; y++) {

				if (this.turns < 6 && this.tiles[x][y] == 3) this.tiles[x][y] = 2;
				
				if (this.turns < 2 && this.tiles[x][y] == 2) this.tiles[x][y] = 1;

				
			}
		}

		

		// set sprites:
		for(var x = 0; x < 5; x++) {
			for(var y = 0; y < 5; y++) {
				this.block_objs[x][y].set_type(this.tiles[x][y]);
			}
		}

		
	},

	should_remake: false,

	add_rand_fire: function () {
		var randx = Math.floor(5*Math.random());
		var randy = Math.floor(5*Math.random());

		if (randx > 0 && this.tiles[randx - 1][randy] == 5) return 0;

		if (randy > 0 && this.tiles[randx][randy - 1] == 5) return 0;

		if (randx < 4 && this.tiles[randx + 1][randy] == 5) return 0;
	
		if (randy < 4 && this.tiles[randx][randy + 1] == 5) return 0;

		if (this.tiles[randx][randy] != 0 && this.tiles[randx][randy] != 5 && this.tiles[randx][randy] != 6) {
			this.tiles[randx][randy] = 6;
			return 1;
		}

		return 0;
	},

	update: function () {

	},

	// like how we have stacks for the cards in solitaire
	// here we have different positions
	//	- NEW_PEICE_X
	//	- player cursor
	//	- on player drop -> move into position

	x_anchor: 0,
	y_anchor: 0,

	anchor_offset: 0,

	calc_position: function () {

		

		if (screen_width < screen_height) {
			this.x_anchor = 3.5*this.game_state.tile_size + 2*this.anchor_offset*2*this.game_state.tile_size;
			this.y_anchor = 9.0*this.game_state.tile_size;

		} else {

			this.x_anchor = 9.0*this.game_state.tile_size;
			this.y_anchor = 3.5*this.game_state.tile_size + 2*this.anchor_offset*2*this.game_state.tile_size ;
		}

		this.draw_x = this.x_anchor;
		this.draw_y = this.y_anchor;
	},

	grab_offset_x: 0,
	grab_offset_y: 0,

	grab_tile_x: 0,
	grab_tile_y: 0,

	player_grab: function(x,y) {

		// is x, y our position?

		if (Math.abs(this.x_anchor - this.draw_x) > this.game_state.tile_size ||
		    Math.abs(this.y_anchor - this.draw_y) > this.game_state.tile_size) return false;

		for(var xbl = 0; xbl < 5; xbl++) {
			for(var ybl = 0; ybl < 5; ybl++) {

				//if (this.tiles[xbl][ybl] == 0) continue;

				if (Math.abs(x - (this.draw_x + xbl*this.game_state.tile_size)) < this.game_state.tile_size &&
				    Math.abs(y - (this.draw_y + ybl*this.game_state.tile_size)) < this.game_state.tile_size) {
					this.player_control = true;

					this.grab_offset_x =  xbl*this.game_state.tile_size;
					this.grab_offset_y =  ybl*this.game_state.tile_size;

					this.grab_tile_x = xbl;
					this.grab_tile_y = ybl;

					this.draw_x = x - this.grab_offset_x;
					this.draw_y = y - this.grab_offset_y;
					
					return true;
				}	
			}
		}

		return false;
	},

	tut_mode: 0,

	player_drop_tut: function(xtile, ytile) {

		this.wait_timer = 60;

		this.tut_mode = 1;
		this.player_drop(xtile,ytile);
		this.tut_mode = 0;
	},	

	player_drop: function(xtile, ytile) {

		for(var x = 0; x < 5; x++) {
			for(var y = 0; y < 5; y++) {
				this.highlight_squares[x][y].hide();
			}
		}

		this.grab_offset_x =  0;
		this.grab_offset_y =  0;
		this.player_control = false;
		if (xtile == -1) return;

		

		if (this.check_match(xtile - this.grab_tile_x, ytile - this.grab_tile_y) == 1) {
			this.drop_into_game(xtile - this.grab_tile_x,ytile - this.grab_tile_y);

			if (this.tut_mode == 1) {
				this.dont_remake_after_explosion = true;
				return;
			}
			this.dont_remake_after_explosion = false;			

			// next peice
			if (this.game_state.explosion_timer == 0 && 
		   	    this.game_state.lit_timer == 0) this.should_remake = true; //this.check_for_any_move();
			else {
				for (var i = 0; i < 12; i++) {
					this.generate_new();
					this.no_moves = false;
					this.check_for_any_move();
					if (this.no_moves == false) break;
				}

				if (this.no_moves == true) {
					// found nothing to fit!
					this.dont_remake_after_explosion = false;	// DO remake

					// clear
					for (var i = 0; i < 25; i++) {
						var x = i % 5;
						var y = Math.floor (i / 5);
						this.tiles[x][y] = 0;

			
					}

					// set sprites:
					for(var x = 0; x < 5; x++) {
						for(var y = 0; y < 5; y++) {
							this.block_objs[x][y].set_type(this.tiles[x][y]);
						}
					}
					
				} else this.dont_remake_after_explosion = true;
			}
			

			//this.generate_new();
			
			
		}

	},

	dont_remake_after_explosion: false,

	check_for_any_move: function () {

		this.shift();

		for(var x = 0; x < this.game_state.grid_w; x++) {
			for(var y = 0; y < this.game_state.grid_h; y++) {
				if (this.check_match(x, y) == 1) {
					this.rotate();
					this.rotate();
					this.rotate();
					this.rotate();
					this.shift();
					return 1;
				}
			}
		}

		this.rotate();
		this.shift();

		for(var x = 0; x < this.game_state.grid_w; x++) {
			for(var y = 0; y < this.game_state.grid_h; y++) {
				if (this.check_match(x, y) == 1) {
					this.rotate();
					this.rotate();
					this.rotate();
					this.shift();
					return 1;
				}
			}
		}

		this.rotate();
		this.shift();

		for(var x = 0; x < this.game_state.grid_w; x++) {
			for(var y = 0; y < this.game_state.grid_h; y++) {
				if (this.check_match(x, y) == 1) {
					this.rotate();
					this.rotate();
					this.shift();
					return 1;
				}
			}
		}

		this.rotate();
		this.shift();

		for(var x = 0; x < this.game_state.grid_w; x++) {
			for(var y = 0; y < this.game_state.grid_h; y++) {
				if (this.check_match(x, y) == 1) {
					this.rotate();
					this.shift();
					return 1;
				}
			}
		}

		this.rotate();
		this.shift();			

		this.no_moves = true;
		
	},

	no_moves: false,


	drop_into_game: function (xdrop,ydrop) {

		var num_lit_ = 0;

		// first pass to extinguish fire / squish bombs
		for(var x = 0; x < 5; x++) {
			for(var y = 0; y < 5; y++) {
				if(this.tiles[x][y] == 0) continue;	// fine
				if(xdrop + x >= this.game_state.grid_w || ydrop + y >= this.game_state.grid_h)	return -1;	// out of bounds
				if(this.tiles[x][y] == 5 || this.tiles[x][y] == 6) continue;  // only care about dropping bricks
				var game_tile = this.game_state.get_block_type(xdrop + x,ydrop + y);

				// squish / extibguish
				if(game_tile == 5 || game_tile == 6) this.game_state.change_tile(xdrop + x,ydrop + y, 0);

			}
		}

		for(var x = 0; x < 5; x++) {
			for(var y = 0; y < 5; y++) {
				if(this.tiles[x][y] == 0) continue;	// fine
				if(xdrop + x >= this.game_state.grid_w || ydrop + y >= this.game_state.grid_h)	return -1;	// out of bounds
				//if(this.game_state.tiles[xdrop + x][ydrop + y] == -1) continue;	// fine	

				var game_tile = this.game_state.get_block_type(xdrop + x,ydrop + y);

				this.game_state.change_tile(xdrop + x,ydrop + y, this.tiles[x][y]);

				// check for fire / bomb on top of each other
				if (this.tiles[x][y] == 5 && game_tile == 6 ||
				    (this.tiles[x][y] == 6 && game_tile == 5)) {
					this.game_state.start_lit_bomb(xdrop + x,ydrop + y,1,1);
					num_lit_++;
					this.game_state.change_tile(xdrop + x,ydrop + y, 6);	// change to fire
				}

				if (game_tile == 6 && this.tiles[x][y] == 6) {
					this.game_state.do_fire_add_effect(xdrop + x,ydrop + y);
				}

				// 6 fire
				// 5 bomb
				// check for a fire block that we may have dropped onto a bomb - check its neighbours
				if (this.tiles[x][y] == 6) {
					if (this.game_state.get_block_type(xdrop + x + 1,ydrop + y) == 5) {
						this.game_state.start_lit_bomb(xdrop + x + 1,ydrop + y,1,1);
						num_lit_++;
						this.game_state.change_tile(xdrop + x + 1,ydrop + y, 0);
					}
					if (this.game_state.get_block_type(xdrop + x - 1,ydrop + y) == 5) {
						this.game_state.start_lit_bomb(xdrop + x - 1,ydrop + y,1,1);
						num_lit_++;
						this.game_state.change_tile(xdrop + x - 1,ydrop + y, 0);
					}
					if (this.game_state.get_block_type(xdrop + x,ydrop + y + 1) == 5) {
						this.game_state.start_lit_bomb(xdrop + x,ydrop + y + 1,1,1);
						num_lit_++;
						this.game_state.change_tile(xdrop + x,ydrop + y + 1, 0);
					}
					if (this.game_state.get_block_type(xdrop + x,ydrop + y - 1) == 5) {
						this.game_state.start_lit_bomb(xdrop + x,ydrop + y - 1,1,1);
						num_lit_++;
						this.game_state.change_tile(xdrop + x,ydrop + y - 1, 0);
					}
				}
			}
		}

		// now scan the game grid
		for(var x = 0; x < this.game_state.grid_w; x++) {
			for(var y = 0; y < this.game_state.grid_h; y++) {
				// if fire:
				if (this.game_state.get_block_type(x,y) == 6) {
					// check neighbours
					if (this.game_state.get_block_type(x + 1,y) == 5) {
						this.game_state.start_lit_bomb(x + 1,y,1,1);
						num_lit_++;
						this.game_state.change_tile(x + 1,y, 0);
					}
					if (this.game_state.get_block_type(x - 1,y) == 5) {
						this.game_state.start_lit_bomb(x - 1,y,1,1);
						num_lit_++;
						this.game_state.change_tile(x - 1,y,0);
					}
					if (this.game_state.get_block_type(x ,y + 1) == 5) {
						this.game_state.start_lit_bomb(x ,y + 1,1,1);
						num_lit_++;
						this.game_state.change_tile(x ,y + 1,0);
					}
					if (this.game_state.get_block_type(x ,y - 1) == 5) {
						this.game_state.start_lit_bomb(x ,y - 1,1,1);
						num_lit_++;
						this.game_state.change_tile(x ,y - 1,0);
					}

					// check self for a lit bomb on top
					if (this.game_state.lit_bomb_grid[x][y].timer == 0) {
						this.game_state.change_tile(x ,y,0);
					}

				}
			}	
		}


		// clear
		for (var i = 0; i < 25; i++) {
			var x = i % 5;
			var y = Math.floor (i / 5);
			this.tiles[x][y] = 0;

			
		}

		// set sprites:
		for(var x = 0; x < 5; x++) {
			for(var y = 0; y < 5; y++) {
				this.block_objs[x][y].set_type(this.tiles[x][y]);
			}
		}
		
	},

	hover_x: 0,
	hover_y: 0,	

	

	player_move: function(drawx, drawy, xtile, ytile) {
		this.draw_x = drawx - this.grab_offset_x;
		this.draw_y = drawy - this.grab_offset_y;

		var change_hover = 0;

		if (this.hover_x != xtile || this.hover_y != ytile)  change_hover = 1;

		this.hover_x = xtile - this.grab_offset_x/this.game_state.tile_size;
		this.hover_y = ytile - this.grab_offset_y/this.game_state.tile_size;

		if (change_hover == 1) {

			for(var x = 0; x < 5; x++) {
				for(var y = 0; y < 5; y++) {
					if (this.tiles[x][y] == 0) {
						this.highlight_squares[x][y].hide();
						continue;
					}

					
				

					var xpos = this.hover_x + x;
					if (xpos < 0 || xpos >= this.game_state.grid_w) {
						this.highlight_squares[x][y].hide();
						continue;
					}
					xpos = xpos*this.game_state.tile_size;

					var ypos = this.hover_y + y;
					if (ypos < 0 || ypos >= this.game_state.grid_h) {
						this.highlight_squares[x][y].hide();
						continue;
					}
					ypos = ypos*this.game_state.tile_size;
					
					

					var red_ = 0;
					var game_tile = this.game_state.get_block_type(this.hover_x + x, this.hover_y + y);
					if (game_tile == 1 || game_tile == 2 || game_tile == 3 || game_tile == 4 || game_tile == 7 || game_tile == 8 || game_tile == 9) red_ = 1;
					else if (game_tile == 5 && this.tiles[x][y] == 5) red_ = 1;

					if (red_ == 1) this.highlight_squares[x][y].colour = 0xFF5A4E;
					else this.highlight_squares[x][y].colour = 0xffffff;

					this.highlight_squares[x][y].update_pos(xpos , ypos , this.game_state.tile_size - 8, this.game_state.tile_size -8);

					
				} // for y
			} // for x

		}	// if if (change_hover == 1)
	},

	check_match :function (xdrop, ydrop) {

		if (xdrop < 0 || ydrop < 0) return -1;

		// check for fit:
		for(var x = 0; x < 5; x++) {
			for(var y = 0; y < 5; y++) {
				if(this.tiles[x][y] == 0) continue;	// fine
				if(xdrop + x >= this.game_state.grid_w || ydrop + y >= this.game_state.grid_h)	return -1;	// out of bounds

				// Tutorial
				if (this.tut_mode == 1 && this.game_state.tut_no_grid[xdrop + x][ydrop + y] == 1) return -1;


				if(this.game_state.tiles[xdrop + x][ydrop + y] == -1) continue;	// fine					

				// 6 is fire, 5 is bomb	
				if (this.tiles[x][y] == 6 && 
				   (this.game_state.get_block_type(xdrop + x ,ydrop +y) == 6 ||
				    this.game_state.get_block_type(xdrop + x ,ydrop +y) == 5)) continue;

				if (this.tiles[x][y] == 5 && 
				    this.game_state.get_block_type(xdrop + x ,ydrop +y) == 6) continue;

				// fire or bomb can be squished with a block
				if ((this.game_state.get_block_type(xdrop + x ,ydrop +y) == 5 ||
					this.game_state.get_block_type(xdrop + x ,ydrop +y) == 6 ) &&
				    (this.tiles[x][y] == 1 || this.tiles[x][y] == 2 || 
				     this.tiles[x][y] == 3 || this.tiles[x][y] == 4 || this.tiles[x][y] == 7 || this.tiles[x][y] == 8|| this.tiles[x][y] == 9)) continue;

				return -1;
			}
		}

		return 1;
		
	},

	player_control: false,

	effect_timer: 0,

	draw: function () {

		

		if (this.effect_timer <= 0) this.effect_timer = 60;
		this.effect_timer--;

		if (this.wait_timer > 0) this.wait_timer--;

		if (this.player_control == false && this.wait_timer <= 0) {
			this.draw_x = this.draw_x + (this.x_anchor - this.draw_x)*0.1;
			this.draw_y = this.draw_y + (this.y_anchor - this.draw_y)*0.1;
		} else {
			

		}

		

		for(var x = 0; x < 5; x++) {
			for(var y = 0; y < 5; y++) {
				this.block_objs[x][y].set_position_screen(this.draw_x + x*this.game_state.tile_size ,
								   	  this.draw_y + y*this.game_state.tile_size);
	
				
				//if (this.effect_timer <= 0) this.block_objs[x][y].draw();
			}
		}
	},

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





