var preload = function(game){}
 
preload.prototype = {
	preload: function(){ 
          var loadingBar = this.add.sprite(160,240,"loading");
          loadingBar.anchor.setTo(0.5,0.5);
          this.load.setPreloadSprite(loadingBar);

		//  Note that the JSON file should be saved with UTF-8 encoding or some browsers (such as Firefox) won't load it.
		this.game.load.atlas('atlas_blocks', 'assets/blocks.png', 'assets/blocks.json', Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);
	},
  	create: function(){

		//whiteblock = this.game.add.sprite(x,y, , 'atlas_blocks', 'block0.png')

		this.game.state.start("GameTitle");
	}
}