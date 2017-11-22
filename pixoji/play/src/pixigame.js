
// Dict of PIXI.js textures
var g_textures = {};

loadpixiimages = function() {

	pBar.value += 30; 

	// Load spritesheet
	PIXI.loader
    	  	  .add('mysheet','assets/blocks.json')
	  	  .add('mysheet_png','assets/blocks.png')
	   	  // listen for progress - called once per loaded file
    	  	  .on('progress', onProgressCallback)
    	  	  .load(onAssetsLoaded);
};	

function onProgressCallback() {
	pBar.value += 10; 
}
	

onAssetsLoaded = function (loader,resources) {

	//PIXI.BaseTexture.scaleMode.DEFAULT = PIXI.scaleModes.NEAREST;
	// PIXI.BaseTexture.SCALE_MODE.LINEAR;

	 // Fill out sprite data array from the JSON
	 
	  gCachedAssets['blocks.json'] = resources.mysheet.data;
	  parseAtlasDefinition(gCachedAssets['blocks.json']);

	// loop through sprites data and make many PIXI textures
	  for(var i = 0; i < sprites.length; i++) {
		var id = sprites[i].id;
		var x = sprites[i].x;
		var y = sprites[i].y;
		var w = sprites[i].w;
		var h = sprites[i].h;
		var recta = new PIXI.Rectangle(x,y,w,h); // x,y,width,height
		var new_texture = new PIXI.Texture(resources.mysheet_png.texture, recta);
		//new_texture.ScaleMode = PIXI.scaleModes.NEAREST;
		g_textures[id] = new_texture;
	  }

	// would remove pBar here
	remove_splash();

	document.body.style.backgroundColor =  "#ffffff";	// the dark colour around the edges, I just think it looks good



	console.log('start pixi');

	// start pixi
	setup_pixi();
};

var renderer;
var stage;

setup_pixi = function () {
	// create a renderer instance.
		renderer = PIXI.autoDetectRenderer(screen_width, screen_height);
 
		// add the renderer view element to the DOM
		document.body.appendChild(renderer.view);

		// PIXI interaction manager
		// https://gist.github.com/drkibitz/6143035
		// create a manager instance, passing stage and renderer.view
		//interaction_man = new PIXI.interaction.InteractionManager(stage, {});

		console.log('renderer.plugins.interaction.mouse ' + renderer.plugins.interaction.mouse);

		//stage.setInteractive(true);


		stage = new PIXI.Stage(0xE2E2E2);	// 293D56
		stage.addChild(play_container.layer);

		stage.addChild(game_menu_group.layer);

		stage.addChild(options_menu_group.layer);


		// https://www.goose.ninja/tutorials/pixi-js/click-on-things/

		gBlipFrogMenu.setup();

		//gBlipFrogMenu.game_engine.push_state(boot_state);

		window.onresize(); // Call onload to set the width & height initially

		//g_sound_on = false;

		gBlipFrogMenu.on_screen_resize();

		setup_input();


		
		// background colour
		//var graphics = new PIXI.Graphics();
		//graphics.beginFill(0x131C28);
		//graphics.drawRect(0, 0,9999, 9999);
		//background_group.add(graphics);

		renderer.backgroundColor = 0x4B4965;//0x293D56;

		pixi_init_tilegrid();

		animate();


};

last_update = 0;

// input
// this animate loop is agnostic to how input is received
// it just checks (1) mousemove (2) mousedown (3) mouseclick (4) mouseclickright (5) mouse.x / y

