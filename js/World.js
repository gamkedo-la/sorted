var currentLevel = 0;
const LAST_LEVEL = 9;

const TILE_W = 50;
const TILE_H = 50;
const TILE_COLS = 16;
const TILE_ROWS = 12;

var bottomMargin = 0;

const penCols = [1, 4, 7, 8, 11, 14];
const bottomRowID = Array(TILE_COLS);

const POST_SIZE = 5;
const POST_THICK = 4;
const POST_GAP = 10;

const ROAD_ROW = [18, 18, 19, 18, 18, 19, 18, 18, 18, 18, 18, 19, 18, 18, 19, 18];


function getTileIndexAtXY(x, y) {
  if (x < 0 || x > gameCanvas.width || y < 0 || y > gameCanvas.height) {
    console.log("co-ordinate not within field");
    return null;
  }
  var tileCol = x / TILE_W;
  var tileRow = y / TILE_H;
  tileCol = Math.floor(tileCol);
  tileRow = Math.floor(tileRow);
  return (colRowToIndex(tileCol, tileRow));
}


function getTileTypeAtColRow(col, row) {
  if (col >= 0 && col < TILE_COLS &&
    row >= 0 && row < TILE_ROWS) {
    var tileIndexUnderColRow = colRowToIndex(col, row);
    return (areaGrid[tileIndexUnderColRow]);
  } else {
    // console.log(tileIndexUnderColRow, col, row, "column/row not within field");
    // return TILE_DISTRACT;
  }
}


function getTileTypeAtXY(x, y) {
  let index = getTileIndexAtXY(x, y);
  console.log(areaGrid[index]);
  return areaGrid[index];
}

function colRowToIndex(col, row) {
  return col + TILE_COLS * row;
}

function indexToCol(index) {
  return (index % TILE_COLS);
}

function indexToRow(index) {
  return Math.floor(index / TILE_COLS);
}

function getColFromX(x) {
  return Math.floor(x / TILE_W);
}

function getRowFromX(y) {
  return Math.floor(y / TILE_H);
}


function drawGrass() {
  var drawTileX = 0;
  var drawTileY = 0;

  var rowCount = TILE_ROWS;
  if (showingRoadScene) {
    rowCount++;
  }

  for (var eachRow = 0; eachRow < rowCount; eachRow++) {
    for (var eachCol = 0; eachCol < TILE_COLS; eachCol++) {

      canvasContext.drawImage(tilePics[TILE_FIELD], drawTileX, drawTileY);

      drawTileX += TILE_W;
    } // end of for each col
    drawTileX = 0;
    drawTileY += TILE_H;
  } // end of for each row
} // end of drawGrass


function drawTiles() {
  var arrayIndex = 0;
  var drawTileX = 0;
  var drawTileY = 0;

  var rowCount = TILE_ROWS;
  if (showingRoadScene) {
    rowCount++;
  }

  for (var eachRow = 0; eachRow < rowCount; eachRow++) {
    for (var eachCol = 0; eachCol < TILE_COLS; eachCol++) {

      var tileTypeHere = areaGrid[arrayIndex];

      // if (tileTypeHasTransparency(tileTypeHere) || isDecalClump(tileTypeHere)) {
      //   canvasContext.drawImage(tilePics[TILE_FIELD], drawTileX, drawTileY);
      // }

      if (isDecalClump(tileTypeHere)) {
        // update decal clump location
        let index = tileTypeHere - 20;
        levelClumpXY[currentLevel][index] = { x: drawTileX + TILE_W / 2, y: drawTileY + TILE_H / 2 };
        // console.log('levelClumpXY', currentLevel, index)
      }

      else if (tileTypeHere == TILE_HALT) {
        var useImg = tilePics[tileTypeHere];
        let rotator = (eachRow * 3 + eachCol) % 4;
        let tileAngle = rotator * Math.PI / 2;
        drawBitmapCenteredWithRotation(canvasContext, useImg, drawTileX + TILE_W / 2, drawTileY + TILE_H / 2, tileAngle);
      }

      else if (tileTypeHere != TILE_FIELD) {
        var useImg = tilePics[tileTypeHere];
        // console.log(eachCol, eachRow, step[currentLevel], useImg)
        canvasContext.drawImage(useImg, drawTileX, drawTileY);
      }

      if (isPen(tileTypeHere)) {
        // canvasContext.drawImage(TILE_GOAL, drawTileX, drawTileY);
        let team = isBluePen(tileTypeHere) ? 1 : 2;
        xyDrawPenFence(drawTileX, drawTileY, team);
      }

      drawTileX += TILE_W;
      arrayIndex++;
    } // end of for each col
    drawTileX = 0;
    drawTileY += TILE_H;
  } // end of for each row

} // end of drawTiles


