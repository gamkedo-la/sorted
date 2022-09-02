var designLevel = 0; // blank start
var tileType = 0;
var gridIndex = 304;

// draw base with grass and road
// "level_" + designLevel;
function drawLevelDesigner(whichLevel) {
  areaGrid = levelList[whichLevel].slice();
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

  drawLowRoad();
}

function levelDesignerTitle() {
  canvasContext.font = "24px Arial";
  colorText("Level Designer", 20,30, "white");
  canvasContext.font = "16px Arial";
  // colorText("key M returns to Menu", 600,30, "white");
  let msg = "Click to select tile; key M returns to Menu";
  document.getElementById("debug_1").innerHTML = msg;
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