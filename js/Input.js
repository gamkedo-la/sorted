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

const KEY_F1 = 112;
const KEY_F2 = 113;
const KEY_F3 = 114;
const KEY_F4 = 115;
const KEY_F9 = 120;

var mouseX = 0;
var mouseY = 0;

function setupInput() {
	canvas.addEventListener('mousemove', updateMousePos);
	document.addEventListener('keydown', keyPressed);
	document.addEventListener('keyup', keyReleased);

  player.setupInput(KEY_UP_ARROW, KEY_DOWN_ARROW, KEY_LEFT_ARROW, KEY_RIGHT_ARROW);
}

function mouseTile(evt) {
  updateMousePos();
  tileIndex = getTileIndexAtPixelCoord(mouseX, mouseY);
  console.log(tileIndex)
}
function updateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;

	mouseX = evt.clientX - rect.left - root.scrollLeft;
	mouseY = evt.clientY - rect.top - root.scrollTop;
}

// because pressed & released identical except true/false
function keySet(evt, whichPlayer, setTo) {
  // console.log("Key: "+evt.keyCode, setTo);
  if(evt.keyCode == whichPlayer.controlKeyLeft) {
		whichPlayer.keyHeld_left = setTo;
	}
	if(evt.keyCode == whichPlayer.controlKeyRight) {
		whichPlayer.keyHeld_right = setTo;
	}
	if(evt.keyCode == whichPlayer.controlKeyUp) {
		whichPlayer.keyHeld_tractor = setTo;
	}
	if(evt.keyCode == whichPlayer.controlKeyDown) {
		whichPlayer.keyHeld_drop = setTo;
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
        gameState = STATE_MENU;
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
          currentLevel = nextLevel;
          levelRunning = true;
          // currentLevel++;
          loadLevel(currentLevel);
          checkGridMatchColsRows();
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
  }
  if(key == KEY_F9) {
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
		whichPlayer.keyHeld_tractor = setTo;
	}
	if(evt.keyCode == whichPlayer.controlKeyDown) {
		whichPlayer.keyHeld_drop = setTo;
	}
}