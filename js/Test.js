const releaseVersion = false;
var editMode;
if (releaseVersion) {
  editMode = false;
} else {
  editMode = true;
}

const NORMAL_PLAY = 0;
const SEND_ONLY = 1;
const SEND_SEQ_ONLY = 6;
const SEND_ROAM = 2;
const ROAM_FROM_R1 = 3;
const CALL_FROM_R10 = 4;
const AI_PLAY_MIDFIELD = 5;
const LOST_FOCUS = 8;
const GAME_OVER = 9;
var runMode = NORMAL_PLAY;
var previousRunMode = runMode;

var testWrite = false; // not saving test report files

// number of Test types currently usable
const NUM_TEST_TYPES = 3;

var hastenTest = true;
var haste = 1;
var hasteSet = false;

// SEND best slow until all Send expire, then only roaming so go fast - array is timeStep when to switch haste multiplier.

const PLAY_SPEED = 0;

const TEST_DESCRIPTION = ["NORMAL play, not automating.", "SEND a sheep from each column.", "SEND from each column then ROAM.", "ROAM from top row, n=columns.", "CALL sheep placed at bottom row.", "AI autoplay call & send, n=cols"];

var testColumnSet = true; // flag to get column number from keypress
var testTimer = null;
var testLevel = 0;

const baseFPS = 20;

const PLAIN = 7; // sheep normal colour
const BLUE = 1;
const RED = 2;
const MIXED = 3;

const LEFT = -1; // arrow key X direction
const RIGHT = +1;

var debugBelowCanvas = false;
const DEBUGS = 5;
var debugTextLine = Array(DEBUGS);
debugTextLine[0] = 'Cursor Location'
debugTextLine[1] = 'Play Activation Method'
debugTextLine[2] = 'Draw Scale (x,y)'
debugTextLine[3] = 'Mouse Dn (x,y)/Pixel Ratio'
debugTextLine[4] = 'Canvas Size'
const DEBUG_TOP = 480;
const DEBUG_LINE_SP = 25;

var touchDevice = null; // tested in Main.js onload
var TOUCH_TEST = null; // enable to activate Touch handling code

var deviceScale = 1.0;
var DISPLAY_CUTOFF_TEST = null; //enable for devices (e.g. Retina) which are not displaying bottom and right of game area because of pixel scaling. Temporarily buttons top-left so that some navigation can be tested.

var deviceWidth = null;
var deviceHeight = null;

// toggle overlay grids for design/testing
var showAreaGridValues = false;
var showAgentGridValues = false;
var showGridIndex = false;
var showColRow = false;

var idLabel = false;
var timerLabel = true;
var modeLabel = true;

var sheepSelected = null; // sheep selected for manual move
const SELECT_RANGE = 40;

var stacking = false;

// for increment of test output filename
// var testCount = Array(NUM_LEVELS);
// testCount.fill(0);

var testTeam = PLAIN; // both teams, as in normal play
var whichColumn = 10; // for automated test

var endLevelShowID = false; // otherwise show score per ball

// var playedLevel = Array(NUM_LEVELS); // play sequence
// playedLevel.fill(false);

const SEPARATOR = "\t"; // ", "


function isTouchDevice() {
  return ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0);
}

function touchTest() {
  touchDevice = isTouchDevice() ? true : false;
  if (touchDevice) {
    report("Touch-device detected", 2);
  } else {
    report("Not a touch device", 2);
  }
  TOUCH_TEST = touchDevice ? true : false;
}

function scalingTest() {
  deviceScale = window.devicePixelRatio;
  report("devicePixelRatio = " + deviceScale, 3);
  // if (touchDevice && deviceScale >= 2) {
  //   report("Device is using double-scale pixels", 3);
  // }
}

function displayTest() {
  deviceWidth = window.innerWidth;
  deviceHeight = window.innerHeight;
  report("width " + deviceWidth + " height " + deviceHeight, 4);
}

// runs in Main.js onload
function deviceTests() {
  touchTest();
  displayTest();
  scalingTest();
}


function testResult() {
  var output = "Level " + currentLevel + " - " + TEST_DESCRIPTION[runMode] + "\n";

  output += "sentX" + SEPARATOR + "endCol" + SEPARATOR + "state" + SEPARATOR + "endTime\n";
  var txtLine;

  for (var i = 0; i < FLOCK_SIZE[currentLevel]; i++) {
    // nice idea but sheep object contains functions as well as properties
    // txtLine = Object.values(sheepList[i]).join(',');
    txtLine = "";
    txtLine += sheepList[i].sentX + SEPARATOR;
    txtLine += sheepList[i].endCol + SEPARATOR;
    txtLine += sheepList[i].mode + SEPARATOR;
    txtLine += sheepList[i].endTime;
    output += txtLine + "\n";
  }
  return output;
}


