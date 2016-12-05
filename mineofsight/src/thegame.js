
var background_group;
var tile_group;
var game_group;
var menu_group;
var game_menu_group;
var options_menu_group;

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


var theGame = function(game) {


	// https://phaser.io/examples/v2/misc/pause-menu
	pop_menu_up = false;

	state_stack = [];

	map = null;
}
 


theGame.prototype = {

	// https://phaser.io/examples/v2/tilemaps/blank-tilemap


	preload: function(){

		 //  Load the Google WebFont Loader script
    		game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

	},

  	create: function(){

		background_group = game.add.group();
		tile_group = game.add.group();
		game_group = game.add.group();
		menu_group = game.add.group();
		game_menu_group = game.add.group();
		options_menu_group = game.add.group();

		play_screen_group =  game.add.group();

		play_group =  game.add.group();
		
		play_screen_group.add(tile_group);
		play_screen_group.add(game_group);
		
		play_group.add(background_group);
		play_group.add(play_screen_group);
		play_group.add(menu_group);

		background_container = background_group;
		tile_container =tile_group;
		game_container =game_group;
		menu_container =menu_group;
		game_group_container =game_menu_group;
		options_menu_container =options_menu_group;

		play_screen_container = play_screen_group;

		play_container = play_group;

		gBlipFrogMenu.setup();
		
		// trigger resize http://stackoverflow.com/questions/1818474/how-to-trigger-the-window-resize-event-in-javascript
		console.log('trigger do_rsize');
		do_resize();
		


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

	

	update: function() {


		mouse.x = game.input.x;
		mouse.y = game.input.y;
	
		if (this.game.input.activePointer.isDown) {
			input_down = true;
			console.log('this.game.input.activePointer.isDown');
			console.log('game.input.x ' + game.input.x);

			
			if (gBlipFrogMenu.menu_up == true) {
				gBlipFrogMenu.handle_menu_event(game.input.x,game.input.y,Types.Events.MOUSE_CLICK);
				mousedown = false;
			} else {
				gBlipFrogMenu.handle_events((game.input.x- x_shift_screen)/ratio ,game.input.y/ratio,Types.Events.MOUSE_CLICK);

			}
		} else if (input_down == true) {
			input_down = false;
			gBlipFrogMenu.handle_events((game.input.x- x_shift_screen)/ratio ,game.input.y/ratio,Types.Events.MOUSE_UP);
		}
		
		gBlipFrogMenu.update();
	},

	render: function() {
		gBlipFrogMenu.draw();
	},
	
	
	
}