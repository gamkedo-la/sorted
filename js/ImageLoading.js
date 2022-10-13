var playerHatPic = document.createElement("img");
var sheepNormalPic = document.createElement("img");
var sheepKnotBluePic = document.createElement("img");
var sheepKnotRedPic = document.createElement("img");
var sheepRuffBluePic = document.createElement("img");
var sheepRuffRedPic = document.createElement("img");
var sheepTailPic = document.createElement("img");
var sheepTailBluePic = document.createElement("img");
var sheepTailRedPic = document.createElement("img");
var sheepTailGreenPic = document.createElement("img");
var BoPeepPic = document.createElement("img");
var dogBodyPic = document.createElement("img");
var menuBGPic = document.createElement("img");
var helpBGPic = document.createElement("img");
var creditsBGPic = document.createElement("img");
var controlsPic = document.createElement("img");
var flowerYellowPic = document.createElement("img");
var flowerBluePic = document.createElement("img");
var flowerRedPic = document.createElement("img");
var grass1Pic = document.createElement("img");
var grass2Pic = document.createElement("img");
var grass3Pic = document.createElement("img");
var hoofprintPic = document.createElement("img");
var dogPic = document.createElement("img");

var tilePics = [];

var picsToLoad = 0; // set automatically based on imageList in loadImages()

function countLoadedImagesAndLaunchIfReady() {
	picsToLoad--;
	// console.log(picsToLoad);
  if (picsToLoad == 0) {
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
		{varName: sheepNormalPic, theFile: "sheep_normal.png"},
		{varName: sheepKnotBluePic, theFile: "sheep_topknot_blue.png"},
		{varName: sheepKnotRedPic, theFile: "sheep_topknot_red.png"},
		{varName: sheepTailPic, theFile: "sheep_tail_normal.png"},
		{varName: sheepTailBluePic, theFile: "sheep_tail_blue.png"},
		{varName: sheepTailRedPic, theFile: "sheep_tail_red.png"},
		{varName: sheepTailGreenPic, theFile: "sheep_tail_green.png"},
		{varName: sheepRuffBluePic, theFile: "sheep_ruff_blue.png"},
		{varName: sheepRuffRedPic, theFile: "sheep_ruff_red.png"},
    {varName: menuBGPic, theFile: "menu_bg.png"},
    {varName: helpBGPic, theFile: "help_bg.png"},
    {varName: creditsBGPic, theFile: "credits_bg.png"},
    {varName: controlsPic, theFile: "controls.png"},
    {varName: flowerYellowPic, theFile: "flower1.png"},
    {varName: flowerBluePic, theFile: "flower_blue.png"},
    {varName: flowerRedPic, theFile: "flower_red.png"},
    {varName: grass1Pic, theFile: "grass1.png"},
    {varName: grass2Pic, theFile: "grass2.png"},
    {varName: grass3Pic, theFile: "grass3.png"},
    {varName: hoofprintPic, theFile: "hoofprint.png"},
    {varName: BoPeepPic, theFile: "bo_peep.png"},
    {varName: dogPic, theFile: "rogue_normal.png"},
    {varName: dogBodyPic, theFile: "dog_butt.png"},
    {tileType: TILE_FIELD, theFile: "tile_grass_50.png"},
    {tileType: TILE_HALT, theFile: "tile_lake.png"},
    {tileType: TILE_DISTRACT, theFile: "tile_lake.png"},
    {tileType: TILE_DITCH, theFile: "tile_ditch.png"},
    {tileType: FULL_DITCH, theFile: "tile_ditch.png"},
    {tileType: TILE_PEN_BLUE, theFile: "tile_pen_blue.png"},
    {tileType: TILE_PEN_RED, theFile: "tile_pen_red.png"},
    {tileType: FULL_BLUE, theFile: "tile_pen_blue.png"},
    {tileType: FULL_RED, theFile: "tile_pen_red.png"},
    {tileType: TILE_SLOW, theFile: "tile_tree.png"},
    {tileType: TILE_STUCK, theFile: "tile_stuck.png"},
		{tileType: TILE_BEND_LEFT, theFile: "tile_bend_left.png"},
		{tileType: TILE_BEND_RIGHT, theFile: "tile_bend_right.png"},
		{tileType: TILE_CONVEYOR_LEFT, theFile: "tile_conveyor_left.png"},
		{tileType: TILE_CONVEYOR_RIGHT, theFile: "tile_conveyor_right.png"},
		{tileType: TILE_CONVEYOR_UP, theFile: "tile_conveyor_up.png"},
		{tileType: TILE_CONVEYOR_DOWN, theFile: "tile_conveyor_down.png"},
	];
	picsToLoad = imageList.length;

	for(var i=0; i<imageList.length; i++) {
    // if list item has varName, use it
    if (imageList[i].varName != undefined) {
      beginLoadingImage(imageList[i].varName, imageList[i].theFile);
    } else {
      loadImageForTileCode(imageList[i].tileType, imageList[i].theFile);
    }
	}
}