function playResult() {
  var output = "Level " + currentLevel + " - play result\n";
  output += "ID" + SEPARATOR + "team" + SEPARATOR + "sentX" + SEPARATOR + "col" + SEPARATOR + "state" + SEPARATOR + "score" + SEPARATOR + "begin" + SEPARATOR + "endTime\n";
  var txtLine;
  for (var i = 0; i < FLOCK_SIZE[currentLevel]; i++) {
    // nice idea but sheep object contains functions as well as properties
    // txtLine = Object.values(sheepList[i]).join(',');
    txtLine = "";
    txtLine += sheepList[i].id + SEPARATOR;
    txtLine += sheepList[i].team + SEPARATOR;
    txtLine += sheepList[i].sentX + SEPARATOR;
    txtLine += sheepList[i].endCol + SEPARATOR;
    txtLine += sheepList[i].mode + SEPARATOR;
    txtLine += sheepList[i].score + SEPARATOR;
    txtLine += sheepList[i].beginTime + SEPARATOR;
    txtLine += sheepList[i].endTime;
    output += txtLine + "\n";
  }
  return output;
}

function touchArrowHandling(direction) {
  if (TOUCH_TEST) {
    // direction, left is -1, right is +1
    player.speed += drivePower * direction;
    console.log("touchArrow ", drivePower, direction)
  }
}

function touchArrowDebug() {
  if (TOUCH_TEST) {
    let msg = "in Input::MouseDown player.keyHeld_left=" + player.keyHeld_left + " keyHeld_right=" + player.keyHeld_right;
    report(msg, 3);
  }
}

const debugDiv = document.getElementById("debug");
function makeParagraphsBelowCanvas() {
  for (var i = 0; i < DEBUGS; i++) {
    var p = document.createElement("p");
    p.setAttribute("id", "debug_" + i);
    p.classList.add("debug_" + i);
    p.innerHTML = "debug " + i;
    p.style.color = "white";
    debugDiv.appendChild(p);
  }
}

function resetDebugText() {
  debugTextLine.fill('--');
}

// call from drawAll()
function showDebugText() {
  uiContext.font = "12px Arial";
  // drawDebugOnBar();
  if (debugBelowCanvas) {
    writeDebugP();
  }
}

function drawDebugOnBar() {
  for (var i = 0; i < DEBUGS; i++) {
    let msg = debugTextLine[i];
    let debugY = DEBUG_TOP + i * DEBUG_LINE_SP;
    colorText(uiContext, debugTextLine[i], 10, debugY, "white");
  }
}

function writeDebugP() {
  for (var i = 0; i < DEBUGS; i++) {
    let id = "debug_" + i;
    let msg = debugTextLine[i];
    document.getElementById(id).innerHTML = msg;
  }
}

function report(msg, debugN) {
  console.log(msg);
  setDebug(msg, debugN);
}

function setDebug(msg, debugN) {
  debugTextLine[debugN] = msg;
}

const debugLevelTransition = false;
function drawDebug() {
  debugTextLine[1] = "currentLevel=" + currentLevel;
  debugTextLine[2] = "levelRunning=" + levelRunning;
}

function isAnySendOrConvey() {
  for (var i = 0; i < FLOCK_SIZE[currentLevel]; i++) {
    if (sheepList[i].mode == SENT || sheepList[i].mode == CONVEYOR) {
      return true;
    }
  }
  return false;
}

function isAnySending() {
  for (var i = 0; i < FLOCK_SIZE[currentLevel]; i++) {
    if (sheepList[i].mode == SENT) {
      return true;
    }
  }
  return false;
}

function allRoamGrazeOrDone() {
  var grazeRoamOrDone = 0;
  for (var i = 0; i < FLOCK_SIZE[currentLevel]; i++) {
    if (sheepList[i].mode == ROAM || sheepList[i].mode == GRAZE || sheepList[i].levelDone) {
      grazeRoamOrDone++;
    }
  }
  if (grazeRoamOrDone == FLOCK_SIZE[currentLevel]) {
    return true;
  } else {
    return false;
  }
}


function writeTestResult() {
  if (levelTestDataReady) {
    levelTestDataReady = false;
    var filename = "level_" + currentLevel + "_";
    // sheep outcome data file downloads automatically

    if (runMode == NORMAL_PLAY) {
      levelData = playResult();
      filename += "play.tsv";
      downloader(filename, levelData);
      console.log("Results of play downloaded to " + filename);
    }
    else {
      levelData = testResult();
      filename += "test.tsv";
      downloader(filename, levelData);
      console.log("Results of test downloaded to " + filename);
      console.log("Level " + currentLevel + " completed. Score " + levelScore);
    }
  }// end levelTestDataReady, run once when level completed
}