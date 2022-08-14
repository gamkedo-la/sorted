const PLAIN = 0; // bitmap Normal
const BLUE = 1;
const RED = 2;

const NORMAL_PLAY = 0;
const DROP_A_ROW_FULL = 1;
const DROP_IN_COLUMN = 2;
// var testDrop = DROP_IN_COLUMN;
// var testDrop = DROP_A_ROW_FULL;
var testDrop = NORMAL_PLAY;
var testColumnSet = false;

const TEST_NAMES = ["not automating, normal play", "a full row of sheep will drop", "some sheep will drop in one column - currently can select column 0 to 9 by pressing number key"];

var testTeam = PLAIN;
var whichColumn = 10; // for automated test

var endLevelshowID = false; // otherwise show score per ball

