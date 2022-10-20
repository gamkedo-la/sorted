const STATE_CREDITS = 3;
const STATE_HELP = 6;
const STATE_EDIT = 0;
const STATE_MENU = 2;
const STATE_PLAY = 1;
const STATE_LEVEL_END = 4;
const STATE_DESIGN_LEVEL = 8;
const STATE_SCOREBOARD = 5;
const STATE_GUIDE = 9;

var gameState = STATE_MENU; // STATE_DESIGN_LEVEL; //
const gameStateDescr = ['Edit', 'Play', 'Menu', 'Credits', 'Level-over', 'Scoreboard', 'Help', 'Game-over', 'Designing', 'Tutorial'];

var levelBeforeGuide = 0;
var tutorStep = 1;

// called when gameState changed, from Input.js

function gotoMenu(from) {
  if (gameState == STATE_GUIDE) {
    currentLevel = levelBeforeGuide;
    levelRunning = false;
  }
  gameState = STATE_MENU;
  menuBackSound.play();
  clumpRandom = true;
  if (musicInitialised) {
    gameMusic.startMusic();
    gameMusic.changeVolume(0.5);
  }
  report('return via ' + from, 1);
}

function gotoGuide(from) {
  gameState = STATE_GUIDE;
  levelBeforeGuide = currentLevel;
  currentLevel = 10;
  loadLevel(currentLevel);
  levelRunning = true;
  editMode = false;
  tutorStep = 1;
}

function gotoPlay(from) {
  // start next level or resume mid-level
  if (!levelRunning) {
    currentLevel++;
    levelRunning = true;
    console.log("Level number now =" + currentLevel);
    loadLevel(currentLevel);
    checkGridMatchColsRows();
  }
  gameState = STATE_PLAY;
  let barTitle = "Level " + currentLevel + ": " + LEVEL_NAMES[currentLevel];
  if (musicInitialised) {
    // gameMusic.stopMusic();
    gameMusic.changeVolume(0.05);
    console.log('Music volume try to reduce.');
  }
  report('Play via ' + from, 1);
}


function gotoReplay(from) {
  gameState = STATE_PLAY;
  if (!levelRunning) {
    levelRunning = true;
    loadLevel(currentLevel);
    checkGridMatchColsRows();
  }
}

function gotoAdvance(from) {
  // if (!levelRunning) {
  if (currentLevel == LAST_LEVEL) {
    console.log("No more Levels!");
    runMode = GAME_OVER;
    gameState = STATE_SCOREBOARD;
  } else {
    currentLevel++;
    levelRunning = true;
    loadLevel(currentLevel);
    checkGridMatchColsRows();
    gameState = STATE_PLAY;
    console.log("Level number now =" + currentLevel);
  }
  // }
}

function gotoScore(from) {
  gameState = STATE_SCOREBOARD;
  drawBarButtons(offmenuButtonLabel);
  report('Score via ' + from, 1)
}

function gotoHelp(from) {
  gameState = STATE_HELP;
  drawBarButtons(offmenuButtonLabel);
  report('Help via' + from, 1)
}

function gotoCredits(from) {
  gameState = STATE_CREDITS;
  report('Credits via ' + from, 1)
}

function gotoDesign(from) {
  gameState = STATE_DESIGN_LEVEL;
  areaGrid = levelList[designLevel].slice();
  designGridSet = true;
  report('Design via ' + from, 1);
  let msg = "Press F7 to advance Level number; Mouse click to choose a grid location; Number key to choose a tile-type; key S to save design to console and file; key M returns to Menu";
  console.log(msg);
}

function togglePause() {
  paused = !paused;
  if (musicInitialised) {
    gameMusic.startOrStopMusic();
  }
}


// called by drawPlay & drawLevelOver
function drawField() {
  drawGrass();
  decals.draw();
  drawTiles();

  // if a pen is occupied draw a gate
  for (var i = 0; i < TILE_COLS; i++) {
    var index = i + (TILE_COLS * (TILE_ROWS - 1));
    if (areaGrid[index] == FULL_BLUE) {
      colDrawPenGate(i, BLUE);
    }
    else if (areaGrid[index] == FULL_RED) {
      colDrawPenGate(i, RED);
    }
  } // loop bottom row

} // end drawField


function drawSheep() {
  // draw sheep, labelled with score
  for (var i = 0; i < sheepList.length; i++) {
    sheepList[i].draw();

    if (sheepList[i].levelDone) {
      sheepList[i].drawScore();
    }

    if (editMode) {
      sheepList[i].idLabel();
    }
  }
}


function drawMovingNotSheep() {
  player.draw();

  for (var i = 0; i < roguedogList.length; i++) {
    roguedogList[i].draw();
  }
  for (var i = 0; i < lostSheepList.length; i++) {
    lostSheepList[i].draw();
  }
  for (var i = 0; i < bopeepList.length; i++) {
    bopeepList[i].draw();
  }
}


function drawUI() {
  if (player.x > levelTitleWidth + 10) {
    drawLevelName();
  }
  else {
    drawLevelNameRight();
  }

  if (runMode == NORMAL_PLAY) {
    if (gameState == STATE_GUIDE) {
      drawBarTitle('"Bar"', 18);
      drawBarButtons(tutorialButtonLabel);
    } else {
      drawBarTitle("Level " + currentLevel, 20);
      drawBarButtons(playButtonLabel);
    }
  }
  else {
    drawBarTitle("Level " + currentLevel + " Test", 20);
    drawBarButtons(offmenuButtonLabel);
  }

  if (editMode) {
    if (showAgentGridValues) {
      drawAgentGridValues();
    } else if (showAreaGridValues) {
      let fontSize = 14;
      drawGridValues(areaGrid, fontSize, "white");
    }
  }
}

function drawCalling() {
  var sheepCalled = player.sheepIDcalled;
  if (sheepCalled != null) {
    // draw line between Hat and called sheep
    let x = sheepList[sheepCalled].x;
    let y = sheepList[sheepCalled].y;
    colorLine(canvasContext, player.x, player.y, x, y, "yellow")
  }
}

function drawVisualFX() {
  for (var i = 0; i < particleList.length; i++) {
    particleList[i].draw();
  }
}

// called every interval, from Main.js
function drawPlay() {
  drawField(); // common to Play and LevelOver
  drawCalling();
  drawSheep();
  if (runMode == NORMAL_PLAY) {
    drawMovingNotSheep();
    drawVisualFX();
  }
  drawUI();
  drawKeyTutorial();
} // end drawPlay


function drawLevelOver() {
  drawField();
  drawSheep();

  // any of Popup wanted for Test runs?
  if (runMode == NORMAL_PLAY) {
    drawLevelScore();
    drawBarTitle("Level " + currentLevel, 20);
    drawBarButtons(levelendButtonLabel);
  }
  else {
    drawLevelScoreTest();
    drawBarButtons(offmenuButtonLabel);
    drawBarTitle("Level " + currentLevel + " Test", 20);
  }
}


function drawMenuState() {
  drawMenu();
  drawBarTitle("Menu", 20); // fontsize
  drawBarButtons(menuButtonLabel);
}


function drawCreditState() {
  drawCredits();
  drawBarButtons(offmenuButtonLabel);
}
