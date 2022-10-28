const MENU_TOP_MARGIN = 110; // room for the logo
const DROP_SHADOW_DIST = 2; // black underlay for menu text

var HEADER_FONT = 36;
var SUBHEAD_FONT = 30;
var MENU_FONT = 28;
var BODY_FONT = 22;
const CREDITS_FONT = 24;

var indentX = 200;
var LINE_SPACING = 40;
var BLOCK_LINE_SPACING = 25;
var BLOCK_GAP = 20;

const CREDITS_X = 35;
const CREDITS_Y = 60; // no logo on Credits
const CREDITS_WIDTH = 720;

var barTitle = "barTitle undefined";
var barIndent = 10;
const POPUP_W = 320;
var topY = 100;
var indentX = 100;


function drawMenuFlock() {
  for (let x, y, i = 0; i < 64; i++) {
    x = Math.sin(performance.now() * 0.00005 + i * 321) * 900;
    y = 570 + Math.cos(performance.now() * 0.00513 + i * 234) * 10;
    r = Math.cos(performance.now() * 0.005 + i * 456) * 0.5;
    drawBitmapCenteredWithRotation(canvasContext, sheepNormalPic, x, y, r);
  }
}


function drawLevelScoreFlock() {
  for (let x, y, i = 0; i < 64; i++) {
    x = (gameCanvas.width / 2/*-POPUP_W/2*/) + Math.sin(performance.now() * 0.00005 + i * 321) * POPUP_W / 2;
    y = 80 + Math.cos(performance.now() * 0.00513 + i * 234) * 10;
    r = Math.cos(performance.now() * 0.005 + i * 456) * 0.5;
    drawBitmapCenteredWithRotation(canvasContext, sheepNormalPic, x, y, r);
  }
}


function drawMenu() {
  colorRect(canvasContext, 0, 0, gameCanvas.width, gameCanvas.height, "black");
  canvasContext.drawImage(menuBGPic, 0, 0);
  decals.draw();
  drawMenuFlock();

  canvasContext.textAlign = "left";
  var line = 0;
  if (!editMode) {
    canvasContext.font = MENU_FONT + "px Verdana";
    if (touchDevice) {
      indentX = 150;
      topY = 180;
      LINE_SPACING = 50;
      bodyLine("Click buttons on the rightbar to", ++line);
      bodyLine("play or resume the game,", ++line);
      bodyLine("show Help or Tutorial,", ++line);
      bodyLine("show Scoreboard or Credits,", ++line);
      bodyLine("start or stop music.", ++line);
    }
    else {
      indentX = 225;
      topY = 170;
      LINE_SPACING = 50;
      // canvasContext.font = SUBHEAD_FONT + "px Verdana";
      // headLine("Menu");
      canvasContext.font = MENU_FONT + "px Verdana";
      bodyLine("Play - key P", ++line);
      bodyLine("Help - key H", ++line);
      bodyLine("Tutorial - key T", ++line);
      bodyLine("Music - key U", ++line);
      bodyLine("Score - key S", ++line);
      bodyLine("Credits - key C", ++line);
      // bodyLine("Edit mode - key F1", ++line);

      canvasContext.drawImage(controlsPic, 550, 250); // controls reference gui tutorial popup
    }
  }
  else {
    indentX = 190;
    topY = 200;
    LINE_SPACING = 45;
    canvasContext.font = SUBHEAD_FONT + "px Verdana";
    headLine("Edit-mode menu");
    canvasContext.font = BODY_FONT + "px Verdana";
    bodyLine("Level select - key 0-9", ++line);
    bodyLine("Design level - key D", ++line);
    bodyLine("Automate test - key A", ++line);
    bodyLine("Team test select - key X", ++line);
    bodyLine("Edit mode toggle - key F1", ++line);
    bodyLine("Keys P, H, T, U, S, C also as on menu", ++line);
  }
}


