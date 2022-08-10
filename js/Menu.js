const HEADER_FONT = 36;
const BODY_FONT = 24;
const TEXT_INDENT = 100;
const LINE_SPACING = 60;

function drawMenu() {
  colorRect(0,0, canvas.width,canvas.height, "black");

  if(!editMode) {
    headLine("Menu");
    bodyLine("Skip learning levels - press L", 1);
    bodyLine("Resume play - press P", 2);
    bodyLine("Scoreboard - press S", 3);
    bodyLine("Credits - press C", 4);
    bodyLine("Edit mode - press F1", 5);
  } else {
    headLine("Edit mode menu");
    bodyLine("Level select - press number key 1-9", 1);
    bodyLine("stop Edit mode - press F1", 4);
    bodyLine("Resume play - press P", 2);
    bodyLine("Scoreboard - press S", 3);
  }
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