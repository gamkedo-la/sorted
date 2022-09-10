var drawScaleX, drawScaleY;
var drawingCanvas, drawingContext;
var gameBoard;
var gameCanvas, canvasContext;
var uiCanvas, uiContext;

const fieldX = 800;
const uiBarX = 200;
const playFieldFractionOfScreen = fieldX / (fieldX + uiBarX); // % board for play field
const fieldY = 600;

const UI_COLOR = "#222222";
var bottomRowHeight = 55; // a margin where no flowers or grass grows - see scatterDecals()

var gameState = STATE_MENU; // STATE_DESIGN_LEVEL; //
var paused = false;

var levelLoaded = null;
var playLevel = 0; // not changed by editMode or state levelEditor
var levelRunning = false;
var levelTestDataReady = false;

var step = Array(NUM_LEVELS);
step.fill(0);
var levelData;
// const fs = require('fs');

var nearGoal = false; // if true, pens at row near top
var decals; // grass, flowers, footprints, pebbles, etc

const TEAM_NAMES = ["plain", "blue", "red", "mixed"];
const TEAM_COLOURS = ["#f4f4f4", "#66b3ff", "#f38282", "purple"];

// equal team size guaranteed by doubling that to make FLOCK_SIZE
// 9 levels initial values, should Level Editor be able to change these?
const TEAM_SIZE = [4, 2, 2, 3, 3, 4, 4, 4, 2, 4];
const FLOCK_SIZE = [];
for(var i=0; i<TEAM_SIZE.length; i++) {
  FLOCK_SIZE[i] = TEAM_SIZE[i] * 2;
}
var sheepList = [];

var boopSound = new SoundOverlapsClass("sound/test_sound");
var callSound = new SoundOverlapsClass("sound/call_1_quiet");
var stuckSound = new SoundOverlapsClass("sound/baa08");
var rogueSound = new SoundOverlapsClass("sound/woof01");
var menuSound = new SoundOverlapsClass("sound/menu1");

window.onload = function() {
  drawingCanvas = document.getElementById('drawingCanvas');
	drawingContext = drawingCanvas.getContext('2d');
	window.addEventListener("resize", resizeWindow);
  gameBoard = document.getElementById('gameBoard');
	gameCanvas = document.getElementById('gameCanvas');
	canvasContext = gameCanvas.getContext('2d');
	uiCanvas = document.getElementById('uiCanvas');
	uiContext = uiCanvas.getContext('2d');

  canvasContext.font = "28px Arial";
  colorRect(canvasContext, 0,0, gameCanvas.width,gameCanvas.height, "red");
  colorText(canvasContext, "Loading Images", 50,50, "white");

  // Is this needed?
  // uiCanvas.width = gameCanvas.width * playFieldFractionOfScreen;
	// uiCanvas.height = gameCanvas.height;

  if(debugBelowCanvas) {
    makeParagraphsBelowCanvas();
  }

  deviceTests();
  resizeWindow();
	loadImages();
}

function imageLoadingDoneSoStartGame() {
  setupDecals();
	var framesPerSecond = 30;
	setInterval(updateAll, 1000/framesPerSecond);

  setupInput();
}

function resizeWindow(){
	gameBoard.height = window.innerHeight;
	gameBoard.width = window.innerWidth;

  var width = fieldX + uiBarX;
  var height = fieldY;

	if (window.innerHeight / height > window.innerWidth / width) {
		drawingCanvas.width = window.innerWidth;
		drawingCanvas.height = window.innerWidth * height / width;
	} else {
		drawingCanvas.height = window.innerHeight;
		drawingCanvas.width = window.innerHeight * width / height;
	}

	drawingCanvas.style.top = (window.innerHeight/2 - drawingCanvas.height/2) + "px";
	drawingCanvas.style.left = (window.innerWidth/2 - drawingCanvas.width/2) + "px";
	colorRect(drawingContext, 0,0, drawingCanvas.width,drawingCanvas.height, "white");

	drawScaleX = drawingCanvas.width/gameCanvas.width;
	drawScaleY = drawingCanvas.height/gameCanvas.height;

  let xSc = drawScaleX.toFixed(2);
  let ySc = drawScaleY.toFixed(2);
  setDebug("drawScale x,y " + xSc + ", " + ySc, 2);
}

