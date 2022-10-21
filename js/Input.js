var buttonHeld = null;

function setupInput() {

  initButtonRects(); // set coords of right bar buttons

  drawingCanvas.addEventListener('mousemove', updateMousePos);
  //drawingCanvas.addEventListener('touchmove', updateTouchPos);

  drawingCanvas.addEventListener('touchstart', clickOrTouch);
  drawingCanvas.addEventListener('mousedown', clickOrTouch);

  drawingCanvas.addEventListener('mouseup', clickOrTouch);

  drawingCanvas.addEventListener('contextmenu', e => e.preventDefault());

  document.addEventListener('keydown', keyPressed);
  document.addEventListener('keyup', keyReleased);
  player.setupInput(KEY_UP_ARROW, KEY_DOWN_ARROW, KEY_LEFT_ARROW, KEY_RIGHT_ARROW);
}


//////// from APC5 Htgd ///////////////////
// mouse object stores mouse information
var mouse = (function () {
  //Position
  var x = 0;
  var y = 0;

  // Button states
  var left = 0;
  var right = 0;
  var middle = 0;

  // Return only public variables/methods
  return {
    x: x,
    y: y,
    button: -1 // no mouse-button clicked yet
    // left: left,      // 0
    // middle: middle,  // 1
    // right: right     // 2
  };
})();

var uiPos = {
  x: null,
  y: null
}


//// from Irenic Htgd //////////////////
function setMousePosFromXY(x, y) {
  var rect = drawingCanvas.getBoundingClientRect();
  var root = document.documentElement;
  // account for margins, canvas position on page, scroll amount, etc.
  let gameX = (x - rect.left - root.scrollLeft) / drawScaleX;
  let gameY = (y - rect.top - root.scrollTop) / drawScaleY;
  // scale X here due to bug in Main.js
  var fixScaleX = (uiCanvas.width + gameCanvas.width) / gameCanvas.width;
  mouse.x = Math.round(fixScaleX * gameX);
  mouse.y = Math.round(gameY);
}


function clickOrTouch(event) {
  event.preventDefault();
  var x, y;

  if (event.targetTouches && event.targetTouches[0]) {
    let tapX = event.targetTouches[0].pageX;
    let tapY = event.targetTouches[0].pageY;
    x = tapX.toFixed(0);
    y = tapY.toFixed(0);
  }
  else {
    x = event.clientX;
    y = event.clientY;
  }

  // report("Tap client: " +  event.clientX + "," + event.clientY, 1);
  // report("M/T x,y: " +  x + "," + y, 2);

  if ((event.type == 'touchstart')) {
    // left click emulate
    mouse.button = 0;
  }
  else {
    // setMousePosFromEvent(event); // APC5 version
    mouse.button = event.button;
  }


  setMousePosFromXY(x, y); // adapted from Irenic
  // report("scaled: " +  mouse.x + "," + mouse.y, 3);

  if (mouse.x > gameCanvas.width) {
    uiPos.x = mouse.x - gameCanvas.width;
    uiPos.y = mouse.y;
    if (event.type == 'mousedown' || event.type == 'touchstart') {
      ui_mousedownHandler();
      let msg = "ui mousedown: " + mouse.x + ", " + mouse.y;
      // console.log(msg);
      setDebug(msg, 3);
    }
    else if (event.type == 'mouseup' || event.type == 'touchend') {
      ui_mouseupHandler();
    }
  } // end UI, below is game-field mosue/tap

  else {
    if (event.type == 'mousedown' || event.type == 'touchstart') {
      field_mousedownHandler();
      let msg = "mousedown: " + mouse.x + ", " + mouse.y;
      // console.log(msg);
      setDebug(msg, 3);
    }
    else if (event.type == 'mouseup' || event.type == 'touchend') {
      field_mouseupHandler();
    }
  }
} // end clickOrTouch
////////////////////////////// end Irenic


// function mousemoveHandler(evt) {
//   var mousePos = getMousePos(evt);
//   setDebug("cursor: " + mousePos.x + "," + mousePos.y, 0);
// }


