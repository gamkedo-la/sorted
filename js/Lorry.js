const ROAD_SCROLL_SPEED = 2;
var timeRoadScroll = TILE_H / ROAD_SCROLL_SPEED;
var timeTravelBetweenPens = 19;

var boardLorryY = 45; // downward on to road
var boardLorryX = 50; // sideways into lorry
var sheepBoardingSpeed = 5;
var timeBoardY = boardLorryY / sheepBoardingSpeed;
var timeBoardX = boardLorryX / sheepBoardingSpeed;
var timeLoadSheep = 10; // between sheep on and lorry move

var lorrySpeed = 8;

// not in use
var happeningAt = 0;

lorryList = [];

lorryClass.prototype = new movingClass();

function lorryClass() {
  this.init = function (id, whichPic, x, direction) {
    this.id = id;
    this.pic = whichPic;
    this.x = x;
    this.y = gameCanvas.height + TILE_H / 2;
    this.ang = 0;
    this.speedX = 0;
    this.ramp = true;
    this.direction = direction;
  }

  this.reset = function () {
  }

  this.move = function () {
    var nextX = this.x; // previous location
    // var distanceToCentre = Math.abs(gameCanvas.width/2 - nextX);
    // if (distanceToCentre < this.pic.width/2 + 20) {
    //   console.log(this.pic.width)
    //   this.speedX *= -1;
    // }
    nextX += this.speedX;
    this.x = nextX;
  }

  this.draw = function () {
    drawBitmapCenteredWithRotation(canvasContext, this.pic, this.x, this.y, this.ang);
  }

  this.drawRamp = function () {
    if (this.ramp == true) {
      if (this.direction == 1) {
        drawBitmapScaled(canvasContext, tailRampPic, this.x - 50, this.y, Math.PI, 25, 36);
        // drawBitmapCenteredWithRotation(canvasContext, tailRampPic, this.x - 50, this.y, Math.PI);
      } else {
        drawBitmapScaled(canvasContext, tailRampPic, this.x + 50, this.y+4, 0, 25, 36);
        // drawBitmapCenteredWithRotation(canvasContext, tailRampPic, this.x + 50, this.y, 0);
      }
    }
  }
}