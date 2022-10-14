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
var bottomRowHeight = 0; // a margin where no flowers or grass grows - see scatterDecals() - now not needed as decalsCanvas height reduced so it doesn't cover bottom row (to stop clustered flowers growing in pens)

var gameState = STATE_MENU; // STATE_DESIGN_LEVEL; //
var paused = false;
var sortingVFX = false;

var levelLoaded = null;
var levelRunning = false;
var levelTestDataReady = false;
var levelOver = false;
var levelData;

var step = Array(NUM_LEVELS); // time counter
step.fill(0);

var decals; // grass, flowers, footprints, pebbles, etc

const TEAM_NAMES = ["plain", "blue", "red", "mixed", , , , "white"];
const TEAM_COLOURS = ["#f4f4f4", "#66b3ff", "#f38282", "purple", , , , "white"];
const NUM_TEAM_TYPES = 3;

// equal team size guaranteed by doubling that to make FLOCK_SIZE
// 9 levels initial values, should Level Editor be able to change these?
const TEAM_SIZE = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
const FLOCK_SIZE = [];
var flockSize = null;

var sheepList = [];
var movingList = [];
var roguedogList = [];
var lostSheepList = [];
var bopeepList = [];


window.onload = function () {
  drawingCanvas = document.getElementById('drawingCanvas');
  drawingContext = drawingCanvas.getContext('2d');
  window.addEventListener("resize", resizeWindow);
  gameBoard = document.getElementById('gameBoard');
  gameCanvas = document.getElementById('gameCanvas');
  canvasContext = gameCanvas.getContext('2d');
  uiCanvas = document.getElementById('uiCanvas');
  uiContext = uiCanvas.getContext('2d');

  canvasContext.font = "28px Arial";
  colorRect(canvasContext, 0, 0, gameCanvas.width, gameCanvas.height, "red");
  colorText(canvasContext, "Loading Images", 50, 50, "white");

  if (debugBelowCanvas) {
    makeParagraphsBelowCanvas();
  }
  deviceTests();
  resizeWindow();
  loadImages();
  refocus();
}


function imageLoadingDoneSoStartGame() {
  bottomMargin = 0;
  clumpRandom = true;
  setupDecals(bottomMargin);
  initFlowerClumps();

  let framesPerSecond = baseFPS;
  setInterval(updateAll, 1000 / framesPerSecond);

  setupInput();

  setupGame();

  initialHatVFXsetup();
}


function setupGame() {
  for (var i = 0; i < TEAM_SIZE.length; i++) {
    FLOCK_SIZE[i] = TEAM_SIZE[i] * 2;
  }
  setAllMaxScores();
}


function resizeWindow() {
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

  drawingCanvas.style.top = (window.innerHeight / 2 - drawingCanvas.height / 2) + "px";
  drawingCanvas.style.left = (window.innerWidth / 2 - drawingCanvas.width / 2) + "px";
  colorRect(drawingContext, 0, 0, drawingCanvas.width, drawingCanvas.height, "white");

  drawScaleX = drawingCanvas.width / gameCanvas.width;
  drawScaleY = drawingCanvas.height / gameCanvas.height;

  let xSc = drawScaleX.toFixed(2);
  let ySc = drawScaleY.toFixed(2);
  setDebug("drawScale x,y " + xSc + ", " + ySc, 2);
}


