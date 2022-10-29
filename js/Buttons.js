var barButtonInactive = null;

if (touchDevice) {
  var menuButtonLabel = ["Play", "Help", "Tutor", "Music", "Score", "Credits"];
} else {
  var menuButtonLabel = ["Play", "Help", "Tutor", "Music", "Score", "Credits", "Quit"];
}
const playButtonLabel = ["Left", "Right", "Call", "Send", "Pause", "End", "Menu"];
var tutorialButtonLabel = ["Left", "Right", "Call", "Send", "Pause", , "Menu"];
const pauseButtonLabel = [,,,,"Go"];
const levelendButtonLabel = ["Replay", "Advance", "Menu"];
const gameoverButtonLabel = ["Music", "Close"]; // "Restart"
const creditsButtonLabel = ["Menu", , , , "Pause"];
const offmenuButtonLabel = ["Menu"];
const editmodeButtonLabel = ["Test", "Team", "Player"];
const designButtonLabel = []; // need bar for tile/agent info

// when needing space to see debug text lines, one less button
// var menuButtonLabel = ["Play", "Help", "Tutorial", "Music", "Score", "Credits"];
// var playButtonLabel = ["Left", "Right", "Call", "Send", "Pause", "Menu"];

var buttonsTop = 50;
var buttonsLeft = 10;
const buttonWidth = 70;
const buttonHeight = 60;
const buttonGap = 10;
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
  colorText(uiContext, txt, buttonsLeft, 30, "white");
}

function drawTime(){
  uiContext.font = 12 + "px Arial";
  let txt = "Time in level: " + Math.floor(step[currentLevel] / baseFPS);
  colorText(uiContext, txt, buttonsLeft-3, 580, "white");
}


function drawBarButtons(btnList) {
  var lineWidth = 1;
  const oldConfig = {align: uiContext.textAlign, lineWidth: uiContext.lineWidth, font: uiContext.font};
  uiContext.lineWidth = lineWidth;
  uiContext.textAlign = "center";
  uiContext.font = "14px Arial";
  for (var i = 0; i < btnList.length; i++) {

    if (btnList[i] != undefined && btnList[i] != '') {
	  let textY = buttonPic.height/2 + buttonRects[i].y + 5;
      if (buttonDown == i) {
        // uiContext.drawImage(buttonPic, 51, 0, 50, 52, buttonRects[i].x, buttonRects[i].y, 50, 52);
        uiContext.drawImage(buttonPic, 51, 0, 50, 52, buttonRects[i].x, buttonRects[i].y, 70, 70);
		textY += 4;
      } else {
        // uiContext.drawImage(buttonPic, 0, 0, 50, 52, buttonRects[i].x, buttonRects[i].y, 50, 52);
        uiContext.drawImage(buttonPic, 0, 0, 50, 52, buttonRects[i].x, buttonRects[i].y, 70, 70);
      }
      // magic numbers position text on button
      colorText(
        uiContext,
        btnList[i],
        buttonPic.width/4 + buttonRects[i].x +10,
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
