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
			
			if (g_hold_to_flag == false && g_click_to_dig == true) this.handle_right_click(engine,x,y);
			else this.handle_mouse_up(engine,x,y);

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

	},

	handle_key:function(keynum){},
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

	solver_cover: [],	// 0 uncovered, 1 covered, 2 flagged

	backup_level: [],	// backup before testing level for level editor

	num_join_groups: 0,

	current_level: 0,

	info_obj: null,

	first_tile_safe: false,

	auto_dig: true,

	game_mode: 0,	// what to do on victory or lose
			// 0 campaign mode
			// 1 is 1992 mode
			// 2 testing level editor

	allow_free_dig: 0,
	num_free_digs: 5,	// gems

	gem_x: [],
	gem_y: [],

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

			this.solver_cover[i] = new Array(this.grid_h);

			this.backup_level[i] = new Array(this.grid_h);

		}

		for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {
				this.tiles[x][y] = -1; // empty

				
				this.joined_tiles[x][y] = 0;

				this.selected_tiles[x][y] = 0;	// 1 is selected

				this.pop_sprites[x][y] = new ExplosionClass(x,y, this);

				this.solver_cover[x][y] = 1;
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

				this.blocks[this.tiles[x][y]].join_group = 0;

				this.blocks[this.tiles[x][y]].cover();
				this.blocks[this.tiles[x][y]].uncover();
				this.blocks[this.tiles[x][y]].deselect();
				this.blocks[this.tiles[x][y]].reset();

				

				

			}
		}


	},

	do_free_dig: function() {
		var done_ = 0;
		var loops_ = 0;
		while (done_ == 0 && loops_ < 10) {
			loops_++;
			var x = Math.floor(this.grid_w*Math.random());
			var y = Math.floor(this.grid_h*Math.random());

			if (this.blocks[this.tiles[x][y]].block_type != 0) continue;
			if (this.blocks[this.tiles[x][y]].covered_up == false) continue;

			this.blocks[this.tiles[x][y]].uncover();
			done_ = 1;
		}

		if (done_ == 1) return;

		for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {
				// if covered, uncover and return;
				
				if (this.blocks[this.tiles[x][y]].block_type != 0) continue;
				if (this.blocks[this.tiles[x][y]].covered_up == false) continue;

				this.blocks[this.tiles[x][y]].uncover();
				return;
			}
		}

		// nothing to do!
	},

	solver_fail: 0,

	

	check_solve: function(progress_needed) {

		this.gem_x = [];
		this.gem_y = [];

		var solve_progress = 0;

		for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {
				this.solver_cover[x][y] = 1;

				this.blocks[this.tiles[x][y]].needed = false;

				if (this.blocks[this.tiles[x][y]].covered_up == false ||
				    this.blocks[this.tiles[x][y]].block_type == 1) {
					this.solver_cover[x][y] = 0;

				}

			}
		}

		// https://luckytoilet.wordpress.com/2012/12/23/2125/

		this.solver_fail = 0;

		var changes_ = 1;
		var loops_ = 0;
		while (changes_ > 0 && loops_ < 999) {
			loops_++;
			
			changes_ = 0;
			for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {

				var block_type = this.blocks[this.tiles[x][y]].block_type;

				if (this.solver_cover[x][y] != 0) continue;
				if (this.blocks[this.tiles[x][y]].block_type == 1) continue;
				if (this.blocks[this.tiles[x][y]].preset_hint_type == 0) continue;

				// compass hint
				if (this.blocks[this.tiles[x][y]].preset_hint_type == 11) {

					var hint_num = this.blocks[this.tiles[x][y]].calc_hint(this.blocks[this.tiles[x][y]].preset_hint_type);
					
					changes_ += this.solver_compass_hint(x,y,hint_num );
					continue;
				}

				// heart hint - sees lonely mines
				if (this.blocks[this.tiles[x][y]].preset_hint_type == 5) {

					continue;
					
					var hint_num = this.blocks[this.tiles[x][y]].calc_hint(this.blocks[this.tiles[x][y]].preset_hint_type);

					// negative step - dig
					var num_qn_squares = this.get_range(x,y);	// includes already flagged
					var num_flags = this.get_flags_range_solver(x,y);
					var num_lonely = this.get_lonely_flags_range_solver(x,y);
					var num_unlonely = this.get_unlonely_flags_range_solver(x,y);


					if (num_qn_squares == num_flags && num_flags == hint_num) {

						// we now know that these flagged mines are LONELY
						
						//changes_ += this.dig_around_lonely_flags(x,y);

						//this.blocks[this.tiles[x][y]].needed = true;
					
						
					}

					// positive step - if this clue is satisfied, and if it sees any flag with 1 qn neighbour,
					//		then that neighbour is a mine
					if (num_lonely == hint_num) {
							
					}
					
					continue;
				}

				// eye plus touch
				if (this.blocks[this.tiles[x][y]].preset_hint_type == 3) {
					// if 4 cardinal tiles dug, turn (temp) into eye
				}

				//if (this.joined_tiles[x][y] != 0 && (block_type == 8 || block_type == 7)) continue;

				if (this.joined_tiles[x][y] != 0 && this.blocks[this.tiles[x][y]].join_leader != true) continue;

				var jointx = -1;
				var jointy = -1;

				if (this.joined_tiles[x][y] != 0) {
					if (x < this.grid_w - 1 && this.blocks[this.tiles[x + 1][y]].block_type == 7) {
						//jointy = y;
						//jointx = x + 1;
					} else if (y < this.grid_h - 1 && this.blocks[this.tiles[x][y + 1]].block_type == 8) {
						//jointy = y + 1;
						//jointx = x;
					}
				}

				// positive step - flag
				
				var hint_num = this.blocks[this.tiles[x][y]].calc_hint(this.blocks[this.tiles[x][y]].preset_hint_type);
				var num_qn_squares = this.get_range(x,y);	// includes already flagged
				if (num_qn_squares == hint_num) {
					//changes_++;
					changes_ += this.flag_range_solver(x,y);

					this.blocks[this.tiles[x][y]].needed = true;
				}

				// negative step - dig
				var num_flags = this.get_flags_range_solver(x,y);
				if (num_flags == hint_num) {	// this might fire regardless of if anything is dug
					//changes_++;
					changes_ += this.dig_range_solver(x,y);	// dig those in range that are unflagged

					this.blocks[this.tiles[x][y]].needed = true;
				}


				

				
			
			} // for y
			} // for x

			solve_progress += changes_;
			if (solve_progress > progress_needed) {
				return true;
			}

			if (changes_ == 0 || this.solver_fail == 1) {

				var gems_ = 4;

				var solved_tiles = 0;

				for(var y = 0; y < this.grid_h; y++) {
            			for(var x = 0; x < this.grid_w; x++) {
					if (this.solver_cover[x][y] == 1) {
						return false;	// NOT SOLVABLE

					}

					if (this.solver_cover[x][y] == 2 && this.get_block_type(x,y) != 2) {
						//console.log('SOLVER FLAGGED A SAFE TILE');
						//return false;
					} else if (this.solver_cover[x][y] == 0 && this.get_block_type(x,y) == 2) {
						//console.log('SOLVER UNCOVERED A MINE TILE');
						//return false;
					}

					if (this.solver_cover[x][y] == 2 && this.get_block_type(x,y) == 2) solved_tiles++
					else if (this.solver_cover[x][y] == 0 && this.get_block_type(x,y) != 2) solved_tiles++

					if (gems_ > 0 && this.solver_cover[x][y] == 0 && 
					    this.blocks[this.tiles[x][y]].covered_up == 1 && 
					    this.blocks[this.tiles[x][y]].block_type == 0) {
						gems_--;
						this.gem_x.push(x);
						this.gem_y.push(y);
					}
				}
				}

				if (solved_tiles > 15) return true; 	// SOLVABLE
				else return false;

			} // if changes_ == 0

			

		} // while

		return false;
	},

	solver_compass_hint: function (blockx, blocky, num_) {
		var up_ = 0;
		var down_ = 0;
		var left_ = 0;
		var right_ = 0;

		// look up
		for (var y = blocky; y >= 0; y--) {
			
			var tile_ = this.get_block_type(blockx,y);
			if (tile_ == 2) {
				
				up_ = 1;
				break;
			} 

		}
		
		// look down
		for (var y = blocky; y < this.grid_h; y++) {
			
			var tile_ = this.get_block_type(blockx,y);
			if (tile_ == 2) {
				
				down_ = 1;
				break;
			} 

		}

		// look left
		for (var x = blockx; x >= 0; x--) {
			
			var tile_ = this.get_block_type(x,blocky);
			if (tile_ == 2) {
				
				left_ = 1;
				break;
			} 

		}
	
		// look right
		for (var x = blockx; x < this.grid_w; x++) {
			
			var tile_ = this.get_block_type(blockx,y);
			if (tile_ == 2) {
				
				right_ = 1;
				break;
			} 

		}

		var dirs_ = up_ + left_ + right_ + down_;
		var num_dug = 0;
		if (dirs_ == num_) {
			if (up_ == 0) {
				// look up
				for (var y = blocky; y >= 0; y--) {
					if (this.solver_cover[blockx][y] != 0) num_dug++;
					this.solver_cover[blockx][y] = 0;

				} // for y
			}

			if (down_ == 0) {
				// look down
				for (var y = blocky; y < this.grid_h; y++) {
					if (this.solver_cover[blockx][y] != 0) num_dug++;
					this.solver_cover[blockx][y] = 0;

				} // for x
			}

			if (left_ == 0) {
				// look lwft
				for (var x = blockx; x >= 0; x--) {
					if (this.solver_cover[x][blocky] != 0)num_dug++;
					this.solver_cover[x][blocky] = 0;

				} // for x
			}

			if (right_ == 0) {
				// look right
				for (var x = blockx; x < this.grid_w; x++) {
					if (this.solver_cover[x][blocky] != 0)num_dug++;
					this.solver_cover[x][blocky] = 0;

				} // for x
			}

		}

	},

	get_lonely_flags_range_solver : function(blockx,blocky, jointx,jointy) {
		var num_ = 0;

		for (var i = 0; i < this.blocks[this.tiles[blockx][blocky]].x_in_range.length; i++) {
			var x = this.blocks[this.tiles[blockx][blocky]].x_in_range[i];
			var y = this.blocks[this.tiles[blockx][blocky]].y_in_range[i];

			if (this.solver_cover[x][y] != 2) continue;  // flagged

			// check lonely
			if (x > 0 && this.solver_cover[x-1][y] != 0) return;
			if (y > 0 && this.solver_cover[x][y-1] != 0) return;
			if (x < this.grid_w - 1 && this.solver_cover[x+1][y] != 0) return;
			if (y < this.grid_h - 1 && this.solver_cover[x][y+1] != 0) return;

			num_ += 1;
		}

		return num_;
	},

	get_unlonely_flags_range_solver : function(blockx,blocky, jointx,jointy) {
		var num_ = 0;

		for (var i = 0; i < this.blocks[this.tiles[blockx][blocky]].x_in_range.length; i++) {
			var x = this.blocks[this.tiles[blockx][blocky]].x_in_range[i];
			var y = this.blocks[this.tiles[blockx][blocky]].y_in_range[i];

			if (this.solver_cover[x][y] != 2) continue;  // flagged

			// check unlonely
			if (x > 0 && this.solver_cover[x-1][y] != 2) return;
			if (y > 0 && this.solver_cover[x][y-1] != 2) return;
			if (x < this.grid_w - 1 && this.solver_cover[x+1][y] != 2) return;
			if (y < this.grid_h - 1 && this.solver_cover[x][y+1] != 2) return;

			num_ += 1;
		}

		return num_;
	},

	
	get_flags_range_solver : function(blockx,blocky, jointx,jointy) {
		var num_ = 0;

		for (var i = 0; i < this.blocks[this.tiles[blockx][blocky]].x_in_range.length; i++) {
			var x = this.blocks[this.tiles[blockx][blocky]].x_in_range[i];
			var y = this.blocks[this.tiles[blockx][blocky]].y_in_range[i];

			if (this.solver_cover[x][y] != 2) continue;  // flagged

			num_ += 1;
		}

		return num_;
		for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {
				if (this.solver_cover[x][y] != 2) continue;  // flagged
				var inrange =  this.blocks[this.tiles[blockx][blocky]].is_in_range(x,y);
				if (jointx > 0 && inrange == 0) inrange += this.blocks[this.tiles[jointx][jointy]].is_in_range(x,y);
				
				
				num_ += inrange;
			}
		}

		return num_;
	},

	get_range : function(blockx,blocky, jointx,jointy) {
		// count the number of COVERED or FLAGGED tiles in range in this.solver_cover[x][y]
		// .is_in_range(x,y);
		var num_ = 0;

		

		if (jointx != null && this.blocks[this.tiles[blockx][blocky]].join_leader != true) return 0;

		for (var i = 0; i < this.blocks[this.tiles[blockx][blocky]].x_in_range.length; i++) {
			var x = this.blocks[this.tiles[blockx][blocky]].x_in_range[i];
			var y = this.blocks[this.tiles[blockx][blocky]].y_in_range[i];

			if (this.solver_cover[x][y] == 0) continue;  // covered or flagged

			if (x == blockx && y == blocky) continue;
			var inrange =  1;//this.blocks[this.tiles[blockx][blocky]].is_in_range(x,y);
			//if (jointx > 0 && inrange == 0) inrange += this.blocks[this.tiles[jointx][jointy]].is_in_range(x,y);
			num_ += inrange;
		}

		return num_;
	},

	old_get_range : function(blockx,blocky, jointx,jointy) {
		// count the number of COVERED or FLAGGED tiles in range in this.solver_cover[x][y]
		// .is_in_range(x,y);
		var num_ = 0;
		for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {
				if (this.solver_cover[x][y] == 0) continue;  // covered or flagged
				if (x == blockx && y == blocky) continue;
				var inrange =  this.blocks[this.tiles[blockx][blocky]].is_in_range(x,y);
				if (jointx > 0 && inrange == 0) inrange += this.blocks[this.tiles[jointx][jointy]].is_in_range(x,y);
				num_ += inrange;
			}
		}

		return num_;
	},

	dig_around_lonely_flags : function(blockx,blocky) {
		// find flagged mines in range, dig the 4 surrounding tiles
		var num_dug = 0;

		for (var i = 0; i < this.blocks[this.tiles[blockx][blocky]].x_in_range.length; i++) {
			var x = this.blocks[this.tiles[blockx][blocky]].x_in_range[i];
			var y = this.blocks[this.tiles[blockx][blocky]].y_in_range[i];
			if (this.solver_cover[x][y] != 2) continue;	// looking for flagged

			for (xx = x - 1; xx <= x + 1; xx++) {
				for (yy = y - 1; yy <= y + 1; yy++) {
					if (xx == x && yy == y) continue;
					if (xx != x && yy != y) continue;
					if (xx < 0 || xx > this.grid_w - 1 || yy < 0 || yy > this.grid_h - 1) continue;
					num_dug++;
					this.solver_cover[xx][yy] = 0;
				}
			}
	
		}


		return num_dug;
		for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {
				if (this.solver_cover[x][y] != 2) continue;	// looking for flagged
				var inrange = this.blocks[this.tiles[blockx][blocky]].is_in_range(x,y);
				if (inrange == 0) continue;
				// flagged, in range - now dig 4 neighbours

				for (xx = x - 1; xx <= x + 1; xx++) {
					for (yy = y - 1; yy <= y + 1; yy++) {
						if (xx == x && yy == y) continue;
						if (xx != x && yy != y) continue;
						if (xx < 0 || xx > this.grid_w - 1 || yy < 0 || yy > this.grid_h - 1) continue;
						num_dug++;
						this.solver_cover[xx][yy] = 0;
					}
				}


				
			}
		}

		return num_dug;
		
	},

	dig_range_solver: function(blockx,blocky, jointx,jointy) {
		var num_dug = 0;

		
		for (var i = 0; i < this.blocks[this.tiles[blockx][blocky]].x_in_range.length; i++) {
			var x = this.blocks[this.tiles[blockx][blocky]].x_in_range[i];
			var y = this.blocks[this.tiles[blockx][blocky]].y_in_range[i];

			if (this.solver_cover[x][y] != 1) continue; // we want covered + unflagged

			var inrange = 1;

			num_dug++;
			this.solver_cover[x][y] = 0;

			// chain reaction to dig whole joint group
			if (this.joined_tiles[x][y] != 0) {

				//console.log('-------------join tile');
				
			
				//this.blocks[this.tiles[blockx][blocky]].cover(false);
				//this.blocks[this.tiles[blockx][blocky]].uncover(false);
				
				for(var yy = 0; yy < this.grid_h; yy++) {
            				for(var xx = 0; xx < this.grid_w; xx++) {

						if (xx == x && yy == y) continue;

						if (this.joined_tiles[x][y] == this.joined_tiles[xx][yy]) {	
							num_dug++;
							this.solver_cover[xx][yy] = 0;
						}
					}
				}
			} // if (this.joined_tiles[x][y] != 0)

			
			if (this.blocks[this.tiles[x][y]].block_type == 2) {
					

					
					//if (num_flagged > hint_num) alert('OVERFLAGGED');
			}

		}

		return num_dug;
	},

	OLD_dig_range_solver : function(blockx,blocky, jointx,jointy) {
		// this.solver_cover[x][y]
		var num_dug = 0;
		for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {
				if (this.solver_cover[x][y] != 1) continue; // we want covered + unflagged

				var inrange = this.blocks[this.tiles[blockx][blocky]].is_in_range(x,y);
				
				if (inrange == 0 && jointx == null) continue;

				if (jointx > 0 && inrange == 0) inrange += this.blocks[this.tiles[jointx][jointy]].is_in_range(x,y);

				if (inrange == 0) continue;
				
				num_dug++;
				this.solver_cover[x][y] = 0;

				if (this.joined_tiles[x][y] != 0) {
					for(var yy = 0; yy < this.grid_h; yy++) {
            					for(var xx = 0; xx < this.grid_w; xx++) {
							if (this.joined_tiles[x][y] == this.joined_tiles[xx][yy]) {	
								num_dug++;
								this.solver_cover[xx][yy] = 0;
							}
						}
					}
				} // if (this.joined_tiles[x][y] != 0)

				if (this.blocks[this.tiles[x][y]].block_type == 2) {
					
					//if (num_flagged > hint_num) alert('OVERFLAGGED');
				}
			}
		}

		return num_dug;
	},

	flag_range_solver : function(blockx,blocky, jointx,jointy) {
		num_flagged = 0;

		for (var i = 0; i < this.blocks[this.tiles[blockx][blocky]].x_in_range.length; i++) {
			var x = this.blocks[this.tiles[blockx][blocky]].x_in_range[i];
			var y = this.blocks[this.tiles[blockx][blocky]].y_in_range[i];

			if (this.solver_cover[x][y] != 1) continue;

			var inrange = 1;

			num_flagged++;
				this.solver_cover[x][y] = 2;

				if (this.blocks[this.tiles[x][y]].block_type != 2) {
					this.solver_fail = 1;
					
				}

		}


		return num_flagged;
	},

	OLD_flag_range_solver : function(blockx,blocky, jointx,jointy) {
		num_flagged = 0;
		for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {
				if (this.solver_cover[x][y] != 1) continue;
				var inrange = this.blocks[this.tiles[blockx][blocky]].is_in_range(x,y);

				if (inrange == 0 && jointx == null) continue;

				if (jointx > 0 && inrange == 0) inrange += this.blocks[this.tiles[jointx][jointy]].is_in_range(x,y);

				if (inrange == 0) continue;

				num_flagged++;
				this.solver_cover[x][y] = 2;

				if (this.blocks[this.tiles[x][y]].block_type != 2) {
					
				}
			}
		}
		return num_flagged;
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

				
			}
		}
	},

	set_tile_from_code: function(x, y, code_) {

		var cover_ = 0;
		if (code_ >= 100) {
			cover = 1;
			code_ -= 100;
			this.blocks[this.tiles[x][y]].cover();
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

		} else if (hint_ == 1) {
			tilecode += 3;		// 4 touch
		} else if (hint_ == 2) {
			tilecode += 4;		// eye
		} else if (hint_ == 4) {
			tilecode += 5;		// 8 touch
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

		var join_group = -1;

		if (this.joined_tiles[x][y] != 0 ||
		    this.joined_tiles[xx][yy] != 0) {
			// must both be unjoined - FOR NOW, only 2 tiles
			
			return;	// to allow multi-joins, just comment this out
		}


		if (this.joined_tiles[x][y] == 0 &&
		    this.joined_tiles[xx][yy] == 0) {
			this.num_joined_groups++;
			this.joined_tiles[x][y] = this.num_joined_groups;
			this.joined_tiles[xx][yy] = this.num_joined_groups;

			this.blocks[this.tiles[xx][yy]].join_leader = true;
			this.blocks[this.tiles[x][y]].join_second_leader = true;

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
				} else if (floortile == 10) {
					// heart hint
					this.blocks[this.tiles[x][y]].preset_hint(5);
				}  else if (floortile == 11) {
					// compass hint
					this.blocks[this.tiles[x][y]].preset_hint(11);
				} else if (floortile == 12) {
					// crown
					this.blocks[this.tiles[x][y]].preset_hint(12);
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

temp_level_flip_array = new Array(10);

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

		if (Math.random() < 0.5) this.flip_level_h();
		if (Math.random() < 0.5 && this.play_state.current_level != 2) this.flip_level_v();

		// look ahead and load a new batch of levels if needed
		if (this.play_state.current_level < g_total_num_of_levels - 1) {
			// is the this.play_state.current_level + 1 level loaded?
			if (g_all_level_data_floor_layer[this.play_state.current_level + 1] == null) {
				var first_in_file = Math.floor((this.play_state.current_level + 1) / 10)*10;
				var last_in_file = first_in_file + 9;
				var file_n = 'levels/level' + first_in_file.toString() + 'to' + last_in_file + '.json';
				load_level_from_file(file_n,function() {});

			}
		}
		
	},

	flip_level_h: function() {

		var levelnum = this.play_state.current_level;
		
		for(var y = 0; y < this.play_state.grid_h; y++) {

			// scan for joint tiles and swap
			// always to the right
			for(var x = 1; x < this.play_state.grid_w; x++) {
				if (g_all_level_data_floor_layer[levelnum][y][x] == 7) {
					g_all_level_data_floor_layer[levelnum][y][x] = g_all_level_data_floor_layer[levelnum][y][x - 1];
					g_all_level_data_floor_layer[levelnum][y][x - 1] = 7;
				}
			}


			var x0 = g_all_level_data_floor_layer[levelnum][y][0];
			var x1 = g_all_level_data_floor_layer[levelnum][y][1];
			var x2 = g_all_level_data_floor_layer[levelnum][y][2];
			var x3 = g_all_level_data_floor_layer[levelnum][y][3];
			var x4 = g_all_level_data_floor_layer[levelnum][y][4];

			g_all_level_data_floor_layer[levelnum][y][0] = g_all_level_data_floor_layer[levelnum][y][9];
			g_all_level_data_floor_layer[levelnum][y][1] = g_all_level_data_floor_layer[levelnum][y][8];
			g_all_level_data_floor_layer[levelnum][y][2] = g_all_level_data_floor_layer[levelnum][y][7];
			g_all_level_data_floor_layer[levelnum][y][3] = g_all_level_data_floor_layer[levelnum][y][6];
			g_all_level_data_floor_layer[levelnum][y][4] = g_all_level_data_floor_layer[levelnum][y][5];

			g_all_level_data_floor_layer[levelnum][y][9] = x0;
			g_all_level_data_floor_layer[levelnum][y][8] = x1;
			g_all_level_data_floor_layer[levelnum][y][7] = x2;
			g_all_level_data_floor_layer[levelnum][y][6] = x3;
			g_all_level_data_floor_layer[levelnum][y][5] = x4;

			// cover

			var x0 = g_all_level_data_cover_layer[levelnum][y][0];
			var x1 = g_all_level_data_cover_layer[levelnum][y][1];
			var x2 = g_all_level_data_cover_layer[levelnum][y][2];
			var x3 = g_all_level_data_cover_layer[levelnum][y][3];
			var x4 = g_all_level_data_cover_layer[levelnum][y][4];

			g_all_level_data_cover_layer[levelnum][y][0] = g_all_level_data_cover_layer[levelnum][y][9];
			g_all_level_data_cover_layer[levelnum][y][1] = g_all_level_data_cover_layer[levelnum][y][8];
			g_all_level_data_cover_layer[levelnum][y][2] = g_all_level_data_cover_layer[levelnum][y][7];
			g_all_level_data_cover_layer[levelnum][y][3] = g_all_level_data_cover_layer[levelnum][y][6];
			g_all_level_data_cover_layer[levelnum][y][4] = g_all_level_data_cover_layer[levelnum][y][5];

			g_all_level_data_cover_layer[levelnum][y][9] = x0;
			g_all_level_data_cover_layer[levelnum][y][8] = x1;
			g_all_level_data_cover_layer[levelnum][y][7] = x2;
			g_all_level_data_cover_layer[levelnum][y][6] = x3;
			g_all_level_data_cover_layer[levelnum][y][5] = x4;

			
		}
		
	},

	flip_level_v: function() {
		var levelnum = this.play_state.current_level;
		
		for(var x = 0; x < this.play_state.grid_w; x++) {

			// scan for joint tiles and swap
			// always to the bottom
			for(var y = 1; y < this.play_state.grid_h; y++) {
				if (g_all_level_data_floor_layer[levelnum][y][x] == 8) {
					g_all_level_data_floor_layer[levelnum][y][x] = g_all_level_data_floor_layer[levelnum][y - 1][x];
					g_all_level_data_floor_layer[levelnum][y - 1][x] = 8;
				}
			}


			var y0 = g_all_level_data_floor_layer[levelnum][0][x];
			var y1 = g_all_level_data_floor_layer[levelnum][1][x];
			var y2 = g_all_level_data_floor_layer[levelnum][2][x];
			var y3 = g_all_level_data_floor_layer[levelnum][3][x];
			var y4 = g_all_level_data_floor_layer[levelnum][4][x];

			g_all_level_data_floor_layer[levelnum][0][x] = g_all_level_data_floor_layer[levelnum][9][x];
			g_all_level_data_floor_layer[levelnum][1][x] = g_all_level_data_floor_layer[levelnum][8][x];
			g_all_level_data_floor_layer[levelnum][2][x] = g_all_level_data_floor_layer[levelnum][7][x];
			g_all_level_data_floor_layer[levelnum][3][x] = g_all_level_data_floor_layer[levelnum][6][x];
			g_all_level_data_floor_layer[levelnum][4][x] = g_all_level_data_floor_layer[levelnum][5][x];

			g_all_level_data_floor_layer[levelnum][9][x] = y0;
			g_all_level_data_floor_layer[levelnum][8][x] = y1;
			g_all_level_data_floor_layer[levelnum][7][x] = y2;
			g_all_level_data_floor_layer[levelnum][6][x] = y3;
			g_all_level_data_floor_layer[levelnum][5][x] = y4;
			// cover

			var y0 = g_all_level_data_cover_layer[levelnum][0][x];
			var y1 = g_all_level_data_cover_layer[levelnum][1][x];
			var y2 = g_all_level_data_cover_layer[levelnum][2][x];
			var y3 = g_all_level_data_cover_layer[levelnum][3][x];
			var y4 = g_all_level_data_cover_layer[levelnum][4][x];

			g_all_level_data_cover_layer[levelnum][0][x] = g_all_level_data_cover_layer[levelnum][9][x];
			g_all_level_data_cover_layer[levelnum][1][x] = g_all_level_data_cover_layer[levelnum][8][x];
			g_all_level_data_cover_layer[levelnum][2][x] = g_all_level_data_cover_layer[levelnum][7][x];
			g_all_level_data_cover_layer[levelnum][3][x] = g_all_level_data_cover_layer[levelnum][6][x];
			g_all_level_data_cover_layer[levelnum][4][x] = g_all_level_data_cover_layer[levelnum][5][x];

			g_all_level_data_cover_layer[levelnum][9][x] = y0;
			g_all_level_data_cover_layer[levelnum][8][x] = y1;
			g_all_level_data_cover_layer[levelnum][7][x] = y2;
			g_all_level_data_cover_layer[levelnum][6][x] = y3;
			g_all_level_data_cover_layer[levelnum][5][x] = y4;
		}
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
		play_screen_group.x = this.x_pos;
		this.timer--;
	
		
		
		if (this.timer <= 0) {
		var level_to_load = this.play_state.current_level;	
		var mapdata_version_mines = 1;
		
		play_screen_container.visible = false;

		this.play_state.load_level(level_to_load, mapdata_version_mines); // 

		if (this.play_state.current_level == 3 && already_setup_input == false) this.change_state(this.engine, new SetupInputStateClass(this.engine, this.play_state));
		else this.change_state(this.engine, new StartGameStateClass(this.engine, this.play_state));

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

	x_pos: 2999,
	timer: 55,

	init: function(engine, play_state){
		this.play_state = play_state;
		this.engine = engine;

		//this.play_state.new_game(0);

		play_screen_container.position.x = 2999;
		

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


g_rand_gen_sprite = null;

GenerateRandStateClass = GameStateClass.extend({
	// 1992 mode

	play_state: null,

	engine: null,

	load_sprite_x: 0,
	load_sprite_v: 10,

	init: function(engine, play_state){
		this.play_state = play_state;
		this.engine = engine;

		this.play_state.game_mode = 1;	

		play_screen_container.visible = false;

		if (g_rand_gen_sprite == null) {
			g_rand_gen_sprite = new SpriteClass();
			g_rand_gen_sprite.setup_sprite('g_block2.png',Types.Layer.GAME_MENU);
			g_rand_gen_sprite.update_pos(-999,-999);
		}

	},

	cleanup: function () {
		this.play_state.first_tile_safe = false;

		play_screen_container.visible = true;

		g_rand_gen_sprite.update_pos(-999,-999);
	},

	draw: function() {
		this.load_sprite_v -= 0.1*this.load_sprite_x;
		this.load_sprite_x += this.load_sprite_v;

		g_rand_gen_sprite.update_pos(this.load_sprite_x + screen_width*0.5,screen_height*0.5);
	},

	

	update: function() { 

		if (this.attempts == 0) play_screen_container.visible = false;

		this.play_state.reset();

		// removing walls stopped the solver failing

		var num_tiles = this.play_state.grid_w*this.play_state.grid_h;

		

		var num_bombs = 25 + Math.round(20*Math.random());;
		var num_walls = 0;// Math.round(10*Math.random());
		var num_eyes = 20;//8 + Math.round(6*Math.random());
		var num_uncovered = 6 + this.attempts;// + Math.round(2*Math.random());
		var num_joins = 12;//10;//3;//Math.round(5*Math.random());
		var num_hearts = 12;//6;//2;
		var num_hands = 20;//10;
		var num_walkers = 5;
		var num_eyeplustouch = 15;//3;
		var num_compass = 0;//12;
		var num_crowns = 0;//12;

		if (g_toggle_eye.toggled == -1) num_eyes = 0;
		if (g_toggle_hand.toggled == -1) num_hands = 0;
		if (g_toggle_plus.toggled == -1) num_eyeplustouch = 0;
		if (g_toggle_join.toggled == -1) num_joins = 0;
		if (g_toggle_heart.toggled == -1) num_hearts = 0;
		if (g_toggle_compass.toggled == -1) num_compass = 0;
		if (g_toggle_crown.toggled == -1) num_crowns = 0;

		num_eyeplustouch = 0;

		while (num_eyes + num_hands + num_joins + num_hearts + num_compass + num_crowns > 0.5*num_tiles) {
			num_eyes--;
			num_hands--;
			num_eyeplustouch--;
			num_joins--;
			num_hearts-=2;
			num_compass-=2;
			num_crowns-=2;
		}


		if (num_eyes + num_hands + num_joins + num_hearts < 0.25*num_tiles) {
			
		} else if (num_eyes + num_hands + num_joins + num_hearts > 0.5*num_tiles) {

		} 
		

		for (var x = 0; x < this.play_state.grid_w; x++) {
			for (var y = 0; y < this.play_state.grid_h; y++) {

				this.play_state.blocks[this.play_state.tiles[x][y]].preset_hint(4);

			}
		}
		var loops = 0;
		//for (var i = 0; i < 100; i++) {
		while (num_eyes + num_hands + num_joins + num_hearts + num_bombs + num_compass > 0 && loops < 200) {
			loops++;
			var x = Math.floor(this.play_state.grid_w*Math.random());
			var y = Math.floor(this.play_state.grid_h*Math.random());

			if (this.play_state.blocks[this.play_state.tiles[x][y]].block_type != 0) continue;
			if (this.play_state.blocks[this.play_state.tiles[x][y]].preset_hint_type != 4) continue;

			var rand = Math.random();
			var wall_ = 0;
			var bomb_ = 0;
			if (rand < 1 && num_walls > 0) {
					// wall
					num_walls--;
					this.play_state.change_tile(x,y,1);
					wall_ = 1;
			} else if (rand < 1 && num_eyes > 0) {
					num_eyes--;
					// eye
					this.play_state.blocks[this.play_state.tiles[x][y]].preset_hint(2);
			} else if (rand < 1 && num_hands > 0) {
					num_hands--;
					// 4touch
					this.play_state.blocks[this.play_state.tiles[x][y]].preset_hint(1);
			} else if (false && rand < 1 && num_walkers > 0) {
					num_walkers--;
					// walkers
					this.play_state.blocks[this.play_state.tiles[x][y]].preset_hint(6);
			} else if (rand < 0 && num_eyeplustouch > 0) {
					num_eyeplustouch--;
					// walkers
					this.play_state.blocks[this.play_state.tiles[x][y]].preset_hint(3);
			} else if (rand < 1 && num_bombs > 0) {
					num_bombs--;
					// bomb
					this.play_state.change_tile(x,y,2);
					bomb_ = 1;
			} else if (rand < 1 && num_hearts > 0) {
					//num_hearts--;
					//this.play_state.blocks[this.play_state.tiles[x][y]].preset_hint(5);
			} else if (rand < 1 && num_compass > 0) {
					num_compass--;
					
					this.play_state.blocks[this.play_state.tiles[x][y]].preset_hint(11);
			} else {
					
					//if (Math.random() < 0.8) this.play_state.blocks[this.play_state.tiles[x][y]].preset_hint(4);
					//else this.play_state.blocks[this.play_state.tiles[x][y]].preset_hint(1);

					//if (g_toggle_hand.toggled == -1) this.play_state.blocks[this.play_state.tiles[x][y]].preset_hint(4);
			}

			


		}

		

		for(var i = 0; i < 60; i++) {
			
			if (num_joins <= 0) break;

			var x = Math.floor(this.play_state.grid_w*Math.random());
			var y = Math.floor(this.play_state.grid_h*Math.random());

			x = Math.min(x, this.play_state.grid_w - 2);
			y = Math.min(y, this.play_state.grid_h - 2);

			

			if (this.play_state.joined_tiles[x][y] != 0) continue;

			

			if (this.play_state.blocks[this.play_state.tiles[x][y]].block_type == 2) continue;
			

			if (this.play_state.blocks[this.play_state.tiles[x][y]].preset_hint_type != 2 && 
				this.play_state.blocks[this.play_state.tiles[x][y]].preset_hint_type != 4 &&
				this.play_state.blocks[this.play_state.tiles[x][y]].preset_hint_type != 1) continue;

			if (Math.random() < 0.5) {
				if (this.play_state.joined_tiles[x+1][y] != 0) continue;
				this.play_state.blocks[this.play_state.tiles[x + 1][y]].preset_hint(0);
				this.play_state.change_tile(x+1,y,0);
				this.play_state.join_tiles(x+1,y,x,y);
			} else {
				if (this.play_state.joined_tiles[x][y+1] != 0) continue;
				this.play_state.blocks[this.play_state.tiles[x][y + 1]].preset_hint(0);
				this.play_state.change_tile(x,y+1,0);
				this.play_state.join_tiles(x,y+1,x,y);
			}


			//alert('this.play_state.joined_tiles[x][y]');

			num_joins--;
		}

		
		for (var x = 0; x < this.play_state.grid_w; x++) {
			for (var y = 0; y < this.play_state.grid_h; y++) {
				if (this.play_state.blocks[this.play_state.tiles[x][y]].block_type == 1) continue;
				this.play_state.blocks[this.play_state.tiles[x][y]].cover();
				//this.play_state.blocks[this.play_state.tiles[x][y]].uncover();
				//this.play_state.blocks[this.play_state.tiles[x][y]].cover();
			}
		}

		
		for (var i = 0; i < 100; i++) {
			
			var x = Math.floor(this.play_state.grid_w*Math.random());
			var y = Math.floor(this.play_state.grid_h*Math.random());

			if (num_uncovered <= 0) continue;
			if (this.play_state.blocks[this.play_state.tiles[x][y]].covered_up == false) continue;
			if (this.play_state.blocks[this.play_state.tiles[x][y]].block_type == 1) continue;
			if (this.play_state.blocks[this.play_state.tiles[x][y]].block_type == 2) continue;
			if (this.play_state.blocks[this.play_state.tiles[x][y]].join_group != 0) continue;
			
			this.play_state.blocks[this.play_state.tiles[x][y]].uncover();
			num_uncovered--;

		}
		
		for (var x = 0; x < this.play_state.grid_w; x++) {
			for (var y = 0; y < this.play_state.grid_h; y++) {
				continue;
				this.play_state.blocks[this.play_state.tiles[x][y]].cover();

				rand = Math.random();
				if (rand < 0.2 && num_uncovered > 0) {
					//this.play_state.blocks[this.play_state.tiles[x][y]].uncover();
					// this.play_state.blocks[this.play_state.tiles[x][y]].calc_hint();
					num_uncovered--;
				} else if (wall_ == 0) {
					
				}

				if (wall_ == 1) this.play_state.blocks[this.play_state.tiles[x][y]].uncover(false);
				if (bomb_ == 1) this.play_state.blocks[this.play_state.tiles[x][y]].cover();
			}
		}		

		
		for (var x = 0; x < this.play_state.grid_w; x++) {
			for (var y = 0; y < this.play_state.grid_h; y++) {
				if (this.play_state.blocks[this.play_state.tiles[x][y]].block_type == 1) continue;
				this.play_state.blocks[this.play_state.tiles[x][y]].calc_hint(this.play_state.blocks[this.play_state.tiles[x][y]].preset_hint_type);

			}
		}
				
		var progress_needed = 100 - 2*num_crowns - 2*num_hearts - 2*num_compass;
	
		

		var solve_ = this.play_state.check_solve(progress_needed);

		if (solve_ == true) {
			// add in the more difficult clues to the parts that the solver couldnt uncover
			var loops = 0;
			//for (var i = 0; i < 100; i++) {
			while (num_eyes + num_hands + num_joins + num_hearts + num_bombs + num_compass > 0 && loops < 200) {
			loops++;
			var x = Math.floor(this.play_state.grid_w*Math.random());
			var y = Math.floor(this.play_state.grid_h*Math.random());
				
				//if (this.play_state.solver_cover[x][y] != 1) continue;
				if (this.play_state.blocks[this.play_state.tiles[x][y]].block_type == 0) {
					
					if (this.play_state.blocks[this.play_state.tiles[x][y]].join_group != 0) continue;

					var rand_hint = Math.random();

					var was_covered = false;

					if (rand_hint < 0.33 && num_hearts > 0) {
						num_hearts--;
						this.play_state.blocks[this.play_state.tiles[x][y]].preset_hint(5)
						//was_covered = this.play_state.blocks[this.play_state.tiles[x][y]].covered_up;
						this.play_state.blocks[this.play_state.tiles[x][y]].cover();
					} else if (rand_hint < 0.66 && num_crowns > 0) {
						num_crowns--;
						this.play_state.blocks[this.play_state.tiles[x][y]].preset_hint(11);
						this.play_state.blocks[this.play_state.tiles[x][y]].cover();
					} else if (rand_hint < 1 && num_compass > 0) {
						num_compass--;
						this.play_state.blocks[this.play_state.tiles[x][y]].preset_hint(12);
						this.play_state.blocks[this.play_state.tiles[x][y]].cover();
					}

				}
			}
			

		}		

		if (this.attempts*0 > 20 || solve_ == true) {	

			this.change_state(this.engine, new StartGameStateClass(this.engine, this.play_state));

		}

		this.attempts++;
	},

	attempts: 0,

	
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

g_dig_tiles_text = null;
g_flag_tiles_text = null;

g_freedig_text = null;
g_freedig_button = null;

g_this_level_num_text = null;


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

	freedig_x: 0,
	freedig_y: 0,

	grey_x: 0,
	grey_y: 0,

	show_level_text: false,

	auto_dig_timer: 0,

	flag_timer: 0,

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

			g_dig_tiles_text = new TextClass(Types.Layer.GAME_MENU);
			g_dig_tiles_text.set_font(Types.Fonts.SMALL);
			g_dig_tiles_text.set_text("");
			

			g_flag_tiles_text = new TextClass(Types.Layer.GAME_MENU);
			g_flag_tiles_text.set_font(Types.Fonts.SMALL);
			g_flag_tiles_text.set_text("");

			g_freedig_text = new TextClass(Types.Layer.GAME_MENU);
			g_freedig_text.set_font(Types.Fonts.SMALL);
			g_freedig_text.set_text("");

			g_freedig_button = new ButtonClass();
			g_freedig_button.setup_sprite("heart.png",Types.Layer.GAME_MENU);
			g_freedig_button.update_pos(screen_width + 200, screen_height*0.5);
			g_freedig_button.hide();

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
			g_level_text_1.set_font(Types.Fonts.MEDIUM);
			g_level_text_1.set_text("");

			g_level_text_2 = new TextClass(Types.Layer.TILE);
			g_level_text_2.set_font(Types.Fonts.SMALL);
			g_level_text_2.set_text("");

			g_this_level_num_text = new TextClass(Types.Layer.GAME_MENU);
			g_this_level_num_text.set_font(Types.Fonts.XSMALL);
			g_this_level_num_text.set_text("");
		

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

		//if (this.play_state.game_mode == 1) g_freedig_button.make_vis();	// minesweeper++ mode

		g_freedig_text.change_text(this.play_state.num_free_digs.toString() + "LIVES");

		//g_undo_button_sprite.update_pos(-999, -999);


		if (this.play_state.current_level == 0) {

			this.play_state.info_obj.set_hint_type(1);	// 4 touch
			this.play_state.info_obj.hidden = false;
			this.play_state.info_obj.draw_once();

			this.show_level_text = true;
			// tutorial state
			g_level_text_1.change_text("WHERE ARE THE MINES HIDDEN?"); //("MINE OF SIGHT");//

			//If a white tile is safe then remove it
			g_level_text_2.change_text("If a white tile is safe then remove it \nIf a white tile is unsafe then flag it");
			


		} else if (this.play_state.current_level == 1) {

			this.show_level_text = true;
			// tutorial state
			g_level_text_1.change_text("NOT DIAGONALLY");
			g_level_text_2.change_text("Just up and down and left and right");

		} else if (this.play_state.current_level == 3) {

			this.show_level_text = true;
			// tutorial state
			g_level_text_1.change_text("FOLLOW THE CLUES");
			g_level_text_2.change_text("You don't need to guess");

		} else if (this.play_state.current_level == 5) {

			this.show_level_text = true;
			// tutorial state
			g_level_text_1.change_text("THIS ONE IS TRICKY");
			g_level_text_2.change_text("But you still don't need to guess");

		} else if (this.play_state.current_level == 2) {

			this.play_state.info_obj.set_hint_type(2);	// see
			this.play_state.info_obj.hidden = false;
			this.play_state.info_obj.draw_once();

			this.show_level_text = true;
			// tutorial state
			g_level_text_1.change_text("HOW MANY MINES CAN THE EYE SEE?");
			g_level_text_2.change_text("The eye is a different type of clue");


		} else if (this.play_state.current_level == 6) {

			//this.show_level_text = true;
			// tutorial state
			g_level_text_1.change_text("WALLS BLOCK THE LINE OF SIGHT");
			g_level_text_2.change_text("");
			


		} else if (this.play_state.current_level == 7) {

			// this one is general advice, it can go on any level
			g_level_text_1.change_text("YOU MUST DIG OR FLAG EVERY TILE TO WIN");
			g_level_text_2.change_text("");
			


		} else if (this.play_state.current_level == 8) {

			this.show_level_text = true;
			// tutorial state
			g_level_text_1.change_text("");
			g_level_text_2.change_text("You can click on a hint tile if you forget how it works");

			


		} else if (this.play_state.current_level == 13) {

			this.play_state.info_obj.set_hint_type(4);	// 8 touch
			this.play_state.info_obj.hidden = false;
			this.play_state.info_obj.draw_once();

			this.show_level_text = true;
			// tutorial state
			g_level_text_1.change_text("NEW HINT TYPE");
			g_level_text_2.change_text("This hint can feel diagonal mines too");


		}  else if (this.play_state.current_level == 18) {

			this.show_level_text = true;
			// tutorial state
			g_level_text_1.change_text("WELCOME TO 1992 ;)");
			g_level_text_2.change_text("");


		} else if (this.play_state.current_level == 28) {

			//this.play_state.info_obj.set_hint_type(3);	// plus
			//this.play_state.info_obj.hidden = false;
			//this.play_state.info_obj.draw_once();

			this.show_level_text = true;
			// tutorial state
			g_level_text_1.change_text("TWO TILES BECOME ONE BIG TILE");
			g_level_text_2.change_text("HOW MANY MINES CAN THIS ONE BIG TILE SEE?");


		}  else if (false && this.play_state.current_level == 21) {

			this.play_state.info_obj.set_hint_type(3);	// plus
			this.play_state.info_obj.hidden = false;
			this.play_state.info_obj.draw_once();

			this.show_level_text = true;
			// tutorial state
			g_level_text_1.change_text("NEW HINT TYPE");
			g_level_text_2.change_text("What do you get\nif you add eye plus touch?");


		} else if (this.play_state.current_level == 53) {

			this.play_state.info_obj.set_hint_type(5);	// heart
			this.play_state.info_obj.hidden = false;
			this.play_state.info_obj.draw_once();

			this.show_level_text = true;
			// tutorial state
			g_level_text_1.change_text("SOME MINES FEEL VERY LONELY");
			g_level_text_2.change_text("But the heart cares\nThe heart sees ONLY mines who are all alone.");


		} else if (this.play_state.current_level == 80) {

			this.play_state.info_obj.set_hint_type(11);	// compass
			this.play_state.info_obj.hidden = false;
			this.play_state.info_obj.draw_once();

			this.show_level_text = true;
			// tutorial state
			g_level_text_1.change_text("HOW MANY DIRECTIONS?");
			g_level_text_2.change_text("The compass only tells you how many\nDIRECTIONS (0-4) it sees mines in.");


		} else if (this.play_state.current_level == 90) {

			this.play_state.info_obj.set_hint_type(12);	// crown
			this.play_state.info_obj.hidden = false;
			this.play_state.info_obj.draw_once();

			this.show_level_text = true;
			// tutorial state
			g_level_text_1.change_text("ONLY THE BEST FOR THE KING");
			g_level_text_2.change_text("The crown tells you the highest\nunbroken sequence of mines that it can see.");


		}


		g_this_level_num_text.change_text("LEVEL " + (this.play_state.current_level + 1).toString());
		if (this.play_state.game_mode == 0) g_this_level_num_text.update_pos(16,16);
		else g_this_level_num_text.update_pos(-999,-999);
		
		this.screen_resized();

	},

	cleanup : function () {

		

		g_this_level_num_text.update_pos(-999,-999);

		g_dig_button.update_pos(-999,-999);
		g_flag_button.update_pos(-999,-999);

		g_flag_tiles_text.update_pos(-999,-999);
		g_dig_tiles_text.update_pos(-999,-999);

		g_level_text_1.update_pos(-999,-999);
		g_level_text_2.update_pos(-999,-999);

		//g_undo_button_sprite.update_pos(-999,-999);

		g_skip_tut_button.update_pos(-999,-999);
		g_skip_tut_text.update_pos(-999,-999);

		g_freedig_text.update_pos(-999,-999);
		g_freedig_button.hide();

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

			if (this.play_state.game_mode == 0) g_this_level_num_text.update_pos(16,16);
			
		} else {
			this.flag_x = screen_width - 128;
			this.flag_y = screen_height - 96 + 16;

			this.dig_x = 128;
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

			if (this.play_state.game_mode == 0) g_this_level_num_text.update_pos(screen_width - 78,screen_height - 16);
		}

		
		g_skip_tut_button.update_pos(this.home_x, this.home_y);
		g_skip_tut_text.update_pos(this.home_x + 42, this.home_y - 8);

		g_flag_button.update_pos(this.flag_x,this.flag_y);
		g_dig_button.update_pos(this.dig_x,this.dig_y);
		g_freedig_button.update_pos(this.freedig_x,this.freedig_y);

		g_flag_tiles_text.update_pos(this.flag_x - 170, this.flag_y);
		g_dig_tiles_text.update_pos(this.dig_x - 155, this.dig_y);
		g_freedig_text.update_pos(this.freedig_x - 155, this.freedig_y);
		
		g_flag_tiles_text.update_pos(this.flag_x, this.flag_y + 42);
		g_dig_tiles_text.update_pos(this.dig_x, this.dig_y + 42);
		g_flag_tiles_text.center_x(this.flag_x);
		g_dig_tiles_text.center_x(this.dig_x);

	

		if (this.show_level_text == true) {
			g_level_text_1.update_pos(0.25*this.play_state.tile_size, 0.25*this.play_state.tile_size,999,999);
			g_level_text_2.update_pos(0.25*this.play_state.tile_size, 1*this.play_state.tile_size,999,999);
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
			g_dig_tiles_text.change_text("DIG " + this.num_selected_tiles.toString() + " TILES [D]");
			g_flag_tiles_text.change_text("FLAG " + this.num_selected_tiles.toString() + " TILES [F]");
		} else if (g_click_to_dig == false && this.num_selected_tiles == 0) {
			g_dig_tiles_text.change_text("NO TILES SELECTED");
			g_flag_tiles_text.change_text("NO TILES SELECTED");
		} else {
			g_dig_tiles_text.change_text("");
			g_flag_tiles_text.change_text("");
		}

		

		this.play_state.screen_resized();
	},

	
	highlighted_x: 0,
	highlighted_y: 0,

	handle_wheel: function () {
		
	},

	hold_down_timer: 0,

	handle_mouse_down: function(engine,x,y) {

		if (g_hold_to_flag == true) this.hold_down_timer++;
		else {
			
		}

		
		if (this.hold_down_timer == 16 && g_hold_to_flag == true) {
			this.handle_mouse_move(engine,x,y);

			this.handle_right_click(engine,x,y);
			
		} 
	
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

		if (mouse.y > this.freedig_y - 32 &&
		    mouse.y < this.freedig_y + 32 &&
		    mouse.x > this.freedig_x - 32 &&
		    mouse.x < this.freedig_x + 32 && this.play_state.num_free_digs > 0) {
			this.play_state.num_free_digs--;
			this.play_state.do_free_dig();
			g_freedig_text.change_text(this.play_state.num_free_digs.toString() + "LIVES");
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

	
	right_mouse_down: false,
	
	handle_right_click: function(engine,x,y) {


		//if (this.right_mouse_down == true) {
		//	return;
		//}

		this.right_mouse_down = false;
		

		this.handle_mouse_move(engine,x,y);	// set selected x y

		if (this.flag_timer > 1) return;

		if (this.highlighted_x < 0 || 
		    this.highlighted_x >= this.play_state.grid_w ||
		    this.highlighted_y < 0 || 
		    this.highlighted_y >= this.play_state.grid_h) return;

		var flag_on_ = this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].flag_on;


		if (flag_on_ == false) this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].put_flag_on();
		else this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].take_flag_off();

		this.flag_timer = 15;

		game.jumpSound.play();

		this.check_for_victory();
	},

	handle_key:function(keynum) {
		if (g_click_to_dig == true) return;
		return;
		
		if (keynum == 70) {
			// F flag
			this.flag_selected();
		} else if (keynum == 68) {
			// D dig
			this.dig_selected();
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
	

	handle_mouse_up: function(engine,x,y) {


		//if (mouse.x > screen_width - 100 &&
		//    mouse.y > screen_height - 100) this.undo();

		this.mouse_down = false;

		if (this.right_mouse_down == true) {
			this.hold_down_timer = 0;

			this.right_mouse_down = false;
			return;
		}	

		this.right_mouse_down = false;

		//alert(' this.hold_down_timer ' + this.hold_down_timer);

		if (this.hold_down_timer >= 16) {
			this.hold_down_timer = 0;
			
			if (g_hold_to_flag == true) return;
		}

		if (g_hold_to_flag == false) this.handle_mouse_move(engine,x,y);

		this.hold_down_timer = 0;

		

		if (this.highlighted_x < 0 || 
		    this.highlighted_x >= this.play_state.grid_w ||
		    this.highlighted_y < 0 || 
		    this.highlighted_y >= this.play_state.grid_h ) {

			for (var x = 0; x < this.play_state.grid_w; x++) {
				for (var y = 0; y < this.play_state.grid_h; y++) {
					this.play_state.selected_tiles[x][y] = 0;
					this.play_state.blocks[this.play_state.tiles[x][y]].deselect();
					this.num_selected_tiles = 0;

					if (g_click_to_dig == false) {
						g_flag_button.hide();
						g_dig_button.hide();

						g_flag_tiles_text.update_pos(-999,-999);
						g_dig_tiles_text.update_pos(-999,-999);
					}
				}
			}

			this.clicked_hint_x = this.highlighted_x;
			this.clicked_hint_y = this.highlighted_y;
	
			this.play_state.info_obj.hidden = true;
			this.play_state.info_obj.draw_once();

			return;
		}

		if (g_click_to_dig == true) {
			for (var x = 0; x < this.play_state.grid_w; x++) {
				for (var y = 0; y < this.play_state.grid_h; y++) {
					this.play_state.selected_tiles[x][y] = 0;
					this.play_state.blocks[this.play_state.tiles[x][y]].deselect();
					this.num_selected_tiles = 0;

					//g_flag_button.hide();
					//g_dig_button.hide();
					//g_flag_tiles_text.update_pos(-999,-999);
					//g_dig_tiles_text.update_pos(-999,-999);
				}
			}
		}

		if (this.play_state.selected_tiles[this.highlighted_x][this.highlighted_y] == 0 &&
		    this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].covered_up == false) {

			this.play_state.info_obj.hidden = false;
			this.play_state.info_obj.set_block(this.highlighted_x, this.highlighted_y);
			this.play_state.info_obj.draw_once();

			if (this.clicked_hint_x == this.highlighted_x &&
			    this.clicked_hint_y == this.highlighted_y) {
				// grey or ungrey
				if ( this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].grey_status == 0)  this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].grey_out();
				else  this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].ungrey();
		
			}
			
			
		}

		this.clicked_hint_x = this.highlighted_x;
		this.clicked_hint_y = this.highlighted_y;

		

		if (this.play_state.selected_tiles[this.highlighted_x][this.highlighted_y] == 0 &&
		    this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].covered_up == true) {

			//if (this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].flag_on == true) return;

			if (g_click_to_dig == true && this.hold_down_timer < 20 &&
				this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].flag_on == false) {

				this.hold_down_timer = 0;

				this.auto_dig_timer = 15;

				game.blipSound.play();

				this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].uncover();	

				if (this.play_state.get_block_type(this.highlighted_x,this.highlighted_y) == 2) {

					var game_over_ = 1;

					if (false && this.play_state.game_mode == 1) {
						game_over_ = 0;
						this.play_state.num_free_digs--;
						if (this.play_state.num_free_digs <= 0) game_over_ = 1;
						g_freedig_text.change_text(this.play_state.num_free_digs.toString() + "LIVES");
					}

					if (game_over_ == 1) {

						// Store the x,y where we start the explosion effect
						this.play_state.start_game_over(this.highlighted_x,this.highlighted_y);

						this.change_state(this.engine, new GameOverStateClass(this.engine, this.play_state));
						return;

					}
				}

				this.check_for_victory();

				if (this.play_state.game_mode == 1) {
					for (var i = 0; i < this.play_state.gem_x.length; i++) {
						if (this.play_state.gem_x[i] == this.highlighted_x && 
						    this.play_state.gem_y[i] == this.highlighted_y) {
							this.play_state.num_free_digs++;
						}
					}
				}

				return;
			}

			this.play_state.selected_tiles[this.highlighted_x][this.highlighted_y] = 1;
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].select();

			
			//this.dig_selected();

			//playSoundInstance('curve.wav',0.1);
			game.curveSound.play();
			this.num_selected_tiles++;
			g_flag_button.make_vis();
			g_dig_button.make_vis();
			this.screen_resized();
		} else {

			if (this.play_state.selected_tiles[this.highlighted_x][this.highlighted_y] == 1) {
				this.num_selected_tiles--;
			} 

			this.play_state.selected_tiles[this.highlighted_x][this.highlighted_y] = 0;
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].deselect();
			game.curveSound.play();
			
			if (this.num_selected_tiles == 0 && g_click_to_dig == false) { 
				g_flag_button.hide();
				g_dig_button.hide();
				g_flag_tiles_text.update_pos(-999,-999);
				g_dig_tiles_text.update_pos(-999,-999);
			}
		}

		if (g_click_to_dig == false) {
			g_dig_tiles_text.change_text("DIG " + this.num_selected_tiles.toString() + " TILES");
			g_flag_tiles_text.change_text("FLAG " + this.num_selected_tiles.toString() + " TILES");
		} else {
			g_dig_tiles_text.change_text("LEFT CLICK");
			if (g_hold_to_flag == true) { 
				g_dig_tiles_text.change_text("CLICK");
				g_flag_tiles_text.change_text("HOLD");
			} else g_flag_tiles_text.change_text("RIGHT CLICK");
		}

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
			}
		}

		
	},

	flag_selected: function () {

		game.jumpSound.play();

		

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

		this.auto_dig_timer = 15;

		game.blipSound.play();

		for (var x = 0; x < this.play_state.grid_w; x++) {
			for (var y = 0; y < this.play_state.grid_h; y++) {
				if (this.play_state.selected_tiles[x][y] == 0) continue;
				this.play_state.selected_tiles[x][y] = 0;

				this.play_state.blocks[this.play_state.tiles[x][y]].uncover();	

				if (this.play_state.get_block_type(x,y) == 2) {

					

					// Store the x,y where we start the explosion effect
					this.play_state.start_game_over(x,y);

					this.change_state(this.engine, new GameOverStateClass(this.engine, this.play_state));
					return;

					
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

				
				this.grey_out();
				return;
			}
		}

		this.victory = true;

		this.grey_out();

		if (this.victory == true) {
			
			this.change_state(this.engine, new WinStateClass(this.engine, this.play_state));
		} else {
			
			
		}

		
	},

	auto_dig: function() {

		

		for (var x = 0; x < this.play_state.grid_w; x++) {
			for (var y = 0; y < this.play_state.grid_h; y++) {
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
					this.auto_dig_timer = 8;

					game.blipSound.play();

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
					this.auto_dig_timer = 8;

					game.blipSound.play();

					return;
				}
			}
		}
	},

	update: function() { 

		if (this.flag_timer > 0) this.flag_timer--;

		if (this.auto_dig_timer > 0) {
			this.auto_dig_timer--;
			if (this.auto_dig_timer == 0) {
				this.auto_dig();

				this.check_for_victory();
			}
		}

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
			this.game_over_text_x = screen_width - 94;//10*this.play_state.tile_size;//screen_width - 96;
			this.game_over_text_y = 32;

			this.game_over_text2_x = screen_width - 94;//10*this.play_state.tile_size;//screen_width - 96;
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
			this.game_over_text_x = screen_width - 150;;
			this.game_over_text_y = screen_height - 128 - 32;

			this.game_over_text2_x = screen_width - 150;;
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

	},

	screen_resized: function () {
		this.play_state.screen_resized();

		this.arrange_screen();

		//var h = screen_height/ratio;

		
	},

	
	handle_mouse_up: function(engine,x,y) {


		x = mouse.x;
		y = mouse.y;

		var next_ = 0;

		if (screen_width < screen_height && mouse.y > screen_height*0.5) next_ = 1;

		if (x > this.newgame_x - 32 &&
		    x < this.newgame_x + 32 &&
		    y > this.newgame_y - 32 &&
		    y < this.newgame_y + 32) next_ = 1;

		

		if (next_ == 1) {

			this.play_state.score = 0;

			if (this.play_state.game_mode == 1) {
				// 1992 mode
				this.change_state(this.engine, new SetupRandStateClass(this.engine, this.play_state));
				return;
			} else if (this.play_state.game_mode == 2) {
				// testing level editor
				this.change_state(this.engine, new LevelEditorStateClass(this.engine, this.play_state));
				this.play_state.restore_backup();
				return;
			}



			if (this.play_state.current_level < 99) {
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

		//('game over update');

		this.play_state.update();

		//('game over update   A');
		
		this.timer--;
		if (this.timer == 0) {

			if (this.pop_dist < 30) {
				if (Math.random() < 0.5) game.crunchSound.play();
				else game.thudSound.play();
			}

			//('game over update   B');

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

				//('this.pop_dist ' + this.pop_dist); 

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

				//('x ' + x); //('y ' + y);

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
		if (screen_width > screen_height)  g_restart_text.update_pos(this.newgame_x - 142, this.newgame_y - 8);
		else g_restart_text.update_pos(this.newgame_x, this.newgame_y + 32);
		
		
		g_tweet_score_sprite.update_pos(this.twitter_x, this.twitter_y);
		if (screen_width > screen_height) g_sharethis_text.update_pos(this.twitter_x - 128, this.twitter_y - 16);
		else g_sharethis_text.update_pos(this.twitter_x, this.twitter_y + 32);

		
		
		
	}
});


g_is_the_current_level_loaded = false;

g_all_level_data_floor_layer = {};
g_all_level_data_cover_layer = {};

g_all_level_data_floor_layer[0] = [
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,1,1,1,1,0,0,0],
[0,0,0,1,5,2,1,0,0,0],
[0,0,0,1,0,1,1,0,0,0],
[0,0,0,1,5,0,1,0,0,0],
[0,0,0,1,1,1,1,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0]
		];

