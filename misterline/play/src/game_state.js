// http://gamedevgeek.com/tutorials/managing-game-states-in-c/




GameStateClass = Class.extend({

	

	init: function(){
		
	},

  	cleanup: function(){},

  	pause: function(){},
  	resume: function(){},

	screen_resized: function(){},

	

	add_button: function(sprite, callback) {

	},

  	handle_events: function(engine,x,y, event_type){

		if (event_type == Types.Events.WHEEL) {
				
			this.handle_wheel(); 
			
		}

		if (event_type == Types.Events.MOUSE_CLICK_RIGHT) {
			
			this.handle_right_click(engine, x,y);
			
			//if (g_hold_to_flag == false && g_click_to_dig == true) this.handle_right_click(engine, x,y);
			//else this.handle_mouse_up(engine,x,y);

			return;
		}

		if (event_type == Types.Events.MOUSE_CLICK || event_type == Types.Events.MOUSE_UP) {
	
			this.handle_click(engine,x,y,event_type);
		} else if (event_type == Types.Events.MOUSE_MOVE) {
			this.handle_mouse_move(engine,x,y);
		} else if (event_type == Types.Events.KEY_DOWN) {
			this.handle_key(Types.Events.KEY_DOWN);
		} else if (event_type == Types.Events.KEY_LEFT) {
			this.handle_key(Types.Events.KEY_LEFT);
		} else if (event_type == Types.Events.KEY_UP) {
			this.handle_key(Types.Events.KEY_UP);
		} else if (event_type == Types.Events.KEY_RIGHT) {
			this.handle_key(Types.Events.KEY_RIGHT);
		} else if (event_type == Types.Events.KEY_SPACEBAR) {
			this.handle_key(Types.Events.KEY_SPACEBAR);
		} else if (event_type == Types.Events.KEY_RELEASE) {
			
			this.handle_key_release();
		} else {
			
		}

		if(event_type == Types.Events.MOUSE_DOWN) {
			
			this.handle_mouse_down(engine,x,y);
		}

		if(event_type == Types.Events.MOUSE_UP) {
			
			this.handle_mouse_up(engine,x,y);
		}

	

		if (event_type == Types.Events.LEFT_MOUSE_DOWN) this.handle_left_mouse(engine,x,y);
		if (event_type == Types.Events.RIGHT_MOUSE_DOWN) this.handle_right_mouse(engine,x,y);
	},

	handle_key:function(keynum){},
	handle_key_release:function(keynum){},
	handle_click: function(engine,x,y,event_type){},
	handle_right_click: function(engine,x,y,event_type){},
	handle_mouse_down: function(engine,x,y){},
	handle_mouse_up: function(engine,x,y){},
	handle_mouse_move: function(engine,x,y){},
	handle_left_mouse: function(engine,x,y){},
	handle_right_mouse: function(engine,x,y){},

	handle_wheel: function(){},

  	update: function(engine){},
  	draw: function(engine){},
	

	change_state: function(engine, state) {
		engine.change_state(state);
		
	},

	push_state: function(engine, state) {
		engine.push_state(state);
	},

	kill: function(engine) {
		engine.pop_state();
	}

});



// Introduced for coolmath API, but will likely be general:
g_zblip_on_start_level = function (lvl) {
	if (on_coolmath == false) return;

	// parent.cmgGameEvent is a coolmath API function
	if (parent.cmgGameEvent == null) return;

	parent.cmgGameEvent("start", lvl.toString());
};

g_zblip_on_replay_level = function (lvl) {
	if (on_coolmath == false) return;

	// parent.cmgGameEvent is a coolmath API function
	if (parent.cmgGameEvent == null) return;

	parent.cmgGameEvent("replay", lvl.toString());
};

g_zblip_on_play_button = function () {
	if (on_coolmath == false) return;

	// parent.cmgGameEvent is a coolmath API function
	if (parent.cmgGameEvent == null) return;

	parent.cmgGameEvent("start");
};


unlock_all_levels = function () {
	
	// but i'm starting with all levels unlocked anyway so this isn't needed
	for (var w = 0; w < g_level_progress_world.length; w++) {
			
		g_level_progress_world[w] = 100;
	}
};


PlayStateClass = GameStateClass.extend({
	

	engine: null,

	tiles: [],	// holds indexes to this.blocks
	grid_w: 10,
	grid_h: 10,
	current_grid_w: 10,
	current_grid_h: 10,
	tile_size: 40,
	blocks: [],	// 1D array of BlockClass objects

	

	backup_level: [],	// backup before testing level for level editor

	num_join_groups: 0,

	current_level: 0,
	current_world: 0,

	info_obj: null,
	
	tut_cursor: null,

	game_mode: 0,	// what to do on victory or lose
			
	


	won_or_lost: false,	// for checking state on making a new level, did we just finish an old level?

	

	item_inventory: null,

	bg_dots: [],
	bg_dot_alpha: [],
	bg_dots_fade_in: [],
	bg_dots_enabled: false,

	tile_style: 0,

	mrline_head_x: 0,
	mrline_head_y: 0,

	cursor_sprite: null,
	show_cursor: true,

	hint_points: 5,

	init: function(engine){

		if (g_servermode == true) {
			//this.grid_w = 20;
			//this.grid_h = 20;
		}

		if (g_sound_on == true) {
			playSoundInstance('assets/coin1.wav',0.0);	
			playSoundInstance('assets/step1.wav',0.0);
			playSoundInstance('assets/step2.wav',0.0);
			playSoundInstance('assets/step3.wav',0.0);
			playSoundInstance('assets/step4.wav',0.0);
			playSoundInstance('assets/back1.wav',0.0);
			playSoundInstance('assets/back2.wav',0.0);
			playSoundInstance('assets/back3.wav',0.0);
			playSoundInstance('assets/onwin.wav',0.0);
			playSoundInstance('assets/qn1.wav',0.0);
			playSoundInstance('assets/qn2.wav',0.0);
		}
		this.engine = engine;

		if(screen_width < screen_height) {
			//this.tile_size = screen_width/this.map_w;
		} else {
			//this.tile_size = Math.min(screen_height/this.map_h,64*this.map_h);
		}


		for(var i = 0; i < this.grid_w; i++) {
			this.tiles[i] = new Array(this.grid_h);

			this.backup_level[i] = new Array(this.grid_h);

		}

		for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {
				this.tiles[x][y] = -1; // empty
			}
		}

		

		

		for(var g = 0; g < this.grid_w*this.grid_h; g++) {
			var new_gem = new TileClass(this);
			new_gem.index = g;
	
			this.blocks.push(new_gem);
		}

	
		

		for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {
				this.change_tile(x,y,0);
			}
		}

		for(var g = 0; g < this.grid_w*this.grid_h; g++) {
			this.blocks[g].block_sprite.hide();
		}
		
		

		
		this.draw_background();

		this.info_obj = new InfoClass(this);


		this.screen_resized();

		
		this.item_inventory = new InventoryClass(this);

		for (var i = 0; i < 45; i++) {
			
			this.bg_dots[i] = new SpriteClass();
			this.bg_dots[i].setup_sprite("bgdot1.png", Types.Layer.TILE_BG);
			var x = Math.round(Math.random()*20) - 5;
			x = x*this.tile_size + 0.5*this.tile_size;
			var y = Math.round(Math.random()*20) - 5;
			y = y*this.tile_size + 0.5*this.tile_size;
			this.bg_dots[i].update_pos(x,y);
			this.bg_dots[i].make_vis();
			this.bg_dot_alpha[i] = Math.random();
			this.bg_dots_fade_in[i] = false;
		}
		
		setup_eye_sprites();

		if (g_solver_class) g_solver_class.setup(this);
		if (g_solver_class) g_generator_class.setup(this, g_solver_class);

		this.cursor_sprite = new SpriteClass();
		this.cursor_sprite.setup_sprite("select.png", Types.Layer.HUD);
		this.cursor_sprite.hide();
		
	},

	
	dots_timer : 0,
	update_bg_dots : function () {
		if (this.bg_dots_enabled == false) return;
		//if (Math.random() < 0.25) return;
		this.dots_timer++;
		if (this.dots_timer >= this.bg_dots.length) this.dots_timer = 0;
		
		this.bg_dot_alpha[this.dots_timer] -= 0.025;
		if (this.dots_timer < 10) this.bg_dot_alpha[this.dots_timer] -= 0.025;
		if (this.bg_dot_alpha[this.dots_timer] < 0.0) {
			this.bg_dot_alpha[this.dots_timer] = 1.0;
			

			if (this.bg_dots_fade_in[this.dots_timer] == false) {
				x = -10 + Math.round(Math.random()*30);
				if (screen_width < screen_height) x = -5 + Math.round(Math.random()*20);
				//x = x*this.tile_size + 0.5*this.tile_size;
				var y = -1; //Math.abs(Math.round((gaussian_rand() - 0.5)*16)) - 1 + Math.round((gaussian_rand())*6);;
				//y = y*this.tile_size + 0.5*this.tile_size;
				for (var r = 0; r < 12; r++) {
					if (Math.random() < 0.8) y++;
					else break;
				}
				
				var loops_ = 0;
				while (loops_ < 3 && this.is_in_level(x,y) &&
			    	    this.blocks[this.tiles[x][y]].block_type != GameTypes.Tiles.ABYSS) {
					loops_++;
					//x = Math.round(Math.random()*18) - 6;
					x = -10 + Math.round(Math.random()*30);
					//y = Math.abs(Math.round((gaussian_rand() - 0.5)*16)) - 1;
					

				}

				////console.log("bg dot > x: " + x + " y: " + y);	

				x = x*this.tile_size + 0.5*this.tile_size;
				y = y*this.tile_size + 0.5*this.tile_size;

				
				
				//this.bg_dots[this.dots_timer].set_texture("bgdot1.png");

				this.bg_dots[this.dots_timer].update_pos(x,y);
				this.bg_dots_fade_in[this.dots_timer] = true;
			} else this.bg_dots_fade_in[this.dots_timer] = false;

		}
		if (this.bg_dots_fade_in[this.dots_timer] == false) {
			this.bg_dots[this.dots_timer].set_alpha((this.bg_dot_alpha[this.dots_timer])*0.75);
		} else {
			this.bg_dots[this.dots_timer].set_alpha((1 - this.bg_dot_alpha[this.dots_timer])*0.75);
		}
		
		 
	},

	show_thud_effect : function (xtile, ytile) {
		
	},
	
	show_hint_for : function (hinttype) {
		return;
		this.info_obj.set_hint_type(hinttype);
		this.info_obj.hidden = false;
		this.info_obj.draw_once();
	},

	clear_hint : function () {
		if (this.info_obj.hidden == true) return;
		this.info_obj.hidden = true;
		this.info_obj.draw_once();
	},

	// never called:
	set_level_size : function (size_x, size_y) {
		this.level_w = size_x;
		this.level_h = size_y;
		for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {
				//this.blocks[this.tiles[x][y]].make_vis();
				if (x < size_x && y < size_y) continue;
				this.change_tile(x, y, 1);
				this.change_tile(x, y, 0);
				
				//this.blocks[this.tiles[x][y]].hide();
							
			}
		}

		

		g_level_size = Math.max(size_x, size_y);
		//alert(g_level_size);
		do_resize();
	},

	set_vis_level_size : function (size_x, size_y) {
	
		g_pixi_tilegrid_w = size_x + 1;
		g_pixi_tilegrid_h = size_y + 1;
		g_tilegrid_changed = true;
		

		g_level_size = Math.max(size_x, size_y);
		g_level_w = size_x;
		g_level_h = size_y;
		//alert(g_level_size);
		do_resize();
	},

	resize_force_zoom : function () {
		g_pixi_tilegrid_w =  1;
		g_pixi_tilegrid_h =  1;
		g_tilegrid_changed = true;

		g_top_nono_size = 0;
		g_left_nono_size = 0;
		g_level_size = 1; g_level_w = 1;
		g_level_h = 1;
		
		//if (screen_width < screen_height) 
		g_level_size = 5;
		g_level_w = 5;//this.longest_left_nono;
		g_level_h = 5;//this.longest_top_nono;

		//g_level_w = Math.max(g_level_w, 7);
		//g_level_h = Math.max(g_level_h, 7);

		//alert('resize' + (this.level_w - this.level_h));

		do_resize();

	},

	resize: function() {
		g_pixi_tilegrid_w = this.tile_size*this.level_w + 1;
		g_pixi_tilegrid_h = this.tile_size*this.level_h + 1;
		g_tilegrid_changed = true;



		
		//if (screen_width < screen_height) 
		g_level_size = Math.max(this.level_w + this.longest_nono, 7);
		g_level_w = this.level_w + g_left_nono_size;//this.longest_left_nono;
		g_level_h = this.level_h + g_top_nono_size;//this.longest_top_nono;

	

		//g_level_w = Math.max(g_level_w, 7);
		//g_level_h = Math.max(g_level_h, 7);

		//alert('resize' + (this.level_w - this.level_h));

		do_resize();

		this.item_inventory.update_pos(0, (this.level_h + 1)*this.tile_size);
	},

	

	reset: function() {

	
		
		

		for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {


				this.change_tile(x,y,0);

				
				this.blocks[this.tiles[x][y]].reset();

				

				

			}
		}


	},

	
	
	

	
	
	

	backup_level: function () {
		// this.backup_level

		for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {
				this.backup_level[x][y] = this.get_tile_code(x,y);
			}
		}
	},

	restore_backup: function () {
		for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {
				this.set_tile_from_code(x,y, this.backup_level[x][y]);
				
				if (this.get_block_type(x,y) == 0 && 
				    this.blocks[this.tiles[x][y]].preset_hint_type != 0 &&
				    this.blocks[this.tiles[x][y]].covered_up == false) {
					// how to show hint
					//this.blocks[this.tiles[x][y]].show_hint(this.blocks[this.tiles[x][y]].preset_hint_type);
					//this.blocks[this.tiles[x][y]].cover();
					//this.blocks[this.tiles[x][y]].uncover();
					

				} else if (this.get_block_type(x,y) == 0 && 
				    		this.blocks[this.tiles[x][y]].preset_hint_type != 0 &&
				    		this.blocks[this.tiles[x][y]].covered_up == false &&
						this.blocks[this.tiles[x][y]].editor_mode == 1) {
					// how to show hint
					//this.blocks[this.tiles[x][y]].show_hint(this.blocks[this.tiles[x][y]].preset_hint_type);
					//this.blocks[this.tiles[x][y]].cover();
					//this.blocks[this.tiles[x][y]].uncover();
					//this.blocks[this.tiles[x][y]].cover();
					

				} else if (this.get_block_type(x,y) == 2) {

					this.blocks[this.tiles[x][y]].put_flag_on();
				}
			}
		}

		// recalculate hints
		for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {
				if (this.blocks[this.tiles[x][y]].covered_up == true) {
					continue;
				}
				this.blocks[this.tiles[x][y]].cover();
				this.blocks[this.tiles[x][y]].uncover();
			}
		}

		this.calc_share_groups();
	},

	
	

	level_w: 10,
	level_h: 10,

	leveldata_index_to_grid_index : function (leveldata_i) {
		var x = leveldata_i % this.level_w;
		var y = Math.floor(leveldata_i / this.level_h);

		
		return this.tiles[x][y];
	},
	

	load_level_internal : function(p_matrix, mapdata_version_mines, p_edge_matrix) {
		
		this.reset();


		if (p_matrix == null) {

			//console.log("ERROR p_matrix == null");
			return;
		}

		var grid_start_x = 0;
		var grid_start_y = 0;

		var matrix_h = p_matrix.length;;
		var matrix_w = p_matrix[0].length;



		if (grid_start_x >= matrix_w - 1 || grid_start_y >= matrix_h - 1) {
			//console.log("ERROR   aaaa ");
			return;
		}
		this.level_h = p_matrix.length - grid_start_x;
		this.level_w = p_matrix[0].length - grid_start_y;

		if (this.level_w > this.grid_w) this.level_w = this.grid_w;
		if (this.level_h > this.grid_h) this.level_h = this.grid_h;
		
		if (mapdata_version_mines == 1) {

		for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {
				this.blocks[this.tiles[x][y]].reset();
			}
		}

		
		//console.log('this.level_h ' + this.level_h);
		//console.log('this.level_w ' + this.level_w);

		var leveldata_i = 0;	// like the block.index, but depends on size of level

		
		
		for(var y = 0; y < this.level_h; y++) {
            		for(var x = 0; x < this.level_w; x++) {
				//var floortile = p_matrix[y + 1][x + 1];

				var floortile = p_matrix[y + grid_start_y][x + grid_start_x];

				var on_pixel = false;
				

				//var hint_type = GameTypes.PixelClues.NO_CLUE;
				var block_i = this.tiles[x][y];

				this.blocks[block_i].line_type = -1;
				
				
				this.set_tile_from_tilecode(x, y, floortile);
			
				//this.blocks[block_i].calc_sprite();

				//if (on_pixel == true) this.change_tile(x,y,2);
				//else this.change_tile(x,y,0);

				if (p_edge_matrix != null) {
					var edgetile = p_edge_matrix[y + grid_start_y][x + grid_start_x];
					this.set_edge_from_tilecode(x, y, edgetile);					

				}

			
				

			}	// x
			
        	}	// y

		
		// eaach linked tile will store all of its buddies indexes: 
		//this.find_all_connected_link_tiles();

		//this.linked_areas_should_be_one_colour();

		for(var y = 0; y < this.level_h; y++) {
            		for(var x = 0; x < this.level_w; x++) {
				this.blocks[this.tiles[x][y]].calc_lockout_group();
				this.blocks[this.tiles[x][y]].calc_lockout_onexit_group();
				this.blocks[this.tiles[x][y]].calc_bubble_group();
				this.blocks[this.tiles[x][y]].find_other_q_cats_in_level();
				this.blocks[this.tiles[x][y]].calc_lockout_multi_group();
			}
		}



		} // if (JSON.mapdata_version_mines == 1)
	},

	enum_to_tilecode : function (floortile) {
		if (floortile == GameTypes.Tiles.EMPTY) return 0;
		if (floortile == GameTypes.Tiles.SOLID) return 1;
		if (floortile == GameTypes.Tiles.ABYSS) return 12;
		if (floortile == GameTypes.Tiles.LINE_START_A) return 2;
		if (floortile == GameTypes.Tiles.TURN_DIAMOND) return 6;
		if (floortile == GameTypes.Tiles.GEMFINITE_A) return 7;
		if (floortile == GameTypes.Tiles.GEMFINITE_B) return 8;
		if (floortile == GameTypes.Tiles.GEMFINITE_C) return 9;
		if (floortile == GameTypes.Tiles.LINE_START_B) return 10;
		if (floortile == GameTypes.Tiles.LINE_START_C) return 25;
		if (floortile == GameTypes.Tiles.LOCKOUT) return 11;
		if (floortile == GameTypes.Tiles.LOCKOUT_LOCKED) return 11;
		if (floortile == GameTypes.Tiles.EMPTY) return 0;
		if (floortile == GameTypes.Tiles.RED_KEY) return 13;
		if (floortile == GameTypes.Tiles.BLUE_KEY) return 16;
		if (floortile == GameTypes.Tiles.GREEN_KEY) return 19;
		if (floortile == GameTypes.Tiles.MUST_END_ANY) return 24;
		if (floortile == GameTypes.Tiles.RED_HOOP) return 23;
		if (floortile == GameTypes.Tiles.BLUE_HOOP) return 22;
		if (floortile == GameTypes.Tiles.CAGE_TWO) return 26;
		if (floortile == GameTypes.Tiles.BLUE_THREE) return 27;
		if (floortile == GameTypes.Tiles.BRIDGE) return 28;
		if (floortile == GameTypes.Tiles.UNNEEDED) return 29;

		if (floortile == GameTypes.Tiles.RAIL_R) return 30;
		if (floortile == GameTypes.Tiles.RAIL_L) return 32;
		if (floortile == GameTypes.Tiles.RAIL_D) return 31;
		if (floortile == GameTypes.Tiles.RAIL_U) return 33;
		if (floortile == GameTypes.Tiles.RAIL_H) return 34;
		if (floortile == GameTypes.Tiles.RAIL_V) return 39;
		if (floortile == GameTypes.Tiles.RAIL_RD) return 36;
		if (floortile == GameTypes.Tiles.RAIL_UR) return 35;
		if (floortile == GameTypes.Tiles.RAIL_DL) return 37;
		if (floortile == GameTypes.Tiles.RAIL_LU) return 38;
		
		if (floortile == GameTypes.Tiles.BUBBLE) return 40;
		if (floortile == GameTypes.Tiles.LOCKOUT_ONEXIT) return 41;

		if (floortile == GameTypes.Tiles.LOCKOUT_MULTI_TWO) return 42;
		if (floortile == GameTypes.Tiles.LOCKOUT_MULTI_THREE) return 43;
		if (floortile == GameTypes.Tiles.LOCKOUT_MULTI_FOUR) return 44;

		if (floortile == GameTypes.Tiles.QCAT_BLUE) return 45;
		if (floortile == GameTypes.Tiles.QCAT_RED) return 46;
		if (floortile == GameTypes.Tiles.QCAT_GREEN) return 47;

		if (floortile == GameTypes.Tiles.WALL_RIGHT) return 4;
		if (floortile == GameTypes.Tiles.WALL_DOWN) return 3;
		if (floortile == GameTypes.Tiles.REDDOOR_RIGHT) return 15;
		if (floortile == GameTypes.Tiles.REDDOOR_DOWN) return 14;

		if (floortile == GameTypes.Tiles.LINE_START_A_POSSIBLE) return 58;
		if (floortile == GameTypes.Tiles.STRAIGHTER) return 59;
		return -1;
	},

	get_tilecode : function (x, y) {
		if (this.is_in_level(x, y) == false) return GameTypes.Tiles.NO_TILE;
		var floortile = this.blocks[this.tiles[x][y]].get_type();

		return this.enum_to_tilecode(floortile);

		
	},

	

	set_tile_from_tilecode : function (x, y, floortile) {
		var block_i = this.get_block_index(x, y);
		if (floortile == 1) {
					this.blocks[block_i].set_type(GameTypes.Tiles.SOLID);
		} else if (floortile == 38) {
					this.blocks[block_i].set_type(GameTypes.Tiles.RAIL_LU);
					
		}else if (floortile == 37) {
					this.blocks[block_i].set_type(GameTypes.Tiles.RAIL_DL);
					
		}else if (floortile == 35) {
					this.blocks[block_i].set_type(GameTypes.Tiles.RAIL_UR);
					
		}else if (floortile == 36) {
					this.blocks[block_i].set_type(GameTypes.Tiles.RAIL_RD);
					
		}else if (floortile == 39) {
					this.blocks[block_i].set_type(GameTypes.Tiles.RAIL_V);
					
		}else if (floortile == 34) {
					this.blocks[block_i].set_type(GameTypes.Tiles.RAIL_H);
					
		}else if (floortile == 33) {
					this.blocks[block_i].set_type(GameTypes.Tiles.RAIL_U);
					
		}else if (floortile == 31) {
					this.blocks[block_i].set_type(GameTypes.Tiles.RAIL_D);
					
		}else if (floortile == 32) {
					this.blocks[block_i].set_type(GameTypes.Tiles.RAIL_L);
					
		}else if (floortile == 30) {
					this.blocks[block_i].set_type(GameTypes.Tiles.RAIL_R);
					
		} else if (floortile == 40) {
					this.blocks[block_i].set_type(GameTypes.Tiles.BUBBLE);
					
		} else if (floortile == 41) {
					this.blocks[block_i].set_type(GameTypes.Tiles.LOCKOUT_ONEXIT);
					
		} else if (floortile == 42) {
					this.blocks[block_i].set_type(GameTypes.Tiles.LOCKOUT_MULTI_TWO);
					this.blocks[block_i].tile_extra_number = 2;
					
		} else if (floortile == 43) {
					this.blocks[block_i].set_type(GameTypes.Tiles.LOCKOUT_MULTI_THREE);
					this.blocks[block_i].tile_extra_number = 3;
					
		} else if (floortile == 44) {
					this.blocks[block_i].set_type(GameTypes.Tiles.LOCKOUT_MULTI_FOUR);
					this.blocks[block_i].tile_extra_number = 4;
					
		} else if (floortile == 45) {
					this.blocks[block_i].set_type(GameTypes.Tiles.QCAT_BLUE);
					
					
		} else if (floortile == 46) {
					this.blocks[block_i].set_type(GameTypes.Tiles.QCAT_RED);
					
					
		} else if (floortile == 47) {
					this.blocks[block_i].set_type(GameTypes.Tiles.QCAT_GREEN);
					
					
		} else if (floortile == 12) {
					this.blocks[block_i].set_type(GameTypes.Tiles.ABYSS);
					
		} else if (floortile == 2) {
					this.blocks[block_i].set_type(GameTypes.Tiles.LINE_START_A);
					this.blocks[block_i].line_type = 1;
		} else if (floortile == 58) {
					this.blocks[block_i].set_type(GameTypes.Tiles.LINE_START_A_POSSIBLE);
					//this.blocks[block_i].line_type = 1;
		} else if (floortile == 59) {
					this.blocks[block_i].set_type(GameTypes.Tiles.STRAIGHTER);
					//this.blocks[block_i].line_type = 1;
		} else if (floortile == 6) {
					this.blocks[block_i].set_type(GameTypes.Tiles.TURN_DIAMOND);
		} else if (floortile == 7) {
					this.blocks[block_i].set_type(GameTypes.Tiles.GEMFINITE_A);
		} else if (floortile == 8) {
					this.blocks[block_i].set_type(GameTypes.Tiles.GEMFINITE_B);
		} else if (floortile == 9) {
					this.blocks[block_i].set_type(GameTypes.Tiles.GEMFINITE_C);
		} else if (floortile == 10) {
					this.blocks[block_i].set_type(GameTypes.Tiles.LINE_START_B);
					this.blocks[block_i].line_type = 2;
		} else if (floortile == 25) {
					this.blocks[block_i].set_type(GameTypes.Tiles.LINE_START_C);
					this.blocks[block_i].line_type = 3;
		} else if (floortile == 11) {
					this.blocks[block_i].set_type(GameTypes.Tiles.LOCKOUT);
					
		} else if (floortile == 0){
					this.blocks[block_i].set_type(GameTypes.Tiles.EMPTY);
		} else if (floortile == 13){
					this.blocks[block_i].set_type(GameTypes.Tiles.RED_KEY);
		} else if (floortile == 16){
					this.blocks[block_i].set_type(GameTypes.Tiles.BLUE_KEY);
		} else if (floortile == 19){
					this.blocks[block_i].set_type(GameTypes.Tiles.GREEN_KEY);
		} else if (floortile == 15){
					this.blocks[block_i].set_edge_type_in_level(x, y, x +1, y, 										GameTypes.Edges.RED_LOCKED_DOOR);
					this.blocks[block_i].set_type(GameTypes.Tiles.EMPTY);
		} else if (floortile == 14){
					this.blocks[block_i].set_edge_type_in_level(x, y, x, y + 1, 										GameTypes.Edges.RED_LOCKED_DOOR);
					this.blocks[block_i].set_type(GameTypes.Tiles.EMPTY);
		} else if (floortile == 4) {
					// left
					this.blocks[block_i].set_edge_type_in_level(x, y, x +1, y, 										GameTypes.Edges.WALL);
					this.blocks[block_i].set_type(GameTypes.Tiles.EMPTY);
		} else if  (floortile == 3) {
					// d
					this.blocks[block_i].set_edge_type_in_level(x, y, x, y + 1, 										GameTypes.Edges.WALL);
					this.blocks[block_i].set_type(GameTypes.Tiles.EMPTY);
		} else if  (floortile == 5) {
					// d l
					this.blocks[block_i].set_edge_type_in_level(x, y, x + 1, y, 										GameTypes.Edges.WALL);
					this.blocks[block_i].set_edge_type_in_level(x, y, x, y + 1, 										GameTypes.Edges.WALL);
					this.blocks[block_i].set_type(GameTypes.Tiles.EMPTY);
		} else if (floortile == 18){
					this.blocks[block_i].set_edge_type_in_level(x, y, x +1, y, 										GameTypes.Edges.BLUE_LOCKED_DOOR);
					this.blocks[block_i].set_type(GameTypes.Tiles.EMPTY);
		} else if (floortile == 17){
					this.blocks[block_i].set_edge_type_in_level(x, y, x, y + 1, 										GameTypes.Edges.BLUE_LOCKED_DOOR);
					this.blocks[block_i].set_type(GameTypes.Tiles.EMPTY);
		} else if (floortile == 21){
					this.blocks[block_i].set_edge_type_in_level(x, y, x +1, y, 										GameTypes.Edges.GREEN_LOCKED_DOOR);
					this.blocks[block_i].set_type(GameTypes.Tiles.EMPTY);
		} else if (floortile == 20){
					this.blocks[block_i].set_edge_type_in_level(x, y, x, y + 1, 										GameTypes.Edges.GREEN_LOCKED_DOOR);
					this.blocks[block_i].set_type(GameTypes.Tiles.EMPTY);
		} else if (floortile == 22){
					this.blocks[block_i].set_type(GameTypes.Tiles.BLUE_HOOP);
		} else if (floortile == 23){
					this.blocks[block_i].set_type(GameTypes.Tiles.RED_HOOP);
		}  else if (floortile == 24){
					this.blocks[block_i].set_type(GameTypes.Tiles.MUST_END_ANY);
		}  else if (floortile == 26){
					this.blocks[block_i].set_type(GameTypes.Tiles.CAGE_TWO);
		} else if (floortile == 27){
					this.blocks[block_i].set_type(GameTypes.Tiles.CAGE_THREE);
		} else if (floortile == 28){
					this.blocks[block_i].set_type(GameTypes.Tiles.BRIDGE);
		} else if (floortile == 29){
					this.blocks[block_i].set_type(GameTypes.Tiles.UNNEEDED);
		}else {
			
		}
	},

	

	get_edgecode : function (x, y) {
		var block_i = this.get_block_index(x, y);
		var edge_right = this.blocks[block_i].get_edge_type_in_level(x, y, x + 1, y);
		var edge_down = this.blocks[block_i].get_edge_type_in_level(x, y, x, y + 1);

		//if (edge_right == GameTypes.Edges.EMPTY)

		if (edge_right == GameTypes.Edges.WALL &&
		    edge_down == GameTypes.Edges.WALL) return 5;
		
		if (edge_right == GameTypes.Edges.WALL &&
		    edge_down == GameTypes.Edges.EMPTY) return 4;

		if (edge_right == GameTypes.Edges.EMPTY &&
		    edge_down == GameTypes.Edges.WALL ) return 3;
		
		if (edge_right == GameTypes.Edges.RED_LOCKED_DOOR &&
		    edge_down == GameTypes.Edges.EMPTY) return 15;
		if (edge_right == GameTypes.Edges.EMPTY &&
		    edge_down == GameTypes.Edges.RED_LOCKED_DOOR) return 14;

		if (edge_right == GameTypes.Edges.BLUE_LOCKED_DOOR &&
		    edge_down == GameTypes.Edges.EMPTY) return 18;
		if (edge_right == GameTypes.Edges.EMPTY &&
		    edge_down == GameTypes.Edges.BLUE_LOCKED_DOOR) return 17;

		if (edge_right == GameTypes.Edges.GREEN_LOCKED_DOOR &&
		    edge_down == GameTypes.Edges.EMPTY) return 21;
		if (edge_right == GameTypes.Edges.EMPTY &&
		    edge_down == GameTypes.Edges.GREEN_LOCKED_DOOR) return 20;

		if (edge_right == GameTypes.Edges.EMPTY &&
		    edge_down == GameTypes.Edges.EMPTY) return 0;

		//console.log("ERROR - unknown edge combo");

		return -1;
	},

	set_edge_from_tilecode : function (x, y, edgetile) {
		var block_i = this.get_block_index(x, y);
	
		if (edgetile == 4) {
						// left
						this.blocks[block_i].set_edge_type_in_level(x, y, x +1, y, 								GameTypes.Edges.WALL);
					} else if  (edgetile == 3) {
						// d
						this.blocks[block_i].set_edge_type_in_level(x, y, x, y + 1, 								GameTypes.Edges.WALL);
					}   else if  (edgetile == 5) {
						// d l
						this.blocks[block_i].set_edge_type_in_level(x, y, x + 1, y, 								GameTypes.Edges.WALL);
						this.blocks[block_i].set_edge_type_in_level(x, y, x, y + 1, 								GameTypes.Edges.WALL);
					} else if  (edgetile == 15) {
						// d
						this.blocks[block_i].set_edge_type_in_level(x, y, x + 1, y, 								GameTypes.Edges.RED_LOCKED_DOOR);
					} else if  (edgetile == 14) {
						// d
						this.blocks[block_i].set_edge_type_in_level(x, y, x, y + 1, 								GameTypes.Edges.RED_LOCKED_DOOR);
					} else if  (edgetile == 18) {
						// d
						this.blocks[block_i].set_edge_type_in_level(x, y, x + 1, y, 								GameTypes.Edges.BLUE_LOCKED_DOOR);
					} else if  (edgetile == 17) {
						// d
						this.blocks[block_i].set_edge_type_in_level(x, y, x, y + 1, 								GameTypes.Edges.BLUE_LOCKED_DOOR);
					} else if  (edgetile == 21) {
						// d
						this.blocks[block_i].set_edge_type_in_level(x, y, x + 1, y, 								GameTypes.Edges.GREEN_LOCKED_DOOR);
					} else if  (edgetile == 20) {
						// d
						this.blocks[block_i].set_edge_type_in_level(x, y, x, y + 1, 								GameTypes.Edges.GREEN_LOCKED_DOOR);
					}
	},


	set_tile : function (x, y, tile) {
		if (this.is_in_level(x, y) == false) return;
		this.blocks[this.tiles[x][y]].set_type(tile);
	},

	set_edge : function (xa, ya, xb, ya, edge) {
		this.blocks[0].set_edge_type_in_level(xa, ya, xb, yb, edge);
	},

	reset_flowfill : function () {
		for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {
				this.blocks[this.tiles[x][y]].flowfill_seen = false;
			}
		}
	},

	load_tut_level : function (tutlevel, mapdata_version) {
		//console.log("load_tut-level");
		if (g_tut_content[tutlevel] == null) {

			//console.log("ERROR - g_tut_content[tutlevel] == null");
			return;
		}

		var p_matrix = g_tut_content[tutlevel].level;
		var p_edge = null;
		if (g_tut_content[tutlevel].edge == null) {

			//p_edge = [];
			
		}
		this.load_level_internal(p_matrix, mapdata_version, p_edge);
	},

	
	load_level : function (levelnum, mapdata_version) {
		// g_all_world_data_floor[this.play_state.current_world][levelnum]
		if (g_all_world_data_floor[this.current_world][levelnum] == null) {

			
			return;
		}
		var p_matrix = g_all_world_data_floor[this.current_world][levelnum];
		var p_edge = null;
		if (g_all_world_data_edge[this.current_world][levelnum] != null &&
		    g_all_world_data_edge[this.current_world][levelnum].length != 0 &&
		    g_all_world_data_edge[this.current_world][levelnum].length == p_matrix.length) {
			p_edge = g_all_world_data_edge[this.current_world][levelnum];
		}

		this.load_level_internal(p_matrix, mapdata_version, p_edge);
	},

	get_totalcount_tiletype : function (tiletype) {
		if (this.total_tiletypes_count[tiletype] == null) {
			return 0;
		} else {
			return this.total_tiletypes_count[tiletype];
		}
	},

	total_tiletypes_count: {},

	tally_tiletypes : function () {
		this.total_tiletypes_count = {};
		
		for(var y = 0; y < this.level_h; y++) {
            		for(var x = 0; x < this.level_w; x++) {
				var b = this.tiles[x][y];
				if (this.total_tiletypes_count[this.blocks[b].block_type] == null) {
					this.total_tiletypes_count[this.blocks[b].block_type] = 1;
				} else {
					this.total_tiletypes_count[this.blocks[b].block_type]++;
				}
			}
		}
	},

	please_alert_your_neighbours_of_changes : function (x, y) {
		if (this.is_in_level(x,y) == false) return;
		this.blocks[this.tiles[x][y]].please_alert_eighttouch_neighbours = true;
	},

	alert_neighbour_change : function (x, y) {
		if (this.is_in_level(x,y) == false) return 0;

		return this.blocks[this.tiles[x][y]].on_eighttouch_neighbour_change();
	},

	get_line_type : function (x, y) {
		if (this.is_in_level(x,y) == false) return 0;

		return this.blocks[this.tiles[x][y]].line_type;
	},

	inventory_signal : function (verb_, object_, lineguy_) {
		////console.log('verb_ ' + verb_ + ' object_ ' + object_ + ' lineguy_ ' + lineguy_);
		if (verb_ == GameTypes.Inventory.PICKUP) {
			//this.item_inventory.add_item(lineguy_, object);
		}

		

		this.item_inventory.receive_signal(verb_, object_, lineguy_);

		if (verb_ == GameTypes.Inventory.DROP ||
		    verb_ == GameTypes.Inventory.UNUSE) {
			this.item_inventory.hurry();
		}

		//this.item_inventory.process_signal(verb_, object_, lineguy_);
		//this.item_inventory.draw_once();
	},

	is_index_in_level: function(i) {
		if (i >= 0 && i < this.blocks.length) {
			return this.is_in_level(this.blocks[i].x, this.blocks[i].y);
			

		}
		return false;
	},

	
	is_in_level: function(x , y) {
		
		if (x < 0 || y < 0 || x >= this.level_w || y >= this.level_h) return false;
		if (x >= 0 && y >= 0 && x < this.level_w && y < this.level_h) return true;
		return false;
	},

	is_in_grid: function(x , y) {
		if (x < 0 || y < 0 || x >= this.grid_w || y >= this.grid_h) return false;
		if (x >= 0 && y >= 0 && x < this.grid_w && y < this.grid_h) return true;
		return false;
	},

	is_main_line : function (x,y) {
		if (this.is_in_level(x,y) == false) return false;
		return this.blocks[this.tiles[x][y]].is_main_line();
	},

	get_x_from_rel_index : function(r) {
		return r % this.level_w;
	},

	get_y_from_rel_index : function(r) {
		return Math.floor( r / this.level_w);
	},

	get_x_from_index : function (i) {
		if (this.is_index_in_level(i) == false) return 0;
		
		return this.blocks[i].x;
	},

	get_y_from_index : function (i) {
		if (this.is_index_in_level(i) == false) return 0;
		return this.blocks[i].y;
	},

	get_block_index : function (x, y) {
		if (x < 0 || y < 0 || x >= this.grid_w || y >= this.grid_h) return -1;
		if (x >= 0 && y >= 0 && x < this.grid_w && y < this.grid_h) return this.tiles[x][y];
		return -1;
	},

	get_block_type: function(x,y) {

		if (this.is_in_grid(x,y) == false) return -1;

		if (this.tiles[x][y] == -1) return 0;

		else return this.blocks[this.tiles[x][y]].get_type();
	},

	

	
	// num is block type
	// 0 is empty
	//
	change_tile : function (x, y, num) {

		if (x < 0 || y < 0 || x >= this.grid_w || y >= this.grid_h) {
			
			return;
		}
		
		/*
		if (num == 0 && this.tiles[x][y] != -1) {
			var b = this.tiles[x][y];

			this.blocks[b].set_position_grid(-1,-1);

			this.tiles[x][y] = -1;

			return;
		}

		if (num == 0 && this.tiles[x][y] == -1) return;

		*/

		if (this.tiles[x][y] != -1) {
			this.blocks[this.tiles[x][y]].set_type(num);
			return;
		} 

		for (var b = 0; b < this.blocks.length; b++) {
			if (this.blocks[b].x != -1) continue;
			
			this.blocks[b].set_type(num);
			this.blocks[b].set_position_grid(x,y);
			
			
			this.tiles[x][y] = b;
			return;
		}
	},

	animate_block: 0,
	animate_timer: 0,

	anim_head_move_x: 0,
	anim_head_move_y: 0,
	anim_head_move_timer: 0,
	
	update: function() { 
		
		this.item_inventory.update();

		

		
	},

	force_next_animate_block: -1,

	draw_timer: 0,

	draw: function() {

		this.update_bg_dots();

		if (this.anim_head_move_timer < 1.0 &&
		    this.is_in_level(this.anim_head_move_x, this.anim_head_move_y) == true) {

			this.anim_head_move_timer += 0.25;
			this.blocks[this.tiles[this.anim_head_move_x][this.anim_head_move_y]].line_head_anim_update(this.anim_head_move_timer);
			
			if (this.anim_head_move_timer >= 1.0) this.blocks[this.tiles[this.anim_head_move_x][this.anim_head_move_y]].line_head_anim_update(1.0);
		}

		this.animate_timer++;
		////console.log('this.animate_block ' + this.animate_block);
		var anim_ = this.blocks[this.animate_block].animation_update(this.animate_timer);

		
		if ((!anim_ && this.animate_timer > 2) || this.animate_timer > 256) {
			this.animate_timer = 0;
			if (this.force_next_animate_block != -1 &&
			    this.is_index_in_level(this.force_next_animate_block)) {
				this.animate_block = this.force_next_animate_block;
				this.force_next_animate_block = -1;
			}
			else if (Math.random() < 0.5) this.animate_block++;
			else this.animate_block = Math.floor(this.blocks.length*Math.random());			

			if (this.animate_block >= this.blocks.length) this.animate_block = 0;
			
			
		}

		if (this.draw_timer <= 0) {
			this.draw_timer = 300;

			//tile_group.cacheAsBitmap = true;
			//game_group.cacheAsBitmap = true;
			
			

		}
		this.draw_timer--;
		
		//this.on_flag_effect.draw();

		
	},


	handle_mouse_down: function(engine,x,y) {

	},

	handle_mouse_up: function(engine,x,y) {
	},

	handle_mouse_move: function(engine,x,y) {

	},



	screen_resized : function () { 

		update_webfonts();
	
		if (g_should_redraw_grid == true) {
			for(var y = 0; y < this.level_h; y++) {
            		for(var x = 0; x < this.level_w; x++) {
				var b = this.tiles[x][y];
				this.blocks[b].calc_sprite();
			}
			}

			g_should_redraw_grid = false;
		}
		
	},

	
	

	draw_rect_background: function(x,y,xx,yy,colour) {
		
		return new SquareClass(x,y,xx,yy,Types.Layer.BACKGROUND,colour,true);

		if (using_phaser == true) {

			var graphics_obj = game.add.graphics(0,0);
			background_group.add(graphics_obj);



			graphics_obj.beginFill(colour);
			graphics_obj.lineStyle(0, colour, 0);
			graphics_obj.moveTo(x,y);
    			graphics_obj.lineTo(xx, y);
    			graphics_obj.lineTo(xx,  yy);
    			graphics_obj.lineTo(x, yy);
			graphics_obj.lineTo(x, y);
			graphics_obj.endFill();
			return graphics_obj;

		} else {
			var graphics = new PIXI.Graphics();
			graphics.beginFill(0x546D6F);
			graphics.drawRect(x, y,xx, yy);
			background_group.add(graphics);
			return graphics;

		}
		
	},	

	draw_triangle_background: function (x1,y1,x2,y2,x3,y3,colour,alpha) {
		var graphics = new PIXI.Graphics();
		// begin a yellow fill..
		graphics.beginFill(colour);	//366839
		graphics.alpha = alpha;
 
		// draw a triangle using lines
		graphics.moveTo(x1,y1);
		graphics.lineTo(x2,y2);
		graphics.lineTo(x3,y3);
 
		// end the fill
		graphics.endFill();
 
		// add it the stage so we see it on our screens..
		background_group.add(graphics);
	},

	current_tiled_bg: "",

	change_tiled_bg : function (name) {
		if (using_phaser == true) return;
		if (this.current_tiled_bg == name) return;
		this.current_tiled_bg = name;

		if (g_textures[name] == null) {	
			//console.log('draw_tiled_bg > no such g_textures[' + name + ']');
			return;
		}

		g_textures[name].baseTexture.mipmap = false;

		this.bg_tilingsprite.texture = g_textures[name];
	},

	bg_tilingsprite: null,

	draw_tiled_bg : function (name) {
		if (using_phaser == true) return;

		//var texture = PIXI.Texture.fromImage('required/assets/p2.jpeg');

		
		this.current_tiled_bg = name;

		if (g_textures[name] == null) {	
			//console.log('draw_tiled_bg > no such g_textures[' + name + ']');
			return;
		}

		g_textures[name].baseTexture.mipmap = false;

		var tilingSprite = new PIXI.extras.TilingSprite(
    			g_textures[name],
    			3*screen_width,
    			3*screen_height
		);

		//console.log(tilingSprite);
		tilingSprite.visible = true;

		tilingSprite.scale.x = 2;
		tilingSprite.scale.y = 2;

		this.bg_tilingsprite = tilingSprite;

		//tilebackground_group.add(tilingSprite);

		background_group.add(tilingSprite);

		tilingSprite.position.x = - this.tile_size*Math.round(0.5*screen_width/this.tile_size);
		tilingSprite.position.y = - this.tile_size*Math.round(0.2*screen_height/this.tile_size);
		//stage.addChild(tilingSprite);
		//game_group.add(tilingSprite);
		background_group.make_vis();
		
	},

	bg_squares: [],		// linear array

	draw_background : function () {
		// Palette URL: http://paletton.com/#uid=7010Z0kjpoY9q5FenfFn1vSqcQi
		// 19241A
		// 0x0366239
		//

		// EDE1B7
		
		// this.draw_rect_background(-2000, -2000, 4000,4000, 0x1F1129);	// 1F1129  161423

		if (this.tile_style == 0) this.draw_tiled_bg("check_blue.png");
		else if (this.tile_style == 1) this.draw_tiled_bg("check_green.png");
		return;
		var size = this.tile_size*0.5;

		// 35577A
		// 2D4764
		// 2B425D

		for(var y = -1; y < this.grid_h + 4; y++) {
			continue;
            		for(var x = -4; x < this.grid_w + 4; x++) {
				//continue;
				//if (x >= 0 && x < this.grid_w && y >= 0 && y < this.grid_h) continue;
				if ((x + y) % 2 == 0) continue;
				
				var top_y = (y+0.5)*this.tile_size - size;
				var bottom_y = (y+0.5)*this.tile_size +size;
				var left_x = (x+0.5)*this.tile_size - size;
				var right_x =  (x+0.5)*this.tile_size +size;

				if (x <= -3 || x >= this.grid_w + 2 || y >= this.grid_h + 2) this.draw_rect_background(left_x, top_y, right_x, bottom_y, 0x2B425D, Types.Layer.BACKGROUND);
				else if (x == -2 || x == this.grid_w + 1 || y == this.grid_h + 1) this.draw_rect_background(left_x, top_y, right_x, bottom_y, 0x2D4764, Types.Layer.BACKGROUND);
				else this.draw_rect_background(left_x, top_y, right_x, bottom_y, 0x35577A, Types.Layer.BACKGROUND);
			}
		}

		for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {
				continue;
				var top_y = Math.max((y+0.5)*this.tile_size - size, 2);
				var bottom_y = Math.min((y+0.5)*this.tile_size +size, this.tile_size*this.grid_h - 2);
				var left_x = Math.max((x+0.5)*this.tile_size - size, 2);
				var right_x =  Math.min((x+0.5)*this.tile_size +size, this.tile_size*this.grid_w - 2);
				var sq_;
				if ((x + y) % 2 == 0) sq_ = this.draw_rect_background(left_x, 
										top_y, right_x, 
										bottom_y, 0x000000, Types.Layer.BACKGROUND);
				else sq_ = this.draw_rect_background(left_x, 
										top_y, right_x, 
										bottom_y, 0x000000, Types.Layer.BACKGROUND);

				this.bg_squares.push(sq_);
				//sq_.hide();
			}
		}

		
		
		

		
	},
	
	hide_bg_squares : function () {

		

	}
});



