var flashTimer = null;
var flashing = false;

function setStyleUI() {
  uiContext.lineWidth = 4;
  uiContext.setLineDash([]);
  uiContext.strokeStyle = "orange";
}
function setStyleOutline() {
  canvasContext.lineWidth = 2;
  canvasContext.setLineDash([]);
  canvasContext.strokeStyle = "yellow";
}

function moveGuide() {

  player.move();
  
  if (tutorStep > 1) {
    for (var i = 0; i < sheepList.length; i++) {
      sheepList[i].move();
    }
  }
  if (flashTimer > 0) {
    flashTimer--;
    // if (flashTimer % 5 == 0) {
    if (flashTimer == 0) {
      flashing = !flashing;
      flashTimer = 20;
    }
  }
}

function drawGuide() {

  if (tutorStep == 1) {
    drawField();
    contextSettingsTutorial();
    let txt = "The player controls a hat (at top of the field) which represents a farmer's sheep-clamp. It only moves horizontally. Move it now by clicking (in side bar) button Left or Right.";
    let txtLines = getLines(canvasContext, txt, textWidth);
    for (var i = 0; i < txtLines.length; i++) {
      bodyLine(txtLines[i], ++line);
    }
    drawUI();
    // outline L&R buttons
    setStyleUI();
    uiContext.strokeRect(buttonRects[0].x, buttonRects[0].y, buttonRects[0].width, buttonRects[0].height);
    uiContext.strokeRect(buttonRects[1].x, buttonRects[1].y, buttonRects[1].width, buttonRects[1].height);

    player.draw();

    // outline Hat
    setStyleOutline();
    canvasContext.strokeRect(player.x - TILE_W / 2, 0, TILE_W, TILE_H);
  }

  else if (tutorStep == 2) {
    drawField();
    contextSettingsTutorial();
    let txt = "When the hat moves beyond either the left or right side of the field it wraps to the opposite side. Sheep also wrap sideways. Move the hat beyond an edge now.";
    let txtLines = getLines(canvasContext, txt, textWidth);
    for (var i = 0; i < txtLines.length; i++) {
      bodyLine(txtLines[i], ++line);
    }
    player.draw();
    drawSheep();

    drawUI();
    setStyleOutline();
    outlineRow(0);
    if (flashing) {
      canvasContext.lineWidth = 20;
      colorLine(canvasContext, 0, 0, 0, TILE_H, TEAM_COLOURS[1]);
      colorLine(canvasContext, gameCanvas.width, 0, gameCanvas.width, TILE_H, TEAM_COLOURS[2]);
    }

    setStyleUI();
    uiContext.strokeRect(buttonRects[0].x, buttonRects[0].y, buttonRects[0].width, buttonRects[0].height);
    uiContext.strokeRect(buttonRects[1].x, buttonRects[1].y, buttonRects[1].width, buttonRects[1].height);
  }


  // move to Call sheep
  else if (tutorStep == 3) {
    drawField();
    drawUI();
    drawCalling();
    drawSheep();
    player.draw();
    contextSettingsTutorial();
    let txt = "Move the hat directly above a sheep, then click the 'Call' button. A sheep called to the hat is then 'sorted' into one of two teams (blue or red) and painted appropriately.";
    let txtLines = getLines(canvasContext, txt, textWidth);
    for (var i = 0; i < txtLines.length; i++) {
      bodyLine(txtLines[i], ++line);
    }
    // highlight Call button 
    // if (flashing) {
      setStyleUI();
      uiContext.strokeRect(buttonRects[2].x, buttonRects[2].y, buttonRects[2].width, buttonRects[2].height);
    // }
  }

// Click one side of the bottom row to continue
  // bottom row correct side
  else if (tutorStep == 4) {
    drawField();
    contextSettingsTutorial();
    let txt = "The aim is to get sheep to the bottom row on the correct side: blue sheep belong on the left, and red sheep on the right. Move the hat and click the 'Send' button.";
    let txtLines = getLines(canvasContext, txt, textWidth);
    for (var i = 0; i < txtLines.length; i++) {
      bodyLine(txtLines[i], ++line);
    }
    drawUI();
    drawCalling();
    drawSheep();
    player.draw();
    setStyleOutline();
    outlineRow(11);

    if (flashing) {
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
  }


  // move held sheep and Send downward
  else if (tutorStep == 5) {
    drawField();
    drawUI();
    drawCalling();
    drawSheep();
    player.draw();
    contextSettingsTutorial();
    let txt = "Ideally a sheep should go in a pen (outlined) but going in a ditch on the correct side is better than going in a pen on the wrong side. Again, move the hat, then Call and Send.";
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
    contextSettingsTutorial();
    let txt = "Sheep collide and are affected by terrain, so they can stray from the vertical sending. When a sheep reaches the bottom a score is displayed. To finish, call another sheep.";
    let txtLines = getLines(canvasContext, txt, textWidth);
    for (var i = 0; i < txtLines.length; i++) {
      blockLine(txtLines[i], ++line, 1);
    }
  }

  // keys to move
  else if (tutorStep == 7) {
    drawField();
    drawUI();
    drawSheep();
    player.draw();
    let block = 1;
    contextSettingsTutorial();
    if (!touchDevice) {
      canvasContext.drawImage(controlsPic, 320, 250);

      let txt = "Alternatively you can use keyboard controls: Left and Right arrow keys move the hat; the up arrow key Calls a sheep, and the down arrow key Sends.";
      let txtLines = getLines(canvasContext, txt, textWidth);
      for (var i = 0; i < txtLines.length; i++) {
        blockLine(txtLines[i], ++line, block);
      }
      block++;
    }
    txt = "Click the 'Menu' button to return to the game.";
    txtLines = getLines(canvasContext, txt, textWidth);
    for (var i = 0; i < txtLines.length; i++) {
      blockLine(txtLines[i], ++line, block);
    }
  }

} // end of drawGuide()


function whenTutorialStep2() {
  if (gameState == STATE_GUIDE && tutorStep == 1) {
    tutorStep = 2;
    flashTimer = 20;

    // for step 2 create sheep that move sideways
    sheepList = [];
    whichLevel = currentLevel;
    flockSize = FLOCK_SIZE[whichLevel];
    var team = PLAIN;
    for (var i = 0; i < flockSize; i++) {
      var spawnSheep = new sheepClass();
      var mode = ROAM;
      var potential = i % 2 == 0 ? BLUE : RED;
      var team = PLAIN;
      spawnSheep.reset(i, team, potential, mode);
      placeDifferentRows(spawnSheep, i);
      // spawnSheep.placeGridRandom(PLACING_DEPTH[whichLevel]);
      spawnSheep.timer = 999999;
      spawnSheep.ang = potential == 1 ? 0 : Math.PI;
      sheepList.push(spawnSheep);
    }
  }  
}

function whenTutorialStep3() {
  if (gameState == STATE_GUIDE && tutorStep == 2) {
    tutorStep = 3;
    flashTimer = 20;
    setupDecals();

    // for step 3 create normal sheep 
    sheepList = [];
    whichLevel = currentLevel;
    flockSize = FLOCK_SIZE[whichLevel];
    var team = PLAIN;
    for (var i = 0; i < flockSize; i++) {
      var spawnSheep = new sheepClass();
      var mode = i % 2 == 0 ? ROAM : GRAZE;
      var potential = i % 2 == 0 ? BLUE : RED;
      var team = PLAIN;
      spawnSheep.reset(i, team, potential, mode);
      spawnSheep.placeGridRandom(PLACING_DEPTH[whichLevel]);
      sheepList.push(spawnSheep);
    }
  }  
}


placeDifferentRows = function (obj, i) {
  let row = i + 3;
  let col = randomRangeInt(0, TILE_COLS - 1);
  obj.x = col * TILE_W + TILE_W / 2;
  obj.y = row * TILE_H + TILE_H / 2;
}

function contextSettingsTutorial() {
  indentX = 50;
  topY = 100;
  line = 0;
  textWidth = 700;
  LINE_SPACING = 30;
  // needed by getLines before calling bodyLine
  fontSize = 22;
  canvasContext.font = fontSize + "px Verdana";
  canvasContext.textAlign = "left";
}