function updateAll() {

  if (haste == 0) { haste = 1; } // why was it zero?

  for (var i = 0; i < haste; i++) {
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

  if (staticScreen()) { // includes paused
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

  else if (gameState == STATE_PLAY || gameState == STATE_LEVEL_END) {

    for (var i = 0; i < particleList.length; i++) {
      // object decrements life
      if (particleList[i].life < 1) {
        removeFromUnordered(particleList, i);
      }
      else {
        particleList[i].move();
      }
    }

    if (gameState == STATE_PLAY) {
      step[currentLevel]++; // level timesteps

      for (var i = 0; i < roguedogList.length; i++) {
        roguedogList[i].barkTimer--;
      }

      for (var i = 0; i < sheepList.length; i++) {
        sheepList[i].move();
      }

      for (var i = 0; i < roguedogList.length; i++) {
        roguedogList[i].move();
      }
      for (var i = 0; i < bopeepList.length; i++) {
        bopeepList[i].move();
      }

      if (runMode == NORMAL_PLAY) {
        flock_ambient_sounds(); // occasionally play a BAA mp3 quietly
        player.move();
      }

      else if (runMode == SEND_ONLY) {

        if (!isAnySending()) {
          // only on conveyors, go faster
          haste = 8;
          console.log('step', step[currentLevel], 'Faster while on conveyor');
        }

        if (!isAnySendOrConvey()) {
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

      if (isLevelOver()) {
        levelEnding();
      }
    } // end of STATE_PLAY
  } // end of PLAY or LEVEL_END
} // end moveAll


function drawAll() {
  // background for canvas
  colorRect(drawingContext, 0, 0, drawingCanvas.width, drawingCanvas.height, "white");
  colorRect(uiContext, 0, 0, uiCanvas.width, uiCanvas.height, UI_COLOR);

  if (editMode) {
    showDebugText();
  }

  if (paused) {
    drawBarButtons(pauseButtonLabel);
    // previous frame's field & sheep & NPCs are left on screen
  }

  else if (gameState == STATE_PLAY) {
    drawPlay();
    for (var i = 0; i < particleList.length; i++) {
      particleList[i].draw();
    }
  }

  else if (gameState == STATE_LEVEL_END) {
    // should call drawField() with parameter play or endLevel
    drawLevelOver();

    // do once per level-ending
    if (editMode && testWrite) {
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
    } //if editMode
  } // end of Level_Over


  else if (gameState == STATE_DESIGN_LEVEL) {
    drawFieldFromGrid(areaGrid);
    levelDesignerTitle();
    outlineSelectedTile(gridIndex);
    drawBarText();
    drawBarButtons(designButtonLabel);
    drawMovables();
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
    drawScoreboard();
    // drawGameOver();
  }

  else if (gameState == STATE_HELP) {
    drawHelp();
  }
  else {
    console.log("Game in unknown state.");
  }

  if (requireButtonGotoMenu()) {
    drawBarButtons(offMenuButtonLabel);
  }

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
    canvasContext.globalAlpha = 1 - ((now - tutorial_start_time) / tutorial_timespan);
    canvasContext.drawImage(controlsPic, 320, 75);
    canvasContext.globalAlpha = 1;
  }
}


// should be called ONCE at start of level
// but test runModes assume it loops because tests levelEnd?

function loadLevel(whichLevel) {
  areaGrid = levelList[whichLevel].slice();
  agentGrid = agentLevelList[whichLevel].slice();

  player.reset(playerHatPic, "Shepherding Hat");
  hasteSet = false;
  step[whichLevel] = 0; // reset frame counter

  sheepList = [];  // fresh set of sheep
  roguedogList = [];
  bopeepList = [];

  setupDogs(whichLevel);
  setupBoPeep(whichLevel);

  if (runMode == NORMAL_PLAY) {
    flockSize = FLOCK_SIZE[whichLevel];
    var team = PLAIN;
    for (var i = 0; i < flockSize; i++) {
      var spawnSheep = new sheepClass();
      var mode = i % 2 == 0 ? ROAM : GRAZE;
      var potential = i % 2 == 0 ? BLUE : RED;
      var team = PLAIN;
      spawnSheep.reset(i, team, potential, mode);
      spawnSheep.placeRandom(PLACING_DEPTH[whichLevel]);
      sheepList.push(spawnSheep);

      // var spawnMoving = new movingClass();
      // spawnMoving.init(i, "sheep", spawnSheep.x)
    }

    bottomMargin = TILE_H;
    // clumpRandom = false;
    setupDecals(bottomMargin);

    console.log("Level loaded: " + whichLevel + " - " + LEVEL_NAMES[whichLevel]);
  }


  else if (runMode == SEND_ONLY || SEND_SEQ_ONLY || runMode == SEND_ROAM) {
    console.log("Testing level " + whichLevel + " - " + LEVEL_NAMES[whichLevel]);
    baaVolume = 0;

    flockSize = TILE_COLS;
    for (var i = 0; i < flockSize; i++) {
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

    flockSize = TILE_COLS;
    testTeam = PLAIN;

    for (var i = 0; i < FLOCK_SIZE[whichLevel]; i++) {
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
    flockSize = TILE_COLS;
    testTeam = PLAIN;

    for (var i = 0; i < flockSize; i++) {
      var spawnSheep = new sheepClass();
      spawnSheep.reset(i, testTeam, PLAIN, ROAM);
      spawnSheep.testStillInit();
      spawnSheep.placeRow(10);
      sheepList.push(spawnSheep);
    }
  }

  // reset sorting
  teamSizeSoFar = [0, 0, 0];
  // reset level-ending detector
  sheepInPlay = flockSize;
  levelScore = 0;
  update_debug_report();
  levelLoaded = whichLevel;
  baaVolume = 1.0;
}


function staticScreen() {
  return paused || gameState == STATE_MENU || gameState == STATE_CREDITS || gameState == STATE_HELP || gameState == STATE_SCOREBOARD
}


function refocus() {
  drawingCanvas.setAttribute('tabindex', '0');
  drawingCanvas.focus();
}