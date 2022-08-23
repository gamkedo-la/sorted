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

    console.log("decalOverlay canvas initializing");

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
        decalCanvas.width = canvas.width;
        decalCanvas.height = canvas.height;
        console.log("decalCanvas size: "+decalCanvas.width+"x"+decalCanvas.height);
	};

	this.clear = function() {
        this.resize();
        decalContext.clearRect(0, 0, decalCanvas.width, decalCanvas.height);
	};

    this.scatterDecorations = function(howMany=150, spritePic) {
        //console.log("Scattering decoration decals");
        var x,y;
        for (var i=0; i<howMany; i++) {
            x = randomInteger(0,decalCanvas.width);
            y = randomInteger(0,decalCanvas.height);
            this.add(x,y,0,1,spritePic);
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
  
