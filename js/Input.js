var keyHeld_left = false;
var keyHeld_right = false;

const KEY_LEFT_ARROW = 37;
const KEY_UP_ARROW = 38;
const KEY_RIGHT_ARROW = 39;
const KEY_DOWN_ARROW = 40;

const KEY_W = 87;
const KEY_A = 65;
const KEY_S = 83;
const KEY_D = 68;

const KEY_ESC = 27;
const KEY_M = 77;
const KEY_C = 67;
const KEY_P = 80;
const KEY_H = 72;
const KEY_T = 84;

const KEY_NUM_0 = 48;
const KEY_NUM_1 = 49;
const KEY_NUM_2 = 50;
const KEY_NUM_3 = 51;
const KEY_NUM_4 = 52;
const KEY_NUM_5 = 53;
const KEY_NUM_6 = 54;
const KEY_NUM_7 = 55;
const KEY_NUM_8 = 56;
const KEY_NUM_9 = 57;

const KEY_F1 = 112; // editMode
const KEY_F2 = 113;
const KEY_F3 = 114;
const KEY_F4 = 115;
const KEY_F5 = 116;
const KEY_F6 = 117;
const KEY_F7 = 118;
const KEY_F8 = 119;
const KEY_F9 = 120;

var mouseX = 0;
var mouseY = 0;

const TOP_HALF_SCREEN = { // for testing iPad
  x: 0, y: 0, width: 840, height: 200
}

function setupInput() {
  canvas.addEventListener('mousemove', mousemoveHandler);
  canvas.addEventListener('mousedown', mousedownHandler);
  canvas.addEventListener('mouseup', mouseupHandler);

	document.addEventListener('keydown', keyPressed);
	document.addEventListener('keyup', keyReleased);

  player.setupInput(KEY_UP_ARROW, KEY_DOWN_ARROW, KEY_LEFT_ARROW, KEY_RIGHT_ARROW);
}

var debug5txt = '';
const NUM_BUTTONS = 6; // arrowKeys, Menu, Pause
const buttonRects = []; //Array[NUM_BUTTONS];
const buttonTop = 586;
const buttonsLeft = 538; // 840-538=302 6btns@50px
const buttonWidth = 50;
const buttonHeight = 42;
const buttonNames = ["Left", "Right", "Call", "Send", "Menu", "Pause"];
for(var i=0; i<NUM_BUTTONS; i++) {
  buttonRects[i] = {
    x: buttonsLeft + i * buttonWidth,
    y: buttonTop,
    width: buttonWidth,
    height: buttonHeight
  };
}

function mousemoveHandler(evt) {
  var mousePos = getMousePos(evt);
  debug5txt = "Cursor: " + mousePos.x + "," + mousePos.y;
}

function mousedownHandler(evt) {
  var mousePos = getMousePos(evt);

  if (gameState != STATE_PLAY && gameState != STATE_LEVEL_OVER) {

    if (TOUCH_TEST && xyIsInRect(mousePos, TOP_HALF_SCREEN)) {
      console.log('Loading level from upper-screen click, used for testing iPad and other touch devices.');
      loadLevel(currentLevel);
      levelRunning = true;
      console.log("Level number now =", currentLevel);
      gameState = STATE_PLAY;
    }
  } else {
    for(var i=0; i<NUM_BUTTONS; i++) {
      if (xyIsInRect(mousePos,buttonRects[i])) {

        if(TOUCH_TEST) {
          console.log("Clicked inside rect", buttonNames[i]);
        }             
        
        switch(buttonNames[i]) {
          case "Left":
            keyHeld_left = true;
            buttonLeftPress();
            // player.keyHeld_left = true;   
            break;
          case "Right":
            keyHeld_right = true;
            player.keyHeld_right = true;
            break;
          case "Call":
            player.keyHeld_call = true;
            break;
          case "Send":
            player.keyHeld_send = true;
            break;
          case "Menu":
            gameState = STATE_MENU;
            break;
          case "Pause":
            console.log("Pause is warmup task on Trello");
            break;
        }

        if(TOUCH_TEST) {
          let msg = "in Input::Mousedown player.keyHeld_left=" + player.keyHeld_left + " keyHeld_right=" + player.keyHeld_right;
          console.log(msg);
          document.getElementById("debug_2").innerHTML = msg; 
        }  
      }
    }
  }
}

