// http://gamedevgeek.com/tutorials/managing-game-states-in-c/


GameStateClass = Class.extend({

	

	init: function(){
		
	},

  	cleanup: function(){},

  	pause: function(){},
  	resume: function(){},

	screen_resized: function(){},

  	handle_events: function(engine,x,y, event_type){

		if (event_type == Types.Events.WHEEL) {
				
			this.handle_wheel(); 
			
		}

		if (event_type == Types.Events.MOUSE_CLICK_RIGHT) {
			this.handle_right_click(engine,x,y);
		}

		if (event_type == Types.Events.MOUSE_CLICK || event_type == Types.Events.MOUSE_UP) {
			this.handle_click(engine,x,y,event_type);
		} else if (event_type == Types.Events.MOUSE_MOVE) {
			this.handle_mouse_move(engine,x,y);
		} else {
			this.handle_key(engine,event_type);
		}

		if(event_type == Types.Events.MOUSE_CLICK) {
			
			this.handle_mouse_down(engine,x,y);
		}

		if(event_type == Types.Events.MOUSE_UP) {
			
			this.handle_mouse_up(engine,x,y);
		}

	},

	handle_key:function(engine,event_type){},
	handle_click: function(engine,x,y,event_type){},
	handle_right_click: function(engine,x,y,event_type){},
	handle_mouse_down: function(engine,x,y){},
	handle_mouse_up: function(engine,x,y){},
	handle_mouse_move: function(engine,x,y){},

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

PlayStateClass = GameStateClass.extend({
	

	engine: null,

	tiles: [],	// holds indexes to this.blocks
	grid_w: 10,
	grid_h: 10,
	tile_size: 60,
	blocks: [],	// 1D array of BlockClass objects

	pop_sprites: [],

	selected_tiles: [],	// really belongs in DuringStateClass, but putting it here so I dont have to use a global

	joined_tiles: [],	// which group does this tile belong to
				// delfault, 0, means NOT in a group
	num_join_groups: 0,

	current_level: 0,

	info_obj: null,

	init: function(engine){

		console.log('play state init');

		this.engine = engine;

		if(screen_width < screen_height) {
			//this.tile_size = screen_width/this.map_w;
		} else {
			//this.tile_size = Math.min(screen_height/this.map_h,64*this.map_h);
		}

		for(var i = 0; i < this.grid_w; i++) {
			this.tiles[i] = new Array(this.grid_h);

			this.selected_tiles[i] = new Array(this.grid_h);

			this.pop_sprites[i] = new Array(this.grid_h);

			this.joined_tiles[i] = new Array(this.grid_h);

		}

		for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {
				this.tiles[x][y] = -1; // empty

				
				this.joined_tiles[x][y] = 0;

				this.selected_tiles[x][y] = 0;	// 1 is selected

				this.pop_sprites[x][y] = new ExplosionClass(x,y, this);
			}
		}

		

		for(var g = 0; g < this.grid_w*this.grid_h; g++) {
			var new_gem = new BlockClass(this);
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
			this.blocks[g].block_shadow_sprite.hide();
		}
		

		//this.draw_background();

		this.info_obj = new InfoClass(this);


		this.screen_resized();

		
		//var block_sprite = new SpriteClass();
		//block_sprite.setup_sprite("block0.png",Types.Layer.TILE, 20,60);
		//block_sprite.hide();
		///block_sprite.make_vis();

		
	},

	
	reset: function() {

		this.num_joined_groups = 0;

		for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {


				this.change_tile(x,y,0);
				this.selected_tiles[x][y] = 0;
				this.joined_tiles[x][y] = 0;

				this.blocks[this.tiles[x][y]].preset_hint(0);

				this.blocks[this.tiles[x][y]].cover();
				this.blocks[this.tiles[x][y]].uncover();
				this.blocks[this.tiles[x][y]].deselect();
				this.blocks[this.tiles[x][y]].reset();

				

				

			}
		}


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

	join_tiles: function(x,y,xx,yy) {

		var join_group = -1;

		if (this.joined_tiles[x][y] == 0 &&
		    this.joined_tiles[xx][yy] == 0) {
			this.num_joined_groups++;
			this.joined_tiles[x][y] = this.num_joined_groups;
			this.joined_tiles[xx][yy] = this.num_joined_groups;

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
				//console.log(JSON.levels[levelnum][y][x]);

				this.blocks[this.tiles[x][y]].preset_hint(0);

				if (floortile == 1) {
					// wall
					this.change_tile(x,y,1);
				} else if (floortile == 2) {
					// bomb
					this.change_tile(x,y,2);
				} else if (floortile == 8) {
					// joined
					
					if (y > 0) this.join_tiles(x,y,x,y-1);
				} else if (floortile == 7) {
					// joined
					if (x > 0) this.join_tiles(x,y,x-1,y);
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

	load_level : function (levelnum, mapdata_version_mines) {
		this.reset();

		if (g_all_level_data_floor_layer[levelnum] == null ||
		    g_all_level_data_cover_layer[levelnum] == null) {

			console.log('no such level ' + levelnum);
			return;
		}

		if (mapdata_version_mines == 1) {

		for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {
				this.blocks[this.tiles[x][y]].reset();
			}
		}

		for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {
				var floortile = g_all_level_data_floor_layer[levelnum][y][x];
				//if (gem == 0) continue;
				//this.add_gem(x,y,JSON.levels[levelnum][y][x]);
				//console.log(JSON.levels[levelnum][y][x]);

				this.blocks[this.tiles[x][y]].preset_hint(0);

				if (floortile == 1) {
					// wall
					this.change_tile(x,y,1);
				} else if (floortile == 2) {
					// bomb
					this.change_tile(x,y,2);
				} else if (floortile == 8) {
					// joined
					
					if (y > 0) this.join_tiles(x,y,x,y-1);
				} else if (floortile == 7) {
					// joined
					if (x > 0) this.join_tiles(x,y,x-1,y);
				} else if (floortile == 3) {
					// hint
					this.blocks[this.tiles[x][y]].preset_hint(2);
				} else if (floortile == 4) {
					// hint
					this.blocks[this.tiles[x][y]].preset_hint(3);
				} else if (floortile == 5) {
					// hint
					this.blocks[this.tiles[x][y]].preset_hint(1);
				} else if (floortile == 9) {
					// hint
					this.blocks[this.tiles[x][y]].preset_hint(4);
				}

			}	// x
			
        	}	// y

		// lets go again! gotta calculate surrounding bombs for each tile
		// so we needed to place the bombs first
		for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {

				var floortile = g_all_level_data_floor_layer[levelnum][y][x];

				if (g_all_level_data_cover_layer[levelnum][y][x] == 6) {
					this.blocks[this.tiles[x][y]].cover();
				} else {
					this.blocks[this.tiles[x][y]].uncover(true);
				}

				if (floortile == 1) this.blocks[this.tiles[x][y]].uncover(false);
		} // y
		} // x

		} // if (JSON.mapdata_version_mines == 1)
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
			console.log('change_tile' + x + ' ' + y );
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
			this.draw_timer = 60;
			
			for(var y = 0; y < this.grid_h; y++) {
            			for(var x = 0; x < this.grid_w; x++) {
					if (this.tiles[x][y] == -1) continue;
					this.blocks[this.tiles[x][y]].draw();
				}
			}

		}
		this.draw_timer--;
		
		

		
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

		
	},

	
	

	draw_rect_background: function(x,y,xx,yy,colour, alpha) {

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
		
		this.draw_rect_background(-2000,
					  -2000,
					  4000,
					  4000, 0x1F1129);	// 1F1129  161423


		

		for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {
				//var sq_ = this.draw_rect_background((x+0.5)*this.tile_size - 25,(y+0.5)*this.tile_size -25, 50 , 50, 0x170E21);
				//this.bg_squares.push(sq_);
				//sq_.alpha = 0;
			}
		}

		

		for(var y = 0; y < this.grid_h + 1; y++) {
            		//this.draw_rect_background(0,y*this.tile_size - 4,this.grid_w*this.tile_size,8,0x1f1129 );	
		}

		for(var x = 0; x < this.grid_w + 1; x++) {
			//this.draw_rect_background(x*this.tile_size - 4,0,8,this.grid_h*this.tile_size,0x1f1129 );		
		}

		

		
	},

	

	
});

