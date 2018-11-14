SoundManager = Class.extend({

	clips: {},	// raw data?
	enabled: true,
	_context: null,
	_mainNode: null,	

	_musicNode: null,

	working: false,

	create: function() {

		try {
			if('webkitAudioContext' in window) {
				// 'webkitAudioContext' is deprecated. Please use 'AudioContext' instead.
    				gSM._context = new AudioContext();// webkitAudioContext();
			} else {
				gSM._context = new AudioContext(); //|| new webkitAudioContext();
			}

		} catch (e) {
			
			console.log('sound doesnt work');

			return;
		}

		this.working = true;

		
		gSM._mainNode = gSM._context.createGain(0);
		gSM._mainNode.connect(gSM._context.destination);

		// can I do this?
		gSM._musicNode = gSM._context.createGain(0);
		gSM._musicNode.connect(gSM._mainNode);

	},

	music_stream_started: false,
	
	// This is limiting as I can only have 1 song
	// Will change it if I need multiple songs
	stream: function (trackName, volume) {

		if (this.music_stream_started == true) return;
		this.music_stream_started = true;

		var a = document.createElement('audio');
		a.loop = true;
		a.src = trackName;
		a.play();
		var audioSource = gSM._context.createMediaElementSource( a );
		audioSource.connect( gSM._musicNode);//gSM._context.destination );

		this.music_volume = volume;

		gSM._musicNode.gain.value = this.music_volume;//0.075;
		
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

		if (gSM.working == false) return;

		// Check if the gain value of the main node is 
		// 0. If so, set it to 1. Otherwise, set it to 0.
		if(gSM._mainNode.gain.value>0) {
			gSM._mainNode.gain.value = 0;
		}
		else {
			gSM._mainNode.gain.value = 1;
		}
	},

	music_on: true,
	music_volume: 0.01,

	toggle_music: function() {

		if (gSM.working == false) return;

		// Check if the gain value of the main node is 
		// 0. If so, set it to 1. Otherwise, set it to 0.

		gSM._musicNode.gain.cancelScheduledValues(gSM._context.currentTime);

		if(gSM._musicNode.gain.value>0) {
			gSM._musicNode.gain.value = 0;
			this.music_on = false;
		}
		else {
			gSM._musicNode.gain.value = this.music_volume;//0.075;
			this.music_on = true;
		}
	},

	//----------------------------
	stopAll: function()
	{

		if (gSM.working == false) return;

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
        	
        	currentClip.loop = settings.looping;

		var start_time = gSM._context.currentTime;

		var offset_ = 0;

		if (settings.looping == true) {
			offset_ = 0;//10;
			currentClip.loopStart = 0;//10;	// are these both in seconds?
			//currentClip.playbackRate = 0.5;

			//var AudioParam = AudioParam.linearRampToValueAtTime(settings.volume, 6);

			gSM._musicNode.gain.value = 0;//settings.volume;

			gSM._musicNode.gain.linearRampToValueAtTime(settings.volume, gSM._context.currentTime + 5 + 5*Math.random());

			currentClip.connect(gSM._musicNode);
			
		} else {
			// Create a gain node.
			var gainNode =  gSM._context.createGain();
		
			gainNode.gain.value = settings.volume;//0.2;
			currentClip.connect(gainNode);
			gainNode.connect(gSM._mainNode);
		}



		

		//currentClip.connect(gSM._mainNode);
		
		
		currentClip.start(start_time,offset_);

		if (this.music_on == false) gSM._musicNode.gain.value = 0;

		return true;

	}

});


Sound = Class.extend({
	path: "",

	init: function() {

	},

	play: function(loop,volume) {
		var settings = {
			looping: loop,
			volume: volume
		};
		gSM.playSound(this.path,settings);
		
	}
});


function playSoundInstanceLoop(soundpath,volume) {

   if (gSM.working == false) return;
	
 	gSM.stream(soundpath, volume);
	return;

	// Task #1
	// Load a new Sound object using loadAsync. In the callback we
	// pass in to loadAsync, call the passed-in Sound object's play
	// method.
	//
	// YOUR CODE HERE
    gSM.loadAsync(soundpath, function(soundobj) {
        soundobj.play(true,volume);
    });
}


function playSoundInstance(soundpath,volume) {

	if (g_sound_on == false) return;

	if (using_cocoon_js == true) return;

   if (gSM.working == false) return;

	// Task #1
	// Load a new Sound object using loadAsync. In the callback we
	// pass in to loadAsync, call the passed-in Sound object's play
	// method.
	//
	// YOUR CODE HERE
    gSM.loadAsync(soundpath, function(soundobj) {
        soundobj.play(false,volume);
    });
}



var gSM = new SoundManager();
gSM.create();


//playSoundInstanceLoop('MisterLine.ogg', 0.035);	// This should not block anything