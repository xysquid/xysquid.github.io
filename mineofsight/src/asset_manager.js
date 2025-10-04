// Now we will cache
// We first check the cache to see if the image has already been loaded
// If it has not been loaded yet, load it and add it to the cache
// {assetName: assetObject}
// If the image is already in the cache, then call
// the provided callbackFcn.

var gCachedAssets = {};	// A dictionary
var gIsAssetLoaded = {};

// Now we need to batch multiple loads, and only call
// our callbackFcn once all our images have been loaded.
//
// loadAssets now takes a list of names, rather than just
// a single name.

// Also - need to deal with different file types: images and javascript scripts
//	Images get put in an Image() object
//	Scripts get added to the DOM
//	Both are indexed in gCachedAssets 

function load_script_assets(script_list, callback_function) {

	number_of_script_assets_to_be_loaded = script_list.length;

	for (var i = 0; i < script_list.length ; i++) {
	
		load_single_script(script_list[i], callback_function);

	}

}

number_of_script_assets_loaded = 0;
number_of_script_assets_to_be_loaded = 0;

function load_single_script(assetName, callback_function) {

	var script_elem = document.createElement('script');

	script_elem.type = 'text/javascript';

	script_elem.name = assetName;

	script_elem.onload = function () {

			
			
		number_of_script_assets_loaded++;
		if(number_of_script_assets_loaded >= number_of_script_assets_to_be_loaded) {
			callback_function(script_elem); // why pass script_elem?
		}
                    	
        };

	
      	script_elem.src = assetName; // Does this trigger the loading like for images?

      	var list_of_elems = document.getElementsByTagName('head');

      	list_of_elems[0].appendChild(script_elem);
}



// LEVEL LOADER:
// http://stackoverflow.com/questions/15002093/loading-game-levels-in-javascript-w-o-back-end

var g_current_level_data = {};
var g_level_loaded = false;



load_level_from_file = function (name, callback) {

	g_level_loaded = false;

	try {
		var xmlhttp = new XMLHttpRequest();
	} catch (e) {
		
	}
	
	//xmlhttp.open("GET","levels/" + name + ".js", true);
	//xmlhttp.open("GET","levels/" + name , true);
	xmlhttp.open("GET", name , true);
	xmlhttp.onreadystatechange = function() {
		
		if (xmlhttp.readyState == 4) {
			
			if(xmlhttp.status == 200){
				g_current_level_data = JSON.parse(xmlhttp.responseText);
				g_level_loaded = true;
				g_current_level_data.filepath = name;
				callback();
			}
		} 

		
	}

	xmlhttp.send(null);
}


// for crosspromotion stuff
fetch_json = function (url, store) {
	var request = new XMLHttpRequest();
	request.open("GET", url , true);
	request.onreadystatechange = function() {
		if (request.readyState == 4) {
			crosspromote_json = JSON.parse(request.responseText);
		}
	}
	// request.setRequestHeader('Content-Type', 'text/plain');
	request.send(null);
}

fetch_image = function (url, store) {
	
	var request = new XMLHttpRequest();
	request.open("GET", url , true);
	request.responseType = 'blob';
	request.onreadystatechange = function() {
		if (request.readyState == 4) {
			//crosspromote_image 
			var blob = this.response;
			var urlCreator = window.URL || window.webkitURL; 

			var binaryData = [];
			binaryData.push(blob);
			//window.URL.createObjectURL(new Blob(binaryData, {type: "application/zip"}))

			//var BLOBurl = urlCreator.createObjectURL(blob); 
			var BLOBurl = urlCreator.createObjectURL(new Blob(binaryData, {type: "application/zip"}));
			var img = new Image();
			img.addEventListener("load", function(event){URL.revokeObjectURL(BLOBurl);});
			img.src = BLOBurl;
			crosspromote_image = new PIXI.Texture(new PIXI.BaseTexture(img));
			g_textures['crosspromote.png'] = crosspromote_image;
		}
	}
	request.send(null);

	return;

	var img = new Image();
	img.addEventListener("load", function(event){URL.revokeObjectURL(BLOBurl);});
	img.src = BLOBurl;
	var texture = new PIXI.Texture(new PIXI.BaseTexture(img));

	return;

	
}
