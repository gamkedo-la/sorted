const ROGUE_UNSORT_RANGE = 40;
const ROGUE_RETREAT_RANGE = 70;
const SLIGHTLY_BELOW_RETREAT_UP = 5;
const ROGUE_WOOF_RANGE = 70;
const ROGUE_COLLISION_BOPEEP_X = 60;
const ROGUE_COLLISION_BOPEEP_Y = 50;
const ROGUE_RADIUS = 15;

const MOVING = 1;
const STOPPING = 2;
const LICKING = 3;
const WAITING = 4;


roguedogClass.prototype = new movingClass();

function roguedogClass() {
  this.init = function (id, whichPic, x, y) {
    this.id = id;
    this.pic = whichPic;
    this.x = x;
    this.y = y;
    this.nextX = x;
    this.nextY = y;
    this.antennaLeftX = null;
    this.antennaLeftY = null;
    this.antennaRightX = null;
    this.antennaRightY = null;
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
    this.nextX = this.x; // previous location
    this.nextY = this.y;

    this.modeTimer--;
    if (this.modeTimer == 0) {
      this.changeMode(MOVING);
      // console.log(this.modeTimer)
    }

    this.nextX += this.speedX;
    this.nextY += this.speedY;

    // collision handling
    var nearestSheep = findNearestInList(this.x, this.y, sheepList);

    // is close enough to bark at sheep, and sheep visible ahead way dog facing
    var distX = this.x - nearestSheep.x;

    if ( this.isSheepClose(nearestSheep, ROGUE_WOOF_RANGE) && distX < 0) {
      // console.log("Rogue warns sheep id =", nearestSheep.id);
      if (this.barkTimer < 1) {
        if (runMode == NORMAL_PLAY) {
          rogueSound.play(0.4);
        }
        this.barkTimer = 40;
      }
    }

    if ( this.isSheepClose(nearestSheep, ROGUE_RETREAT_RANGE) && distX < 25) {
      if (nearestSheep.shyTimer < 1) {
        var distY = nearestSheep.y - this.y;
        // painted sheep mustn't retreat or won't get Licked
        if (nearestSheep.team == PLAIN) {
          nearestSheep.gotoX = nearestSheep.x;
          if (distY < SLIGHTLY_BELOW_RETREAT_UP) {
          // sheep above dog retreat upward
            nearestSheep.gotoY = nearestSheep.y - (TILE_H + distY);
            // console.log(this.id, this.y, nearestSheep.id, nearestSheep.y.toFixed(0), distY.toFixed(0), nearestSheep.gotoY.toFixed(0), 'retreat');
            nearestSheep.changeMode(SHY);
            nearestSheep.shyTimer = 20;
          }
          else {
          // Rogue making sheep go down toward pen seems against rogue aim
            // nearestSheep.gotoY = nearestSheep.y + (TILE_H - distY);
          }
        }
      }
    }

    // is close enough to unsort
    if (this.isSheepClose(nearestSheep, ROGUE_UNSORT_RANGE) && this.mode != LICKING) {      
      if (nearestSheep.team != PLAIN) {
        this.changeMode(LICKING);
        makeLickVFX(nearestSheep.x, nearestSheep.y, nearestSheep.team);
        nearestSheep.team = PLAIN;
        nearestSheep.color = TEAM_COLOURS[PLAIN];
        nearestSheep.changeMode(LICKED);
        nearestSheep.shyTimer = 100; // this isn't stopping retreat
        // console.log("Unsort/lick sheep id =", nearestSheep.id);
      }
    }

    // is boPeep on this Level?
    if (bopeepList != undefined && bopeepList.length > 0) {
      // if boPeep ahead & would collide, dog stops temporarily

      var boNearX = findNearbyXInList(this.nextX, bopeepList, ROGUE_COLLISION_BOPEEP_X);
      if (boNearX) {

        // dog doesn't stop if has already moved past bopeep
        if (boNearX && boNearX.x > this.nextX) {

          if (this.mode == MOVING) {

            var distY = boNearX.y - this.nextY;
            if (Math.abs(distY) < ROGUE_COLLISION_BOPEEP_Y) {

              this.changeMode(STOPPING);
              this.modeTimer = Math.floor(ROGUE_COLLISION_BOPEEP_Y + 1 + distY);
              // console.log('distY', distY, 'boNearX.x', boNearX.x, 'this.nextX', this.nextX, 'timer', this.modeTimer)
            }
          } // end MOVING
        } else {
          // console.log('dog has passed BoPeep X already')
        } // end X right test
      }
    }

    // screenwrap horizontal
    if (this.nextX < 0) {
      this.nextX += gameCanvas.width;
      // this.ang += Math.PI;
    } else if (this.nextX >= gameCanvas.width) {
      this.nextX -= gameCanvas.width;
      // this.ang += Math.PI;
    }

    // tileHandling
    this.tileHandling(this.nextX, this.nextY);

    this.x = this.nextX;
    this.y = this.nextY;
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

    this.drawAntennae(ROGUE_RADIUS);
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
      this.speedX = 0.1;
      this.orient = Math.PI * 3 / 2;
      this.modeTimer = 80;
    }
    else if (newMode == WAITING) {
      this.speedX = 0.1;
      this.modeTimer = 20;
    }
    else if (newMode == MOVING) {
      this.speedX = ROGUE_SPEED[currentLevel];
      this.orient = 0;
    }
  }

  this.tileHandling = function () {
    if (tileType == TILE_SLOW) {
      if (!this.adjustSpeed) {
        if (this.mode == SENT) {
          this.speed = this.speed / 4;
        }
        else {
          this.speed = this.speed / 2;
        }
        this.adjustSpeed = true;
        // console.log('speed reduce by woods', this.mode);
      }
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
        // console.log('agent', agentHere, drawTileX, drawTileY)
        var spawnDog = new roguedogClass();
        spawnDog.init(nDog, dogPic, drawTileX + TILE_W / 2, drawTileY + TILE_H / 2);
        roguedogList.push(spawnDog);
        nDog++;

        var spawnMoving = new movingClass();
        spawnMoving.init(nDog, dogPic, drawTileX + TILE_W / 2, drawTileY + TILE_H / 2);
      }

      drawTileX += TILE_W;
      arrayIndex++;
    } // end of for each col
    drawTileX = 0;
    drawTileY += TILE_H;
  } // end of for each row
}