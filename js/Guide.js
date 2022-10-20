function moveGuide() {
  if (tutorStep != 3) {
    player.move();
  }
  if (tutorStep >3 && tutorStep < 7) {
    for (var i = 0; i < sheepList.length; i++) {
      sheepList[i].move();
    }
  }
}

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
    let txt = "When the hat moves beyond either the left or right side of the field it screenwraps to the opposite side. Sheep also wrap sideways. Move the hat beyond an edge now.";
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
    let txt = "The aim is to get sheep to the bottom row on the correct side: blue sheep belong on the left, and red sheep belong on the right. Click one side of the bottom row to continue.";
    let txtLines = getLines(canvasContext, txt, textWidth);
    for (var i = 0; i < txtLines.length; i++) {
      bodyLine(txtLines[i], ++line);
    }
    drawUI();
    drawCalling();
    drawSheep();
    player.draw();
    outlineRow(11);

    canvasContext.lineWidth = 4;
    canvasContext.setLineDash([]);
    let boxWidth = TILE_W * TILE_COLS/2;
    let topLeftY = gameCanvas.height - TILE_H;

    let topLeftX = 2;
    canvasContext.strokeStyle = TEAM_COLOURS[1];
    canvasContext.strokeRect(topLeftX,topLeftY, boxWidth-4,TILE_H-2);

    topLeftX = boxWidth+2;
    canvasContext.strokeStyle = TEAM_COLOURS[2];
    canvasContext.strokeRect(topLeftX,topLeftY, boxWidth-4,TILE_H-2);
  }

  // move to Call sheep
  else if (tutorStep == 4) {
    drawField();
    drawUI();
    drawCalling();
    drawSheep();
    player.draw();

    let txt = "Move the hat directly above a sheep, then click the 'Call' button. A sheep called by the hat is then 'sorted' into one of two teams and painted with that team's colour.";
    let txtLines = getLines(canvasContext, txt, textWidth);
    for (var i = 0; i < txtLines.length; i++) {
      bodyLine(txtLines[i], ++line);
    }
  }

  // move held sheep and Send downward
  else if (tutorStep == 5) {
    drawField();
    drawUI();
    drawCalling();
    drawSheep();
    player.draw();

    let txt = "Ideally a sheep should go in a pen (outlined) but going in the ditch on the correct side is better than going in a pen on the wrong side. Move the hat and then click the 'Send' button.";
    let txtLines = getLines(canvasContext, txt, textWidth);
    for (var i = 0; i < txtLines.length; i++) {
      bodyLine(txtLines[i], ++line);
    }
    outlineSelectedTile(177, 1);
    outlineSelectedTile(180, 1);
    outlineSelectedTile(183, 1);
    outlineSelectedTile(184, 1);
    outlineSelectedTile(187, 1);
    outlineSelectedTile(190, 1);
  }

  // tiles affect sheep
  else if (tutorStep == 6) {
    drawField();
    drawUI();
    drawCalling();
    drawSheep();
    player.draw();

    let txt = "Sheep collide with other sheep and are affected by terrain and NPCs, so they may stray from the vertical sending. When a sheep reaches the bottom row a score is displayed.";
    let txtLines = getLines(canvasContext, txt, textWidth);
    for (var i = 0; i < txtLines.length; i++) {
      blockLine(txtLines[i], ++line, 1);
    }

    txt = "When ready to continue, click the bottom row."
    blockLine(txt, ++line, 2);
  }

  // keys to move
  else if (tutorStep == 7) {
    drawField();
    drawUI();
    drawSheep();
    player.draw();
    let block = 1;
    if (!touchDevice) {
      canvasContext.drawImage(controlsPic, 320, 250);
      let txt = "Alternatively you can use keyboard controls: left and right arrow keys move the hat; the up arrow key Calls a sheep, and the down arrow key Sends.";
      let txtLines = getLines(canvasContext, txt, textWidth);
      for (var i = 0; i < txtLines.length; i++) {
        blockLine(txtLines[i], ++line, block);
      }
      block++;
    }
    txt = "The tutorial is complete. To continue click the 'Menu' button.";
    txtLines = getLines(canvasContext, txt, textWidth);
    for (var i = 0; i < txtLines.length; i++) {
      blockLine(txtLines[i], ++line, block);
    }
  }

} // end of drawGuide()