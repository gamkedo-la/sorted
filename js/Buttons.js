var barButtonInactive = null;

const menuButtonLabel = ["Play", "Score", "Help", "Credits", "Quit"];
const playButtonLabel = ["Left", "Right", "Call", "Send", "Pause", "End", "Menu"];
const pauseButtonLabel = ["Resume"];
const levelEndButtonLabel = ["Replay", "Advance", "Menu"];
const gameOverButtonLabel = ["Restart", "Menu", "Quit"];
const offMenuButtonLabel = ["Menu"];
const editmodeButtonLabel = ["Test", "Team", "Player"];
const designButtonLabel = []; // need bar for tile/agent info

var buttonsTop = 80;
var buttonsLeft = 10;
const buttonWidth = 60;
const buttonHeight = 60;
const buttonGap = 10;
const buttonRects = [];

function initButtonRects() {
  // max num rect/buttons are in play state
  for (var i = 0; i < playButtonLabel.length; i++) {
    buttonRects[i] = {
      x: buttonsLeft,
      y: buttonsTop + i * (buttonHeight + buttonGap),
      width: buttonWidth,
      height: buttonHeight,
    };
  }
}

function drawBarTitle(txt, fontSize) {
  uiContext.font = fontSize + "px Arial";
  colorText(uiContext, txt, buttonsLeft, 30, "white");
}

function drawBarButtons(btnList) {
  var lineWidth = 1;
  uiContext.lineWidth = lineWidth;
  for (var i = 0; i < btnList.length; i++) {
    colorRectBorder(
      uiContext,
      buttonRects[i].x,
      buttonRects[i].y,
      buttonRects[i].width,
      buttonRects[i].height,
      "white",
      "red",
      lineWidth
    );
    uiContext.textAlign = "left";
    uiContext.font = "14px Arial";
    // magic numbers position text on button
    colorText(
      uiContext,
      btnList[i],
      5 + buttonRects[i].x,
      25 + buttonRects[i].y,
      "black"
    );
  }
}

function requireButtonGotoMenu() {
  return (
    gameState == STATE_CREDITS ||
    gameState == STATE_HELP ||
    gameState == STATE_SCOREBOARD
  );
}

function touchstartPlayHandler() {
  if (!levelRunning) {
    levelRunning = true;
    currentLevel++;
    loadLevel(currentLevel);
    checkGridMatchColsRows();
  }
  gotoPlay("bar touchstart Play");
}

function touchstartScoreHandler() {
  gotoScore("bar touchstart Score");
}

function touchstartHelpHandler() {
  gotoHelp("bar touchstart Help");
}

function touchstartCreditsHandler() {
  gotoCredits("bar touchstart Credits");
}

function touchstartQuitHandler() {
  window.close();
}

// handle touchstarts on Play screen
function touchstartLeftHandler() {
  player.keyHeld_left = true;
}

function touchstartRightHandler() {
  player.keyHeld_right = true;
}
function touchstartCallHandler() {
  player.keyHeld_call = true;
}
function touchstartSendHandler() {
  player.keyHeld_send = true;
}

// touchend - try to false keyHeld
function touchendLeftHandler() {
  player.keyHeld_left = false;
}
function touchendLeftHandler() {
  player.keyHeld_right = false;
}
function touchendCallHandler() {
  player.keyHeld_call = false;
}
function touchendSendHandler() {
  player.keyHeld_send = false;
}

function touchstartMenuHandler() {
  gotoMenu("bar touchstart Menu");
}
function touchstartPauseHandler() {
  togglePause();
}
