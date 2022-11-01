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
  buttonDown = null;
  if (gameState == STATE_GUIDE) {
    currentLevel = levelBeforeGuide;
    // levelRunning = false;
  }
  gameState = STATE_MENU;
  menuBackSound.play();
  clumpRandom = true;
  if (musicInitialised) {
    gameMusic.startMusic();
    gameMusic.alterVolume(musicMenuVolume);
  }
  report('return via ' + from, 1);
}


function gotoGuide(from) {
  buttonDown = null;
  gameState = STATE_GUIDE;
  levelBeforeGuide = currentLevel;
  currentLevel = 10;
  loadLevel(currentLevel);
  // levelRunning = true;
  // editMode = false;
  tutorStep = 1;
}


function gotoPlay(from) {
  buttonDown = null;
  // start next level or resume mid-level
  if (!levelRunning) {
    currentLevel++;
    levelRunning = true;
    console.log("Level number now = " + currentLevel);
    loadLevel(currentLevel);
    checkGridMatchColsRows();
  }
  gameState = STATE_PLAY;
  let barTitle = "Level " + currentLevel + ": " + LEVEL_NAMES[currentLevel];
  if (musicInitialised) {
    // gameMusic.stopMusic();
    gameMusic.alterVolume(musicGameVolume);
    console.log('Music volume try to reduce.');
  }
  report('Play via ' + from, 1);
}


function gotoReplay(from) {
  buttonDown = null;

  victory_music.stop();
  if (musicInitialised) {
    gameMusic.startMusic();
  }

  gameState = STATE_PLAY;
  if (!levelRunning) {
    levelRunning = true;
    loadLevel(currentLevel);
    checkGridMatchColsRows();
  }
}


function gotoAdvance(from) {
  buttonDown = null;

  victory_music.stop();
  if (musicInitialised) {
    gameMusic.startMusic();
  }

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
  buttonDown = null;
  gameState = STATE_SCOREBOARD;
  drawBarButtons(offmenuButtonLabel);
  report('Score via ' + from, 1)
}


function gotoHelp(from) {
  buttonDown = null;
  gameState = STATE_HELP;
  drawBarButtons(offmenuButtonLabel);
  report('Help via' + from, 1)
}


function gotoCredits(from) {
  buttonDown = null;
  creditsFrameCount = 0;
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

  if (paused) {
    buttonDown = 4;
  } else {
    buttonDown = null;
  }

  if (musicInitialised) {
    if (paused) {
      gameMusic.alterVolume(musicMenuVolume);
    } else {
      gameMusic.alterVolume(musicGameVolume);
    }
  }

  // if (gameState == STATE_LEVEL_END) {
  //   if (paused) {
  //     victory_music.pause();
  //   } else {
  //     victory_music.play();
  //   }
  // }
}

function moveSheep() {
  for (var i = 0; i < sheepList.length; i++) {
    sheepList[i].move();
  }
}


function moveLorries() {
  for (var i = 0; i < lorryList.length; i++) {
    lorryList[i].move();
    var direction = lorryList[i].direction;
    var boardingAngle = direction == 1 ? 0 : Math.PI;

    // console.log('happening', happeningAt, 'timer', afterLevelTimeStep)

    if (afterLevelTimeStep == timeRoadScroll - 5) {
      victory_music.play(VICTORY_MUSIC_VOLUME);
    }

    // if (afterLevelTimeStep == happeningAt) {
    else if (afterLevelTimeStep == timeRoadScroll) {
      penHere = lorryList[i].stops[0];
      downBoard(penHere, i); // sheep begin moving down onto road

      // happeningAt += timeLoadSheep;
      console.log('Collect 1st', penHere, 'time', afterLevelTimeStep)
    }

    else if (afterLevelTimeStep == timeRoadScroll + timeBoardY) {
      penHere = lorryList[i].stops[0];
      sideBoard(penHere, i, direction); // sheep begin moving sideways into lorry
    }

    else if (afterLevelTimeStep == timeRoadScroll + timeBoardY + timeBoardX) {
      penHere = lorryList[i].stops[0];
      var id = bottomRowID[penHere];
      if (id != null) {
        sheepList[id].visible = false;
      }
    }

    // else if (afterLevelTimeStep == happeningAt) {
    else if (afterLevelTimeStep == timeRoadScroll + timeBoardY + timeBoardX + timeLoadSheep) {
      lorryList[i].ramp = false;
      lorryRestart(i);
      happeningAt += timeTravelBetweenPens;
    }

    // else if (afterLevelTimeStep == happeningAt) {
    else if (afterLevelTimeStep == timeRoadScroll + timeBoardY + timeBoardX + timeLoadSheep + timeTravelBetweenPens) {
      lorryList[i].speedX = 0;
      lorryList[i].ramp = true;
      penHere = lorryList[i].stops[1];
      downBoard(penHere, i);
      console.log('Collect 2nd', penHere, 'time', afterLevelTimeStep)
    }

    else if (afterLevelTimeStep == timeRoadScroll + timeBoardY*2 + timeBoardX + timeLoadSheep + timeTravelBetweenPens) {
      penHere = lorryList[i].stops[1];
      sideBoard(penHere, i, direction); // sheep begin moving sideways into lorry
    }

    else if (afterLevelTimeStep == timeRoadScroll + timeBoardY*2 + timeBoardX*2 + timeLoadSheep + timeTravelBetweenPens) {
      penHere = lorryList[i].stops[1];
      var id = bottomRowID[penHere];
      if (id != null) {
        sheepList[id].visible = false;
      }
    }

    else if (afterLevelTimeStep == timeRoadScroll + timeBoardY*2 + timeBoardX*2 + timeLoadSheep*2 + timeTravelBetweenPens) {
      lorryList[i].ramp = false;
      lorryRestart(i);
    }

    // else if (afterLevelTimeStep == happeningAt) {
    else if (afterLevelTimeStep == timeRoadScroll + timeBoardY*2 + timeBoardX*2 + timeLoadSheep*2 + timeTravelBetweenPens*2) {
      lorryList[i].speedX = 0;
      lorryList[i].ramp = true;
      penHere = lorryList[i].stops[2];
      downBoard(penHere, i);
      console.log('Collect 3rd', penHere, 'time', afterLevelTimeStep)
    }

    else if (afterLevelTimeStep == timeRoadScroll + timeBoardY*3 + timeBoardX*2 + timeLoadSheep*2 + timeTravelBetweenPens*2) {
      penHere = lorryList[i].stops[2];
      sideBoard(penHere, i, direction); // sheep begin moving sideways into lorry
    }

    else if (afterLevelTimeStep == timeRoadScroll + timeBoardY*3 + timeBoardX*3 + timeLoadSheep*2 + timeTravelBetweenPens*2) {
      penHere = lorryList[i].stops[2];
      var id = bottomRowID[penHere];
      if (id != null) {
        sheepList[id].visible = false;
      }
    }

    // else if (afterLevelTimeStep == happeningAt) {
    else if (afterLevelTimeStep == timeRoadScroll + timeBoardY*3 + timeBoardX*3 + timeLoadSheep*3 + timeTravelBetweenPens*2) {
      lorryList[i].ramp = false;
      lorryRestart(i);
    }
  }
}


