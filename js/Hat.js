var player = new playerClass(1);

// values here in case level-tuning assignment fails
var tractorSpeed = 3; // speed of sheep moving up
const CALL_X_ALIGN = 20; // hat not exactly above sheep
const CALL_Y_TOLERANCE = 200;
var callAlignLimitX = null; // more X leeway if longer Y distance
const CALL_X_WEIGHT = 7; // X dist weighted 7x more than Y

function playerClass(id) {
  this.id = id;

  this.reset = function (whichPic) {
    this.pic = whichPic;
    this.x = TILE_COLS / 2 * TILE_W; // halfway horizontal
    this.y = TILE_H / 2;
    this.gotoX = this.x;
    this.nextX = null;
    this.nextY = null;
    this.direction = 0;
    this.speed = HAT_MAX_SPEED[currentLevel]; // was 0
    this.ang = 0;
    this.sheepIDheld = null; // ID of sheep held after calling
    this.sheepIDcalled = null;
    this.callGapTimer = 0;
    this.moveAsideTimer = 0;
    this.soundTimer = 0;
    this.callWhenInPlace = false;
    this.sendWhenInPlace = false;
  }


  // store ASCII number of key assigned
  this.setupInput = function (upKey, downKey, leftKey, rightKey) {
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


  this.move = function () {
    this.nextX = this.x;
    this.nextY = this.y;

    if (this.soundTimer > 0) {
      this.soundTimer--;
    }

    // move aside if Bo Peep approaching in same column
    if (this.moveAsideTimer > 0) {
      this.moveAsideTimer--;
    }
    else {
      for (var i = 0; i < bopeepList.length; i++) {
        if (bopeepList[i].y < 100) {
          var distX = this.x - bopeepList[i].x;
          if (Math.abs(distX) < TILE_W + 20) {
            if (distX >= 0) {
              this.gotoX = this.x + (TILE_W - distX);
            } else {
              this.gotoX = this.x - (TILE_W + distX);
              console.log(this.gotoX, this.x)
            }
            this.moveAsideTimer = 120;
          }
        }
      }
    }


    if (this.keyHeld_send) {

      if (this.sheepIDheld != null) {
        // else { // VFX timer check was here
        var sheepHere = sheepList[this.sheepIDheld];
        this.sheepIDheld = null;
        sheepHere.changeMode(SENT);
        sheepHere.sentX = Math.round(this.x);
        sheepHere.beginTime = step[currentLevel];
        sentSound.play(0.05);
        console.log("Sent sheep id", sheepHere.id);

        if (gameState == STATE_GUIDE) {
          if (tutorStep == 5) {
            tutorStep = 6;
          }
          if (tutorStep == 4) {
            tutorStep = 5;
          }
        }
      }
      else {
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
        console.log('Call a sheep, try from X=' + this.nextX);
        callSound.play(0.5);

        // check all sheep to see if any below Hat
        // or select a sheep using mouse like in RTS

        // this.callGapTimer = 30; // disable based on playtest feedback
        var aligned = null;
        var nearestWeightDist = 999;

        // weights X distance strongly, but includes Y distance to avoid unexpected calling of a sheep far away but X-aligned

        for (var i = 0; i < sheepList.length; i++) {

          var mode = sheepList[i].mode;
          if (isSheepCallable(mode)) {

            var xDist = Math.abs(this.nextX - sheepList[i].x);
            var yDist = Math.abs(this.nextY - sheepList[i].y);
            var weightedCallDist = (yDist / CALL_X_WEIGHT) + xDist;
            // console.log('id:' + i + ' x:' + xDist.toFixed(0) + ' y:' + yDist.toFixed(0) + ' weighted:' + weightedCallDist.toFixed(0));

            if (weightedCallDist < nearestWeightDist) {
              aligned = i;
              nearestWeightDist = weightedCallDist;
              calledXdist = xDist; // save the nearest's xDist
              callAlignLimitX = CALL_X_ALIGN;
              if (yDist > CALL_Y_TOLERANCE) {
                callAlignLimitX *= yDist / CALL_Y_TOLERANCE;
              }
              // console.log('id:' + i + ' callAlignLimitX:' + callAlignLimitX.toFixed(0))
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
          var calledSheep = sheepList[aligned];
          console.log("Called sheep id =", sheepList[aligned].id);
          sheepList[aligned].changeMode(CALLED);
          // could do lines below also in changeMode
          sheepList[aligned].timer = 0;
          sheepList[aligned].speed = CALL_SPEED[currentLevel];
          // change facing to upward
          sheepList[aligned].ang = Math.PI * 3 / 2;
          if (sheepList[aligned].potentialTeam == BLUE) {
            sheepList[aligned].orient = Math.PI * 1 / 4;
          } else {
            sheepList[aligned].orient = Math.PI * 7 / 4;
          }
          this.sheepIDcalled = sheepList[aligned].id;

        } // end check if any sheep is callable
      } // end of else (Hat can call)
    } // end of CALL


    // arrowkey move now accepts held key
    if (this.keyHeld_left || this.keyHeld_right) {
      this.gotoX = null;
      // if (this.soundTimer < 1) {
      //   hatMoveLongSound.play(0.3);
      //   this.soundTimer = 75;
      // }

      if (this.keyHeld_left) {
        this.nextX -= this.speed;
      }
      else if (this.keyHeld_right) {
        this.nextX += this.speed;
      }
      if (this.nextX > gameCanvas.width) {
        this.nextX -= gameCanvas.width; // offset to mirror image
      }
      if (this.nextX < 0) {
        this.nextX += gameCanvas.width; // offset to mirror image
      }
      // console.log(this.x, this.gotoX, player.keyHeld_left, player.keyHeld_right, player.button_left, player.button_right)
    }


    // MOVE left or right using touch or button
    // gotoX set to next column-centre
    if (this.button_left || this.button_right) {
      console.log("From " + this.x + " gotoX " + this.gotoX);
    } // end button set gotoX


    if (this.gotoX != this.x && this.gotoX != null) {
      var deltaX = this.gotoX - this.x;
      var moveX = HAT_MAX_SPEED[currentLevel];
      this.direction = 0;

      if (Math.abs(deltaX) <= moveX) {
        // nearly reached gotoX position

        this.nextX = this.gotoX;
        this.direction = 0; // move command completed

        if (this.nextX < 0 || this.nextX > gameCanvas.width) {
          if (gameState == STATE_GUIDE && tutorStep == 2) {
            whenTutorialStep3();
          }
        }

        if (this.nextX > gameCanvas.width) {
          this.nextX -= gameCanvas.width; // offset to mirror image
          this.gotoX = TILE_W / 2;
        }

        if (this.nextX < 0) {
          this.nextX += gameCanvas.width; // offset to mirror image
          this.gotoX = gameCanvas.width - TILE_W / 2;
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
        this.nextX += moveX; // move right
      }
      else if (this.direction < 0) {
        this.nextX -= moveX; // move left
      }
    } // end of gotoX is set and differs from x

    else {
      if (this.button_left) {
        this.gotoX = nextColumnCentre(this.x, -1);
        if (touchDevice || gameState == STATE_GUIDE) {
          this.button_left = false;
        }
      }
      else if (this.button_right) {
        this.gotoX = nextColumnCentre(this.x, 1);
        if (touchDevice || gameState == STATE_GUIDE) {
          this.button_right = false;
        }
      }
    }

    this.x = this.nextX;
    this.y = this.nextY;
  } // end move()


  this.draw = function () {

    if (gameState == STATE_PLAY) {
      if (this.x < gameCanvas.width/2) {
        canvasContext.drawImage(this.pic, 0,0, 39,39, this.x-20,this.y-20, 39,39);
      } else {
        canvasContext.drawImage(this.pic, 40,0, 39,39, this.x-20,this.y-20, 39,39);
      }
    }

    if (gameState == STATE_GUIDE) {
      drawBitmapCenteredWithRotation(canvasContext, oldHatPic, this.x, this.y, this.ang);

      //when part of image off canvas, draw mirror on other side
      if (this.x > gameCanvas.width - this.pic.width / 2) {
        drawBitmapCenteredWithRotation(canvasContext, this.pic, this.x - gameCanvas.width, this.y, this.ang);
      }
      if (this.x < this.pic.width / 2) {
        drawBitmapCenteredWithRotation(canvasContext, this.pic, this.x + gameCanvas.width, this.y, this.ang);
      }
    }
 
    // swap Hat sprite based on direction of movement
    // gotoX only set if using Buttons, keep direction instead
    // if (this.direction = -1) {
    //   canvasContext.drawImage(this.pic, 0,0, 39,39, this.x-20,this.y-20, 39,39);
    // } 
    // else if (this.direction = 1) {
    //   canvasContext.drawImage(this.pic, 40,0, 79,39, this.x-20,this.y-20, 39,39);
    // }
    // else {
    //   if (this.x < gameCanvas.width/2) {
    //     canvasContext.drawImage(this.pic, 0,0, 39,39, this.x-20, this.y-20, 39,39);
    //   } else {
    //     canvasContext.drawImage(this.pic, 40,0, 79,39, this.x-20, this.y-20, 39,39);
    //   }
    // }


    
  } // end draw()

} // end playerClass


function isSheepCallable(location) {
  callable = (location != IN_PEN_BLUE && location != IN_PEN_RED && location != IN_DITCH && location != STUCK && location != STACKED);
  return callable;
}


function isAnySheepCalledAlready() {
  var calledAlready = false;
  for (var i = 0; i < FLOCK_SIZE[currentLevel]; i++) {
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

function initialHatVFXsetup() {
  let numParticles = 180;
  let centreX = 400;
  let centreY = 25;
  let colours = ['white', 'purple']
  let size = 2;
  let life = 40;
  let shapeX = 80;
  let shapeY = 40;
  addParticles(numParticles, centreX, centreY, colours, size, life, shapeX, shapeY);
}