RestartGameStateClass = GameStateClass.extend({

	play_state: null,
	engine: null,

	timer: 30,

	x_pos: 0,

	bg_alpha: 1,

	init: function(engine, play_state){
		this.play_state = play_state;
		this.engine = engine;

		//play_screen_container.make_vis();//;
		play_screen_container.hide();//;
		
		this.x_pos = 0;
		

		// look ahead and load a new batch of levels if needed
		if (this.play_state.game_mode == 0 && 
		    this.play_state.current_level < g_level_totalnum_world[this.play_state.current_world] - 1) {
			// is the this.play_state.current_level + 1 level loaded?
			if (g_all_world_data_floor[this.play_state.current_world][this.play_state.current_level + 1] == null) {
				var first_in_file = Math.floor((this.play_state.current_level + 1) / 10)*10;
				var last_in_file = first_in_file + 9;
				var file_n = 'levels/'+this.play_state.current_world+'/level' + first_in_file.toString() + 'to' + last_in_file + '.json';
				load_level_from_file(file_n,function() {});

			}
		}

		//if (g_cache_as_bitmap == true)	game_group.cache_as_bitmap(true);
		
		tile_group.cache_as_bitmap(false);// false;
		game_group.cache_as_bitmap(false);// false;
		g_cache_as_bitmap_timer = 10;
		
	},

	start_vis: function () {
		if (this.play_state.game_mode == 0) play_screen_container.make_vis();//;
	},

	

	handle_mouse_down: function(engine,x,y) {

	},

	handle_mouse_up: function(engine,x,y) {
	},

	screen_resized: function () {
		this.play_state.screen_resized();
	},

	handle_mouse_move: function(engine,x,y) {

	},



	update: function() { 
		this.play_state.update();

		this.x_pos--;
		var dist_ = (0 - this.x_pos);

		this.x_pos = this.x_pos - 0.25*dist_;//- 0.075*Math.abs(this.x_pos + 999);
		play_screen_group.set_x(this.x_pos);
		this.timer--;;
	
		this.bg_alpha -= 0.05;
		//if (this.bg_alpha >= 0) tilebackground_group.set_alpha(this.bg_alpha);
		
		if (this.timer <= 0) {
			
			var level_to_load = this.play_state.current_level;	
			var mapdata_version_mines = 1;
		
			//play_screen_container.hide();

			// game_mode 0 - campaign levels
			if (this.play_state.game_mode == 0) this.play_state.load_level(level_to_load, mapdata_version_mines); // 
			if (this.play_state.game_mode == 6) this.play_state.load_challenge_level(level_to_load, mapdata_version_mines); // 
			

			// tutorial levels - load the level that play_state is set to
			// computer solves it
			// highlights tiles & shows tutorial text in a number of stages that the player clicks through
			if (this.play_state.game_mode == 5) {
				//this.play_state.load_tut_level(level_to_load, mapdata_version_mines);
				this.change_state(this.engine, new InstructionStateClass(this.engine, this.play_state));
				return;
			}

			// beg for rating stuff
			

			// beg
			// BegForRatingState
			// possible issues in the app, removed for now
			

		
			// crosspromote stuff
			if (false && g_show_crosspromote == true && 
			    this.play_state.won_or_lost == true &&
			    total_levels_played > 20 && on_kong == false &&
				total_levels_played_this_session > 5 &&
			    using_cocoon_js == false) {  // && levels_until_ad <= 1
				// cross promotion
				
				//this.change_state(this.engine, new ShowZblipGame(this.engine, this.play_state));
				//return;
			}

			if (this.play_state.current_level%8 == 1 && use_browser_cookies == false && seen_SetupSaveStateClass == false && game_cannot_save == false) {
				//seen_SetupSaveStateClass = true;
				this.change_state(this.engine, new SetupSaveStateClass(this.engine, this.play_state));
				return;
			}

			if (false && this.play_state.current_level == 9999 && already_setup_input == false && using_phaser == true && using_cocoon_js == false) {
				this.change_state(this.engine, new SetupInputStateClass(this.engine, this.play_state));
			} else if (g_show_ads == true && 
				   //total_levels_played > 100 &&
				   this.play_state.won_or_lost == true) {

				if (levels_until_ad == 1) g_interstitial.load(); 
				else if (levels_until_ad <= 0 && g_interstitial_loaded == false) {
					g_interstitial.load(); 
					levels_until_ad = 1;
				} else if (levels_until_ad <= 0 && g_interstitial_loaded == true) {
					
					this.change_state(this.engine, new ShowAdStateClass(this.engine, this.play_state));
					levels_until_ad = 3;
					
					return;
				}

	

				if (this.play_state.game_mode == 1) this.change_state(this.engine, new GenerateRandStateClass(this.engine, this.play_state));
				else this.change_state(this.engine, new StartGameStateClass(this.engine, this.play_state));
				
				
				
				

			} else {

				if (this.play_state.game_mode == 1) this.change_state(this.engine, new GenerateRandStateClass(this.engine, this.play_state));
				else this.change_state(this.engine, new StartGameStateClass(this.engine, this.play_state));
			}
		}
		
	},

	cleanup: function() {
		// this state could be interrupted by the user, and we can't guarantee that StartGameStateClass will be next
		// BUT StartGameStateClass init sets play_screen_container.position.x to +999 before draw()
		
		//play_screen_group.set_x(0);	
		game_group.cache_as_bitmap(false);
	},

	draw: function() {
		
		this.play_state.draw();
	},


});


g_button_doyouwantsave_yes = null;
g_button_doyouwantsave_no = null;

g_text_doyouwantsave_yes = null;
g_text_doyouwantsave_no = null;

g_setup_input_text = null;
seen_SetupSaveStateClass = false;


SetupSaveStateClass = GameStateClass.extend({
	play_state: null,
	engine: null,

	init: function(engine, play_state){
		this.play_state = play_state;
		this.engine = engine;

		already_setup_input = true;

		if (g_setup_input_text == null) {

			g_setup_input_text = new TextClass(Types.Layer.GAME_MENU);
			g_setup_input_text.set_font(Types.Fonts.SMALL);
			g_setup_input_text.set_text("DO YOU WANT\nTO STORE YOUR PROGRESS\nON THIS BROWSER?");

			g_button_doyouwantsave_yes = new SpriteClass();
			g_button_doyouwantsave_yes.setup_sprite("rightarrow.png",Types.Layer.GAME_MENU);

			g_text_doyouwantsave_yes = new TextClass(Types.Layer.GAME_MENU);
			g_text_doyouwantsave_yes.set_font(Types.Fonts.XSMALL);
			g_text_doyouwantsave_yes.set_text("YES");

			g_button_doyouwantsave_no = new SpriteClass();
			g_button_doyouwantsave_no.setup_sprite("rightarrow.png",Types.Layer.GAME_MENU);

			g_text_doyouwantsave_no = new TextClass(Types.Layer.GAME_MENU);
			g_text_doyouwantsave_no.set_font(Types.Fonts.XSMALL);
			g_text_doyouwantsave_no.set_text("NO, DO NOT SAVE MY PROGRESS");

		}

		
	
		this.screen_resized();

	},

	yes_x: 0,
	yes_y: 0,

	no_x: 0,
	no_y: 0,

	screen_resized: function () {

		//console.log("SetupSaveStateClass  > screen_resized");
		g_button_doyouwantsave_yes.make_vis();
		g_text_doyouwantsave_yes.make_vis();

		g_button_doyouwantsave_no.make_vis();
		g_text_doyouwantsave_no.make_vis();

		g_setup_input_text.make_vis();

		g_setup_input_text.update_pos(32,32);

		this.yes_x = 32;
		this.yes_y = 3*64;

		this.no_x =  32;
		this.no_y =  4*64;


		g_button_doyouwantsave_yes.update_pos(this.yes_x, this.yes_y);
		g_text_doyouwantsave_yes.update_pos(this.yes_x + 64, this.yes_y);

		g_button_doyouwantsave_no.update_pos(this.no_x, this.no_y);
		g_text_doyouwantsave_no.update_pos(this.no_x + 64, this.no_y);
		

	},

	cleanup: function() {
		g_button_doyouwantsave_yes.hide();
		g_text_doyouwantsave_yes.hide();

		g_button_doyouwantsave_no.hide();
		g_text_doyouwantsave_no.hide();

		g_setup_input_text.hide();
		

	},

	handle_mouse_up: function(engine,x,y) {

		
	
		if (mouse.x > this.yes_x - 19 &&
		    mouse.x < this.yes_x + 19 &&
		    mouse.y > this.yes_y - 19 &&
		    mouse.y < this.yes_y + 19) {
			use_browser_cookies = true;

			this.change_state(this.engine, new StartGameStateClass(this.engine, this.play_state));
			
		} else if (mouse.x > this.no_x - 19 &&
		    	mouse.x < this.no_x + 19 &&
		    	mouse.y > this.no_y - 19 &&
		    	mouse.y < this.no_y + 19) {

			use_browser_cookies = false;

			this.change_state(this.engine, new StartGameStateClass(this.engine, this.play_state));
			
		} 

	}
});

StartGameStateClass = GameStateClass.extend({

	play_state: null,

	engine: null,

	x_pos: 2999,
	timer: 55,

	bg_alpha: 0,

	init: function(engine, play_state){
		this.play_state = play_state;
		this.engine = engine;

		//this.play_state.new_game(0);

		window.focus();

		play_screen_container.set_x(2999);
		// play_screen_container.set_x(0);

		this.play_state.tally_tiletypes();


		if (this.play_state.current_level == 0) {

			g_zblip_on_play_button();
			g_zblip_on_start_level(0);

		} else g_zblip_on_start_level(this.play_state.current_level);

		//this.play_state.tile_style = 0;
		//if (Math.random() < 0.5) this.play_state.tile_style = 1;

		if (this.play_state.tile_style == 1) {
			set_pixi_bg_colour(0x83C187);
			this.play_state.change_tiled_bg("check_green.png");
		} else if (this.play_state.tile_style == 0) {
			set_pixi_bg_colour(0x8C8ACC);
			this.play_state.change_tiled_bg("check_blue.png");
		}
		
		// this.play_state.bg_squares
		for (var x = 0; x < this.play_state.grid_w; x++) {
			for (var y = 0; y < this.play_state.grid_h; y++) {
				
				if (x < this.play_state.level_w &&
				    y < this.play_state.level_h) {
					//this.play_state.bg_squares[this.play_state.tiles[x][y]].make_vis();
					this.play_state.blocks[this.play_state.tiles[x][y]].make_vis();
				} else {
					//this.play_state.bg_squares[this.play_state.tiles[x][y]].hide();
					this.play_state.blocks[this.play_state.tiles[x][y]].hide();
				}
			}
		}

		// rescale
		
		level_ratio = 1;
		level_x_shift = 0;

		if (this.play_state.game_mode == 0) {
			//level_ratio = g_level_ratio[this.play_state.current_level];
			//level_x_shift = g_level_x_shift[this.play_state.current_level];
		}

		//do_resize();	
		//this.play_state.show_border();
			

		//this.play_state.calc_sequence_lengths();

		//this.play_state.calc_islands(); // needs to happen BEFORE calc the side nonograms
		
		//this.play_state.calc_edge_nonogram();

		

		this.play_state.resize();	// after calc edges - need to know sizes

		for (var x = 0; x < this.play_state.level_w; x++) {
			for (var y = 0; y < this.play_state.level_h; y++) {

				// debug mode - start with solved puzzle
				//if (this.play_state.blocks[this.play_state.tiles[x][y]].block_type == 2) this.play_state.blocks[this.play_state.tiles[x][y]].put_flag_on();

				this.play_state.blocks[this.play_state.tiles[x][y]].calc_hint(this.play_state.blocks[this.play_state.tiles[x][y]].symbol_type);
				this.play_state.blocks[this.play_state.tiles[x][y]].calc_sprite();

				this.play_state.blocks[this.play_state.tiles[x][y]].setup();

			}
		}

		this.play_state.item_inventory.reset();
		if (this.play_state.bg_dots_enabled) tilebackground_group.make_vis();

		

		//tilebackground_group.set_alpha(0);
		this.play_state.mistakes_this_level = 0;

		if (g_solver_class) g_solver_class.go();

	},

	handle_mouse_down: function(engine,x,y) {
		
	},

	handle_mouse_up: function(engine,x,y) {
	},

	screen_resized: function () {
		this.play_state.screen_resized();
	},

	handle_mouse_move: function(engine,x,y) {

	},

	

	update: function() { 

		this.timer--;
		if (this.timer > 50) return;

		this.bg_alpha += 0.05;
		//if (this.bg_alpha <= 1.0) tilebackground_group.set_alpha(this.bg_alpha);


		this.x_pos = this.x_pos - 0.15*(this.x_pos);
		
		play_screen_container.set_x(this.x_pos);

		play_screen_container.make_vis();
		background_group.make_vis();

		this.play_state.update();
		// waiting for player to click to start

		if (this.timer == 0) {
			
								// this gets called in GenerateRandStateClass
								// after loading a campaign level from file
								// when does it get called during community level loading?
			this.change_state(this.engine, new DuringGameStateClass(this.engine, this.play_state));
			play_screen_container.set_x(0);
		}
		
		
	},

	cleanup: function() {
		play_screen_group.set_x(0);
		game_group.cache_as_bitmap(false);
	},

	draw: function() {
		this.play_state.draw();
	},
});


g_hint_button = null;
g_hint_cursor = null;
g_hint_text = null;

g_this_level_num_text = null;

g_reset_button = null;

g_level_text_1 = null;

