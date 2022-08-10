var countBluePen = 0;
var countRedPen = 0;
var countNotPen = 0;
var outOfPlay = 0;
var levelScore;
var levelScores = [];

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

function scorePennedSheep() {
  var score = 0;
  for(var i=0; i<FLOCK_SIZE[currentLevel]; i++) {
    if(sheepList[i].state == IN_BLUE_PEN && sheepList[i].team == 1) {
      score++;
    }
    if(sheepList[i].state == IN_RED_PEN && sheepList[i].team == 2) {
      score++;
    }
  } // end loop all sheep
  return score;
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

  var score = scorePennedSheep();
  var wrong = countSheepPenned - score;
  txt += "\nScoring: in correct pen = " + score + "; in wrong pen = " + wrong;
  
  document.getElementById("debug_2").innerText = txt;
}

function UI_level_number() {
  // canvasContext.textAlign = "center";
  canvasContext.font = "18px Verdana";
  canvasContext.fillStyle = "white";
  // canvasContext.fillText("level " + currentLevel, canvas.width/2, canvas.height-10);
  canvasContext.fillText("Level " + currentLevel  + ': "'  + levelNames[currentLevel] + '"', 10, canvas.height-10);
  canvasContext.textAlign = "left"; // avoid messing up the Menu
}

function testIfLevelEnd() {
  // if all sheep in states FENCED or PEN or ON_ROAD
  outOfPlay = 0;
  for(var i=0; i<FLOCK_SIZE[currentLevel]; i++) {
    if(sheepList[i].state == IN_BLUE_PEN || sheepList[i].state == IN_RED_PEN || sheepList[i].state == FENCED || sheepList[i].state == ON_ROAD) {
      outOfPlay++;
    }
  }
  if(outOfPlay >= FLOCK_SIZE[currentLevel]) {
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