const MENU_TOP_MARGIN = 110; // room for the logo
const CREDITS_TOP_MARGIN = 60; // no logo on Credits

const HEADER_FONT = 32;
const BODY_FONT = 22;
const CREDITS_FONT = 18;

var textIndent = 200;
const LINE_SPACING = 40;
const PARAGRAPH_LINE_SPACING = 25;
const PARAGRAPH_GAP = 20;

const CREDITS_INDENT = 35;
const CREDITS_WIDTH = 720;

var barTitle = "barTitle undefined";
var barIndent = 10;
const POPUP_W = 320;


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
    if (touchDevice) {
      textIndent = 150;
      bodyLine("Buttons on right to Play, or", ++line);
      bodyLine("show Scoreboard, Help, Credits", ++line);
    }
    else {
      textIndent = 225;
      headLine("Menu");
      bodyLine("Play - key P", ++line);
      bodyLine("Score - key S", ++line);
      bodyLine("Help - key H", ++line);
      bodyLine("Music - key M", ++line);
      bodyLine("Credits - key C", ++line);
      bodyLine("Edit mode - key F1", ++line);

      canvasContext.drawImage(controlsPic, 550, 250); // controls reference gui tutorial popup
    }
  }
  else {
    textIndent = 190;
    headLine("Edit-mode menu");
    bodyLine("Level select - key 0-9", ++line);
    bodyLine("Design level - key D", ++line);
    bodyLine("Automate test - key A", ++line);
    bodyLine("Team paint test - key T", ++line);
    bodyLine("toggle Edit mode - key F1", ++line);
  }
}


function drawHelp() {
  // BAR.innerHTML = '';
  // drawBarButtons(offMenuButtonLabel);

  colorRect(canvasContext, 0, 0, gameCanvas.width, gameCanvas.height, "black");
  canvasContext.drawImage(helpBGPic, 0, 0);
  drawMenuFlock();

  textIndent = 120;
  var line = 0;

  // getLines() cutoffs based on canvas font when function called
  canvasContext.font = 20 + "px Verdana";

  var yTop = (editMode) ? 55 : 80;

  // if (!editMode) {
  //   smallHeadLine("Sorted! a game with sheep", yTop);
  // }

  smallBodyLine("Aim: get all sheep to bottom row, sorting two groups.", ++line, yTop);

  var txt = "How to play: move Hat left or right, call a sheep upward, send a sheep down. Points are gained if a sheep arrives on correct side of the field, and bonus points for reaching a pen rather than falling into ditch.";

  var txtLines = getLines(canvasContext, txt, 600);
  line++; // gap between paragraphs

  for (var i = 0; i < txtLines.length; i++) {
    smallBodyLine(txtLines[i], ++line, yTop);
  }

  if (touchDevice == false) {
    line++; // gap between paragraphs
    smallBodyLine("Menu: press key M or Esc", ++line, yTop);
  }

  if (editMode) {
    line++; // gap between paragraphs
    smallBodyLine("EditMode: Level 0 is integration test level.", ++line, yTop);
  }
}


function drawCredits() {

  colorRect(canvasContext, 0, 0, gameCanvas.width, gameCanvas.height, "black");
  canvasContext.drawImage(creditsBGPic, 0, 0);

  textIndent = CREDITS_INDENT;
  canvasContext.font = HEADER_FONT + "px Verdana";
  colorText(canvasContext, "Credits", textIndent, CREDITS_TOP_MARGIN, "white");

  canvasContext.font = CREDITS_FONT + "px Verdana";
  var line = 0;
  var paragraph = 1;

  paragraphLine("No more updates to Credits: will be compiled by Chris.", ++line, paragraph);
  paragraph++;

  paragraphLine("Patrick McKeown - programming, design.", ++line, paragraph);
  paragraph++;

  var txt = 'Christer "McFunkypants" Kaitila - title and animation on menu/help/credits; decal system with flowers and grassclumps; hoofprints behind sheep; soundfx for sheep, and dog; ambient sounds; baa when sheep enters pen.'
  var txtLines = getLines(canvasContext, txt, CREDITS_WIDTH);
  for (var i = 0; i < txtLines.length; i++) {
    paragraphLine(txtLines[i], ++line, paragraph);
  }
  paragraph++;

  var txt = "Chris DeLeon - sheep-head multi-part image; foundation of classic games code; Photopea help to make tile art.";
  var txtLines = getLines(canvasContext, txt, CREDITS_WIDTH);
  for (var i = 0; i < txtLines.length; i++) {
    paragraphLine(txtLines[i], ++line, paragraph);
  }
  paragraph++;

  paragraphLine("Gonzalo Delgado - rogue dog (head) concept art and sprite.", ++line, paragraph);
  paragraph++;

  paragraphLine("Tim Waskett - verbal algorithm for sheep roaming.", ++line, paragraph);
  paragraph++;

  var txt = "H Trayford - maximum possible score; early Hat screenwrap.";
  var txtLines = getLines(canvasContext, txt, CREDITS_WIDTH);
  for (var i = 0; i < txtLines.length; i++) {
    paragraphLine(txtLines[i], ++line, paragraph);
  }
  paragraph++;

  var txt = 'Nicholas Polchies - canvas scaling (for phone screens) code from Hometeam game "Accidental Personal Confusion 5".';
  var txtLines = getLines(canvasContext, txt, CREDITS_WIDTH);
  for (var i = 0; i < txtLines.length; i++) {
    paragraphLine(txtLines[i], ++line, paragraph);
  }
  paragraph++;

  var txt = 'Caspar Dunant - touch event handling code from Hometeam game "Irenic".';
  var txtLines = getLines(canvasContext, txt, CREDITS_WIDTH);
  for (var i = 0; i < txtLines.length; i++) {
    paragraphLine(txtLines[i], ++line, paragraph);
  }
} // end drawCredits


