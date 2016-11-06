// some code from udacity course

// An array of the sprites in our atlas
sprites = new Array();

name_index = {};	//name -> index in sprite array

font_sprites = new Array();
font_name_index = {};	//name -> index in sprite array

font_spr_width = {};
font_spr_height = {};

function parseAtlasDefinition (atlasJSON) {

	// For THE spritesheet
	var parsed = atlasJSON; //JSON.parse(atlasJSON);	// Already parsed because I'm hardcoding the json objects for now
	var frames = parsed.frames;

	for (var i = 0; i < parsed.frames.length; i++) {
		var x = frames[i].frame.x;
                var y = frames[i].frame.y;

		if (frames[i].rotated) {
			var w = frames[i].frame.h;	
                	var h = frames[i].frame.w;
		} else {
                	var w = frames[i].frame.w;	
                	var h = frames[i].frame.h;
		}
		//console.log("	parseAtlasDefinition: x " + x);
			
                var cx = -w*0.5;		//store as negative here
                var cy = -h*0.5;
                defSprite(frames[i].filename,x,y,w,h,cx,cy);
	}

}

function parseFontAtlasDefinition (txt, size, scale) {

	console.log(txt);
	console.log(txt.bitmapFont);
	console.log(txt.bitmapFont.chars);
	console.log(txt.bitmapFont.chars[55]);

	for (var c = 32; c < 126; c++) {
		if (txt.bitmapFont.chars[c] == null) continue;

		var x = txt.bitmapFont.chars[c].texture._frame.x*scale;
		var y = txt.bitmapFont.chars[c].texture._frame.y*scale;
		var h = txt.bitmapFont.chars[c].texture._frame.height*scale;
		var w = txt.bitmapFont.chars[c].texture._frame.width*scale;

		  var cx = -w*0.5;		//store as negative here
                var cy = -h*0.5;
		var y_off =  -txt.bitmapFont.chars[c].yOffset*scale;
		var x_adv =  txt.bitmapFont.chars[c].xAdvance*scale;


		// http://www.gamedev.net/topic/330742-quick-tutorial-variable-width-bitmap-fonts/
		// yOffset + h must be constant (except for g p j )

		console.log('x_adv ' + x_adv);

		 defFontSprite("fnt" + c + size.toString() + ".png",x,y,w,h,cx,cy, size, y_off, x_adv);
		font_spr_width["fnt" + c + size.toString() + ".png"] = w;
		font_spr_height["fnt" + c + size.toString() + ".png"] = h;
	}

	return;

	var parsedXML;

	if (window.DOMParser) {
    		parser = new DOMParser();
    		parsedXML = parser.parseFromString(txt, "text/xml");
		console.log('parsed');

  	}
	else // Internet Explorer
  	{
    		parsedXML = new ActiveXObject("Microsoft.XMLDOM");
    		parsedXML.async = false;
    		parsedXML.loadXML(txt);
		console.log('parsed IE');
  	} 

	//var parsed = XML.parse(atlasXML);

	var frames = parsedXML.frames;
	//var allthechars = parsedXML.getElementsByTagName("char")[0].childNodes[0].nodeValue;;

	//console.log('font atlas XML frames '+ parsedXML.documentElement.bitmapFont);

	
	//console.log('xml' + xml.documentElement.nodeName);
}

font_y_off = {};
font_x_adv = {};

function defFontSprite(name, x, y, w, h, cx, cy, fnt_size, y_off, x_adv) {

	var spt = {
			"id": name,
			"x": x,
			"y": y,
			"w": w,
			"h": h,
			"fnt_size" : fnt_size,
			"cx": cx == null ? 0 : cx,
			"cy": cy == null ? 0 : cy,
			"y_off": y_off == null ? 0 : y_off
	};

		// We push this new object into
        	// our array of sprite objects,
        	// at the end of the array.
	font_sprites.push(spt);

	font_name_index[name] = this.sprites.length - 1;

	
	font_y_off[name] = y_off;

	font_x_adv[name] = x_adv;
	

}



function defSprite(name, x, y, w, h, cx, cy) {
	// We create a new object with:
        //
        	// The name of the sprite as a string
       	 	//
        	// The x and y coordinates of the sprite
        	// in the atlas.
        	//
        	// The width and height of the sprite in
        	// the atlas.
        	//
        	// The x and y coordinates of the center
        	// of the sprite in the atlas. This is
        	// so we don't have to do the calculations
        	// each time we need this. This might seem
        	// minimal, but it adds up!

	var spt = {
			"id": name,
			"x": x,
			"y": y,
			"w": w,
			"h": h,
			"cx": cx == null ? 0 : cx,
			"cy": cy == null ? 0 : cy
	};

		// We push this new object into
        	// our array of sprite objects,
        	// at the end of the array.
	sprites.push(spt);

	name_index[name] = this.sprites.length - 1;
}

