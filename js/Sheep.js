
const HOOFPRINT_OPACITY = 0.6; // how transparent are the sheep hoofprints 0.0 to 1.0
const SHEEP_RADIUS = 16;
const SIDE_MARGIN = SHEEP_RADIUS/2 + 1;
const TOP_MARGIN = 60;
const FACING_RADIUS = 2;

var teamSizeSoFar = [0, 0, 0];
var sheepInPlay = 0;
const plainSheepCanFinish = true;
var tryIndex = 0; // used in Tests for stacking

const SCORE_GAP = 5; // score drawn above a sheep
const TILE_Y_ADJUST = 0.650; // sheep to tile centre

const ORIENT_BLUE = Math.PI * 1/2; // looks left
const ORIENT_RED = Math.PI * 3/2; // looks right

// sheep modes
const GRAZE = 0;
const ROAM = 1;
const CALLED = 2;
const HELD = 3;
const SENT = 4;
const CONVEYOR = 5;
const STILL = 7;
const DISTRACTED = 8;
const SELECTED = 22; // only while manually edit/testing

// below are positional not moods, but mostly exclusive e.g. cannot be in-pen/in-lorry and roam; but can be fenced and graze/roam
// on-road and fenced were orig created for end-of-level calculation
const STUCK = 11;
const IN_DITCH = 12;
const IN_PEN_BLUE = 13;
const IN_PEN_RED = 14;

// for Tests
const STACKED = 15;
const STACKED_DITCH = 16;
const STACKED_BLUE = 17;
const STACKED_RED = 18;

const sheepModeNames = ['Graze', 'Roam', 'Called', 'Held', 'Sent', 'Conveyor', 'Stuck', 'In_Ditch', 'In_Blue_Pen', 'In_Red_Pen', 'On_Road', 'In_Blue_Lorry', 'In_Red_Lorry'];

