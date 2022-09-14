function setupInput() {

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

//////// from APC5 ///////////////////
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

//// from Irenic Htgd ////////////////
function setMousePosFromXY(x,y) {
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
      console.log(msg);
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
      console.log(msg);
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
  if (gameState == STATE_PLAY) {

    if (mouse.button == 0) {0
      // select a sheep to move manually
      let nearest = findNearestSheep(mouse.x, mouse.y);
      let distance = nearest.distFrom(mouse.x, mouse.y);
      if (distance < SELECT_RANGE) {
        nearest.state = SELECTED;
        sheepSelected = nearest.id;
        console.log("Selected sheep id " + sheepSelected);
      } else {
        console.log("No sheep within selection range");
      }

    }

    // context-menu has been prevented
    else if (mouse.button == 2) {
      // change facing angle of a sheep, using mouse xy
      // first identify nearest sheep as none will be SELECTED
      let nearest = findNearestSheep(mouse.x, mouse.y);
      report("Rightclick nearest " + nearest.id + ' ' + nearest.x, 1);
      let sheepXY = { x: nearest.x, y: nearest.y };
      let angle = angleRadiansBetweenPoints(sheepXY, mouse);
      nearest.ang = angle;
      report("new angle: " + angle.toFixed(2) + " for id " + nearest.id, 2);
    }
  } // end STATE_PLAY

  else if (gameState == STATE_DESIGN_LEVEL) {
    // select grid cell to outline
    gridIndex = getTileIndexAtPixelCoord(mousePos.x, mousePos.y);
    console.log("Designer", mousePos.x, mousePos.y, gridIndex);

    if (xyIsInRect(mousePos, buttonRects[4])) {
      report('Button return to menu', 1)
      gameState = STATE_MENU;
    }
  } // End of Design-Level mousedown handling
}

function field_mouseupHandler() {
  if (gameState == STATE_PLAY) {

    // if (mouse.button == 0) {

      // release a sheep from manual control
      let nearest = findNearestSheep(mouse.x, mouse.y);
      if (nearest.state == SELECTED) {
        nearest.state = GRAZE;
        nearest.timer = 120; // ensure a decent delay
        sheepSelected = null;
      }
    // }

    else if (mouse.button == 2) {

    }

  }
}

// handles in-game-level keyboard input
function arrowKeySet(evt, whichPlayer, setTo) {
  // this helps press & release functions are identical except for true/false
  if(evt.keyCode == whichPlayer.controlKeyLeft) {
		whichPlayer.keyHeld_left = setTo;
    whichPlayer.button_left = setTo; // keys for slidemove
	}
	if(evt.keyCode == whichPlayer.controlKeyRight) {
		whichPlayer.keyHeld_right = setTo;
    whichPlayer.button_right = setTo; // keys for slidemove
	}
	if(evt.keyCode == whichPlayer.controlKeyUp) {
		whichPlayer.keyHeld_call = setTo;
	}
	if(evt.keyCode == whichPlayer.controlKeyDown) {
		whichPlayer.keyHeld_send = setTo;
	}
  // console.log("key", player.keyHeld_left, player.keyHeld_right)
}

// handles in-menu keyboard input, depending on gameState
function menuKeyChoice(key) {
  switch (gameState) {

    case STATE_PLAY:
      if (key == KEY_ESC || key == KEY_M) {
        gameState = STATE_MENU;
      }
      else if (key == KEY_SPACE) {
        togglePause();
      }
      break;

    case STATE_LEVEL_END:
      if(key == KEY_ESC || key == KEY_M) {
        if(playLevel == LAST_LEVEL) {
          gameState = STATE_GAME_OVER;
          console.log("Game Over!");
        } else {
          gameState = STATE_MENU;
        }
      }

      if(key == KEY_R) {
        gotoReplay('keyR at LevelEnd');
      }

      if(key == KEY_L) {
        gotoAdvance("keyL at LevelEnd")
      }
      break;

    case STATE_MENU:
      menuSound.play();

      if(key == KEY_C) {
        gameState = STATE_CREDITS;
      }

      if(key == KEY_P) {
        if(!levelRunning) { // otherwise return mid-level
          // this condition should be caught by levelEnd handling
          if(playLevel == LAST_LEVEL) {
            console.log("No more Levels!");
          } else {
            levelRunning = true;
            playLevel++;
            currentLevel = playLevel;
console.log("Level number now playLevel=" + playLevel + " currentLevel=" + currentLevel);
            loadLevel(playLevel);
            checkGridMatchColsRows();
          }
        }
        gotoPlay("key P");
      }

      if(key == KEY_S) {
        gameState = STATE_SCOREBOARD;
      }

      if(key == KEY_H) {
        gameState = STATE_HELP;
      }

      if(editMode) {
        if(key >= KEY_NUM_0 && key <= KEY_NUM_9) {
          if(testMode == NORMAL_PLAY || testMode == SEND_ALL_X_ALL_COLUMNS || testMode == SEND_COLUMNS_CENTRE_ONLY || testColumnSet) {
          // if(testMode == NORMAL_PLAY || testMode == SEND_ALL_X_ALL_COLUMNS || testMode == SEND_COLUMNS_CENTRE_ONLY || testMode == SEND_ALL_X_ONE_COLUMN || testColumnSet) {
            testLevel = key - KEY_NUM_0; // 1 on keyb is code 49
            currentLevel = testLevel;
            levelRunning = true;
// console.log('Loading level from editMode menu with Num-key');
// console.log("Level number now =", currentLevel);
            loadLevel(testLevel);
            checkGridMatchColsRows();
            gotoPlay("Key number from Edit-mode Menu");
          } else {
            whichColumn = key - KEY_NUM_0;
            console.log("Test column = " + whichColumn + ". Now select a level.");
            testColumnSet = true;
          }
        }

        if(key == KEY_A) {
          // testMode = !testMode; // toggle
          testMode++;
          if(testMode > 2) { // stack Column is 3, Every_X is 4
            testMode = 0;
          }
          console.log(TEST_NAMES[testMode]);
        }

        if(key == KEY_T) {
          testTeam++;
          if(testTeam > 3) {
            testTeam = 0;
          }
          console.log("Paint for automated test is", TEAM_NAMES[testTeam]);
        }

        if(key == KEY_D) { // disbale because bug errors
          // gameState = STATE_DESIGN_LEVEL;
          // areaGrid = levelList[designLevel].slice();
          // designGridSet = true;
          console.log("Design Level");
        }
      } // editMode
      break;

    case STATE_SCOREBOARD:
      if(key == KEY_ESC || key == KEY_M) {
        gameState = STATE_MENU;
      }
      break;

    case STATE_CREDITS:
      if(key == KEY_M) {
        gameState = STATE_MENU;
      }
      if(key == KEY_P) {
        gameState = STATE_PLAY;
      }
      break;

    case STATE_HELP:
      if(key == KEY_M) {
        gameState = STATE_MENU;
        boopSound.play();
      }
      break;

    case STATE_DESIGN_LEVEL:

      if(key == KEY_M || key == KEY_ESC) {
        gameState = STATE_MENU;
      }
      // if(key == KEY_S) {
      // }
      // if(key == KEY_L) {
      //   tileType = TILE_CONVEYOR_LEFT;
      // }

      // temporarily using number keys to select tiletype
      if(key >= KEY_NUM_0 && key <= KEY_NUM_9) {
        tileType = key - KEY_NUM_0;
        if(tileType == 8 || tileType == 9) {
          console.log("Tile types 8 and 9 are not defined");
        } else {
          console.log("Tile type selected =", tileType, TILE_NAMES[tileType]);
          designTileReady = true;
        }

        // When tiles are selected visually, use numkeys to select Level.
        // designLevel = key - KEY_NUM_0; // key '1' is code 49
        // console.log("Number key from Designer = ", designLevel)
        // drawLevelDesigner(designLevel);
        // loadDesignLevel(designLevel);
      }
      break;

    default:
      break;
  }
}

// detect Fn key, usable from any gameState
function getFunctionKeys(key) {

  if(key == KEY_F1) {
    editMode = !editMode; // toggle
  }

  if(key == KEY_F2) {
    timerLabel = !timerLabel; // toggle
    console.log("Timer label is", timerLabel)
  }

  if(key == KEY_F3) {
    modeLabel = !modeLabel; // toggle
    console.log("Mode label is", modeLabel)
  }

  if(key == KEY_F4) {
    test_EndLevel();
    levelRunning = false;
  }

  if(key == KEY_F5) {
    endLevelShowID = !endLevelShowID; // toggle
    if(endLevelShowID) {
      console.log("At end of Level show sheep ID for debugging.")
    } else {
      console.log("At end of Level show points awarded for each sheep.")
    }
  }

  // cycle through options because can only show one grid
  if(key == KEY_F6) {
    if (noGridValuesDisplay() ) {
      showAreaGridValues = true;
      console.log("showAreaGridValues is now", showAreaGridValues);
    }
    else if(showAreaGridValues) {
      showAgentGridValues = true;
      showAreaGridValues = false;
      console.log("showAgentGridValues is now", showAgentGridValues);
      console.log('Tiles occupied by out-of-play sheep are non-zero labelled: 1=team blue, 2=team red')
    }
    else if(showAgentGridValues) {
      showAgentGridValues = false;

    }
  }

  if(key == KEY_F7) {
    designLevel++;
    if(designLevel > 9) {
      designLevel = 0;
    }
    designGridSet = false;
    drawLevelDesigner();
  }

  function noGridValuesDisplay() {
    return (!showAreaGridValues && !showAgentGridValues)
  }
}

function keyPressed(evt) {
  // arrowKeys
  arrowKeySet(evt, player, true);

  // toggle Edit mode, design/test tools
  getFunctionKeys(evt.keyCode);

  // Menu
  menuKeyChoice(evt.keyCode); // play, menu, or credits
	evt.preventDefault();
}

// only relevant to arrowKeys, not Menu or Fn keys
function keyReleased(evt) {
  arrowKeySet(evt, player, false);
}

// used by mousemove, though not by other mouse/touch
function updateMousePos(evt) {
  var rect = drawingCanvas.getBoundingClientRect();
  var fixScaleX = (uiCanvas.width + gameCanvas.width) / gameCanvas.width;
  mouse.x = Math.round(fixScaleX * (evt.clientX - rect.left) / drawScaleX );
  mouse.y = Math.round( (evt.clientY - rect.top) / drawScaleY);
  setDebug("Cursor: " + mouse.x + "," + mouse.y, 0);
}
