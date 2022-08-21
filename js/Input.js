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

const NUM_BUTTONS = 6;
// arrowKeys, Menu, Pause?

const TOP_HALF_SCREEN = {
  x: 0, y: 0, width: 840, height: 200
}

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

//Function to check whether a point is inside a rectangle
function xyIsInRect(pos, rect) {
  return pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.height && pos.y > rect.y
}

function setupInput() {
  canvas.addEventListener('mousedown', function(evt) {
    var mousePos = getMousePos(evt);

    if (gameState != STATE_PLAY && TOUCH_TEST == true) {
      if (xyIsInRect(mousePos, TOP_HALF_SCREEN)) {
        console.log("Level number now =", currentLevel);
        levelRunning = true;
        loadLevel(currentLevel);
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
              player.keyHeld_left = true;
if(TOUCH_TEST) {
  console.log("Mousedown keyHeld_left", player.keyHeld_left)
}     
              break;
            case "Right":
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
          }
        }
      }
    }
  }, false);
   
  canvas.addEventListener('mouseup', function(evt) {
    var mousePos = getMousePos(evt);

    for(var i=0; i<NUM_BUTTONS; i++) {
      if (xyIsInRect(mousePos,buttonRects[i])) {
        switch(buttonNames[i]) {
          case "Left":
            player.keyHeld_left = false;
if(TOUCH_TEST) {
  console.log("Mouseup keyHeld_left", player.keyHeld_left)
}
            break;
          case "Right":
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
  }, false);

  canvas.addEventListener('mousemove', mousemoveHandler);
  // canvas.addEventListener('mousedown', mousedownHandler);

	document.addEventListener('keydown', keyPressed);
	document.addEventListener('keyup', keyReleased);

  player.setupInput(KEY_UP_ARROW, KEY_DOWN_ARROW, KEY_LEFT_ARROW, KEY_RIGHT_ARROW);
}

function mousemoveHandler(evt) {
  var mousePos = getMousePos(evt);
  document.getElementById("debug_3").innerHTML = "Cursor: " + mousePos.x + "," + mousePos.y;
}
function mousedownHandler(evt) {
  gameState = STATE_HELP;
}

function mouseTile(evt) {
  updateMousePos();
  tileIndex = getTileIndexAtPixelCoord(mouseX, mouseY);
  console.log(tileIndex)
}

// because pressed & released identical except true/false
function keySet(evt, whichPlayer, setTo) {
  // console.log("Key: "+evt.keyCode, setTo);
  if(evt.keyCode == whichPlayer.controlKeyLeft) {
		whichPlayer.keyHeld_left = setTo;
// console.log("keyHeld_left", setTo);
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

function keyState(key) {
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
    case STATE_SCOREBOARD:
      if(key == KEY_ESC || key == KEY_M) {
        gameState = STATE_MENU;
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
          if(testMode == NORMAL_PLAY || testMode == DROP_A_ROW_FULL || testColumnSet) {
            currentLevel = key - KEY_NUM_0; // 1 on keyb is code 49
            // console.log("Level number now =", currentLevel);
            levelRunning = true;
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

// usable from any gameState?
// what is the difference between keyState() and keyMode()?
function keyMode(key) {
  if(key == KEY_F1) {
    editMode = !editMode; // toggle
  }
  if(key == KEY_F2) {
    nearGoal = !nearGoal; // toggle
    if(nearGoal) {
      saveGrid = areaGrid.slice();
      insertNearGoal();
    }
  }
  if(key == KEY_F3) {
    endLevelshowID = !endLevelshowID; // toggle
    if(endLevelshowID) {
      console.log("At end of Level show sheep ID for debugging.")
    } else {
      console.log("At end of Level show points awarded for each sheep.")
    }
  }
  if(key == KEY_F4) {
    test_EndLevel();
    levelRunning = false;
  }
  if(key == KEY_F5) {
    timerLabel = !timerLabel; // toggle
    console.log("Timer label is", timerLabel)
  }

  if(key == KEY_A) {
    // testMode = !testMode; // toggle
    testMode++;
    if(testMode > 2) {
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

// maybe flip set keyHeld_
function keyPressed(evt) {
  keySet(evt, player, true);
  keyMode(evt.keyCode); // toggle Edit mode
  keyState(evt.keyCode); // play, menu, or credits
	evt.preventDefault();
}

function keyReleased(evt) {
  keySet(evt, player, false);
}

function buttonMenu() {
  gameState = STATE_MENU;
}
function buttonLeft() {
  player.keyHeld_left = true;
}
function buttonRight() {
  player.keyHeld_right = true;
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