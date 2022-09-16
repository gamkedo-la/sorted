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
  report('return via ' + from, 1)
}

function gotoPlay(from) {
  gameState = STATE_PLAY;
  let barTitle = "Level " + currentLevel + ": " + LEVEL_NAMES[currentLevel];
  report('Play via ' + from, 1)
}

function gotoReplay(from) {
  gameState = STATE_PLAY;
  if(!levelRunning) {
    levelRunning = true;
    loadLevel(playLevel);
    checkGridMatchColsRows();
  }
}

function gotoAdvance(from) {
  gameState = STATE_PLAY;
  if(!levelRunning) {
    if(playLevel == LAST_LEVEL) {
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
  designGrid = levelList[designLevel].slice();
  designGridSet = true;
  report('Design via ' + from, 1);
  let msg = "Click to choose a location; Number key to choose tiletype; S saves design to file; M returns to Menu";
  console.log(msg);
}

function togglePause() {
  paused = !paused;
}

// called every interval, from Main.js
function drawPlayState() {
  drawArea();
  drawLowRoad();
  decals.draw();
  drawBarTitle("Level " + currentLevel, 20);
  drawBarButtons(playButtonLabel);

  for(var i=0; i<FLOCK_SIZE[currentLevel]; i++) {
    sheepList[i].draw();
    if(editMode) {
      sheepList[i].idLabel();
    }
  }
  player.draw();
  if(currentLevel>=3) { // only on some levels
    dog.draw();
  }

  if(editMode) {
    if(showAgentGridValues) {
      drawAgentGridValues();
    } else if(showAreaGridValues) {
      let fontSize = 14;
      drawGridValues(areaGrid, fontSize, "white");
    }
  }

  drawBarButtons(playButtonLabel);

  drawTutorial();

  // if a goal is occupied draw a gate
  for(var i=0; i<TILE_COLS; i++) {
    var index = i + ( TILE_COLS * (TILE_ROWS-1) );
    if ( isTileGoal(index) ) {
      if ( agentGrid[index] > 0 ) {
        if ( areaGrid[index] == TILE_PEN_BLUE ) {
          colDrawGoalGate(i, BLUE);
        } else {
          colDrawGoalGate(i, RED);
        }
      }
    } // if goal tile
  } // loop bottom row
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


// function drawMenuState() {
//   drawBarTitle(LEVEL_NAMES[currentLevel]);
// }
function isTileGoal(index) {
  return areaGrid[index] == TILE_PEN_BLUE || areaGrid[index] == TILE_PEN_RED;
}