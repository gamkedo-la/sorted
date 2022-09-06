const BAR = document.getElementById("bar");

const menuButtonList = ["Play", "Score", "Help", "Credits", "Quit"];
const playButtonList = ["Left", "Right", "Call", "Send", "Pause", "Menu"];
const levelEndButtonList = ["Replay", "Advance", "Menu"];
const gameOverButtonList = ["Restart", "Menu", "Quit"];
const offMenuButtonList = ["Menu"];
const editmodeButtonList = ["Test", "Team", "Player"];

function makeBarButtons(btnList) {
  for (var i=0; i<btnList.length; i++) {
    var btn = document.createElement("button");
    btn.classList.add("button");
    btn.innerHTML = btnList[i];
    BAR.appendChild(btn);
  }
}

function requireButtonGotoMenu() {
  return gameState == STATE_CREDITS || gameState == STATE_HELP || gameState == STATE_SCOREBOARD
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