function lorryRestart(i) {
  if (i == 0) {
    lorryList[i].speedX = lorrySpeed * -1;
  }
  else if (i == 1) {
    lorryList[i].speedX = lorrySpeed;
  }
}

function downBoard(col, lorryID) {
  var id = bottomRowID[col];
  if (id != null) {
    // sheepList[id].visible = false;
    sheepList[id].gotoY = sheepList[id].y + boardLorryY;
    sheepList[id].gotoX = sheepList[id].x;
    sheepList[id].changeMode(LOADING);
  } else {
    console.log('No sheep at pen', penHere, 'for lorry', lorryID)
  }
}

function sideBoard(col, lorryID, direction) {
  // var direction = lorryList[i].direction;
  var boardingAngle = direction == 1 ? 0 : Math.PI;
  var id = bottomRowID[col];
  if (id != null) {
    sheepList[id].gotoX = sheepList[id].x + (direction * boardLorryX);
    sheepList[id].gotoY = sheepList[id].y;
    sheepList[id].ang = boardingAngle;
  }
}


function drawLorries() {
  for (var i = 0; i < lorryList.length; i++) {
    lorryList[i].draw();
  }
}


// called by drawPlay & drawLevelOver
function drawField() {
  drawGrass();
  decals.draw();
  drawTiles();

  // if a pen is occupied draw a gate
  for (var i = 0; i < TILE_COLS; i++) {
    let rowOffset = 1;
    var index = i + (TILE_COLS * (TILE_ROWS - rowOffset));
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
      if (tutorStep == 7 || tutorStep == 8) {
        drawBarButtons(playButtonLabel);
        drawTime();
      } else {
        drawBarButtons(tutorialButtonLabel);
      }
    } else {
      drawBarTitle("Level " + currentLevel, 20);
      drawBarButtons(playButtonLabel);
      drawTime();
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
    canvasContext.lineWidth = 5;
    colorDashLine(canvasContext, player.x, player.y + 20, x, y, "yellow")
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
  if (showingRoadScene) {
    showingRoadVerticalShift += 2;
    if (showingRoadVerticalShift > TILE_H) {
      showingRoadVerticalShift = TILE_H;
    }
    canvasContext.save();
    canvasContext.translate(0, -Math.floor(showingRoadVerticalShift));
  }
  drawField();
  drawSheep();
  if (showingRoadScene) {
    if (true) { // if (!allAreNull(bottomRowID)) {
      // if (anyInPen(bottomRowID)) {
      drawLorries();
    }
  }
  if (showingRoadScene) {
    canvasContext.restore();
  }
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
  // drawBarTitle("Menu", 20); // fontsize
  drawBarButtons(menuButtonLabel);
}


function drawCreditState() {
  drawCredits();
  drawBarButtons(creditsButtonLabel);
  // drawBarButtons(offmenuButtonLabel);
}


function setupRoadLorries() {

  // remove top row from field
  // areaGrid = areaGrid.slice(TILE_COLS);
  areaGrid = areaGrid.concat(ROAD_ROW);
  // for (var i = 0; i < sheepList.length; i++) {
  //   sheepList[i].y -= TILE_H;
  // }

  // create Lorries
  var spawnLorry = new lorryClass();
  let x = gameCanvas.width / 2 - TILE_W / 2 - lorryBluePic.width / 2 - 40;
  spawnLorry.init(1, lorryBluePic, x, -1);
  spawnLorry.stops = [7, 4, 1]; // centre pen first
  lorryList.push(spawnLorry);

  var spawnLorry = new lorryClass();
  x = gameCanvas.width / 2 + TILE_W / 2 + lorryBluePic.width / 2 + 40;
  spawnLorry.init(2, lorryRedPic, x, 1);
  spawnLorry.stops = [8, 11, 14];
  lorryList.push(spawnLorry);

  afterLevelTimeStep = 0;
  happeningAt = timeRoadScroll;

  showingRoadScene = true;
  showingRoadVerticalShift = 0;
  // console.log(areaGrid);
}