const SHEEP_RADIUS = 16;
const SIDE_MARGIN = SHEEP_RADIUS/2 + 1;
const TOP_MARGIN = 60;
const FACING_RADIUS = 2;

var teamSizeSoFar = [0, 0, 0];
var sheepInPlay = 0;
const plainSheepCanFinish = true;

const SCORE_GAP = 5; // when drawn beside a sheep (individual score)
const TILE_Y_ADJUST = 0.650; // position outOfPlay sheep in tile

// sheep modes
const GRAZE = 0;
const ROAM = 1;
const CALLED = 2;
const HELD = 3;
const SENT = 4;
const CONVEYOR = 5;
const STUCK = 6;

// below are positional not moods, but mostly exclusive e.g. cannot be in-pen/in-lorry and roam; but can be fenced and graze/roam
// on-road and fenced were orig created for end-of-level calculation
const IN_DITCH = 7;
const IN_BLUE_PEN = 8;
const IN_RED_PEN = 9;
const SELECTED = 10; // only while manually edit/testing

// for Tests
const STACKED = 13;
const STACKED_DITCH = 14;
const STACKED_BLUE = 15;
const STACKED_RED = 16;

// not in use
const IN_BLUE_LORRY = 11;
const IN_RED_LORRY = 12;
const ON_ROAD = 14;

const sheepModeNames = ['Graze', 'Roam', 'Called', 'Held', 'Sent', 'Conveyor', 'Stuck', 'In_Ditch', 'In_Blue_Pen', 'In_Red_Pen', 'On_Road', 'In_Blue_Lorry', 'In_Red_Lorry'];

