var debugBelowCanvas = false;
// no ITCH branch, now merged into main
var editMode = true;

const PLAIN = 0; // sheep normal colour
const BLUE = 1;
const RED = 2;
const MIXED = 3;

const LEFT = -1; // arrow key X direction
const RIGHT = +1;

const NORMAL_PLAY = 0;
const SEND_COLUMNS_CENTRE_ONLY = 1;
const SEND_ALL_X_ONE_COLUMN = 2;
const SEND_IN_COLUMN = 3;
const SEND_ALL_X_ALL_COLUMNS = 4;

const TEST_SEND_SPEED = 10;

const DEBUGS = 5;
var debugTextLine = Array(DEBUGS);
const DEBUG_TOP = 480;
const DEBUG_LINE_SP = 25;

var testMode = NORMAL_PLAY;
var testColumnSet = false; // flag to get column number from keypress
var testTimer = null;
var testLevel = 0;

var touchDevice = null; // tested in Main.js onload
var TOUCH_TEST = null; // enable to activate Touch handling code

var deviceScale = 1.0;
var DISPLAY_CUTOFF_TEST = null; //enable for devices (e.g. Retina) which are not displaying bottom and right of game area because of pixel scaling. Temporarily buttons top-left so that some navigation can be tested.

var deviceWidth = null;
var deviceHeight = null;

// toggle overlay grids for design/testing
var showAreaGridValues = false;
var showAgentGridValues = false;

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

function isTouchDevice() {
  return ( 'ontouchstart' in window ) ||
         ( navigator.maxTouchPoints > 0 ) ||
         ( navigator.msMaxTouchPoints > 0 );
}

function touchTest() {
  touchDevice = isTouchDevice() ? true : false;
  if (touchDevice) {
    report("Touch-device detected", 2);
  } else {
    report("Not a touch-device", 2);
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

function touchArrowHandling(direction) {
  if(TOUCH_TEST) {
    // direction, left is -1, right is +1
    player.speed += drivePower * direction;
    console.log("touchArrow ", drivePower, direction)
  }
}

function touchArrowDebug() {
  if(TOUCH_TEST) {
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
  drawDebugOnBar();
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