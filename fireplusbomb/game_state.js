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
	

	engine: null,

	tiles: [],	// holds indexes to this.blocks
	grid_w: 8,
	grid_h: 8,
	tile_size: 64,
	blocks: [],	// 1D array of BlockClass objects

	explode_left: [],
	explode_right: [],
	explode_up: [],
	explode_down: [],
	explode_timer: 0,
	explosion_sprites: [],	// 2D grid of objects

	lit_bomb_grid: [],	// 2D grid of objects

	tut_no_grid: [],	// for tutorial mode, grid of disallowed blocks


	new_piece_obj: null,

	new_piece_draw_x: 0,
	new_piece_draw_y: 0,

	score:	0,
	score_obj: null,

	score_x: -999,
	score_y: -999,
	
	fire_bits_x: [],
	fire_bits_y: [],
	fire_bits_timer: [],
	fire_bits_sprites: [],
	fire_bits_shadow_sprites: [],

	smoke_bits_x: [],
	smoke_bits_y: [],
	smoke_bits_timer: 0,
	smoke_bits_sprites: [],

	grid_appear_timer: 0,

	init: function(engine){

		

		this.engine = engine;

		if(screen_width < screen_height) {
			//this.tile_size = screen_width/this.map_w;
		} else {
			//this.tile_size = Math.min(screen_height/this.map_h,64*this.map_h);
		}

		for(var i = 0; i < this.grid_w; i++) {
			this.tiles[i] = new Array(this.grid_h);

			this.explode_left[i] = new Array(this.grid_h);
			this.explode_right[i] = new Array(this.grid_h);
			this.explode_up[i] = new Array(this.grid_h);
			this.explode_down[i] = new Array(this.grid_h);
			this.explosion_sprites[i] = new Array(this.grid_h);

			this.lit_bomb_grid[i] = new Array(this.grid_h);

			this.tut_no_grid[i] = new Array(this.grid_h);

		}

		for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {
				this.tiles[x][y] = -1; // empty

				this.explosion_sprites[x][y] = new ExplosionClass(x,y,this);

				this.lit_bomb_grid[x][y] = new BombClass(x,y,this);

				this.tut_no_grid[x][y] = 0;
			}
		}

		

		//for(var i = 0; i < 5; i++) {
		//	this.new_piece[i] = new Array(5);
		//	this.temp_rotation_grid[i] = new Array(5);
		//}

		//for(var x = 0; x < 5; x++) {
		//	for(var y = 0; y < 5; y++) {
		//		this.new_piece[x][y] = 0;
		//		this.temp_rotation_grid[x][y] = 0;
		//	}
		//}

		for (var i = 0; i < 6; i++) {

			var fire_bit_shadow_spr = new SpriteClass();
			fire_bit_shadow_spr.setup_sprite("fire_a_shadow.png",Types.Layer.GAME);
			

			this.fire_bits_shadow_sprites.push(fire_bit_shadow_spr);

			
		}


		for(var g = 0; g < this.grid_w*this.grid_h; g++) {
			var new_gem = new BlockClass(this);
			this.blocks.push(new_gem);
		}

		for (var i = 0; i < 6; i++) {
			var fire_bit_spr = new SpriteClass();
			fire_bit_spr.setup_sprite("fire_a.png",Types.Layer.GAME);
			

			this.fire_bits_sprites.push(fire_bit_spr);

			this.fire_bits_x.push(0);
			this.fire_bits_y.push(0);
			this.fire_bits_timer.push(0);

			this.fire_bits_sprites[i].update_pos(-999, -999);
			this.fire_bits_shadow_sprites[i].update_pos(-999, -999);

		}

		for (var i = 0; i < 6; i++) {
			var smoke_bit_spr = new SpriteClass();
			smoke_bit_spr.setup_sprite("smoke.png",Types.Layer.GAME);
			

			this.smoke_bits_sprites.push(smoke_bit_spr);

			this.smoke_bits_x.push(0);
			this.smoke_bits_y.push(0);
			

			this.smoke_bits_sprites[i].update_pos(-999, -999);

		}

		this.score_obj = new CounterClass(Types.Layer.GAME_MENU);
		//this.score_obj.set_font(Types.Fonts.MEDIUM);
		this.score_obj.set_num(this.score);
		this.score_obj.update_pos(this.score_x, this.score_y);

		


		// this will be needed in DuringPlayState as well as tutorial mode
		// so it lives down here
		this.new_piece_obj = new NewPieceClass(this);

		this.draw_background();


		this.screen_resized();


		
	},

	
	reset: function() {
		for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {
				this.change_tile(x,y,0);
			}
		}

	},


	new_game: function () {
		this.score = 0;
		this.score_obj.set_num(this.score);

		for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {
				this.change_tile(x,y,0);
			}
		}


		for(var i = 0; i < this.bg_squares.length; i++) this.bg_squares[i].alpha = 1;
	},

	get_block_type: function(x,y) {

		if (x < 0 || y < 0 || x >= this.grid_w || y >= this.grid_h) return -1;

		if (this.tiles[x][y] == -1) return 0;

		else return this.blocks[this.tiles[x][y]].get_type();
	},

	do_explosion_step: function() {
		for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {

				//this.do_smoke_effect(x,y);

				if (this.explode_left[x][y] == 1) {
					this.do_smoke_effect(x,y);
					this.hit_tile(x,y);
					this.explode_left[x][y] = 0;

					var bl_ = this.get_block_type(x,y);
					if(bl_ == 1 || bl_ == 2 || bl_ == 3) continue;

					this.explosion_sprites[x][y].start_anim();
					if (x > 0) this.explode_left[x - 1][y] = 1;

					this.do_smoke_effect(x,y);
				}
			}

			for(var x = this.grid_w - 1; x >= 0; x--) {
				if (this.explode_right[x][y] == 1) {
					this.do_smoke_effect(x,y);
					this.hit_tile(x,y);
					this.explode_right[x][y] = 0;

					var bl_ = this.get_block_type(x,y);
					if(bl_ == 1 || bl_ == 2 || bl_ == 3) continue;

					this.explosion_sprites[x][y].start_anim();
					if (x < this.grid_w - 1) this.explode_right[x + 1][y] = 1;

					
				}
			}

			
		}

		for(var x = 0; x < this.grid_w; x++) {

			for(var y = 0; y < this.grid_h; y++) {
				if (this.explode_up[x][y] == 1) {
					this.do_smoke_effect(x,y);
					this.hit_tile(x,y);
					this.explode_up[x][y] = 0;

					var bl_ = this.get_block_type(x,y);
					if(bl_ == 1 || bl_ == 2 || bl_ == 3) continue;

					this.explosion_sprites[x][y].start_anim();
					if (y > 0) this.explode_up[x][y - 1] = 1;

					
				}
			}

			for(var y = this.grid_h - 1; y >= 0; y--) {
				if (this.explode_down[x][y] == 1) {
					this.do_smoke_effect(x,y);
					this.hit_tile(x,y);
					this.explode_down[x][y] = 0;

					var bl_ = this.get_block_type(x,y);
					if(bl_ == 1 || bl_ == 2 || bl_ == 3) continue;

					this.explosion_sprites[x][y].start_anim();
					if (y < this.grid_h - 1) this.explode_down[x][y + 1] = 1;

					
				}
			}

		}
	},

	

	flip_new_piece: function () {

	},

	rotate_new_piece: function () {

	},

	shift_new_piece: function () {

	},

	load_new_piece: function () {


		


		var rand = Math.floor(Math.random()*block_patterns.length);

		for (var i = 0; i < 25; i++) {
			var x = i % 5;
			var y = Math.floor (i / 5);
			this.new_piece[x][y] = block_patterns[rand][i];
		}

		// add bombs and fire
		var bombx = -4; 
		var bomby = -4; 
		var bomb = 0;
		var fire = 0;

		// re evaluate map
		this.total_bombs = 0;
		this.total_hp = 0;
		for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {
				if (this.tiles[x][y] == 3) this.total_bombs++;

				if (this.tiles[x][y] == 8) this.total_hp++;

				if (this.tiles[x][y] == 9) this.total_hp+=2;
				
				if (this.tiles[x][y] == 10) this.total_hp+=3;
			}
		}

		for(var x = 0; x < 5; x++) {
			for(var y = 0; y < 5; y++) {
				if(this.new_piece[x][y] == 1 && Math.random() < 0.5) {

					if (Math.random() < 0.5 && this.total_bombs <= 1.33*this.total_hp) {
						this.new_piece[x][y] = 3;
						this.total_bombs++;
						//bomb++;
					} else {
						this.new_piece[x][y] = 2;
						//fire++;
					}
					
				}
			}
		}

		if (Math.random() < 0.5) {
			for(var x = 0; x < 5; x++) {
				for(var y = 0; y < 5; y++) {

					if (this.new_piece[x][y] == 3) {
						this.new_piece[x][y] = 2;
						this.total_bombs--;
					} else if (this.new_piece[x][y] == 2 && this.total_bombs <= 1*this.total_hp) {
						this.new_piece[x][y] = 3;
						this.total_bombs++;
					}

				}
			}
		}

		// 1 is 0 HP block
		// 2 is fire
		// 3 is bomb
		// 4 is 1 HP block
		// 5 is 2 HP block
		// 6 is 3 HP block
		for(var x = 0; x < 5; x++) {
			for(var y = 0; y < 5; y++) {
				if (this.new_piece[x][y] == 2 && 
				    ((x > 0 && this.new_piece[x-1][y] == 3) || 
					(x < 4 &&this.new_piece[x+1][y] == 3) || 
					(y > 0 &&this.new_piece[x][y-1] == 3) || 
					(y < 4 &&this.new_piece[x][y+1] == 3))) {
						this.new_piece[x][y] = 4;

						this.total_hp++;

				

				} else if (this.new_piece[x][y] == 1 && Math.random() < 0.75) {
					this.new_piece[x][y] = 4;

						this.total_hp++;
				}
			}
		}

		for(var x = 0; x < 5; x++) {
			for(var y = 0; y < 5; y++) {
				 if (this.new_piece[x][y] == 4 && Math.random() < 0.33 && this.total_hp <= 2*this.total_bombs) {
					this.new_piece[x][y] = 5;

					this.total_hp++;

					if (this.new_piece[x][y] == 4 && Math.random() < 0.33) {
						this.new_piece[x][y] = 6;

						this.total_hp++;
			
					}
			
				}
			}
		}

		
	},

	clear_new_piece: function () {
		this.new_piece_obj.clear();
	},

	remake_new_piece: function () {

		// move new peice off screen so that it moves in
		//this.new_piece_obj.draw_x =

		for (var i = 0; i < 16; i++) {
			this.new_piece_obj.generate_new();

			var matches = this.new_piece_obj.scan_for_matches();
			if (matches == 1) return;

			this.new_piece_obj.rotate();
			matches = this.new_piece_obj.scan_for_matches();
			if (matches == 1) return;

			this.new_piece_obj.rotate();
			matches = this.new_piece_obj.scan_for_matches();
			if (matches == 1) return;

			this.new_piece_obj.rotate();
			matches = this.new_piece_obj.scan_for_matches();
			if (matches == 1) return;
		}
	},

	// num is block type
	// 0 is empty
	//
	change_tile : function (x, y, num) {

		if (x < 0 || y < 0 || x >= this.grid_w || y >= this.grid_h) {
			console.log('change_tile' + x + ' ' + y );
			return;
		}
		
		if (num == 0 && this.tiles[x][y] != -1) {
			var b = this.tiles[x][y];

			this.blocks[b].set_position_grid(-1,-1);

			this.tiles[x][y] = -1;

			return;
		}

		if (num == 0 && this.tiles[x][y] == -1) return;

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

	

	hit_tile: function (x,y) {
		if (this.tiles[x][y] == -1) return;

		var b = this.tiles[x][y];
		var block_ = this.blocks[b].get_type();

		if (block_ == 1) this.change_tile(x,y,0);
		else if (block_ == 2) this.change_tile(x,y,1);
		else if (block_ == 3) this.change_tile(x,y,2);
		else if (block_ == 4) this.change_tile(x,y,3);
		else if (block_ == 5) this.change_tile(x,y,0);
		else if (block_ == 6) this.change_tile(x,y,0);

		if (block_ == 2 || block_ == 3) {
			//this.blocks[b].blink_timer = 40;
			
		}
	},

	lit_timer: 0,
	explosion_timer: 0,

	start_lit_bomb: function(x,y) {

		if (this.lit_timer == 0) {
			var volume_ = 0.06 + 0.03*Math.random();
			playSoundInstance('grow4.wav',volume_);
			volume_ = 0.09 + 0.06*Math.random();
			playSoundInstance('creak.wav',volume_);
		}

		if (x < 0 || y < 0 || x >= this.grid_w || y >= this.grid_h) {
			
			return;
		}

		this.lit_timer = 14*3;
		this.lit_bomb_grid[x][y].start_anim();
	},

	start_explosion: function(x,y) {

		this.increase_score(1);
		
		this.explosion_timer = this.grid_w + 6;	// 6 frames for explode anim
		this.explosion_timer = 3*this.explosion_timer + 10;	// +10 just to be sure
		this.explode_left[x][y] = 1;
		this.explode_right[x][y] = 1;
		this.explode_up[x][y] = 1;
		this.explode_down[x][y] = 1;

	},

	game_over: false,

	do_game_over: function() {
		this.game_over = true;
	},

	pop_sounds: 0,

	update: function() { 


		if (this.pop_sounds > 0) {
			
			if (this.pop_sounds % 3 == 0) {
				if (Math.random() < 0.5) playSoundInstance('pop3.wav',0.3);
				else playSoundInstance('pop2.wav',0.1);
			}
			this.pop_sounds--;
		}

		if (this.explosion_timer > 0) {
			this.explosion_timer--;
			if (this.explosion_timer % 3 == 0) this.do_explosion_step();

			if (this.explosion_timer == 0) {
				for(var x = 0; x < this.grid_w; x++) {
					for(var y = 0; y < this.grid_h; y++) {
						this.explosion_sprites[x][y].stop_anim();
					}
				}

				//this.new_piece_obj.check_for_any_move();	// triggers game over
				if (this.new_piece_obj.dont_remake_after_explosion == false) {
					this.new_piece_obj.should_remake = true;
				}
				//this.remake_new_peice();
			} 

		}

		if (this.new_piece_obj.should_remake == true) {
			this.new_piece_obj.should_remake = false;

			for (var i = 0; i < 12; i++) {
				this.new_piece_obj.generate_new();
				this.new_piece_obj.no_moves = false;
				this.new_piece_obj.check_for_any_move();
				if (this.new_piece_obj.no_moves == false) break;
			}

			if (this.new_piece_obj.no_moves == true) {
				this.do_game_over();
			}

			
		}

		if (this.lit_timer > 0) {
			this.lit_timer--;

			//if (this.lit_timer == 14*3 - 2) playSoundInstance('grow3.wav',0.3);

			if (this.lit_timer == 14*3 - 3 ||
			    this.lit_timer == 14*3 - 5) {
				var volume_ = 0.15 + 0.06*Math.random();
				playSoundInstance('creak.wav',volume_);
			}

			if (this.lit_timer % 3 == 0) {
				for(var y = 0; y < this.grid_h; y++) {
            				for(var x = 0; x < this.grid_w; x++) {

						this.lit_bomb_grid[x][y].update();
				
						if (this.lit_bomb_grid[x][y].timer == 10) this.pop_sounds += 3;

					} // for x
				} // for y

			} // if (this.lit_timer % 3 == 0)
		} // if (this.lit_timer > 0)
	},

	do_smoke_effect: function (x,y) {

		return;
		this.smoke_bits_timer = 50;

		//if (Math.random() < 0.5) return;

		for (var i = 0; i < this.smoke_bits_x.length; i++) {
			if (this.smoke_bits_y[i] <= 0) {
				this.smoke_bits_y[i] = y*this.tile_size;// + 4*Math.random() - 4*Math.random();
				this.smoke_bits_x[i] = x*this.tile_size;// + 4*Math.random() - 4*Math.random();
				return;
			}
		}
	},

	// on adding 2 fires
	do_fire_add_effect: function(x,y) {
		if (this.get_block_type(x,y) != 6) return;

		this.fire_effect_timer = 20;

		this.blocks[this.tiles[x][y]].y_scale = 1.6;
		
	},

	draw_timer: 0,

	fire_effect_timer: 0,	// on adding 2 fires

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
		

		this.new_piece_obj.draw();

		if (this.fire_effect_timer > 0) {
			this.fire_effect_timer--;
			for(var y = 0; y < this.grid_h; y++) {
            			for(var x = 0; x < this.grid_w; x++) {
					if (this.tiles[x][y] == -1) continue;
					this.blocks[this.tiles[x][y]].draw_fire();
				}
			}
			
		}

		if (this.explosion_timer > 0 && this.explosion_timer % 3 == 0) {
			for(var y = 0; y < this.grid_h; y++) {
            			for(var x = 0; x < this.grid_w; x++) {

					this.explosion_sprites[x][y].draw();
				}
			}
		}

		for (var i = 0; i < this.fire_bits_x.length; i++) {
			if (this.fire_bits_timer[i] == 0) continue;

			this.fire_bits_timer[i]--;
			this.fire_bits_y[i] -= 0.5;
			this.fire_bits_sprites[i].update_pos(this.fire_bits_x[i], this.fire_bits_y[i]);
			this.fire_bits_shadow_sprites[i].update_pos(this.fire_bits_x[i] + 6, this.fire_bits_y[i] + 6);

			this.fire_bits_sprites[i].set_alpha(Math.min(1,this.fire_bits_timer[i]/5));
			this.fire_bits_shadow_sprites[i].set_alpha(Math.min(1,this.fire_bits_timer[i]/5));
		
			if (this.fire_bits_timer[i] == 0) {
				this.fire_bits_sprites[i].update_pos(-999, -999);
				this.fire_bits_shadow_sprites[i].update_pos(-999, -999);
			}
		}

		
	},

	set_fire_bit_effect: function(x,y) {
		for (var i = 0; i < this.fire_bits_x.length; i++) {
			if (this.fire_bits_timer[i] != 0) continue;

			this.fire_bits_timer[i] = 35;
			this.fire_bits_y[i] = y;
			this.fire_bits_x[i] = x;
			return;
		}
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

		if (Math.abs(this.new_piece_obj.x_anchor - this.new_piece_obj.draw_x) < 10 &&
		    Math.abs(this.new_piece_obj.y_anchor - this.new_piece_obj.draw_y) < 10) this.new_piece_obj.calc_position();

		
		


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

		background_container.addChild(graphics);

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
		background_container.addChild(graphics);
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
					  4000, 0x635577);	//666671 666677   666666	// A5E2E5 // 40BEEE

		

		for(var y = 0; y < this.grid_h; y++) {
            		for(var x = 0; x < this.grid_w; x++) {
				var sq_ = this.draw_rect_background((x+0.5)*this.tile_size - 10,(y+0.5)*this.tile_size -10, 20 , 20, 0x534567);
				this.bg_squares.push(sq_);
				sq_.alpha = 0;
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

	init: function(engine, play_state){
		this.play_state = play_state;
		this.engine = engine;

		
		
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
		
		this.change_state(this.engine, new StartGameStateClass(this.engine, this.play_state));
		
	},

	draw: function() {
		this.play_state.draw();
	},


});



