var boot = function(game){
	console.log("%cStarting my awesome game", "color:white; background:red");
};
  
var game_group;

boot.prototype = {
	preload: function(){
          //this.game.load.image("loading","assets/loading.png"); 
	},
  	create: function(){
		game.scale.scaleMode = Phaser.ScaleManager.RESIZE;

		
		
		//this.scale.pageAlignHorizontally = true;
		//this.scale.setScreenSize( true ); // not a fn
		this.scale.updateLayout();
		
		this.game.state.start("Preload");
	},

	update: function() {

	},

}