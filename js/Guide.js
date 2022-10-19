function drawGuide() {
  textIndent = 50;
  var yTop = -20;
  var line = 0;
  canvasContext.textAlign="center";

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
    if (true || touchDevice) {
      tutorStep = 4; // skip keyboard guidance
    }  
    else {
      drawField();
      drawUI();
      player.draw();
      canvasContext.globalAlpha = 1;
      canvasContext.drawImage(controlsPic, 420, 175);

      let txt = "Alternatively you can use a keyboard: left and right arrow keys move the hat (as shown by graphic). Try them now.";
      let txtLines = getLines(canvasContext, txt, 600);
      for (var i = 0; i < txtLines.length; i++) {
        smallBodyLine(txtLines[i], ++line, yTop);
      }
    }
  }

  // pens in bottom row, also ditch
  else if (tutorStep == 4) {
    drawField();
    drawUI();
    drawCalling();
    drawSheep();
    player.draw();
    outlineSelectedTile(177);
    outlineSelectedTile(180);
    outlineSelectedTile(183);
    outlineSelectedTile(184);
    outlineSelectedTile(187);
    outlineSelectedTile(190);

    let txt = "The player's aim is to get sheep in the pens, outlined at the bottom of the field. To do that move the hat so it lines up above one of the sheep, then click the 'Call' button.";
    let txtLines = getLines(canvasContext, txt, 600);
    for (var i = 0; i < txtLines.length; i++) {
      smallBodyLine(txtLines[i], ++line, yTop);
    }
  }
  
  // move held sheep and send downward
  else if (tutorStep == 5) {
    drawField();
    drawUI();
    drawSheep();
    player.draw();

    let txt = "A called sheep is herded to the hat, then held and sorted by painting with team colour. Now move the hat to wherever you would like to drop (send) the sheep, and click the 'Send' button.";
    let txtLines = getLines(canvasContext, txt, 600);
    for (var i = 0; i < txtLines.length; i++) {
      smallBodyLine(txtLines[i], ++line, yTop);
    }
  }



}