function draw_rect_perm (x,y,xx,yy,colour,layer) {
	
	var graphics = new PIXI.Graphics();

	graphics.beginFill(colour);

	// set the line style to have a width of 5 and set the color to red
	graphics.lineStyle(0, colour);

	// draw a rectangle
	graphics.drawRect(x, y,xx, yy);

	if (layer == Types.Layer.POP_MENU) {
		options_menu_container.addChild(graphics);
	} else if (layer == Types.Layer.BACKGROUND) {
		background_container.addChild(graphics);
	} else if (layer == Types.Layer.GAME_MENU) {
		game_menu_container.addChild(graphics);
	}

	return graphics;
}

SquareClass = Class.extend({
	left_x: 0,
	right_x: 0,
	top_y: 0,
	bottom_y: 0,
	hidden: 0,

	line: null,

	colour: 0xffffff,

	init: function() {},

	setup: function(layer) {
		this.line = new PIXI.Graphics();
		
		if (layer == Types.Layer.GAME_MENU) game_menu_container.addChild(this.line);
		else tile_container.addChild(this.line);
	},

	update_pos: function(x,y,w,h) {
		this.left_x = x;
		this.right_x = x + w;
		this.top_y = y;
		this.bottom_y = y + h;

		this.hidden = 1;

		this.make_vis();

	},

	make_vis: function() {
		if (this.hidden == 0) return;
		this.hidden = 0;
		this.line.clear();
		this.line.lineStyle(6, this.colour);
		this.line.moveTo(this.left_x, this.top_y);
		this.line.lineTo(this.left_x, this.bottom_y);
		this.line.lineTo(this.right_x, this.bottom_y);
		this.line.lineTo(this.right_x, this.top_y);
		this.line.lineTo(this.left_x , this.top_y);
		this.line.endFill();
	},

	hide: function() {
		if (this.hidden == 1) return;
		this.hidden = 1;
		this.line.clear();
	},

});

MessageBoxClass = Class.extend({

	pos : {x: 0, y: 0},

	message_box_graphic : null,

	message_main_text : null,

	init: function() {},

	setup: function() {
		this.message_box_graphic = draw_rect_perm(0,0,190,990,0x222222,Types.Layer.GAME_MENU);

		this.message_main_text = new TextClass(Types.Layer.GAME_MENU);
		this.message_main_text.set_font(Types.Fonts.MEDIUM);
	},

	set_main_text: function (str) {
		this.message_main_text.set_text(str);
	},

	add_button: function (code, str) {

	},

	resize: function(w,h) {
		this.message_box_graphic.width = w;
		this.message_box_graphic.height = h;

		this.update_pos(this.pos.x, this.pos.y);
	},

	update_pos : function (x,y) {

		this.pos.x = x;
		this.pos.y = y;

		this.message_box_graphic.position.x = x;
		this.message_box_graphic.position.y = y;

		this.message_main_text.update_pos(x,y + 0.25*this.message_box_graphic.height);
		this.message_main_text.center_x(x + 0.5*this.message_box_graphic.width);

		
	},

	check_for_click : function (x,y) {

	}

});

PixiTextClass = Class.extend({

	layer: 0,

	init: function(layer) {

	}
});

g_text_objs = [];
// web fonts take unpredictable time to load properly, so I just call this a few times
function update_webfonts() {
	for (var i = 0; i < g_text_objs.length; i++) {
		if (g_text_objs[i].pixitext == null) continue;
		g_text_objs[i].pixitext.style = g_text_objs[i].style; 
	}
} 

