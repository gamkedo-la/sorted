var outOfPlay = 0;

var PEN_SCORE = 100;
var DITCH_SCORE = 40;
const SCORE_DISPLAY_TIME = 50;
var levelScore = 0;

// var levelScores = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var levelScores = Array(NUM_LEVELS);
levelScores.fill(0);

// var levelMaxScores = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var levelMaxScores = Array(NUM_LEVELS);
levelMaxScores.fill(0);

// var penQuantity = 6;
var penQuantity = Array(NUM_LEVELS);
penQuantity.fill(6);


function countPens() {
}


function calcMaximumScore(whichLevel) {

  let numFillablePens = Math.min(FLOCK_SIZE[whichLevel], penQuantity[whichLevel]);
  let maxScore = PEN_SCORE * numFillablePens;

  let spareSheep = 0;
  if (FLOCK_SIZE[whichLevel] > penQuantity) {
    spareSheep = FLOCK_SIZE[whichLevel] - penQuantity;
  }

  return maxScore + (DITCH_SCORE * spareSheep);
}


function setAllMaxScores() {
  for (var i=0; i < NUM_LEVELS; i++) {
    levelMaxScores[i] = calcMaximumScore(i);
    // console.log('Level ' + i + ' maximum score: ' + levelMaxScores[i]);
  }
}


function testIfLevelEnd() {
  // if all sheep in states IN_DITCH or PEN or ON_ROAD
  // outOfPlay = 0;
  // for(var i=0; i<FLOCK_SIZE[currentLevel]; i++) {
  //   if (sheepList[i].levelDone) {
  //     outOfPlay++;
  //   }
  // }
  // // console.log("Out of play =", outOfPlay)
  // if (outOfPlay >= FLOCK_SIZE[currentLevel]) {
  if (sheepInPlay < 1) {
    console.log("Level over", outOfPlay);
    gameState = STATE_LEVEL_END;
    calculateLevelScore();
    levelRunning = false;
  }
}


function isInPen(mode) {
  return mode == IN_BLUE_PEN || mode == IN_RED_PEN
}


function calcLevelScore() {
  var levelScore = 0;
  var offSide;
  var mode, team, x, done, score;
  console.log("Calculating end-of-level score for each sheep");
  levelTestDataReady = true;

  for(var i=0; i<FLOCK_SIZE[currentLevel]; i++) {
    var score = 0;
    offSide = false;
    mode = sheepList[i].mode;
    id = sheepList[i].id;
    team = sheepList[i].team;
    done = sheepList[i].levelDone;
    x = sheepList[i].x;

    // if central tile it scores for both teams (adjust by TILE_W/2)
    centralAdjust = isOdd(TILE_COLS) ? TILE_W/2 : 0;

    if (team == BLUE && x >= gameCanvas.width / 2 + centralAdjust) {
      offSide = true;
    }
    else if (team == RED && x < gameCanvas.width / 2 - centralAdjust) {
      offSide = true;
    }

    if (team != PLAIN) {

      if (mode == IN_DITCH) {
        score = DITCH_SCORE * (1 - currentLevel/5);
      }

      if (mode == IN_BLUE_PEN) {
        score = PEN_SCORE * (1 - currentLevel/5);
      }
      if (mode == IN_RED_PEN) {
        score = PEN_SCORE * (1 - currentLevel/5);
      }

      sheepList[i].score = score;
      levelScore += score;

      // console.log(sheepList[i].id, x, team, mode, offSide, done)
    }
  }
  levelScores[currentLevel] = levelScore;
}


function testLevelEnded() {
  gameState = STATE_LEVEL_END;
  calculateLevelScore();
}