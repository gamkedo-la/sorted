const BAR = document.getElementById("bar");

const menuButtonList = ["Play", "Score", "Help", "Credits", "Quit"];
const playButtonList = ["Left", "Right", "Call", "Send", "Pause", "Menu"];
const levelEndButtonList = ["Replay", "Advance", "Menu"];
const gameOverButtonList = ["Restart", "Menu", "Quit"];
const offMenuButtonList = ["Menu"];
const designButtonList = ["Menu"];
const editmodeButtonList = ["Test", "Team", "Player"];
var functionName = null;

function makeBarButtons(btnList) {
  for (var i=0; i<btnList.length; i++) {
    var btn = document.createElement("button");
    btn.classList.add("button");
    btn.innerHTML = btnList[i];
    functionName = "touchstart" + btnList[i] + 'Handler';
    btn.addEventListener('touchstart', window[functionName]);
    btn.addEventListener('mousedown', window[functionName]);
    if ( needsTouchEnd( btnList[i] ) ) {
      functionName = "touchend" + btnList[i] + 'Handler';
      btn.addEventListener('touchend', window[functionName]);
      btn.addEventListener('mouseup', window[functionName]);
      console.log(functionName)
    }
    BAR.appendChild(btn);
  }
}

function needsTouchEnd(btn) {
  return btn == "Left" || btn == "Right" || btn == "Call" || btn == "Send"
}

function requireButtonGotoMenu() {
  return gameState == STATE_CREDITS || gameState == STATE_HELP || gameState == STATE_SCOREBOARD
}

function touchstartPlayHandler() {
  if(!levelRunning) {
    levelRunning = true;
    playLevel++;
    currentLevel = playLevel;
    loadLevel(playLevel);
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
  player.keyHeld_left =false;
}
function touchendLeftHandler() {
  player.keyHeld_right =false;
}
function touchendCallHandler() {
  player.keyHeld_call =false;
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

// old buttons on canvas
function drawMenuButtons() {
  canvasContext.lineWidth = 1;
  for(var i=0; i<MENU_BUTTONS_NUM-1; i++) {
    colorRectBorder(buttonRects[i].x, buttonRects[i].y, buttonRects[i].width, buttonRects[i].height, "white", "red", 1);
    canvasContext.textAlign = "left";
    canvasContext.font = "14px Arial";
    colorText(menuButtonNames[i], 5+buttonRects[i].x, 20+buttonRects[i].y, "black");
  }
}

function drawPlayButtons() {
  canvasContext.lineWidth = 1;
  for(var i=0; i<PLAY_BUTTONS_NUM; i++) {
    colorRectBorder(buttonRects[i].x, buttonRects[i].y, buttonRects[i].width, buttonRects[i].height, "white", "red", 1);
    canvasContext.font = "14px Arial";
    canvasContext.textAlign = "left";
    colorText(playButtonNames[i], 5+buttonRects[i].x, 20+buttonRects[i].y, "black");
  }
}

function drawLevelOverButtons() {
  for(var i=4; i<5; i++) {
    colorRectBorder(buttonRects[i].x, buttonRects[i].y, buttonRects[i].width, buttonRects[i].height, "white", "red", 1);
    canvasContext.font = "14px Arial";
    canvasContext.textAlign = "left";
    colorText(playButtonNames[i], 5+buttonRects[i].x, 20+buttonRects[i].y, "black");
  }
}