function drawHelp() {

  colorRect(canvasContext, 0, 0, gameCanvas.width, gameCanvas.height, "black");
  canvasContext.drawImage(helpBGPic, 0, 0);
  drawMenuFlock();

  var line = 0;
  var block = 0;
  indentX = 60;
  topY = 135;
  BLOCK_LINE_SPACING = 35;
  canvasContext.font = 22 + "px Verdana";

  var txt = "Aim: get sheep to the bottom row on the correct side: blue sheep on left, red sheep on right."
  var txtLines = getLines(canvasContext, txt, 700);
  line++; // gap between blocks

  for (var i = 0; i < txtLines.length; i++) {
    blockLine(txtLines[i], ++line, block);
  }

  txt = "How to play: move the hat sideways; when the hat is directly above a sheep it can be Called upward; then move hat again and Send the sheep vertically downward. If a sheep is going astray (e.g. nearing a bog where it will get stuck) you should Call it up again. Points gained for each sheep reaching the bottom row on the correct side, with bonus points for reaching a pen rather than the ditch.";

  txtLines = getLines(canvasContext, txt, 700);
  block++; // gap between blocks

  for (var i = 0; i < txtLines.length; i++) {
    blockLine(txtLines[i], ++line, block);
  }

  // if (touchDevice == false) {
  //   line++; // gap between blocks
  //   bodyLine("Menu: press key M or Esc", ++line, yTop);
  // }
}


function drawCredits() {
  creditsFrameCount++;

  colorRect(canvasContext, 0, 0, gameCanvas.width, gameCanvas.height, "black");
  canvasContext.drawImage(creditsBGPic, 0, 0);

  indentX = CREDITS_X;
  BLOCK_GAP = 40;
  BLOCK_LINE_SPACING = 35;
  canvasContext.font = SUBHEAD_FONT + "px Verdana";
  headLine("Credits")
  
  var line = 0;
  var block = 1;
  indentX = CREDITS_X;
  topY = CREDITS_Y - creditsFrameCount;
  canvasContext.font = CREDITS_FONT + "px Verdana";

  for (const creditText of creditsText) {
    const txtLines = getLines(canvasContext, creditText, CREDITS_WIDTH);
    for (const txt of txtLines) {
      blockLine(txt, ++line, block);
    }

    block++;
  }
} // end drawCredits


function drawLevelScoreTest() {
  var y = 50;
  canvasContext.textAlign = "center";
  canvasContext.font = "24px Arial";
  colorText(canvasContext, "Level " + currentLevel + " completed", gameCanvas.width / 2, y += 50, "white");
  canvasContext.textAlign = "left";
} // end drawLevelScoreTest


function drawLevelScore() {
  var y = 50;
  var nextLevel = currentLevel + 1;
  var advanceFontSize = 12 + Math.sqrt(levelScores[currentLevel] / FLOCK_SIZE[currentLevel] + 1);

  canvasContext.textAlign = "center";

  // border
  colorRect(canvasContext, +gameCanvas.width / 2 - POPUP_W / 2 - 20, y - 20, POPUP_W + 40, 320 + 40, "rgba(0,0,0,0.25)");
  // bg
  colorRect(canvasContext, gameCanvas.width / 2 - POPUP_W / 2, y, POPUP_W, 320, "rgba(0,0,0,0.3)");
  // sheep
  drawLevelScoreFlock();

  // small white bar
  colorRect(canvasContext, gameCanvas.width / 2 - POPUP_W / 2 + 40, y + 10, POPUP_W - 80, 40, "rgba(255,255,255,0.75)");

  canvasContext.font = "24px Arial Bold";
  colorText(canvasContext, "Level " + currentLevel + " completed", gameCanvas.width / 2, y += 40, "black");

  canvasContext.font = "36px Arial";
  colorText(canvasContext, "Score = " + levelScores[currentLevel], gameCanvas.width / 2, y += 55, "white");

  canvasContext.font = "16px Arial";
  colorText(canvasContext, "Max Possible Score = " + levelMaxScores[currentLevel], gameCanvas.width / 2, y += 30, "white");

  var success = levelScores[currentLevel] / levelMaxScores[currentLevel];

  var starColour = null;
  var numStars = 3;
  var starGap = 50;
  var starFirstPos = gameCanvas.width / 2 - starGap;
  var starThreshold = [0, 0.1, 0.4, 0.7];

  y += 30;
  for (var i = 0; i < numStars; i++) {
    drawStar(canvasContext, starFirstPos + starGap * i, y, 5, 10, 20, -18, 'black', 'yellow', 1);
  }

  if (success >= starThreshold[1]) {
    drawStar(canvasContext, starFirstPos, y, 5, 10, 20, -18, 'yellow', 'yellow', 1);
  }
  if (success >= starThreshold[2]) {
    drawStar(canvasContext, starFirstPos + starGap, y, 5, 10, 20, -18, 'yellow', 'yellow', 1);
  }
  if (success >= starThreshold[3]) {
    drawStar(canvasContext, starFirstPos + starGap * 2, y, 5, 10, 20, -18, 'yellow', 'yellow', 1);
  }


  if (touchDevice) {
    colorText(canvasContext, "Use buttons (on right) to:", gameCanvas.width / 2, y += 40, "white");
    colorText(canvasContext, "Replay level " + currentLevel, gameCanvas.width / 2, y += 22, "white");

    canvasContext.font = advanceFontSize + "px Arial";
    msg = "Advance to level " + nextLevel;
    if (nextLevel > LAST_LEVEL) { msg = "End & show scoreboard"; }
    colorText(canvasContext, msg, gameCanvas.width / 2, y += 18 + advanceFontSize, "white");
  }
  else {
    colorText(canvasContext, "Press key M for menu", gameCanvas.width / 2, y += 40, "white");
    colorText(canvasContext, "key R to replay level " + currentLevel, gameCanvas.width / 2, y += 22, "white");

    canvasContext.font = advanceFontSize + "px Arial";
    msg = "key L to advance to level " + nextLevel;
    if (nextLevel > LAST_LEVEL) { msg = "key L show scoreboard"; }
    colorText(canvasContext, msg, gameCanvas.width / 2, y += 18 + advanceFontSize, "white");
  }

  canvasContext.font = "16px Arial";
  colorText(canvasContext, "Time in level: " + Math.floor(step[currentLevel] / baseFPS) + 1, gameCanvas.width / 2, y += 35, "white");

  // colorText("H to hide/show this box", canvas.width/2, y+210, "white");
  canvasContext.textAlign = "left";

  // drawStar(canvasContext, gameCanvas.width/2, y, 5, 20, 25, -18,'yellow','red', 4);
} // end drawLevelScore

