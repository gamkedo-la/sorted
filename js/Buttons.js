var barButtonInactive = null;

// if (!touchDevice) {
//   var menuButtonLabel = ["Help", "Tutor", "Play", "Music", "Score", "Credits", "Quit"];
// } else {
var menuButtonLabel = ["Help", "Tutor", "Play", "Music", "Score", "Credits"];

if (USE_ROAD_SCENE) {
  var levelendButtonLabel = ["Replay", "Next", "Menu", , "Pause"];
} else {
  var levelendButtonLabel = ["Replay", "Next", "Menu"];
}

const playButtonLabel = ["Left", "Right", "Call", "Send", "Pause", "End", "Menu"];
const pauseButtonLabel = [, , , , "Go"];

var creditsButtonLabel = ["Menu", , , , "Pause"]; // Pause vanish when scroll ends
const offmenuButtonLabel = ["Menu"];

// "Restart" not offered, must refresh webpage instead
const gameoverButtonLabel = ["Music"] //, "Quit"];

// no "End" button in Tutorial, tricky to implement
var tutorialButtonLabel = ["Left", "Right", "Call", "Send", "Pause", , "Menu"];

const editmodeButtonLabel = ["Test", "Team", "Player"];
const designButtonLabel = []; // need bar for tile/agent info

// when needing space to see debug text lines, one less button
// var menuButtonLabel = ["Play", "Help", "Tutorial", "Music", "Score", "Credits"];
// var playButtonLabel = ["Left", "Right", "Call", "Send", "Pause", "Menu"];

var buttonsTop = 8;
var buttonsLeft = 5;
const buttonWidth = 72;
const buttonHeight = 80;
const buttonGap = 1;
const buttonRects = [];
var buttonDown = null;


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
  // colorText(uiContext, txt, buttonsLeft+7, 24, "white");
}

function drawTime() {
  uiContext.font = 12 + "px Arial";
  let txt = "Time: " + Math.floor(step[currentLevel] / baseFPS);
  colorText(uiContext, txt, buttonsLeft, 592, "white");
}


function drawBarButtons(btnList) {
  var lineWidth = 1;
  const oldConfig = { align: uiContext.textAlign, lineWidth: uiContext.lineWidth, font: uiContext.font };
  uiContext.lineWidth = lineWidth;
  uiContext.textAlign = "center";
  uiContext.font = "15px Arial";
  for (var i = 0; i < btnList.length; i++) {

    if (btnList[i] != undefined && btnList[i] != '') {
      let textY = buttonPic.height / 2 + buttonRects[i].y + 11;
      if (buttonDown == i) {
        // uiContext.drawImage(buttonPic, 51, 0, 50, 52, buttonRects[i].x, buttonRects[i].y, 50, 52);
        uiContext.drawImage(buttonPic, 51, 0, 50, 52, buttonRects[i].x, buttonRects[i].y, buttonWidth, buttonHeight);
        textY += 4;
      } else {
        // uiContext.drawImage(buttonPic, 0, 0, 50, 52, buttonRects[i].x, buttonRects[i].y, 50, 52);
        uiContext.drawImage(buttonPic, 0, 0, 50, 52, buttonRects[i].x, buttonRects[i].y, buttonWidth, buttonHeight);
      }

      // colorRectBorder(
      //   uiContext,
      //   buttonRects[i].x, buttonRects[i].y,
      //   buttonRects[i].width, buttonRects[i].height,
      //   "rgba(255,255,255,0.1)", "red", lineWidth
      // );

      // magic numbers position text on button
      colorText(
        uiContext,
        btnList[i],
        buttonPic.width / 4 + buttonRects[i].x + 10,
        textY,
        "black"
      );
    } // button slot filled
  }
  uiContext.lineWidth = oldConfig.lineWidth;
  uiContext.textAlign = oldConfig.align;
  uiContext.font = oldConfig.font;
}

function requireButtonGotoMenu() {
  return (
    gameState == STATE_CREDITS ||
    gameState == STATE_HELP ||
    gameState == STATE_SCOREBOARD
  );
}
