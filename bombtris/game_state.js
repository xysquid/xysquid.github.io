// http://gamedevgeek.com/tutorials/managing-game-states-in-c/

GameStateClass = Class.extend({

	

	init: function(){
		
	},

  	cleanup: function(){},

  	pause: function(){},
  	resume: function(){},

	screen_resized: function(){},

  	handle_events: function(engine,x,y, event_type){

		if (event_type == Types.Events.MOUSE_CLICK|| event_type == Types.Events.MOUSE_UP || event_type == Types.Events.MOUSE_CLICK_RIGHT) {
			//this.handle_click(engine,x,y,event_type);
		} else if (event_type == Types.Events.MOUSE_MOVE) {
			this.handle_mouse_move(engine,x,y);

			if (mousedown && x > mouse_down_x + 32) {
				this.handle_key(engine,Types.Events.KEY_RIGHT);
				mouse_down_x = x;
				mouse_down_y = y;
			} else if (mousedown && x < mouse_down_x - 32) {
				this.handle_key(engine,Types.Events.KEY_LEFT);
				mouse_down_x = x;
				mouse_down_y = y;
			} else if (mousedown && y < mouse_down_y - 24) {
				this.handle_key(engine,Types.Events.KEY_UP);
				mouse_down_x = x;
				mouse_down_y = y;
			} else if (mousedown && y > mouse_down_y + 24) {
				this.handle_key(engine,Types.Events.KEY_DOWN);
				mouse_down_x = x;
				mouse_down_y = y;
			}

		} else {
			this.handle_key(engine,event_type);
		}

		if(event_type == Types.Events.MOUSE_CLICK) {
			this.handle_mouse_down(engine,x,y);
		}

		if(event_type == Types.Events.MOUSE_UP) {
			this.handle_mouse_up(engine,x,y,event_type);
		}

	},

	update_bullets: function() {},	// Function called between normal updates

	handle_key:function(engine,event_type){},
	handle_click: function(engine,x,y,event_type){},
	handle_mouse_down: function(engine,x,y){},
	handle_mouse_up: function(engine,x,y){},
	handle_mouse_move: function(engine,x,y){},
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

	tile_size: 64,

	draw_timer: 0,

	engine: null,

	map_w: 10,
	map_h: 10,
	map_size: 10,
	
	tiles: new Array(10),

	tiles_shake: new Array(10),
	shake_timer: 0,

	tiles_red: new Array(10),
	red_timer: 0,

	tiles_die: new Array(10),
	die_timer: 0,

	tiles_explode: new Array(10),
	explode_timer: 0,

	bomb_pop_timer: 0,

	new_piece_one: new Array(5),
	new_piece_two: new Array(5),
	new_piece_three: new Array(5),
	temp_rotation_grid: new Array(5),

	game_over: false,

	score: 0,
	high_score: 0,

	init: function(engine){

		
		this.engine = engine;

		// Set up background
		this.draw_rect_background(0,0,2*screen_width+2*screen_height, 2*screen_width+2*screen_height, 0x221E33); //12101C // FFFEF8
		//this.draw_background();
		this.tile_size = 64;//16;   //96;//screen_width/9;//64;	// 32 -> 8

		for(var i = 0; i < this.map_size; i++) {
			this.tiles[i] = new Array(this.map_size);
			this.tiles_shake[i] = new Array(this.map_size);
			this.tiles_red[i] = new Array(this.map_size);
			this.tiles_die[i] = new Array(this.map_size);
			this.tiles_explode[i] = new Array(this.map_size);
		}

		for(var x = 0; x < this.map_size; x++) {
			for(var y = 0; y < this.map_size; y++) {
				this.tiles[x][y] = 0;
				this.tiles_shake[x][y] = 0;
				this.tiles_red[x][y] = 0;
				this.tiles_die[x][y] = 0;
				this.tiles_explode[x][y] = 7;	// rest
								// set to 1, goes through the 5 explode frames
								// set to negative: delay
			}
		}

		for(var i = 0; i < 5; i++) {
			this.new_piece_one[i] = new Array(5);
			this.new_piece_two[i] = new Array(5);
			this.new_piece_three[i] = new Array(5);
			this.temp_rotation_grid[i] = new Array(5);
		}

		for(var x = 0; x < 3; x++) {
			for(var y = 0; y < 3; y++) {
				this.new_piece_one[x][y] = 0;
				this.new_piece_two[x][y] = 0;
				this.new_piece_three[x][y] = 0;
			}
		}
		
		this.screen_resized(engine);
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
		background_container.addChild(graphics);
	},

	draw_background : function () {
		// Palette URL: http://paletton.com/#uid=7010Z0kjpoY9q5FenfFn1vSqcQi
		// 19241A
		// 0x0366239
		//
		
		//renderer.backgroundColor = 0x12101C;

		// game area
		//this.draw_rect_background(0,
		//			  0,
		//			  2000,
		//			  2000, 0x0366239);

		this.draw_triangle_background(0,0,this.tile_size,0,0,this.tile_size,0xCCF280,0.02);
		this.draw_triangle_background(0,0,2*this.tile_size,0,0,2*this.tile_size,0xCCF280,0.02);
		this.draw_triangle_background(0,0,4*this.tile_size,0,0,4*this.tile_size,0xCCF280,0.02);
		this.draw_triangle_background(0,0,6*this.tile_size,0,0,6*this.tile_size,0xCCF280,0.02);
		this.draw_triangle_background(0,0,8*this.tile_size,0,0,8*this.tile_size,0xCCF280,0.02);
		this.draw_triangle_background(0,0,10*this.tile_size,0,0,10*this.tile_size,0xCCF280,0.02);
		this.draw_triangle_background(0,0,12*this.tile_size,0,0,12*this.tile_size,0xCCF280,0.02);
		this.draw_triangle_background(0,0,14*this.tile_size,0,0,14*this.tile_size,0xCCF280,0.02);

		/*this.draw_triangle_background(2*screen_width,screen_height/2, 														screen_width/2,2*screen_height,
						2*screen_width,2*screen_height,0x0ff00ff,0.05);
		this.draw_triangle_background(screen_width - screen_width/4,screen_height, 												screen_width,screen_height/4,
						screen_width,screen_height,0x0ff00ff,0.05);
		*/

	},

	game_over_timer: 60,

	reset: function() {

		this.game_over = false;
		this.game_over_timer = 60;

		for(var x = 0; x < this.map_size; x++) {
			for(var y = 0; y < this.map_size; y++) {
				this.tiles[x][y] = 0;
			}
		}

		this.remake_new_piece(1);
		this.remake_new_piece(2);
		this.remake_new_piece(3);
	},

	

	rotate_new_piece: function(num) {
		var p_piece = null;
		if (num == 1) p_piece = this.new_piece_one;
		else if (num == 2) p_piece = this.new_piece_two;
		else if (num == 3) p_piece = this.new_piece_three;
		else return;

		for (var x = 0; x < 5; x++) {
			for (var y = 0; y < 5; y++) {
				this.temp_rotation_grid[x][y] = p_piece[x][y];
			}
		}

		


		p_piece[0][0] = this.temp_rotation_grid[0][4];
		p_piece[1][0] = this.temp_rotation_grid[0][3];
		p_piece[2][0] = this.temp_rotation_grid[0][2];
		p_piece[3][0] = this.temp_rotation_grid[0][1];
		p_piece[4][0] = this.temp_rotation_grid[0][0];

		// hard...

		p_piece[0][1] = this.temp_rotation_grid[1][2];
		p_piece[1][1] = this.temp_rotation_grid[1][1];
		p_piece[2][1] = this.temp_rotation_grid[1][0];

		p_piece[0][2] = this.temp_rotation_grid[2][2];
		p_piece[1][2] = this.temp_rotation_grid[2][1];
		p_piece[2][2] = this.temp_rotation_grid[2][0];

		for (var x = 0; x < 5; x++) {
			for (var y = 0; y < 5; y++) {
				p_piece[x][y] = this.temp_rotation_grid[y][4 - x];
			}
		}

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


	},

	load_new_piece: function(num) {
		var p_piece = null;
		if (num == 1) p_piece = this.new_piece_one;
		else if (num == 2) p_piece = this.new_piece_two;
		else if (num == 3) p_piece = this.new_piece_three;
		else return;

		var rand = Math.floor(Math.random()*block_patterns.length);

		p_piece[0][0] = block_patterns[rand][0];
		p_piece[1][0] = block_patterns[rand][1];
		p_piece[2][0] = block_patterns[rand][2];
		p_piece[3][0] = block_patterns[rand][3];
		p_piece[4][0] = block_patterns[rand][4];

		p_piece[0][1] = block_patterns[rand][5];
		p_piece[1][1] = block_patterns[rand][6];
		p_piece[2][1] = block_patterns[rand][7];
		p_piece[3][1] = block_patterns[rand][8];
		p_piece[4][1] = block_patterns[rand][9];

		p_piece[0][2] = block_patterns[rand][10];
		p_piece[1][2] = block_patterns[rand][11];
		p_piece[2][2] = block_patterns[rand][12];
		p_piece[3][2] = block_patterns[rand][13];
		p_piece[4][2] = block_patterns[rand][14];

		p_piece[0][3] = block_patterns[rand][15];
		p_piece[1][3] = block_patterns[rand][16];
		p_piece[2][3] = block_patterns[rand][17];
		p_piece[3][3] = block_patterns[rand][18];
		p_piece[4][3] = block_patterns[rand][19];

		p_piece[0][4] = block_patterns[rand][20];
		p_piece[1][4] = block_patterns[rand][21];
		p_piece[2][4] = block_patterns[rand][22];
		p_piece[3][4] = block_patterns[rand][23];
		p_piece[4][4] = block_patterns[rand][24];

		

		//var rot_ = Math.floor(Math.random()*4);

		//for(var i = 0; i < rot_; i++) this.rotate_new_piece(num);

		// add bombs and fire
		var bombx = -4; 
		var bomby = -4; 
		var bomb = 0;
		var fire = 0;
		
		for(var x = 0; x < 5; x++) {
			if (bomb == 1) break;
			for(var y = 0; y < 5; y++) {
				if (bomb == 1) break;
				if (p_piece[x][y] == 1 && Math.random() < 0.25) {
					p_piece[x][y] = 2;
					bombx = x;
					bomby = y;
					bomb = 1;
					
				}
			}
		}
		

		
		for(var x = 0; x < 5; x++) {
				if (fire == 1) break;
				for(var y = 0; y < 5; y++) {
					if (fire == 1) break;
					if (p_piece[x][y] == 1 && 
					    Math.random() < 0.33 &&
					    Math.abs(x - bombx) + Math.abs(y - bomby) > 1) {
						p_piece[x][y] = 3;
						fire = 1;
					}
				}
		}

		if (Math.random() < 0.5) {
			for(var x = 0; x < 5; x++) {
				for(var y = 0; y < 5; y++) {
					if (p_piece[x][y] == 2) p_piece[x][y] = 3;
					else if (p_piece[x][y] == 3) p_piece[x][y] = 2;
				}
			}
		}

		// extra block HP
		for(var x = 0; x < 5; x++) {
				for(var y = 0; y < 5; y++) {
					if (p_piece[x][y] == 1 && Math.random() < 0.5 )  {
						p_piece[x][y] = 8;
						if (Math.random() < 0.33) p_piece[x][y] = 9;
					}
				}
		}

		

	},

	// 0 empty
	// 1 wild / blank
	// 2 3 4 5 - heart diamonf spade club

	remake_new_piece: function(num) {
	
		for (var i = 0; i < 16; i++) {
			this.load_new_piece(num);

			var matches = this.scan_for_matches();
			if (matches == 1) return;

			this.rotate_new_piece(1);
			matches = this.scan_for_matches();
			if (matches == 1) return;

			this.rotate_new_piece(1);
			matches = this.scan_for_matches();
			if (matches == 1) return;

			this.rotate_new_piece(1);
			matches = this.scan_for_matches();
			if (matches == 1) return;
		}

		this.load_new_piece(num);
		var matches = this.scan_for_matches();
		if (matches == -1) this.load_new_piece(num);
		

		
	},

	

	screen_resized : function (engine) { 

		if (screen_width < screen_height) {
			// phone
			this.NEW_PIECE_X = 3.5;
			this.NEW_PIECE_Y = 11;

			this.SCORE_X = 1;
			this.SCORE_Y = 11;
			this.SCORE_X_OFF = 0;
			this.SCORE_Y_OFF = 0.5;
		} else {
			this.NEW_PIECE_X = 11;
			this.NEW_PIECE_Y = 3.5;

			
			this.SCORE_X = 11;
			this.SCORE_Y = 1;
			this.SCORE_X_OFF = 0;
			this.SCORE_Y_OFF = 0.5;
		}
	},

	full_rows: [0,0,0,0,0,0,0,0],	// false, false, false...
	full_columns: [0,0,0,0,0,0,0,0],	// false, false, false...

	check_for_column : function () {
		for (var x = 0; x < this.map_w; x++) {
			for (var y = 0; y < this.map_h; y++) {
				if (this.tiles[x][y] == 0) break;
				else if (y == this.map_h - 1 && this.tiles[x][y] != 0) {
					this.full_columns[x] = 1;
					//return x;
				}
			}
		}
	},

	check_for_row : function () {
		for (var y = 0; y < this.map_h; y++) {
			for (var x = 0; x < this.map_w; x++) {
				if (this.tiles[x][y] == 0) break;
				else if (x == this.map_w - 1 && this.tiles[x][y] != 0) {
					this.full_rows[y] = 1;
					//return y;
				}
			}
		}
	},



	check_for_line: function () {

		this.check_bombs();

		var loops = 0;

		while (this.check_bombs_again == 1 && loops < 10) {
			this.check_bombs();
			loops++;
		}

		return -1;

		
	},

	secondary_explosions: 0,	

	start_explosions: function () {
		this.secondary_explosions = 1;
		for (var y = 0; y < this.map_h; y++) {
			for (var x = 0; x < this.map_w; x++) {
				
				if(this.tiles[x][y] == 6) {

					this.tiles_explode[x][y] = 1;
					this.tiles[x][y] = 0;
					this.tiles_die[x][y] = 3;

					var row = y;
					var col = x;
					for (var xx = 0; xx < this.map_size; xx++) {
						if (xx == x) continue;
						if (this.tiles[xx][row] == 7 || this.tiles[xx][row] == 6) continue;

						if (this.tiles[xx][row] != 0) this.score++;

						this.die_timer = 40;
						this.tiles_die[xx][row] = this.tiles[xx][row];
						if (this.tiles[xx][row] < 8) this.tiles[xx][row] = 0;
						else if (this.tiles[xx][row] == 8) this.tiles[xx][row] = 1;
						else if (this.tiles[xx][row] == 9) this.tiles[xx][row] = 8;

						if (this.tiles_die[xx][row] == 3) {
							this.tiles[xx][row] = 7;
							//this.tiles_explode[xx][row] = 1;
							this.bomb_pop_timer = 45;
						}
						
						 
						if (this.tiles_explode[xx][row] > 6) this.tiles_explode[xx][row] = this.tiles_explode[x][y] - Math.abs(x - xx);
						this.explode_timer = 30;

						
					}
					for (var yy = 0; yy < this.map_size; yy++) {
						if (yy == y) continue;
						if (this.tiles[col][yy] == 7 || this.tiles[col][yy] == 6) continue;

						if (this.tiles[col][yy] != 0) this.score++;

						this.die_timer = 40;
						this.tiles_die[col][yy] = this.tiles[col][yy] ;
						if (this.tiles[col][yy] < 8) this.tiles[col][yy] = 0;
						else if (this.tiles[col][yy] == 8) this.tiles[col][yy] = 1;
						else if (this.tiles[col][yy] == 9) this.tiles[col][yy] = 8;

						if (this.tiles_die[col][yy] == 3) {
							this.tiles[col][yy] = 7;
							//this.tiles_explode[col][yy] = 1;
							this.bomb_pop_timer = 45;
						}

						if (this.tiles_explode[col][yy] > 6) this.tiles_explode[col][yy] = this.tiles_explode[x][y] - Math.abs(y - yy);
						this.explode_timer = 30;

				
					}
				}
			}
		}

		for (var y = 0; y < this.map_h; y++) {
			for (var x = 0; x < this.map_w; x++) {
				if(this.tiles[x][y] == 6) this.tiles[x][y] = 0;
			}
		}

		var new_bombs = 0;

		for (var y = 0; y < this.map_h; y++) {
			for (var x = 0; x < this.map_w; x++) {
				if(this.tiles[x][y] == 7) {
					this.tiles[x][y] = 6;
					this.bomb_pop_timer = 45;
					new_bombs++;
				}
			}
		}

		if (new_bombs == 0) this.check_game_over = 1;
	},

	check_game_over: 0,

	check_bombs_again: 0,

	// is a 2(fire) next to a (3) bomb
	check_bombs: function() {
		this.secondary_explosions = 0;
		this.check_bombs_again = 0;

		for (var y = 0; y < this.map_h; y++) {
			for (var x = 0; x < this.map_w; x++) {

				this.tiles_explode[x][y] = 7;

				if(this.tiles[x][y] == 3) {
					// turn bomb (3) into explosion source (6)
					if (x > 0 && this.tiles[x - 1][y] == 2) this.tiles[x][y] = 6;
					else if (y > 0 && this.tiles[x][y - 1] == 2) this.tiles[x][y] = 6;
					else if (x < this.map_w - 1 && this.tiles[x + 1][y] == 2) this.tiles[x][y] = 6;
					else if (y < this.map_h - 1 && this.tiles[x][y + 1] == 2) this.tiles[x][y] = 6;
				}

				if (this.tiles[x][y] == 6) {
					
					this.score++;

					this.bomb_pop_timer = 45;
				}
			}
		}

		

		
		
	},
	
	handle_mouse_up: function(engine,x,y){
		
		this.on_any_input();

		// Clear + redraw tiles - hopefully this will minimize issues
		//t_context.clearRect(0,0,screen_height,screen_width);
		//this.draw_tiles();

		if (this.bomb_pop_timer > 0) {
			this.rotate_new_piece(this.selected_new_piece);
			this.selected_new_piece = 0;
			return;

		}

		if (this.selected_new_piece != 0) {
			var dropped_ = this.place_piece(this.selected_new_piece, this.over_tile_x, this.over_tile_y);
			if (dropped_ == 1) {
				this.remake_new_piece(this.selected_new_piece);
				this.should_check_lines = 1;

				
				
				
			} else this.rotate_new_piece(this.selected_new_piece);
		}

		this.selected_new_piece = 0;
		this.mouse_down = false;
		this.mouse_drag = false;
	},

	should_check_lines: 0,

	handle_click: function(engine,x,y) {
		
		// User clicked at (x,y) on the screen

		// Did he click on a menu item?

		// Did he click in the world?
		map_x + x;
		map_y + y;

		//engine.push_state(new PeacePlayStateClass(this));
	},

	handle_key: function(engine,event) {

		

		if (event == Types.Events.KEY_RIGHT) {
		} else if (event == Types.Events.KEY_LEFT) {
		}

	},

	x_mouse: 0,
	y_mouse: 0,

	over_tile_x: -1,
	over_tile_y: -1,

	handle_mouse_move: function (engine,x,y) {

		if (screen_height > screen_width &&
		    y < this.NEW_PIECE_Y*this.tile_size) {
			// easier controls on touchscreen - magnify user input
			y -= 0.85*(this.NEW_PIECE_Y*this.tile_size - y);
		}

		this.x_mouse = x;
		this.y_mouse = y;

		
		
		if (this.mouse_down) {

			// convert to tile coordinates
			x = x - this.selected_off_x - this.tile_size;
			y = y - this.selected_off_y - this.tile_size;

			if (x < 0) x = 1;
			if (y < 0) y = 1;

			if (x > 0 &&
			    x < this.map_size*this.tile_size &&
			    y > 0 &&
			    y < this.map_size*this.tile_size) {
				this.over_tile_x = Math.round(x/this.tile_size);
				this.over_tile_y = Math.round(y/this.tile_size);
			} else {
				this.over_tile_x =  -1;
				this.over_tile_y = -1;
			}

			this.mouse_drag = true;

			return;

		}
	},


	update: function() { 

		if (this.bomb_pop_timer > 0) {
			this.bomb_pop_timer--;
			if (this.bomb_pop_timer <= 0) this.start_explosions();
		}

		if (this.explode_timer > 0) {

		}

		if (this.should_check_lines == 1) {
			this.should_check_lines = 0;
			this.check_for_line();
			if (this.bomb_pop_timer <= 0) this.check_game_over = 1;
		}

		if (this.check_game_over == 1) {
			this.check_game_over = 0;
			this.game_over = true;

			var matches = this.scan_for_matches();
			if (matches == 1) this.game_over = false;

			this.rotate_new_piece(this.selected_new_piece);
			var matches = this.scan_for_matches();
			if (matches == 1) this.game_over = false;

			this.rotate_new_piece(this.selected_new_piece);
			var matches = this.scan_for_matches();
			if (matches == 1) this.game_over = false;

			this.rotate_new_piece(this.selected_new_piece);
			var matches = this.scan_for_matches();
			if (matches == 1) this.game_over = false;

			for (var i = 0; i < Math.round(6*Math.random()); i++) {
				this.rotate_new_piece(this.selected_new_piece);
			}
			
		}
	
		if (this.game_over == true) {
			this.game_over_timer--;
		}


	},


	draw_rect_background: function(x,y,xx,yy,colour) {
		var graphics = new PIXI.Graphics();

		graphics.beginFill(colour);

		// set the line style to have a width of 5 and set the color to red
		graphics.lineStyle(0, colour);

		// draw a rectangle
		graphics.drawRect(x, y,xx, yy);

		background_container.addChild(graphics);
	},

	

	on_any_input: function() {
		if (this.game_over == true) {
			this.game_over_timer--;
			if (this.game_over_timer <= 0) {
				this.high_score = this.score;
				this.score = 0;
				this.reset();
				
			}
			return;
		}
	},

	handle_mouse_down: function(engine,x,y){

		
		
		if(!this.mouse_down) {
			this.last_mouse_x_drag = x;
			this.last_mouse_y_drag = y;
		} else return;
		this.mouse_down = true;
		this.over_tile_x =  -1;
		this.over_tile_y = -1;

		

		for (var n = 1; n <= 3; n++) {

			var leftx = this.NEW_PIECE_X*this.tile_size + this.NEW_PIECE_X_OFF*(n-1)*this.tile_size;
			var rightx = (this.NEW_PIECE_X + 5)*this.tile_size + this.NEW_PIECE_X_OFF*(n-1)*this.tile_size;
			var topy = this.NEW_PIECE_Y*this.tile_size + this.NEW_PIECE_Y_OFF*(n-1)*this.tile_size;
			var boty = (this.NEW_PIECE_Y + 5)*this.tile_size + this.NEW_PIECE_Y_OFF*(n-1)*this.tile_size;

			if (x > leftx + 0.5*this.tile_size &&
			    x < rightx + 0.5*this.tile_size && y < boty + 0.5*this.tile_size && y > topy + 0.5*this.tile_size) {
				this.selected_new_piece = n;
				console.log('selectd ' + n);

				this.selected_off_x = x - (leftx + 1*this.tile_size);
				this.selected_off_y = y - (topy + 1*this.tile_size);
			}
		}
	},


	NEW_PIECE_X: 10,
	NEW_PIECE_Y: 0,
	NEW_PIECE_X_OFF: 0,
	NEW_PIECE_Y_OFF: 999,//3.5, // 3
	selected_new_piece: 0,	// 0 == none
	p_piece: null,

	selected_off_x: 0,
	selected_off_y: 0,

	draw_new_piece: function(num) {
		
		this.p_piece = null;
		if (num == 1) this.p_piece = this.new_piece_one;
		else if (num == 2) this.p_piece = this.new_piece_two;
		else if (num == 3) this.p_piece = this.new_piece_three;
		else return;

		var xdraw = (this.NEW_PIECE_X)*this.tile_size + this.NEW_PIECE_X_OFF*(num-1)*this.tile_size + this.tile_size;
		var ydraw = (this.NEW_PIECE_Y)*this.tile_size + this.NEW_PIECE_Y_OFF*(num-1)*this.tile_size + this.tile_size;

		if (this.selected_new_piece == num) {
			xdraw = this.x_mouse - this.selected_off_x;
			ydraw = this.y_mouse - this.selected_off_y;
			 
			
		}

		

		for(var x = 0; x < 5; x++) {
			for(var y = 0; y < 5; y++) {

				if(this.p_piece[x][y] == 1) {
					drawSprite(g_num_to_sprite[this.p_piece[x][y]], 
								xdraw + x*this.tile_size , 
							      ydraw + y*this.tile_size);

					drawSpriteAlpha("blocklight.png",xdraw + x*this.tile_size , 
							      ydraw + y*this.tile_size, this.light_level);
				} else if (this.p_piece[x][y] == 2) {
					drawSprite("bombblock.png", 
								xdraw + x*this.tile_size , 
							      ydraw + y*this.tile_size);

					drawSpriteAlpha("emptyblocklight.png",xdraw + x*this.tile_size , 
							      ydraw + y*this.tile_size, this.light_level);

					drawSpriteAlpha("firebit1.png", 
								xdraw + x*this.tile_size - 6, 
							      ydraw + y*this.tile_size + 30*this.draw_timer/360 - 40,this.draw_timer/360);
					drawSpriteAlpha("firebit2.png", 
								xdraw + x*this.tile_size + 6, 
							      ydraw + y*this.tile_size + 30*this.draw_timer/360 - 40,this.draw_timer/360);

					drawSpriteResized("fire1.png", 
								xdraw + x*this.tile_size , 
							      ydraw + y*this.tile_size - 10*this.light_level,0.6 + 0.4*this.light_level);
					drawSpriteResized("fire2.png", 
								xdraw + x*this.tile_size , 
							      ydraw + y*this.tile_size - 10*this.light_level + 4,0.6 + 0.6*this.light_level);
					drawSpriteResized("fire3.png", 
								xdraw + x*this.tile_size , 
							      ydraw + y*this.tile_size - 10*this.light_level + 8,0.2 + 0.8*this.light_level);

					
				} else if  (this.p_piece[x][y] == 3) {
					drawSprite("bombblock.png", 
								xdraw + x*this.tile_size , 
							      ydraw + y*this.tile_size);

					drawSpriteAlpha("emptyblocklight.png",xdraw + x*this.tile_size , 
							      ydraw + y*this.tile_size, this.light_level);

					drawSprite("bomb.png", 
								xdraw + x*this.tile_size , 
							      ydraw + y*this.tile_size - 10*this.light_level);

					

					drawSpriteAlpha("bomblight.png",xdraw + x*this.tile_size , 
							      ydraw + y*this.tile_size - 10*this.light_level, this.light_level);
				} else if(this.p_piece[x][y] == 8) {
					drawSprite("blockhp2.png", 
								xdraw + x*this.tile_size , 
							      ydraw + y*this.tile_size);

					drawSpriteAlpha("blocklight.png",xdraw + x*this.tile_size , 
							      ydraw + y*this.tile_size, this.light_level);

					//drawSprite("block2.png", 
					//			xdraw + x*this.tile_size , 
					//		      ydraw + y*this.tile_size - 4);
				} else if(this.p_piece[x][y] == 9) {
					drawSprite("blockhp3.png", 
								xdraw + x*this.tile_size , 
							      ydraw + y*this.tile_size);

					drawSpriteAlpha("blocklight.png",xdraw + x*this.tile_size , 
							      ydraw + y*this.tile_size, this.light_level);

					//drawSprite("block3.png", 
					//			xdraw + x*this.tile_size , 
					//		      ydraw + y*this.tile_size - 4);
				}

				

				// also highlighted tiles for mouse over
				if(this.over_tile_x != -1 && 
				   this.selected_new_piece == num &&
				   this.p_piece[x][y] != 0) {
					drawSpriteResized("whiteball.png", 
					this.over_tile_x*this.tile_size + x*this.tile_size + this.tile_size, 
			        	this.over_tile_y*this.tile_size + y*this.tile_size + this.tile_size, 1) ;

					// draw call -> check for match
					// on_reject == 1 : red_tile
					this.check_for_match(num, this.over_tile_x , this.over_tile_y, 1);
				}
			}
		}

	},

	

	// selected_new_piece
	// over_x,	over_y
	place_piece: function(num, xdrop, ydrop) {

		if(this.over_tile_x == -1) return -1;

		this.p_piece = null;
		if (num == 1) this.p_piece = this.new_piece_one;
		else if (num == 2) this.p_piece = this.new_piece_two;
		else if (num == 3) this.p_piece = this.new_piece_three;
		else return;

		
		var match = this.check_for_match(num, xdrop, ydrop, 3);		// 3 - shake on rejection

		if (match == -1) return -1;

		// okay, it fits - drop
		for(var x = 0; x < 5; x++) {
			for(var y = 0; y < 5; y++) {
				if(this.p_piece[x][y] != 0) {
					this.tiles[xdrop + x][ydrop + y] = this.p_piece[x][y];
				}
			}
		}

		

		return 1;

	},

	// check but dont place
	// num - piece num
	// x, y - placement position
	// on_reject - 0 do nothing,  1 draw red X, 3 shake
	
	
	check_for_match: function(num, xdrop , ydrop, on_reject) {

		
		this.p_piece = null;
		if (num == 1) this.p_piece = this.new_piece_one;
		else if (num == 2) this.p_piece = this.new_piece_two;
		else if (num == 3) this.p_piece = this.new_piece_three;
		else return;

		// check for fit:
		for(var x = 0; x < 5; x++) {
			for(var y = 0; y < 5; y++) {
				if(this.p_piece[x][y] == 0) continue;	// fine
				if(xdrop + x >= this.map_size || ydrop + y >= this.map_size)	return -1;	// out of bounds
				if(this.tiles[xdrop + x][ydrop + y] == 0) continue;	// fine
				
				return -1;	// clash
				
			}
		}
		return;

		// check for match rules
		for(var x = 0; x < 3; x++) {
			for(var y = 0; y < 3; y++) {
				if(this.p_piece[x][y] == 0) continue;	// fine
				if(this.p_piece[x][y] == 1) continue;	// fine

				for(var xx = -1; xx <= 1; xx++) {
					for(var yy = -1; yy <= 1; yy++) {

						// skip diagonals
						if (xx != 0 && yy != 0) continue;

						if(xdrop + x + xx >= this.map_size || 
						   ydrop + y  + yy >= this.map_size ||
						   xdrop + x + xx < 0 ||
						   ydrop + y + yy < 0) continue;

						if (this.tiles[xdrop + x + xx][ydrop + y + yy] == 0 || 
						    this.tiles[xdrop + x + xx][ydrop + y + yy] == 1) continue;

						if (this.tiles[xdrop + x + xx][ydrop + y + yy] != this.p_piece[x][y]) {
							// clash!
							if (on_reject == 3) {
								this.tiles_shake[xdrop + x + xx][ydrop + y + yy] = 1;
								this.shake_timer = 30;
							} else if (on_reject == 1) {
								this.tiles_red[xdrop + x + xx][ydrop + y + yy] = 1;
								this.red_timer = 2;
							}
							
							return -1;
						}
					}
				}
			}
		}
	},

	// ANY possible move
	scan_for_matches: function() {
		
		for (var x = 0; x < this.map_size; x++) {
			for (var y = 0; y < this.map_size; y++) {
				var match_a = this.check_for_match(1, x, y, 0);	// 0 - nothing on rejection
				//var match_b = this.check_for_match(2, x, y, 0);	// 0 - nothing on rejection
				//var match_c = this.check_for_match(3, x, y, 0);	// 0 - nothing on rejection
		
				if (match_a != -1){// || match_b != -1 || match_c != -1) {
					return 1;
				}
			}
		}

		// no possible moves!
		//this.game_over = true;
		return -1;
	},

	light_level: 0,

	SCORE_X: 11,
	SCORE_Y: 1,
	SCORE_X_OFF: 1,
	SCORE_Y_OFF: 0,

	draw: function() {

		this.draw_timer--;
		if (this.draw_timer < 0) this.draw_timer = 360;

		this.light_level = 0.75 + 0.25*Math.sin(2*Math.PI*this.draw_timer/360);
		if (this.light_level > 1.0) this.light_level = 1.0;

		draw_string('SCORE', this.tile_size*this.SCORE_X, this.tile_size*this.SCORE_Y);
		draw_string(this.score.toString(), this.tile_size*this.SCORE_X + this.tile_size*this.SCORE_X_OFF, this.tile_size*this.SCORE_Y + this.tile_size*this.SCORE_Y_OFF);

		//draw_string('HI SCORE', this.tile_size*9, 50);
		//draw_string(this.high_score.toString(), this.tile_size*12 + 32, 50);

		if (this.game_over == true) {
			draw_string('GAME OVER', this.tile_size*1, this.tile_size*1);
		}

		

		for (var x = 0; x < this.map_size; x++) {
			for (var y = 0; y < this.map_size; y++) {
				if (this.tiles[x][y] == 0) drawSpriteResized("whiteball.png", x*this.tile_size + this.tile_size, 
							     y*this.tile_size + this.tile_size, 0.25);
				else if(this.tiles[x][y] == 1) {
					drawSprite(g_num_to_sprite[this.tiles[x][y]], 
								this.tile_size + x*this.tile_size , 
							      	this.tile_size+ y*this.tile_size);

					drawSpriteAlpha("blocklight.png",this.tile_size+ x*this.tile_size , 
							      		this.tile_size + y*this.tile_size, this.light_level);
				} else if (this.tiles[x][y] == 2) {
					drawSprite("bombblock.png", 
								this.tile_size + x*this.tile_size , 
							     this.tile_size + y*this.tile_size);

					drawSpriteAlpha("emptyblocklight.png",this.tile_size + x*this.tile_size , 
							      this.tile_size + y*this.tile_size, this.light_level);


					drawSpriteAlpha("firebit1.png", 
								this.tile_size + x*this.tile_size - 6, 
							      this.tile_size + y*this.tile_size + 30*this.draw_timer/360 - 40,this.draw_timer/360);
					drawSpriteAlpha("firebit2.png", 
								this.tile_size + x*this.tile_size + 6, 
							     this.tile_size + y*this.tile_size + 30*this.draw_timer/360 - 40,this.draw_timer/360);

					drawSpriteResized("fire1.png", 
								this.tile_size + x*this.tile_size , 
							      this.tile_size + y*this.tile_size - 10*this.light_level,0.6 + 0.4*this.light_level);
					drawSpriteResized("fire2.png", 
								this.tile_size + x*this.tile_size , 
							      this.tile_size + y*this.tile_size - 10*this.light_level + 4,0.6 + 0.6*this.light_level);
					drawSpriteResized("fire3.png", 
								this.tile_size + x*this.tile_size , 
							     this.tile_size + y*this.tile_size - 10*this.light_level + 8,0.2 + 0.8*this.light_level);
				} else if  (this.tiles[x][y] == 3) {
					drawSprite("bombblock.png", 
								this.tile_size + x*this.tile_size , 
							     this.tile_size + y*this.tile_size);

					drawSpriteAlpha("emptyblocklight.png",this.tile_size + x*this.tile_size , 
							      this.tile_size + y*this.tile_size, this.light_level);

					drawSprite("bomb.png", 
								this.tile_size + x*this.tile_size , 
							      this.tile_size + y*this.tile_size - 10*this.light_level);

					drawSpriteAlpha("bomblight.png",this.tile_size + x*this.tile_size , 
							      this.tile_size+ y*this.tile_size - 10*this.light_level, this.light_level );
				} else if  (this.tiles[x][y] == 6) {
					drawSprite("bombblock.png", 
								this.tile_size + x*this.tile_size , 
							     this.tile_size + y*this.tile_size);

					drawSpriteAlpha("emptyblocklight.png",this.tile_size + x*this.tile_size , 
							      this.tile_size + y*this.tile_size, this.light_level);
					
					drawSpriteResized("bomb.png", 
								this.tile_size + x*this.tile_size , 
							      this.tile_size + y*this.tile_size - 10*this.light_level,2 - this.bomb_pop_timer/45);

					drawSpriteResizedAlpha("bomblight.png",this.tile_size + x*this.tile_size , 
							      this.tile_size+ y*this.tile_size - 10*this.light_level, 2 - this.bomb_pop_timer/45,this.light_level );
					
				} else if(this.tiles[x][y] == 8) {
					drawSprite("blockhp2.png", 
								this.tile_size + x*this.tile_size , 
							      	this.tile_size+ y*this.tile_size);

					drawSpriteAlpha("blocklight.png",this.tile_size+ x*this.tile_size , 
							      		this.tile_size + y*this.tile_size, this.light_level);

					//drawSprite("block2.png", 
					//			this.tile_size + x*this.tile_size , 
					//		      	this.tile_size+ y*this.tile_size - 4);
				} else if(this.tiles[x][y] == 9) {
					drawSprite("blockhp3.png", 
								this.tile_size + x*this.tile_size , 
							      	this.tile_size+ y*this.tile_size);

					drawSpriteAlpha("blocklight.png",this.tile_size+ x*this.tile_size , 
							      		this.tile_size + y*this.tile_size, this.light_level);

					//drawSprite("block3.png", 
					//			this.tile_size + x*this.tile_size , 
					//		      	this.tile_size+ y*this.tile_size - 4);
				}
			}
		}

		if (this.explode_timer > 0 ) {
			
			if (this.draw_timer % 3 == 0) this.explode_timer--;

			for (var x = 0; x < this.map_size; x++) {
			for (var y = 0; y < this.map_size; y++) {
				if (this.tiles_explode[x][y] < 6 && this.tiles_explode[x][y] > 0) {
					 drawSprite(g_num_to_explode_sprite[this.tiles_explode[x][y]],
							x*this.tile_size + this.tile_size, 
							y*this.tile_size + this.tile_size);
					
				} else if (this.tiles_explode[x][y] <= 0 && this.tiles_explode[x][y] > -1) {
					drawSprite(g_num_to_explode_sprite[1],
							x*this.tile_size + this.tile_size, 
							y*this.tile_size + this.tile_size);
				}

				if (this.tiles_explode[x][y] < 6 && this.draw_timer % 3 == 0) {
					this.tiles_explode[x][y]++;
				}
			
				if (this.explode_timer == 0) this.tiles_explode[x][y] = 7;
			}
			}
		}

		if(this.red_timer > 0) {
			this.red_timer--;

			for (var x = 0; x < this.map_size; x++) {
			for (var y = 0; y < this.map_size; y++) {
				if (this.tiles_red[x][y] == 1) {
					 drawSpriteAlpha("sq_red.png",
							x*this.tile_size + this.tile_size, 
							y*this.tile_size + this.tile_size, 0.5);

					
				}
			
				if (this.red_timer == 0) this.tiles_red[x][y] = 0;
			}
			}
		}

		if(this.die_timer > 0) {
			this.die_timer--;
			for (var x = 0; x < this.map_size; x++) {
			for (var y = 0; y < this.map_size; y++) {
				if (this.tiles_die[x][y] != 0) {

					if (this.tiles_explode[x][y] < 0) {
						drawSprite(g_num_to_sprite[this.tiles_die[x][y]],
							x*this.tile_size + this.tile_size, 
							y*this.tile_size + this.tile_size);

						if (this.tiles_die[x][y] == 1) {

							drawSpriteAlpha("blocklight.png",this.tile_size+ x*this.tile_size , 
							      		this.tile_size + y*this.tile_size, 
									this.light_level);
						}

					} else drawSpriteResized(g_num_to_sprite[this.tiles_die[x][y]],
							x*this.tile_size + this.tile_size, 
							y*this.tile_size + this.tile_size, 0.5*(this.die_timer/60)*(this.die_timer/60) + 0.5*this.die_timer/60);
				}
				if (this.die_timer == 0) this.tiles_die[x][y] = 0;
			}
			}
		}

		this.draw_new_piece(1);
		this.draw_new_piece(2);
		this.draw_new_piece(3);

		//drawSpriteResized('plane.png',  this.player_y_exact+ 56, 1000 -this.player_x_exact , 2 );

	}
});