DuringGameStateClass = GameStateClass.extend({

	play_state: null,

	engine: null,

	mouse_down: false,


	reset_x: 0,
	reset_y: 0,


	digflag_selected: 1,
	hide_x: false,

	mistake_cooldown: 0,

	mrline_head_x: 0,
	mrline_head_y: 0,

	mrline_start_x: 0,
	mrline_start_y: 0,
	used_hint: false,

	init: function(engine, play_state){
		this.play_state = play_state;
		this.engine = engine;

		play_screen_container.make_vis();

		this.mouse_down = false;

		this.play_state.won_or_lost = false;

		
		this.handle_key_release();

		if (g_level_text_1 == null) {

			
			//g_reset_button_sprite = new SpriteClass();
			//g_reset_button_sprite.setup_sprite('restart_icon.png',Types.Layer.GAME_MENU);

		

			g_level_text_1 = new TextClass(Types.Layer.GAME_MENU);
			g_level_text_1.set_font(Types.Fonts.MED_SMALL);
			g_level_text_1.set_text("");

			g_hint_text = new TextClass(Types.Layer.GAME_MENU);
			g_hint_text.set_font(Types.Fonts.MED_SMALL);
			g_hint_text.set_text("");

			g_this_level_num_text = new TextClass(Types.Layer.GAME_MENU);
			g_this_level_num_text.set_font(Types.Fonts.XSMALL);
			g_this_level_num_text.set_text("");

			g_hint_cursor =  new SpriteClass();
			g_hint_cursor.setup_sprite('win_hint.png',Types.Layer.HUD);
			g_hint_cursor.hide();

			g_hint_button  =  new SpriteClass();
			g_hint_button.setup_sprite('lightbulb.png',Types.Layer.GAME_MENU);
		        

		}
		
		//g_reset_button_sprite.make_vis();
		
		

		if (false && this.play_state.current_level == 0 &&
			    this.play_state.game_mode == 0) {

		
			this.play_state.info_obj.set_hint_type(1);	// 4 touch
			this.play_state.info_obj.hidden = false;
			this.play_state.info_obj.draw_once();

			// .set_text(g_texts[language]["Tutorial"]);
			// .set_text(g_texts[language]["tut1"]);

			this.show_level_text = true;
			// tutorial state
			//g_level_text_1.change_text(g_get_text("tut0")); //("where are the mines hidden?");//
			g_level_text_1.change_text("LET'S PLAY PIXOJI");

			//If a white tile is safe then remove it
			//if (using_phaser == true) g_level_text_2.change_text(g_get_text("tut0a"));
			//else g_level_text_2.change_text(g_get_text("digflag"));

			g_level_text_2.change_text("THE NUMBER IS THE PIXELS IN THE 3x3 AREA\nFILL 9 PIXELS\nCLICK ON EACH PIXEL\nOR CLICK AND DRAG");

			if (using_cocoon_js == true) {

			}
			this.hide_x = true;


		} 
		


		
		this.screen_resized();
		
		this.mrline_start_x = this.play_state.mrline_head_x;
		this.mrline_start_y = this.play_state.mrline_head_y;
		

	},

	reset_level : function () {
		
	},

	cleanup : function () {
		this.play_state.cursor_sprite.hide();
		this.play_state.item_inventory.reset();
	

		game_group.cache_as_bitmap(false);

		
		//g_reset_button_sprite.hide();

		
		g_this_level_num_text.update_pos(-999,-999);

		
		g_level_text_1.update_pos(-999,-999);
		g_hint_text.update_pos(-999,-999);
		
		g_hint_button.hide();
		g_hint_cursor.hide();		

		this.play_state.info_obj.hidden = true;
		this.play_state.info_obj.draw_once();
		
	},

	

	

	load_level_state: function () {
		if (use_browser_cookies == false) return;
	},

	// this_game_id
	// also used by the cross-promotion/ad system to avoid showing ads for the current game
	// currently set to 'pixoji' as a temporary name for this game

	forget_save_state: function() {
		if (use_browser_cookies == false) return;
		var levelstate = {
			game_mode: -1,				// will be discarded by load_state
			levelnum: this.play_state.current_level,
			w: this.play_state.level_w,
			h: this.play_state.level_h,
			grid: [],
			mistakes: 0,
			hit_points: 0
		};

		levelstate_string = JSON.stringify(levelstate);
		

		// local storage save levelstate
		localStorage.setItem(this_game_id + "duringlevelstate", levelstate_string);	// levelstate.toString() ?
	},

	save_level_state: function () {
		if (use_browser_cookies == false) return;
		
	},

	
	screen_resized: function () {

		

		if (screen_width > screen_height) {
			
		
			this.reset_x = screen_width - 32;
			this.reset_y = screen_height - 32;


			
		} else {
			


			this.reset_x = -999;	// not enough space
			this.reset_y = -999;

			
		}

		
			this.reset_x = -999;	// not enough space
			this.reset_y = -999;
	
		//g_reset_button_sprite.update_pos(this.reset_x, this.reset_y);

		if (this.show_level_text == true) {
			

			g_level_text_1.hide();	// avoid visual jump
			

			g_level_text_1.update_pos(32, screen_height*0.7);
			
			
			g_level_text_1.center_x(screen_width*0.5);

			g_level_text_1.make_vis();

			g_level_text_1.center_x(screen_width*0.5);
			

		}

		//console.log(");

		if (g_all_world_data_hintseq[this.play_state.current_world][this.play_state.current_level] != null &&
		    g_all_world_data_hintseq[this.play_state.current_world][this.play_state.current_level].length > 0 &&
		    	this.used_hint == false &&
		    this.play_state.hint_points > 0) {
			this.hint_x = screen_width - 32;
			this.hint_y = screen_height - 32;
			g_hint_button.make_vis();
			
		} else {
			this.hint_x = -999;
			this.hint_y = -999;
			
		}
		g_hint_button.update_pos(this.hint_x, this.hint_y)

		this.play_state.screen_resized();
	},

	hint_x: -999,
	hint_y: -999,
	
	highlighted_x: 0,
	highlighted_y: 0,

	handle_wheel: function () {
		
	},

	drag_mode: 0,

	drag_vert: 0,
	drag_horiz: 0,

	mouse_down_x: 0,		// 
	mouse_down_y: 0,

	loaded_from_storage: false,
	
	// multitouch
	digflag_hold: false,

	new_action_button_press: true,

	grab_x: -1,
	grab_y: -1,

	grabbed_and_dragged: false,
	hold_and_clear_dotted: false,

	handle_mouse_down: function(engine,x,y) {

		

		this.handle_mouse_move(engine,x,y);

		this.mouse_down_x = x;
		this.mouse_down_y = y;

		
		
		
		if (this.mouse_down == true) {
			return;
		}

		if (mouse.x < this.hint_x + 32 &&
		    mouse.x > this.hint_x - 32 &&
		    mouse.y < this.hint_y + 32 &&
		    mouse.y > this.hint_y - 32) {
			
			this.do_hint();
		}

		if (g_cursor_on == true) {
			
			this.play_state.cursor_sprite.set_alpha(1);
		} 

		this.mouse_down = true;
		this.hold_and_clear_dotted = false;

		if (this.play_state.is_in_level(this.highlighted_x, this.highlighted_y) == false) return;

		if (this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].block_type ==
			GameTypes.Tiles.LINE_START_A) {
			this.retract_mr_line();
			this.retract_mr_line();
			this.do_reverse_sound();
		}

		if (this.play_state.is_in_level(this.highlighted_x, this.highlighted_y) == true &&
		    this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].is_mustend()) {

			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].swap_heads();

			// fall through to the following code as usual
		} 

		
		if (this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].block_type ==
			GameTypes.Tiles.LINE_START_A_POSSIBLE) {
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].click_possible_start_node();
			// fall through to the following code as usual
		}

		

		if (this.play_state.is_in_level(this.highlighted_x, this.highlighted_y) == true &&
		    this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].is_end() == true &&
		    this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].is_main_line() == true) {

			this.grab_x = this.highlighted_x;
			this.grab_y = this.highlighted_y;
			this.grabbed_and_dragged = false;

		} else if (this.play_state.is_in_level(this.highlighted_x, this.highlighted_y) == true &&
		    this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].is_end_dotted() == true) {
			this.grab_x = this.highlighted_x;
			this.grab_y = this.highlighted_y;
			this.grabbed_and_dragged = false;
		} else if (this.play_state.is_in_level(this.highlighted_x, this.highlighted_y) == true &&
		this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].is_end() == false &&
		this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].is_main_line() == true) {

			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].on_cut();

			this.do_reverse_sound();

			this.grab_x = this.highlighted_x;
			this.grab_y = this.highlighted_y;
			this.grabbed_and_dragged = false;

		} else if ( this.play_state.is_in_level(this.highlighted_x, this.highlighted_y) == true &&
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].is_dotted_line()) {
			
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].on_cut();

			this.hold_and_clear_dotted = true;

		} else if (this.play_state.is_in_level(this.highlighted_x, this.highlighted_y) == true &&
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].is_fillable() == true && this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].is_main_line() == false && this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].is_dotted_line() == false) {
			// start new dotted line
			this.grab_x = this.highlighted_x;
			this.grab_y = this.highlighted_y;
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].start_new_dotted();
			this.grabbed_and_dragged = false;
		} 

		if (g_solver_class || this.loaded_from_storage) {
			this.check_for_victory();
			this.loaded_from_storage = false;
		}

		
	},

	handle_left_mouse: function(engine,x,y) {
		return;
		this.handle_mouse_move(engine,x,y);

		this.mouse_down_x = x;
		this.mouse_down_y = y;


		this.mouse_down = true;

	
		

		
		if (this.mouse_down == true) {
			return;
		}
		
		
		
	},

	

	key_down: false,
	key_up: false,
	key_left: false,
	key_right: false,
	key_any: false,

	handle_key_release : function () {
		this.key_down = false;
		this.key_up = false;
		this.key_left = false;
		this.key_right = false;
		this.key_any = false;
		
	},

	keyboard_timer: 0,
	update_keyboard: function () {
		this.keyboard_timer--;
		if (this.keyboard_timer < 0) this.keyboard_timer = 10;
		else return;

		if (this.key_down == true) {
		
			this.drag_head(this.play_state.mrline_head_x, this.play_state.mrline_head_y, this.play_state.mrline_head_x, this.play_state.mrline_head_y + 1);
		} else if (this.key_up == true) {
			
			this.drag_head(this.play_state.mrline_head_x, this.play_state.mrline_head_y, this.play_state.mrline_head_x, this.play_state.mrline_head_y - 1);
		} else if (this.key_right == true) {
			
			this.drag_head(this.play_state.mrline_head_x, this.play_state.mrline_head_y, this.play_state.mrline_head_x + 1, this.play_state.mrline_head_y);
		} else if (this.key_left == true) {
			
			this.drag_head(this.play_state.mrline_head_x, this.play_state.mrline_head_y, this.play_state.mrline_head_x - 1, this.play_state.mrline_head_y);
		}
	},

	handle_key : function(keynum) {

		

		//if (this.key_any == true) return;
		
		if (this.key_any == false) this.keyboard_timer = 10;
		this.key_any = true;
			

		////console.log("how is this getting called" + keynum);
		//this.play_state.player_avatar.onanykey();
		
		if (keynum == Types.Events.KEY_DOWN) {
			//this.play_state.player_avatar.onkeydown();
			
			if (this.key_down == false) this.drag_head(this.play_state.mrline_head_x, this.play_state.mrline_head_y, this.play_state.mrline_head_x, this.play_state.mrline_head_y + 1);
			this.key_down = true;
		} else if (keynum == Types.Events.KEY_UP) {
			//this.play_state.player_avatar.onkeyup();
			
			if (this.key_up == false) this.drag_head(this.play_state.mrline_head_x, this.play_state.mrline_head_y, this.play_state.mrline_head_x, this.play_state.mrline_head_y - 1);
			this.key_up = true;
		} else if (keynum == Types.Events.KEY_RIGHT) {
			//this.play_state.player_avatar.onkeyright();
			
			if (this.key_right == false) this.drag_head(this.play_state.mrline_head_x, this.play_state.mrline_head_y, this.play_state.mrline_head_x + 1, this.play_state.mrline_head_y);

			this.key_right = true;
		} else if (keynum == Types.Events.KEY_LEFT) {
			//this.play_state.player_avatar.onkeyleft();
			
			if (this.key_left == false) this.drag_head(this.play_state.mrline_head_x, this.play_state.mrline_head_y, this.play_state.mrline_head_x - 1, this.play_state.mrline_head_y);
			this.key_left = true;
		} else if (keynum == Types.Events.KEY_SPACEBAR) {
			this.retract_mr_line();
			this.retract_mr_line();
			this.do_reverse_sound();
		}
		
	},

	retract_mr_line : function () {
		// this.mrline_start_x
			if (this.play_state.is_in_level(this.mrline_start_x - 1, this.mrline_start_y) == true) {
			   this.play_state.blocks[this.play_state.tiles[this.mrline_start_x - 1][this.mrline_start_y]].on_cut();
			}
			if (this.play_state.is_in_level(this.mrline_start_x + 1, this.mrline_start_y) == true) {
			   this.play_state.blocks[this.play_state.tiles[this.mrline_start_x + 1][this.mrline_start_y]].on_cut();
			}
			if (this.play_state.is_in_level(this.mrline_start_x, this.mrline_start_y - 1) == true) {
			   this.play_state.blocks[this.play_state.tiles[this.mrline_start_x][this.mrline_start_y - 1]].on_cut();
			}
			if (this.play_state.is_in_level(this.mrline_start_x, this.mrline_start_y + 1) == true) {
			   this.play_state.blocks[this.play_state.tiles[this.mrline_start_x][this.mrline_start_y + 1]].on_cut();
			}
	},

	drag_head : function (start_x, start_y, end_x, end_y) {
		
		var moved_ = this.play_state.blocks[this.play_state.tiles[start_x][start_y]].on_drag_into(end_x, end_y);

		if (moved_ == true) {
				//this.mrline_head_x = end_x;
				//this.mrline_head_y = end_y;

				
				if (this.play_state.blocks[this.play_state.tiles[start_x][start_y]].line_type > 0) this.play_state.anim_head_move_timer = 0.25;
				this.play_state.anim_head_move_x = end_x;
				this.play_state.anim_head_move_y = end_y;

				
				this.play_state.clear_hint();
				this.check_for_victory();

				this.do_move_sound();
		}
	},

	do_hint : function () {
		if (this.used_hint == true) return;
		this.used_hint = true;
		
		this.play_state.hint_points--;

		g_hint_cursor.make_vis();

		var hintlength = g_all_world_data_hintseq[this.play_state.current_world][this.play_state.current_level].length;

		var b_ = g_all_world_data_hintseq[this.play_state.current_world][this.play_state.current_level][hintlength - 1];

		var x_ = this.play_state.get_x_from_rel_index(b_);
		var y_ = this.play_state.get_y_from_rel_index(b_);

		g_hint_cursor.update_pos((x_ + 0.5)*this.play_state.tile_size, 
								      (y_ + 0.5)*this.play_state.tile_size);

		g_hint_text.change_text("SHOWING LAST TILE\n" + this.play_state.hint_points + " HINTS REMAINING");
		if (this.play_state.hint_points == 0) g_hint_text.change_text("GET THE APP\nFOR MORE HINTS");
		g_hint_text.update_pos(screen_width - 220, screen_height - 64);

		this.screen_resized();
		
	},

	handle_mouse_up: function(engine,x,y) {

		
		
		this.mouse_down = false;

		if (g_cursor_on == true) {
			
			this.play_state.cursor_sprite.set_alpha(0.5);
		} 
			


		if (this.grab_x != -1 && 
		this.grabbed_and_dragged == false &&
		this.play_state.is_in_level(this.highlighted_x, this.highlighted_y) == true) {
			//this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].on_cut();
		}

		this.grab_x = -1;
		this.grab_y = -1;
		

		if (mouse.y > this.reset_y - 32 &&
		    mouse.y < this.reset_y + 32 &&
		    mouse.x > this.reset_x - 32 &&
		    mouse.x < this.reset_x + 32) {
			
			//this.reset_level();
			return;
		}


	},

	

	set_info_panel: function(x, y) {
		var blocktype = this.play_state.get_block_type(x,y);

		if (blocktype == 1) {
			// wall
		} else {
			//if ()


		}
	},

	
	
	

	game_over: false,

	


	prev_highlighted_x: 0,
	prev_highlighted_y: 0,

	prev_pointer_x: -1,
	prev_pointer_y: -1,
	pointer_x: -1,
	pointer_y: -1,


	drag_type: 0,	// flag , unflag

	x_drag_tiles: [],
	y_drag_tiles: [],

	delayed_drag: true,

	

	process_drag: function (xtile, ytile) {
		
		if (this.hold_and_clear_dotted == true &&
		    this.play_state.is_in_level(xtile, ytile) == true &&
		    this.play_state.blocks[this.play_state.tiles[xtile][ytile]].is_dotted_line() == true ) {
			this.play_state.blocks[this.play_state.tiles[xtile][ytile]].on_cut();

		}

		
		if (this.grab_x != -1) {
			
			this.grabbed_and_dragged = true;
			var moved_ = false;
			var backtracked_ = false;

			if (this.play_state.is_in_level(this.grab_x,this.grab_y) == true &&
			    (this.play_state.blocks[this.play_state.tiles[this.grab_x][this.grab_y]].is_end() == true ||
			     this.play_state.blocks[this.play_state.tiles[this.grab_x][this.grab_y]].is_end_dotted() == true)) {
				moved_ = this.play_state.blocks[this.play_state.tiles[this.grab_x][this.grab_y]].on_drag_into(xtile, ytile);
				if (this.play_state.blocks[this.play_state.tiles[this.grab_x][this.grab_y]].is_main_line() == false) {
					// we backtracked - dont keep backtracking
					//this.x_drag_tiles = [];
					//this.y_drag_tiles = [];
					backtracked_ = true;
				}
			}

			this.grab_x = xtile;
			this.grab_y = ytile;
			
			if (moved_ == true) {
				//this.mrline_head_x = this.highlighted_x;
				//this.mrline_head_y = this.highlighted_y;

				if (backtracked_ == false) this.play_state.anim_head_move_timer = 0.25;
				this.play_state.anim_head_move_x = xtile;
				this.play_state.anim_head_move_y = ytile;
				
				this.play_state.clear_hint();
				this.check_for_victory();

				if (this.play_state.blocks[this.play_state.tiles[this.grab_x][this.grab_y]].is_main_line() == true) this.do_move_sound();
			}
		}

		   
	},

	do_move_sound : function () {
		if (this.x_drag_tiles.length == 0 && g_sound_on == true) {
					var rand_ = Math.random();
					if (rand_ < 0.25) playSoundInstance('assets/step1.wav',0.2);
					else if (rand_ < 0.5) playSoundInstance('assets/step2.wav',0.1);
					else if (rand_ < 0.75) playSoundInstance('assets/step3.wav',0.1);
					else if (rand_ < 1) playSoundInstance('assets/step4.wav',0.2);
		}
	},

	do_reverse_sound : function () {
		if (this.x_drag_tiles.length == 0 && g_sound_on == true) {
					var rand_ = Math.random();
					if (rand_ < 0.33) playSoundInstance('assets/back1.wav',0.2);
					else if (rand_ < 0.66) playSoundInstance('assets/back2.wav',0.1);
					else playSoundInstance('assets/back3.wav',0.1);
		}
	},
	
	handle_mouse_move: function(engine,x,y) {

		
		if (this.prev_highlighted_x != this.highlighted_x ||
		    this.prev_highlighted_y != this.highlighted_y) {
			this.prev_highlighted_x = this.highlighted_x;
			this.prev_highlighted_y = this.highlighted_y;

			
				
		}

		if (this.mouse_down == true) {
			this.prev_pointer_x = this.pointer_x;
			this.prev_pointer_y = this.pointer_y;
		}

		this.highlighted_x = Math.round((x - 0.5*this.play_state.tile_size)/ this.play_state.tile_size);
		this.highlighted_y = Math.round((y - 0.5*this.play_state.tile_size)/ this.play_state.tile_size);

		if (g_cursor_on == true &&
		    this.play_state.is_in_level(this.highlighted_x, this.highlighted_y) == true) {
			this.play_state.cursor_sprite.make_vis();
			this.play_state.cursor_sprite.update_pos((this.highlighted_x + 0.5)*this.play_state.tile_size, 
								      (this.highlighted_y + 0.5)*this.play_state.tile_size);
			if (this.mouse_down == true) this.play_state.cursor_sprite.set_alpha(1);
			else this.play_state.cursor_sprite.set_alpha(0.5);
		} else {
			this.play_state.cursor_sprite.hide();
		}

		if (this.mouse_down == true) {
			this.pointer_x = this.highlighted_x;
			this.pointer_y = this.highlighted_y;
		}

		// avoid that issue when the cursor goes off canvas & comes back, it acts like we are dragging
		if (this.highlighted_x < - 2 || this.highlighted_y < - 2 || 
		    this.highlighted_x > this.play_state.level_w + 2 || 
		    this.highlighted_y > this.play_state.level_h + 1) {

			
			this.mouse_down = false;
			this.drag_mode = 0;
			
			this.drag_horiz = 0;
			this.drag_vert = 0;
		}

		if (this.mouse_down == true &&
		    this.hold_and_clear_dotted == true &&
		    (this.prev_highlighted_x != this.highlighted_x ||
		     this.prev_highlighted_y != this.highlighted_y) &&
		this.play_state.is_in_level(this.highlighted_x, this.highlighted_y) == true &&
		this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].is_dotted_line() ) {

			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].on_cut();

		}

		
		if (this.mouse_down == true &&
		    this.delayed_drag == false &&
		    this.grab_x != -1 &&
		    (this.prev_highlighted_x != this.highlighted_x ||
		     this.prev_highlighted_y != this.highlighted_y)) {
			
			this.grabbed_and_dragged = true;
			var moved_ = false;

			if (this.play_state.is_in_level(this.grab_x,this.grab_y) == true) {
				moved_ = this.play_state.blocks[this.play_state.tiles[this.grab_x][this.grab_y]].on_drag_into(this.highlighted_x, this.highlighted_y);
			}

			this.grab_x = this.highlighted_x;
			this.grab_y = this.highlighted_y;
			
			if (moved_ == true) {
				//this.mrline_head_x = this.highlighted_x;
				//this.mrline_head_y = this.highlighted_y;
				
				this.play_state.clear_hint();
				this.check_for_victory();
			}
		} else if (this.mouse_down == true &&
			   this.grab_x != -1 &&
		    	  (this.prev_highlighted_x != this.highlighted_x ||
		     	   this.prev_highlighted_y != this.highlighted_y)) {

		
			
			var inter_x = this.prev_pointer_x;
			var inter_y = this.prev_pointer_y;		
			
			var loops_ = 0;

			while (loops_ < 100 &&
				(inter_x != this.pointer_x ||
				inter_y != this.pointer_y)) {
				loops_++;
				if (inter_x < this.pointer_x) inter_x++;
				else if (inter_x > this.pointer_x) inter_x--;
				else if (inter_y < this.pointer_y) inter_y++;
				else if (inter_y > this.pointer_y) inter_y--;

				this.x_drag_tiles.push(inter_x);
				this.y_drag_tiles.push(inter_y);

				
			}

			
		}

		
		
	},


	victory: false,
	

	

	

	check_for_victory: function() {

		this.victory = false;

		for (var x = 0; x < this.play_state.level_w; x++) {
			for (var y = 0; y < this.play_state.level_h; y++) {
				if (this.play_state.blocks[this.play_state.tiles[x][y]].is_fillable() == true &&
				    this.play_state.blocks[this.play_state.tiles[x][y]].block_type != GameTypes.Tiles.UNNEEDED &&
				    this.play_state.blocks[this.play_state.tiles[x][y]].is_main_line() == false) {
					
					return false;
				}
			}
		}

		this.victory = true;

		if (this.victory == true) {
			this.play_state.won_or_lost = true;
			this.change_state(this.engine, new WinStateClass(this.engine, this.play_state));
		} else {
			
			
		}

		
	},

	


	update: function() { 

		this.update_keyboard();

		if (this.x_drag_tiles.length > 0 && this.y_drag_tiles.length > 0) {
			var x = this.x_drag_tiles.shift();
			var y = this.y_drag_tiles.shift();
			this.process_drag(x,y);
		}


		if (g_cache_as_bitmap == true && g_cache_as_bitmap_timer > 0) {
			// I'm using another strategy (STATIC_TILE RenderTexture)
			// I dont know which is actually better....
			// cache as bitmap or RenderTexture
			g_cache_as_bitmap_timer--;
			if (g_cache_as_bitmap_timer <= 0) {
				
				game_group.cache_as_bitmap(true);
				do_resize();
				g_cache_as_bitmap_timer = 0; // resize triggers g_cache_as_bitmap_timer = 10
				// on my iphone the level disappears when using cacheAsBitmap, reappears on orientation	
			}
		}

		
		this.play_state.update();

	},

	draw_timer: 0,

	
	draw: function() {
		

		this.play_state.draw();

		

	},

});
	
	



g_is_the_current_level_loaded = false;

g_num_worlds = 9;//10;
g_all_world_data_floor = {};
g_all_world_data_edge = {};
g_all_world_data_hintseq = {};
g_all_world_data_text = {};
g_all_world_data_tutseq = {};
g_tut_content_for_world = {};

for (var i = 0; i < g_num_worlds; i++) {
	//g_level_totalnum_world[i]
	g_all_world_data_floor[i] = {}; //.push({});
	g_all_world_data_edge[i] = {}; //.push({});
	g_all_world_data_hintseq[i] = {}; //.push({});
	g_all_world_data_text[i] = {}; //.push({});
	g_tut_content_for_world[i] = {};
	if (g_servermode) g_all_world_data_tutseq[i] = {};
}


g_tut_content = g_tut_content_for_world[0];

g_all_world_data_floor[0][0] = [
 [1,1,1,1,1,1,1],
[1,2,0,0,0,0,1],
[1,1,1,1,1,1,1]
		];




g_all_world_data_edge[0][0] = [
	
];

g_all_world_data_hintseq[0][0] = [
	
];


LoadingLevelStateClass = GameStateClass.extend({

	done_: null,
	play_state: null,
	engine: null,

	already_loaded: false,

	post_win: false,

	p_level_folder: null,
	p_edge_folder: null,
	p_hintseq_folder: null,

	init: function(engine, play_state, level_num, post_win) {
		//load_script_assets(['level1.json'],this.callback);

		//$.loadJSON(['level1.json'],this.callback);

		this.play_state = play_state;
		this.engine = engine;

		g_is_the_current_level_loaded = false;

		if (post_win != null) this.post_win = post_win;

		var first_in_file = Math.floor(level_num / 10)*10;
		var last_in_file = first_in_file + 9;

		this.p_level_folder = g_all_world_data_floor[this.play_state.current_world];
		this.p_edge_folder = g_all_world_data_edge[this.play_state.current_world];
		this.p_hintseq_folder = g_all_world_data_hintseq[this.play_state.current_world];

		//this.p_level_folder = g_all_world_data_floor[this.play_state.current_world];
		var filepath_needed = 'levels/'+ this.play_state.current_world + '/level' + first_in_file.toString() + 'to' + last_in_file + '.json';

		
		g_tut_content = g_tut_content_for_world[this.play_state.current_world];


		if (this.p_level_folder[level_num] == null &&
		    g_current_level_data.levels_starting_from == first_in_file &&
		    g_current_level_data.filepath == filepath_needed) {
			// loaded but not processed
			g_is_the_current_level_loaded = true;
			
			
		} else if (this.p_level_folder[level_num] == null) {
			// not yet loaded
			//(level_num.toString() + ' not yet loaded');
			

			//('first_in_file '+first_in_file.toString());
			
			var last_in_file = first_in_file + 9;
			

			var file_n =  'levels/'+ this.play_state.current_world + '/level' + first_in_file.toString() + 'to' + last_in_file + '.json';


			

			

			// levels/easy/

			//(file_n);

			//load_level_from_file('levels/level1to10.json',function() {
			//					g_is_the_current_level_loaded = true;
			//					});

			load_level_from_file(file_n,function() {
								g_is_the_current_level_loaded = true;
								});
			
		} else {
			//(level_num.toString() + ' already loaded');
			this.already_loaded = true;
		}

		//('loding level init');
		
	},

	screen_resized : function (engine) {
		this.play_state.screen_resized(engine);
	},

	
	update:function(engine) {

		

		if (this.already_loaded == true) {
			var restart_state = new RestartGameStateClass(this.engine, this.play_state);
			if (this.post_win == true) restart_state.start_vis();
			this.change_state(this.engine, restart_state);

			return;

		}

		////('g_is_the_current_level_loaded' + g_is_the_current_level_loaded );
		if(g_is_the_current_level_loaded == true) {
			g_is_the_current_level_loaded = false;

			this.extract_tut_data();	// if any is present

			//console.dir(g_current_level_data);

			var num_levels_in_this_file = g_current_level_data.floor.length;
			var first_level_in_this_file = g_current_level_data.levels_starting_from;
			var last_level = first_level_in_this_file  + num_levels_in_this_file ;


			for (var i = first_level_in_this_file; i < last_level; i++) {
				// is this a deep copy?
				//g_all_world_data_floor[this.play_state.current_world][i] = g_current_level_data.floor[i - first_level_in_this_file].slice(0);
				//g_all_level_data_cover_layer[i] = g_current_level_data.cover[i - first_level_in_this_file].slice(0);

				//('storing level ' + i);

				
				//g_all_level_data_cover_layer[i] = new Array(10);


				//if (g_all_level_status[i] == null) g_all_level_status[i] = 1;	// available

				// g_all_world_data_floor[this.play_state.current_world]

				if (g_current_level_data.floor[i - first_level_in_this_file].length == 0) {
					continue;
				}


				var width_ = 10;

				if (g_current_level_data.width[i - first_level_in_this_file] != null) width_ = g_current_level_data.width[i - first_level_in_this_file];	
				else continue;			

				this.load_level_one_d_array(i, i - first_level_in_this_file, width_);
				continue;
				

				g_all_world_data_floor[this.play_state.current_world][i] = new Array(10);

				for (var x = 0; x < 10; x++) {
					this.p_level_folder[i][x] = new Array(10);
					//g_all_level_data_cover_layer[i][x] = new Array(10);

					for (var y = 0; y < 10; y++) {
						var floor_ = g_current_level_data.floor[i - first_level_in_this_file][x][y];
						this.p_level_folder[i][x][y] = floor_;

						//var cover_ = g_current_level_data.cover[i - first_level_in_this_file][x][y];
						//g_all_level_data_cover_layer[i][x][y] = cover_;
					}
				}
			}

			//var level_to_load = 0;	
			//var mapdata_version_mines = 1;
			//this.play_state.current_level = level_to_load;

			// this.play_state.current_level was set when this state was created

			//this.play_state.load_level(level_to_load, mapdata_version_mines); // 

			g_tut_content = g_tut_content_for_world[this.play_state.current_world];

			if (g_tut_content[this.play_state.current_level] != null &&
			    this.play_state.game_mode != 6) {
				// putting this here as well as in Overworld and WinState
				
				this.play_state.game_mode = 5;
				this.change_state(this.engine, new LoadInstructionStateClass(this.engine, this.play_state));
				return;
			}

			var restart_state = new RestartGameStateClass(this.engine, this.play_state);
			if (this.post_win == true) restart_state.start_vis();
			this.change_state(this.engine, restart_state);

			//this.change_state(this.engine, new OverworldStateClass(this.engine, this.play_state));
				
			
		}
	},

	
	
	extract_tut_data:function() {
		if (g_current_level_data.tut == null) return;
		if (this.play_state.game_mode == 6) return;	// maybe later i'll make tuts compatible with challenge levels

		g_tut_content = g_tut_content_for_world[this.play_state.current_world];

	
		//for (var i = 0; i < g_current_level_data.tut.length; i++) {
		for (var i in g_current_level_data.tut) {
			// -> g_tut_content
			var level = g_current_level_data.tut[i].levelnum;
			this.load_tut_level_one_d_array(level);

			

			g_tut_content[level].text = [];
			g_tut_content[level].tutseq = [];

			for (var stages = 0; stages < g_current_level_data.tut[i].text.length; stages++) {
				var text = g_current_level_data.tut[i].text[stages]; // string
				g_tut_content[level].text.push(text); 

				var tiles = g_current_level_data.tut[i].tutseq[stages]; // array
				g_tut_content[level].tutseq.push(tiles); 
				
			}

			

		
		}
	},

	load_tut_level_one_d_array: function (num) {

		var width_ = g_current_level_data.tut[num].width;
		// size_ = Math.sqrt(size_);

		var height_ = Math.floor(g_current_level_data.tut[num].level.length / width_);

		width_ = Math.min(width_, this.play_state.grid_w);
		height_ = Math.min(height_, this.play_state.grid_h);

		g_tut_content[num] = {};

		g_tut_content[num].level = new Array(height_);
		g_tut_content[num].edges= new Array(height_);

		for (var y = 0; y < height_; y++) {
		
			
			g_tut_content[num].level[y] = new Array(height_);
			g_tut_content[num].edges[y] = new Array(height_);
			//g_all_level_data_cover_layer[i][x] = new Array(10);
			for (var x = 0; x < width_; x++) {	
			
				var b = width_*y + x;//x + 10*y;


				var floor_ = g_current_level_data.tut[num].level[b];
				var edges_ = g_current_level_data.tut[num].edges[b];
				g_tut_content[num].level[y][x] = floor_;
				g_tut_content[num].edges[y][x] = edges_;

			}
		}
		
	},

	load_level_one_d_array: function (i, rel_, width_) {

		//var size_ = g_current_level_data.floor[rel_].length;
		//size_ = Math.sqrt(size_);

		var height_ = Math.floor(g_current_level_data.floor[rel_].length / width_);

		
		width_ = Math.min(width_, this.play_state.grid_w);
		height_ = Math.min(height_, this.play_state.grid_h);

		

		this.p_level_folder[i] = new Array(height_);
		

		for (var y = 0; y < height_; y++) {
			this.p_level_folder[i][y] = new Array(width_);
			//g_all_level_data_cover_layer[i][x] = new Array(10);

			for (var x = 0; x < width_; x++) {
				var b = width_*y + x;//x + 10*y;

				var floor_ = g_current_level_data.floor[rel_][b];
				this.p_level_folder[i][y][x] = floor_;

			}
		}

		if (g_current_level_data.hintseq == null ||
		    g_current_level_data.hintseq[rel_] == null ||
		    g_current_level_data.hintseq[rel_].length == 0) {
			//console.log("no hintseq");
			//return;
		} else this.load_hintseq(i, rel_);

		if (g_current_level_data.edges == null ||
		    g_current_level_data.edges[rel_] == null ||
		    g_current_level_data.edges[rel_].length == 0) return;

		this.p_edge_folder[i] = new Array(height_);

		
		for (var y = 0; y < height_; y++) {
			this.p_edge_folder[i][y] = new Array(width_);
			//g_all_level_data_cover_layer[i][x] = new Array(10);

			for (var x = 0; x < width_; x++) {
				var b = width_*y + x;//x + 10*y;

				var floor_ = g_current_level_data.edges[rel_][b];
				this.p_edge_folder[i][y][x] = floor_;

			}
		}

		
		
		
		

		return;
		
		for (var x = 0; x < width_; x++) {
			this.p_level_folder[i][x] = new Array(height_);
			//g_all_level_data_cover_layer[i][x] = new Array(10);

			for (var y = 0; y < height_; y++) {
				var b = y + width_*x;//x + 10*y;

				var floor_ = g_current_level_data.floor[rel_][b];
				this.p_level_folder[i][x][y] = floor_;

			}
		}

		//////console.dir(g_all_world_data_floor[this.play_state.current_world][i]);
	},

	load_hintseq : function (i, rel_) {
		this.p_hintseq_folder[i] = [];

		for (var h = 0; h < g_current_level_data.hintseq[rel_].length; h++) {
			this.p_hintseq_folder[i].push(g_current_level_data.hintseq[rel_][h]);
		}

		//console.log('this.p_hintseq_folder[i] ' + this.p_hintseq_folder[i]);
	},
});

StartOverworldStateClass = GameStateClass.extend({
	play_state: null,
	engine: null,

	y_pos: 0,
	x_pos: 0,

	x_vel: 0,
	y_vel: 0,

	timer: 2,

	// remove old screen and bring in new one

	init: function(engine, play_state, xvel, yvel) {

		this.engine = engine;
		this.play_state = play_state;

		this.play_state.hide_bg_squares();

		this.x_vel = xvel;
		this.y_vel = yvel;

		play_screen_container.make_vis();
		play_screen_group.set_y(0);
		play_screen_group.set_x(0);
	},

	
	update: function() { 
		this.play_state.update();

		this.change_state(this.engine, new OverworldStateClass(this.engine, this.play_state));

		return;

		this.x_pos--;
		var dist_ = (0 - this.x_pos);

		this.x_pos = this.x_pos - 0.25*dist_;//- 0.075*Math.abs(this.x_pos + 999);
		play_screen_group.set_x(this.x_pos);
		this.timer--;
	
		
		
		if (this.timer <= 0) {

			this.change_state(this.engine, new OverworldStateClass(this.engine, this.play_state));

		}
		
	},

	screen_resized: function () {
		this.play_state.screen_resized();
	},

	draw: function() {
		
		this.play_state.draw();
	},

	cleanup: function() {
		// this state could be interrupted by the user
		
		play_screen_group.set_y(0);
		play_screen_group.set_x(0);	
	}

});