function drawBackground() {
  blankGrid = getEmptyField();
  drawFieldFromGrid(blankGrid);
  decals.draw();
  drawMenuFlock();
}

function drawLevelScores(topY, drawY, drawX) {
  for (var i = 1; i <= LAST_LEVEL; i++) {

    if (i == 5) {
      drawX = 450;
      drawY = topY;
    }
    drawY += 60;

    canvasContext.font = "28px Arial";
    colorText(canvasContext, levelScores[i], DROP_SHADOW_DIST + drawX, DROP_SHADOW_DIST + drawY, "black");
    colorText(canvasContext, levelScores[i], drawX, drawY, "white");

    canvasContext.font = "20px Arial";
    colorText(canvasContext, "Level " + i + '  "' + LEVEL_NAMES[i] + '"', DROP_SHADOW_DIST + drawX + 70, DROP_SHADOW_DIST + drawY, "black");
    colorText(canvasContext, "Level " + i + '  "' + LEVEL_NAMES[i] + '"', drawX + 70, drawY, "white");

  }
}


function drawScoreboard() {
  // colorRect(canvasContext, 0,0, gameCanvas.width,gameCanvas.height, "black");
  // canvasContext.drawImage(menuBGPic,0,0);
  drawBackground();

  canvasContext.font = "28px Arial";
  var drawX = 60;
  const topY = 80;
  var drawY = topY;
  colorText(canvasContext, "Scoreboard", DROP_SHADOW_DIST + drawX, DROP_SHADOW_DIST + drawY, "black");
  colorText(canvasContext, "Scoreboard", drawX, drawY, "white");

  drawLevelScores(topY, drawY, drawX);

  if (touchDevice == false) {
    canvasContext.font = "16px Arial";
    colorText(canvasContext, "Press key M or Esc for menu", DROP_SHADOW_DIST + drawX, DROP_SHADOW_DIST + 500, "black");
    colorText(canvasContext, "Press key M or Esc for menu", drawX, 500, "white");
  }

  canvasContext.textAlign = "left";
} // end drawScoreboard


function drawGameOver() {
  drawBackground();
  topY = 100;
  indentX = 200;
  canvasContext.font = "42px Verdana";
  headLine("Game Over!");
  canvasContext.font = "28px Arial";
  var drawX = 60;
  topY = 140;
  var drawY = topY;
  drawLevelScores(topY, drawY, drawX);
  // console.log('menu drawgameover')

} // end drawGameOver


function barLine(txt, lineNum) {
  uiContext.font = "16px Arial";
  colorText(uiContext, txt, barIndent, 60 + lineNum * LINE_SPACING, "white");
}


function drawBarText() {
  var line = 0;
  barLine("Tile: key", ++line);
  barLine("Field: 0", ++line);
  barLine("Slow: 1", ++line);
  barLine("Stuck: 2", ++line);
  barLine("Halt: 3", ++line);
  barLine("Bend Left: 4", ++line);
  barLine("Bend Right: 5", ++line);
  barLine("Conveyor L: 6", ++line);
  barLine("Conveyor R: 7", ++line);
}
