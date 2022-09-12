/////////////////////////////////////////
// from Classic Games book
var mouseX = 0;
var mouseY = 0;

function getMousePos(evt) {
	var rect = gameCanvas.getBoundingClientRect();
	var root = document.documentElement;
  // account for margins, canvas position on page, scroll amount, etc.
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY
  };
}
////////////////////////////////////////

// from APC5
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

// from APC5 Htgd - lacks root.scroll...?
function updateMousePos(evt) {
  var rect = drawingCanvas.getBoundingClientRect();
  var fixScaleX = (uiCanvas.width + gameCanvas.width) / gameCanvas.width;
  mouse.x = Math.round(fixScaleX * (evt.clientX - rect.left) / drawScaleX );
  mouse.y = Math.round( (evt.clientY - rect.top) / drawScaleY);
  setDebug("cursor: " + mouse.x + "," + mouse.y, 0);
}

// from Irenic Htgd
function clickOrTouch(event) {
  event.preventDefault();
  var x, y;
  console.log('event button: ' + event.button);

  if (event.targetTouches && event.targetTouches[0]) {
    x = event.targetTouches[0].pageX;
    y = event.targetTouches[0].pageY;
  }
  else {
    x = event.clientX;
    y = event.clientY;
  }

  // setMousePos(x, y); // use APC5 version instead
  updateMousePos(event);

  if ((event.type == 'touchstart')) {
    // left click emulate
    mouse.button = 0;
    report("tap at x:" + mouse.x + " y:" + mouse.y, 1);
  }
  else {
    mouse.button = event.button;
    report("mousedown at x:" + mouse.x + " y:" + mouse.y, 1);
  }

  if (mouse.x > gameCanvas.width) {
    uiPos.x = mouse.x - gameCanvas.width;
    uiPos.y = mouse.y;
    ui_mousedownHandler();
  } else {
    field_mousedownHandler();
  }

} // end clickOrTouch

function setupInput() {
  drawingCanvas.addEventListener('mousemove', updateMousePos);
  drawingCanvas.addEventListener('touchstart', clickOrTouch);
  drawingCanvas.addEventListener('mousedown', clickOrTouch);
  // drawingCanvas.addEventListener('mouseup', mouseupHandler);

	document.addEventListener('keydown', keyPressed);
	document.addEventListener('keyup', keyReleased);
  player.setupInput(KEY_UP_ARROW, KEY_DOWN_ARROW, KEY_LEFT_ARROW, KEY_RIGHT_ARROW);
}

// function mousemoveHandler(evt) {
//   var mousePos = getMousePos(evt);
//   setDebug("cursor: " + mousePos.x + "," + mousePos.y, 0);
// }

// when click/tap UI bar
function ui_mousedownHandler() {
  // var mousePos = getMousePos(evt);
  // report("mousedown: " + mousePos.x + "," + mousePos.y, 1)

  if (gameState == STATE_MENU) {

    for (var i = 0; i < menuButtonLabel.length - 1; i++) {
      // report( buttonRects[i] );
      if (xyIsInRect(uiPos, buttonRects[i])) {
        report('Button down ' + i + ' ' + menuButtonLabel[i], 2)

        switch (menuButtonLabel[i]) {
          case "Play":
            if(!levelRunning) { // otherwise return to level mid-play
              levelRunning = true;
              playLevel++;
              currentLevel = playLevel;
              loadLevel(playLevel);
              checkGridMatchColsRows();
            }
            gotoPlay("canvasButton");
            break;

          case "Score":
            gotoScore("canvasButton");
            break;

          case "Help":
            gotoHelp("canvasButton");
            break;

          case "Credits":
            gotoCredits("canvasButton");
            break;

          // not working yet
          case "Quit":
            console.log('Sorry not working yet');
            window.close();
            break;

          // case "Editor":
          //   editMode = true;
          //   break;
        }
      } // if click/tap inside button area
    }
  }

  else if (gameState == STATE_PLAY) {
    for (var i = 0; i < playButtonLabel.length; i++) {
      if (xyIsInRect(uiPos, buttonRects[i])) {

        if(TOUCH_TEST) {
          report("Clicked inside rect " + playButtonLabel[i], 2);
        }

        switch (playButtonLabel[i]) {
          case "Left":
            player.keyHeld_left = true;
            touchArrowHandling(LEFT);
            break;

          case "Right":
            player.keyHeld_right = true;
            touchArrowHandling(RIGHT);
            break;

          case "Call":
            player.keyHeld_call = true;
            break;

          case "Send":
            player.keyHeld_send = true;
            break;

          case "Menu":
            gotoMenu("Play's CanvasButton Menu");
            break;

          case "Pause":
            togglePause();
            break;
        }
      }
    }
  }

  // currently only button is return to Menu, but will need
  // extra buttons for Replay and Adavance to next level.
  else if (gameState == STATE_LEVEL_OVER) {
    for (var i = 0; i < playButtonLabel.length; i++) {
      if (xyIsInRect(uiPos, buttonRects[i])) {
        if(TOUCH_TEST) {
          report("Clicked inside rect", playButtonLabel[i], 1);
        }
        switch (playButtonLabel[i]) {
          case "Menu":
            gotoMenu("LevelOver's CanvasButton Menu");
            break;
        }
      }
    }
  }

  else if (requireButtonGotoMenu()) {
    // could set Menu button at slot [4] or elsewhere
    if (xyIsInRect(uiPos, buttonRects[0])) {
      gameState = STATE_MENU;
      gotoMenu("DesignLevel's CanvasButton Menu");
    }
  }
} // end of mousedownHandler