g_all_level_data_cover_layer[0] = 
		[
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,6,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,6,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0]
		];


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

		var first_in_file = Math.floor(level_num / 10)*10;

		if (g_all_level_data_floor_layer[level_num] == null &&
		    g_current_level_data.levels_starting_from == first_in_file) {
			// loaded but not processed
			g_is_the_current_level_loaded = true;
			
		} else if (g_all_level_data_floor_layer[level_num] == null) {
			// not yet loaded
			//(level_num.toString() + ' not yet loaded');
			

			//('first_in_file '+first_in_file.toString());
			
			var last_in_file = first_in_file + 9;
			

			var file_n = 'levels/level' + first_in_file.toString() + 'to' + last_in_file + '.json';

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
			this.change_state(this.engine, new RestartGameStateClass(this.engine, this.play_state));

			return;

		}

		////('g_is_the_current_level_loaded' + g_is_the_current_level_loaded );
		if(g_is_the_current_level_loaded == true) {
			g_is_the_current_level_loaded = false;

			var num_levels_in_this_file = g_current_level_data.floor.length;
			var first_level_in_this_file = g_current_level_data.levels_starting_from;
			var last_level = first_level_in_this_file  + num_levels_in_this_file ;

			for (var i = first_level_in_this_file; i < last_level; i++) {
				// is this a deep copy?
				//g_all_level_data_floor_layer[i] = g_current_level_data.floor[i - first_level_in_this_file].slice(0);
				//g_all_level_data_cover_layer[i] = g_current_level_data.cover[i - first_level_in_this_file].slice(0);

				//('storing level ' + i);

				g_all_level_data_floor_layer[i] = new Array(10);
				g_all_level_data_cover_layer[i] = new Array(10);

				if (g_all_level_status[i] == null) g_all_level_status[i] = 1;	// available

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

StartOverworldStateClass = GameStateClass.extend({
	play_state: null,
	engine: null,

	y_pos: 0,
	x_pos: 0,

	x_vel: 0,
	y_vel: 0,

	timer: 110,

	// remove old screen and bring in new one

	init: function(engine, play_state, xvel, yvel) {

		this.engine = engine;
		this.play_state = play_state;

		this.x_vel = xvel;
		this.y_vel = yvel;

		play_screen_container.visible = true;
		play_screen_group.y = 0;
		play_screen_group.x = 0;
	},

	
	update: function() { 
		this.play_state.update();

		this.change_state(this.engine, new OverworldStateClass(this.engine, this.play_state));
		return;

		this.x_pos--;
		var dist_ = (0 - this.x_pos);

		this.x_pos = this.x_pos - 0.25*dist_;//- 0.075*Math.abs(this.x_pos + 999);
		play_screen_group.x = this.x_pos;
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
		
		play_screen_group.y = 0;
		play_screen_group.x = 0;	
	}

});

g_editor_sprites_objs = null;

g_editor_upload_button = null;
g_editor_upload_text = null;

g_editor_test_button = null;
g_editor_test_text = null;

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


		if (g_editor_upload_button == null) {
			//var empty_ =

			//g_editor_sprites.push(empty_);

			g_editor_upload_button = new SpriteClass();
			g_editor_upload_button.setup_sprite('uparrow.png',Types.Layer.GAME_MENU);
			g_editor_upload_button.update_pos(-999,-999);

			g_editor_upload_text = new TextClass(Types.Layer.GAME_MENU);
			g_editor_upload_text.set_font(Types.Fonts.SMALL);
			g_editor_upload_text.set_text("UPLOAD");

			g_editor_test_button = new SpriteClass();
			g_editor_test_button.setup_sprite('rightarrow.png',Types.Layer.GAME_MENU);
			g_editor_test_button.update_pos(-999,-999);

			g_editor_test_text = new TextClass(Types.Layer.GAME_MENU);
			g_editor_test_text.set_font(Types.Fonts.SMALL);
			g_editor_test_text.set_text("PLAYTEST");

			g_editor_sprites_objs = new LevelEditorTileSelectClass();

			g_editor_sprites_objs.add_new('button.png', 0);
			g_editor_sprites_objs.add_new('block0.png', 1);
			g_editor_sprites_objs.add_new('flagblock.png', 2);

			g_editor_sprites_objs.add_new('g_block2.png', 3);

			g_editor_sprites_objs.add_new('hand.png', 4);	
			g_editor_sprites_objs.add_new('eye.png', 5);
			g_editor_sprites_objs.add_new('8hand.png', 6);			

		}

		for (var x = 0; x < this.play_state.grid_w; x++) {
			for (var y = 0; y < this.play_state.grid_h; y++) {
				this.play_state.blocks[this.play_state.tiles[x][y]].editor_mode = 1;
			}
		}
		

		g_editor_sprites_objs.make_vis();

		this.screen_resized();
	},

	play_level: function () {
		this.play_state.game_mode = 2;
		this.change_state(this.engine, new DuringGameStateClass(this.engine, this.play_state));
		this.play_state.backup_level();

		for (var x = 0; x < this.play_state.grid_w; x++) {
			for (var y = 0; y < this.play_state.grid_h; y++) {
				

				if (this.play_state.blocks[this.play_state.tiles[x][y]].covered_up == false) {
					// recalc hints
					this.play_state.blocks[this.play_state.tiles[x][y]].cover();
					this.play_state.blocks[this.play_state.tiles[x][y]].uncover();
				}

				this.play_state.blocks[this.play_state.tiles[x][y]].editor_mode = 0;
			}
		}
		
		this.play_state.restore_backup();	// reset & remove the half qns
	},

	cleanup: function () {
		g_editor_sprites_objs.hide();

		g_editor_upload_text.update_pos(-999,-999);
		g_editor_upload_button.hide();

		g_editor_test_text.update_pos(-999,-999);
		g_editor_test_button.hide();

		for (var x = 0; x < this.play_state.grid_w; x++) {
			for (var y = 0; y < this.play_state.grid_h; y++) {
				this.play_state.blocks[this.play_state.tiles[x][y]].editor_mode = 0;
			}
		}
	},

	test_x: 0,
	test_y: 0,

	screen_resized: function() {
		this.upload_x = screen_width - 64;
		this.upload_y = screen_height - 64;

		this.test_x = screen_width - 64;
		this.test_y = screen_height - 128;
	
		g_editor_upload_button.update_pos(this.upload_x, this.upload_y);

		g_editor_upload_text.update_pos(this.upload_x, this.upload_y + 32);
		g_editor_upload_text.center_x(this.upload_x);

		g_editor_test_button.update_pos(this.test_x, this.test_y);

		g_editor_test_text.update_pos(this.test_x, this.test_y + 32);
		g_editor_test_text.center_x(this.test_x);

		
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

		this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].reset();
		this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].preset_hint(0);
	
		this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].cover();
		this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].uncover();
		this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].editor_mode = 1;
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


	handle_mouse_down: function(engine,x,y) {

		this.handle_mouse_move(engine,x,y);

		if (mouse.x > this.upload_x - 25 &&
		    mouse.x < this.upload_x + 25 &&
		    mouse.y > this.upload_y - 25 &&
		    mouse.y < this.upload_y + 25) {
			
			// PostFirebaseLevel
			//this.change_state(this.engine, new PostFirebaseLevel(this.engine, this.play_state));
			this.change_state(this.engine, new PostPlaytomicLevel(this.engine, this.play_state));
			return;
		}

		if (mouse.x > this.test_x - 25 &&
		    mouse.x < this.test_x + 25 &&
		    mouse.y > this.test_y - 25 &&
		    mouse.y < this.test_y + 25) {
			
			// PostFirebaseLevel
			this.play_level();
			return;
		}

		if (this.highlighted_x < 0 || 
		    this.highlighted_x >= this.play_state.grid_w ||
		    this.highlighted_y < 0 || 
		    this.highlighted_y >= this.play_state.grid_h) return;
		

		
		if (g_editor_sprites_objs.selected == 0) {

			
			this.delete_tile(this.highlighted_x,this.highlighted_y);
			
		} else if (g_editor_sprites_objs.selected == 1) {
	
			
		this.delete_tile(this.highlighted_x,this.highlighted_y);

			this.play_state.change_tile(this.highlighted_x,this.highlighted_y,1);
			//this.play_state.set_clue(this.highlighted_x,this.highlighted_y, 0);

		} else if (g_editor_sprites_objs.selected == 2) {

			
		this.delete_tile(this.highlighted_x,this.highlighted_y);

			this.play_state.change_tile(this.highlighted_x,this.highlighted_y,2);
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].cover();
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].put_flag_on();
			//this.play_state.set_clue(this.highlighted_x,this.highlighted_y, 0);

		} else if (g_editor_sprites_objs.selected == 3) {

			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].cover();

		} else if (g_editor_sprites_objs.selected == 4) {

			
			this.delete_tile(this.highlighted_x,this.highlighted_y);

			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].preset_hint(1);
	
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].cover();
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].uncover();
			
			// 4 touch
		} else if (g_editor_sprites_objs.selected == 5) {

			
		this.delete_tile(this.highlighted_x,this.highlighted_y);

			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].preset_hint(2);    // eye
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].cover();
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].uncover();
		} else if (g_editor_sprites_objs.selected == 6) {

			
			this.delete_tile(this.highlighted_x,this.highlighted_y);

			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].preset_hint(4);    // 8 touch
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].cover();
			this.play_state.blocks[this.play_state.tiles[this.highlighted_x][this.highlighted_y]].uncover();
		}

	},

});

