// save canvas for dimensions, and 2d context for drawing
var canvas, canvasContext;

window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');
  loadImages();
  checkGridMatchColRow();
}

function loadingDoneSoStartGame() {
  // setup game logic and render 30 times per second
  var framesPerSecond = 30;
  setInterval(function() {
      moveEverything();
      drawEverything();
    }, 1000/framesPerSecond
  );
  setupInput();
}

function moveEverything() {
  // for(var i=0;i<sheep.length;i++) {
  //   sheep[i].move();
  // }
}

function drawEverything() {
  // temp outline
  colorOutlineRectCornerToCorner(0, 0, canvas.width, canvas.height, 'red', 3);
  drawArea();
}