// click or tap in field
function field_mousedownHandler() {
  if (gameState == STATE_DESIGN_LEVEL) {
    // select grid cell to outline
    gridIndex = getTileIndexAtPixelCoord(mousePos.x, mousePos.y);
    console.log("Designer", mousePos.x, mousePos.y, gridIndex);

    if (xyIsInRect(mousePos, buttonRects[4])) {
      report('Button return to menu', 1)
      gameState = STATE_MENU;
    }
  } // End of Design-Level mousedown handling
}

// not currently called
function mouseupHandler(evt) {
  var mousePos = getMousePos(evt);
  if(gameState ==  STATE_PLAY) {
    for (var i = 0; i < playButtonLabel.length; i++) {
      if (xyIsInRect(mousePos,buttonRects[i])) {

        switch (playButtonLabel[i]) {

          case "Left":
            player.keyHeld_left = false;
            touchArrowDebug();
            break;

          case "Right":
            player.keyHeld_right = false;
            touchArrowDebug();
            break;

          case "Call":
            // player.keyHeld_call = false;
            // not needed since there is a timer before next Call allowed
            break;

          case "Send":
            // code inefficient without setting false, but works
            if(TOUCH_TEST) {
              report("Avoid setting false keyHeld_send via mouseup, because (on Touch devices) true from mousedown gets negated immediately", 1);
            } else {
              player.keyHeld_send = false;
              // report("keyHeld_send = false because not Touch device", 1 );
            }
            break;
        }
      }
    }
  }
}

// handles in-game-level keyboard input
function arrowKeySet(evt, whichPlayer, setTo) {
  // this helps press & release functions are identical except for true/false
  if(evt.keyCode == whichPlayer.controlKeyLeft) {
		whichPlayer.keyHeld_left = setTo;
	}
	if(evt.keyCode == whichPlayer.controlKeyRight) {
		whichPlayer.keyHeld_right = setTo;
	}
	if(evt.keyCode == whichPlayer.controlKeyUp) {
		whichPlayer.keyHeld_call = setTo;
	}
	if(evt.keyCode == whichPlayer.controlKeyDown) {
		whichPlayer.keyHeld_send = setTo;
	}
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

    case STATE_LEVEL_OVER:
      if(key == KEY_ESC || key == KEY_M) {
        if(playLevel == LAST_LEVEL) {
          gameState = STATE_GAME_OVER;
          console.log("Game Over!");
        } else {
          gameState = STATE_MENU;
        }
      }

      if(key == KEY_R) {
        gameState = STATE_PLAY;
        if(!levelRunning) {
          levelRunning = true;
          loadLevel(playLevel);
          checkGridMatchColsRows();
        }
      }

      if(key == KEY_L) {
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
      break;

    case STATE_MENU:
      menuSound.play();

      if(key == KEY_C) {
        gameState = STATE_CREDITS;
      }

      if(key == KEY_P) {
        if(!levelRunning) { // otherwise return mid-level
          // this condition should be caught by levelOver handling
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

// for file output, not needed if downloader() is OK
// create.addEventListener('click', function () {
//   var link = document.getElementById('downloadlink');
//   link.href = makeTextFile(levelData);
//   link.style.display = 'block';
// }, false);