g_editor_sprites_objs = null;

g_editor_upload_button = null;
g_editor_upload_text = null;

g_editor_test_button = null;
g_editor_test_text = null;

g_editor_retrim_button = null;
g_editor_retrim_text = null;

g_editor_localsave_button = null;
g_editor_localsave_text = null;

g_editor_localload_button = null;
g_editor_localload_text = null;

LevelEditorStateClass =  GameStateClass.extend({
	play_state: null,
	engine: null,

	selected_type: 1,

	highlighted_x: 0,
	highlighted_y: 0,
	prev_highlighted_x: 0,
	prev_highlighted_y: 0,

	upload_x: 0,
	upload_y: 0,

	symbol_types: [],
	colour_cutoff: 0,

	parent_tile_this_swipe: -1,

	game_state: null,

	empty_grid : function () {
		this.game_state = this.play_state;
		this.game_state.reset();

		for (var x = 0; x < this.game_state.level_w; x++) {
			for (var y = 0; y < this.game_state.level_h; y++) {
				this.game_state.set_tile(x, y, GameTypes.Tiles.EMPTY);	
			}
		}

		// border
		for (var x = 0; x < this.game_state.level_w; x++) {
			this.game_state.set_tile(x, 0, GameTypes.Tiles.SOLID);
			this.game_state.set_tile(x, this.game_state.level_h - 1, GameTypes.Tiles.SOLID);
		}

		for (var y = 0; y < this.game_state.level_h; y++) {
			this.game_state.set_tile(0, y, GameTypes.Tiles.SOLID);
			this.game_state.set_tile(this.game_state.level_w - 1, y, GameTypes.Tiles.SOLID);	
		}
	},


	init: function(engine, play_state) {

		this.play_state = play_state;
		this.engine = engine;
		
		
		this.play_state.level_w = 8;
		this.play_state.level_h = 8;
		play_screen_container.make_vis();

		

		this.show_level();

		if (g_editor_upload_button == null) {
			//var empty_ =

			//g_editor_sprites.push(empty_);

			g_editor_upload_button = new SpriteClass();
			g_editor_upload_button.setup_sprite('uparrow.png',Types.Layer.GAME_MENU);
			g_editor_upload_button.update_pos(-999,-999);

			g_editor_upload_text = new TextClass(Types.Layer.GAME_MENU);
			g_editor_upload_text.set_font(Types.Fonts.XSMALL);

			g_editor_retrim_button = new SpriteClass();
			g_editor_retrim_button.setup_sprite('uparrow.png',Types.Layer.GAME_MENU);
			g_editor_retrim_button.update_pos(-999,-999);

			g_editor_retrim_text = new TextClass(Types.Layer.GAME_MENU);
			g_editor_retrim_text.set_font(Types.Fonts.XSMALL);
			

			if (on_kong && kongregate.services.getUserId() > 0) {
				var name_ = kongregate.services.getUsername();
				g_editor_upload_text.set_text("UPLOAD AS\n" + name_);
			} else {
				g_editor_upload_text.set_text("UPLOAD AS\nANON");
			}

			g_editor_retrim_text.set_text("TRIM MORE");

		

			g_editor_localsave_button = new SpriteClass();
			g_editor_localsave_button.setup_sprite('leftarrow.png',Types.Layer.GAME_MENU);
			g_editor_localsave_button.update_pos(-999,-999);

			g_editor_localsave_text = new TextClass(Types.Layer.GAME_MENU);
			g_editor_localsave_text.set_font(Types.Fonts.SMALL);
			g_editor_localsave_text.set_text("SAVE LOCALLY");

			g_editor_localload_button = new SpriteClass();
			g_editor_localload_button.setup_sprite('leftarrow.png',Types.Layer.GAME_MENU);
			g_editor_localload_button.update_pos(-999,-999);

			g_editor_localload_text = new TextClass(Types.Layer.GAME_MENU);
			g_editor_localload_text.set_font(Types.Fonts.SMALL);
			g_editor_localload_text.set_text("LOAD LOCALLY");


			g_editor_test_button = new SpriteClass();
			g_editor_test_button.setup_sprite('rightarrow.png',Types.Layer.GAME_MENU);
			g_editor_test_button.update_pos(-999,-999);

			g_editor_test_text = new TextClass(Types.Layer.GAME_MENU);
			g_editor_test_text.set_font(Types.Fonts.XSMALL);
			g_editor_test_text.set_text("PLAYTEST");

			g_editor_sprites_objs = new LevelEditorTileSelectClass();
			
			g_editor_sprites_objs.add_new('redtile.png', GameTypes.Tiles.SOLID);
			g_editor_sprites_objs.add_new('bluetile.png', GameTypes.Tiles.EMPTY);
			g_editor_sprites_objs.add_new('theline_END.png', GameTypes.Tiles.LINE_START_A);
			g_editor_sprites_objs.add_new('thelineB_END.png', GameTypes.Tiles.LINE_START_B);
			g_editor_sprites_objs.add_new('thelineC_END.png', GameTypes.Tiles.LINE_START_C);
			g_editor_sprites_objs.add_new('finishtile.png', GameTypes.Tiles.MUSTEND_ANY);

			g_editor_sprites_objs.add_new('bridgetile.png', GameTypes.Tiles.BRIDGE);
			g_editor_sprites_objs.add_new('lockout.png', GameTypes.Tiles.LOCKOUT);
			g_editor_sprites_objs.add_new('turner.png', GameTypes.Tiles.TURN_DIAMOND);
			g_editor_sprites_objs.add_new('bluehoop.png', GameTypes.Tiles.BLUE_HOOP);
			g_editor_sprites_objs.add_new('redhoop.png', GameTypes.Tiles.RED_HOOP);
			g_editor_sprites_objs.add_new('lockout_locked2.png', GameTypes.Tiles.LOCKOUT_MULTI_TWO);
			g_editor_sprites_objs.add_new('wall_V.png', GameTypes.Tiles.WALL_RIGHT);
			g_editor_sprites_objs.add_new('wall_V.png', GameTypes.Tiles.WALL_DOWN);
			g_editor_sprites_objs.add_new('redlock_V.png', GameTypes.Tiles.REDDOOR_RIGHT);
			g_editor_sprites_objs.add_new('redlock_V.png', GameTypes.Tiles.REDDOOR_DOWN);
			g_editor_sprites_objs.add_new('redkey.png', GameTypes.Tiles.RED_KEY);
			g_editor_sprites_objs.add_new('bubbletile.png', GameTypes.Tiles.BUBBLE);
			g_editor_sprites_objs.add_new('qcatred.png', GameTypes.Tiles.QCAT_RED);
			g_editor_sprites_objs.add_new('qcatblue.png', GameTypes.Tiles.QCAT_BLUE);
			g_editor_sprites_objs.add_new('qcatgreen.png', GameTypes.Tiles.QCAT_GREEN);
			//g_editor_sprites_objs.add_new('gemfiniteA.png', GameTypes.Tiles.GEMFINITE_A);
			//g_editor_sprites_objs.add_new('gemfiniteB.png', GameTypes.Tiles.GEMFINITE_B);
			//g_editor_sprites_objs.add_new('gemfiniteC.png', GameTypes.Tiles.GEMFINITE_C);
			//g_editor_sprites_objs.add_new('colourtile_lightblue.png', GameTypes.Colours.LIGHTBLUE);
			//g_editor_sprites_objs.add_new('colourtile_orange.png', GameTypes.Colours.ORANGE);
			//g_editor_sprites_objs.add_new('colourtile_pink.png', GameTypes.Colours.PINK);
			//g_editor_sprites_objs.add_new('bluetile.png', GameTypes.Colours.WHITEWHITE);
			//g_editor_sprites_objs.add_new('colourtile_purple.png', GameTypes.Colours.PURPLE);
			//g_editor_sprites_objs.add_new('colourtile_red.png', GameTypes.Colours.RED);
			//g_editor_sprites_objs.add_new('colourtile_yellow.png', GameTypes.Colours.YELLOW);
			

			this.colour_cutoff = 11;
			/*this.symbol_types.push(GameTypes.PixelClues.ZAP);
			g_editor_sprites_objs.add_new('redtilezap.png', GameTypes.Colours.WHITE);
			this.symbol_types.push(GameTypes.PixelClues.GALAXY);
			g_editor_sprites_objs.add_new('white_galaxy.png', GameTypes.Colours.WHITE);
			this.symbol_types.push(GameTypes.PixelClues.FOURTOUCH);
			g_editor_sprites_objs.add_new('redtilesmile.png', GameTypes.Colours.WHITE);
			this.symbol_types.push(GameTypes.PixelClues.SQUARE);
			g_editor_sprites_objs.add_new('white_square.png', GameTypes.Colours.WHITE);

			this.symbol_types.push(GameTypes.PixelClues.SNAKE);
			g_editor_sprites_objs.add_new('white_snake.png', GameTypes.Colours.WHITE);
			*/

			/*
			g_editor_sprites_objs.add_new('button.png', 0);
			g_editor_sprites_objs.add_new('block0.png', 1);
			g_editor_sprites_objs.add_new('flagblock.png', 2);
			g_editor_sprites_objs.add_new('g_block2.png', 3);
			g_editor_sprites_objs.add_new('hand.png', 4);	
			g_editor_sprites_objs.add_new('eye.png', 5);
			g_editor_sprites_objs.add_new('8hand.png', 6);	
			var join_up_index = g_editor_sprites_objs.add_new('joiner_up.png', 8);	
			g_editor_sprites_objs.rotate_sprite(join_up_index, 2);
			var join_right_index = g_editor_sprites_objs.add_new('joiner_up.png', 7);	
			g_editor_sprites_objs.rotate_sprite(join_right_index, 1);
			g_editor_sprites_objs.add_new('heart.png', 10);	
			g_editor_sprites_objs.add_new('compass.png', 11);
			g_editor_sprites_objs.add_new('crown.png', 12);	
			g_editor_sprites_objs.add_new('eyebracket.png', 13);	
			g_editor_sprites_objs.add_new('zap.png', 49);	
			g_editor_sprites_objs.add_new('totalnum.png', 80);	
			g_editor_sprites_objs.add_new('sharesquareUD.png', 26 , 1);	// bubble L R, rotate 1x90
			g_editor_sprites_objs.add_new('sharesquareUD.png', 31, 0);	// bubble U D, rotate 0x90
			g_editor_sprites_objs.add_new('sharesquareRD.png', 27, 2);	// up left
			g_editor_sprites_objs.add_new('sharesquareRD.png', 24, 1);	// down left
			g_editor_sprites_objs.add_new('sharesquareRD.png', 29, 0);	// down right
			g_editor_sprites_objs.add_new('sharesquareRD.png', 32, 3);	// up right
			g_editor_sprites_objs.add_new('sharejoin_horiz.png', 17, 0);	// horiz
			g_editor_sprites_objs.add_new('sharejoin_horiz.png', 18, 1);	// vert
			g_editor_sprites_objs.add_new('sharejoin_UR.png', 19, 2);	// corner	
			g_editor_sprites_objs.add_new('sharejoin_UR.png', 22, 0);	// corner
			g_editor_sprites_objs.add_new('sharejoin_UR.png', 21, 1);	// corner
			g_editor_sprites_objs.add_new('sharejoin_UR.png', 20, 3);	// corner
			*/

		

		}

		g_tilegrid_changed = true;
	
		g_top_nono_size = 0;
		g_left_nono_size = 0;
		do_resize();
		
		this.play_state.reset();

		for (var x = 0; x < this.play_state.level_w; x++) {
			for (var y = 0; y < this.play_state.level_h; y++) {
				this.play_state.set_tile(x, y, GameTypes.Tiles.EMPTY);	
				
				this.play_state.blocks[this.play_state.tiles[x][y]].make_vis();
				this.play_state.blocks[this.play_state.tiles[x][y]].calc_sprite();
			}
		}
		
		this.play_state.reset();

		
		for (var x = 0; x < this.play_state.grid_w; x++) {
			for (var y = 0; y < this.play_state.grid_h; y++) {
				this.highlighted_x = x;
				this.highlighted_y = y;
				//this.delete_tile(x,y);
			}
		}
	

		g_editor_sprites_objs.make_vis();

		//this.play_state.restore_backup();

		this.screen_resized();

		this.empty_grid();
		this.show_level();

		
	},

	show_level: function () {
		
		// this.play_state.bg_squares
		for (var x = 0; x < this.play_state.grid_w; x++) {
			for (var y = 0; y < this.play_state.grid_h; y++) {
				
				if (x < this.play_state.level_w &&
				    y < this.play_state.level_h) {
					//this.play_state.bg_squares[this.play_state.tiles[x][y]].make_vis();
					this.play_state.blocks[this.play_state.tiles[x][y]].make_vis();
				} else {
					//this.play_state.bg_squares[this.play_state.tiles[x][y]].hide();
					this.play_state.blocks[this.play_state.tiles[x][y]].hide();
				}
			}
		}

		// rescale
		
		level_ratio = 1;
		level_x_shift = 0;

		if (this.play_state.game_mode == 0) {
			//level_ratio = g_level_ratio[this.play_state.current_level];
			//level_x_shift = g_level_x_shift[this.play_state.current_level];
		}

		//do_resize();	
		//this.play_state.show_border();
			

		//this.play_state.calc_sequence_lengths();
		
		//this.play_state.calc_edge_nonogram();

		this.play_state.resize();	// after calc edges - need to know sizes

		for (var x = 0; x < this.play_state.level_w; x++) {
			for (var y = 0; y < this.play_state.level_h; y++) {

				// debug mode - start with solved puzzle
				//if (this.play_state.blocks[this.play_state.tiles[x][y]].block_type == 2) this.play_state.blocks[this.play_state.tiles[x][y]].put_flag_on();
				this.play_state.blocks[this.play_state.tiles[x][y]].calc_hint(this.play_state.blocks[this.play_state.tiles[x][y]].symbol_type);
				this.play_state.blocks[this.play_state.tiles[x][y]].calc_sprite();

			}
		}
	},

	play_level: function () {
		
	},

	cleanup: function () {

		//g_generator_class.export_to_localstorage();

		//this.play_state.backup_level();

		g_editor_sprites_objs.hide();

		g_editor_upload_text.update_pos(-999,-999);
		g_editor_upload_button.hide();

		g_editor_retrim_text.update_pos(-999,-999);
		g_editor_retrim_button.hide();


		g_editor_test_text.update_pos(-999,-999);
		g_editor_test_button.hide();

		g_editor_localsave_text.update_pos(-999,-999);
		g_editor_localsave_button.hide();

		g_editor_localload_text.update_pos(-999,-999);
		g_editor_localload_button.hide();

		

		for (var x = 0; x < this.play_state.grid_w; x++) {
			for (var y = 0; y < this.play_state.grid_h; y++) {
				this.play_state.blocks[this.play_state.tiles[x][y]].show_grid = false;
				this.play_state.blocks[this.play_state.tiles[x][y]].editor_mode = 0;
			}
		}
	},

	test_x: 0,
	test_y: 0,

	retrim_x: 0,
	retrim_y: 0,

	localsave_x: 0,
	localsave_y: 0,

	
	localload_x: 0,
	localload_y: 0,

	hide_upload: false,

	screen_resized: function() {
		if (this.hide_upload == false) {
			this.upload_x = screen_width - 64;
			this.upload_y = 64;
		} else this.upload_y = - 999;

		this.test_x = screen_width - 64;
		this.test_y = 128 + 64;

		this.retrim_x = screen_width - 64;
		this.retrim_y = 128 + 64 + 128;

		this.localsave_x = -999-screen_width - 64;
		this.localsave_y = -999-screen_height - 128 - 64;

		this.localload_x = - 999 - screen_width - 64;
		this.localload_y = - 999 - screen_height - 64;
	
		g_editor_upload_button.update_pos(this.upload_x, this.upload_y);

		g_editor_upload_text.update_pos(this.upload_x, this.upload_y + 32);
		g_editor_upload_text.center_x(this.upload_x);

		g_editor_retrim_button.update_pos(this.retrim_x, this.retrim_y);

		g_editor_retrim_text.update_pos(this.retrim_x, this.retrim_y + 32);
		g_editor_retrim_text.center_x(this.retrim_x);

		g_editor_test_button.update_pos(this.test_x, this.test_y);

		g_editor_test_text.update_pos(this.test_x, this.test_y + 32);
		g_editor_test_text.center_x(this.test_x);

		g_editor_localsave_button.update_pos(this.localsave_x, this.localsave_y);

		g_editor_localsave_text.update_pos(this.localsave_x, this.localsave_y + 32);
		g_editor_localsave_text.center_x(this.localsave_x);

		g_editor_localload_button.update_pos(this.localload_x, this.localload_y);

		g_editor_localload_text.update_pos(this.localload_x, this.localload_y + 32);
		g_editor_localload_text.center_x(this.localload_x);

		
		g_editor_sprites_objs.make_vis();
	},

	handle_mouse_move: function(engine,x,y) {

		

		this.prev_highlighted_x = this.highlighted_x;
		this.prev_highlighted_y = this.highlighted_y;

		this.highlighted_x = Math.round((x - 0.5*this.play_state.tile_size)/ this.play_state.tile_size);
		this.highlighted_y = Math.round((y - 0.5*this.play_state.tile_size)/ this.play_state.tile_size);

		
		
	},

	trims_to_do: 0,
	trim_cooldown: 0,

	update: function () {
		if (this.solving == true) {
			g_generator_class.do_step();
			this.solving = g_generator_class.solving();
			
		}

		if (this.trims_to_do > 0 && this.trim_cooldown > 0) {
			
			this.trim_cooldown--;
			if (this.trim_cooldown <= 0) {
				
				g_generator_class.trim(this, 35);

				
				this.trim_cooldown = 800;
				this.trims_to_do--;

				
				if (g_generator_class.success == false) return;
			
				this.export_to_json_colour();

			}
		}
	},

	solving: false,
	solve_tries: 1,

	handle_mouse_up: function(engine,x,y) {
		this.mouse_down = false;
		//if (x < this.play_state.grid_w*this.play_state.tile_size &&
		//	y < this.play_state.grid_h*this.play_state.tile_size) return;

		g_editor_sprites_objs.click(mouse.x, mouse.y);

		if (mouse.x > this.upload_x - 25 &&
		    mouse.x < this.upload_x + 25 &&
		    mouse.y > this.upload_y - 25 &&
		    mouse.y < this.upload_y + 25) {

			this.upload_y -= 1200;
			this.hide_upload = true;
			this.screen_resized();

			//g_generator_class.export_to_localstorage();

			//this.solving = true;

		
			//g_generator_class.bg_colour = g_editor_sprites_objs.build_codes[g_editor_sprites_objs.selected];
			
			//g_generator_class.setup_level(this);
			g_generator_class.go(this);

			if (g_generator_class.success == false) return;

			this.trim_cooldown = 120;
			this.trims_to_do = 0;

			// save to file
			
			
			this.export_to_json_colour();

			return;
		} else if (mouse.x > this.retrim_x - 25 &&
		    mouse.x < this.retrim_x + 25 &&
		    mouse.y > this.retrim_y - 25 &&
		    mouse.y < this.retrim_y + 25) {

			this.upload_y -= 1200;
			this.screen_resized();

			//g_generator_class.export_to_localstorage();

			//this.solving = true;

			
			//g_generator_class.bg_colour = g_editor_sprites_objs.build_codes[g_editor_sprites_objs.selected];
			
			//g_generator_class.setup_level(this);
			g_generator_class.trim(this, 15);

			if (g_generator_class.success == false) return;

			// save to file
			
			
			this.export_to_json_colour();

			return;
		}

		if (mouse.x > this.test_x - 25 &&
		    mouse.x < this.test_x + 25 &&
		    mouse.y > this.test_y - 25 &&
		    mouse.y < this.test_y + 25) {
			
			this.load_saved();
			return;
		}

	},

	delete_tile: function(x,y) {
		this.play_state.change_tile(this.highlighted_x,this.highlighted_y,0);

	

		
	},

	recalc_hints: function() {
		for (var x = 0; x < this.play_state.grid_w; x++) {
			for (var y = 0; y < this.play_state.grid_h; y++) {

				if (this.play_state.blocks[this.play_state.tiles[x][y]].covered_up == false) {
					// recalc hints
					this.play_state.blocks[this.play_state.tiles[x][y]].cover();
					this.play_state.blocks[this.play_state.tiles[x][y]].uncover();
				}
			}
		}
	},

	localload : function () {
		


	},

	localsave : function () {
		

	},

	// single level per file
	// ill write another script to combine them or whatever
	export_to_json_colour: function () {
		//console.log('TODO : export_to_json_colour ... rewrite for nonograms++');
		return;
		var json_obj = {};
		json_obj.floor = [];

		// whatever colour is selected -> background
		//var bg_colour = g_editor_sprites_objs.build_codes[g_editor_sprites_objs.selected];

		for (var y = 0; y < this.play_state.level_h + 1; y++) {
			for (var x = 0; x < this.play_state.level_w + 1; x++) {
			
				if (x > 0 && y > 0) {
					json_obj.floor.push(this.play_state.get_json_level_code(x - 1, y - 1));
				} else if (x == 0 && y > 0) {
					json_obj.floor.push(this.play_state.get_json_level_code(-1, y - 1));
				} else if (y == 0 && x > 0) {
					json_obj.floor.push(this.play_state.get_json_level_code(x - 1, -1));
				} else json_obj.floor.push(0);
			}
		}

		json_obj.colour = [];
		for (var y = 0; y < this.play_state.level_h; y++) {
			for (var x = 0; x < this.play_state.level_w; x++) {
			
				var col = this.play_state.blocks[this.play_state.tiles[x][y]].secret_colour;
				if (this.play_state.blocks[this.play_state.tiles[x][y]].block_type == 0) {
					col = bg_colour;
				}
				json_obj.colour.push(col);
			}
		}

		// 
		var milliseconds = new Date().getTime();

		var txtFile = "/" + milliseconds.toString() + ".txt";
		var str = JSON.stringify(json_obj);

 		var file = new File([str],txtFile);
		
 		//file.open("write"); // open file with write access
 		//file.write(str);
 		//file.close();

		// https://stackoverflow.com/questions/21012580/is-it-possible-to-write-data-to-file-using-only-javascript
		makeTextFile(str);
	},

	export_to_console_colour: function () {
		var json_obj = {};
		json_obj.floor = [];

		// whatever colour is selected -> background
		//var bg_colour = g_editor_sprites_objs.build_codes[g_editor_sprites_objs.selected];

		for (var y = 0; y < this.play_state.level_h + 1; y++) {
			for (var x = 0; x < this.play_state.level_w + 1; x++) {
			
				if (x > 0 && y > 0) {
					json_obj.floor.push(this.play_state.get_json_level_code(x - 1, y - 1));
				} else if (x == 0 && y > 0) {
					json_obj.floor.push(this.play_state.get_json_level_code(-1, y - 1));
				} else if (y == 0 && x > 0) {
					json_obj.floor.push(this.play_state.get_json_level_code(x - 1, -1));
				} else json_obj.floor.push(0);
			}
		}

		json_obj.colour = [];
		for (var y = 0; y < this.play_state.level_h; y++) {
			for (var x = 0; x < this.play_state.level_w; x++) {
			
				var col = this.play_state.blocks[this.play_state.tiles[x][y]].secret_colour;
				if (this.play_state.blocks[this.play_state.tiles[x][y]].block_type == 0) {
					col = bg_colour;
				}
				json_obj.colour.push(col);
			}
		}

		// 
		var milliseconds = new Date().getTime();

		var txtFile = "/" + milliseconds.toString() + ".txt";
		var str = JSON.stringify(json_obj);

 		var file = new File([str],txtFile);
		
 		//file.open("write"); // open file with write access
 		//file.write(str);
 		//file.close();

		// https://stackoverflow.com/questions/21012580/is-it-possible-to-write-data-to-file-using-only-javascript
		//makeTextFile(str);
	},

	export_to_json_monochrome: function () {
		
	},

	load_saved () {
		var floor_str = localStorage.getItem("puzzlebrush_editor_floor");
		var colour_str = localStorage.getItem("puzzlebrush_editor_colour");

		var floor_array = JSON.parse(floor_str);//floor_str.split("a");	// '1a2a3a6' ... ['1','2','3','6']
		var colour_array = JSON.parse(colour_str);//colour_str.split("a");

		

		var x = 0;
		var y = 0;

		var floor = [];
		var row = [];
		var colour = [];

		for (t in floor_array) {
			var floortile = floor_array[t];//Number(floor_array[t]);
			//var colourtile = Number(colour_array[t]);

			row.push(floortile);
			//colour.push(colourtile);

			x++;
			if (x >= this.play_state.level_w) {
				x = 0;
				y++;
				floor.push(row.slice(0));
				row = [];
			}
		}

		
		// load_level_internal : function(p_matrix, mapdata_version_mines, p_colour_matrix)
		this.play_state.load_level_internal (floor, 1, colour_array);

		for (var x = 0; x < this.play_state.level_w; x++) {
			for (var y = 0; y < this.play_state.level_h; y++) {
				this.play_state.blocks[this.play_state.tiles[x][y]].put_flag_on(this.play_state.blocks[this.play_state.tiles[x][y]].block_colour);
				this.play_state.blocks[this.play_state.tiles[x][y]].calc_hint(this.play_state.blocks[this.play_state.tiles[x][y]].symbol_type);
				this.play_state.blocks[this.play_state.tiles[x][y]].calc_sprite();
			}
		}
	},

	mouse_down: false,

	handle_mouse_down: function(engine,x,y) {

		

		this.handle_mouse_move(engine,x,y);

		//console.log(this.highlighted_x + " " + this.highlighted_y);

		

		if (this.highlighted_x < 0 || 
		    this.highlighted_x >= this.play_state.level_w ||
		    this.highlighted_y < 0 || 
		    this.highlighted_y >= this.play_state.level_h) return;

		


		var tiletype = g_editor_sprites_objs.build_codes[g_editor_sprites_objs.selected];

		var tilecode = this.play_state.enum_to_tilecode(tiletype);

		if (tilecode == GameTypes.Tiles.EMPTY) this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].reset();
		
		this.play_state.set_tile_from_tilecode(this.highlighted_x, this.highlighted_y, tilecode);

		//console.log(tiletype + " tiletype " );


		this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].make_vis();
		this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].calc_sprite();
		this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].make_vis();

		//var colour_ = g_editor_sprites_objs.build_codes[g_editor_sprites_objs.selected];

		return;

		if (this.mouse_down == false && this.play_state.is_in_level(this.highlighted_x,this.highlighted_y) == true &&
			g_editor_sprites_objs.selected == 0) {
				

			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].mine_multi = 1;
			this.play_state.change_tile(this.highlighted_x,this.highlighted_y,0);
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].put_x_on();
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].calc_sprite();

		} else if (this.mouse_down == false && this.play_state.is_in_level(this.highlighted_x,this.highlighted_y) == true &&
			g_editor_sprites_objs.selected > 0) {
			
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].mine_multi = 1;
			this.play_state.change_tile(this.highlighted_x,this.highlighted_y,2);
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].put_flag_on();
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].calc_sprite();
		}

		//if (this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].block_type != 0) alert('MINE');

		return;

		if (this.mouse_down == false && this.play_state.is_in_level(this.highlighted_x,this.highlighted_y) == true) {
			this.mouse_down = true;
			this.parent_tile_this_swipe = this.play_state.tiles[this.highlighted_x][this.highlighted_y];
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].preset_hint(GameTypes.PixelClues.ZAP);
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].zap_block_colour = colour_;
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].block_colour = this.parent_tile_this_swipe;
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].flag_colour = this.parent_tile_this_swipe;
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].calc_hint(GameTypes.PixelClues.ZAP);	// just to put flag on
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].calc_sprite();
		}


		
		if (false && colour_ == 0) {

			
			this.delete_tile(this.highlighted_x,this.highlighted_y);
			//this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].
			
		} else if (colour_ < g_editor_sprites_objs.build_codes.length) {
			// set colour
			this.play_state.change_tile(this.highlighted_x,this.highlighted_y,2);
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].block_colour = flag_colour;
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].flag_colour = flag_colour;

			//alert(colour_);
		}

		

		//this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].colour_mode = true;
		if (this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].block_type == 2) this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].put_flag_on(flag_colour);
		else this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].put_x_on();

		
		return;

		if (g_editor_sprites_objs.build_codes[g_editor_sprites_objs.selected] == 0) {

			
			this.delete_tile(this.highlighted_x,this.highlighted_y);
			//this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].
			
		} else if (g_editor_sprites_objs.build_codes[g_editor_sprites_objs.selected] == 1) {
	
			
		this.delete_tile(this.highlighted_x,this.highlighted_y);

			this.play_state.change_tile(this.highlighted_x,this.highlighted_y,1);
			//this.play_state.set_clue(this.highlighted_x,this.highlighted_y, 0);

		} else if (g_editor_sprites_objs.build_codes[g_editor_sprites_objs.selected] == 2) {

			
		this.delete_tile(this.highlighted_x,this.highlighted_y);

			this.play_state.change_tile(this.highlighted_x,this.highlighted_y,2);
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].cover();
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].put_flag_on();
			//this.play_state.set_clue(this.highlighted_x,this.highlighted_y, 0);

		} else if (g_editor_sprites_objs.build_codes[g_editor_sprites_objs.selected] == 3) {

			if (this.play_state.get_block_type(this.highlighted_x,this.highlighted_y) == 2) this.delete_tile(this.highlighted_x,this.highlighted_y);

			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].cover();

		} else if (g_editor_sprites_objs.build_codes[g_editor_sprites_objs.selected] == 4) {

			
			//
			if (this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].covered_up == true) cover_up = 1;
			this.delete_tile(this.highlighted_x,this.highlighted_y);


			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].preset_hint(1);
	
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].cover();
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].uncover();
			
			// 4 touch
		} else if (g_editor_sprites_objs.build_codes[g_editor_sprites_objs.selected] == 5) {

		

			if (this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].covered_up == true) cover_up = 1;
	
			this.delete_tile(this.highlighted_x,this.highlighted_y);


			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].preset_hint(2);    // eye
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].cover();
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].uncover();
		} else if (g_editor_sprites_objs.build_codes[g_editor_sprites_objs.selected] == 49) {

		

			if (this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].covered_up == true) cover_up = 1;
	
			this.delete_tile(this.highlighted_x,this.highlighted_y);


			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].preset_hint(49);    // zap
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].cover();
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].uncover();
		} else if (g_editor_sprites_objs.build_codes[g_editor_sprites_objs.selected] == 80) {

		

			if (this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].covered_up == true) cover_up = 1;
	
			this.delete_tile(this.highlighted_x,this.highlighted_y);


			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].preset_hint(80);    // totalnum
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].cover();
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].uncover();
		} else if (g_editor_sprites_objs.build_codes[g_editor_sprites_objs.selected] == 6) {

			

			if (this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].covered_up == true) cover_up = 1;
			this.delete_tile(this.highlighted_x,this.highlighted_y);

			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].preset_hint(4);    // 8 touch
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].cover();
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].uncover();
		}  else if (g_editor_sprites_objs.build_codes[g_editor_sprites_objs.selected] == 10) {

			// heart

			if (this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].covered_up == true) cover_up = 1;
			this.delete_tile(this.highlighted_x,this.highlighted_y);

			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].preset_hint(5);    // 
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].cover();
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].uncover();
		} else if (g_editor_sprites_objs.build_codes[g_editor_sprites_objs.selected] == 11) {

			// compass
			//

			if (this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].covered_up == true) cover_up = 1;

			this.delete_tile(this.highlighted_x,this.highlighted_y);

			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].preset_hint(11);    // 
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].cover();
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].uncover();
		} else if (g_editor_sprites_objs.build_codes[g_editor_sprites_objs.selected] == 12) {

			// crown

			if (this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].covered_up == true) cover_up = 1;
			this.delete_tile(this.highlighted_x,this.highlighted_y);

			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].preset_hint(12);    // 
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].cover();
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].uncover();
		} else if (g_editor_sprites_objs.build_codes[g_editor_sprites_objs.selected] == 13) {

			// eyebracket

			if (this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].covered_up == true) cover_up = 1;
			this.delete_tile(this.highlighted_x,this.highlighted_y);

			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].preset_hint(13);    // 
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].cover();
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].uncover();
		} else if (g_editor_sprites_objs.build_codes[g_editor_sprites_objs.selected] == 7) {

			
			// join to left
			if (this.highlighted_x > 0 && this.check_unjoined(this.highlighted_x, this.highlighted_y, this.highlighted_x-1, this.highlighted_y) == true) {
				this.delete_tile(this.highlighted_x,this.highlighted_y);
				this.play_state.join_tiles(this.highlighted_x, this.highlighted_y, this.highlighted_x-1, this.highlighted_y);

			}
			
		} else if (g_editor_sprites_objs.build_codes[g_editor_sprites_objs.selected] == 8) {
			
			
			// join to up
			if (this.highlighted_y > 0 && this.check_unjoined(this.highlighted_x, this.highlighted_y, this.highlighted_x, this.highlighted_y - 1) == true) {
				this.delete_tile(this.highlighted_x,this.highlighted_y);
				this.play_state.join_tiles(this.highlighted_x, this.highlighted_y, this.highlighted_x, this.highlighted_y - 1);
				
			}

		} else if (g_editor_sprites_objs.build_codes[g_editor_sprites_objs.selected] == 26) {

		

			if (this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].covered_up == true) cover_up = 1;
	
			this.delete_tile(this.highlighted_x,this.highlighted_y);



			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].set_sharesquare_code(26);

			this.play_state.calc_share_groups();
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].cover();
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].uncover();
		} else if (g_editor_sprites_objs.build_codes[g_editor_sprites_objs.selected] == 31) {

		

			if (this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].covered_up == true) cover_up = 1;
	
			this.delete_tile(this.highlighted_x,this.highlighted_y);


			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].set_sharesquare_code(31);

			this.play_state.calc_share_groups();
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].cover();
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].uncover();
		} else if (g_editor_sprites_objs.build_codes[g_editor_sprites_objs.selected] >= 17 && 
			   g_editor_sprites_objs.build_codes[g_editor_sprites_objs.selected] <= 32) {

			if (this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].covered_up == true) cover_up = 1;
	
			this.delete_tile(this.highlighted_x,this.highlighted_y);

			var code_ = g_editor_sprites_objs.build_codes[g_editor_sprites_objs.selected];
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].set_sharesquare_code(code_);

			this.play_state.calc_share_groups();
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].cover();
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].uncover();

		}

		if (cover_up == 1) this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].cover();

	},

	// for now, level editor can make only 2-blue rectangles
	// and only certain hints (eye heart touch 8touch)
	check_unjoined: function (x, y, xx, yy) {
		if (this.play_state.joined_tiles[x][y] != 0) return false;
		if (this.play_state.joined_tiles[xx][yy] != 0) return false;
		var hint_ = this.play_state.blocks[this.play_state.tiles[xx][yy]].preset_hint_type;
		if (hint_ != 1 && hint_ != 2 && hint_ != 5 && hint_ != 4) return false;
		return true;
	}

});




