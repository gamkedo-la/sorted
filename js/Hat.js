const GROUNDSPEED_DECAY_MULT = 0.94; // hat moves like car
const DRIVE_POWER = 1.0;
const REVERSE_POWER = 1.0;

const HAT_MARGIN = 18; // stops hat going off side edge
const ALIGN_LIMIT = 20; // tractor not exactly above sheep
const TRACTOR_SPEED = 5; // speed of sheep moving up

var player = new playerClass(1);

function playerClass(id) {
  this.id = id;
  this.x = this.y = -100; // off screen
  this.ang = Math.PI;
  this.speed = 0;
  this.pic; // which image to use
  this.sheepIDheld; // ID of sheep carried

  this.keyHeld_Gas = false;
  this.keyHeld_Reverse = false;

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
    var StartTileFound = false;

    for(var eachRow=0;eachRow<TILE_ROWS;eachRow++) {
      for(var eachCol=0;eachCol<TILE_COLS;eachCol++) {
        var arrayIndex = rowColToArrayIndex(eachCol, eachRow);

        // seek starting position tile
        if(areaGrid[arrayIndex] == TILE_PLAYERSTART) {
          areaGrid[arrayIndex] = TILE_FIELD;      
          this.x = eachCol * TILE_W + TILE_W/2;
          this.y = eachRow * TILE_H + TILE_H/2;
          return;
        }    
      }
    } // loop rows until Start found
    // console.log("Starting tile not found for player", this.id);
  }

  this.move = function() {

    if(this.keyHeld_drop) {
      console.log('release sheep');
      var sheepHere = sheepList[this.sheepIDheld];
      if(this.sheepIDheld != null) {
        this.sheepIDheld = null;
        sheepHere.state = DROPPED;
        sheepHere.speed = SHEEP_DROP_SPEED; // set when drop, may change on way
        sheepHere.ang = Math.PI/2 // straight down
      }
    }
    if(this.keyHeld_tractor) {
      console.log('beckon a sheep');
      // check all sheep to see if any below Hat
      // or select a sheep using mouse like in RTS
      var aligned;
      var nearestXdist = 999;
      for(var i=0; i<FLOCK_SIZE[currentLevel]; i++) {
        var xDist = xDistance(this.x, sheepList[i].x);
        if(xDist < nearestXdist && xDist < ALIGN_LIMIT) {
          aligned = i;
        }
      }
      if(aligned != undefined) {
        if(sheepList[aligned].state == PENNED) {
          countSheepPenned--;
          update_debug_report();
        } // or recalculate number with state PENNED when drawing UI
        sheepList[aligned].state = TRACTOR;
      } else {
        console.log("No sheep X-aligned to tractor")
      }
    }

    this.speed *= GROUNDSPEED_DECAY_MULT;
    if(this.keyHeld_right) {
      this.speed += DRIVE_POWER;
    }
    if(this.keyHeld_left) {
      this.speed -= REVERSE_POWER;
    }
    this.x += Math.cos(this.ang) * this.speed;
    this.y += Math.sin(this.ang) * this.speed;
    
    if(this.x < 0 + HAT_MARGIN) {
      this.x = HAT_MARGIN;
    }
    if(this.x > canvas.width - HAT_MARGIN) {
      this.x = canvas.width - HAT_MARGIN;
    }
    // tileHandling(this);
  }

  this.draw = function() {
    drawBitmapCenteredWithRotation(this.pic, this.x,this.y, this.ang);
  }

  // not used
  this.findSheepBelow = function() {
    for(var i=0; i<FLOCK_SIZE[currentLevel]; i++) {
      var dist = distance(this.x,this.y, sheepList[i].x,sheepList[i].y);
    }
  }
}