CounterClass = Class.extend({

	number: 0,
	number_to_str: "",

	pos : {x: 0, y: 0},

	numerals: [3],

	pixitext: null,

	font_size: 14,

	layer: 0,

	style: null,

	font_name: "Montserrat",//"Hind Vadodara",

	init: function(layer) {

		update_webfonts();
		
		this.font_size = 24;
		this.layer = layer;

		var font = this.font_size.toString() + "px " + this.font_name;
		//font = '36px Hind Vadodara';
		var fill = "#ffffff";

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
			wordWrapWidth : 9999			
		};

		this.pixitext = new PIXI.Text(this.number_to_str, this.style);

		if (this.layer == Types.Layer.GAME) game_container.addChild(this.pixitext);
		else if(this.layer == Types.Layer.POP_MENU) options_menu_container.addChild(this.pixitext);
		else if(this.layer == Types.Layer.GAME_MENU) game_menu_container.addChild(this.pixitext);
		else if(this.layer == Types.Layer.HUD) menu_container.addChild(this.pixitext);
		else if(this.layer == Types.Layer.TILE) tile_container.addChild(this.pixitext);
		else if(this.layer == Types.Layer.BACKGROUND) background_container.addChild(this.pixitext);

		g_text_objs.push(this);
		
	},


	set_num_red: function(num) {
		this.number = num;
		this.num_to_str = num.toString();

		
	},

	set_num: function(num) {

		

		this.number = num;
		this.num_to_str = num.toString();
		
		this.pixitext.text = this.num_to_str;	
		
	},

	update_pos : function (x_start,y_start,w,h) {

		this.pos.x = x_start;
		this.pos.y = y_start;

		this.pixitext.x = x_start;
		this.pixitext.y = y_start;

	},

});

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
		this.font_size = 6;
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
			this.font = "16";
			this.font_size = 16;
		} else if (font == Types.Fonts.MEDIUM) {
			this.font = "24";
			this.font_size = 24;
			//this.set_scale(1.5);
		} else if (font == Types.Fonts.LARGE) {
			this.font = "72";
			this.font_size = 72*0.66;
		} else if (font == Types.Fonts.SMALL_WHITE) {
			this.font = "smw";
			this.font_size = 14;
		}  else if (font == Types.Fonts.XSMALL) {
			this.font = "14";
			this.font_size = 14;
			//this.set_scale(1.5);
		}
	},

	use_pixitext: 1,
	font_name: "Montserrat",//"Hind Vadodara",
	style: null,

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





			
			

			this.pixitext = new PIXI.Text(str, this.style);

			this.pixitext.x = -999;		
			this.pixitext.y = -999;

			if (this.layer == Types.Layer.GAME) game_container.addChild(this.pixitext);
			else if(this.layer == Types.Layer.POP_MENU) options_menu_container.addChild(this.pixitext);
			else if(this.layer == Types.Layer.GAME_MENU) game_menu_container.addChild(this.pixitext);
			else if(this.layer == Types.Layer.HUD) menu_container.addChild(this.pixitext);
			else if(this.layer == Types.Layer.TILE) tile_container.addChild(this.pixitext);
			else if(this.layer == Types.Layer.BACKGROUND) background_container.addChild(this.pixitext);

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

		
		if (this.use_pixitext == 1) {

			

			
			this.style.align = 'center';

			//this.pixitext.style = this.style;
			//this.pixitext.anchor.x = this.pixitext.width;// (x, this.pixitext.y);

			this.pixitext.x = x - this.pixitext.width*0.5;
			
			return;
		}


		var w = this.total_x/2;
		var cent = this.pos.x + w; // - this.char_widths[0] 
		var diff = x - cent;

		// update_pos is already called - to calculate width;
		for(var i = 0; i < this.char_sprites.length; i++) {
			this.char_sprites[i].shift_pos(diff,0);
		}

		this.pos.x += diff;
	},

	total_x: 0,

	update_pos : function (x_start,y_start,w,h) {

		if (this.use_pixitext == 1) {
			this.pixitext.x = x_start;		
			this.pixitext.y = y_start;
			this.pixitext.wordWrapWidth = w;
			
			this.style.wordWrapWidth = w;

			this.pixitext.style = this.style;

			return;
		}

		this.pos.x = x_start;
		this.pos.y = y_start;

		var x = x_start;
		var y = y_start;

		var loops = 0;

		for(var i = 0; i < this.text_string.length; i++) {

			if (loops == 200) return;

			var y_off = y + this.char_heights[i]*this.scale;	// char_heights is yOffsets

			this.char_sprites[i].update_pos_topleft(x,y_off);


			//spr_name = spr_name + this.font + ".png";
			
			if (i < this.text_string.length - 1) x = x + this.char_widths[i];// + 0.5*this.char_widths[i+1];//this.font_size;
			// if (i < this.text_string.length - 1) x = x + 0.5*this.char_widths[i] + 0.5*this.char_widths[i+1];//this.font_size;
			

			if (w != null && x > x_start + w) {
				x = x_start;
				y = y + this.font_size;

				if (i < this.text_string.length - 1 &&
				    this.text_string[i + 1] == " ") i++;
				else {
					var chars_in_word = 0;
					var j = i;
					while (this.text_string[j] != " " && j > 0) {
						chars_in_word++;
						j--;
					}

					if (chars_in_word < 10) i = j;	// if we have a 10 letter word then just break it
				}
			}
		}

		this.total_x = x - x_start;// + 0.5*this.char_widths[0] + 0.5*this.char_widths[this.char_sprites.length - 1];
	},

	add_char: function(ch, i) {

		var spr_name = "fnt" + ch.charCodeAt(0);

		spr_name = spr_name + this.font + ".png";

		var y_off = 0;


		if (font_y_off[spr_name] != null) {
			y_off = - font_y_off[spr_name];//;font_sprites[font_name_index[spr_name]].y_off;
			
		}


		var spr_obj = new SpriteClass();
		spr_obj.setup_sprite(spr_name, this.layer);
		spr_obj.set_scale(this.scale);

		if (i >= this.char_sprites.length) {
			this.char_sprites.push(spr_obj);


		} else {
			this.char_sprites[i].set_texture(spr_name);

			
		}


		
		//spr_obj.update_pos(x,y);

		//if (ch != " ") this.char_widths.push(font_spr_width[spr_name]*this.scale);
		//else this.char_widths.push(0.5*this.font*this.scale);

		this.char_widths.push(font_x_adv[spr_name]);

		if (y_off != 0) this.char_heights.push(y_off*this.scale);
		else this.char_heights.push(0);

		/*
		if (ch == 'g') this.char_heights.push(0.25*this.font);
		else if (ch == 'p') this.char_heights.push(0.25*this.font);
		else if (ch == 'q') this.char_heights.push(0.25*this.font);
		else if (ch == 'y') this.char_heights.push(0.25*this.font);
		else if (ch == 'j') this.char_heights.push(0.25*this.font);
		else if (ch == ',') this.char_heights.push(0.125*this.font);
		else this.char_heights.push(font_spr_height[spr_name]);
		*/

	},

	
	
});

