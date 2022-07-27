function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function randomRangeInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function distance(x1,y1, x2,y2) {
  var deltaX = x1 - x2;
  var deltaY = y1 - y2;
  return Math.sqrt(deltaX*deltaX + deltaY*deltaY);
}

function xDistance(x1, x2) {
  return Math.abs(x1 - x2);
}

function countPennedSheep() {
  var count = 0;
  for(var i=0; i<FLOCK_SIZE[currentLevel]; i++) {
    if(sheepList[i].state == PENNED) {
      count++;
    }
  }
  return count;
}

function update_debug_report() {
  var txt = '';

  var blues = teamSizeSoFar[1];
  var reds = teamSizeSoFar[2];
  txt += "Sheep sorted: blue = " + blues + "; red = " + reds;

  if(player.sheepIDheld != undefined) {
    txt += ". Sheep id " + player.sheepIDheld + " is under hat.";
  }

  var n = countPennedSheep();
  txt += "\nCounting sheep in pens (doesn't work yet): correct = " + n + "; wrong = unknown.";

  document.getElementById("debug_2").innerText = txt;
}

function UI_level_number() {
  canvasContext.textAlign = "center";
  canvasContext.font = "24px Verdana";
  canvasContext.fillStyle = "white";
  canvasContext.fillText("level " + currentLevel, canvas.width/2, canvas.height-10);
}