// click or tap in field
function field_mousedownHandler() {

  if (gameState == STATE_PLAY && editMode == true) {

    if (mouse.button == 0) {
      0
      // select a sheep to move manually
      let nearest = findNearestSheep(mouse.x, mouse.y);
      let distance = nearest.distFrom(mouse.x, mouse.y);
      if (distance < SELECT_RANGE) {
        // remove occupancy, ungate pen; if proper play wanted
        // if (nearest.mode == )
        if (isInPenOrDitch(nearest.mode)) {
          console.log("Cannot move a sheep from pen or ditch");
        }
        else {
          nearest.mode = SELECTED;
          sheepSelected = nearest.id;
          console.log("Selected sheep id " + sheepSelected);
        }
      } else {
        console.log("No sheep within selection range");
      }
    }

    // context-menu has been prevented
    else if (mouse.button == 2) {

    }
  } // end STATE_PLAY


  else if (gameState == STATE_DESIGN_LEVEL) {
    // select grid cell to outline
    if (mouse.y < TILE_H) {
      console.log("Top row reserved for Hat movement, mouse Y=" + mouse.y);
    }
    else if (mouse.y > gameCanvas.height - TILE_H) {
      console.log("Bottom row reserved for pen and ditch, mouse Y=" + mouse.y);
    }
    else {
      gridIndex = getTileIndexAtXY(mouse.x, mouse.y);
      console.log("Design, mousedown", mouse.x, mouse.y, gridIndex);
    }
    // designer/editor doesn't need buttons, also currently no space for Menu button, so not in use
    if (xyIsInRect(mouse, buttonRects[4])) {
      gotoMenu('Design, button');
    }
  } // End of Design-Level mousedown handling


  else if (gameState ==  STATE_GUIDE) {
    if (mouse.y > gameCanvas.height-TILE_H) {
      if (tutorStep == 3) {
        tutorStep = 4;
      }
      else if (tutorStep == 6) {
        tutorStep = 7;
      }
    }
  }
  
} // end mousedown handler on field


function field_mouseupHandler() {
  if (gameState == STATE_PLAY) {

    if (mouse.button == 0) {
      // release a sheep from manual control
      let nearest = findNearestSheep(mouse.x, mouse.y);
      if (nearest.mode == SELECTED) {
        nearest.levelDone = false;
        nearest.mode = GRAZE;
        nearest.timer = 10; // will switch to ROAM
        sheepSelected = null;
      }
    }

    else if (mouse.button == 2) {
      // change facing angle of a sheep, using mouse xy
      // first identify nearest sheep as none will be SELECTED
      let nearest = findNearestSheep(mouse.x, mouse.y);
      report("Rightclick nearest " + nearest.id + ' ' + nearest.x, 1);
      let sheepXY = { x: nearest.x, y: nearest.y };
      let angle = angleRadiansBetweenPoints(sheepXY, mouse);
      nearest.ang = angle;
      report("new angle: " + angle.toFixed(2) + " for id " + nearest.id, 2); 1
    }
  }
}


// handles in-game-level keyboard input
function arrowKeySet(evt, whichPlayer, setTo) {
  // press & release functions are identical except for true/false
  if (evt.keyCode == whichPlayer.controlKeyLeft) {
    whichPlayer.keyHeld_left = setTo;
    // whichPlayer.button_left = setTo; // key for slide-move
  }
  if (evt.keyCode == whichPlayer.controlKeyRight) {
    whichPlayer.keyHeld_right = setTo;
    // whichPlayer.button_right = setTo; // key for slide-move
  }
  if (evt.keyCode == whichPlayer.controlKeyUp) {
    whichPlayer.keyHeld_call = setTo;
  }
  if (evt.keyCode == whichPlayer.controlKeyDown) {
    whichPlayer.keyHeld_send = setTo;
  }
  // console.log("key", player.keyHeld_left, player.keyHeld_right)
}