PostPlaytomicLevel =  GameStateClass.extend({
	play_state: null,
	engine: null,

	posted: false,

	levelstring: "0,",
	
	init: function(engine, play_state) {
		this.engine = engine;
		this.play_state = play_state;

		


		// convert level to
		//var levelstring = "0,";		// version 0
		for (var x = 0; x < this.play_state.grid_w; x++) {
			for (var y = 0; y < this.play_state.grid_h; y++) {
				var tile_ = this.play_state.get_tile_code(x,y).toString() + ",";
				this.levelstring += tile_;

			}

		}




		// test playtomic listing levels
		var list = { 
					publickey: "aaa",
					page: 1,
					perpage: 10,
					data: false,
					filters: {
						rnd: 0
					}
				};

		
		Playtomic.PlayerLevels.list(list, function(levels, numlevels, r) {
			console.log('list levels playtomic : ' + levels + ' ' + numlevels + ' ' + r);
			console.log('numlevels: ' + numlevels.toString());
			console.log('levels: ' + levels.toString());


			if (!r.success) console.log('   errorcode ' + r.errorcode);
		});
		

		

	},

	cleanup: function() {
		
	},


	post: function () {

		if (this.posted == true) return;

		var level = {
			publickey: "aaa",
    			name: "My level",
   			data: this.levelstring,
    			playername: "Ben",
			playerid: "0",
			source: "0",
			fields:  {
						rnd: 0
					}
  		}

    		Playtomic.PlayerLevels.save(level, PlaytomicSaveComplete);

		//g_playtomiclevel = level;

		this.posted = true;
	},

	

	update: function () {

		
		this.post();
		

		
	}
});

