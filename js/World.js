const TILE_W = 40;
const TILE_H = 40;
const TILE_GAP = 2;
const TILE_COLS = 20;
const TILE_ROWS = 15;

const TILE_FIELD = 0;
const TILE_PEN_BLUE = 1;
const TILE_PEN_RED = 2;
const TILE_GOAL = 3;
const TILE_FLAG_LEFT = 4;
const TILE_FLAG_RIGHT = 5;
const TILE_WALL = 6;
const TILE_TREE = 7;
const TILE_UNSORT = 8;
const TILE_PLAYERSTART = 9;

var areaGrid = [];
var saveGrid = [];

function getTileTypeAtColRow(col, row) {
	if(col >= 0 && col < TILE_COLS &&
		row >= 0 && row < TILE_ROWS) {
		 var trackIndexUnderCoord = rowColToArrayIndex(col, row);
		 return (areaGrid[trackIndexUnderCoord]);
	} else {
		return TILE_WALL;
	}
}

function carTrackHandling(whichCar) {
	var carTrackCol = Math.floor(whichCar.x / TILE_W);
	var carTrackRow = Math.floor(whichCar.y / TILE_H);
	var trackIndexUnderCar = rowColToArrayIndex(carTrackCol, carTrackRow);

	if(carTrackCol >= 0 && carTrackCol < TILE_COLS &&
		carTrackRow >= 0 && carTrackRow < TILE_ROWS) {
    var tileTypeHere = getTileTypeAtColRow(carTrackCol,carTrackRow);

		if(tileTypeHere == TILE_GOAL) {
      console.log(whichCar.name, "is the Winner!");
      loadLevel(level_1_normal);

    } else if(tileTypeHere != TILE_FIELD) {
			// undo car move to fix "car stuck in wall" bug
			whichCar.x -= Math.cos(whichCar.ang) * whichCar.speed;
			whichCar.y -= Math.sin(whichCar.ang) * whichCar.speed;
      // rebound from obstacle
			whichCar.speed *= -0.5;

		} // end of track found
	} // end of valid col and row
} // end of carTrackHandling func

function rowColToArrayIndex(col, row) {
	return col + TILE_COLS * row;
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

function checkTilesFitCanvas() {
  var numberTilesNeeded = TILE_COLS * TILE_ROWS;
  if(areaGrid.length > numberTilesNeeded) {
    console.log("Grid has too many tiles to fit on screen", areaGrid.length, numberTilesNeeded);
  }
}

function tileTypeHasTransparency(tileType) {
  return(tileType == TILE_UNSORT ||
        tileType == TILE_FLAG_LEFT ||
        tileType == TILE_FLAG_RIGHT);
}

// initially 21 cols, 9 levels
function makePenRow(cols, level) {
  var rowStr = '';
  var fieldStr = TILE_FIELD + ', ';
  var bluePenStr = TILE_PEN_BLUE + ', ';
  var redPenStr = TILE_PEN_RED + ', ';
  rowStr += fieldStr.repeat(3);
  return rowStr;
}