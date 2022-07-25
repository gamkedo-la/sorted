var playerPic = document.createElement("image");
var tilePics = [];

var picsToLoad = 0; // set automatically based on imageList in loadImages()

function countLoadedImagesAndLaunchIfReady() {
	picsToLoad--;
	if(picsToLoad == 0) {
		imageLoadingDoneSoStartGame();
	}
}

function beginLoadingImage(imgVar, fileName) {
	imgVar.onload = countLoadedImagesAndLaunchIfReady;
	imgVar.src = "image/"+fileName;
}

function loadImageForTileCode(tileCode, fileName) {
  tilePics[tileCode] = document.createElement("image");
  beginLoadingImage(tilePics[tileCode], fileName);
}

function loadImages() {
	var imageList = [
		{varName: playerPic, theFile: "player_hat.png"},
		{tileType: TILE_FIELD, theFile: "tile_grass.png"},
    {tileType: TILE_WALL, theFile: "tile_wall.png"},		
    {tileType: TILE_GOAL, theFile: "tile_goal.png"},
    {tileType: TILE_PEN_BLUE, theFile: "tile_pen_blue.png"},
    {tileType: TILE_PEN_RED, theFile: "tile_pen_red.png"},
    {tileType: TILE_TREE, theFile: "tile_tree.png"},
		{tileType: TILE_FLAG_LEFT, theFile: "tile_flag_left.png"},
		{tileType: TILE_FLAG_RIGHT, theFile: "tile_flag_right.png"}
	];
	picsToLoad = imageList.length;
console.log('images to load =', imageList.length);
console.log(imageList);
	for(var i=0; i<imageList.length; i++) {
    // if list item has varName, use it
    if(imageList[i].varName != undefined) {
      beginLoadingImage(imageList[i].varName, imageList[i].theFile);
console.log("varname", imageList[i].varName);
    } else {
      loadImageForTileCode(imageList[i].tileType, imageList[i].theFile);
    }
	}
}