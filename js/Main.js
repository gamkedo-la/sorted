var canvas, canvasContext;

var player = new playerClass(1);
var greenCar = new playerClass(2);

// var boopSound = new SoundOverlapsClass("snd/boop");
// var safelyGrazeMusic = new BackgroundMusicClass("music/Sheep_May_Safely_Graze_BWV_208");

// "Sheep May Safely Graze - BWV 208" Kevin MacLeod (incompetech.com)
// Licensed under Creative Commons: By Attribution 4.0 License
// http://creativecommons.org/licenses/by/4.0/

var currentLevel = 0;
const FLOCK_SIZE = [2,8,16,24]; // level zero not used
var sheepList = [];

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
  colorRect(0,0, canvas.width,canvas.height, "red");
  colorText("Loading Images", 0,0, "white");
	loadImages();
}

function imageLoadingDoneSoStartGame() {
	var framesPerSecond = 30;
	setInterval(updateAll, 1000/framesPerSecond);

  canvasContext.font = "15px Arial";
	setupInput();

  loadLevel(currentLevel);
  checkTilesFitCanvas();
}

function loadLevel(whichLevel) {
  areaGrid = levelList[whichLevel].slice();
  player.reset(playerHatPic, "Shepherding Hat");
  console.log("Loading level", whichLevel)
  sheepList = [];  // fresh set of sheep
  for(var i=0; i<FLOCK_SIZE[whichLevel]; i++) {
    var spawnSheep = new sheepClass();
    spawnSheep.init(i);
    sheepList.push(spawnSheep);
  }
  ui_countPenned();
}

function updateAll() {
	moveAll();
	drawAll();
}

function moveAll() {
  if(gameState == STATE_MENU || gameState == STATE_CREDITS) {
    return;
  }
	player.move();
	// greenCar.move();
  for(var i=0; i<FLOCK_SIZE[currentLevel]; i++) {
    sheepList[i].move();
  }
}

function drawAll() {
  if(gameState == STATE_MENU) {
    drawMenu();
    return;
  }
  if(gameState == STATE_CREDITS) {
    drawCredits();
    return;
  }
	drawTracks();

  for(var i=0; i<FLOCK_SIZE[currentLevel]; i++) {
    sheepList[i].draw();
    if(gameState == STATE_EDIT) {
      sheepList[i].label();
    }
  }
  player.draw();
}

function drawMenu() {
  colorRect(0,0, canvas.width,canvas.height, "black");
  headLine("Menu");
  bodyLine("Level - press number", 1);
  bodyLine("Credits - press C", 2);
  bodyLine("Resume play - press P", 3);
}
function drawCredits() {
  colorRect(0,0, canvas.width,canvas.height, "black");
  headLine("Credits");
  bodyLine("Contributor Name - ", 1);
  bodyLine("Contributor Name - ", 2);
  bodyLine("Contributor Name - ", 3);
  bodyLine("Contributor Name - ", 4);
  bodyLine("Contributor Name - ", 5);
}

const HEADER_FONT = 36;
const BODY_FONT = 24;
const TEXT_INDENT = 100;
const LINE_SPACING = 60;

function headLine(txt) {
  canvasContext.font = HEADER_FONT + "px Verdana";
  colorText(txt, TEXT_INDENT, 100, "white");
}
function bodyLine(txt, lineNum) {
  canvasContext.font = BODY_FONT + "px Verdana";
  colorText(txt, TEXT_INDENT, 110 + lineNum * LINE_SPACING, "white");
}