ButtonClass = Class.extend({

	sprite_obj: null,

	button_sprite: null,
	button_shadow_sprite: null,

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

SpriteClass = Class.extend({

	pos : {x:0,y:0},
	pixisprite: null,

	init: function() {
	},

	set_scale: function(scale) {
		this.pixisprite.scaleMode = PIXI.SCALE_MODES.NEAREST;
		this.pixisprite.scale.set(scale,scale);
	},

	set_scale_x: function(scale) {
		this.pixisprite.scale.set(scale,1);
	},

	set_scale_y: function(scale) {
		this.pixisprite.scale.set(1,scale);
	},

	make_vis: function() {
		this.pixisprite.visible = true;
	},

	hide: function() {
		this.pixisprite.visible = false;
	},

	set_z_to_top: function() {
		if(this.pixisprite == null) return;

		var parent = this.pixisprite.parent;

		if(parent == null) return;

		var index = parent.getChildIndex(this.pixisprite);
		if(index == null || index > parent.children.length - 2) return;

		parent.setChildIndex(this.pixisprite,parent.children.length - 1);
	},

	increase_z_index: function() {
		// find this.pixisprite in appropiate container
		//if(layer != Types.Layer.GAME) return;	// only for game layer atm
		var parent = this.pixisprite.parent;
		if(parent == null) return;
		var index = parent.getChildIndex(this.pixisprite);
		if(index == null || index >= parent.children.length - 11) return;
		parent.setChildIndex(this.pixisprite,index + 10);
	},

	set_alpha: function(alpha) {
		this.pixisprite.alpha = alpha;
	},

	set_texture: function(name) {
		//this.pixisprite.setTexture(g_textures[name]);
		this.pixisprite.texture = g_textures[name];
	},

	setup_sprite: function(name,layer) {

		this.pixisprite = new PIXI.Sprite(g_textures[name]);
		this.pixisprite.anchor.x = 0.5;
		this.pixisprite.anchor.y = 0.5;
		this.pixisprite.visible = true;

		if (layer == Types.Layer.GAME) game_container.addChild(this.pixisprite);
		else if(layer == Types.Layer.POP_MENU) options_menu_container.addChild(this.pixisprite);
		else if(layer == Types.Layer.GAME_MENU) game_menu_container.addChild(this.pixisprite);
		else if(layer == Types.Layer.HUD) menu_container.addChild(this.pixisprite);
		else if(layer == Types.Layer.TILE) tile_container.addChild(this.pixisprite);
		else if(layer == Types.Layer.BACKGROUND) background_container.addChild(this.pixisprite);
	},

	update_pos_topleft : function(x,y) {

		this.pixisprite.anchor.x = 0;
		this.pixisprite.anchor.y = 0;

		this.pos.x = x;
		this.pos.y = y;
		this.pixisprite.position.x = x;
		this.pixisprite.position.y = y;
	},	

	update_pos: function(x,y) {
		this.pos.x = x;
		this.pos.y = y;
		this.pixisprite.position.x = x;
		this.pixisprite.position.y = y;
	},

	shift_pos: function(x,y) {
		this.pos.x += x;
		this.pos.y += y;
		this.pixisprite.position.x = this.pos.x;
		this.pixisprite.position.y = this.pos.y;
		
	}

});