//white_circle = new PIXI.Graphics();
//white_circle.beginFill(0xFFFFFF);
//white_circle.drawCircle();


GameOverStateClass = GameStateClass.extend({
	// The state directly below on the stack - PlayStateClass
	play_state: null,


	// Display countdown - don't
	timer:null,


	init: function(lower_state) {
		this.play_state = lower_state;
		// Clear menu canvas
		//m_context.clearRect(0,0,screen_width,screen_height);
		this.play_state.draw_tiles();

		this.timer = 10;
	},

	update: function(engine){
		this.timer--;
	},

	draw: function() {
		
	},

	handle_click: function(engine,x,y) {
		
		if(this.timer > 0) {return;}

		//engine.reset();

		var level_num = this.play_state.level_num;

		this.play_state.reset();

		//this.play_state.load_level(0);

		//this.play_state.draw_tiles();

		this.change_state(engine,new PlayerTurnStateClass(this.peace_play_state));

		//engine.push_state(new MobTurnStateClass(engine.get_state()));


		// This state is taken off the stack - is it deleted?
		this.cleanup();		
		// Never reached

	}
});

TutorialStateClass = GameStateClass.extend({

	play_state: null,

	tut_stage: 1,

	init: function(lower_state) {
		this.play_state = lower_state;
	},

	update: function(engine) {
		this.play_state.update(engine);

		if (this.play_state.score > 0) this.kill(engine);

		
		if(this.tut_stage < 120) {
			this.tut_stage++;

		}
	},

	TUT_X: 11,
	TUT_Y: 7,
	TUT_X_OFF: 0,
	TUT_Y_OFF: 1,

	screen_resized: function(engine) {
		this.play_state.screen_resized(engine);

		
		if (screen_width < screen_height) {
			// phone

			this.TUT_X = 2;
			this.TUT_Y = 13;
			this.TUT_X_OFF = 0;
			this.TUT_Y_OFF = 1;
		} else {
			this.TUT_X = 11;
			this.TUT_Y = 7;
			this.TUT_X_OFF = 0;
			this.TUT_Y_OFF = 1;
		}
	},

	
	handle_mouse_down: function(engine,x,y){
		this.play_state.handle_mouse_down(engine,x,y);
	},

	handle_mouse_up: function(engine,x,y){
		this.play_state.handle_mouse_up(engine,x,y);
	},

	handle_mouse_move: function(engine,x,y){
		this.play_state.handle_mouse_move(engine,x,y);
	},

	draw: function() {
		this.play_state.draw();

		
		draw_string("CLICK TO ROTATE PIECE",this.TUT_X*64 + this.TUT_X_OFF*64,this.TUT_Y*64 + this.TUT_Y_OFF*64);

		draw_string("DRAG AND DROP ONTO THE GRID",this.TUT_X*64 + 2*this.TUT_X_OFF*64,this.TUT_Y*64 + 2*this.TUT_Y_OFF*64);

		draw_string("MATCH",this.TUT_X*64 + 3*this.TUT_X_OFF*64,this.TUT_Y*64 + 3*this.TUT_Y_OFF*64);
		drawSprite("bomb.png",this.TUT_X*64 + 3*this.TUT_X_OFF*64 + 130,this.TUT_Y*64 + 3*this.TUT_Y_OFF*64);
		draw_string("WITH",this.TUT_X*64 + 3*this.TUT_X_OFF*64 + 180,this.TUT_Y*64 + 3*this.TUT_Y_OFF*64);
		drawSprite("fire.png",this.TUT_X*64 + 3*this.TUT_X_OFF*64 + 280,this.TUT_Y*64 + 3*this.TUT_Y_OFF*64);
		
	}
});


MainMenuStateClass = GameStateClass.extend({

	

	init: function(){
	
	},

	handle_events: function(engine,x,y,event_type){
		
		


		if(event_type == Types.Events.MOUSE_CLICK) {
			
			this.start_game (engine);


		}
		
	},

	start_game: function (engine) {
		var play_state = new PlayStateClass(engine);

		engine.push_state(play_state);

		
		
		//play_state.do_falling = true;
		//play_state.load_level(0);
		//engine.get_state().reset();

		//engine.get_state().load_level(10);
			
		//engine.push_state(new PeacePlayStateClass(engine.get_state()));

		//engine.get_state().pause = true;

		// Start the game
		//engine.push_state(new PlayerTurnStateClass(engine.get_state()));

		play_state.reset();
		//play_state.load_hardcoded_level();

		// Initial TUtorial
		engine.push_state(new TutorialStateClass(engine.get_state()));	// Tut 0
	
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

