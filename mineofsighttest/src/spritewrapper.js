

g_text_objs = [];
// web fonts take unpredictable time to load properly, so I just call this a few times
function update_webfonts() {
	console.log('update webfonts');
	for (var i = 0; i < g_text_objs.length; i++) {
		if (g_text_objs[i].pixitext == null) continue;
		g_text_objs[i].pixitext.font = 'Montserrat';
		
		//if (g_text_objs[i].pixitext.font != 'Montserrat') {
			//console.log('g_text_objs[i].pixitext.font' + g_text_objs[i].pixitext.font);
		//}


	}
} 

NumberClass = Class.extend({

});


CounterClass = Class.extend({

	number: 0,
	num_to_str: "",

	pos : {x: 0, y: 0},

	numerals: [2],

	char_sprites: [2],

	char_widths: [2],

	font_type: 0,
	font: "",
	font_size: 14,

	layer: 0,

	init: function(layer) {
		this.font = "";
		this.font_size = 6;
		this.layer = layer;

		this.char_sprites[0] = new SpriteClass();
		this.char_sprites[1] = new SpriteClass();

		for(var i = 0; i < this.char_sprites.length; i++) {
			this.numerals[i] = 0;
			this.char_sprites[i].setup_sprite('0.png', this.layer);
		}
	},

	set_font: function(f_) {},

	set_text: function(t_) {
		this.change_text(t_);
	},

	change_text: function(text_) {
		this.num_to_str = text_;

		this.str_len = text_.length;

		for(var i = 0; i < this.char_sprites.length; i++) {

			this.char_sprites[i].make_vis();
			if (this.num_to_str.length <= i) {
				this.char_sprites[i].hide();
				continue;
			}
			this.char_sprites[i].set_texture(this.num_to_str[i] + '.png');
		}

		
	},

	str_len: 1,

	set_num: function(num) {

		

		this.number = num;
		this.num_to_str = num.toString();
		

		for(var i = 0; i < this.char_sprites.length; i++) {

			this.char_sprites[i].make_vis();
			if (this.num_to_str.length <= i) {
				this.char_sprites[i].hide();
				continue;
			}
			this.char_sprites[i].set_texture(this.num_to_str[i] + '.png');
		}
			
		
	},

	center_x : function(x_) {
		
	},

	update_pos : function (x_start,y_start,w,h) {

		if (this.str_len == 2) x_start = x_start - 10;

		this.pos.x = x_start;
		this.pos.y = y_start;

		var x = x_start;
		var y = y_start;

		

		for(var i = 0; i < this.char_sprites.length; i++) {

			if (this.str_len == 1 && i == 1) break; 

			this.char_sprites[i].update_pos(x,y + 16);

			if (x < 0) this.char_sprites[i].hide();
			else this.char_sprites[i].make_vis();

			

			//spr_name = spr_name + this.font + ".png";
			
			if (i < this.char_sprites.length - 1) x = x + 17 + 5;//this.font_size;
			
			

			if (x > x_start + w) {
				//x = x_start;
				//y = y + this.font_size;
			}
		}

		this.total_x = x - x_start;// + 0.5*this.char_widths[0] + 0.5*this.char_widths[this.char_sprites.length - 1];
	},

});


createText = function () {};