//g_playtomiclevel = "";

function PlaytomicSaveComplete(level, response) {
    if(response.success) {
        alert("Level saved successfully, the level id is " + level.levelid);
	 console.log("Level saved successfully, the level id is " + level.levelid);
    } else {
        // failed because of response.errormessage with response.errorcode
	 console.log("failed to post playtomic level " + response.errorcode);	

	//Playtomic.PlayerLevels.save(g_playtomiclevel, PlaytomicSaveComplete);	
    }
}


g_firebase_keycode_check=2;

g_posted_as_text= null;

//http://stackoverflow.com/questions/38541098/how-to-retrieve-data-from-firebase-database
PostFirebaseLevel =  GameStateClass.extend({
	play_state: null,
	engine: null,

	posted: false,

	levelstring: "0,",
	
	init: function(engine, play_state) {
		this.engine = engine;
		this.play_state = play_state;

		if (g_posted_as_text == null) {
			g_posted_as_text = new TextClass(Types.Layer.GAME_MENU);
			g_posted_as_text.set_font(Types.Fonts.MEDIUM);
			g_posted_as_text.set_text("");
			g_posted_as_text.update_pos(-999,-999);
		}


		var lev = 23;
		var levstr = "JACOB"

		g_firebase_keycode_check = 2;  // 0 - unknown, 1 - okay, 2 - nope

		//var ref = firebase.database().ref('/userlevels/' + lev.toString());

		

		// convert level to
		//var levelstring = "0,";		// version 0
		for (var x = 0; x < this.play_state.grid_w; x++) {
			for (var y = 0; y < this.play_state.grid_h; y++) {
				var tile_ = this.play_state.get_tile_code(x,y).toString() + ",";
				this.levelstring += tile_;

			}

		}

		if (g_firebase_connected == 0) {
			connect_to_firebase();
		} else if (g_firebase_connected == 2) {
			//firebase.goOnline();
		}

		

	},

	cleanup: function() {
		//firebase.goOffline();

		
		g_posted_as_text.update_pos(-999,-999);
		
	},

	keycode: "",
	//keycode_check: 2,	// 0 - unknown, 1 - okay, 2 - nope

	check_key: function() {

		var levelsRef = firebase.database().ref('/userlevels/');

		//alert('check key');

		levelsRef.child(this.keycode).once('value', function(snapshot) {
    			var exists = (snapshot.val() !== null);
			//alert('exists ' + exists);
    			if (exists == true) g_firebase_keycode_check = 2;	// taken
			else g_firebase_keycode_check = 1;	
  		});

		return;

		// http://stackoverflow.com/questions/24824732/test-if-a-data-exist-in-firebase
		levelsRef.once("value", function(snapshot) {
  			if (snapshot.hasChild(this.keycode)) {
    				this.keycode_check = 2;	// taken
 			} else this.keycode_check = 1;

			
		});
		
	},

	post: function () {

		if (this.posted == true) return;

		var ref = firebase.database().ref('/userlevels/' + this.keycode);

		ref.set( this.levelstring );

		this.posted = true;
	},

	told_user_i_posted: false,

	update: function () {

		if (g_firebase_connected == 2) {}
		else return;

		if (g_firebase_keycode_check == 2) {
	
			this.keycode = "";

			for (var i = 0; i < 5; i++) {
				// see ascii table
				var rand_ =  Math.floor(20*Math.random());
				rand_ += 48;
				if (rand_ >= 58) rand_ += 7;
			
				this.keycode += String.fromCharCode(rand_);
				
			}
			g_firebase_keycode_check = 0;

			
			
			// String.fromCharCode(keynum)
			this.check_key();
		} else if (g_firebase_keycode_check == 1) {
			//alert('posting ' + this.keycode);
			this.post();
		}

		if (this.posted == true && this.told_user_i_posted == false)  {
			this.told_user_i_posted = true;
			
			//alert('Level posted as ' + this.keycode);
			g_posted_as_text.set_text("LEVEL POSTED AS " + this.keycode);
			g_posted_as_text.update_pos(64, screen_height - 32);
			//this.change_state(this.engine, new OverworldStateClass(this.engine, this.play_state));
		}
	}
});

