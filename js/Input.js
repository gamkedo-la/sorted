const STATE_MENU = 0;
const STATE_EDIT = 1;
const STATE_PLAY = 2;
const STATE_CREDITS = 3;
var gameState = STATE_PLAY;

const KEY_M = 77;
const KEY_C = 67;

const KEY_NUM_1 = 49;
const KEY_NUM_2 = 50;
const KEY_NUM_3 = 51;

const KEY_F1 = 112;
const KEY_F2 = 113;

var mouseX = 0;
var mouseY = 0;

function setupInput() {
	canvas.addEventListener('mousemove', getMousePos);
	document.addEventListener('keydown', keyPressed);
	document.addEventListener('keyup', keyReleased);
}

function keyPressed(evt) {
	evt.preventDefault();
}

function keyReleased(evt) {
}

function getMousePos(evt) {
  var rect = canvas.getBoundingClientRect(), root = document.documentElement;

  // account for margins, canvas position on page, and scroll 
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY
  };
}