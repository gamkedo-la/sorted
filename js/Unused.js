/////////////////////////////////////////
// from Classic Games book
var mouseX = 0;
var mouseY = 0;

function getMousePos(evt) {
	var rect = gameCanvas.getBoundingClientRect();
	var root = document.documentElement;
  // account for margins, canvas position on page, scroll amount, etc.
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY
  };
}
////////////////////////////////////////

// from APC5 Htgd - lacks root.scroll...?
// not used
function setMousePosFromEvent(evt) {
  var rect = drawingCanvas.getBoundingClientRect();
  var fixScaleX = (uiCanvas.width + gameCanvas.width) / gameCanvas.width;
  mouse.x = Math.round(fixScaleX * (evt.clientX - rect.left) / drawScaleX );
  mouse.y = Math.round( (evt.clientY - rect.top) / drawScaleY);
  // mousex = Math.round(fixScaleX * (evt.clientX - rect.left) / drawScaleX );
  // mousey = Math.round( (evt.clientY - rect.top) / drawScaleY);
  // report("setMouseByEvt: " + mousex + "," + mousey, 4);
}

// for file output, not needed if downloader() is OK
// create.addEventListener('click', function () {
//   var link = document.getElementById('downloadlink');
//   link.href = makeTextFile(levelData);
//   link.style.display = 'block';
// }, false);

// Levels bottom rows for polarization metaphor
// 1
//  10, 10, 10, 10, 10, 10, 10, 11, 12, 10, 10, 10, 10, 10, 10, 10,
// 2
//  10, 10, 10, 10, 10, 10, 11, 13, 13, 12, 10, 10, 10, 10, 10, 10,
// 3
//  10, 10, 10, 10, 10, 11, 13, 13, 13, 13, 12, 10, 10, 10, 10, 10,
// 4
//  10, 10, 10, 10, 11, 13, 13, 13, 13, 13, 13, 12, 10, 10, 10, 10,
// 5
//  10, 10, 10, 11, 13, 13, 13, 13, 13, 13, 13, 13, 12, 10, 10, 10,
// 6
//  10, 10, 11, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 12, 10, 10,
// 7
//  10, 11, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 12, 10,
// 8
//  11, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 12,