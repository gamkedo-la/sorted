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
var levelOver = false;
var levelData;

var step = Array(NUM_LEVELS); // time counter
step.fill(0);

var decals; // grass, flowers, footprints, pebbles, etc

const TEAM_NAMES = ["plain", "blue", "red", "mixed"];
const TEAM_COLOURS = ["#f4f4f4", "#66b3ff", "#f38282", "purple"];
const NUM_TEAM_TYPES = 3;

// equal team size guaranteed by doubling that to make FLOCK_SIZE
// 9 levels initial values, should Level Editor be able to change these?
const TEAM_SIZE = [2, 1, 3, 3, 3, 3, 3, 3, 3, 3];
const FLOCK_SIZE = [];
var sheepList = [];
var dogList = [];

var callSound = new SoundOverlapsClass("sound/call_1_quiet");
var stuckSound = new SoundOverlapsClass("sound/baa08");
var rogueSound = new SoundOverlapsClass("sound/woof01");
var menuSound = new SoundOverlapsClass("sound/menu_choice");
var menuBackSound = new SoundOverlapsClass("sound/menuback");


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

  if (debugBelowCanvas) {
    makeParagraphsBelowCanvas();
  }
  deviceTests();
  resizeWindow();
	loadImages();
}


function imageLoadingDoneSoStartGame() {
  setupDecals();

  let framesPerSecond = baseFPS;
	setInterval(updateAll, 1000/framesPerSecond);

  setupInput();

  setupGame();
}


function setupGame() {
  for (var i = 0; i < TEAM_SIZE.length; i++) {
    FLOCK_SIZE[i] = TEAM_SIZE[i] * 2;
  }
  setAllMaxScores();
}


function resizeWindow(){
	gameBoard.height = window.innerHeight;
	gameBoard.width = window.innerWidth;

  var width = gameCanvas.width + uiCanvas.width;
  var height = gameCanvas.height;

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

	drawScaleX = drawingCanvas.width/ gameCanvas.width;
	drawScaleY = drawingCanvas.height/gameCanvas.height;

  let xSc = drawScaleX.toFixed(2);
  let ySc = drawScaleY.toFixed(2);
  setDebug("drawScale x,y " + xSc + ", " + ySc, 2);
}


function updateAll() {

  if (haste == 0) { haste = 1; } // why was it zero?

  for (var i=0; i < haste; i++) {
    moveAll();
  }

	drawAll();

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
  step[currentLevel]++; // level timesteps
  player.callGapTimer--; // prevent call again too soon
  for (var i = 0; i < dogList.length; i++) {
    dogList[i].barkTimer--;
  }

  if ( staticScreen() ) {
    return;
  }


  else if (gameState == STATE_DESIGN_LEVEL) {
    if (designTileReady) {
      console.log('main (move) design', gridIndex, tileType);
      areaGrid[gridIndex] = tileType;
      drawDesignerFromLevelNum(designLevel);
      designTileReady = false;
    }
  }


  else if (gameState == STATE_PLAY) {

    // console.log('step', step[currentLevel], ' haste ', haste)

    for (var i = 0; i < FLOCK_SIZE[currentLevel]; i++) {
      sheepList[i].move();
    }

    if (runMode == NORMAL_PLAY) {
      flock_ambient_sounds(); // occasionally play a BAA mp3 quietly
      player.move();
    }

    // if (currentLevel >= 3 && runMode == NORMAL_PLAY) { // dog present on later levels only
    //   dog.move();
    // }
    for (var i = 0; i < dogList.length; i++) {
      dogList[i].move();
    }

    if (runMode == SEND_ONLY) {
      if ( !isAnySending() ) {
        // only on conveyors, go faster
        haste = 8;
        console.log('step', step[currentLevel], 'Faster while on conveyor');
      }
      if ( !isAnySendOrConvey() ) {
        // none on conveyors, all roaming so force LevelEnd
        levelEnding();
        console.log('step', step[currentLevel], 'Level end as none are Send');
      }
    }

    else if (runMode == SEND_ROAM && !hasteSet) {
      if (!isAnySending()) {
        // only on conveyors, go faster
        haste = 8;
        console.log('Fast while remainder on conveyor');
      }
      if (allRoamGrazeOrDone()) {
        haste = 100;
        hasteSet = true;
        console.log('step', step[currentLevel], 'Very fast as remainder all roaming')
      }
      // use normal LevelEnd condition
    }

    else if (runMode == CALL_FROM_R10) {
      // force LevelEnd when sheep in final column Held or give up.
    }

    if ( isLevelOver() ) {
      levelEnding();
    }
  }
} // end moveAll