firebase_loaded = false;
firebase_leveldata = [];
g_loading_firebase_text = null;
LoadFirebaseLevel = GameStateClass.extend({
	
	play_state: null,
	engine: null,

	

	levelkey: 1,
	levelkeystring: "",
	

	init: function(engine, play_state) {
		this.engine = engine;
		this.play_state = play_state;

		if (g_loading_firebase_text == null) {
			g_loading_firebase_text = new TextClass(Types.Layer.GAME_MENU);
			g_loading_firebase_text.set_font(Types.Fonts.MEDIUM);
			g_loading_firebase_text.set_text("FETCHING LEVEL DATA");
			
		}

		g_loading_firebase_text.change_text("FETCHING LEVEL DATA");
		g_loading_firebase_text.update_pos(32, 32);

		if (g_firebase_connected == 0) {
			connect_to_firebase();
		} else if (g_firebase_connected == 2) {
			//firebase.goOnline();
		}

	},

	cleanup : function() {
		g_loading_firebase_text.update_pos(-999,-999);
		//firebase.goOffline();
	},

	load : function () {

		if (g_firebase_connected != 2) return;

		//(firebase);

		firebase_loaded = false;

		//var ref = firebase.database().ref('/userlevels/' +this.levelkey.toString());
		var ref = firebase.database().ref('/userlevels/' +this.levelkeystring);

		ref.once("value", function(snapshot) {
   			//(snapshot.val());

			var data_ = snapshot.val();

			if (data_ == null) {
				
				g_loading_firebase_text.change_text("NOT FOUND");
				return;
			}
	
			firebase_loaded = true;

			firebase_leveldata = data_.split(',').map(Number);

			//('firebase_leveldata ' + firebase_leveldata);

			}, function (error) {
   			//("Error: " + error.code);
				g_loading_firebase_text.change_text("NOT FOUND");
			}
		);
	},

	loaded: 0,

	update: function() {

		if (g_firebase_connected == 2) {
			if (this.loaded == 0) {
				this.loaded = 1;
				this.load();
			}
		} else return;


		if (firebase_loaded == true) {
			// firebase_leveldata
			for(var x = 0; x < this.play_state.grid_w; x++) {
				for(var y = 0; y < this.play_state.grid_h; y++) {
					// set_tile_from_code
					this.play_state.set_tile_from_code(x,y,firebase_leveldata[x*10 + y + 1]);
				}
			}

			this.play_state.calc_all_hints();

			this.change_state(this.engine, new DuringGameStateClass(this.engine, this.play_state));
		}
	},
	
	screen_resized: function() {},

});