animate = function (timestamp) {
	if(timestamp > last_update + 16) {
		gBlipFrogMenu.update();
		if(timestamp > last_update + 32) gBlipFrogMenu.update();

		last_update = timestamp;

	    	gBlipFrogMenu.draw();

		

		// render the stage   
	   	renderer.render(stage);
	}

	if(mousemove) {
		mousemove = false;
		gBlipFrogMenu.handle_events((mouse_abs['x']- x_shift_screen)/ratio ,
					    (mouse_abs['y'] - y_shift_screen)/ratio,Types.Events.MOUSE_MOVE);
	}

	if(mousedown) {
			
		gBlipFrogMenu.handle_events((mouse_abs['x']- x_shift_screen)/ratio , 
					   (mouse_abs['y'] - y_shift_screen)/ratio,Types.Events.MOUSE_DOWN);
			
	}

	if(mouseclick) {
		mouseclick = false;
			
		gBlipFrogMenu.handle_events((mouse_abs['x']- x_shift_screen)/ratio ,
					    (mouse_abs['y'] - y_shift_screen)/ratio,Types.Events.MOUSE_UP);
			//mouse_down_x = -1;
	}

	if(mouseclickright) {
		
		mouseclickright = false;
		gBlipFrogMenu.handle_events((mouse_abs['x']- x_shift_screen)/ratio ,
					    (mouse_abs['y'] - y_shift_screen)/ratio, Types.Events.MOUSE_CLICK_RIGHT);
	}

	if(rightmousedown) {
		
		//rightmousedown = false;
		gBlipFrogMenu.handle_events((mouse_abs['x']- x_shift_screen)/ratio ,
					    (mouse_abs['y'] - y_shift_screen)/ratio, Types.Events.RIGHT_MOUSE_DOWN);
	}

	if(leftmousedown) {
		
		//leftmousedown = false;
		gBlipFrogMenu.handle_events((mouse_abs['x']- x_shift_screen)/ratio ,
					    (mouse_abs['y'] - y_shift_screen)/ratio, Types.Events.LEFT_MOUSE_DOWN);
	}

	if(mousedown && using_cocoon_js == true) {
			
		gBlipFrogMenu.handle_events((mouse_abs['x']- x_shift_screen)/ratio , 
					   (mouse_abs['y'] - y_shift_screen)/ratio,Types.Events.LEFT_MOUSE_DOWN);
			
	}

	requestAnimationFrame( animate );
};

// right click doesnt work on chrome dev mode!

var mouseclick = false;
var mouseclickright = false;
var mousedown = false;
var mousemove = false;
var leftmousedown = false;
var rightmousedown = false;
var mouse = {
	x: 0,
	y: 0
};

var mouse_abs = {
	x: 0,
	y: 0
};

// when a pixi sprite reports being clicked on, it calls this and gives it's position
// http://www.goodboydigital.com/pixijs/examples/6/
// http://pixijs.github.io/examples/index.html?s=demos&f=dragging.js&title=Dragging#/demos/dragging.js
on_sprite_click = function (x, y) {
	
};




onPIXIdown = function (event) {
	var pos = event.data.getLocalPosition(stage);

	if (event.data.originalEvent.which == 1 || event.data.originalEvent.button == 0) mousedown = true;

	if (event.data.originalEvent.which == 1 || event.data.originalEvent.button == 0) leftmousedown = true;
	if (event.data.originalEvent.which == 3 || event.data.originalEvent.button == 2) {
		rightmousedown = true;
	} else leftmousedown = true;

	
	
	if (mouseclickright != true) {
		update_mouse_pos(pos.x, pos.y);
		mousedown = true;
	}

	gBlipFrogMenu.handle_events((mouse_abs['x']- x_shift_screen)/ratio , 
					   (mouse_abs['y'] - y_shift_screen)/ratio,Types.Events.MOUSE_DOWN);
};
// on mousedown needs to happen in the same frame for opening web links (for crosspromotion)


onPIXIup = function (event) {
	//alert('event.data.originalEvent.which ' + event.data.originalEvent.which +
	//	'event.data.originalEvent.button ' + event.data.originalEvent.button);
	
	var pos = event.data.getLocalPosition(stage);
	

	if (event.data.originalEvent.which == 1 || event.data.originalEvent.button == 0) mouseclick = true;
	else if (event.data.originalEvent.which == 3 || event.data.originalEvent.button == 2) mouseclickright = true;

	//if (mouseclickright == true) alert('mouseclickright');
	//if (mouseclick == true) alert('mouseclick');

	if (mouseclick == true) update_mouse_pos(pos.x, pos.y);

	mousedown = false;
	mousedownright = false;

	leftmousedown = false;
	rightmousedown = false;
	
};

onPIXImove = function (event) {
	//if (mouseclickright == true) return; 
	var pos = event.data.getLocalPosition(stage);
	update_mouse_pos(pos.x, pos.y);
	mousemove = true;
};



onTouchStart = function  (event) {
	var pos = event.data.getLocalPosition(stage);
};

setup_input_cocoon_canvas_plus = function () {
	renderer.view.addEventListener('mousemove',onMouseMove, false);
	renderer.view.addEventListener('mousedown', onMouseClick, false);
	renderer.view.addEventListener('mouseup', onMouseUp, false);	
	renderer.view.addEventListener('touchstart', onTouchDown, false);
	renderer.view.addEventListener('touchmove', onTouchMove, false);
	renderer.view.addEventListener('touchend', onTouchUp, false);	

};

