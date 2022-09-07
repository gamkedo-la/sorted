function drawBitmapCenteredWithRotation(useBitmap, atX,atY, withAng) {
	canvasContext.save();
	canvasContext.translate(atX, atY);
	canvasContext.rotate(withAng);
	canvasContext.drawImage(useBitmap, -useBitmap.width/2, -useBitmap.height/2);
	canvasContext.restore();
}

function colorRect(topLeftX,topLeftY, boxWidth,boxHeight, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.fillRect(topLeftX,topLeftY, boxWidth,boxHeight);
}
function colorRectBorder(topLeftX,topLeftY, boxWidth,boxHeight, fillColor, strokeColor, lineWidth) {
	canvasContext.fillStyle = fillColor;
	canvasContext.fillRect(topLeftX,topLeftY, boxWidth,boxHeight);
  canvasContext.lineWidth = lineWidth;
  canvasContext.setLineDash([]); // colorLine set this
  canvasContext.strokeStyle = strokeColor;
  canvasContext.strokeRect(topLeftX,topLeftY, boxWidth,boxHeight);
}

function colorCircle(centerX,centerY, radius, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX,centerY, radius, 0,Math.PI*2, true);
	canvasContext.fill();
}
function colorCircleBorder(centerX,centerY, radius, fillColor, strokeColor) {
  canvasContext.fillStyle = fillColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX,centerY, radius, 0,Math.PI*2, true);
	canvasContext.fill();
  canvasContext.lineWidth = 1;
  canvasContext.setLineDash([]); // colorLine set this
  canvasContext.strokeStyle = strokeColor;
  canvasContext.stroke();
}

function colorText(showWords, textX,textY, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.fillText(showWords, textX, textY);
}

function colorLine(startX,startY, endX,endY, color) {
	canvasContext.beginPath();
  canvasContext.strokeStyle = color;
  canvasContext.lineWidth = 5;
  canvasContext.setLineDash([5, 5]);
  canvasContext.moveTo(startX,startY);
  canvasContext.lineTo(endX,endY);
  canvasContext.stroke();
}