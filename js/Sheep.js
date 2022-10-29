const HOOFPRINT_OPACITY = 0.6; // how transparent are the sheep hoofprints 0.0 to 1.0
const SHEEP_RADIUS = 16;
const SIDE_MARGIN = SHEEP_RADIUS / 2 + 1;
const TOP_MARGIN = 60;
const HAT_PATH_SHEEP_EXCLUSION_Y = 60;
const FACING_RADIUS = 2;

var teamSizeSoFar = [0, 0, 0];
var sheepInPlay = 0;
const plainSheepCanFinish = true;
var tryIndex = 0; // used in Tests for stacking
var antennaLength = 30;

const SCORE_GAP = 5; // score drawn above a sheep
const TILE_Y_ADJUST = 0.650; // sheep to tile centre

const ORIENT_BLUE = Math.PI * 1 / 2; // looks left
const ORIENT_RED = Math.PI * 3 / 2; // looks right

// sheep modes
const GRAZE = 0;
const ROAM = 1;
const CALLED = 2;
const HELD = 3;
const SENT = 4;
const PEEPED = 5;
const CONVEYOR = 6;
const STILL = 7;
const DISTRACTED = 8;
const HALTED = 9;
const LICKED = 10;

const SHY = 21;
const SELECTED = 22; // only while manually edit/testing

// below 4 are positional/out-of-play, not true modes
const STUCK = 11;
const IN_DITCH = 12;
const IN_PEN_BLUE = 13;
const IN_PEN_RED = 14;

// for Tests
const STACKED = 15;
const STACKED_DITCH = 16;
const STACKED_BLUE = 17;
const STACKED_RED = 18;

const sheepModeNames = ['Graze', 'Roam', 'Called', 'Held', 'Sent', 'Peeped', 'Conveyor', 'Still', 'Distracted', 'Halted', 'Licked', 'Stuck', 'In_Ditch', 'In_Pen_Blue', 'In_Pen_Red', 'Stacked', 'Stacked_Ditch', 'Stacked_Blue', 'Stacked_Red', 'In_Blue_Lorry', 'In_Red_Lorry', '', 'Selected'];

sheepClass.prototype = new movingClass();

