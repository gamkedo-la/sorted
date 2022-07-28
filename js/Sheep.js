const SHEEP_RADIUS = 12;
const SIDE_MARGIN = SHEEP_RADIUS/2 + 1;
const TOP_MARGIN = 60;
var countSheepPenned = 0;
var teamSizeSoFar = [0,0,0];

const SHEEP_DROP_SPEED = 10;
const HOP_IN_PEN = 14;

// sheep states
const GRAZING = 0;
const WALKING = 1;
const TRACTOR = 2;
const HELD = 3;
const DROPPED = 4;
const IN_BLUE_PEN = 5;
const IN_RED_PEN = 6;

function sheepClass() {
  this.x = 50;
  this.y = 50;
  this.speed = 0;
  this.speedX = 0;

  this.init = function(i) {
    this.id = i;
    this.team = 0;
    this.color = "#f4f4f4"; 
    this.reset();
  }

  this.reset = function(i) {
    // temp one sheep id0 held at start
    this.state = GRAZING;
    this.inPen = false;
    this.held = false;
    this.tractor = false;
    this.x = randomRangeInt(0 + SIDE_MARGIN, canvas.width - SIDE_MARGIN -2);
    this.y = randomRangeInt(TOP_MARGIN, parseInt(canvas.height / 4.2));
    this.ang = Math.PI/2;
    this.speed = 0;
  }

  this.move = function() {
    if(this.state == HELD) {
      this.x = player.x;
    }
    else if (this.state == TRACTOR) {
      nextY = this.y - TRACTOR_SPEED;

      if(nextY < player.y +20) { // arriving at Hat
        nextY = player.y +20;
        this.state = HELD;
        this.held = true;
        this.speed = 0;
        player.sheepIDheld = this.id;
        update_debug_report(); // to display Hold

        // Sorting
        var teamSort; // 0=normal, 1=blue, 2=red
        // if already Sorted, don't change
        if(this.team == 0) {
          // if equal-sized teams and one is full, no choice
          if(teamSizeSoFar[1] >= TEAM_SIZE[currentLevel]) {
            teamSort = 2;
          }
          else if(teamSizeSoFar[2] >= TEAM_SIZE[currentLevel]) {
            teamSort = 1;
          }
          // otherwise random
          teamSort = randomRangeInt(1, 2);
          teamSizeSoFar[teamSort]++;
          this.team = teamSort;
          if (teamSort == 1) {
            this.color = "#66b3ff"; // pale blue
            // this.img = blueSheepPic;
          } else if (teamSort == 2) {
            this.color = "#f38282"; // pale red
            // this.img = redSheepPic;
          }
        } 
      } 
      this.y = nextY;
    }
    else if(this.state == DROPPED)
    { // sheep released by Hat
      this.x += this.speed * Math.cos(this.ang);
      this.y += this.speed * Math.sin(this.ang);
      if(this.inPen == false) {
        this.tileHandling();
      }
    }
  }

  this.draw = function() {
    colorCircle(this.x, this.y, SHEEP_RADIUS, this.color)
  }
  this.label = function() {
    var fontSize = 12;
    canvasContext.font = fontSize + "px Verdana";
    colorText(this.id, this.x, this.y + SHEEP_RADIUS + fontSize, "white");
  }

  this.tileHandling = function() {
    var tileCol = Math.floor(this.x / TILE_W);
    var tileRow = Math.floor(this.y / TILE_H);
    var tileIndexUnder = rowColToArrayIndex(tileCol, tileRow);

    if(tileCol >= 0 && tileCol < TILE_COLS &&
      tileRow >= 0 && tileRow < TILE_ROWS) {

      var tileType = getTileTypeAtColRow(tileCol,tileRow);

      // only when entering pen tile
      if( (this.state != IN_BLUE_PEN && this.state != IN_RED_PEN) && (tileType == TILE_GOAL || tileType == TILE_PEN_BLUE || tileType == TILE_PEN_RED) ) {

        if(tileType == TILE_PEN_BLUE) {
          console.log("Sheep ID", this.id, "reached the blue pen.");
          this.state = IN_BLUE_PEN;
          countBluePen++;
          countSheepPenned++;
        } else if(tileType == TILE_PEN_RED) {
          this.state = IN_RED_PEN;
          console.log("Sheep ID", this.id, "reached the red pen.");
          countRedPen++;
          countSheepPenned++;
        } else if(tileType == TILE_GOAL) {
          console.log("Sheep ID", this.id, "avoided both pens.");
        }  
        this.speed = 0;
        this.y += HOP_IN_PEN ; // move into pen
        update_debug_report();
      } else {
        // terrain handling

        // deflection size governed by how many steps inside tile
        if(tileType == TILE_GO_LEFT) {  
          this.ang += 0.1;
        } else if(tileType == TILE_GO_RIGHT) {
          this.ang -= 0.1;

        } else if(tileType == TILE_HALT) {
          // if anti-stuck code needed below is also needed here
          this.speed = 0;

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
}
