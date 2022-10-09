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
  
  this.overlap = function(x,y) {
    var overlapping = false;
    for(var i=0; i<sheepList.length; i++) {
      if (i == this.id) {
        // don't sheck self
      } else {
        let distTo = sheepList[i].distFrom(x,y);
        if (distTo < COLLISION_DIST) {
          // console.log('Distance to sheep id', i, 'is', distTo);
          overlapping = true;
        }
      }
    }
    return overlapping;
  } // end overlapSheep
}