var canvas, canvasContext;

const STATE_CREDITS = 3;
const STATE_EDIT = 0;
const STATE_MENU = 2;
const STATE_PLAY = 1;

var gameState = STATE_MENU;
var editMode = true;
var nearGoal = false; // if true, pens at row near top

// equal team size guaranteed by doubling to find FLOCK_SIZE
// 9 levels initial values, can Level Editor change these?
const TEAM_SIZE = [null, 1, 2, 2, 4, 8, 12, 12, 12, 12];  
const FLOCK_SIZE = [];
for(var i=0; i<TEAM_SIZE.length; i++) {
  FLOCK_SIZE[i] = TEAM_SIZE[i] * 2;
}
 
var sheepList = [];

// var boopSound = new SoundOverlapsClass("snd/boop");
// var safelyGrazeMusic = new BackgroundMusicClass("music/Sheep_May_Safely_Graze_BWV_208");

// "Sheep May Safely Graze - BWV 208" Kevin MacLeod (incompetech.com)
// Licensed under Creative Commons: By Attribution 4.0 License
// http://creativecommons.org/licenses/by/4.0/

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
  checkGridMatchColsRows();
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
  update_debug_report();
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
  for(var i=0; i<FLOCK_SIZE[currentLevel]; i++) {
    sheepList[i].move();
  }
}

function drawAll() {
  if(gameState == STATE_PLAY) {
    drawArea();
    UI_level_number();

    for(var i=0; i<FLOCK_SIZE[currentLevel]; i++) {
      sheepList[i].draw();
      if(editMode) {
        sheepList[i].label();
      }
    }
    player.draw();
  }
  else if(gameState == STATE_MENU) {
    drawMenu();
  }
  else if(gameState == STATE_CREDITS) {
    drawCredits();
  } else {
    console.log("Game in unknown state.");
  }
}