//g_playtomiclevel = "";

g_overworld_sprites = null;



load_all_level_status = function(status) {
	
};

g_overworld_corner_sprite = null;
g_overworld_text = null;

g_overworld_fb_button = null;
g_overworld_fb_text = null;

g_overworld_left_button = null;
g_overworld_right_button = null;

g_overworld_left_text = null;
g_overworld_right_text = null;

g_overworld_to_app_button = null;
g_overworld_to_app_text = null;

g_overworld_to_show =  0;
// 0 is levels 1 to 30
// 1 is levels 31 to 60
// 4 is levels 61 to 90
// 3 is challenge levels
// g_overworld_to_show >= 5 : level = (g_overworld_to_show - 2)*30 + 1


g_challenge_levels_page = 0;




g_world_app_cutoff = 7;
g_levels_done_first_world = [];	// first world unlocked?
g_level_progress_world = [];
g_level_totalnum_world = [];	// size of world
g_world_names = [];
g_world_images = [];
g_world_level_app_cutoff = [];
g_worldlist_pos_has_world = [];
for (var i = 0; i < g_num_worlds; i++) {
	var progress = 0;
	if (g_servermode == true) progress = 999;
	g_level_progress_world.push(progress);		// world i
	g_level_totalnum_world.push(0);		// world i - we dont know the size yet	
	g_world_names.push("WORLD " + (i+1).toString());
	g_world_images.push("levelpack.png");
	g_world_level_app_cutoff.push(9999);
}

g_level_totalnum_world[0] = 10;
g_level_totalnum_world[1] = 10; // challenge
g_level_totalnum_world[2] = 20; // test 2-lock
g_level_totalnum_world[3] = 10; // keydoor
g_level_totalnum_world[4] = 20; // lockout
g_level_totalnum_world[5] = 20;
g_level_totalnum_world[6] = 20;
g_level_totalnum_world[7] = 10;
g_level_totalnum_world[8] = 30;
g_level_totalnum_world[9] = 90;


g_worldlist_pos_has_world[0] = 0;
g_worldlist_pos_has_world[1] = 3;//1;
g_worldlist_pos_has_world[2] = 4;//2;
g_worldlist_pos_has_world[3] = 5;//3; // doubles
g_worldlist_pos_has_world[4] = 6;//4; 
g_worldlist_pos_has_world[5] = 7; // challenge 2.0
g_worldlist_pos_has_world[6] = 1; //
g_worldlist_pos_has_world[7] = 8; // doubles
g_worldlist_pos_has_world[8] = 9; // challenge 3.0
g_worldlist_pos_has_world[9] = 10; // DETIAL_COUNT
g_worldlist_pos_has_world[10] = 11; // DETIAL_COUNT
g_worldlist_pos_has_world[11] = 12; // DETIAL_COUNT
g_worldlist_pos_has_world[12] = 13; // DETIAL_COUNT

g_world_names[0] = "INTRO";
g_world_names[1] = "CHALLENGE LEVELS (TURNER + LOCKOUT)";
g_world_names[2] = "2-LOCKOUTS";
// LEVEL PACK 1.3 - HARDER - interstitial qns
g_world_names[3] = "KEYS";	
// CRYPTIC CLUES - HARD ... 
// BRACKETS HARD ... etc
g_world_names[4] = "LOCKOUT";
g_world_names[5] = "BRIDGES";	// app cutoff early
g_world_names[8] = "APP ONLY";	// app cutoff early
g_world_names[6] = "TURNERS";			// app cutoff early
g_world_names[7] = "MEDIUM LEVELS (TURNER + LOCKOUT)";
g_world_names[13] = "COMING LATER (APP)";	// fully app only
g_world_names[9] = "APP ONLY";	// 
g_world_names[10] = "COMING LATER (APP)";
g_world_names[11] = "COMING LATER (APP)";
g_world_names[12] = "COMING LATER (APP)";

g_world_images[0] = "lineA_inv.png";
g_world_images[3] = "redkey_inv.png";//"nono_bracket_right.png";
g_world_images[4] = "lockout_locked.png";//"heart.png";
g_world_images[5] = "bridgetile.png";
g_world_images[9] = "lockout_locked2.png";
g_world_images[6] = "turner.png";
g_world_images[8] = "bubbletile.png";
g_world_images[10] = "qcatred.png";
g_world_images[11] = "greendiamond.png";
g_world_images[12] = "redbluehoopicon.png";
g_world_images[13] = "purpgreenhoopicon.png";

//g_world_level_app_cutoff[1] = 20;
//g_world_level_app_cutoff[5] = 10;
//g_world_level_app_cutoff[6] = 10;


NewOverworldStateClass = GameStateClass.extend({
	play_state: null,
	engine: null,

	left_arrow_x: 0,
	left_arrow_y: 0,
	right_arrow_x: 0,
	right_arrow_y: 0,

	app_x: 0,
	app_y: 0,
	clicked_app: false,

	init: function(engine, play_state) {

		play_screen_container.hide();//;
		tilebackground_group.hide();

		//play_screen_group.set_y(-1300);
		//play_screen_group.set_x(-1300);

		this.engine = engine;
		this.play_state = play_state;

		//this.play_state.set_vis_level_size(10,10);
		//g_level_size++;		// controls zoom
		//g_level_w++;		// controls centering
		//do_resize();

		level_ratio = 1;
		level_x_shift = 0;

		this.play_state.resize();	// after calc edges - need to know sizes
		
		this.play_state.hide_bg_squares();

		g_top_nono_size = 0;
		g_left_nono_size = 0;
		g_level_size = 13; g_level_w = 13;
		g_level_h = 13;
		//g_level_
		do_resize();

		if (g_overworld_sprites == null) {

			g_overworld_sprites = new OverworldSpritesClassReuseable(this.play_state);

			g_overworld_text = new TextClass(Types.Layer.GAME_MENU);
			g_overworld_text.set_font(Types.Fonts.SMALL);
			g_overworld_text.set_text("G_OVERWORLD TEXT");

			
			g_overworld_to_app_button = new SpriteClass();
			g_overworld_to_app_button.setup_sprite('cherry.png',Types.Layer.HUD);

			g_overworld_to_app_text = new TextClass(Types.Layer.HUD);
			g_overworld_to_app_text.set_font(Types.Fonts.XSMALL);
			g_overworld_to_app_text.set_text("GET THE FREE APP (MORE LEVELS!)");
			

			
		}

		if (g_overworld_right_button == null) {
			g_overworld_left_button = new SpriteClass();
			g_overworld_left_button.setup_sprite('leftarrow.png',Types.Layer.GAME_MENU);

			g_overworld_right_button = new SpriteClass();
			g_overworld_right_button.setup_sprite('rightarrow.png',Types.Layer.GAME_MENU);

			g_overworld_left_text =  new TextClass(Types.Layer.GAME_MENU);
			g_overworld_left_text.set_font(Types.Fonts.SMALL);
			g_overworld_left_text.set_text("PREV");

			g_overworld_right_text =  new TextClass(Types.Layer.GAME_MENU);
			g_overworld_right_text.set_font(Types.Fonts.SMALL);
			g_overworld_right_text.set_text("NEXT");
		}

		// show the levels to select...
		// on mouse up - check what level was selected

		//var d = new Date();
 			//d.setDate(d.getDate()-5000);

		var pagenum = 0;

		this.load_page(pagenum);

		g_overworld_left_text.hide();
		g_overworld_right_text.hide();
		
		g_overworld_sprites.make_vis();

		g_overworld_left_button.make_vis();
		g_overworld_right_button.make_vis();

		g_overworld_text.update_pos(16,16);	

		g_overworld_to_app_button.make_vis();
		g_overworld_to_app_text.make_vis();

		this.screen_resized();

	},

	pagenum: 0,

	load_page: function(pagenum) {

		
		this.pagenum = pagenum;
		

		var hardness_name = "";
		if (this.play_state.current_world == 0) hardness_name = "INTRO";
		if (this.play_state.current_world == 1) hardness_name = "VERY EASY";
		if (this.play_state.current_world == 2) hardness_name = "EASY";
		if (this.play_state.current_world == 3) hardness_name = "MEDIUM";
		if (this.play_state.current_world == 4) hardness_name = "HARD";
		//else hardness_name = "";

		hardness_name = g_world_names[this.play_state.current_world];

		var pagenum_plus_one = pagenum + 1;

		g_overworld_text.change_text(hardness_name + ' LEVELS - PAGE ' + pagenum_plus_one);

		

		g_overworld_sprites.reset();

		

		var progress = 0;
		progress = g_level_progress_world[this.play_state.current_world];

	

		

		for (var d = 30*pagenum; d < 30*pagenum + 30; d++) {
			var text = d + 1;

			if (d >= g_level_totalnum_world[this.play_state.current_world]) break;

			var sprname = null;

			if (this.play_state.current_world == 0) {
				//if (d == 0) sprname = "nono_group.png"; 
				//if (d == 20) sprname = "detail_single.png"; 
				//if (d == 41) sprname = "gap_size.png"; 
				//if (d == 52) sprname = "nono_link.png"; 
				//if (d == 70) sprname = "qn.png";// "nono_bracket_right.png"; 
				//if (d == 81) sprname = "qn.png"; 
				//if (d == 90) sprname = "double_bottom_yes.png"; 
				//if (d == 110) sprname = "select.png"; 
			} else if (this.play_state.current_world == 3) {
				//if (d == 10) sprname = "nono_bracket_right.png"; 
				//if (d == 0) sprname = "totalbox.png";
			}

			
		
			

			if (d >= g_world_level_app_cutoff[this.play_state.current_world]) {
				g_overworld_sprites.add_level(sprname, "APP");
				g_overworld_sprites.set_status(d - 30*pagenum, 3);
				continue;
			}

			g_overworld_sprites.add_level(sprname, text);

			if (progress < d) g_overworld_sprites.set_status(d - 30*pagenum, 3);
			if (progress > d) g_overworld_sprites.set_status(d - 30*pagenum, 4);

			

		}

		

		this.screen_resized();

		//g_overworld_sprites.put_text_on_side();

		g_overworld_sprites.make_vis();

			g_overworld_sprites.put_text_on_side();
		
	},

	cleanup: function () {

		g_overworld_to_app_button.hide();
		g_overworld_to_app_text.update_pos(-999, -999);


		g_overworld_sprites.hide();

		g_overworld_text.update_pos(-999, -999);

		g_overworld_left_button.hide();
		g_overworld_right_button.hide();

		g_overworld_left_text.update_pos(-999, -999);
		g_overworld_right_text.update_pos(-999, -999);

	},

	screen_resized: function () {

		this.app_y = 7*0.5*120 + 120;
		this.app_x = 120;

		if (!app_exists) this.app_x = -999;
		
		g_overworld_to_app_button.update_pos(this.app_x, this.app_y);
		g_overworld_to_app_text.update_pos(this.app_x + 40, this.app_y - 8);

		this.left_arrow_x = 128;//0.5*screen_width - 120;
		this.left_arrow_y = screen_height - 32;// - 120;
		this.right_arrow_x = screen_width - 64;//0.5*screen_width + 120;
		this.right_arrow_y = screen_height - 32;//screen_height - 120;

		//alert(this.month_since_epoch + ' ' + this.current_month);

		if (this.pagenum >= (g_level_totalnum_world[this.play_state.current_world] / 30) - 1) {
			this.right_arrow_x = -9999;
			this.right_arrow_y = -9999;
		}

		if (this.pagenum <= 0  ) {
			this.left_arrow_x = -9999;
			this.left_arrow_y = -9999;
		}

		
		


		g_overworld_left_button.update_pos(this.left_arrow_x, this.left_arrow_y);
		g_overworld_right_button.update_pos(this.right_arrow_x, this.right_arrow_y);

		

		

		g_overworld_sprites.make_vis();

		g_overworld_left_button.make_vis();
		g_overworld_right_button.make_vis();
		
		g_overworld_text.update_pos(16,16);	

		
	},

	mouse_down: false,

	handle_mouse_down: function(engine,x,y) {
		//if (this.mouse_down == false) g_overworld_sprites.start_drag(y);
		//this.mouse_down = true;
		//g_overworld_sprites.drag(y);

		if (x > this.app_x - 16 &&
		    x < this.app_x + 16 &&
		    y > this.app_y - 16 &&
		    y < this.app_y + 16 && this.clicked_app == false) {
			this.clicked_app = true;
			open_url(gettheapp_url); 
			return;
		}
	},

	handle_mouse_up: function(engine,x,y) {

		this.mouse_down = false;
		
		

		if (mouse.x > this.left_arrow_x - 16 &&
		    mouse.x < this.left_arrow_x + 16 &&
		    mouse.y > this.left_arrow_y - 16 &&
		    mouse.y < this.left_arrow_y + 16) {
			
			if (this.pagenum == 0) {
				return;
			}
			this.load_page(this.pagenum - 1);
			//g_overworld_sprites.make_vis();
			//g_overworld_sprites.put_text_on_side();
			return;
		} else if (mouse.x > this.right_arrow_x - 16 &&
		   	   mouse.x < this.right_arrow_x + 16 &&
		    	   mouse.y > this.right_arrow_y - 16 &&
		    	   mouse.y < this.right_arrow_y + 16) {
			
			this.load_page(this.pagenum + 1);
			
			return;
		}


		g_overworld_sprites.click(x,y);

		if (g_overworld_sprites.selected == -1) return;

		

		this.play_state.game_mode = 0;	//
		this.play_state.current_level = g_overworld_sprites.selected + this.pagenum*30;

		g_tut_content = g_tut_content_for_world[this.play_state.current_world];

		if (g_tut_content[this.play_state.current_level] != null) {
				
			this.play_state.game_mode = 5;
			this.change_state(this.engine, new LoadInstructionStateClass(this.engine, this.play_state));
			return;
		}
			
		this.change_state(this.engine, new LoadingLevelStateClass(this.engine, this.play_state, this.play_state.current_level));

		
		
		
		
	}

});



tozblip_url = 'http://www.zblip.com';	//	app	appinfo	   gettheapp	... thinking bout SEO
							// or ' https://www.zblip.com/puzzlebrush '
							// put the webgame at https://www.zblip.com/puzzlebrush/play
gettheapp_url = 'http://www.zblip.com/misterline';

go_to_fb = function() {
		window.open('https://www.facebook.com/mathsweeper/');
};





g_credits_title = null;
g_credits_subtitle = null;

g_credits = "We have used the following open source projects / code: \nphaser.js \nCopyright © 2017 Richard Davey, Photon Storm Ltd. \nPhaser is distributed under the MIT License.\nhttps://phaser.io/download/license\n\nClass object based on John Resig's code;inspired by base2 and Prototype\nhttp://ejohn.org/blog/simple-javascript-inheritance/ \nFont used is Montserrat. SIL Open Font License \nSocial media icons (Facebook, Twitter) are from \nhttps://paulrobertlloyd.com/2009/06/social_media_icons \n UI icons are from http://google.github.io/material-design-icons/ under the Apache License Version 2.0. \n ";

CreditsStateClass = GameStateClass.extend({

	play_state: null,
	engine: null,

	init: function(engine, play_state){
		this.play_state = play_state;
		this.engine = engine;

		play_screen_container.hide();//;
		tilebackground_group.hide();

		if (g_credits_title == null) {

			g_credits_title = new TextClass(Types.Layer.GAME_MENU);
			g_credits_title.set_font(Types.Fonts.MEDIUM);
			g_credits_title.set_text("CREDITS");

			g_credits_subtitle = new TextClass(Types.Layer.GAME_MENU);
			g_credits_subtitle.set_font(Types.Fonts.XSMALL);
			g_credits_subtitle.set_text(g_credits);

		}
	

		this.screen_resized();

	},

	cleanup: function() {

		g_credits_title.update_pos(-999,-999);
		g_credits_subtitle.update_pos(-999,-999);

		play_screen_container.make_vis();//;
		
	},


	screen_resized: function () {

		g_credits_title.update_pos(32,32);
		g_credits_subtitle.update_pos(32,64);

	},

	handle_mouse_up: function(engine,x,y) {

		

	}

});


challenge_select_header = null;
challenge_select_subheader = null;
world_select_buttons = [];
world_select_texts = [];

ChallengeLevelsSelectHardness = GameStateClass.extend({
	play_state: null,
	engine: null,

	left_arrow_x: 0,
	left_arrow_y: 0,
	right_arrow_x: 0,
	right_arrow_y: 0,

	init: function(engine, play_state) {
		this.play_state = play_state;
		this.engine = engine;
	
		play_screen_container.hide();//;
		background_container.hide();//;		
		tilebackground_group.hide();
		if (challenge_select_header == null) {
			challenge_select_header = new TextClass(Types.Layer.GAME_MENU);
			challenge_select_header.set_font(Types.Fonts.SMALL);
			challenge_select_header.set_text("");

			challenge_select_subheader = new TextClass(Types.Layer.GAME_MENU);
			challenge_select_subheader.set_font(Types.Fonts.XSMALL);
			challenge_select_subheader.set_text("");

			// 6 worlds per page!
			for (var w = 0; w < 6; w++) {
				var button = new SpriteClass();
				button.setup_sprite("button_first.png",Types.Layer.GAME_MENU);
				world_select_buttons.push(button);

				var text = new TextClass(Types.Layer.GAME_MENU);
				text.set_font(Types.Fonts.XSMALL);
				text.set_text("world name");
				world_select_texts.push(text);
			}

			

			
		}

		

		if (g_overworld_right_button == null) {
			g_overworld_left_button = new SpriteClass();
			g_overworld_left_button.setup_sprite('leftarrow.png',Types.Layer.GAME_MENU);

			g_overworld_right_button = new SpriteClass();
			g_overworld_right_button.setup_sprite('rightarrow.png',Types.Layer.GAME_MENU);

			g_overworld_left_text =  new TextClass(Types.Layer.GAME_MENU);
			g_overworld_left_text.set_font(Types.Fonts.SMALL);
			g_overworld_left_text.set_text("PREV");

			g_overworld_right_text =  new TextClass(Types.Layer.GAME_MENU);
			g_overworld_right_text.set_font(Types.Fonts.SMALL);
			g_overworld_right_text.set_text("NEXT");
		}

		g_overworld_left_text.hide();
		g_overworld_right_text.hide();
		g_overworld_left_button.make_vis();
		g_overworld_right_button.make_vis();


		for (var w = 0; w < 6; w++) {
			world_select_buttons[w].make_vis();
			world_select_texts[w].make_vis();
		}

		
		var pagenum = 0;

		this.load_page(pagenum);
	

		this.screen_resized();
	},

	cleanup : function () {
		challenge_select_subheader.update_pos(-999,-999);
		challenge_select_header.update_pos(-999,-999);

		for (var w = 0; w < 6; w++) {
			world_select_buttons[w].hide();
			world_select_texts[w].hide();
		}

		g_overworld_left_text.hide();
		g_overworld_right_text.hide();
		g_overworld_left_button.hide();
		g_overworld_right_button.hide();
	},

	button_x: [6],
	button_y: [6],

	pagenum: 0,

	load_page: function(pagenum) {
		this.pagenum = pagenum;

		for (var w = 0; w < 6; w++) {
			world_select_buttons[w].hide();
			world_select_texts[w].hide();
		}
	
		
		var w = 0;

		for (var d = 6*pagenum; d < 6*pagenum + 6; d++) {
			if (d >= g_num_worlds) break;

			var world_id = g_worldlist_pos_has_world[d];

			world_select_buttons[w].make_vis();
			world_select_buttons[w].set_texture(g_world_images[world_id]);
			world_select_texts[w].make_vis();

			var web_levels = Math.min(g_world_level_app_cutoff[world_id], g_level_totalnum_world[world_id]);

			world_select_texts[w].change_text(g_world_names[world_id] + "\n" + g_level_progress_world[world_id] + "/" + web_levels);
			if (g_level_progress_world[world_id] == undefined) {
				
			}

			if (d >=  g_world_app_cutoff) {
				world_select_texts[w].change_text(g_world_names[world_id] + "\n" + "APP ONLY");
			}
			w++;
			
		}

		this.screen_resized();
	},

	screen_resized: function() {
		challenge_select_header.update_pos(16,16);
		challenge_select_subheader.update_pos(16,16 + 32);
		if (screen_width > 2*screen_height) {
			for (var w = 0; w < 6; w++) {
				this.button_x[w] = 50;//screen_height*0.25;
				this.button_y[w] = screen_height*((w + 0.5)/7);
			}
			
		} else {
			for (var w = 0; w < 6; w++) {
				this.button_x[w] = 50;//screen_height*0.25;
				this.button_y[w] =  screen_height*((w + 0.5)/7);
			}
		}

		for (var w = 0; w < 6; w++) {
			world_select_buttons[w].update_pos(this.button_x[w], this.button_y[w]);
			world_select_texts[w].update_pos(this.button_x[w] + 75, this.button_y[w] - 10);
			//world_select_texts[w].center_x(this.button_x[w]);
		}

		this.left_arrow_x = 128;//0.5*screen_width - 120;
		this.left_arrow_y = screen_height - 64;// - 120;
		this.right_arrow_x = screen_width - 64;//0.5*screen_width + 120;
		this.right_arrow_y = screen_height - 64;//screen_height - 120;

		//alert(this.month_since_epoch + ' ' + this.current_month);

		if (this.pagenum >= (g_num_worlds / 6) - 1) {
			this.right_arrow_x = -9999;
			this.right_arrow_y = -9999;
		}

		if (this.pagenum <= 0  ) {
			this.left_arrow_x = -9999;
			this.left_arrow_y = -9999;
		}

		g_overworld_left_button.update_pos(this.left_arrow_x, this.left_arrow_y);
		g_overworld_right_button.update_pos(this.right_arrow_x, this.right_arrow_y);
		
	},

	handle_mouse_up: function(engine,x,y) {

		for (var w = 0; w < 6; w++) {
			if (mouse.x > this.button_x[w] - 50 &&
		    mouse.x < this.button_x[w] + 50 &&
		    mouse.y > this.button_y[w] - 19 &&
		    mouse.y < this.button_y[w] + 19) {
				if (w + this.pagenum*6 >= g_num_worlds) return;
				if (w + this.pagenum*6 >=  g_world_app_cutoff) return;
	
				this.play_state.current_world = g_worldlist_pos_has_world[w + this.pagenum*6];
				this.play_state.game_mode = 0;
				this.change_state(this.engine, new NewOverworldStateClass(this.engine, this.play_state));
			}
		}
	
		
		
		if (mouse.x > this.left_arrow_x - 16 &&
		    mouse.x < this.left_arrow_x + 16 &&
		    mouse.y > this.left_arrow_y - 16 &&
		    mouse.y < this.left_arrow_y + 16) {
			
			if (this.pagenum == 0) {
				return;
			}
			this.load_page(this.pagenum - 1);
			return;
		} else if (mouse.x > this.right_arrow_x - 16 &&
		   	   mouse.x < this.right_arrow_x + 16 &&
		    	   mouse.y > this.right_arrow_y - 16 &&
		    	   mouse.y < this.right_arrow_y + 16) {
			
			this.load_page(this.pagenum + 1);
			return;
		}

	}

	
});


g_puzzlebrush_title = null;
g_puzzlebrush_title2 = null;
g_puzzlebrush_title_img = null;

g_first_time_button = null;
g_first_time_text = null;

g_menu_to_overworld_button = null;
g_menu_to_overworld_text = null;

g_menu_to_randgen_button = null;
g_menu_to_randgen_text = null;

g_menu_to_daily_button = null;
g_menu_to_daily_text = null;

// game_cannot_save  == true
g_menu_cannot_save_text = null;

g_menu_to_app_button = null;
g_menu_to_app_text = null;

g_menu_to_comm_lvl_button = null;
g_menu_to_comm_lvl_text = null;

g_menu_zblipdotcom_text = null;

//g_spash_image = null;


g_bitmap_menu_bg = null;

g_menu_fb_button = null;
g_menu_twitter_button = null;
menu_fb_rect = null;

menu_big_fade_rect = null;

menu_to_itch_button = null;
menu_to_itch_text = null;



menu_fade_sprites = [];

g_first_user_interaction = false;

