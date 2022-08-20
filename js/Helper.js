var outOfPlay = 0;
var levelScore;
var levelScores = [0,0,0,0,0,0,0,0,0,0];
var nextLevel = 1;

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
    if(sheepList[i].state == IN_BLUE_PEN && sheepList[i].team == 1) {
      count++;
    }
    if(sheepList[i].state == IN_RED_PEN && sheepList[i].team == 2) {
      count++;
    }
  } // end loop all sheep
  return count;
}

function update_debug_report() {
  var txt = '';

  var blues = teamSizeSoFar[1];
  var reds = teamSizeSoFar[2];
  txt += "Sheep sorted: blue = " + blues + "; red = " + reds;

  txt += " - - Sheep in play = " + sheepInPlay; 

  if(player.sheepIDheld != undefined) {
    txt += ". Sheep id " + player.sheepIDheld + " is under hat.";
  }
  document.getElementById("debug_2").innerText = txt;
}

function UI_level_number() {
  canvasContext.font = "18px Verdana";
  canvasContext.fillStyle = "white";
  canvasContext.fillText("Level " + currentLevel  + ': "'  + levelNames[currentLevel] + '"', 10, canvas.height-TILE_H+10);
  canvasContext.textAlign = "left"; // avoid messing up the Menu
}

function testIfLevelEnd() {
  // if all sheep in states FENCED or PEN or ON_ROAD
  // outOfPlay = 0;
  // for(var i=0; i<FLOCK_SIZE[currentLevel]; i++) {
  //   if(sheepList[i].levelDone) {
  //     outOfPlay++;
  //   }
  // }
  // // console.log("Out of play =", outOfPlay)
  // if(outOfPlay >= FLOCK_SIZE[currentLevel]) {
  if(sheepInPlay < 1) {
    console.log("Level over", outOfPlay);
    gameState = STATE_LEVEL_OVER;
    calculateLevelScore();
  }
}

function isInPen(mode) {
  return mode == IN_BLUE_PEN || mode == IN_RED_PEN
}

function calculateLevelScore() {
  levelScore = 0;
  var offSide;
  var mode, team, x, score;
  
  for(var i=0; i<FLOCK_SIZE[currentLevel]; i++) {
    offSide = false;
    mode = sheepList[i].state;
    id = sheepList[i].id;
    team = sheepList[i].team;
    done = sheepList[i].levelDone;
    
    x = sheepList[i].x;

    if(team == BLUE && x >= canvas.width/2) {
      offSide = true;
    }
    else if(team == RED && x < canvas.width/2) {
      offSide = true;
    }

    if(done && team != PLAIN) {
      score = 80 - Math.round(Math.abs(x - canvas.width/2) / 5);
      if(offSide) {
        sheepList[i].score = 0;
      } else {
        sheepList[i].score = score;
      }
      // how about if in goal column but queued up?
      // bonus for being in goal column
      if(mode == IN_BLUE_PEN && team == BLUE) {
        sheepList[i].score += 100;
      }
      else if(mode == IN_RED_PEN && team == RED) {
        sheepList[i].score += 100;
      }
      levelScore += sheepList[i].score;

      console.log(sheepList[i].id, x, team, mode, offSide, done)
    }
  }
  levelScores[currentLevel] = levelScore;
}

function test_EndLevel() {
  gameState = STATE_LEVEL_OVER;
  calculateLevelScore();
}

function getLines(ctx, text, maxWidth) {
  var words = text.split(" ");
  var lines = [];
  var currentLine = words[0];

  for (var i = 1; i < words.length; i++) {
      var word = words[i];
      var width = ctx.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
          currentLine += " " + word;
      } else {
          lines.push(currentLine);
          currentLine = word;
      }
  }
  lines.push(currentLine);
  return lines;
}

function drawAgentGrid() {
  var arrayIndex = 0;
  var drawTileX = 0;
  var drawTileY = 0;

	for(var eachRow=0; eachRow<TILE_ROWS; eachRow++) {
		for(var eachCol=0; eachCol<TILE_COLS; eachCol++) {
      var agent = agentGrid[arrayIndex];
      // var x = colRowToCentreX(col, row);
      //canvasContext.font
      fontColor = (agent == 1) ? "black" : "white";
      fontSize = (agent == 1) ? 24 : 12;
      canvasContext.font = fontSize + "px Arial";
      canvasContext.textAlign = "center";
      colorText(agent, drawTileX + TILE_W/2, drawTileY + TILE_H/2, fontColor);

      drawTileX += TILE_W;
      arrayIndex++;
		} // end of for each col
    drawTileX = 0;
    drawTileY += TILE_H;
	} // end of for each row
} // end of drawArea func

function getMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
  // account for margins, canvas position on page, scroll amount, etc.
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY
  };
}

function normaliseRadian(ang) {
  while(ang < 0) {
    ang += 2 * Math.PI;
  }
  if(ang > 2 * Math.PI) {
    ang %= (2 * Math.PI);
  } 
  return ang; 
}

function roundToNearest( number, multiple ){
  var half = multiple/2;
  return number+half - (number+half) % multiple;
}

//   console.log("centre Hat in column")
function nearestColumnCentre(x) {
  // colCentre = roundToNearest(x, TILE_W) + TILE_W/2;
  return TILE_W/2 + (Math.round((x - TILE_W/2) / TILE_W) * TILE_W);
}

function nearestRowEdge(y) {
  rowEdge = roundToNearest(y, TILE_H);
  return rowEdge;
}