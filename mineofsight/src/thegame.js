
var background_group;
var tile_group;
var game_group;
var menu_group;
var game_menu_group;
var game_screen_group;
var options_menu_group;
var whole_app_group;

var background_container;
var tile_container;
var game_container;
var menu_container;
var game_menu_container;
var options_menu_container;

var play_screen_group;
var play_screen_container;

var play_group;
var play_container;

var input_down = false;
var mouse = {x: 0, y: 0};
var g_keypressed = -1;


var theGame = function(game) {


	// https://phaser.io/examples/v2/misc/pause-menu
	pop_menu_up = false;

	state_stack = [];

	map = null;

	
	// https://hacks.mozilla.org/2016/06/webfont-preloading-for-html5-games/

	//  The Google WebFont Loader will look for this object, so create it before loading the script.
	WebFontConfig = {

    		//  'active' means all requested fonts have finished loading
    		//  We set a 1 second delay before calling 'createText'.
    		//  For some reason if we don't the browser cannot render the text the first time it's created.
    		active: function() { game.time.events.add(Phaser.Timer.SECOND, createText, this); },

    		//  The Google Fonts we want to load (specify as many as you like in the array)
    		google: {
      			families: ['Montserrat']
    		}

	};

	
}
 


theGame.prototype = {

	// https://phaser.io/examples/v2/tilemaps/blank-tilemap


	preload: function(){

		 //  Load the Google WebFont Loader script
    		game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

		

		game.load.audio('curve', 'assets/curve.wav');
		game.load.audio('thud', 'assets/thud.wav');
		game.load.audio('jump', 'assets/Jump.wav');
		game.load.audio('blip', 'assets/Blip_Select2.wav');
		game.load.audio('crunch', 'assets/thud.wav');

		// 8 mg - stream or preload???????
		//game.load.audio('music', 'assets/8bit Dungeon Level.mp3');


		

	},

	

  	create: function(){

	
		// prevent right mouse click pop up
		game.canvas.oncontextmenu = function (e) { e.preventDefault(); }

		//game.input.mousePointer.rightButton.onDown.add(this.onRightDown, this);

		game.stage.backgroundColor = "0x1F1129";	// 1F1129

		game.curveSound = game.add.audio('curve',0.15);		// this.curveSound.play();
		game.thudSound = game.add.audio('thud',0.15);
		game.jumpSound = game.add.audio('jump',0.15);
		game.blipSound = game.add.audio('blip',0.15);
		game.crunchSound = game.add.audio('blip',0.15);

		// https://phaser.io/examples/v2/audio/play-music
		//music = game.add.audio('music');

    
		//music.play();
		//music.volume = 0.08;	// music.mute = false;

		background_group = game.add.group();
		tile_group = game.add.group();
		game_group = game.add.group();
		menu_group = game.add.group();
		
		

		play_screen_group =  game.add.group();

		play_group =  game.add.group();

		
		
		play_screen_group.add(tile_group);
		play_screen_group.add(game_group);
		
		play_group.add(background_group);
		play_group.add(play_screen_group);
		play_group.add(menu_group);

		game_screen_group = game.add.group(); // used for menu pop up (pop right)
		game_screen_group.add(play_group);

		game_menu_group = game.add.group();
		

		options_menu_group = game.add.group();
		//options_menu_group.bringToTop();
		//game.bringToTop(options_menu_group);

		background_container = background_group;
		tile_container =tile_group;
		game_container =game_group;
		menu_container =menu_group;
		game_group_container =game_menu_group;
		options_menu_container =options_menu_group;

		whole_app_group = game.add.group();
		//whole_app_group.add(play_group);
		//whole_app_group.add(game_menu_group);
		///whole_app_group.add(options_menu_group);

		play_screen_container = play_screen_group;

		play_container = play_group;

		gBlipFrogMenu.setup();
		
		// trigger resize http://stackoverflow.com/questions/1818474/how-to-trigger-the-window-resize-event-in-javascript
		
		do_resize();
		
		game.input.onDown.add(this.on_down);
		game.input.onHold.add(this.on_down);

		//game.input.activePointer.isDown
		
		game.input.onUp.add(this.on_up);
		//game.input.activePointer.add(this.on_up);
	
		game.input.keyboard.onDownCallback = this.on_key;


		//var gameTitle = this.game.add.sprite(160,160,'atlas_blocks', 'block0.png');
		//game_group.add(gameTitle);

		for(var x = 0; x < 10; x++) {
			for(var y = 0; y < 10; y++) {
				//var redflag = game.add.sprite(60*x, 60*y, 'atlas_blocks', 'redflag.png');
				//game_group.add(redflag);
			}
		}

		
	},

	// game.input.x		game.input.y
	// or if you want the mouse specifically game.input.mousePointer.x

	// http://www.gamefromscratch.com/post/2014/08/11/Adventures-in-Phaser-with-TypeScript-Handling-MouseTouch-Input.aspx

	on_key: function(event) {


		g_key_pressed = event.keyCode || event.which;

		gBlipFrogMenu.handle_events(0,0, Types.Events.KEY_DOWN);
	},

	on_up: function() {

		if (input_down == true) { // && !this.game.input.isDown ) {
			input_down = false;
			if (this.right_down == true) gBlipFrogMenu.handle_events((game.input.x - x_shift_screen)/ratio, game.input.y/ratio, Types.Events.MOUSE_CLICK_RIGHT);
			else if (this.left_down == true) {gBlipFrogMenu.handle_events((game.input.x- x_shift_screen)/ratio ,game.input.y/ratio,Types.Events.MOUSE_UP);
				
			} else gBlipFrogMenu.handle_events((game.input.x- x_shift_screen)/ratio ,game.input.y/ratio,Types.Events.MOUSE_UP);

			
			
		}

		this.right_down = false;
			
		this.left_down = false;
	},

	right_down: false,
	left_down: false,

	on_down: function() {



		if (game.input.mousePointer.rightButton.isDown ) {

			// || game.input.activePointer.rightButton.isDown
			
			
			
			if (gBlipFrogMenu.menu_up == true) {
				//gBlipFrogMenu.handle_menu_event(game.input.x,game.input.y,Types.Events.MOUSE_CLICK_RIGHT);
				mousedown = false;
			} else if (input_down == false) {
				
				//gBlipFrogMenu.handle_events((game.input.x - x_shift_screen)/ratio, 									//						game.input.y/ratio, Types.Events.MOUSE_CLICK_RIGHT);

			}

			this.right_down = true;

			input_down = true;

		} else if (game.input.isDown || 
			   game.input.mousePointer.leftButton.isDown ||
		    	   //game.input.activePointer.leftButton.isDown ||
			   game.input.pointer1.isDown) {

			this.left_down = true;

			input_down = true;

			
			if (gBlipFrogMenu.menu_up == true) {
				gBlipFrogMenu.handle_menu_event(game.input.x*menu_ratio,game.input.y*menu_ratio,Types.Events.MOUSE_DOWN);
				mousedown = false;
			} else {
				gBlipFrogMenu.handle_events((game.input.x- x_shift_screen)/ratio ,game.input.y/ratio, Types.Events.MOUSE_DOWN);

			}
		} 
	},

	

	update: function() {




		mouse.x = game.input.x/menu_ratio;
		mouse.y = game.input.y/menu_ratio;
			
		// game.input.mousePointer.rightButton
		// if (this.game.input.activePointer.isDown) {

		if (input_down == true){// && !this.game.input.isDown ) {
			//input_down = false;
			gBlipFrogMenu.handle_events((game.input.x- x_shift_screen)/ratio ,game.input.y/ratio,Types.Events.MOUSE_DOWN);
			
		}

		if (game.input.pointer1.isUp && this.left_down == true) {
			//left_down == false;
			//this.on_up();
		}

		if (game.input.pointer1.isDown) {
			
			this.on_down();
		} else if (this.left_down == true) {
			this.on_up();
		}

		//if (game.input.pointer1.isDown == true) //alert('game.input.isDown');
		//if (game.input.activePointer.isDown) alert('game.input.isDown');
		
		gBlipFrogMenu.update();
	},

	render: function() {
		gBlipFrogMenu.draw();
	},
	
	
	
}