g_seed_texts = [];
// 1st char is the seed's 'language', 0 for now
// 20 possible tiles
g_clear_seed_button = null;
g_clear_seed_text = null;

g_ok_seed_button = null;
g_ok_seed_text = null;

g_enter_seed_text = null;

SeedLevelStateClass = GameStateClass.extend({
	play_state: null,
	engine: null,

	input_cursor: 0,

	seed_length: 5,

	seed: [this.seed_length],

	init: function(engine, play_state) {
		this.engine = engine;
		this.play_state = play_state;

		if (g_seed_texts[0] == null) {
			for (var i = 0; i < this.seed_length; i++) {
				g_seed_texts[i] = new TextClass(Types.Layer.GAME_MENU);
				g_seed_texts[i].set_font(Types.Fonts.MEDIUM);
				g_seed_texts[i].set_text("");
				g_seed_texts[i].update_pos(i*1 + 1,screen_height*0.5);

				
			}

			g_enter_seed_text = new TextClass(Types.Layer.GAME_MENU);
			g_enter_seed_text.set_font(Types.Fonts.MEDIUM);
			g_enter_seed_text.set_text("ENTER LEVEL CODE");
			g_enter_seed_text.update_pos(32,32);

		}

		this.screen_resized();
	},

	screen_resized: function() {
		if (g_seed_texts[0] == null) return;
		var dist_ = screen_width / 7;
		for (var i = 0; i < this.input_cursor; i++) {
			g_seed_texts[i].update_pos(i*dist_ + dist_,screen_height*0.5);
		}
		g_enter_seed_text.update_pos(32,32);

	},

	cleanup: function() {
		for (var i = 0; i < g_seed_texts.length; i++) {
			g_seed_texts[i].update_pos(-999,-999);
		}
		g_enter_seed_text.update_pos(-999,-999);

	},

	handle_key: function(keynum) {

		if (keynum == 8) {
			// backspace
			g_seed_texts[this.input_cursor].change_text("");
			this.seed[this.input_cursor] = 0;
			

			if (this.input_cursor > 0) this.input_cursor--;

			return;
		}
		
		//g_keyboard[]
		//g_seed_texts[this.input_cursor].update_pos(this.input_cursor*dist_ + dist_,screen_height*0.5);
		g_seed_texts[this.input_cursor].change_text(String.fromCharCode(keynum));
		this.seed[this.input_cursor] = keynum;
		if (this.input_cursor < g_seed_texts.length) this.input_cursor++;

		if (this.input_cursor == this.seed_length) this.load_level();
		else this.screen_resized();
		

		
		
	},

	clear_input: function () {
		this.input_cursor = 0;
		for (var i = 0; i < g_seed_texts.length; i++) {
			g_seed_texts[i].update_pos(-999,-999);
			this.seed[i] = 0;
		}
	},

	load_success: 0,

	load_level: function() {
		
		var str_ = "";
		for (var i = 0; i < g_seed_texts.length; i++) {
			str_ += String.fromCharCode(this.seed[i])//this.seed[i].toString();
		}

		

		var loader_ = new LoadFirebaseLevel(this.engine, this.play_state);
		loader_.levelkeystring = str_;
		//loader_.load();

		this.change_state(this.engine, loader_);

	
	},

	
});

g_overworld_sprites = null;
g_total_num_of_levels = 79;//105;//68 on kong;
				// i have up to 95 good to go, not tested publically
				// up to ~ 98 have levels in progress

g_all_level_status = {};	// 1 - available,  2  - timeout, 3 - lock,  4 - tick

g_overworld_text = null;

g_overworld_fb_button = null;
g_overworld_fb_text = null;

g_overworld_left_button = null;
g_overworld_right_button = null;

g_overworld_left_text = null;
g_overworld_right_text = null;