setup_input = function () {
	// Listener, NOT Handler

		//addListener(renderer.view,'mousedown',onMouseClick);	// onclick?
		//addListener(renderer.view,'mouseup',onMouseUp);
		//addListener(renderer.view,'pointerdown',onMouseClick);
		//addListener(renderer.view,'pointerup',onMouseUp);

		if (using_cocoon_js == true) setup_input_cocoon_canvas_plus();
		//else setup_input_cocoon_canvas_plus();
		
		// https://pixijs.github.io/examples/#/demos/dragging.js
		stage.hitArea = new PIXI.Rectangle(0, 0, 4000, 4000);
		stage.interactive = true;
		//stage.on('mousedown',function(){alert('down');},false);
		stage.on('pointerdown',onPIXIdown,false)
		     .on('pointerup',onPIXIup,false)
		     .on('pointermove',onPIXImove,false);
		     //.on('rightclick',onPIXIrightup,false);

		// disable right-menu
		if (using_cocoon_js == false) {
			renderer.view.addEventListener('contextmenu', (e) => {
    				e.preventDefault();
				//mouseclickright = true;
  			});
		}

		return;

		// http://www.html5gamedevs.com/topic/23828-right-mouse-clicks/
		// http://www.html5gamedevs.com/topic/25254-how-do-do-right-click-on-a-container/

		//stage.mousedown = function (moveData) {	alert("mousedown");};
		//stage.mousemove = function (moveData) {	alert("mousemove");};
		//stage.mouseup = function (moveDate) {	alert("mouseup");};

		//return;

		// http://www.quirksmode.org/js/introevents.html	
		//renderer.view.onclick = onMouseClick;	
		 renderer.view.onmousedown = onMouseClick;
		 renderer.view.onmouseup = onMouseUp;

		 renderer.view.onpointerdown = onMouseClick;
		 renderer.view.onpointerup = onMouseUp;

		renderer.view.onmousemove = onMouseMove;

		//renderer.view.onpointermove = onMouseMove;	// this doesnt work in IE

		//renderer.view.onwheel = onMouseWheel;	// testing!

		// So in IE, when the mouse is down, the mouse x and y stays where it was when it was down
		// only in this game though
		// in AcanttouchB its fine

		// 'pointer' events are needed for IE
		renderer.view.addEventListener('pointermove',onMouseMove, false);	// this is actually needed in IE
		renderer.view.addEventListener('mousemove',onMouseMove, false);
		//renderer.view.addEventListener('mousedown', onMouseClick, false);
		//renderer.view.addEventListener('mouseup', onMouseUp, false);	
		renderer.view.addEventListener('touchstart', onTouchDown, false);
		renderer.view.addEventListener('touchmove', onTouchMove, false);
		renderer.view.addEventListener('touchend', onTouchUp, false);	

		// this makes the keyboard work on gamejolt:
		window.focus();

		//window.addEventListener('keydown',onKeyDown, false);
		//window.addEventListener('keyup',onKeyUp, false);
};

get_relative_MousePos = function(canvas, evt) {
		
		var mouseX, mouseY;

		//console.log('get_relative_MousePos');
		//get_pixi_mouse();

		if (browser == "f" )
		{
			mouseX = evt.clientX - renderer.view.offsetLeft + document.documentElement.scrollLeft;
			mouseY = evt.clientY - renderer.view.offsetTop + document.documentElement.scrollTop;
		} 
		else if (browser == "m")
		{
			   mouseX = evt.clientX + document.body.scrollLeft;
    			   mouseY = evt.clientY + document.body.scrollTop;
		}
		else //"s" or "c"
		{
			mouseX = evt.clientX - renderer.view.offsetLeft + document.body.scrollLeft;
			mouseY = evt.clientY - renderer.view.offsetTop + document.body.scrollTop;
		}

		//console.log('mouseX ' + mouseX.toString());
	
		return {
          		x: mouseX,
          		y: mouseY
        	};

        	var rect = canvas.getBoundingClientRect();

		if (rect == null) {
			return {
          			x: evt.clientX,
          			y: evt.clientY
        		};
		}

        	return {
          		x: evt.clientX - rect.left,
          		y: evt.clientY - rect.top
        	};
	};

var browser= "c";

update_mouse_pos = function (x, y) {

	//var rel_pos = get_relative_MousePos(renderer.view,event);

	mouse_abs['x'] = x;	
	mouse_abs['y'] = y;;

	mouse['x'] = x/menu_ratio;	
	mouse['y'] = y/menu_ratio;

};


