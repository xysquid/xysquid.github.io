SoundManager = Class.extend({

	clips: {},	// raw data?
	enabled: true,
	_context: null,
	_mainNode: null,	

	create: function() {

		try {
		
			gSM._context = new AudioContext();

		} catch (e) {

			alert('sound doesnt work');
		}

		
		gSM._mainNode = gSM._context.createGain(0);
		gSM._mainNode.connect(gSM._context.destination);

	},

	loadAsync: function (path, callbackFcn) {

		if(gSM.clips[path]) {
			callbackFcn(gSM.clips[path].s);
			return gSM.clips[path].s;
		}

		var clip = {
			s: new Sound(),
			b: null,
			l: false,
		};

		gSM.clips[path] = clip;
		clip.s.path = path;

		var request = new XMLHttpRequest();
		
		request.responseType = 'arraybuffer';

		request.onload = function () {
			gSM._context.decodeAudioData(request.response,

			function (buffer) {
				gSM.clips[path].b = buffer;
				gSM.clips[path].l = true;
				callbackFcn(gSM.clips[path].s);
			},

			function (data) {});

		};
		request.open('GET',path,true);
		request.send();

		return clip.s;
	},

	//----------------------------
	togglemute: function() {
		// Check if the gain value of the main node is 
		// 0. If so, set it to 1. Otherwise, set it to 0.
		if(gSM._mainNode.gain.value>0) {
			gSM._mainNode.gain.value = 0;
		}
		else {
			gSM._mainNode.gain.value = 1;
		}
	},

	//----------------------------
	stopAll: function()
	{
		// Disconnect the main node, then create a new 
		// Gain Node, attach it to the main node, and 
		// connect it to the audio context's destination. 
		gSM._mainNode.disconnect();
		gSM._mainNode = gSM._context.createGainNode(0);
		gSM._mainNode.connect(gSM._context.destination);
	},

	// Parameters:
	//	1) path: a string representing the path to the sound
	//           file.
	//  2) settings: a dictionary representing any game-specific
	//               settings we might have for playing this
	//               sound. In our case the only ones we'll be
	//               concerned with are:
	//               {
	//                   looping: a boolean indicating whether to
	//                            loop.
	//                   volume: a number between 0 and 1.
	//               }
	

	playSound: function (path,settings) {
		if (!gSM.enabled) return false;

		var sd = this.clips[path];
		if (sd === null) return false;
		if (sd.l === false) return false;

		var currentClip = gSM._context.createBufferSource();
		
		currentClip.buffer = sd.b;
        	//currentClip.gain.value = 0.2;
        	currentClip.loop = false;

		currentClip.connect(gSM._mainNode);
		currentClip.start(gSM._context.currentTime,0,10);

		return true;

	}

});


Sound = Class.extend({
	path: "",

	init: function() {

	},

	play: function(loop) {
		var settings = {
			looping: loop,
			volume: 1
		};
		gSM.playSound(this.path,settings);
		
	}
});

function playSoundInstance(soundpath) {
	// Task #1
	// Load a new Sound object using loadAsync. In the callback we
	// pass in to loadAsync, call the passed-in Sound object's play
	// method.
	//
	// YOUR CODE HERE
    gSM.loadAsync(soundpath, function(soundobj) {
        soundobj.play(false);
    });
}

var gSM = new SoundManager();
gSM.create();