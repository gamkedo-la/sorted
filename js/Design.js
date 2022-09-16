var designLevel = 0; // blank start
var tileType = null;
var gridIndex = 92;
var designGrid = [];

var designTileReady = false;
var designGridSet = false;

// draw base with grass and road
// "level_" + designLevel;
function drawLevelDesigner(whichLevel) {
  var arrayIndex = 0;
  var drawTileX = 0;
  var drawTileY = 0;

  if(!designGridSet) {
    designGrid = levelList[designLevel].slice();
  }

  for(var eachRow=0; eachRow<TILE_ROWS; eachRow++) {
    for(var eachCol=0; eachCol<TILE_COLS; eachCol++) {

      var tileTypeHere = designGrid[arrayIndex];

      if(tileTypeHasTransparency(tileTypeHere)) {
        canvasContext.drawImage(tilePics[TILE_FIELD], drawTileX, drawTileY);
      }

      var useImg = tilePics[tileTypeHere];
      // console.log('tileTypeHere, arrayIndex', tileTypeHere, arrayIndex)
      canvasContext.drawImage(useImg, drawTileX, drawTileY);

      drawTileX += TILE_W;
      arrayIndex++;
    } // end of for each col
    drawTileX = 0;
    drawTileY += TILE_H;
  } // end of for each row

  drawLowRoad();
}

function levelDesignerTitle() {
  canvasContext.font = "24px Arial";
  let y = TILE_H * 15;
  colorText(canvasContext, "Design Level " + designLevel, 20, y, "white");
  canvasContext.font = "16px Arial";
  // colorText("key M returns to Menu", 600,30, "white");
  let msg = "Click to choose location; Number key to choose tiletype; M returns to Menu";
  // report(msg, 4);
}

function outlineSelectedTile(index) {
  // get row col from index
  let col = indexToCol(index);
  let row = indexToRow(index);
  let topLeftX = col * TILE_W;
  let topLeftY = row * TILE_H;
  // console.log("index,col,row", index, col, row, topLeftX, topLeftY);
  canvasContext.lineWidth = 2;
  canvasContext.setLineDash([]);
  canvasContext.strokeStyle = "yellow";
  canvasContext.strokeRect(topLeftX,topLeftY, TILE_W,TILE_H);
}

function outlineRow(row) {
  let topLeftX = 0;
  let topLeftY = row * TILE_H;
  canvasContext.lineWidth = 2;
  canvasContext.setLineDash([]);
  canvasContext.strokeStyle = "yellow";
  canvasContext.strokeRect(topLeftX, topLeftY, TILE_W * TILE_COLS, TILE_H);
}

function clearDesign() {
  areaGrid = levelList[0].slice();
}

function formatDesign() {
  var output = 'const level_' + designLevel + ' = [\n';
  var arrayIndex = 0;
  var space = '';

  for(var eachRow=0; eachRow<TILE_ROWS; eachRow++) {
    var line = ' ';
    for(var eachCol=0; eachCol<TILE_COLS; eachCol++) {
      let tile = areaGrid[arrayIndex];
      getLength(tile) > 1 ? space = ' ' : space = '  ';

      line += space + areaGrid[arrayIndex] + ',';
      arrayIndex++;
    }
    output += line + '\n';
  }
  output += '];\n';

  saveDesign(output);
  return output;
}

function saveDesign(output) {
  let filename = 'design_level_' + designLevel + '.txt';
  downloader(filename, output);
}

function getLength(number) {
  return number.toString().length;
}