function checkGridMatchColsRows() {
  var numberTilesNeeded = TILE_COLS * TILE_ROWS;
  if (TILE_COLS * TILE_W > gameCanvas.width) {
    console.log("Grid columns overflow canvas width");
  }
  if (TILE_ROWS * TILE_H > gameCanvas.height) {
    console.log("Grid rows overflow canvas height");
  }
  if (areaGrid.length == numberTilesNeeded) {
    // console.log("Grid has correct number of tiles matching columns * rows", areaGrid.length, numberTilesNeeded);
  }
  if (areaGrid.length > numberTilesNeeded) {
    console.log("Grid has more tiles than allowed for by columns * rows", areaGrid.length, numberTilesNeeded);
  }
  if (areaGrid.length < numberTilesNeeded) {
    console.log("Grid lacks enough tiles to fill required columns * rows", areaGrid.length, numberTilesNeeded);
  }
}


function tileTypeHasTransparency(tileType) {
  return (
    tileType == TILE_UNSORT ||
    tileType == TILE_PEN_BLUE ||
    tileType == TILE_PEN_RED ||
    tileType == FULL_BLUE ||
    tileType == FULL_RED ||
    tileType == TILE_SLOW ||
    tileType == TILE_STUCK ||
    tileType == TILE_HALT ||
    tileType == TILE_DISTRACT ||
    tileType == TILE_BEND_LEFT ||
    tileType == TILE_BEND_RIGHT ||
    tileType == TILE_CONVEYOR_UP ||
    tileType == TILE_CONVEYOR_DOWN ||
    tileType == TILE_CONVEYOR_LEFT ||
    tileType == TILE_CONVEYOR_RIGHT ||
    tileType == TILE_RAILS
  );
}

function isDecalClump(tileType) {
  return (
    tileType == YELLOW_FLOWER ||
    tileType == BLUE_FLOWER ||
    tileType == RED_FLOWER ||
    tileType == BRIGHT_GRASS
  );
}


// initially 21 cols, 9 levels
function makePenRow(cols, penSize) {
  var middle = cols - penSize * 2;
  var rowStr = '  '; // grid.js indent if pasting
  var fieldStr = TILE_DITCH + ', ';
  var bluePenStr = TILE_PEN_BLUE + ', ';
  var redPenStr = TILE_PEN_RED + ', ';
  rowStr += bluePenStr.repeat(penSize);
  rowStr += fieldStr.repeat(middle);
  rowStr += redPenStr.repeat(penSize);
  rowStr = rowStr.slice(0, -1); // remove final space
  return rowStr;
}


function writePenRow(cols, penSize, offset) {
  var rowStr = '  '; // grid.js indent if pasting
  var ditchStr = TILE_DITCH + ', ';
  // var centreStr = TILE_CENTRE + ', ';
  var bluePenStr = TILE_PEN_BLUE + ', ';
  var redPenStr = TILE_PEN_RED + ', ';
  var sideLength = (cols - 1) / 2 - offset - 1;
  var centreLength = cols - 2 * sideLength - 2;
  rowStr += ditchStr.repeat(sideLength);
  rowStr += bluePenStr.repeat(penSize);
  rowStr += centreStr.repeat(centreLength);
  rowStr += redPenStr.repeat(penSize);
  rowStr += ditchStr.repeat(sideLength);
  rowStr = rowStr.slice(0, -1); // remove final space
  return rowStr;
}


function levelsPenRows() {
  var txt = '';
  for (var i = 0; i < 8; i++) {
    txt += writePenRow(TILE_COLS, 1, i) + '\n';
  }
  console.log(txt);
}


function makeFieldRow(cols) {
  var rowStr = '  '; // grid.js indent if pasting
  var fieldStr = TILE_FIELD + ', ';
  rowStr += fieldStr.repeat(cols);
  rowStr = rowStr.slice(0, -1); // remove final space
  return rowStr;
}


function makeHatRow(cols) {
  var halfCols = (cols - 1) / 2;
  var rowStr = '  '; // grid.js indent if pasting
  var fieldStr = TILE_FIELD + ', ';
  rowStr += fieldStr.repeat(halfCols);
  rowStr += TILE_PLAYERSTART + ', ';
  rowStr += fieldStr.repeat(halfCols);
  rowStr = rowStr.slice(0, -1); // remove final space
  return rowStr;
}


function strRowSameTile(cols, tile) {
  var rowStr = '  '; // grid.js indent if pasting
  var fieldStr = tile + ', ';
  rowStr += fieldStr.repeat(cols);
  rowStr = rowStr.slice(0, -1); // remove final space
  return rowStr;
}


function drawGridValues(grid, fontSize, fontColor) {
  var arrayIndex = 0;
  var drawTileX = 0;
  var drawTileY = 0;

  for (var eachRow = 0; eachRow < TILE_ROWS; eachRow++) {
    for (var eachCol = 0; eachCol < TILE_COLS; eachCol++) {
      var cell = grid[arrayIndex];
      canvasContext.font = fontSize + "px Arial";
      canvasContext.textAlign = "center";
      colorText(canvasContext, cell, drawTileX + TILE_W / 2, drawTileY + TILE_H / 2, fontColor);

      drawTileX += TILE_W;
      arrayIndex++;
    } // end of for each col
    drawTileX = 0;
    drawTileY += TILE_H;
  } // end of for each row
}