TextClass = Class.extend({

	pixitext: null,

	scale: 1,

	pos : {x: 0, y: 0},

	text_string: "",

	char_sprites: [],

	char_widths: [],
	char_heights: [],

	font_type: 0,
	font: "",
	font_size: 14,

	layer: 0,

	width: 999,

	init: function(layer) {

		update_webfonts();

		this.font = "";
		this.font_size = 32;
		this.layer = layer;

		

		g_text_objs.push(this);

		

		
	},

	

	set_scale: function (scale) {
		this.scale = scale;
	},

	set_width: function (width) {
		this.width = width;
	},

	set_font: function (font) {
		this.font_type = font;
		if (font == Types.Fonts.SMALL) {
			this.font = "22";
			this.font_size = 22;
		} else if (font == Types.Fonts.MEDIUM) {
			this.font = "32";
			this.font_size = 32;
			//this.set_scale(1.5);
		} else if (font == Types.Fonts.MED_SMALL) {
			this.font = "18";
			this.font_size = 18;
			//this.set_scale(1.5);
		} else if (font == Types.Fonts.LARGE) {
			this.font = "36";
			this.font_size = 36;
		} else if (font == Types.Fonts.SMALL_WHITE) {
			this.font = "smw";
			this.font_size = 14;
		} else if (font == Types.Fonts.XSMALL) {
			this.font = "14";
			this.font_size = 14;
			//this.set_scale(1.5);
		} else {
			this.font = "32";
			this.font_size = 32;
		}
	},

	use_pixitext: 1,
	font_name: "Montserrat",//"Hind Vadodara",
	style: null,

	change_text: function (str) {
		if (this.pixitext == null) return;
		this.pixitext.text = str;
	},

	change_size: function(font) {
		this.set_font(font);
		if (this.pixitext == null) return;
		this.pixitext.fontSize = this.font_size;
	},

	set_text : function(str) {

		

		var font = this.font_size.toString() + "px " + this.font_name;
			//font = '36px Hind Vadodara';
			var fill = "#ffffff";

		if (this.use_pixitext == 1) {

			this.style = {	
		font : font,				
		fill : fill,	
		align : "left",			
		//stroke : '#4a1850',				
		//strokeThickness : 5,				
		//dropShadow : true,				
		//dropShadowColor : '#000000',				
		//dropShadowAngle : Math.PI / 6,				
		//dropShadowDistance : 6,				
		wordWrap : true,				
		wordWrapWidth : 9999			};




			var st_ = {
				fontSize : this.font_size.toString + 'px',
				
			};
			
			this.pixitext = game.add.text(-999,-999, str);//, st_);
			this.pixitext.font = 'Montserrat';
			this.pixitext.fill = '#ffffff';
			this.pixitext.fontSize = this.font_size;

			// set padding may help with the garbled text problem
			this.pixitext.padding.set(2, 2);	// http://www.html5gamedevs.com/topic/11469-text-cut-out-with-webfont/

			//this.pixitext = new PIXI.Text(str, this.style);


			this.pixitext.x = -999;		
			this.pixitext.y = -999;

			

			if (this.layer == Types.Layer.GAME) game_group.add(this.pixitext);
			else if(this.layer == Types.Layer.POP_MENU) options_menu_group.add(this.pixitext);
			else if(this.layer == Types.Layer.GAME_MENU) game_menu_group.add(this.pixitext);
			else if(this.layer == Types.Layer.HUD) menu_group.add(this.pixitext);
			else if(this.layer == Types.Layer.TILE) tile_group.add(this.pixitext);
			else if(this.layer == Types.Layer.BACKGROUND) background_group.add(this.pixitext);

			return;

		}

		this.text_string = str;

		
		this.char_heights = [];
		this.char_widths = [];

		this.total_x = 0;
		

		for(var i = 0; i < str.length; i++) {
			this.add_char(str[i], i);
			this.char_sprites[i].make_vis();
			
		}

		for(var i = str.length; i < this.char_sprites.length; i++) {
			this.char_sprites[i].hide();
			
		}
	},

	center_x: function(x) {
			if (this.pixitext == null) return;
			this.pixitext.anchor.set(0.5,0);
			//this.style.align = 'center';

			//this.pixitext.boundsAlignH = "center";
			//this.pixitext.anchor.x = this.pixitext.width;// (x, this.pixitext.y);

			//this.pixitext.x = x - this.pixitext.width*0.5;
		

	},


	update_pos : function (x_start,y_start,w,h) {

		if (this.pixitext == null) return;	// do phaser text L8R


		this.pixitext.x = x_start;		
		this.pixitext.y = y_start;

		//this.pixitext.height = 999;

		if (x_start < 0) {
			this.pixitext.visible = false;
		} else this.pixitext.visible = true;

		//this.pixitext.wordWrapWidth = w;

		if (w != null) {
			this.pixitext.wordWrap = true;
			this.pixitext.wordWrapWidth = w;
		}
			
		//this.style.wordWrapWidth = w;

		//this.pixitext.style = this.style;

			

		
	},

	

	
	
});


ButtonClass = Class.extend({

	
	sprite_obj: null,

	button_sprite: null,

	init: function() {
		//this.button_shadow_sprite = new SpriteClass();
		this.button_sprite = new SpriteClass();
		this.sprite_obj = new SpriteClass();
	},

	set_scale: function(scale) {
		this.sprite_obj.set_scale(scale);
	},

	make_vis: function() {
		this.button_sprite.make_vis();
		//this.button_shadow_sprite.make_vis();
		this.sprite_obj.make_vis();
	},

	hide: function() {
		this.button_sprite.hide();
		//this.button_shadow_sprite.hide();
		this.sprite_obj.hide();
	},

	setup_sprite: function(name,layer) {
		//this.button_shadow_sprite.setup_sprite("button_shadow.png",layer);
		this.button_sprite.setup_sprite("button.png",layer);
		this.sprite_obj.setup_sprite(name,layer);
	},

	update_pos: function(x,y) {
		//this.button_shadow_sprite.update_pos(x + 6,y + 6);
		this.button_sprite.update_pos(x,y);
		this.sprite_obj.update_pos(x,y);
	}

});