// handles in-menu keyboard input, depending on gameState
function menuKeyChoice(key) {
  switch (gameState) {

    case STATE_PLAY:

      if ((key == KEY_ESC || key == KEY_M) && !paused) {
        gotoMenu("Play, key M or Esc");
        runMode = NORMAL_PLAY; // remove Test settings
        haste = PLAY_SPEED;
      }

      else if (key == KEY_SPACE) {
        togglePause();
      }
      break;


    case STATE_GUIDE:
      
      if ((key == KEY_ESC || key == KEY_M) && !paused) {
        gotoMenu("Guide key M or Esc");
      }

      else if (key == KEY_SPACE) {
        togglePause();
      }
      break;


    case STATE_LEVEL_END:

      if (key == KEY_ESC || key == KEY_M) {
        if (currentLevel == LAST_LEVEL) {
          runMode = GAME_OVER;
          gameState = STATE_SCOREBOARD;
          console.log("Game Over!");
        } else {
          // duplicate of code in case STATE_PLAY
          gotoMenu("LevelEnd, key M or Esc");
          runMode = NORMAL_PLAY;
          haste = PLAY_SPEED;
        }
      }

      if (key == KEY_R) {
        gotoReplay('keyR at LevelEnd');
      }

      if (key == KEY_L) {
        gotoAdvance("keyL at LevelEnd")
      }
      break;


    case STATE_MENU:
      menuChoiceSound.play(0.3);

      if (key == KEY_C) {
        gameState = STATE_CREDITS;
      }

      if (key == KEY_P) {
        gotoPlay("key P");
      }

      if (key == KEY_S) {
        gotoScore('key S from menu');
      }

      if (key == KEY_U) {
        musicToggle();
      }

      if (key == KEY_H) {
        gameState = STATE_HELP;
      }

      if (key == KEY_T) {
        gotoGuide('menu key')
      }

      if (editMode) {
        if (key >= KEY_NUM_0 && key <= KEY_NUM_9) {

          if (testColumnSet) {
            testLevel = key - KEY_NUM_0; // 1 on keyb is code 49
            currentLevel = testLevel;
            levelRunning = true;
            console.log('Loading level', currentLevel, 'from editMode menu with Num-key');
            loadLevel(currentLevel);
            checkGridMatchColsRows();
            gotoPlay("Key number from Edit-mode Menu");
          }

          else {
            whichColumn = key - KEY_NUM_0;
            console.log("Test column = " + whichColumn + ". Now select a level.");
            testColumnSet = true;
          }
        }

        if (key == KEY_A) {
          runMode++;
          if (runMode > NUM_TEST_TYPES) {
            runMode = 0;
            haste = 1;
            hastenTest = false;
            console.log(TEST_DESCRIPTION[runMode], "Haste =", haste);
          }
          else {
            if (runMode == SEND_ONLY || runMode == SEND_ROAM) {
              haste = 1;
            }
            else if (runMode == ROAM_FROM_R1) {
              haste = 100;
            }
            else if (runMode == CALL_FROM_R10) {
              haste = 3;
            }
            hastenTest = true;
            console.log(TEST_DESCRIPTION[runMode], "Haste initially =", haste);
          }
        }

        if (key == KEY_X) {
          testTeam++;
          if (testTeam > NUM_TEAM_TYPES) {
            testTeam = 0;
          }
          console.log("Paint for automated test is", TEAM_NAMES[testTeam]);
        }

        if (key == KEY_D) {
          gotoDesign("menu key D")
        }
      } // editMode
      break;


    case STATE_SCOREBOARD:
      if (key == KEY_ESC || key == KEY_M) {
        gotoMenu("Scoreboard, key M or Esc");
      }
      break;


    case STATE_CREDITS:
      if (key == KEY_ESC || key == KEY_M) {
        gotoMenu("Credits, key M or Esc");
      }
      if (key == KEY_P) {
        gameState = STATE_PLAY;
      }
      break;


    case STATE_HELP:
      if (key == KEY_ESC || key == KEY_M) {
        gotoMenu("Help, key M or Esc");
      }
      break;


    case STATE_DESIGN_LEVEL:

      if (key == KEY_M || key == KEY_ESC) {
        formatDesign();
        gotoMenu("Design, key M or Esc");
      }

      else if (key == KEY_S) {
        formatDesign();
      }

      else if (key == KEY_C) {
        // formatDesign(); // if needed press key S before
        clearDesign();
      }

      // temporarily using number keys to select tiletype
      else if (key >= KEY_NUM_0 && key <= KEY_NUM_9) {

        tileType = key - KEY_NUM_0;

        // if (tileType == 8 || tileType == 9) {
        //   console.log("Tile types 8 and 9 are not defined");
        console.log("Tile type selected =", tileType, TILE_NAMES[tileType]);
        designTileReady = true;
      }
      break;

    default:
      break;
  }
}


