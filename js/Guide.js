function drawGuide() {
  textIndent = 50;
  drawPlay();

  if (tutorStep == 1) {
    canvasContext.lineWidth = 2;
    canvasContext.setLineDash([]);
    canvasContext.strokeStyle = "yellow";
    canvasContext.strokeRect(player.x - TILE_W / 2, 0, TILE_W, TILE_H);

    let txt = "Player controls the hat (at top of field) which represents a farmer's sheepclamp. It only moves horizontally. Move it now by clicking (in side bar) button Left or Right.";
    let txtLines = getLines(canvasContext, txt, 600);
    let line = 0;
    var yTop = 300;
    for (var i = 0; i < txtLines.length; i++) {
      smallBodyLine(txtLines[i], ++line, yTop);
    }
  }

  else if (tutorStep == 2) {
    outlineRow(0);
  }
}