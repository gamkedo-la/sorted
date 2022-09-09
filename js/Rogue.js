const ROGUE_UNSORT_RANGE = 40;
const ROGUE_WOOF_RANGE = 80;

var dog = new rogueClass();

function rogueClass() {
  this.init = function(whichPic) {
    this.pic = whichPic;
    this.reset();
  }

  this.reset = function() {
    this.x = randomRangeInt(20 + SIDE_MARGIN, gameCanvas.width - SIDE_MARGIN -18);
    this.y = 425;
    this.ang = 0;
    this.speedX = ROGUE_SPEED[currentLevel];
    this.speedY = 0;
    this.barkTimer = 0;
  }

  this.move = function() {
    var nextX = this.x; // previous location
    var nextY = this.y;

    // detect sheep
    var nearestSheep = this.findNearestSheep(this.x, this.y, sheepList);

    // is close enough to smell a sheep
    if(this.isRogueClose(nearestSheep, ROGUE_WOOF_RANGE)) {
      // console.log("Rogue smells sheep id =", nearestSheep.id);
      if(this.barkTimer < 1) {
        rogueSound.play();
        this.barkTimer = 40;
      }

    }

    // is close enough to unsort
    if(this.isRogueClose(nearestSheep, ROGUE_UNSORT_RANGE)) {
      if(nearestSheep.team != PLAIN) {
        console.log("Unsort sheep id =", nearestSheep.id);
        nearestSheep.team = PLAIN;
        nearestSheep.color = TEAM_COLOURS[PLAIN];
      }
    }

    // screenwrap horizontal
    if(nextX < 0) {
      nextX += gameCanvas.width;
      // this.ang += Math.PI;
    } else if(nextX >= gameCanvas.width) {
      nextX -= gameCanvas.width;
      // this.ang += Math.PI;
    }

    nextX += this.speedX;
    nextY += this.speedY;

    // collision handling

    // tileHandling

    this.x = nextX;
    this.y = nextY;
  }

  this.draw = function() {
    // colorCircle(this.x, this.y, 30, "yellow");
    drawBitmapCenteredWithRotation(this.pic, this.x,this.y, this.ang);
  }

  this.findNearestSheep = function(x,y) {
    var nearestSheepDist = 999;
    for(var i=0; i<FLOCK_SIZE[currentLevel]; i++) {
      let distTo = sheepList[i].distFrom(x,y);
      if(distTo < nearestSheepDist) {
        nearestSheepDist = distTo;
        nearestSheep = sheepList[i];
      }
    }
    // console.log("Rogue found nearest sheep id =", nearestSheep.id)
    return nearestSheep;
  }

  this.isRogueClose = function(nearestSheep, range) {
    if(nearestSheep.distFrom(this.x, this.y) < range) {
      return true;
    } else {
      return false;
    }
  }

} // end of rogue class