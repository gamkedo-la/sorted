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
}