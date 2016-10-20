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

// Changes were made to this file - Jacob Nankervis 2016

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
	xmlhttp.open("GET","levels/" + name , true);
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

gCachedAssets['sudoku.json'] = {"frames": [

{
	"filename": "0.png",
	"frame": {"x":2,"y":2,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "1.png",
	"frame": {"x":20,"y":2,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "2.png",
	"frame": {"x":38,"y":2,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "3.png",
	"frame": {"x":56,"y":2,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "4.png",
	"frame": {"x":74,"y":2,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "5.png",
	"frame": {"x":92,"y":2,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "6.png",
	"frame": {"x":110,"y":2,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "7.png",
	"frame": {"x":128,"y":2,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "8.png",
	"frame": {"x":146,"y":2,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "9.png",
	"frame": {"x":164,"y":2,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "A.png",
	"frame": {"x":182,"y":2,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "B.png",
	"frame": {"x":200,"y":2,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "C.png",
	"frame": {"x":218,"y":2,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "D.png",
	"frame": {"x":236,"y":2,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "E.png",
	"frame": {"x":2,"y":20,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "F.png",
	"frame": {"x":20,"y":20,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "G.png",
	"frame": {"x":38,"y":20,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "H.png",
	"frame": {"x":56,"y":20,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "I.png",
	"frame": {"x":74,"y":20,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "J.png",
	"frame": {"x":92,"y":20,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "K.png",
	"frame": {"x":110,"y":20,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "L.png",
	"frame": {"x":128,"y":20,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "M.png",
	"frame": {"x":146,"y":20,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "N.png",
	"frame": {"x":164,"y":20,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "O.png",
	"frame": {"x":2,"y":2,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "P.png",
	"frame": {"x":182,"y":20,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "Q.png",
	"frame": {"x":200,"y":20,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "R.png",
	"frame": {"x":218,"y":20,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "S.png",
	"frame": {"x":236,"y":20,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "T.png",
	"frame": {"x":2,"y":38,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "U.png",
	"frame": {"x":20,"y":38,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "V.png",
	"frame": {"x":38,"y":38,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "W.png",
	"frame": {"x":56,"y":38,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "X.png",
	"frame": {"x":74,"y":38,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "Y.png",
	"frame": {"x":92,"y":38,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "Z.png",
	"frame": {"x":110,"y":38,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "apos.png",
	"frame": {"x":128,"y":38,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "block.png",
	"frame": {"x":146,"y":38,"w":54,"h":54},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":54,"h":54},
	"sourceSize": {"w":54,"h":54}
},
{
	"filename": "block2.png",
	"frame": {"x":202,"y":38,"w":26,"h":19},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":26,"h":19},
	"sourceSize": {"w":26,"h":19}
},
{
	"filename": "block3.png",
	"frame": {"x":2,"y":94,"w":26,"h":19},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":26,"h":19},
	"sourceSize": {"w":26,"h":19}
},
{
	"filename": "blockhp2.png",
	"frame": {"x":30,"y":94,"w":54,"h":54},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":54,"h":54},
	"sourceSize": {"w":54,"h":54}
},
{
	"filename": "blockhp3.png",
	"frame": {"x":86,"y":94,"w":54,"h":54},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":54,"h":54},
	"sourceSize": {"w":54,"h":54}
},
{
	"filename": "blocklight.png",
	"frame": {"x":142,"y":94,"w":54,"h":54},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":54,"h":54},
	"sourceSize": {"w":54,"h":54}
},
{
	"filename": "blueball.png",
	"frame": {"x":198,"y":94,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "bluegreenball.png",
	"frame": {"x":216,"y":94,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "bomb.png",
	"frame": {"x":2,"y":150,"w":36,"h":49},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":36,"h":49},
	"sourceSize": {"w":36,"h":49}
},
{
	"filename": "bombblock.png",
	"frame": {"x":40,"y":150,"w":54,"h":54},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":54,"h":54},
	"sourceSize": {"w":54,"h":54}
},
{
	"filename": "bomblight.png",
	"frame": {"x":96,"y":150,"w":36,"h":49},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":36,"h":49},
	"sourceSize": {"w":36,"h":49}
},
{
	"filename": "bullet.png",
	"frame": {"x":134,"y":150,"w":14,"h":14},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":14,"h":14},
	"sourceSize": {"w":14,"h":14}
},
{
	"filename": "colon.png",
	"frame": {"x":150,"y":150,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "comma.png",
	"frame": {"x":168,"y":150,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "emptyblocklight.png",
	"frame": {"x":186,"y":150,"w":54,"h":54},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":54,"h":54},
	"sourceSize": {"w":54,"h":54}
},
{
	"filename": "explode1.png",
	"frame": {"x":2,"y":206,"w":30,"h":30},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":30,"h":30},
	"sourceSize": {"w":30,"h":30}
},
{
	"filename": "explode2.png",
	"frame": {"x":34,"y":206,"w":37,"h":37},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":37,"h":37},
	"sourceSize": {"w":37,"h":37}
},
{
	"filename": "explode3.png",
	"frame": {"x":73,"y":206,"w":49,"h":49},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":49,"h":49},
	"sourceSize": {"w":49,"h":49}
},
{
	"filename": "explode4.png",
	"frame": {"x":124,"y":206,"w":49,"h":49},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":49,"h":49},
	"sourceSize": {"w":49,"h":49}
},
{
	"filename": "explode5.png",
	"frame": {"x":175,"y":206,"w":49,"h":49},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":49,"h":49},
	"sourceSize": {"w":49,"h":49}
},
{
	"filename": "fire.png",
	"frame": {"x":2,"y":257,"w":29,"h":43},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":29,"h":43},
	"sourceSize": {"w":29,"h":43}
},
{
	"filename": "fire1.png",
	"frame": {"x":33,"y":257,"w":31,"h":54},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":31,"h":54},
	"sourceSize": {"w":31,"h":54}
},
{
	"filename": "fire2.png",
	"frame": {"x":66,"y":257,"w":24,"h":42},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":24,"h":42},
	"sourceSize": {"w":24,"h":42}
},
{
	"filename": "fire3.png",
	"frame": {"x":92,"y":257,"w":16,"h":21},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":21},
	"sourceSize": {"w":16,"h":21}
},
{
	"filename": "firebit1.png",
	"frame": {"x":110,"y":257,"w":15,"h":31},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":15,"h":31},
	"sourceSize": {"w":15,"h":31}
},
{
	"filename": "firebit2.png",
	"frame": {"x":127,"y":257,"w":15,"h":31},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":15,"h":31},
	"sourceSize": {"w":15,"h":31}
},
{
	"filename": "firedot.png",
	"frame": {"x":144,"y":257,"w":6,"h":6},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":6,"h":6},
	"sourceSize": {"w":6,"h":6}
},
{
	"filename": "fullstop.png",
	"frame": {"x":152,"y":257,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "fwslash.png",
	"frame": {"x":170,"y":257,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "greenball.png",
	"frame": {"x":188,"y":257,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "hypen.png",
	"frame": {"x":206,"y":257,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "left_bra.png",
	"frame": {"x":224,"y":257,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "orangeball.png",
	"frame": {"x":2,"y":313,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "percent.png",
	"frame": {"x":20,"y":313,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "pinkball.png",
	"frame": {"x":38,"y":313,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "plane.png",
	"frame": {"x":56,"y":313,"w":22,"h":14},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":22,"h":14},
	"sourceSize": {"w":22,"h":14}
},
{
	"filename": "redball.png",
	"frame": {"x":80,"y":313,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "right_bra.png",
	"frame": {"x":98,"y":313,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "ufo.png",
	"frame": {"x":116,"y":313,"w":14,"h":14},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":14,"h":14},
	"sourceSize": {"w":14,"h":14}
},
{
	"filename": "ufo_blink.png",
	"frame": {"x":132,"y":313,"w":14,"h":14},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":14,"h":14},
	"sourceSize": {"w":14,"h":14}
},
{
	"filename": "ufo_fall.png",
	"frame": {"x":148,"y":313,"w":14,"h":14},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":14,"h":14},
	"sourceSize": {"w":14,"h":14}
},
{
	"filename": "whiteball.png",
	"frame": {"x":164,"y":313,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
},
{
	"filename": "yellowball.png",
	"frame": {"x":182,"y":313,"w":16,"h":16},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":16,"h":16},
	"sourceSize": {"w":16,"h":16}
}],
"meta": {
	"app": "http://www.codeandweb.com/texturepacker ",
	"version": "1.0",
	"image": "sudoku.png",
	"format": "RGBA8888",
	"size": {"w":256,"h":512},
	"scale": "1",
	"smartupdate": "$TexturePacker:SmartUpdate:e5ff0a7b3aec0e5a9ffb576b938d7bba:a0bb53a67ded0ddb6a9345657f325f1e:dea380e912b51de8b1c8f387771feaf4$"
}
}

;



