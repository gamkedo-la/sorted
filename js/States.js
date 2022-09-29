const STATE_CREDITS = 3;
const STATE_HELP = 6;
const STATE_EDIT = 0;
const STATE_MENU = 2;
const STATE_PLAY = 1;
const STATE_LEVEL_END = 4;
const STATE_DESIGN_LEVEL = 8;
const STATE_GAME_OVER = 7;
const STATE_SCOREBOARD = 5;

const gameStateDescr = ['Edit', 'Play', 'Menu', 'Credits', 'Level-over', 'Scoreboard', 'Help', 'Game-over'];

// called when gameState changed, from Input.js

function gotoMenu(from) {
  gameState = STATE_MENU;
  menuBackSound.play();
  report('return via ' + from, 1)
}

function gotoPlay(from) {
  gameState = STATE_PLAY;
  let barTitle = "Level " + currentLevel + ": " + LEVEL_NAMES[currentLevel];
  report('Play via ' + from, 1)
}

function gotoReplay(from) {
  gameState = STATE_PLAY;
  if (!levelRunning) {
    levelRunning = true;
    loadLevel(playLevel);
    checkGridMatchColsRows();
  }
}

function gotoAdvance(from) {
  gameState = STATE_PLAY;
  if (!levelRunning) {
    if (playLevel == LAST_LEVEL) {
      console.log("No more Levels!");
    } else {
      playLevel++;
      currentLevel = playLevel;
      levelRunning = true;
      loadLevel(playLevel);
      checkGridMatchColsRows();
    }
  }
}

function gotoScore(from) {
  gameState = STATE_SCOREBOARD;
  drawBarButtons(offMenuButtonLabel);
  report('Score via ' + from, 1)
}

function gotoHelp(from) {
  gameState = STATE_HELP;
  // BAR.innerHTML = '';
  drawBarButtons(offMenuButtonLabel);
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
}


// called by drawPlay & drawLevelOver
function drawField() {
  drawArea();
  decals.draw();
  drawBarTitle("Level " + currentLevel, 20);

  for(var i=0; i<FLOCK_SIZE[currentLevel]; i++) {
    sheepList[i].draw();

    if (sheepList[i].levelDone) {
      sheepList[i].drawScore();
    }

    if (editMode) {
      sheepList[i].idLabel();
    }
  }

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

  if (editMode) {
    if (showAgentGridValues) {
      drawAgentGridValues();
    } else if (showAreaGridValues) {
      let fontSize = 14;
      drawGridValues(areaGrid, fontSize, "white");
    }
  }
} // end drawField


// called every interval, from Main.js
function drawPlay() {
  drawField(); // common to Play and LevelOver

  if (player.x > levelTitleWidth + 10) {
    drawLevelName();
  }

  if (runMode == NORMAL_PLAY) {
    drawBarButtons(playButtonLabel);
  }
  else {
    drawBarTitle("Level " + currentLevel + " Test", 20);
    drawBarButtons(offMenuButtonLabel);
  }

  drawTutorial();

  player.draw();

  for (var i = 0; i < dogList.length; i++) {
    dogList[i].draw();
  }
} // end drawPlay


function drawlevelOver() {

}


function drawMenuState() {
  drawMenu();
  drawBarTitle("Menu", 20); // fontsize
  drawBarButtons(menuButtonLabel);
}


function drawCreditState() {
  drawCredits();
  drawBarButtons(offMenuButtonLabel);
}