ToggleClass = Class.extend({

	
	sprite_obj: null,

	button_sprite: null,

	layer: 0,

	init: function() {
		//this.button_shadow_sprite = new SpriteClass();
		this.button_sprite = new SpriteClass();
		this.sprite_obj = new SpriteClass();
	},

	set_scale: function(scale) {
		this.sprite_obj.set_scale(scale);
	},

	make_vis: function() {
		this.button_sprite.make_vis();
		//this.button_shadow_sprite.make_vis();
		this.sprite_obj.make_vis();
	},

	hide: function() {
		this.button_sprite.hide();
		//this.button_shadow_sprite.hide();
		this.sprite_obj.hide();
	},

	setup_sprite: function(name,layer) {
		this.layer = layer;
		//this.button_shadow_sprite.setup_sprite("button_shadow.png",layer);
		this.button_sprite.setup_sprite("button_small.png",layer);
		this.sprite_obj.setup_sprite(name,layer);

		this.toggle();
	},

	update_pos: function(x,y) {
		//this.button_shadow_sprite.update_pos(x + 6,y + 6);
		this.button_sprite.update_pos(x,y);
		this.sprite_obj.update_pos(x + 52,y);
	},

	toggled: -1,

	toggle: function() {
		this.toggled = -this.toggled;

		if (this.toggled == 1) this.button_sprite.set_texture("button_small_on.png",this.layer);
		else this.button_sprite.set_texture("button_small.png",this.layer);
	}

});


SpriteClass = Class.extend({

	phasersprite: null,

	layer: 0,
	name: '',

	init: function() {
	},

	setup_sprite: function(name,layer,x,y) {
		// 'pixi layer' is now 'phaser group'

		this.name = name;
		this.layer = layer;

		if (x == null) x = -999;
		if (y == null) y = - 999;

		//var test = game.add.sprite(20,40,'atlas_blocks',name);
		//console.log(game_group);
	
		

		//this.phasersprite = game.add.sprite(x,y,'atlas_blocks',name);
		this.phasersprite = game.add.image(x,y,'atlas_blocks',name);
		this.phasersprite.anchor.setTo(0.5,0.5);
		

		if (layer == Types.Layer.GAME) game_group.add(this.phasersprite);		// game_container
		else if(layer == Types.Layer.POP_MENU) options_menu_group.add(this.phasersprite);   // options_menu_container
		else if(layer == Types.Layer.GAME_MENU) game_menu_group.add(this.phasersprite);  // game_menu_container
		else if(layer == Types.Layer.HUD) menu_group.add(this.phasersprite);	// menu_container
		else if(layer == Types.Layer.TILE) tile_group.add(this.phasersprite);	// tile_container
		else if(layer == Types.Layer.BACKGROUND) background_group.add(this.phasersprite);    // background_container
	},

	x: -999,
	y: -999,

	make_vis: function() {
		 //this.phasersprite.body = null;	// may need to do this first http://www.html5gamedevs.com/topic/4774-destroy-a-sprite/
		 //this.phasersprite.destroy();
		//this.setup_sprite(this.name, this.layer, this.x, this.y);

		this.phasersprite.visible = true;
	},

	hide: function() { 
		
		this.phasersprite.visible = false;

		// just destroy the object?
		// this.phasersprite.body = null;	// may need to do this first http://www.html5gamedevs.com/topic/4774-destroy-a-sprite/
		// this.phasersprite.destroy();
	},

	scale: function(xscale, yscale) {
		this.phasersprite.scale.setTo(xscale, yscale);
	},

	update_pos: function(x,y) {
		this.x = x;
		this.y = y;
		this.phasersprite.body = null;
		this.phasersprite.destroy();

		this.setup_sprite(this.name, this.layer,x,y);
		
		
		//this.phasersprite.x = x;
		//this.phasersprite.y = y;
		
	},

	set_z_to_top: function() {
		// Group.moveUp	   or   Group.bringToTop
	},

	set_texture: function(name) {
		// this.phasersprite.body = null;	// may need to do this first http://www.html5gamedevs.com/topic/4774-destroy-a-sprite/
		this.phasersprite.destroy();

		this.setup_sprite(name, this.layer, this.x, this.y);
	},

	
});

pBar.value += 10;