MenuStateClass = GameStateClass.extend({
	
	play_state: null,
	engine: null,

	attn_randommode: false,

	init: function(engine, play_state){

		
		this.play_state = play_state;
		this.engine = engine;

		//level_ratio = 1;
		//level_x_shift = 0;
		//this.play_state.level_w = 10;
		//this.play_state.level_h = 10;
		//play_screen_container.make_vis();//;

		//g_top_nono_size = 0;
		//g_left_nono_size = 0;
		//g_level_size = 1; g_level_w = 1;
		//g_level_h = 1;
		//

		
		

		//this.play_state.resize_force_zoom();

		this.play_state.hide_bg_squares();

		tilebackground_group.hide();
		
		if (g_first_time_button == null) {

			//menu_big_fade_rect = new SquareClass(0,0,29*6,29*4,Types.Layer.GAME_MENU, 0x4B4965 ,true);

			for (var x = 0; x < 1; x++) {
				menu_fade_sprites[x] = new SpriteClass();
				menu_fade_sprites[x].setup_sprite('downfade.png',Types.Layer.GAME);
				menu_fade_sprites[x].update_pos(x*this.play_state.tile_size + 0.5*this.play_state.tile_size, 									        6*this.play_state.tile_size + 0.5*this.play_state.tile_size);
				menu_fade_sprites[x].scale(20,1);
			}

			g_first_time_text = new TextClass(Types.Layer.GAME_MENU);
			g_first_time_text.set_font(Types.Fonts.XSMALL);
			g_first_time_text.set_text("FIRST TIME\n");

			g_menu_cannot_save_text = new TextClass(Types.Layer.GAME_MENU);
			g_menu_cannot_save_text.set_font(Types.Fonts.XSMALL);
			g_menu_cannot_save_text.set_text("YOUR BROWSER WONT ALLOW SAVING! SORRY!");

			g_puzzlebrush_title_img = new SpriteClass();
			g_puzzlebrush_title_img.setup_sprite('cherry.png',Types.Layer.HUD);
		
			
			
			g_first_time_button = new SpriteClass();
			g_first_time_button.setup_sprite('sunflower.png',Types.Layer.GAME_MENU);

			g_menu_to_overworld_text = new TextClass(Types.Layer.GAME_MENU);
			g_menu_to_overworld_text.set_font(Types.Fonts.XSMALL);
			g_menu_to_overworld_text.set_text("MAIN LEVELS\n");

			g_menu_to_overworld_button = new SpriteClass();
			g_menu_to_overworld_button.setup_sprite('elephant.png',Types.Layer.GAME_MENU);

			g_menu_to_daily_text = new TextClass(Types.Layer.GAME_MENU);
			g_menu_to_daily_text.set_font(Types.Fonts.XSMALL);
			g_menu_to_daily_text.set_text("DAILY CHALLENGE");

			g_menu_to_daily_button = new SpriteClass();
			g_menu_to_daily_button.setup_sprite('elephant.png',Types.Layer.GAME_MENU);


			g_menu_to_randgen_text = new TextClass(Types.Layer.GAME_MENU);
			g_menu_to_randgen_text.set_font(Types.Fonts.XSMALL);
			g_menu_to_randgen_text.set_text("LEVELS");//MAKE A RANDOM LEVEL");

			g_menu_to_randgen_button = new SpriteClass();
			g_menu_to_randgen_button.setup_sprite('saturn.png',Types.Layer.GAME_MENU);

			menu_to_itch_button = new SpriteClass();
			menu_to_itch_button.setup_sprite('moregames2.png',Types.Layer.GAME_MENU);

			menu_to_itch_text = new TextClass(Types.Layer.GAME_MENU);
			menu_to_itch_text.set_font(Types.Fonts.XSMALL);
			menu_to_itch_text.set_text("MORE GAMES\nzblip.itch.io");

			g_menu_to_app_button = new SpriteClass();
			g_menu_to_app_button.setup_sprite('cherry.png',Types.Layer.GAME_MENU);

			g_menu_to_app_text = new TextClass(Types.Layer.GAME_MENU);
			g_menu_to_app_text.set_font(Types.Fonts.XSMALL);
			g_menu_to_app_text.set_text("GET THE FREE APP\n(MORE LEVELS!)");
			//g_menu_to_app_text.set_colour('00ff00');
			//g_menu_to_app_text.change_text("GET THE FREE APP\n(MORE LEVELS!)");

			

			g_menu_zblipdotcom_text = new TextClass(Types.Layer.GAME_MENU);
			g_menu_zblipdotcom_text.set_font(Types.Fonts.XSMALL);
			g_menu_zblipdotcom_text.set_text("> www.zblip.com <");

			g_spash_image = new SplashClass();
			//g_spash_image.setup_sprite('title2.png',Types.Layer.HUD);

			//g_bitmap_menu_bg = new BitmapClass(Types.Layer.BACKGROUND, 2000, 2000);
			//g_bitmap_menu_bg.update_pos(-2.5*128, 0);

			menu_fb_rect = new SquareClass(0,0,29*6,29*4,Types.Layer.GAME_MENU,0x4B4965,true);

			g_menu_fb_button = new SpriteClass();
			g_menu_fb_button.setup_sprite('fblogo.png',Types.Layer.GAME_MENU);

			g_menu_twitter_button = new SpriteClass();
			g_menu_twitter_button.setup_sprite('twitterlogo.png',Types.Layer.GAME_MENU);

			g_puzzlebrush_title = new TextClass(Types.Layer.GAME_MENU);
			//g_puzzlebrush_title.shadow = true;
			g_puzzlebrush_title.set_font(Types.Fonts.LARGE);
			g_puzzlebrush_title.set_text("MISTER           "); // MINE OF SIGHT

			g_puzzlebrush_title2 = new TextClass(Types.Layer.GAME_MENU);
			//g_puzzlebrush_title2.shadow = true;
			g_puzzlebrush_title2.set_font(Types.Fonts.LARGE);
			//g_puzzlebrush_title2.set_colour("#fff91f");
			g_puzzlebrush_title2.set_text("                LINE"); // MINE OF SIGHT FFF91F
			

			
		}

		

		g_spash_image.make_vis();

		//g_bitmap_menu_bg.make_vis();

		//g_spash_image.make_vis();

		//g_bitmap_menu_bg.make_vis();

		g_puzzlebrush_title_img.hide();

		g_puzzlebrush_title.hide();
		g_puzzlebrush_title2.hide();

		g_first_time_button.make_vis();
		g_menu_to_overworld_button.make_vis();
		g_menu_to_randgen_button.make_vis();
		g_menu_to_app_button.make_vis();
		menu_to_itch_button.make_vis();
		g_menu_to_daily_button.make_vis();

		this.screen_resized();

		this.play_state.resize();
		
		g_top_nono_size = 0;
		g_left_nono_size = 0;
		g_level_size = 4; g_level_w = 4;
		g_level_h = 4;
		//g_level_
		do_resize();

		//play_screen_group.set_x(-2.5*this.play_state.tile_size); play_screen_group.set_y(-250);

		play_screen_group.hide();
	},

	redo_background: function () { return;
	
	},

	

	cleanup: function() {

		for (var x = 0; x < 1; x++) {
				menu_fade_sprites[x].hide();
		}

		play_screen_group.set_x(0); play_screen_group.set_y(0);

		g_spash_image.hide();

		menu_to_itch_button.hide();
		menu_to_itch_text.update_pos(-999,-999);

		g_first_time_button.hide();
		g_menu_to_overworld_button.hide();
		g_menu_to_daily_button.hide();
		g_menu_to_randgen_button.hide();
		g_menu_to_app_button.hide();

		g_first_time_text.update_pos(-999,-999);
g_menu_cannot_save_text.update_pos(-999,-999);
		g_menu_to_overworld_text.update_pos(-999,-999);
		g_menu_to_daily_text.update_pos(-999,-999);
		g_menu_to_randgen_text.update_pos(-999,-999);
		g_menu_to_app_text.update_pos(-999,-999);

		//play_screen_container.make_vis();//;
		//background_container.make_vis();//;

		//g_bitmap_menu_bg.clear();
		//g_bitmap_menu_bg.resize(4,4);
		//g_bitmap_menu_bg.update_pos(-99999,-99999);
		//g_bitmap_menu_bg.hide();

		g_puzzlebrush_title_img.hide();


		//g_spash_image.hide();
		
		
		//g_first_time_button.hide();
		//g_first_time_text.update_pos(-999, -999);

		//g_menu_to_overworld_button.hide();
		//g_menu_to_overworld_text.update_pos(-999, -999);

		//g_menu_to_randgen_button.hide();
		//g_menu_to_randgen_text.update_pos(-999, -999);

		g_puzzlebrush_title.update_pos(-999, -999);
		g_puzzlebrush_title2.update_pos(-999, -999);

		g_menu_zblipdotcom_text.update_pos(-999, -999);

		g_menu_fb_button.hide();
		g_menu_twitter_button.hide();
		//g_spash_image.hide();

		menu_fb_rect.hide();

			
	},

	first_x: 0,
	first_y: 0,

	overworld_x: 0,
	overworld_y: 0,

	randgen_x: 0,
	randgen_y: 0,

	fblogo_x: -999,
	fblogo_y: -999,

	twitterlogo_x: -999,
	twitterlogo_y: -999,

	zblip_x: -999,
	zblip_y: -999,

	app_x: -999,
	app_y: -999,

	itch_x: -999,
	itch_y: -999,

	daily_x: -999,
	daily_y: -999,

	screen_resized: function () {

		//g_spash_image.update_pos(-999,-999);

		g_spash_image.update_pos(screen_width*0.5,90);
		g_spash_image.scale(1, 1);

		//this.redo_background();

		var text_x_off = 0;
		var text_y_off = 40;
		var text_center_x = true;

		if (screen_width < screen_height) {

			g_spash_image.scale(0.66, 0.66);

			g_puzzlebrush_title.update_pos(32, 16);
			g_puzzlebrush_title.center_x(screen_width*0.5);

			g_puzzlebrush_title2.update_pos(32, 16);
			g_puzzlebrush_title2.center_x(screen_width*0.5);

			text_x_off = 40;
			text_y_off = -8;
			text_center_x = false;

			this.first_x = 0.25*screen_width;
			this.first_y = 0.4*screen_height;

			this.overworld_x = -999;//0.25*screen_width;// - 60;
			this.overworld_y = 0.55*screen_height;

			this.randgen_x = 0.25*screen_width;// - 60;
			this.randgen_y = 0.55*screen_height;

			this.app_x = 0.25*screen_width;// - 60;
			this.app_y = 0.7*screen_height;

			this.zblip_x = -999;
			this.zblip_y = -999;

			this.fblogo_x = -999;
			this.fblogo_y = -999;

			this.twitterlogo_x = -999;
			this.twitterlogo_y = -999;

			this.daily_x = -999;
			
			this.itch_x = 0.25*screen_width;;
			this.itch_y = 0.85*screen_height;

			menu_fb_rect.hide();
		} else {

			g_puzzlebrush_title.update_pos(32, 32);
			g_puzzlebrush_title.center_x(screen_width*0.5);
			g_puzzlebrush_title2.update_pos(32, 32);
			g_puzzlebrush_title2.center_x(screen_width*0.5);

			this.first_x = 0.25*screen_width;
			this.first_y = 0.5*screen_height;

			this.daily_x = -999;//0.75*screen_width;
			this.daily_y = -999;//0.5*screen_height;


			this.overworld_x = 0.5*screen_width;// - 60;
			this.overworld_y = 0.5*screen_height;

			this.randgen_x = 0.5*screen_width;// - 60;
			this.randgen_y = 0.5*screen_height;

			this.app_x = 0.5*screen_width;// - 60;
			this.app_y = 0.75*screen_height;

			this.fblogo_x =  screen_width - 29 - 0.5*29;
			this.fblogo_y =  screen_height - 29 - 0.5*29;

			//menu_fb_rect.make_vis();
			//menu_fb_rect.update_pos(this.fblogo_x - 29 - 3*29, this.fblogo_y - 29 - 0.5*29);

			this.zblip_x = screen_width*0.5;
			this.zblip_y = screen_height - 16;

			this.twitterlogo_x = screen_width - 29 - 0.5*29;//this.fblogo_x - 29 - 1*29;
			this.twitterlogo_y = screen_height - 29 - 0.5*29;//this.fblogo_y;

			this.twitterlogo_x = -999;
			this.twitterlogo_y = -999;

			this.itch_x = 0.75*screen_width;;
			this.itch_y = 0.75*screen_height;

			menu_fb_rect.hide();

		}

		if (location_hostname == "game274082.konggames.com" ||
	browser_url == "www.kongregate.com" ||
	browser_url == "http://www.kongregate.com/games/ZBlip/mister-line" ||
	browser_url == "http://www.kongregate.com/games/ZBlip/mister-line/" ||
	browser_url == "http://www.kongregate.com/games/ZBlip/mister-line_preview/" ||
	browser_url == "www.kongregate.com/games/ZBlip/mister-line/" ||
	browser_url == "www.kongregate.com/games/ZBlip/mister-line") {
		this.itch_x = -999;
		this.app_x = -999;
		}
		this.overworld_x = -999;

		//if (!app_exists) this.app_x = -999;

		if (using_cocoon_js == true) {
			this.fblogo_x = -999;
			this.fblogo_y = -999;
			this.twitterlogo_x = -999;
			this.twitterlogo_y = -999;
			this.app_x = -999;
			this.app_y = -999;
			menu_fb_rect.hide();
		}

		if (use_browser_cookies == false) {
			//this.itch_x = -999;
		}

		this.fblogo_x = -999;
		this.fblogo_y = -999;

		menu_to_itch_button.update_pos(this.itch_x, this.itch_y);
		menu_to_itch_text.update_pos(this.itch_x + text_x_off, this.itch_y + text_y_off);
		if (text_center_x) menu_to_itch_text.center_x(this.itch_x);
		
		g_menu_fb_button.update_pos(this.fblogo_x, this.fblogo_y);
		g_menu_fb_button.make_vis();

		g_menu_twitter_button.update_pos(this.twitterlogo_x, this.twitterlogo_y);
		g_menu_twitter_button.make_vis();

		g_menu_zblipdotcom_text.update_pos(this.zblip_x, this.zblip_y);
		g_menu_zblipdotcom_text.center_x(this.zblip_x);
	
		

		if (game_cannot_save) g_menu_cannot_save_text.update_pos(12,12);

		g_first_time_button.update_pos(this.first_x, this.first_y);
		g_first_time_text.update_pos(this.first_x + text_x_off, this.first_y + text_y_off);
		if (text_center_x) g_first_time_text.center_x(this.first_x);

		g_menu_to_overworld_button.update_pos(this.overworld_x, this.overworld_y);
		g_menu_to_overworld_text.update_pos(this.overworld_x  + text_x_off, this.overworld_y + text_y_off);
		if (text_center_x) g_menu_to_overworld_text.center_x(this.overworld_x);

		g_menu_to_randgen_button.update_pos(this.randgen_x, this.randgen_y);
		g_menu_to_randgen_text.update_pos(this.randgen_x + text_x_off, this.randgen_y + text_y_off);
		if (text_center_x) g_menu_to_randgen_text.center_x(this.randgen_x);

		g_menu_to_daily_button.update_pos(this.daily_x, this.daily_y);
		g_menu_to_daily_text.update_pos(this.daily_x + text_x_off, this.daily_y + text_y_off);
		if (text_center_x) g_menu_to_daily_text.center_x(this.daily_x);
		

		g_menu_to_app_button.update_pos(this.app_x, this.app_y);
		g_menu_to_app_text.update_pos(this.app_x + text_x_off, this.app_y + text_y_off);
		if (text_center_x)g_menu_to_app_text.center_x(this.app_x);
	},

	handle_mouse_move : function (engine, x, y) {
		//this.on_interaction();
	},
	
	clicked_fb: false,
	clicked_zblip: false,
	clicked_app: false,
	clicked_itch: false,

	

	handle_mouse_down: function(engine,x,y) {
		this.on_interaction();
		// this.fblogo_x
		if (mouse.x > this.fblogo_x - 16 &&
		    mouse.x < this.fblogo_x + 16 &&
		    mouse.y > this.fblogo_y - 16 &&
		    mouse.y < this.fblogo_y + 16 && this.clicked_fb == false) {
			this.clicked_fb = true;
			open_url('https://www.facebook.com/Mine-of-Sight-1037635096381976/'); 
			return;
		} else if (mouse.x > this.twitterlogo_x - 16 &&
		    mouse.x < this.twitterlogo_x + 16 &&
		    mouse.y > this.twitterlogo_y - 16 &&
		    mouse.y < this.twitterlogo_y + 16 && this.clicked_fb == false) {
			this.clicked_fb = true;
			open_url('https://twitter.com/ZBlipGames'); 
			return;
		}  else if (mouse.x > this.itch_x - 16 &&
		    mouse.x < this.itch_x + 16 &&
		    mouse.y > this.itch_y - 16 &&
		    mouse.y < this.itch_y + 16 && this.clicked_itch == false) {
			this.clicked_itch = true;
			open_url('https://zblip.itch.io'); 
			return;
		} else if (mouse.x > this.zblip_x - 24 &&
		    mouse.x < this.zblip_x + 24 &&
		    mouse.y > this.zblip_y - 16 &&
		    mouse.y < this.zblip_y + 16 && this.clicked_zblip == false) {
			this.clicked_zblip = true;
			open_url('http://www.zblip.com'); 
			return;
		} else if (mouse.x > this.app_x - 24 &&
		    mouse.x < this.app_x + 24 &&
		    mouse.y > this.app_y - 16 &&
		    mouse.y < this.app_y + 16 && this.clicked_app == false) {
			this.clicked_app = true;
			open_url(gettheapp_url); 
			return;
		} 

		
	},

	on_interaction : function () {
		if (g_first_user_interaction == true) return;
		g_first_user_interaction = true;

		// Here I trigger music start
		// chrome autoplay rules mean I need to wait for first user interaction
		// Will only care about the first call to playSoundInstanceLoop
		playSoundInstanceLoop('assets/misterlinessong.ogg', 0.45);	
	},

	handle_mouse_up: function(engine,x,y) {

		this.on_interaction();

		if (mouse.x > this.first_x - 100 &&
		    mouse.x < this.first_x + 100 &&
		    mouse.y > this.first_y - 28 &&
		    mouse.y < this.first_y + 28) {
			this.play_state.current_world = 0;
			this.play_state.current_level = 0;
			this.play_state.game_mode = 5;
		
			//this.change_state(this.engine, new LoadingLevelStateClass(this.engine, this.play_state, 0));
			// InstructionStateClass
			// LoadInstructionStateClass 
			
			this.change_state(this.engine, new LoadInstructionStateClass(this.engine, this.play_state));
			return;

			
			
		}

		if (mouse.x > this.daily_x - 40 &&
		    mouse.x < this.daily_x + 40 &&
		    mouse.y > this.daily_y - 28 &&
		    mouse.y < this.daily_y + 28) {
			g_overworld_to_show = 0;
			this.play_state.game_mode = 1;	// Rand Gen?
			this.change_state(this.engine, new GenerateRandLevelClass(this.engine, this.play_state));
			// 
			return;
		}

		if (mouse.x > this.overworld_x - 40 &&
		    mouse.x < this.overworld_x + 40 &&
		    mouse.y > this.overworld_y - 28 &&
		    mouse.y < this.overworld_y + 28) {
			g_overworld_to_show = 0;
			this.play_state.game_mode = 0;
			this.change_state(this.engine, new NewOverworldStateClass(this.engine, this.play_state));
			// GenerateRandLevelClass
			return;
		}

		if (mouse.x > this.randgen_x - 40 &&
		    mouse.x < this.randgen_x + 40 &&
		    mouse.y > this.randgen_y - 28 &&
		    mouse.y < this.randgen_y + 28) {
			this.play_state.current_level = 7;
			this.play_state.first_tile_safe = true;
			this.change_state(this.engine, new ChallengeLevelsSelectHardness(this.engine, this.play_state));
			return;
		}

		


		
	},

	attn_timer: 0,

	draw: function () {
		if (this.attn_randommode == true ) {
			this.attn_timer--;
			if (this.attn_timer <= 0) this.attn_timer = 60;
			var scale = this.attn_timer/60;
			g_menu_to_randgen_button.scale(1 + 0.25*scale, 1 + 0.25*scale);
		}

		return;

		//g_puzzlebrush_title.update_pos(32, 32);

		g_first_time_button.update_pos(this.first_x, this.first_y);
		g_first_time_text.update_pos(this.first_x, this.first_y + 40);
		g_first_time_text.center_x(this.first_x);

		g_menu_to_overworld_button.update_pos(this.overworld_x, this.overworld_y);
		g_menu_to_overworld_text.update_pos(this.overworld_x, this.overworld_y + 40);
		g_menu_to_overworld_text.center_x(this.overworld_x);

		g_menu_to_randgen_button.update_pos(this.randgen_x, this.randgen_y);
		g_menu_to_randgen_text.update_pos(this.randgen_x, this.randgen_y + 40);
		g_menu_to_randgen_text.center_x(this.randgen_x);

	}

	

});

g_tut_reset_button = null;
g_tut_skip_button = null;
g_tut_next_button = null;
g_tut_text = null;
g_tut_highlight = null;

g_tut_content_for_world[0] = {
	
 "0" : {
            "levelnum": 0,
	     "text" : [
             "WELCOME TO MISTER LINE",
             "THE GOAL IS TO FILL EACH LEVEL",
	     "JUST DRAG MISTER LINE",
             "YOU CAN DO IT"
	            ],
	     "tutseq" : [
			     7, 8, 9, 10
		     ],
            
	     "level": [
[1,1,1,1,1,1],
[1,2,0,0,0,1],
[1,1,1,1,1,1]],
            
            "width": 6,
            
            "edges": [[0,0,0,0,0,0],
[0,0,0,0,0,0],
[0,0,0,0,0,0]]
	    }

		

		
};

LoadInstructionStateClass = GameStateClass.extend({
	
	play_state: null,
	engine: null,

	x_pos: 0,

	no_such_tut: false,
	
	init: function(engine, play_state) {

		this.play_state = play_state;
		this.engine = engine;

		//alert('LoadInstructionStateClass ' );

		g_tut_content = g_tut_content_for_world[this.play_state.current_world];

		if (g_tut_content[this.play_state.current_level] == null) {
			
			this.no_such_tut = true;
		} else {
			
			this.play_state.game_mode = 5;
			this.load_tut();
		}
	},

	load_tut : function () {
		var tut_level_to_load = this.play_state.current_level;
		var mapdata_version_mines = 1;
		for (var x = 0; x < this.play_state.grid_w; x++) {
			for (var y = 0; y < this.play_state.grid_h; y++) {
				
				//this.play_state.blocks[this.play_state.tiles[x][y]].reset();
				this.play_state.blocks[this.play_state.tiles[x][y]].set_type(GameTypes.Tiles.SOLID);
				
				this.play_state.blocks[this.play_state.tiles[x][y]].calc_sprite();
				this.play_state.blocks[this.play_state.tiles[x][y]].hide();
				
			}
		}
		//this.play_state.reset();
		this.play_state.load_tut_level(tut_level_to_load, mapdata_version_mines);

		
		

		// a lot of stuff in StartGame State
		//this.play_state.calc_islands();
		//this.play_state.calc_sequence_lengths();
		//this.play_state.calc_edge_nonogram();
		this.play_state.tally_tiletypes();
		this.play_state.resize();	// after calc edges - need to know sizes
		this.play_state.item_inventory.reset();

		// hacky - zoom out a little bit more
		//g_level_size++;		// controls zoom
		//g_level_w++;		// controls centering
		//g_level_h += 2;		// controls centering
		//
		
		
		g_top_nono_size = 0;
		g_left_nono_size = 0;

		//level_ratio = 1;
		//level_x_shift = 0;
		
		this.play_state.resize();	// after calc edges - need to know sizes
		do_resize();
	
		for (var x = 0; x < this.play_state.grid_w; x++) {
			for (var y = 0; y < this.play_state.grid_h; y++) {

				if (this.play_state.blocks[this.play_state.tiles[x][y]].block_type == GameTypes.Tiles.ABYSS) continue; 
				
				
				

				if (x < this.play_state.level_w &&
				    y < this.play_state.level_h) {
					////console.log('a');
					this.play_state.blocks[this.play_state.tiles[x][y]].calc_sprite();

					this.play_state.blocks[this.play_state.tiles[x][y]].setup();
					this.play_state.blocks[this.play_state.tiles[x][y]].make_vis();
				} else {
					//this.play_state.bg_squares[this.play_state.tiles[x][y]].hide();
					this.play_state.blocks[this.play_state.tiles[x][y]].hide();
				}
			}
		}


	},

	timer: 0,

	update : function (engine) {
		if (this.no_such_tut == true) {
			this.goto_level();
			return;
		} 

		this.timer--;

		if (this.timer <= 0) {
			this.goto_tut();
		}

		
	},

	goto_level : function () {
		
		this.play_state.game_mode = 0;
		//this.play_state.current_level = 0;
		var do_outslide = true;
		this.change_state(this.engine, new LoadingLevelStateClass(this.engine, this.play_state, 								  this.play_state.current_level, do_outslide));
			
			
	},

	goto_tut : function () {
		this.play_state.game_mode = 5;
		this.change_state(this.engine, new InstructionStateClass(this.engine, this.play_state));
	},

	cleanup : function() {
		play_screen_container.make_vis();//;
		play_screen_container.set_x(0);
	},
});

InstructionStateClass = GameStateClass.extend({
	
	play_state: null,
	engine: null,

	next_x: 0,
	next_y: 0,

	skip_x: 0,
	skip_y: 0,

	reset_x: 0,
	reset_y: 0,

	tut_level: 0,
	tut_substage: 0,

	init: function(engine, play_state) {

		//play_screen_container.set_x(2999);
		play_screen_container.make_vis();//;
		this.play_state = play_state;
		this.engine = engine;

		this.tut_level = this.play_state.current_level;

		if (g_tut_text == null) {
			g_tut_next_button = new SpriteClass();
			g_tut_next_button.setup_sprite("rightarrow.png",Types.Layer.GAME_MENU);
			g_tut_next_button.update_pos(screen_width + 200, screen_height*0.5);

			g_tut_reset_button = new SpriteClass();
			g_tut_reset_button.setup_sprite("leftarrow.png",Types.Layer.GAME_MENU);
			g_tut_reset_button.update_pos(screen_width + 200, screen_height*0.5);

			g_tut_skip_button = new SpriteClass();
			g_tut_skip_button.setup_sprite("skip_icon.png",Types.Layer.GAME_MENU);
			g_tut_skip_button.update_pos(screen_width + 200, screen_height*0.5);

			g_tut_text = new TextClass(Types.Layer.GAME_MENU);
			g_tut_text.set_font(Types.Fonts.TUTSMALL);
			//if (screen_width < screen_height) g_tut_text.set_font(Types.Fonts.XSMALL);
			g_tut_text.set_text("");

			g_tut_highlight = new TutHighlightClass(this.play_state);
		}

		g_tut_reset_button.make_vis();
		g_tut_skip_button.make_vis();
		g_tut_next_button.make_vis();
		g_tut_text.make_vis();

		this.tut_finger_x = g_tut_content[this.tut_level].tutseq[0] % this.play_state.level_w;
		this.tut_finger_y = Math.floor(g_tut_content[this.tut_level].tutseq[0] / this.play_state.level_w);

		this.set_tut_substage(0);

		

		this.screen_resized();

	},

	screen_resized : function () {

		if (screen_width > screen_height) {
			this.next_x = screen_width - 32;
			this.next_y = screen_height - 32;

			this.reset_x = screen_width - 32;
			this.reset_y = screen_height - 96;

			this.skip_x = screen_width - 32;
			this.skip_y = screen_height - 96 - 64;

			
			g_tut_text.update_pos(96, screen_height - 32 - 16);
		} else {
			this.next_x = screen_width - 32;
			this.next_y = screen_height - 32;

			this.reset_x = screen_width - 32;
			this.reset_y = screen_height - 96;

			this.skip_x = screen_width - 32;
			this.skip_y = screen_height - 96 - 64;

			g_tut_text.update_pos(96, screen_height - 64 - 24);
			g_tut_text.set_font(Types.Fonts.XSMALL);
		}

		//if (this.play_state.current_level == 0) this.skip_y = - 999;
		if (this.tut_substage == 0) this.reset_y = - 999;

		
		g_tut_text.center_x(screen_width*0.5)

		g_tut_next_button.update_pos(this.next_x, this.next_y);	
		g_tut_reset_button.update_pos(this.reset_x, this.reset_y);	
		g_tut_skip_button.update_pos(this.skip_x, this.skip_y);	

		//////console.log('this.next_x ' + this.next_x + ' this.next_y ' + this.next_y);
		
	},

	update : function () {

	},

	skip : function () {
		this.tut_substage = 99999;
		this.next_substage();
	},

	reset : function () {
		this.tut_substage = -1;
		this.next_substage();
	},

	handle_key : function (k) {
		this.next_substage();
	},

	next_substage : function () {
		g_tut_highlight.reset();
		this.tut_substage++;
		if (this.tut_substage >= g_tut_content[this.tut_level].text.length) {
			// too high
			// change state to ... campaign level 0?
			this.play_state.game_mode = 0;
			//this.play_state.current_level = 0;
			var do_outslide = true;
			this.change_state(this.engine, new LoadingLevelStateClass(this.engine, this.play_state, 									this.play_state.current_level, do_outslide));
			
			return;
			
		}
		this.set_tut_substage(this.tut_substage);
		this.screen_resized();
	},

	tut_finger_x : 0,
	tut_finger_y : 0,

	set_tut_substage : function(substage) {
		
		g_tut_next_button.scale(1, 1);

		if (substage >= g_tut_content[this.tut_level].text.length) {
			// too high
			return;
		}


		next_x = g_tut_content[this.tut_level].tutseq[substage] % this.play_state.level_w;
		next_y = Math.floor(g_tut_content[this.tut_level].tutseq[substage] / this.play_state.level_w);

	

		if (this.play_state.is_in_level(this.tut_finger_x ,this.tut_finger_y) == true &&
		    this.play_state.is_in_level(next_x ,next_y) == true) {
				moved_ = this.play_state.blocks[this.play_state.tiles[this.tut_finger_x][this.tut_finger_y]].on_drag_into(next_x, next_y);
			}

		g_tut_text.change_text(g_tut_content[this.tut_level].text[substage]);

		for (var t = 0; t < g_tut_content[this.tut_level].tutseq[substage].length; t++) {
			
			var b_ten = g_tut_content[this.tut_level].tutseq[substage][t];
			var y = Math.floor(b_ten/10);
			var x = b_ten % 10;
			//g_tut_highlight.add_tile_xy(x, y);
		} 

		

		this.tut_finger_x = next_x;
		this.tut_finger_y = next_y;
	},

	cleanup : function() {
		g_tut_next_button.hide();
		g_tut_skip_button.hide();
		g_tut_reset_button.hide();
		g_tut_text.hide();
		g_tut_highlight.reset();
		g_tut_highlight.hide();
	},

	

	handle_mouse_up : function (engine, x, y) {
		if (mouse.x > this.next_x - 32 && mouse.x < this.next_x + 32 &&
		    mouse.y > this.next_y - 32 && mouse.y < this.next_y + 32) {
			this.next_substage();
		} else if (mouse.x > this.reset_x - 32 && mouse.x < this.reset_x + 32 &&
		    	   mouse.y > this.reset_y - 32 && mouse.y < this.reset_y + 32) {
			this.reset();
		} else if (mouse.x > this.skip_x - 32 && mouse.x < this.skip_x + 32 &&
		    	   mouse.y > this.skip_y - 32 && mouse.y < this.skip_y + 32) {
			this.skip();
		}
	},

	attn_timer: 0,

	draw: function() {
		this.play_state.draw();

		if (this.tut_substage == 0) {
			this.attn_timer--;
			if (this.attn_timer <= -30 && this.tut_substage == 0) this.attn_timer = 30;
			var scale = this.attn_timer/30;
			g_tut_next_button.scale(1 + 0.33*scale, 1 + 0.33*scale);
		}
	}

});

g_next_level_button = null;
g_next_level_text = null;
g_win_message = null;

use_browser_cookies = false;

g_win_fb = null;
g_win_fb_text = null;

g_win_twit = null;
g_win_twit_text = null;

g_win_save_state = null;
g_win_save_state_text = null;

g_star_rating_obj = null;

g_win_picturename = null;

g_win_poptilesprite = null;

g_win_to_app_button = null;
g_win_to_app_text = null;

