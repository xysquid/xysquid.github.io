


var gameTitle = function(game){}


 
gameTitle.prototype = {
  	create: function(){

		
		

		//var gameTitle = this.game.add.sprite(160,160,'atlas_blocks', 'block0.png');
		//gameTitle.anchor.setTo(0.5,0.5);

		for(var x = 0; x < 10; x++) {
			for(var y = 0; y < 10; y++) {
				//var redflag = game.add.sprite(60*x, 60*y, 'atlas_blocks', 'redflag.png');
				//game_group.add(redflag);
			}
		}

		

		//var playButton = this.game.add.button(160,320,"play",this.playTheGame,this);
		//playButton.anchor.setTo(0.5,0.5);

		
		
		//game_group.create(10, 10,'redflag');

		this.game.state.start("TheGame");
		
	},
	playTheGame: function(){
		//this.game.state.start("TheGame");
	}
}