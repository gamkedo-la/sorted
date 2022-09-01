const PLAIN = 0; // bitmap Normal
const BLUE = 1;
const RED = 2;
const MIXED = 3;

const NORMAL_PLAY = 0;
const SEND_COLUMNS_CENTRE_ONLY = 1;
const SEND_ALL_X_ONE_COLUMN = 2;
const SEND_IN_COLUMN = 3;
const SEND_ALL_X_ALL_COLUMNS = 4;

const TEST_SEND_SPEED = 10;

var testMode = NORMAL_PLAY;
var testColumnSet = false; // flag to get column number from keyb
var testTimer = null;

// toggle overlay grids for design/testing
var showAreaGridValues = false;
var showAgentGridValues = false;

const ITCH = false; // touch devices test code
// screen click to reach Play; 
var editMode = (ITCH) ? false : true;
const TOUCH_TEST = (ITCH) ? true : false;

var idLabel = false;
var timerLabel = true;
var modeLabel = true;

const TEST_NAMES = ["not automating, normal play", "from each column's centre a sheep will be Sent", "every X in one column - select column 0 to 9 by using number key", "sheep Sent to stack from one column centre - select column 0 to 9 using number key", "testing Send from every X location in all columns"];

var testTeam = MIXED; // both teams, as in normal play
var whichColumn = 10; // for automated test

var endLevelShowID = false; // otherwise show score per ball

// var playedLevel = Array(NUM_LEVELS); // play sequence
// playedLevel.fill(false);

const SEPARATOR = "\t"; // ", "

function testResult() {
  var output = "Level " + currentLevel + " - test send from ";
  if(testMode == SEND_COLUMNS_CENTRE_ONLY) {
    output += "centre of each column\n";
  }
  else if(testMode == SEND_ALL_X_ONE_COLUMN) {
    output += "all X of one column\n";
  }

  output += "sentX" + SEPARATOR + "col" + SEPARATOR + "state" + SEPARATOR + "endTime\n";
  var txtLine;
  for(var i=0; i<FLOCK_SIZE[currentLevel]; i++) {
    // nice idea but sheep object contains functions as well as properties
    // txtLine = Object.values(sheepList[i]).join(',');
    txtLine = "";
    txtLine += sheepList[i].sentX + SEPARATOR;
    txtLine += sheepList[i].endCol + SEPARATOR;
    txtLine += sheepList[i].state + SEPARATOR;
    txtLine += sheepList[i].endTime;
    output += txtLine + "\n";
  }
  return output;
}

function playResult() {
  var output = "Level " + currentLevel + " - play result\n";
  output += "ID" + SEPARATOR + "team" + SEPARATOR + "sentX" + SEPARATOR + "col" + SEPARATOR + "state" + SEPARATOR + "score" + SEPARATOR + "begin"  + SEPARATOR + "endTime\n";
  var txtLine;
  for(var i=0; i<FLOCK_SIZE[currentLevel]; i++) {
    // nice idea but sheep object contains functions as well as properties
    // txtLine = Object.values(sheepList[i]).join(',');
    txtLine = "";
    txtLine += sheepList[i].id + SEPARATOR;
    txtLine += sheepList[i].team + SEPARATOR;
    txtLine += sheepList[i].sentX + SEPARATOR;
    txtLine += sheepList[i].endCol + SEPARATOR;
    txtLine += sheepList[i].state + SEPARATOR;
    txtLine += sheepList[i].score + SEPARATOR;
    txtLine += sheepList[i].beginTime + SEPARATOR;
    txtLine += sheepList[i].endTime;
    output += txtLine + "\n";
  }
  return output;
}