function updateAll() {
	moveAll();
	drawAll();
  step[currentLevel]++; // level timesteps
  player.callGapTimer--; // prevents immediate call again
  dog.barkTimer--;

  drawingContext.save();
  drawingContext.scale(drawScaleX * playFieldFractionOfScreen, drawScaleY);
	drawingContext.drawImage(gameCanvas, 0, 0);
	drawingContext.restore();

	drawingContext.save();
  drawingContext.translate(gameCanvas.width * drawScaleX * playFieldFractionOfScreen, 0);
	drawingContext.scale(drawScaleX, drawScaleY);
	drawingContext.drawImage(uiCanvas, 0, 0);
	drawingContext.restore();
}

function moveAll() {
  if(gameState == STATE_MENU || gameState == STATE_CREDITS || paused) {
    return;
  }

  else if(gameState == STATE_DESIGN_LEVEL) {
    if(designTileReady) {
      console.log('main (move) design', gridIndex, tileType);
      areaGrid[gridIndex] = tileType;
      designGrid[gridIndex] = tileType;
      drawLevelDesigner(designLevel);
      designTileReady = false;
    }
  }

  else if(gameState == STATE_PLAY) {
    player.move();

    for(var i=0; i<FLOCK_SIZE[currentLevel]; i++) {
      sheepList[i].move();
    }

    flock_ambient_sounds(); // occasionally play a BAA mp3 quietly

    if(currentLevel>=3) { // dog present on later levels only
      dog.move();
    }
  }
}

function drawAll() {
  // background for canvas
  colorRect(drawingContext, 0,0, drawingCanvas.width,drawingCanvas.height, "white");
  colorRect(uiContext, 0,0, uiCanvas.width,uiCanvas.height, UI_COLOR);
  showDebugText();

  if(paused) {
    return;
  }

  else if(gameState == STATE_PLAY) {
    drawPlayState();
  }

  else if (gameState == STATE_LEVEL_OVER) {
    drawArea();
    player.draw();
    decals.draw();

    // draw label with score on sheep
    for(var i=0; i<FLOCK_SIZE[currentLevel]; i++) {
      sheepList[i].draw();
      if(endLevelShowID) {
        sheepList[i].idLabel();
      } else {
        sheepList[i].scoreLabel();
      }
    }

    if(editMode) {
      if(showAgentGridValues) {
        drawAgentGrid();
      } else if(showAreaGridValues) {
        showGridValues(areaGrid, 14, "white");
      }

      // do once per level-ending
      if(levelTestDataReady) {
        levelTestDataReady = false;
        var filename = "level_" + currentLevel + "_";
        // sheep outcome data file downloads automatically
        if(testMode == NORMAL_PLAY) {
          levelData = playResult();
          filename +=  "play.tsv";
          downloader(filename, levelData);
          console.log("Results of play downloaded to " + filename);
        } else {
          levelData = testResult();
          filename +=  "test.tsv";
          downloader(filename, levelData);
          console.log("Results of test downloaded to " + filename);
        }
      }
    } // end of (editMode)

    drawLevelOver();
    drawLevelOverButtons();
  } // end of Level_Over

  else if(gameState == STATE_DESIGN_LEVEL) {
    drawLevelDesigner(designLevel);
    levelDesignerTitle();
    outlineSelectedTile(gridIndex);
  }

  else if(gameState == STATE_MENU) {
    drawMenu();
    drawBarTitle("Menu", 20); // fontsize
    drawBarButtons(menuButtonLabel);
  }

  else if(gameState == STATE_CREDITS) {
    drawCredits();
  }
  else if(gameState == STATE_SCOREBOARD) {
    drawScoreboard();
  }
  else if(gameState == STATE_GAME_OVER) {
    drawGameOver();
  }
  else if(gameState == STATE_HELP) {
    drawHelp();
  }
  else {
    console.log("Game in unknown state.");
  }

  if( requireButtonGotoMenu() ) {
    drawLevelOverButtons();
  }
} // end drawAll()

var tutorial_start_time = 0;
var tutorial_timespan = 5000; // ms
function drawTutorial() {
    // display the controls reference gui tutorial popup
    // for a few seconds, then fade it out
    let now = performance.now();
    if (!tutorial_start_time) tutorial_start_time = now;
    if (now < tutorial_start_time + tutorial_timespan) {
        canvasContext.globalAlpha = 1-((now-tutorial_start_time)/tutorial_timespan);
        canvasContext.drawImage(controlsPic,320,75);
        canvasContext.globalAlpha = 1;
    }
}

