var currentLevel = 0; // load level increments
const LAST_LEVEL = 6;

const TILE_W = 50;
const TILE_H = 50;
const TILE_COLS = 17;
const TILE_ROWS = 12;

function getTileTypeAtColRow(col, row) {
	if(col >= 0 && col < TILE_COLS &&
		row >= 0 && row < TILE_ROWS) {
		 var tileIndexUnderColRow = colRowToIndex(col, row);
		 return (areaGrid[tileIndexUnderColRow]);
	} else {
		return TILE_HALT;
	}
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

function getTileIndexAtPixelCoord(pixelX, pixelY) {
  var tileCol = pixelX / TILE_W;
  var tileRow = pixelY / TILE_H;
  tileCol = Math.floor( tileCol );
  tileRow = Math.floor( tileRow );
  return(colRowToIndex(tileCol, tileRow));
}
function getColFromX(x) {
  return Math.floor( x / TILE_W );
}
function getRowFromX(y) {
  return Math.floor( y / TILE_H );
}

function drawArea() {
  var arrayIndex = 0;
  var drawTileX = 0;
  var drawTileY = 0;

	for(var eachRow=0; eachRow<TILE_ROWS; eachRow++) {
		for(var eachCol=0; eachCol<TILE_COLS; eachCol++) {

      var tileTypeHere = areaGrid[arrayIndex];

      if ( tileTypeHasTransparency(tileTypeHere) ) {
        canvasContext.drawImage(tilePics[TILE_FIELD], drawTileX, drawTileY);
      }

      if ( isGoal(tileTypeHere) ) {
        let team = tileTypeHere == TILE_PEN_BLUE ? 1 : 2;
        xyDrawGoalFence(drawTileX, drawTileY, team);
      } else {
        var useImg = tilePics[tileTypeHere];
        canvasContext.drawImage(useImg, drawTileX, drawTileY);
      }

      drawTileX += TILE_W;
      arrayIndex++;
		} // end of for each col
    drawTileX = 0;
    drawTileY += TILE_H;
	} // end of for each row
} // end of drawArea func

function checkGridMatchColsRows() {
  var numberTilesNeeded = TILE_COLS * TILE_ROWS;
  if(TILE_COLS * TILE_W > canvas.width) {
    console.log("Grid columns overflow canvas width");
  }
  if(TILE_ROWS * TILE_H > canvas.height) {
    console.log("Grid rows overflow canvas height");
  }
  if(areaGrid.length == numberTilesNeeded) {
    // console.log("Grid has correct number of tiles matching columns * rows", areaGrid.length, numberTilesNeeded);
  }
  if(areaGrid.length > numberTilesNeeded) {
    console.log("Grid has more tiles than allowed for by columns * rows", areaGrid.length, numberTilesNeeded);
  }
  if(areaGrid.length < numberTilesNeeded) {
    console.log("Grid lacks enough tiles to fill required columns * rows", areaGrid.length, numberTilesNeeded);
  }
}

function tileTypeHasTransparency(tileType) {
  return(tileType == TILE_UNSORT ||
        tileType == TILE_PEN_BLUE ||
        tileType == TILE_PEN_RED ||
        tileType == TILE_LOST ||
        tileType == TILE_STUCK ||
        tileType == TILE_HALT ||
        tileType == TILE_BEND_LEFT ||
        tileType == TILE_BEND_RIGHT ||
        tileType == TILE_CONVEYOR_LEFT ||
        tileType == TILE_CONVEYOR_RIGHT
        );
}

function drawLowRoad() {
  var drawTileX = 0;
  var drawTileY = TILE_H * TILE_ROWS;
  var tileTypeHere = TILE_LOW_ROAD;
  for(var i=0; i<TILE_COLS; i++) {
    var useImg = tilePics[tileTypeHere];
    canvasContext.drawImage(useImg, drawTileX, drawTileY);
    drawTileX += TILE_W;
  }
}

// initially 21 cols, 9 levels
function makePenRow(cols, penSize) {
  var middle = cols - penSize*2;
  var rowStr = '  '; // grid.js indent if pasting
  var fieldStr = TILE_CENTRE + ', ';
  var bluePenStr = TILE_PEN_BLUE + ', ';
  var redPenStr = TILE_PEN_RED + ', ';
  rowStr += bluePenStr.repeat(penSize);
  rowStr += fieldStr.repeat(middle);
  rowStr += redPenStr.repeat(penSize);
  rowStr = rowStr.slice(0, -1); // remove final space
  return rowStr;
}

function writeGoalRow(cols, penSize, offset) {
  var rowStr = '  '; // grid.js indent if pasting
  var ditchStr = TILE_ROAD + ', ';
  var centreStr = TILE_CENTRE + ', ';
  var bluePenStr = TILE_PEN_BLUE + ', ';
  var redPenStr = TILE_PEN_RED + ', ';
  var sideLength = (cols-1)/2 - offset -1;
  var centreLength = cols - 2*sideLength -2;
  rowStr += ditchStr.repeat(sideLength);
  rowStr += bluePenStr.repeat(penSize);
  rowStr += centreStr.repeat(centreLength);
  rowStr += redPenStr.repeat(penSize);
  rowStr += ditchStr.repeat(sideLength);
  rowStr = rowStr.slice(0, -1); // remove final space
  return rowStr;
}
function levelsGoalRows() {
  var txt = '';
  for (var i=0; i < 8; i++) {
    txt += writeGoalRow(TILE_COLS, 1, i) + '\n';
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
  var halfCols = (cols-1) / 2;
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

function showGridValues(grid, fontSize, fontColor) {
  var arrayIndex = 0;
  var drawTileX = 0;
  var drawTileY = 0;

	for(var eachRow=0; eachRow<TILE_ROWS; eachRow++) {
		for(var eachCol=0; eachCol<TILE_COLS; eachCol++) {
      var cell = grid[arrayIndex];
      canvasContext.font = fontSize + "px Arial";
      canvasContext.textAlign = "center";
      colorText(cell, drawTileX + TILE_W/2, drawTileY + TILE_H/2, fontColor);

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

const TEAM_POST_COLOURS = [ "white", "blue", "#ca1504", "purple"];
const POST_SIZE = 5;
const POST_GAP = 10;

function colDrawGoalFence(col, team) {
  let row = TILE_ROWS - 1; // bottom row always
  let topLeft = colRowToXY(col, row);
  // left fence
  var x1 = topLeft.x;
  for(var i=0; i<4; i++) {
    var y1 = topLeft.y + i * (POST_SIZE + POST_GAP);
    colorRect(x1,y1, POST_SIZE,POST_SIZE, TEAM_POST_COLOURS[team])
  }
  // right fence
  var x1 = topLeft.x + TILE_W - POST_SIZE;
  for(var i=0; i<4; i++) {
    var y1 = topLeft.y + i * (POST_SIZE + POST_GAP);
    colorRect(x1,y1, POST_SIZE,POST_SIZE, TEAM_POST_COLOURS[team])
  }
  // bottom fence
  var y1 = topLeft.y + TILE_H - POST_SIZE;
  for(var i=0; i<4; i++) {
    var x1 = topLeft.x + i * (POST_SIZE + POST_GAP);
    colorRect(x1,y1, POST_SIZE,POST_SIZE, TEAM_POST_COLOURS[team])
  }
}
function xyDrawGoalFence(x, y, team) {
  var topLeft = { x: x, y: y };
  // left fence
  var x1 = topLeft.x;
  for(var i=0; i<4; i++) {
    var y1 = topLeft.y + i * (POST_SIZE + POST_GAP);
    colorRect(x1,y1, POST_SIZE,POST_SIZE, TEAM_POST_COLOURS[team])
  }
  // right fence
  var x1 = topLeft.x + TILE_W - POST_SIZE;
  for(var i=0; i<4; i++) {
    var y1 = topLeft.y + i * (POST_SIZE + POST_GAP);
    colorRect(x1,y1, POST_SIZE,POST_SIZE, TEAM_POST_COLOURS[team])
  }
  // bottom fence
  var y1 = topLeft.y + TILE_H - POST_SIZE;
  for(var i=0; i<4; i++) {
    var x1 = topLeft.x + i * (POST_SIZE + POST_GAP);
    colorRect(x1,y1, POST_SIZE,POST_SIZE, TEAM_POST_COLOURS[team])
  }
}

// multi-tile goal
// - POST_SIZE/2; // half on adjacent tile
    // var x2 = x1 + POST_SIZE;
    // var y2 = y1 + POST_SIZE;

function isGoal(tile) {
  return tile == TILE_PEN_BLUE || tile == TILE_PEN_RED
}