// http://gamedevgeek.com/tutorials/managing-game-states-in-c/

//var backend_url = 'http://localhost:3000/levels';//

var backend_url = 'https://salty-ravine-95905.herokuapp.com/';


//var backend_url = 'http://localhost:3000/'f

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
			this.handle_key(g_key_pressed);
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

// specific to coolmath API:
unlockAllLevels = function () {
	if (on_coolmath == false) return; // should only be called by coolmath anyway
	
	// but i'm starting with all levels unlocked anyway so this isn't needed
};


PlayStateClass = GameStateClass.extend({
	

	engine: null,

	tiles: [],	// holds indexes to this.blocks
	grid_w: 15,
	grid_h: 15,
	current_grid_w: 12,
	current_grid_h: 12,
	tile_size: 48,
	blocks: [],	// 1D array of BlockClass objects

	selected_tiles: [],	// really belongs in DuringStateClass, but putting it here so I dont have to use a global

	joined_tiles: [],	// which group does this tile belong to
				// delfault, 0, means NOT in a group

	backup_level: [],	// backup before testing level for level editor

	num_join_groups: 0,

	current_level: 0,

	info_obj: null,
	gamepad: null,

	game_mode: 0,	// what to do on victory or lose
			// 0 campaign mode
			// 1 is 1992 mode
			// 2 testing level editor
			// 3 community levels
			// 5 tutorial screen
			// 6 challenge level
	
	challenge_level_hardness: 0,


	top_nono: [],
	left_nono: [],

	// special hint objects that are used to test for satisfaction
	// set their position and type to the hint we are testing (.mimic())
	// set their mode to count player-pixels, not actual input pixels (.pixel_mode = )
	// then calc_hint
	// then compare with the preset hint (.compare())
	tester_edge_nono: null,
	tester_tile_nono: null,

	won_or_lost: false,	// for checking state on making a new level, did we just finish an old level?

	on_flag_effect: null,

	white_border: [],

	mistakes_this_level: 0,

	init: function(engine){

	

	if (false) {
		var testbitm = new BitmapClass(Types.Layer.GAME_MENU, 100, 100);
		
		testbitm.add_tile(6,5,6); 
		testbitm.add_tile(6,6,1);
		//testbitm.add_tile(2,2,6); 
		//testbitm.update_pos(25,25); 
		
		testbitm.add_tile(6,8,6); 
		//testbitm.update_pos(25,25); 
		testbitm.add_tile(6,9,6); 
		
		testbitm.update_pos(50,25); 
		testbitm.add_tile(6,2,6); 
		testbitm.update_pos(10,250); 
		testbitm.add_tile(1,1,10); 
		testbitm.update_pos(40,250); 
		////console.log('play state init');
	}
		this.engine = engine;

		if(screen_width < screen_height) {
			//this.tile_size = screen_width/this.map_w;
		} else {
			//this.tile_size = Math.min(screen_height/this.map_h,64*this.map_h);
		}

		this.on_flag_effect = new OnFlagEffect(this);

		for(var i = 0; i < this.grid_w; i++) {
			this.tiles[i] = new Array(this.grid_h);

			this.selected_tiles[i] = new Array(this.grid_h);

			this.joined_tiles[i] = new Array(this.grid_h);

			this.backup_level[i] = new Array(this.grid_h);

		}

		for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {
				this.tiles[x][y] = -1; // empty

				
				this.joined_tiles[x][y] = 0;

				this.selected_tiles[x][y] = 0;	// 1 is selected
			}
		}

		for (var c = 0; c < this.grid_w; c++) {
			this.top_nono.push(new EdgeNono(this, c, -1));
		}

		for (var r = 0; r < this.grid_h; r++) {
			this.left_nono.push(new EdgeNono(this, -1, r));
			//this.right_nono.push(new EdgeNono(this, -1, r, true, false));
		}
		

		for(var g = 0; g < this.grid_w*this.grid_h; g++) {
			var new_gem = new TileNono(this);
			new_gem.index = g;
	
			this.blocks.push(new_gem);
		}

		this.tester_edge_nono = new EdgeNono(this, -1, -1); 
		this.tester_edge_nono.pixel_mode = 2;

		this.tester_tile_nono = new TileNono(this);
		this.tester_tile_nono.pixel_mode = 2;
		

		for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {
				this.change_tile(x,y,0);
			}
		}

		for(var g = 0; g < this.grid_w*this.grid_h; g++) {
			this.blocks[g].block_sprite.hide();
		}
		
		for (var b = 0; b <= this.grid_w; b++) {
			this.white_border[b] =  new SquareClass(0,0,this.tile_size*b ,this.tile_size*b,Types.Layer.TILE,0x222222,false);
			this.white_border[b].hide();
		}

		
		this.draw_background();

		this.info_obj = new InfoClass(this);

		this.gamepad = new GamepadClass();
	

		this.screen_resized();

		

		//var block_sprite = new SpriteClass();
		//block_sprite.setup_sprite("block0.png",Types.Layer.TILE, 20,60);
		//block_sprite.hide();
		///block_sprite.make_vis();


		if (g_solver_class) g_solver_class.setup(this);
		if (g_solver_class) g_generator_class.setup(this, g_solver_class);
		
	},

	is_pixel_same_as : function (pixel, x, y) {
		if (x < 0 || y < 0 || x >= this.level_w || y >= this.level_h) return false;
		
		if (this.get_pixel(x,y) == pixel) return true;
	},

	is_pixel_same_colour_as : function (pixel, x, y) {
		if (x < 0 || y < 0 || x >= this.level_w || y >= this.level_h) return false;
		
		if (this.get_pixel_colour(x,y) == pixel) return true;
	},

	is_pixel_lonely : function ( x, y) {
		if (x < 0 || y < 0 || x >= this.level_w || y >= this.level_h) return false;
		
		if (this.get_pixel(x,y) == 0) return false;	// nothing there
		if (x > 0 && this.get_pixel(x - 1, y) > 0) return false;
		if (y > 0 && this.get_pixel(x, y - 1) > 0) return false;
		if (x < this.level_w - 1 && this.get_pixel(x + 1, y) > 0) return false;
		if (y < this.level_h - 1 && this.get_pixel(x, y + 1) > 0) return false;

		return true;
	},

	is_player_pixel_lonely : function ( x, y) {
		if (x < 0 || y < 0 || x >= this.level_w || y >= this.level_h) return false;

		if (this.get_player_pixel(x,y) == 0) return false;	// nothing there
		if (x > 0 && this.get_player_pixel(x - 1, y) > 0) return false;
		if (y > 0 && this.get_player_pixel(x, y - 1) > 0) return false;
		if (x < this.level_w - 1 && this.get_player_pixel(x + 1, y) > 0) return false;
		if (y < this.level_h - 1 && this.get_player_pixel(x, y + 1) > 0) return false;

		return true;
	},

	is_pixel_social : function ( x, y) {
		if (x < 0 || y < 0 || x >= this.level_w || y >= this.level_h) return false;
		
		if (this.get_pixel(x,y) == 0) return false;	// nothing there
		if (x > 0 && this.get_pixel(x - 1, y) == 0) return false;
		if (y > 0 && this.get_pixel(x, y - 1) == 0) return false;
		if (x < this.level_w - 1 && this.get_pixel(x + 1, y) == 0) return false;
		if (y < this.level_h - 1 && this.get_pixel(x, y + 1) == 0) return false;

		return true;
	},

	is_player_pixel_social : function ( x, y) {
		if (x < 0 || y < 0 || x >= this.level_w || y >= this.level_h) return false;

		if (this.get_player_pixel(x,y) == 0) return false;	// nothing there
		if (x > 0 && this.get_player_pixel(x - 1, y) == 0) return false;
		if (y > 0 && this.get_player_pixel(x, y - 1) == 0) return false;
		if (x < this.level_w - 1 && this.get_player_pixel(x + 1, y) == 0) return false;
		if (y < this.level_h - 1 && this.get_player_pixel(x, y + 1) == 0) return false;

		return true;
	},

	// elbow pixels - 2 neighbours exactly
	is_pixel_elbow : function ( x, y) {
		if (x < 0 || y < 0 || x >= this.level_w || y >= this.level_h) return false;
		
		if (this.get_pixel(x,y) == 0) return false;	// nothing there
		var buddies = 0;
		if (x > 0 && this.get_pixel(x - 1, y) > 0) buddies++;
		if (y > 0 && this.get_pixel(x, y - 1) > 0) buddies++;
		if (x < this.level_w - 1 && this.get_pixel(x + 1, y) > 0) buddies++;
		if (y < this.level_h - 1 && this.get_pixel(x, y + 1) > 0) buddies++;

		//if (buddies == 4 || buddies == 0) return false;
		//return true;

		if (buddies == 2) return true;

		return false;
	},

	is_player_pixel_elbow : function ( x, y) {
		if (x < 0 || y < 0 || x >= this.level_w || y >= this.level_h) return false;

		if (this.get_player_pixel(x,y) == 0) return false;	// nothing there
		var buddies = 0;
		if (x > 0 && this.get_player_pixel(x - 1, y) > 0) buddies++;
		if (y > 0 && this.get_player_pixel(x, y - 1) > 0) buddies++;
		if (x < this.level_w - 1 && this.get_player_pixel(x + 1, y) > 0) buddies++;
		if (y < this.level_h - 1 && this.get_player_pixel(x, y + 1) > 0) buddies++;

		if (buddies == 2) return true;

		return false;
	},

	// elbow pixels - 2 neighbours exactly
	is_pixel_corner : function ( x, y) {
		if (x < 0 || y < 0 || x >= this.level_w || y >= this.level_h) return false;
		
		if (this.get_pixel(x,y) == 0) return false;	// nothing there
		var buddies = 0;
		if (x > 0 && this.get_pixel(x - 1, y) > 0) buddies++;
		if (y > 0 && this.get_pixel(x, y - 1) > 0) buddies++;
		if (x < this.level_w - 1 && this.get_pixel(x + 1, y) > 0) buddies++;
		if (y < this.level_h - 1 && this.get_pixel(x, y + 1) > 0) buddies++;

		if (buddies != 2) return false;
		if (x > 0 && this.get_pixel(x - 1, y) > 0 && x < this.level_w - 1 && this.get_pixel(x + 1, y) > 0) return false;
		if (y > 0 && this.get_pixel(x, y - 1) > 0 && y < this.level_h - 1 && this.get_pixel(x, y + 1) > 0) return false;

		return true;
	},

	is_player_pixel_corner : function ( x, y) {
		if (x < 0 || y < 0 || x >= this.level_w || y >= this.level_h) return false;

		if (this.get_player_pixel(x,y) == 0) return false;	// nothing there
		var buddies = 0;
		if (x > 0 && this.get_player_pixel(x - 1, y) > 0) buddies++;
		if (y > 0 && this.get_player_pixel(x, y - 1) > 0) buddies++;
		if (x < this.level_w - 1 && this.get_player_pixel(x + 1, y) > 0) buddies++;
		if (y < this.level_h - 1 && this.get_player_pixel(x, y + 1) > 0) buddies++;

		if (buddies != 2) return false;
		if (x > 0 && this.get_player_pixel(x - 1, y) > 0 && x < this.level_w - 1 && this.get_player_pixel(x + 1, y) > 0) return false;
		if (y > 0 && this.get_player_pixel(x, y - 1) > 0 && y < this.level_h - 1 && this.get_player_pixel(x, y + 1) > 0) return false;
		return true;
	},

	get_pixel : function (x, y) {
		if (x < 0 || y < 0 || x >= this.level_w || y >= this.level_h) return 0;
		return this.blocks[this.tiles[x][y]].get_num_mines();
	},

	get_pixel_colour : function (x, y) {
		if (x < 0 || y < 0 || x >= this.level_w || y >= this.level_h) return 0;
		if (this.blocks[this.tiles[x][y]].get_num_mines() == 0) return 0;
		else return 1;
	},

	is_player_pixel_same_as : function (pixel, x, y) {
		if (x < 0 || y < 0 || x >= this.level_w || y >= this.level_h) return false;
		
		if (this.get_player_pixel(x,y) == pixel) return true;
	},

	is_player_pixel_colour_same_as : function (pixel, x, y) {
		if (x < 0 || y < 0 || x >= this.level_w || y >= this.level_h) return false;
		
		if (this.get_player_pixel_colour(x,y) == pixel) return true;
	},

	
	is_player_pixel_same_colour_as : function (pixel, x, y) {
		if (x < 0 || y < 0 || x >= this.level_w || y >= this.level_h) return false;
		
		if (this.get_player_pixel_colour(x,y) == pixel) return true;
	},
	

	get_player_pixel_b : function (b) {
		if (b < 0 || b >= this.blocks.length) return 0;
		return this.blocks[b].get_player_pixel();	// is_flagged -> this.mine_multi else 0
	},

	get_player_pixel : function (x, y) {
		if (x < 0 || y < 0 || x >= this.level_w || y >= this.level_h) return 0;
		return this.blocks[this.tiles[x][y]].get_player_pixel();	// is_flagged -> this.mine_multi else 0
	},

	get_player_pixel_colour : function (x, y) {
		if (x < 0 || y < 0 || x >= this.level_w || y >= this.level_h) return 0;
		if (this.blocks[this.tiles[x][y]].get_player_pixel() == 0) return 0;// is_flagged -> this.mine_multi else 0
			return 1;
	},

	test_tile_hint : function (b_index) {
		this.tester_tile_nono.mimic(this.blocks[b_index]);
		this.tester_tile_nono.calc_hint(this.tester_tile_nono.symbol_type);
		var ok = this.tester_tile_nono.compare(this.blocks[b_index]);
		
		if (ok == true) this.blocks[b_index].happy = true;
		else this.blocks[b_index].happy = false;
	},

	test_edge_nonogram : function () {
		for (var c = 0; c < this.grid_w; c++) {
			
			this.tester_edge_nono.mimic(this.top_nono[c]);
			this.tester_edge_nono.calc_hint();
			var ok = this.tester_edge_nono.compare(this.top_nono[c]);
			if (ok == true) this.top_nono[c].grey();
			else this.top_nono[c].ungrey();
		}

		for (var c = 0; c < this.grid_h; c++) {
			this.tester_edge_nono.mimic(this.left_nono[c]);
			this.tester_edge_nono.calc_hint();
			var ok = this.tester_edge_nono.compare(this.left_nono[c]);
			if (ok == true) this.left_nono[c].grey();
			else this.left_nono[c].ungrey();

			//this.tester_edge_nono.mimic(this.right_nono[c]);
			//this.tester_edge_nono.calc_hint();
			//var ok = this.tester_edge_nono.compare(this.right_nono[c]);
			//if (ok == true) this.right_nono[c].grey();
			//else this.right_nono[c].ungrey();
		}
	},

	longest_nono: 0,

	calc_edge_nonogram : function () {

		this.longest_nono = 0.5;
		g_top_nono_size = 0.5;
		g_left_nono_size = 0.5;
		
		for (var c = 0; c < this.grid_w; c++) {
			this.top_nono[c].calc_hint();
			this.top_nono[c].show_hint();

			//var matrix_num = this.top_nono[c].dna_hint_sequence;
			//var rect_y = g_anysize_patterns[matrix_num].p[0].length + 1;

			rect_y = this.top_nono[c].calc_space_needed();

			this.longest_nono = Math.max(this.longest_nono, rect_y);
			g_top_nono_size = Math.max(g_top_nono_size, rect_y);
		}

		for (var r = 0; r < this.grid_h; r++) {
			this.left_nono[r].calc_hint();
			this.left_nono[r].show_hint();	

			//var matrix_num = this.left_nono[r].dna_hint_sequence;
			//var rect_x = g_anysize_patterns[matrix_num].p[0].length + 1;

			var rect_x = this.left_nono[r].calc_space_needed();

			this.longest_nono = Math.max(this.longest_nono, rect_x);
			g_left_nono_size = Math.max(g_left_nono_size, rect_x);

			//this.right_nono[r].calc_hint();
			//this.right_nono[r].show_hint();
		}
	},

	resize: function() {
		g_pixi_tilegrid_w = this.tile_size*this.level_w + 1;
		g_pixi_tilegrid_h = this.tile_size*this.level_h + 1;
		g_tilegrid_changed = true;

		this.show_border();
		//if (screen_width < screen_height) 
		g_level_size = Math.max(this.level_w + this.longest_nono, 7);
		g_level_w = this.level_w + this.longest_nono;
		do_resize();
	},

	show_border: function() {
		this.hide_border();
		this.white_border[this.level_w].make_vis();
		return;
		if (this.level_w == 3) this.white_border3.make_vis();
		else if (this.level_w == 4) this.white_border4.make_vis();
		else if (this.level_w == 12) this.white_border12.make_vis();
		else if (this.level_w == 12) this.white_border12.make_vis();
		return;
		//this.white_border.set_scale(1/level_ratio, 1/level_ratio)
		this.white_border.update_size(0,0, this.level_w*this.tile_size , this.level_h*this.tile_size);
		this.white_border.update_line_w(8);
		this.white_border.make_vis();
	},

	hide_border:function() {
		
		for (var b = 0; b <= this.grid_w; b++) {
			this.white_border[b].hide();
		}
	},
	
	reset_flowfill : function () {
		for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {
				this.blocks[this.tiles[x][y]].seen_by_flowfill = 0;	
			}
		}
	},

	mark_as_seen_by_flowfill : function (x, y) {
		this.blocks[this.tiles[x][y]].seen_by_flowfill = 1;
	},

	is_seen_by_flowfill : function (x, y) {
		return this.blocks[this.tiles[x][y]].is_seen_by_flowfill();
	},

	reset: function() {

		this.num_joined_groups = 0;
		this.level_timer = 0;

		this.timer_x = [];
		this.timer_y = [];
		

		for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {


				this.change_tile(x,y,0);
				this.selected_tiles[x][y] = 0;
				this.joined_tiles[x][y] = 0;

				this.blocks[this.tiles[x][y]].preset_hint(0);

				this.blocks[this.tiles[x][y]].join_group = 0;

				//this.blocks[this.tiles[x][y]].cover();
				//this.blocks[this.tiles[x][y]].uncover(true); // true - show hint (which is nothing)
				//this.blocks[this.tiles[x][y]].deselect();
				this.blocks[this.tiles[x][y]].reset();

				

				

			}
		}


	},

	level_timer: 0,

	update_timer : function () {
		if (this.timer_x.length == 0) return;

		this.level_timer--;
		

		for (var t = 0; t < this.timer_x.length; t++) {
			var x = this.timer_x[t];
			var y = this.timer_y[t];
			this.blocks[this.tiles[x][y]].set_timer(this.level_timer);
		}
	},

	add_timer : function (x, y) {
		this.timer_x.push(x);
		this.timer_y.push(y);

		this.level_timer += 30;

		if (this.level_timer > 99) this.level_timer = 99;

		for (var t = 0; t < this.timer_x.length; t++) {
			var x = this.timer_x[t];
			var y = this.timer_y[t];
			this.blocks[this.tiles[x][y]].set_timer(this.level_timer);
		}
	},

	calc_sequence_lengths : function () {
		var current_sequence = 0;
		var current_value = -1;
		var current_seq_tiles = 0;
		for(var x = 0; x < this.grid_w; x++) {
			current_sequence = 0;
			current_seq_tiles = 0;
			current_value = -1;
			for(var y = 0; y < this.grid_h; y++) {

				
				tile_ = this.get_block_type(x,y);
				//if (tile_ == 2)	current_sequence++ += this.get_num_mines(x,y);
				//else current_sequence = 0;

				if (tile_ == current_value) current_seq_tiles++;
				else {
					current_value = tile_;
					current_seq_tiles = 1;
				
				}

				for (var mine_y = y - current_seq_tiles + 1; mine_y <= y; mine_y++) {
					if (mine_y >= this.grid_h) continue;
					if (mine_y < 0) continue;
					this.blocks[this.tiles[x][mine_y]].my_vert_seq_length = current_sequence;
					
				}

			}
		}
		current_sequence = 0;
		current_seq_tiles = 0;

		for(var y = 0; y < this.grid_h; y++) {
			current_sequence = 0;
			current_seq_tiles = 0;
			current_value = -1;
			for(var x = 0; x < this.grid_w; x++) {

				tile_ = this.get_block_type(x,y);
				//if (tile_ == 2)	current_sequence += this.get_num_mines(x,y);
				//else current_sequence = 0;

				if (tile_ == current_value) current_seq_tiles++;
				else {
					current_value = tile_;
					current_seq_tiles = 1;
				
				}

				for (var mine_x = x - current_seq_tiles + 1; mine_x <= x; mine_x++) {
					if (mine_x >= this.grid_w) continue;
					if (mine_x < 0) continue;
					this.blocks[this.tiles[mine_x][y]].my_horiz_seq_length = current_sequence;
				}
			}
		}
	},


	
	is_undug_and_unflagged : function (x, y) {
		if (x < 0 || y < 0 || x >= this.grid_w || y >= this.grid_h) return false;

		return this.blocks[this.tiles[x][y]].is_undug_and_unflagged();
	},

	is_solved : function (x, y) {
		if (x < 0 || y < 0 || x >= this.grid_w || y >= this.grid_h) return false;

		return this.blocks[this.tiles[x][y]].is_solved();
	},

	is_flagged : function (x, y) {
		if (x < 0 || y < 0 || x >= this.grid_w || y >= this.grid_h) return false;

		if (this.blocks[this.tiles[x][y]].covered_up == false) return false;

		return this.blocks[this.tiles[x][y]].flag_on;
	},

	is_crossed : function (x, y) {
		if (x < 0 || y < 0 || x >= this.grid_w || y >= this.grid_h) return false;

		if (this.blocks[this.tiles[x][y]].x_on == false) return false;

		return this.blocks[this.tiles[x][y]].x_on;
	},

	is_covered : function (x, y) {
		if (x < 0 || y < 0 || x >= this.grid_w || y >= this.grid_h) return false;

		return this.blocks[this.tiles[x][y]].covered_up;
	},

	num_flagged: 0,
	num_mines: 0,

	count_up_flags : function () {
		this.num_flagged = 0;
		this.num_mines = 0;
		for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {

				if (this.blocks[this.tiles[x][y]].block_type == 2) this.num_mines += this.get_num_mines(x,y);
				if (this.blocks[this.tiles[x][y]].flag_on == false) continue;
				this.num_flagged += this.blocks[this.tiles[x][y]].mine_multi;
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

	set_tile_from_code: function(x, y, code_) {

		var cover_ = 0;
		if (code_ >= 100) {
			cover_ = 1;
			code_ -= 100;
			//this.blocks[this.tiles[x][y]].cover();
		}

		if (code_ == 0) {
			// empty
			this.change_tile(x,y,0);
			
		} else if (code_ == 1) {
			// wall
			this.change_tile(x,y,1);
			
		} else if (code_ == 2) {
			// mine
			this.change_tile(x,y,2);
			

		}  else if (code_ == 3) {
			
			
			this.blocks[this.tiles[x][y]].preset_hint(1);
		}  else if (code_ == 4) {
			
			
			this.blocks[this.tiles[x][y]].preset_hint(2);
		}  else if (code_ == 5) {
			
			
			this.blocks[this.tiles[x][y]].preset_hint(4);
		} else if (code_ == 10) {
			
			
			this.blocks[this.tiles[x][y]].preset_hint(5);	// heart
		} else if (code_ == 11) {
			
			
			this.blocks[this.tiles[x][y]].preset_hint(11);	// compass
		} else if (code_ == 12) {
			
			
			this.blocks[this.tiles[x][y]].preset_hint(12);	// crown
		} else if (code_ == 13) {
			
			
			this.blocks[this.tiles[x][y]].preset_hint(13);	// eyebracket
		} else if (code_ == 49) {
			
			
			this.blocks[this.tiles[x][y]].preset_hint(49);	// zap
		} else if (code_ == 80) {
			
			
			this.blocks[this.tiles[x][y]].preset_hint(80);	// total mines
		} else if (code_ == 7) {
			// joined
			
			if (x > 0) this.join_tiles(x,y,x-1,y);
			
			
		} else if (code_ == 8) {
			// joined
			if (y > 0) this.join_tiles(x,y,x,y-1);
			
			
		} else if (code_ >= 17 && code_ <= 32) {
			this.blocks[this.tiles[x][y]].set_sharesquare_code(code_);
		}

		if (cover_ == 1) {
			// in editor mode, gotta draw the underlying hint
			// uncovering forces drawing the hint
			if (this.blocks[this.tiles[x][y]].editor_mode == 1) this.blocks[this.tiles[x][y]].uncover();
			this.blocks[this.tiles[x][y]].cover();
		} else {
			this.blocks[this.tiles[x][y]].cover();
			this.blocks[this.tiles[x][y]].uncover();

		}
	},

	get_tile_code: function(x, y) {
		var blocktype = this.blocks[this.tiles[x][y]].block_type;

		if (blocktype == 1) return 1;

		var tilecode = 0;

		if (this.blocks[this.tiles[x][y]].covered_up == true) tilecode = 100;

		if (blocktype == 0) {
			

			tilecode += 0;
		} else if (blocktype == 1) {
			tilecode == 1;	// wall
			return tilecode;
		} else if (blocktype == 2) {
			tilecode += 2;	// mine
			return tilecode;
		}

		var hint_ = this.blocks[this.tiles[x][y]].preset_hint_type;

		if (hint_ == 0) {
			// joined?
			if (this.joined_tiles[x][y] != 0) {
				if (x > 0 && this.joined_tiles[x - 1][y] == this.joined_tiles[x][y]) tilecode += 7;
				else if (y > 0 && this.joined_tiles[x][y - 1] == this.joined_tiles[x][y]) tilecode += 8;
			}


		} else if (hint_ == 1) {
			tilecode += 3;		// 4 touch
		} else if (hint_ == 2) {
			tilecode += 4;		// eye
		} else if (hint_ == 4) {
			tilecode += 5;		// 8 touch
		} else if (hint_ == 5) {
			tilecode += 10;		// heart
		} else if (hint_ == 11) {
			tilecode += 11;		// compass
		} else if (hint_ == 12) {
			tilecode += 12;		// crown
		} else if (hint_ == 13) {
			tilecode += 13;		// eyebracket
		} else if (hint_ == 49) {
			tilecode += 49;		// zap
		} else if (hint_ == 80) {
			tilecode += 80;		// total mines
		}

		// share pipes and share bubble
		if (this.blocks[this.tiles[x][y]].sharesquare == true) {
			// six diff orientations of bubble
			tilecode += this.blocks[this.tiles[x][y]].get_sharesquare_code();
		} else if (this.blocks[this.tiles[x][y]].share_pipe == true) {
			// six different kinds of pipe
			tilecode += this.blocks[this.tiles[x][y]].get_sharesquare_code();
		}

		return tilecode;
	},

	

	new_game: function (num_rands) {

		for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {
				this.change_tile(x,y,0);	// Empty

				this.blocks[this.tiles[x][y]].cover();

				if (Math.random() < 0.25) this.change_tile(x,y,1);	// WALL
				else if (Math.random() < 0.33) this.change_tile(x,y,2);	// mine


				this.selected_tiles[x][y] = 0;
			}
		}

		var uncovered = 0;

		for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {
				if (uncovered < 4 && Math.random() < 0.2 && this.get_block_type(x,y) == 0) {
					uncovered++;
					this.blocks[this.tiles[x][y]].uncover();
				}
			}
		}

		

		for(var i = 0; i < this.bg_squares.length; i++) this.bg_squares[i].alpha = 1;

		
	},

	join_tiles: function(x,y,xx,yy, hint_type) {

		var hint_type = this.blocks[this.tiles[xx][yy]].preset_hint_type;

		if (hint_type == 11 || hint_type == 13) return;

		var join_group = -1;

		if (this.joined_tiles[x][y] != 0 ||
		    this.joined_tiles[xx][yy] != 0) {
			// must both be unjoined - FOR NOW, only 2 tiles
			
			//return;	// to allow multi-joins, just comment this out
		}


		if (this.joined_tiles[x][y] == 0 &&
		    this.joined_tiles[xx][yy] == 0) {
			this.num_joined_groups++;
			this.joined_tiles[x][y] = this.num_joined_groups;
			this.joined_tiles[xx][yy] = this.num_joined_groups;

			this.blocks[this.tiles[xx][yy]].join_leader = true;
			this.blocks[this.tiles[x][y]].join_second_leader = true;

			this.blocks[this.tiles[x][y]].my_join_leader_x = xx;
			this.blocks[this.tiles[x][y]].my_join_leader_y = yy;
			this.blocks[this.tiles[x][y]].i_know_join_leader_xy = true;

			join_group =  this.num_joined_groups;
		} else if (this.joined_tiles[x][y] != 0 &&
		           this.joined_tiles[xx][yy] == 0) {
			
			this.joined_tiles[xx][yy] = this.joined_tiles[x][y];
			join_group =  this.joined_tiles[xx][yy];
		} else if (this.joined_tiles[x][y] == 0 &&
		           this.joined_tiles[xx][yy] != 0) {
			
			this.joined_tiles[x][y] = this.joined_tiles[xx][yy];
			join_group =  this.joined_tiles[xx][yy];
		} else if (this.joined_tiles[x][y] != 0 &&
		           this.joined_tiles[xx][yy] != 0) {
			
			// failed  - maybe already joined
			join_group =  this.joined_tiles[xx][yy];
		}

		this.blocks[this.tiles[x][y]].join_group = join_group;
		this.blocks[this.tiles[xx][yy]].join_group = join_group;

		this.blocks[this.tiles[x][y]].calc_joiner_sprite();
		this.blocks[this.tiles[xx][yy]].calc_joiner_sprite();

		
		this.blocks[this.tiles[x][y]].shared_hint = hint_type;
		this.blocks[this.tiles[xx][yy]].shared_hint = hint_type;

		//this.blocks[this.tiles[x][y]].preset_hint(hint_type);
		//this.blocks[this.tiles[xx][yy]].preset_hint(hint_type);

		return;

		if (x > xx) {
			this.blocks[this.tiles[xx][yy]].join_h = true;//set_join_h_sprite();
		} else if (xx > x) {
			this.blocks[this.tiles[x][y]].join_h = true;//.set_join_h_sprite();
		} else if (y > yy) {
			this.blocks[this.tiles[xx][yy]].join_v = true;//.set_join_v_sprite();
		} else if (yy > y) {
			this.blocks[this.tiles[x][y]].join_v = true;//.set_join_v_sprite();
		} 
	},

	load_level_JSON : function (JSON, levelnum) {
		this.reset();

		if (JSON.mapdata_version_mines == 1) {

		for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {
				var floortile = JSON.floor[levelnum][y][x];
				//if (gem == 0) continue;
				//this.add_gem(x,y,JSON.levels[levelnum][y][x]);
				//////console.log(JSON.levels[levelnum][y][x]);

				this.blocks[this.tiles[x][y]].preset_hint(0);

				if (floortile == 1) {
					// wall
					this.change_tile(x,y,1);
				} else if (floortile == 2) {
					// bomb
					this.change_tile(x,y,2);
				} else if (floortile == 8) {
					// joined
					
					if (y > 0) this.join_tiles(x,y,x,y-1, this.blocks[this.tiles[x][y-1]].preset_hint_type);
				} else if (floortile == 7) {
					// joined
					if (x > 0) this.join_tiles(x,y,x-1,y, this.blocks[this.tiles[x-1][y]].preset_hint_type);
				} else if (floortile == 3) {
					// hint
					this.blocks[this.tiles[x][y]].preset_hint(2);
				} else if (floortile == 4) {
					// hint
					this.blocks[this.tiles[x][y]].preset_hint(3);
				} else if (floortile == 5) {
					// hint
					this.blocks[this.tiles[x][y]].preset_hint(1);
				}

			}	// x
			
        	}	// y

		// lets go again! gotta calculate surrounding bombs for each tile
		// so we needed to place the bombs first
		for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {

				var floortile = JSON.floor[levelnum][y][x];

				if (JSON.cover[levelnum][y][x] == 6) {
					this.blocks[this.tiles[x][y]].cover();
				} else {
					this.blocks[this.tiles[x][y]].uncover(true);
				}

				if (floortile == 1) this.blocks[this.tiles[x][y]].uncover(false);
		} // y
		} // x

		} // if (JSON.mapdata_version_mines == 1)
	},

	level_w: 10,
	level_h: 10,

	

	load_level_internal : function(p_matrix, mapdata_version_mines) {
		console.log('LOAD LEVEL INTERNAL');
		this.reset();


		if (p_matrix == null) {

			////console.log('no such level ' );
			return;
		}

		this.level_w = p_matrix.length - 1;
		this.level_h = p_matrix[0].length - 1;
		
		if (mapdata_version_mines == 1) {

		for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {
				this.blocks[this.tiles[x][y]].reset();
				this.blocks[this.tiles[x][y]].cover();
				this.blocks[this.tiles[x][y]].uncover(true);
			}
		}

		for(var y = 0; y < this.grid_h; y++) {
			this.left_nono[y].nono_type = GameTypes.EdgeClues.NO_CLUE;
		}

		for(var x = 0; x < this.grid_w; x++) {
			this.top_nono[x].nono_type = GameTypes.EdgeClues.NO_CLUE;
		}

		for(var y = 0; y < this.level_h; y++) {
			var left_edge_nono = p_matrix[y + 1][0];
			if (left_edge_nono == 4) this.left_nono[y].nono_type = GameTypes.EdgeClues.TOTAL;
			if (left_edge_nono == 3) this.left_nono[y].nono_type = GameTypes.EdgeClues.CROWN;
			if (left_edge_nono == 5) this.left_nono[y].nono_type = GameTypes.EdgeClues.EYEBRACKET;
			if (left_edge_nono == 36) this.left_nono[y].nono_type = GameTypes.EdgeClues.HEART;
			if (left_edge_nono == 37) this.left_nono[y].nono_type = GameTypes.EdgeClues.SMILEY;
		}

		for(var x = 0; x < this.level_w; x++) {
			var top_edge_nono = p_matrix[0][x + 1];
			if (top_edge_nono == 4) this.top_nono[x].nono_type = GameTypes.EdgeClues.TOTAL;
			if (top_edge_nono == 3) this.top_nono[x].nono_type = GameTypes.EdgeClues.CROWN;
			if (top_edge_nono == 5) this.top_nono[x].nono_type = GameTypes.EdgeClues.EYEBRACKET;
			if (top_edge_nono == 36) this.top_nono[x].nono_type = GameTypes.EdgeClues.HEART;
			if (top_edge_nono == 37) this.top_nono[x].nono_type = GameTypes.EdgeClues.SMILEY;
		}

		for(var y = 0; y < this.level_h; y++) {
            		for(var x = 0; x < this.level_w; x++) {
				var floortile = p_matrix[y + 1][x + 1];
				//if (gem == 0) continue;
				//this.add_gem(x,y,JSON.levels[levelnum][y][x]);
				//////console.log(JSON.levels[levelnum][y][x]);

				var on_pixel = false;
				if (floortile == 2 ||
				    floortile == 12 ||
					floortile == 13 ||
					floortile == 14 ||
					floortile == 15 ||
					floortile == 16 ||
					floortile == 17 ||
					floortile == 18 ||
					floortile == 19 ||
					floortile == 24 || floortile == 31 || floortile == 33 || floortile == 35 ||
					floortile == 25 || floortile == 26 || floortile == 27 || floortile == 30) on_pixel = true;

				var hint_type = GameTypes.PixelClues.NO_CLUE;

				if (floortile == 6 || floortile == 12) hint_type = GameTypes.PixelClues.CONNECTIONS;
				if (floortile == 11 || floortile == 19) hint_type = GameTypes.PixelClues.LOCKED;
				if (floortile == 9 || floortile == 16) hint_type = GameTypes.PixelClues.EIGHTTOUCH;
				if (floortile == 10 || floortile == 17) hint_type = GameTypes.PixelClues.HEART;
				if (floortile == 7 || floortile == 13) hint_type = GameTypes.PixelClues.EQUAL_HORIZ;
				if (floortile == 30 || floortile == 29) hint_type = GameTypes.PixelClues.SMILE;
				//if (floortile == 31 || floortile == 28) hint_type = GameTypes.PixelClues.NEUTRAL;
				if (floortile == 31 || floortile == 28) hint_type = GameTypes.PixelClues.CORNER;
				if (floortile == 33 || floortile == 32) hint_type = GameTypes.PixelClues.ZAP;

				

				if (floortile == 23 || floortile == 26) this.link_tiles(x, y, x + 1, y);
				if (floortile == 21 || floortile == 24) this.link_tiles(x, y, x, y + 1);
				if (floortile == 22 || floortile == 25) this.link_tiles(x, y, x - 1, y);
				if (floortile == 20 || floortile == 27 || floortile == 14) this.link_tiles(x, y, x, y - 1);
				// 27 and 14 are both red join_up - i added it 2x to the tileset by mistake

				this.blocks[this.tiles[x][y]].preset_hint(hint_type);

				this.blocks[this.tiles[x][y]].mine_multi = 1;

				var multi = 1;
				if (floortile == 34 || floortile == 35) multi = 2;

				this.blocks[this.tiles[x][y]].mine_multi = multi;

				if (on_pixel == true) this.change_tile(x,y,2);
				else this.change_tile(x,y,0);

				// multiplier
				//if (g_all_level_data_cover_layer[levelnum][y][x] > 0) {
					//this.blocks[this.tiles[x][y]].mine_multi = g_all_level_data_cover_layer[levelnum][y][x];
				//}

				

				if (floortile == 1) {
					// wall
					//this.change_tile(x,y,1);
				} else if (floortile == 2) {
					// bomb
					
					//this.change_tile(x,y,2);
				} 
				

			}	// x
			
        	}	// y

		

		// eaach linked tile will store all of its buddies indexes: 
		this.find_all_connected_link_tiles();


		} // if (JSON.mapdata_version_mines == 1)
	},

	
	get_json_level_code: function (x, y) {

		

		if (x == -1 || y == -1) {
			if (x == -1) var symbol = this.left_nono[y].nono_type;
			if (y == -1) var symbol = this.top_nono[x].nono_type;
			if (symbol == 0) return 0;
			if (symbol == GameTypes.EdgeClues.TOTAL) return 4;
			if (symbol == GameTypes.EdgeClues.CROWN) return 3;
			if (symbol == GameTypes.EdgeClues.EYEBRACKET) return 5;
			if (symbol == GameTypes.EdgeClues.SMILEY) return 37;
			if (symbol == GameTypes.EdgeClues.HEART) return 36;
			return 0;
		}

		var b = this.tiles[x][y];
		var pixel = this.blocks[b].block_type;
		var symbol = this.blocks[b].symbol_type;
		var link_g = this.blocks[b].linked_group;
		
		
		if (pixel == 0) {
			if (link_g != -1 && this.blocks[b].linked_up == true) return 20;
			if (link_g != -1 && this.blocks[b].linked_down == true) return 21;
			if (link_g != -1 && this.blocks[b].linked_left == true) return 22;
			if (link_g != -1 && this.blocks[b].linked_right == true) return 23;
			if (symbol == 0 && this.blocks[b].mine_multi == 1) return 1;
			if (symbol == GameTypes.PixelClues.EIGHTTOUCH) return 9;
			if (symbol == GameTypes.PixelClues.HEART) return 10;
			if (symbol == GameTypes.PixelClues.SMILE) return 29;
			if (symbol == GameTypes.PixelClues.NEUTRAL) return 28;
			if (symbol == GameTypes.PixelClues.ZAP) return 32;
			if (this.blocks[b].mine_multi == 2) return 34;
		} else {
			if (link_g != -1 && this.blocks[b].linked_up == true) return 27;
			if (link_g != -1 && this.blocks[b].linked_down == true) return 24;
			if (link_g != -1 && this.blocks[b].linked_left == true) return 25;
			if (link_g != -1 && this.blocks[b].linked_right == true) return 26;
			if (symbol == 0 && this.blocks[b].mine_multi == 1) return 2;
			if (symbol == GameTypes.PixelClues.EIGHTTOUCH) return 16;
			if (symbol == GameTypes.PixelClues.HEART) return 17;
			if (symbol == GameTypes.PixelClues.SMILE) return 30;
			if (symbol == GameTypes.PixelClues.NEUTRAL) return 31;
			if (symbol == GameTypes.PixelClues.ZAP) return 33;
			if (this.blocks[b].mine_multi == 2) return 35;
		}

		return 0;
	},

	load_tut_level : function (tutlevel, mapdata_version) {
		if (g_tut_content[tutlevel] == null) {

			////console.log('no such level ' + levelnum);
			return;
		}

		var p_matrix =  g_tut_content[tutlevel].level;
		this.load_level_internal(p_matrix, mapdata_version);
	},

	load_challenge_level : function (levelnum, mapdata_version) {
		var p_folder = g_all_level_data_floor_layer.easy;
		if (this.challenge_level_hardness == 2) p_folder = g_all_level_data_floor_layer.med;
		if (this.challenge_level_hardness == 3) p_folder = g_all_level_data_floor_layer.hard;
		if (this.challenge_level_hardness == 4) p_folder = g_all_level_data_floor_layer.nosmiley;

		if (p_folder[levelnum] == null) {

			////console.log('no such level ' + levelnum);
			return;
		}
		var p_matrix = p_folder[levelnum];
		this.load_level_internal(p_matrix, mapdata_version);
	},

	load_level : function (levelnum, mapdata_version) {
		if (g_all_level_data_floor_layer[levelnum] == null) {

			////console.log('no such level ' + levelnum);
			return;
		}
		var p_matrix = g_all_level_data_floor_layer[levelnum];

		this.load_level_internal(p_matrix, mapdata_version);
	},

	load_level_old : function (levelnum, mapdata_version_mines) {
		this.reset();


		if (g_all_level_data_floor_layer[levelnum] == null) {

			////console.log('no such level ' + levelnum);
			return;
		}

		this.level_w = g_all_level_data_floor_layer[levelnum].length - 1;
		this.level_h = g_all_level_data_floor_layer[levelnum][0].length - 1;
		
		if (mapdata_version_mines == 1) {

		for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {
				this.blocks[this.tiles[x][y]].reset();
				this.blocks[this.tiles[x][y]].cover();
				this.blocks[this.tiles[x][y]].uncover(true);
			}
		}

		for(var y = 0; y < this.grid_h; y++) {
			this.left_nono[y].nono_type = GameTypes.EdgeClues.NO_CLUE;
		}

		for(var x = 0; x < this.grid_w; x++) {
			this.top_nono[x].nono_type = GameTypes.EdgeClues.NO_CLUE;
		}

		for(var y = 0; y < this.level_h; y++) {
			var left_edge_nono = g_all_level_data_floor_layer[levelnum][y + 1][0];
			if (left_edge_nono == 4) this.left_nono[y].nono_type = GameTypes.EdgeClues.TOTAL;
			if (left_edge_nono == 3) this.left_nono[y].nono_type = GameTypes.EdgeClues.CROWN;
		}

		for(var x = 0; x < this.level_w; x++) {
			var top_edge_nono = g_all_level_data_floor_layer[levelnum][0][x + 1];
			if (top_edge_nono == 4) this.top_nono[x].nono_type = GameTypes.EdgeClues.TOTAL;
			if (top_edge_nono == 3) this.top_nono[x].nono_type = GameTypes.EdgeClues.CROWN;
		}

		for(var y = 0; y < this.level_h; y++) {
            		for(var x = 0; x < this.level_w; x++) {
				var floortile = g_all_level_data_floor_layer[levelnum][y + 1][x + 1];
				//if (gem == 0) continue;
				//this.add_gem(x,y,JSON.levels[levelnum][y][x]);
				//////console.log(JSON.levels[levelnum][y][x]);

				var on_pixel = false;
				if (floortile == 2 ||
				    floortile == 12 ||
					floortile == 13 ||
					floortile == 14 ||
					floortile == 15 ||
					floortile == 16 ||
					floortile == 17 ||
					floortile == 18 ||
					floortile == 19 ||
					floortile == 24 || 
					floortile == 25 || floortile == 26 || floortile == 27 ) on_pixel = true;

				var hint_type = GameTypes.PixelClues.NO_CLUE;

				if (floortile == 6 || floortile == 12) hint_type = GameTypes.PixelClues.CONNECTIONS;
				if (floortile == 11 || floortile == 19) hint_type = GameTypes.PixelClues.LOCKED;
				if (floortile == 9 || floortile == 16) hint_type = GameTypes.PixelClues.EIGHTTOUCH;
				if (floortile == 10 || floortile == 17) hint_type = GameTypes.PixelClues.HEART;
				if (floortile == 7 || floortile == 13) hint_type = GameTypes.PixelClues.EQUAL_HORIZ;

				

				if (floortile == 23 || floortile == 26) this.link_tiles(x, y, x + 1, y);
				if (floortile == 21 || floortile == 24) this.link_tiles(x, y, x, y + 1);
				if (floortile == 22 || floortile == 25) this.link_tiles(x, y, x - 1, y);
				if (floortile == 20 || floortile == 27 || floortile == 14) this.link_tiles(x, y, x, y - 1);
				// 27 and 14 are both red join_up - i added it 2x to the tileset by mistake

				this.blocks[this.tiles[x][y]].preset_hint(hint_type);

				this.blocks[this.tiles[x][y]].mine_multi = 1;

				var multi = 1;
				//if (floortile <= 9) multi = floortile;
				//else multi = floortile - 9;

				this.blocks[this.tiles[x][y]].mine_multi = multi;

				if (on_pixel == true) this.change_tile(x,y,2);
				else this.change_tile(x,y,0);

				// multiplier
				//if (g_all_level_data_cover_layer[levelnum][y][x] > 0) {
					//this.blocks[this.tiles[x][y]].mine_multi = g_all_level_data_cover_layer[levelnum][y][x];
				//}

				

				if (floortile == 1) {
					// wall
					//this.change_tile(x,y,1);
				} else if (floortile == 2) {
					// bomb
					
					//this.change_tile(x,y,2);
				} 
				

			}	// x
			
        	}	// y

		

		// eaach linked tile will store all of its buddies indexes: 
		this.find_all_connected_link_tiles();


		} // if (JSON.mapdata_version_mines == 1)
	},


	linked_groups: 0,

	// this.link_tiles(x, y, x + 1, y)
	link_tiles: function (x, y, xa, ya) {
		if (x < 0 || y < 0 || x >= this.level_w || y >= this.level_h) return;
		if (xa < 0 || ya < 0 || xa >= this.level_w || ya >= this.level_h) return;

		var b = this.tiles[x][y];
		var ba = this.tiles[xa][ya];

		

		var link_group = Math.max(this.blocks[b].linked_group, this.blocks[ba].linked_group);

		if (link_group == -1) link_group = this.linked_groups++;

		// may need to join 2 already linkedup regions
		if (this.blocks[b].linked_group != -1 &&
		    this.blocks[ba].linked_group != -1) {
			var old_region = Math.min(this.blocks[b].linked_group, this.blocks[ba].linked_group);
			for (var b_old = 0; b_old < this.blocks.length; b_old++) {
				if (b_old == b || b_old == ba) continue;
				if (this.blocks[b_old].linked_group == old_region) {
					this.blocks[b_old].linked_group = link_group;
					
				}
			}
		}

		// make both hintless
		this.blocks[b].preset_hint(0);
		this.blocks[ba].preset_hint(0);

		
		this.blocks[b].linked_group = link_group;
		this.blocks[ba].linked_group = link_group;

		//this.blocks[b].linked_blocks.push(ba);
		//this.blocks[ba].linked_blocks.push(b);
	},

	find_all_connected_link_tiles: function() {
		for(var b = 0; b < this.blocks.length; b++) {
			if (this.blocks[b].x > this.level_w || this.blocks[b].x > this.level_w) continue;
			if (this.blocks[b].linked_group == -1) continue;
			this.blocks[b].linked_blocks = [];
			for(var bb = 0; bb < this.blocks.length; bb++) {
				if (this.blocks[bb].x > this.level_w || this.blocks[bb].x > this.level_w) continue;
				if (this.blocks[bb].linked_group == -1) continue;
				if (this.blocks[b].linked_group == this.blocks[bb].linked_group) {
					this.blocks[b].linked_blocks.push(bb);
				}
			}
		}
	},

	calc_all_hints: function() {
		for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {
				if (this.blocks[this.tiles[x][y]].covered_up == true) {
					//this.blocks[this.tiles[x][y]].uncover(false);
					//this.blocks[this.tiles[x][y]].cover();
				} else {
					this.blocks[this.tiles[x][y]].cover();
					this.blocks[this.tiles[x][y]].uncover(true);
				}
			}
		}
	},

	get_num_mines: function(x,y) {
		if (x < 0 || y < 0 || x >= this.grid_w || y >= this.grid_h) return -1;

		if (this.tiles[x][y] == -1) return 0;

		else return this.blocks[this.tiles[x][y]].get_num_mines();
	},

	get_block_type: function(x,y) {

		if (x < 0 || y < 0 || x >= this.grid_w || y >= this.grid_h) return -1;

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

	game_over_x: 0,
	game_over_y: 0,

	start_game_over: function(x,y) {
		this.game_over_x = x;
		this.game_over_y = y;
	},

	
	update: function() { 
		
		

	},

	

	draw_timer: 0,

	draw: function() {

		if (this.draw_timer <= 0) {
			this.draw_timer = 300;

			//tile_group.cacheAsBitmap = true;
			//game_group.cacheAsBitmap = true;
			
			

		}
		this.draw_timer--;
		
		this.on_flag_effect.draw();

		
	},


	handle_mouse_down: function(engine,x,y) {

	},

	handle_mouse_up: function(engine,x,y) {
	},

	handle_mouse_move: function(engine,x,y) {

	},

	increase_score: function(amt) {
		this.score += amt;
		this.score_obj.set_num(this.score);

		if (screen_width > screen_height) {
			this.score_x = screen_width - 32 - 18*this.score.toString().length;
			this.score_y = 32;
		} else {
			this.score_x = screen_width - 32 - 18*this.score.toString().length;
			this.score_y = screen_height - 64;
		}

		this.score_obj.update_pos(this.score_x, this.score_y);
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

	
	

	old_draw_rect_background: function(x,y,xx,yy,colour, alpha) {

		if (alpha == null) alpha = 1;

		var graphics = new PIXI.Graphics();

		graphics.alpha = alpha;

		graphics.beginFill(colour);

		// set the line style to have a width of 5 and set the color to red
		graphics.lineStyle(0, colour);

		// draw a rectangle
		graphics.drawRect(x, y,xx, yy);

		background_group.add(graphics);

		return graphics;
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

	bg_squares: [],		// linear array

	draw_background : function () {
		// Palette URL: http://paletton.com/#uid=7010Z0kjpoY9q5FenfFn1vSqcQi
		// 19241A
		// 0x0366239
		//

		// EDE1B7
		
		// this.draw_rect_background(-2000, -2000, 4000,4000, 0x1F1129);	// 1F1129  161423


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

		for (var x = 0; x < this.grid_w; x++) this.top_nono[x].hide();

		for (var y = 0; y < this.grid_h; y++) this.left_nono[y].hide();

		for (var x = 0; x < this.grid_w; x++) {
			for (var y = 0; y < this.grid_h; y++) {
				
				//this.bg_squares[this.tiles[x][y]].hide();
				this.blocks[this.tiles[x][y]].hide();
				
			}
		}

	}
});

temp_level_flip_array = new Array(10);


RestartGameStateClass = GameStateClass.extend({

	play_state: null,
	engine: null,

	timer: 30,

	x_pos: 0,

	init: function(engine, play_state){
		this.play_state = play_state;
		this.engine = engine;

		//play_screen_container.make_vis();//;
		play_screen_container.hide();//;

		this.x_pos = 0;
		

		// look ahead and load a new batch of levels if needed
		if (this.play_state.game_mode == 0 && 
		    this.play_state.current_level < g_total_num_of_levels - 1) {
			// is the this.play_state.current_level + 1 level loaded?
			if (g_all_level_data_floor_layer[this.play_state.current_level + 1] == null) {
				var first_in_file = Math.floor((this.play_state.current_level + 1) / 10)*10;
				var last_in_file = first_in_file + 9;
				var file_n = 'levels/level' + first_in_file.toString() + 'to' + last_in_file + '.json';
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
			if (using_cocoon_js == true &&
			    g_seen_beg < 4 &&
			    total_levels_played > 100 &&
			    total_levels_played % 50 == 0) {
				// beg for rating state
				// return;
			}

			// beg
			// BegForRatingState
			// possible issues in the app, removed for now
			if (g_seen_beg == 0 &&
			    total_levels_played >= 50 &&
			    total_levels_played % 25 == 0 &&
			    using_cocoon_js == true) {
				//this.change_state(this.engine, new BegForRatingState(this.engine, this.play_state));
				//return;
			}

			// crosspromote stuff
			if (g_show_crosspromote == true && 
			    this.play_state.won_or_lost == true &&
			    total_levels_played > 20 && on_kong == false && on_armor == false &&
			    using_cocoon_js == false) {  // && levels_until_ad <= 1
				// cross promotion
				this.change_state(this.engine, new ShowZblipGame(this.engine, this.play_state));
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



StartGameStateClass = GameStateClass.extend({

	play_state: null,

	engine: null,

	x_pos: 2999,
	timer: 55,

	init: function(engine, play_state){
		this.play_state = play_state;
		this.engine = engine;

		//this.play_state.new_game(0);

		play_screen_container.set_x(2999);
		// play_screen_container.set_x(0);

		if (this.play_state.current_level == 0) {

			g_zblip_on_play_button();
			g_zblip_on_start_level(0);

		} else g_zblip_on_start_level(this.play_state.current_level);
		
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
			

		this.play_state.calc_sequence_lengths();
		
		this.play_state.calc_edge_nonogram();

		this.play_state.resize();	// after calc edges - need to know sizes

		for (var x = 0; x < this.play_state.level_w; x++) {
			for (var y = 0; y < this.play_state.level_h; y++) {

				// debug mode - start with solved puzzle
				//if (this.play_state.blocks[this.play_state.tiles[x][y]].block_type == 2) this.play_state.blocks[this.play_state.tiles[x][y]].put_flag_on();
				this.play_state.blocks[this.play_state.tiles[x][y]].calc_hint(this.play_state.blocks[this.play_state.tiles[x][y]].symbol_type);
				this.play_state.blocks[this.play_state.tiles[x][y]].calc_sprite();
				

			}
		}

		

		this.play_state.mistakes_this_level = 0;

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


g_undo_button_sprite = null;

gameplay_errors = [
	"Goal stacks must be of the same suit",
	"Goal stacks must be built from A to K",
];

// TextClass objects (see spritesheet.js)
g_gameplay_error_text_objs = [];

g_mistake_sprite = null;

g_dig_button = null;
g_flag_button = null;
g_digflag_select = null;
g_flag_cursor_sprite = null;
g_cursor_right = null;
g_cursor_left = null;

g_selected_tile_sprite = null;

// for tut levels we need some text
g_level_text_1 = null;
g_level_text_2 = null;

g_skip_tut_button = null;
g_skip_tut_text = null;

g_dig_tiles_text = null;
g_flag_tiles_text = null;

g_freedig_text = null;
g_freedig_button = null;

g_mistakes_text = null;

g_this_level_num_text = null;

g_tomenu_button = null;

g_reset_button = null;


DuringGameStateClass = GameStateClass.extend({

	play_state: null,

	engine: null,

	mouse_down: false,

	e_text: -1,
	e_text_timer: 0,	

	flag_x: 0,
	flag_y: 0,

	dig_x: 0,
	dig_y: 0,

	tomenu_x: 0,
	tomenu_y: 0,

	reset_x: 0,
	reset_y: 0,

	freedig_x: 0,
	freedig_y: 0,

	grey_x: 0,
	grey_y: 0,

	show_level_text: false,

	auto_dig_timer: 0,

	flag_timer: 0,

	selected_x: 0,
	selected_y: 0,

	move_history: [],
	current_move_b: [],	// block
	current_move_c: [],	// colour
	current_move_last_colour: 0, 

	digflag_selected: 1,
	hide_x: false,

	mistake_cooldown: 0,

	init: function(engine, play_state){
		this.play_state = play_state;
		this.engine = engine;

		play_screen_container.make_vis();

		this.mouse_down = false;

		this.play_state.won_or_lost = false;

		if (this.play_state.game_mode == 1) this.play_state.allow_free_dig = 1;

		// story levels: punish on mistakes
		// challenge levels: no
		if (this.play_state.game_mode == 0) this.punish_on_mistake = true;	
		else this.punish_on_mistake = false;

		this.punish_on_mistake = false;


		if (g_level_text_1 == null) {

			g_skip_tut_button = new ButtonClass();
			g_skip_tut_button.setup_sprite("home_icon.png",Types.Layer.GAME_MENU);
			g_skip_tut_button.update_pos(screen_width + 200, screen_height*0.5);

			

			g_skip_tut_text = new TextClass(Types.Layer.GAME_MENU);
			g_skip_tut_text.set_font(Types.Fonts.SMALL);
			g_skip_tut_text.set_text("CHANGE LEVEL");

			g_dig_tiles_text = new TextClass(Types.Layer.GAME_MENU);
			if (using_pixi) g_dig_tiles_text.set_font(Types.Fonts.XSMALL);
			else g_dig_tiles_text.set_font(Types.Fonts.SMALL);
			g_dig_tiles_text.set_text("");
			

			g_flag_tiles_text = new TextClass(Types.Layer.GAME_MENU);
			if (using_pixi) g_flag_tiles_text.set_font(Types.Fonts.XSMALL);
			else g_flag_tiles_text.set_font(Types.Fonts.SMALL);
			g_flag_tiles_text.set_text("");
			g_freedig_text = new TextClass(Types.Layer.GAME_MENU);
			g_freedig_text.set_font(Types.Fonts.SMALL);
			g_freedig_text.set_text("");

			g_freedig_button = new ButtonClass();
			g_freedig_button.setup_sprite("heart.png",Types.Layer.GAME_MENU);
			g_freedig_button.update_pos(screen_width + 200, screen_height*0.5);
			g_freedig_button.hide();

			g_undo_button_sprite = new SpriteClass();
			g_undo_button_sprite.setup_sprite('new_icon.png',Types.Layer.GAME_MENU);

			g_tomenu_button_sprite = new SpriteClass();
			g_tomenu_button_sprite.setup_sprite('tomenu.png',Types.Layer.GAME_MENU);

			g_reset_button_sprite = new SpriteClass();
			g_reset_button_sprite.setup_sprite('restart_icon.png',Types.Layer.GAME_MENU);

			//g_help_table = new TableAreaClass(this.play_state, "");
			//g_help_table.resize(-999,-999,-999,-999);

			//g_help_sprite = new SpriteClass();
			//g_help_sprite.setup_sprite('back_button.png',Types.Layer.GAME_MENU);
			//g_help_sprite.update_pos(-999,-999);

		
			g_mistake_sprite = new SpriteClass();
			g_mistake_sprite.setup_sprite('mistake.png',Types.Layer.HUD);
			g_mistake_sprite.update_pos(-999,-999);

			g_help_text = new TextClass(Types.Layer.TILE);
			g_help_text.set_font(Types.Fonts.SMALL);
			g_help_text.set_text("");

			g_level_text_1 = new TextClass(Types.Layer.GAME_MENU);
			g_level_text_1.set_font(Types.Fonts.MED_SMALL);
			g_level_text_1.set_text("");

			g_level_text_2 = new TextClass(Types.Layer.GAME_MENU);
			g_level_text_2.set_font(Types.Fonts.TUTSMALL);
			g_level_text_2.set_text("");

			g_this_level_num_text = new TextClass(Types.Layer.GAME_MENU);
			g_this_level_num_text.set_font(Types.Fonts.XSMALL);
			g_this_level_num_text.set_text("");

			g_mistakes_text = new TextClass(Types.Layer.GAME_MENU);
			g_mistakes_text.set_font(Types.Fonts.XSMALL);
			g_mistakes_text.set_text("");

			for (var e = 0; e < gameplay_errors.length; e++) {
				var e_text = new TextClass(Types.Layer.GAME_MENU);
				e_text.set_font(Types.Fonts.MEDIUM);
				e_text.set_text(gameplay_errors[e]);
				e_text.update_pos(-999, -999);

				g_gameplay_error_text_objs.push(e_text);

			}

			g_flag_button = new SpriteClass();
			g_flag_button.setup_sprite("grey_button.png",Types.Layer.GAME_MENU);
			g_flag_button.update_pos(screen_width - 200, screen_height*0.5);
			//g_flag_button.hide();
			
			g_dig_button = new SpriteClass();
			g_dig_button.setup_sprite("fill_button.png",Types.Layer.GAME_MENU);
			g_dig_button.update_pos(screen_width - 200, screen_height*0.5);
			//g_dig_button.hide();


			g_flag_cursor_sprite = new SpriteClass();
			g_flag_cursor_sprite.setup_sprite('redflag.png',Types.Layer.GAME_MENU);
			g_flag_cursor_sprite.update_pos(-999,-999);

			g_selected_tile_sprite = new SpriteClass();
			g_selected_tile_sprite.setup_sprite('select.png',Types.Layer.HUD);
			g_selected_tile_sprite.update_pos(-999,-999);
			g_selected_tile_sprite.hide();

			g_digflag_select = new SpriteClass();
			g_digflag_select.setup_sprite('select.png',Types.Layer.GAME_MENU);
			g_digflag_select.update_pos(-999,-999);
			g_digflag_select.hide();

			//g_cursor_right = new SpriteClass();
		}
		g_flag_button.make_vis();
		g_dig_button.make_vis();
		g_tomenu_button_sprite.make_vis();
		g_reset_button_sprite.make_vis();
		
		//if (this.play_state.game_mode == 1) g_freedig_button.make_vis();	// minesweeper++ mode


		//g_undo_button_sprite.update_pos(-999, -999);
	
		//if (using_cocoon_js) this.hold_time_for_flag = 16;

		this.hold_time_for_flag = 2;

		if (this.play_state.current_level == 0 &&
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


		} else if (this.play_state.current_level == 1&&
			    this.play_state.game_mode == 0) {

			this.show_level_text = true;
			// tutorial state
			g_level_text_1.change_text("MAKE 8 PIXELS FILLED");
			g_level_text_2.change_text("WHITE = UNSOLVED\nPURPLE = FILLED\nGREY = OFF");
			this.hide_x = true;

		} else if (this.play_state.current_level == 2&&
			    this.play_state.game_mode == 0) {

			this.show_level_text = true;
			// tutorial state
			g_level_text_1.change_text("THE NUMBER REPORTS ITS 3x3 AREA");
			g_level_text_2.change_text("WHITE = UNSOLVED\nPURPLE = FILLED\nGREY = OFF");
			this.hide_x = true;

		}  else if (this.play_state.current_level == 3 &&
			    this.play_state.game_mode == 0) {

			this.show_level_text = true;
			// tutorial state
			g_level_text_1.change_text("NO GUESSES NEEDED");
			g_level_text_2.change_text("YOU NEVER NEED TO GUESS :)");
			this.hide_x = true;

		} else if (this.play_state.current_level == 4) {

			this.show_level_text = true;
			// tutorial state
			g_level_text_1.change_text("NO GUESSES NEEDED");
			g_level_text_2.change_text("YOU NEVER NEED TO GUESS :)");

		} else if (this.play_state.current_level == 7) {

			this.show_level_text = true;
			// tutorial state
			g_level_text_1.change_text("RIGHT CLICK TO GREY");
			g_level_text_2.change_text("GREY MEANS EMPTY\nYOU DONT NEED TO GUESS");

		} else if (this.play_state.current_level == 999) {

			this.show_level_text = true;
			// tutorial state
			g_level_text_1.change_text("1 RED PIXEL");
			g_level_text_2.change_text("THAT MEANS 8 GREY PIXELS");

		} else if (this.play_state.current_level == 999) {

			this.show_level_text = true;
			// tutorial state
			g_level_text_1.change_text("EACH NUMBER REPORTS ITS 3x3 AREA");
			g_level_text_2.change_text("THE CORNER NUMBER ONLY SEES 4 TILES");

		} else if (this.play_state.current_level == 3) {

			this.show_level_text = true;
			// tutorial state
			g_level_text_1.change_text("YOU CAN SOLVE THIS!");
			g_level_text_2.change_text("EACH NUMBER REPORTS ITS 3x3 AREA");

		} else if (this.play_state.current_level == 9) {

			this.show_level_text = true;
			// tutorial state
			g_level_text_1.change_text("NEW HINT TYPE");
			g_level_text_2.change_text("HERE IS THE TOTAL PIXELS\nIN SOME ROWS AND COLUMNS");

		} else if (false && this.play_state.current_level == 5) {

			this.show_level_text = true;
			// tutorial state
			g_level_text_1.change_text(g_texts[language]["tut5"]);
			g_level_text_2.change_text(g_texts[language]["tut5a"]);

		} else if (false && this.play_state.current_level == 2) {

			this.play_state.info_obj.set_hint_type(2);	// see
			this.play_state.info_obj.hidden = false;
			this.play_state.info_obj.draw_once();

			this.show_level_text = true;
			// tutorial state
			g_level_text_1.change_text(g_texts[language]["tut2"]);
			g_level_text_2.change_text(g_texts[language]["tut2a"]);


		} else if (false && this.play_state.current_level == 6) {

			//this.show_level_text = true;
			// tutorial stat
			g_level_text_1.change_text(g_get_text("tut6")); // "WALLS BLOCK THE LINE OF SIGHT"
			g_level_text_2.change_text("");
			


		} else if (this.play_state.current_level == 13) {
			this.show_level_text = true;
			// this one is general advice, it can go on any level
			g_level_text_1.change_text("TWO PIXELS ARE LINKED");
			g_level_text_2.change_text("THEY MUST BE THE SAME COLOUR");
			
			

		} else if (this.play_state.current_level == 20) {
			this.show_level_text = true;
			// this one is general advice, it can go on any level
			g_level_text_1.change_text("SOME PIXELS ARE LONELY");
			g_level_text_2.change_text("BUT THE HEART CARES\nTHE HEART SEES ONLY ISOLATED PIXELS");
			
			

		} else if (this.play_state.current_level == 31) {
			this.show_level_text = true;
			// this one is general advice, it can go on any level
			g_level_text_1.change_text("TWO LONELY PIXELS");
			g_level_text_2.change_text("THE REST ARE NOT LONELY\nBECAUSE THEY ARE ALL TOUCHING");
			
			

		} else if (this.play_state.current_level == 32) {
			this.show_level_text = true;
			// this one is general advice, it can go on any level
			g_level_text_1.change_text("NO LONELY PIXELS");
			g_level_text_2.change_text("THEY ARE ALL\nTOUCHING ANOTHER PIXEL");
			
			

		} else if (this.play_state.current_level == 40) {

			this.show_level_text = true;
			// tutorial state
			g_level_text_1.change_text("NEW HINT TYPE");
			g_level_text_2.change_text("ONLY THE BEST FOR THE KING!\nTHE CROWN REPORTS THE LONGEST\nSEQUENCE OF PIXELS");

		} else if (this.play_state.current_level == 60 ||
				this.play_state.current_level == 62) {

			this.show_level_text = true;
			// tutorial state
			g_level_text_1.change_text("NEW HINT TYPE");
			g_level_text_2.change_text("HAPPY PIXELS\nIN THE 3x3 AREA");

		}else if (false && this.play_state.current_level == 13) {

			this.play_state.info_obj.set_hint_type(4);	// 8 touch
			this.play_state.info_obj.hidden = false;
			this.play_state.info_obj.draw_once();

			this.show_level_text = true;
			// tutorial state
			g_level_text_1.change_text(g_get_text("tut13"));
			g_level_text_2.change_text(g_get_text("tut13a"));


		} else if (this.play_state.current_level == 50) {
			this.show_level_text = true;
			// this one is general advice, it can go on any level
			g_level_text_1.change_text("NEW HINT TYPE");
			g_level_text_2.change_text("THE NUMBER OF SEQUENCES OF PIXELS\nSEPARATED BY GAPS");
			
			

		}

		var leveltext = "";

		if (this.play_state.game_mode == 6 && this.play_state.challenge_level_hardness == 1) leveltext = "EASY ";
		if (this.play_state.game_mode == 6 && this.play_state.challenge_level_hardness == 2) leveltext = "MEDIUM ";
		if (this.play_state.game_mode == 6 && this.play_state.challenge_level_hardness == 3) leveltext = "HARD ";
		if (this.play_state.game_mode == 6 && this.play_state.challenge_level_hardness == 4) leveltext = "NOSMILEY ";

		g_this_level_num_text.change_text(leveltext + "LEVEL " + (this.play_state.current_level + 1).toString());
		if (this.play_state.game_mode == 0) g_this_level_num_text.update_pos(16,16);
		else if (this.play_state.game_mode == 3) {
 			g_this_level_num_text.update_pos(16,16);
			g_this_level_num_text.change_text("BY " + g_current_community_level_author + "\nRATING: " 
							+ g_current_community_level_rating + "\nVOTES:" + 							g_current_community_level_votes);
		} else g_this_level_num_text.update_pos(-999,-999);

		if (this.play_state.game_mode != 0) {

			this.play_state.info_obj.hidden = true;
			// g_this_level_num_text could say author name

			g_level_text_1.change_text("");
			g_level_text_2.change_text("");
			
			g_level_text_1.update_pos(-999,-999);
			g_level_text_2.update_pos(-999,-999);

			g_level_text_1.hide();
			g_level_text_2.hide();

			this.show_level_text = false;
		}

		if (this.play_state.level_w > 5) this.play_state.gamepad.make_vis();
		else this.play_state.gamepad.hide();

		g_digflag_select.make_vis();


		
		this.screen_resized();
		
		if (g_solver_class) {
			//console.log('DuringGameStateClass > g_solver_class.go');
			g_solver_class.go();

		
			//console.log('DuringGameStateClass >  > g_generator_class.go ');
			//g_generator_class.go(this);
		}

		// try to restore from localstorage, IF cookies are allowed by the player
		// IF the saved level matches this one
		this.load_level_state
		

	},

	reset_level : function () {
		this.single_move_history = [];
		this.mistakes = 0;
		this.hit_points = 6;
		for (var x = 0; x < this.play_state.level_w; x++) {
			for (var y= 0; y < this.play_state.level_h; y++) {
				
				this.play_state.blocks[this.play_state.tiles[x][y]].take_flag_off();
				this.play_state.blocks[this.play_state.tiles[x][y]].take_x_off();
			}
		}
	},

	cleanup : function () {

	

		game_group.cache_as_bitmap(false);

		play_screen_container.set_x(0);	// due to screenshake

		g_digflag_select.hide();
		this.play_state.gamepad.hide();
		g_tomenu_button_sprite.hide();
		g_reset_button_sprite.hide();

		this.hide_unhappy_hint();
		
		g_mistakes_text.update_pos(-999,-999);
		g_this_level_num_text.update_pos(-999,-999);

		g_dig_button.update_pos(-999,-999);
		g_flag_button.update_pos(-999,-999);

		g_flag_tiles_text.update_pos(-999,-999);
		g_dig_tiles_text.update_pos(-999,-999);

		g_level_text_1.update_pos(-999,-999);
		g_level_text_2.update_pos(-999,-999);

		g_undo_button_sprite.update_pos(-999,-999);

		g_skip_tut_button.update_pos(-999,-999);
		g_skip_tut_text.update_pos(-999,-999);

		g_freedig_text.update_pos(-999,-999);
		g_freedig_button.hide();

		g_selected_tile_sprite.hide();

		for (var e = 0; e < g_gameplay_error_text_objs.length; e++) {

			g_gameplay_error_text_objs[e].update_pos(-999, -999);

		}

		for (var x = 0; x < this.play_state.grid_w; x++) {
			for (var y = 0; y < this.play_state.grid_h; y++) {
				this.play_state.selected_tiles[x][y] = 0;
				this.play_state.blocks[this.play_state.tiles[x][y]].deselect();
			}
		}

		this.play_state.info_obj.hidden = true;
		this.play_state.info_obj.draw_once();
		
	},

	save_last_move: function() {

		if (this.punish_on_mistake == true) {
			this.save_level_state();	// saves to localstorage if allowed
			this.current_move_b = [];
			return;
		}	

		if (this.current_move_b.length == 0) return;

		var movedata = {
			blocks: [],
			colours: [],
			colour: this.current_move_last_colour,
			//colours
		};

		for (var b = 0; b < this.current_move_b.length; b++) {
			movedata.blocks.push(this.current_move_b[b]);
			var block = this.current_move_b[b];
			movedata.colours.push(this.play_state.blocks[block].prev_colour);
			//this.play_state.blocks[block].prev_colour_history.push(this.play_state.blocks[block].prev_colour);
			//movedata.blocks.push(this.current_move_c[b]);
		}

		this.move_history.push(movedata);	

		this.current_move_b = [];
		//this.current_move_c = [];

		this.save_level_state();	// saves to localstorage if allowed
	},

	undo: function () {
		////console.log('undo > this.move_history.length ' + this.move_history.length);
		if (this.move_history.length <= 0) return;
		var prev = this.move_history.pop();
		var blocks = prev.blocks;
		var colours = prev.colours;

		for (var i = 0; i < blocks.length; i++) {
			var b = blocks[i];
			if (this.play_state.blocks[b].prev_colour.length <= 0) continue;
			//var colour = this.play_state.blocks[b].prev_colour.pop();
			var colour = colours[i];
			if (colour == 1) {
				this.play_state.blocks[b].take_x_off();
				this.play_state.blocks[b].take_flag_off();
			} else if (colour == 0) {
				this.play_state.blocks[b].put_x_on();
			} else if (colour == 2) {
				this.play_state.blocks[b].put_flag_on();
			}
		}

		this.save_level_state();	// saves to localstorage if allowed
	},

	load_level_state: function () {
		// belongs in bootstateclass or StartGame ?
		// the color setting belongs here
		// sister function to DuringGameState > save_level_state
		// also should fetch an interstitial ad here

		if (use_browser_cookies == false) return;

		var play_state = this.play_state;

		var levelstate_string = localStorage.getItem(this_game_id + "duringlevelstate");	// get from localstorage

		if (levelstate_string == null) return;

		var levelstate;
	
		try {
			var levelstate = JSON.parse(levelstate_string);
		} catch (e) {
			////console.log('cannot parse localStorage.getItem(this_game_id + duringlevelstate)');
			return;
		}

		// saved as JSON -> string:
		// levelstate = {
		//	game_mode: this.play_state.game_mode,
		//	levelnum: this.play_state.current_level,
		//	w: this.play_state.level_w,
		//	h: this.play_state.level_h,
		//	grid: [],
		// };

		if (levelstate.game_mode == null || 
		    levelstate.levelnum == null ||
		    levelstate.grid == null) return;

		if (levelstate.game_mode == -1) return;

		if (levelstate.game_mode != play_state.game_mode ||
		    levelstate.levelnum != play_state.current_level) return;

		if (levelstate.game_mode == 6 &&
		    levelstate.challenge_level_hardness != play_state.challenge_level_hardness) return;

		// play_state.set_level_size(levelstate.w); // correct level is already loaded

		this.mistakes = levelstate.mistakes;
		this.hit_points = levelstate.hit_points;
		
		var i = 0;
		for (var x = 0; x < levelstate.w; x++) {
			for (var y = 0; y < levelstate.h; y++) {
				if (i >= levelstate.grid.length) return;
				var c = levelstate.grid[i];
				var b = play_state.tiles[x][y];
				if (c == 1) {
					// blue, undecided
					play_state.blocks[b].take_flag_off();
					play_state.blocks[b].take_x_off();
				} else if (c == 2) {
					// red flagged
					play_state.blocks[b].put_flag_on();
				} else {
					// grey x
					play_state.blocks[b].put_x_on();
				}	
				i++;
			}
		}

		this.loaded_from_storage = true;
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
		var levelstate = {
			game_mode: this.play_state.game_mode,
			levelnum: this.play_state.current_level,
			w: this.play_state.level_w,
			h: this.play_state.level_h,
			grid: [],
			mistakes: this.mistakes,
			hit_points: this.hit_points,
			challenge_level_hardness: this.play_state.challenge_level_hardness
		};

		

		for (var x = 0; x < this.play_state.level_w; x++) {
			for (var y = 0; y < this.play_state.level_h; y++) {
				var colour = 1;
				var b = this.play_state.tiles[x][y];
				if (this.play_state.blocks[b].x_on == true) colour = 0;
				else if (this.play_state.blocks[b].flag_on == true) colour = 2;
				levelstate.grid.push(colour);
			}
		}

		levelstate_string = JSON.stringify(levelstate);
		

		// local storage save levelstate
		localStorage.setItem(this_game_id + "duringlevelstate", levelstate_string);	// levelstate.toString() ?
	},

	do_error_text: function (text) {
		//g_solitaire_error_text.set_text(text);
		//g_solitaire_error_text.update_pos(screen_width/2,screen_height - 64);
		//g_solitaire_error_text.center_x(screen_width/2);


		for (var e = 0; e < g_gameplay_error_text_objs.length; e++) {

			g_gameplay_error_text_objs[e].update_pos(-999, -999);

		}


		this.e_text = text;
		this.e_text_timer = 1200;


	},

	home_x: - 999,	// to overworld
	home_y: - 999,

	undo_x: 0,
	undo_y: 0,

	mistakes_x: 0,
	mistakes_y: 0,

	screen_resized: function () {

		
		if (this.play_state.level_w > 5) this.play_state.gamepad.screen_resized();

		if (screen_width > screen_height) {
			this.flag_x = screen_width - 64;
			this.flag_y = screen_height*0.25;
			
			this.dig_x = screen_width - 64;
			this.dig_y = screen_height*0.5;

			this.freedig_x = -999;// screen_width - 64;
			this.freedig_y = screen_height*0.75;

			if (this.play_state.current_level < 2 && this.play_state.game_mode == 0) {
				//this.home_x = 64;
				//this.home_y = 64;
			}

			g_dig_tiles_text.change_size(Types.Fonts.XSMALL);
			g_flag_tiles_text.change_size(Types.Fonts.XSMALL);

			this.undo_x = screen_width - 32;
			this.undo_y = 32;

		

			this.mistakes_x = 8;
			this.mistakes_y = 24;

			this.reset_x = screen_width - 32;
			this.reset_y = screen_height - 32;

			if (this.play_state.game_mode == 0 ||
	   		    this.play_state.game_mode == 3 ||
	   		    this.play_state.game_mode == 6) {
				g_this_level_num_text.update_pos(64,screen_height - 16);
				//g_this_level_num_text.center_x(screen_width*0.5);

			}

			
		} else {
			this.flag_x = screen_width*0.66;//screen_width - 32 - 32 - 32;//screen_width - 128;
			this.flag_y = screen_height - 96 + 16;

			this.dig_x = screen_width*0.85;//screen_width - 32;//128;
			this.dig_y = screen_height - 96 + 16;

			this.freedig_x = -999;// screen_width*0.5;
			this.freedig_y = screen_height - 96;

			if (g_click_to_dig == true) {
				//this.dig_x = -999;
				//this.flag_x = -999;
			}

			g_dig_tiles_text.change_size(Types.Fonts.XSMALL);
			g_flag_tiles_text.change_size(Types.Fonts.XSMALL);

			if (this.play_state.current_level < 2 && this.play_state.game_mode == 0) {
				//this.home_x = screen_width - 64;
				//this.home_y = screen_height - 64;
			}

			//if (this.play_state.game_mode == 0) g_this_level_num_text.update_pos(-999,-999);
	
			this.undo_x = screen_width - 32;
			this.undo_y = screen_height - 128;

			this.tomenu_x = screen_width - 20;
			this.tomenu_y = screen_height - 20;

			this.mistakes_x = screen_width - 96;
			this.mistakes_y = screen_height - 24;

			this.reset_x = -999;	// not enough space
			this.reset_y = -999;

			if (this.play_state.game_mode == 0 ||
	   		    this.play_state.game_mode == 3 ||
	   		    this.play_state.game_mode == 6) {
				g_this_level_num_text.update_pos(screen_width*0.5,screen_height - 24);
				g_this_level_num_text.center_x(screen_width*0.5);

			}
		}

		this.tomenu_x = -99932;
		this.tomenu_y = -99964;

		if (this.hide_x == true) this.flag_y = -999;

		this.update_digflag_select_pos();

		

		if (this.digflag_select == 1) {
			g_digflag_select.update_pos(this.flag_x, this.flag_y);
		} else if (this.digflag_select == 2) {
			g_digflag_select.update_pos(this.dig_x, this.dig_y);
		} else g_digflag_select.update_pos(-999, -999);

		if (this.punish_on_mistake == true) this.undo_y = -999;
		else this.mistakes_y = -999;

		if (this.punish_on_mistake == true) {
			g_mistakes_text.change_text('MISTAKES:' + this.mistakes.toString());
			if (this.mistakes == 0) g_mistakes_text.update_pos(-999,-999);
			else g_mistakes_text.update_pos(this.mistakes_x, this.mistakes_y);
		}

		

		g_skip_tut_button.update_pos(this.home_x, this.home_y);
		g_skip_tut_text.update_pos(this.home_x + 42, this.home_y - 8);

		g_undo_button_sprite.update_pos(this.undo_x, this.undo_y);

		g_flag_button.update_pos(this.flag_x,this.flag_y);
		g_dig_button.update_pos(this.dig_x,this.dig_y);
		g_flag_button.make_vis();
		g_dig_button.make_vis();
		g_freedig_button.update_pos(this.freedig_x,this.freedig_y);

		g_flag_tiles_text.update_pos(this.flag_x - 170, this.flag_y);
		g_dig_tiles_text.update_pos(this.dig_x - 155, this.dig_y);
		g_freedig_text.update_pos(this.freedig_x - 155, this.freedig_y);
		
		g_flag_tiles_text.update_pos(this.flag_x, this.flag_y + 42);
		g_dig_tiles_text.update_pos(this.dig_x, this.dig_y + 42);
		g_flag_tiles_text.center_x(this.flag_x);
		g_dig_tiles_text.center_x(this.dig_x);

		g_tomenu_button_sprite.update_pos(this.tomenu_x, this.tomenu_y);
		g_reset_button_sprite.update_pos(this.reset_x, this.reset_y);

		if (this.show_level_text == true) {
			//g_level_text_1.update_pos(0.25*this.play_state.tile_size - x_shift_screen/menu_ratio, 6.5*this.play_state.tile_size,9999,999);
			//g_level_text_2.update_pos(0.25*this.play_state.tile_size - x_shift_screen/menu_ratio, 8*this.play_state.tile_size,9999,999);

			g_level_text_1.hide();
			g_level_text_2.hide();	// trying to avoid that visual jump

			g_level_text_1.update_pos(32, screen_height*0.7);
			g_level_text_2.update_pos(32, screen_height*0.75);
			
			g_level_text_1.center_x(screen_width*0.5);
			g_level_text_2.center_x(screen_width*0.5);

			g_level_text_1.make_vis();
			g_level_text_2.make_vis();

			g_level_text_1.center_x(screen_width*0.5);
			g_level_text_2.center_x(screen_width*0.5);
			

		}

		if (g_click_to_dig == true) {
			g_dig_tiles_text.change_text("LEFT CLICK");
			if (g_hold_to_flag == true) {
				g_flag_tiles_text.change_text("HOLD");
				g_dig_tiles_text.change_text("CLICK");
			} else g_flag_tiles_text.change_text("RIGHT CLICK");
			// deselect all tiles here
			for (var x = 0; x < this.play_state.grid_w; x++) {
				for (var y = 0; y < this.play_state.grid_h; y++) {
					this.play_state.selected_tiles[x][y] = 0;
					this.play_state.blocks[this.play_state.tiles[x][y]].deselect();
					this.num_selected_tiles = 0;
				} // for y
			} // for x
		} else if (g_click_to_dig == false && this.num_selected_tiles > 0) {
			g_dig_tiles_text.change_text("DIG " + this.num_selected_tiles.toString() + " TILES");
			g_flag_tiles_text.change_text("FLAG " + this.num_selected_tiles.toString() + " TILES");
		} else if (g_click_to_dig == false && this.num_selected_tiles == 0) {
			if (screen_width < screen_height) g_dig_tiles_text.center_x(screen_width*0.5);
			if (screen_width < screen_height) g_dig_tiles_text.change_text("NO TILES SELECTED");
			else g_dig_tiles_text.change_text("NO TILES\nSELECTED");
			g_flag_tiles_text.change_text("");
		} else {
			g_dig_tiles_text.change_text("");
			g_flag_tiles_text.change_text("");
		}

		g_dig_tiles_text.change_text("");
			g_flag_tiles_text.change_text("");

		if (g_click_to_dig == false) {
			g_selected_tile_sprite.make_vis();
		} else {
			g_selected_tile_sprite.hide();
		}

		g_selected_tile_sprite.make_vis();

		this.play_state.screen_resized();
	},

	update_digflag_select_pos : function () {

		

		if (this.digflag_select == 1) {
			g_digflag_select.update_pos(this.flag_x, this.flag_y);
		} else if (this.digflag_select == 2) {
			g_digflag_select.update_pos(this.dig_x, this.dig_y);
		} else g_digflag_select.update_pos(-999, -999);

	},
	
	highlighted_x: 0,
	highlighted_y: 0,

	handle_wheel: function () {
		
	},

	hold_down_timer: 0,

	hold_time_for_flag: 2, //13

	drag_mode: 0,

	drag_vert: 0,
	drag_horiz: 0,

	mouse_down_x: 0,		// 
	mouse_down_y: 0,

	loaded_from_storage: false,
	
	// multitouch
	digflag_hold: false,

	new_action_button_press: true,

	handle_mouse_down: function(engine,x,y) {

		if (g_solver_class || this.loaded_from_storage) {
			this.check_for_victory();
			this.loaded_from_storage = false;
		}
		
		if (this.control_mode == 2) {
			var flag_on = this.play_state.blocks[this.play_state.tiles[this.selected_x][this.selected_y]].x_on;
			var x_on = this.play_state.blocks[this.play_state.tiles[this.selected_x][this.selected_y]].flag_on;
		}

		if (mouse.y > this.flag_y - 32 &&
		    mouse.y < this.flag_y + 32 &&
		    mouse.x > this.flag_x - 32 &&
		    mouse.x < this.flag_x + 32) {
			////console.log('clicked on flag ... this.control_mode == ' + this.control_mode);
			
			this.digflag_select = 1;
			this.update_digflag_select_pos();
			if (this.control_mode == 2 && this.new_action_button_press == true) {
				// gamepad
				//if (this.new_action_button_press == true)				

				if (flag_on == false) this.flag_selected();
				else this.clear_selected();

				this.digflag_hold = true;
				this.new_action_button_press = false;	// used in flag_selected to have the opposite effect (flag -> white / grey -> white)
			} else {
				// select flag
			}
			
			//this.flag_selected();
			//this.drag_mode = 1;
			//if (this.victory == false) this.screen_resized();
		}

		if (mouse.y > this.dig_y - 32 &&
		    mouse.y < this.dig_y + 32 &&
		    mouse.x > this.dig_x - 32 &&
		    mouse.x < this.dig_x + 32) {
			////console.log('clicked on dig');
			this.digflag_select = 2;
			this.update_digflag_select_pos();
			if (this.control_mode == 2 && this.new_action_button_press == true) {
				// gamepad
				if (x_on == false) this.dig_selected();
				else this.clear_selected();
				this.digflag_hold = true;
				this.new_action_button_press = false;	// used in flag_selected to have the opposite effect (flag -> white / grey -> white)
			} else {
				// select flag
			}
			//this.dig_selected();
			//if (this.victory == false && this.game_over == false) this.screen_resized();
		}
		
		
	},

	
	right_mouse_down: false,

	//handle_right_

	change_highlighted_tile: function () {
		if (g_click_to_dig == false) return; // mark first


		//if (this.right_mouse_down == true) {
		//	return;
		//}

		this.right_mouse_down = false;

		//this.highlighted_x = this.selected_x;
		//this.highlighted_y = this.selected_y;

		//this.handle_mouse_move(engine,x,y);	// set selected x y

		if (this.clicked_tile_x == this.highlighted_x &&
		    this.clicked_tile_y == this.highlighted_y) return;

		this.clicked_tile_x = this.highlighted_x;
		this.clicked_tile_y = this.highlighted_y;

		if (this.flag_timer > 1) return;

		if (this.highlighted_x < 0 || 
		    this.highlighted_x >= this.play_state.level_w ||
		    this.highlighted_y < 0 || 
		    this.highlighted_y >= this.play_state.level_h) return;

		var flag_on_ = this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].flag_on;
		var x_on_ = this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].x_on;

		var change_ = 0;
		var prev_colour = 1; // flag_off + x_off
		if (flag_on_ == true) prev_colour = 2;
		if (x_on_ == true) prev_colour = 0;

		if (this.punish_on_mistake == true) {
			if (flag_on_ == true || x_on_ == true) return;
			var pixel_ = this.play_state.get_pixel(this.highlighted_x,this.highlighted_y);
			if (pixel_ == 0 && this.drag_type != 1) {
				// mistake!
				this.on_mistake();
				return;
			} else if (pixel_ > 0 && this.drag_type != 0) {
				// mistake!
				this.on_mistake();
				return;
			}
		}

		var x = this.highlighted_x;
		var y = this.highlighted_y;

		if (this.drag_type == 0) {
			if (flag_on_ == false) change_ = 1;
			else return;
			//this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].take_x_off();
			//this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].put_flag_on();
			this.change_tile_to(x, y, 2);
		} else if (this.drag_type == 1) {
			if (x_on_ == false) change_ = 1;
			else return;
			//this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].take_flag_off();
			//this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].put_x_on();
			this.change_tile_to(x, y, 0);
		} else if (this.drag_type == 2) {
			if (flag_on_ == true || x_on_ == true) change_ = 1;
			else return;
			//this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].take_flag_off();
			//this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].take_x_off();
			this.change_tile_to(x, y, 1);
		}

		// duplicates are fine, the tile gets set to the same colour on undo anyway
		if (change_ == 1) {
			this.current_move_b.push(this.play_state.tiles[this.highlighted_x][this.highlighted_y]);
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].prev_colour = prev_colour;
			if (g_sound_on == true) playSoundInstance('assets/coin0.wav',0.1);
		}
		
		//var prev_colour = this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].prev_colour;
		//this.current_move_c.push(prev_colour);
		
		current_move_last_colour = this.drag_type;

		// https://www.reddit.com/r/WebGames/comments/6usttc/nonogram_multi/dlvbiel/?st=j6ka7wn2&sh=fcb2275b
		// if this is too large then players cant quickly double click to cycle through pixel/x/clear
		// this used to be 20 before the above reddit comment
		this.flag_timer = 6; // 15 // resets when curson is over a different tile


		//if (g_sound_on == true) game.jumpSound.play();
		

		this.check_for_victory();
	},

	undo_singlemove: function () {
		if (this.single_move_history.length == 0) return;
		var move = this.single_move_history.pop();
		var b = move.b;
		var old_colour = move.prev_col;

		if (old_colour == 2) {
			this.play_state.blocks[b].take_x_off();
			this.play_state.blocks[b].put_flag_on();
		} else if (old_colour == 0) {
			this.play_state.blocks[b].take_flag_off();
			this.play_state.blocks[b].put_x_on();
		} else if (old_colour == 1) {
			this.play_state.blocks[b].take_flag_off();
			this.play_state.blocks[b].take_x_off();
		}	
		this.save_level_state();	// saves to localstorage if allowed	
	},

	single_move_history: [],	

	change_tile_to: function (x, y, new_colour) {
		// 1 white unsolved
		// 2 flag on
		// 0 x on

		//console.log('change tile to ' + x +  ' ' + y);

		var flag_on_ = this.play_state.blocks[this.play_state.tiles[x][y]].flag_on;
		var x_on_ = this.play_state.blocks[this.play_state.tiles[x][y]].x_on;

		if (new_colour == 2 && flag_on_ == true) return;
		if (new_colour == 0 && x_on_ == true) return;
		if (new_colour == 1 && flag_on_ == false && x_on_ == false) return;

		var prev_colour = 1; // flag_off + x_off
		if (flag_on_ == true) prev_colour = 2;
		if (x_on_ == true) prev_colour = 0;

		if (new_colour == 2) {
			this.play_state.blocks[this.play_state.tiles[x][y]].take_x_off();
			this.play_state.blocks[this.play_state.tiles[x][y]].put_flag_on();
		} else if (new_colour == 0) {
			this.play_state.blocks[this.play_state.tiles[x][y]].take_flag_off();
			this.play_state.blocks[this.play_state.tiles[x][y]].put_x_on();
		} else if (new_colour == 1) {
			this.play_state.blocks[this.play_state.tiles[x][y]].take_flag_off();
			this.play_state.blocks[this.play_state.tiles[x][y]].take_x_off();
		}

		this.current_move_b.push(this.play_state.tiles[x][y]);
		this.play_state.blocks[this.play_state.tiles[x][y]].prev_colour = prev_colour;

		var singlemove = {
			b: this.play_state.tiles[x][y],
			prev_col: prev_colour
		};

		this.single_move_history.push(singlemove);

		this.save_level_state();	// saves to localstorage if allowed
	},

	
	change_selected_tile: function () {
		
		console.log('change_selected_tile this.drag_type ' + this.drag_type);

		//if (this.clicked_tile_x == this.highlighted_x &&
		//    this.clicked_tile_y == this.highlighted_y) return;

		//this.clicked_tile_x = this.highlighted_x;
		//this.clicked_tile_y = this.highlighted_y;

		if (this.flag_timer > 1) return;

		if (this.selected_x < 0 || 
		    this.selected_x >= this.play_state.level_w ||
		    this.selected_y < 0 || 
		    this.selected_y >= this.play_state.level_h) return;

		var flag_on_ = this.play_state.blocks[this.play_state.tiles[this.selected_x][this.selected_y]].flag_on;
		var x_on_ = this.play_state.blocks[this.play_state.tiles[this.selected_x][this.selected_y]].x_on;

		var change_ = 0;
		var prev_colour = 1; // flag_off + x_off
		if (flag_on_ == true) prev_colour = 2;
		if (x_on_ == true) prev_colour = 0;

		if (this.punish_on_mistake == true) {
			if (flag_on_ == true || x_on_ == true) return;
			var pixel_ = this.play_state.get_pixel(this.selected_x,this.selected_y);
			if (pixel_ == 0 && this.drag_type != 1) {
				// mistake!
				this.on_mistake();
				return;
			} else if (pixel_ > 0 && this.drag_type != 0) {
				// mistake!
				this.on_mistake();
				return;
			}
		}

		var x = this.selected_x;
		var y = this.selected_y;

		if (this.drag_type == 0) {
			if (flag_on_ == false) change_ = 1;
			else return;

			//this.play_state.blocks[this.play_state.tiles[this.selected_x][this.selected_y]].take_x_off();
			//this.play_state.blocks[this.play_state.tiles[this.selected_x][this.selected_y]].put_flag_on();
			this.change_tile_to(x, y, 2);
		} else if (this.drag_type == 1) {
			if (x_on_ == false) change_ = 1;
			else return;
			//this.play_state.blocks[this.play_state.tiles[this.selected_x][this.selected_y]].take_flag_off();
			//this.play_state.blocks[this.play_state.tiles[this.selected_x][this.selected_y]].put_x_on();
			this.change_tile_to(x, y, 0);
		} else if (this.drag_type == 2) {
			if (flag_on_ == true || x_on_ == true) change_ = 1;
			else return;
			//this.play_state.blocks[this.play_state.tiles[this.selected_x][this.selected_y]].take_flag_off();
			//this.play_state.blocks[this.play_state.tiles[this.selected_x][this.selected_y]].take_x_off();
			this.change_tile_to(x, y, 1);
		}

		// duplicates are fine, the tile gets set to the same colour on undo anyway
		if (change_ == 1) {
			this.current_move_b.push(this.play_state.tiles[this.selected_x][this.selected_y]);
			this.play_state.blocks[this.play_state.tiles[this.selected_x][this.selected_y]].prev_colour = prev_colour;
			if (g_sound_on == true) playSoundInstance('assets/coin0.wav',0.1);
		}
		
		//var prev_colour = this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].prev_colour;
		//this.current_move_c.push(prev_colour);
		
		current_move_last_colour = this.drag_type;

		// https://www.reddit.com/r/WebGames/comments/6usttc/nonogram_multi/dlvbiel/?st=j6ka7wn2&sh=fcb2275b
		// if this is too large then players cant quickly double click to cycle through pixel/x/clear
		// this used to be 20 before the above reddit comment
		this.flag_timer = 6; // 15 // resets when curson is over a different tile


		//if (g_sound_on == true) game.jumpSound.play();
		

		this.check_for_victory();
	},


	on_mistake: function () {
		this.mouse_down = false;
		this.mistake_cooldown = 80;
		this.stop_input_until_mouseup = true; // in case player is dragging
		this.drag_mode = 0;
		this.hit_points--;
		//if (Math.random() < 0.5) this.hit_points--;
		this.mistakes++;
		if (this.hit_points <= 0) {
			this.forget_save_state();
			this.change_state(this.engine, new GameOverStateClass(this.engine, this.play_state));
			if (g_sound_on == true) playSoundInstance('assets/Randomize3.wav',0.35);
			return;
		}
		if (g_sound_on == true) playSoundInstance('assets/Randomize3.wav',0.3);
		this.screen_resized();
		this.screenshake_y_vel = -5;
		this.screenshake_timer = 15;
	},

	screenshake_y_pos: 0,
	screenshake_y_vel: 0,
	screenshake_timer: 0,
	
	punish_on_mistake: true,
	hit_points: 6,
	mistakes: 0,

	clicked_tile_x: -1,
	clicked_tile_y: -1,

	handle_right_mouse: function(engine,x,y) {
		if (this.mistake_cooldown > 0) return;
		//if (this.stop_input_until_mouseup == true) return;
		this.right_mouse_down = true;
		
		this.drag_type = 1;
		this.change_highlighted_tile();
		
	},

	control_mode: 0,

	gamepad_update_cursor: function() {
			
		var x_off = this.play_state.gamepad.x_dir;
		var y_off = this.play_state.gamepad.y_dir;
		
		
		if (x_off == 0 && y_off == 0) return;
		this.control_mode = 2;

		this.selected_x += x_off;
		this.selected_y += y_off;

		

		if (this.selected_x >= this.play_state.level_w) this.selected_x = 0;
		else if (this.selected_x < 0) this.selected_x = this.play_state.level_w - 1;

		if (this.selected_y >= this.play_state.level_h) this.selected_y = 0;
		else if (this.selected_y < 0) this.selected_y = this.play_state.level_h - 1;

		////console.log('this.selected_x  ' + this.selected_x  + ' this.selected_y ' + this.selected_y);

		g_selected_tile_sprite.make_vis();

		g_selected_tile_sprite.update_pos((this.selected_x + 0.5)*this.play_state.tile_size,
							(this.selected_y + 0.5)*this.play_state.tile_size);

		if (this.digflag_hold == true) {
			//if (this.digflag_select == 1) this.flag_selected();
			//else if (this.digflag_select == 2) this.dig_selected();
		}

		this.new_action_button_press = true;
	},

	gamepad_timer: 0,

	handle_left_mouse: function(engine,x,y) {
		//if (this.stop_input_until_mouseup == true) return;
		//if (g_click_to_dig == false) return;	// mark first

		// this is called by right and left mouse down	

		if (this.mistake_cooldown > 0) return;	

		this.play_state.gamepad.input_down(mouse.x,mouse.y);
		this.gamepad_timer--;	
		if (this.gamepad_timer <= 0) {
			
			this.gamepad_update_cursor();
			this.gamepad_timer = 15;
		}

		if (g_hold_to_flag == true) this.hold_down_timer++;
		else {
			
		}

		//////console.log('hndle mouse down');

		// hold to flag mode
		if (this.hold_down_timer == this.hold_time_for_flag && g_hold_to_flag == true && g_click_to_dig == true) {
			this.handle_mouse_move(engine,x,y);

			

			if (this.drag_mode == 0) { 
				if (this.play_state.is_flagged(this.highlighted_x, this.highlighted_y) == true) this.drag_type = 1;
				else if (this.play_state.is_crossed(this.highlighted_x, this.highlighted_y) == true) this.drag_type = 2;
				else this.drag_type = 0;
			}
			
			if (this.punish_on_mistake == true) this.drag_type = 0;	// fill
			//this.drag_type = 0;

			if (this.digflag_select == 1) this.drag_type = 1;	// x

			if (this.punish_on_mistake == false) {
				
				
				if (this.digflag_select == 1) this.drag_type = 1;
				if (this.digflag_select == 1 && this.play_state.is_crossed(this.highlighted_x, this.highlighted_y) == true) this.drag_type = 2;

				if (this.digflag_select == 2) this.drag_type = 0;
				if (this.digflag_select == 2 && this.play_state.is_flagged(this.highlighted_x, this.highlighted_y) == true) this.drag_type = 2;
				
			}

			this.change_highlighted_tile();

			this.drag_mode = 1;

			
			//this.play_state.on_flag_effect.go(this.highlighted_x, this.highlighted_y);
			
		} 

		

		this.handle_mouse_move(engine,x,y);

		

		//if (g_click_to_dig == true && this.right_) this.handle_right_click(engine,x,y);

		if (g_click_to_dig == false && this.mouse_down == true) {

			if (this.drag_horiz > 0) this.drag_horiz--;
			if (this.drag_vert > 0) this.drag_vert--;

			if (this.drag_vert > 0 && Math.abs(y - this.mouse_down_y) > 120) this.drag_vert = 0;
			if (this.drag_horiz > 0 && Math.abs(x - this.mouse_down_x) > 120) this.drag_horiz = 0;

			if (Math.abs(x - this.mouse_down_x) > 40 && this.drag_vert == 0) {
			if (x - this.mouse_down_x > 0) this.selected_x++;
				else this.selected_x--;
				this.mouse_down_x = x;
				this.mouse_down_y = y;
				if (this.drag_mode == 1) this.flag_selected();
				//else if (this.drag_mode == 2) this.flag_selected();
				this.drag_horiz = 30;
			
			} else if (Math.abs(y - this.mouse_down_y) > 40 && this.drag_horiz == 0) {
				if (y - this.mouse_down_y > 0) this.selected_y++;
				else this.selected_y--;
				this.mouse_down_x = x;
				this.mouse_down_y = y;
				if (this.drag_mode == 1) this.flag_selected();
				this.drag_vert = 30;
			}

			if (this.selected_x >= this.play_state.level_w) this.selected_x = this.play_state.level_w - 1;//0;
			else if (this.selected_x < 0) this.selected_x = 0;//this.play_state.level_w - 1;

			if (this.selected_y >= this.play_state.level_h) this.selected_y = this.play_state.level_h - 1;//0;
			else if (this.selected_y < 0) this.selected_y = 0;//this.play_state.level_h - 1;

			g_selected_tile_sprite.update_pos((this.selected_x + 0.5)*this.play_state.tile_size,
							(this.selected_y + 0.5)*this.play_state.tile_size);

		} // if (g_click_to_dig == false)
	
		

		this.mouse_down_x = x;
		this.mouse_down_y = y;

		//this.play_state.on_flag_effect.go(this.highlighted_x, this.highlighted_y, this.hold_time_for_flag);


		

		this.mouse_down = true;

		

		//if (mouse.y > screen_height - 100 &&
		//    mouse.x > screen_width - 100) return;	// undo button

		//if (mouse.y > screen_height - 100 &&
		//    mouse.x < 100) return;	// menu button

		

		
		

		
		if (this.mouse_down == true) {
			return;
		}
		
		if (mouse.y > this.home_y - 32 &&
		    mouse.y < this.home_y + 32 &&
		    mouse.x > this.home_x - 32 &&
		    mouse.x < this.home_x + 32) {
			//var level_to_load = 0;	
			//var mapdata_version_mines = 1;
			//this.play_state.current_level = level_to_load;

			this.change_state(this.engine, new OverworldStateClass(this.engine, this.play_state));
		}
		
	},

	handle_key:function(keynum) {
		console.log(keynum);
		//if (keynum ==)

		//if (g_click_to_dig == true) return;
		return;
		////console.log(keynum);
		if (keynum == 70) {
			// F flag
			//this.flag_selected();
			//this.undo();
			return;
		} else if (keynum == 68) {
			// D dig
			//this.dig_selected();
		}

		this.num_selected_tiles = 0;
		//if (this.victory == false) this.screen_resized();

		this.screen_resized();
	},

	num_selected_tiles: 0,

	selected_tool: 0,	// 0 none, 1 dig, 2 flag

	calc_selected_tiles: function() {

	},

	clicked_hint_x: -1,
	clicked_hint_y: -1,

	stop_input_until_mouseup: false,
	

	handle_mouse_up: function(engine,x,y) {

		this.mouse_down = false;
		this.digflag_hold = true;
		this.new_action_button_press = true;

		if (this.mistake_cooldown > 0) return;

		this.gamepad_timer = 0;

		this.clicked_tile_x = -1;
		this.clicked_tile_y = -1;

		//this.play_state.on_flag_effect.cancel();

		//if (mouse.x > screen_width - 100 &&
		//    mouse.y > screen_height - 100) this.undo();

		

		this.stop_input_until_mouseup = false;

		if (mouse.y > this.undo_y - 32 &&
		    mouse.y < this.undo_y + 32 &&
		    mouse.x > this.undo_x - 32 &&
		    mouse.x < this.undo_x + 32 &&
		    this.punish_on_mistake == false) {
			//this.undo();
			this.undo_singlemove();
			return;
		}

		if (mouse.y > this.tomenu_y - 32 &&
		    mouse.y < this.tomenu_y + 32 &&
		    mouse.x > this.tomenu_x - 32 &&
		    mouse.x < this.tomenu_x + 32) {
			
			this.change_state(this.engine, new MenuStateClass(this.engine, this.play_state));
			return;
		}

		if (mouse.y > this.reset_y - 32 &&
		    mouse.y < this.reset_y + 32 &&
		    mouse.x > this.reset_x - 32 &&
		    mouse.x < this.reset_x + 32) {
			console.log("reset level");
			this.reset_level();
			return;
		}


		this.drag_mode = 0;
		this.drag_horiz = 0;
		this.save_last_move();
		this.drag_vert = 0;

		// a quick click
		if (false && this.hold_down_timer < this.hold_time_for_flag) {
			this.handle_mouse_move(engine,x,y);
			this.change_highlighted_tile();
			this.hold_down_timer = 0;
			
			return;
		}

		if (this.right_mouse_down == true) {
			this.hold_down_timer = 0;

			this.right_mouse_down = false;
			return;
		}	

		this.right_mouse_down = false;

		

		if (this.hold_down_timer >= 16) {
			this.hold_down_timer = 0;
			
			if (g_hold_to_flag == true) return;
		}

		if (g_hold_to_flag == false) this.handle_mouse_move(engine,x,y);

		this.hold_down_timer = 0;

		
		

		this.clicked_hint_x = this.highlighted_x;
		this.clicked_hint_y = this.highlighted_y;

		

		
		// info panel
		//if (this.info_panel_locked == false) this.set_info_panel(this.highlighted_x, this.highlighted_y);
		

		this.hold_down_timer = 0;
	},

	

	set_info_panel: function(x, y) {
		var blocktype = this.play_state.get_block_type(x,y);

		if (blocktype == 1) {
			// wall
		} else {
			//if ()


		}
	},

	grey_out : function() {
		for (var x = 0; x < this.play_state.grid_w; x++) {
			for (var y = 0; y < this.play_state.grid_h; y++) {
				this.play_state.blocks[this.play_state.tiles[x][y]].calc_happiness();

				if (this.play_state.blocks[this.play_state.tiles[x][y]].happy == true &&
				    this.play_state.blocks[this.play_state.tiles[x][y]].share_groups.length > 0) {
					// all sharesquares pointing to this guy are now satisfied
				}
			}
		}

		
	},

	flag_selected: function () {

		if (this.mistake_cooldown > 0) return;

		////console.log('flag selected');

		this.drag_type = 1;

		//var flag_on = this.play_state.blocks[this.play_state.tiles[this.selected_x][this.selected_y]].flag_on;
		//if (flag_on == true && this.new_action_button_press == true) this.drag_type = 2;
		//console.log('flag_on ' + flag_on + ' this.new_action_button_press ' + this.new_action_button_press);

		this.change_selected_tile();
		return;

		
		//if (g_sound_on == true) game.jumpSound.play();

		

		if (this.selected_x < 0 || this.selected_x > this.play_state.level_w - 1 ||
			this.selected_y < 0 || this.selected_y > this.play_state.level_h - 1) return;

						

				if (this.play_state.blocks[this.play_state.tiles[this.selected_x][this.selected_y]].flag_on == false) this.play_state.blocks[this.play_state.tiles[this.selected_x][this.selected_y]].put_flag_on();
				else this.play_state.blocks[this.play_state.tiles[this.selected_x][this.selected_y]].take_flag_off();

				
			
		this.deselect_all();

		this.check_for_victory();
	},

	deselect_all : function () {
		for (var x = 0; x < this.play_state.grid_w; x++) {
			for (var y = 0; y < this.play_state.grid_h; y++) {
				this.play_state.selected_tiles[x][y] = 0;
				this.play_state.blocks[this.play_state.tiles[x][y]].deselect();
				this.num_selected_tiles = 0;

				
			}
		}
	},

	game_over: false,

	clear_selected: function () {

		if (this.mistake_cooldown > 0) return;

		this.drag_type = 2;

		//var x_on = this.play_state.blocks[this.play_state.tiles[this.selected_x][this.selected_y]].x_on;
		//if (x_on == true && this.new_action_button_press == true) this.drag_type = 2;

		this.change_selected_tile();
		return;		// same as right_mouse_down
	},

	dig_selected: function () {

		if (this.mistake_cooldown > 0) return;

		this.drag_type = 0;

		//var x_on = this.play_state.blocks[this.play_state.tiles[this.selected_x][this.selected_y]].x_on;
		//if (x_on == true && this.new_action_button_press == true) this.drag_type = 2;

		this.change_selected_tile();
		return;		// same as right_mouse_down

		this.auto_dig_timer = 15;

		var game_over = false;

		//if (g_sound_on == true) game.blipSound.play();

		for (var x = 0; x < this.play_state.grid_w; x++) {
			for (var y = 0; y < this.play_state.grid_h; y++) {
				if (this.play_state.selected_tiles[x][y] == 0) continue;
				this.play_state.selected_tiles[x][y] = 0;

				this.play_state.blocks[this.play_state.tiles[x][y]].uncover();	

				if (this.play_state.get_block_type(x,y) == 2) {

					this.play_state.won_or_lost = true;

					// Store the x,y where we start the explosion effect
					//this.play_state.start_game_over(x,y);

					game_over = true;
					this.game_over = true;
					

					
				}
			}
		}

		if (game_over == true) this.change_state(this.engine, new GameOverStateClass(this.engine, this.play_state));
					

		this.deselect_all();

		this.check_for_victory();
	},

	prev_highlighted_x: 0,
	prev_highlighted_y: 0,

	drag_type: 0,	// flag , unflag
	
	handle_mouse_move: function(engine,x,y) {

		

		this.prev_highlighted_x = this.highlighted_x;
		this.prev_highlighted_y = this.highlighted_y;

		this.highlighted_x = Math.round((x - 0.5*this.play_state.tile_size)/ this.play_state.tile_size);
		this.highlighted_y = Math.round((y - 0.5*this.play_state.tile_size)/ this.play_state.tile_size);

		// avoid that issue when the cursor goes off canvas & comes back, it acts like we are dragging
		if (this.highlighted_x < - 2 || this.highlighted_y < - 2 || 
		    this.highlighted_x > this.play_state.level_w + 2 || 
		    this.highlighted_y > this.play_state.level_h + 1) {

			
			this.mouse_down = false;

			this.drag_mode = 0;
			this.save_last_move();
			this.drag_horiz = 0;
			this.drag_vert = 0;
		}

		if (this.prev_highlighted_x != this.highlighted_x ||
		    this.prev_highlighted_y != this.highlighted_y) this.flag_timer = 0;

		
		// this.drag_mode
		if ((this.prev_highlighted_x != this.highlighted_x ||
		     this.prev_highlighted_y != this.highlighted_y) && this.drag_mode == 1 && 
		    g_click_to_dig == true && this.mouse_down == true) {
			if (this.drag_type == 1 && this.play_state.is_crossed(this.highlighted_x, this.highlighted_y) == false) {
				this.change_highlighted_tile();
				//this.play_state.on_flag_effect.cancel();
				//this.play_state.on_flag_effect.go(this.highlighted_x, this.highlighted_y, 0);
			} else if (this.drag_type == 0 && this.play_state.is_flagged(this.highlighted_x, this.highlighted_y) == false) {
				this.change_highlighted_tile();
				//this.play_state.on_flag_effect.cancel();
				//this.play_state.on_flag_effect.go(this.highlighted_x, this.highlighted_y, 0);

			} else if (this.drag_type == 2 && (this.play_state.is_flagged(this.highlighted_x, this.highlighted_y) == true) || this.play_state.is_crossed(this.highlighted_x, this.highlighted_y) == true) {
				this.change_highlighted_tile();
				//this.play_state.on_flag_effect.cancel();
				//this.play_state.on_flag_effect.go(this.highlighted_x, this.highlighted_y, 0);
			}
			
		}	
		
		if (this.control_mode == 1) {
			this.selected_x = this.highlighted_x;
			this.selected_y = this.highlighted_y;
		}

		// mouse has gone outside grid:
		if (this.control_mode == 1) {
			if (this.highlighted_x >= this.play_state.level_w) this.selected_x = -999;//this.play_state.level_w - 1;//0;
			else if (this.highlighted_x < 0) this.selected_x = -999;//0;//this.play_state.level_w - 1;

			if (this.highlighted_y >= this.play_state.level_h) this.selected_y = -999;//this.play_state.level_h - 1;//0;
			else if (this.highlighted_y < 0) this.selected_y = -999;//0;//this.play_state.level_h - 1;

			g_selected_tile_sprite.update_pos((this.selected_x + 0.5)*this.play_state.tile_size,
						          (this.selected_y + 0.5)*this.play_state.tile_size);

		}

		// if inside grid - we are in mouse mode (as opposed to gamepad)
		if (this.highlighted_x >= 0 &&
		    this.highlighted_y >= 0 && 
		    this.highlighted_x < this.play_state.level_w &&
		    this.highlighted_y < this.play_state.level_h) {
			this.control_mode = 1;
		} else if (this.control_mode != 2) {
			// 2 == gamepad
			this.control_mode = 0;	// no mode
		}

		
		
	},

	green_column: function(x) {

	},

	green_row: function(y) {

	},

	grey_nonos_if_range_is_cleared: function() {
		for (var x = 0; x < this.play_state.level_w; x++) {
			this.play_state.top_nono[x].grey_if_range_is_clear();
		}
		for (var y = 0; y < this.play_state.level_h; y++) {
			this.play_state.left_nono[y].grey_if_range_is_clear();
		}
	},

	victory: false,
	must_grey: false,

	show_unhappy_hint : function (){
		g_mistake_sprite.make_vis();
		var x = this.mistake_x;
		var y = this.mistake_y;
		
		if (this.mistake_region == 0) {
			y = -1;
		} else if (this.mistake_region == 1) {
			x = -1;
		} if (this.mistake_region == 2) {

		}
		//console.log('show_unhappy_hint > x ' + x + ' ' + y);
		var s = this.play_state.tile_size;
		g_mistake_sprite.update_pos(s*x + 0.5*s, s*y + 0.5*s);
	},

	hide_unhappy_hint : function (){
		g_mistake_sprite.hide();
	},

	mistake_x: 0,	// for pointing out a single hint that is unsatisfied
	mistake_y: 0,   // when the level is all filled/cleared
	mistake_region: 0,	// 0 top, 1 left, 2 grid

	find_unhappy_hint : function() {
		for (var x = 0; x < this.play_state.grid_w; x++) {
			for (var y = 0; y < this.play_state.grid_h; y++) {
				if (this.play_state.blocks[this.play_state.tiles[x][y]].symbol_type == 0) continue;
				//this.play_state.blocks[this.play_state.tiles[x][y]].calc_happiness();
				this.play_state.test_tile_hint(this.play_state.tiles[x][y]);

				if (this.play_state.blocks[this.play_state.tiles[x][y]].happy == false) {
					this.mistake_x = x;	// for pointing out a single hint that is unsatisfied
					this.mistake_y = y;   // when the level is all filled/cleared
					this.mistake_region = 2;
					return;
				}
			}
		}

		this.play_state.test_edge_nonogram();	// tests all nonos

		for (var x = 0; x < this.play_state.level_w; x++) {
			if (this.play_state.top_nono[x].nono_type == 0) continue;
			//this.play_state.top_nono[x].calc_happiness();
			if (this.play_state.top_nono[x].happy == false) {
				this.mistake_x = x;	// for pointing out a single hint that is unsatisfied
				this.mistake_y = -1;   // when the level is all filled/cleared
				this.mistake_region = 0;
				return;
			}
		}

		for (var y = 0; y < this.play_state.level_h; y++) {
			if (this.play_state.left_nono[y].nono_type == 0) continue;
			//this.play_state.left_nono[y].calc_happiness();
			if (this.play_state.left_nono[y].happy == false) {
				this.mistake_x = -1;	// for pointing out a single hint that is unsatisfied
				this.mistake_y = y;   // when the level is all filled/cleared
				this.mistake_region = 1;
				return;
			}
		}

		// okay fine the player wins!
		
		this.victory = true;
		this.play_state.won_or_lost = true;
		this.play_state.mistakes_this_level = this.mistakes;
		//this.change_state(this.engine, new WinStateClass(this.engine, this.play_state));
	},

	check_for_victory: function() {

		this.victory = true;
		
		this.play_state.info_obj.on_digorflag();

		//this.play_state.test_edge_nonogram();

		//if (this.must_grey == false) this.grey_nonos_if_range_is_cleared();

		var unselected = 0;

		//if (this.punish_on_mistake == false) this.must_grey = true;

		var mistake_tiles = 0;
	
		

		for (var x = 0; x < this.play_state.level_w; x++) {
			var column_solved = true;
			var unsolved_tiles = 0;
			if (this.victory == false && unselected > 0) break;
			
			for (var y = 0; y < this.play_state.level_h; y++) {
				if (this.victory == false && unselected > 0) break;
				
				var block_type = this.play_state.get_block_type(x,y);
				
				//if (this.must_grey == false) this.play_state.blocks[this.play_state.tiles[x][y]].grey_if_range_is_clear();

				

				if (block_type == 2 &&
				    this.play_state.blocks[this.play_state.tiles[x][y]].flag_on == true &&
				    this.must_grey == true) {
					//continue;	// good!
				} else if (block_type != 2 &&
					   this.play_state.blocks[this.play_state.tiles[x][y]].x_on == true &&
				    this.must_grey == true) {
					//continue; 	// good!
				}

				if (block_type == 0 &&
				    this.play_state.blocks[this.play_state.tiles[x][y]].flag_on == true) this.victory = false;

				if (block_type == 2 &&
				    this.play_state.blocks[this.play_state.tiles[x][y]].x_on == true) this.victory = false;

				if (block_type == 0 &&
				    this.play_state.blocks[this.play_state.tiles[x][y]].flag_on == false &&
				    this.must_grey == true) {
					
					//this.victory = false;
				}

				if (block_type == 2 &&
				    this.play_state.blocks[this.play_state.tiles[x][y]].x_on == false &&
				    this.must_grey == true) {
					//this.victory = false;
					
				}

				if (block_type == 2 &&
				    this.play_state.blocks[this.play_state.tiles[x][y]].flag_on == false) {
					////console.log('a');
					this.victory = false;
					
				}

				if (this.play_state.blocks[this.play_state.tiles[x][y]].flag_on != false &&
				    this.play_state.blocks[this.play_state.tiles[x][y]].x_on != false &&
				    this.play_state.get_pixel(x,y) != this.play_state.get_player_pixel(x,y)) {
					// both these fns return num_mines or zero, but its fine
					mistake_tiles++;
				}

				if (this.punish_on_mistake == false &&
				    (this.play_state.blocks[this.play_state.tiles[x][y]].flag_on == false &&
				     this.play_state.blocks[this.play_state.tiles[x][y]].x_on == false)) {
					//this.victory = false;
					unselected++;
				}
				
				
			}
			if (column_solved == true) this.green_column(x);
		}

		if (using_cocoon_js == true && levels_until_ad == 1 && unselected < 7 && mistake_tiles == 0) {
			g_interstitial.load(); 
		}

		this.hide_unhappy_hint();

		//console.log('unselected  ' + unselected );
		
		if (this.punish_on_mistake == false &&
		    unselected == 0 &&
		    this.victory == false) {
			console.log('grid is 100% done but no victory... show mistake...');
			this.find_unhappy_hint();
			if (this.victory == false) this.show_unhappy_hint();
			
		}
		

		//this.grey_out();

		if (this.victory == true) {
			this.play_state.won_or_lost = true;
			this.play_state.mistakes_this_level = this.mistakes;
			this.change_state(this.engine, new WinStateClass(this.engine, this.play_state));
		} else {
			
			
		}

		
	},

	
	auto_dig_x: 0,
	auto_dig_y: 0,

	auto_dig: function() {

		

		for (var x = this.auto_dig_x; x < this.play_state.grid_w; x++) {
			for (var y = this.auto_dig_y; y < this.play_state.grid_h; y++) {
				if (this.play_state.blocks[this.play_state.tiles[x][y]].covered_up == true ||
				     this.play_state.blocks[this.play_state.tiles[x][y]].block_type == 1) continue;

				if (this.play_state.blocks[this.play_state.tiles[x][y]].preset_hint_type == 0) continue;

				// ignore joint tiles
				if (this.play_state.joined_tiles[x][y] != 0) continue;

				if (this.play_state.blocks[this.play_state.tiles[x][y]].calc_hint(this.play_state.blocks[this.play_state.tiles[x][y]].preset_hint_type) != 0) continue;

				// so we have a zero hint

				if (this.play_state.blocks[this.play_state.tiles[x][y]].preset_hint_type == 1) {
					if (x > 0) this.play_state.blocks[this.play_state.tiles[x - 1][y]].uncover();
					if (y > 0) this.play_state.blocks[this.play_state.tiles[x][y - 1]].uncover();
					if (x < this.play_state.grid_w - 1) this.play_state.blocks[this.play_state.tiles[x + 1][y]].uncover();
					if (y < this.play_state.grid_h - 1) this.play_state.blocks[this.play_state.tiles[x][y + 1]].uncover();

					

					this.play_state.blocks[this.play_state.tiles[x][y]].preset_hint(0);
					this.play_state.blocks[this.play_state.tiles[x][y]].cover();
					this.play_state.blocks[this.play_state.tiles[x][y]].uncover();
					//this.play_state.blocks[this.play_state.tiles[x][y]].show_hint();
					this.auto_dig_timer = 4;

					//if (g_sound_on == true) game.blipSound.play();

					return;

				} else if (this.play_state.blocks[this.play_state.tiles[x][y]].preset_hint_type == 4) {
					if (x > 0) this.play_state.blocks[this.play_state.tiles[x - 1][y]].uncover();
					if (y > 0) this.play_state.blocks[this.play_state.tiles[x][y - 1]].uncover();
					if (x < this.play_state.grid_w - 1) this.play_state.blocks[this.play_state.tiles[x + 1][y]].uncover();
					if (y < this.play_state.grid_h - 1) this.play_state.blocks[this.play_state.tiles[x][y + 1]].uncover();

					if (x > 0 && y > 0) this.play_state.blocks[this.play_state.tiles[x - 1][y - 1]].uncover();
					if (y > 0 && x < this.play_state.grid_w - 1) this.play_state.blocks[this.play_state.tiles[x + 1][y - 1]].uncover();
					if (x < this.play_state.grid_w - 1 && y < this.play_state.grid_h - 1) this.play_state.blocks[this.play_state.tiles[x + 1][y + 1]].uncover();
					if (y < this.play_state.grid_h - 1 && x > 0) this.play_state.blocks[this.play_state.tiles[x - 1][y + 1]].uncover();
					

					this.play_state.blocks[this.play_state.tiles[x][y]].preset_hint(0);
					this.play_state.blocks[this.play_state.tiles[x][y]].cover();
					this.play_state.blocks[this.play_state.tiles[x][y]].uncover();
					//this.play_state.blocks[this.play_state.tiles[x][y]].show_hint();
					this.auto_dig_timer = 4;

					//if (g_sound_on == true) game.blipSound.play();

					return;
				}
			}
		}

		this.auto_dig_x = 0;
		this.auto_dig_y = 0;
	},

	time_timer: 60,

	update: function() { 

		if (this.mistake_cooldown > 0) this.mistake_cooldown--;

		if (this.flag_timer > 0) this.flag_timer--;

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

		if (this.auto_dig_timer > 0 && g_allow_negatives == false) {
			this.auto_dig_timer--;
			if (this.auto_dig_timer == 0) {
				this.auto_dig();

				this.check_for_victory();

				// if we're done auto digging - redo the share groups
				// because a sharesquare may have included a zero touch hint
				//if (this.auto_dig_timer == 0) this.play_state.calc_share_groups();
			}
		}

		this.play_state.update();

		//if (this.play_state.game_over == true) {
			//this.change_state(this.engine, new GameOverStateClass(this.engine, this.play_state));
		//}
	},

	draw_timer: 0,

	draw: function() {
		this.play_state.draw();

		if (this.screenshake_timer > 0) {
			this.screenshake_timer--;
			
			this.screenshake_y_pos += this.screenshake_y_vel;
			this.screenshake_y_vel -= this.screenshake_y_pos;

			this.screenshake_y_vel = 0.95*this.screenshake_y_vel;

			play_screen_container.set_y(this.screenshake_y_pos);	
		} else if (this.screenshake_timer == 0) {
			play_screen_container.set_y(0);
		}

		this.time_timer--;
		if (false && this.time_timer == 0) {
			this.time_timer = 60;
			this.play_state.update_timer();

			if (this.play_state.timer_x.length > 0 &&
			    this.play_state.level_timer <= 0) {
				// Store the x,y where we start the explosion effect
				this.play_state.start_game_over(5,5);

				this.change_state(this.engine, new GameOverStateClass(this.engine, this.play_state));
				return;
			}	
		}

		/*
		if (this.draw_timer <= 0) {
			this.draw_timer = 200;

			//tile_group.cacheAsBitmap = true;
			if (g_cache_as_bitmap == true) {
				game_group.cache_as_bitmap(true);
				//do_resize();	
				
			}

		}
		this.draw_timer--;
		*/

		if (this.dragging_flag == true) {
			g_flag_cursor_sprite.update_pos(mouse.x,mouse.y);
		} 

		if (this.e_text_timer > 0) {
			this.e_text_timer--;
			if (this.e_text_timer <= 0 && this.e_text != -1) {
				g_gameplay_error_text_objs[this.e_text].update_pos(-999,-999);
				this.e_text = -1;
			}
		}

		if (this.e_text != -1 && this.e_text < g_gameplay_error_text_objs.length) {
			//g_solitaire_error_text_objs[this.e_text].update_pos();

			//g_solitaire_error_text.set_text(text);
			g_gameplay_error_text_objs[this.e_text].update_pos(screen_width/2,screen_height - 64,screen_width - 128);
			g_gameplay_error_text_objs[this.e_text].center_x(screen_width/2);
		}
	},

});

g_game_over_text = null;
g_game_over_text2 = null;
g_reset_button = null;
g_tweet_score_sprite = null;
g_sharethis_text = null;
g_restart_text = null;
g_final_score_text = null;

GameOverStateClass = GameStateClass.extend({

	play_state: null,
	engine: null,

	// prompt button
	// 0 - none, 1 - tweet score
	prompt_button: 0,

	timer: 0,
	pop_dist: 1,	// distance from this.play_state.game_over_x / y

	screenshake_x_pos: 0,
	screenshake_x_vel: 5,

	
	allow_rating: false,

	init: function(engine, play_state) {

		play_screen_container.make_vis();

		

		this.engine = engine;
		this.play_state = play_state;

		this.play_state.won_or_lost = true;

		this.play_state.game_over = false;

		total_levels_played++;
		levels_until_ad--;

		this.timer = 3;

		//this.play_state.calc_solved_tiles();

		//g_all_level_status[this.play_state.current_level] = 2;	// timeout

		// kongregate.services.getUserId() will return 0 if not signed in
		if (on_kong && kongregate.services.getUserId() > 0 && this.play_state.game_mode == 3) {
			this.allow_rating = true;
		}

		if (g_star_rating_obj == null) {
			g_star_rating_obj = new StarRatingClass();
			g_star_rating_obj.hide();

		}

		if (this.play_state.game_mode == 3 && this.allow_rating == true) g_star_rating_obj.make_vis();

		if (g_game_over_text == null) {
			g_game_over_text = new TextClass(Types.Layer.GAME_MENU);
			g_game_over_text.set_font(Types.Fonts.SMALL);
			g_game_over_text.set_text("WHOOPS!");
			g_game_over_text.update_pos(-999, -999);

			g_game_over_text2 = new TextClass(Types.Layer.GAME_MENU);
			g_game_over_text2.set_font(Types.Fonts.XSMALL);
			g_game_over_text2.set_text("TOO MANY MISTAKES!");
			g_game_over_text2.update_pos(-999, -999);

			g_sharethis_text = new TextClass(Types.Layer.GAME_MENU);
			g_sharethis_text.set_font(Types.Fonts.SMALL);
			g_sharethis_text.set_text("Share your score: ");
			g_sharethis_text.update_pos(-999, -999);

			g_restart_text = new TextClass(Types.Layer.GAME_MENU);
			g_restart_text.set_font(Types.Fonts.XSMALL);
			g_restart_text.set_text("TRY AGAIN: ");
			g_restart_text.update_pos(-999, -999);

			g_final_score_text = new TextClass(Types.Layer.GAME_MENU);
			g_final_score_text.set_font(Types.Fonts.SMALL);
			g_final_score_text.set_text("Final score: ");
			g_final_score_text.update_pos(-999, -999);

			g_reset_button = new SpriteClass();
			g_reset_button.setup_sprite("new_icon.png",Types.Layer.GAME_MENU);
			g_reset_button.update_pos(screen_width + 200, screen_height*0.5);

			//g_tweet_score_sprite = new ButtonClass();
			//g_tweet_score_sprite.setup_sprite("twitter-48x48.png",Types.Layer.GAME_MENU);
			//g_tweet_score_sprite.update_pos(-999, -999);


		}

		

		//if (this.play_state.score > 40 &&
		//    location.hostname != "www.facebook.com") this.prompt_button = 1;		// tweet score
	
		//this.screen_resized();	// this would make the new piece instantly snap to position
		this.arrange_screen();

		
	},

	
	game_over_text_x: 0,
	game_over_text_y: 0,

	game_over_text2_x: 0,
	game_over_text2_y: 0,

	newgame_x: 0,
	newgame_y: 0,

	twitter_x: 0,
	twitter_y: 0,

	score_x: 0,
	score_y: 0,

	starrate_x: 0,
	starrate_y: 0,

	fb_x: 0,
	fb_y: 0,

	arrange_screen: function () {
		this.fb_x = -999;
		this.fb_y = -999;
		if (screen_width > screen_height) {
			this.game_over_text_x = screen_width - 64;//10*this.play_state.tile_size;//screen_width - 96;
			this.game_over_text_y = 20;

			this.game_over_text2_x = screen_width - 64 - 24;//10*this.play_state.tile_size;//screen_width - 96;
			this.game_over_text2_y = 52;

			this.newgame_x = screen_width - 38;
			this.newgame_y = 128;

			this.score_x = -999;
			this.score_y = -999;

			this.starrate_x = screen_width - 6*26;
			this.starrate_y = 140;

			if (this.prompt_button == 1) {
				this.twitter_x = screen_width - 64;
				this.twitter_y = screen_height - 128 - 32;
			} else {
				this.twitter_y = -999;
			}

			if (this.play_state.solved_tiles > 75 &&
			    this.play_state.game_mode == 1) {
				//this.fb_x = screen_width - 29 - 0.5*29;
				//this.fb_y = screen_height - 29 - 0.5*29;
			}
			
		} else {
			this.game_over_text_x = screen_width*0.25;;
			this.game_over_text_y = screen_height - 128 - 4;

			this.game_over_text2_x =screen_width*0.75;;
			this.game_over_text2_y = screen_height - 128;

			this.newgame_x = screen_width/2;;
			this.newgame_y = screen_height - 64;

			this.score_x = -999;
			this.score_y = -999;

			if (this.prompt_button == 1) {
				this.twitter_x = 132;
				this.twitter_y = screen_height - 64;
			} else {
				this.twitter_y = -999;
			}
		}

		g_win_fb.update_pos(this.fb_x, this.fb_y);
		g_win_fb_text.update_pos(this.fb_x - 220, this.fb_y - 6);
		g_win_fb.make_vis();

		//////alert('this.fb_x ' + this.fb_x + ' this.fb_y ' + this.fb_y);

		g_star_rating_obj.update_pos(this.starrate_x, this.starrate_y);
		if (this.play_state.game_mode != 3 || this.allow_rating == false) g_star_rating_obj.hide();

	},

	screen_resized: function () {
		this.play_state.screen_resized();

		this.arrange_screen();

		//var h = screen_height/ratio;

		
	},

	wait_timer: 30,
	handle_mouse_up: function(engine,x,y) {

		if (this.wait_timer > 0) return;
		x = mouse.x;
		y = mouse.y;

		var next_ = 0;

		//if (screen_width < screen_height && mouse.y > screen_height*0.5) next_ = 1;

		if (this.play_state.game_mode == 3) g_star_rating_obj.click(mouse.x, mouse.y);

		if (x > this.newgame_x - 32 &&
		    x < this.newgame_x + 32 &&
		    y > this.newgame_y - 32 &&
		    y < this.newgame_y + 32) next_ = 1;

		if (mouse.x > this.fb_x - 16 &&
		    mouse.x < this.fb_x + 16 &&
		    mouse.y > this.fb_y - 16 &&
		    mouse.y < this.fb_y + 16) {
			go_to_fb();
			return;
		}
		

		if (next_ == 1) {

			this.play_state.score = 0;

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
				// community levels - copied from winstate
				
				// mark as done
			/*	for (var i = 0; i < g_community_list_data.length; i++) {
					if (g_current_community_level_id == g_community_list_data[i].hash) {
						
						//g_community_list_data[i]['done'] = true;	// um no cos we lost
					}

				}
			*/

				// some stuff about rating here - see winstate
				if (g_star_rating_obj.rating != -1 &&
				    this.allow_rating == true) {
					var ratelevel = new RateLevel(this.engine, this.play_state);
					ratelevel.level_id = g_current_community_level_id;	// is this the hash???? it is now
					ratelevel.rating = g_star_rating_obj.rating;
					
					this.change_state(this.engine, ratelevel);
					return;
				}

				
				var auto_load = false;

				this.change_state(this.engine, new CommunityOverworldStateClass(this.engine, this.play_state, auto_load));


				return;
			}



			if (this.play_state.current_level < 99 || this.play_state.game_mode == 3) {
				// gotta repeat tut levels until you win
				
				

			} else {
				// go to overworld - locked out
				//this.change_state(this.engine, new OverworldStateClass(this.engine, this.play_state));
				//return;
			}

			g_zblip_on_replay_level(this.play_state.current_level);
			var restart_state = new RestartGameStateClass(this.engine, this.play_state);
			restart_state.start_vis();
			this.change_state(this.engine, restart_state);
			//this.change_state(this.engine, new LoadingLevelStateClass(this.engine, this.play_state));
				
		} else if (x > this.twitter_x - 32 &&
		    	   x < this.twitter_x + 32 &&
		    	   y > this.twitter_y - 32 &&
		    	   y < this.twitter_y + 32) {
			tweetscore(this.play_state.score);
		}
	},

	cleanup: function() {
		g_reset_button.update_pos(-999, -999);
		g_game_over_text2.update_pos(-999, -999);
		g_game_over_text.update_pos(-999, -999);
		//g_tweet_score_sprite.update_pos(-999, -999);
		g_sharethis_text.update_pos(-999, -999);
		g_restart_text.update_pos(-999, -999);
		g_final_score_text.update_pos(-999, -999);

		g_star_rating_obj.hide();

		
		g_win_fb.update_pos(-999, -999);
		g_win_fb_text.update_pos(-999, -999);

		//for (var x = 0; x < this.play_state.grid_w; x++) {
		//	for (var y = 0; y < this.play_state.grid_h; y++) {
		//		this.play_state.pop_sprites[x][y].stop_anim();
		//	}
		//}


		play_screen_container.set_x(0);;
		play_screen_container.set_y(0);;
	},

	pop_x: [],
	pop_y: [],

	reveal_b: 0,

	update: function() { 

		//('game over update');
		this.wait_timer--;
		this.play_state.update();

		//('game over update   A');

		if (this.timer % 1 == 0 && 
		    this.play_state.game_mode == 1 && this.reveal_b < this.play_state.blocks.length) {
			// rand mode, reveal map
			for (var b = this.reveal_b; b < this.play_state.blocks.length; b++) {
					this.reveal_b = b;
					if (this.play_state.blocks[b].covered_up == false) continue;
					if (this.play_state.blocks[b].flag_on == true &&
				    	    this.play_state.blocks[b].block_type == 2) continue;	// correct flag

					// uncover
					this.play_state.blocks[b].preset_hint(0);	// 
					this.play_state.blocks[b].uncover();	
					if (b % 5 == 0) break;
			}
			
		} // rand mode, reveal map
		
		this.timer--;
		if (this.timer == 0) {

			


		}


	},


	draw: function() {

		this.screenshake_x_pos += this.screenshake_x_vel;

		this.screenshake_x_vel -= this.screenshake_x_pos;

		this.screenshake_x_vel = 0.95*this.screenshake_x_vel;

		play_screen_container.set_y(this.screenshake_x_pos);	



		this.play_state.draw();

		//this.play_state.score_obj.update_pos(this.score_x, this.score_y);
		if (screen_width > screen_height) g_final_score_text.update_pos(this.score_x - 128, this.score_y + 4);
		else {
			g_final_score_text.update_pos(this.score_x, this.score_y + 32);
			g_final_score_text.center_x(this.score_x);
		}
		g_game_over_text.update_pos(this.game_over_text_x, this.game_over_text_y);
		g_game_over_text.center_x(this.game_over_text_x);

		g_game_over_text2.update_pos(this.game_over_text2_x, this.game_over_text2_y);
		g_game_over_text2.center_x(this.game_over_text2_x);

		g_reset_button.update_pos(this.newgame_x, this.newgame_y);
		if (screen_width > screen_height)  g_restart_text.update_pos(this.newgame_x - 128, this.newgame_y - 8);
		else {
			g_restart_text.update_pos(this.newgame_x, this.newgame_y + 32);
			g_restart_text.center_x(this.newgame_x);
		}
		
		
		//g_tweet_score_sprite.update_pos(this.twitter_x, this.twitter_y);
		if (screen_width > screen_height) g_sharethis_text.update_pos(this.twitter_x - 128, this.twitter_y - 16);
		else g_sharethis_text.update_pos(this.twitter_x, this.twitter_y + 32);

		
		
		
	}
});



g_is_the_current_level_loaded = false;

g_all_level_data_floor_layer = {};
g_all_level_data_cover_layer = {};

g_all_level_data_floor_layer[0] = [
 [0,0,0,0],
[0,2,2,2],
[0,2,16,2],
[0,2,2,2]
		];

g_all_level_data_floor_layer.easy = {};
g_all_level_data_floor_layer.med = {};
g_all_level_data_floor_layer.hard = {};
g_all_level_data_floor_layer.nosmiley = {};



g_all_level_data_colour_layer = {};
g_all_level_data_colour_layer[0] = [];
g_all_level_data_colour_layer.easy = {};
g_all_level_data_colour_layer.med = {};
g_all_level_data_colour_layer.hard = {};
g_all_level_data_colour_layer.nosmiley = {};

g_all_level_data_text = {};
g_all_level_data_text[0] = "";
g_all_level_data_text.easy = {};
g_all_level_data_text.med = {};
g_all_level_data_text.hard = {};
g_all_level_data_text.nosmiley = {};



g_all_level_data_cover_layer[0] = 
		[
[0,2,2,0,2,0],
[2,2,2,0,2,0],
[0,2,0,2,2,0],
[2,2,2,2,2,0],
[2,2,0,2,0,0],
[0,0,0,0,0,0]
		];




LoadingLevelStateClass = GameStateClass.extend({

	done_: null,
	play_state: null,
	engine: null,

	already_loaded: false,

	post_win: false,

	p_level_folder: null,

	init: function(engine, play_state, level_num, post_win) {
		//load_script_assets(['level1.json'],this.callback);

		//$.loadJSON(['level1.json'],this.callback);

		this.play_state = play_state;
		this.engine = engine;

		g_is_the_current_level_loaded = false;

		if (post_win != null) this.post_win = post_win;

		var first_in_file = Math.floor(level_num / 10)*10;

		this.p_level_folder = g_all_level_data_floor_layer;
		var filepath_needed = 'levels/level' + first_in_file.toString() + 'to' + last_in_file + '.json';

		if (this.play_state.game_mode == 6) {

			console.log('this.play_state.challenge_level_hardness ' + this.play_state.challenge_level_hardness);
			
			if (this.play_state.challenge_level_hardness == 1) this.p_level_folder = g_all_level_data_floor_layer.easy;
			if (this.play_state.challenge_level_hardness == 2) this.p_level_folder = g_all_level_data_floor_layer.med;
			if (this.play_state.challenge_level_hardness == 3) this.p_level_folder = g_all_level_data_floor_layer.hard;
			if (this.play_state.challenge_level_hardness == 4) this.p_level_folder = g_all_level_data_floor_layer.nosmiley;

			var subfolder = "";
			if (this.play_state.challenge_level_hardness == 1) subfolder = "easy";
			if (this.play_state.challenge_level_hardness == 2) subfolder = "med";
			if (this.play_state.challenge_level_hardness == 3) subfolder = "hard";
			if (this.play_state.challenge_level_hardness == 4) subfolder = "nosmiley";
			filepath_needed = 'levels/' + subfolder + '/level' + first_in_file.toString() + 'to' + last_in_file + '.json';
		}

		


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
			

			var file_n = 'levels/level' + first_in_file.toString() + 'to' + last_in_file + '.json';

			if (this.play_state.game_mode == 6) {
				var subfolder = "";
				if (this.play_state.challenge_level_hardness == 1) subfolder = "easy";
				if (this.play_state.challenge_level_hardness == 2) subfolder = "med";
				if (this.play_state.challenge_level_hardness == 3) subfolder = "hard";
				if (this.play_state.challenge_level_hardness == 4) subfolder = "nosmiley";
				file_n = 'levels/' + subfolder + '/level' + first_in_file.toString() + 'to' + last_in_file + '.json';
			}

			console.log(file_n);

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

			this.extract_colour_data(first_level_in_this_file);	// if any

			for (var i = first_level_in_this_file; i < last_level; i++) {
				// is this a deep copy?
				//g_all_level_data_floor_layer[i] = g_current_level_data.floor[i - first_level_in_this_file].slice(0);
				//g_all_level_data_cover_layer[i] = g_current_level_data.cover[i - first_level_in_this_file].slice(0);

				//('storing level ' + i);

				
				//g_all_level_data_cover_layer[i] = new Array(10);


				if (g_all_level_status[i] == null) g_all_level_status[i] = 1;	// available

				if (g_current_level_data.floor[i - first_level_in_this_file].length != 10) {
					this.load_level_one_d_array(i, i - first_level_in_this_file);
					continue;
				} else if (g_current_level_data.floor[i - first_level_in_this_file].length == 0) {
					continue;
				}

				g_all_level_data_floor_layer[i] = new Array(10);

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

	extract_colour_data: function(firstlevel) {
		if (g_current_level_data.colour == null) return;
		if (g_current_level_data.text == null) return;

		var colour_folder = g_all_level_data_colour_layer;
		var text_folder = g_all_level_data_text;

		if (this.play_state.game_mode == 6) {
			if (this.play_state.challenge_level_hardness == 1) colour_folder = g_all_level_data_colour_layer.easy;
			if (this.play_state.challenge_level_hardness == 2) colour_folder = g_all_level_data_colour_layer.med;
			if (this.play_state.challenge_level_hardness == 3) colour_folder = g_all_level_data_colour_layer.hard;
			if (this.play_state.challenge_level_hardness == 4) colour_folder = g_all_level_data_colour_layer.nosmiley;

			if (this.play_state.challenge_level_hardness == 1) text_folder = g_all_level_data_text.easy;
			if (this.play_state.challenge_level_hardness == 2) text_folder = g_all_level_data_text.med;
			if (this.play_state.challenge_level_hardness == 3) text_folder = g_all_level_data_text.hard;
			if (this.play_state.challenge_level_hardness == 4) text_folder = g_all_level_data_text.nosmiley;
		}


		for (var i = 0; i < g_current_level_data.colour.length; i++) {
			colour_folder[firstlevel + i] = [];
			for (var j = 0; j < g_current_level_data.colour[i].length; j++) {
				colour_folder[firstlevel + i].push(g_current_level_data.colour[i][j]);
			}
		}

		for (var i = 0; i < g_current_level_data.text.length; i++) {
			text_folder[firstlevel + i] = "";
			text_folder[firstlevel + i] = g_current_level_data.text[i];
			
		}		
	},

	
	extract_tut_data:function() {
		if (g_current_level_data.tut == null) return;
		if (this.play_state.game_mode == 6) return;	// maybe later i'll make tuts compatible with challenge levels
		////console.log('extract_tut_data');
		//////console.log('g_current_level_data.tut.length ' + g_current_level_data.tut.length);
		//for (var i = 0; i < g_current_level_data.tut.length; i++) {
		for (var i in g_current_level_data.tut) {
			// -> g_tut_content
			var level = g_current_level_data.tut[i].levelnum;
			this.load_tut_level_one_d_array(level);

			////console.log('extract_tut_data > level ' + level);
			////console.dir(g_current_level_data.tut[i]);

			g_tut_content[level].text = [];
			g_tut_content[level].tiles = [];

			for (var stages = 0; stages < g_current_level_data.tut[i].text.length; stages++) {
				var text = g_current_level_data.tut[i].text[stages]; // string
				g_tut_content[level].text.push(text); 

				var tiles = g_current_level_data.tut[i].tiles[stages]; // array
				g_tut_content[level].tiles.push(tiles); 
				
			}

			g_tut_content[level].startclear = 0;
			if (g_current_level_data.tut[i].startclear != null) {
				g_tut_content[level].startclear = 1;
			}
			
			g_tut_content[level].dofill = [];
			if (g_current_level_data.tut[i].dofill != null) {
				for (var f = 0; f < g_current_level_data.tut[i].dofill.length; f++) {
					g_tut_content[level].dofill.push(g_current_level_data.tut[i].dofill[f]);
				}
			}

			g_tut_content[level].dodig = [];
			if (g_current_level_data.tut[i].dodig != null) {
				for (var f = 0; f < g_current_level_data.tut[i].dodig.length; f++) {
					g_tut_content[level].dodig.push(g_current_level_data.tut[i].dodig[f]);
				}
			}
		}
	},

	load_tut_level_one_d_array: function (num) {

		var size_ = g_current_level_data.tut[num].level.length;
		size_ = Math.sqrt(size_);

		////alert('level size ' + size_);

		g_tut_content[num] = {};

		g_tut_content[num].level = new Array(size_);
		
		for (var x = 0; x < size_; x++) {
			g_tut_content[num].level[x] = new Array(size_);
			//g_all_level_data_cover_layer[i][x] = new Array(10);

			for (var y = 0; y < size_; y++) {
				var b = y + size_*x;//x + 10*y;

				var floor_ = g_current_level_data.tut[num].level[b];
				g_tut_content[num].level[x][y] = floor_;

			}
		}
		////console.log('g_tut_content[num]');
		////console.dir(g_tut_content[num]);

		//////console.dir(g_all_level_data_floor_layer[i]);
	},

	load_level_one_d_array: function (i, rel_) {

		var size_ = g_current_level_data.floor[rel_].length;
		size_ = Math.sqrt(size_);

		////alert('level size ' + size_);

		this.p_level_folder[i] = new Array(size_);
		
		for (var x = 0; x < size_; x++) {
			this.p_level_folder[i][x] = new Array(size_);
			//g_all_level_data_cover_layer[i][x] = new Array(10);

			for (var y = 0; y < size_; y++) {
				var b = y + size_*x;//x + 10*y;

				var floor_ = g_current_level_data.floor[rel_][b];
				this.p_level_folder[i][x][y] = floor_;

			}
		}

		//////console.dir(g_all_level_data_floor_layer[i]);
	}
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

g_text_mylevel_name = null;
g_text_myauthor_name = null;

g_text_levelname_goeshere = null;
g_text_author_goeshere = null;

g_confirm_upload_button = null;

UploadLevelStateClass =  GameStateClass.extend({
	play_state: null,
	engine: null,

	levelname: "",
	writing_name: 1,	// or author

	init: function(engine, play_state) {

		this.play_state = play_state;
		this.engine = engine;

		if (g_text_mylevel_name == null) {

			g_text_levelname_goeshere = new TextClass(Types.Layer.GAME_MENU);
			g_text_levelname_goeshere.set_font(Types.Fonts.SMALL);
			g_text_levelname_goeshere.set_text("LEVEL NAME:");

			g_text_author_goeshere = new TextClass(Types.Layer.GAME_MENU);
			g_text_author_goeshere.set_font(Types.Fonts.SMALL);
			g_text_author_goeshere.set_text("AUTHOR NAME:");

			g_text_mylevel_name = new TextClass(Types.Layer.GAME_MENU);
			g_text_mylevel_name.set_font(Types.Fonts.SMALL);
			g_text_mylevel_name.set_text("MY LEVEL");

			g_text_myauthor_name = new TextClass(Types.Layer.GAME_MENU);
			g_text_myauthor_name.set_font(Types.Fonts.SMALL);
			g_text_myauthor_name.set_text("ANON");

			g_confirm_upload_button = new ButtonClass();
			g_confirm_upload_button.setup_sprite('uparrow.png',Types.Layer.GAME_MENU);

		}
	},

	author_y: 128,
	levelname_y: 64,

	upload_x: 0,
	upload_y: 0,

	screen_resized: function() {
		g_text_levelname_goeshere.update_pos(64, this.levelname_y);
		g_text_mylevel_name.update_pos(400, this.levelname_y);
		g_text_author_goeshere.update_pos(64, this.author_y);
		g_text_myauthor_name.update_pos(400, this.author_y);

		this.upload_x = screen_width - 64;
		this.upload_y = screen_height - 64;
		
		g_confirm_upload_button.update_pos(this.upload_x, this.upload_y);
	},

	cleanup: function() {
		g_text_levelname_goeshere.hide();
		g_text_mylevel_name.hide();
		g_text_author_goeshere.hide();
		g_text_myauthor_name.hide();
		
		g_confirm_upload_button.hide();
	},

	handle_key: function(keynum) {
		if (this.writing_name == 1) this.write_name(keynum);
		else this.write_author(keynum);
	},

	handle_mouse_down: function(engine,x,y) {

		this.handle_mouse_move(engine,x,y);

		if (mouse.x > this.upload_x - 25 &&
		    mouse.x < this.upload_x + 25 &&
		    mouse.y > this.upload_y - 25 &&
		    mouse.y < this.upload_y + 25) {
			
			// PostLevel
			this.change_state(this.engine, new PostLevel(this.engine, this.play_state));
			return;
		}

	},

	write_name: function(keynum) {

		if (keynum == 8) {
			// backspace
			

			if (this.input_cursor > 0) this.input_cursor--;

			var string_ = "";

			for (var i = 0; i < this.input_cursor; i++) {
				string.add(this.levelname[i]);
			}

			this.levelname = string_;

			g_text_mylevel_name.change_text(this.levelname);

			return;
		}
		
		//g_keyboard[]
		//g_seed_texts[this.input_cursor].update_pos(this.input_cursor*dist_ + dist_,screen_height*0.5);

		this.levelname.add(String.fromCharCode(keynum));
		g_text_mylevel_name.change_text(this.levelname);
		this.input_cursor++;
		return;

		g_seed_texts[this.input_cursor].change_text(String.fromCharCode(keynum));
		this.seed[this.input_cursor] = keynum;
		if (this.input_cursor < g_seed_texts.length) this.input_cursor++;

		
		

		
		
	},

	write_author: function(keynum) {

		if (keynum == 8) {
			// backspace
			

			if (this.input_cursor > 0) this.input_cursor--;

			var string_ = "";

			for (var i = 0; i < this.input_cursor; i++) {
				string.add(this.authorname[i]);
			}

			this.authorname = string_;

			g_text_myauthor_name.change_text(this.authorname);

			return;
		}
		
		//g_keyboard[]
		//g_seed_texts[this.input_cursor].update_pos(this.input_cursor*dist_ + dist_,screen_height*0.5);

		this.authorname.add(String.fromCharCode(keynum));
		g_text_myauthor_name.change_text(this.authorname);
		this.input_cursor++;
		

		
		
	},

});

g_confirm_upload_text = null;
g_confirm_upload_button = null;

ConfirmUploadStateClass =  GameStateClass.extend({
	play_state: null,
	engine: null,

	init: function(engine, play_state) {

		this.play_state = play_state;
		this.engine = engine;
		play_screen_container.make_vis();
		
		if (g_confirm_upload_text == null) {
			//var empty_ =

			//g_editor_sprites.push(empty_);

			g_confirm_upload_button = new ButtonClass();
			g_confirm_upload_button.setup_sprite('uparrow.png',Types.Layer.GAME_MENU);
			g_confirm_upload_button.update_pos(-999,-999);

			g_confirm_upload_text = new TextClass(Types.Layer.GAME_MENU);
			g_confirm_upload_text.set_font(Types.Fonts.XSMALL);
			g_confirm_upload_text.set_text("CONFIRM UPLOAD");
			
		}

		this.screen_resized();
	},

	cleanup: function () {



		g_confirm_upload_text.update_pos(-999,-999);
		g_confirm_upload_button.hide();
	},

	upload_x: 0,
	upload_y: 0,


	screen_resized: function() {
		this.upload_x = screen_width - 64;
		this.upload_y = screen_height - 128;

		g_confirm_upload_button.update_pos(this.upload_x, this.upload_y);

		g_confirm_upload_text.update_pos(this.upload_x, this.upload_y + 32);
		g_confirm_upload_text.center_x(this.upload_x);
	},

	handle_mouse_down: function(engine,x,y) {

		this.handle_mouse_move(engine,x,y);

		if (mouse.x > this.upload_x - 25 &&
		    mouse.x < this.upload_x + 25 &&
		    mouse.y > this.upload_y - 25 &&
		    mouse.y < this.upload_y + 25) {
			
			// PostFirebaseLevel

			//var post_level = 

			this.change_state(this.engine, new PostLevel(this.engine, this.play_state));
			//this.change_state(this.engine, new ConfirmUploadStateClass(this.engine, this.play_state));
			

			return;
		}
	}
});

g_editor_sprites_objs = null;

g_editor_upload_button = null;
g_editor_upload_text = null;

g_editor_test_button = null;
g_editor_test_text = null;

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


	init: function(engine, play_state) {

		this.play_state = play_state;
		this.engine = engine;
		
		
		this.play_state.level_w = 10;
		this.play_state.level_h = 10;
		play_screen_container.make_vis();

		this.show_level();

		if (g_editor_upload_button == null) {
			//var empty_ =

			//g_editor_sprites.push(empty_);

			g_editor_upload_button = new ButtonClass();
			g_editor_upload_button.setup_sprite('uparrow.png',Types.Layer.GAME_MENU);
			g_editor_upload_button.update_pos(-999,-999);

			g_editor_upload_text = new TextClass(Types.Layer.GAME_MENU);
			g_editor_upload_text.set_font(Types.Fonts.XSMALL);
			

			if (on_kong && kongregate.services.getUserId() > 0) {
				var name_ = kongregate.services.getUsername();
				g_editor_upload_text.set_text("UPLOAD AS\n" + name_);
			} else {
				g_editor_upload_text.set_text("UPLOAD AS\nANON");
			}

			//////console.log('on_kong == ' + on_kong);
			//////console.log('kongregate.services.getUserId()  == ' + kongregate.services.getUserId());

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


			g_editor_test_button = new ButtonClass();
			g_editor_test_button.setup_sprite('rightarrow.png',Types.Layer.GAME_MENU);
			g_editor_test_button.update_pos(-999,-999);

			g_editor_test_text = new TextClass(Types.Layer.GAME_MENU);
			g_editor_test_text.set_font(Types.Fonts.XSMALL);
			g_editor_test_text.set_text("PLAYTEST");

			g_editor_sprites_objs = new LevelEditorTileSelectClass();
			
			g_editor_sprites_objs.add_new('greytile.png', 0);
			g_editor_sprites_objs.add_new('colourtile_brown.png', GameTypes.Colours.BROWN);
			g_editor_sprites_objs.add_new('colourtile_darkblue.png', GameTypes.Colours.DARKBLUE);
			g_editor_sprites_objs.add_new('colourtile_green.png', GameTypes.Colours.GREEN);
			g_editor_sprites_objs.add_new('colourtile_lightblue.png', GameTypes.Colours.LIGHTBLUE);
			g_editor_sprites_objs.add_new('colourtile_orange.png', GameTypes.Colours.ORANGE);
			g_editor_sprites_objs.add_new('colourtile_pink.png', GameTypes.Colours.PINK);
			g_editor_sprites_objs.add_new('colourtile_purple.png', GameTypes.Colours.PURPLE);
			g_editor_sprites_objs.add_new('colourtile_red.png', GameTypes.Colours.RED);
			g_editor_sprites_objs.add_new('colourtile_yellow.png', GameTypes.Colours.YELLOW);
			g_editor_sprites_objs.add_new('bluetile.png', GameTypes.Colours.WHITE);

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

		

		
		
		this.play_state.reset();

		
		for (var x = 0; x < this.play_state.grid_w; x++) {
			for (var y = 0; y < this.play_state.grid_h; y++) {
				this.highlighted_x = x;
				this.highlighted_y = y;
				this.delete_tile(x,y);
			}
		}
	

		g_editor_sprites_objs.make_vis();

		//this.play_state.restore_backup();

		this.screen_resized();

		
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
			

		this.play_state.calc_sequence_lengths();
		
		this.play_state.calc_edge_nonogram();

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


		//this.play_state.backup_level();

		g_editor_sprites_objs.hide();

		g_editor_upload_text.update_pos(-999,-999);
		g_editor_upload_button.hide();

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

	localsave_x: 0,
	localsave_y: 0,

	
	localload_x: 0,
	localload_y: 0,

	screen_resized: function() {
		this.upload_x = screen_width - 64;
		this.upload_y = 64;

		this.test_x = screen_width - 64;
		this.test_y = 128 + 64;

		this.localsave_x = -999-screen_width - 64;
		this.localsave_y = -999-screen_height - 128 - 64;

		this.localload_x = - 999 - screen_width - 64;
		this.localload_y = - 999 - screen_height - 64;
	
		g_editor_upload_button.update_pos(this.upload_x, this.upload_y);

		g_editor_upload_text.update_pos(this.upload_x, this.upload_y + 32);
		g_editor_upload_text.center_x(this.upload_x);

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

	handle_mouse_up: function(engine,x,y) {
		//if (x < this.play_state.grid_w*this.play_state.tile_size &&
		//	y < this.play_state.grid_h*this.play_state.tile_size) return;
		g_editor_sprites_objs.click(mouse.x, mouse.y);

		
	},

	delete_tile: function(x,y) {
		this.play_state.change_tile(this.highlighted_x,this.highlighted_y,0);

		if (this.play_state.blocks[this.play_state.tiles[x][y]].block_type == 2) this.play_state.blocks[this.play_state.tiles[x][y]].put_flag_on();
		else this.play_state.blocks[this.play_state.tiles[x][y]].put_x_on();

		
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
		var json_obj = {};
		json_obj.floor = [];

		// whatever colour is selected -> background
		var bg_colour = g_editor_sprites_objs.build_codes[g_editor_sprites_objs.selected];

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
		var bg_colour = g_editor_sprites_objs.build_codes[g_editor_sprites_objs.selected];

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

		//console.log(str);
	},

	export_to_json_monochrome: function () {
		
	},

	

	handle_mouse_down: function(engine,x,y) {

		this.handle_mouse_move(engine,x,y);

		if (mouse.x > this.upload_x - 25 &&
		    mouse.x < this.upload_x + 25 &&
		    mouse.y > this.upload_y - 25 &&
		    mouse.y < this.upload_y + 25) {

			//console.log('Level Editor > g_generator_class.go');
			g_generator_class.bg_colour = g_editor_sprites_objs.build_codes[g_editor_sprites_objs.selected];
			
			g_generator_class.go(this);

			if (g_generator_class.success == false) return;

			// save to file
			
			
			this.export_to_json_colour();

			return;
		}

		if (mouse.x > this.test_x - 25 &&
		    mouse.x < this.test_x + 25 &&
		    mouse.y > this.test_y - 25 &&
		    mouse.y < this.test_y + 25) {
			
			this.play_level();
			return;
		}

		if (this.highlighted_x < 0 || 
		    this.highlighted_x >= this.play_state.grid_w ||
		    this.highlighted_y < 0 || 
		    this.highlighted_y >= this.play_state.grid_h) return;

		var cover_up = 0;
		
		var colour_ = g_editor_sprites_objs.build_codes[g_editor_sprites_objs.selected];

		
		if (colour_ == 0) {

			
			this.delete_tile(this.highlighted_x,this.highlighted_y);
			//this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].
			
		} else {
			// set colour
			this.play_state.change_tile(this.highlighted_x,this.highlighted_y,2);
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].secret_colour = colour_;
		}

		this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].colour_mode = true;
		if (this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].block_type == 2) this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].put_flag_on();
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


g_overworld_sprites = null;
g_total_num_of_levels = 99;//122 on kong;
g_levelnum_app_cutoff = 81;
g_levelnum_app_cutoff_nosmiley = 30;

g_total_challenge_levels_easy = 53;
g_total_challenge_levels_med = 72;
g_total_challenge_levels_hard = 93;
g_total_challenge_levels_nosmiley = 45;
g_challenge_levels_easy_progress = 0;
g_challenge_levels_med_progress = 0;
g_challenge_levels_hard_progress = 0;

g_all_level_status = {};	// 1 - available,  2  - timeout, 3 - lock,  4 - tick
g_all_level_status.easy = {};
g_all_level_status.med = {};
g_all_level_status.hard = {};
g_all_level_status.nosmiley = {};

load_all_level_status = function(status) {
	g_all_level_status = status;
	if (g_all_level_status.easy == null) g_all_level_status.easy = {};
	if (g_all_level_status.med == null) g_all_level_status.med = {};
	if (g_all_level_status.hard == null) g_all_level_status.hard = {};
	if (g_all_level_status.nosmiley == null) g_all_level_status.nosmiley = {};
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

OverworldStateClass = GameStateClass.extend({
	play_state: null,
	engine: null,

	fb_x: 0,
	fb_y: 0,

	left_arrow_x: 0,
	left_arrow_y: 0,
	right_arrow_x: 0,
	right_arrow_y: 0,

	init: function(engine, play_state) {

		play_screen_container.hide();
		background_group.hide();
	

		this.engine = engine;
		this.play_state = play_state;

		this.play_state.hide_bg_squares();

		g_top_nono_size = 0;
		g_left_nono_size = 0;
		g_level_size = 13; g_level_w = 7;
		//g_level_
		do_resize();

		if (g_overworld_sprites == null) {

			
			g_overworld_to_app_button = new SpriteClass();
			g_overworld_to_app_button.setup_sprite('cherry.png',Types.Layer.HUD);

			g_overworld_corner_sprite = new SpriteClass();
			g_overworld_corner_sprite.setup_sprite('elephant.png',Types.Layer.GAME_MENU);

			g_overworld_to_app_text = new TextClass(Types.Layer.HUD);
			g_overworld_to_app_text.set_font(Types.Fonts.XSMALL);
			g_overworld_to_app_text.set_text("GET THE FREE APP (MORE LEVELS!)");

			g_overworld_sprites = new OverworldSpritesClassReuseable(this.play_state);

			g_overworld_text = new TextClass(Types.Layer.GAME_MENU);
			g_overworld_text.set_font(Types.Fonts.MED_SMALL);
			g_overworld_text.set_text("G_OVERWORLD TEXT");

			g_overworld_fb_text = new TextClass(Types.Layer.GAME_MENU);
			g_overworld_fb_text.set_font(Types.Fonts.SMALL);
			g_overworld_fb_text.set_text("FIND US ON FACEBOOK:   ");

			g_overworld_fb_button = new SpriteClass();
			g_overworld_fb_button.setup_sprite('eye.png',Types.Layer.GAME_MENU);

			g_overworld_left_button = new SpriteClass();
			g_overworld_left_button.setup_sprite('leftarrow.png',Types.Layer.GAME_MENU);

			g_overworld_right_button = new SpriteClass();
			g_overworld_right_button.setup_sprite('rightarrow.png',Types.Layer.GAME_MENU);

			g_overworld_left_text =  new TextClass(Types.Layer.GAME_MENU);
			g_overworld_left_text.set_font(Types.Fonts.SMALL);
			g_overworld_left_text.set_text("CHALLENGE MODES");

			g_overworld_right_text =  new TextClass(Types.Layer.GAME_MENU);
			g_overworld_right_text.set_font(Types.Fonts.SMALL);
			g_overworld_right_text.set_text("LEVELS 31 - 60");
			
			

			
		}

		
		g_overworld_corner_sprite.make_vis();

		g_overworld_to_app_button.make_vis();
		g_overworld_to_app_text.make_vis();
		
		//this.play_state.reset();

		
		
		for (var x = 0; x < this.play_state.grid_w; x++) {
			for (var y = 0; y < this.play_state.grid_h; y++) {
				this.play_state.change_tile(x,y,0);
				
				this.play_state.blocks[this.play_state.tiles[x][y]].preset_hint(0);
				//this.play_state.blocks[this.play_state.tiles[x][y]].cover();
				this.play_state.blocks[this.play_state.tiles[x][y]].uncover();
				this.play_state.blocks[this.play_state.tiles[x][y]].reset();
			}
		}
		

		// show the levels to select...
		// on mouse up - check what level was selected

		g_overworld_sprites.reset();

		

		if (this.play_state.game_mode == 6) {
			// challenge levels
			this.load_challenge_levels();
			if (this.play_state.challenge_level_hardness == 1) g_overworld_text.change_text("CHALLENGE LEVELS\n-RELAXING");
			if (this.play_state.challenge_level_hardness == 2) g_overworld_text.change_text("CHALLENGE LEVELS\n-MEDIUM");
			if (this.play_state.challenge_level_hardness == 3) g_overworld_text.change_text("CHALLENGE LEVELS\n-ALL CLUES");
			if (this.play_state.challenge_level_hardness == 4) g_overworld_text.change_text("CHALLENGE LEVELS\n-NO SMILEY");

			g_overworld_sprites.make_vis();

			g_overworld_left_button.make_vis();
			g_overworld_right_button.make_vis();

			g_overworld_corner_sprite.update_pos(16,16);
			g_overworld_text.update_pos(32,16);	

			g_overworld_fb_button.make_vis();

			this.screen_resized();

			g_overworld_corner_sprite.set_texture('saturn.png');

			return;
		}

		if (this.play_state.game_mode == 0) g_overworld_corner_sprite.set_texture('elephant.png');
		g_overworld_corner_sprite.update_pos(16,16);

		if (g_overworld_to_show == 0) this.load_campaign_1to30();
		else if (g_overworld_to_show == 1) this.load_campaign_31to60();
		else if (g_overworld_to_show == 2) this.load_challenge_levels();
		else if (g_overworld_to_show == 4) this.load_campaign_61to90();
		else if (g_overworld_to_show >= 5) this.load_campaign_from((g_overworld_to_show - 2)*30 + 1);
		else  this.load_campaign_1to30();

		if (g_overworld_to_show == 0) g_overworld_text.change_text("LEVELS 1 - 30");
		else if (g_overworld_to_show == 1) g_overworld_text.change_text("LEVELS 31 - 60");// +g_total_num_of_levels.toString());
		else if (g_overworld_to_show == 2) g_overworld_text.change_text("CHALLENGE MODES");
		else if (g_overworld_to_show == 4) g_overworld_text.change_text("LEVELS 61 - 90");
		else if (g_overworld_to_show >= 5) {
			var start_ = (g_overworld_to_show - 2)*30 + 1;
			var end_ = start_ + 30;
			g_overworld_text.change_text("LEVELS " + start_ + " - " + end_);

		}

		if (g_overworld_to_show == 0) g_overworld_left_text.change_text("CHALLENGE MODES");
		else if (g_overworld_to_show == 1) g_overworld_left_text.change_text("LEVELS 1 - 30");
		else if (g_overworld_to_show == 2) g_overworld_left_text.change_text("");
		else if (g_overworld_to_show == 4) g_overworld_left_text.change_text("LEVELS 31 - 60");
		else if (g_overworld_to_show >= 5) {
			var start_ = (g_overworld_to_show - 2)*30 + 1;
			start_ += 60;
			var end_ = start_ + 30;
			start_--; start_--;
			end_--;
			g_overworld_left_text.change_text("LEVELS " + start_ + " - " + end_);
		}

		if (g_overworld_to_show == 0) g_overworld_right_text.change_text("LEVELS 31 - 60" );
		else if (g_overworld_to_show == 1) g_overworld_right_text.change_text("LEVELS 61 - 90");
		else if (g_overworld_to_show == 2) g_overworld_right_text.change_text("LEVELS 1 - 30");
		else if (g_overworld_to_show == 4) g_overworld_right_text.change_text("LEVELS 91 - 120");
		else if (g_overworld_to_show >= 5) {
			var start_ = (g_overworld_to_show - 2)*30 + 1;
			start_ -= 30;
			if (start_ <= g_total_num_of_levels) {

				var end_ = start_ + 30;
				g_overworld_left_text.change_text("LEVELS " + start_ + " - " + end_);

			} else {


			}
		}
		
		var min_level = 0;
		

		if (g_overworld_to_show == 1) min_level = 30;
		else if (g_overworld_to_show == 4) min_level = 60;
		else if (g_overworld_to_show >= 5) min_level = (g_overworld_to_show - 2)*30;

		var max_level = min_level + 29;
		max_level = Math.min(max_level, g_total_num_of_levels);
		
		//for (var level in g_all_level_status) {
		for (var l = min_level; l <= max_level; l++) {

			var level = l;

			//("status of level " + level.toString() + " " + g_all_level_status[level]);

			var screen_level = level;
			if (g_overworld_to_show == 1) screen_level -= 30;
			else if (g_overworld_to_show == 2) break;
			else if (g_overworld_to_show == 4) screen_level -= 60;
			else if (g_overworld_to_show >= 5) screen_level -= (g_overworld_to_show - 2)*30;

			if (screen_level < 0 || screen_level > 29 || screen_level == undefined || screen_level == null) continue;

			if (g_all_level_status[level] == 2) {
				// timeout
				g_overworld_sprites.set_status(screen_level, 2);

			} else if (g_all_level_status[level] == 3) {
				// lock
				g_overworld_sprites.set_status(screen_level, 3);

			} else if (g_all_level_status[level] == 4) {
				// tick
				g_overworld_sprites.set_status(screen_level, 4);

			}  else {
				
				g_overworld_sprites.no_status(screen_level);
			}
		}

		g_overworld_left_text.hide();
		g_overworld_right_text.hide();
		
		g_overworld_sprites.make_vis();

		g_overworld_left_button.make_vis();
		g_overworld_right_button.make_vis();

		g_overworld_text.update_pos(32,16);	

		g_overworld_fb_button.make_vis();

		

		this.screen_resized();

	},

	load_campaign_from: function(start_) {
		// add campaign levels
		for (var i = start_ - 1; i < start_ + 29; i++) {

			if (g_all_level_status[i] == null) {
				g_all_level_status[i] = 1;
			}

			if (i > g_total_num_of_levels) continue;

			


			var levelname = (i + 1).toString();

			if (i >= g_levelnum_app_cutoff) levelname = 'APP';

			if (i == 9999) g_overworld_sprites.add_level('hand.png', levelname);
			else if (i == 1) g_overworld_sprites.add_level('redtile8touch.png', levelname);
			else if (i == 9) g_overworld_sprites.add_level('eye.png', levelname);
			else if (false && i == 21) g_overworld_sprites.add_level('plus.png', levelname);
			else if (i == 20) g_overworld_sprites.add_level('heart.png', levelname);
			else if (i == 30) g_overworld_sprites.add_level('redtileheart.png', levelname);
			else if (i == 90) g_overworld_sprites.add_level('red2multi.png', levelname);
			else if (i == 40) g_overworld_sprites.add_level('crown.png', levelname);
			else if (i == 60) g_overworld_sprites.add_level('redtilesmile.png', levelname);
			//else if (i == 120) g_overworld_sprites.add_level('join_tut.png', levelname);
			//else if (i == 110) g_overworld_sprites.add_level('sharetut.png', levelname);
			//else if (i == 130) g_overworld_sprites.add_level('zap.png', levelname);
			//else if (i == 140) g_overworld_sprites.add_level('ghost.png', levelname);
			//else if (i == 150) g_overworld_sprites.add_level('walker.png', levelname);	
			else if (i == 160) g_overworld_sprites.add_level('eyerepeat.png', levelname);	
			else if (i == 170) g_overworld_sprites.add_level('double_tut.png', levelname);		
			else g_overworld_sprites.add_level(null, levelname);

			
		
			
		}
	},

	load_campaign_1to30: function() {
		// add campaign levels
		for (var i = 0; i < 30; i++) {

			if (g_all_level_status[i] == null) {
				g_all_level_status[i] = 1;
			}

			if (i >= 30) continue;

			var levelname = (i + 1).toString();

			if (i == 9999) g_overworld_sprites.add_level('hand.png', levelname);
			//else if (i == 2) g_overworld_sprites.add_level('eye.png', levelname);
			//else if (i == 13) g_overworld_sprites.add_level('8hand.png', levelname);
			else if (false && i == 21) g_overworld_sprites.add_level('plus.png', levelname);
			//else if (i == 28) g_overworld_sprites.add_level('join_tut.png', levelname);
			else if (i == 0) g_overworld_sprites.add_level('redtile8touch.png', levelname);
			else if (i == 9) g_overworld_sprites.add_level('eye.png', levelname);
			else if (false && i == 21) g_overworld_sprites.add_level('plus.png', levelname);
			else if (i == 20) g_overworld_sprites.add_level('heart.png', levelname);
			else if (i == 30) g_overworld_sprites.add_level('redtileheart.png', levelname);
			//else if (i == 90) g_overworld_sprites.add_level('eyebracket.png', levelname);
			else g_overworld_sprites.add_level(null, levelname);

			
		}

	},

	load_campaign_31to60: function() {
		// add campaign levels
		for (var i = 0; i < g_total_num_of_levels - 30; i++) {

			if (i >= 30) break;

			var levelname = (i + 1 + 30).toString();

			if (i + 1 + 30 == 9999) g_overworld_sprites.add_level('heart.png', levelname);
			//else if (i + 1 + 30 == 95) g_overworld_sprites.add_level('walkingdist.png', levelname);
			
			else if (false && i == 21) g_overworld_sprites.add_level('plus.png', levelname);
			//else if (i == 90) g_overworld_sprites.add_level('eyebracket.png', levelname);
			else if (i == 30 - 30) g_overworld_sprites.add_level('redtileheart.png', levelname);
			else if (i == 40 - 30) g_overworld_sprites.add_level('crown.png', levelname);
			else if (i == 60 - 30) g_overworld_sprites.add_level('redtilesmile.png', levelname);
			else if (i == 50 - 30) g_overworld_sprites.add_level('eyebracket.png', levelname);
			else g_overworld_sprites.add_level(null, levelname);

		}
	},

	load_campaign_61to90: function() {
		// add campaign levels
		for (var i = 0; i < g_total_num_of_levels - 60; i++) {

			if (i >= 60) break;

			var levelname = (i + 1 + 60).toString();

			if (i + 60 >= g_levelnum_app_cutoff) levelname = 'APP';

			if (i + 1 + 60 == 61) g_overworld_sprites.add_level('smiley.png', levelname);
			else if (i + 1 + 60 == 71) g_overworld_sprites.add_level('redtilesmile.png', levelname);
			else if (i + 1 + 60 == 81) g_overworld_sprites.add_level('redtilezap.png', levelname);
			else if (i + 1 + 60 == 91) g_overworld_sprites.add_level('red2multi.png', levelname);
			else if (i + 1 + 60 == 991) g_overworld_sprites.add_level('crown.png', levelname);
			else g_overworld_sprites.add_level(null, levelname);

		}
	},

	old_load_challenge_levels: function() {
		//g_overworld_sprites.add_special("MINESWEEPER++\n(RANDOM GENERATOR)" , 1); // GenerateRandStateClass  special type 1
		//g_overworld_sprites.add_special("DAILY CHALLENGE" , 2); // special type 2
		//g_overworld_sprites.add_special("UNENDING" , 3); // special type 3
		//g_overworld_sprites.add_special("MINEDOKU" , 5); // special type 5
		//g_overworld_sprites.add_special("FIREBASE" , 7); // LoadFirebaseLevel
		//g_overworld_sprites.add_special("COMMUNITY LEVELS" , 4); // special type 4
		//g_overworld_sprites.add_special("EDITOR" , 6); // special type 6
	},

	challenge_levels_start: 0,

	load_challenge_levels: function() {

		var start = g_challenge_levels_page*30;//Math.floor(g_challenge_levels_page / 30);
		//console.log('g_challenge_levels_page ' + g_challenge_levels_page + ' start ' + start);
		if (start < 0) start = 0;
		var end = start + 30;
		var max = 999;

		this.challenge_levels_start = start;

		if (this.play_state.challenge_level_hardness == 1) max = g_total_challenge_levels_easy;
		if (this.play_state.challenge_level_hardness == 2) max = g_total_challenge_levels_med;
		if (this.play_state.challenge_level_hardness == 3) max = g_total_challenge_levels_hard;
		if (this.play_state.challenge_level_hardness == 4) max = g_total_challenge_levels_nosmiley;

		var p_status = g_all_level_status.easy;
		if (this.play_state.challenge_level_hardness == 2) p_status = g_all_level_status.med;
		if (this.play_state.challenge_level_hardness == 3) p_status = g_all_level_status.hard;
		if (this.play_state.challenge_level_hardness == 4) p_status = g_all_level_status.nosmiley;

		//console.log('g_all_level_status.nosmiley ' + g_all_level_status.nosmiley.dir);
		//console.log('g_all_level_status.hard ' + g_all_level_status.hard.dir);

		if (end > max) end = max;

		for (var i = start; i < end; i++) {

			var levelname = (i + 1).toString();

			if (using_cocoon_js == false &&
			    this.play_state.challenge_level_hardness == 3) levelname = 'APP';

			if (using_cocoon_js == false &&
			    this.play_state.challenge_level_hardness == 4 &&
			    i > g_levelnum_app_cutoff_nosmiley) levelname = 'APP';

			g_overworld_sprites.add_level(null, levelname);

			//console.log('load_challenge_levels > i: ' + i + ' p_status[i] ' + p_status[i]);

			if (p_status != null &&
			    p_status[i] != null) {
				if (p_status[i] == 4) g_overworld_sprites.set_status(i - start, 4);
			}

		}
		

		// this.play_state.challenge_level_hardness 1 2 3 4
		// this.play_state.game_mode == 6 for this be called

		//g_total_challenge_levels_easy = 20;
		//g_total_challenge_levels_med = 40;
		//g_total_challenge_levels_hard = 30;
		//g_challenge_levels_easy_progress = 0;
		//g_challenge_levels_med_progress = 0;
		//g_challenge_levels_hard_progress = 0;
		
	},

	cleanup: function () {

		

		g_overworld_sprites.hide();

		g_overworld_text.update_pos(-999, -999);
		g_overworld_corner_sprite.hide();

		g_overworld_fb_button.hide();
		g_overworld_fb_text.update_pos(-999, -999);

		g_overworld_left_button.hide();
		g_overworld_right_button.hide();

		g_overworld_left_text.update_pos(-999, -999);

		g_overworld_right_text.update_pos(-999, -999);

		g_overworld_to_app_button.hide();
		g_overworld_to_app_text.update_pos(-999, -999);

		//play_screen_container.make_vis();//;
	},

	app_x: 0,
	app_y: 0,
	clicked_app: false,

	screen_resized: function () {

		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();

		
		this.fb_x = -999;
		this.fb_y = -999;

		

		if (using_cocoon_js == true) this.fb_x = -999;
		this.fb_x = -999;
		

		this.left_arrow_x = 0.5*screen_width - 64;
		this.left_arrow_y = screen_height - 32;
		this.right_arrow_x = 0.5*screen_width + 64;
		this.right_arrow_y = screen_height - 32;

		if (g_overworld_to_show >= 5) {
			var start_ = (g_overworld_to_show - 2)*30 + 1;
			start_ += 30;
			if (start_ >= g_total_num_of_levels) this.right_arrow_x = -999;
			
		}

		if (g_overworld_to_show == 2) this.left_arrow_y = -999;
		else if (g_total_num_of_levels < (g_overworld_to_show - 2)*30 + 1) {
			this.right_arrow_y = -999;
			
		} else if (g_overworld_to_show == 0) this.left_arrow_y = -999;

		


		g_overworld_left_button.update_pos(this.left_arrow_x, this.left_arrow_y);
		g_overworld_right_button.update_pos(this.right_arrow_x, this.right_arrow_y);

		//g_overworld_left_text.update_pos(this.left_arrow_x, this.left_arrow_y + 32);
		//g_overworld_left_text.center_x(this.left_arrow_x);

		//g_overworld_right_text.update_pos(this.right_arrow_x, this.right_arrow_y + 32);
		//g_overworld_right_text.center_x(this.right_arrow_x);

		if (screen_width > screen_height) {
			this.fb_x = -999;
			this.fb_y = -999;
		} else {
			//g_overworld_left_text.change_size(Types.Fonts.XSMALL);
			//g_overworld_right_text.change_size(Types.Fonts.XSMALL);

			
		}

		this.fb_x = -999;

		g_overworld_fb_button.update_pos(this.fb_x, this.fb_y);
		g_overworld_fb_text.update_pos(this.fb_x - 286, this.fb_y - 10);

		g_overworld_sprites.make_vis();

		g_overworld_left_button.make_vis();
		g_overworld_right_button.make_vis();


		// x = x*this.level_tile_size;
		// y = y*0.5*120 + 120;
		this.app_y = 7*0.5*120 + 120;
		this.app_x = -60;

		if (using_cocoon_js == true) {
			this.app_x = -999;
		}

		g_overworld_to_app_button.update_pos(this.app_x, this.app_y);
		g_overworld_to_app_text.update_pos(this.app_x + 40, this.app_y - 8);


		
		g_overworld_text.update_pos(96 - 16, 16);	
		g_overworld_corner_sprite.update_pos(32 + 8, 32 - 4);
		
	},

	go_to_fb: function() {
		window.open('https://www.facebook.com/mathsweeper/');
	},

	handle_mouse_down: function(engine,x,y) {
		
		

	},

	
	handle_mouse_up: function(engine,x,y) {
		this.mousedown = false;
		g_overworld_sprites.click(x,y);

		if (g_overworld_sprites.selected_special == 1) {
			//('1992 MODE');
			this.play_state.current_level = 7;
			this.play_state.first_tile_safe = true;
			this.change_state(this.engine, new GenerateRandStateClass(this.engine, this.play_state));
			return;
		} else if (g_overworld_sprites.selected_special == 4) {
			//SeedLevelStateClass
			this.play_state.current_level = 7;
			this.play_state.first_tile_safe = true;
			this.change_state(this.engine, new SeedLevelStateClass(this.engine, this.play_state));
			return;
		} else if (g_overworld_sprites.selected_special == 7) {
			//SeedLevelStateClass
			this.play_state.current_level = 7;
			this.play_state.first_tile_safe = true;
			this.change_state(this.engine, new LoadFirebaseLevel(this.engine, this.play_state));
			return;
		} else if (g_overworld_sprites.selected_special == 6) {
			//SeedLevelStateClass
			this.play_state.current_level = 7;
			this.play_state.first_tile_safe = true;
			this.change_state(this.engine, new LevelEditorStateClass(this.engine, this.play_state));
			return;
		}
		
		// 

		var blocking = false;

		if (g_servermode == false &&
		   using_cocoon_js == false) blocking = true;

		if (g_overworld_sprites.selected != -1 &&
		    this.play_state.game_mode == 6) {

			if (blocking == true &&
			   this.play_state.challenge_level_hardness == 3) return;

			g_overworld_sprites.selected += this.challenge_levels_start;

			if (blocking == true &&
			   this.play_state.challenge_level_hardness == 4 &&
			   g_overworld_sprites.selected > g_levelnum_app_cutoff_nosmiley) return;
			
			
			this.play_state.current_level = g_overworld_sprites.selected;
			// in story mode, we would check for a tutorial to load here
			this.change_state(this.engine, new LoadingLevelStateClass(this.engine, this.play_state, this.play_state.current_level));

			return;
		}

		if (g_overworld_sprites.selected != -1) {

			if (g_overworld_to_show == 0) {}
			else if (g_overworld_to_show == 1) g_overworld_sprites.selected += 30;
			else if (g_overworld_to_show == 4) g_overworld_sprites.selected += 60;
			else if (g_overworld_to_show >= 5) g_overworld_sprites.selected += (g_overworld_to_show - 2)*30;

			if (using_cocoon_js == false &&
			    g_overworld_sprites.selected >= g_levelnum_app_cutoff) return;

			//('LEVEL ' + g_overworld_sprites.selected);

			this.play_state.current_level = g_overworld_sprites.selected;
			//this.play_state.load_level(g_overworld_sprites.selected);

			//this.change_state(this.engine, new RestartGameStateClass(this.engine, this.play_state));

			if (g_tut_content[this.play_state.current_level] != null) {
				
				this.play_state.game_mode = 5;
				this.change_state(this.engine, new LoadInstructionStateClass(this.engine, this.play_state));
				return;
			}
			
			this.play_state.game_mode = 0;	// campaign mode
			
			this.change_state(this.engine, new LoadingLevelStateClass(this.engine, this.play_state, this.play_state.current_level));

			return;
			
		}

		if (mouse.x > this.fb_x - 16 &&
		    mouse.x < this.fb_x + 16 &&
		    mouse.y > this.fb_y - 16 &&
		    mouse.y < this.fb_y + 16) {
			this.go_to_fb();
		}

		var left_ = 0;
		var right_ = 0;		

		if (screen_width < screen_height && 
		    mouse.y > screen_height*0.5 &&
		    mouse.x > screen_width*0.5) right_ = 1;
		else if (screen_width < screen_height && 
		    mouse.y > screen_height*0.5 &&
		    mouse.x < screen_width*0.5) left_ = 1;

		if ((mouse.x > this.left_arrow_x - 16 &&
		    mouse.x < this.left_arrow_x + 16 &&
		    mouse.y > this.left_arrow_y - 16 &&
		    mouse.y < this.left_arrow_y + 16) || left_ == 1) {

			g_challenge_levels_page--;
			

			if (g_overworld_to_show == 0) return;//g_overworld_to_show = 2;
			else if (g_overworld_to_show == 2) return;
			else if (g_overworld_to_show == 1) g_overworld_to_show = 0;
			else if (g_overworld_to_show == 4) g_overworld_to_show = 1;
			else if (g_overworld_to_show >= 5) g_overworld_to_show--;
			
			this.change_state(this.engine, new StartOverworldStateClass(this.engine, this.play_state));
			return;
		} else if ((mouse.x > this.right_arrow_x - 16 &&
		   	   mouse.x < this.right_arrow_x + 16 &&
		    	   mouse.y > this.right_arrow_y - 16 &&
		    	   mouse.y < this.right_arrow_y + 16) || right_ == 1) {

			g_challenge_levels_page++;
			
			if (g_overworld_to_show == 0) g_overworld_to_show = 1;
			else if (g_overworld_to_show == 1)g_overworld_to_show = 4;
			else if (g_overworld_to_show == 2) g_overworld_to_show = 0;
			else if (g_overworld_to_show == 4) g_overworld_to_show = 5;
			else if (g_overworld_to_show >= 5 && g_total_num_of_levels > (g_overworld_to_show - 2)*30 + 1) g_overworld_to_show++;
			else if (g_total_num_of_levels < (g_overworld_to_show - 2)*30 + 1) return;

			this.change_state(this.engine, new StartOverworldStateClass(this.engine, this.play_state));
			return;
		}


	},

	mousedown: false,
	
	handle_mouse_down: function(engine,x,y) {
		if (this.mousedown == true) return;
		this.mousedown = true;
		g_overworld_sprites.highlight_on(x,y);

		
		if (x > this.app_x - 16 &&
		    x < this.app_x + 16 &&
		    y > this.app_y - 16 &&
		    y < this.app_y + 16 && this.clicked_app == false) {
			this.clicked_app = true;
			open_url(gettheapp_url); 
			return;
		}
	},

	update: function() { 

	},

	draw: function() {

	}


});

gettheapp_url = 'https://www.zblip.com/pixoji';	//	app	appinfo	   gettheapp	... thinking bout SEO
							// or ' https://www.zblip.com/pixoji '
							// put the webgame at https://www.zblip.com/pixoji/play


go_to_fb = function() {
		window.open('https://www.facebook.com/mathsweeper/');
};

g_play_button_sprite= null;
g_tut_button_sprite= null;

g_play_button_text = null;
g_tut_button_text = null;

g_game_name_text = null;

g_menu_title_box = null;
g_menu_fire_sprite = null;
g_menu_bomb_sprite = null;
g_menu_fire_sprite_shadow = null;
g_menu_bomb_sprite_shadow = null;
g_menu_plus_sprite = null;

Menu2StateClass = GameStateClass.extend({
	play_state: null,
	engine: null,

	tut_x: 0,
	play_x : 0,
	title_y: 0,

	tut_actual_x: 0,
	play_actual_x : 0,
	title_actual_y: 0,

	timer: 30,

	init: function(engine, play_state) {

		play_screen_container.make_vis();

		this.engine = engine;
		this.play_state = play_state;

		if (g_play_button_sprite == null) {
			g_play_button_sprite = new ButtonClass();
			g_play_button_sprite.setup_sprite("play_icon.png",Types.Layer.GAME_MENU);
			g_play_button_sprite.update_pos(screen_width + 200, screen_height*0.5);

			g_tut_button_sprite = new ButtonClass();
			g_tut_button_sprite.setup_sprite("tut_icon.png",Types.Layer.GAME_MENU);
			g_tut_button_sprite.update_pos(- 200, screen_height*0.5);

			g_play_button_text = new TextClass(Types.Layer.GAME_MENU);
			g_play_button_text.set_font(Types.Fonts.MEDIUM);
			g_play_button_text.set_text("PLAY");
			g_play_button_text.update_pos(screen_width + 200, screen_height*0.5);

			g_tut_button_text = new TextClass(Types.Layer.GAME_MENU);
			g_tut_button_text.set_font(Types.Fonts.MEDIUM);
			g_tut_button_text.set_text(g_texts[language]["Tutorial"]);
			g_tut_button_text.update_pos(screen_width - 200, screen_height*0.5);

			g_game_name_text = new TextClass(Types.Layer.GAME_MENU);
			g_game_name_text.set_font(Types.Fonts.MEDIUM);
			g_game_name_text.set_text(g_texts[language]["Title"]);
			g_game_name_text.update_pos(screen_width*0.5, -999, screen_width, 999);
			g_game_name_text.center_x(screen_width*0.5);
		
			g_menu_title_box = new SquareClass();
			g_menu_title_box.setup(Types.Layer.GAME_MENU);
			g_menu_title_box.colour = 0xffffff;
			g_menu_title_box.update_pos(screen_width*0.5 - 200, 120, 400, 64);
			
			g_menu_bomb_sprite_shadow = new SpriteClass();
			g_menu_bomb_sprite_shadow.setup_sprite("bomb_shadow.png",Types.Layer.GAME_MENU);

			g_menu_bomb_sprite = new SpriteClass();
			g_menu_bomb_sprite.setup_sprite("bomb.png",Types.Layer.GAME_MENU);

			g_menu_fire_sprite_shadow = new SpriteClass();
			g_menu_fire_sprite_shadow.setup_sprite("fire_shadow.png",Types.Layer.GAME_MENU);

			g_menu_fire_sprite = new SpriteClass();
			g_menu_fire_sprite.setup_sprite("fire.png",Types.Layer.GAME_MENU);

			g_menu_plus_sprite = new SpriteClass();
			g_menu_plus_sprite.setup_sprite("plus.png",Types.Layer.GAME_MENU);
		}

		this.tut_actual_x = -200;
		this.play_actual_x = screen_width + 200;
		this.title_actual_y = - 200;


		this.screen_resized();

		
	},

	screen_resized: function () {

		this.tut_x = 0.25*game_screen_width*0.5;
		this.play_x = 0.75*game_screen_width*0.5;

		//g_game_name_text.update_pos(screen_width*0.5, 42, screen_width, 999);
		//g_game_name_text.center_x(screen_width*0.5);

		//g_menu_title_box.update_pos(screen_width*0.5 - 150, 160 + 20, 300, 64 + 10);

		g_menu_title_box.update_pos(screen_width*0.5 - 150, 145, 300, 1);

		g_menu_bomb_sprite_shadow.update_pos(screen_width*0.5 + 80 + 6, 215 + 6);
		g_menu_bomb_sprite.update_pos(screen_width*0.5 + 80, 215);

		g_menu_fire_sprite_shadow.update_pos(screen_width*0.5 - 80 + 6, 215 + 6);
		g_menu_fire_sprite.update_pos(screen_width*0.5 - 80, 215);

		g_menu_plus_sprite.update_pos(screen_width*0.5, 215);

		this.play_state.screen_resized();

	},

	handle_mouse_up: function(engine,x,y) {

		x = mouse.x;
		y = mouse.y;

		if (y < screen_height*0.66 -64 ||
		    y > screen_height*0.66 + 64) return;

		if (x > this.tut_x - 64 &&
		    x < this.tut_x + 64) {
			this.change_state(this.engine, new TutStateClass(this.engine, this.play_state));
			
		} else if (x > this.play_x - 64 &&
		    	   x < this.play_x + 64) {

			//this.change_state(this.engine, new StartGameStateClass(this.engine, this.play_state));
			
			//LoadingLevelStateClass	
		}
	},

	update: function() { 
		this.play_state.update();

		if (this.timer > 0) this.timer--;
		else {
			this.tut_actual_x = this.tut_actual_x + (this.tut_x - this.tut_actual_x)*0.1;
			this.play_actual_x = this.play_actual_x + (this.play_x - this.play_actual_x)*0.1;

			//g_game_name_text.update_pos(screen_width*0.5, 42, screen_width, 999);
			//g_game_name_text.center_x(screen_width*0.5);

			this.title_actual_y = this.title_actual_y + (42 - this.title_actual_y)*0.1;
		}
	},

	draw: function() {
		this.play_state.draw();

		g_play_button_sprite.update_pos(this.play_actual_x,screen_height*0.66);
		g_tut_button_sprite.update_pos(this.tut_actual_x,screen_height*0.66);

		g_play_button_text.update_pos(this.play_actual_x,screen_height*0.66 + 32);
		g_play_button_text.center_x(this.play_actual_x);
		g_tut_button_text.update_pos(this.tut_actual_x,screen_height*0.66 + 32);
		g_tut_button_text.center_x(this.tut_actual_x);

		g_game_name_text.update_pos(screen_width*0.5, this.title_actual_y, screen_width, 999);
		g_game_name_text.center_x(screen_width*0.5);
	},

	cleanup: function() {
		g_play_button_sprite.update_pos(-999,-999);
		g_tut_button_sprite.update_pos(-999,-999);
		g_play_button_text.update_pos(-999,-999);
		g_tut_button_text.update_pos(-999,-999);
		g_game_name_text.update_pos(-999,-999);

		g_menu_fire_sprite.update_pos(-999,-999);
		g_menu_fire_sprite_shadow.update_pos(-999,-999);

		g_menu_bomb_sprite.update_pos(-999,-999);
		g_menu_bomb_sprite_shadow.update_pos(-999,-999);

		g_menu_plus_sprite.update_pos(-999,-999);

		g_menu_title_box.hide();
	}
});

g_toggle_right_to_flag = null;
g_toggle_hold_to_flag = null;
g_toggle_mark_first = null;

g_text_right_to_flag = null;
g_text_hold_to_flag = null;
g_text_mark_first = null;

g_setup_input_text = null;

g_setup_input_play = null;

already_setup_input = false;

SetupInputStateClass = GameStateClass.extend({
	play_state: null,
	engine: null,

	init: function(engine, play_state){
		this.play_state = play_state;
		this.engine = engine;

		already_setup_input = true;

		if (g_toggle_right_to_flag == null) {

			g_setup_input_text = new TextClass(Types.Layer.GAME_MENU);
			g_setup_input_text.set_font(Types.Fonts.SMALL);
			g_setup_input_text.set_text("CHANGE CONTROL SCHEME?\n(YOU CAN CHANGE THIS LATER FROM THE BOTTOM MENU)");

			g_toggle_right_to_flag = new ToggleClass();
			g_toggle_right_to_flag.setup_sprite("redflag.png",Types.Layer.GAME_MENU);

			g_text_right_to_flag = new TextClass(Types.Layer.GAME_MENU);
			g_text_right_to_flag.set_font(Types.Fonts.XSMALL);
			g_text_right_to_flag.set_text(g_get_text("right_long"));

			g_toggle_hold_to_flag = new ToggleClass();
			g_toggle_hold_to_flag.setup_sprite("redflag.png",Types.Layer.GAME_MENU);

			g_text_hold_to_flag = new TextClass(Types.Layer.GAME_MENU);
			g_text_hold_to_flag.set_font(Types.Fonts.XSMALL);
			g_text_hold_to_flag.set_text(g_get_text("hold_long"));

			g_toggle_mark_first = new ToggleClass();
			g_toggle_mark_first.setup_sprite("redflag.png",Types.Layer.GAME_MENU);

			

			g_text_mark_first = new TextClass(Types.Layer.GAME_MENU);
			g_text_mark_first.set_font(Types.Fonts.XSMALL);
			g_text_mark_first.set_text(g_get_text("mark_long"));



			g_setup_input_play = new ButtonClass();
			g_setup_input_play.setup_sprite("play_icon.png",Types.Layer.GAME_MENU);

		}

		if (g_click_to_dig == false ) {
			g_toggle_right_to_flag.toggle();
			g_toggle_hold_to_flag.toggle();
		} else if (g_hold_to_flag == true) {
			g_toggle_right_to_flag.toggle();
 			g_toggle_mark_first.toggle();
		} else {
			g_toggle_hold_to_flag.toggle();	
			g_toggle_mark_first.toggle();
		}
	
		this.screen_resized();

	},

	mark_x: 0,
	mark_y: 0,

	hold_x: 0,
	hold_y: 0,

	right_x: 0,
	right_y: 0,

	play_x: 0,
	play_y: 0,

	screen_resized: function () {

		g_setup_input_text.update_pos(32,32);

		this.mark_x = 32;
		this.mark_y = 3*64;

		this.hold_x =  32;
		this.hold_y =  4*64;

		this.right_x =  32;
		this.right_y =  5*64;

	

		this.play_x = screen_width - 64;
		this.play_y = screen_height - 64;

		g_toggle_mark_first.update_pos(this.mark_x, this.mark_y);
		g_toggle_hold_to_flag.update_pos(this.hold_x, this.hold_y);
		g_toggle_right_to_flag.update_pos(this.right_x, this.right_y);

		g_text_right_to_flag.update_pos(this.right_x + 64, this.right_y);
		g_text_hold_to_flag.update_pos(this.hold_x + 64, this.hold_y);
		g_text_mark_first.update_pos(this.mark_x + 64, this.mark_y);

		g_setup_input_play.update_pos(this.play_x, this.play_y);

	},

	cleanup: function() {
		g_toggle_right_to_flag.hide();
		g_toggle_hold_to_flag.hide();
		g_toggle_mark_first.hide();

		g_setup_input_text.update_pos(-999,-999);

		g_text_right_to_flag.update_pos(-999,-999);
		g_text_hold_to_flag.update_pos(-999,-999);
		g_text_mark_first.update_pos(-999,-999);

		g_setup_input_play.hide();
		

		if (g_toggle_right_to_flag.toggled == true) {
			g_hold_to_flag = false;
			g_click_to_dig = true;
		} else if (g_toggle_hold_to_flag.toggled == true) {
			g_hold_to_flag = true;
			g_click_to_dig = true;		
		} else if (g_toggle_mark_first.toggled == true) {
			g_click_to_dig = false;
		}
	},

	handle_mouse_up: function(engine,x,y) {

		
	
		if (mouse.x > this.hold_x - 19 &&
		    mouse.x < this.hold_x + 19 &&
		    mouse.y > this.hold_y - 19 &&
		    mouse.y < this.hold_y + 19) {
			g_toggle_hold_to_flag.toggle();

			if (g_toggle_mark_first.toggled == 1) g_toggle_mark_first.toggle();
			if (g_toggle_right_to_flag.toggled== 1) g_toggle_right_to_flag.toggle();
			
		} else if (mouse.x > this.mark_x - 19 &&
		    	mouse.x < this.mark_x + 19 &&
		    	mouse.y > this.mark_y - 19 &&
		    	mouse.y < this.mark_y + 19) {

			g_toggle_mark_first.toggle();

			if (g_toggle_right_to_flag.toggled== 1) g_toggle_right_to_flag.toggle();
			if (g_toggle_hold_to_flag.toggled== 1) g_toggle_hold_to_flag.toggle();
			
		} else if (mouse.x > this.right_x - 19 &&
		    	mouse.x < this.right_x + 19 &&
		    	mouse.y > this.right_y - 19 &&
		    	mouse.y < this.right_y + 19) {

			g_toggle_right_to_flag.toggle();

			if (g_toggle_mark_first.toggled== 1) g_toggle_mark_first.toggle();
			if (g_toggle_hold_to_flag.toggled== 1) g_toggle_hold_to_flag.toggle();
			
		} else if (mouse.x > this.play_x - 19 &&
		    	mouse.x < this.play_x + 19 &&
		    	mouse.y > this.play_y - 19 &&
		    	mouse.y < this.play_y + 19) {
				//this.play_state.current_level = 7;
				//this.play_state.first_tile_safe = true;
				this.change_state(this.engine, new StartGameStateClass(this.engine, this.play_state));
			
		}

	}
});

challenge_select_header = null;
challenge_select_subheader = null;

challenge_select_easy_button = null;
challenge_select_med_button = null;
challenge_select_hard_button = null;
challenge_select_nosmiley_button = null;

challenge_select_easy_text = null;
challenge_select_med_text = null;
challenge_select_hard_text = null;
challenge_select_nosmiley_text = null;

ChallengeLevelsSelectHardness = GameStateClass.extend({
	play_state: null,
	engine: null,

	init: function(engine, play_state) {
		this.play_state = play_state;
		this.engine = engine;
	
		play_screen_container.hide();//;
		background_container.hide();//;		

		if (challenge_select_header == null) {
			challenge_select_header = new TextClass(Types.Layer.GAME_MENU);
			challenge_select_header.set_font(Types.Fonts.SMALL);
			challenge_select_header.set_text("CHALLENGE LEVELS\n");

			challenge_select_subheader = new TextClass(Types.Layer.GAME_MENU);
			challenge_select_subheader.set_font(Types.Fonts.XSMALL);
			challenge_select_subheader.set_text("NO FEEDFACK ON MISTAKES\nMORE COLOURED PICTURES");

			challenge_select_easy_text = new TextClass(Types.Layer.GAME_MENU);
			challenge_select_easy_text.set_font(Types.Fonts.SMALL);
			challenge_select_easy_text.set_text("RELAXING");
			
			challenge_select_med_text = new TextClass(Types.Layer.GAME_MENU);
			challenge_select_med_text.set_font(Types.Fonts.SMALL);
			challenge_select_med_text.set_text("MEDIUM");

			challenge_select_nosmiley_text = new TextClass(Types.Layer.GAME_MENU);
			challenge_select_nosmiley_text.set_font(Types.Fonts.SMALL);
			challenge_select_nosmiley_text.set_text("NO SMILEY");

			challenge_select_hard_text = new TextClass(Types.Layer.GAME_MENU);
			challenge_select_hard_text.set_font(Types.Fonts.SMALL);

			if (using_cocoon_js == true) challenge_select_hard_text.set_text("HARD");
			else challenge_select_hard_text.set_text("ALL CLUES\n(APP ONLY)");

			challenge_select_easy_button = new SpriteClass();
			challenge_select_easy_button.setup_sprite("heart_pix.png",Types.Layer.GAME_MENU);

			challenge_select_med_button = new SpriteClass();
			challenge_select_med_button.setup_sprite("rainbowstartrim.png",Types.Layer.GAME_MENU);

			challenge_select_hard_button = new SpriteClass();
			challenge_select_hard_button.setup_sprite("cherry.png",Types.Layer.GAME_MENU);

			challenge_select_nosmiley_button = new SpriteClass();
			challenge_select_nosmiley_button.setup_sprite("heart_pix.png",Types.Layer.GAME_MENU);
		}

		//challenge_select_header.make_vis();
		//challenge_select_easy_text.make_vis();
		//challenge_select_med_text.make_vis();
		//challenge_select_hard_text.make_vis();
		challenge_select_easy_button.make_vis();
		challenge_select_med_button.make_vis();
		challenge_select_hard_button.make_vis();
		challenge_select_nosmiley_button.make_vis();

		this.screen_resized();
	},

	cleanup : function () {
		challenge_select_subheader.update_pos(-999,-999);
		challenge_select_header.update_pos(-999,-999);
		challenge_select_easy_text.update_pos(-999,-999);
		challenge_select_med_text.update_pos(-999,-999);
		challenge_select_hard_text.update_pos(-999,-999);
		challenge_select_nosmiley_text.update_pos(-999,-999);
		challenge_select_easy_button.hide();
		challenge_select_med_button.hide();
		challenge_select_hard_button.hide();
		challenge_select_nosmiley_button.hide();
	},

	easy_x: 0,
	easy_y: 0,
	med_x: 0,
	med_y: 0,
	hard_x: 0,
	hard_y: 0,
	nosmiley_x: 0,
	nosmiley_y: 0,

	screen_resized: function() {
		challenge_select_header.update_pos(16,16);
		challenge_select_subheader.update_pos(16,16 + 32);
		if (screen_width > screen_height) {
			this.easy_x = screen_width*0.25;
			this.med_x = screen_width*0.5;
			this.hard_x = screen_width*0.75;
			this.easy_y = screen_height*0.5;
			this.med_y = screen_height*0.5;
			this.hard_y = screen_height*0.5;

			this.nosmiley_x =  screen_width*0.5;
			this.nosmiley_y = screen_height*0.75;
		} else {
			this.easy_x = screen_width*0.25;
			this.med_x = screen_width*0.25;

			this.hard_x = screen_width*0.25;
			this.easy_y = screen_height*0.25;

			this.med_y = screen_height*0.5;
			this.hard_y = screen_height*0.75;

			this.nosmiley_x =  screen_width*0.75;
			this.nosmiley_y = screen_height*0.25;
		}

		challenge_select_easy_text.update_pos(this.easy_x, this.easy_y + 32);
		challenge_select_med_text.update_pos(this.med_x, this.med_y + 32);
		challenge_select_hard_text.update_pos(this.hard_x, this.hard_y + 32);
		challenge_select_nosmiley_text.update_pos(this.nosmiley_x, this.nosmiley_y + 32);

		challenge_select_easy_text.center_x(this.easy_x);
		challenge_select_med_text.center_x(this.med_x);
		challenge_select_hard_text.center_x(this.hard_x);
		challenge_select_hard_text.center_x(this.hard_x);
		challenge_select_nosmiley_text.center_x(this.nosmiley_x);

		challenge_select_easy_button.update_pos(this.easy_x, this.easy_y);
		challenge_select_med_button.update_pos(this.med_x, this.med_y);
		challenge_select_hard_button.update_pos(this.hard_x, this.hard_y);
		challenge_select_nosmiley_button.update_pos(this.nosmiley_x, this.nosmiley_y);
	},

	handle_mouse_up: function(engine,x,y) {

		
	
		if (mouse.x > this.easy_x - 19 &&
		    mouse.x < this.easy_x + 19 &&
		    mouse.y > this.easy_y - 19 &&
		    mouse.y < this.easy_y + 19) {
			this.play_state.challenge_level_hardness = 1;
			this.play_state.game_mode = 6;
			this.change_state(this.engine, new OverworldStateClass(this.engine, this.play_state));
			
		} else if (mouse.x > this.med_x - 19 &&
		    mouse.x < this.med_x + 19 &&
		    mouse.y > this.med_y - 19 &&
		    mouse.y < this.med_y + 19) {
			this.play_state.challenge_level_hardness = 2;
			this.play_state.game_mode = 6;
			this.change_state(this.engine, new OverworldStateClass(this.engine, this.play_state));
			
		} else if (mouse.x > this.hard_x - 19 &&
		    	mouse.x < this.hard_x + 19 &&
		    	mouse.y > this.hard_y - 19 &&
		    	mouse.y < this.hard_y + 19) { // && using_cocoon_js == true) {
				this.play_state.challenge_level_hardness = 3;
				this.play_state.game_mode = 6;
				this.change_state(this.engine, new OverworldStateClass(this.engine, this.play_state));
			
		} else if (mouse.x > this.nosmiley_x - 19 &&
		    	mouse.x < this.nosmiley_x + 19 &&
		    	mouse.y > this.nosmiley_y - 19 &&
		    	mouse.y < this.nosmiley_y + 19) { // && using_cocoon_js == true) {
				this.play_state.challenge_level_hardness = 4;
				this.play_state.game_mode = 6;
				this.change_state(this.engine, new OverworldStateClass(this.engine, this.play_state));
			
		} 


	}

	
});

ChallengeLevelsOverworld = GameStateClass.extend({
	play_state: null,
	engine: null,

	init: function(engine, play_state) {
		this.play_state = play_state;
		this.engine = engine;

	}
});


g_toggle_hand= null;
g_toggle_heart= null;
g_toggle_eye= null;
g_toggle_8hand= null;
g_toggle_plus= null;
g_toggle_join= null;
g_toggle_compass= null;
g_toggle_crown= null;
g_toggle_eyebracket= null;
g_toggle_share= null;
g_toggle_zap= null;
g_toggle_timer= null;
g_toggle_wall= null;

g_setuprand_play = null;

g_setuprand_title = null;
g_setuprand_subtitle = null;
g_setuprand_subtitle2 = null;

g_setuprand_text_levelshape = null;
g_setuprand_levelshape = 0;

SetupRandStateClass = GameStateClass.extend({

	play_state: null,
	engine: null,

	

	init: function(engine, play_state){
		this.play_state = play_state;
		this.engine = engine;

		play_screen_container.hide();//;


		if (g_toggle_eye == null) {
			g_toggle_eye = new MultiToggleClass();
			g_toggle_eye.setup_sprite("eye.png",Types.Layer.GAME_MENU);

			g_toggle_share = new MultiToggleClass();
			g_toggle_share.setup_sprite("sharetut.png",Types.Layer.GAME_MENU);

			g_toggle_hand = new MultiToggleClass();
			g_toggle_hand.setup_sprite("hand.png",Types.Layer.GAME_MENU);

			g_toggle_8hand = new MultiToggleClass();
			g_toggle_8hand.setup_sprite("8hand.png",Types.Layer.GAME_MENU);

			g_toggle_plus = new MultiToggleClass();
			g_toggle_plus.setup_sprite("eyeplustouch.png",Types.Layer.GAME_MENU);

			g_toggle_join = new MultiToggleClass();
			g_toggle_join.setup_sprite("join_tut.png",Types.Layer.GAME_MENU);

			g_toggle_heart = new MultiToggleClass();
			g_toggle_heart.setup_sprite("heart.png",Types.Layer.GAME_MENU);

			g_toggle_compass = new MultiToggleClass();
			g_toggle_compass.setup_sprite("compass.png",Types.Layer.GAME_MENU);

			g_toggle_crown = new MultiToggleClass();
			g_toggle_crown.setup_sprite("crown.png",Types.Layer.GAME_MENU);

			g_toggle_eyebracket = new MultiToggleClass();
			g_toggle_eyebracket.setup_sprite("eyebracket.png",Types.Layer.GAME_MENU);

			g_toggle_zap = new MultiToggleClass();
			g_toggle_zap.setup_sprite("zap.png",Types.Layer.GAME_MENU);

			g_toggle_wall = new MultiToggleClass();
			g_toggle_wall.setup_sprite("block0.png",Types.Layer.GAME_MENU);

			g_toggle_timer = new MultiToggleClass();
			g_toggle_timer.setup_sprite("timer.png",Types.Layer.GAME_MENU);
			g_toggle_timer.toggle();
			g_toggle_timer.toggle();

			g_setuprand_play = new ButtonClass();
			g_setuprand_play.setup_sprite("play_icon.png",Types.Layer.GAME_MENU);

			g_setuprand_title = new TextClass(Types.Layer.GAME_MENU);
			g_setuprand_title.set_font(Types.Fonts.MEDIUM);
			g_setuprand_title.set_text("MINES++");

			g_setuprand_subtitle = new TextClass(Types.Layer.GAME_MENU);
			g_setuprand_subtitle.set_font(Types.Fonts.XSMALL);
			g_setuprand_subtitle.set_text("CHOOSE YOUR CLUES\n(THIS MODE IS AUTO-GENERATED \nAND MAY REQUIRE GUESSING)");

			g_setuprand_text_levelshape = new TextClass(Types.Layer.GAME_MENU);
			g_setuprand_text_levelshape.set_font(Types.Fonts.SMALL);
			g_setuprand_text_levelshape.set_text("TYPE: SCATTERED");	

		}
	
		g_setuprand_play.make_vis();
		this.screen_resized();

	},

	cleanup: function() {
		g_toggle_eye.hide();
		g_toggle_hand.hide();
		g_toggle_8hand.hide();
		g_toggle_plus.hide();
		g_toggle_join.hide();
		g_toggle_heart.hide();
		g_toggle_share.hide();
		g_toggle_compass.hide();
		g_toggle_crown.hide();
		g_setuprand_play.hide();
		g_toggle_eyebracket.hide();
		g_toggle_zap.hide();
		g_toggle_timer.hide();
		g_toggle_wall.hide();

		g_setuprand_title.update_pos(-999,-999);
		g_setuprand_subtitle.update_pos(-999,-999);

		g_setuprand_text_levelshape.update_pos(-999,-999);

		play_screen_container.make_vis();//;
		
	},

	eye_x: 0,
	eye_y: 0,

	eyebracket_x: 0,
	eyebracket_y: 0,

	hand_x: 0,
	hand_y: 0,

	share_x: 0,
	share_y: 0,

	eighthand_x: 0,
	eighthand_y: 0,

	plus_x: 0,
	plus_y: 0,

	join_x: 0,
	join_y: 0,
	
	heart_x: 0,
	heart_y: 0,

	compass_x: 0,
	compass_y: 0,

	crown_x: 0,
	crown_y: 0,

	zap_x: 0,
	zap_y: 0,

	timer_x: 0,
	timer_y: 0,

	wall_x: 0,
	wall_y: 0,


	play_x: 0,
	play_y: 0,
	
	leveltype_x: 0,
	leveltype_y: 0,

	screen_resized: function () {

		g_setuprand_title.update_pos(32,32);
		g_setuprand_subtitle.update_pos(32,64);

		this.eye_x = screen_width*0.25;
		this.eye_y = 3*52;

		this.hand_x =  screen_width*0.25;
		this.hand_y =  4*52;

		this.eighthand_x =  screen_width*0.5;
		this.eighthand_y = 4*52;

		this.plus_x =  -999;//screen_width*0.5;
		this.plus_y =  -999;//5*64;

		this.join_x =  screen_width*0.25;
		this.join_y = 5*52;

		this.heart_x =  screen_width*0.25;
		this.heart_y =  6*52;

		this.compass_x =  screen_width*0.75;
		this.compass_y =  3*52;

		this.crown_x =  screen_width*0.75;
		this.crown_y =  4*52;

		this.eyebracket_x =  screen_width*0.75;
		this.eyebracket_y =  5*52;

		this.share_x = screen_width*0.75;
		this.share_y = 6*52;

		this.zap_x = screen_width*0.5;
		this.zap_y = 3*52;

		this.timer_x = screen_width*0.5;
		this.timer_y = 5*52;

		this.wall_x = screen_width*0.5;
		this.wall_y = 6*52;


		this.play_x = screen_width - 64;
		this.play_y = screen_height - 64;

		this.leveltype_x = screen_width*0.25;
		this.leveltype_y = 7*52;

		g_toggle_eye.update_pos(this.eye_x, this.eye_y);
		g_toggle_hand.update_pos(this.hand_x, this.hand_y);
		g_toggle_8hand.update_pos(this.eighthand_x, this.eighthand_y);
		g_toggle_plus.update_pos(this.plus_x, this.plus_y);
		g_toggle_join.update_pos(this.join_x, this.join_y);
		g_toggle_heart.update_pos(this.heart_x, this.heart_y);
		g_toggle_crown.update_pos(this.crown_x, this.crown_y);
		g_toggle_compass.update_pos(this.compass_x, this.compass_y);
		g_toggle_eyebracket.update_pos(this.eyebracket_x, this.eyebracket_y);
		g_toggle_share.update_pos(this.share_x, this.share_y);
		g_toggle_zap.update_pos(this.zap_x, this.zap_y);
		g_toggle_timer.update_pos(this.timer_x, this.timer_y);
		g_toggle_wall.update_pos(this.wall_x, this.wall_y);

		g_setuprand_text_levelshape.update_pos(this.leveltype_x, this.leveltype_y);

		g_setuprand_play.update_pos(this.play_x, this.play_y);

	},

	handle_mouse_up: function(engine,x,y) {

		
	
		if (mouse.x > this.eye_x - 19 &&
		    mouse.x < this.eye_x + 19 &&
		    mouse.y > this.eye_y - 19 &&
		    mouse.y < this.eye_y + 19) {
			g_toggle_eye.toggle();
			
		} else if (mouse.x > this.hand_x - 19 &&
		    	mouse.x < this.hand_x + 19 &&
		    	mouse.y > this.hand_y - 19 &&
		    	mouse.y < this.hand_y + 19) {
				g_toggle_hand.toggle();
			
		} else if (mouse.x > this.eighthand_x - 19 &&
		    	mouse.x < this.eighthand_x + 19 &&
		    	mouse.y > this.eighthand_y - 19 &&
		    	mouse.y < this.eighthand_y + 19) {
				g_toggle_8hand.toggle();
			
		} else if (mouse.x > this.plus_x - 19 &&
		    	mouse.x < this.plus_x + 19 &&
		    	mouse.y > this.plus_y - 19 &&
		    	mouse.y < this.plus_y + 19) {
				g_toggle_plus.toggle();
			
		} else if (mouse.x > this.join_x - 19 &&
		    	mouse.x < this.join_x + 19 &&
		    	mouse.y > this.join_y - 19 &&
		    	mouse.y < this.join_y + 19) {
				g_toggle_join.toggle();
			
		} else if (mouse.x > this.crown_x - 19 &&
		    	mouse.x < this.crown_x + 19 &&
		    	mouse.y > this.crown_y - 19 &&
		    	mouse.y < this.crown_y + 19) {
				g_toggle_crown.toggle();
			
		} else if (mouse.x > this.compass_x - 19 &&
		    	mouse.x < this.compass_x + 19 &&
		    	mouse.y > this.compass_y - 19 &&
		    	mouse.y < this.compass_y + 19) {
				g_toggle_compass.toggle();
			
		} else if (mouse.x > this.heart_x - 19 &&
		    	mouse.x < this.heart_x + 19 &&
		    	mouse.y > this.heart_y - 19 &&
		    	mouse.y < this.heart_y + 19) {
				g_toggle_heart.toggle();
			
		} else if (mouse.x > this.eyebracket_x - 19 &&
		    	mouse.x < this.eyebracket_x + 19 &&
		    	mouse.y > this.eyebracket_y - 19 &&
		    	mouse.y < this.eyebracket_y + 19) {
				g_toggle_eyebracket.toggle();
			
		} else if (mouse.x > this.share_x - 19 &&
		    	mouse.x < this.share_x + 19 &&
		    	mouse.y > this.share_y - 19 &&
		    	mouse.y < this.share_y + 19) {
				g_toggle_share.toggle();
			
		} else if (mouse.x > this.wall_x - 19 &&
		    	mouse.x < this.wall_x + 19 &&
		    	mouse.y > this.wall_y - 19 &&
		    	mouse.y < this.wall_y + 19) {
				g_toggle_wall.toggle();
			
		} else if (mouse.x > this.zap_x - 19 &&
		    	mouse.x < this.zap_x + 19 &&
		    	mouse.y > this.zap_y - 19 &&
		    	mouse.y < this.zap_y + 19) {
				g_toggle_zap.toggle();
			
		} else if (mouse.x > this.timer_x - 19 &&
		    	mouse.x < this.timer_x + 19 &&
		    	mouse.y > this.timer_y - 19 &&
		    	mouse.y < this.timer_y + 19) {
				g_toggle_timer.toggle();
			
		} else if (mouse.x > this.play_x - 19 &&
		    	mouse.x < this.play_x + 19 &&
		    	mouse.y > this.play_y - 19 &&
		    	mouse.y < this.play_y + 19) {
				this.play_state.current_level = 7;
				this.play_state.first_tile_safe = true;
				this.change_state(this.engine, new GenerateRandStateClass(this.engine, this.play_state));
			
		} else if (mouse.x > this.leveltype_x - 19 &&
		    	mouse.x < this.leveltype_x + 164 &&
		    	mouse.y > this.leveltype_y - 19 &&
		    	mouse.y < this.leveltype_y + 19) {
				g_setuprand_levelshape++;
				if (g_setuprand_levelshape == 2) g_setuprand_levelshape = 0;
			
		}

		if (g_setuprand_levelshape == 0) {
			g_setuprand_text_levelshape.change_text("TYPE: SCATTERED");
		} else if (g_setuprand_levelshape == 1) {
			g_setuprand_text_levelshape.change_text("TYPE: CROSS-GRID");
		} else if (g_setuprand_levelshape == 2) {
			g_setuprand_text_levelshape.change_text("TYPE: CAMPAIGN LEVEL BUT REARRANGED");
		} else if (g_setuprand_levelshape == 3) {
			g_setuprand_text_levelshape.change_text("TYPE: CHECKERBOARD");
		} 

	}

});

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

g_reusable_text = null;
beg_yes_button = null;
beg_yes_text = null;
beg_no_button = null;
beg_no_text = null;
beg_text = null;
g_seen_beg = 0;

p_beg_smiley_level = [[0,4,4,3,5,4,4,4],
[4,9,9,17,17,35,29,1],
[4,29,30,16,30,2,16,9],
[4,17,17,9,2,1,2,33],
[3,30,30,17,33,16,16,17],
[4,30,10,17,30,17,29,2],
[5,9,16,10,9,9,16,34],
[3,10,29,17,35,17,32,34]];
p_beg_smiley_colour = [3,3,3,3,3,3,3,3,3,
3,3,3,3,3,3,3
,3,3,3,3,2,3,3,3,3,3,3,2,3,3,3,3,3,3,2,3,3,3,3,3,2,3,3,3,2,2,2,3,3];

BegForRatingState = GameStateClass.extend({
	play_state: null,
   	engine: null,

	init: function(engine, play_state) {

		this.engine = engine;
		this.play_state = play_state;

		play_screen_container.make_vis();
		play_screen_container.set_x(0);

		if (g_reusable_text == null) {

		}

		if (beg_yes_button == null) {
			beg_yes_button = new SpriteClass();
			beg_yes_button.setup_sprite('heart.png',Types.Layer.GAME_MENU);

			beg_no_button = new SpriteClass();
			beg_no_button.setup_sprite('rightarrow.png',Types.Layer.GAME_MENU);

			
			beg_yes_text = new TextClass(Types.Layer.GAME_MENU);
			beg_yes_text.set_font(Types.Fonts.XSMALL);
			beg_yes_text.set_text("GO TO STORE PAGE:");

			beg_no_text = new TextClass(Types.Layer.GAME_MENU);
			beg_no_text.set_font(Types.Fonts.XSMALL);
			beg_no_text.set_text("CONTINUE:");

			beg_text = new TextClass(Types.Layer.GAME_MENU);
			beg_text.set_font(Types.Fonts.XSMALL);
			beg_text.set_text("Thanks for playing my game!!\nIf you could rate and/or review\nthat would help me to keep making games like this");
		}

		//g_reusable_text

		//console.log('BegForRating');

		beg_yes_button.make_vis();
		beg_no_button.make_vis();
		
		beg_yes_text.make_vis();
		beg_no_text.make_vis();

		beg_text.make_vis();

		background_group.make_vis();
		play_screen_group.make_vis();

		// load our beg picture - smiley - from somewhere...
		// maybe a certain level with dual use as a picture here
		var mapdata_version_mines = 1;
		this.play_state.load_level_internal(p_beg_smiley_level, mapdata_version_mines);

		var colour_i = 0;

		// make it all 'solved' and coloured in:
		for (var x = 0; x < this.play_state.level_w; x++) {
			for (var y = 0; y < this.play_state.level_h; y++) {
				// start with solved puzzle
				this.play_state.blocks[this.play_state.tiles[x][y]].symbol_type = 0;
				this.play_state.blocks[this.play_state.tiles[x][y]].mine_multi = 1;
				if (this.play_state.blocks[this.play_state.tiles[x][y]].block_type == 2) {
					var c = p_beg_smiley_colour[colour_i];
					this.play_state.blocks[this.play_state.tiles[x][y]].put_flag_on();
					this.play_state.blocks[this.play_state.tiles[x][y]].colour_mode = true;
					this.play_state.blocks[this.play_state.tiles[x][y]].secret_colour = c;	// from somewhere
				} else {
					this.play_state.blocks[this.play_state.tiles[x][y]].put_flag_on();
				}
				this.play_state.blocks[this.play_state.tiles[x][y]].calc_sprite();
				colour_i++;
			} // for y
		} // for x

		this.play_state.calc_sequence_lengths();
		this.play_state.calc_edge_nonogram();
		this.play_state.resize();	// after calc edges - need to know sizes

		// hacky - zoom out a little bit more
		g_level_size += 5;		// controls zoom
		//g_level_w++;		// controls centering
		do_resize();

		// is this needed??
		for (var x = 0; x < this.play_state.grid_w; x++) {
			for (var y = 0; y < this.play_state.grid_h; y++) {
				
				if (x < this.play_state.level_w &&
				    y < this.play_state.level_h) {
					this.play_state.blocks[this.play_state.tiles[x][y]].make_vis();
				} else {
					this.play_state.blocks[this.play_state.tiles[x][y]].hide();
				}
			}
		}

		g_seen_beg++;

		//console.log('BegForRating set up > this.play_state.level_w ' + this.play_state.level_w);

		this.screen_resized();

	},

	yes_x: 0,
	yes_y: 0,
	no_x: 0,
	no_y: 0,
	clicked_yes: false,
	mouse_down: false,

	handle_mouse_up: function(engine,x,y) {
		this.mouse_down = false;

		if (mouse.x > this.yes_x - 16 &&
		    mouse.x < this.yes_x + 16 &&
		    mouse.y > this.yes_y - 16 &&
		    mouse.y < this.yes_y + 16) {
			if (this.clicked_yes == true) return;
			this.clicked_yes = true;
			open_url("https://play.google.com/store/apps/details?id=com.zblip.pixoji");
			g_seen_beg += 99;
			return;
		} 

		if (mouse.x > this.no_x - 16 &&
		    mouse.x < this.no_x + 16 &&
		    mouse.y > this.no_y - 16 &&
		    mouse.y < this.no_y + 16) {
			this.goto_next_gamestate();
		}
	},

	handle_mouse_down: function(engine,x,y) {

		//console.log(x + ' ' + y);

		if (this.mouse_down == true) return;
		this.mouse_down = true;

		if (mouse.x > this.yes_x - 16 &&
		    mouse.x < this.yes_x + 16 &&
		    mouse.y > this.yes_y - 16 &&
		    mouse.y < this.yes_y + 16) {
			if (this.clicked_yes == true) return;
			this.clicked_yes = true;
			open_url("https://play.google.com/store/apps/details?id=com.zblip.pixoji");
			g_seen_beg += 99;
			return;
		} 

		
		if (mouse.x > this.no_x - 16 &&
		    mouse.x < this.no_x + 16 &&
		    mouse.y > this.no_y - 16 &&
		    mouse.y < this.no_y + 16) {
			this.goto_next_gamestate();
		}

	},

	goto_next_gamestate: function() {

		// to avoid repetition
		// this.play_state.goto_next_gamestate

		//this.play_state.reset();

		if (this.play_state.game_mode == 1) {
			////console.log("goto_next_gamestate new GenerateRandStateClass");
			this.change_state(this.engine, new GenerateRandStateClass(this.engine, this.play_state));
		} else if (this.play_state.game_mode == 5) {
			////console.log("goto_next_gamestate new GenerateRandStateClass");
			this.change_state(this.engine, new InstructionStateClass(this.engine, this.play_state));
		} else {
			////console.log("goto_next_gamestate new StartGameStateClass");
			this.change_state(this.engine, new RestartGameStateClass(this.engine, this.play_state));
		}
	},

	cleanup: function () {

		
		
		// g_reusable_text.hide();
		beg_yes_button.hide();
		beg_no_button.hide();

		beg_yes_text.hide();
		beg_no_text.hide();

		beg_text.hide();

		background_group.make_vis();
		play_screen_group.make_vis();

	},

	screen_resized: function () {
		this.play_state.screen_resized();
		if (screen_width < screen_height) {
			
			
		} else {

		}
		this.yes_x = screen_width - 32;
		this.yes_y = screen_height - 64  - 16;

		this.no_x = screen_width - 32;
		this.no_y = screen_height - 32;

		beg_yes_button.update_pos(this.yes_x, this.yes_y);
		beg_yes_text.update_pos(this.yes_x - 128  - 64, this.yes_y - 8);

		beg_no_button.update_pos(this.no_x, this.no_y);
		beg_no_text.update_pos(this.no_x - 128, this.no_y - 8);

		beg_text.update_pos(32, screen_height - 200);
		beg_text.center_x(screen_width*0.5)
	}
});

g_pixoji_title = null;
g_pixoji_title_img = null;

g_first_time_button = null;
g_first_time_text = null;

g_menu_to_overworld_button = null;
g_menu_to_overworld_text = null;

g_menu_to_randgen_button = null;
g_menu_to_randgen_text = null;


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

MenuStateClass = GameStateClass.extend({
	
	play_state: null,
	engine: null,

	attn_randommode: false,

	init: function(engine, play_state){

		

		play_screen_container.hide();//;
		
		this.play_state = play_state;
		this.engine = engine;

		this.play_state.hide_bg_squares();

		
		
		if (g_first_time_button == null) {

			
			this.play_state.hide_border();


			g_first_time_text = new TextClass(Types.Layer.GAME_MENU);
			g_first_time_text.set_font(Types.Fonts.XSMALL);
			g_first_time_text.set_text("FIRST TIME\n");

			

			g_pixoji_title_img = new SpriteClass();
			g_pixoji_title_img.setup_sprite('cherry.png',Types.Layer.HUD);
		

			
			g_first_time_button = new SpriteClass();
			g_first_time_button.setup_sprite('sunflower.png',Types.Layer.GAME_MENU);

			g_menu_to_overworld_text = new TextClass(Types.Layer.GAME_MENU);
			g_menu_to_overworld_text.set_font(Types.Fonts.XSMALL);
			g_menu_to_overworld_text.set_text("MAIN LEVELS\n");

			g_menu_to_overworld_button = new SpriteClass();
			g_menu_to_overworld_button.setup_sprite('elephant.png',Types.Layer.GAME_MENU);

			g_menu_to_randgen_text = new TextClass(Types.Layer.GAME_MENU);
			g_menu_to_randgen_text.set_font(Types.Fonts.XSMALL);
			g_menu_to_randgen_text.set_text("CHALLENGE LEVELS\n");//MAKE A RANDOM LEVEL");

			g_menu_to_randgen_button = new SpriteClass();
			g_menu_to_randgen_button.setup_sprite('saturn.png',Types.Layer.GAME_MENU);

			g_menu_to_app_button = new SpriteClass();
			g_menu_to_app_button.setup_sprite('cherry.png',Types.Layer.GAME_MENU);

			g_menu_to_app_text = new TextClass(Types.Layer.GAME_MENU);
			g_menu_to_app_text.set_font(Types.Fonts.XSMALL);
			g_menu_to_app_text.set_text("GET THE FREE APP\n(MORE LEVELS!)");
			//g_menu_to_app_text.set_colour('00ff00');
			//g_menu_to_app_text.change_text("GET THE FREE APP\n(MORE LEVELS!)");

			g_pixoji_title = new TextClass(Types.Layer.GAME_MENU);
			g_pixoji_title.shadow = true;
			g_pixoji_title.set_font(Types.Fonts.LARGE);
			g_pixoji_title.set_text("PIXOJI"); // MINE OF SIGHT

			g_menu_zblipdotcom_text = new TextClass(Types.Layer.GAME_MENU);
			g_menu_zblipdotcom_text.set_font(Types.Fonts.XSMALL);
			g_menu_zblipdotcom_text.set_text("> www.zblip.com <");

			g_spash_image = new SplashClass();
			

			//g_bitmap_menu_bg = new BitmapClass(Types.Layer.BACKGROUND, 2000, 2000);
			//g_bitmap_menu_bg.update_pos(-2.5*128, 0);

			menu_fb_rect = new SquareClass(0,0,29*6,29*4,Types.Layer.GAME_MENU,0x4B4965,true);

			g_menu_fb_button = new SpriteClass();
			g_menu_fb_button.setup_sprite('fblogo.png',Types.Layer.GAME_MENU);

			g_menu_twitter_button = new SpriteClass();
			g_menu_twitter_button.setup_sprite('twitterlogo.png',Types.Layer.GAME_MENU);

			
		}

		g_spash_image.make_vis();

		//g_bitmap_menu_bg.make_vis();

		//g_spash_image.make_vis();

		//g_bitmap_menu_bg.make_vis();

		g_pixoji_title_img.hide();

		g_pixoji_title.hide();//make_vis();

		g_first_time_button.make_vis();
		g_menu_to_overworld_button.make_vis();
		g_menu_to_randgen_button.make_vis();
		g_menu_to_app_button.make_vis();
		
		

		this.screen_resized();

		

		if (g_all_level_status[g_total_num_of_levels - 1] == 4) { // tick, done
			this.attn_randommode = true;
		}

	},

	redo_background: function () { return;
	
	},

	cleanup: function() {

		g_spash_image.hide();

		g_first_time_button.hide();
		g_menu_to_overworld_button.hide();
		g_menu_to_randgen_button.hide();
		g_menu_to_app_button.hide();

		g_first_time_text.update_pos(-999,-999);
		g_menu_to_overworld_text.update_pos(-999,-999);
		g_menu_to_randgen_text.update_pos(-999,-999);
		g_menu_to_app_text.update_pos(-999,-999);

		//play_screen_container.make_vis();//;
		//background_container.make_vis();//;

		//g_bitmap_menu_bg.clear();
		//g_bitmap_menu_bg.resize(4,4);
		//g_bitmap_menu_bg.update_pos(-99999,-99999);
		//g_bitmap_menu_bg.hide();

		g_pixoji_title_img.hide();


		//g_spash_image.hide();
		
		
		//g_first_time_button.hide();
		//g_first_time_text.update_pos(-999, -999);

		//g_menu_to_overworld_button.hide();
		//g_menu_to_overworld_text.update_pos(-999, -999);

		//g_menu_to_randgen_button.hide();
		//g_menu_to_randgen_text.update_pos(-999, -999);

		g_pixoji_title.update_pos(-999, -999);

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

	

	screen_resized: function () {

		g_spash_image.update_pos(screen_width*0.5,64);
		

		//g_spash_image.update_pos(screen_width*0.5,120)

		this.redo_background();

		var text_x_off = 0;
		var text_y_off = 40;
		var text_center_x = true;

		if (screen_width < screen_height) {

			g_pixoji_title.update_pos(32, 16);
			g_pixoji_title.center_x(screen_width*0.5);

			text_x_off = 40;
			text_y_off = -8;
			text_center_x = false;

			this.first_x = 0.25*screen_width;
			this.first_y = 0.25*screen_height;

			this.overworld_x = 0.25*screen_width;// - 60;
			this.overworld_y = 0.45*screen_height;

			this.randgen_x = 0.25*screen_width;// - 60;
			this.randgen_y = 0.65*screen_height;

			this.app_x = 0.25*screen_width;// - 60;
			this.app_y = 0.85*screen_height;

			this.zblip_x = -999;
			this.zblip_y = -999;

			this.fblogo_x = -999;
			this.fblogo_y = -999;

			this.twitterlogo_x = -999;
			this.twitterlogo_y = -999;

			menu_fb_rect.hide();
		} else {

			g_pixoji_title.update_pos(32, 32);
			g_pixoji_title.center_x(screen_width*0.5);

			this.first_x = 0.25*screen_width;
			this.first_y = 0.5*screen_height;

			this.overworld_x = 0.5*screen_width;// - 60;
			this.overworld_y = 0.5*screen_height;

			this.randgen_x = 0.75*screen_width;// - 60;
			this.randgen_y = 0.5*screen_height;

			this.app_x = 0.5*screen_width;// - 60;
			this.app_y = 0.75*screen_height;

			this.fblogo_x =  screen_width - 29 - 0.5*29;
			this.fblogo_y =  screen_height - 29 - 0.5*29;

			menu_fb_rect.make_vis();
			menu_fb_rect.update_pos(this.fblogo_x - 29 - 3*29, this.fblogo_y - 29 - 0.5*29);

			this.zblip_x = screen_width*0.5;
			this.zblip_y = screen_height - 16;

			this.twitterlogo_x = screen_width - 29 - 0.5*29;//this.fblogo_x - 29 - 1*29;
			this.twitterlogo_y = screen_height - 29 - 0.5*29;//this.fblogo_y;

		}

		if (using_cocoon_js == true) {
			this.fblogo_x = -999;
			this.fblogo_y = -999;
			this.twitterlogo_x = -999;
			this.twitterlogo_y = -999;
			this.app_x = -999;
			this.app_y = -999;
			menu_fb_rect.hide();
		}

		this.fblogo_x = -999;
		this.fblogo_y = -999;

		
		
		g_menu_fb_button.update_pos(this.fblogo_x, this.fblogo_y);
		g_menu_fb_button.make_vis();

		g_menu_twitter_button.update_pos(this.twitterlogo_x, this.twitterlogo_y);
		g_menu_twitter_button.make_vis();

		g_menu_zblipdotcom_text.update_pos(this.zblip_x, this.zblip_y);
		g_menu_zblipdotcom_text.center_x(this.zblip_x);

		////console.log('text_x_off' + text_x_off);
		////console.log('text_y_off' + text_y_off);

		g_first_time_button.update_pos(this.first_x, this.first_y);
		g_first_time_text.update_pos(this.first_x + text_x_off, this.first_y + text_y_off);
		if (text_center_x) g_first_time_text.center_x(this.first_x);

		g_menu_to_overworld_button.update_pos(this.overworld_x, this.overworld_y);
		g_menu_to_overworld_text.update_pos(this.overworld_x  + text_x_off, this.overworld_y + text_y_off);
		if (text_center_x) g_menu_to_overworld_text.center_x(this.overworld_x);

		g_menu_to_randgen_button.update_pos(this.randgen_x, this.randgen_y);
		g_menu_to_randgen_text.update_pos(this.randgen_x + text_x_off, this.randgen_y + text_y_off);
		if (text_center_x) g_menu_to_randgen_text.center_x(this.randgen_x);

		
		g_menu_to_app_button.update_pos(this.app_x, this.app_y);
		g_menu_to_app_text.update_pos(this.app_x + text_x_off, this.app_y + text_y_off);
		if (text_center_x)g_menu_to_app_text.center_x(this.app_x);
	},
	
	clicked_fb: false,
	clicked_zblip: false,
	clicked_app: false,

	handle_mouse_down: function(engine,x,y) {
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
		} else if (mouse.x > this.zblip_x - 24 &&
		    mouse.x < this.zblip_x + 24 &&
		    mouse.y > this.zblip_y - 16 &&
		    mouse.y < this.zblip_y + 16 && this.clicked_zblip== false) {
			this.clicked_zblip = true;
			open_url('https://www.zblip.com'); 
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

	handle_mouse_up: function(engine,x,y) {

	
		if (mouse.x > this.first_x - 100 &&
		    mouse.x < this.first_x + 100 &&
		    mouse.y > this.first_y - 28 &&
		    mouse.y < this.first_y + 28) {

			this.play_state.current_level = 0;
			this.play_state.game_mode = 5;
		
			//this.change_state(this.engine, new LoadingLevelStateClass(this.engine, this.play_state, 0));
			// InstructionStateClass
			// LoadInstructionStateClass 
			
			this.change_state(this.engine, new LoadInstructionStateClass(this.engine, this.play_state));
			return;

			
			
		}

		if (mouse.x > this.overworld_x - 40 &&
		    mouse.x < this.overworld_x + 40 &&
		    mouse.y > this.overworld_y - 28 &&
		    mouse.y < this.overworld_y + 28) {
			g_overworld_to_show = 0;
			this.play_state.game_mode = 0;
			this.change_state(this.engine, new OverworldStateClass(this.engine, this.play_state));
			
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

		//g_pixoji_title.update_pos(32, 32);

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

g_tut_content = {
	0 : {
		startclear: 0,
		dofill: [], dodig: [],
	     text : [
		     "WELCOME TO PIXOJI",
	             "THE GOAL IS TO\nFIND THE HIDDEN PICTURE",
		     "THIS LEVEL IS ALREADY DRAWN\nTO SHOW YOU HOW TO PLAY",
			"ON SOME TILES THERE IS A NUMBER\nFROM 0 TO 9",
	             "EACH NUMBER TELLS\nTHE AMOUNT OF DARK PIXELS\nIN ITS 3x3 AREA",
		     "THIS 9 MEANS...",
		     "THIS 9 MEANS 9 TILES AROUND IT\nARE FILLED",
		     "THIS 8 MEANS...",
		     "THIS 8 MEANS 8 TILES AROUND IT\nARE FILLED",
		     "THIS 7 MEANS...",
		     "THIS 7 MEANS 7 TILES AROUND IT\nARE FILLED",
		      "THIS 5 MEANS...",
		     "THIS 5 MEANS 5 TILES AROUND IT\nARE FILLED",
		     "THIS 4 MEANS...",
		     "THIS 4 MEANS 4 TILES AROUND IT\nARE FILLED",
		     "OKAY NOW ITS TIME FOR\nYOU TO DRAW PICTURES"
	            ],
	     tiles : [
		 	[],
		      	[], 
		     	[],
			[53],
		     	[53],
		      	[53],
		      	[42, 43, 44, 52, 53, 54, 62, 63, 64],
			[22],
			[11, 12, 13, 21, 22, 23, 31, 32 ,33],
			[42],
			[31, 32, 33, 41, 42, 43, 51, 52, 53],
			[20],
			[10, 11, 20, 21, 30, 31],
			[2],
			[1, 2, 3, 11, 12, 13],
			[]
		     ],
	     level: [[0,0,0,0,0,0,0,0,0],
[0,16,1,9,2,9,1,9,1],
[0,2,2,2,2,1,1,1,1],
[0,9,2,9,2,9,1,9,1],
[0,2,2,2,2,1,1,2,1],
[0,9,1,16,2,16,1,9,2],
[0,1,9,2,16,2,16,1,2],
[0,9,1,16,2,16,2,9,2],
[0,1,2,2,2,2,2,2,1]]
	    },
/*
5 : {
	     text : [
		     "NOW YOU GOTTA BE CAREFUL",
	             "REMEMBER THE RULE",
		     "NOT EVERY SQUARE WILL BE FILLED IN",
		     "LIKE THIS 4",
		     "YOU CAN GREY OUT TILES THAT YOU'RE SURE ARE EMPTY"
	            ],
	     tiles : [
			[],
			[],
			[],
			[2],
			[]
		     ],
	     level: [[0,0,0,0,0],
[0,16,1,9,2],
[0,2,2,2,2],
[0,9,2,9,2],
[0,2,2,2,2]]
	    },

	6 : {
	     text : [
		     "WOW YOURE REALLY GOOD",
	             "LETS TRY ANOTHER TUTORIAL",
	            ],
	     tiles : [
			[42],
			[31,36],
		     ],
	     level: [[0,0,0,0,0,0,0,0,0],
[0,16,1,9,2,9,1,9,1],
[0,2,2,2,2,1,1,1,1],
[0,9,2,9,2,9,1,9,1],
[0,2,2,2,2,1,1,2,1],
[0,9,1,16,2,16,1,9,2],
[0,1,9,2,16,2,16,1,2],
[0,9,1,16,2,16,2,9,2],
[0,1,2,2,2,2,2,2,1]]
	    },
*/
};

LoadInstructionStateClass = GameStateClass.extend({
	
	play_state: null,
	engine: null,

	x_pos: 0,

	no_such_tut: false,
	
	init: function(engine, play_state) {

		this.play_state = play_state;
		this.engine = engine;

		

		if (g_tut_content[this.play_state.current_level] == null) {
			////console.log('LoadInstructionStateClass > no such tut');
			this.no_such_tut = true;
		} else {
			////console.log('LoadInstructionStateClass > load tut');
			this.play_state.game_mode = 5;
			this.load_tut();
		}
	},

	load_tut : function () {
		var tut_level_to_load = this.play_state.current_level;
		var mapdata_version_mines = 1;
		this.play_state.load_tut_level(tut_level_to_load, mapdata_version_mines);

		for (var x = 0; x < this.play_state.level_w; x++) {
			for (var y = 0; y < this.play_state.level_h; y++) {
				// start with solved puzzle
				if (this.play_state.blocks[this.play_state.tiles[x][y]].block_type == 2 &&
				    g_tut_content[tut_level_to_load].startclear == 0) {
					this.play_state.blocks[this.play_state.tiles[x][y]].put_flag_on();
				} 
				this.play_state.blocks[this.play_state.tiles[x][y]].calc_hint(this.play_state.blocks[this.play_state.tiles[x][y]].symbol_type);
				this.play_state.blocks[this.play_state.tiles[x][y]].calc_sprite();
			} // for y
		} // for x

		// a lot of stuff in StartGame State
		this.play_state.calc_sequence_lengths();
		this.play_state.calc_edge_nonogram();
		this.play_state.resize();	// after calc edges - need to know sizes

		// hacky - zoom out a little bit more
		g_level_size++;		// controls zoom
		//g_level_w++;		// controls centering
		do_resize();

		//if (g_tut_content[tut_level_to_load].startclear == null)
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

			
			g_tut_text.update_pos(96, screen_height - 64);
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

		if (this.play_state.current_level == 0) this.skip_y = - 999;
		if (this.tut_substage == 0) this.reset_y = - 999;

		
		g_tut_text.center_x(screen_width*0.5)

		g_tut_next_button.update_pos(this.next_x, this.next_y);	
		g_tut_reset_button.update_pos(this.reset_x, this.reset_y);	
		g_tut_skip_button.update_pos(this.skip_x, this.skip_y);	

		////console.log('this.next_x ' + this.next_x + ' this.next_y ' + this.next_y);
		
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

	

	set_tut_substage : function(substage) {
		
		g_tut_next_button.scale(1, 1);

		if (substage >= g_tut_content[this.tut_level].text.length) {
			// too high
			return;
		}

		g_tut_text.change_text(g_tut_content[this.tut_level].text[substage]);

		for (var t = 0; t < g_tut_content[this.tut_level].tiles[substage].length; t++) {
			////console.log(' t < g_tut_content[this.tut_level].tiles[substage] ' + t);
			var b_ten = g_tut_content[this.tut_level].tiles[substage][t];
			var y = Math.floor(b_ten/10);
			var x = b_ten % 10;
			g_tut_highlight.add_tile_xy(x, y);
		} 

		g_tut_highlight.done();

		var dofill = false;
		for (var f = 0; f < g_tut_content[this.tut_level].dofill.length; f++) {
			if (substage == g_tut_content[this.tut_level].dofill[f]) {
				// fill all highlighted
				g_tut_highlight.fill();
			}
		}

		var dodig = false;
		for (var f = 0; f < g_tut_content[this.tut_level].dodig.length; f++) {
			if (substage == g_tut_content[this.tut_level].dodig[f]) {
				// dig all highlighted
				g_tut_highlight.dig();
			}
		}
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


	init: function(engine, play_state){

		

		play_screen_container.make_vis();//;
		this.play_state = play_state;
		this.engine = engine;

		var p_level_status = g_all_level_status;
		if (this.play_state.game_mode == 6) {
			if (this.play_state.challenge_level_hardness == 1) p_level_status = g_all_level_status.easy;
			if (this.play_state.challenge_level_hardness == 2) p_level_status = g_all_level_status.med;
			if (this.play_state.challenge_level_hardness == 3) p_level_status = g_all_level_status.hard;
			if (this.play_state.challenge_level_hardness == 4) p_level_status = g_all_level_status.nosmiley;
		}


		if (true || this.play_state.mistakes_this_level == 0) {
			p_level_status[this.play_state.current_level] = 4;
		}


		
		//console.log('winstate > this.play_state.game_mode ' + this.play_state.game_mode + ' >  this.play_state.challenge_level_hardness ' + this.play_state.challenge_level_hardness + ' p_level_status ' + p_level_status.toString() + ' this.play_state.mistakes_this_level ' + this.play_state.mistakes_this_level + ' p_level_status[this.play_state.current_level] ' + p_level_status[this.play_state.current_level]);

		total_levels_played++;
		levels_until_ad--;

		// kongregate.services.getUserId() will return 0 if not signed in
		if (on_kong && kongregate.services.getUserId() > 0 && this.play_state.game_mode == 3) {
			this.allow_rating = true;
		}

		

		

		if (use_browser_cookies) {
			
			this.save_state();
			this.show_save_option = false;
			//if (on_kong && kongregate.services.getUserId() > 0) this.submit_kong_stats();
		}

		if (on_kong && kongregate.services.getUserId() > 0) this.submit_kong_stats();

		// g_ui.clear
		// var next_code = 0;
		// var fb_code = 1;
		// g_ui.add_button('next', 'play_icon.png', next_code);
		// g_ui.add_button('like on FB', 'fb.png', fb_code);
		// var text_x = 1;	// 1 or -1
		// var text_y = -1;	// 1 or -1  which corner
		// g_ui.add_text('SOLVED!', text_x, text_y);

		if (g_star_rating_obj == null) {
			g_star_rating_obj = new StarRatingClass();
			g_star_rating_obj.hide();

		}

		if (g_next_level_button == null) {


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
			g_win_save_state_text.set_text("REMEMBER PROGRESS?: NO");

			g_win_save_state = new SpriteClass();
			g_win_save_state.setup_sprite('button_small.png',Types.Layer.GAME_MENU);



			
		}

		if (this.play_state.game_mode == 3 && this.allow_rating == true) g_star_rating_obj.make_vis();

		g_win_poptilesprite.hide();

		g_win_fb.update_pos(-999, -999);
		g_win_fb_text.update_pos(-999, -999);
		g_win_twit.update_pos(-999, -999);


		p_colour_folder = g_all_level_data_colour_layer;
		p_picturetext_folder = g_all_level_data_text;

		if (this.play_state.game_mode == 6) {
			this.play_state.mistakes_this_level = 0;
			if (this.play_state.challenge_level_hardness == 1) p_colour_folder = g_all_level_data_colour_layer.easy;
			if (this.play_state.challenge_level_hardness == 2) p_colour_folder = g_all_level_data_colour_layer.med;
			if (this.play_state.challenge_level_hardness == 3) p_colour_folder = g_all_level_data_colour_layer.hard;
			if (this.play_state.challenge_level_hardness == 4) p_colour_folder = g_all_level_data_colour_layer.nosmiley;

			if (this.play_state.challenge_level_hardness == 1) p_picturetext_folder = g_all_level_data_text.easy;
			if (this.play_state.challenge_level_hardness == 2) p_picturetext_folder = g_all_level_data_text.med;
			if (this.play_state.challenge_level_hardness == 3) p_picturetext_folder = g_all_level_data_text.hard;
			if (this.play_state.challenge_level_hardness == 4) p_picturetext_folder = g_all_level_data_text.nosmiley;
		}

		////console.dir(g_all_level_data_colour_layer.med);
		////console.log(' this.play_state.game_mode ' + this.play_state.game_mode);
		////console.log(' this.play_state.challenge_level_hardness ' + this.play_state.challenge_level_hardness);

		//alert('bbb');
		
		if (p_colour_folder[this.play_state.current_level] != null &&
		    p_colour_folder[this.play_state.current_level].length > 0) {
			this.do_colour = true;
			//console.log('WinState > do_colur');
			var colour_i = 0;
			for (var y = 0; y < this.play_state.level_h; y++) {
				for (var x = 0; x < this.play_state.level_w; x++) {
				
					if (colour_i >= p_colour_folder[this.play_state.current_level].length) continue;
					var c = p_colour_folder[this.play_state.current_level][colour_i];
					this.play_state.blocks[this.play_state.tiles[x][y]].secret_colour = c;
					colour_i++;
				}
			}
		} //else //console.log('WinState > no colur ... p_colour_folder[this.play_state.current_level] ' + p_colour_folder[this.play_state.current_level].toString());

		//console.log('this.play_state.current_level ' + this.play_state.current_level);
		//alert('aaa');

		var levelnum = this.play_state.current_level + 1;

		if (p_picturetext_folder[this.play_state.current_level] != null &&
		    p_colour_folder[this.play_state.current_level].length > 0) {
			g_win_picturename.change_text("LEVEL " + levelnum + "\n" + p_picturetext_folder[this.play_state.current_level]);
		} else {
			g_win_picturename.change_text("LEVEL " + levelnum + "\n" + this.play_state.mistakes_this_level + " MISTAKES");
		}	

		g_win_picturename.make_vis();

		this.screen_resized();

		//console.log('do_colour ' + this.do_colour);
		////console.dir(g_all_level_data_colour_layer);
		////console.dir(g_all_level_data_text);
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
		localStorage.setItem("pixojilevels", cookie_string);

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
		
		var now = new Date();
  		var time = now.getTime();
		
  		var expireTime = time + 6*20000*36000;	// 3 months
		now.setTime(expireTime);


		// g_all_level_status[levelnum] = 4;	// tick, done

		var cookie_string = "pixojilevels=";

		var local_storage_content = "";
		var local_storage_content_challenge = "";

		for (levelnum in g_all_level_status) {
			//if (g_all_level_status[levelnum] != 4) continue;
			//cookie_string += levelnum.toString() + "a";
			//local_storage_content += levelnum.toString() + "a";

			//var level_done = "pixojilevel" + levelnum.toString();
			//localStorage.setItem(level_done, "1");
		}

		

		if (using_cocoon_js == false) {
			//document.cookie= cookie_string + ";expires=" +now.toGMTString();
			document.cookie= cookie_string + ";expires=Fri, 31 Dec 2020 23:59:59 GMT";
			//document.cookie= cookie_string + ";"//expires=" +now.toGMTString();
		}

		//localStorage.setItem("pixojilevels", local_storage_content);

		if (this.play_state.game_mode == 3) this.save_state_community_levels();

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
			//document.cookie="pixojiclicktodig=" + clicktodig.toString() + ";expires=" +now.toGMTString();
			//document.cookie="pixojiholdtoflag=" + holdtoflag.toString() + ";expires=" +now.toGMTString();

			document.cookie="pixojiclicktodig=" + clicktodig.toString() + ";expires=Fri, 31 Dec 2020 23:59:59 GMT";
			document.cookie="pixojiholdtoflag=" + holdtoflag.toString() + ";expires=Fri, 31 Dec 2020 23:59:59 GMT";
		}

		localStorage.setItem("pixojiclicktodig", clicktodig.toString());
		localStorage.setItem("pixojiholdtoflag", holdtoflag.toString());

		if (using_cocoon_js == true) {
			// for ads
			localStorage.setItem("total_levels_played", total_levels_played.toString());
			localStorage.setItem("levels_until_ad", levels_until_ad.toString());

			// for begging
			localStorage.setItem("g_seen_beg", g_seen_beg.toString());
		}
		// // pixojilevels=1a2a3a6


		// oct 2017 - serialize entire g_all_level_status, incl easy med hard
		localStorage.setItem("zblip_pixoji_g_all_level_status", JSON.stringify(g_all_level_status));

		// to read:
		//var meta1 = JSON.parse(window.localStorage.getItem("zblip_pixoji_g_all_level_status"));
		////alert(meta1['22']);
	},

	go_to_fb: function() {
		window.open('https://www.facebook.com/Mine-of-Sight-1037635096381976');
	},

	go_to_twit: function() {
		window.open('https://twitter.com/ZBlipGames');
	},

	starrate_x: 0,
	starrate_y: 0,


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

		

		if (using_cocoon_js == true) this.fb_x = -999;
		
		
		g_star_rating_obj.update_pos(this.starrate_x, this.starrate_y);
		if (this.play_state.game_mode != 3 || this.allow_rating == false) g_star_rating_obj.hide();

		//this.save_x = -999;
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

		
		//this.save_x = -999;
		//this.save_y = -999;

		
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

		if (screen_width > screen_height) g_win_message.update_pos(screen_width - 124,20);		
		else {
			g_win_message.update_pos(screen_width*0.5,screen_height - 128);
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

		g_star_rating_obj.hide();

		if (use_browser_cookies == true) {
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
	},

	user_clicked_save: false,

	handle_mouse_up: function(engine,x,y) {

		var next_ = 0;

		if (this.play_state.game_mode == 3) g_star_rating_obj.click(mouse.x, mouse.y);

		if (mouse.x > this.save_x - 16 &&
		    mouse.x < this.save_x + 16 &&
		    mouse.y > this.save_y - 16 &&
		    mouse.y < this.save_y + 16) {

			if (this.user_clicked_save == true) {
				this.user_clicked_save = false;
				use_browser_cookies = false;
				g_win_save_state.set_texture("button_small.png");
				g_win_save_state_text.change_text("REMEMBER PROGRESS?: NO");
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

		if (next_ == 1) {

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

			// game mode 0 - campaign levels
			// or 6 - challenge levels
			
			this.play_state.current_level++;

			var max_level = g_total_num_of_levels;
			if (this.play_state.game_mode == 0 && using_cocoon_js == false) max_level = g_levelnum_app_cutoff;
			if (this.play_state.game_mode == 6 && this.play_state.challenge_level_hardness == 1) max_level = g_total_challenge_levels_easy;
			if (this.play_state.game_mode == 6 && this.play_state.challenge_level_hardness == 2) max_level = g_total_challenge_levels_med;
			if (this.play_state.game_mode == 6 && this.play_state.challenge_level_hardness == 3) max_level = g_total_challenge_levels_hard;
			if (this.play_state.game_mode == 6 && this.play_state.challenge_level_hardness == 4) max_level = g_total_challenge_levels_nosmiley;
			if (this.play_state.game_mode == 6 && this.play_state.challenge_level_hardness == 4 && using_cocoon_js == false) max_level = g_levelnum_app_cutoff_nosmiley;
			
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
this_game_id = "pixoji";
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

			////console.log("load crosspromote stuff");

			// send request
			fetch_json('https://www.zblip.com/crosspromote/currentgame.json', crosspromote_json);
			fetch_image('https://www.zblip.com/crosspromote/currentgame.png', crosspromote_image);

			this.goto_next_gamestate();
			
			return;
		} else if (crosspromote_json == null || crosspromote_image == null) {
			// waiting ...
			this.goto_next_gamestate();
			////console.log("waiting for crosspromote stuff to load");
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

			////console.log(crosspromote_image.toString());
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

			crosspromote_no_button = new ButtonClass();
			crosspromote_no_button.setup_sprite("play_icon.png",Types.Layer.GAME_MENU);
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
			////console.log("goto_next_gamestate new GenerateRandStateClass");
			this.change_state(this.engine, new GenerateRandStateClass(this.engine, this.play_state));
		} else {
			////console.log("goto_next_gamestate new StartGameStateClass");
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
	"https://www.coolmath-games.com",
	"www.coolmath-games.com",
	"edit.coolmath-games.com",
	"www.stage.coolmath-games.com",
	"edit-stage.coolmath-games.com",
	"dev.coolmath-games.com"
];

var g_interstitial;
var g_interstitial_failed = false;
var g_interstitial_loaded = false;
var g_interstitial_seen = false;

var g_show_ads = false;
var g_show_crosspromote = true;

if (is_sitelocked == true) g_show_crosspromote = false;

var total_levels_played = 0;
var levels_until_ad = 50;

var app_paused = false;


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

		

		var pixojilevels = localStorage.getItem("pixojilevels");
		var pixojiclicktodig = localStorage.getItem("pixojiclicktodig");
		var pixojiholdtoflag = localStorage.getItem("pixojiholdtoflag");

		

		// to read:
		zblip_pixoji_g_all_level_status = JSON.parse(window.localStorage.getItem("zblip_pixoji_g_all_level_status"));
		////alert(meta1['22']);
		if (zblip_pixoji_g_all_level_status != null) {
			//g_all_level_status = zblip_pixoji_g_all_level_status;

			load_all_level_status(zblip_pixoji_g_all_level_status);

			// bug - if zblip_pixoji_g_all_level_status lacks .nosmiley
			//	 it overwrites the .nosmiley in g_all_level_status

			this.first_time = false;
			this.start_level = 1;

			for (levelnum in g_all_level_status) {
				if (levelnum > this.start_level) this.start_level = levelnum;
			}
		}
		

		if (pixojilevels != null) {
			
			//var levels_ = pixojilevels.split("=")[1]; // array of levels
			var levels_array = pixojilevels.split("a");	// '1a2a3a6' ... ['1','2','3','6']

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

		} // if (pixojilevels != null)

		if (pixojiclicktodig != null) {
			var bool_ = pixojiclicktodig;	// 1 or 0
			if (bool_ == null || bool_ == undefined) return;
			if (bool_ == '0') g_click_to_dig = false;
			else g_click_to_dig = true;
		}

		if (pixojiholdtoflag != null) {
			var bool_ = pixojiholdtoflag;	// 1 or 0
			if (bool_ == null || bool_ == undefined) return;
			if (bool_ == '0') g_hold_to_flag = false;
			else g_hold_to_flag = true;
		}

		

		for (lev in levels_array) {
			var l = Number(levels_array[lev]);

			if(l < g_total_num_of_levels &&
			   l >= 0) {

				var string_key = "pixojilevel" + l.toString();
			
				var level_done = localStorage.getItem(string_key);
				if (level_done != null) {
					g_all_level_status[l] = 4;	// tick, done

					use_browser_cookies = true;

				}	

			}

			
		}


		if (using_cocoon_js == true) {
			use_browser_cookies = true;	// able to store state, so user won't be prompted

			var numsessions = localStorage.getItem("numsessions");
			if (numsessions == null) numsessions = 0;
			localStorage.setItem("numsessions", numsessions + 1);

			var tot_lev_played = localStorage.getItem("total_levels_played");
			if (tot_lev_played == null) tot_lev_played = 0;
			total_levels_played = tot_lev_played;

			Cocoon.App.on("activated", function() {
				app_paused = false;
			});

			Cocoon.App.on("suspended", function() {
				app_paused = true;
			});

			Cocoon.App.on("suspending", function() {
				app_paused = true;
			});

			
			var lev_till_ad = localStorage.getItem("levels_until_ad");
			if (lev_till_ad == null) lev_till_ad = 50;
			levels_until_ad = lev_till_ad;

			// g_seen_beg
			var seen_beg = localStorage.getItem("g_seen_beg");
			if (seen_beg == null) seen_beg = 0;
			g_seen_beg = seen_beg;

			//if (numsessions > 4 && numsessions % 2 == 0) g_show_ads = true;
			g_show_ads = true;

			///*

			var test_ad_id = "ca-app-pub-3940256099942544/1033173712";
			//var mos_ad_id = "ca-app-pub-5530418852392779/2948904041";
			//var pixoji_ad_id = "ca-app-pub-5530418852392779/5477925418";

			g_interstitial = Cocoon.Ad.AdMob.createInterstitial(test_ad_id);
			g_interstitial.on("load", function() {
    				////console.log("Interstitial loaded");
				g_interstitial_loaded = true;
				g_interstitial_failed = false;
				g_interstitial_seen = false;
			});

			g_interstitial.on("fail", function() {
    				////console.log("Interstitial failed");
				g_interstitial_failed = true;
				g_interstitial_loaded = false;
			});
 
			g_interstitial.on("show", function() {
    				////console.log("Interstitial shown");
				g_interstitial_seen = true;
			});
 
			g_interstitial.on("dismiss", function() {
    				////console.log("Interstitial dismissed");
				g_interstitial_seen = true;
			});

			//g_interstitial.load(); // do I call this?

			// g_interstitial.show();

			//*/

			return;
		}

		// cookies
		var cookies = document.cookie.split("; ");
		//(cookies);

		
		for (var lvl in cookies) {

			var levelnum_str = cookies[lvl].split("=")[0];	// "pixoji1"

			levelnum_str = levelnum_str.split("pixoji")[1];

			var levelnum = Number(levelnum_str);
	
			if (levelnum == null || levelnum == undefined) continue;

			
				
			if(levelnum < g_total_num_of_levels &&
			   levelnum >= 0) {
				g_all_level_status[levelnum] = 4;	// tick, done

				use_browser_cookies = true;	// if we found a cookie, then this user previously opted to save

				if (levelnum > this.start_level) this.start_level = levelnum + 1;

			} 

				

		}

		//document.cookie="pixojiclicktodig=" + clicktodig.toString() + ";expires=" +now.toGMTString();
		//document.cookie="pixojiholdtoflag=" + holdtoflag.toString() + ";expires=" +now.toGMTString();



		for (c in cookies) {

			var cookiename_str = cookies[c].split("=")[0];	// "pixojiclicktodig"

			if (cookiename_str == "pixojiclicktodig") {
				var bool_ = cookies[c].split("=")[1];	// 1 or 0
				if (bool_ == null || bool_ == undefined) continue;
				if (bool_ == 0) g_click_to_dig = false;
				else g_click_to_dig = true;
			
			} else if (cookiename_str == "pixojiholdtoflag") {
				var bool_ = cookies[c].split("=")[1];	// 1 or 0
				if (bool_ == null || bool_ == undefined) continue;
				if (bool_ == 0) g_hold_to_flag = false;
				else g_hold_to_flag = true;

			} else if (cookiename_str == "pixojilevels") {

				

				use_browser_cookies = true;	// if we found a cookie, then this user previously opted to save

				var levels_ = cookies[c].split("=")[1]; // array of levels
				var levels_array = levels_.split("a");	// '1a2a3a6' ... ['1','2','3','6']
				
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
				
			}

		} // for c in cookies
 
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

		var current_url = location.hostname;
		
		for (var u = 0; u < sitelock_urls.length; u++) {
			if (sitelock_urls[u] == current_url) return 1;
		}

		return 0;

	},

	start_game: function (engine) {

		//////alert('on_kong ' + on_kong);

		if (is_sitelocked == true && this.check_sitelock() == 0) return;

		if (this.check_blacklist() == 1) return;


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


		// this.play_state.current_level >= g_total_num_of_levels

		// For now - Mathsweeper will launch right into GenerateRandStateClass 
		//engine.push_state(new GenerateRandStateClass(engine, engine.get_state()));
		//return;

		// tutorial:
		play_state.game_mode = 0;
		//play_state.current_level = 0;
		play_screen_container.hide();
		background_group.hide();
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
		
			// MenuStateClass
			engine.push_state(new MenuStateClass(engine, engine.get_state()));

			// InstructionStateClass
			//play_state.current_level = 0;
			//play_state.game_mode = 5;
			//engine.push_state(new LoadInstructionStateClass(engine, engine.get_state()));
			
			
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


// ff9400

pBar.value += 10;
