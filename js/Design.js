var designLevel = 0; // blank start
var tileType = 0;
var gridIndex = 88; // changed by Input.js
var areaGrid = Array(TILE_COLS * TILE_ROWS);
var ditchRow = [10, 11, 10, 10, 11, 10, 10, 11, 12, 10, 10, 12, 10, 10, 12, 10];

// put this inside an init test function
if (ditchRow.length != TILE_COLS) {
  console.log('Error: ditchRow array doesnt match game columns');
}

var designTileReady = false; // only write change once
var designGridSet = false; // new grid loaded


function drawFieldFromGrid(areaGrid) {
  var arrayIndex = 0;
  var drawTileX = 0;
  var drawTileY = 0;
  var useImg;

  for(var eachRow=0; eachRow<TILE_ROWS; eachRow++) {
    for(var eachCol=0; eachCol<TILE_COLS; eachCol++) {

      var tileTypeHere = areaGrid[arrayIndex];

      if (tileTypeHasTransparency(tileTypeHere) || isDecalClump(tileTypeHere)) {
        canvasContext.drawImage(tilePics[TILE_FIELD], drawTileX, drawTileY);
      }

      if (isDecalClump(tileTypeHere)) {
        useImg = tilePics[TILE_FIELD];
        // console.log('tileTypeHere, arrayIndex', tileTypeHere, arrayIndex)
      } else {
        useImg = tilePics[tileTypeHere];
      }

      canvasContext.drawImage(useImg, drawTileX, drawTileY);

      drawTileX += TILE_W;
      arrayIndex++;
    } // end of for each col
    drawTileX = 0;
    drawTileY += TILE_H;
  } // end of for each row

  designGridSet = true; // new grid ready

} // end drawFieldFromGrid


function drawDesignerFromLevelNum(whichLevel) {
  if (!designGridSet) {
    areaGrid = levelList[whichLevel].slice();
  }
  drawFieldFromGrid(areaGrid);
  drawMovables();
}


function drawMovables() {
  agentGrid = agentLevelList[designLevel].slice();
  var arrayIndex = 0;
  var drawTileX = 0;
  var drawTileY = 0;

  for (var eachRow = 0; eachRow < TILE_ROWS; eachRow++) {
    for (var eachCol = 0; eachCol < TILE_COLS; eachCol++) {
      var agent = agentGrid[arrayIndex];

      if (agent == ROGUE_DOG) {
        drawBitmapCenteredWithRotation(canvasContext, dogPic, drawTileX + TILE_W / 2, drawTileY + TILE_H / 2, 0);
      }
      if (agent == BO_PEEP) {
        drawBitmapCenteredWithRotation(canvasContext, BoPeepPic, drawTileX + TILE_W / 2, drawTileY + TILE_H / 2, 0);
      }

      drawTileX += TILE_W;
      arrayIndex++;
    } // end of for each col
    drawTileX = 0;
    drawTileY += TILE_H;
  } // end of for each row
} // end of drawMovables


function levelDesignerTitle() {
  canvasContext.font = "20px Arial";
  canvasContext.textAlign = "left";
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


// cannot directly clear Grid.js level data, instead visually clear current display by making zero areaGrid with pens and ditch for bottom row, for drawFieldFromGrid()
function clearDesign() {
  designGridSet = true;
  tileType = TILE_FIELD;
  designTileReady = true;
  areaGrid = getDitchField();
  console.log("Field visually cleared but grid.js unchanged");
}


function getDitchField() {
  let topGrid = Array( TILE_COLS * (TILE_ROWS-1) );
  topGrid.fill(TILE_FIELD);
  let grid = topGrid.concat(ditchRow);
  return grid;
}

function getEmptyField() {
  let grid = Array( TILE_COLS * (TILE_ROWS) );
  grid.fill(TILE_FIELD);
  return grid;
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
  console.log(output);
  return output;
}

// refactor to use same function to format area and agent grids
function formatAgent() {
  var output = 'const agentLevel_' + designLevel + ' = [\n';
  var arrayIndex = 0;
  var space = '';

  for(var eachRow=0; eachRow<TILE_ROWS; eachRow++) {
    var line = ' ';
    for(var eachCol=0; eachCol<TILE_COLS; eachCol++) {
      let tile = areaGrid[arrayIndex];
      getLength(tile) > 1 ? space = ' ' : space = '  ';

      line += space + agentGrid[arrayIndex] + ',';
      arrayIndex++;
    }
    output += line + '\n';
  }
  output += '];\n';

  console.log(output);
  return output;
}


function saveDesign(output) {
  let filename = 'level_' + designLevel + '_design_' + '.txt';
  downloader(filename, output);
}


function getLength(number) {
  return number.toString().length;
}


function arrowKeyDesign(evt) {
  if (evt.keyCode == KEY_LEFT_ARROW) {
    gridIndex -= 1;
  }
  if (evt.keyCode == KEY_RIGHT_ARROW) {
    gridIndex += 1;
  }
  if (evt.keyCode == KEY_UP_ARROW) {
    gridIndex -= TILE_COLS;
  }
  if (evt.keyCode == KEY_DOWN_ARROW) {
    gridIndex += TILE_COLS;
  }
  designTileReady = true; // will draw
  console.log("gridIndex changed to " + gridIndex);
  console.log("Tile type selected is", tileType, TILE_NAMES[tileType]);
}