pBar.value += 10;

// preload.js

var preload = function(game){}
 
preload.prototype = {
	preload: function(){ 
          //var loadingBar = this.add.sprite(160,240,"loading");
          //loadingBar.anchor.setTo(0.5,0.5);
          //this.load.setPreloadSprite(loadingBar);

		if (game.stage != null) game.stage.backgroundColor = "0x1F1129";

		//  Note that the JSON file should be saved with UTF-8 encoding or some browsers (such as Firefox) won't load it.
		this.game.load.atlas('atlas_blocks', 'assets/blocks.png', 'assets/blocks.json', Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);

		
	},

  	create: function(){

		if (game.stage != null) game.stage.backgroundColor = "0x1F1129";

		

		//whiteblock = this.game.add.sprite(x,y, , 'atlas_blocks', 'block0.png')

		this.game.state.start("TheGame");
	}
}


// boot.js

var boot = function(game){
	console.log("%cStarting my awesome game", "color:white; background:red");
};
  
var game_group;

boot.prototype = {
	preload: function(){
          //this.game.load.image("loading","assets/loading.png"); 

		game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
	},
  	create: function(){
		

		
		
		//this.scale.pageAlignHorizontally = true;
		//this.scale.setScreenSize( true ); // not a fn
		this.scale.updateLayout();
		
		this.game.state.start("Preload");
	},

	update: function() {

	},

}