function drawAll() {
  // background for canvas
  colorRect(drawingContext, 0,0, drawingCanvas.width,drawingCanvas.height, "white");
  colorRect(uiContext, 0,0, uiCanvas.width,uiCanvas.height, UI_COLOR);
  showDebugText();

  if (paused) {
    drawBarButtons(pauseButtonLabel);
    return;
  }

  else if (gameState == STATE_PLAY) {
    drawPlay();
  }

  else if (gameState == STATE_LEVEL_END) {
    // drawField();
    drawArea();
    decals.draw();
    player.draw();

    // if a pen is occupied draw a gate
    for(var i=0; i<TILE_COLS; i++) {
      var index = i + (TILE_COLS * (TILE_ROWS - 1));
      if (areaGrid[index] == FULL_BLUE) {
        colDrawPenGate(i, BLUE);
      }
      else if (areaGrid[index] == FULL_RED) {
        colDrawPenGate(i, RED);
      }
    } // loop bottom row


    // draw label with score on sheep
    for(var i=0; i<FLOCK_SIZE[currentLevel]; i++) {
      sheepList[i].draw();
      // if (endLevelShowID) {
        sheepList[i].idLabel();
      // } else {
        sheepList[i].drawScore();
      // }
    }

    // any of Popup wanted for Test runs?
    if (runMode == NORMAL_PLAY) {
      drawLevelEnd();
      drawBarTitle("Level " + currentLevel, 20);
      drawBarButtons(levelEndButtonLabel);
    }
    else {
      drawLevelEndTest();
      drawBarButtons(offMenuButtonLabel);
      drawBarTitle("Level " + currentLevel + " Test", 20);
    }

    // do once per level-ending
    if (levelTestDataReady) {
      levelTestDataReady = false;
      var filename = "level_" + currentLevel + "_";
    // sheep outcome data file downloads automatically

      if (runMode == NORMAL_PLAY) {
        levelData = playResult();
        filename += "play.tsv";
        downloader(filename, levelData);

        console.log("Results of play downloaded to " + filename);
      }
      else {
        levelData = testResult();
        filename += "test.tsv";
        downloader(filename, levelData);
        console.log("Results of test downloaded to " + filename);
        console.log("Level " + currentLevel + " completed. Score " + levelScore);
      }
    }// end levelTestDataReady, run once when level completed

  } // end of Level_Over


  else if (gameState == STATE_DESIGN_LEVEL) {
    drawDesignerFromGrid(areaGrid);
    levelDesignerTitle();
    outlineSelectedTile(gridIndex);
    drawBarText();
    drawBarButtons(designButtonLabel);
  }


  else if (gameState == STATE_MENU) {
    drawMenuState();
  }

  else if (gameState == STATE_CREDITS) {
    drawCreditState();
  }

  else if (gameState == STATE_SCOREBOARD) {
    drawScoreboard();
  }

  else if (gameState == STATE_GAME_OVER) {
    drawGameOver();
  }

  else if (gameState == STATE_HELP) {
    drawHelp();
  }
  else {
    console.log("Game in unknown state.");
  }

  if ( requireButtonGotoMenu() ) {
    drawBarButtons(offMenuButtonLabel);
  }

  // if (debugLevelTransition) {
  //   drawLevelDebug();
  // }

  // state design must be handled differently from states play & levelEnd
  if (editMode) {
    if (showAgentGridValues) {
      drawAgentGridValues();
    }
    else if (showAreaGridValues) {
      drawGridValues(areaGrid, 14, "white");
    }
    else if (showGridIndex) {
      drawGridIndex(areaGrid, 14, "white");
    }
    else if (showColRow) {
      drawColRow(areaGrid, 14, "white");
    }
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


// should be called ONCE at start of level
// but test runModes assume it loops because tests levelEnd?

function loadLevel(whichLevel) {
  areaGrid = levelList[whichLevel].slice();
  agentGrid = agentLevelList[whichLevel].slice();

  player.reset(playerHatPic, "Shepherding Hat");
  HatNotMovedYet = true;
  hasteSet = false;
  step[whichLevel] = 0; // reset frame counter

  sheepList = [];  // fresh set of sheep
  dogList = [];

  setupDogs(whichLevel);

  if (runMode == NORMAL_PLAY) {
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


  else if (runMode == SEND_ONLY || runMode == SEND_ROAM) {
    console.log("Testing level " + whichLevel + " - " + LEVEL_NAMES[whichLevel]);
    baaVolume = 0;

    // overwriting to use flocksize array seems a bad approach
    FLOCK_SIZE[whichLevel] = TILE_COLS;
    for(var i=0; i<FLOCK_SIZE[whichLevel]; i++) {
      var spawnSheep = new sheepClass();
      if (testTeam == MIXED) {
        var team = i % 2 == 0 ? BLUE : RED;
        spawnSheep.reset(i, team, team, SENT);
      } else {
        spawnSheep.reset(i, testTeam, PLAIN, SENT);
      }
      spawnSheep.test = "visual";
      spawnSheep.testRowInit();
      spawnSheep.placeTop();
      sheepList.push(spawnSheep);
    }
    // isLevelOver();
  }


  else if (runMode == ROAM_FROM_R1) {
    console.log("Test sheep roaming in level " + whichLevel + " - " + LEVEL_NAMES[whichLevel]);
    baaVolume = 0;

    FLOCK_SIZE[whichLevel] = TILE_COLS;
    testTeam = PLAIN;

    for(var i=0; i<FLOCK_SIZE[whichLevel]; i++) {
      var spawnSheep = new sheepClass();
      spawnSheep.reset(i, testTeam, PLAIN, ROAM);
      spawnSheep.testRoamInit();
      spawnSheep.placeRow(1);
      sheepList.push(spawnSheep);
    }
  }

  else if (runMode == CALL_FROM_R10) {
    console.log("Test call sheep in level " + whichLevel + " - " + LEVEL_NAMES[whichLevel]);
    baaVolume = 0;

    FLOCK_SIZE[whichLevel] = TILE_COLS;
    testTeam = PLAIN;

    for (var i = 0; i < FLOCK_SIZE[whichLevel]; i++) {
      var spawnSheep = new sheepClass();
      spawnSheep.reset(i, testTeam, PLAIN, ROAM);
      spawnSheep.testStillInit();
      spawnSheep.placeRow(10);
      sheepList.push(spawnSheep);
    }
  }

  // reset sorting
  teamSizeSoFar = [0,0,0];
  // reset level-ending detector
  sheepInPlay = FLOCK_SIZE[whichLevel];
  levelScore = 0;
  update_debug_report();
  levelLoaded = whichLevel;
  baaVolume = 1.0;
}


function staticScreen() {
  return paused || gameState == STATE_MENU || gameState == STATE_CREDITS || gameState == STATE_HELP || gameState == STATE_SCOREBOARD
}
