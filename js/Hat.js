// values kept here in case level-tuning assignment fails
// Call
var tractorSpeed = 3; // speed of sheep moving up
const CALL_X_ALIGN = 20; // hat not exactly above sheep
var callAlignLimitX = null; // more X leeway when longer Y distance
const CALL_X_WEIGHT = 7;

var player = new playerClass(1);

function playerClass(id) {
  this.id = id;
  this.x = gameCanvas.width/2;
  this.y = TILE_H/2;
  this.ang = Math.PI;
  this.speed = 0;
  this.pic; // which image to use
  this.callGapTimer = 0;
  this.keyHeld_left = false;
  this.keyHeld_right = false;
  this.keyHeld_call = false;
  this.keyHeld_send = false;

  // store ASCII number of key assigned
  this.setupInput = function(upKey, downKey, leftKey, rightKey) {
    this.controlKeyUp = upKey;
    this.controlKeyDown = downKey;
    this.controlKeyLeft = leftKey;
    this.controlKeyRight = rightKey;
  }

  this.reset = function(whichPic) {
    this.pic = whichPic;
    this.speed = 0;
    this.ang = 0;
    this.sheepIDheld = null;  // ID of sheep carried
    this.callGapTimer = 0;
    this.x = TILE_COLS / 2 * TILE_W; // halfway horizontal
    this.y = TILE_H / 2;
    this.gotoX = this.x;
    this.callWhenInPlace = false;
    this.sendWhenInPlace = false;
    // not using grid to initially place Hat
  }

  this.move = function() {
    var nextX = this.x;
    var nextY = this.y;

    if(this.keyHeld_send) {
      if(this.sheepIDheld != null) {
        var sheepHere = sheepList[this.sheepIDheld];
        this.sheepIDheld = null;
        sheepHere.changeMode(SENT);
        sheepHere.sentX = Math.round(this.x);
        sheepHere.beginTime = step[currentLevel];
        console.log("Sent sheep id", sheepHere.id);
      } else {
        console.log('No sheep sent because clamp empty');
      }
      this.keyHeld_send = false;
    }

    if(this.keyHeld_call) {
      this.keyHeld_call = false; // is this needed?

      if (this.callGapTimer > 0) {
        console.log("Cannot call again so soon");
      }
      else if (this.sheepIDheld != null) {
        console.log('Cannot call a sheep while one already held');
      }
      else if (isAnySheepCalledAlready()) {
        console.log('Cannot call a sheep while another being called');
      }
      else {
        console.log('Call a sheep, try from X=' + nextX);
        callSound.play();

        // check all sheep to see if any below Hat
        // or select a sheep using mouse like in RTS

        this.callGapTimer = 30;
        var aligned = null;
        var nearestWeightDist = 999;

        // originally only considered X distance
        // weights X dist strongly but also considers Y dist
        // to avoid unexpected calling of a sheep far away but X-aligned

        for (var i = 0; i < FLOCK_SIZE[currentLevel]; i++) {

          var mode = sheepList[i].state;
          if (isSheepCallable(mode)) {

            var xDist = Math.abs(nextX - sheepList[i].x);
            var yDist = Math.abs(nextY - sheepList[i].y);
            var weightedCallDist = (yDist / CALL_X_WEIGHT) + xDist;
            console.log('id:' + i + ' x:' + xDist.toFixed(0) + ' y:' + yDist.toFixed(0) + ' weighted:' + weightedCallDist.toFixed(0) );

            if (weightedCallDist < nearestWeightDist) {
              aligned = i;
              nearestWeightDist = weightedCallDist;
              calledXdist = xDist; // save the nearest's xDist
              callAlignLimitX = CALL_X_ALIGN * yDist / 100;

              console.log('id:' + i + ' callAlignLimitX:' + callAlignLimitX.toFixed(0) )
            }
          } else {
            console.log('Sheep ' + i + ' cannot be called because mode ' + sheepModeNames[mode]);
          }
        }

        if (aligned == undefined) {
          console.log("No sheep available to be called");
        }
        else if (calledXdist > callAlignLimitX) {
          console.log("Most likely target sheep is id " + aligned + " but Hat is not positioned above." + " callAlignLimitX=" + callAlignLimitX.toFixed(0));
        }
        else {
          console.log("Called sheep id =", sheepList[aligned].id);
          sheepList[aligned].state = CALLED;
          sheepList[aligned].timer = 0;
          sheepList[aligned].speed = CALL_SPEED[currentLevel];
          // change facing to upward
          sheepList[aligned].ang = Math.PI * 3 / 2;
          if (sheepList[aligned].potentialTeam == BLUE) {
            sheepList[aligned].orient = Math.PI * 1 / 4;
          } else {
            sheepList[aligned].orient = Math.PI * 7 / 4;
          }
        } // end check if any sheep is callable
      } // end of else (Hat can call)
    } // end of CALL

    // move slide the Hat
    var deltaX = this.gotoX - this.x;
    var moveX = HAT_MAX_SPEED[currentLevel];
    var gotoDirection = null;

    if (deltaX == 0) {
      // don't move
    } else {
      if ( Math.abs(deltaX) < moveX) {

        // nearly reached gotoX position
        nextX = this.gotoX;
        if(this.callWhenInPlace) {
          this.keyHeld_call = true;
          this.callWhenInPlace = false;
        }
        if(this.sendWhenInPlace) {
          this.keyHeld_send = true;
          this.sendWhenInPlace = false;
        }
      }
      else {
        // foresee wrap - if x high and gotoX low then go right
        if (deltaX > 0) {
          if (player.x < TILE_W) {
            gotoDirection = -1; // left
          } else {
            gotoDirection = +1; // right
          }
        }
        if (deltaX < 0) {
          if (player.x > gameCanvas.width - TILE_W) {
            gotoDirection = +1;
          } else {
            gotoDirection = -1;
          }
        }
      }

      if(gotoDirection > 0) {  // move right
        nextX += moveX;
      }
      else {
        nextX -= moveX;
      }

      // screenwrap
      if(nextX < 0) {
        nextX = gameCanvas.width - TILE_W/2;
      }
      if(nextX > gameCanvas.width) {
        nextX = TILE_W/2;
      }

      this.x = nextX;
      this.y = nextY;
    }
  } // end of .move()

  this.draw = function() {
    drawBitmapCenteredWithRotation(canvasContext, this.pic, this.x,this.y, this.ang);
  }
}

function isSheepCallable(location) {
  callable = (location != IN_BLUE_PEN && location != IN_RED_PEN && location != ON_ROAD && location != IN_DITCH && location != STACKED && location != STUCK);
  return callable;
}

function isAnySheepCalledAlready() {
  var calledAlready = false;
  for(var i=0; i<FLOCK_SIZE[currentLevel]; i++) {
    if( sheepList[i].state == CALLED) {
      calledAlready = true;
    }
  }
  return calledAlready;
}

// purpose of Hat Demo functions is to enable me to talk on video instead of focusing on moving Hat to particular place to demo

// for Call to be usable need to identify nearest sheep first
function hatDemoX(x) {
  player.gotoX = x;
  player.callWhenInPlace = true;
  // unsure how to combine this with Sending demo
  // must not set send's gotoX until after Call happens
}

function hatDemoHoldingX(x) {
  player.gotoX = x;
  player.sendWhenInPlace = true;
}
function hatDemoHoldingCol(col) {
  player.gotoX = (col * TILE_W) - (TILE_W / 2);
  player.sendWhenInPlace = true;
}