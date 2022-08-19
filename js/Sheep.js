const SHEEP_RADIUS = 16;
const SIDE_MARGIN = SHEEP_RADIUS/2 + 1;
const TOP_MARGIN = 60;
const FACING_RADIUS = 2;

var teamSizeSoFar = [0,0,0];
var sheepInPlay = 0;

var SHEEP_DROP_SPEED = 10; // now tunable by level
const SCORE_GAP = 5; // when drawn beside a sheep (individual score)

// sheep modes
const GRAZE = 0;
const ROAM = 1;
const CALLED = 2;
const HELD = 3;
const SENT = 4;
// below are positional not moods, but mostly exclusive e.g. cannot be in-pen/in-lorry and roam; but can be fenced and graze/roam
// on-road and fenced were orig created for end-of-level calculation
const IN_BLUE_PEN = 5;
const IN_RED_PEN = 6;
const FENCED = 7;
const ON_ROAD = 8;
const IN_BLUE_LORRY = 9;
const IN_RED_LORRY = 10;

function sheepClass() {
  this.x = 0;
  this.y = 0;
  this.speed = 0;
  this.ang = Math.PI/2; // move facing angle
  this.orient = 0; // image display angle
  this.score = 0;
  this.timer = 0;

  this.reset = function(i, team, potential, mode) {
    this.id = i;
    this.team = team;
    this.color = TEAM_COLOURS[team];
    this.potentialTeam = potential;
    this.state = mode;
    this.ang = randomRange(0, Math.PI * 2);
    this.orient = 0;
    // this.gotoX = this.x;
    // this.gotoY = this.y;
    this.score = 0;
    this.levelDone = false;
    this.setExpiry();
    this.setSpeed();
  }

  this.testRowInit = function() {
    this.speed = 15;
    this.ang = Math.PI/2;
  }

  this.placeTop = function() {
    this.x = TILE_W/2 + this.id * TILE_W;
    this.y = TILE_H * 3/2 -15;
  }

  this.testColumnInit = function() {
    this.speed = 3 + this.id * 3;
    this.ang = Math.PI/2;
  }

  this.placeColumn = function(col) {
    this.x = TILE_W/2 + col * TILE_W;
    this.y = TILE_H * 3/2 -15;
  }

  this.placeRandom = function(depth) {
    this.x = randomRangeInt(0 + SIDE_MARGIN, canvas.width - SIDE_MARGIN -2);
    this.y = randomRangeInt(TOP_MARGIN+10, depth);
    console.log(this.id, this.x, this.y)
  }
  
  this.move = function() {
    var nextX = this.x; // previous location
    var nextY = this.y;
    var prevMode = this.state;

    // covers any GOAL or FENCED
    if(this.levelDone) {
    }

    // attached to player
    else if(this.state == HELD) {
      nextX = player.x;
      nextY = player.y + 24;
    }

    else if (this.state == CALLED) {
console.log("Called", this.id)
      nextY -= TRACTOR_SPEED;

      if(nextY < player.y +20) { // arriving at Hat
        nextX = player.x;
        nextY = player.y +24;
        this.state = HELD;
        this.speed = 0;
        player.sheepIDheld = this.id;
        update_debug_report(); // to display Hold
        
        // if already Sorted, don't change
        if(this.team == 0) {
          var teamSort = this.potentialTeam;
          teamSizeSoFar[teamSort]++;
          this.team = teamSort;
          if (teamSort == BLUE) {
            this.color = "#66b3ff"; // pale blue
            // this.img = blueSheepPic;
          } else if (teamSort == RED) {
            this.color = "#f38282"; // pale red
            // this.img = redSheepPic;
          }
        } 
      } 
    }

    else if(this.state == SENT) { 
      // isMovedBySpeed() handles angle effect
    }

    else if(this.state == GRAZE) {
      // if(randomRangeInt(1, GRAZE_FACING[currentLevel]) == 1) {
      if(randomRangeInt(1, 120) == 1) {
        this.ang += randomRange(-Math.PI/8, Math.PI/8)
      }
    }

    else if(this.state == ROAM) {
      // if(randomRangeInt(1, ROAM_FACING[currentLevel]) == 1) {
      if(randomRangeInt(1, 30) == 1) {
        this.ang += randomRange(-Math.PI/4, Math.PI/4)
      }
    }

    // common to ROAM, CALLED, SENT
    if(this.isMovedBySpeed(this.state)) {
      nextX += this.speed * Math.cos(this.ang);
      nextY += this.speed * Math.sin(this.ang); 
    }

    // screenwrap horizontal
    if(nextX < 0) {
      nextX += canvas.width;
      // this.ang += Math.PI;
    } else if(nextX >= canvas.width) {
      nextX -= canvas.width;
      // this.ang += Math.PI;
    }

    // bounce down from top row if not Called
    if(nextY < 50) {
      console.log( this.isAllowedTopRow() )
      if(this.isAllowedTopRow() == false) {
        this.ang = 2*Math.PI - this.ang;
      }
    }
    // bounce up from bottom row if not Sent 
    if(nextY > 540) {
      if(this.isAllowedBottomRow() == false) {
        this.ang = 2*Math.PI - this.ang;
      }
    }

    // if x,y change inside tileHandling must be returned as object
    var pos = this.tileHandling(nextX, nextY);

    if(pos != undefined) {
      this.x = pos.x;
      this.y = pos.y;
    } else {  
      console.log("TileHandling failed to set x & y values");
      this.x = nextX;
      this.y = nextY;
    }

    // if(this.stateIsOnGoal() == false) {
    //   if(this.collisionDetect() == true) {
    //     this.agentHandling();
    //   } else {
    //     this.tileHandling();
    //   }
    // }

    if(this.isModeTimed()) {
      this.timer--;
      if(this.timer < 1) {
        if(this.state == ROAM || this.state == SENT) {
          this.changeMode(GRAZE);
        }
        else if(this.state == GRAZE) {
          this.changeMode(ROAM);
        }
      }
    }
    testIfLevelEnd();
  }

  this.isAllowedTopRow = function() {
    return this.state == CALLED || this.state == HELD || this.state == SENT // at release from clamp sheep is in top row
  }

  this.isAllowedBottomRow = function() {
    return this.state == SENT || this.state == FENCED || this.state == IN_BLUE_PEN || this.state == IN_RED_PEN || this.state == ON_ROAD 
  }

  this.isModeTimed = function() {
    return this.state == ROAM || this.state == GRAZE || this.state == SENT;
  }

  this.tileHandling = function(nextX, nextY) {
    var tileCol = Math.floor(nextX / TILE_W);
    var tileRow = Math.floor(nextY / TILE_H);
    var tileIndexUnder = colRowToIndex(tileCol, tileRow);

    if(tileCol >= 0 && tileCol < TILE_COLS &&
      tileRow >= 0 && tileRow < TILE_ROWS) {

      var tileType = getTileTypeAtColRow(tileCol,tileRow);

      // only when first entering pen tile
      if( this.stateIsOnGoal() == false && this.onTileGoal(tileType) ) {

        if(tileType == TILE_PEN_BLUE) {
          console.log("Sheep ID", this.id, "reached the blue pen.");
          nextX = TILE_W * 9.5;
          nextY = TILE_H * 14.5;
          this.state = IN_BLUE_PEN;

        } else if(tileType == TILE_PEN_RED) {
          this.state = IN_RED_PEN;
          console.log("Sheep ID", this.id, "reached the red pen.");
          nextX = TILE_W * 11.5;
          nextY = TILE_H * 14.5;

        } else if(tileType == TILE_GOAL) {
          this.state = ON_ROAD;
          nextY = TILE_H * 13.5;
          console.log("Sheep ID", this.id, "is between pens.");
        }  
        this.speed = 0;
        this.levelDone = true;
        sheepInPlay--;
        agentGrid[tileIndexUnder] = 1;
        update_debug_report();
        // test if level complete
      } else {
        // terrain handling

        // deflection size governed by how many steps inside tile
        // applied every loop
        if(tileType == TILE_GO_LEFT) {  
          this.ang += 0.1;
        } else if(tileType == TILE_GO_RIGHT) {
          this.ang -= 0.1;

        // should only apply on entering
        } else if(tileType == TILE_HALT) {
          if(this.state != GRAZE) {
            this.changeMode(GRAZE);
            this.ang += Math.PI/2;
          }

        } else if(tileType == TILE_ROAM) {
          if(this.state != ROAM) {
            this.changeMode(ROAM);
          }

        } else if(tileType == TILE_ROAD) {
          if(this.state != FENCED) {
            this.changeMode(FENCED);
            sheepInPlay--;
            nextY = TILE_H * 13.5;
            agentGrid[tileIndexUnder - TILE_COLS] = OCCUPIED;
          }

        } else if(tileType != TILE_FIELD) {
          // undo car move to fix "car stuck in wall" bug
          // this.x -= Math.cos(this.ang) * this.speed;
          // this.y -= Math.sin(this.ang) * this.speed;
          // rebound from obstacle
          // this.speed *= -1;
          this.speed = 0;
    
        } // end of terrain handling
      }
    } // end of valid col and row

    return {
      x: nextX,
      y: nextY
    };
  }
 
  this.changeMode = function(newMode) {
    // change state, also set direction & speed
    var prevMode = this.state;

  // console.log(this.id, this.state, newMode)
    if(newMode == ROAM) {
      this.state = ROAM;
      this.speed = ROAM_SPEED[currentLevel];
    }
    else if(newMode == GRAZE) {
      this.state= GRAZE;
      this.speed = GRAZE_SPEED[currentLevel];
    }
    else if(newMode == SENT) {
      this.state = SENT;
      // set once when sent, may change on way
      this.speed = SEND_SPEED[currentLevel]; 
      this.ang = Math.PI/2 // straight down
    }
    else if(newMode == FENCED) {
      this.state = FENCED;
      // reference Y of row above fence, instead of canvas.height
      this.ang = Math.PI / 2;
      this.speed = 0;
      this.levelDone = true;
      // agentGrid[tileIndexUnder - TILE_COLS] = OCCUPIED;
      testIfLevelEnd();  
    } 
    else {
      console.log("Else in changeMode, for ID", this.id)
      this.state = newMode;
      this.speed = 0; // stay still so it can be checked
    }
    if(this.isModeTimed()) {
      this.setExpiry();
    }
    // No, changeMode is also called from tileHandling
    // XXX not needed because this .x.y set before timer handling
    // return {
    //   x: nextX,
    //   y: nextY
    // };
  } 

  // restart timer to expire mode 
  this.setExpiry = function() {
    if(this.state == ROAM) {
      this.timer = randomRangeInt(ROAM_TIME_MIN[currentLevel], ROAM_TIME_MAX[currentLevel]);
    }
    else if(this.state == GRAZE) {
      this.timer = randomRangeInt(GRAZE_TIME_MIN[currentLevel], GRAZE_TIME_MAX[currentLevel]);
    }
    else if(this.state == SENT) {
      this.timer = 200;
    }
    else if(this.state == CALLED) {
      this.timer = 200;
    }
  }

  this.setSpeed = function() {
    if(this.state == ROAM) {
      this.speed = ROAM_SPEED[currentLevel];
    }
    if(this.state == GRAZE) {
      this.speed = GRAZE_SPEED[currentLevel];
    }
  }

  this.collisionDetect = function() {
    var col = Math.floor(this.x / TILE_W);
    var row = Math.floor(this.y / TILE_H);
    var agentIndex = colRowToIndex(col, row);
    // tile entered is occupied by another sheep
    if(agentGrid[agentIndex] == 1) {
      console.log("colliding sheep ID=" + this.id + " row=" + row + " arrival Y=" + this.y + " index=" + agentIndex);
      return true;
    } else {
      return false;
    }
  }

  this.agentHandling = function() {
    var col = Math.floor(this.x / TILE_W);
    var row = Math.floor(this.y / TILE_H);
    var agentIndex = colRowToIndex(col, row);
    // tile entered is occupied by another sheep
    if(agentGrid[agentIndex] == 1) {
      this.y = ((row-1) * TILE_H) + (TILE_H/2);
      console.log("retreat to Y=", this.y);
      this.speed = 0;
      this.levelDone = true;
      agentGrid[agentIndex - TILE_COLS] = 1;
      // console.log("agentHandling sheep " + this.id + " row " + row)
    }
  }

  this.isMovedBySpeed = function(mode) {
    return mode == ROAM || mode == GRAZE || mode == CALLED || mode == SENT;
  }

  this.stateIsOnGoal = function() {
    return this.state == IN_BLUE_PEN || this.state == IN_RED_PEN;
  }

  this.onTileGoal = function(tileType) {
    return tileType == TILE_GOAL || tileType == TILE_PEN_BLUE || tileType == TILE_PEN_RED;
  }

  this.draw = function() {
    // tail shows facing by being in opposite direction
    drawBitmapCenteredWithRotation(sheepTailPic, this.x,this.y, this.ang);

    if(this.team == PLAIN) {
      drawBitmapCenteredWithRotation(sheepNormalPic, this.x,this.y, this.orient);
    } else {
      colorCircle(this.x, this.y, SHEEP_RADIUS, this.color);
    }
    if(this.state == CALLED) {
      // draw line between sheep and hat
      colorLine(player.x,player.y, this.x,this.y, "yellow")
    }
    if(editMode) {
      var facingX = this.x + Math.cos(this.ang) * SHEEP_RADIUS;
      var facingY = this.y + Math.sin(this.ang) * SHEEP_RADIUS;
      colorCircle(facingX, facingY, FACING_RADIUS, "red");

      canvasContext.textAlign = "center";
      if(idLabel) {
        this.idLabel();
      }
      if(timerLabel) {
        this.timerLabel();
      }
      if(modeLabel) {
        this.modeLabel();
      }
      canvasContext.textAlign = "left";
    }
  } // end of draw

  this.idLabel = function() {
    var fontSize = 12;
    canvasContext.font = fontSize + "px Verdana";
    if(this.team != PLAIN) {
      colorText(this.id, this.x-8, this.y+6, "black");
    } else {
      // draw ID on sheep's back
      var backX = this.x - Math.cos(this.ang) * (SHEEP_RADIUS -2);
      var backY = this.y - Math.sin(this.ang) * (SHEEP_RADIUS -2);
      // colorText(this.id, this.x, this.y - SHEEP_RADIUS - fontSize/4, "white");
      colorText(this.id, backX, backY, "black");
    }
  }

  this.timerLabel = function() {
    var facingXoffset = this.x + Math.cos(this.ang + Math.PI/4) * (SHEEP_RADIUS +8);
    var facingYoffset = this.y + Math.sin(this.ang + Math.PI/4) * (SHEEP_RADIUS +8);
    var fontSize = 8;
    canvasContext.font = fontSize + "px Verdana";
    // colorText(this.timer, this.x, this.y + SHEEP_RADIUS + fontSize, "yellow");
    colorText(this.timer, facingXoffset, facingYoffset, "yellow");
  }

  this.modeLabel = function() {
    var facingXoffset = this.x + Math.cos(this.ang - Math.PI/4) * (SHEEP_RADIUS +7);
    var facingYoffset = this.y + Math.sin(this.ang - Math.PI/4) * (SHEEP_RADIUS +7);
    var fontSize = 12;
    canvasContext.font = fontSize + "px Verdana";
    // colorText(this.state, this.x -26, this.y + SHEEP_RADIUS/2, "orange");
    colorText(this.state, facingXoffset, facingYoffset, "white");
  }

  this.scoreLabel = function() {
    if(this.team != PLAIN) {
      var fontSize = 12;
      canvasContext.font = fontSize + "px Verdana";
      // draw score in centre of sheep
      colorText(this.score, this.x -10, this.y+6, "black");
      // colorText(this.score, this.x -7, this.y - SHEEP_RADIUS - SCORE_GAP, "white");
    }
  } // end of scoreLabel
} // end of sheepClass
