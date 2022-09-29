var player = new playerClass(1);

// values here in case level-tuning assignment fails
var tractorSpeed = 3; // speed of sheep moving up
const CALL_X_ALIGN = 20; // hat not exactly above sheep
const CALL_Y_TOLERANCE = 200;
var callAlignLimitX = null; // more X leeway if longer Y distance
const CALL_X_WEIGHT = 7; // X dist weighted 7x more than Y


function playerClass(id) {
  this.id = id;

  this.reset = function(whichPic) {
    this.pic = whichPic;
    this.x = TILE_COLS/2 * TILE_W; // halfway horizontal
    this.y = TILE_H / 2;
    this.gotoX = this.x;
    this.direction = 0;
    this.speed = HAT_MAX_SPEED[currentLevel]; // was 0
    this.ang = 0;
    this.sheepIDheld = null; // ID of sheep carried
    this.callGapTimer = 0;
    this.callWhenInPlace = false;
    this.sendWhenInPlace = false;
  }


  // store ASCII number of key assigned
  this.setupInput = function(upKey, downKey, leftKey, rightKey) {
    this.controlKeyUp = upKey;
    this.controlKeyDown = downKey;
    this.controlKeyLeft = leftKey;
    this.controlKeyRight = rightKey;
    this.keyHeld_left = false;
    this.keyHeld_right = false;
    this.keyHeld_call = false;
    this.keyHeld_send = false;
    this.button_left = false;
    this.button_right = false;
  }


  this.move = function() {
    var nextX = this.x;
    var nextY = this.y;

    if (this.keyHeld_send) {

      if (this.sheepIDheld != null) {
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
    } // end SEND


    if (this.keyHeld_call) {
      this.keyHeld_call = false; // is this needed?

      if (this.sheepIDheld != null) {
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

        // this.callGapTimer = 30;
        var aligned = null;
        var nearestWeightDist = 999;

        // originally only considered X distance
        // weights X dist strongly but also considers Y dist
        // to avoid unexpected calling of a sheep far away but X-aligned

        for (var i = 0; i < FLOCK_SIZE[currentLevel]; i++) {

          var mode = sheepList[i].mode;
          if (isSheepCallable(mode)) {

            var xDist = Math.abs(nextX - sheepList[i].x);
            var yDist = Math.abs(nextY - sheepList[i].y);
            var weightedCallDist = (yDist / CALL_X_WEIGHT) + xDist;
            console.log('id:' + i + ' x:' + xDist.toFixed(0) + ' y:' + yDist.toFixed(0) + ' weighted:' + weightedCallDist.toFixed(0) );

            if (weightedCallDist < nearestWeightDist) {
              aligned = i;
              nearestWeightDist = weightedCallDist;
              calledXdist = xDist; // save the nearest's xDist
              callAlignLimitX = CALL_X_ALIGN;
              if (yDist > CALL_Y_TOLERANCE) {
                callAlignLimitX *= yDist / CALL_Y_TOLERANCE;
              }

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
          sheepList[aligned].mode = CALLED;
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


    // arrowkey move now accepts held key
    if (this.keyHeld_left || this.keyHeld_right) {
      this.gotoX = null;
      if (this.keyHeld_left) {
        nextX -= this.speed;
      }
      else if (this.keyHeld_right) {
        nextX += this.speed;
      }
      if (nextX > gameCanvas.width) {
        nextX -= gameCanvas.width; // offset to mirror image
      }
      if (nextX < 0) {
        nextX += gameCanvas.width; // offset to mirror image
      }
      console.log(this.x, this.gotoX, player.keyHeld_left, player.keyHeld_right, player.button_left, player.button_right)
    }


    // MOVE left or right using touch or button
    // gotoX set to next column-centre
    if (this.button_left || this.button_right) {

      if (this.button_left) {
        this.gotoX = nextColumnCentre(this.x, -1);
        this.button_left = false;
      }
      else if (this.button_right) {
        this.gotoX = nextColumnCentre(this.x, 1);
        this.button_right = false;
      }
      console.log("From " + this.x + " gotoX " + this.gotoX);
    } // end button set gotoX


    if (this.gotoX != this.x && this.gotoX != null) {
      var deltaX = this.gotoX - this.x;
      var moveX = HAT_MAX_SPEED[currentLevel];
      this.direction = 0;

      if (Math.abs(deltaX) <= moveX) {
        // nearly reached gotoX position

        nextX = this.gotoX;
        this.direction = 0; // move command completed

        if (nextX > gameCanvas.width) {
          nextX -= gameCanvas.width; // offset to mirror image
          this.gotoX = TILE_W/2;
        }
        if (nextX < 0) {
          nextX += gameCanvas.width; // offset to mirror image
          this.gotoX = gameCanvas.width - TILE_W/2;
        }

        if (this.callWhenInPlace) {
          this.keyHeld_call = true;
          this.callWhenInPlace = false;
        }

        if (this.sendWhenInPlace) {
          this.keyHeld_send = true;
          this.sendWhenInPlace = false;
        }
      } // end nearly_reached_gotoX

      else { // some_way_to_go_yet
        if (deltaX > 0) {
          this.direction = 1;
        }
        if (deltaX < 0) {
          this.direction = -1;
        }
      } // end some_way_to_go_yet

      if (this.direction > 0) {
        nextX += moveX; // move right
      }
      else if (this.direction < 0) {
        nextX -= moveX; // move left
      }
    }


    this.x = nextX;
    this.y = nextY;
  } // end move()


  this.draw = function() {
    drawBitmapCenteredWithRotation(canvasContext, this.pic, this.x,this.y, this.ang);
    // when part of image off canvas, draw mirror on other side
    if (this.x > gameCanvas.width - this.pic.width/2) {
      drawBitmapCenteredWithRotation(canvasContext, this.pic, this.x - gameCanvas.width, this.y, this.ang);
    }
    if (this.x < this.pic.width/2) {
      drawBitmapCenteredWithRotation(canvasContext, this.pic, this.x + gameCanvas.width, this.y, this.ang);
    }
  } // end draw()

} // end playerClass


function isSheepCallable(location) {
  callable = ( location != IN_PEN_BLUE && location != IN_PEN_RED && location != IN_DITCH && location != STUCK && location != STACKED );
  return callable;
}


function isAnySheepCalledAlready() {
  var calledAlready = false;
  for(var i=0; i<FLOCK_SIZE[currentLevel]; i++) {
    if (sheepList[i].mode == CALLED) {
      calledAlready = true;
    }
  }
  return calledAlready;
}


// original purpose of Hat Demo functions to enable me to talk on video instead of focusing on moving Hat to particular place
// also usable by advanced Testing that needs AI for Hat

// for Call to be usable, identify nearest sheep first
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