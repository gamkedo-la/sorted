const BAR = document.getElementById("bar");

const menuButtonList = ["Play", "Score", "Help", "Credits", "Quit"];
const playButtonList = ["Left", "Right", "Call", "Send", "Pause", "Menu"];
const levelEndButtonList = ["Replay", "Advance", "Menu"];
const gameOverButtonList = ["Restart", "Menu", "Quit"];
const offMenuButtonList = ["Menu"];
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
  gameState = STATE_PLAY; // return to game
  BAR.innerHTML = '';
  makeBarButtons(playButtonList);
}

function touchstartScoreHandler() {
  gameState = STATE_SCOREBOARD;
  BAR.innerHTML = ''; // clear buttons
  makeBarButtons(offMenuButtonList);
  if(TOUCH_TEST) {
  }
}
function touchstartHelpHandler() {
  gameState = STATE_HELP;
  BAR.innerHTML = ''; // clear buttons
  makeBarButtons(offMenuButtonList);
  if(TOUCH_TEST) {
  }
}
function touchstartCreditsHandler() {
  gameState = STATE_CREDITS;
  BAR.innerHTML = ''; // clear buttons
  makeBarButtons(offMenuButtonList);
  if(TOUCH_TEST) {
  }
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

function touchstartPauseHandler() {
  // gameState = STATE_PAUSE;
}
function touchstartMenuHandler() {
  gameState = STATE_MENU;
}


// old buttons on canvas
function drawMenuButtons() {
  for(var i=0; i<MENU_BUTTONS_NUM-1; i++) {
    colorRectBorder(buttonRects[i].x, buttonRects[i].y, buttonRects[i].width, buttonRects[i].height, "white", "red");
    canvasContext.font = "14px Arial";
    canvasContext.textAlign = "left";
    colorText(menuButtonNames[i], 5+buttonRects[i].x, 20+buttonRects[i].y, "black");
  }
}

function drawPlayButtons() {
  for(var i=0; i<PLAY_BUTTONS_NUM; i++) {
    colorRectBorder(buttonRects[i].x, buttonRects[i].y, buttonRects[i].width, buttonRects[i].height, "white", "red");
    canvasContext.font = "14px Arial";
    canvasContext.textAlign = "left";
    colorText(playButtonNames[i], 5+buttonRects[i].x, 20+buttonRects[i].y, "black");
  }
}

function drawLevelOverButtons() {
  for(var i=4; i<5; i++) {
    colorRectBorder(buttonRects[i].x, buttonRects[i].y, buttonRects[i].width, buttonRects[i].height, "white", "red");
    canvasContext.font = "14px Arial";
    canvasContext.textAlign = "left";
    colorText(playButtonNames[i], 5+buttonRects[i].x, 20+buttonRects[i].y, "black");
  }
}
