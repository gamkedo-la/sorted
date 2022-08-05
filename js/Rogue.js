var dog = new rogueClass();

function rogueClass() {

  this.init = function(whichPic) {
    this.pic = whichPic;
    this.reset();
  }

  this.reset = function() {
    this.x = randomRangeInt(20 + SIDE_MARGIN, canvas.width - SIDE_MARGIN -18);
    this.y = 425;
    this.ang = 0;
    this.speedX = 5;
    this.speedY = 0;
  }

  this.move = function() {
    // or wrap?
    if(this.x < 0 + TILE_W/2) { // if rogue has moved beyond the left edge
      this.speedX *= -1; // reverse rogue's horizontal direction
    }
    if(this.x > canvas.width - TILE_W/2 +2) { // if rogue has moved beyond the right edge
      this.speedX *= -1; // reverse rogue's horizontal direction
    }
    this.x += this.speedX;
    this.y += this.speedY;
  }

  this.draw = function() {
    // colorCircle(this.x, this.y, 30, "yellow");
    drawBitmapCenteredWithRotation(this.pic, this.x,this.y, this.ang);
  }

} // end of rogue class