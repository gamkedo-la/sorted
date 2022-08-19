var playerHatPic = document.createElement("img");
var sheepNormalPic = document.createElement("img");
var sheepKnotBluePic = document.createElement("img");
var sheepKnotRedPic = document.createElement("img");
var sheepRuffBluePic = document.createElement("img");
var sheepRuffRedPic = document.createElement("img");
var sheepTailPic = document.createElement("img");
var sheepTailBluePic = document.createElement("img");
var sheepTailRedPic = document.createElement("img");
var rogueDogPic = document.createElement("img");
var menuBGPic = document.createElement("img");
var helpBGPic = document.createElement("img");
var creditsBGPic = document.createElement("img");
var tilePics = [];

var picsToLoad = 0; // set automatically based on imageList in loadImages()

function countLoadedImagesAndLaunchIfReady() {
	picsToLoad--;
	// console.log(picsToLoad);
	if(picsToLoad == 0) {
		imageLoadingDoneSoStartGame();
	}
}

function beginLoadingImage(imgVar, fileName) {
	imgVar.onload = countLoadedImagesAndLaunchIfReady;
	imgVar.src = "img/"+fileName;
}

function loadImageForTileCode(tileCode, fileName) {
  tilePics[tileCode] = document.createElement("img");
  beginLoadingImage(tilePics[tileCode], fileName);
}

function loadImages() {
	var imageList = [
		{varName: playerHatPic, theFile: "player_hat.png"},
		{varName: sheepNormalPic, theFile: "sheep-normal.png"},
		{varName: sheepKnotBluePic, theFile: "sheep-blue-hat.png"},
		{varName: sheepKnotRedPic, theFile: "sheep-red-hat.png"},
		{varName: sheepTailPic, theFile: "sheep-tail-60.png"},
		{varName: sheepTailBluePic, theFile: "sheep-tail-blue.png"},
		{varName: sheepTailRedPic, theFile: "sheep-tail-red.png"},
		{varName: sheepRuffBluePic, theFile: "sheep-ruff-blue.png"},
		{varName: sheepRuffRedPic, theFile: "sheep-ruff-red.png"},
		{varName: rogueDogPic, theFile: "tile_girl.png"},
        {varName: menuBGPic, theFile: "menu-bg.png"},
        {varName: helpBGPic, theFile: "help-bg.png"},
        {varName: creditsBGPic, theFile: "credits-bg.png"},
    {tileType: TILE_FIELD, theFile: "tile_grass.png"},
    {tileType: TILE_HALT, theFile: "tile_lake.png"},		
    {tileType: TILE_GOAL, theFile: "tile_road.png"},
    {tileType: TILE_ROAD, theFile: "tile_road_fence.png"},
    {tileType: TILE_PEN_BLUE, theFile: "tile_pen_blue.png"},
    {tileType: TILE_PEN_RED, theFile: "tile_pen_red.png"},
    {tileType: TILE_ROAM, theFile: "tile_tree.png"},
		{tileType: TILE_GO_LEFT, theFile: "tile_flag_left.png"},
		{tileType: TILE_GO_RIGHT, theFile: "tile_flag_right.png"},
		{tileType: TILE_LOW_ROAD, theFile: "low_road_fence.png"}
	];
	picsToLoad = imageList.length;

	for(var i=0; i<imageList.length; i++) {
    // if list item has varName, use it
    if(imageList[i].varName != undefined) {
      beginLoadingImage(imageList[i].varName, imageList[i].theFile);
    } else {
      loadImageForTileCode(imageList[i].tileType, imageList[i].theFile);
    }
	}
}