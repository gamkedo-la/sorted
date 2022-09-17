var designLevel = 0; // blank start
var tileType = null;
var gridIndex = 92;
var designGrid = [];

var designTileReady = false;
var designGridSet = false;

// to increment filename of design saves
var designCount = Array(NUM_LEVELS);
designCount.fill(0);

function drawDesignerFromGrid(designGrid) {
  var arrayIndex = 0;
  var drawTileX = 0;
  var drawTileY = 0;

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
}

function drawDesignerFromLevelNum(whichLevel) {
  if(!designGridSet) {
    designGrid = levelList[whichLevel].slice();
  }
  drawDesignerFromGrid(designGrid);
}

function levelDesignerTitle() {
  canvasContext.font = "20px Arial";
  let x = 30;
  let y = TILE_H - 16;
  colorText(canvasContext, "Design Level " + designLevel + " -- F7 change level; click square; numkey tiletype; S save; M menu", x, y, "white");
  canvasContext.font = "16px Arial";
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

// cannot directly clear Grid.js level data
// only clear current display, and even that would only work if drawDesignerFromLevelNum() could be passed a grid rather than a level number to lookup levelList data.
function clearDesign() {
  designGrid = levelList[0].slice();
  drawDesignerFromLevelNum(0);
}

function formatDesign() {
  var output = 'const level_' + designLevel + ' = [\n';
  var arrayIndex = 0;
  var space = '';

  for(var eachRow=0; eachRow<TILE_ROWS; eachRow++) {
    var line = ' ';
    for(var eachCol=0; eachCol<TILE_COLS; eachCol++) {
      let tile = designGrid[arrayIndex];
      getLength(tile) > 1 ? space = ' ' : space = '  ';

      line += space + designGrid[arrayIndex] + ',';
      arrayIndex++;
    }
    output += line + '\n';
  }
  output += '];\n';

  saveDesign(output);
  console.log(output);
  return output;
}

function saveDesign(output) {
  // + designCount[designLevel]
  let filename = 'level_' + designLevel + '_design_' + '.txt';
  downloader(filename, output);
}

function getLength(number) {
  return number.toString().length;
}