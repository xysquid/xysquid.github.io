
/*Copyright 2012 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
#limitations under the License.*/

/*Copyright 2011 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
#limitations under the License.*/

// Changes were made to this file - Jacob Nankervis 2016



// ---------------------------------------

// THE spritesheet
// The sprite-sheet (or atlas) itself, as an Image object
var sprite_sheet;

// An array of the sprites in our atlas
sprites = new Array();

name_index = {};	//name -> index in sprite array

//var sprite_pool = {};	// PIXI.sprites

var layer_pools = {
		0 : {},	// BACKGROUND
		1 : {},	// TILE
		2 : {},	// GAME
		3 : {}, // Types.Layer.MENU
};

//var sprite_obj_pool = {};	// wrapped PIXI sprites

function get_pooled_sprite(name, layer) {

	var sprite_obj_pool = layer_pools[layer];


	if(sprite_obj_pool[name] == null) {
		sprite_obj_pool[name] = {sprites: new Array(),
			 	         upto: 0};
	}

	// upto should be reset to 0 each frame
	if(sprite_obj_pool[name].upto >= sprite_obj_pool[name].sprites.length) {
		var new_sp = new SpriteClass();
		new_sp.setup_sprite(name,layer);//PIXI.Sprite(g_textures[name]);

		sprite_obj_pool[name].sprites.push(new_sp);
	}

	sprite_obj_pool[name].upto++;
	return sprite_obj_pool[name].sprites[sprite_obj_pool[name].upto - 1];
}

// Called each frame
function pool_all_sprites() {

	for(var name in sprite_obj_pool) {
		sprite_obj_pool[name].upto = 0;
		for(var i = 0; i < sprite_obj_pool[name].sprites.length; i++) {
			sprite_obj_pool[name].sprites[i].pool();
		}
	}
}

function pool_all_sprite_layers() {
	for(var layer in layer_pools) {
		
	
	   for(var name in layer_pools[layer]) {
		layer_pools[layer][name].upto = 0;
		for(var i = 0; i < layer_pools[layer][name].sprites.length; i++) {
			layer_pools[layer][name].sprites[i].pool();
		}
	   }

	}
}

function get_pooled_pixi_sprite(name) {
	if(sprite_pool[name] == null) {
		sprite_pool[name] = {sprites: new Array(),
			 	     upto: 0};
	}

	// upto should be reset to 0 each frame
	if(sprite_pool[name].upto >= sprite_pool[name].sprites.length) {
		var new_sp = new PIXI.Sprite(g_textures[name]);
		new_sp.anchor.x = 0.5;
		new_sp.anchor.y = 0.5;

		sprite_pool[name].sprites.push(new_sp);
	}

	sprite_pool[name].upto++;
	return sprite_pool[name].sprites[sprite_pool[name].upto - 1];
	
}

// Load the atlas at the path 'imgName' into memory
function load_sprite_sheet (imgName, callback) {
	sprite_sheet = new Image();
	sprite_sheet.onload = callback;
	sprite_sheet.src = imgName;	//triggers the actual file retrieval
}