function sheepClass() {
  this.x = 0;
  this.y = 0;
  this.nextX = 0;
  this.nextY = 0;
  this.gotoX = null;
  this.gotoY = null;
  this.speed = 0;
  this.ang = Math.PI / 2; // move facing angle
  this.orient = 0; // image display angle
  this.score = 0;
  this.timer = 0;
  this.previousTileType = null;
  this.adjustSpeed = 1.0;
  this.lostApplied = false;
  this.test = "normal";
  this.sentX = null;
  this.beginTime = null;
  this.endTime = null;
  this.endCol = null;
  this.endRow = null;
  this.antennaLeftX = null;
  this.antennaLeftY = null;
  this.antennaRightX = null;
  this.antennaRightY = null;
  this.soundTimer = 0;
  this.avoidCollisionTimer = 0;
  this.shyTimer = 0;
  this.enteredNewGridSquare = false;

  this.reset = function (i, team, potential, mode) {
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

  this.testRowInit = function () {
    this.speed = 15;
    this.ang = Math.PI / 2;
  }

  this.testRoamInit = function () {
    this.speed = defaultRoamSpeed;
    this.ang = Math.PI / 2;
  }

  this.testStillInit = function () {
    this.speed = 0;
    this.ang = Math.PI / 2;
    this.mode = STILL;
  }

  this.placeTop = function () {
    this.x = TILE_W / 2 + this.id * TILE_W;
    this.y = TILE_H * 3 / 2 - 15;
    this.sentX = this.x; // won't go through player.send()
  }

  this.placeRoamR1 = function () {
    this.x = TILE_W / 2 + this.id * TILE_W;
    this.y = TILE_H * 3 / 2;
  }

  this.placeRow = function (row) {
    this.x = TILE_W / 2 + this.id * TILE_W;
    this.y = TILE_H * row + TILE_H / 2;
  }

  this.placeRandom = function (depth) {
    this.x = randomRangeInt(0 + SIDE_MARGIN, gameCanvas.width - SIDE_MARGIN - 2);
    this.y = randomRangeInt(TOP_MARGIN + 10, depth);
    // console.log(this.id, this.x, this.y)
  }

  this.placeGridRandom = function (depth) {
    let startRow = 1;
    if (gameState == STATE_GUIDE) {
      startRow = 4;
    }
    let maxRow = Math.floor(depth / TILE_H) - 1;

    var row = randomRangeInt(startRow, maxRow);
    var col = randomRangeInt(0, TILE_COLS - 1);
    var index = row * TILE_COLS + col;
    
    this.previousIndex = index;
    this.x = col * TILE_W + TILE_W / 2;
    this.y = row * TILE_H + TILE_H / 2;
    // console.log(this.id, col, row, this.x, this.y)
  }

  // 1st, mode governs speed
  // 2nd, check screenwrap X and bounce Y
  // 3rd, test if tile occupied
  // 4th, tile handling

  this.move = function () {
    this.nextX = this.x; // previous location
    this.nextY = this.y;

    var tileOccupied;

    if (this.mode == SELECTED) {
      // selected for manual movement
      this.nextX = mouse.x;
      this.nextY = mouse.y;
    }

    else if (this.levelDone || this.mode == STILL) {
      // if sheep outOfPlay no action
      return;
    }

    else if (this.mode == CALLED) {
      this.gotoX = player.x; // Hat may have moved
      // tried in Hat.js to avoid lag but no effect
    } // end CALLED

    // attached to player
    else if (this.mode == HELD) {
      this.nextX = player.x;
      this.nextY = player.y + 24;
    }

    else if (this.mode == SENT) {
      // isMovedByFacing() handles angle effect
      // if waggle while Sent, that goes here
    }

    else if (this.mode == HALTED) {
      if (randomRangeInt(1, 120) == 1) {
        this.ang += randomRange(-Math.PI / 16, Math.PI / 16)
      }
    }

    else if (this.mode == GRAZE) {
      // if (randomRangeInt(1, GRAZE_FACING[currentLevel]) == 1) {
      if (randomRangeInt(1, 120) == 1) {
        this.ang += randomRange(-Math.PI / 8, Math.PI / 8)
      }
    }

    else if (this.mode == ROAM) {
      if (gameState == STATE_GUIDE && tutorStep == 2) {
        // no turning
      }
      else if (randomRangeInt(1, 30) == 1) {
        this.ang += randomRange(-Math.PI / 8, Math.PI / 8)
      }
    }

    else if (this.mode == CONVEYOR) {

    }

    else if (this.mode == DISTRACTED && this.speed > 0) {

    }
    // end of mode alternatives

    if (this.shyTimer > 0) { // plain sheep shying away from dog
      this.shyTimer--;
    }

    if (this.avoidCollisionTimer > 0) {
      this.avoidCollisionTimer--;
    }
    else if (this.mode != CALLED && runMode == NORMAL_PLAY) {
      this.antennaCheck(this.nextX, this.nextY);
    }

    if (this.gotoX || this.gotoY) {
      // for Called, Shy, Conveyor, Tile-centring, Distracted?

      var deltaX = this.gotoX - this.x;
      var deltaY = this.gotoY - this.y;

      var distanceToGo = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      var normX = deltaX / distanceToGo;
      var normY = deltaY / distanceToGo;

      if (distanceToGo > this.speed) {
        this.nextX += normX * this.speed;
        this.nextY += normY * this.speed;

        // hack to stop sheep rising above player
        // if (this.nextY < this.gotoY) { this.nextY = this.gotoY; }
      }
      else {
        this.nextX = this.gotoX;
        this.nextY = this.gotoY;
        this.gotoX = null;
        this.gotoY = null;

        // arriving at gotoXY
        if (this.mode == CALLED) {
          this.calledArrives(this.nextX, this.nextY);
        }

        else if (this.mode == SHY) {
          if (this.previousMode == CALLED) {
            this.changeMode(CALLED);
          }
          // else if (this.previousMode == SENT) { // No, drops again too soon & has to retreat again
          //   this.changeMode(SENT);
          // }
          else {
            this.changeMode(GRAZE);
            this.timer = 40;
          }
          // console.log(this.id, 'mode', this.mode)
        }

        else if (this.mode == CONVEYOR) {
          this.gotoX = null;
          this.gotoY = null;
          this.changeMode(this.previousMode);
          console.log('after conveyor', sheepModeNames[this.previousMode]), this.speed;
        }

        else if (this.mode == DISTRACTED && this.speed > 0) {
          this.changeMode(this.previousMode);
        }

      } // end distanceToGo
    }

    else if (this.isMovedByFacing(this.mode)) {
      // common to SENT, ROAM, GRAZE, PEEPED
      let tileSpeed = this.speed * this.adjustSpeed;
      this.nextX += tileSpeed * Math.cos(this.ang);
      this.nextY += tileSpeed * Math.sin(this.ang);
    }

    else {
      if (this.mode != SELECTED && this.mode != HELD) {
        // console.log("Neither goto nor guided by prior facing");
      }
    }

    // screenwrap horizontal
    if (this.nextX < 0) {
      this.nextX += gameCanvas.width;
    } else if (this.nextX >= gameCanvas.width) {
      this.nextX -= gameCanvas.width;
    }

    // bounce down from top row if not Called
    if (this.nextY < HAT_PATH_SHEEP_EXCLUSION_Y) {
      if (this.isAllowedTopRow() == false) {
        this.ang = this.ang - Math.PI;
        this.gotoY = this.y + TILE_H/4;
        // this.nextY = this.y; // stops oscillation
        this.gotoX = this.x;
        if (this.mode = PEEPED) {
          this.changeMode(ROAM);
          this.timer = 120;
          let rand = randomRangeInt(1,2);
          if (rand == 1) {
            this.ang = 7 * Math.PI/8;
          } else {
            this.ang = Math.PI/8;
          }
        }
      }
    }

    // bounce up from bottom row if not allowed there
    if (this.nextY > 540) {
      if (this.isAllowedBottomRow() == false) {
        this.ang = 2 * Math.PI - this.ang;
        this.nextY = this.y; // stops oscillation
      }
    }

    if ( this.doTileHandling() ) {
      this.tileHandling();
    }

    this.x = this.nextX;
    this.y = this.nextY;

    if (this.soundTimer > 0) {
      this.soundTimer--;
    }

    if (this.isModeTimed()) {
      this.timer--;
      if (this.timer < 1) {
        if (this.mode == ROAM || this.mode == SENT) {
          this.changeMode(GRAZE);
        }
        else if (this.mode == GRAZE) {
          this.changeMode(ROAM);
        }
        else if (this.mode == LICKED) {
          this.changeMode(this.previousMode);
        }
        else if (this.mode == SHY) { // No, it ends when goto reached not by timer
          this.changeMode(GRAZE);
          this.timer = 40;
          console.log(this.id, 'mode', this.mode)
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
    this.enteredNewGridSquare = false;
  } // end .move()


  ////////// TILE HANDLING /////////////
  this.tileHandling = function () {
    var tileCol = Math.floor(this.nextX / TILE_W);
    var tileRow = Math.floor(this.nextY / TILE_H);
    var tileIndexUnder = colRowToIndex(tileCol, tileRow);
    var tileType = getTileTypeAtColRow(tileCol, tileRow);

    // first entering a grid square
    if (tileIndexUnder != this.previousIndex) {
      this.enteredNewGridSquare = true;
      this.previousIndex = tileIndexUnder;
    }

    if (this.previousTileType == TILE_SLOW && tileType != TILE_SLOW) {
      this.adjustSpeed = 1.0;
    }

    if (this.enterPen(tileType)) {

      agentGrid[tileIndexUnder] = this.team;
      this.nextX = nearestColumnCentre(this.nextX);
      this.nextY = TILE_H * (TILE_ROWS - 1 + TILE_Y_ADJUST);
      this.ang = Math.PI * 1 / 2;
      this.teamOrient();
      makePenVFX(this.nextX, this.nextY, this.team);

      if (tileType == TILE_PEN_BLUE) {
        console.log("Sheep ID", this.id, "reached a blue pen.");
        this.mode = IN_PEN_BLUE;
        areaGrid[tileIndexUnder] = FULL_BLUE;
        if (this.team == RED) {
          wrongpenSound.play(0.6);
        }
      }
      else if (tileType == TILE_PEN_RED) {
        console.log("Sheep ID", this.id, "reached a red pen.");
        this.mode = IN_PEN_RED;
        areaGrid[tileIndexUnder] = FULL_RED;
        if (this.team == BLUE) {
          wrongpenSound.play(0.6);
        }
      }

      this.endLevel(tileCol);

      if (runMode == NORMAL_PLAY) {
        // fixme: perhaps we need some "unhappy" BAA sounds?
        gateSound.play(0.4);
        pennedSound.play(0.3);
      }
    } // end enter empty pen of either colour


    else if (this.enterOccupiedPen(tileType)) {

      if (runMode == NORMAL_PLAY) {
        this.changeMode(ROAM);
        this.nextX = this.x;
        this.nextY = this.y;
        this.gotoY = this.y - TILE_H;
        this.gotoX = this.x;
        let flip = randomRangeInt(1, 2);
        let angleAdjust = (flip == 1) ? 9 / 8 : 15 / 8;
        this.ang = angleAdjust * Math.PI;
        this.teamOrient();
        console.log("Pen occupied, graze", this.id);
      }

      else if (runMode == SEND_ONLY || runMode == SEND_ROAM || runMode == ROAM_FROM_R1) {
        // else { // not NORMAL_PLAY
        this.nextX = nearestColumnCentre(this.nextX);
        tryIndex = tileIndexUnder;

        while (agentGrid[tryIndex] != 0) {
          tryIndex -= TILE_COLS;
          console.log('tryIndex', tryIndex)
        }

        this.nextY = yTopFromIndex(tryIndex) + TILE_H * TILE_Y_ADJUST;

        console.log("tilehandle full pen: retreat to Y=", this.nextY, tryIndex);
        agentGrid[tryIndex] = this.team;
        this.speed = 0;
        this.ang = Math.PI * 1 / 2;
        this.endLevel(tileCol);
        this.teamOrient();

        if (tileType == TILE_PEN_BLUE) {
          this.mode = STACKED_BLUE;
        }
        else if (tileType == TILE_PEN_RED) {
          this.mode = STACKED_RED;
        }
      } // end enter full pen of either colour
    }


    else if (tileType == TILE_DITCH) {

      if (this.mode != IN_DITCH) {
        this.changeMode(IN_DITCH);
        this.endLevel(tileCol);
        this.nextX = nearestColumnCentre(this.nextX);
        this.nextY = TILE_H * (TILE_ROWS - 1 + TILE_Y_ADJUST);
        areaGrid[tileIndexUnder] = FULL_DITCH;
        agentGrid[tileIndexUnder] = this.team;
        this.teamOrient();
        makeDitchVFX(this.nextX, this.nextY);
      }
    }


    else if (tileType == FULL_DITCH) {

      if (runMode == NORMAL_PLAY) {
        // don't stack above ditch, instead roam away
        this.changeMode(ROAM);
        this.nextX = this.x;
        this.nextY = this.y;
        this.gotoY = this.y - TILE_H;
        this.gotoX = this.x;
        let flip = randomRangeInt(1, 2);
        let angleAdjust = (flip == 1) ? 9 / 8 : 15 / 8;
        this.ang = angleAdjust * Math.PI;
        this.teamOrient();
        console.log("Ditch occupied, turn away id", this.id);
      }

      // else if (runMode == SEND_ONLY || runMode == SEND_ROAM || runMode == ROAM_FROM_R1) {
      else { // not NORMAL_PLAY

        this.nextX = nearestColumnCentre(this.nextX);
        tryIndex = tileIndexUnder;

        while (agentGrid[tryIndex] != 0) {
          tryIndex -= TILE_COLS;
          console.log('tryIndex', tryIndex)
        }
        this.nextY = yTopFromIndex(tryIndex) + TILE_H * TILE_Y_ADJUST;

        console.log("tilehandle full pen: retreat to Y=", this.nextY);
        agentGrid[tryIndex] = this.team;
        this.speed = 0;
        this.ang = Math.PI * 1 / 2;
        this.mode = STACKED_DITCH;
        this.endLevel(tileCol);
        this.teamOrient();
      }
    } // end full_ditch


    // deflection applied every loop so how many steps sheep inside tile => amount deflected
    else if (tileType == TILE_BEND_LEFT) {
      this.ang += this.speed * 0.01;
      if (this.enteredNewGridSquare && this.mode == SENT) {
        bendLeftSound.play(0.5);
      }
    }

    else if (tileType == TILE_BEND_RIGHT) {
      this.ang -= this.speed * 0.01;
      if (this.enteredNewGridSquare && this.mode == SENT) {
        bendRightSound.play(0.5);
      }
    }


    else if (tileType == TILE_DISTRACT) {

      if (this.mode != DISTRACTED) {

        if (this.team == BLUE || this.team == RED) {
          this.changeMode(DISTRACTED);

          // if arriving at lake from above
          if (this.ang > 1 / 4 * Math.PI && this.ang < 3 / 4 * Math.PI) {
            var turn = 0;
            this.nextY = nearestRowEdge(this.nextY) - 12;
          }
          if (this.team == BLUE) {
            turn = LEFT;
            this.ang = Math.PI;
            this.nextX -= 4;
          }
          else if (this.team == RED) {
            turn = RIGHT;
            this.ang = 0;
            this.nextX += 4;
          }
          else {
            turn = randomRangeInt(1, 2) == 1 ? LEFT : RIGHT;
            this.ang += turn * Math.PI / 2;
            this.nextX += turn > 0 ? -4 : 4;
          }

          // time distracted grazing tasty waterside veg
          this.timer = DISTRACTED_TIME[currentLevel];

          // move to adjacent column i.e. go around lake
          this.gotoX = this.nextX + turn * TILE_W;
        }
      }
    }


    else if (tileType == TILE_SLOW) {
      if (this.enteredNewGridSquare) {
        slowTileSound.play(0.5);
      }
      // if (this.soundTimer < 1) {
      //   // when called in previousTile check it only played at first entry to Slow tile (or block of Slow tiles)
      //   slowTileSound.play(0.5);
      //   this.soundTimer = 20;
      // }

      if (this.previousTileType != TILE_SLOW) {
        if (this.mode == SENT) {
          this.adjustSpeed /= 6;
        }
        else {
          this.adjustSpeed /= 2;
        }
        // console.log('speed reduce by woods', this.mode);
      }
    }


    else if (tileType == TILE_STUCK) {
      if (agentGrid[tileIndexUnder] != 0) {
        this.ang -= Math.PI;
      }
      else if (this.mode != STUCK) {
        this.changeMode(STUCK);
        this.endLevel(tileCol);
        agentGrid[tileIndexUnder] = this.team;
        this.nextX = nearestColumnCentre(this.nextX);
        this.nextY = nextRowEdge(this.nextY, -1) + TILE_Y_ADJUST * TILE_H;
        makeStuckVFX(this.nextX, this.nextY);
      }
    }


    else if (tileType == TILE_HALT) {
      if (this.mode != HALTED) {
        if (this.mode == SENT) {
          this.nextY = this.y;
        }
        this.changeMode(HALTED);
      }
    }


    else if (this.isTileConveyor(tileType)) {
      if (this.mode != CONVEYOR) {
        this.changeMode(CONVEYOR);

        // try follow angle of carrots line
        // var centreTileY = TILE_H/2 + tileRow*TILE_H;
        // var conveyorY = null;
        // if (this.gotoY < centreTileY) {
        //   conveyorY = TILE_H/2;
        // } else {
        //   conveyorY = -1*TILE_H/2;
        // }
        // this.gotoY = this.nextY + conveyorY;

        if (tileType == TILE_CONVEYOR_UP) {
          this.gotoY = this.nextY - TILE_H;
          this.gotoX = this.nextX;
          this.ang = Math.PI * 3 / 2;
        }
        else if (tileType == TILE_CONVEYOR_DOWN) {
          this.gotoY = this.nextY + TILE_H;
          this.gotoX = this.nextX;
          this.ang = Math.PI * 1 / 2;
        }
        else if (tileType == TILE_CONVEYOR_LEFT) {
          this.gotoX = this.nextX - TILE_W;
          this.gotoY = this.nextY;
          this.ang = Math.PI;
        }
        else if (tileType == TILE_CONVEYOR_RIGHT) {
          this.gotoX = this.nextX + TILE_W;
          this.gotoY = this.nextY;
          this.ang = 0;
          console.log('conveyor', tileType, TILE_NAMES[tileType])
        }
      }
    } // end of entering Conveyor mode

    // else if (tileType == BRIGHT_GRASS) {
    //   this.speed *= 2;
    // }
    else if (tileType == YELLOW_FLOWER) {
      // increase happiness of sheep
    }
    else if (tileType == BLUE_FLOWER) {
    }
    else if (tileType == RED_FLOWER) {
    }

    this.previousTileType = tileType;

    // return {
    //   x: this.nextX,
    //   y: this.nextY
    // };
  } // end of tileHandling


  this.changeMode = function (newMode) {
    // change state, also set direction & speed
    // should not set at start of .move()
    this.previousMode = this.mode;
    // this.gotoX = null; // should goto be forgotten when changing mode?
    // this.gotoY = null;

    if (newMode == CALLED) {
      this.mode = CALLED;
      this.gotoX = player.x;
      this.gotoY = player.y + 24;
      this.speed = tractorSpeed;
    }

    else if (newMode == HELD) {
      this.mode = HELD;
      this.speed = 0;
      this.gotoX = null;
      this.gotoY = null;
      player.sheepIDheld = this.id;
      update_debug_report(); // to display Hold
    }

    else if (newMode == ROAM) {
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

    else if (newMode == LICKED) {
      this.mode = LICKED;
      // this.orient = 0; // normal upright
      this.speed = 0.1;
      this.timer = 40;
    }

    else if (newMode == SHY) {
      this.mode = SHY;
      this.speed = 3.0;
      this.timer = 80;
    }

    else if (newMode == HALTED) {
      this.mode = HALTED;
      haltedSound.play(0.2);
      this.orient = 0; // normal upright
      this.speed = 0;
    }

    else if (newMode == STUCK) {
      this.mode = STUCK;
      this.ang = Math.PI / 2;
      this.teamOrient();
      stuckSound.play(1.0);
      // need endRow, and Stuck is not a scoring result
    }

    else if (newMode == SENT) {
      this.mode = SENT;
      // set once when sent, may change on way
      this.speed = SEND_SPEED[currentLevel];
      this.ang = Math.PI / 2; // straight down

      if (this.team == BLUE) {
        this.orient = Math.PI * 1 / 4;
      }
      else {
        this.orient = Math.PI * 7 / 4;
      }
    }

    else if (newMode == IN_DITCH) {
      this.mode = IN_DITCH;
      this.ang = Math.PI * 1 / 2;
      this.teamOrient();
      this.speed = 0;
      ditchSound.play(1.0);
      this.levelDone = true;
    }

    else if (newMode == PEEPED) {
      this.mode = PEEPED;
      this.ang = Math.PI * 3 / 2;
      let id = this.bopeepid;
      this.speed = bopeepList[id].speed * 0.9;
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
  this.setExpiry = function () {
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
    else if (this.mode == SHY) {
      this.timer = 40;
    }
  }

  this.setSpeed = function () {
    if (this.mode == ROAM) {
      this.speed = ROAM_SPEED[currentLevel];
    }
    if (this.mode == GRAZE) {
      this.speed = GRAZE_SPEED[currentLevel];
    }
  }

  this.isMovedByFacing = function (mode) {
    return mode == ROAM || mode == GRAZE || mode == SENT || mode == PEEPED || mode == LICKED;
  }

  this.isAllowedTopRow = function () {
    return this.mode == CALLED || this.mode == HELD || this.mode == SENT // at release from clamp sheep is in top row
  }

  this.isAllowedBottomRow = function () {
    if (gameState == STATE_GUIDE) {
      console.log('allowed Guide')
      if (this.mode == SENT) {
        return true;
      } else {
        return false;
      }
    }
    else if (plainSheepCanFinish) {
      return true;
    }
    else if (this.team != PLAIN) {
      return (this.mode == SENT || this.mode == IN_DITCH || this.mode == IN_PEN_BLUE || this.mode == IN_PEN_RED || this.mode == ON_ROAD || this.mode == STACKED);
    }
  }

  this.isModeTimed = function () {
    return this.mode == ROAM || this.mode == GRAZE || this.mode == CALLED || this.mode == SENT || this.mode == LICKED || this.mode == SHY || this.mode == DISTRACTED;
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

  this.isTileConveyor = function (tileType) {
    return tileType == TILE_CONVEYOR_UP || tileType == TILE_CONVEYOR_DOWN || tileType == TILE_CONVEYOR_LEFT || tileType == TILE_CONVEYOR_RIGHT
  }

  this.doTileHandling = function() {
    if (this.mode == SENT) {
      return true;
    }
    if (this.mode == CALLED || this.mode == PEEPED || this.mode == SELECTED || this.shyTimer > 0) {
      return false;
    }
    return true;
  }


  this.draw = function () {

    if (this.mode == CALLED) {
      colorCircle(canvasContext, this.x, this.y+5, 23, "rgba(0,0,0,0.7)");
    }

    // tail shows facing by being in opposite direction
    if (this.team == PLAIN) {
      drawBitmapCenteredWithRotation(canvasContext, sheepTailPic, this.x, this.y, this.ang);
    }
    else if (this.team == BLUE) {
      drawBitmapCenteredWithRotation(canvasContext, sheepTailBluePic, this.x, this.y, this.ang);
    }
    else if (this.team == RED) {
      drawBitmapCenteredWithRotation(canvasContext, sheepTailRedPic, this.x, this.y, this.ang);
    }
    // head should be drawn above body
    drawBitmapCenteredWithRotation(canvasContext, sheepNormalPic, this.x, this.y, this.orient);

    if (this.team == BLUE) {
      drawBitmapCenteredWithRotation(canvasContext, sheepKnotBluePic, this.x, this.y, this.orient);
    } else if (this.team == RED) {
      drawBitmapCenteredWithRotation(canvasContext, sheepKnotRedPic, this.x, this.y, this.orient);
    }

    if (this.x > gameCanvas.width - sheepNormalPic.width / 2 - 8) {
      if (this.team == PLAIN) {
        drawBitmapCenteredWithRotation(canvasContext, sheepTailPic, this.x - gameCanvas.width, this.y, this.ang);
      }
      else if (this.team == BLUE) {
        drawBitmapCenteredWithRotation(canvasContext, sheepTailBluePic, this.x - gameCanvas.width, this.y, this.ang);
      }
      else if (this.team == RED) {
        drawBitmapCenteredWithRotation(canvasContext, sheepTailRedPic, this.x - gameCanvas.width, this.y, this.ang);
      }
      drawBitmapCenteredWithRotation(canvasContext, sheepNormalPic, this.x - gameCanvas.width, this.y, this.orient);
    }

    else if (this.x < sheepNormalPic.width / 2 + 8) {
      if (this.team == PLAIN) {
        drawBitmapCenteredWithRotation(canvasContext, sheepTailPic, this.x + gameCanvas.width, this.y, this.ang);
      }
      else if (this.team == BLUE) {
        drawBitmapCenteredWithRotation(canvasContext, sheepTailBluePic, this.x + gameCanvas.width, this.y, this.ang);
      }
      else if (this.team == RED) {
        drawBitmapCenteredWithRotation(canvasContext, sheepTailRedPic, this.x + gameCanvas.width, this.y, this.ang);
      }
      drawBitmapCenteredWithRotation(canvasContext, sheepNormalPic, this.x + gameCanvas.width, this.y, this.orient);
    }

    if (editMode) {
      var facingX = this.x + Math.cos(this.ang) * SHEEP_RADIUS;
      var facingY = this.y + Math.sin(this.ang) * SHEEP_RADIUS;
      colorCircle(canvasContext, facingX, facingY, FACING_RADIUS, "red");

      if (this.levelDone == false) {
        // show Antennae
        colorCircle(canvasContext, this.antennaLeftX, this.antennaLeftY, FACING_RADIUS, "yellow");
        colorCircle(canvasContext, this.antennaRightX, this.antennaRightY, FACING_RADIUS, "limegreen");
      }

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


  this.idLabel = function () {
    var fontSize = 10;
    canvasContext.font = fontSize + "px Verdana";
    var adjust; // ID label obscured when lower left

    if (this.team == null) {
      colorText(canvasContext, this.id, this.x - 8, this.y + 6, "black");
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

  this.timerLabel = function () {
    var facingXoffset = this.x + Math.cos(this.ang + Math.PI / 4) * (SHEEP_RADIUS + 8);
    var facingYoffset = this.y + Math.sin(this.ang + Math.PI / 4) * (SHEEP_RADIUS + 8);
    var fontSize = 7;
    canvasContext.font = fontSize + "px Verdana";
    // colorText(this.timer, this.x, this.y + SHEEP_RADIUS + fontSize, "yellow");
    colorText(canvasContext, this.timer, facingXoffset, facingYoffset, "yellow");
  }

  this.modeLabel = function () {
    var facingXoffset = this.x + Math.cos(this.ang - Math.PI / 4) * (SHEEP_RADIUS + 7);
    var facingYoffset = this.y + Math.sin(this.ang - Math.PI / 4) * (SHEEP_RADIUS + 7);
    var fontSize = 8;
    canvasContext.font = fontSize + "px Verdana";
    // colorText(this.mode, this.x -26, this.y + SHEEP_RADIUS/2, "orange");
    colorText(canvasContext, this.mode, facingXoffset, facingYoffset, "white");
  }

  this.scoreLabel = function () {
    if (this.team != PLAIN) {
      var fontSize = 12;
      canvasContext.textAlign = "center";
      canvasContext.font = fontSize + "px Verdana";
      // draw score below sheep
      colorText(canvasContext, this.score, this.x, this.y + TILE_H - 6, "white");
      // for upper sheep in stack of 2
      // colorText(this.score, this.x, this.y - TILE_H/2 - 5, "white");
      // colorText(this.score, this.x -10, this.y +6, "black");
      // colorText(this.score, this.x -7, this.y - SHEEP_RADIUS - SCORE_GAP, "white");
    }
  } // end of scoreLabel


  this.drawScore = function () {
    var fontSize = 20;
    canvasContext.textAlign = "center";
    canvasContext.font = fontSize + "px Verdana";
    // draw score above sheep
    colorText(canvasContext, this.score, this.x, this.y - TILE_H + 5, "white");
    canvasContext.textAlign = "left";
  } // end of drawScore


  // overlap with changeMode? stacked
  this.endLevel = function (col) {
    this.speed = 0; // usually set by changeMode?
    this.endTime = step[currentLevel];
    this.endCol = col;
    this.levelDone = true;
    this.calculateScore();
    sheepInPlay--;
    update_debug_report();
    // test if level complete
  }

  this.calculateScore = function () {
    var score = 0;
    if (this.team != PLAIN) {

      if (this.mode == IN_DITCH) {
        score = Math.floor(DITCH_SCORE * Math.cbrt(currentLevel));
      }
      else if (this.mode == IN_PEN_BLUE) {
        score = Math.floor(PEN_SCORE * Math.cbrt(currentLevel));
      }
      else if (this.mode == IN_PEN_RED) {
        score = Math.floor(PEN_SCORE * Math.cbrt(currentLevel));
      }

      if (this.isOffside()) {
        score *= 1 - (1 + currentLevel) / 5;
        score = Math.round(score);
      }

      this.score = score;
      levelScore += score;
      return score;
      // console.log(sheepList[i].id, x, team, mode, offSide, done)
    }
  }

  this.isOffside = function () {
    var offside = false;
    // if central tile it scores for both teams (adjust by TILE_W/2)
    var centralAdjust = isOdd(TILE_COLS) ? TILE_W / 2 : 0;
    if (this.team == BLUE && this.x >= gameCanvas.width / 2 + centralAdjust) {
      offside = true;
    }
    else if (this.team == RED && this.x < gameCanvas.width / 2 - centralAdjust) {
      offside = true;
    }
    return offside;
  }

  this.calledArrives = function () {
    this.changeMode(HELD);
    player.sheepIDcalled = null;
    calledArrivalSound.play(0.2);

    // if not already Sorted, change
    if (this.team == PLAIN) {
      var teamSort = this.potentialTeam;
      teamSizeSoFar[teamSort]++;
      this.team = teamSort;
      makeSortingVFX(this.nextX, this.nextY);

      if (teamSort == BLUE) {
        this.color = "#66b3ff"; // pale blue
      }
      else if (teamSort == RED) {
        this.color = "#f38282"; // pale red
      }
    }
    // this.gotoX, deltaX.toFixed(2), deltaY.toFixed(2), normX.toFixed(2), normY.toFixed(2));
    if (gameState == STATE_GUIDE) {
      if (tutorStep == 6) {
        tutorStep = 7;
      }
      else if (tutorStep == 3) {
        tutorStep = 4;
        flashTimer = 20;
        // Not colouring all as it it isn't logical and too sudden
      }
    }
  }


  this.overlapSheep = function (x, y) {
    // uses centre of face, may need a centroid taking account of bodytail (extra size opposite to angle).
    var overlapping = false;
    for (var i = 0; i < FLOCK_SIZE[currentLevel]; i++) {
      if (i == this.id) {
        // don't check self
      } else {
        let distTo = sheepList[i].distFrom(x, y);
        if (distTo < COLLISION_DIST) {
          // console.log('Distance to sheep id', i, 'is', distTo);
          overlapping = true;
        }
      }
    }
    return overlapping;
  } // end overlapSheep


  this.teamOrient = function () {
    if (this.team == BLUE) {
      this.orient = ORIENT_BLUE;
    }
    else if (this.team == RED) {
      this.orient = ORIENT_RED;
    }
    else {
      this.orient = Math.PI; // upside down
    }

  } // end teamOrient


  this.antennaCheck = function () {
    // antennae left & right
    var antennaLeftAngle = this.ang - Math.PI / 4;
    var antennaRightAngle = this.ang + Math.PI / 4;
    this.antennaLeftY = this.nextY + antennaLength * Math.sin(antennaLeftAngle);
    this.antennaLeftX = this.nextX + antennaLength * Math.cos(antennaLeftAngle);
    this.antennaRightX = this.nextX + antennaLength * Math.cos(antennaRightAngle);
    this.antennaRightY = this.nextY + antennaLength * Math.sin(antennaRightAngle);

    // collision with other sheep
    let leftDetect = this.overlapSheep(this.antennaLeftX, this.antennaLeftY);
    let rightDetect = this.overlapSheep(this.antennaRightX, this.antennaRightY);

    if (leftDetect && rightDetect) {
      this.ang += Math.PI; // turn around
    }
    else if (leftDetect) {
      this.ang += Math.PI / 4;
    }
    else if (rightDetect) {
      this.ang -= Math.PI / 4;
    }

    if (leftDetect || rightDetect) {
      this.avoidCollisionTimer = 10;
      this.changeMode(ROAM);
      // console.log(this.ang.toFixed(2), this.antennaLeftX.toFixed(0), this.antennaLeftY.toFixed(0), this.antennaRightX.toFixed(0), this.antennaRightY.toFixed(0));
      // this.nextX.toFixed(0), this.nextY.toFixed(0),
    }
  }

  // occasionally leave a hoof-print if we've travelled far enough
  this.leaveHoofprints = function () {

    if (this.hoofPrintModes()) {
      const mindist = 8;
      const leftrightoffset = 6;
      const alpha = HOOFPRINT_OPACITY;
      const rot = 0;

      if (!this.lastHoofprintPos) this.lastHoofprintPos = { x: -999, y: -999 };

      if ((Math.abs(this.x - this.lastHoofprintPos.x) >= mindist) || (Math.abs(this.y - this.lastHoofprintPos.y) >= mindist)) {
        // console.log("hoofprint!");
        this.lastHoofprintPos.x = this.x;
        this.lastHoofprintPos.y = this.y;
        if (!this.hoofprintCount) this.hoofprintCount = 1; else this.hoofprintCount++;
        decals.add(this.x + (this.hoofprintCount % 2 ? 0 : leftrightoffset), this.y + (this.hoofprintCount % 2 ? 0 : leftrightoffset), rot, alpha, hoofprintPic);
      }
    }
  }

  this.hoofPrintModes = function () {
    return this.mode == ROAM || this.mode == SENT || this.mode == CALLED || this.mode == CONVEYOR || this.mode == DISTRACTED
  }

} // end of sheepClass
