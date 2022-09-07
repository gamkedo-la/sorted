const SHEEP_RADIUS = 16;
const SIDE_MARGIN = SHEEP_RADIUS/2 + 1;
const TOP_MARGIN = 60;
const FACING_RADIUS = 2;

var teamSizeSoFar = [0,0,0];
var sheepInPlay = 0;

const SCORE_GAP = 5; // when drawn beside a sheep (individual score)
const  TILE_Y_ADJUST = 0.6; // position outOfPlay sheep in tile

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
const STACKED = 11;
const CONVEYOR = 12;
const STUCK = 13;

function sheepClass() {
  this.x = 0;
  this.y = 0;
  this.speed = 0;
  this.ang = Math.PI/2; // move facing angle
  this.orient = 0; // image display angle
  this.score = 0;
  this.timer = 0;
  this.sentX = null;
  this.beginTime = null;
  this.endTime = null;
  this.endCol = null;
  this.endRow = null;

  this.reset = function(i, team, potential, mode) {
    this.id = i;
    this.team = team;
    this.color = TEAM_COLOURS[team];
    this.potentialTeam = potential;
    this.state = mode;
    this.previousMode = mode;
    this.ang = randomRange(0, Math.PI * 2);
    this.orient = 0;
    // this.gotoX = this.x;
    // this.gotoY = this.y;
    this.score = 0;
    this.levelDone = false;
    this.occupancyTested = false;
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
    this.sentX = this.x; // won't go through player.send()
  }

  this.testColumnInit = function() {
    this.speed = 3 + this.id * 3;
    this.ang = Math.PI/2;
  }
  this.testColumnXInit = function() {
    this.speed = TEST_SEND_SPEED;
    this.ang = Math.PI/2;
  }

  this.placeColumn = function(col) {
    this.x = TILE_W/2 + col * TILE_W;
    this.y = TILE_H * 3/2 -15;
    this.sentX = this.x;
  }
  this.placeColumnX = function(col, Xoffset) {
    this.x = (col * TILE_W) + Xoffset;
    this.y = TILE_H * 3/2 -15;
    this.sentX = this.x;
  }

  this.placeRandom = function(depth) {
    this.x = randomRangeInt(0 + SIDE_MARGIN, canvas.width - SIDE_MARGIN -2);
    this.y = randomRangeInt(TOP_MARGIN+10, depth);
    // console.log(this.id, this.x, this.y)
  }

  // 1st, mode governs speed
  // 2nd, check screenwrap X and bounce Y
  // 3rd, test if tile occupied
  // 4th, tile handling

  this.move = function() {
    var nextX = this.x; // previous location
    var nextY = this.y;
    var prevMode = this.state;
    var tileOccupied;
    var pos; // temporary position

    // covers any GOAL or FENCED
    if(this.levelDone) {
    }

    // attached to player
    else if(this.state == HELD) {
      nextX = player.x;
      nextY = player.y + 24;
    }

    else if (this.state == CALLED) {
      nextY -= tractorSpeed;

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
      // if waggle while Sent, that goes here
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
        this.ang += randomRange(-Math.PI/8, Math.PI/8)
      }
    }

    else if(this.state == CONVEYOR) {
      var deltaX = this.gotoX - this.x;
      var moveX = CONVEYOR_SPEED[currentLevel];

      if(deltaX > 0) {  // goto is right of current position
        if(deltaX > moveX) {
          nextX += moveX;
        } else {
          nextX = this.gotoX; // arrive at end of conveyor
          this.changeMode(this.previousMode);
        }
      } else {          // goto is left of current position
        if(Math.abs(deltaX) > moveX) {
          nextX -= moveX;
        } else {
          nextX = this.gotoX;
          this.changeMode(this.previousMode);
        }
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
      // console.log( this.isAllowedTopRow() )
      if(this.isAllowedTopRow() == false) {
        this.ang = 2*Math.PI - this.ang;
        nextY = this.y; // stops oscillation
      }
    }
    // bounce up from bottom row if not Sent
    if(nextY > 540) {
      if(this.isAllowedBottomRow() == false) {
        this.ang = 2*Math.PI - this.ang;
        nextY = this.y; // stops oscillation
      }
    }

    // if x,y change inside tileHandling must be returned as object
    // var pos = this.tileHandling(nextX, nextY);

    // if(this.levelDone == false && this.occupancyTested == false) {
    if(this.levelDone == false) {
      tileOccupied = this.isTileOccupied(nextX, nextY);
      // console.log(this.id + " entering tile occupied=" + tileOccupied);

      // prevent unteamed sheep from stacking
      if(tileOccupied && this.team != PLAIN && testMode == NORMAL_PLAY) {
        this.occupancyTested == true;
        pos = this.agentHandling(nextX, nextY);
        // console.log("pos", pos)
      } else {
        pos = this.tileHandling(nextX, nextY);
      }
      if(pos == undefined) {
        console.log("Collision or TileHandling failed to set x & y values");
      }
    }

    if(pos != undefined) {
      this.x = pos.x;
      this.y = pos.y;
    } else {
      // console.log("ID " + this.id + " didnt do occupancy test or tilehandling")
      this.x = nextX;
      this.y = nextY;
    }

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
    if(testMode == NORMAL_PLAY) {
      this.leaveHoofprints();
    }
  }

  // occasionally leave a hoof-print if we've travelled far enough
  this.leaveHoofprints = function() {
    const mindist = 8;
    const leftrightoffset = 6;
    const alpha = 0.4;
    const rot = 0;
    if (!this.lastHoofprintPos) this.lastHoofprintPos = {x:-999,y:-999};
    if ((Math.abs(this.x-this.lastHoofprintPos.x)>=mindist) || (Math.abs(this.y-this.lastHoofprintPos.y)>=mindist)) {
        // console.log("hoofprint!");
        this.lastHoofprintPos.x = this.x;
        this.lastHoofprintPos.y = this.y;
        if (!this.hoofprintCount) this.hoofprintCount = 1; else this.hoofprintCount++;
        decals.add(this.x+(this.hoofprintCount%2?0:leftrightoffset),this.y+(this.hoofprintCount%2?0:leftrightoffset),rot,alpha,hoofprintPic);
    }
  }

  this.isTileOccupied = function(nextX, nextY) {
    var col = Math.floor(nextX / TILE_W);
    var row = Math.floor(nextY / TILE_H);
    var agentIndex = colRowToIndex(col, row);
    // tile entered is occupied by another sheep
    if(agentGrid[agentIndex] == "1") {
      // console.log("Collision by sheep ID=" + this.id + " row=" + row + " arrival Y=" + nextY + " index=" + agentIndex);
      return true;
    } else {
      return false;
    }
  }

  this.agentHandling = function(nextX, nextY) {
    var col = Math.floor(nextX / TILE_W);
    var row = Math.floor(nextY / TILE_H);
    var agentIndex = colRowToIndex(col, row);

    // tile entered is occupied by another sheep
    if(agentGrid[agentIndex] == 1) {
      nextX = nearestColumnCentre(nextX);
      nextY = ((row-1) * TILE_H) + (TILE_H * TILE_Y_ADJUST);
      console.log("Agenthandling: retreat to Y=", nextY);
      this.speed = 0;
      this.ang = Math.PI * 1/2;
      if(this.team == BLUE) {
        this.orient = Math.PI * 1/2;
      } else {
        this.orient = Math.PI * 3/2;
      }
      this.state = STACKED;
      sheepInPlay--;
      this.levelDone = true;
      this.endCol = col;
      this.endTime = step[currentLevel];

      agentGrid[agentIndex - TILE_COLS] = 1;
      // console.log("agentHandling sheep " + this.id + " row " + row)
    }
    return {
      x: nextX,
      y: nextY
    };
  }

  this.tileHandling = function(nextX, nextY) {
    var tileCol = Math.floor(nextX / TILE_W);
    var tileRow = Math.floor(nextY / TILE_H);
    var tileIndexUnder = colRowToIndex(tileCol, tileRow);

    if(tileCol >= 0 && tileCol < TILE_COLS &&
      tileRow >= 0 && tileRow < TILE_ROWS) {

      var tileType = getTileTypeAtColRow(tileCol,tileRow);

      // only when first entering pen tile
      if( this.stateIsInGoal() == false && this.onTileGoal(tileType) ) {

        if(tileType == TILE_PEN_BLUE) {
          console.log("Sheep ID", this.id, "reached the blue pen.");
          agentGrid[tileIndexUnder] = 1;
          this.state = IN_BLUE_PEN;
          this.orient = Math.PI * 1/2;
          nextY = TILE_H * (TILE_ROWS-1 + TILE_Y_ADJUST); // bring rear inside tile
          random_baa_sound(BAA_VOLUME);

        } else if(tileType == TILE_PEN_RED) {
          console.log("Sheep ID", this.id, "reached the red pen.");
          agentGrid[tileIndexUnder] = 1;
          this.state = IN_RED_PEN;
          this.orient = Math.PI * 3/2;
          nextY = TILE_H * (TILE_ROWS-1 + TILE_Y_ADJUST);
          random_baa_sound(BAA_VOLUME);

        } else if(tileType == TILE_CENTRE) {
          console.log("Sheep ID", this.id, "is between pens.");
          this.state = ON_ROAD;
          nextY = TILE_H * (TILE_ROWS-1 + TILE_Y_ADJUST);
          agentGrid[tileIndexUnder - TILE_COLS] = 1;

          // fixme: perhaps we need some "unhappy" BAA sounds?
          // random_baa_sound(BAA_VOLUME);

        }
        this.speed = 0;
        nextX = nearestColumnCentre(nextX);
        // replaced // nextX = TILE_W * 11.5; // nextX = TILE_W * 9.5;

        this.ang = Math.PI * 1/2;
        this.levelDone = true;
        sheepInPlay--;
        this.endCol = tileCol;
        this.endTime = step[currentLevel];
        update_debug_report();
        // test if level complete
      } else {
        // terrain handling

        // deflection size governed by how many steps inside tile
        // applied every loop
        if(tileType == TILE_BEND_LEFT) {
          if(this.state == SENT) {
            this.ang += 0.1;
          } else {
            this.ang += 0.01;
          }

        } else if(tileType == TILE_BEND_RIGHT) {
          if(this.state == SENT) {
            this.ang -= 0.1;
          } else {
            this.ang -= 0.01;
          }

        // should only apply on entering
        } else if(tileType == TILE_HALT) {
          if(this.state != GRAZE) {
            this.changeMode(GRAZE);
            // if arriving at lake from above
            if(this.ang > 1/4*Math.PI && this.ang < 3/4*Math.PI) {
              // nextY -= this.speed; // stay at edge of lake
              nextY = nearestRowEdge(nextY) -10;
              console.log("Avoid walking into water");
            }
            var turn = randomRangeInt(1,2) == 1 ? 1 : (-1);
            this.ang += turn * Math.PI/2;
          }

        } else if(tileType == TILE_LOST) {
          if(this.state != ROAM) {
            this.changeMode(ROAM);
            this.ang = randomRange(0, Math.PI * 2);
          }

        } else if(tileType == TILE_STUCK) {
          if(this.state != STUCK) {
            this.speed = 0;
            this.state = STUCK;
            stuckSound.play();
            this.levelDone = true;
            // definitely need endRow, and Stuck is not a scoring result
            this.endCol = tileCol;
            this.endTime = step[currentLevel];
            sheepInPlay--;
          }

        } else if(tileType == TILE_ROAD) {
          if(this.state != FENCED) {
            this.changeMode(FENCED);
            this.endCol = tileCol;
            this.endTime = step[currentLevel];
            sheepInPlay--;
            nextX = nearestColumnCentre(nextX);
            nextY = TILE_H * (TILE_ROWS-1 + TILE_Y_ADJUST);
            agentGrid[tileIndexUnder] = OCCUPIED;
          }

        } else if( this.isTileConveyor(tileType) ) {
          if(this.state != CONVEYOR) {
            this.changeMode(CONVEYOR);
            if(tileType == TILE_CONVEYOR_LEFT) {
              this.gotoX = nextX - TILE_W;
              this.ang = Math.PI;
            } else if(tileType == TILE_CONVEYOR_RIGHT) {
              this.gotoX = nextX + TILE_W;
              this.ang = 0;
            }
          }
        } // end of entering Conveyor mode

        else if(tileType != TILE_FIELD) {
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
    this.previousMode = this.state;

  // console.log(this.id, this.state, newMode)

    // if these two swapping might cause trouble when a third mode (e.g. Conveyor) ends and wants to change to Graze or Roam; fixed now
    if(newMode == ROAM) {
      this.state = ROAM;
      this.speed = ROAM_SPEED[currentLevel];
    }

    else if(newMode == GRAZE) {
      this.state= GRAZE;
      this.speed = GRAZE_SPEED[currentLevel];
    }

    else if(newMode == CONVEYOR) {
      this.state= CONVEYOR;
      this.orient = 0; // normal upright
      this.speed = ROAM_SPEED[currentLevel];
      // console.log('Conveyor speed', this.speed);
    }

    else if(newMode == SENT) {
      this.state = SENT;
      // set once when sent, may change on way
      this.speed = SEND_SPEED[currentLevel];
      this.ang = Math.PI/2 // straight down
      if(this.team == BLUE) {
        this.orient = Math.PI * 1/4;
      } else {
        this.orient = Math.PI * 7/4;
      }
    }

    else if(newMode == FENCED) {
      this.state = FENCED;
      // reference Y of row above fence, instead of canvas.height
      this.ang = Math.PI * 1/2;
      if(this.team == BLUE) {
        this.orient = Math.PI * 1/2;
      } else {
        this.orient = Math.PI * 3/2;
      }
      this.speed = 0;
      this.levelDone = true;
      // agentGrid[tileIndexUnder - TILE_COLS] = OCCUPIED;
      testIfLevelEnd();
    }

    else {
      console.log("Unprocessed changeMode for ID", this.id)
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

  this.isMovedBySpeed = function(mode) {
    return mode == ROAM || mode == GRAZE || mode == CALLED || mode == SENT;
  }

  this.isAllowedTopRow = function() {
    return this.state == CALLED || this.state == HELD || this.state == SENT // at release from clamp sheep is in top row
  }

  this.isAllowedBottomRow = function() {
    return this.state == SENT || this.state == FENCED || this.state == IN_BLUE_PEN || this.state == IN_RED_PEN || this.state == ON_ROAD || this.state == STACKED
  }

  this.isModeTimed = function() {
    return this.state == ROAM || this.state == GRAZE || this.state == SENT;
  }

  this.stateIsInGoal = function() {
    return this.state == IN_BLUE_PEN || this.state == IN_RED_PEN;
  }

  this.onTileGoal = function(tileType) {
    return tileType == TILE_CENTRE || tileType == TILE_PEN_BLUE || tileType == TILE_PEN_RED;
  }

  this.isTileConveyor = function(tileType) {
    return tileType == TILE_CONVEYOR_LEFT || tileType == TILE_CONVEYOR_RIGHT
  }

  this.distFrom = function(otherX, otherY) {
    var deltaX = otherX-this.x;
    var deltaY = otherY-this.y;
    return Math.sqrt(deltaX*deltaX + deltaY*deltaY);
  }

  this.draw = function() {
    // tail shows facing by being in opposite direction
    if(this.team == PLAIN) {
      drawBitmapCenteredWithRotation(sheepTailPic, this.x,this.y, this.ang);
    } else if(this.team == BLUE) {
      drawBitmapCenteredWithRotation(sheepTailBluePic, this.x,this.y, this.ang);
      // drawBitmapCenteredWithRotation(sheepRuffBluePic, this.x,this.y, this.orient);
    } else if(this.team == RED) {
      drawBitmapCenteredWithRotation(sheepTailRedPic, this.x,this.y, this.ang);
      // drawBitmapCenteredWithRotation(sheepRuffRedPic, this.x,this.y, this.orient);
    }

    drawBitmapCenteredWithRotation(sheepNormalPic, this.x,this.y, this.orient);

    // if(this.team == BLUE) {
    //   drawBitmapCenteredWithRotation(sheepKnotBluePic, this.x,this.y, this.orient);
    // } else if(this.team == RED) {
    //   drawBitmapCenteredWithRotation(sheepKnotRedPic, this.x,this.y, this.orient);
    // }
    // if(this.team == PLAIN) {
    //   drawBitmapCenteredWithRotation(sheepNormalPic, this.x,this.y, this.orient);
    // } else {
    //   colorCircle(this.x, this.y, SHEEP_RADIUS, this.color);
    // }
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
    var adjust; // ID label obscured when lower left

    if(this.team == null) {
      colorText(this.id, this.x-8, this.y+6, "black");
    } else {
      // draw ID on sheep's back
      var ang = normaliseRadian(this.ang);
      if(ang >= (3/2 * Math.PI) && ang <= 2*Math.PI) {
        adjust = 25;
      }
      else if(ang >= (5/4 * Math.PI) && ang < 3/2 * Math.PI) {
        adjust = 20;
      }
      else if(ang >= 0 && ang <= Math.PI/2) {
        adjust = 20;
      }
      else {
        adjust = 15;
      }
      var backX = this.x - Math.cos(this.ang) * (SHEEP_RADIUS + adjust);
      var backY = this.y - Math.sin(this.ang) * (SHEEP_RADIUS + adjust);
      // colorText(this.id, this.x, this.y - SHEEP_RADIUS - fontSize/4, "white");
      colorText(this.id, backX, backY, "white");
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
    var fontSize = 10;
    canvasContext.font = fontSize + "px Verdana";
    // colorText(this.state, this.x -26, this.y + SHEEP_RADIUS/2, "orange");
    colorText(this.state, facingXoffset, facingYoffset, "white");
  }

  this.scoreLabel = function() {
    if(this.team != PLAIN) {
      var fontSize = 12;
      canvasContext.textAlign = "center";
      canvasContext.font = fontSize + "px Verdana";
      // draw score below sheep
      colorText(this.score, this.x, this.y + TILE_H -6, "white");
      // for upper sheep in stack of 2
      // colorText(this.score, this.x, this.y - TILE_H/2 - 5, "white");
      // colorText(this.score, this.x -10, this.y +6, "black");
      // colorText(this.score, this.x -7, this.y - SHEEP_RADIUS - SCORE_GAP, "white");
    }
  } // end of scoreLabel
} // end of sheepClass
