function drawGuide() {
  indentX = 50;
  topY = 100;
  var line = 0;
  var textWidth = 700;
  LINE_SPACING = 30;
  // needed by getLines before calling bodyLine
  var fontSize = 22;
  canvasContext.font = fontSize + "px Verdana";
  canvasContext.textAlign = "left";

  if (tutorStep == 1) {
    drawField();
    let txt = "The player controls a hat (at top of the field) which represents a farmer's sheep-clamp. It only moves horizontally. Move it now by clicking (in side bar) button Left or Right.";
    let txtLines = getLines(canvasContext, txt, textWidth);
    for (var i = 0; i < txtLines.length; i++) {
      bodyLine(txtLines[i], ++line);
    }
    drawUI();
    player.draw();
    // outline Hat
    canvasContext.lineWidth = 2;
    canvasContext.setLineDash([]);
    canvasContext.strokeStyle = "yellow";
    canvasContext.strokeRect(player.x - TILE_W / 2, 0, TILE_W, TILE_H);
  }

  else if (tutorStep == 2) {
    drawField();
    let txt = "When the hat moves beyond either the left or right side of the field it screenwraps to the opposite side. Move the hat beyond an edge now. It sounds like a clamp trundling on rails.";
    let txtLines = getLines(canvasContext, txt, textWidth);
    for (var i = 0; i < txtLines.length; i++) {
      bodyLine(txtLines[i], ++line);
    }
    drawUI();
    outlineRow(0);
    player.draw();
  }

  // bottom row correct side
  else if (tutorStep == 3) {
    drawField();
    let txt = "The player's aim is to get sheep to the bottom row on the correct side. Blue sheep belong on the left, and red sheep belong on the right. Move the hat so it lines up above one of the sheep, then click the 'Call' button.";
    let txtLines = getLines(canvasContext, txt, textWidth);
    for (var i = 0; i < txtLines.length; i++) {
      bodyLine(txtLines[i], ++line);
    }
    drawUI();
    drawCalling();
    drawSheep();
    player.draw();
    outlineRow(14);
  }

  // pens & ditch
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

    let txt = "The player's aim is to get sheep in the pens, outlined below the field. To do that move the hat so it lines up above one of the sheep, then click the 'Call' button.";
    let txtLines = getLines(canvasContext, txt, textWidth);
    for (var i = 0; i < txtLines.length; i++) {
      bodyLine(txtLines[i], ++line);
    }
  }

  // move held sheep and send downward
  else if (tutorStep == 5) {
    drawField();
    drawUI();
    drawSheep();
    player.draw();

    let txt = "A called sheep is herded to the hat, then held and sorted by painting with team colour. Now move the hat to wherever you would like to drop (send) the sheep, and click the 'Send' button.";
    let txtLines = getLines(canvasContext, txt, textWidth);
    for (var i = 0; i < txtLines.length; i++) {
      bodyLine(txtLines[i], ++line);
    }
  }


  // keys to move
  // else if (tutorStep == 3) {
  //   if (true || touchDevice) {
  //     tutorStep = 4; // skip keyboard guidance
  //   }
  //   else {
  //     drawField();
  //     drawUI();
  //     player.draw();
  //     canvasContext.drawImage(controlsPic, 420, 175);

  //     let txt = "Alternatively you can use a keyboard: left and right arrow keys move the hat (as shown by graphic). Try them now.";
  //     let txtLines = getLines(canvasContext, txt, textWidth);
  //     for (var i = 0; i < txtLines.length; i++) {
  //       bodyLine(txtLines[i], ++line);
  //     }
  //   }
  // }

}