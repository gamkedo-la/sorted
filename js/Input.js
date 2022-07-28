const KEY_LEFT_ARROW = 37;
const KEY_UP_ARROW = 38;
const KEY_RIGHT_ARROW = 39;
const KEY_DOWN_ARROW = 40;

const KEY_W = 87;
const KEY_A = 65;
const KEY_S = 83;
const KEY_D = 68;

const KEY_M = 77;
const KEY_C = 67;
const KEY_P = 80;

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

var mouseX = 0;
var mouseY = 0;

function setupInput() {
	canvas.addEventListener('mousemove', updateMousePos);
	document.addEventListener('keydown', keyPressed);
	document.addEventListener('keyup', keyReleased);

  player.setupInput(KEY_UP_ARROW, KEY_DOWN_ARROW, KEY_LEFT_ARROW, KEY_RIGHT_ARROW);
}

function updateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;

	mouseX = evt.clientX - rect.left - root.scrollLeft;
	mouseY = evt.clientY - rect.top - root.scrollTop;
}

// because pressed & released identical except true/false
function keySet(evt, whichCar, setTo) {
  // console.log("Key: "+evt.keyCode, setTo);
  if(evt.keyCode == whichCar.controlKeyLeft) {
		whichCar.keyHeld_left = setTo;
	}
	if(evt.keyCode == whichCar.controlKeyRight) {
		whichCar.keyHeld_right = setTo;
	}
	if(evt.keyCode == whichCar.controlKeyUp) {
		whichCar.keyHeld_tractor = setTo;
	}
	if(evt.keyCode == whichCar.controlKeyDown) {
		whichCar.keyHeld_drop = setTo;
	}
}

function keyState(key) {
  switch (gameState) {

    case STATE_PLAY:
      if(key == KEY_M) {
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
        break;
      }
      if(editMode) {
        if(key >= KEY_NUM_1 && key <= KEY_NUM_9) {
          currentLevel = key - KEY_NUM_0; // 1 on keyb is code 49
          console.log("Level number now =", currentLevel);
          loadLevel(currentLevel);
          checkGridMatchColsRows();
          gameState = STATE_PLAY;
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

    default:
      break;
  }
}

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
  
  
  // loadLevel(levelList[currentLevel-1]);
  // gameState = STATE_PLAY;
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