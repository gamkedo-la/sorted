const SHEEP_RADIUS = 16;
const SIDE_MARGIN = SHEEP_RADIUS/2 + 1;
const TOP_MARGIN = 60;
const FACING_RADIUS = 2;
var countSheepPenned = 0;

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

// sheepClass inherits from movingWrapPositionClass
sheepClass.prototype = new movingWrapPositionClass();

function sheepClass() {
  this.x = 50;
  this.y = 50;
  this.speed = 0;
  this.speedX = 0;
  this.ang = Math.PI/2;
  this.orient = 0;
  this.score = 0;
  this.timer = 0;

  this.reset = function(i, team, potential, mode) {
    this.id = i;
    this.team = team;
    this.color = TEAM_COLOURS[team];
    this.potentialTeam = potential;
    this.score = 0;
    this.ang = Math.PI/2;
    this.orient = 0;
    this.state = mode;
    this.speed = 0;
    this.levelDone = false;
    this.setExpiry(mode);
  }

  this.testRowInit = function() {
    this.speed = 15;
  }

  this.placeTop = function() {
    this.x = TILE_W/2 + this.id * TILE_W;
    this.y = TILE_H * 3/2 -15;
  }

  this.testColumnInit = function() {
    this.speed = 3 + this.id * 3;
  }

  this.placeColumn = function(col) {
    this.x = TILE_W/2 + col * TILE_W;
    this.y = TILE_H * 3/2 -15;
  }

  this.placeRandom = function(depth) {
    this.x = randomRangeInt(0 + SIDE_MARGIN, canvas.width - SIDE_MARGIN -2);
    this.y = randomRangeInt(TOP_MARGIN+10, depth);
  }

  this.superclassMove = this.move; 
  // saving a reference to parent class's move function
  
  this.move = function() {
    if(this.levelDone) {
      //no action
    }
    else if(this.state == HELD) {
      this.x = player.x;
    }

    else if (this.state == CALLED) {
      nextY = this.y - TRACTOR_SPEED;

      if(nextY < player.y +20) { // arriving at Hat
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
      // sheep released by Hat
    }

    else if(this.state == GRAZE) {
      if(randomRangeInt(1,30) == 1) {
        this.ang += randomRange(-Math.PI/4, Math.PI/4)
      }
    }

    else if(this.state == ROAM) {
      if(randomRangeInt(1,90) == 1) {
        this.ang += randomRange(-Math.PI/4, Math.PI/4)
      }
    }

    if(this.isMovedBySpeed(this.state)) {
      nextX = this.x + this.speed * Math.cos(this.ang);
      nextY = this.y + this.speed * Math.sin(this.ang); 
    }

    this.tileHandling(nextX, nextY);

    // if(this.stateIsOnGoal() == false) {
    //   if(this.collisionDetect() == true) {
    //     this.agentHandling();
    //   } else {
    //     this.tileHandling();
    //   }
    // }
    this.x = nextX;
    this.y = nextY;
    this.superclassMove();

    testIfLevelEnd();

    this.timer--;
    if(this.timer < 1) {
      this.changeMode();
    }
  }

  // change mode, set direction & speed, restart timer to expire mode 
  this.changeMode = function() {
    if(this.state == GRAZE) {
      this.state = ROAM;
      this.speed = ROAM_SPEED[currentLevel];
    }
    else if(this.state == ROAM) {
      this.state= GRAZE;
      this.speed = GRAZE_SPEED[currentLevel];
    }
    this.setExpiry();
  } 

  this.setExpiry = function() {
    if(this.state == ROAM) {
      this.timer = randomRangeInt(ROAM_TIME_MIN[currentLevel], ROAM_TIME_MAX[currentLevel]);
    }
    if(this.state == GRAZE) {
      this.timer = randomRangeInt(GRAZE_TIME_MIN[currentLevel], GRAZE_TIME_MAX[currentLevel]);
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
      // this.y = canvas.height - TILE_H * 5/2;
      this.y = ((row-1) * TILE_H) + (TILE_H/2);
      console.log("retreat to Y=", this.y);
      this.speed = 0;
      this.levelDone = true;
      agentGrid[agentIndex - TILE_COLS] = 1;
      // console.log("agentHandling sheep " + this.id + " row " + row)
    }
  }

  this.tileHandling = function(x,y) {
    var tileCol = Math.floor(x / TILE_W);
    var tileRow = Math.floor(y / TILE_H);
    var tileIndexUnder = colRowToIndex(tileCol, tileRow);

    if(tileCol >= 0 && tileCol < TILE_COLS &&
      tileRow >= 0 && tileRow < TILE_ROWS) {

      var tileType = getTileTypeAtColRow(tileCol,tileRow);

      // only when first entering pen tile
      if( this.stateIsOnGoal() == false && this.onTileGoal(tileType) ) {

        if(tileType == TILE_PEN_BLUE) {
          console.log("Sheep ID", this.id, "reached the blue pen.");
          this.gotoCentreOfTile(304);
          this.state = IN_BLUE_PEN;
          countBluePen++;
          countSheepPenned++;
        } else if(tileType == TILE_PEN_RED) {
          this.state = IN_RED_PEN;
          console.log("Sheep ID", this.id, "reached the red pen.");
          this.gotoCentreOfTile(306);
          countRedPen++;
          countSheepPenned++;
        } else if(tileType == TILE_GOAL) {
          this.state = ON_ROAD;
          this.gotoCentreOfTile(305);
          console.log("Sheep ID", this.id, "is between pens.");
        }  
        this.speed = 0;
        this.levelDone = true;
        agentGrid[tileIndexUnder] = 1;
        // this.y += HOP_IN_PEN ; // move into pen
        update_debug_report();
        // test if level complete
      } else {
        // terrain handling

        // deflection size governed by how many steps inside tile
        if(tileType == TILE_GO_LEFT) {  
          this.ang += 0.1;
        } else if(tileType == TILE_GO_RIGHT) {
          this.ang -= 0.1;

        } else if(tileType == TILE_HALT) {
          // if anti-stuck code needed below is also needed here
          this.state = GRAZE;
          this.speed = 0;

        } else if(tileType == TILE_ROAM) {
          // if anti-stuck code needed below is also needed here
          this.state = ROAM;

        } else if(tileType == TILE_ROAD) {
          // if anti-stuck code needed below is also needed here
          this.state = FENCED;
          //this.y = canvas.height - TILE_H - SHEEP_RADIUS/2;
          this.y = canvas.height - TILE_H * 3/2;
          this.speed = 0;
          this.levelDone = true;
          agentGrid[tileIndexUnder - TILE_COLS] = OCCUPIED;
          testIfLevelEnd();

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
 
  this.gotoCentreOfTile = function(tileIndex) {

    this.y = canvas.height - TILE_H / 2;
  }

  this.draw = function() {
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

      this.timerLabel();
    }
  }

  this.label = function() {
    if(this.team != PLAIN) {
      var fontSize = 12;
      canvasContext.font = fontSize + "px Verdana";
      // colorText(this.id, this.x, this.y + SHEEP_RADIUS + fontSize, "white");
      colorText(this.id, this.x-8, this.y+6, "black");
    }
  }
  this.timerLabel = function() {
    if(this.team != PLAIN) {
      var fontSize = 12;
      canvasContext.font = fontSize + "px Verdana";
      colorText(this.timer, this.x, this.y + SHEEP_RADIUS + fontSize, "white");
    }
  }

  this.scoreLabel = function() {
    if(this.team != PLAIN) {
      var fontSize = 12;
      canvasContext.font = fontSize + "px Verdana";
      // draw score in centre of sheep
      colorText(this.score, this.x -10, this.y+6, "black");
      // colorText(this.score, this.x -7, this.y - SHEEP_RADIUS - SCORE_GAP, "white");
    }
  }
}