WinStateClass = GameStateClass.extend({

	play_state: null,
	engine: null,

	next_x: 0,
	next_y: 0,

	fb_y: -999,
	fb_x: -999,

	save_y: -999,
	save_x: - 999,

	show_save_option: true,

	allow_rating: false,

	timer: 25,

	mr_line_head: -1,
	next_timer: 400,

	init: function(engine, play_state){

		

		play_screen_container.make_vis();//;
		this.play_state = play_state;
		this.engine = engine;

		//var p_level_status = g_all_level_status;
		g_level_progress_world[this.play_state.current_world] = Math.max(g_level_progress_world[this.play_state.current_world], this.play_state.current_level  + 1);




		
		////console.log('winstate > this.play_state.game_mode ' + this.play_state.game_mode + ' >  this.play_state.challenge_level_hardness ' + this.play_state.challenge_level_hardness + ' p_level_status ' + p_level_status.toString() + ' this.play_state.mistakes_this_level ' + this.play_state.mistakes_this_level + ' p_level_status[this.play_state.current_level] ' + p_level_status[this.play_state.current_level]);

		total_levels_played++;
		total_levels_played_this_session++;
		levels_until_ad--;

		// kongregate.services.getUserId() will return 0 if not signed in
		if (on_kong && kongregate.services.getUserId() > 0 && this.play_state.game_mode == 3) {
			this.allow_rating = true;
		}

			
		
		

		if (use_browser_cookies && game_cannot_save == false) {
			
			this.save_state();
			this.show_save_option = false;
			if (on_kong && kongregate.services.getUserId() > 0) this.submit_kong_stats();
		}

		

		// g_ui.clear
		// var next_code = 0;
		// var fb_code = 1;
		// g_ui.add_button('next', 'rightarrow.png', next_code);
		// g_ui.add_button('like on FB', 'fb.png', fb_code);
		// var text_x = 1;	// 1 or -1
		// var text_y = -1;	// 1 or -1  which corner
		// g_ui.add_text('SOLVED!', text_x, text_y);

		if (g_star_rating_obj == null) {
			g_star_rating_obj = new StarRatingClass();
			g_star_rating_obj.hide();

		}

		if (g_next_level_button == null) {

			g_win_to_app_button = new SpriteClass();
			g_win_to_app_button.setup_sprite('cherry.png',Types.Layer.GAME_MENU);

			g_win_to_app_text = new TextClass(Types.Layer.GAME_MENU);
			g_win_to_app_text.set_font(Types.Fonts.XSMALL);
			g_win_to_app_text.set_text("GET THE FREE APP\n(MORE LEVELS!)");


			g_win_poptilesprite = new SpriteClass();
			g_win_poptilesprite.setup_sprite("redtile.png",Types.Layer.GAME_MENU);
			g_win_poptilesprite.update_pos(screen_width + 200, screen_height*0.5);
	

			g_next_level_button = new SpriteClass();
			g_next_level_button.setup_sprite("rightarrow.png",Types.Layer.GAME_MENU);
			g_next_level_button.update_pos(screen_width + 200, screen_height*0.5);

			g_next_level_text = new TextClass(Types.Layer.GAME_MENU);
			g_next_level_text.set_font(Types.Fonts.SMALL);
			g_next_level_text.set_text("NEXT LEVEL:");

			g_win_message = new TextClass(Types.Layer.GAME_MENU);
			g_win_message.set_font(Types.Fonts.SMALL);
			g_win_message.set_text("SOLVED!");

			g_win_picturename = new TextClass(Types.Layer.GAME_MENU);
			g_win_picturename.set_font(Types.Fonts.XSMALL);
			g_win_picturename.set_text("PICTURENAME");

			g_win_twit_text = new TextClass(Types.Layer.GAME_MENU);
			g_win_twit_text.set_font(Types.Fonts.XSMALL);
			g_win_twit_text.set_text("FOLLOW @ZBlipGames:");

			g_win_twit = new SpriteClass();
			g_win_twit.setup_sprite('eye.png',Types.Layer.GAME_MENU);

			g_win_save_state_text = new TextClass(Types.Layer.GAME_MENU);
			g_win_save_state_text.set_font(Types.Fonts.XSMALL);
			g_win_save_state_text.set_text("REMEMBER PROGRESS?: NO\nPROGRESS IS *NOT* BEING SAVED");
			if (game_cannot_save) g_win_save_state_text.change_text("UNABLE TO SAVE\nPROGRESS");

			g_win_save_state = new SpriteClass();
			g_win_save_state.setup_sprite('button_small.png',Types.Layer.GAME_MENU);



			
		}

		if (this.play_state.game_mode == 3 && this.allow_rating == true) g_star_rating_obj.make_vis();

		g_win_poptilesprite.hide();

		g_win_fb.update_pos(-999, -999);
		g_win_fb_text.update_pos(-999, -999);
		g_win_twit.update_pos(-999, -999);


		p_colour_folder = g_all_world_data_edge[this.play_state.current_world];
		p_picturetext_folder = g_all_world_data_text[this.play_state.current_world];

		if (this.play_state.game_mode == 6) {
			this.play_state.mistakes_this_level = 0;
			if (this.play_state.challenge_level_hardness == 1) p_colour_folder = g_all_world_data_edge[this.play_state.current_world].easy;
			if (this.play_state.challenge_level_hardness == 2) p_colour_folder = g_all_world_data_edge[this.play_state.current_world].med;
			if (this.play_state.challenge_level_hardness == 3) p_colour_folder = g_all_world_data_edge[this.play_state.current_world].hard;
			if (this.play_state.challenge_level_hardness == 4) p_colour_folder = g_all_world_data_edge[this.play_state.current_world].nosmiley;

			if (this.play_state.challenge_level_hardness == 1) p_picturetext_folder = g_all_world_data_text[this.play_state.current_world].easy;
			if (this.play_state.challenge_level_hardness == 2) p_picturetext_folder = g_all_world_data_text[this.play_state.current_world].med;
			if (this.play_state.challenge_level_hardness == 3) p_picturetext_folder = g_all_world_data_text[this.play_state.current_world].hard;
			if (this.play_state.challenge_level_hardness == 4) p_picturetext_folder = g_all_world_data_text[this.play_state.current_world].nosmiley;
		}

		////console.dir(all_world_data_edge[this.play_state.current_world].med);
		//////console.log(' this.play_state.game_mode ' + this.play_state.game_mode);
		//////console.log(' this.play_state.challenge_level_hardness ' + this.play_state.challenge_level_hardness);

		//alert('bbb');

		for (var y = 0; y < this.play_state.level_h; y++) {
			for (var x = 0; x < this.play_state.level_w; x++) {
				this.play_state.blocks[this.play_state.tiles[x][y]].emotion_state = GameTypes.Emotion.IDLE;
				if (Math.random() < 0.5 && 
			    this.play_state.level_w > 5 &&
			    this.play_state.level_h > 5) this.play_state.blocks[this.play_state.tiles[x][y]].emotion_state = GameTypes.Emotion.VICTORY;
				if (this.play_state.blocks[this.play_state.tiles[x][y]].is_end()) {
					this.mr_line_head = this.play_state.tiles[x][y];
					
				}
			}
		}
		
		if (p_colour_folder[this.play_state.current_level] != null &&
		    p_colour_folder[this.play_state.current_level].length > 0) {
			this.do_colour = true;
			////console.log('WinState > do_colur');
			var colour_i = 0;
			for (var y = 0; y < this.play_state.level_h; y++) {
				for (var x = 0; x < this.play_state.level_w; x++) {
				
					if (colour_i >= p_colour_folder[this.play_state.current_level].length) continue;
					var c = p_colour_folder[this.play_state.current_level][colour_i];
					this.play_state.blocks[this.play_state.tiles[x][y]].secret_colour = c;
					colour_i++;
				}
			}
		} //else ////console.log('WinState > no colur ... p_colour_folder[this.play_state.current_level] ' + p_colour_folder[this.play_state.current_level].toString());

		this.do_colour = false;

		////console.log('this.play_state.current_level ' + this.play_state.current_level);
		//alert('aaa');

		var levelnum = this.play_state.current_level + 1;

		if (p_picturetext_folder[this.play_state.current_level] != null &&
		    p_colour_folder[this.play_state.current_level].length > 0) {
			g_win_picturename.change_text("LEVEL " + (this.play_state.current_world + 1).toString() + "-" + (this.play_state.current_level + 1).toString() + "\n" + p_picturetext_folder[this.play_state.current_level]);
		} else {
			g_win_picturename.change_text("LEVEL " + (this.play_state.current_world + 1).toString() + "-" + (this.play_state.current_level + 1).toString());
		}	

		g_win_picturename.make_vis();

		this.screen_resized();

		////console.log('do_colour ' + this.do_colour);
		////console.dir(all_world_data_edge[this.play_state.current_world]);
		////console.dir(g_all_world_data_text[this.play_state.current_world]);
	},

	do_colour: false,
	bg_colour: 0,
	do_background: false,

	submit_kong_stats : function() {

		/*
		g_total_num_of_levels = 89;//122 on kong;
		g_levelnum_app_cutoff = 70;
		g_levelnum_app_cutoff_nosmiley = 30;

		g_total_challenge_levels_easy = 53;
		g_total_challenge_levels_med = 72;
		g_total_challenge_levels_hard = 93;
		g_total_challenge_levels_nosmiley = 45;
		g_challenge_levels_easy_progress = 0;
		g_challenge_levels_med_progress = 0;
		g_challenge_levels_hard_progress = 0;
		*/
	
		var levels_done = 0;

		for (lvl in g_all_level_status) {
			if (g_all_level_status[lvl] == 4) levels_done++;
			
		}
		if (levels_done == 70) kongregate.stats.submit("All main levels completed", 1);
		kongregate.stats.submit("Number of main levels completed", levels_done);

		for (lvl in g_all_level_status.easy) {
			var easy_levels_done = 0;
			if (g_all_level_status.easy[lvl] == 4) easy_levels_done++;
			levels_done += easy_levels_done;
			
		}
		if (easy_levels_done == g_total_challenge_levels_easy) kongregate.stats.submit("All relaxing levels completed", 1);

		for (lvl in g_all_level_status.med) {
			var med_levels_done = 0;
			if (g_all_level_status.med[lvl] == 4) med_levels_done++;
			levels_done += med_levels_done;
			
		}
		if (med_levels_done == g_total_challenge_levels_med) kongregate.stats.submit("All medium levels completed", 1);


		for (lvl in g_all_level_status.nosmiley) {
			var nosmiley_levels_done = 0;
			if (g_all_level_status.nosmiley[lvl]== 4) nosmiley_levels_done++;
			levels_done += nosmiley_levels_done;
			
		
		}
		if (nosmiley_levels_done == g_levelnum_app_cutoff_nosmiley) kongregate.stats.submit("All NoSmiley levels completed", 1);

		kongregate.stats.submit("Levels completed", levels_done);
	},

	save_state_localstorage: function () {
		localStorage.setItem("puzzlebrushlevels", cookie_string);

		// Store
		//localStorage.setItem("lastname", "Smith");
		// Retrieve
		//document.getElementById("result").innerHTML = localStorage.getItem("lastname");
	},

	save_state_community_levels: function () {
		for (var i = 0; i < g_community_list_data.length; i++) {
			if (g_community_list_data[i]['done'] != null &&
			    g_community_list_data[i]['done'] == true) {
				
				localStorage.setItem("MoShash" + g_community_list_data[i].hash, "1");
			}

		}
	},

	

	// cookies and local storage
	save_state: function() {

		try {

			var dosave_string = "DOSAVE=1";
		document.cookie= dosave_string + ";expires=Fri, 31 Dec 2030 23:59:59 GMT";
		
		var now = new Date();
  		var time = now.getTime();
		
  		var expireTime = time + 6*20000*36000;	// 3 months
		now.setTime(expireTime);


		// g_all_level_status[levelnum] = 4;	// tick, done

		var cookie_string = "puzzlebrushlevels=";

		var local_storage_content = "";
		var local_storage_content_challenge = "";

		//for (levelnum in g_all_level_status) {
			//if (g_all_level_status[levelnum] != 4) continue;
			//cookie_string += levelnum.toString() + "a";
			//local_storage_content += levelnum.toString() + "a";

			//var level_done = "puzzlebrushlevel" + levelnum.toString();
			//localStorage.setItem(level_done, "1");
		//}

		

		if (using_cocoon_js == false) {
			//document.cookie= cookie_string + ";expires=" +now.toGMTString();
			//document.cookie = cookie_string + ";expires=Fri, 31 Dec 2020 23:59:59 GMT";
			//document.cookie= cookie_string + ";"//expires=" +now.toGMTString();
		}

		//localStorage.setItem("puzzlebrushlevels", local_storage_content);

		//if (this.play_state.game_mode == 3) this.save_state_community_levels();

		//("cookie expires " + now.toGMTString());

		//if(localStorage.getItem('mine of sight level 3'))
		//localStorage.getItem('mine of sight level 3');

		// save controls
		// g_click_to_dig = true;
		// g_hold_to_flag = true;

		var clicktodig = 0;
		if (g_click_to_dig == true) clicktodig = 1;

		var holdtoflag = 0;
		if (g_hold_to_flag == true) holdtoflag = 1;

		if (using_cocoon_js == false) {
			//document.cookie="puzzlebrushclicktodig=" + clicktodig.toString() + ";expires=" +now.toGMTString();
			//document.cookie="puzzlebrushholdtoflag=" + holdtoflag.toString() + ";expires=" +now.toGMTString();

			//document.cookie="puzzlebrushclicktodig=" + clicktodig.toString() + ";expires=Fri, 31 Dec 2020 23:59:59 GMT";
			//document.cookie="puzzlebrushholdtoflag=" + holdtoflag.toString() + ";expires=Fri, 31 Dec 2020 23:59:59 GMT";
		}

		//document.cookie = "zblip_save=1";

		localStorage.setItem("puzzlebrushclicktodig", clicktodig.toString());
		localStorage.setItem("puzzlebrushholdtoflag", holdtoflag.toString());

		localStorage.setItem("total_levels_played", total_levels_played.toString());

		localStorage.setItem("g_sound_on", g_sound_on);
		localStorage.setItem("hint_points", this.play_state.hint_points);

		if (using_cocoon_js == true) {
			// for ads
			
			localStorage.setItem("levels_until_ad", levels_until_ad.toString());

			// for begging
			//localStorage.setItem("g_seen_beg", g_seen_beg.toString());
		}
		// // puzzlebrushlevels=1a2a3a6

		//g_levels_done_first_world = [];	// first world unlocked?
		//g_level_progress_world = [];

		//var all_worlds_progress = "";

		for (var w = 0; w < g_level_progress_world.length; w++) {
			//all_worlds_progress.push(w.toString());
			localStorage.setItem("zblip_puzzlebrush_progress_world" + w.toString(), JSON.stringify(g_level_progress_world[w]));
		}


		// oct 2017 - serialize entire g_all_level_status, incl easy med hard
		//localStorage.setItem("zblip_puzzlebrush_g_all_level_status", JSON.stringify(g_all_level_status));

		// to read:
		//var meta1 = JSON.parse(window.localStorage.getItem("zblip_puzzlebrush_g_all_level_status"));
		////alert(meta1['22']);

		} catch (e) {
			game_cannot_save = true;
		console.log(e);}

		
	},

	go_to_fb: function() {
		window.open('https://www.facebook.com/Mine-of-Sight-1037635096381976');
	},

	go_to_twit: function() {
		window.open('https://twitter.com/ZBlipGames');
	},

	starrate_x: 0,
	starrate_y: 0,

	app_x: 0,
	app_y: 0,

	screen_resized: function () {
		this.play_state.screen_resized();

		this.fb_x = -999;
		this.fb_y = -999;

		if (screen_width > screen_height) {
			this.next_x = screen_width -32; //- 38;
			this.next_y = screen_height - 32; //- 64 - 16 - 8;

			if (this.play_state.game_mode == 1) {
				//this.fb_x = screen_width - 29 - 0.5*29;
				//this.fb_y = screen_height - 29 - 0.5*29;
			}

			this.starrate_x = screen_width - 6*26;
			this.starrate_y = 140;

			g_win_picturename.update_pos(16,16);

			

			
		} else {
			this.next_x = screen_width - 32;
			this.next_y = screen_height - 32;

			this.fb_x = -999;
			this.fb_y = -999;

			g_win_picturename.update_pos(screen_width*0.5,screen_height - 96);
			g_win_picturename.center_x(screen_width*0.5);
		}

		this.app_x = screen_width - 52;
			this.app_y = 52;
		if (this.play_state.current_level < 8 &&
		    this.play_state.current_world == 0) this.app_y = -999; 

		if (this.play_state.current_level % 3 != 0) this.app_y = -999; 

		if (!app_exists) this.app_x = -999;

		g_win_to_app_button.make_vis();
		g_win_to_app_button.update_pos(this.app_x, this.app_y);

		g_win_to_app_text.make_vis();
		g_win_to_app_text.update_pos(this.app_x - 166, this.app_y - 15);

		if (using_cocoon_js == true) this.fb_x = -999;
		
		
		g_star_rating_obj.update_pos(this.starrate_x, this.starrate_y);
		if (this.play_state.game_mode != 3 || this.allow_rating == false) g_star_rating_obj.hide();

		this.save_x = -999;
		this.save_y = 250;

		if (this.show_save_option == true) {
			this.fb_x = -999;

			

			if (screen_width > screen_height) {
				this.save_x = screen_width - 32;
				this.save_y = screen_height - 64 - 16 - 8;//- 32;

				
			} else {

				this.save_x = screen_width - 32;
				this.save_y = screen_height - 64 - 64 - 16;
			}
		}

		
		this.save_x = -999;
		this.save_y = -999;

		
		if (this.play_state.current_level%6 == 0) {
			//g_win_twit.update_pos(this.fb_x, this.fb_y);
			//g_win_twit_text.update_pos(this.fb_x - 180, this.fb_y - 8);
		} else {
			
		}

		g_win_fb.update_pos(this.fb_x, this.fb_y);
		g_win_fb_text.update_pos(this.fb_x - 220, this.fb_y - 6);
		g_win_fb.make_vis();

		g_win_save_state.make_vis();
		g_win_save_state.update_pos(this.save_x, this.save_y);
		g_win_save_state_text.update_pos(this.save_x - 230, this.save_y - 8);

		if (false && screen_width > screen_height) g_win_message.update_pos(screen_width - 124 - this.timer/25,20);		
		else {
			g_win_message.update_pos(screen_width*0.5,screen_height - 128 - this.timer/25);
			g_win_message.center_x(screen_width*0.5);// 
		}

		g_next_level_button.update_pos(this.next_x, this.next_y);	// offscreen
		g_next_level_text.update_pos(this.next_x - 175, this.next_y - 8);


	},

	colourtimer: 45,
	colour_x: 0,
	colour_y: 0,

	bg_timer: 45,

	update: function() { 
		this.play_state.update();

		this.next_timer--;
		if (this.next_timer == 395) playSoundInstance('assets/onwin.wav',0.2);
		if(this.next_timer <= 0) {
			this.goto_next();
			return;
		}
		if (this.timer > 0) this.timer--;
		g_win_message.set_scale(1 + 2*this.timer/25);
		if (false && screen_width > screen_height) g_win_message.update_pos(screen_width - 124 - 30*this.timer/25,20);		
		else {
			g_win_message.update_pos(screen_width*0.5,screen_height - 128 - this.timer/25);
			g_win_message.center_x(screen_width*0.5);// 
		}

		if (this.timer == 1) {
			this.play_state.force_next_animate_block = this.mr_line_head;
		}

		this.colourtimer--;
		if (this.colourtimer <= 0 && this.do_colour == true) {
			this.colourtimer = 4;
			this.play_state.blocks[this.play_state.tiles[this.colour_x][this.colour_y]].linked_up = false;
			this.play_state.blocks[this.play_state.tiles[this.colour_x][this.colour_y]].linked_left = false;
			this.play_state.blocks[this.play_state.tiles[this.colour_x][this.colour_y]].linked_right = false;
			this.play_state.blocks[this.play_state.tiles[this.colour_x][this.colour_y]].linked_down = false;
			this.play_state.blocks[this.play_state.tiles[this.colour_x][this.colour_y]].linked_group = -1;
			this.play_state.blocks[this.play_state.tiles[this.colour_x][this.colour_y]].mine_multi = 1;
			if (this.play_state.blocks[this.play_state.tiles[this.colour_x][this.colour_y]].block_type == 0) 			{
				this.play_state.blocks[this.play_state.tiles[this.colour_x][this.colour_y]].put_x_on();
				if (this.bg_colour == 0) this.bg_colour = this.play_state.blocks[this.play_state.tiles[this.colour_x][this.colour_y]].secret_colour;
			} else {
				if (g_sound_on == true) playSoundInstance('assets/coin1.wav',0.05);
			}
			this.play_state.blocks[this.play_state.tiles[this.colour_x][this.colour_y]].colour_mode = true;
			this.play_state.blocks[this.play_state.tiles[this.colour_x][this.colour_y]].calc_sprite();
			this.colour_x++;
			if (this.colour_x >= this.play_state.level_w) {
				this.colour_x = 0;
				this.colour_y++;
				if (this.colour_y >= this.play_state.level_h) {
					this.do_colour = false;
					this.do_background = false;//true;
					this.colour_x = 0;
					this.colour_y = 0;
					this.bg_timer = 15;
				}
			}
			
		}

		this.bg_timer--;
		if (this.bg_timer <= 0 && this.do_background == true) {
			this.bg_timer = 2;
			if (this.play_state.blocks[this.play_state.tiles[this.colour_x][this.colour_y]].block_type == 0) 			{
				this.play_state.blocks[this.play_state.tiles[this.colour_x][this.colour_y]].secret_colour = this.bg_colour
				this.play_state.blocks[this.play_state.tiles[this.colour_x][this.colour_y]].colour_mode = true;
				this.play_state.blocks[this.play_state.tiles[this.colour_x][this.colour_y]].set_type(2);
				this.play_state.blocks[this.play_state.tiles[this.colour_x][this.colour_y]].calc_sprite();
			}
			
			this.colour_x++;
			if (this.colour_x >= this.play_state.level_w) {
				this.colour_x = 0;
				this.colour_y++;
				if (this.colour_y >= this.play_state.level_h) {
					this.do_background = false;
					this.colour_x = 0;
					this.colour_y = 0;
				}
			}
			
		}

	},

	cleanup: function() {
		g_win_poptilesprite.hide();
		g_win_message.update_pos(-999, -999);	// offscreen	
		g_next_level_button.update_pos(-999, -999);	// offscreen
		g_next_level_text.update_pos(-999, -999);
		g_win_fb_text.update_pos(-999, -999);
		g_win_picturename.hide();
		g_win_fb.hide();
		g_win_save_state_text.update_pos(-999, -999);
		g_win_save_state.hide();

		g_win_twit_text.update_pos(-999, -999);
		g_win_twit.hide();

		g_win_to_app_button.hide();

		g_win_to_app_text.hide();
		g_win_to_app_text.update_pos(-999, -999);

		g_star_rating_obj.hide();

		if (use_browser_cookies == true && game_cannot_save == false) {
			this.save_state();
			if (on_kong && kongregate.services.getUserId() > 0) this.submit_kong_stats();
		}

		
			
	},

	draw: function() {
		this.play_state.draw();


	},

	clicked_social: 0,

	handle_mouse_down: function(engine,x,y) {



		if (this.clicked_social == 1) return;

		if (mouse.x > this.fb_x - 16 &&
		    mouse.x < this.fb_x + 16 &&
		    mouse.y > this.fb_y - 16 &&
		    mouse.y < this.fb_y + 16) {
			this.clicked_social = 1;
			if (this.play_state.current_level%6 == 0) this.go_to_twit();
			else this.go_to_fb();
			return;
		}

		if (mouse.x > this.app_x - 16 &&
		    mouse.x < this.app_x + 16 &&
		    mouse.y > this.app_y - 16 &&
		    mouse.y < this.app_y + 16) {
			this.clicked_social = 1;
			open_url(gettheapp_url); 
			return;
		}
	},

	handle_key : function(keynum) {
		this.goto_next();
	},

	user_clicked_save: false,

	goto_next : function () {
		if (this.play_state.game_mode == 1) {
				// 1992 mode
				this.change_state(this.engine, new RestartGameStateClass(this.engine, this.play_state));
				return;
			} else if (this.play_state.game_mode == 2) {
				// testing level editor
				this.change_state(this.engine, new LevelEditorStateClass(this.engine, this.play_state));


				for (var x = 0; x < this.play_state.grid_w; x++) {
					for (var y = 0; y < this.play_state.grid_h; y++) {
						this.play_state.blocks[this.play_state.tiles[x][y]].editor_mode = 1;
					}
				}

				//this.play_state.restore_backup();
				return;
			} else if (this.play_state.game_mode == 3) {
				// community levels
				
				// mark as done
				for (var i = 0; i < g_community_list_data.length; i++) {
					if (g_current_community_level_id == g_community_list_data[i].hash) {
						
						g_community_list_data[i]['done'] = true;
					}

				}

				// if (this.play_state.game_mode != 3) g_star_rating_obj.hide();
				if (this.allow_rating == true &&
				    g_star_rating_obj.voted == 1) {
					var ratelevel = new RateLevel(this.engine, this.play_state);
					ratelevel.level_id = g_current_community_level_id;	// is this the hash???? it is now
					ratelevel.rating = g_star_rating_obj.rating;
					
					this.change_state(this.engine, ratelevel);
					return;
				}

				
				var auto_load = true;

				this.change_state(this.engine, new CommunityOverworldStateClass(this.engine, this.play_state, auto_load));


				return;
			}

			if (g_world_level_app_cutoff[this.play_state.current_world] <= this.play_state.current_level + 1) {
				this.change_state(this.engine, new NewOverworldStateClass(this.engine, this.play_state));
				return;
			}

			// game mode 0 - campaign levels
			// or 6 - challenge levels
			
			this.play_state.current_level++;

			var max_level = g_level_totalnum_world[this.play_state.current_world];
			
			
			var endgame = false;
			if (this.play_state.current_level >= max_level) endgame = true;
			
			if (endgame == true) {
				//this.play_state.current_level = 5;
				//this.change_state(this.engine, new GenerateRandStateClass(this.engine, this.play_state));
				this.change_state(this.engine, new ChallengeLevelsSelectHardness(this.engine, this.play_state));
				return;
			}

			if (g_tut_content[this.play_state.current_level] != null) {
				
				this.play_state.game_mode = 5;
				this.change_state(this.engine, new LoadInstructionStateClass(this.engine, this.play_state));
				return;
			}

			// After a win, we always load the next level by LoadingLevelStateClass
			// LoadingLevelStateClass will trigger a Tutorial if one exists IF the level is the first in its file
			// and the file is not loaded in
			// Tutorial will make another LoadingLevelStateClass 
			// BUT LoadingLevelStateClass WILL NOT load that tutorial again (as the level file is now loaded in)
			// LoadingLevelStateClass -> RestartGameClass -> Ads/crosspromote/begforratings
			//this.change_state(this.engine, new RestartGameStateClass(this.engine, this.play_state));
			this.change_state(this.engine, new LoadingLevelStateClass(this.engine, this.play_state, this.play_state.current_level, true));
	},

	mousedown_this_state: false,

	handle_mouse_up: function(engine,x,y) {

		var next_ = 0;

		if (this.play_state.game_mode == 3) g_star_rating_obj.click(mouse.x, mouse.y);

		if (mouse.x > this.save_x - 16 &&
		    mouse.x < this.save_x + 16 &&
		    mouse.y > this.save_y - 16 &&
		    mouse.y < this.save_y + 16 && game_cannot_save == false) {

			if (this.user_clicked_save == true) {
				this.user_clicked_save = false;
				use_browser_cookies = false;
				g_win_save_state.set_texture("button_small.png");
				g_win_save_state_text.change_text("REMEMBER PROGRESS?: NO\nPROGRESS IS *NOT* BEING SAVED");
				return;
			}

			use_browser_cookies = true;
			this.user_clicked_save = true;
			//this.save_state();
			g_win_save_state.set_texture("button_small_on.png");
			g_win_save_state_text.change_text("REMEMBER PROGRESS?: YES");
			return;
		}
		
		//if (screen_width < screen_height && mouse.y > screen_height*0.5) next_ = 1;

		

		if (mouse.x > this.next_x - 32 && mouse.x < this.next_x + 32 &&
		    mouse.y > this.next_y - 32 && mouse.y < this.next_y + 32) next_ = 1;

		if (this.mousedown_this_state == true) next_ = 1;	// click anywhere to next
		this.mousedown_this_state = true;

		if (next_ == 1) {
			this.goto_next();
			
		}
	}
});

// cross promotion
// 1st call - load zblip.com/crosspromote/currentgame.json
// 2nd call - load image file for whichever game to link to
//		or just zblip.com/crosspromote/currentgame.png
// 3rd call - display to player
crosspromote_list_loaded = 0;	// 1 == request sent,  2 == OK
crosspromote_json = null;
crosspromote_image = null;	// PIXI.texture
crosspromote_sprite = null;
crosspromote_text = null;
crosspromote_title = null;
crosspromote_header = null;
this_game_id = "puzzlebrush";
crosspromote_no_button = null;
crosspromote_no_text = null;

ShowZblipGame = GameStateClass.extend({
	play_state: null,
   	engine: null,

	init: function(engine, play_state) {

		this.engine = engine;
		this.play_state = play_state;

		

	},

	first_tick: 0,

	update : function () {

		if (this.first_tick > 0) return;
		this.first_tick = 1;

		if (crosspromote_list_loaded == 0) {
			crosspromote_list_loaded = 1;

			//////console.log("load crosspromote stuff");

			// send request
			fetch_json('https://www.zblip.com/crosspromote/currentgame.json', crosspromote_json);
			fetch_image('https://www.zblip.com/crosspromote/currentgame.png', crosspromote_image);

			this.goto_next_gamestate();
			
			return;
		} else if (crosspromote_json == null || crosspromote_image == null) {
			// waiting ...
			this.goto_next_gamestate();
			//////console.log("waiting for crosspromote stuff to load");
			return;
		} else if (crosspromote_json != null && 
			   crosspromote_image != null) {
			// display

			g_show_crosspromote = false;	// only once is needed

			if (this_game_id == crosspromote_json.game_id) {
				this.goto_next_gamestate();
				return;
			}	// same - dont show

			

			
			background_group.hide();
			play_screen_group.hide();

			//////console.log(crosspromote_image.toString());
			crosspromote_sprite = new SpriteClass();
			crosspromote_sprite.setup_sprite('crosspromote.png',Types.Layer.GAME_MENU);
			crosspromote_sprite.update_pos(100,100);
			crosspromote_sprite.make_vis();

			crosspromote_title = new TextClass(Types.Layer.GAME_MENU);
			crosspromote_title.set_font(Types.Fonts.MEDIUM);
			crosspromote_title.set_text(crosspromote_json.gamename);
			crosspromote_title.update_pos(194, 96);
			crosspromote_title.make_vis();

			crosspromote_text = new TextClass(Types.Layer.GAME_MENU);
			crosspromote_text.set_font(Types.Fonts.XSMALL);
			crosspromote_text.set_text(crosspromote_json.words);
			crosspromote_text.update_pos(194, 132);
			crosspromote_text.make_vis();

			crosspromote_header = new TextClass(Types.Layer.GAME_MENU);
			crosspromote_header.set_font(Types.Fonts.XSMALL);
			crosspromote_header.set_text(crosspromote_json.header);
			crosspromote_header.update_pos(194, 132);
			crosspromote_header.make_vis();

			crosspromote_no_button = new SpriteClass();
			crosspromote_no_button.setup_sprite("rightarrow.png",Types.Layer.GAME_MENU);
			crosspromote_no_button.update_pos(-999, -999);
			crosspromote_no_button.make_vis();

			crosspromote_no_text = new TextClass(Types.Layer.GAME_MENU);
			crosspromote_no_text.set_font(Types.Fonts.XSMALL);
			crosspromote_no_text.set_text("CONTINUE");
			crosspromote_no_text.update_pos(-999, -999);
			crosspromote_no_text.make_vis();

			// var new_menu = [1, Types.Events.WEB_LINK, crosspromote_json.gamename, "games_icon.png",crosspromote_json.url];
			// after MenuItems.push([0, "MORE GAMES"]);

			this.screen_resized();
		}
	},

	ad_x: 0,
	ad_y: 0,

	clicked_ad: 0,
	mouse_down: false,

	url: "",

	handle_mouse_down: function(engine,x,y) {

		if (this.mouse_down == true) return;
		this.mouse_down = true;

		var url = crosspromote_json.url;
		if (using_cocoon_js == true &&
		    crosspromote_json.gp_app_url != null) url = crosspromote_json.gp_app_url;


		if (mouse.x > this.ad_x - 545*0.5 &&
		    mouse.x < this.ad_x + 545*0.5 &&
		    mouse.y > this.ad_y - 199*0.5 &&
		    mouse.y < this.ad_y + 199*0.5) {
			if (this.clicked_ad == 1) return;
			this.clicked_ad = 1;
			
			window.open(url);
			return;
		} 
	},

	handle_mouse_up: function(engine,x,y) {

		this.mouse_down = false;

		if (mouse.x > this.ad_x - 545*0.5 &&
		    mouse.x < this.ad_x + 545*0.5 &&
		    mouse.y > this.ad_y - 199*0.5 &&
		    mouse.y < this.ad_y + 199*0.5) return;

		if (mouse.x > this.nope_x - 16 &&
		    	   mouse.x < this.nope_x + 16 &&
		    	   mouse.y > this.nope_y - 16 &&
		    	   mouse.y < this.nope_y + 16) {
			this.goto_next_gamestate();
		} else this.goto_next_gamestate();
	},

	nope_x: 0,
	nope_y: 0,

	screen_resized: function () {
		this.play_state.screen_resized();

		if (crosspromote_sprite == null) return;

		this.ad_x = screen_width*0.5;
		this.ad_y = 140;

		this.nope_x = screen_width - 64;
		this.nope_y = screen_height - 64;

		if (screen_width > screen_height) {
			
			crosspromote_sprite.update_pos(this.ad_x, this.ad_y);
			//crosspromote_title.update_pos(194, 96);
			//crosspromote_text.update_pos(194, 132);
			crosspromote_title.update_pos(32, 252);
			crosspromote_text.update_pos(32, 292);
			crosspromote_header.update_pos(32, 16);
			
		} else {
			crosspromote_sprite.update_pos(this.ad_x, this.ad_y);
			crosspromote_title.update_pos(32, 262);
			crosspromote_text.update_pos(32, 302);
			crosspromote_header.update_pos(32, 16);
		}

		crosspromote_no_button.update_pos(this.nope_x, this.nope_y);
		crosspromote_no_text.update_pos(this.nope_x - 116, this.nope_y - 12);

		crosspromote_title.center_x(this.ad_x);
		crosspromote_header.center_x(this.ad_x);
		crosspromote_text.center_x(this.ad_x);

	},

	cleanup: function () {
		
		if (crosspromote_sprite != null) crosspromote_sprite.hide();
		if (crosspromote_title != null) crosspromote_title.hide();
		if (crosspromote_text != null) crosspromote_text.hide();
		if (crosspromote_header != null) crosspromote_header.hide();
		if (crosspromote_no_button != null) crosspromote_no_button.hide();
		if (crosspromote_no_text != null) crosspromote_no_text.hide();

		background_group.make_vis();
		play_screen_group.make_vis();

	},

	goto_next_gamestate: function() {
		if (this.play_state.game_mode == 1) {
			//////console.log("goto_next_gamestate new GenerateRandStateClass");
			this.change_state(this.engine, new GenerateRandStateClass(this.engine, this.play_state));
		} else {
			//////console.log("goto_next_gamestate new StartGameStateClass");
			this.change_state(this.engine, new StartGameStateClass(this.engine, this.play_state));
		}
	}
});

// is this even needed?
ShowRewardedAdStateClass = GameStateClass.extend({

});

// Google Adsense for games
// adtest=on
// They require: Have a high volume of games content, i.e., greater than 70% games content with over 1 million games impressions monthly.
// So it's really just one program. Adwords is the advertisers side of it. Adsense the publishers side.


ShowAdStateClass = GameStateClass.extend({
    
    play_state: null,
    engine: null,
    done: 0,
    
    	init: function(engine, play_state) {
        	this.play_state = play_state;
		this.engine = engine;

		//g_show_ads = false;
   	},
    
    	update: function() { 
	
	
		if (g_interstitial_seen == true || 
		    g_interstitial_failed == true || 
		    g_interstitial_loaded == false || 
		    cordova_ready == false) {

			if (this.play_state.game_mode == 1) this.change_state(this.engine, new GenerateRandStateClass(this.engine, this.play_state));
				else this.change_state(this.engine, new StartGameStateClass(this.engine, this.play_state));
			return;
		}

		if (app_paused == true) {
			if (this.play_state.game_mode == 1) this.change_state(this.engine, new GenerateRandStateClass(this.engine, this.play_state));
				else this.change_state(this.engine, new StartGameStateClass(this.engine, this.play_state));
			return;
		}

		if (this.done == 0 && 
		    app_paused == false) {
			g_interstitial.show();
			//g_interstitial.load();
			g_interstitial_loaded = false;
		}
		this.done = 1;
	},

	cleanup: function() {
		//g_interstitial.load();  // i think this loads up the next one? i do i need to spawn a whole new object?
			
	},

	draw: function() {
	

	},
    
});

is_sitelocked = false;

sitelock_urls = [
	// coolmath
	//"https://www.coolmath-games.com",
	//"www.coolmath-games.com",
	//"edit.coolmath-games.com",
	//"www.stage.coolmath-games.com",
	//"edit-stage.coolmath-games.com",
	//"dev.coolmath-games.com"

	"zblip.itch.io",
	"https://zblip.itch.io/braincross",
	"zblip.itch.io/braincross",
	"http://192.168.1.3",
	"http://192.168.1.3/totheNET",

	"www.newgrounds.com"
];

