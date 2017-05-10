/*Copyright 2012 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
#limitations under the License.*/

// Changes were made to this file -  2016

// Our image loading code USED to be:
//
// var img = new Image();
// img.onLoad = function(){...}
// img.src = “asdf.png”

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

function load_script_assets(script_list, callbackFcn) {

	var loaded = 0;
	for (var i = 0; i < script_list.length ; i++) {
		// Should we check the cache? I'm only calling this function once, so I don't see the point.

		var assetName = script_list[i];

		// our asset is a Javascript file, and we
		// need to:
		//
		// 1) Use document.createElement to create
		//    a new script tag.

        	var script_elem = document.createElement('script');

		// 2) Set the type attribute on this element
		//    to 'text/javascript'.

        	script_elem.type = 'text/javascript';

		// 3) We'll need to set an event listener to
		//    call onLoadedCallback just like we do
		//    for images. Luckily, the same '.onload'
                // we use for images will also work here.

		script_elem.name = assetName;

                script_elem.onload = function () {

			
			
			loaded++;
			//console.log(this.name + " loaded");
			if(loaded >=script_list.length) {
				callbackFcn(script_elem); // why pass script_elem?
			}
                    	//onLoadedCallback(script_elem, loadBatch);	//what?
                };

		// 4) Set the src attribute on this element
			//    to the filename.

                script_elem.src = script_list[i]; // Does this trigger the loading like for images?

		// 5) Use document.getElementsByTagName to
			//    grab a LIST of the elements in the
			//    document named 'head'.

                var list_of_elems = document.getElementsByTagName('head');

			// 6) Use the appendChild method of the first
			//    element of that list to append the
			//    script element you created.

                list_of_elems[0].appendChild(script_elem);

	}

	

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
				callback();
			}
		} 

		
	}

	xmlhttp.send(null);
}
