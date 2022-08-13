var countBluePen = 0;
var countRedPen = 0;
var countNotPen = 0;
var outOfPlay = 0;
var levelScore;
var levelScores = [0,0,0,0,0,0,0,0,0,0];

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

  // txt += " - - Sheep in play = " + sheepInPlay; // not working yet

  if(player.sheepIDheld != undefined) {
    txt += ". Sheep id " + player.sheepIDheld + " is under hat.";
  }

  txt += "\nCounting sheep: in blue pen = " + countBluePen + "; in red pen = " + countRedPen;

  var count = countPennedSheep();
  var wrong = countSheepPenned - count;
  txt += "\nScoring: in correct pen = " + count + "; in wrong pen = " + wrong;
  
  document.getElementById("debug_2").innerText = txt;
}

function UI_level_number() {
  canvasContext.font = "18px Verdana";
  canvasContext.fillStyle = "white";
  canvasContext.fillText("Level " + currentLevel  + ': "'  + levelNames[currentLevel] + '"', 10, canvas.height-10);
  canvasContext.textAlign = "left"; // avoid messing up the Menu
}

function testIfLevelEnd() {
  // if all sheep in states FENCED or PEN or ON_ROAD
  outOfPlay = 0;
  for(var i=0; i<FLOCK_SIZE[currentLevel]; i++) {
    // if(sheepList[i].state == IN_BLUE_PEN || sheepList[i].state == IN_RED_PEN || sheepList[i].state == FENCED || sheepList[i].state == ON_ROAD) {
    if(sheepList[i].levelDone) {
      outOfPlay++;
    }
  }
  console.log("Out of play =", outOfPlay)
  if(outOfPlay +4 >= FLOCK_SIZE[currentLevel]) {
    gameState = STATE_LEVEL_OVER;
    calculateLevelScore();
  }
}

function calculateLevelScore() {
  levelScore = 0;
  var mode, team, x, score;
  for(var i=0; i<FLOCK_SIZE[currentLevel]; i++) {
    mode = sheepList[i].state;
    team = sheepList[i].team;
    x = sheepList[i].x;
    if(team == BLUE && x < canvas.width/2/2) {
      offSide = false;
    }
    if(team == RED && x >= canvas.width/2) {
      offSide = false;
    }
    if(team == BLUE && x >= canvas.width/2) {
      offSide = true;
    }
    if(team == RED && x < canvas.width/2) {
      offSide = true;
    }
    if(mode == IN_BLUE_PEN || mode == IN_RED_PEN || mode == FENCED || mode == ON_ROAD) {
      score = 80 - Math.round(Math.abs(x - canvas.width/2) / 5);
      if(offSide) {
        sheepList[i].score = 0;
      } else {
        sheepList[i].score = score;
        levelScore += score;
      }
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
      // var agent = agentGrid[arrayIndex];
      // var x = colRowToCentreX(col, row);
      colorText(arrayIndex, drawTileX + TILE_W/2, drawTileY + TILE_H/2, "white");

      drawTileX += TILE_W;
      arrayIndex++;
		} // end of for each col
    drawTileX = 0;
    drawTileY += TILE_H;
	} // end of for each row
} // end of drawArea func