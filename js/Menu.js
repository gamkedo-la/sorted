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
  for (let x,y,i = 0; i<64; i++) {
    x = Math.sin(performance.now()*0.00005+i*321) * 900;
    y = 570 + Math.cos(performance.now()*0.00513+i*234) * 10;
    r = Math.cos(performance.now()*0.005+i*456) * 0.5;
    drawBitmapCenteredWithRotation(canvasContext, sheepNormalPic,x,y,r);
  }
}

function drawLevelEndFlock() {
    for (let x,y,i = 0; i<64; i++) {
        x = (gameCanvas.width/2/*-POPUP_W/2*/) + Math.sin(performance.now()*0.00005+i*321) * POPUP_W/2;
        y = 90 + Math.cos(performance.now()*0.00513+i*234) * 10;
        r = Math.cos(performance.now()*0.005+i*456) * 0.5;
        drawBitmapCenteredWithRotation(canvasContext, sheepNormalPic,x,y,r);
    }
}
  
function drawMenu() {
  colorRect(canvasContext, 0,0, gameCanvas.width,gameCanvas.height, "black");
  canvasContext.drawImage(menuBGPic,0,0);
  decals.draw();
  drawMenuFlock();

  canvasContext.textAlign = "left";
  var line = 0;
  if (!editMode) {
    textIndent = 225;
    headLine("Menu");
    bodyLine("Play - key P", ++line);
    bodyLine("Score - key S", ++line);
    bodyLine("Help - key H", ++line);
    bodyLine("Credits - key C", ++line);
    bodyLine("Edit mode - key F1", ++line);
  } else {
    textIndent = 190;
    headLine("Edit-mode menu");
    bodyLine("Level select - key 0-9", ++line);
    bodyLine("Design level - key D", ++line);
    bodyLine("Automate test - key A", ++line);
    bodyLine("Team paint test - key T", ++line);
    bodyLine("toggle Edit mode - key F1", ++line);
  }

  canvasContext.drawImage(controlsPic,550,250); // controls reference gui tutorial popup
}


function drawHelp() {
  // BAR.innerHTML = '';
  // drawBarButtons(offMenuButtonLabel);

  colorRect(canvasContext, 0,0, gameCanvas.width,gameCanvas.height, "black");
  canvasContext.drawImage(helpBGPic,0,0);
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

  var txt = "How to play: move Hat sideways (use arrow keys), call a sheep (Up arrow key), send a sheep (Down arrow). Points are gained if a sheep arrives on correct side of the field, and closer to field's horizontal centre scores more. Bonus points for a sheep arriving on the pen (chequered tile).";

  var txtLines = getLines(canvasContext, txt, 600);
  line++; // gap between paragraphs

  for(var i=0; i<txtLines.length; i++) {
    smallBodyLine(txtLines[i], ++line, yTop);
  }

  line++; // gap between paragraphs
  smallBodyLine("Menu: press key M or Esc", ++line, yTop);
  if (editMode) {
    line++; // gap between paragraphs
    smallBodyLine("EditMode: Level 0 is integration test level.", ++line, yTop);
  }
}