function sheepClass() {
  this.x = 0;
  this.y = 0;
  this.speed = 0;
  this.ang = Math.PI/2; // move facing angle
  this.orient = 0; // image display angle
  this.score = 0;
  this.timer = 0;
  this.prevTile = null;
  this.slowed = false;
  this.lostApplied = false;
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
  this.testStillInit = function () {
    this.speed = 0;
    this.ang = Math.PI / 2;
    this.mode = STILL;
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
  this.placeRow = function (row) {
    this.x = TILE_W / 2 + this.id * TILE_W;
    this.y = TILE_H * row + TILE_H / 2;
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

    if (this.levelDone || this.mode == STILL) {
      // if sheep outOfPlay no action
      return;
    }

    // selected for manual movement
    else if (this.mode == SELECTED) {
      nextX = mouse.x;
      nextY = mouse.y;
    }

    // traversing above Distract tile
    else if (this.mode == DISTRACTED && this.speed > 0) {
      var deltaX = this.gotoX - this.x;
      var moveX = this.speed;

      if (deltaX > 0) {  // goto is right of current position
        if (deltaX > moveX) {
          nextX += moveX;
        } else {
          nextX = this.gotoX; // arrive column beyond Distract
          this.changeMode(this.previousMode);
        }
      }
      else {          // goto is left of current position
        if (Math.abs(deltaX) > moveX) {
          nextX -= moveX;
        } else {
          nextX = this.gotoX; // arrive column beyond Distract
          this.changeMode(this.previousMode);
        }
      }
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
        if (this.team == PLAIN) {
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
      }
      else {          // goto is left of current position
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
        // else if (this.mode == DISTRACTED && this.speed > 0) {
        //   changeMode(SENT);
        // }
        else if (this.mode == DISTRACTED && this.speed == 0) {
          this.speed = ROAM_SPEED[currentLevel];
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
    const alpha = HOOFPRINT_OPACITY;
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
        this.mode = IN_PEN_BLUE;
        areaGrid[tileIndexUnder] = FULL_BLUE;
      }
      else if (tileType == TILE_PEN_RED) {
        console.log("Sheep ID", this.id, "reached a red pen.");
        this.orient = Math.PI * 3 / 2;
        this.mode = IN_PEN_RED;
        areaGrid[tileIndexUnder] = FULL_RED;
      }

      agentGrid[tileIndexUnder] = this.team;
      nextX = nearestColumnCentre(nextX);
      nextY = TILE_H * (TILE_ROWS - 1 + TILE_Y_ADJUST);
      this.ang = Math.PI * 1 / 2;
      this.endLevel(tileCol);

      if (this.team == BLUE) {
        this.orient = ORIENT_BLUE;
      }
      else if (this.team == RED) {
        this.orient = ORIENT_RED;
      }

      if (runMode == NORMAL_PLAY) {
        // fixme: perhaps we need some "unhappy" BAA sounds?
        random_baa_sound(baaVolume);
      }
    } // end enter empty pen of either colour


    else if (this.enterOccupiedPen(tileType)) {

      if (runMode == NORMAL_PLAY) {
      // if (runMode == 99) {
        // don't stack above pen, instead roam
        this.changeMode(ROAM);
        nextX = this.x;
        nextY = this.y;
        let flip = randomRangeInt(1, 2);
        let angleAdjust = (flip == 1) ? 9 / 8 : 15 / 8;
        this.ang = angleAdjust * Math.PI;
        if (this.team == BLUE) {
          this.orient = ORIENT_BLUE;
        }
        else if (this.team == RED) {
          this.orient = ORIENT_RED;
        }
        console.log("Pen occupied, graze", this.id);
      }

      else if (runMode == SEND_ONLY || runMode == SEND_ROAM || runMode == ROAM_FROM_R1) {
      // else { // not NORMAL_PLAY
        nextX = nearestColumnCentre(nextX);
        tryIndex = tileIndexUnder;

        while (agentGrid[tryIndex] != 0) {
          tryIndex -= TILE_COLS;
          console.log('tryIndex', tryIndex)
        }

        nextY = yTopFromIndex(tryIndex) + TILE_H * TILE_Y_ADJUST;

        console.log("tilehandle full pen: retreat to Y=", nextY, tryIndex);
        agentGrid[tryIndex] = this.team;
        this.speed = 0;
        this.ang = Math.PI * 1 / 2;
        this.endLevel(tileCol);

        if (this.team == BLUE) {
          this.orient = Math.PI * 1 / 2;
        }
        else if (this.team == RED) {
          this.orient = Math.PI * 3 / 2;
        }

        if (tileType == TILE_PEN_BLUE) {
          this.mode = STACKED_BLUE;
        }
        else if (tileType == TILE_PEN_RED) {
          this.mode = STACKED_RED;
        }

        // stacking = false; // return to default behaviour
      } // end enter full pen of either colour
    }


    else if (tileType == TILE_DITCH) {

      if (this.mode != IN_DITCH) {
        this.changeMode(IN_DITCH);
        this.endLevel(tileCol);
        nextX = nearestColumnCentre(nextX);
        nextY = TILE_H * (TILE_ROWS - 1 + TILE_Y_ADJUST);
        areaGrid[tileIndexUnder] = FULL_DITCH;
        agentGrid[tileIndexUnder] = this.team;
        if (this.team == BLUE) {
          this.orient = ORIENT_BLUE;
        }
        else if (this.team == RED) {
          this.orient = ORIENT_RED;
        }
      }
    }


    else if (tileType == FULL_DITCH) {

      if (runMode == NORMAL_PLAY) {
        // don't stack above ditch, instead roam away
        this.changeMode(ROAM);
        nextX = this.x;
        nextY = this.y;
        let flip = randomRangeInt(1, 2);
        let angleAdjust = (flip == 1) ? 9 / 8 : 15 / 8;
        this.ang = angleAdjust * Math.PI;
        if (this.team == BLUE) {
          this.orient = ORIENT_BLUE;
        }
        else if (this.team == RED) {
          this.orient = ORIENT_RED;
        }
        console.log("Ditch occupied, turn away id", this.id);
      }

      // else if (runMode == SEND_ONLY || runMode == SEND_ROAM || runMode == ROAM_FROM_R1) {
      else { // not NORMAL_PLAY

        nextX = nearestColumnCentre(nextX);
        tryIndex = tileIndexUnder;

        while (agentGrid[tryIndex] != 0) {
          tryIndex -= TILE_COLS;
          console.log('tryIndex', tryIndex)
        }
        nextY = yTopFromIndex(tryIndex) + TILE_H * TILE_Y_ADJUST;

        console.log("tilehandle full pen: retreat to Y=", nextY);
        agentGrid[tryIndex] = this.team;
        this.speed = 0;
        this.ang = Math.PI * 1 / 2;
        this.mode = STACKED_DITCH;
        this.endLevel(tileCol);

        if (this.team == BLUE) {
          this.orient = Math.PI * 1 / 2;
        } else {
          this.orient = Math.PI * 3 / 2;
        }
      }
    } // end full_ditch


    // deflection applied every loop so how many steps sheep inside tile => amount deflected
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


    else if (tileType == TILE_DISTRACT) {

      if (this.mode != DISTRACTED) {

        if (this.team == BLUE || this.team == RED) {
          this.changeMode(DISTRACTED);

          // if arriving at lake from above
          if (this.ang > 1/4*Math.PI && this.ang < 3/4*Math.PI) {
            var turn = 0;
            nextY = nearestRowEdge(nextY) - 12;
          }
          if (this.team == BLUE) {
            turn = LEFT;
            this.ang = Math.PI;
            nextX -= 4;
          }
          else if (this.team == RED) {
            turn = RIGHT;
            this.ang = 0;
            nextX += 4;
          }
          else {
            turn = randomRangeInt(1,2) == 1 ? LEFT : RIGHT;
            this.ang += turn * Math.PI/2;
            nextX += turn > 0 ? -4 : 4;
          }

          // time distracted grazing tasty waterside veg
          this.timer = DISTRACTED_TIME[currentLevel];

          // move to adjacent column i.e. go around lake
          this.gotoX = nextX + turn * TILE_W;
        }
      }
    }


    else if (tileType == TILE_SLOW) {
      if (!this.slowed) {
        this.speed = this.speed / 3;
        this.slowed = true;
        console.log('speed reduce by woods', this.mode);
      // if (this.mode == SENT && this.lostApplied == false) {
        // this.speed *= 0.5;
        // this.lostApplied = true;
        // this.changeMode(ROAM);
        // let angleChange = randomRange(-1, +1);
        // this.ang += angleChange;
        // this.ang = randomRange(0, Math.PI * 2);
      }
    }


    else if (tileType == TILE_STUCK) {
      if (this.mode != STUCK) {
        this.mode = STUCK;
        stuckSound.play();
        this.endLevel(tileCol);
        // need endRow, and Stuck is not a scoring result
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
    } // end not Field ???
    this.prevTile = tileType;

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
      this.orient = 0; // normal upright
    }

    else if (newMode == CONVEYOR) {
      this.mode = CONVEYOR;
      this.orient = 0; // normal upright
      this.speed = CONVEYOR_SPEED[currentLevel];
    }

    else if (newMode == DISTRACTED) {
      this.mode = DISTRACTED;
      this.orient = 0; // normal upright
      this.speed = 0;
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
      this.ang = Math.PI * 1/2;
      if (this.team == BLUE) {
        this.orient = Math.PI * 1/2;
      } else {
        this.orient = Math.PI * 3/2;
      }
      this.speed = 0;
      this.levelDone = true;
    }

    else {
      console.log("Unprocessed changeMode for ID", this.id)
      this.mode = newMode;
      this.speed = 0; // stay still so it can be checked
    }

    if (this.isModeTimed()) {
      this.setExpiry();
    }
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
      return (this.mode == SENT || this.mode == IN_DITCH || this.mode == IN_PEN_BLUE || this.mode == IN_PEN_RED || this.mode == ON_ROAD || this.mode == STACKED);
    }
  }

  this.isModeTimed = function() {
    return this.mode == ROAM || this.mode == GRAZE || this.mode == CALLED || this.mode == SENT || this.mode == DISTRACTED;
  }

  this.modeIsInPen = function () {
    return this.mode == IN_PEN_BLUE || this.mode == IN_PEN_RED;
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
      else if (this.mode == IN_PEN_BLUE) {
        score = PEN_SCORE;
      }
      else if (this.mode == IN_PEN_RED) {
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
