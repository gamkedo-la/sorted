const PLAIN = 0; // bitmap Normal
const BLUE = 1;
const RED = 2;
const MIXED = 3;

const NORMAL_PLAY = 0;
const DROP_A_ROW_FULL = 1;
const DROP_IN_COLUMN = 2;
// var testMode = DROP_IN_COLUMN;
// var testMode = DROP_A_ROW_FULL;
var testMode = NORMAL_PLAY;
var testColumnSet = false; // flag to get column number from keyb
const AGENT_GRID = false; // toggle overlay grid for testing

const TOUCH_TEST = false; // touch devices test code
// screen click to reach Play; 

var idLabel = false;
var timerLabel = true;
var modeLabel = true;

const TEST_NAMES = ["not automating, normal play", "a full row of sheep will drop", "some sheep will drop in one column - currently can select column 0 to 9 by pressing number key"];

var testTeam = MIXED; // both teams, as in normal play
var whichColumn = 10; // for automated test

var endLevelshowID = false; // otherwise show score per ball

// var playedLevel = Array(NUM_LEVELS); // play sequence
// playedLevel.fill(false);