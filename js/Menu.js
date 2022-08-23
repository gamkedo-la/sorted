const HEADER_FONT = 36;
const BODY_FONT = 24;
var textIndent = 200;
const LINE_SPACING = 40;
const MENU_TOP_MARGIN = 110; // room for the logo

function drawMenuFlock() {
    for (let x,y,i = 0; i<64; i++) {
        x = Math.sin(performance.now()*0.00005+i*321) * 900;
        y = 600 + Math.cos(performance.now()*0.00513+i*234) * 10;
        r = Math.cos(performance.now()*0.005+i*456) * 0.5;
        drawBitmapCenteredWithRotation(sheepNormalPic,x,y,r);
    }
}

function drawMenu() {
  colorRect(0,0, canvas.width,canvas.height, "black");
  canvasContext.drawImage(menuBGPic,0,0);
  decals.draw();
  drawMenuFlock();
  
  textIndent = 225;
  canvasContext.textAlign = "left";
  var line = 0;
  if(!editMode) {
    headLine("Menu");
    // bodyLine("Skip learning levels - press L", 1);
    bodyLine("Play - press P", ++line);
    bodyLine("Score - press S", ++line);
    bodyLine("Help - press H", ++line);
    bodyLine("Button bar - press B", ++line);
    bodyLine("Credits - press C", ++line);
    bodyLine("Edit mode - press F1", ++line);
  } else {
    headLine("Edit mode menu");
    bodyLine("Level select - press key 0-9", ++line);
    bodyLine("Automate test level - press A", ++line);
    bodyLine("Team paint level test - press T", ++line);
    // bodyLine("Play (resume) - press P", ++line);
    bodyLine("Scoreboard - press S", ++line);
    bodyLine("Help/Title - press H", ++line);
    bodyLine("toggle Edit mode - press F1", ++line);
  }

  canvasContext.drawImage(controlsPic,550,250); // controls reference gui tutorial popup

}

function drawHelp() {
  colorRect(0,0, canvas.width,canvas.height, "black");
  canvasContext.drawImage(helpBGPic,0,0);
  drawMenuFlock();

  textIndent = 130;
  var line = 0;
  smallHeadLine("Sorted! a game with sheep");

  // getLines() cutoffs based on canvas font when function called
  canvasContext.font = 20 + "px Verdana";

  smallBodyLine("Aim: get all sheep to bottom row, sorting into two groups.", ++line);

  var txt = "How to play: move the hat sideways (use arrow keys), call a sheep (Up arrow key), send a sheep (Down arrow). Points gained for each sheep depend on whether the sheep arrives on correct side of the field, and how far horizontally from field's centre. Score bonus points for a sheep arriving exactly on the goal (chequered tile).";

  var txtLines = getLines(canvasContext, txt, 600);
  line++; // gap between paragraphs

  for(var i=0; i<txtLines.length; i++) {
    smallBodyLine(txtLines[i], ++line);
  }

  if(editMode) {
    line++; // gap between paragraphs
    smallBodyLine("EditMode: Level 0 is integration test level.", ++line);  
  }
  line++; // gap between paragraphs
  smallBodyLine("Menu: press key M or Esc", ++line);
}

function drawCredits() {
  colorRect(0,0, canvas.width,canvas.height, "black");
  canvasContext.drawImage(creditsBGPic,0,0);
  drawMenuFlock();

  textIndent = 150;
  var line = 0;
  headLine("Credits");
  bodyLine('Christer "McFunkypants" Kaitila - animated', ++line);
  bodyLine('backgrounds for menu/help/credits', ++line);
  bodyLine("Chris DeLeon - sheep face with asset parts", ++line);
  bodyLine("Tim Waskett - algorithms for sheep roaming", ++line);
  bodyLine("H Trayford - screenwrap for player-hat", ++line);
  bodyLine("Contributor Name - ", ++line);
}

function headLine(txt) {
  canvasContext.font = HEADER_FONT + "px Verdana";
  colorText(txt, textIndent, 100 + MENU_TOP_MARGIN, "white");
}

function bodyLine(txt, lineNum) {
  canvasContext.font = BODY_FONT + "px Verdana";
  colorText(txt, textIndent, 110 + MENU_TOP_MARGIN + lineNum * LINE_SPACING, "white");
}

function smallHeadLine(txt) {
  canvasContext.font = 32 + "px Verdana";
  colorText(txt, textIndent, 100 + MENU_TOP_MARGIN, "white");
}

function smallBodyLine(txt, lineNum) {
  colorText(txt, textIndent, 140 + lineNum * 30 + MENU_TOP_MARGIN, "white");
}

function drawLevelOver() {
  canvasContext.textAlign = "center";
  canvasContext.font = "24px Arial";
  colorText("Level "+ currentLevel + " completed", canvas.width/2, 200, "white");
  canvasContext.font = "36px Arial";
  colorText("Score = " + levelScores[currentLevel], canvas.width/2, 240, "white");
  canvasContext.font = "16px Arial";
  colorText("Press M or Esc for menu", canvas.width/2, 300, "white");
  canvasContext.textAlign = "left";
}

function drawScoreboard() {
  colorRect(0,0, canvas.width,canvas.height, "black");
  // canvasContext.textAlign = "center";
  canvasContext.font = "24px Arial";
  colorText("Scoreboard", 100, 80, "white");
  canvasContext.font = "16px Arial";
  for(var i=1; i<7; i++) {
    colorText("Level " + i +  ' "' + levelNames[i] + '": ' + levelScores[i], 100, 80 + i*50, "white");
  }
  canvasContext.font = "16px Arial";
  colorText("Press M or Esc for menu", 100, 500, "white");
  canvasContext.textAlign = "left";
}

function drawButtons() {
  for(var i=0; i<NUM_BUTTONS; i++) {
    colorRectBorder(buttonRects[i].x, buttonRects[i].y, buttonRects[i].width, buttonRects[i].height, "white", "red");
    canvasContext.font = "14px Arial";
    canvasContext.textAlign = "left";
    colorText(buttonNames[i], 5+buttonRects[i].x, 20+buttonRects[i].y, "black");
  }
}

function drawLevelOverButtons() {
  for(var i=4; i<5; i++) {
    colorRectBorder(buttonRects[i].x, buttonRects[i].y, buttonRects[i].width, buttonRects[i].height, "white", "red");
    canvasContext.font = "14px Arial";
    canvasContext.textAlign = "left";
    colorText(buttonNames[i], 5+buttonRects[i].x, 20+buttonRects[i].y, "black");
  }
}

function drawGameOver() {
  colorRect(0,0, canvas.width,canvas.height, "black");
  canvasContext.drawImage(creditsBGPic,0,0);
  drawMenuFlock();

  textIndent = 200;
  headLine("Game Over!");
}