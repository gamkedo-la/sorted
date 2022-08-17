const HEADER_FONT = 36;
const BODY_FONT = 24;
const TEXT_INDENT = 100;
const LINE_SPACING = 60;

function drawMenu() {
  colorRect(0,0, canvas.width,canvas.height, "black");
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
}

function drawHelp() {
  colorRect(0,0, canvas.width,canvas.height, "black");
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
  headLine("Credits");
  bodyLine("Contributor Name - ", 1);
  bodyLine("Contributor Name - ", 2);
  bodyLine("Contributor Name - ", 3);
  bodyLine("Contributor Name - ", 4);
  bodyLine("Contributor Name - ", 5);
}

function headLine(txt) {
  canvasContext.font = HEADER_FONT + "px Verdana";
  colorText(txt, TEXT_INDENT, 100, "white");
}

function bodyLine(txt, lineNum) {
  canvasContext.font = BODY_FONT + "px Verdana";
  colorText(txt, TEXT_INDENT, 110 + lineNum * LINE_SPACING, "white");
}

function smallHeadLine(txt) {
  canvasContext.font = 32 + "px Verdana";
  colorText(txt, TEXT_INDENT, 100, "white");
}

function smallBodyLine(txt, lineNum) {
  colorText(txt, TEXT_INDENT, 140 + lineNum * 30, "white");
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