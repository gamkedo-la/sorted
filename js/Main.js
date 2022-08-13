var canvas, canvasContext;

const STATE_CREDITS = 3;
const STATE_HELP = 6;
const STATE_EDIT = 0;
const STATE_MENU = 2;
const STATE_PLAY = 1;
const STATE_LEVEL_OVER = 4;
const STATE_SCOREBOARD = 5;

var gameState = STATE_MENU;
var editMode = true;
var levelLoaded = 0;
var levelRunning = false;
var nearGoal = false; // if true, pens at row near top
var showAgentGrid = false;

const TEAM_NAMES = ["plain", "blue", "red"];
const TEAM_COLOURS = ["#f4f4f4", "#66b3ff", "#f38282"];

// equal team size guaranteed by doubling that to make FLOCK_SIZE
// 9 levels initial values, should Level Editor be able to change these?
const TEAM_SIZE = [2, 2, 2, 4, 4, 4, 6, 6, 8, 8];  
const FLOCK_SIZE = [];
for(var i=0; i<TEAM_SIZE.length; i++) {
  FLOCK_SIZE[i] = TEAM_SIZE[i] * 2;
}
var sheepList = [];

var boopSound = new SoundOverlapsClass("sound/test_sound");

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
}

function loadLevel(whichLevel) {
  areaGrid = levelList[whichLevel].slice();
  agentGrid = agentLevelList[whichLevel].slice();

  player.reset(playerHatPic, "Shepherding Hat");

  if(whichLevel>=3) { // dog present on later levels only
    dog.init(rogueDogPic);
  }

  if(testDrop == DROP_A_ROW_FULL) {
    FLOCK_SIZE[whichLevel] = TILE_COLS;
  }

  sheepList = [];  // fresh set of sheep
  for(var i=0; i<FLOCK_SIZE[whichLevel]; i++) {
    var spawnSheep = new sheepClass();
    var potential = i % 2 == 0  ? BLUE : RED;
    spawnSheep.init(i, potential);
    sheepList.push(spawnSheep);
  }

  if(testDrop == DROP_A_ROW_FULL) {
    console.log("Testing level " + whichLevel + " - " + levelNames[whichLevel])
    for(var i=0; i<FLOCK_SIZE[whichLevel]; i++) {
      sheepList[i].testRow();
      sheepList[i].placeTop();
    }
    test_EndLevel();
  } 
  else if(testDrop == DROP_IN_COLUMN) { 
    console.log("Loading level " + whichLevel + " - " + levelNames[whichLevel]);
    for(var i=0; i<FLOCK_SIZE[whichLevel]; i++) {
      sheepList[i].testColumn();
      sheepList[i].placeColumn(whichColumn);
    }
  }
  else if(testDrop == NORMAL_PLAY) { // normal play
    console.log("Loading level " + whichLevel + " - " + levelNames[whichLevel]);
    for(var i=0; i<FLOCK_SIZE[whichLevel]; i++) {
      sheepList[i].reset();
      sheepList[i].placeRandom();
    }
  }

  // reset sorting
  teamSizeSoFar = [0,0,0];
  // reset scoring
  countBluePen = 0;
  countRedPen = 0;
  countNotPen = 0;
  countSheepPenned = 0;
  sheepInPlay = FLOCK_SIZE[whichLevel];

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
  else if(gameState == STATE_PLAY) {
    player.move();
    for(var i=0; i<FLOCK_SIZE[currentLevel]; i++) {
      sheepList[i].move();
    }
    if(currentLevel>=3) { // dog present on later levels only
      dog.move();
    }
  }
}

function drawAll() {
  if(gameState == STATE_PLAY) {
    drawArea();
    // drawAgentGrid();
    UI_level_number();

    for(var i=0; i<FLOCK_SIZE[currentLevel]; i++) {
      sheepList[i].draw();
      if(editMode) {
        sheepList[i].label();
      }
    }
    player.draw();
    if(currentLevel>=3) { // only on some levels
      dog.draw();
    }
  }
  else if (gameState == STATE_LEVEL_OVER) {
    drawArea();
    player.draw();
    if(showAgentGrid) {
      drawAgentGrid();
    }
    UI_level_number();
    drawLevelOver();

    // draw label with score on sheep
    for(var i=0; i<FLOCK_SIZE[currentLevel]; i++) {
      sheepList[i].draw();
      if(endLevelshowID) {
        sheepList[i].label();
      } else {
        sheepList[i].scoreLabel();
      }
    }
  }
  else if(gameState == STATE_MENU) {
    drawMenu();
  }
  else if(gameState == STATE_CREDITS) {
    drawCredits();
  } 
  else if(gameState == STATE_SCOREBOARD) {
    drawScoreboard();
  }
  else if(gameState == STATE_HELP) {
    drawHelp();
  }
  else {
    console.log("Game in unknown state.");
  }
}