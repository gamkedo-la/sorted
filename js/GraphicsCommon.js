function drawBitmapCenteredWithRotation(ctx, useBitmap, atX,atY, withAng) {
	ctx.save();
	ctx.translate(atX, atY);
	ctx.rotate(withAng);
	ctx.drawImage(useBitmap, -useBitmap.width/2, -useBitmap.height/2);
	ctx.restore();
}

function colorRect(ctx, topLeftX,topLeftY, boxWidth,boxHeight, fillColor) {
	ctx.fillStyle = fillColor;
	ctx.fillRect(topLeftX,topLeftY, boxWidth,boxHeight);
}

function colorRectBorder(ctx, topLeftX,topLeftY, boxWidth,boxHeight, fillColor, strokeColor, lineWidth) {
	ctx.fillStyle = fillColor;
	ctx.fillRect(topLeftX,topLeftY, boxWidth,boxHeight);
  ctx.lineWidth = lineWidth;
  ctx.setLineDash([]); // colorLine set this
  ctx.strokeStyle = strokeColor;
  ctx.strokeRect(topLeftX,topLeftY, boxWidth,boxHeight);
}

function colorCircle(ctx, centerX,centerY, radius, fillColor) {
	ctx.fillStyle = fillColor;
	ctx.beginPath();
	ctx.arc(centerX,centerY, radius, 0,Math.PI*2, true);
	ctx.fill();
}

function colorCircleBorder(ctx, centerX,centerY, radius, fillColor, strokeColor) {
  ctx.fillStyle = fillColor;
	ctx.beginPath();
	ctx.arc(centerX,centerY, radius, 0,Math.PI*2, true);
	ctx.fill();
  ctx.lineWidth = 1;
  ctx.setLineDash([]); // colorLine set this
  ctx.strokeStyle = strokeColor;
  ctx.stroke();
}

function colorText(ctx, showWords, textX,textY, fillColor) {
	ctx.fillStyle = fillColor;
	ctx.fillText(showWords, textX, textY);
}

function colorLine(ctx, startX,startY, endX,endY, color) {
	ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 5;
  ctx.setLineDash([5, 5]);
  ctx.moveTo(startX,startY);
  ctx.lineTo(endX,endY);
  ctx.stroke();
}


function drawStar(ctx, centerX, centerY, arms, innerRadius, outerRadius, startAngle, fillStyle, strokeStyle, lineWidth
) {
  startAngle = startAngle * Math.PI / 180  || 0;
  var step = Math.PI / arms,
      angle = startAngle
      ,hyp,x,y;
  ctx.strokeStyle = strokeStyle;
  ctx.fillStyle = fillStyle;
  ctx.lineWidth = lineWidth;
  ctx.setLineDash([]);
  ctx.beginPath();
  for (var i =0,len= 2 * arms; i <len; i++) {
    hyp = i & 1 ? innerRadius : outerRadius;
    x = centerX + Math.cos(angle) * hyp;
    y = centerY +Math.sin(angle) * hyp;
    angle+=step;
    ctx.lineTo(x, y);
  }
  ctx.closePath();
  fillStyle && ctx.fill();
  strokeStyle && ctx.stroke();
}