function drawCredits() {

  colorRect(canvasContext, 0,0, gameCanvas.width,gameCanvas.height, "black");
  canvasContext.drawImage(creditsBGPic,0,0);

  textIndent = CREDITS_INDENT;
  canvasContext.font = HEADER_FONT + "px Verdana";
  colorText(canvasContext, "Credits", textIndent, CREDITS_TOP_MARGIN, "white");

  canvasContext.font = CREDITS_FONT + "px Verdana";
  var line = 0;
  var paragraph = 1;

  paragraphLine("No more updates as Credits will be compiled by Chris DeLeon.", ++line, paragraph);
  paragraph++;

  var txt = 'Christer "McFunkypants" Kaitila - title and animation on menu/help/credits; decal system with flowers and grass; hoofprints behind sheep; many soundfx for sheep, and dog; ambient sheep sounds; baa when sheep enters pen.'
  var txtLines = getLines(canvasContext, txt, CREDITS_WIDTH);
  for(var i=0; i<txtLines.length; i++) {
    paragraphLine(txtLines[i], ++line, paragraph);
  }
  paragraph++;

  var txt = "Chris DeLeon - sheep-head multi-part image; foundation of classic games code and tile art.";
  var txtLines = getLines(canvasContext, txt, CREDITS_WIDTH);
  for(var i=0; i<txtLines.length; i++) {
    paragraphLine(txtLines[i], ++line, paragraph);
  }
  paragraph++;

  paragraphLine("Gonzalo Delgado - concept art and sprite for rogue dog.", ++line, paragraph);
  paragraph++;

  paragraphLine("Tim Waskett - algorithm for sheep roaming.", ++line, paragraph);
  paragraph++;

  var txt = "H Trayford - maximum possible score; screenwrap hat.";
  var txtLines = getLines(canvasContext, txt, CREDITS_WIDTH);
  for(var i=0; i<txtLines.length; i++) {
    paragraphLine(txtLines[i], ++line, paragraph);
  }
  paragraph++;

  var txt = 'Nicholas Polchies - canvas scaling code from Hometeam game "Accidental Personal Confusion 5".';
  var txtLines = getLines(canvasContext, txt, CREDITS_WIDTH);
  for(var i=0; i<txtLines.length; i++) {
    paragraphLine(txtLines[i], ++line, paragraph);
  }
  paragraph++;

  var txt = 'Caspar Dunant - touch event handling code from Hometeam game "Irenic".';
  var txtLines = getLines(canvasContext, txt, CREDITS_WIDTH);
  for(var i=0; i<txtLines.length; i++) {
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


function smallBodyLine(txt, lineNum,startY) {
  canvasContext.font = 24 + "px Verdana";
  colorText(canvasContext, txt, textIndent, startY + lineNum * 30 + MENU_TOP_MARGIN, "white");
}


function drawLevelEndTest() {
  var y = 50;
  canvasContext.textAlign = "center";
  canvasContext.font = "24px Arial";
  colorText(canvasContext, "Level "+ currentLevel + " completed", gameCanvas.width/2, y += 50, "white");
  canvasContext.textAlign = "left";
} // end drawLevelEndTest


function drawLevelEnd() {
  var y = 50;
  var nextLevel = currentLevel + 1;
  var advanceFontSize = 12 + Math.sqrt( levelScores[currentLevel] / FLOCK_SIZE[currentLevel] +1 );

  canvasContext.textAlign = "center";

  // border
  colorRect(canvasContext, +gameCanvas.width/2 -POPUP_W/2 -20, y -20, POPUP_W + 40, 270 + 40, "rgba(0,0,0,0.25)");
  // bg
  colorRect(canvasContext, gameCanvas.width/2 -POPUP_W/2, y, POPUP_W, 270, "rgba(0,0,0,0.25)");
  // sheep
  drawLevelEndFlock();
  // small white bar
  colorRect(canvasContext, gameCanvas.width/2 -POPUP_W/2 + 40, y+20, POPUP_W - 80, 40, "rgba(255,255,255,0.75)");

  canvasContext.font = "24px Arial Bold";
  colorText(canvasContext, "Level " + currentLevel + " completed", gameCanvas.width / 2, y += 50, "black");

  canvasContext.font = "36px Arial";
  colorText(canvasContext, "Score = " + levelScores[currentLevel], gameCanvas.width / 2, y += 50, "white");

  canvasContext.font = "16px Arial";
  colorText(canvasContext, "Max Possible Score = " + levelMaxScores[currentLevel], gameCanvas.width/2, y += 40, "white");
  colorText(canvasContext, "Press key M for menu", gameCanvas.width/2, y += 35, "white");
  colorText(canvasContext, "key R to replay level " + currentLevel, gameCanvas.width/2, y += 18, "white");

  canvasContext.font = advanceFontSize + "px Arial";
  colorText(canvasContext, "key L to advance to level " + nextLevel, gameCanvas.width/2, y += 18 + advanceFontSize, "white");

  // colorText("H to hide/show this box", canvas.width/2, y+210, "white");
  canvasContext.textAlign = "left";
} // end drawLevelEnd


function drawScoreboard() {
  colorRect(canvasContext, 0,0, gameCanvas.width,gameCanvas.height, "black");
  canvasContext.font = "24px Arial";
  colorText(canvasContext, "Scoreboard", 100, 80, "white");

  canvasContext.font = "16px Arial";
  for(var i=1; i<7; i++) {
    colorText(canvasContext, "Level " + i +  ' "' + LEVEL_NAMES[i] + '": ' + levelScores[i], 100, 80 + i*50, "white");
  }

  canvasContext.font = "16px Arial";
  colorText(canvasContext, "Press M or Esc for menu", 100, 500, "white");
  canvasContext.textAlign = "left";
} // end drawScoreboard


function drawGameOver() {
  colorRect(canvasContext, 0,0, gameCanvas.width,gameCanvas.height, "black");
  canvasContext.drawImage(creditsBGPic,0,0);
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
  barLine("Distract: 3", ++line);
  barLine("Bend Left: 4", ++line);
  barLine("Bend Right: 5", ++line);
  barLine("Conveyor L: 6", ++line);
  barLine("Conveyor R: 7", ++line);
}