StartGameStateClass = GameStateClass.extend({

	play_state: null,

	engine: null,

	init: function(engine, play_state){
		this.play_state = play_state;
		this.engine = engine;

		this.play_state.new_game();

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
		// waiting for player to click to start

		this.change_state(this.engine, new DuringGameStateClass(this.engine, this.play_state));
		
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





DuringGameStateClass = GameStateClass.extend({

	play_state: null,

	engine: null,

	mouse_down: false,

	e_text: -1,
	e_text_timer: 0,	

	init: function(engine, play_state){
		this.play_state = play_state;
		this.engine = engine;

		this.mouse_down = false;

		if (g_undo_button_sprite == null) {
			g_undo_button_sprite = new SpriteClass();
			g_undo_button_sprite.setup_sprite('back_button.png',Types.Layer.GAME_MENU);

			for (var e = 0; e < gameplay_errors.length; e++) {
				var e_text = new TextClass(Types.Layer.GAME_MENU);
				e_text.set_font(Types.Fonts.MEDIUM);
				e_text.set_text(gameplay_errors[e]);
				e_text.update_pos(-999, -999);

				g_gameplay_error_text_objs.push(e_text);

			}

		}

		g_undo_button_sprite.update_pos(-999, -999);

		this.play_state.remake_new_piece();

		this.screen_resized();

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

	screen_resized: function () {


		if (screen_width > screen_height) {
			this.play_state.score_x = screen_width - 32 - 18*this.play_state.score.toString().length;
			this.play_state.score_y = 32;
		} else {
			this.play_state.score_x = screen_width - 32 - 18*this.play_state.score.toString().length;
			this.play_state.score_y = screen_height - 64;
		}

		this.play_state.score_obj.update_pos(this.play_state.score_x, this.play_state.score_y);

		this.play_state.screen_resized();
	},

	
	highlighted_x: 0,
	highlighted_y: 0,

	grabbing_new_piece: false,

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

	
	
	

	handle_mouse_up: function(engine,x,y) {

		//if (mouse.x > screen_width - 100 &&
		//    mouse.y > screen_height - 100) this.undo();

		this.mouse_down = false;

		if (this.grabbing_new_piece == true) {
			this.play_state.new_piece_obj.player_drop(this.highlighted_x,this.highlighted_y);

			// if all we did with the new peice was click on it:
			if (this.only_clicked_new_peice == true) {
				this.play_state.new_piece_obj.rotate_with_effect();
			}

		}
		this.grabbing_new_piece = false;

		

		
	},

	prev_highlighted_x: 0,
	prev_highlighted_y: 0,

	only_clicked_new_peice: false,	// only clicked on new peice - rotate
	
	handle_mouse_move: function(engine,x,y) {

		if (screen_height > screen_width &&
		    y < this.play_state.grid_h*this.play_state.tile_size &&
		    this.mouse_down == true) {
			// easier controls on touchscreen - magnify user input
			//y -= 0.85*(this.play_state.grid_h*this.tile_size - y);
			y -= 0.85*(this.play_state.grid_h*this.play_state.tile_size - y);	

			
		}

		this.prev_highlighted_x = this.highlighted_x;
		this.prev_highlighted_y = this.highlighted_y;

		this.highlighted_x = Math.round((x - 0.5*this.play_state.tile_size)/ this.play_state.tile_size);
		this.highlighted_y = Math.round((y - 0.5*this.play_state.tile_size)/ this.play_state.tile_size);

		// if we drag the peice onto the board:
		if (this.grabbing_new_piece == true) {

			if (this.highlighted_x < this.play_state.grid_w &&
			    this.highlighted_y < this.play_state.grid_h) this.only_clicked_new_peice = false;
		}

		//this.highlighted_x = Math.max(0, this.highlighted_x);
		//this.highlighted_x = Math.min(this.play_state.grid_w - 1, this.highlighted_x);

		//this.highlighted_y = Math.max(0, this.highlighted_y);
		//this.highlighted_y = Math.min(this.play_state.grid_h - 1, this.highlighted_y);

		if (this.grabbing_new_piece == true) {

			

			this.play_state.new_piece_obj.player_move(x,y,this.highlighted_x,this.highlighted_y);

		}
		
	},

	cleanup : function () {
		g_undo_button_sprite.update_pos(-999,-999);

		for (var e = 0; e < g_gameplay_error_text_objs.length; e++) {

			g_gameplay_error_text_objs[e].update_pos(-999, -999);

		}

		this.play_state.score_x = -999;
		this.play_state.score_y = -999;

		
	},

	victory: false,

	check_for_victory: function() {

		// There is no win condition in this game

		if (this.victory == true) {
			this.change_state(this.engine, new WinStateClass(this.engine, this.play_state));
		}

		
	},

	update: function() { 
		this.play_state.update();

		if (this.play_state.game_over == true) {
			this.change_state(this.engine, new GameOverStateClass(this.engine, this.play_state));
		}
	},

	
	draw: function() {
		this.play_state.draw();

		

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
			g_gameplaye_error_text_objs[this.e_text].update_pos(screen_width/2,screen_height - 64,screen_width - 128);
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

	init: function(engine, play_state) {

		this.engine = engine;
		this.play_state = play_state;

		this.play_state.game_over = false;

		if (g_game_over_text == null) {
			g_game_over_text = new TextClass(Types.Layer.HUD);
			g_game_over_text.set_font(Types.Fonts.MEDIUM);
			g_game_over_text.set_text("GAME OVER");
			g_game_over_text.update_pos(-999, -999);

			g_game_over_text2 = new TextClass(Types.Layer.HUD);
			g_game_over_text2.set_font(Types.Fonts.SMALL);
			g_game_over_text2.set_text("No more valid moves");
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

		if (this.play_state.score > 60 &&
		    location.hostname != "www.facebook.com") this.prompt_button = 1;		// tweet score
	
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
			this.game_over_text_x = 10*this.play_state.tile_size;//screen_width - 96;
			this.game_over_text_y = 64;

			this.game_over_text2_x = 10*this.play_state.tile_size;//screen_width - 96;
			this.game_over_text2_y = 128;

			this.newgame_x = screen_width - 64;
			this.newgame_y = screen_height - 64;

			this.score_x = screen_width - 64;
			this.score_y = screen_height - 128 - 64;

			if (this.prompt_button == 1) {
				this.twitter_x = screen_width - 64;
				this.twitter_y = screen_height - 128;
			} else {
				this.twitter_y = -999;
			}
			
		} else {
			this.game_over_text_x = 96;
			this.game_over_text_y = 9*this.play_state.tile_size;

			this.game_over_text2_x = 96;
			this.game_over_text2_y = 10*this.play_state.tile_size;

			this.newgame_x = screen_width - 64;
			this.newgame_y = screen_height - 64;

			this.score_x = screen_width - 64;
			this.score_y = screen_height - 128;

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

		if (x > this.newgame_x - 32 &&
		    x < this.newgame_x + 32 &&
		    y > this.newgame_y - 32 &&
		    y < this.newgame_y + 32) {

			this.play_state.score = 0;

			this.change_state(this.engine, new StartGameStateClass(this.engine, this.play_state));
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
	},

	update: function() { 
		this.play_state.update();
	},


	draw: function() {
		this.play_state.draw();

		this.play_state.score_obj.update_pos(this.score_x, this.score_y);
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

tut_block_patterns = [
	[5,1,1,1,5,
	0,0,0,0,0,
	0,0,0,0,0,
	0,0,0,0,0,
	0,0,0,0,0,],

	[5,1,6,1,0,
	0,0,0,6,0,
	0,0,0,0,0,
	0,0,0,0,0,
	0,0,0,0,0,],

	[6,0,5,0,0,
	1,5,1,0,0,
	0,0,0,0,0,
	0,0,0,0,0,
	0,0,0,0,0,],

	[6,1,2,1,6,
	0,0,0,0,0,
	0,0,0,0,0,
	0,0,0,0,0,
	0,0,0,0,0,],

	[0,1,5,0,0,
	1,1,1,0,0,
	0,0,0,0,0,
	0,0,0,0,0,
	0,0,0,0,0,],

	[6,1,0,0,0,
	0,1,1,0,0,
	0,0,1,0,0,
	0,0,0,0,0,
	0,0,0,0,0,],

	[0,1,0,0,0,
	1,1,6,0,0,
	0,1,0,0,0,
	0,0,0,0,0,
	0,0,0,0,0,],

	[5,5,5,5,5,
	0,0,0,0,0,
	0,0,0,0,0,
	0,0,0,0,0,
	0,0,0,0,0,],	// tut_text_8 = null;

	[0,6,0,0,0,
	6,6,6,0,0,
	0,6,0,0,0,
	0,0,0,0,0,
	0,0,0,0,0,],	// tut_text_8 = null;
];

tut_highlight_squares = [];

TutStateClass = GameStateClass.extend({

	play_state: null,
	engine: null,

	stage: 0,

	highlighted_x: 0,
	highlighted_y: 0,

	grabbing_new_piece: false,

	init: function(engine, play_state) {

		this.engine = engine;
		this.play_state = play_state;

		this.play_state.new_game();	// clear the board

		if (tut_text_1 == null) {
			tut_text_1 = new TextClass(Types.Layer.TILE);
			tut_text_1.set_font(Types.Fonts.MEDIUM);
			tut_text_1.set_text("Drop new peices onto the grid");
			tut_text_1.update_pos(-999, -999);

			// Drag new peices onto the grid
			//	.. peice with either 1 bomb or 1 fire

			// Match fire next to bomb
			//	.. new peice has opposite, direct the player to make (non-overlapping) match -- BOOM

			tut_text_2 = new TextClass(Types.Layer.TILE);
			tut_text_2.set_font(Types.Fonts.MEDIUM);
			tut_text_2.set_text("Match fires next to bombs");
			tut_text_2.update_pos(-999, -999);

			// 

			// You can place a bomb directly on a fire
			//	and a fire on a bomb

			tut_text_3 = new TextClass(Types.Layer.TILE);
			tut_text_3.set_font(Types.Fonts.MEDIUM);
			tut_text_3.set_text("Or on top");
			tut_text_3.update_pos(-999, -999);

			// ... here direct the player to make a pisces like combination

			// Introduce blocks with HP > 0

			tut_text_4 = new TextClass(Types.Layer.TILE);
			tut_text_4.set_font(Types.Fonts.MEDIUM);
			tut_text_4.set_text("Some blocks have extra armor");
			tut_text_4.update_pos(-999, -999);

			// Blocks can extinguish fire (introduce this first as its more intuitive)
			//	and bombs

			tut_text_5 = new TextClass(Types.Layer.TILE);
			tut_text_5.set_font(Types.Fonts.MEDIUM);
			tut_text_5.set_text("Blocks extinguish fires");
			tut_text_5.update_pos(-999, -999);

			tut_text_6 = new TextClass(Types.Layer.TILE);
			tut_text_6.set_font(Types.Fonts.MEDIUM);
			tut_text_6.set_text("Blocks also squish bombs");
			tut_text_6.update_pos(-999, -999);

			// Also no secondary explosions

			// You can also place a fire on another fire

			tut_text_7 = new TextClass(Types.Layer.TILE);
			tut_text_7.set_font(Types.Fonts.MEDIUM);
			tut_text_7.set_text("Fires can be stacked");
			tut_text_7.update_pos(-999, -999);

			tut_text_8 = new TextClass(Types.Layer.TILE);
			tut_text_8.set_font(Types.Fonts.MEDIUM);
			tut_text_8.set_text("Let's make a combo");
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

		if (this.stage == 1 && this.play_state.get_block_type(2,4) != 0) {
			this.stage = 2;
			this.do_tut_stage(2);
		} else if (this.stage == 2 && this.play_state.get_block_type(2,4) == 0) {
			this.stage = 3;
			this.do_tut_stage(3);
		} else if (this.stage == 3 && this.play_state.get_block_type(3,2) == 0 && this.play_state.get_block_type(3,3) == 0) {
			this.stage = 4;
			this.do_tut_stage(4);
		} else if (this.stage == 4 && this.play_state.get_block_type(4,4) == 0 && this.play_state.get_block_type(4,3) == 0) {
			this.stage = 5;
			this.do_tut_stage(5);
		} else if (this.stage == 5 && this.play_state.get_block_type(4,7) == 1 && this.play_state.get_block_type(5,7) == 1) {
			this.stage = 6;
			this.do_tut_stage(6);
		} else if (this.stage == 6 && this.play_state.get_block_type(6,6) == 1) {
			this.stage = 7;
			this.do_tut_stage(7);
		}  else if (this.stage == 7 && this.play_state.get_block_type(2,4) == 1) {
			this.stage = 8;
			this.do_tut_stage(8);
		} else if (this.stage == 8 && this.play_state.get_block_type(2,2) == 5) {
			this.stage = 9;
			this.do_tut_stage(9);
		} else if (this.stage == 9 && this.play_state.get_block_type(6,7) == 0) {
			this.stage = 10;
			this.do_tut_stage(10);
		}
	},

	draw: function() {
		this.play_state.draw();

		this.play_state.score_obj.update_pos(-999, -999);

		if (this.stage == 0) {
			// all cards to SHUFFLE deck (but dont do shuffle anim)
		} else if (this.stage == 1) {
			tut_text_1.update_pos(this.text_x, this.text_y,96*7.5,999);
		} else if (this.stage == 2) {
			tut_text_1.update_pos(-999, -999);
			tut_text_2.update_pos(this.text_x, this.text_y,96*7.5,999);


		} else if (this.stage == 3) {
			tut_text_2.update_pos(-999, -999);
			tut_text_3.update_pos(this.text_x, this.text_y,96*7.5,999);
		} else if (this.stage == 4) {
			tut_text_3.update_pos(-999, -999);
			tut_text_4.update_pos(this.text_x, this.text_y,96*7.5,999);

		} else if (this.stage == 5) {
			tut_text_4.update_pos(-999, -999);
			tut_text_5.update_pos(this.text_x, this.text_y,96*7.5,999);

		} else if (this.stage == 6) {
			tut_text_5.update_pos(-999, -999);
			tut_text_6.update_pos(this.text_x, this.text_y,96*7.5,999);

		} else if (this.stage == 7) {
			tut_text_6.update_pos(-999, -999);
			tut_text_7.update_pos(this.text_x, this.text_y,96*7.5,999);

		} else if (this.stage == 8) {
			tut_text_7.update_pos(-999, -999);
			tut_text_8.update_pos(this.text_x, this.text_y,96*7.5,999);

		} else if (this.stage == 9) {
			tut_text_8.update_pos(-999, -999);
			tut_text_9.update_pos(this.text_x, this.text_y,96*7.5,999);

		} else if (this.stage == 10) {
			tut_text_9.update_pos(-999, -999);

		}
	},


	prev_highlighted_x: 0,
	prev_highlighted_y: 0,

	only_clicked_new_peice: false,	// only clicked on new peice - rotate

	handle_mouse_move: function(engine,x,y) {

		this.prev_highlighted_x = this.highlighted_x;
		this.prev_highlighted_y = this.highlighted_y;

		this.highlighted_x = Math.round((x - 0.5*this.play_state.tile_size)/ this.play_state.tile_size);
		this.highlighted_y = Math.round((y - 0.5*this.play_state.tile_size)/ this.play_state.tile_size);

		// if we drag the peice onto the board:
		if (this.grabbing_new_piece == true) {

			if (this.highlighted_x < this.play_state.grid_w &&
			    this.highlighted_y < this.play_state.grid_h) this.only_clicked_new_peice = false;
		}

		//this.highlighted_x = Math.max(0, this.highlighted_x);
		//this.highlighted_x = Math.min(this.play_state.grid_w - 1, this.highlighted_x);

		//this.highlighted_y = Math.max(0, this.highlighted_y);
		//this.highlighted_y = Math.min(this.play_state.grid_h - 1, this.highlighted_y);

		if (this.grabbing_new_piece == true) {
			this.play_state.new_piece_obj.player_move(x,y,this.highlighted_x,this.highlighted_y);

		}
		
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
			g_game_name_text.set_text("FIRE PLUS BOMB");
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
			this.change_state(this.engine, new StartGameStateClass(this.engine, this.play_state));
			//this.change_state(this.engine, new LoadingLevelStateClass(this.engine, this.play_state));
				
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

g_win_message_obj = null;  // MessageBoxClass 

WinStateClass = GameStateClass.extend({

	play_state: null,
	engine: null,

	x_message: 0,

	init: function(engine, play_state){
		this.play_state = play_state;
		this.engine = engine;

		if (g_win_message_obj == null) {
			g_win_message_obj = new MessageBoxClass();
			g_win_message_obj.setup();
			g_win_message_obj.set_main_text("SOLVED");
		}

		this.x_message = -2*screen_width;

		g_win_message_obj.update_pos(-2*screen_width,0.25*screen_height);	// offscreen	

		this.screen_resized();

	},

	screen_resized: function () {
		this.play_state.screen_resized();

		g_win_message_obj.resize(screen_width*0.5,screen_height*0.5);
	},

	update: function() { 
		this.play_state.update();

		this.x_message += 0.1*( 0.25*screen_width - this.x_message);

		g_win_message_obj.update_pos(this.x_message,0.25*screen_height);
	},

	cleanup: function() {
g_win_message_obj.update_pos(-2*screen_width,0.25*screen_height);	// offscreen	
	},

	draw: function() {
		this.play_state.draw();
	},

	handle_mouse_up: function(engine,x,y) {
		if (x > this.x_message && x < this.x_message + 0.5*screen_width &&
		    y > 0.25*screen_width && y < 0.75*screen_height) {
			this.change_state(this.engine, new RestartGameStateClass(this.engine, this.play_state));
			g_win_message_obj.update_pos(-2*screen_width,0.25*screen_height);	// offscreen	
		}
	}
});

ShowAdStateClass = GameStateClass.extend({

});



BootStateClass = GameStateClass.extend({

	init: function(){




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
		engine.push_state(new MenuStateClass(engine, engine.get_state()));

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
