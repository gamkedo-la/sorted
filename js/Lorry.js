const ROAD_SCROLL_SPEED = 2;
var timeRoadScroll = TILE_H / ROAD_SCROLL_SPEED;

var lorrySpeed = 8;
lorryList = [];

lorryClass.prototype = new movingClass();

function lorryClass() {
  this.init = function (id, whichPic, x, direction) {
    this.pic = whichPic;
    this.x = x;
    this.y = gameCanvas.height + TILE_H/2;
    this.ang = 0;
    this.speedX = 0;
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
}