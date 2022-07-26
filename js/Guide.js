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
  moveParticles();
}


function drawGuide() {

  if (tutorStep == 1) {
    drawTutorial();
    let txt = "The player controls a hat (at top of the field) which represents a farmer's sheep-clamp. It only moves horizontally. Move it now by clicking (in side bar) button Left or Right.";
    let txtLines = getLines(canvasContext, txt, textWidth);
    for (var i = 0; i < txtLines.length; i++) {
      bodyLine(txtLines[i], ++line);
    }

    // outline Hat
    setStyleOutline();
    canvasContext.strokeRect(player.x - TILE_W / 2, 0, TILE_W, TILE_H);
    canvas_arrow(canvasContext, player.x, 90, player.x, 67, 10, 'yellow');
    
    // buttons left/right
    setStyleUI();
    outlineButton(0); // Left
    arrowToButton(0);
    outlineButton(1); // Right
    arrowToButton(1);
  }

  else if (tutorStep == 2) {
    drawTutorial();
    let txt = "When the hat moves beyond either the left or right side of the field it wraps to the opposite side. Sheep also wrap sideways. Move the hat beyond an edge now.";
    let txtLines = getLines(canvasContext, txt, textWidth);
    for (var i = 0; i < txtLines.length; i++) {
      bodyLine(txtLines[i], ++line);
    }

    outlineRow(0);
    if (flashing) {
      canvasContext.lineWidth = 20;
      colorLine(canvasContext, 0, 0, 0, TILE_H, TEAM_COLOURS[1]);
      colorLine(canvasContext, gameCanvas.width, 0, gameCanvas.width, TILE_H, TEAM_COLOURS[2]);
    }

    setStyleUI();
    outlineButton(0); // Left
    outlineButton(1); // Right
  }


  // move to Call sheep
  else if (tutorStep == 3) {
    drawTutorial();
    let txt = "Move the hat directly above a sheep, then click the 'Call' button. A sheep called to the hat is then 'sorted' into one of two teams (blue or red) and painted appropriately.";
    let txtLines = getLines(canvasContext, txt, textWidth);
    for (var i = 0; i < txtLines.length; i++) {
      bodyLine(txtLines[i], ++line);
    }

    // highlight Call button 
    outlineButton(2); 
    arrowToButton(2);
  }

  // Click one side of the bottom row to continue
  // bottom row correct side
  else if (tutorStep == 4) {
    drawTutorial();
    let txt = "The aim is to get sheep to the bottom row on the correct side: blue sheep belong on the left, and red sheep on the right. Move the hat and click the 'Send' button.";
    let txtLines = getLines(canvasContext, txt, textWidth);
    for (var i = 0; i < txtLines.length; i++) {
      bodyLine(txtLines[i], ++line);
    }

    setStyleOutline();
    outlineRow(11);
    if (flashing) {
      canvasContext.lineWidth = 4;
      canvasContext.setLineDash([]);
      let boxWidth = TILE_W * TILE_COLS / 2;
      let topLeftY = gameCanvas.height - TILE_H;

      let topLeftX = 2;
      canvasContext.strokeStyle = TEAM_COLOURS[1];
      canvasContext.strokeRect(topLeftX, topLeftY, boxWidth - 4, TILE_H - 2);

      topLeftX = boxWidth + 2;
      canvasContext.strokeStyle = TEAM_COLOURS[2];
      canvasContext.strokeRect(topLeftX, topLeftY, boxWidth - 4, TILE_H - 2);
    }

    setStyleUI();
    outlineButton(3); // Send
    arrowToButton(3);
  }


  // move held sheep and Send downward
  else if (tutorStep == 5) {
    drawTutorial();
    let txt = "Ideally a sheep should go in a pen (indicated) but going on the correct side in a ditch is better than going in a pen on the wrong side. Try call and send again.";
    let txtLines = getLines(canvasContext, txt, textWidth);
    for (var i = 0; i < txtLines.length; i++) {
      bodyLine(txtLines[i], ++line);
    }

    var penCentre = [75, 225, 375, 425, 575, 725];
    var color = TEAM_COLOURS[1];
    for (var i = 0; i < penCentre.length; i++) {
      if (i >= 3) { color = TEAM_COLOURS[2]; }
      canvas_arrow(canvasContext, penCentre[i], 515, penCentre[i], 540, 10, color);
    }
    canvasContext.lineJoin = 'miter'; // restore default
  }

  // tiles affect sheep
  else if (tutorStep == 6) {
    drawTutorial();
    let txt = "Sheep collide and are affected by terrain so they can stray from the vertical sending. When a sheep reaches the bottom a score is displayed. Call another sheep now.";
    let txtLines = getLines(canvasContext, txt, textWidth);
    for (var i = 0; i < txtLines.length; i++) {
      bodyLine(txtLines[i], ++line, 1);
    }
  }

  // End a level
  else if (tutorStep == 7) {
    drawTutorial();
    var txt = 'You can suspend the game with the "Pause" button or Spacebar key. It is also possible to end a Level early using the "End" button or F4 function key, but here in the tutorial that will only go to the final step; try it now.';
    if (touchDevice) {
      let txt = 'You can "Pause" the game; try that button, and then "Go". It is also possible to end a Level early by using the "End" button, but here in the tutorial that will only go to the final step; click "End" now.';
    }
    let txtLines = getLines(canvasContext, txt, textWidth);
    for (var i = 0; i < txtLines.length; i++) {
      bodyLine(txtLines[i], ++line, 1);
    }

    setStyleUI();
    outlineButton(4); // Pause
    arrowToButton(4);

    outlineButton(5); // End
    arrowToButton(5);
  }

  // keys to move
  else if (tutorStep == 8) {
    drawTutorial();
    let block = 1;
    contextSettingsTutorial();
    textWidth = 480; // to avoid obscuring arrowkeys tooltip

    if (!touchDevice) {
      canvasContext.drawImage(controlsPic, 550, 120);
      let txt = "You can use keyboard controls: Left and Right arrow keys move the hat; the up arrow key Calls a sheep, and the down arrow Sends. Try those now.";
      let txtLines = getLines(canvasContext, txt, textWidth);
      for (var i = 0; i < txtLines.length; i++) {
        blockLine(txtLines[i], ++line, block);
      }
      block++;
    }
    txt = "Then click the 'Menu' button.";
    txtLines = getLines(canvasContext, txt, textWidth);
    for (var i = 0; i < txtLines.length; i++) {
      blockLine(txtLines[i], ++line, block);
    }
  }

} // end of drawGuide()


function outlineButton(btn) {
  uiContext.strokeRect(buttonRects[btn].x, buttonRects[btn].y, buttonRects[btn].width, buttonRects[btn].height);
}

function arrowToButton(btn) {
  let y = buttonsTop + (btn*2+1) * buttonHeight/2;
  canvas_arrow(canvasContext, 750, y, 790, y, 10, 'yellow');
}


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
  LINE_SPACING = 38;
  BLOCK_LINE_SPACING = 38;
  // needed by getLines before calling bodyLine
  fontSize = 27;
  canvasContext.font = fontSize + "px Verdana";
  canvasContext.textAlign = "left";
}


function drawTutorial() {
  drawField();
  drawUI();
  drawCalling();
  drawSheep();
  player.draw();
  drawVisualFX();
  contextSettingsTutorial();
}