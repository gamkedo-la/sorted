var dog = new rogueClass();

function rogueClass() {

  this.init = function() {
    this.reset();
  }

  this.reset = function() {
    this.x = randomRangeInt(0 + SIDE_MARGIN, canvas.width - SIDE_MARGIN -2);
    this.y = 500;
    this.ang = Math.PI/2;
    this.speedX = 5;
    this.speedY = 0;
  }

  this.move = function() {
    if(this.x < 0) { // if rogue has moved beyond the left edge
      this.speedX *= -1; // reverse rogue's horizontal direction
    }
    
    if(this.x > canvas.width) { // if rogue has moved beyond the right edge
      this.speedX *= -1; // reverse rogue's horizontal direction
    }
  
    this.x += this.speedX;
    this.y += this.speedY;
  }

  this.draw = function() {
    colorCircle(this.x, this.y, 30, "yellow");
  }

} // end of rogue class