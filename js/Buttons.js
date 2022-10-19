var barButtonInactive = null;

var menuButtonLabel = ["Play", "Help", "Guide", "Music", "Score", "Credits", "Quit"];
const playButtonLabel = ["Left", "Right", "Call", "Send", "Pause", "End", "Menu"];
const pauseButtonLabel = ["Resume"];
const levelendButtonLabel = ["Replay", "Advance", "Menu"];
const gameoverButtonLabel = ["Score", "Credits", "Music", "Quit"]; // "Restart"
const offmenuButtonLabel = ["Menu"];
const editmodeButtonLabel = ["Test", "Team", "Player"];
const designButtonLabel = []; // need bar for tile/agent info

var buttonsTop = 50;
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
