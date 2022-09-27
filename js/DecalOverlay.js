// Decal Overlay by McFunkypants
// an overlay canvas that can be drawn onto
// for large numbers of flowers, scorchmarks, tire tracks, bulletholes, footprints, etc

// is renders mega fast - in a single draw call - should never affect fps

// how to use:
// var decals = new decalOverlay(); // only run this once
// decals.add(image,x,y,rot,alpha); // run as often as needed
// decals.draw(); // run this every frame
// decals.clear(); // if we need to erase everything

var decalOverlay = function() {

    //console.log("decalOverlay canvas initializing");

    var decalCount = 0;
    var decalCanvas = document.createElement("canvas");
    var decalContext = decalCanvas.getContext("2d");

    this.add = function(x,y,rot=0,alpha=0.025,spritePic) {
        if (!spritePic) return;
        decalCount++;
        // snap coords - less blurry this way
        x = Math.round(x);
        y = Math.round(y);
        decalContext.globalAlpha = alpha;
        decalContext.drawImage(spritePic,x,y);
	};

  this.draw = function() {
    canvasContext.drawImage(decalCanvas, 0, 0);
	};

	this.resize = function() {
        decalCanvas.width = gameCanvas.width;
        decalCanvas.height = gameCanvas.height;
        //console.log("decalCanvas size: "+decalCanvas.width+"x"+decalCanvas.height);
	};

	this.clear = function() {
        this.resize();
        decalContext.clearRect(0, 0, decalCanvas.width, decalCanvas.height);
	};

    this.scatterDecorations = function(howMany=150, spritePic, bottomMargin) {
        //console.log("Scattering decoration decals");
        if (!spritePic) return;
        if (!bottomMargin) bottomMargin = 0; //avoid null
        var x,y;
        for (var i=0; i<howMany; i++) {
            x = randomInteger(0,decalCanvas.width);
            y = randomInteger(0,decalCanvas.height-bottomMargin);
            this.add(x,y,0,1,spritePic);
        }
    }

    this.scatterDecorationsInRadius = function(x,y,radius,howMany,spritePic) {
        for (var sx,sy,angle,rot,rad,i=0; i<howMany; i++) {
            // choose a random location inside a circle:
            angle = Math.random()*Math.PI*2;
            rad = Math.random()*radius;
            sx = Math.cos(angle)*rad;
            sy = Math.sin(angle)*rad;
            // orient the sprite randomly too
            rot = Math.random()*Math.PI*2;
            this.add(x+sx,y+sy,rot,1,spritePic);
        }
    }


    this.resize(); // ensure we start the same size as game canvas
};

// handy function - can include min and max
function randomInteger(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setupDecals() {
  decals = new decalOverlay(); // grass, flowers, footprints, pebbles, etc
  
  // randomly scatter everything evenly
  decals.scatterDecorations(150, flower1Pic, bottomRowHeight);
  decals.scatterDecorations(150, flower2Pic, bottomRowHeight);
  decals.scatterDecorations(150, flower3Pic, bottomRowHeight);
  decals.scatterDecorations(150, grass1Pic, bottomRowHeight);
  decals.scatterDecorations(150, grass2Pic, bottomRowHeight);
  decals.scatterDecorations(150, grass3Pic, bottomRowHeight);

  // now add three big clusters of flowers for visual appeal
  let blobsize = 75; // max radius
  let clustercount = 150; // how many
  // grass clusters
  decals.scatterDecorationsInRadius(Math.random()*(gameCanvas.width),Math.random()*(gameCanvas.height-bottomRowHeight),blobsize,clustercount,grass1Pic);
  decals.scatterDecorationsInRadius(Math.random()*(gameCanvas.width),Math.random()*(gameCanvas.height-bottomRowHeight),blobsize,clustercount,grass2Pic);
  decals.scatterDecorationsInRadius(Math.random()*(gameCanvas.width),Math.random()*(gameCanvas.height-bottomRowHeight),blobsize,clustercount,grass3Pic);
  // flower clusters
  decals.scatterDecorationsInRadius(Math.random()*(gameCanvas.width),Math.random()*(gameCanvas.height-bottomRowHeight),blobsize,clustercount,flower1Pic);
  decals.scatterDecorationsInRadius(Math.random()*(gameCanvas.width),Math.random()*(gameCanvas.height-bottomRowHeight),blobsize,clustercount,flower2Pic);
  decals.scatterDecorationsInRadius(Math.random()*(gameCanvas.width),Math.random()*(gameCanvas.height-bottomRowHeight),blobsize,clustercount,flower3Pic);

  /*
  // alternate: don't overlap edges of screen
  // grass clusters
  decals.scatterDecorationsInRadius(blobsize+Math.random()*(gameCanvas.width-blobsize*2),blobsize+Math.random()*(gameCanvas.height-bottomRowHeight-blobsize*2),blobsize,clustercount,grass1Pic);
  decals.scatterDecorationsInRadius(blobsize+Math.random()*(gameCanvas.width-blobsize*2),blobsize+Math.random()*(gameCanvas.height-bottomRowHeight-blobsize*2),blobsize,clustercount,grass2Pic);
  decals.scatterDecorationsInRadius(blobsize+Math.random()*(gameCanvas.width-blobsize*2),blobsize+Math.random()*(gameCanvas.height-bottomRowHeight-blobsize*2),blobsize,clustercount,grass3Pic);
  // flower clusters
  decals.scatterDecorationsInRadius(blobsize+Math.random()*(gameCanvas.width-blobsize*2),blobsize+Math.random()*(gameCanvas.height-bottomRowHeight-blobsize*2),blobsize,clustercount,flower1Pic);
  decals.scatterDecorationsInRadius(blobsize+Math.random()*(gameCanvas.width-blobsize*2),blobsize+Math.random()*(gameCanvas.height-bottomRowHeight-blobsize*2),blobsize,clustercount,flower2Pic);
  decals.scatterDecorationsInRadius(blobsize+Math.random()*(gameCanvas.width-blobsize*2),blobsize+Math.random()*(gameCanvas.height-bottomRowHeight-blobsize*2),blobsize,clustercount,flower3Pic);
  */

}