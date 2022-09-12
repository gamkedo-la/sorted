const SHOULD_WRAP = true;
const HAT_MARGIN = 18;

// if can be tuned by level, changed from const to var
// values kept here in case level-tuning assignment fails

// hat moves like car
var GROUNDSPEED_DECAY_MULT = 0.94;
var drivePower = 1.0;
var reversePower = 1.0;
// Call
var tractorSpeed = 3; // speed of sheep moving up
const CALL_X_ALIGN = 20; // hat not exactly above sheep
var callAlignLimitX = null; // more X leeway when longer Y distance
const CALL_X_WEIGHT = 7;

var player = new playerClass(1);

function playerClass(id) {
  this.id = id;
  this.x = this.y = -100; // off screen
  this.ang = Math.PI;
  this.speed = 0;
  this.pic; // which image to use
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
    // this.x = TILE_COLS / 2 * TILE_W; // halfway horizontal
    // this.y = TILE_H / 2;
    this.gotoX = null;
    this.callWhenInPlace = false;
    this.sendWhenInPlace = false;

    // may not be using agentGrid[] to place Hat
    var hatFound = false;
    for(var eachRow=0;eachRow<TILE_ROWS;eachRow++) {
      for(var eachCol=0;eachCol<TILE_COLS;eachCol++) {
        var arrayIndex = colRowToIndex(eachCol, eachRow);

        // seek starting position tile
        if(agentGrid[arrayIndex] == HAT_START) {
          this.x = eachCol * TILE_W + TILE_W/2;
          this.y = eachRow * TILE_H + TILE_H/2;
          hatFound = true;
          agentGrid[arrayIndex] = NOT_OCCUPIED;
          return;
        }
      }
    } // loop rows until Start found
    if(!hatFound) {
      console.log("Start location not found for player", this.id);
    }
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

    if(this.gotoX == null) {

      this.speed *= GROUNDSPEED_DECAY_MULT;

      if(this.keyHeld_right) {
        this.speed += drivePower;
      }

      if(this.keyHeld_left) {
        this.speed -= reversePower;
        if(TOUCH_TEST) {
          let msg = "keyHeld_left changing speed " + this.speed;
          report(msg, 4);
        }
      }

      nextX += Math.cos(this.ang) * this.speed;
      this.y += Math.sin(this.ang) * this.speed;
    }

    else { // gotoX has been set, Touch or Demo/Test

      var deltaX = this.gotoX - this.x;
      var moveX = HAT_MAX_SPEED[currentLevel];

      if(deltaX > 0) {  // goto is right of current position
        if(deltaX > moveX) {
          nextX += moveX;
        } else { // reaching required position
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
      } else {       // goto is left of current position
        if(Math.abs(deltaX) > moveX) {
          nextX -= moveX;
        } else {
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
      }
    } // end of Hat demo automated movement

    if (SHOULD_WRAP) {
      if(nextX < 0 - HAT_MARGIN) {
        nextX = gameCanvas.width;
      }
      if(nextX > gameCanvas.width + HAT_MARGIN) {
        nextX = -HAT_MARGIN;
      }
    } else {
      if(nextX < 0 + HAT_MARGIN) {
        nextX = HAT_MARGIN;
      }
      if(nextX > gameCanvas.width - HAT_MARGIN) {
        nextX = gameCanvas.width - HAT_MARGIN;
      }
    }

    this.x = nextX;
    this.y = nextY;

    // if(this.x != this.previousX) {
    //   this.x = this.columnCentred(this.x);
    // }
    // tileHandling(this);
  } // end of move()

  this.draw = function() {
    drawBitmapCenteredWithRotation(canvasContext, this.pic, this.x,this.y, this.ang);
    // document.getElementById("debug_4").innerHTML = "Hat posX=" + Math.floor(this.x);
    //// document.getElementById("debug_4").innerHTML = "Hat posX=" + this.x;
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