// detect Fn key, usable from any gameState
function getFunctionKeys(key) {

  if (key == KEY_F1) {
    editMode = !editMode; // toggle
  }

  if (key == KEY_F2) {
    timerLabel = !timerLabel; // toggle
    console.log("Timer label is", timerLabel)
  }

  if (key == KEY_F3) {
    modeLabel = !modeLabel; // toggle
    console.log("Mode label is", modeLabel)
  }

  if (key == KEY_F4) {
    if (gameState == STATE_PLAY) {
      levelEnding();
    }
  }

  if (key == KEY_F5) {
    endLevelShowID = !endLevelShowID; // toggle
    if (endLevelShowID) {
      console.log("At end of Level show sheep ID for debugging.")
    } else {
      console.log("At end of Level show points awarded for each sheep.")
    }
  }

  // cycle through options because can only show one grid
  if (key == KEY_F6) {
    if (gameState == STATE_PLAY || gameState == STATE_DESIGN_LEVEL) {

      if (noGridValuesDisplay()) {
        showAreaGridValues = true;
        console.log("showAreaGridValues is now", showAreaGridValues);
      }

      else if (showAreaGridValues) {
        showAgentGridValues = true;
        showAreaGridValues = false;
        console.log("showAgentGridValues is now", showAgentGridValues);
        console.log('Tiles occupied by out-of-play sheep are non-zero labelled: 1=team blue, 2=team red')
      }
      else if (showAgentGridValues) {
        showAgentGridValues = false;
        showGridIndex = true;
        console.log("showGridIndex is now", showGridIndex);
      }
      else if (showGridIndex) {
        showGridIndex = false;
        showColRow = true;
        console.log("showColRow is now", showColRow);
      }
      else if (showColRow) {
        showColRow = false;
        console.log("No grid overlay");
      }
    } // end if gameState play or design
  }

  if (key == KEY_F7) {
    designLevel++;
    if (designLevel > 9) {
      designLevel = 0;
    }
    designGridSet = false;
    drawDesignerFromLevelNum(designLevel);
  }


  function noGridValuesDisplay() {
    return (!showAreaGridValues && !showAgentGridValues && !showGridIndex && !showColRow)
  }
} // end getFunctionKeys()


function keyPressed(evt) {

  if (isArrowKey(evt.keyCode)) {
    if (gameState == STATE_PLAY) {
      arrowKeySet(evt, player, true);
    }
    else if (gameState == STATE_DESIGN_LEVEL) {
      arrowKeyDesign(evt);
    }
  }

  else if (isFunctionKey(evt.keyCode)) {
    // toggle Edit mode, design/test tools
    getFunctionKeys(evt.keyCode);
  }

  else {
    menuKeyChoice(evt.keyCode); // play, menu, or credits
  }

  evt.preventDefault();
} // end keyPressed()


// only relevant to arrowKeys, not Menu or Fn keys
function keyReleased(evt) {
  arrowKeySet(evt, player, false);

  if (hatMoveSoundTest) {
    if (!player.keyHeld_left && !player.keyHeld_right) {
      hatMoveLongSound.stop();
    }
  }
}


// used by mousemove, though not by other mouse/touch
function updateMousePos(evt) {
  var rect = drawingCanvas.getBoundingClientRect();
  var fixScaleX = (uiCanvas.width + gameCanvas.width) / gameCanvas.width;
  mouse.x = Math.round(fixScaleX * (evt.clientX - rect.left) / drawScaleX);
  mouse.y = Math.round((evt.clientY - rect.top) / drawScaleY);
  setDebug("Cursor: " + mouse.x + "," + mouse.y, 0);

}