function sheepClass() {
  this.x = 0;
  this.y = 0;
  this.speed = 0;
  this.ang = Math.PI/2; // move facing angle
  this.orient = 0; // image display angle
  this.score = 0;
  this.timer = 0;
  this.test = "normal";
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
    this.mode = mode;
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
  this.testRoamInit = function() {
    this.speed = defaultRoamSpeed;
    this.ang = Math.PI/2;
  }

  this.placeTop = function() {
    this.x = TILE_W/2 + this.id * TILE_W;
    this.y = TILE_H * 3/2 -15;
    this.sentX = this.x; // won't go through player.send()
  }
  this.placeRoamR1 = function() {
    this.x = TILE_W/2 + this.id * TILE_W;
    this.y = TILE_H * 3/2;
  }

  this.testColumnInit = function() {
    this.speed = 3 + this.id * 3;
    this.ang = Math.PI/2;
  }
  this.testColumnXInit = function() {
    // this.speed = TEST_SEND_SPEED;
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
    this.x = randomRangeInt(0 + SIDE_MARGIN, gameCanvas.width - SIDE_MARGIN -2);
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
    // this.previousMode = this.mode;
    var tileOccupied;
    var pos; // temporary position

    if (this.levelDone) {
      // if sheep in a PEN or DITCH no action
      return;
    }

    // selected for manual movement
    else if (this.mode == SELECTED) {
      nextX = mouse.x;
      nextY = mouse.y;
    }

    // attached to player
    else if (this.mode == HELD) {
      nextX = player.x;
      nextY = player.y + 24;
    }

    else if (this.mode == CALLED) {
      nextY -= tractorSpeed;

      if (nextY < player.y + 20) { // arriving at Hat
        nextX = player.x;
        nextY = player.y + 24;
        this.mode = HELD;
        this.speed = 0;
        player.sheepIDheld = this.id;
        update_debug_report(); // to display Hold

        // if already Sorted, don't change
        if (this.team == 0) {
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

    else if (this.mode == SENT) {
      // isMovedBySpeed() handles angle effect
      // if waggle while Sent, that goes here
    }

    else if (this.mode == GRAZE) {
      // if (randomRangeInt(1, GRAZE_FACING[currentLevel]) == 1) {
      if (randomRangeInt(1, 120) == 1) {
        this.ang += randomRange(-Math.PI/8, Math.PI/8)
      }
    }

    else if (this.mode == ROAM) {
      // if (randomRangeInt(1, ROAM_FACING[currentLevel]) == 1) {
      if (randomRangeInt(1, 30) == 1) {
        this.ang += randomRange(-Math.PI/8, Math.PI/8)
      }
    }

    else if (this.mode == CONVEYOR) {
      var deltaX = this.gotoX - this.x;
      var moveX = CONVEYOR_SPEED[currentLevel];

      if (deltaX > 0) {  // goto is right of current position
        if (deltaX > moveX) {
          nextX += moveX;
        } else {
          nextX = this.gotoX; // arrive at end of conveyor
          this.changeMode(this.previousMode);
        }
      } else {          // goto is left of current position
        if (Math.abs(deltaX) > moveX) {
          nextX -= moveX;
        } else {
          nextX = this.gotoX;
          this.changeMode(this.previousMode);
        }
      }
    }

    // common to ROAM, CALLED, SENT
    if (this.isMovedBySpeed(this.mode)) {
      nextX += this.speed * Math.cos(this.ang);
      nextY += this.speed * Math.sin(this.ang);
    }

    // screenwrap horizontal
    if (nextX < 0) {
      nextX += gameCanvas.width;
    } else if (nextX >= gameCanvas.width) {
      nextX -= gameCanvas.width;
    }

    // bounce down from top row if not Called
    if (nextY < 50) {
      if (this.isAllowedTopRow() == false) {
        this.ang = 2*Math.PI - this.ang;
        nextY = this.y; // stops oscillation
      }
    }
    // bounce up from bottom row if not allowed there
    if (nextY > 540) {
      if (this.isAllowedBottomRow() == false) {
        this.ang = 2*Math.PI - this.ang;
        nextY = this.y; // stops oscillation
      }
    }

    // if x,y change inside tileHandling must be returned as object
    pos = this.tileHandling(nextX, nextY);

    if (pos != undefined) {
      this.x = pos.x;
      this.y = pos.y;
    }
    else {
      console.log("TileHandling failed to set x & y values");
      this.x = nextX;
      this.y = nextY;
    }

    if ( this.isModeTimed() ) {
      this.timer--;
      if (this.timer < 1) {
        if (this.mode == ROAM || this.mode == SENT) {
          this.changeMode(GRAZE);
        }
        else if (this.mode == GRAZE) {
          this.changeMode(ROAM);
        }
      }
    }

    if (runMode == NORMAL_PLAY) {
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

  this.tileHandling = function (nextX, nextY) {
    var tileCol = Math.floor(nextX / TILE_W);
    var tileRow = Math.floor(nextY / TILE_H);
    var tileIndexUnder = colRowToIndex(tileCol, tileRow);

    var tileType = getTileTypeAtColRow(tileCol, tileRow);


    if (this.enterPen(tileType)) {

      if (tileType == TILE_PEN_BLUE) {
        console.log("Sheep ID", this.id, "reached a blue pen.");
        this.orient = Math.PI * 1 / 2;
        this.mode = IN_BLUE_PEN;
        areaGrid[tileIndexUnder] = FULL_BLUE;
      }
      else if (tileType == TILE_PEN_RED) {
        console.log("Sheep ID", this.id, "reached a red pen.");
        this.orient = Math.PI * 3 / 2;
        this.mode = IN_RED_PEN;
        areaGrid[tileIndexUnder] = FULL_RED;
      }

      agentGrid[tileIndexUnder] = this.team;
      nextX = nearestColumnCentre(nextX);
      nextY = TILE_H * (TILE_ROWS - 1 + TILE_Y_ADJUST);
      this.ang = Math.PI * 1 / 2;
      this.endLevel(tileCol);
      levelOver = isLevelOver();

      // fixme: perhaps we need some "unhappy" BAA sounds?
      random_baa_sound(baaVolume);
    } // end enter empty pen of either colour


    else if (this.enterOccupiedPen(tileType)) {
      if (haste != VISUAL_TEST) {
        // don't stack above pen, instead roam
        this.changeMode(ROAM);
        nextX = this.x;
        nextY = this.y;
        let flip = randomRangeInt(1, 2);
        let angleAdjust = (flip == 1) ? 9 / 8 : 15 / 8;
        this.ang = angleAdjust * Math.PI;
        this.orient = 0;
        console.log("Pen occupied, graze", this.id);
      }

      else if (haste == VISUAL_TEST) {
        nextX = nearestColumnCentre(nextX);
        nextY = ((tileRow - 1) * TILE_H) + (TILE_H * TILE_Y_ADJUST);
        console.log("Agenthandling: retreat to Y=", nextY);
        this.speed = 0;
        this.ang = Math.PI * 1 / 2;

        if (this.team == BLUE) {
          this.orient = Math.PI * 1 / 2;
        } else {
          this.orient = Math.PI * 3 / 2;
        }

        this.mode = STACKED;
        this.endLevel(tileCol);
        levelOver = isLevelOver();

        agentGrid[tileIndexUnder - TILE_COLS] = this.team;
        stacking = false; // return to default behaviour
      } // end enter full pen of either colour
    }

    else if (tileType == TILE_DITCH) {
      if (this.mode != IN_DITCH) {
        this.changeMode(IN_DITCH);
        this.endLevel(tileCol);
        nextX = nearestColumnCentre(nextX);
        nextY = TILE_H * (TILE_ROWS - 1 + TILE_Y_ADJUST);
        agentGrid[tileIndexUnder] = this.team;
        areaGrid[tileIndexUnder] = FULL_DITCH;
        levelOver = isLevelOver();
      }
    }

    else if (tileType == FULL_DITCH) {

      if (haste != VISUAL_TEST) {
        // don't stack above ditch, instead roam away
        this.changeMode(ROAM);
        nextX = this.x;
        nextY = this.y;
        let flip = randomRangeInt(1, 2);
        let angleAdjust = (flip == 1) ? 9 / 8 : 15 / 8;
        this.ang = angleAdjust * Math.PI;
        this.orient = 0;
        console.log("Ditch occupied, turn away id", this.id);
      }

      else if (haste == VISUAL_TEST) {
        nextX = nearestColumnCentre(nextX);
        nextY = ((tileRow - 1) * TILE_H) + (TILE_H * TILE_Y_ADJUST);
        console.log("stack at Y=", nextY);
        this.speed = 0;
        this.ang = Math.PI * 1 / 2;
        if (this.team == BLUE) {
          this.orient = Math.PI * 1 / 2;
        } else {
          this.orient = Math.PI * 3 / 2;
        }
        this.mode = STACKED;
        this.endLevel(tileCol);
        levelOver = isLevelOver();
        agentGrid[tileIndexUnder - TILE_COLS] = this.team;
        stacking = false; // return to default behaviour
      }
    } // end full_ditch


    // deflection size governed by how many steps inside tile
    // applied every loop
    else if (tileType == TILE_BEND_LEFT) {
      if (this.mode == SENT) {
        this.ang += 0.1;
      }
      else {
        this.ang += 0.01;
      }
    }

    else if (tileType == TILE_BEND_RIGHT) {
      if (this.mode == SENT) {
        this.ang -= 0.1;
      }
      else {
        this.ang -= 0.01;
      }
    // should only apply on entering
    }


    else if (tileType == TILE_HALT) {
      if (this.mode != GRAZE) {
        this.changeMode(GRAZE);
        // if arriving at lake from above
        if (this.ang > 1/4*Math.PI && this.ang < 3/4*Math.PI) {
          // nextY -= this.speed; // stay at edge of lake
          nextY = nearestRowEdge(nextY) -10;
          console.log("Avoid walking into water");
        }
        var turn = randomRangeInt(1,2) == 1 ? 1 : (-1);
        this.ang += turn * Math.PI/2;
      }
    }

    else if (tileType == TILE_LOST) {
      if (this.mode != ROAM) {
        this.changeMode(ROAM);
        this.ang = randomRange(0, Math.PI * 2);
      }
    }

    else if (tileType == TILE_STUCK) {
      if (this.mode != STUCK) {
        this.mode = STUCK;
        stuckSound.play();
        this.endLevel(tileCol);
        levelOver = isLevelOver();
        // definitely need endRow, and Stuck is not a scoring result
      }
    }

    else if ( this.isTileConveyor(tileType) ) {
      if (this.mode != CONVEYOR) {
        this.changeMode(CONVEYOR);
        if (tileType == TILE_CONVEYOR_LEFT) {
          this.gotoX = nextX - TILE_W;
          this.ang = Math.PI;
        }
        else if (tileType == TILE_CONVEYOR_RIGHT) {
          this.gotoX = nextX + TILE_W;
          this.ang = 0;
        }
      }
    } // end of entering Conveyor mode

    else if (tileType != TILE_FIELD) {
      this.speed = 0;
    } // end Grass Field

    return {
      x: nextX,
      y: nextY
    };
  } // end of tileHandling


  this.changeMode = function(newMode) {
    // change state, also set direction & speed
    // should not set at start of .move()
    this.previousMode = this.mode;

    // console.log(this.id, this.mode, newMode)

    // if these two swapping might cause trouble when a third mode (e.g. Conveyor) ends and wants to change to Graze or Roam; fixed now
    if (newMode == ROAM) {
      this.mode = ROAM;
      this.speed = ROAM_SPEED[currentLevel];
    }

    else if (newMode == GRAZE) {
      this.mode = GRAZE;
      this.speed = GRAZE_SPEED[currentLevel];
    }

    else if (newMode == CONVEYOR) {
      this.mode = CONVEYOR;
      this.orient = 0; // normal upright
      this.speed = CONVEYOR_SPEED[currentLevel];
    }

    else if (newMode == SENT) {
      this.mode = SENT;
      // set once when sent, may change on way
      this.speed = SEND_SPEED[currentLevel];
      this.ang = Math.PI/2 // straight down

      if (this.team == BLUE) {
        this.orient = Math.PI * 1/4;
      }
      else {
        this.orient = Math.PI * 7/4;
      }
    }

    else if (newMode == IN_DITCH) {
      this.mode = IN_DITCH;
      // reference Y of row above fence, instead of canvas.height
      this.ang = Math.PI * 1/2;
      if (this.team == BLUE) {
        this.orient = Math.PI * 1/2;
      } else {
        this.orient = Math.PI * 3/2;
      }
      this.speed = 0;
      this.levelDone = true;
      // agentGrid[tileIndexUnder - TILE_COLS] = OCCUPIED;
      levelOver = isLevelOver();
    }

    else {
      console.log("Unprocessed changeMode for ID", this.id)
      this.mode = newMode;
      this.speed = 0; // stay still so it can be checked
    }

    if (this.isModeTimed()) {
      this.setExpiry();
    }

    // change FPS instead to avoid sheep jumping through tiles
    if (!hastenTestViaFPS) {
      this.speed *= testHasteMultiplier[runMode];
    }

    // changeMode is not changing X or Y this/next/goto y
    // return {
    //   x: nextX,
    //   y: nextY
    // };
  }


  // restart timer to expire mode
  this.setExpiry = function() {
    if (this.mode == ROAM) {
      this.timer = randomRangeInt(ROAM_TIME_MIN[currentLevel], ROAM_TIME_MAX[currentLevel]);
    }
    else if (this.mode == GRAZE) {
      this.timer = randomRangeInt(GRAZE_TIME_MIN[currentLevel], GRAZE_TIME_MAX[currentLevel]);
    }
    else if (this.mode == SENT) {
      this.timer = 200;
    }
    else if (this.mode == CALLED) {
      this.timer = 200;
    }
  }

  this.setSpeed = function() {
    if (this.mode == ROAM) {
      this.speed = ROAM_SPEED[currentLevel];
    }
    if (this.mode == GRAZE) {
      this.speed = GRAZE_SPEED[currentLevel];
    }
  }

  this.isMovedBySpeed = function(mode) {
    return mode == ROAM || mode == GRAZE || mode == CALLED || mode == SENT;
  }

  this.isAllowedTopRow = function() {
    return this.mode == CALLED || this.mode == HELD || this.mode == SENT // at release from clamp sheep is in top row
  }

  this.isAllowedBottomRow = function() {
    if ( plainSheepCanFinish ) {
      return true;
    }
    else if ( this.team != PLAIN ) {
      return (this.mode == SENT || this.mode == IN_DITCH || this.mode == IN_BLUE_PEN || this.mode == IN_RED_PEN || this.mode == ON_ROAD || this.mode == STACKED);
    }
  }

  this.isModeTimed = function() {
    return this.mode == ROAM || this.mode == GRAZE || this.mode == CALLED || this.mode == SENT;
  }

  this.modeIsInPen = function () {
    return this.mode == IN_BLUE_PEN || this.mode == IN_RED_PEN;
  }

  this.enterPen = function (tileType) {
    return tileType == TILE_PEN_BLUE || tileType == TILE_PEN_RED;
  }

  this.enterOccupiedPen = function (tileType) {
    return tileType == FULL_BLUE || tileType == FULL_RED;
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
    if (this.team == PLAIN) {
      drawBitmapCenteredWithRotation(canvasContext, sheepTailPic, this.x,this.y, this.ang);
    }
    else if (this.team == BLUE) {
      drawBitmapCenteredWithRotation(canvasContext, sheepTailBluePic, this.x,this.y, this.ang);
      // drawBitmapCenteredWithRotation(sheepRuffBluePic, this.x,this.y, this.orient);
    }
    else if (this.team == RED) {
      drawBitmapCenteredWithRotation(canvasContext, sheepTailRedPic, this.x,this.y, this.ang);
      // drawBitmapCenteredWithRotation(sheepRuffRedPic, this.x,this.y, this.orient);
    }

    drawBitmapCenteredWithRotation(canvasContext, sheepNormalPic, this.x,this.y, this.orient);

    if (this.mode == CALLED) {
      // draw line between sheep and hat
      colorLine(canvasContext, player.x,player.y, this.x,this.y, "yellow")
    }
    if (editMode) {
      var facingX = this.x + Math.cos(this.ang) * SHEEP_RADIUS;
      var facingY = this.y + Math.sin(this.ang) * SHEEP_RADIUS;
      colorCircle(canvasContext, facingX, facingY, FACING_RADIUS, "red");

      canvasContext.textAlign = "center";
      if (idLabel) {
        this.idLabel();
      }
      if (timerLabel) {
        this.timerLabel();
      }
      if (modeLabel) {
        this.modeLabel();
      }
      canvasContext.textAlign = "left";
    }
  } // end of draw

  this.idLabel = function() {
    var fontSize = 10;
    canvasContext.font = fontSize + "px Verdana";
    var adjust; // ID label obscured when lower left

    if (this.team == null) {
      colorText(canvasContext, this.id, this.x-8, this.y+6, "black");
    }
    else {
      var ang = normaliseRadian(this.ang);
      if (ang >= (3 / 2 * Math.PI) && ang <= 2 * Math.PI) {
        adjust = 22;
      }
      else if (ang >= (5 / 4 * Math.PI) && ang < 3 / 2 * Math.PI) {
        adjust = 16;
      }
      else if (ang >= 0 && ang <= Math.PI / 2) {
        adjust = 16;
      }
      else {
        adjust = 12;
      }
      var backX = this.x - Math.cos(this.ang) * (SHEEP_RADIUS + adjust);
      var backY = this.y - Math.sin(this.ang) * (SHEEP_RADIUS + adjust);
      // colorText(canvasContext, this.id, this.x, this.y - SHEEP_RADIUS - fontSize/4, "white");
      colorText(canvasContext, this.id, backX, backY, "white");
    }
  }

  this.timerLabel = function() {
    var facingXoffset = this.x + Math.cos(this.ang + Math.PI/4) * (SHEEP_RADIUS +8);
    var facingYoffset = this.y + Math.sin(this.ang + Math.PI/4) * (SHEEP_RADIUS +8);
    var fontSize = 7;
    canvasContext.font = fontSize + "px Verdana";
    // colorText(this.timer, this.x, this.y + SHEEP_RADIUS + fontSize, "yellow");
    colorText(canvasContext, this.timer, facingXoffset, facingYoffset, "yellow");
  }

  this.modeLabel = function() {
    var facingXoffset = this.x + Math.cos(this.ang - Math.PI/4) * (SHEEP_RADIUS +7);
    var facingYoffset = this.y + Math.sin(this.ang - Math.PI/4) * (SHEEP_RADIUS +7);
    var fontSize = 8;
    canvasContext.font = fontSize + "px Verdana";
    // colorText(this.mode, this.x -26, this.y + SHEEP_RADIUS/2, "orange");
    colorText(canvasContext, this.mode, facingXoffset, facingYoffset, "white");
  }

  this.scoreLabel = function() {
    if (this.team != PLAIN) {
      var fontSize = 12;
      canvasContext.textAlign = "center";
      canvasContext.font = fontSize + "px Verdana";
      // draw score below sheep
      colorText(canvasContext, this.score, this.x, this.y + TILE_H -6, "white");
      // for upper sheep in stack of 2
      // colorText(this.score, this.x, this.y - TILE_H/2 - 5, "white");
      // colorText(this.score, this.x -10, this.y +6, "black");
      // colorText(this.score, this.x -7, this.y - SHEEP_RADIUS - SCORE_GAP, "white");
    }
  } // end of scoreLabel


  this.drawScore = function() {
      var fontSize = 20;
      canvasContext.textAlign = "center";
      canvasContext.font = fontSize + "px Verdana";
      // draw score above sheep
      colorText(canvasContext, this.score, this.x, this.y - TILE_H + 5, "white");
  } // end of drawScore


  // overlap with changeMode? stacked
  this.endLevel = function(col) {
    this.speed = 0; // usually set by changeMode?
    this.endTime = step[currentLevel];
    this.endCol = col;
    this.levelDone = true;
    this.calculateScore();
    sheepInPlay--;
    update_debug_report();
    // test if level complete
  }

  this.calculateScore = function() {
    var score = 0;
    if (this.team != PLAIN) {

      if (this.mode == IN_DITCH) {
        score = DITCH_SCORE;
      }
      else if (this.mode == IN_BLUE_PEN) {
        score = PEN_SCORE;
      }
      else if (this.mode == IN_RED_PEN) {
        score = PEN_SCORE;
      }

      if ( this.isOffside() ) {
        score *= 1 - (1+currentLevel)/5;
        score = Math.round(score);
      }

      this.score = score;
      levelScore += score;
      this.scoreDisplayTimer = SCORE_DISPLAY_TIME;
      return score;
      // console.log(sheepList[i].id, x, team, mode, offSide, done)
    }
  }

  this.isOffside = function() {
    var offside = false;
    // if central tile it scores for both teams (adjust by TILE_W/2)
    var centralAdjust = isOdd(TILE_COLS) ? TILE_W/2 : 0;
    if (this.team == BLUE && this.x >= gameCanvas.width / 2 + centralAdjust) {
      offside = true;
    }
    else if (this.team == RED && this.x < gameCanvas.width / 2 - centralAdjust) {
      offside = true;
    }
    return offside;
  }

} // end of sheepClass