function headLine(txt) {
  canvasContext.font = HEADER_FONT + "px Verdana";
  colorText(canvasContext, txt, textIndent, 100 + MENU_TOP_MARGIN, "white");
}


function bodyLine(txt, lineNum) {
  canvasContext.font = BODY_FONT + "px Verdana";
  colorText(canvasContext, txt, textIndent, 110 + MENU_TOP_MARGIN + lineNum * LINE_SPACING, "white");
}


function paragraphLine(txt, lineNum, paragraph) {
  let y = CREDITS_TOP_MARGIN + (paragraph * PARAGRAPH_GAP) + (lineNum * PARAGRAPH_LINE_SPACING);
  colorText(canvasContext, txt, textIndent, y, "white");
  paragraph++;
}


function smallHeadLine(txt, yTop) {
  canvasContext.font = 32 + "px Verdana";
  colorText(canvasContext, txt, textIndent, yTop + MENU_TOP_MARGIN, "white");
}


function smallBodyLine(txt, lineNum, startY) {
  canvasContext.font = 24 + "px Verdana";
  colorText(canvasContext, txt, textIndent, startY + lineNum * 30 + MENU_TOP_MARGIN, "white");
}


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
  colorRect(canvasContext, +gameCanvas.width / 2 - POPUP_W / 2 - 20, y - 20, POPUP_W + 40, 300 + 40, "rgba(0,0,0,0.25)");
  // bg
  colorRect(canvasContext, gameCanvas.width / 2 - POPUP_W / 2, y, POPUP_W, 300, "rgba(0,0,0,0.25)");
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
    colorText(canvasContext, "Replay level " + currentLevel, gameCanvas.width / 2, y += 24, "white");

    canvasContext.font = advanceFontSize + "px Arial";
    colorText(canvasContext, "Advance to level " + nextLevel, gameCanvas.width / 2, y += 18 + advanceFontSize, "white");
  }
  else {
    colorText(canvasContext, "Press key M for menu", gameCanvas.width / 2, y += 40, "white");
    colorText(canvasContext, "key R to replay level " + currentLevel, gameCanvas.width / 2, y += 18, "white");

    canvasContext.font = advanceFontSize + "px Arial";
    colorText(canvasContext, "key L to advance to level " + nextLevel, gameCanvas.width / 2, y += 18 + advanceFontSize, "white");
  }

  canvasContext.font = "16px Arial";
  colorText(canvasContext, "Time in level: " + Math.floor(step[currentLevel] / baseFPS) + 1, gameCanvas.width / 2, y += 35, "white");

  // colorText("H to hide/show this box", canvas.width/2, y+210, "white");
  canvasContext.textAlign = "left";

  // drawStar(canvasContext, gameCanvas.width/2, y, 5, 20, 25, -18,'yellow','red', 4);
} // end drawLevelScore


function drawScoreboard() {
  // colorRect(canvasContext, 0,0, gameCanvas.width,gameCanvas.height, "black");
  // canvasContext.drawImage(menuBGPic,0,0);
  blankGrid = getEmptyField();
  drawFieldFromGrid(blankGrid);
  decals.draw();
  drawMenuFlock();

  canvasContext.font = "24px Arial";
  var drawX = 100;
  const topY = 80;
  var drawY = topY;
  colorText(canvasContext, "Scoreboard", drawX, drawY, "white");

  for (var i = 1; i <= LAST_LEVEL; i++) {

    if (i == 5) {
      drawX = 450;
      drawY = topY;
    }
    drawY += 60;

    canvasContext.font = "24px Arial";
    colorText(canvasContext, levelScores[i], drawX, drawY, "white");

    canvasContext.font = "18px Arial";
    colorText(canvasContext, "Level " + i + '  "' + LEVEL_NAMES[i] + '"', drawX+50, drawY, "white");

  }

  if (touchDevice == false) {
    canvasContext.font = "16px Arial";
    colorText(canvasContext, "Press key M or Esc for menu", 100, 500, "white");
  }

  canvasContext.textAlign = "left";
} // end drawScoreboard


function drawGameOver() {
  colorRect(canvasContext, 0, 0, gameCanvas.width, gameCanvas.height, "black");
  canvasContext.drawImage(creditsBGPic, 0, 0);
  drawMenuFlock();

  textIndent = 200;
  headLine("Game Over!");
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
