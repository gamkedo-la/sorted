// Decal Overlay by McFunkypants
// an overlay canvas that can be drawn onto
// for large numbers of flowers, scorchmarks, tire tracks, bulletholes, footprints, etc

// renders mega fast - in a single draw call - should never affect fps

// how to use:
// var decals = new decalOverlay(); // only run this once
// decals.add(image,x,y,rot,alpha); // run as often as needed
// decals.draw(); // run this every frame
// decals.clear(); // if we need to erase everything

var clumpRandom = true;
var levelClumpXY = Array(NUM_LEVELS);

function initFlowerClumps() {
  // initial values for clump XY on each level
  for(var i=0; i<NUM_LEVELS; i++) {
    let xv = i*80;
    let yv = i*60;
    let clumpXY = Array(4);
    clumpXY.fill( {x: xv, y: yv} );
    levelClumpXY[i] = clumpXY;
  }
}


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

  this.scatterDecorations = function(howMany=50, spritePic, bottomMargin, alpha) {
    //console.log("Scattering decoration decals");
    if (!spritePic) return;
    if (!bottomMargin) bottomMargin = 0; //avoid null
    var x,y;
    for (var i=0; i<howMany; i++) {
        x = randomInteger(0,decalCanvas.width);
        y = randomInteger(0,decalCanvas.height-bottomMargin);
        this.add(x,y,0,alpha,spritePic);
    }
  }

  this.scatterDecorationsInRadius = function(x,y,radius,howMany,spritePic,alpha) {
    for (var sx,sy,angle,rot,rad,i=0; i<howMany; i++) {
      // choose a random location inside a circle:
      angle = Math.random()*Math.PI*2;
      rad = Math.random()*radius;
      sx = Math.cos(angle)*rad;
      sy = Math.sin(angle)*rad;
      // orient the sprite randomly too
      rot = Math.random()*Math.PI*2;
      this.add(x+sx,y+sy,rot,alpha,spritePic);
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


function setupDecals(bottomMargin) {

  decals = new decalOverlay(); // grass, flowers, footprints, pebbles, etc
  console.log('decal setup level', currentLevel, 'gameState', gameStateDescr[gameState]);

  // randomly scatter everything evenly
  decals.scatterDecorations(30, flowerYellowPic, bottomMargin, 0.7);
  decals.scatterDecorations(120, flowerBluePic, bottomMargin, 0.9);
  decals.scatterDecorations(90, flowerRedPic, bottomMargin, 0.9);
  decals.scatterDecorations(150, grass1Pic, bottomMargin, 1.0);
  decals.scatterDecorations(150, grass2Pic, bottomMargin, 1.0);
  decals.scatterDecorations(50, grass3Pic, bottomMargin, 0.8);

  // now add big clusters of flowers and grass for visual appeal
  let blobsize = 75; // max radius
  let clustercount = 70; // how many

  // grass clusters
  decals.scatterDecorationsInRadius(Math.random()*(gameCanvas.width),Math.random()*(gameCanvas.height-bottomMargin),blobsize*2,clustercount,grass1Pic, 1,0);

  decals.scatterDecorationsInRadius(Math.random()*(gameCanvas.width),Math.random()*(gameCanvas.height-bottomMargin),blobsize*2,clustercount,grass2Pic, 1.0);

  console.log('setupDecals clumpRandom is', clumpRandom);
  if (clumpRandom) { // original behaviour

    var alphaMin, alphaMax, decalPic, maxClumps;
    // could be random loop 0-2 instances for each type of flower clump

    for (var i=0; i < randomInteger(0,maxClumps); i++) {
      let alpha = randomInteger(6,8)*0.1;
      decals.scatterDecorationsInRadius(Math.random()*(gameCanvas.width),Math.random()*(gameCanvas.height-bottomMargin),blobsize,clustercount/2,grass3Pic, alpha);
    }

    // flower clusters
    for (var i=0; i < randomInteger(0,2); i++) {
      let alpha = randomInteger(5,7)*0.1;
      decals.scatterDecorationsInRadius(Math.random()*(gameCanvas.width),Math.random()*(gameCanvas.height-bottomMargin),blobsize,clustercount,flowerYellowPic, alpha);
    }

    for (var i=0; i < randomInteger(0,2); i++) {
      let alpha = randomInteger(6,8)*0.1;
      decals.scatterDecorationsInRadius(Math.random()*(gameCanvas.width),Math.random()*(gameCanvas.height-bottomMargin),blobsize,clustercount,flowerBluePic, alpha);
    }

    for (var i=0; i < randomInteger(0,2); i++) {
      let alpha = randomInteger(7,9)*0.1;
      decals.scatterDecorationsInRadius(Math.random()*(gameCanvas.width),Math.random()*(gameCanvas.height-bottomMargin),blobsize,clustercount,flowerRedPic, alpha);
    }
  }

  else { // position from areaGrid
    let blobsize = 40; // max radius
    let clustercount = 100; // how many

    let clumpXY = levelClumpXY[currentLevel];
    console.log(clumpXY);

    decals.scatterDecorationsInRadius(clumpXY[3].x, clumpXY[3].y, blobsize,clustercount/2, grass3Pic);

    decals.scatterDecorationsInRadius(clumpXY[0].x, clumpXY[0].y, blobsize,clustercount,flowerYellowPic);

    decals.scatterDecorationsInRadius(clumpXY[1].x, clumpXY[1].y,blobsize,clustercount,flowerBluePic);

    decals.scatterDecorationsInRadius(clumpXY[2].x, clumpXY[2].y,blobsize,clustercount,flowerRedPic);
  }

  /* alternate: don't overlap edges of screen
  // grass clusters
  decals.scatterDecorationsInRadius(blobsize+Math.random()*(gameCanvas.width-blobsize*2),blobsize+Math.random()*(gameCanvas.height-bottomMargin-blobsize*2),blobsize,clustercount,grass1Pic);
  decals.scatterDecorationsInRadius(blobsize+Math.random()*(gameCanvas.width-blobsize*2),blobsize+Math.random()*(gameCanvas.height-bottomMargin-blobsize*2),blobsize,clustercount,grass2Pic);
  decals.scatterDecorationsInRadius(blobsize+Math.random()*(gameCanvas.width-blobsize*2),blobsize+Math.random()*(gameCanvas.height-bottomMargin-blobsize*2),blobsize,clustercount,grass3Pic);
  // flower clusters
  decals.scatterDecorationsInRadius(blobsize+Math.random()*(gameCanvas.width-blobsize*2),blobsize+Math.random()*(gameCanvas.height-bottomMargin-blobsize*2),blobsize,clustercount,flower1Pic);
  decals.scatterDecorationsInRadius(blobsize+Math.random()*(gameCanvas.width-blobsize*2),blobsize+Math.random()*(gameCanvas.height-bottomMargin-blobsize*2),blobsize,clustercount,flower2Pic);
  decals.scatterDecorationsInRadius(blobsize+Math.random()*(gameCanvas.width-blobsize*2),blobsize+Math.random()*(gameCanvas.height-bottomMargin-blobsize*2),blobsize,clustercount,flower3Pic);
  */

}


function pushXY(xValue, yValue, thisArray) {
  thisArray.push( { x: xValue, y: yValue });
}
function storeXY(xValue, yValue, thisArray, index) {
  thisArray[index] = { x: xValue, y: yValue };

  if(index==3) {
    console.log("clump", xValue, yValue, thisArray)
  }
}