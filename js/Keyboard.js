// keyboard
var keyHeld_left = false; // car-style accelerator
var keyHeld_right = false;

const KEY_LEFT_ARROW = 37; // player movement
const KEY_RIGHT_ARROW = 39;
const KEY_UP_ARROW = 38; // Call
const KEY_DOWN_ARROW = 40; // Send
const KEY_SPACE = 32; // Pause

const KEY_M = 77; // Menu
const KEY_U = 85; // Music toggle
const KEY_S = 83; // Scoreboard
const KEY_H = 72; // Help
const KEY_C = 67; // Credits
const KEY_ESC = 27; // Menu alternative

const KEY_P = 80; // Play
const KEY_R = 82; // Replay level
const KEY_L = 76; // Advance to next level

const KEY_D = 68; // Design level
const KEY_A = 65; // Automated tests, select
const KEY_T = 84; // Team colour for automated test

// currently used differently in two contexts:
// level number, from editMode's Menu
// tile-type, in Level Designer (until visual picker made)
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
const KEY_F4 = 115; // end a Level prematurely
const KEY_F5 = 116;
const KEY_F6 = 117; // overlay grid tileType OR occupied
const KEY_F7 = 118; // level number cycle through, in Level Designer
const KEY_F8 = 119;
const KEY_F9 = 120;

function isArrowKey(keyCode) {
  return ( keyCode == KEY_LEFT_ARROW ||keyCode == KEY_RIGHT_ARROW || keyCode == KEY_UP_ARROW || keyCode == KEY_DOWN_ARROW )
}

function isFunctionKey(keyCode) {
  return ( keyCode == KEY_F1 || keyCode == KEY_F2 || keyCode == KEY_F3 || keyCode == KEY_F4 || keyCode == KEY_F5 || keyCode == KEY_F6 || keyCode == KEY_F7 || keyCode == KEY_F8 || keyCode == KEY_F9 )
}