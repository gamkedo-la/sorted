const ROGUE_UNSORT_RANGE = 40;
const ROGUE_WOOF_RANGE = 70;
const ROGUE_COLLISION_BOPEEP_X = 60;
const ROGUE_COLLISION_BOPEEP_Y = 50;
const MOVING = 1;
const STOPPING = 2;
const LICKING = 3;

rogueClass.prototype = new movingClass();

function rogueClass() {
  this.init = function (id, whichPic, x, y) {
    this.pic = whichPic;
    this.x = x;
    this.y = y;
    this.reset();
  }

  this.reset = function () {
    this.ang = 0;
    this.orient = 0;
    this.speedX = ROGUE_SPEED[currentLevel];
    this.speedY = 0;
    this.mode = MOVING;
    this.modeTimer = 0;
    this.barkTimer = 0;
  }

  this.move = function () {
    var nextX = this.x; // previous location
    var nextY = this.y;

    this.modeTimer--;
    if (this.modeTimer == 0) {
      this.changeMode(MOVING);  
      // console.log(this.modeTimer)
    }

    // detect sheep
    var nearestSheep = findNearestInList(this.x, this.y, sheepList);

    // is close enough to smell a sheep
    if (this.isSheepClose(nearestSheep, ROGUE_WOOF_RANGE)) {
      // console.log("Rogue smells sheep id =", nearestSheep.id);
      if (this.barkTimer < 1) {
        if (runMode == NORMAL_PLAY) {
          // rogueSound.play();
        }
        this.barkTimer = 40;
      }
    }

    // is close enough to unsort
    if (this.isSheepClose(nearestSheep, ROGUE_UNSORT_RANGE)) {
      if (nearestSheep.team != PLAIN) {
        makeLickVFX(nearestSheep.x, nearestSheep.y, nearestSheep.team);
        nearestSheep.team = PLAIN;
        nearestSheep.color = TEAM_COLOURS[PLAIN];
        this.changeMode(LICKING);
        console.log("Unsort sheep id =", nearestSheep.id);
      }
    }

    // is boPeep on this Level?
    if (boPeepList != undefined && boPeepList.length > 0) {
      // if boPeep ahead & would collide, dog stops temporarily

      var boNearX = findNearbyXInList(nextX, boPeepList, ROGUE_COLLISION_BOPEEP_X);
      if (boNearX) {

        // dog doesn't stop if has already moved past bopeep
        if (boNearX && boNearX.x > nextX) {

          if (this.mode == MOVING) {

            var distY = boNearX.y - nextY;
            if (Math.abs(distY) < ROGUE_COLLISION_BOPEEP_Y) {

              this.changeMode(STOPPING);
              this.modeTimer = Math.floor(ROGUE_COLLISION_BOPEEP_Y + 1 + distY);
              console.log('distY', distY, 'boNearX.x', boNearX.x, 'nextX', nextX, 'timer', this.modeTimer)
            }
          } // end MOVING
        } else {
          // console.log('dog has passed BoPeep X already')
        } // end X right test
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

  this.draw = function () {
    drawBitmapCenteredWithRotation(canvasContext, dogBodyPic, this.x, this.y, this.ang);
    // dog's head
    drawBitmapCenteredWithRotation(canvasContext, this.pic, this.x, this.y, this.orient);

    // when part of image off canvas, draw mirror on other side
    if (this.x > gameCanvas.width - this.pic.width / 2) {
      drawBitmapCenteredWithRotation(canvasContext, dogBodyPic, this.x - gameCanvas.width, this.y, this.ang);
      drawBitmapCenteredWithRotation(canvasContext, this.pic, this.x - gameCanvas.width, this.x, this.y, this.ang);
    }
    else if (this.x < this.pic.width / 2) {
      drawBitmapCenteredWithRotation(canvasContext, dogBodyPic, this.x + gameCanvas.width, this.y, this.ang);
      drawBitmapCenteredWithRotation(canvasContext, this.pic, this.x + gameCanvas.width, this.y, this.ang);
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

  this.isSheepClose = function (nearestSheep, range) {
    if (nearestSheep.distFrom(this.x, this.y) < range) {
      return true;
    } else {
      return false;
    }
  }

  this.changeMode = function (newMode) {

    if (newMode == STOPPING) {
      this.speedX = 0;
      this.orient = Math.PI * 7 / 4;
      // this.modeTimer = 30; // backstop default
    }
    else if (newMode == LICKING) {
      this.speedX = 0.5;
      this.orient = Math.PI * 3 / 2;
      this.modeTimer = 40;
    }
    else if (newMode == MOVING) {
      this.speedX = ROGUE_SPEED[currentLevel];
      this.orient = 0;
    }
  }

} // end of rogue class


function setupDogs(whichLevel) {
  var arrayIndex = 0;
  var drawTileX = 0;
  var drawTileY = 0;
  var nDog = 0;

  for (var eachRow = 0; eachRow < TILE_ROWS; eachRow++) {
    for (var eachCol = 0; eachCol < TILE_COLS; eachCol++) {

      var agentHere = agentGrid[arrayIndex];

      if (agentHere == ROGUE_DOG) {
        console.log('agent', agentHere, drawTileX, drawTileY)
        var spawnDog = new rogueClass();
        spawnDog.init(nDog, dogPic, drawTileX + TILE_W / 2, drawTileY + TILE_H / 2);
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