// refactor showOnGrid() combining drawGridValues(), showGridIndex(), and showAgentGrid() with extra parameter which text to write.
function drawGridIndex(grid, fontSize, fontColor) {
  var arrayIndex = 0;
  var drawTileX = 0;
  var drawTileY = 0;
  for (var eachRow = 0; eachRow < TILE_ROWS; eachRow++) {
    for (var eachCol = 0; eachCol < TILE_COLS; eachCol++) {
      canvasContext.font = fontSize + "px Arial";
      canvasContext.textAlign = "center";
      colorText(canvasContext, arrayIndex, drawTileX + TILE_W / 2, drawTileY + TILE_H / 2, fontColor);

      drawTileX += TILE_W;
      arrayIndex++;
    } // end of for each col
    drawTileX = 0;
    drawTileY += TILE_H;
  } // end of for each row
}

function drawColRow(grid, fontSize, fontColor) {
  var arrayIndex = 0;
  var drawTileX = 0;
  var drawTileY = 0;
  for (var eachRow = 0; eachRow < TILE_ROWS; eachRow++) {
    for (var eachCol = 0; eachCol < TILE_COLS; eachCol++) {
      let colRowStr = eachCol + "," + eachRow;
      canvasContext.font = fontSize + "px Arial";
      canvasContext.textAlign = "center";
      colorText(canvasContext, colRowStr, drawTileX + TILE_W / 2, drawTileY + TILE_H / 2, fontColor);

      drawTileX += TILE_W;
      arrayIndex++;
    } // end of for each col
    drawTileX = 0;
    drawTileY += TILE_H;
  } // end of for each row
}


function colRowToXY(col, row) {
  // top left corner of tile
  var x = col * TILE_W;
  var y = row * TILE_H;
  return {
    x: x,
    y: y,
  }
}


function colDrawPenFence(col, team) {
  let row = TILE_ROWS - 1; // bottom row always
  let topLeft = colRowToXY(col, row);
  // left fence
  var x1 = topLeft.x;
  for (var i = 0; i < 4; i++) {
    var y1 = topLeft.y + i * (POST_SIZE + POST_GAP);
    colorRect(canvasContext, x1, y1, POST_THICK, POST_SIZE, TEAM_POST_COLOURS[team])
  }
  // right fence
  var x1 = topLeft.x + TILE_W - POST_THICK;
  for (var i = 0; i < 4; i++) {
    var y1 = topLeft.y + i * (POST_SIZE + POST_GAP);
    colorRect(canvasContext, x1, y1, POST_THICK, POST_SIZE, TEAM_POST_COLOURS[team])
  }
  // bottom fence
  var y1 = topLeft.y + TILE_H - POST_SIZE;
  for (var i = 0; i < 4; i++) {
    var x1 = topLeft.x + i * (POST_SIZE + POST_GAP);
    colorRect(canvasContext, x1, y1, POST_SIZE, POST_SIZE, TEAM_POST_COLOURS[team])
  }
}


function xyDrawPenFence(x, y, team) {
  var topLeft = { x: x, y: y };
  // left fence
  var x1 = topLeft.x;
  for (var i = 0; i < 4; i++) {
    var y1 = topLeft.y + i * (POST_SIZE + POST_GAP);
    colorRect(canvasContext, x1, y1, POST_THICK, POST_SIZE, POST_DARK_COLOURS[team])
  }
  // right fence
  var x1 = topLeft.x + TILE_W - POST_THICK;
  for (var i = 0; i < 4; i++) {
    var y1 = topLeft.y + i * (POST_SIZE + POST_GAP);
    colorRect(canvasContext, x1, y1, POST_THICK, POST_SIZE, POST_DARK_COLOURS[team])
  }
  // bottom fence
  // var y1 = topLeft.y + TILE_H - POST_SIZE;
  // for(var i=0; i<4; i++) {
  //   var x1 = topLeft.x + i * (POST_SIZE + POST_GAP);
  //   colorRect(canvasContext, x1,y1, POST_SIZE,POST_SIZE, TEAM_COLOURS[team])
  // }
}


function colDrawPenGate(col, team) {
  let row = TILE_ROWS - 1; // bottom row always
  let topLeft = colRowToXY(col, row);
  // top fence
  var y1 = topLeft.y;

  for (var i = 0; i < 4; i++) {
    var x1 = topLeft.x + i * (POST_SIZE + POST_GAP);
    colorRect(canvasContext, x1, y1, POST_SIZE, POST_THICK, POST_DARK_COLOURS[team])
  }
}


function isPen(tile) {
  return tile == TILE_PEN_BLUE || tile == TILE_PEN_RED || tile == FULL_BLUE || tile == FULL_RED
}
function isEmptyPen(tile) {
  return tile == TILE_PEN_BLUE || tile == TILE_PEN_RED
}
function isFullPen(tile) {
  return tile == FULL_BLUE || tile == FULL_RED
}
function isBluePen(tile) {
  return tile == TILE_PEN_BLUE || tile == FULL_BLUE
}