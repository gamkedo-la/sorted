// when gameState change

function addLevelTitle(txt) {
  // var title = document.createElement("p");
  // title.classList.add("bar_title");
  // txt += " Please don't use these buttons yet!";
  // title.innerHTML = txt;
  // BAR.appendChild(title);
}

function gotoMenu(from) {
  gameState = STATE_MENU;
  BAR.innerHTML = ''; // clear bar
  addLevelTitle( LEVEL_NAMES[currentLevel] );
  // makeBarButtons(menuButtonList);
  debugAndConsole('return via ' + from, 1 )
}

function gotoPlay(from) {
  gameState = STATE_PLAY;
  // BAR.innerHTML = '';
  let title = "Level " + currentLevel + ": " + LEVEL_NAMES[currentLevel];
  addLevelTitle(title);
  makeBarButtons(playButtonList);
  debugAndConsole('Play via ' + from, 1 )
}

function gotoScore(from) {
  gameState = STATE_SCOREBOARD;
  // BAR.innerHTML = '';
  makeBarButtons(offMenuButtonList);
  debugAndConsole('Score via ' + from, 1 )
}
function gotoHelp(from) {
  gameState = STATE_HELP;
  // BAR.innerHTML = '';
  makeBarButtons(offMenuButtonList);
  debugAndConsole('Help via' + from, 1 )
}
function gotoScore(from) {
  gameState = STATE_CREDITS;
  BAR.innerHTML = '';
  makeBarButtons(offMenuButtonList);
  debugAndConsole('Credits via ' + from, 1 )
}

function gotoDesign(from) {
  gameState = STATE_DESIGN_LEVEL;
  BAR.innerHTML = '';
  makeBarButtons(designButtonList);
  debugAndConsole('Design via ' + from, 1 )
}

function togglePause() {
  paused = !paused;
}

function drawPlayState() {
  drawArea();
  drawLowRoad();
  decals.draw();
  // UI_level_number();

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
      drawAgentGrid();
    } else if(showAreaGridValues) {
      let fontSize = 14;
      showGridValues(areaGrid, fontSize, "white");
    }
  }

  drawPlayButtons();
  //makeBarButtons(playButtonList);

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

function isTileGoal(index) {
  return areaGrid[index] == TILE_PEN_BLUE || areaGrid[index] == TILE_PEN_RED;
}