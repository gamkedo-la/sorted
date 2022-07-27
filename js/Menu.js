function drawMenu() {
  colorRect(0,0, canvas.width,canvas.height, "black");

  if(!editMode) {
    headLine("Menu");
    bodyLine("Credits - press C", 1);
    bodyLine("Resume play - press P", 2);
  } else {
    headLine("Edit mode menu");
    bodyLine("Level - press number", 1);
    bodyLine("Credits - press C", 2);
    bodyLine("Resume play - press P", 3);
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

const HEADER_FONT = 36;
const BODY_FONT = 24;
const TEXT_INDENT = 100;
const LINE_SPACING = 60;

function headLine(txt) {
  canvasContext.font = HEADER_FONT + "px Verdana";
  colorText(txt, TEXT_INDENT, 100, "white");
}
function bodyLine(txt, lineNum) {
  canvasContext.font = BODY_FONT + "px Verdana";
  colorText(txt, TEXT_INDENT, 110 + lineNum * LINE_SPACING, "white");
}