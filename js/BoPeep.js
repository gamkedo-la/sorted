const BOPEEP_RANGE = 40;
const BOPEEP_SPEED = 3.0
BOPEEP_EARLIEST = 10;
BOPEEP_LATEST = 10;

bopeepClass.prototype = new movingClass();

function bopeepClass() {
  this.init = function (id, whichPic, x, y, col) {
    this.id = id;
    this.pic = whichPic;
    this.x = x;
    this.y = gameCanvas.height - TILE_H / 2;
    this.col = col;
    this.inPlay = true;
    this.reset();
  }

  this.reset = function () {
    this.ang = 0;
    this.speedX = 0;
    this.speed = BOPEEP_SPEED * randomRange(0.5, 1.5);
    this.active = false;
    this.timeBeforeActive = randomInteger(BOPEEP_EARLIEST, BOPEEP_LATEST);
    this.bopeepid = null;
  }

  this.move = function () {

    if (this.inPlay == false) { return };

    if (this.timeBeforeActive > 0) {
      this.timeBeforeActive--;
    }
    else {
      this.active = true;
      this.speedY = -1 * this.speed;

      if (this.col == null) {
        let emptyPenCols = findColsEmptyPen();
        let availableCols = this.findColsLackingBopeep(emptyPenCols);
        if (availableCols.length > 0) {
          this.col = availableCols[randomInteger(0, availableCols.length-1)];
          this.x = TILE_W / 2 + this.col * TILE_W;
          console.log("Bo Peep reappears", this.y, this.col)
        }
        else {
          this.inPlay = false;
        }
      }

    }

    // test if pen in column is now full
    var bopeepColPenIndex = TILE_COLS * (TILE_ROWS - 1) + this.col;
    if (isFullPen(areaGrid[bopeepColPenIndex])) {
      this.active = false;
      this.col = null;

      this.y = gameCanvas.height;
      this.timeBeforeActive = randomInteger(BOPEEP_EARLIEST, BOPEEP_LATEST);

      console.log('bopeep vanishes because pen in that column is full')
    }

    if (this.active) {
      var nextX = this.x; // previous location
      var nextY = this.y;

      // detect sheep
      var nearestSheep = this.findNearestSheep(this.x, this.y, sheepList);

      // is close enough to attract and not in pen
      if (this.isSheepCloseBelow(nearestSheep, BOPEEP_RANGE)) {

        if (isInPen(nearestSheep.mode)) {
          this.active = false;
          console.log('bopeep vanish')
        }
        else if (nearestSheep.mode == HELD) {
          console.log("Cannot lead HELD sheep id =", nearestSheep.id)
        }
        else {
          nearestSheep.bopeepid = this.id;
          nearestSheep.changeMode(PEEPED);
          if (nearestSheep.team != PLAIN) {
            makeMagicVFX(nearestSheep.x, nearestSheep.y, PLAIN);
            nearestSheep.team = PLAIN;
          }
          // console.log("BoPeep attracts sheep id =", nearestSheep.id);
        }
      }

      // screenwrap vertical, but delay before reappearance
      if (nextY < 0) {
        nextY += gameCanvas.height;
        this.active = false;
        this.timeBeforeActive = randomInteger(BOPEEP_EARLIEST, BOPEEP_LATEST);
      }

      nextX += this.speedX;
      nextY += this.speedY;

      // collision handling

      // tileHandling

      this.x = nextX;
      this.y = nextY;
    }
  }


  this.draw = function () {
    if (this.active && this.inPlay) {
      drawBitmapCenteredWithRotation(canvasContext, BoPeepPic, this.x, this.y, this.ang);
    }
  }


  this.findNearestSheep = function (x, y) {
    var nearestSheepDist = 999;
    for (var i = 0; i < FLOCK_SIZE[currentLevel]; i++) {
      let distTo = sheepList[i].distFrom(x, y);
      if (distTo < nearestSheepDist) {
        nearestSheepDist = distTo;
        nearestSheep = sheepList[i];
      }
    }
    // console.log("Rogue found nearest sheep id =", nearestSheep.id)
    return nearestSheep;
  }


  this.isSheepCloseBelow = function (nearestSheep, range) {
    // wait until passed above sheep so it looks like is following
    if (nearestSheep.distFrom(this.x, this.y) < range && nearestSheep.y > this.y + TILE_H / 2) {
      return true;
    } else {
      return false;
    }
  }

  this.findColsLackingBopeep = function (cols) {
    for (var i = 0; i < bopeepList.length; i++) {
      if (this.id != i) {
        for (var j=0; j < cols.length; j++) {
          if (bopeepList[i].col == cols[j]) {
            cols.splice(j, 1);
          }
        }
      }
    }
    return cols;
  }

} // end of BoPeep class


function setupBoPeep(whichLevel) {
  var arrayIndex = 0;
  var drawTileX = 0;
  var drawTileY = 0;
  var BoPeep_num = 0;

  for (var eachRow = 0; eachRow < TILE_ROWS; eachRow++) {
    for (var eachCol = 0; eachCol < TILE_COLS; eachCol++) {

      var agentHere = agentGrid[arrayIndex];

      if (agentHere == BO_PEEP) {
        // console.log('Bo Peep', agentHere, drawTileX, drawTileY)
        var spawnBoPeep = new bopeepClass();
        spawnBoPeep.init(BoPeep_num, BoPeepPic, drawTileX + TILE_W / 2, drawTileY + TILE_H / 2, eachCol);
        bopeepList.push(spawnBoPeep);
        BoPeep_num++;
      }

      drawTileX += TILE_W;
      arrayIndex++;
    } // end of for each col
    drawTileX = 0;
    drawTileY += TILE_H;
  } // end of for each row
}

function findColWithEmptyPen() {
  // loop bottom row, pick one isPenEmpty()

  var bottomRowIndex = TILE_COLS * (TILE_ROWS - 1);
  var col = -1; // if none found

  for (var i = 0; i < TILE_COLS; i++) {
    let index = bottomRowIndex + i;
    if (isEmptyPen(areaGrid[index])) {
      col = index - bottomRowIndex;
      console.log(bottomRowIndex, index, col);
      // could push to array and later randomly select one of empy pen columns
      return col;
    }
  }
  return col;
}

// return list of empty columns
function findColsEmptyPen() {
  // loop bottom row seek pens with original tile
  var bottomRowIndex = TILE_COLS * (TILE_ROWS - 1);
  var cols = []; // if none found

  for (var i = 0; i < TILE_COLS; i++) {
    let index = bottomRowIndex + i;
    if (isEmptyPen(areaGrid[index])) {
      let col = index - bottomRowIndex;
      cols.push(col);
    }
  }
  return cols;
}