function loadLevel(whichLevel) {
  areaGrid = levelList[whichLevel].slice();
  agentGrid = agentLevelList[whichLevel].slice();

  player.reset(playerHatPic, "Shepherding Hat");

  GROUNDSPEED_DECAY_MULT = HAT_FRICTION[whichLevel]; // hat moves like car
  drivePower = HAT_POWER[whichLevel];
  reversePower = HAT_POWER[whichLevel];
  tractorSpeed = CALL_SPEED[whichLevel];

  if(whichLevel>=3) { // dog present on later levels only
    dog.init(dogPic);
  }

  sheepList = [];  // fresh set of sheep

  if(testMode == NORMAL_PLAY) {
    var team = PLAIN;
    for(var i=0; i<FLOCK_SIZE[whichLevel]; i++) {
      var spawnSheep = new sheepClass();
      var mode = i % 2 == 0 ? ROAM : GRAZE;
      var potential = i % 2 == 0 ? BLUE : RED;
      var team = PLAIN;
      spawnSheep.reset(i, team, potential, mode);
      spawnSheep.placeRandom(PLACING_DEPTH[whichLevel]);
      sheepList.push(spawnSheep);
    }
    console.log("Level loaded: " + whichLevel + " - " + LEVEL_NAMES[whichLevel]);
  }

  else if(testMode == SEND_COLUMNS_CENTRE_ONLY) {
    console.log("Test send row of sheep in level " + whichLevel + " - " + LEVEL_NAMES[whichLevel]);

    // overwriting to use flocksize array seems a bad approach
    FLOCK_SIZE[whichLevel] = TILE_COLS;
    for(var i=0; i<FLOCK_SIZE[whichLevel]; i++) {
      var spawnSheep = new sheepClass();
      if(testTeam == MIXED) {
        var team = i % 2 == 0  ? BLUE : RED;
        spawnSheep.reset(i, team, team, SENT);
      } else {
        spawnSheep.reset(i, testTeam, PLAIN, SENT);
      }
      spawnSheep.testRowInit();
      spawnSheep.placeTop();
      sheepList.push(spawnSheep);
    }
    test_EndLevel();
  }

  else if(testMode == SEND_IN_COLUMN) {
    console.log("Testing column of sheep in level " + whichLevel + " - " + LEVEL_NAMES[whichLevel]);
    FLOCK_SIZE[whichLevel] = 3 //TILE_W;
    for(var i=0; i<FLOCK_SIZE[whichLevel]; i++) {
      var spawnSheep = new sheepClass();
      if(testTeam == MIXED) {
        var team = i % 2 == 0  ? BLUE : RED;
        spawnSheep.reset(i, team, team, SENT);
      } else {
        spawnSheep.reset(i, testTeam, PLAIN, SENT);
      }
      spawnSheep.testColumnInit();
      spawnSheep.placeColumn(whichColumn);
      sheepList.push(spawnSheep);
    }
    test_EndLevel();
  }

  else if(testMode == SEND_ALL_X_ONE_COLUMN) {
    console.log("Testing send from each X in column " + whichColumn + " of level " + whichLevel);
    FLOCK_SIZE[whichLevel] = TILE_W; // 40
    // loop every X pixel position within a tile width
    for(var Xoffset=0; Xoffset < TILE_W; Xoffset++) {  // limit really TILE_W
        var spawnSheep = new sheepClass();
        spawnSheep.reset(col, testTeam, PLAIN, SENT);
        spawnSheep.testColumnXInit();
        spawnSheep.placeColumnX(whichColumn, Xoffset);
        sheepList.push(spawnSheep);
    }
    whichColumn = null;
    testColumnSet = false;
  }

  // cannot be done like this, need Xoffset increment by 1 at End-Level
  // and a flag to keep doing test until Xoffset reaches 40 (TILE_W)
  else if(testMode == SEND_ALL_X_ALL_COLUMNS) {
    console.log("Testing send from each X in level " + whichLevel + " - " + LEVEL_NAMES[whichLevel]);
    FLOCK_SIZE[whichLevel] = TILE_COLS;
    // loop every X pixel position within a tile width
    for(var Xoffset=0; Xoffset < 2; Xoffset++) {  // limit really TILE_W
      for(var col=0; col < TILE_COLS; col++) {
        var spawnSheep = new sheepClass();
        spawnSheep.reset(col, testTeam, PLAIN, SENT);
        spawnSheep.testRowInit();
        spawnSheep.placeTop();
        sheepList.push(spawnSheep);
      }
      testTimer = 999;
    }
  }

  // reset sorting
  teamSizeSoFar = [0,0,0];
  // reset level-ending detector
  sheepInPlay = FLOCK_SIZE[whichLevel];
  update_debug_report();
  levelLoaded = whichLevel;
}