function mouseupHandler(evt) { 
  var mousePos = getMousePos(evt);
  for(var i=0; i<NUM_BUTTONS; i++) {
    if (xyIsInRect(mousePos,buttonRects[i])) {
      switch(buttonNames[i]) {
        case "Left":
          keyHeld_left = false;
          buttonLeftRelease();
          // player.keyHeld_left = false;
if(TOUCH_TEST) {
console.log("Mouseup keyHeld_left", player.keyHeld_left)
}
          break;
        case "Right":
          keyHeld_right = false;
          player.keyHeld_right = false;
          break;
        case "Call":
          player.keyHeld_call = false;
          break;
        case "Send":
          player.keyHeld_send = false;
          break;
      }
    }
  }
}

function mouseTile(evt) {
  updateMousePos();
  tileIndex = getTileIndexAtPixelCoord(mouseX, mouseY);
  console.log(tileIndex)
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
      if(key == KEY_ESC || key == KEY_M) {
        gameState = STATE_MENU;
      }
      break;

    case STATE_LEVEL_OVER:
      if(key == KEY_ESC || key == KEY_M) {
        if(currentLevel == LAST_LEVEL) {
          gameState = STATE_GAME_OVER;
          console.log("Game Over!");
        } else {
          gameState = STATE_MENU;
        }
      }
      break;

    case STATE_MENU:
      if(key == KEY_C) {
        gameState = STATE_CREDITS;
        break;
      }
      if(key == KEY_P) {
        gameState = STATE_PLAY;
        if(!levelRunning) {
          if(currentLevel == LAST_LEVEL) {
            console.log("No more Levels!");
          } else {
            levelRunning = true;
            currentLevel++;
console.log('Loading from menu key P.');
// console.log("Level number now =", currentLevel);
            loadLevel(currentLevel);
            checkGridMatchColsRows();
          }
        }
        break;
      }
      if(key == KEY_S) {
        gameState = STATE_SCOREBOARD;
        break;
      }
      if(key == KEY_H) {
        gameState = STATE_HELP;
        break;
      }
      if(editMode) {
        if(key >= KEY_NUM_0 && key <= KEY_NUM_9) {
          if(testMode == NORMAL_PLAY || testMode == SEND_ALL_X_ALL_COLUMNS || testMode == SEND_COLUMNS_CENTRE_ONLY || testColumnSet) {
          // if(testMode == NORMAL_PLAY || testMode == SEND_ALL_X_ALL_COLUMNS || testMode == SEND_COLUMNS_CENTRE_ONLY || testMode == SEND_ALL_X_ONE_COLUMN || testColumnSet) {
            currentLevel = key - KEY_NUM_0; // 1 on keyb is code 49
            levelRunning = true;
// console.log('Loading level from editMode menu with Num-key');
// console.log("Level number now =", currentLevel);
            loadLevel(currentLevel);
            checkGridMatchColsRows();
            gameState = STATE_PLAY;
          } else {
            whichColumn = key - KEY_NUM_0;
            console.log("Test column = " + whichColumn + ". Now select a level.");
            testColumnSet = true;
          }
        }
      }
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
      console.log('Tiles occupied by out-of-play sheep are labelled "1"')
    }
    else if(showAgentGridValues) {
      showAgentGridValues = false;

    }
  }
  
  function noGridValuesDisplay() {
    return (!showAreaGridValues && !showAgentGridValues)
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

// mouse-clickable on-screen buttons
function buttonMenu() {
  gameState = STATE_MENU;
}
function buttonLeftPress() {
  // debug5txt  = "inside buttonLeftPress()"
  player.keyHeld_left = true;
}
function buttonRight() {
  player.keyHeld_right = true;
}
function buttonLeftRelease() {
  player.keyHeld_left = false;
}
function buttonSet(setTo) {
  // console.log("Key: "+evt.keyCode, setTo);
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

// for file output, not needed if downloader() is OK
// create.addEventListener('click', function () {
//   var link = document.getElementById('downloadlink');
//   link.href = makeTextFile(levelData);
//   link.style.display = 'block';
// }, false);
