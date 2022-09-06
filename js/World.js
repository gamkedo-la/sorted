var currentLevel = 0; // load level increments
const LAST_LEVEL = 6;

const TILE_W = 40;
const TILE_H = 40;
const TILE_COLS = 21;
const TILE_ROWS = 15;

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

      if(tileTypeHasTransparency(tileTypeHere)) {
        canvasContext.drawImage(tilePics[TILE_FIELD], drawTileX, drawTileY);
      }

      var useImg = tilePics[tileTypeHere];
      canvasContext.drawImage(useImg, drawTileX, drawTileY);
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
  if(TILE_ROWS * TILE_H > canvas.height-20) {
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
