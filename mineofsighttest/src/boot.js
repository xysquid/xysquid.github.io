var boot = function(game){
	console.log("%cStarting my awesome game", "color:white; background:red");
};
  
var game_group;



boot.prototype = {
	preload: function(){
          //this.game.load.image("loading","assets/loading.png"); 

		game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
		//game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;

		//scale_man = new ScaleManager(game, 1, 1);
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