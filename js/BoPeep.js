const BOPEEP_RANGE = 30;

function BoPeepClass() {
  this.init = function(id, whichPic, x, y) {
    this.pic = whichPic;
    this.x = x;
    this.y = y;
    this.reset();
  }

  this.reset = function() {
    this.ang = 0;
    this.speedX = 0;
    this.speedY = -2;
    this.active = true;
  }

  this.move = function() {
    var nextX = this.x; // previous location
    var nextY = this.y;

    // detect sheep
    var nearestSheep = this.findNearestSheep(this.x, this.y, sheepList);

    // is close enough to attract and not in pen
    if (this.isSheepClose(nearestSheep, BOPEEP_RANGE)) {
      if ( isInPen(nearestSheep.mode) ) {
        this.active = false;
        nextX = -100;
        this.disappear();
        console.log('bopeep vanish')
      }
      else {
        nearestSheep.changeMode(PEEPED);
        console.log("BoPeep attracts sheep id =", nearestSheep.id);
      }
    }

    // screenwrap vertical
    if (nextY < 0) {
      nextY += gameCanvas.height;
    } else if (nextY >= gameCanvas.height) {
      nextY -= gameCanvas.height;
    }

    nextX += this.speedX;
    nextY += this.speedY;

    // collision handling

    // tileHandling

    this.x = nextX;
    this.y = nextY;
  }


  this.draw = function() {

    drawBitmapCenteredWithRotation(canvasContext, BoPeepPic, this.x,this.y, this.ang);

    // when part of image off canvas, draw mirror on other side
    if (this.y > gameCanvas.height - this.pic.height/2) {
      drawBitmapCenteredWithRotation(canvasContext, BoPeepPic, this.x, this.y - gameCanvas.height, this.ang);
    }
    else if (this.y < this.pic.height/2) {
      drawBitmapCenteredWithRotation(canvasContext, BoPeepPic, this.x, this.y + gameCanvas.height, this.ang);
    }
  }


  this.findNearestSheep = function(x,y) {
    var nearestSheepDist = 999;
    for(var i=0; i<FLOCK_SIZE[currentLevel]; i++) {
      let distTo = sheepList[i].distFrom(x,y);
      if (distTo < nearestSheepDist) {
        nearestSheepDist = distTo;
        nearestSheep = sheepList[i];
      }
    }
    // console.log("Rogue found nearest sheep id =", nearestSheep.id)
    return nearestSheep;
  }


  this.isSheepClose = function(nearestSheep, range) {
    if (nearestSheep.distFrom(this.x, this.y) < range) {
      return true;
    } else {
      return false;
    }
  }

  this.disappear = function() {
    this.active = false;
    this.x = -100;
  }

} // end of BoPeep class


function setupBoPeep (whichLevel) {
  var arrayIndex = 0;
  var drawTileX = 0;
  var drawTileY = 0;
  var nBoPeep = 0;

  for(var eachRow=0; eachRow<TILE_ROWS; eachRow++) {
    for(var eachCol=0; eachCol<TILE_COLS; eachCol++) {

      var agentHere = agentGrid[arrayIndex];

      if (agentHere == BO_PEEP) {
        console.log('Bo Peep', agentHere, drawTileX, drawTileY)
        var spawnBoPeep = new BoPeepClass();
        spawnBoPeep.init(nBoPeep, BoPeepPic, drawTileX + TILE_W/2, drawTileY + TILE_H/2);
        BoPeepList.push(spawnBoPeep);
        nBoPeep++;
      }

      drawTileX += TILE_W;
      arrayIndex++;
    } // end of for each col
    drawTileX = 0;
    drawTileY += TILE_H;
  } // end of for each row
}