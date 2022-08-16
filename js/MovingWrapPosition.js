function movingWrapPositionClass() {

  // sidewrap only
  this.handleScreenWrap = function() {
    if(this.x < 0) {
      this.x += canvas.width;
    } else if(this.x >= canvas.width) {
      this.x -= canvas.width;
    }
    if(this.y < 40) {
      this.ang += Math.PI;
    }
  }
  
  this.move = function() {
    this.handleScreenWrap();
  }
  
} // end of class