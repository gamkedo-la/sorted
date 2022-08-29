const SHOULD_WRAP = true;
const HAT_MARGIN = 18;

// if can be tuned by level, changed from const to var
// values kept here in case level-tuning assignment fails

// hat moves like car
var GROUNDSPEED_DECAY_MULT = 0.94; 
var DRIVE_POWER = 1.0;
var REVERSE_POWER = 1.0;
// Call
var ALIGN_LIMIT = 20; // hat not exactly above sheep
var TRACTOR_SPEED = 3; // speed of sheep moving up

var player = new playerClass(1);

function playerClass(id) {
  this.id = id;
  this.x = this.y = -100; // off screen
  this.ang = Math.PI;
  this.speed = 0;
  this.pic; // which image to use

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
    this.gotoX = null;

    var hatFound = false;

    for(var eachRow=0;eachRow<TILE_ROWS;eachRow++) {
      for(var eachCol=0;eachCol<TILE_COLS;eachCol++) {
        var arrayIndex = colRowToIndex(eachCol, eachRow);

        // seek starting position tile
        if(agentGrid[arrayIndex] == HAT_START) {
          this.x = eachCol * TILE_W + TILE_W/2;
          this.y = eachRow * TILE_H + TILE_H/2;
          hatFound = true;
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

if(TOUCH_TEST) {
  let msg = "inside player.move() keyHeld_left=" + player.keyHeld_left + " keyHeld_right=" + player.keyHeld_right ;
  //console.log(msg);
  document.getElementById("debug_3").innerHTML = msg; 
}    

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
    }

    if(this.keyHeld_call) {
      console.log('CALL a sheep');
      callSound.play();

      // check all sheep to see if any below Hat
      // or select a sheep using mouse like in RTS
      if(this.sheepIDheld != null) {
        console.log('Cannot call a sheep while one already held');
      } 
      else if( isAnySheepCalledAlready() ) {
        console.log('Cannot call a sheep while another being called');
      } 
      else {
        var aligned;
        var nearestXdist = 999;
        for(var i=0; i<FLOCK_SIZE[currentLevel]; i++) {
          var xDist = xDistance(nextX, sheepList[i].x);
          if(xDist < nearestXdist && xDist < ALIGN_LIMIT) {
            aligned = i;
          }
        }

        if(aligned != undefined) {
          var location = sheepList[aligned].state;
          if(isSheepCallBlocked(location)) {
            console.log('Sheep on goal or fence or stacked at end of field cannot be beckoned')
          } else {
            sheepList[aligned].state = CALLED;
            sheepList[aligned].timer = 0;
            sheepList[aligned].speed = CALL_SPEED[currentLevel];
            // change facing to upward
            sheepList[aligned].ang = Math.PI * 3 / 2;
            if(sheepList[aligned].potentialTeam == BLUE) {
              sheepList[aligned].orient = Math.PI * 1/4;
            } else {
              sheepList[aligned].orient = Math.PI * 7/4;
            }
          }
        } else {
          console.log("No sheep X-aligned to tractor")
        }
      }
    } // end of CALL (tractor)

    if(this.gotoX == null) {
      this.speed *= GROUNDSPEED_DECAY_MULT;

      if(this.keyHeld_right) {
        this.speed += DRIVE_POWER;
      }
      if(keyHeld_right) {
        this.speed += DRIVE_POWER;
      }
  
      if(this.keyHeld_left) {
        this.speed -= REVERSE_POWER;
        if(TOUCH_TEST) {
          let msg = "keyHeld_left changing speed " + this.speed;
          console.log(msg);
          document.getElementById("debug_4").innerHTML = msg;
        }
      }
      if(keyHeld_left) {
        this.speed -= REVERSE_POWER;
        if(TOUCH_TEST) {
          let msg = "global keyHeld_left changing speed " + this.speed;
          console.log(msg);
          document.getElementById("debug_4").innerHTML = msg;
        }
      }
  
      nextX += Math.cos(this.ang) * this.speed;
      this.y += Math.sin(this.ang) * this.speed;
    }

    else { // gotoX has been set
      var deltaX = this.gotoX - this.x;
      var moveX = HAT_MAX_SPEED[currentLevel];

      if(deltaX > 0) {  // goto is right of current position
        if(deltaX > moveX) {
          nextX += moveX;
        } else {
          nextX = this.gotoX;
        }
      } else {          // goto is left of current position
        if(Math.abs(deltaX) > moveX) {
          nextX -= moveX;
        } else {
          nextX = this.gotoX;
        }
      }
    }

    if (SHOULD_WRAP) {
      if(nextX < 0 - HAT_MARGIN) {
        nextX = canvas.width;
      }
      if(nextX > canvas.width + HAT_MARGIN) {
        nextX = -HAT_MARGIN;
      }
    } else {
      if(nextX < 0 + HAT_MARGIN) {
        nextX = HAT_MARGIN;
      }
      if(nextX > canvas.width - HAT_MARGIN) {
        nextX = canvas.width - HAT_MARGIN;
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
    drawBitmapCenteredWithRotation(this.pic, this.x,this.y, this.ang);
    // document.getElementById("debug_4").innerHTML = "Hat posX=" + Math.floor(this.x);
    //// document.getElementById("debug_4").innerHTML = "Hat posX=" + this.x;
  }

  // not used
  this.findSheepBelow = function() {
    for(var i=0; i<FLOCK_SIZE[currentLevel]; i++) {
      var dist = distance(this.x,this.y, sheepList[i].x,sheepList[i].y);
    }
  }
}

function isSheepCallBlocked(location) {
  callable = (location == IN_BLUE_PEN || location == IN_RED_PEN || location == ON_ROAD || location == FENCED || location == STACKED || location == STUCK);
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