g_overworld_to_show =  0;
// 0 is levels 1 to 30
// 1 is levels 31 to 60
// 4 is levels 61 to 90
// 3 is challenge levels
// g_overworld_to_show >= 5 : level = (g_overworld_to_show - 2)*30 + 1




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

		//play_screen_container.visible = false;

	

		this.engine = engine;
		this.play_state = play_state;

		

		if (g_overworld_sprites == null) {

			

			


			g_overworld_sprites = new OverworldSpritesClassReuseable(this.play_state);

			g_overworld_text = new TextClass(Types.Layer.GAME_MENU);
			g_overworld_text.set_font(Types.Fonts.MEDIUM);
			g_overworld_text.set_text("G_OVERWORLD TEXT");

			g_overworld_fb_text = new TextClass(Types.Layer.GAME_MENU);
			g_overworld_fb_text.set_font(Types.Fonts.SMALL);
			g_overworld_fb_text.set_text("LIKE THIS GAME:   ");

			g_overworld_fb_button = new SpriteClass();
			g_overworld_fb_button.setup_sprite('facebook-24x24.png',Types.Layer.GAME_MENU);

			g_overworld_left_button = new ButtonClass();
			g_overworld_left_button.setup_sprite('leftarrow.png',Types.Layer.GAME_MENU);

			g_overworld_right_button = new ButtonClass();
			g_overworld_right_button.setup_sprite('rightarrow.png',Types.Layer.GAME_MENU);

			g_overworld_left_text =  new TextClass(Types.Layer.GAME_MENU);
			g_overworld_left_text.set_font(Types.Fonts.SMALL);
			g_overworld_left_text.set_text("CHALLENGE MODES");

			g_overworld_right_text =  new TextClass(Types.Layer.GAME_MENU);
			g_overworld_right_text.set_font(Types.Fonts.SMALL);
			g_overworld_right_text.set_text("LEVELS 31 - 60");
			
			

			
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

		g_overworld_sprites.reset();

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
		

		for (var level in g_all_level_status) {

			//("status of level " + level.toString() + " " + g_all_level_status[level]);

			var screen_level = level;
			if (g_overworld_to_show == 1) screen_level -= 30;
			else if (g_overworld_to_show == 2) break;
			else if (g_overworld_to_show == 4) screen_level -= 60;
			else if (g_overworld_to_show >= 5) screen_level -= (g_overworld_to_show - 2)*30;

			if (screen_level < 0 || screen_level > 29) continue;

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

		g_overworld_text.update_pos(16,16);	

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

			if (i == 0) g_overworld_sprites.add_level('hand.png', levelname);
			else if (i == 2) g_overworld_sprites.add_level('eye.png', levelname);
			else if (i == 13) g_overworld_sprites.add_level('8hand.png', levelname);
			else if (false && i == 21) g_overworld_sprites.add_level('plus.png', levelname);
			else if (i == 28) g_overworld_sprites.add_level('join_tut.png', levelname);
			else if (i == 90) g_overworld_sprites.add_level('crown.png', levelname);
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

			if (i == 0) g_overworld_sprites.add_level('hand.png', levelname);
			else if (i == 2) g_overworld_sprites.add_level('eye.png', levelname);
			else if (i == 13) g_overworld_sprites.add_level('8hand.png', levelname);
			else if (false && i == 21) g_overworld_sprites.add_level('plus.png', levelname);
			else if (i == 28) g_overworld_sprites.add_level('join_tut.png', levelname);
			else g_overworld_sprites.add_level(null, levelname);

			
		}

	},

	load_campaign_31to60: function() {
		// add campaign levels
		for (var i = 0; i < g_total_num_of_levels - 30; i++) {

			if (i >= 30) break;

			var levelname = (i + 1 + 30).toString();

			if (i + 1 + 30 == 54) g_overworld_sprites.add_level('heart.png', levelname);
			else if (i + 1 + 30 == 95) g_overworld_sprites.add_level('walkingdist.png', levelname);
			else g_overworld_sprites.add_level(null, levelname);

		}
	},

	load_campaign_61to90: function() {
		// add campaign levels
		for (var i = 0; i < g_total_num_of_levels - 60; i++) {

			if (i >= 60) break;

			var levelname = (i + 1 + 60).toString();

			if (i + 1 + 60 == 95) g_overworld_sprites.add_level('walkingdist.png', levelname);
			else if (i + 1 + 60 == 81) g_overworld_sprites.add_level('compass.png', levelname);
			else if (i + 1 + 60 == 91) g_overworld_sprites.add_level('crown.png', levelname);
			else g_overworld_sprites.add_level(null, levelname);

		}
	},

	load_challenge_levels: function() {
		g_overworld_sprites.add_special("MINESWEEPER++\n(RANDOM GENERATOR)" , 1); // GenerateRandStateClass  special type 1
		//g_overworld_sprites.add_special("DAILY CHALLENGE" , 2); // special type 2
		//g_overworld_sprites.add_special("UNENDING" , 3); // special type 3
		//g_overworld_sprites.add_special("MINEDOKU" , 5); // special type 5
		//g_overworld_sprites.add_special("FIREBASE" , 7); // LoadFirebaseLevel

		
		g_overworld_sprites.add_special("COMMUNITY LEVELS" , 4); // special type 4
		g_overworld_sprites.add_special("EDITOR" , 6); // special type 6
		
	},

	cleanup: function () {
		g_overworld_sprites.hide();

		g_overworld_text.update_pos(-999, -999);

		g_overworld_fb_button.hide();
		g_overworld_fb_text.update_pos(-999, -999);

		g_overworld_left_button.hide();
		g_overworld_right_button.hide();

		g_overworld_left_text.update_pos(-999, -999);

		g_overworld_right_text.update_pos(-999, -999);

		//play_screen_container.visible = true;
	},

	screen_resized: function () {

		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();

		if (yyyy >= 2016 && mm >= 2) {


			this.fb_x = screen_width - 32;
			this.fb_y = 32;
		

		} else {
			this.fb_x = -999;
			this.fb_y = -999;

		}

		

		this.left_arrow_x = 0.5*screen_width - 120;
		this.left_arrow_y = screen_height - 120;
		this.right_arrow_x = 0.5*screen_width + 120;
		this.right_arrow_y = screen_height - 120;

		if (g_overworld_to_show >= 5) {
			var start_ = (g_overworld_to_show - 2)*30 + 1;
			start_ -= 30;
			if (start_ <= g_total_num_of_levels) this.right_arrow_x = -999;

		}

		if (g_overworld_to_show == 2) this.left_arrow_y = -999;
		else if (g_total_num_of_levels < (g_overworld_to_show - 2)*30 + 1) this.right_arrow_y = -999;
		else if (g_overworld_to_show == 0) this.left_arrow_y = -999;

		


		g_overworld_left_button.update_pos(this.left_arrow_x, this.left_arrow_y);
		g_overworld_right_button.update_pos(this.right_arrow_x, this.right_arrow_y);

		//g_overworld_left_text.update_pos(this.left_arrow_x, this.left_arrow_y + 32);
		//g_overworld_left_text.center_x(this.left_arrow_x);

		//g_overworld_right_text.update_pos(this.right_arrow_x, this.right_arrow_y + 32);
		//g_overworld_right_text.center_x(this.right_arrow_x);

		if (screen_width > screen_height) {
			//g_overworld_left_text.change_size(Types.Fonts.SMALL);
			//g_overworld_right_text.change_size(Types.Fonts.SMALL);
		} else {
			//g_overworld_left_text.change_size(Types.Fonts.XSMALL);
			//g_overworld_right_text.change_size(Types.Fonts.XSMALL);
		}

		

		g_overworld_fb_button.update_pos(this.fb_x, this.fb_y);
		g_overworld_fb_text.update_pos(this.fb_x - 286, this.fb_y - 10);

		g_overworld_sprites.make_vis();

		g_overworld_left_button.make_vis();
		g_overworld_right_button.make_vis();

		
		g_overworld_text.update_pos(16,16);	
	},

	go_to_fb: function() {
		window.open('https://www.facebook.com/Mine-of-Sight-1037635096381976');
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

		if (g_overworld_sprites.selected != -1) {

			if (g_overworld_to_show == 0) {}
			else if (g_overworld_to_show == 1) g_overworld_sprites.selected += 30;
			else if (g_overworld_to_show == 4) g_overworld_sprites.selected += 60;
			else if (g_overworld_to_show >= 5) g_overworld_sprites.selected += (g_overworld_to_show - 2)*30;

			//('LEVEL ' + g_overworld_sprites.selected);

			this.play_state.current_level = g_overworld_sprites.selected;
			//this.play_state.load_level(g_overworld_sprites.selected);

			//this.change_state(this.engine, new RestartGameStateClass(this.engine, this.play_state));
			
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
			g_text_right_to_flag.set_font(Types.Fonts.SMALL);
			g_text_right_to_flag.set_text("RIGHT CLICK TO FLAG, LEFT TO DIG");

			g_toggle_hold_to_flag = new ToggleClass();
			g_toggle_hold_to_flag.setup_sprite("redflag.png",Types.Layer.GAME_MENU);

			g_text_hold_to_flag = new TextClass(Types.Layer.GAME_MENU);
			g_text_hold_to_flag.set_font(Types.Fonts.SMALL);
			g_text_hold_to_flag.set_text("HOLD TO FLAG, CLICK TO DIG");

			g_toggle_mark_first = new ToggleClass();
			g_toggle_mark_first.setup_sprite("redflag.png",Types.Layer.GAME_MENU);

			

			g_text_mark_first = new TextClass(Types.Layer.GAME_MENU);
			g_text_mark_first.set_font(Types.Fonts.SMALL);
			g_text_mark_first.set_text("MARK TILES, THEN FLAG OR DIG");



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


g_toggle_hand= null;
g_toggle_heart= null;
g_toggle_eye= null;
g_toggle_8hand= null;
g_toggle_plus= null;
g_toggle_join= null;
g_toggle_compass= null;
g_toggle_crown= null;

g_setuprand_play = null;

g_setuprand_title = null;
g_setuprand_subtitle = null;
g_setuprand_subtitle2 = null;

SetupRandStateClass = GameStateClass.extend({

	play_state: null,
	engine: null,

	init: function(engine, play_state){
		this.play_state = play_state;
		this.engine = engine;

		play_screen_container.visible = false;


		if (g_toggle_eye == null) {
			g_toggle_eye = new ToggleClass();
			g_toggle_eye.setup_sprite("eye.png",Types.Layer.GAME_MENU);

			g_toggle_hand = new ToggleClass();
			g_toggle_hand.setup_sprite("hand.png",Types.Layer.GAME_MENU);

			g_toggle_8hand = new ToggleClass();
			g_toggle_8hand.setup_sprite("8hand.png",Types.Layer.GAME_MENU);

			g_toggle_plus = new ToggleClass();
			g_toggle_plus.setup_sprite("eyeplustouch.png",Types.Layer.GAME_MENU);

			g_toggle_join = new ToggleClass();
			g_toggle_join.setup_sprite("join_tut.png",Types.Layer.GAME_MENU);

			g_toggle_heart = new ToggleClass();
			g_toggle_heart.setup_sprite("heart.png",Types.Layer.GAME_MENU);

			g_toggle_compass = new ToggleClass();
			g_toggle_compass.setup_sprite("compass.png",Types.Layer.GAME_MENU);

			g_toggle_crown = new ToggleClass();
			g_toggle_crown.setup_sprite("crown.png",Types.Layer.GAME_MENU);

			g_setuprand_play = new ButtonClass();
			g_setuprand_play.setup_sprite("play_icon.png",Types.Layer.GAME_MENU);

			g_setuprand_title = new TextClass(Types.Layer.GAME_MENU);
			g_setuprand_title.set_font(Types.Fonts.MEDIUM);
			g_setuprand_title.set_text("MINESWEEPER++");

			g_setuprand_subtitle = new TextClass(Types.Layer.GAME_MENU);
			g_setuprand_subtitle.set_font(Types.Fonts.SMALL);
			g_setuprand_subtitle.set_text("PICK YOUR POISON\n(THIS MODE IS AUTO-GENERATED AND MAY REQUIRE GUESSING)");

		}
	

		this.screen_resized();

	},

	cleanup: function() {
		g_toggle_eye.hide();
		g_toggle_hand.hide();
		g_toggle_8hand.hide();
		g_toggle_plus.hide();
		g_toggle_join.hide();
		g_toggle_heart.hide();
		g_toggle_compass.hide();
		g_toggle_crown.hide();
		g_setuprand_play.hide();

		g_setuprand_title.update_pos(-999,-999);
		g_setuprand_subtitle.update_pos(-999,-999);

		play_screen_container.visible = true;
		
	},

	eye_x: 0,
	eye_y: 0,

	hand_x: 0,
	hand_y: 0,

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

	play_x: 0,
	play_y: 0,

	screen_resized: function () {

		g_setuprand_title.update_pos(32,32);
		g_setuprand_subtitle.update_pos(32,64);

		this.eye_x = screen_width*0.5;
		this.eye_y = 3*64;

		this.hand_x =  screen_width*0.5;
		this.hand_y =  4*64;

		this.eighthand_x =  screen_width*0.5;
		this.eighthand_y = -9996;

		this.plus_x =  -999;//screen_width*0.5;
		this.plus_y =  -999;//5*64;

		this.join_x =  screen_width*0.5;
		this.join_y = 5*64;

		this.heart_x =  screen_width*0.5;
		this.heart_y =  6*64;

		this.compass_x =  -999;//screen_width*0.75;
		this.compass_y =  3*64;

		this.crown_x =  -999;//screen_width*0.75;
		this.crown_y =  4*64;


		this.play_x = screen_width - 64;
		this.play_y = screen_height - 64;

		g_toggle_eye.update_pos(this.eye_x, this.eye_y);
		g_toggle_hand.update_pos(this.hand_x, this.hand_y);
		g_toggle_8hand.update_pos(this.eighthand_x, this.eighthand_y);
		g_toggle_plus.update_pos(this.plus_x, this.plus_y);
		g_toggle_join.update_pos(this.join_x, this.join_y);
		g_toggle_heart.update_pos(this.heart_x, this.heart_y);
		g_toggle_crown.update_pos(this.crown_x, this.crown_y);
		g_toggle_compass.update_pos(this.compass_x, this.compass_y);

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
			
		}else if (mouse.x > this.play_x - 19 &&
		    	mouse.x < this.play_x + 19 &&
		    	mouse.y > this.play_y - 19 &&
		    	mouse.y < this.play_y + 19) {
				this.play_state.current_level = 7;
				this.play_state.first_tile_safe = true;
				this.change_state(this.engine, new GenerateRandStateClass(this.engine, this.play_state));
			
		}

	}

});

g_mineofsight_title = null;
g_mineofsight_title_img = null;

g_first_time_button = null;
g_first_time_text = null;

g_menu_to_overworld_button = null;
g_menu_to_overworld_text = null;

g_menu_to_randgen_button = null;
g_menu_to_randgen_text = null;

//g_spash_image = null;

g_menu_eye_sprite = null;
g_menu_hand_sprite = null;
g_menu_eight_sprite = null;
g_menu_heart_sprite = null;
g_menu_compass_sprite = null;
g_menu_crown_sprite = null;

MenuStateClass = GameStateClass.extend({
	
	play_state: null,
	engine: null,

	attn_randommode: false,

	init: function(engine, play_state){

		

		play_screen_container.visible = true;
		this.play_state = play_state;
		this.engine = engine;

		if (g_first_time_button == null) {
			g_first_time_text = new TextClass(Types.Layer.GAME_MENU);
			g_first_time_text.set_font(Types.Fonts.XSMALL);
			g_first_time_text.set_text("FIRST TIME");

			g_mineofsight_title_img = new SpriteClass();
			g_mineofsight_title_img.setup_sprite('titletext.png',Types.Layer.TILE);
		
			g_menu_eye_sprite = new SpriteClass();
			g_menu_hand_sprite = new SpriteClass();
			g_menu_eight_sprite = new SpriteClass();
			g_menu_heart_sprite = new SpriteClass();
			g_menu_compass_sprite = new SpriteClass();
			g_menu_crown_sprite = new SpriteClass();

			g_menu_eye_sprite.setup_sprite('eye.png',Types.Layer.TILE);
			g_menu_hand_sprite.setup_sprite('hand.png',Types.Layer.TILE);
			g_menu_eight_sprite.setup_sprite('8hand.png',Types.Layer.TILE);
			g_menu_heart_sprite.setup_sprite('heart.png',Types.Layer.TILE);
			g_menu_compass_sprite.setup_sprite('compass.png',Types.Layer.TILE);
			g_menu_crown_sprite.setup_sprite('crown.png',Types.Layer.TILE);

			g_first_time_button = new SpriteClass();
			g_first_time_button.setup_sprite('button_first.png',Types.Layer.GAME_MENU);

			g_menu_to_overworld_text = new TextClass(Types.Layer.GAME_MENU);
			g_menu_to_overworld_text.set_font(Types.Fonts.XSMALL);
			g_menu_to_overworld_text.set_text("SKIP TO LEVEL");

			g_menu_to_overworld_button = new SpriteClass();
			g_menu_to_overworld_button.setup_sprite('button_mainmenu.png',Types.Layer.GAME_MENU);

			g_menu_to_randgen_text = new TextClass(Types.Layer.GAME_MENU);
			g_menu_to_randgen_text.set_font(Types.Fonts.XSMALL);
			g_menu_to_randgen_text.set_text("MINESWEEPER++");//MAKE A RANDOM LEVEL");

			g_menu_to_randgen_button = new SpriteClass();
			g_menu_to_randgen_button.setup_sprite('button_mainmenu_rand.png',Types.Layer.GAME_MENU);

			g_mineofsight_title = new TextClass(Types.Layer.GAME_MENU);
			g_mineofsight_title.set_font(Types.Fonts.MEDIUM);
			g_mineofsight_title.set_text(""); // MINE OF SIGHT

			//g_spash_image = new SpriteClass();
			//g_spash_image.setup_sprite('title2.png',Types.Layer.GAME_MENU);
		}

		//g_spash_image.make_vis();

		this.screen_resized();

		
		this.play_state.reset();
		for (var x = 0; x < this.play_state.grid_w; x++) {
			for (var y = 0; y < this.play_state.grid_h; y++) {
				
				this.play_state.blocks[this.play_state.tiles[x][y]].preset_hint(0);
				this.play_state.blocks[this.play_state.tiles[x][y]].uncover();
				this.play_state.blocks[this.play_state.tiles[x][y]].reset();
			}
		}

		

		this.play_state.change_tile(2,1,1);
		this.play_state.change_tile(3,1,1);
		this.play_state.change_tile(4,1,1);
		this.play_state.change_tile(5,1,1);
		this.play_state.change_tile(7,1,1);
		this.play_state.change_tile(7,2,1);

		this.play_state.change_tile(2,3,1);

		this.play_state.change_tile(2,4,1);
		this.play_state.change_tile(3,4,1);
		this.play_state.change_tile(4,4,1);
		this.play_state.change_tile(5,4,1);
		this.play_state.change_tile(6,4,1);
		this.play_state.change_tile(7,4,1);

		//this.play_state.blocks[this.play_state.tiles[7][3]].preset_hint(2);
		//this.play_state.blocks[this.play_state.tiles[7][3]].eye_hint_num_text.hide();
		this.play_state.blocks[this.play_state.tiles[7][3]].uncover();

		this.play_state.blocks[this.play_state.tiles[2][0]].cover();
		this.play_state.blocks[this.play_state.tiles[0][2]].cover();
		this.play_state.blocks[this.play_state.tiles[9][0]].cover();

		this.play_state.join_tiles(6,1,6,0);
		

		this.play_state.change_tile(2,2,2);
		//this.play_state.change_tile(7,3,2);
		//this.play_state.change_tile(1,3,2);
		//this.play_state.change_tile(9,1,2);

		this.play_state.blocks[this.play_state.tiles[8][2]].cover();
		this.play_state.blocks[this.play_state.tiles[8][2]].put_flag_on();

		if (g_all_level_status[g_total_num_of_levels - 1] == 4) { // tick, done
			this.attn_randommode = true;
		}

	},

	cleanup: function() {

		g_menu_eye_sprite.hide();
		g_menu_hand_sprite.hide();
		g_menu_eight_sprite.hide();
		g_menu_heart_sprite.hide();
		g_menu_compass_sprite.hide();
		g_menu_crown_sprite.hide();

		g_mineofsight_title_img.hide();

		for (var x = 0; x < this.play_state.grid_w; x++) {
			for (var y = 0; y < this.play_state.grid_h; y++) {
				
				this.play_state.blocks[this.play_state.tiles[x][y]].preset_hint(0);
				this.play_state.blocks[this.play_state.tiles[x][y]].uncover();
				this.play_state.blocks[this.play_state.tiles[x][y]].reset();
			}
		}

		

		//g_spash_image.hide();
		
		
		g_first_time_button.hide();
		g_first_time_text.update_pos(-999, -999);

		g_menu_to_overworld_button.hide();
		g_menu_to_overworld_text.update_pos(-999, -999);

		g_menu_to_randgen_button.hide();
		g_menu_to_randgen_text.update_pos(-999, -999);

		g_mineofsight_title.update_pos(-999, -999);
			
	},

	first_x: 0,
	first_y: 0,

	overworld_x: 0,
	overworld_y: 0,

	randgen_x: 0,
	randgen_y: 0,

	screen_resized: function () {

		//g_spash_image.update_pos(screen_width*0.5, 256*0.5);

		if (screen_width < screen_height) {
			this.first_x = 0.5*screen_width;
			this.first_y = 300;

			this.overworld_x = 0.5*screen_width;// - 60;
			this.overworld_y = 400;

			this.randgen_x = 0.5*screen_width;// - 60;
			this.randgen_y = 500;
		} else {

			this.first_x = 0.25*screen_width;
			this.first_y = 0.75*screen_height;

			this.overworld_x = 0.5*screen_width;// - 60;
			this.overworld_y = 0.75*screen_height;

			this.randgen_x = 0.75*screen_width;// - 60;
			this.randgen_y = 0.75*screen_height;

		}

		g_mineofsight_title_img.update_pos(this.play_state.tile_size*(5.0), this.play_state.tile_size*(3.0));
		g_menu_eye_sprite.update_pos(this.play_state.tile_size*(7.5), this.play_state.tile_size*(3.5));
		g_menu_hand_sprite.update_pos(this.play_state.tile_size*(9.5), this.play_state.tile_size*(3.5));
		g_menu_eight_sprite.update_pos(this.play_state.tile_size*(0.5), this.play_state.tile_size*(1.5));
		g_menu_heart_sprite.update_pos(this.play_state.tile_size*(9.5), this.play_state.tile_size*(1.5));
		g_menu_compass_sprite.update_pos(this.play_state.tile_size*(1.5), this.play_state.tile_size*(3.5));
		g_menu_crown_sprite.update_pos(this.play_state.tile_size*(3.5), this.play_state.tile_size*(0.5));

		g_mineofsight_title.update_pos(-999, -999);

		g_first_time_button.update_pos(this.first_x, this.first_y);
		g_first_time_text.update_pos(this.first_x, this.first_y + 40);
		g_first_time_text.center_x(this.first_x);

		g_menu_to_overworld_button.update_pos(this.overworld_x, this.overworld_y);
		g_menu_to_overworld_text.update_pos(this.overworld_x, this.overworld_y + 40);
		g_menu_to_overworld_text.center_x(this.overworld_x);

		g_menu_to_randgen_button.update_pos(this.randgen_x, this.randgen_y);
		g_menu_to_randgen_text.update_pos(this.randgen_x, this.randgen_y + 40);
		g_menu_to_randgen_text.center_x(this.randgen_x);
	},

	handle_mouse_up: function(engine,x,y) {

	
		if (mouse.x > this.first_x - 100 &&
		    mouse.x < this.first_x + 100 &&
		    mouse.y > this.first_y - 28 &&
		    mouse.y < this.first_y + 28) {

			this.play_state.current_level = 0;
		
			this.change_state(this.engine, new LoadingLevelStateClass(this.engine, this.play_state, 0));
			return;
		}

		if (mouse.x > this.overworld_x - 40 &&
		    mouse.x < this.overworld_x + 40 &&
		    mouse.y > this.overworld_y - 28 &&
		    mouse.y < this.overworld_y + 28) {
			g_overworld_to_show = 0;

			this.change_state(this.engine, new OverworldStateClass(this.engine, this.play_state));
			
			return;
		}

		if (mouse.x > this.randgen_x - 40 &&
		    mouse.x < this.randgen_x + 40 &&
		    mouse.y > this.randgen_y - 28 &&
		    mouse.y < this.randgen_y + 28) {
			this.play_state.current_level = 7;
			this.play_state.first_tile_safe = true;
			this.change_state(this.engine, new SetupRandStateClass(this.engine, this.play_state));
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


		g_mineofsight_title.update_pos(32, 32);

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


	init: function(engine, play_state){

		

		play_screen_container.visible = true;
		this.play_state = play_state;
		this.engine = engine;

		g_all_level_status[this.play_state.current_level] = 4;

		if (use_browser_cookies) {
			this.save_state();
			this.show_save_option = false;
		}

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

			g_win_fb_text = new TextClass(Types.Layer.GAME_MENU);
			g_win_fb_text.set_font(Types.Fonts.XSMALL);
			g_win_fb_text.set_text("LIKE THIS GAME:");

			g_win_fb = new SpriteClass();
			g_win_fb.setup_sprite('facebook-24x24.png',Types.Layer.GAME_MENU);

			g_win_twit_text = new TextClass(Types.Layer.GAME_MENU);
			g_win_twit_text.set_font(Types.Fonts.XSMALL);
			g_win_twit_text.set_text("FOLLOW @ZBlipGames:");

			g_win_twit = new SpriteClass();
			g_win_twit.setup_sprite('twitter-24x24.png',Types.Layer.GAME_MENU);

			g_win_save_state_text = new TextClass(Types.Layer.GAME_MENU);
			g_win_save_state_text.set_font(Types.Fonts.XSMALL);
			g_win_save_state_text.set_text("REMEMBER MY PROGRESS");

			g_win_save_state = new SpriteClass();
			g_win_save_state.setup_sprite('button_small.png',Types.Layer.GAME_MENU);



			
		}

		g_win_fb.update_pos(-999, -999);
		g_win_fb_text.update_pos(-999, -999);
		g_win_twit.update_pos(-999, -999);


		this.screen_resized();

	},

	save_state: function() {
		var str_ = this.play_state.current_level.toString();

		var now = new Date();
  		var time = now.getTime();
		
  		var expireTime = time + 20000*36000;	// seconds? 40 days
		now.setTime(expireTime);

		//localStorage.setItem('mine of sight level ' + str_,'1');
		//document.cookie="mineofsight"+str_+"=1;expires=" +now.toGMTString();

		// g_all_level_status[levelnum] = 4;	// tick, done

		var cookie_string = "mineofsightlevels=";

		for (levelnum in g_all_level_status) {
			if (g_all_level_status[levelnum] != 4) continue;
			cookie_string += levelnum.toString() + "a";
		}

		document.cookie= cookie_string + ";expires=" +now.toGMTString();

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


		document.cookie="mineofsightclicktodig=" + clicktodig.toString() + ";expires=" +now.toGMTString();
		document.cookie="mineofsightholdtoflag=" + holdtoflag.toString() + ";expires=" +now.toGMTString();


		// // mineofsightlevels=1a2a3a6
	},

	go_to_fb: function() {
		window.open('https://www.facebook.com/Mine-of-Sight-1037635096381976');
	},

	go_to_twit: function() {
		window.open('https://twitter.com/ZBlipGames');
	},


	screen_resized: function () {
		this.play_state.screen_resized();

		

		if (screen_width > screen_height) {
			this.next_x = screen_width - 64;
			this.next_y = screen_height - 64;

			this.fb_x = screen_width - 32 - 16 - 8;
			this.fb_y = 100;

			
		} else {
			this.next_x = screen_width - 64;
			this.next_y = screen_height - 64;

			this.fb_x = -999;
			this.fb_y = 32;
		}

		if (this.play_state.current_level < 10 ||
		     this.play_state.current_level%3 != 0) {
			this.fb_x = -999;
		} 

		this.save_x = -999;
		this.save_y = 100;

		if (this.show_save_option == true) {
			this.fb_x = -999;

			

			if (screen_width > screen_height) {
				this.save_x = screen_width - 32 - 16 - 8;
				this.save_y = 100;

				
			} else {
				
			}
		}

		
		if (this.play_state.current_level%6 == 0) {
			g_win_twit.update_pos(this.fb_x, this.fb_y);
			g_win_twit_text.update_pos(this.fb_x - 180, this.fb_y - 8);
		} else {
			g_win_fb.update_pos(this.fb_x, this.fb_y);
			g_win_fb_text.update_pos(this.fb_x - 150, this.fb_y - 8);
		}

		g_win_save_state.update_pos(this.save_x, this.save_y);
		g_win_save_state_text.update_pos(this.save_x - 215, this.save_y - 8);

		if (screen_width > screen_height) g_win_message.update_pos(screen_width - 148 - 32,32);		
		else {
			g_win_message.update_pos(screen_width - 148,screen_height - 128);
			g_win_message.center_x(screen_width*0.5);// + x_shift_screen);
		}

		g_next_level_button.update_pos(this.next_x, this.next_y);	// offscreen
		g_next_level_text.update_pos(this.next_x - 170, this.next_y - 8);


	},

	update: function() { 
		this.play_state.update();

	},

	cleanup: function() {
		g_win_message.update_pos(-999, -999);	// offscreen	
		g_next_level_button.update_pos(-999, -999);	// offscreen
		g_next_level_text.update_pos(-999, -999);
		g_win_fb_text.update_pos(-999, -999);
		g_win_fb.hide();
		g_win_save_state_text.update_pos(-999, -999);
		g_win_save_state.hide();

		g_win_twit_text.update_pos(-999, -999);
		g_win_twit.hide();

		if (this.user_clicked_save == true) this.save_state();
			
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

		if (mouse.x > this.save_x - 16 &&
		    mouse.x < this.save_x + 16 &&
		    mouse.y > this.save_y - 16 &&
		    mouse.y < this.save_y + 16) {

			if (this.user_clicked_save == true) {
				this.user_clicked_save = false;
				use_browser_cookies = false;
				g_win_save_state.set_texture("button_small.png");
				return;
			}

			use_browser_cookies = true;
			this.user_clicked_save = true;
			//this.save_state();
			g_win_save_state.set_texture("button_small_on.png");
			return;
		}
		
		//if (screen_width < screen_height && mouse.y > screen_height*0.5) next_ = 1;

		if (mouse.x > this.next_x - 32 && mouse.x < this.next_x + 32 &&
		    mouse.y > this.next_y - 32 && mouse.y < this.next_y + 32) next_ = 1;

		if (next_ == 1) {

			if (this.play_state.game_mode == 1) {
				// 1992 mode
				this.change_state(this.engine, new SetupRandStateClass(this.engine, this.play_state));
				return;
			} else if (this.play_state.game_mode == 2) {
				// testing level editor
				this.change_state(this.engine, new LevelEditorStateClass(this.engine, this.play_state));
				this.play_state.restore_backup();
				return;
			}


			if (this.play_state.current_level < 4) {
				// go through tut levels linearly
				this.play_state.current_level++;
			} else {
				// random new level
				//this.play_state.current_level = Math.round(5*Math.random());
				//if (this.play_state.current_level < 4) this.play_state.current_level = 4;

				this.play_state.current_level++;
			}

			if (this.play_state.current_level >= g_total_num_of_levels) {
				//this.play_state.current_level = 5;
				this.change_state(this.engine, new MenuStateClass(this.engine, this.play_state));
				return;
			}


			//this.change_state(this.engine, new RestartGameStateClass(this.engine, this.play_state));
			this.change_state(this.engine, new LoadingLevelStateClass(this.engine, this.play_state, this.play_state.current_level));
		}
	}
});

ShowAdStateClass = GameStateClass.extend({

});



BootStateClass = GameStateClass.extend({

	start_level: 0,		// change this based on cookies

	init: function(){

		//('boot state init');

		//if (use_browser_cookies == false) return;

		// cookies
		var cookies = document.cookie.split("; ");
		//(cookies);

		
		for (var lvl in cookies) {

			var levelnum_str = cookies[lvl].split("=")[0];	// "mineofsight1"

			levelnum_str = levelnum_str.split("mineofsight")[1];

			var levelnum = Number(levelnum_str);
	
			if (levelnum == null || levelnum == undefined) continue;

			
				
			if(levelnum < g_total_num_of_levels &&
			   levelnum >= 0) {
				g_all_level_status[levelnum] = 4;	// tick, done

				use_browser_cookies = true;	// if we found a cookie, then this user previously opted to save

				if (levelnum > this.start_level) this.start_level = levelnum + 1;

			} 

				

		}

		//document.cookie="mineofsightclicktodig=" + clicktodig.toString() + ";expires=" +now.toGMTString();
		//document.cookie="mineofsightholdtoflag=" + holdtoflag.toString() + ";expires=" +now.toGMTString();


		for (c in cookies) {

			var cookiename_str = cookies[c].split("=")[0];	// "mineofsightclicktodig"

			if (cookiename_str == "mineofsightclicktodig") {
				var bool_ = cookies[c].split("=")[1];	// 1 or 0
				if (bool_ == null || bool_ == undefined) continue;
				if (bool_ == 0) g_click_to_dig = false;
				else g_click_to_dig = true;
			
			} else if (cookiename_str == "mineofsightholdtoflag") {
				var bool_ = cookies[c].split("=")[1];	// 1 or 0
				if (bool_ == null || bool_ == undefined) continue;
				if (bool_ == 0) g_hold_to_flag = false;
				else g_hold_to_flag = true;

			} else if (cookiename_str == "mineofsightlevels") {

				

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

		}


	},

	handle_events: function(engine,x,y,event_type){
		
		//if(this.wait_timer > 0) {return;}


		if(event_type == Types.Events.MOUSE_CLICK) {
			// User clicked at (x,y)
			
			this.start_game (engine);


		}
		
	},

	start_game: function (engine) {


		remove_splash();

		var play_state = new PlayStateClass(engine);

		engine.push_state(play_state);

		play_state.screen_resized();

		play_state.current_level = this.start_level;


		// this.play_state.current_level >= g_total_num_of_levels

		
		// Loading Level 0
		if (play_state.current_level > 0 && play_state.current_level <= g_total_num_of_levels - 1) {
			engine.push_state(new LoadingLevelStateClass(engine, engine.get_state(), this.start_level));

			play_state.reset();

		} else {
		
			// MenuStateClass
			engine.push_state(new MenuStateClass(engine, engine.get_state()));

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

g_firebase_connected = 0;

connect_to_firebase = function () {
	g_firebase_connected = 1;
	load_script_assets(["https://www.gstatic.com/firebasejs/3.6.4/firebase.js"], on_firebase_connect);	
};

on_firebase_connect = function () {
	
	// Initialize Firebase
  	var config = {
    		apiKey: "AIzaSyDHBCtEkJISw_-axOIsJsFJFUdwnDksGVk",
   	 	authDomain: "mine-of-sight.firebaseapp.com",
   		databaseURL: "https://mine-of-sight.firebaseio.com",
    		storageBucket: "",
    		messagingSenderId: "452052921769"
  	};
  	firebase.initializeApp(config);

	g_firebase_connected = 2;
};

// ff9400

pBar.value += 10;
