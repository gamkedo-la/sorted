const NORMAL_PLAY = 0;
const DROP_A_ROW_FULL = 1;
const DROP_IN_COLUMN = 2;
// var testDrop = DROP_IN_COLUMN;
// var testDrop = DROP_A_ROW_FULL;
var testDrop = NORMAL_PLAY;
var testColumnSet = false;

const TEST_NAMES = ["not automating, normal play", "a full row of sheep will drop", "some sheep will drop in one column - currently can select column 0 to 9 by pressing number key"];

var testTeam = 1;
var whichColumn = 9; // for automated test

var endLevelshowID = true; // otherwise show score per ball

