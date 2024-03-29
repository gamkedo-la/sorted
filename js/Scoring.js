var outOfPlay = 0;
var VICTORY_MUSIC_VOLUME = 0.2; // it's a rather loud recording
var PEN_SCORE = 100;
var DITCH_SCORE = 40;
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


function calcMaximumScore(whichLevel) {

  let numFillablePens = Math.min(FLOCK_SIZE[whichLevel], penQuantity[whichLevel]);
  let maxScore = numFillablePens * Math.floor(PEN_SCORE * Math.cbrt(whichLevel));

  let spareSheep = 0;
  if (FLOCK_SIZE[whichLevel] > penQuantity) {
    spareSheep = FLOCK_SIZE[whichLevel] - penQuantity;
  }

  return maxScore + (DITCH_SCORE * spareSheep);
}


function setAllMaxScores() {
  for (var i = 0; i < NUM_LEVELS; i++) {
    levelMaxScores[i] = calcMaximumScore(i);
    // console.log('Level ' + i + ' maximum score: ' + levelMaxScores[i]);
  }
}


function isLevelOver() {
  // if all sheep out-of-play and particle fx completed
  // particles run in LevelOver so no need to complete before starting
  // return (sheepInPlay < 1 && particleList.length < 5)
  return (sheepInPlay < 1)
}


function levelEnding() {
  gameState = STATE_LEVEL_END;
  levelScores[currentLevel] = levelScore;
  checkScore(levelScore);
  levelTestDataReady = true;
  levelRunning = false;

  if (editMode == false) {
    // play some happy music!
    if (musicInitialised) {
      gameMusic.stopMusic();
    }
  }

  // console.log(anyInPen(bottomRowID), bottomRowID)
  if (USE_ROAD_SCENE  && runMode == NORMAL_PLAY) {  
    if (ROAD_HIDE_IF_PENS_EMPTY) {
      if (anyInPen(bottomRowID)) {
        setupRoadLorries();
      } else {
        console.log('None in pens: no lorries.');
      }
    } else { // show even if pens empty
      setupRoadLorries();
    }
  } else {
    console.log('Road not in use');
  }
}


function isInPen(mode) {
  return mode == IN_PEN_BLUE || mode == IN_PEN_RED
}
function isInPenOrDitch(mode) {
  return mode == IN_PEN_BLUE || mode == IN_PEN_RED || mode == IN_DITCH
}


// scores are calculated immediately and recorded for sheep
function checkScore() {
  var sheepScoreSum = 0;
  for (var i = 0; i < FLOCK_SIZE[currentLevel]; i++) {
    sheepScoreSum += sheepList[i].score;
  }
  if (sheepScoreSum == levelScore) {
    console.log("Check OK: levelScore tallies with sum of sheep scores");
  }
  else {
    console.log("Check failed: levelScore doesn't match sum of sheep scores", levelScore, sheepScoreSum);
  }
}
  // var offSide;
  // var mode, team, x, done, score;
  // console.log("Calculating end-of-level score for each sheep");

    // var score = 0;
    // offSide = false;
    // mode = sheepList[i].mode;
    // id = sheepList[i].id;
    // team = sheepList[i].team;
    // done = sheepList[i].levelDone;
    // x = sheepList[i].x;

    // if central tile it scores for both teams (adjust by TILE_W/2)
    // centralAdjust = isOdd(TILE_COLS) ? TILE_W/2 : 0;

    // if (team == BLUE && x >= gameCanvas.width / 2 + centralAdjust) {
    //   offSide = true;
    // }
    // else if (team == RED && x < gameCanvas.width / 2 - centralAdjust) {
    //   offSide = true;
    // }

    // if (team != PLAIN) {

    //   if (mode == IN_DITCH) {
    //     score = DITCH_SCORE * (1 - currentLevel/5);
    //   }

    //   if (mode == IN_PEN_BLUE) {
    //     score = PEN_SCORE * (1 - currentLevel/5);
    //   }
    //   if (mode == IN_PEN_RED) {
    //     score = PEN_SCORE * (1 - currentLevel/5);
    //   }

    //   sheepList[i].score = score;
    //   levelScore += score;

      // console.log(sheepList[i].id, x, team, mode, offSide, done)
  //   }
  // }
  // levelScores[currentLevel] = levelScore;
