function movingWrapPositionClass() {

  // sidewrap and top-bounce
  this.handleScreenWrap = function() {
    if(this.x < 20) {
      // this.x += canvas.width;
      this.ang += Math.PI;
    } else if(this.x >= canvas.width - 20) {
      // this.x -= canvas.width;
      this.ang += Math.PI;
    }
    if(this.y < 50) {
      this.ang += Math.PI;
    }
    if(this.y > 540) {
      this.ang += Math.PI;
    }
  }
  
  this.move = function() {
    this.handleScreenWrap();
  }
  
} // end of class