const LOSTSHEEP_ATTRACT_RANGE = 40;
const LOSTSHEEP_BAA_RANGE = 40;

function lostSheepClass() {
  this.init = function(id, whichPic, x, y) {
    this.pic = whichPic;
    this.x = x;
    this.y = y;
    this.reset();
  }

  this.reset = function() {
    // this.x = randomRangeInt(20 + SIDE_MARGIN, gameCanvas.width - SIDE_MARGIN -18);
    // this.y = 425;
    this.ang = 0;
    this.speedX = 4;
    this.speedY = 0;
    this.barkTimer = 0;
  }

  this.move = function() {
    var nextX = this.x; // previous location
    var nextY = this.y;

    // detect sheep
    var nearestSheep = this.findNearestSheep(this.x, this.y, sheepList);

    // is close enough to unsort
    if (this.isSheepClose(nearestSheep, LOSTSHEEP_ATTRACT_RANGE)) {
      if (nearestSheep.team != PLAIN) {
        nearestSheep.team = PLAIN;
        nearestSheep.color = TEAM_COLOURS[PLAIN];
      }
    }

    // screenwrap horizontal
    if (nextX < 0) {
      nextX += gameCanvas.width;
      // this.ang += Math.PI;
    } else if (nextX >= gameCanvas.width) {
      nextX -= gameCanvas.width;
      // this.ang += Math.PI;
    }

    nextX += this.speedX;
    nextY += this.speedY;

    // collision handling

    // tileHandling

    this.x = nextX;
    this.y = nextY;
  }

  this.draw = function() {
    drawBitmapCenteredWithRotation(canvasContext, dogBodyPic, this.x,this.y, this.ang);
    // dog's head
    drawBitmapCenteredWithRotation(canvasContext, this.pic, this.x,this.y, this.ang);
    // when part of image off canvas, draw mirror on other side
    if (this.x > gameCanvas.width - this.pic.width/2) {
      drawBitmapCenteredWithRotation(canvasContext, dogBodyPic, this.x - gameCanvas.width, this.y, this.ang);
      drawBitmapCenteredWithRotation(canvasContext, this.pic, this.x - gameCanvas.width, this.x,this.y, this.ang);
    }
    else if (this.x < this.pic.width/2) {
      drawBitmapCenteredWithRotation(canvasContext, dogBodyPic, this.x + gameCanvas.width, this.y, this.ang);
      drawBitmapCenteredWithRotation(canvasContext, this.pic, this.x + gameCanvas.width,this.y, this.ang);
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

  this.isRogueClose = function(nearestSheep, range) {
    if (nearestSheep.distFrom(this.x, this.y) < range) {
      return true;
    } else {
      return false;
    }
  }

} // end of rogue class


function setupDogs (whichLevel) {
  var arrayIndex = 0;
  var drawTileX = 0;
  var drawTileY = 0;
  var nDog = 0;

  for(var eachRow=0; eachRow<TILE_ROWS; eachRow++) {
    for(var eachCol=0; eachCol<TILE_COLS; eachCol++) {

      var agentHere = agentGrid[arrayIndex];

      if (agentHere == ROGUE) {
        console.log('agent', agentHere, drawTileX, drawTileY)
        var spawnDog = new rogueClass();
        spawnDog.init(nDog, dogPic, drawTileX + TILE_W/2, drawTileY + TILE_H/2);
        rogueDogList.push(spawnDog);
        nDog++;
      }

      drawTileX += TILE_W;
      arrayIndex++;
    } // end of for each col
    drawTileX = 0;
    drawTileY += TILE_H;
  } // end of for each row
}