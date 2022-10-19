function drawGuide() {
  textIndent = 50;
  var yTop = 0;
  var line = 0;

  if (tutorStep == 1) {
    drawField();
    drawUI();
    player.draw();

    canvasContext.lineWidth = 2;
    canvasContext.setLineDash([]);
    canvasContext.strokeStyle = "yellow";
    canvasContext.strokeRect(player.x - TILE_W / 2, 0, TILE_W, TILE_H);

    let txt = "Player controls the hat (at top of field) which represents a farmer's sheep-clamp. It only moves horizontally. Move it now by clicking (in side bar) button Left or Right.";
    let txtLines = getLines(canvasContext, txt, 600);
    for (var i = 0; i < txtLines.length; i++) {
      smallBodyLine(txtLines[i], ++line, yTop);
    }
  }

  else if (tutorStep == 2) {
    drawField();
    drawUI();
    outlineRow(0);
    player.draw();

    let txt = "The hat moves along the top row and screenwraps when it reaches the left or right edge of the field. Move it beyond an edge now.";
    let txtLines = getLines(canvasContext, txt, 600);
    for (var i = 0; i < txtLines.length; i++) {
      smallBodyLine(txtLines[i], ++line, yTop);
    }
  }

  // keys to move
  else if (tutorStep == 3) {
    if (touchDevice) {
      tutorStep = 4; // skip keyboard guidance
    }  
    else {
      drawField();
      drawUI();
      player.draw();
      drawSheep();
    }
  }

  // pens in bottom row, also ditch

}