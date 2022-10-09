const NUM_SORTING_PARTICLES = 50;
const NUM_ARRIVAL_PARTICLES = 150;
var particleList = [];


function Particle(x, y, xVel, yVel, size, growth, color, life) {
  this.x = x;
  this.y = y;
  this.xVel = xVel;
  this.yVel = yVel;
  this.size = size;
  this.growth = growth;
  this.color = color;
  this.life = life;
  // this.ang = Math.PI * 2.0 * Math.random();
  // this.angVel = (Math.random() - 0.5) * 0.01;
}


Particle.prototype.draw = function () {
  var fade = 1.0;
  if (this.life < 20) {
    fade = this.life / 20;
  }
  canvasContext.globalAlpha = fade;
  // console.log(this.x, this.y, this.size, this.color)
  canvasContext.beginPath();
  canvasContext.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
  canvasContext.fillStyle = this.color;
  canvasContext.fill();
  canvasContext.globalAlpha = 1.0;
}


Particle.prototype.move = function () {
  this.x += this.xVel;
  this.y += this.yVel;
  this.ang += this.angVel;
  this.size += this.growth;
  this.life = this.life - 1;
}


function addParticles(num=10, x, y, colourList=['white'], size=1, life=40, shapeX=50, shapeY=50) {
  for (let i = 0; i < num; i++) {
    // let size = 1;
    let growth = 0;

    let px = x + (Math.random() * 8) - 4;
    let py = y + (Math.random() * 8) - 4;

    // let life = 40; // + Math.random() * 10;
    let xVel = (shapeX / life) * randomRange(-1,1);
    let yVel = (shapeY / life) * randomRange(-1,1);

    let colourRange = colourList.length - 1;
    let colour = colourList[randomInteger(0, colourRange)];
    particleList.push(new Particle(px, py, xVel, yVel, size, growth, colour, life));
  }
}


function makeSortingVFX(HatX, HatY) {
  let numParticles = NUM_SORTING_PARTICLES;
  let centreX = HatX;
  let centreY = HatY;
  let size = 2;
  let life = 40;
  let shapeX = 50;
  let shapeY = 30;
  addParticles(numParticles, centreX, centreY, TEAM_COLOURS, size, life, shapeX, shapeY);
}

function makePenVFX(centreX, centreY, team) {
  addParticles(NUM_ARRIVAL_PARTICLES, centreX, centreY, TEAM_COLOURS[team], 2, 30);
}
function makeDitchVFX(centreX, centreY) {
  addParticles(NUM_ARRIVAL_PARTICLES, centreX, centreY, '#996633', 2, 30);
}
function makeStuckVFX(centreX, centreY) {
  addParticles(NUM_ARRIVAL_PARTICLES, centreX, centreY, '#663300', 2, 30);
}


function moveParticles(particleList) {
  for (let i = 0; i < particleList.length; i++) {
    particleList[i].move();
  }
}

function drawParticles(particleList) {
  for (let i = 0; i < particleList.length; i++) {
    particleList[i].draw();
  }
}

function removeFromUnordered(arr, i) {
  if (i <= 0 || i >= arr.length) {
    return;
  }
  if (i < arr.length - 1) {
    arr[i] = arr[arr.length - 1];
  }
  arr.length -= 1;
}