onMouseClick = function (event) {
	if(event.which == 3) {	// RMB
		mouseclickright = true;
	}
	mousedown = true;

	var rel_pos = get_relative_MousePos(renderer.view,event);

	update_mouse_pos(rel_pos.x, rel_pos.y);

	//console.log('mouse.x ' + mouse.x + ' mouse.y ' + mouse.y );

	if (gBlipFrogMenu.menu_up == true) {
		gBlipFrogMenu.handle_menu_event(mouse['x'],mouse['y'],Types.Events.MOUSE_DOWN);
		//mousedown = false;
	}
};

onTouchDown = function (event) {
	if(event.which == 3) {	// RMB
			mouseclickright = true;
	}
	mousedown = true;


	var pos = event.changedTouches[0];//get_relative_MousePos(canvas,event);

	update_mouse_pos(pos.clientX, pos.clientY);

    	//mouse['x'] = parseInt(pos.clientX)//(window.devicePixelRatio || 1) ;;
	//mouse['y'] = parseInt(pos.clientY)//(window.devicePixelRatio || 1) ;;
	mousemove = true;

	if (gBlipFrogMenu.menu_up == true) {
		gBlipFrogMenu.handle_menu_event(mouse['x'],mouse['y'],Types.Events.MOUSE_DOWN);
		//mousedown = false;
	}
};

onMouseMove = function (event) {	
	
		// Grab the clientX and clientY properties of the event object parameter.
		// Make sure you use the clientX and clientY values, as they are canvas translated.
		// After that, return the posx value.
	
		//console.log('onMouseMove');	// only in IE !? not in chrome
		var rel_pos = get_relative_MousePos(renderer.view, event);

		
		update_mouse_pos(rel_pos.x, rel_pos.y);

    		//mouse['x'] = rel_pos.x;	// this.   doesnt work!
		//mouse['y'] = rel_pos.y;;
		mousemove = true;
};

onTouchMove = function (event) {
	
		// Grab the clientX and clientY properties of the event object parameter.
		// Make sure you use the clientX and clientY values, as they are canvas translated.
		// After that, return the posx value.
	
		var pos = event.changedTouches[0];//get_relative_MousePos(canvas,event);

		
		update_mouse_pos(parseInt(pos.clientX), parseInt(pos.clientY));

    		//mouse['x'] = (parseInt(pos.clientX))//(window.devicePixelRatio || 1);//*devicePixelRatio;;
		//mouse['y'] = (parseInt(pos.clientY))//(window.devicePixelRatio || 1);//*devicePixelRatio;
		mousemove = true;
};
	

onMouseRightUp = function() {
	mousedown = false;
	rightmouseclick = true;
	
};

	onMouseUp = function(event) {
		mouseclick = true;
		mousedown = false;

		var rel_pos = get_relative_MousePos(renderer.view,event);
		update_mouse_pos(rel_pos.x, rel_pos.y);

    		//mouse['x'] = rel_pos.x;	// this.   doesnt work!
		//mouse['y'] = rel_pos.y;;

		
	};

	onTouchUp= function(event) {
		mouseclick = true;
		mousedown = false;

		var pos = event.changedTouches[0];//get_relative_MousePos(canvas,event);
		update_mouse_pos(parseInt(pos.clientX), parseInt(pos.clientY));
    		//mouse['x'] = parseInt(pos.clientX)///(window.devicePixelRatio || 1);;
		//mouse['y'] = parseInt(pos.clientY)///(window.devicePixelRatio || 1);;
		mousemove = true;
	};



parseAtlasDefinition = function (atlasJSON) {
	// For THE spritesheet
	var parsed = atlasJSON; //JSON.parse(atlasJSON);	// Already parsed because I'm hardcoding the json objects for now
	var frames = parsed.frames;

	

	// loop through each frame
	for (var i = 0; i < parsed.frames.length; i++) {
		var x = frames[i].frame.x;
                var y = frames[i].frame.y;

		// i dont think any of mine are rotated but this wont hurt:
		if (frames[i].rotated) {
			var w = frames[i].frame.h;	
                	var h = frames[i].frame.w;
		} else {
                	var w = frames[i].frame.w;	
                	var h = frames[i].frame.h;
		}

		var cx = -w*0.5;		//store as negative here
         	var cy = -h*0.5;
         	defSprite(frames[i].filename,x,y,w,h,cx,cy);
	}

	

};

// An array of the sprites in our atlas
sprites = new Array();
name_index = {};	//name -> index in sprite array

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

// https://github.com/kittykatattack/learningPixi#keyboard


pBar.value += 10;

