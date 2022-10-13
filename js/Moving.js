function movingClass() {

  this.distFrom = function(otherX, otherY) {
    var deltaX = otherX-this.x;
    var deltaY = otherY-this.y;
    return Math.sqrt(deltaX*deltaX + deltaY*deltaY);
  }

  this.distXFrom = function(otherX) {
    return otherX - this.x;
  }
  this.distYFrom = function(otherY) {
    return otherY - this.y;
  }

  this.overlapOtherList = function(x, y, list, range) {
    var overlapID = null;
    for(var i=0; i < list.length; i++) {
      let distTo = list[i].distFrom(x,y);
      if (distTo < range) {
        // console.log('Distance to id', i, 'is', distTo);
        overlapID = i;
      }
    }
    return overlapping;
  } // end overlapOtherList


  this.antennaCheck = function() {
    // antennae left & right
    var antennaLeftAngle = this.ang - Math.PI / 4;
    var antennaRightAngle = this.ang + Math.PI / 4;
    this.antennaLeftY = this.nextY + antennaLength * Math.sin(antennaLeftAngle);
    this.antennaLeftX = this.nextX + antennaLength * Math.cos(antennaLeftAngle);
    this.antennaRightX = this.nextX + antennaLength * Math.cos(antennaRightAngle);
    this.antennaRightY = this.nextY + antennaLength * Math.sin(antennaRightAngle);

    // collision with other sheep
    let leftDetect = this.overlapSheep(this.antennaLeftX, this.antennaLeftY);
    let rightDetect = this.overlapSheep(this.antennaRightX, this.antennaRightY);

    if (leftDetect && rightDetect) {
      this.ang += Math.PI; // turn around
    }
    else if (leftDetect) {
      this.ang += Math.PI / 4;
    }
    else if (rightDetect) {
      this.ang -= Math.PI / 4;
    }

    if (leftDetect || rightDetect) {
      this.avoidCollisionTimer = 10;
      this.changeMode(ROAM);
      console.log(this.ang.toFixed(2), this.antennaLeftX.toFixed(0), this.antennaLeftY.toFixed(0), this.antennaRightX.toFixed(0), this.antennaRightY.toFixed(0));
      // this.nextX.toFixed(0), this.nextY.toFixed(0),
    }
  }

  this.drawAntennae = function(radius) {
    if (editMode) {
      var facingX = this.x + Math.cos(this.ang) * radius;
      var facingY = this.y + Math.sin(this.ang) * radius;
      colorCircle(canvasContext, facingX, facingY, FACING_RADIUS, "red");

      colorCircle(canvasContext, this.antennaLeftX, this.antennaLeftY, FACING_RADIUS, "yellow");
      colorCircle(canvasContext, this.antennaRightX, this.antennaRightY, FACING_RADIUS, "limegreen");

      // console.log('antenna via Moving class')
    }
  }
}