function parseAtlasDefinition (atlasJSON) {
	console.log('parseAtlasDefinition ');
	// For THE spritesheet
	var parsed = atlasJSON; //JSON.parse(atlasJSON);	// Already parsed because I'm hardcoding the json objects for now
	var frames = parsed.frames;

	for (var i = 0; i < parsed.frames.length; i++) {            
                //var sprite = frames[i];
                var x = frames[i].frame.x;
                var y = frames[i].frame.y;
		// Did Texture Packer rotate this one?
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

function defSprite(name, x, y, w, h, cx, cy) {
	console.log("defSprite - Name: " + name + "Position: " +this.sprites.length);
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

// Walk through all the sprite definitions for THE
// atlas, and find which one matches the name.
function getStats (name) {
		
	var i = name_index[name];
	//console.log("getStats: "+i);
	if(!(i === undefined)) {return sprites[i];}

	for(var j = 0; j < sprites.length; j++) {
		// Does this sprite's 'id' equal the passed in name?
		//console.log("getStats - testing sprite "+j + this.sprites[j].toString() );
		if(sprites[j].id == name) {
			return sprites[j];
		}
	}
	return null;
}

// --------------------------------------




//-----------------------------------------
// External-facing function for drawing sprites based
// on the sprite name (ie. "chaingun.png", and the
// position on the canvas to draw to.
function drawSprite(spritename, posX, posY, use_context, z) {
	// Walk through all our spritesheets defined in
    // 'gSpriteSheets' and for each sheet:
    //
    // 1) Use the getStats method of the spritesheet
    //    to find if a sprite with name 'spritename'
    //    exists in that sheet.
    //
    // 2) If we find the appropriate sprite, call
    //    '__drawSpriteInternal' with parameters as
    //    described below.
    //
    // YOUR CODE HERE
	
	if(g_PIXI == true) {
		if(use_context == null) {
		    use_context = Types.Layer.GAME;
		}
		__drawSpriteInternalPIXI(spritename, posX, posY, use_context,z);
		return;
	}

	console.log('g_PIXI is false?')
	
	var sprite_data = getStats(spritename);
	if (sprite_data === null) {return;}
	if(use_context == null) {
		    use_context = context;
	}

	__drawSpriteInternal(sprite_data,sprite_sheet,posX,posY, use_context);
	
 	return;
}

function __drawSpriteInternalPIXI(name, posX, posY, layer,z) {
	
	var spr_obj = get_pooled_sprite(name, layer);
	spr_obj.unpool(posX,posY);
	spr_obj.zindex = z;
	//spr_obj.increase_z_index();
	
}

function __drawSpriteAlphaInternalPIXI(name, posX, posY, alpha,layer,z) {
	var spr_obj = get_pooled_sprite(name,layer );
	spr_obj.unpool(posX,posY);
	spr_obj.set_alpha(alpha);
	spr_obj.zindex = z;
}

function __drawSpriteResizedInternalPIXI(name, posX, posY, scale,layer,z) {
	var spr_obj = get_pooled_sprite(name,layer );
	spr_obj.unpool(posX,posY);
	spr_obj.set_scale(scale);
	spr_obj.zindex = z;
}

function __drawSpriteResizedAlphaInternalPIXI(name, posX, posY, scale,alpha,layer,z) {
	var spr_obj = get_pooled_sprite(name,layer );
	spr_obj.unpool(posX,posY);
	spr_obj.set_alpha(alpha);
	spr_obj.set_scale(scale);
	spr_obj.zindex = z;
}

// NOT USING
// Sprite -> positions in previous frame
g_pos_list_index = [];

g_pos_list_dirty_rect = [];	// List of positions - just clear a 100x100 area around them each frame

function clear_dirty_rects() {
	for(var i = 0; i < g_pos_list_dirty_rect.length; i++) {
		context.clearRect(g_pos_list_dirty_rect[i].x,g_pos_list_dirty_rect[i].y,100,100);
	}
}

//-----------------------------------------
// External-facing function for drawing sprites based
// on the sprite object stored in the 'sprites Array,
// the 'SpriteSheetClass' object stored in the
// 'gSpriteSheets' dictionary, and the position on
// canvas to draw to.
// 5th parameter is the context/canvas to use - if its null then assume game_canvas
function __drawSpriteInternal(spt, sheet, posX, posY, use_context) {
	// First, check if the sprite or sheet objects are
    // null.
    //
    // YOUR CODE HERE
    
    
    // Call the drawImage method of our canvas context
    // using the full drawImage API. drawImage takes,
    // in order:
    //
    // 1) the Image object to draw, this is our entire
    //    spritesheet.
    //
    // 2) the x-coordinate we are drawing from in the
    //    spritesheet.
    //
    // 3) the y-coordinate we are drawing from in the
    //    spritesheet.
    //
    // 4) the width of the sprite we are drawing from
    //    our spritesheet.
    //
    // 5) the height of the sprite we are drawing from
    //    our spritesheet.
    //
    // 6) the x-coordinate we are drawing to in our
    //    canvas.
    //
    // 7) the y-coordinate we are drawing to in our
    //    canvas.
    //
    // 8) the width we are drawing in our canvas. This
    //    is in case we want to scale the image we are
    //    drawing to the canvas. In our case, we don't.
    //
    // 9) the height we are drawing in our canvas. This
    //    is in case we want to scale the image we are
    //    drawing to the canvas. In our case, we don't.
    //
    // Wow, that's a lot of parameters. Luckily, most
    // of them are stored directly in the sprite object
    // we want to draw.
    //
    // YOUR CODE HERE

	//console.log("__drawSpriteInternal");

	if(spt == null || sheet == null) {
		//console.log("__drawSpriteInternal failed");
		return;
	}

	var half = {
		x: spt.cx,
		y: spt.cy
	};

    	//use_context.drawImage(sheet,spt.x,spt.y,spt.w,spt.h,posX + half.x,posY + half.y,spt.w,spt.h);

	//var pixisprite = get_pooled_pixi_sprite(sprite);
   	//pixisprite.visible = true;
	//pixisprite.x = posX;
	//pixisprite.y = posY;
	//stage.addChild(pixisprite);

	
}



// Only needs to be called on scrolling or changes to the tile set
function __drawTileInternal(spt, sheet, posX, posY) {
}

function draw_string(str, posX, posY, col,use_context) {

	if(g_using_pixi == true) {
	}

	var inline_image = false;
	var inline_image_name = "";

	var x = posX;

	if(use_context == null) {
		use_context = Types.Layer.MENU;
	}
	for(var i = 0; i < str.length; i++) {
		ch = str[i];

		//if(inline_image) {

		//}

		if(ch == '$') {
			drawSprite("dollar.png",x, posY, use_context);
		} else if (ch == "'") {
			drawSprite("apos.png",x, posY, use_context);
		} else if (ch == ":") {
			drawSprite("colon.png",x, posY,use_context);
		} else if (ch == ',') {
			drawSprite("comma.png",x, posY, use_context);
		} else if (ch == '.') {
			drawSprite("fullstop.png",x, posY, use_context);
		} else if (ch == '-') {
			drawSprite("hyphen.png",x, posY, use_context);
		} else if (ch == '(') {
			drawSprite("left_bra.png",x, posY,use_context);
		} else if (ch == ')') {
			drawSprite("right_bra.png",x, posY, use_context);
		} else if (ch == '#') {
			if(!inline_image) {inline_image = true;}
			else {
				inline_image = false;
				//drawSprite(inline_image_name,,);
				return;
			}
		}
		drawSprite(ch + ".png", x, posY,use_context);

		//if(ch == 'I' || ch == ' ') x = x + 20;
		//else if(ch == 'R' || ch == 'B' || ch == 'T') x = x + 10;
		//else if(ch == 'G') x = x + 13;
		
		//else 

		x = x + 20;
	}
}


// xx, yy are width, height - NOT absolute, they're relative
function draw_green_rect_alpha(r,g,b,a,x,y,xx,yy) {
	context.fillStyle = "rgba(0, 255, 0, 0.25)";
	//context.fillStyle = "yellow";
	context.fillRect(x,y,xx,yy); 
}



function draw_red_rect_alpha(r,g,b,a,x,y,xx,yy) {
	context.fillStyle = "rgba(255, 0, 0, 0.25)";
	//context.fillStyle = "yellow";
	context.fillRect(x,y,xx,yy); 
}

function draw_black_rect_alpha(r,g,b,a,x,y,xx,yy) {
	context.fillStyle = "rgba(0, 0, 0, 0.25)";
	//context.fillStyle = "yellow";
	context.fillRect(x,y,xx,yy); 
}

function draw_white_rect_alpha(r,g,b,a,x,y,xx,yy) {
	context.fillStyle = "rgba(255, 255, 255, 0.5)";
	//context.fillStyle = "yellow";
	context.fillRect(x,y,xx,yy); 
}

function drawSpriteAlpha(spritename, posX, posY,alpha,use_context,z) {
	
	if(g_PIXI == true) {
		if(use_context == null) {
		    use_context = Types.Layer.GAME;
		}
		__drawSpriteAlphaInternalPIXI(spritename, posX, posY, alpha,use_context,z);
		return;
	}

	if(use_context == null) {
		use_context = context;
	}
	use_context.save();
    	use_context.globalAlpha = alpha;
    	drawSprite(spritename, posX, posY,use_context);
    	use_context.restore();
}

function drawSpriteResized(spritename, posX, posY,scale,use_context,z) {
	if(g_PIXI == true) {
		if(use_context == null) {
		    use_context = Types.Layer.GAME;
		}
		__drawSpriteResizedInternalPIXI(spritename, posX, posY, scale,use_context,z);
	}
}

function drawSpriteResizedAlpha(spritename, posX, posY,scale,alpha,use_context,z) {
	if(g_PIXI == true) {
		if(use_context == null) {
		    use_context = Types.Layer.GAME;
		}
		__drawSpriteResizedAlphaInternalPIXI(spritename, posX, posY, scale,alpha,use_context,z);
	}
}



function drawLine(x,y,xx,yy) {
	context.beginPath();
	context.moveTo(x,y);
	context.lineTo(xx,yy);
	context.stroke();
}

SpritePoolManager = Class.extend({
	init: function() {
	},

	
});

SpriteClass = Class.extend({
	pos : {x:0,y:0},
	pixisprite: null,
	in_use: null,		// object pooling
	//name: null,
	zindex: null,
	vis: null,

	dont_pool: null,
	tile_pixisprites: {},	// multiple pixisprites for this tile, only one is visible
	

	init: function() {
		this.in_use = null;
		this.zindex = 0;
		this.dont_pool = false;
		this.vis = true;
	},

	set_alpha: function(alpha) {
		this.pixisprite.alpha = alpha;
	},

	set_scale: function(scale) {
		this.pixisprite.scale.set(scale,scale);
	},

	setup_sprite: function(name,layer) {
		//this.name = name;
		this.pixisprite = new PIXI.Sprite(g_textures[name]);
		this.pixisprite.anchor.x = 0.5;
		this.pixisprite.anchor.y = 0.5;
		this.pixisprite.scale.set(1,1);
		this.pixisprite.alpha = 1;
		this.pixisprite.visible = true;
		if(layer == Types.Layer.GAME) game_container.addChild(this.pixisprite);
		else if(layer == Types.Layer.MENU) menu_container.addChild(this.pixisprite);
		else if(layer == Types.Layer.TILE) { 
			tile_container.addChild(this.pixisprite);
			this.dont_pool = true;
			this.set_scale(1.02);
			
		} else if(layer == Types.Layer.BACKGROUND) { 
			background_container.addChild(this.pixisprite);
			this.dont_pool = true;
		}
		
	},

	add_tile_sprite: function(name,layer) {

	},

	pool:function() {
		if(this.dont_pool == true) return;
		this.pixisprite.visible = false;
		this.pixisprite.tint = 0xFFFFFF;
		this.in_use = false;
	},

	unpool:function(x,y) {
		

		this.pixisprite.visible = true;
		this.in_use = true;
		this.pos.x = x;
		this.pos.y = y;
		this.pixisprite.position.x = x;
		this.pixisprite.position.y = y;
		this.pixisprite.alpha = 1;
		this.pixisprite.scale.set(1,1);

		var parent = this.pixisprite.parent;
		if(parent == null) return;
		var index = parent.getChildIndex(this.pixisprite);
		if(index == null || index > parent.children.length - 2) return;//<= 1) return;//parent.children.length - 2) return;
		parent.setChildIndex(this.pixisprite,parent.children.length - 1);//0);//index - 1);
	},

	update_pos: function(x,y) {
		
		this.pos.x = x;
		this.pos.y = y;
		this.pixisprite.position.x = x;
		this.pixisprite.position.y = y;
		
	},

	make_vis: function() {
		this.vis = true;
		if(this.dont_pool == true) {
			this.pixisprite.alpha = 1;
			this.pixisprite.position.x = this.pos.x;
			//return;
		}
		this.pixisprite.visible = true;
	},

	hide: function() {
		this.vis = false;
		if(this.dont_pool == true) {
			//this.pixisprite.alpha = 0;
			this.pixisprite.position.x = - 100;
			//return;
		}
		this.pixisprite.visible = false;
	},

	set_tint : function (tint) {
		this.pixisprite.tint = tint;
	},

	set_texture: function(name) {
		
		//this.pixisprite.setTexture(g_textures[name]);
		if(this.dont_pool == true) {
			//this.pixisprite.setTexture(g_textures[name]);
			this.pixisprite.texture =  g_textures[name];//PIXI.Texture.fromFrame(name);
			//this.setup_sprite(name,Types.Layer.TILE);
			//this.pixisprite.texture = PIXI.Texture.fromFrame(g_textures[name]);
			return;
		}
		this.pixisprite.texture = g_textures[name];
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

	kill: function() {
		 // pool?
		//this.in_use = false;
		//this.pixisprite.visible = false;
		this.pixisprite.destroy();
	}
});



function depthCompare(a,b) {
  if (a.position.y < b.position.y)
     return -1;
  if (a.position.y > b.position.y)
    return 1;
  return 0;
}

function get_animation_object(image_list) {
	var mob_ = new AnimationEntityClass();
	mob_.setup_anim(image_list);
	return mob_;
}

CharacterAnimClass = Class.extend({

	anims: [],	// walking left, walking right, up, down

});