GenerateRandLevelClass = GameStateClass.extend({


	seed: 0,

	game_state: null,
	play_state: null,

	line_end_x: 1,
	line_end_y: 1,
	line_start_x: 1,
	line_start_y: 1,

	engine: null,

	init: function(engine, play_state) {

		this.engine = engine;

		this.play_state = play_state;
		this.game_state =  play_state;
		
		this.play_state.level_w = 10;
		this.play_state.level_h = 10;
		
	},

	drag : function (x, y, tox, toy) {
		var moved_ = this.game_state.blocks[this.game_state.tiles[x][y]].on_drag_into(tox, toy);
		if (moved_ == false &&
		    this.game_state.blocks[this.game_state.tiles[tox][toy]].is_main_line() == true &&
		    this.game_state.blocks[this.game_state.tiles[tox][toy]].block_type == GameTypes.Tiles.EMPTY &&
		    this.game_state.blocks[this.game_state.tiles[tox + (tox - x)][toy + (toy - y)]].block_type != GameTypes.Tiles.BRIDGE &&
		    this.game_state.blocks[this.game_state.tiles[x][y]].block_type != GameTypes.Tiles.BRIDGE &&
		    this.game_state.is_in_level(tox + (tox - x), toy + (toy - y)) &&
		    this.game_state.blocks[this.game_state.tiles[tox + (tox - x)][toy + (toy - y)]].is_fillable() == true &&
		    this.game_state.blocks[this.game_state.tiles[tox + (tox - x)][toy + (toy - y)]].is_main_line() == false) {
			if (y == toy) this.game_state.blocks[this.game_state.tiles[tox][toy]].set_type(GameTypes.Tiles.BRIDGE);
			//else this.insert_bridge_over_existing_horiz_line(tox, toy);
			//moved_ = this.game_state.blocks[this.game_state.tiles[x][y]].on_drag_into(tox, toy);
		}
		return moved_;
	},

	insert_bridge_over_existing_horiz_line : function (x, y) {

		if (this.game_state.is_in_level(x, y) == false) return;
		if (this.game_state.is_in_level(x - 1, y) == false) return;
		if (this.game_state.is_in_level(x + 1, y) == false) return;

		this.game_state.blocks[this.game_state.tiles[x][y]].line_type = -1;
		this.game_state.blocks[this.game_state.tiles[x][y]].next_line_index = -1;
		this.game_state.blocks[this.game_state.tiles[x][y]].prev_line_index = -1;

		if (this.game_state.blocks[this.game_state.tiles[x - 1][y]].next_line_index == this.game_state.tiles[x][y]) {
			this.game_state.blocks[this.game_state.tiles[x - 1][y]].next_line_index = this.game_state.tiles[x + 1][y];
			this.game_state.blocks[this.game_state.tiles[x + 1][y]].prev_line_index = this.game_state.tiles[x - 1][y];
		} else {
			this.game_state.blocks[this.game_state.tiles[x - 1][y]].prev_line_index = this.game_state.tiles[x + 1][y];
			this.game_state.blocks[this.game_state.tiles[x + 1][y]].next_line_index = this.game_state.tiles[x - 1][y];
		}

		this.game_state.blocks[this.game_state.tiles[x][y]].set_type(GameTypes.Tiles.BRIDGE);
	},

	empty_grid : function () {
		this.game_state = this.play_state;
		this.game_state.reset();

		for (var x = 0; x < this.game_state.level_w; x++) {
			for (var y = 0; y < this.game_state.level_h; y++) {
				this.game_state.set_tile(x, y, GameTypes.Tiles.EMPTY);	
				this.game_state.blocks[this.game_state.tiles[x][y]].generator_can_be_lockout = true;
			}
		}

		// border
		for (var x = 0; x < this.game_state.level_w; x++) {
			this.game_state.set_tile(x, 0, GameTypes.Tiles.SOLID);
			this.game_state.set_tile(x, this.game_state.level_h - 1, GameTypes.Tiles.SOLID);
		}

		for (var y = 0; y < this.game_state.level_h; y++) {
			this.game_state.set_tile(0, y, GameTypes.Tiles.SOLID);
			this.game_state.set_tile(this.game_state.level_w - 1, y, GameTypes.Tiles.SOLID);	
		}
	},

	get_random : function (max) {
		return Math.floor(max*Math.random());
	},

	line_steps: 0,

	move_line : function () {
		var xoff = 0;
		var yoff = 0;
		var rand_ = this.get_random(4);
		if (rand_ == 0) xoff++;
		else if (rand_ == 1) xoff--;
		else if (rand_ == 2) yoff++;
		else if (rand_ == 3) yoff--;

		if (this.game_state.blocks[this.game_state.tiles[this.line_end_x][this.line_end_y]].generator_goto_xoff != null) {
			xoff = this.game_state.blocks[this.game_state.tiles[this.line_end_x][this.line_end_y]].generator_goto_xoff;
			yoff = this.game_state.blocks[this.game_state.tiles[this.line_end_x][this.line_end_y]].generator_goto_yoff;
	}

		var prev_line_i = this.game_state.blocks[this.game_state.tiles[this.line_end_x][this.line_end_y]].prev_line_index;

		var prev_x = -1;
		var prev_y = -1;

		if (this.game_state.is_index_in_level(prev_line_i) == true) {
			prev_x = this.game_state.blocks[prev_line_i].x;
			prev_y = this.game_state.blocks[prev_line_i].y;
		}

		// avoid backtracking
		var target_x = this.line_end_x + xoff;
		var target_y = this.line_end_y + yoff;

		if (this.game_state.is_in_level(target_x, target_y) == false) return -1;

		if (this.game_state.blocks[this.game_state.tiles[this.line_end_x + xoff][this.line_end_y + yoff]].is_warp_type(this.line_end_x, this.line_end_y)) {

			target_x = this.game_state.blocks[this.game_state.tiles[this.line_end_x + xoff][this.line_end_y + yoff]].get_warp_to_x(this.line_end_x, this.line_end_y);
			target_y = this.game_state.blocks[this.game_state.tiles[this.line_end_x + xoff][this.line_end_y + yoff]].get_warp_to_y(this.line_end_x, this.line_end_y);

		}
				
		if (target_x == prev_x &&
		    target_y == prev_y) {
			return -1;
		}

		var success = this.drag(this.line_end_x, this.line_end_y, this.line_end_x + xoff, this.line_end_y + yoff);
		if (success) {
					
					

			this.line_end_x = target_x;
			this.line_end_y = target_y;
			this.line_steps++;
			return 1;
		} else return -1;

		

		
	},

	add_possible_start : function (x, y) {
		this.game_state.blocks[this.game_state.tiles[x][y]].set_type(GameTypes.Tiles.LINE_START_A_POSSIBLE);
	},

	add_turner : function (x, y) {
		
		var next_x = this.play_state.get_x_from_index(this.game_state.blocks[this.game_state.tiles[x][y]].next_line_index);
		var next_y = this.play_state.get_y_from_index(this.game_state.blocks[this.game_state.tiles[x][y]].next_line_index);
		var prev_x = this.play_state.get_x_from_index(this.game_state.blocks[this.game_state.tiles[x][y]].prev_line_index);
		var prev_y = this.play_state.get_y_from_index(this.game_state.blocks[this.game_state.tiles[x][y]].prev_line_index);

		
		if (next_x == prev_x || next_y == prev_y) return;
		

		this.game_state.blocks[this.game_state.tiles[x][y]].set_type(GameTypes.Tiles.TURN_DIAMOND);
	},

	count_adjacent_lockouts : function (x, y) {
		if (this.game_state.is_in_level(x, y) == false) return -1;

		var count_ = 0;

		if (this.game_state.is_in_level(x - 1, y) &&
		    this.game_state.blocks[this.game_state.tiles[x - 1][y]].block_type == GameTypes.Tiles.LOCKOUT ||
		    this.game_state.blocks[this.game_state.tiles[x - 1][y]].block_type == GameTypes.Tiles.LOCKOUT_LOCKED) count_++;

		if (this.game_state.is_in_level(x + 1, y) &&
		    this.game_state.blocks[this.game_state.tiles[x + 1][y]].block_type == GameTypes.Tiles.LOCKOUT ||
		    this.game_state.blocks[this.game_state.tiles[x + 1][y]].block_type == GameTypes.Tiles.LOCKOUT_LOCKED) count_++;
		if (this.game_state.is_in_level(x, y - 1) &&
		    this.game_state.blocks[this.game_state.tiles[x][y - 1]].block_type == GameTypes.Tiles.LOCKOUT ||
		    this.game_state.blocks[this.game_state.tiles[x][y - 1]].block_type == GameTypes.Tiles.LOCKOUT_LOCKED) count_++;

		if (this.game_state.is_in_level(x, y + 1) &&
		    this.game_state.blocks[this.game_state.tiles[x][y + 1]].block_type == GameTypes.Tiles.LOCKOUT ||
		    this.game_state.blocks[this.game_state.tiles[x][y + 1]].block_type == GameTypes.Tiles.LOCKOUT_LOCKED) count_++;
		
		return count_;
	},

	make_lockout_tile : function (x, y) {

		if (this.game_state.is_in_level(x, y) == false ||
		    this.game_state.blocks[this.game_state.tiles[x][y]].generator_can_be_lockout == false ||
		    this.game_state.blocks[this.game_state.tiles[x][y]].line_type > 0 ||
		    this.game_state.blocks[this.game_state.tiles[x][y]].block_type != GameTypes.Tiles.EMPTY) return;

		this.game_state.blocks[this.game_state.tiles[x][y]].set_type(GameTypes.Tiles.LOCKOUT);

		if (this.game_state.is_in_level(x - 1, y)) this.game_state.blocks[this.game_state.tiles[x - 1][y]].generator_can_be_lockout = false;

		if (this.game_state.is_in_level(x + 1, y)) this.game_state.blocks[this.game_state.tiles[x + 1][y]].generator_can_be_lockout = false;

		if (this.game_state.is_in_level(x, y - 1)) this.game_state.blocks[this.game_state.tiles[x][y - 1]].generator_can_be_lockout = false;

		if (this.game_state.is_in_level(x, y + 1)) this.game_state.blocks[this.game_state.tiles[x][y + 1]].generator_can_be_lockout = false;
	},

	add_lockout_group_line_tile : function (x, y) {

		if (this.game_state.is_in_level(x, y) == false ||
		    this.game_state.blocks[this.game_state.tiles[x][y]].generator_can_be_lockout == false ||
		    this.game_state.blocks[this.game_state.tiles[x][y]].line_type <= 0 ||
		    this.game_state.blocks[this.game_state.tiles[x][y]].block_type != GameTypes.Tiles.EMPTY) return;
		
		
		this.game_state.blocks[this.game_state.tiles[x][y]].set_type(GameTypes.Tiles.LOCKOUT);

		if (this.game_state.is_in_level(x - 1, y) &&
		    x > 1) this.make_lockout_tile(x - 1, y);

		if (this.game_state.is_in_level(x + 1, y)) this.make_lockout_tile(x + 1, y);

		if (this.game_state.is_in_level(x, y - 1)) this.make_lockout_tile(x, y - 1);

		if (this.game_state.is_in_level(x, y + 1)) this.make_lockout_tile(x, y + 1);

		if (this.game_state.is_in_level(x - 1, y)) this.game_state.blocks[this.game_state.tiles[x - 1][y]].generator_can_be_lockout = false;

		if (this.game_state.is_in_level(x + 1, y)) this.game_state.blocks[this.game_state.tiles[x + 1][y]].generator_can_be_lockout = false;

		if (this.game_state.is_in_level(x, y - 1)) this.game_state.blocks[this.game_state.tiles[x][y - 1]].generator_can_be_lockout = false;

		if (this.game_state.is_in_level(x, y + 1)) this.game_state.blocks[this.game_state.tiles[x][y + 1]].generator_can_be_lockout = false;

	},

	get_empty_line_size : function (xa, ya) {

		if (this.game_state.blocks[this.game_state.tiles[xa][ya]].line_type > 0) return 0;

		this.game_state.reset_flowfill();

		var fringe = [];
		fringe.push(this.game_state.tiles[xa][ya]);
		this.game_state.blocks[this.game_state.tiles[xa][ya]].flowfill_seen = true;

		var loops = 0;

	

		while (loops < 200 && fringe.length > 0) {
			loops++;
		
			var b = fringe.pop();

			var x = this.game_state.blocks[b].x;
			var y = this.game_state.blocks[b].y;

			if (x > 0 &&
			    this.game_state.blocks[this.game_state.tiles[x - 1][y]].line_type <= 0 &&
			     this.game_state.blocks[this.game_state.tiles[x - 1][y]].flowfill_seen == false &&
				this.game_state.blocks[this.game_state.tiles[x - 1][y]].is_fillable() == true) {	

				fringe.push(this.game_state.tiles[x - 1][y]);
				this.game_state.blocks[this.game_state.tiles[x - 1][y]].flowfill_seen = true;
				
			}

			if (y > 0 &&
			    this.game_state.blocks[this.game_state.tiles[x][y - 1]].line_type <= 0 &&
			     this.game_state.blocks[this.game_state.tiles[x][y - 1]].flowfill_seen == false &&
				this.game_state.blocks[this.game_state.tiles[x][y - 1]].is_fillable() == true) {	

				fringe.push(this.game_state.tiles[x][y - 1]);
				this.game_state.blocks[this.game_state.tiles[x][y - 1]].flowfill_seen = true;
				
				
			}

			if (x < this.game_state.grid_w - 1 &&
			    this.game_state.blocks[this.game_state.tiles[x + 1][y]].line_type <= 0 &&
			     this.game_state.blocks[this.game_state.tiles[x + 1][y]].flowfill_seen == false &&
				this.game_state.blocks[this.game_state.tiles[x + 1][y]].is_fillable() == true) {	

				fringe.push(this.game_state.tiles[x + 1][y]);
				this.game_state.blocks[this.game_state.tiles[x + 1][y]].flowfill_seen = true;
				
				
			}

			if (y < this.game_state.grid_h - 1 &&
			    this.game_state.blocks[this.game_state.tiles[x][y + 1]].line_type <= 0 &&
			     this.game_state.blocks[this.game_state.tiles[x][y + 1]].flowfill_seen == false &&
				this.game_state.blocks[this.game_state.tiles[x][y + 1]].is_fillable() == true) {	

				fringe.push(this.game_state.tiles[x][y + 1]);
				this.game_state.blocks[this.game_state.tiles[x][y + 1]].flowfill_seen = true;
				
				
			}


		}

		return loops;
	},

	added_safe_qcat: false,
	added_any_qcat : false,

	add_qcat : function (x, y, safe_qcat) {
		if (this.game_state.blocks[this.game_state.tiles[x][y]].block_type != GameTypes.Tiles.EMPTY) return;
		if (this.game_state.blocks[this.game_state.tiles[x][y]].line_type < 1) {

			var qcat_colour = safe_qcat;
			while (qcat_colour == safe_qcat) {
				if (Math.random() < 0.33) {
					qcat_colour = GameTypes.Tiles.QCAT_GREEN;
				} else if (Math.random() < 0.66) {
					qcat_colour = GameTypes.Tiles.QCAT_RED;
				} else {
					qcat_colour = GameTypes.Tiles.QCAT_BLUE;
				}
			}
			
			this.game_state.blocks[this.game_state.tiles[x][y]].set_type(qcat_colour);
			
		} else {
			this.game_state.blocks[this.game_state.tiles[x][y]].set_type(safe_qcat);
			this.added_safe_qcat = true;
		}

		this.added_any_qcat = true;
	},

	pre_add_obstacles : function () {
		var rand_one = this.get_random(10);

		var x = this.get_random(8) + 1;
		var y = this.get_random(8) + 1;

		if (rand_one < 3) {
			
		}
	},
	qcat_safe_colour: -1,
	add_obstacles : function () {
		var qcat_safe_colour = GameTypes.Tiles.QCAT_GREEN;
		var rand_cat = this.get_random(3);

		if (rand_cat  == 0) {

		} else if (rand_cat  == 1) {
			qcat_safe_colour = GameTypes.Tiles.QCAT_RED;
		} else {
			qcat_safe_colour = GameTypes.Tiles.QCAT_BLUE;
		}

		this.qcat_safe_colour = qcat_safe_colour;

		for (var y = 0; y < this.game_state.level_h; y++) {
			for (var x = 0; x < this.game_state.level_w; x++) {

				var rand_one = this.get_random(10);

				if (this.game_state.blocks[this.game_state.tiles[x][y]].block_type != GameTypes.Tiles.EMPTY) continue;
				// this.game_state.blocks[this.game_state.tiles[x][y]].generator_can_be_lockout
				if (this.game_state.blocks[this.game_state.tiles[x][y]].line_type <= 0) {
					//var empty_size = this.get_empty_line_size(x, y);
					//if (this.get_random(3) == 1) this.add_qcat(x, y, qcat_safe_colour);
					//else if (rand_one < 0.15*empty_size) this.add_lockout_group(x,y);
					//else this.add_qcat(x, y, qcat_safe_colour);
				} else if (rand_one < 1) {}//this.add_hearts(x,y);
				else if (rand_one < 2) this.add_turner(x,y);
				//else if (rand_one < 3) this.add_qcat(x, y, qcat_safe_colour);
				else if (rand_one < 3) this.add_possible_start(x,y);
				else if (rand_one < 6) this.add_lockout_group_line_tile(x, y);
			}
		}

		// along the line
		var node_ = this.game_state.tiles[this.line_start_x][this.line_start_y];
		var redkeys = 0;
		for (var i = 0; i < 100; i++) {
			if (this.game_state.is_index_in_level(node_) == false) break;

			if (this.get_random(10) < 1 &&
			    this.game_state.blocks[node_].block_type == GameTypes.Tiles.EMPTY) {
				this.game_state.blocks[node_].set_type(GameTypes.Tiles.RED_KEY);
				redkeys++;
			}

			var next_i = this.game_state.blocks[node_].next_line_index;

			if (this.game_state.is_index_in_level(next_i) == false) break;

			if (redkeys > 0 &&
			    this.get_random(10) < 1) {
				var this_x = this.game_state.blocks[node_].x;
				var this_y = this.game_state.blocks[node_].y;

				var next_x = this.game_state.blocks[next_i].x;
				var next_y = this.game_state.blocks[next_i].y;

				if (this.game_state.blocks[node_].get_edge_type_in_level(this_x, this_y, next_x, next_y) == GameTypes.Edges.EMPTY) {
					redkeys--;
					this.game_state.blocks[node_].set_edge_type_in_level(this_x, this_y, next_x, next_y, GameTypes.Edges.RED_LOCKED_DOOR)
				}

				
			}

			node_ = next_i;
		
		}

		if (this.added_safe_qcat == false &&
		    this.added_any_qcat == true) {
			for (var y = 0; y < this.game_state.level_h; y++) {
			for (var x = 0; x < this.game_state.level_w; x++) {
				if (this.game_state.blocks[this.game_state.tiles[x][y]].line_type > 0 &&
				    this.game_state.blocks[this.game_state.tiles[x][y]].block_type == GameTypes.Tiles.EMPTY) {
					if (this.added_safe_qcat == true) break;
					this.add_qcat(x, y, qcat_safe_colour);
					
				}

			}
			}

			if (this.added_safe_qcat == false) {
				for (var y = 0; y < this.game_state.level_h; y++) {
				for (var x = 0; x < this.game_state.level_w; x++) {
					if (this.game_state.blocks[this.game_state.tiles[x][y]].block_type == GameTypes.Tiles.QCAT_RED ||
	 this.game_state.blocks[this.game_state.tiles[x][y]].block_type == GameTypes.Tiles.QCAT_GREEN ||
	 this.game_state.blocks[this.game_state.tiles[x][y]].block_type == GameTypes.Tiles.QCAT_BLUE) {
					this.game_state.blocks[this.game_state.tiles[x][y]].set_type(GameTypes.Tiles.SOLID);
					}
				}
				}
			}
		}
	},

	pre_run_x: -1,
	pre_run_y: -1,

	pre_run : function () {
		for (var y = 0; y < this.game_state.level_h; y++) {
			for (var x = 0; x < this.game_state.level_w; x++) {
				this.game_state.blocks[this.game_state.tiles[x][y]].generator_seen = false;
			}
		}

		
	},

	generate_line_path : function () {
		this.empty_grid();

		this.pre_add_obstacles();

		var x = this.get_random(8) + 1;
		var y = this.get_random(8) + 1;

		this.game_state.blocks[this.game_state.tiles[x][y]].set_type(GameTypes.Tiles.LINE_START_A);
		this.game_state.blocks[this.game_state.tiles[x][y]].line_type = 1;

		this.line_start_x = x;
		this.line_start_y = y;	
		this.line_end_x = x;
		this.line_end_y = y;

		this.line_steps = 0;

		for (var i = 0; i < 100; i++) this.move_line();
	},

	

	update : function() {
		for (var attempts = 0; attempts < 10; attempts++) {
			this.generate_line_path();
			//console.log("generate > this.line_steps " + this.line_steps);
			if (this.line_steps > 35) {
				
				break;
			}
		}

		this.add_obstacles();

		for (var y = 0; y < this.game_state.level_h; y++) {
			for (var x = 0; x < this.game_state.level_w; x++) {

				


				if (this.game_state.blocks[this.game_state.tiles[x][y]].block_type == GameTypes.Tiles.EMPTY &&
				    this.game_state.blocks[this.game_state.tiles[x][y]].is_main_line() == false) {
					this.game_state.blocks[this.game_state.tiles[x][y]].set_type(GameTypes.Tiles.SOLID);
				}

				if (this.game_state.blocks[this.game_state.tiles[x][y]].block_type == GameTypes.Tiles.LOCKOUT&&	
				    this.game_state.blocks[this.game_state.tiles[x][y]].is_main_line() &&
				    this.count_adjacent_lockouts(x,y) == 0) {
					if (this.added_any_qcat) this.game_state.blocks[this.game_state.tiles[x][y]].block_type =this.qcat_safe_colour;
					else this.game_state.blocks[this.game_state.tiles[x][y]].block_type =GameTypes.Tiles.EMPTY;
				}
					
			}
		}

		for (var y = 0; y < this.game_state.level_h; y++) {
			for (var x = 0; x < this.game_state.level_w; x++) {
				if (this.game_state.blocks[this.game_state.tiles[x][y]].block_type == GameTypes.Tiles.SOLID &&
				    this.game_state.blocks[this.game_state.tiles[x][y]].count_nonsolid_neighbours() == 0) {
					//this.game_state.blocks[this.game_state.tiles[x][y]].set_type(GameTypes.Tiles.ABYSS);
					this.game_state.blocks[this.game_state.tiles[x][y]].generator_mark_for_deletion = true;
				} else {
					this.game_state.blocks[this.game_state.tiles[x][y]].generator_mark_for_deletion = false;
				}
		
			}
		}

		for (var y = 0; y < this.game_state.level_h; y++) {
			for (var x = 0; x < this.game_state.level_w; x++) {
				if (this.game_state.blocks[this.game_state.tiles[x][y]].generator_mark_for_deletion) {
					this.game_state.blocks[this.game_state.tiles[x][y]].set_type(GameTypes.Tiles.ABYSS);
				}
			}
		}

		for(var y = 0; y < this.play_state.level_h; y++) {
            		for(var x = 0; x < this.play_state.level_w; x++) {
				
				this.play_state.blocks[this.play_state.tiles[x][y]].calc_lockout_group();
				this.play_state.blocks[this.play_state.tiles[x][y]].calc_lockout_onexit_group();
				this.play_state.blocks[this.play_state.tiles[x][y]].calc_bubble_group();
				this.play_state.blocks[this.play_state.tiles[x][y]].find_other_q_cats_in_level();
				this.play_state.blocks[this.play_state.tiles[x][y]].calc_lockout_multi_group();
				//this.blocks[this.tiles[x][y]].setup();
			}
		}

		this.change_state(this.engine, new StartGameStateClass(this.engine, this.play_state));
	}
});

var g_interstitial;
var g_interstitial_failed = false;
var g_interstitial_loaded = false;
var g_interstitial_seen = false;

var g_show_ads = false;
var g_show_crosspromote = false;

if (is_sitelocked == true) g_show_crosspromote = false;

var total_levels_played = 0;
var total_levels_played_this_session = 0;
var levels_until_ad = 50;

var app_paused = false;
var game_cannot_save = false;

BootStateClass = GameStateClass.extend({

	start_level: 0,		// change this based on cookies

	first_time: true,

	init: function(){

		
		g_win_fb_text = new TextClass(Types.Layer.GAME_MENU);
		g_win_fb_text.set_font(Types.Fonts.XSMALL);
		g_win_fb_text.set_text("FIND US ON FACEBOOK");
		g_win_fb_text.hide();

		g_win_fb = new SpriteClass();
		g_win_fb.setup_sprite('fblogo.png',Types.Layer.GAME_MENU);
		g_win_fb.hide();

		
		
		//('boot state init');

		//if (use_browser_cookies == false) return;

		if (on_coolmath == true) use_browser_cookies = true;	// coolmath wants to save user's progress by default

		
		// // Retrieve document.getElementById("result").innerHTML = localStorage.getItem("lastname");

		try {
			this.load_everything();
		} catch (e) {
			game_cannot_save = true;
		}

		// Unlock everything!
		for (var w = 0; w < g_level_progress_world.length; w++) {
			
			//g_level_progress_world[w] = 999999999;
		}

		
 
	},

	load_everything : function () {

		// Merely checking the localstorage *appears* to create a localstorage entry on the client computer

		var dosave = document.cookie.indexOf('DOSAVE=');

		if ( dosave  == -1) {
			
			use_browser_cookies = false
		} else use_browser_cookies = true;


		//console.log('dosave  ' + dosave  );
		if (use_browser_cookies == false) return;
		
		
		if (window.localStorage.length > 0) {

		} else {
			//console.log("window.localStorage.length " + window.localStorage.length);
			return;
		}
		
		if (!localStorage.getItem("total_levels_played")) return;

		// this should work with the progress - worlds system

		// localStorage.setItem("zblip_puzzlebrush_progress_world" + w.toString, JSON.stringify(g_level_progress_world[w]));
		for (var w = 0; w < g_level_progress_world.length; w++) {
			var item_ = window.localStorage.getItem("zblip_puzzlebrush_progress_world" + w.toString());
			//alert(item_);
			if (item_ == null) {
				// 
				continue;
			}
			use_browser_cookies = true;

			var prog_ = JSON.parse(item_);
			//alert(prog_);
			if (prog_ != null) g_level_progress_world[w] = parseInt(prog_);
		}

		var tot_lev_played = localStorage.getItem("total_levels_played");
		if (tot_lev_played == null) tot_lev_played = 0;
		total_levels_played = tot_lev_played;

		var sound_on = localStorage.getItem("g_sound_on");
		if (sound_on == true || sound_on == false) g_sound_on = sound_on;

		console.log("load hints");

		var hints_used = localStorage.getItem("hint_points");
		console.log("hints_used " + hints_used );
		if (hints_used != null && hints_used >= 0 && hints_used <= 10) this.hint_points = hints_used;
		
		console.log("hints_used " + hints_used );
		return;

		var puzzlebrushlevels = localStorage.getItem("puzzlebrushlevels");
		var puzzlebrushclicktodig = localStorage.getItem("puzzlebrushclicktodig");
		var puzzlebrushholdtoflag = localStorage.getItem("puzzlebrushholdtoflag");

		// to read:
		zblip_puzzlebrush_g_all_level_status = JSON.parse(window.localStorage.getItem("zblip_puzzlebrush_g_all_level_status"));
		////alert(meta1['22']);
		if (zblip_puzzlebrush_g_all_level_status != null) {
			//g_all_level_status = zblip_puzzlebrush_g_all_level_status;

			load_all_level_status(zblip_puzzlebrush_g_all_level_status);

			// bug - if zblip_puzzlebrush_g_all_level_status lacks .nosmiley
			//	 it overwrites the .nosmiley in g_all_level_status

			this.first_time = false;
			this.start_level = 1;

			for (levelnum in g_all_level_status) {
				if (levelnum > this.start_level) this.start_level = levelnum;
			}
		}
		

		if (puzzlebrushlevels != null) {
			
			//var levels_ = puzzlebrushlevels.split("=")[1]; // array of levels
			var levels_array = puzzlebrushlevels.split("a");	// '1a2a3a6' ... ['1','2','3','6']

			for (lev in levels_array) {
				var levelnum = Number(levels_array[lev]);
					
				if(levelnum < g_total_num_of_levels &&
			  	   levelnum >= 0) {
					g_all_level_status[levelnum] = 4;	// tick, done

					use_browser_cookies = true;	
					// if we found a cookie, then this user previously opted to save

					if (levelnum > this.start_level) this.start_level = levelnum + 2;

				} 

				

			}

		} // if (puzzlebrushlevels != null)

		if (puzzlebrushclicktodig != null) {
			var bool_ = puzzlebrushclicktodig;	// 1 or 0
			if (bool_ == null || bool_ == undefined) return;
			if (bool_ == '0') g_click_to_dig = false;
			else g_click_to_dig = true;
		}

		if (puzzlebrushholdtoflag != null) {
			var bool_ = puzzlebrushholdtoflag;	// 1 or 0
			if (bool_ == null || bool_ == undefined) return;
			if (bool_ == '0') g_hold_to_flag = false;
			else g_hold_to_flag = true;
		}

		

		for (lev in levels_array) {
			var l = Number(levels_array[lev]);

			if(l < g_total_num_of_levels &&
			   l >= 0) {

				var string_key = "puzzlebrushlevel" + l.toString();
			
				var level_done = localStorage.getItem(string_key);
				if (level_done != null) {
					g_all_level_status[l] = 4;	// tick, done

					use_browser_cookies = true;

				}	

			}

			
		}

		


	},

	handle_events: function(engine,x,y,event_type){
		
		//if(this.wait_timer > 0) {return;}


		if(event_type == Types.Events.MOUSE_CLICK) {
			// User clicked at (x,y)
			
			this.start_game (engine);


		}
		
	},

	check_blacklist : function () {
		if (using_cocoon_js == true) return 0;
		var current_url = location_hostname;

		//if (current_url == "www.example.com") return 1;


		return 0;
	},

	check_sitelock : function() {
		if (is_sitelocked == false) return 1;

		if (location.hostname === "localhost" || location.hostname === "127.0.0.1") return 1;

		var current_url = location.hostname;

		
		for (var u = 0; u < sitelock_urls.length; u++) {
			if (sitelock_urls[u] == current_url) return 1;
			if (sitelock_urls[u] == browser_url) return 1;
		}

		return 0;

	},

	hint_points: 5,

	start_game: function (engine) {

		//////alert('on_kong ' + on_kong);

		if (is_sitelocked == true && this.check_sitelock() == 0) return;

		if (this.check_blacklist() == 1) return;

		if (use_browser_cookies == true &&
		    g_level_progress_world[1] > 1) app_exists = true;

		//console.log('use_browser_cookies ' + use_browser_cookies);
		//console.log('g_level_progress_world[1] ' + g_level_progress_world[1]);

		remove_splash();

		
		gBlipFrogMenu.pop_up(); 
		gBlipFrogMenu.pop_down();
		gBlipFrogMenu.hurry_menu();

		var play_state = new PlayStateClass(engine);

		engine.push_state(play_state);

		play_state.screen_resized();

		play_state.current_level = this.start_level;

		g_hold_to_flag = true;
		g_click_to_dig = true;
		play_state.hint_points = this.hint_points;

		// this.play_state.current_level >= g_total_num_of_levels

		// For now - Mathsweeper will launch right into GenerateRandStateClass 
		//engine.push_state(new GenerateRandStateClass(engine, engine.get_state()));
		//return;

		// tutorial:
		play_state.game_mode = 0;
		//play_state.current_level = 0;
		play_screen_container.hide();
		tilebackground_group.hide();
		//background_group.hide();
		//play_state.reset();	// new LoadingLevelStateClass(this, this.state_stack[1], 0)
		//engine.push_state(new LoadingLevelStateClass(engine, engine.get_state(), 0));
		//return;

		if (g_autoload_level != null && g_autoload_level.length > 10) {
			// load a community level from url parameter

			engine.push_state(new CommunityFetchStateClass(engine, engine.get_state()));

		} else if (play_state.current_level > 0 || this.first_time == false) {

			// Loading Level 0

			//engine.push_state(new LoadingLevelStateClass(engine, engine.get_state(), this.start_level));

			engine.push_state(new OverworldStateClass(engine, engine.get_state()));

			//var ratelevel = new RateLevel(engine, engine.get_state());
			//ratelevel.level_id = '456a295abcb37874d0f50de82a9654ad';
			//ratelevel.rating = 240;
			//engine.push_state(ratelevel);

			play_state.reset();

		} else {
		
			if (true || use_browser_cookies == true) {
				engine.push_state(new MenuStateClass(engine, engine.get_state()));
			} else {
				// InstructionStateClass
				play_state.current_level = 0;
				play_state.game_mode = 5;
				engine.push_state(new LoadInstructionStateClass(engine, engine.get_state()));
			}
			
			
			//engine.push_state(new LoadingLevelStateClass(engine, engine.get_state(), 0));

			//play_state.current_level = 0;
			//this.start_level = 0;			
			//engine.push_state(new LoadingLevelStateClass(engine, engine.get_state(), this.start_level));

			//play_state.reset();

		}
		
	
	},

	screen_resized : function (engine) {
		//this.play_state.screen_resized(engine);
	},

	update: function(engine) {
		this.start_game(engine);
	},

	draw: function() {
	}

});

function gaussian_rand() {
  var calls_ = 6;
  var i = calls_;
  var res = 0;
  while(i--) res += Math.random();
  return res/calls_; 
}

// ff9400

pBar.value += 10;
