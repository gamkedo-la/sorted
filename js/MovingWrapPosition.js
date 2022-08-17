function movingWrapPositionClass() {

  // sidewrap and top-bounce
  this.handleScreenWrap = function() {
    if(this.x < 0) {
      this.x += canvas.width;
      // this.ang += Math.PI;
    } else if(this.x >= canvas.width) {
      this.x -= canvas.width;
      // this.ang += Math.PI;
    }
    if(this.y < 50) {
      if(this.state != CALLED) {
        this.ang = 2*Math.PI - this.ang;
      }
    }
    if(this.y > 540) {
      if(this.state != SENT) {
        this.ang = 2*Math.PI - this.ang;
      }
    }
  }
  
  this.move = function() {
    this.handleScreenWrap();
  }
  
} // end of class