RestartGameStateClass = GameStateClass.extend({

	play_state: null,
	engine: null,

	timer: 30,

	x_pos: 0,

	init: function(engine, play_state){
		this.play_state = play_state;
		this.engine = engine;

		play_screen_container.visible = true;
		this.x_pos = 0;
		
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

		this.x_pos = this.x_pos - 0.075*Math.abs(this.x_pos + 999);
		play_screen_group.x = this.x_pos;
		this.timer--;
	
		
		
		if (this.timer <= 0) {
		var level_to_load = this.play_state.current_level;	
		var mapdata_version_mines = 1;
		
		play_screen_container.visible = false;

		this.play_state.load_level(level_to_load, mapdata_version_mines); // 
		this.change_state(this.engine, new StartGameStateClass(this.engine, this.play_state));

		}
		
	},

	cleanup: function() {
		// this state could be interrupted by the user, and we can't guarantee that StartGameStateClass will be next
		// BUT StartGameStateClass init sets play_screen_container.position.x to +999 before draw()
		
		play_screen_group.x = 0;	
	},

	draw: function() {
		
		this.play_state.draw();
	},


});



StartGameStateClass = GameStateClass.extend({

	play_state: null,

	engine: null,

	x_pos: 999,
	timer: 55,

	init: function(engine, play_state){
		this.play_state = play_state;
		this.engine = engine;

		//this.play_state.new_game(0);

		play_screen_container.position.x = 999;
		

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
		;

		play_screen_container.position.x = this.x_pos;

		play_screen_container.visible = true;

		this.play_state.update();
		// waiting for player to click to start

		if (this.timer == 0) {
			this.change_state(this.engine, new DuringGameStateClass(this.engine, this.play_state));
			play_screen_container.position.x = 0;
		}
		
	},

	cleanup: function() {
		play_screen_group.x = 0;
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


g_dig_button = null;
g_flag_button = null;
g_flag_cursor_sprite = null;

// for tut levels we need some text
g_level_text_1 = null;
g_level_text_2 = null;

g_skip_tut_button = null;
g_skip_tut_text = null;

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

	show_level_text: false,

	init: function(engine, play_state){
		this.play_state = play_state;
		this.engine = engine;

		play_screen_container.visible = true;

		this.mouse_down = false;

		if (g_undo_button_sprite == null) {

			g_skip_tut_button = new ButtonClass();
			g_skip_tut_button.setup_sprite("home_icon.png",Types.Layer.GAME_MENU);
			g_skip_tut_button.update_pos(screen_width + 200, screen_height*0.5);

			g_skip_tut_text = new TextClass(Types.Layer.GAME_MENU);
			g_skip_tut_text.set_font(Types.Fonts.SMALL);
			g_skip_tut_text.set_text("CHANGE LEVEL");

			//g_undo_button_sprite = new SpriteClass();
			//g_undo_button_sprite.setup_sprite('back_button.png',Types.Layer.GAME_MENU);

			//g_help_table = new TableAreaClass(this.play_state, "");
			//g_help_table.resize(-999,-999,-999,-999);

			//g_help_sprite = new SpriteClass();
			//g_help_sprite.setup_sprite('back_button.png',Types.Layer.GAME_MENU);
			//g_help_sprite.update_pos(-999,-999);

			g_help_text = new TextClass(Types.Layer.TILE);
			g_help_text.set_font(Types.Fonts.SMALL);
			g_help_text.set_text("");

			g_level_text_1 = new TextClass(Types.Layer.TILE);
			g_level_text_1.set_font(Types.Fonts.LARGE);
			g_level_text_1.set_text("");

			g_level_text_2 = new TextClass(Types.Layer.TILE);
			g_level_text_2.set_font(Types.Fonts.MEDIUM);
			g_level_text_2.set_text("");
		

			for (var e = 0; e < gameplay_errors.length; e++) {
				var e_text = new TextClass(Types.Layer.GAME_MENU);
				e_text.set_font(Types.Fonts.MEDIUM);
				e_text.set_text(gameplay_errors[e]);
				e_text.update_pos(-999, -999);

				g_gameplay_error_text_objs.push(e_text);

			}

			g_flag_button = new ButtonClass();
			g_flag_button.setup_sprite("redflag.png",Types.Layer.GAME_MENU);
			g_flag_button.update_pos(screen_width + 200, screen_height*0.5);
			g_flag_button.hide();
			
			g_dig_button = new ButtonClass();
			g_dig_button.setup_sprite("diggy.png",Types.Layer.GAME_MENU);
			g_dig_button.update_pos(screen_width + 200, screen_height*0.5);
			g_dig_button.hide();

			g_flag_cursor_sprite = new SpriteClass();
			g_flag_cursor_sprite.setup_sprite('redflag.png',Types.Layer.GAME_MENU);
			g_flag_cursor_sprite.update_pos(-999,-999);

		}

		//g_undo_button_sprite.update_pos(-999, -999);


		if (this.play_state.current_level == 0) {

			this.play_state.info_obj.set_hint_type(1);	// 4 touch
			this.play_state.info_obj.hidden = false;
			this.play_state.info_obj.draw_once();

			this.show_level_text = true;
			// tutorial state
			g_level_text_1.change_text("WHERE ARE THE MINES HIDDEN?");

			//If a white tile is safe then remove it
			g_level_text_2.change_text("If a white tile is safe then remove it \nIf a white tile is unsafe then flag it");

		} else if (this.play_state.current_level == 4) {

			this.play_state.info_obj.set_hint_type(2);	// see
			this.play_state.info_obj.hidden = false;
			this.play_state.info_obj.draw_once();

			

		}

		
		this.screen_resized();

	},

	cleanup : function () {
		g_dig_button.update_pos(-999,-999);
		g_flag_button.update_pos(-999,-999);

		g_level_text_1.update_pos(-999,-999);
		g_level_text_2.update_pos(-999,-999);

		//g_undo_button_sprite.update_pos(-999,-999);

		g_skip_tut_button.update_pos(-999,-999);
		g_skip_tut_text.update_pos(-999,-999);

		for (var e = 0; e < g_gameplay_error_text_objs.length; e++) {

			g_gameplay_error_text_objs[e].update_pos(-999, -999);

		}

		this.play_state.info_obj.hidden = true;
		this.play_state.info_obj.draw_once();
		
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

	screen_resized: function () {

		console.log('duringgamestate screen resized');

		if (screen_width > screen_height) {
			this.flag_x = screen_width - 64;
			this.flag_y = 64;
			
			this.dig_x = screen_width - 64;
			this.dig_y = 128;

			if (this.play_state.current_level < 2) {
				this.home_x = 64;
				this.home_y = 64;
			}


			
		} else {
			this.flag_x = screen_width - 64;
			this.flag_y = screen_height - 128;

			this.dig_x = screen_width - 128;
			this.dig_y = screen_height - 128;

			if (this.play_state.current_level < 2) {
				this.home_x = screen_width - 64;
				this.home_y = screen_height - 64;
			}
		}

		g_skip_tut_button.update_pos(this.home_x, this.home_y);
		g_skip_tut_text.update_pos(this.home_x + 42, this.home_y - 8);

		g_flag_button.update_pos(this.flag_x,this.flag_y);
		g_dig_button.update_pos(this.dig_x,this.dig_y);

		if (this.show_level_text == true) {
			g_level_text_1.update_pos(1*this.play_state.tile_size, 9*this.play_state.tile_size,999,999);
			g_level_text_2.update_pos(1*this.play_state.tile_size, 10*this.play_state.tile_size,999,999);
		}

		this.play_state.screen_resized();
	},

	
	highlighted_x: 0,
	highlighted_y: 0,

	handle_wheel: function () {
		
	},

	handle_mouse_down: function(engine,x,y) {

		
	
		if (this.mouse_down == true) {
			return;
		}

		this.mouse_down = true;

		this.handle_mouse_move(engine,x,y);

		//if (mouse.y > screen_height - 100 &&
		//    mouse.x > screen_width - 100) return;	// undo button

		if (mouse.y > screen_height - 100 &&
		    mouse.x < 100) return;	// menu button

		if (mouse.y > this.flag_y - 32 &&
		    mouse.y < this.flag_y + 32 &&
		    mouse.x > this.flag_x - 32 &&
		    mouse.x < this.flag_x + 32) this.flag_selected();

		if (mouse.y > this.dig_y - 32 &&
		    mouse.y < this.dig_y + 32 &&
		    mouse.x > this.dig_x - 32 &&
		    mouse.x < this.dig_x + 32) this.dig_selected();

		
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

	
	handle_right_click: function(engine,x,y) {

		return;

		if (this.highlighted_x < 0 || 
		    this.highlighted_x >= this.play_state.grid_w ||
		    this.highlighted_y < 0 || 
		    this.highlighted_y >= this.play_state.grid_h) return;

		this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].put_flag_on();
	},

	num_selected_tiles: 0,
	

	handle_mouse_up: function(engine,x,y) {


		//if (mouse.x > screen_width - 100 &&
		//    mouse.y > screen_height - 100) this.undo();

		this.mouse_down = false;

		if (this.highlighted_x < 0 || 
		    this.highlighted_x >= this.play_state.grid_w ||
		    this.highlighted_y < 0 || 
		    this.highlighted_y >= this.play_state.grid_h) {

			for (var x = 0; x < this.play_state.grid_w; x++) {
				for (var y = 0; y < this.play_state.grid_h; y++) {
					this.play_state.selected_tiles[x][y] = 0;
					this.play_state.blocks[this.play_state.tiles[x][y]].deselect();
					this.num_selected_tiles = 0;
					g_flag_button.hide();
					g_dig_button.hide();
				}
			}

			
			this.play_state.info_obj.hidden = true;
			this.play_state.info_obj.draw_once();

			return;
		}

		if (this.play_state.selected_tiles[this.highlighted_x][this.highlighted_y] == 0 &&
		    this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].covered_up == false) {

			this.play_state.info_obj.hidden = false;
			this.play_state.info_obj.set_block(this.highlighted_x, this.highlighted_y);
			this.play_state.info_obj.draw_once();
			
		}

		if (this.play_state.selected_tiles[this.highlighted_x][this.highlighted_y] == 0 &&
		    this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].covered_up == true) {
			this.play_state.selected_tiles[this.highlighted_x][this.highlighted_y] = 1;
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].select();
			playSoundInstance('curve.wav',0.1);
			this.num_selected_tiles++;
			g_flag_button.make_vis();
			g_dig_button.make_vis();
		} else {

			if (this.play_state.selected_tiles[this.highlighted_x][this.highlighted_y] == 1) {
				this.num_selected_tiles--;
			} 

			this.play_state.selected_tiles[this.highlighted_x][this.highlighted_y] = 0;
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].deselect();
			playSoundInstance('curve.wav',0.1);
			
			if (this.num_selected_tiles == 0) { 
				g_flag_button.hide();
				g_dig_button.hide();
			}
		}


		// info panel
		//if (this.info_panel_locked == false) this.set_info_panel(this.highlighted_x, this.highlighted_y);
		

		
	},

	set_info_panel: function(x, y) {
		var blocktype = this.play_state.get_block_type(x,y);

		if (blocktype == 1) {
			// wall
		} else {
			//if ()


		}
	},

	flag_selected: function () {
		for (var x = 0; x < this.play_state.grid_w; x++) {
			for (var y = 0; y < this.play_state.grid_h; y++) {
				if (this.play_state.selected_tiles[x][y] == 0) continue;
				this.play_state.selected_tiles[x][y] = 0;

						

				if (this.play_state.blocks[this.play_state.tiles[x][y]].flag_on == false) this.play_state.blocks[this.play_state.tiles[x][y]].put_flag_on();
				else this.play_state.blocks[this.play_state.tiles[x][y]].take_flag_off();

				
			}
		}

		this.check_for_victory();
	},

	dig_selected: function () {
		for (var x = 0; x < this.play_state.grid_w; x++) {
			for (var y = 0; y < this.play_state.grid_h; y++) {
				if (this.play_state.selected_tiles[x][y] == 0) continue;
				this.play_state.selected_tiles[x][y] = 0;

				this.play_state.blocks[this.play_state.tiles[x][y]].uncover();	

				if (this.play_state.get_block_type(x,y) == 2) {

					// Store the x,y where we start the explosion effect
					this.play_state.start_game_over(x,y);

					this.change_state(this.engine, new GameOverStateClass(this.engine, this.play_state));
				}
			}
		}

		this.check_for_victory();
	},

	prev_highlighted_x: 0,
	prev_highlighted_y: 0,

	
	
	handle_mouse_move: function(engine,x,y) {

		

		this.prev_highlighted_x = this.highlighted_x;
		this.prev_highlighted_y = this.highlighted_y;

		this.highlighted_x = Math.round((x - 0.5*this.play_state.tile_size)/ this.play_state.tile_size);
		this.highlighted_y = Math.round((y - 0.5*this.play_state.tile_size)/ this.play_state.tile_size);

		
		
	},

	

	victory: false,

	check_for_victory: function() {

		for (var x = 0; x < this.play_state.grid_w; x++) {
			for (var y = 0; y < this.play_state.grid_h; y++) {
			
				var block_type = this.play_state.get_block_type(x,y);

				if (block_type == 2 &&
				    this.play_state.blocks[this.play_state.tiles[x][y]].flag_on == true) {
					continue;	// good!
				} else if (block_type != 2 &&
					   this.play_state.blocks[this.play_state.tiles[x][y]].covered_up == false) {
					continue; 	// good!
				} else if (block_type == 1) {
					// wall, we don't care about it
					continue;
				}

				

				return;
			}
		}

		this.victory = true;

		if (this.victory == true) {
			this.change_state(this.engine, new WinStateClass(this.engine, this.play_state));
		}

		
	},

	update: function() { 
		this.play_state.update();

		//if (this.play_state.game_over == true) {
			//this.change_state(this.engine, new GameOverStateClass(this.engine, this.play_state));
		//}
	},

	
	draw: function() {
		this.play_state.draw();

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
g_restart_button = null;
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

	init: function(engine, play_state) {

		play_screen_container.visible = true;

		this.engine = engine;
		this.play_state = play_state;

		this.play_state.game_over = false;

		this.timer = 3;

		g_all_level_status[this.play_state.current_level] = 2;	// timeout

		if (g_game_over_text == null) {
			g_game_over_text = new TextClass(Types.Layer.GAME_MENU);
			g_game_over_text.set_font(Types.Fonts.MEDIUM);
			g_game_over_text.set_text("WHOOPS!");
			g_game_over_text.update_pos(-999, -999);

			g_game_over_text2 = new TextClass(Types.Layer.GAME_MENU);
			g_game_over_text2.set_font(Types.Fonts.SMALL);
			g_game_over_text2.set_text("You hit a mine!");
			g_game_over_text2.update_pos(-999, -999);

			g_sharethis_text = new TextClass(Types.Layer.GAME_MENU);
			g_sharethis_text.set_font(Types.Fonts.SMALL);
			g_sharethis_text.set_text("Share your score: ");
			g_sharethis_text.update_pos(-999, -999);

			g_restart_text = new TextClass(Types.Layer.GAME_MENU);
			g_restart_text.set_font(Types.Fonts.SMALL);
			g_restart_text.set_text("Play again: ");
			g_restart_text.update_pos(-999, -999);

			g_final_score_text = new TextClass(Types.Layer.GAME_MENU);
			g_final_score_text.set_font(Types.Fonts.SMALL);
			g_final_score_text.set_text("Final score: ");
			g_final_score_text.update_pos(-999, -999);

			g_restart_button = new ButtonClass();
			g_restart_button.setup_sprite("new_icon.png",Types.Layer.GAME_MENU);
			g_restart_button.update_pos(screen_width + 200, screen_height*0.5);

			g_tweet_score_sprite = new ButtonClass();
			g_tweet_score_sprite.setup_sprite("twitter-48x48.png",Types.Layer.GAME_MENU);
			g_tweet_score_sprite.update_pos(-999, -999);


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

	arrange_screen: function () {
		if (screen_width > screen_height) {
			this.game_over_text_x = screen_width - 200;//10*this.play_state.tile_size;//screen_width - 96;
			this.game_over_text_y = 32;

			this.game_over_text2_x = screen_width - 200;//10*this.play_state.tile_size;//screen_width - 96;
			this.game_over_text2_y = 64;

			this.newgame_x = screen_width - 64;
			this.newgame_y = screen_height - 64;

			this.score_x = -999;
			this.score_y = -999;

			if (this.prompt_button == 1) {
				this.twitter_x = screen_width - 64;
				this.twitter_y = screen_height - 128 - 32;
			} else {
				this.twitter_y = -999;
			}
			
		} else {
			this.game_over_text_x = screen_width - 200;;
			this.game_over_text_y = screen_height - 128 - 32;

			this.game_over_text2_x = screen_width - 200;;
			this.game_over_text2_y = screen_height - 128;

			this.newgame_x = screen_width - 64;
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

		console.log('game over arrange screen');
	},

	screen_resized: function () {
		this.play_state.screen_resized();

		this.arrange_screen();

		//var h = screen_height/ratio;

		
	},

	
	handle_mouse_up: function(engine,x,y) {

		console.log('game over handle mouse up');

		x = mouse.x;
		y = mouse.y;

		if (x > this.newgame_x - 32 &&
		    x < this.newgame_x + 32 &&
		    y > this.newgame_y - 32 &&
		    y < this.newgame_y + 32) {

			this.play_state.score = 0;


			if (this.play_state.current_level < 4) {
				// gotta repeat tut levels until you win
			} else {
				// go to overworld - locked out
				this.change_state(this.engine, new OverworldStateClass(this.engine, this.play_state));
				return;
			}

			this.change_state(this.engine, new RestartGameStateClass(this.engine, this.play_state));
			//this.change_state(this.engine, new LoadingLevelStateClass(this.engine, this.play_state));
				
		} else if (x > this.twitter_x - 32 &&
		    	   x < this.twitter_x + 32 &&
		    	   y > this.twitter_y - 32 &&
		    	   y < this.twitter_y + 32) {
			tweetscore(this.play_state.score);
		}
	},

	cleanup: function() {
		g_restart_button.update_pos(-999, -999);
		g_game_over_text2.update_pos(-999, -999);
		g_game_over_text.update_pos(-999, -999);
		g_tweet_score_sprite.update_pos(-999, -999);
		g_sharethis_text.update_pos(-999, -999);
		g_restart_text.update_pos(-999, -999);
		g_final_score_text.update_pos(-999, -999);

		for (var x = 0; x < this.play_state.grid_w; x++) {
			for (var y = 0; y < this.play_state.grid_h; y++) {
				this.play_state.pop_sprites[x][y].stop_anim();
			}
		}

		play_screen_container.position.x = 0;
	},

	pop_x: [],
	pop_y: [],

	update: function() { 

		console.log('game over update');

		this.play_state.update();

		console.log('game over update   A');
		
		this.timer--;
		if (this.timer == 0) {

			console.log('game over update   B');

			this.timer = 10;
			
			if (this.pop_dist < 50) this.pop_dist += 0.2*this.pop_dist*this.pop_dist;

			if (this.pop_dist > 50) this.pop_dist = 50;

			

			for (var i = 0; i < this.pop_x.length; i++) {
				this.play_state.pop_sprites[this.pop_x[i]][this.pop_y[i]].draw();

				if (this.play_state.pop_sprites[this.pop_x[i]][this.pop_y[i]].curr_frame == 99) {
					this.pop_x.splice(i,1);
					this.pop_y.splice(i,1);
					i--;
					
				}
			}
			

			for (var i = 0; i < 20; i++) {

				console.log('this.pop_dist ' + this.pop_dist); 

				var x = Math.floor(this.pop_dist*Math.random());
				var y = Math.floor(this.pop_dist*Math.random());

				x = x + this.play_state.game_over_x;
				y = y + this.play_state.game_over_y;

				x = x - Math.floor(this.pop_dist*Math.random());;
				y = y - Math.floor(this.pop_dist*Math.random());;

				if (x < 0 || x > this.play_state.grid_w - 1 ||
				    y < 0 || y > this.play_state.grid_h - 1) continue;

				if (x == undefined || y == undefined) continue;
		
				x = Math.min(x, this.play_state.grid_w - 1);
				y = Math.min(y, this.play_state.grid_h - 1);

				x = Math.max(x, 0);
				y = Math.max(y, 0);

				console.log('x ' + x); console.log('y ' + y);

				if (this.play_state.pop_sprites[x][y].curr_frame != 99) continue;

				this.pop_x.push(x);
				this.pop_y.push(y);

				this.play_state.pop_sprites[x][y].start_anim();	

			}

			// show explosion sprite at all x, y that are this.pop_dist away from game_over_x / y

		
			



			if (this.pop_dist > this.play_state.grid_w + this.play_state.grid_h) {

			} else {
				
			}
		}


	},


	draw: function() {

		this.screenshake_x_pos += this.screenshake_x_vel;

		this.screenshake_x_vel -= this.screenshake_x_pos;

		this.screenshake_x_vel = 0.95*this.screenshake_x_vel;

		play_screen_container.position.x = this.screenshake_x_pos;	


		console.log('game over draw');

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

		g_restart_button.update_pos(this.newgame_x, this.newgame_y);
		if (screen_width > screen_height)  g_restart_text.update_pos(this.newgame_x - 128, this.newgame_y - 8);
		else g_restart_text.update_pos(this.newgame_x, this.newgame_y + 32);
		
		
		g_tweet_score_sprite.update_pos(this.twitter_x, this.twitter_y);
		if (screen_width > screen_height) g_sharethis_text.update_pos(this.twitter_x - 128, this.twitter_y - 16);
		else g_sharethis_text.update_pos(this.twitter_x, this.twitter_y + 32);

		
		console.log('game over draw B');
		
	}
});

// TextClass objects (see spritesheet.js), used only in TutStateClass

tut_text_1 = null;
tut_text_2 = null;
tut_text_3 = null;
tut_text_4 = null;
tut_text_5 = null;
tut_text_6 = null;
tut_text_7 = null;
tut_text_8 = null;
tut_text_9 = null;

TutStateClass = GameStateClass.extend({

	play_state: null,
	engine: null,

	// play_state.current_level < 4

	init: function(engine, play_state) {

		play_screen_container.visible = true;

		this.engine = engine;
		this.play_state = play_state;

		this.play_state.new_game(0);	// clear the board

		if (tut_text_1 == null) {
			tut_text_1 = new TextClass(Types.Layer.TILE);
			tut_text_1.set_font(Types.Fonts.MEDIUM);
			tut_text_1.set_text("Where are the mines hiding?"); //g_texts[language]["Tutorial"]
			tut_text_1.update_pos(-999, -999);


			tut_text_2 = new TextClass(Types.Layer.TILE);
			tut_text_2.set_font(Types.Fonts.SMALL);
			tut_text_2.set_text("If a white tile is safe then remove it");
			tut_text_2.update_pos(-999, -999);

			tut_text_3 = new TextClass(Types.Layer.TILE);
			tut_text_3.set_font(Types.Fonts.SMALL);
			tut_text_3.set_text("If a white tile is unsafe then put a flag on it");
			tut_text_3.update_pos(-999, -999);

		

			tut_text_4 = new TextClass(Types.Layer.TILE);
			tut_text_4.set_font(Types.Fonts.MEDIUM);
			tut_text_4.set_text("Some blocks have extra armor");
			tut_text_4.update_pos(-999, -999);

		
			tut_text_5 = new TextClass(Types.Layer.TILE);
			tut_text_5.set_font(Types.Fonts.MEDIUM);
			tut_text_5.set_text("Blocks extinguish fires");
			tut_text_5.update_pos(-999, -999);

			tut_text_6 = new TextClass(Types.Layer.TILE);
			tut_text_6.set_font(Types.Fonts.MEDIUM);
			tut_text_6.set_text("Blocks also squish bombs");
			tut_text_6.update_pos(-999, -999);

		

			tut_text_7 = new TextClass(Types.Layer.TILE);
			tut_text_7.set_font(Types.Fonts.MEDIUM);
			tut_text_7.set_text("Fire + fire = fire");
			tut_text_7.update_pos(-999, -999);

			tut_text_8 = new TextClass(Types.Layer.TILE);
			tut_text_8.set_font(Types.Fonts.MEDIUM);
			tut_text_8.set_text("You can set off more than 1...");
			tut_text_8.update_pos(-999, -999);

			tut_text_9 = new TextClass(Types.Layer.TILE);
			tut_text_9.set_font(Types.Fonts.MEDIUM);
			tut_text_9.set_text("And clear the screen!");
			tut_text_9.update_pos(-999, -999);
			

			for (var i = 0; i < 5; i++) {
				var yellow_square = new SquareClass();
				yellow_square.setup();
				yellow_square.colour = 0xFFEB45;
				yellow_square.hide();
				tut_highlight_squares.push(yellow_square);

				
			}
		}

		for(var i = 0; i < this.play_state.bg_squares.length; i++) this.play_state.bg_squares[i].alpha = 1;

		this.stage = 1;
		this.do_tut_stage(1);

		this.play_state.new_piece_obj.hide_help = false;
		this.play_state.new_piece_obj.calc_position();

		this.screen_resized();
	},

	set_tut_grid: function() {
		for (var x = 0; x < this.play_state.grid_w; x++) {
			for (var y = 0; y < this.play_state.grid_h; y++) {
				this.play_state.tut_no_grid[x][y] = 1;
			}
		}
		
	},

	update: function() { 
		this.play_state.update();

		
	},

	draw: function() {
		this.play_state.draw();


		
	},


	prev_highlighted_x: 0,
	prev_highlighted_y: 0,

	only_clicked_new_peice: false,	// only clicked on new peice - rotate

	handle_mouse_move: function(engine,x,y) {

		this.prev_highlighted_x = this.highlighted_x;
		this.prev_highlighted_y = this.highlighted_y;

		this.highlighted_x = Math.round((x - 0.5*this.play_state.tile_size)/ this.play_state.tile_size);
		this.highlighted_y = Math.round((y - 0.5*this.play_state.tile_size)/ this.play_state.tile_size);

	},


	handle_mouse_down: function(engine,x,y) {

		
	
		if (this.mouse_down == true) {
			return;
		}

		this.mouse_down = true;

		this.handle_mouse_move(engine,x,y);

		if (mouse.y > screen_height - 100 &&
		    mouse.x > screen_width - 100) return;	// undo button

		if (mouse.y > screen_height - 100 &&
		    mouse.x < 100) return;	// menu button

		
		//.new_piece_obj
		this.grabbing_new_piece = this.play_state.new_piece_obj.player_grab(x,y);

		if (this.grabbing_new_piece == true) this.only_clicked_new_peice = true;

	},

	wheel_rotate_timer: 0,

	handle_wheel: function () {
		console.log('mouse wheeeeeeeeel');
		if (this.wheel_rotate_timer > 0) this.wheel_rotate_timer--;
		else {
			this.wheel_rotate_timer = 3;
			this.play_state.new_piece_obj.rotate_with_effect();
		}
	},
	

	handle_mouse_up: function(engine,x,y) {

		//if (mouse.x > screen_width - 100 &&
		//    mouse.y > screen_height - 100) this.undo();

		this.mouse_down = false;

		if (this.grabbing_new_piece == true) {
			this.play_state.new_piece_obj.player_drop_tut(this.highlighted_x,this.highlighted_y);

			// if all we did with the new peice was click on it:
			if (this.only_clicked_new_peice == true) {
				this.play_state.new_piece_obj.rotate_with_effect();
			}

		}
		this.grabbing_new_piece = false;

		//this.stage++;
		//this.do_tut_stage(this.stage);

		

		
	},

	text_x: 0,
	text_y: 0,
	text_w: 0,

	do_tut_stage: function (stage_n) {

		

		this.play_state.new_piece_obj.load_tut_pattern(stage_n - 1);

		this.set_tut_grid();

		for (var i = 0; i < tut_highlight_squares.length; i++) tut_highlight_squares[i].hide();

		var t = this.play_state.tile_size;

		if (stage_n == 0) {
			// all cards to SHUFFLE deck (but dont do shuffle anim)

			
		} else if (stage_n == 1) {
			
			this.play_state.tut_no_grid[2][4] = 0;
			this.play_state.tut_no_grid[3][4] = 0;
			this.play_state.tut_no_grid[4][4] = 0;
			this.play_state.tut_no_grid[5][4] = 0;
			this.play_state.tut_no_grid[6][4] = 0;

			tut_highlight_squares[0].update_pos(2*t, 4*t, t, t);
			tut_highlight_squares[1].update_pos(3*t, 4*t, t, t);
			tut_highlight_squares[2].update_pos(4*t, 4*t, t, t);
			tut_highlight_squares[3].update_pos(5*t, 4*t, t, t);
			tut_highlight_squares[4].update_pos(6*t, 4*t, t, t);

			// text: 
			tut_text_1.update_pos(this.text_x, this.text_y);
		} else if (stage_n == 2) {

			this.play_state.tut_no_grid[3][2] = 0;
			this.play_state.tut_no_grid[4][2] = 0;
			this.play_state.tut_no_grid[5][2] = 0;
			this.play_state.tut_no_grid[6][2] = 0;
			this.play_state.tut_no_grid[6][3] = 0;

			tut_highlight_squares[0].update_pos(3*t, 2*t, t, t);
			tut_highlight_squares[1].update_pos(4*t, 2*t, t, t);
			tut_highlight_squares[2].update_pos(5*t, 2*t, t, t);
			tut_highlight_squares[3].update_pos(6*t, 2*t, t, t);
			tut_highlight_squares[4].update_pos(6*t, 3*t, t, t);

			// text: 
			tut_text_1.update_pos(-999, -999);
			tut_text_2.update_pos(this.text_x, this.text_y);


		} else if (stage_n == 3) {

			this.play_state.tut_no_grid[3][2] = 0;
			this.play_state.tut_no_grid[3][3] = 0;
			this.play_state.tut_no_grid[4][3] = 0;
			this.play_state.tut_no_grid[5][3] = 0;
			this.play_state.tut_no_grid[5][2] = 0;

			tut_highlight_squares[0].update_pos(3*t, 2*t, t, t);
			tut_highlight_squares[1].update_pos(3*t, 3*t, t, t);
			tut_highlight_squares[2].update_pos(4*t, 3*t, t, t);
			tut_highlight_squares[3].update_pos(5*t, 3*t, t, t);
			tut_highlight_squares[4].update_pos(5*t, 2*t, t, t);

			// text: 

			tut_text_2.update_pos(-999, -999);
			tut_text_3.update_pos(this.text_x, this.text_y);
		} else if (stage_n == 4) {

			this.play_state.tut_no_grid[4][3] = 0;
			this.play_state.tut_no_grid[4][4] = 0;
			this.play_state.tut_no_grid[4][5] = 0;
			this.play_state.tut_no_grid[4][6] = 0;
			this.play_state.tut_no_grid[4][7] = 0;

			tut_highlight_squares[0].update_pos(4*t, 3*t, t, t);
			tut_highlight_squares[1].update_pos(4*t, 4*t, t, t);
			tut_highlight_squares[2].update_pos(4*t, 5*t, t, t);
			tut_highlight_squares[3].update_pos(4*t, 6*t, t, t);
			tut_highlight_squares[4].update_pos(4*t, 7*t, t, t);

			// text: 
			tut_text_3.update_pos(-999, -999);
			tut_text_4.update_pos(this.text_x, this.text_y);
			

		} else if (stage_n == 5) {

			this.play_state.tut_no_grid[4][7] = 0;
			this.play_state.tut_no_grid[5][6] = 0;
			this.play_state.tut_no_grid[5][7] = 0;
			this.play_state.tut_no_grid[6][6] = 0;
			this.play_state.tut_no_grid[6][7] = 0;

			tut_highlight_squares[0].update_pos(4*t, 7*t, t, t);
			tut_highlight_squares[1].update_pos(5*t, 6*t, t, t);
			tut_highlight_squares[2].update_pos(5*t, 7*t, t, t);
			tut_highlight_squares[3].update_pos(6*t, 6*t, t, t);
			tut_highlight_squares[4].update_pos(6*t, 7*t, t, t);


			// text: 
			tut_text_4.update_pos(-999, -999);
			tut_text_5.update_pos(this.text_x, this.text_y);

		} else if (stage_n == 6) {

			this.play_state.tut_no_grid[4][4] = 0;
			this.play_state.tut_no_grid[5][4] = 0;
			this.play_state.tut_no_grid[5][5] = 0;
			this.play_state.tut_no_grid[6][5] = 0;
			this.play_state.tut_no_grid[6][6] = 0;

			tut_highlight_squares[0].update_pos(4*t, 4*t, t, t);
			tut_highlight_squares[1].update_pos(5*t, 4*t, t, t);
			tut_highlight_squares[2].update_pos(5*t, 5*t, t, t);
			tut_highlight_squares[3].update_pos(6*t, 5*t, t, t);
			tut_highlight_squares[4].update_pos(6*t, 6*t, t, t);

			// text: 
			tut_text_5.update_pos(-999, -999);
			tut_text_6.update_pos(this.text_x, this.text_y);

			

		} else if (stage_n == 7) {

			this.play_state.tut_no_grid[4][4] = 0;
			this.play_state.tut_no_grid[3][4] = 0;
			this.play_state.tut_no_grid[2][4] = 0;
			this.play_state.tut_no_grid[3][3] = 0;
			this.play_state.tut_no_grid[3][5] = 0;

			tut_highlight_squares[0].update_pos(4*t, 4*t, t, t);
			tut_highlight_squares[1].update_pos(3*t, 4*t, t, t);
			tut_highlight_squares[2].update_pos(2*t, 4*t, t, t);
			tut_highlight_squares[3].update_pos(3*t, 3*t, t, t);
			tut_highlight_squares[4].update_pos(3*t, 5*t, t, t);

			tut_text_6.update_pos(-999, -999);
			tut_text_7.update_pos(this.text_x, this.text_y);
		} else if (stage_n == 8) {

			this.play_state.tut_no_grid[2][2] = 0;
			this.play_state.tut_no_grid[3][2] = 0;
			this.play_state.tut_no_grid[4][2] = 0;
			this.play_state.tut_no_grid[5][2] = 0;
			this.play_state.tut_no_grid[6][2] = 0;

			tut_highlight_squares[0].update_pos(2*t, 2*t, t, t);
			tut_highlight_squares[1].update_pos(3*t, 2*t, t, t);
			tut_highlight_squares[2].update_pos(4*t, 2*t, t, t);
			tut_highlight_squares[3].update_pos(5*t, 2*t, t, t);
			tut_highlight_squares[4].update_pos(6*t, 2*t, t, t);


			tut_text_7.update_pos(-999, -999);
			tut_text_8.update_pos(this.text_x, this.text_y);

			
		}  else if (stage_n == 9) {

			this.play_state.tut_no_grid[3][2] = 0;
			this.play_state.tut_no_grid[4][2] = 0;
			this.play_state.tut_no_grid[5][2] = 0;
			this.play_state.tut_no_grid[4][1] = 0;
			this.play_state.tut_no_grid[4][3] = 0;

			tut_highlight_squares[0].update_pos(3*t, 2*t, t, t);
			tut_highlight_squares[1].update_pos(3*t, 2*t, t, t);
			tut_highlight_squares[2].update_pos(5*t, 2*t, t, t);
			tut_highlight_squares[3].update_pos(4*t, 1*t, t, t);
			tut_highlight_squares[4].update_pos(4*t, 3*t, t, t);

			tut_text_8.update_pos(-999, -999);
			tut_text_9.update_pos(this.text_x, this.text_y);
			
		} else if (stage_n == 10) {

			tut_text_9.update_pos(-999, -999);
			this.change_state(this.engine, new StartGameStateClass(this.engine, this.play_state));
		}
	},

	screen_resized: function () {
		this.play_state.screen_resized();

		var h = screen_height/ratio;

		if (screen_width > screen_height) {

			this.text_x = 8.5*this.play_state.tile_size;
			this.text_y = this.play_state.tile_size;
			this.text_w = 4*this.play_state.tile_size;
			return;
			this.text_x = this.play_state.tile_size*2;//;8.5*this.play_state.tile_size;
			this.text_y = this.play_state.tile_size*9;//h/2 + 120;
			this.text_w = this.play_state.tile_size*12;//96*7.5;
		} else {
			this.text_x = 32;
			this.text_y = h/2 + 120;
			this.text_w = 96*8.5;
		}
	},

	cleanup: function() {
		tut_text_1.update_pos(-999, -999);
		tut_text_2.update_pos(-999, -999);
		tut_text_3.update_pos(-999, -999);
		tut_text_4.update_pos(-999, -999);
		tut_text_5.update_pos(-999, -999);
		tut_text_6.update_pos(-999, -999);
		tut_text_7.update_pos(-999, -999);
		tut_text_8.update_pos(-999, -999);
		tut_text_9.update_pos(-999, -999);
	
		tut_highlight_squares[0].hide();
		tut_highlight_squares[1].hide();
		tut_highlight_squares[2].hide();
		tut_highlight_squares[3].hide();
		tut_highlight_squares[4].hide();


	}

});

g_is_the_current_level_loaded = false;

g_all_level_data_floor_layer = {};
g_all_level_data_cover_layer = {};


LoadingLevelStateClass = GameStateClass.extend({

	done_: null,
	play_state: null,
	engine: null,

	already_loaded: false,

	init: function(engine, play_state, level_num) {
		//load_script_assets(['level1.json'],this.callback);

		//$.loadJSON(['level1.json'],this.callback);

		this.play_state = play_state;
		this.engine = engine;

		g_is_the_current_level_loaded = false;

		if (g_all_level_data_floor_layer[level_num] == null) {
			// not yet loaded
			console.log(level_num.toString() + ' not yet loaded');
			var first_in_file = Math.floor(level_num / 10)*10;

			console.log('first_in_file '+first_in_file.toString());
			
			var last_in_file = first_in_file + 9;
			

			var file_n = 'levels/level' + first_in_file.toString() + 'to' + last_in_file + '.json';

			console.log(file_n);

			//load_level_from_file('levels/level1to10.json',function() {
			//					g_is_the_current_level_loaded = true;
			//					});

			load_level_from_file(file_n,function() {
								g_is_the_current_level_loaded = true;
								});
			
		} else {
			console.log(level_num.toString() + ' already loaded');
			this.already_loaded = true;
		}

		console.log('loding level init');
		
	},

	screen_resized : function (engine) {
		this.play_state.screen_resized(engine);
	},
	
	update:function(engine) {

		console.log('loding...');

		if (this.already_loaded == true) {
			this.change_state(this.engine, new RestartGameStateClass(this.engine, this.play_state));

			return;

		}

		//console.log('g_is_the_current_level_loaded' + g_is_the_current_level_loaded );
		if(g_is_the_current_level_loaded == true) {
			g_is_the_current_level_loaded = false;

			var num_levels_in_this_file = g_current_level_data.floor.length;
			var first_level_in_this_file = g_current_level_data.levels_starting_from;
			var last_level = first_level_in_this_file  + num_levels_in_this_file ;

			for (var i = first_level_in_this_file; i < last_level; i++) {
				// is this a deep copy?
				//g_all_level_data_floor_layer[i] = g_current_level_data.floor[i - first_level_in_this_file].slice(0);
				//g_all_level_data_cover_layer[i] = g_current_level_data.cover[i - first_level_in_this_file].slice(0);

				console.log('storing level ' + i);

				g_all_level_data_floor_layer[i] = new Array(10);
				g_all_level_data_cover_layer[i] = new Array(10);

				g_all_level_status[i] = 1;	// available

				for (var x = 0; x < 10; x++) {
					g_all_level_data_floor_layer[i][x] = new Array(10);
					g_all_level_data_cover_layer[i][x] = new Array(10);

					for (var y = 0; y < 10; y++) {
						var floor_ = g_current_level_data.floor[i - first_level_in_this_file][x][y];
						g_all_level_data_floor_layer[i][x][y] = floor_;

						var cover_ = g_current_level_data.cover[i - first_level_in_this_file][x][y];
						g_all_level_data_cover_layer[i][x][y] = cover_;
					}
				}
			}

			//var level_to_load = 0;	
			//var mapdata_version_mines = 1;
			//this.play_state.current_level = level_to_load;

			// this.play_state.current_level was set when this state was created

			//this.play_state.load_level(level_to_load, mapdata_version_mines); // 

			this.change_state(this.engine, new RestartGameStateClass(this.engine, this.play_state));

			//this.change_state(this.engine, new OverworldStateClass(this.engine, this.play_state));
				
			
		}
	},
});

g_overworld_sprites = null;
g_total_num_of_levels = 13;

g_all_level_status = {};	// 1 - available,  2  - timeout, 3 - lock,  4 - tick

g_overworld_text = null;

g_overworld_fb_button = null;
g_overworld_fb_text = null;

OverworldStateClass = GameStateClass.extend({
	play_state: null,
	engine: null,

	fb_x: 0,
	fb_y: 0,

	init: function(engine, play_state) {

		//play_screen_container.visible = false;

	

		this.engine = engine;
		this.play_state = play_state;

		

		if (g_overworld_sprites == null) {
			g_overworld_sprites = new OverworldSpritesClass(this.play_state);

			g_overworld_text = new TextClass(Types.Layer.GAME_MENU);
			g_overworld_text.set_font(Types.Fonts.LARGE);
			g_overworld_text.set_text("LEVELS");

			g_overworld_fb_text = new TextClass(Types.Layer.GAME_MENU);
			g_overworld_fb_text.set_font(Types.Fonts.SMALL);
			g_overworld_fb_text.set_text("FOLLOW US FOR MORE");

			g_overworld_fb_button = new SpriteClass();
			g_overworld_fb_button.setup_sprite('facebook-24x24.png',Types.Layer.GAME_MENU);
			

			for (var i = 0; i < g_total_num_of_levels; i++) {
				if (i == 0) g_overworld_sprites.add_level('hand.png');
				else if (i == 4) g_overworld_sprites.add_level('eye.png');
				else g_overworld_sprites.add_level();

				if (g_all_level_status[i] == null) {
					g_all_level_status[i] = 1;
					if (i > 8) g_all_level_status[i] = 3;
				}
				
			}
		}

		this.play_state.reset();
		for (var x = 0; x < this.play_state.grid_w; x++) {
			for (var y = 0; y < this.play_state.grid_h; y++) {
				
				this.play_state.blocks[this.play_state.tiles[x][y]].preset_hint(0);
				this.play_state.blocks[this.play_state.tiles[x][y]].uncover();
				this.play_state.blocks[this.play_state.tiles[x][y]].reset();
			}
		}

		// show the levels to select...
		// on mouse up - check what level was selected

		for (var level in g_all_level_status) {
			if (g_all_level_status[level] == 2) {
				// timeout
				g_overworld_sprites.set_status(level, 2);

			} else if (g_all_level_status[level] == 3) {
				// lock
				g_overworld_sprites.set_status(level, 3);

			} else if (g_all_level_status[level] == 4) {
				// tick
				g_overworld_sprites.set_status(level, 4);

			} else {
				g_overworld_sprites.no_status(level);
			}
		}
		
		g_overworld_sprites.make_vis();

		g_overworld_text.update_pos(32, 32);

		g_overworld_fb_button.make_vis();

		this.screen_resized();

	},

	cleanup: function () {
		g_overworld_sprites.hide();

		g_overworld_text.update_pos(-999, -999);

		g_overworld_fb_button.hide();
		g_overworld_fb_text.update_pos(-999, -999);

		//play_screen_container.visible = true;
	},

	screen_resized: function () {

		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();

		if (yyyy >= 2017) {


			this.fb_x = screen_width - 32;
			this.fb_y = screen_height - 32;
		

		} else {
			this.fb_x = -999;
			this.fb_y = -999;

		}

		g_overworld_fb_button.update_pos(this.fb_x, this.fb_y);
		g_overworld_fb_text.update_pos(this.fb_x - 255, this.fb_y - 10);
	},

	go_to_fb: function() {
		window.open('https://www.facebook.com/Mine-of-Sight-1037635096381976');
	},

	handle_mouse_down: function(engine,x,y) {
		
		

	},

	handle_mouse_up: function(engine,x,y) {
		this.mousedown = false;
		g_overworld_sprites.click(x,y);
		if (g_overworld_sprites.selected != -1) {

			console.log('LEVEL ' + g_overworld_sprites.selected);

			this.play_state.current_level = g_overworld_sprites.selected;
			//this.play_state.load_level(g_overworld_sprites.selected);

			//this.change_state(this.engine, new RestartGameStateClass(this.engine, this.play_state));

			
			this.change_state(this.engine, new LoadingLevelStateClass(this.engine, this.play_state, this.play_state.current_level));
			
		}

		if (mouse.x > this.fb_x - 16 &&
		    mouse.x < this.fb_x + 16 &&
		    mouse.y > this.fb_y - 16 &&
		    mouse.y < this.fb_y + 16) {
			this.go_to_fb();
		}

	},

	mousedown: false,
	
	handle_mouse_down: function(engine,x,y) {
		if (this.mousedown == true) return;
		this.mousedown = true;
		g_overworld_sprites.highlight_on(x,y);
	},

	update: function() { 

	},

	draw: function() {

	}


});

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

MenuStateClass = GameStateClass.extend({
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

		play_screen_container.visible = true;

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
			g_game_name_text.set_font(Types.Fonts.LARGE);
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

g_next_level_button = null;
g_next_level_text = null;
g_win_message = null;

WinStateClass = GameStateClass.extend({

	play_state: null,
	engine: null,

	next_x: 0,
	next_y: 0,


	init: function(engine, play_state){

		

		play_screen_container.visible = true;
		this.play_state = play_state;
		this.engine = engine;

		g_all_level_status[this.play_state.current_level] = 4;

		if (g_next_level_button == null) {
			g_next_level_button = new ButtonClass();
			g_next_level_button.setup_sprite("play_icon.png",Types.Layer.GAME_MENU);
			g_next_level_button.update_pos(screen_width + 200, screen_height*0.5);

			g_next_level_text = new TextClass(Types.Layer.GAME_MENU);
			g_next_level_text.set_font(Types.Fonts.SMALL);
			g_next_level_text.set_text("NEXT LEVEL:");

			g_win_message = new TextClass(Types.Layer.GAME_MENU);
			g_win_message.set_font(Types.Fonts.MEDIUM);
			g_win_message.set_text("SOLVED!");


			
		}


		this.screen_resized();

	},

	screen_resized: function () {
		this.play_state.screen_resized();

		if (screen_width > screen_height) {
			this.next_x = screen_width - 64;
			this.next_y = screen_height - 64;

			
		} else {
			this.next_x = screen_width - 64;
			this.next_y = screen_height - 64;
		}

		if (screen_width > screen_height) g_win_message.update_pos(screen_width - 128,32);		
		else g_win_message.update_pos(screen_width - 128,screen_height - 128);

		g_next_level_button.update_pos(this.next_x, this.next_y);	// offscreen
		g_next_level_text.update_pos(this.next_x - 138, this.next_y - 8);


	},

	update: function() { 
		this.play_state.update();

	},

	cleanup: function() {
		g_win_message.update_pos(-999, -999);	// offscreen	
		g_next_level_button.update_pos(-999, -999);	// offscreen
		g_next_level_text.update_pos(-999, -999);
	},

	draw: function() {
		this.play_state.draw();


	},

	handle_mouse_up: function(engine,x,y) {
		if (mouse.x > this.next_x - 32 && mouse.x < this.next_x + 32 &&
		    mouse.y > this.next_y - 32 && mouse.y < this.next_y + 32) {

			if (this.play_state.current_level < 4) {
				// go through tut levels linearly
				this.play_state.current_level++;
			} else {
				// random new level
				//this.play_state.current_level = Math.round(5*Math.random());
				//if (this.play_state.current_level < 4) this.play_state.current_level = 4;

				this.play_state.current_level++;
			}

			if (this.play_state.current_level > g_total_num_of_levels) {
				this.play_state.current_level = 5;
			}


			//this.change_state(this.engine, new RestartGameStateClass(this.engine, this.play_state));
			this.change_state(this.engine, new LoadingLevelStateClass(this.engine, this.play_state, this.play_state.current_level));
		}
	}
});

ShowAdStateClass = GameStateClass.extend({

});



BootStateClass = GameStateClass.extend({

	init: function(){

		console.log('boot state init');


	},

	handle_events: function(engine,x,y,event_type){
		
		//if(this.wait_timer > 0) {return;}


		if(event_type == Types.Events.MOUSE_CLICK) {
			// User clicked at (x,y)
			
			this.start_game (engine);


		}
		
	},

	start_game: function (engine) {
		var play_state = new PlayStateClass(engine);

		engine.push_state(play_state);

		play_state.screen_resized();

		// Start the game
		//engine.push_state(new RestartGameStateClass(engine, engine.get_state()));

		// MenuStateClass
		//engine.push_state(new MenuStateClass(engine, engine.get_state()));

		// Loading Level 0
		engine.push_state(new LoadingLevelStateClass(engine, engine.get_state(), 0));

		play_state.reset();
		//play_state.new_game();

		
	
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
