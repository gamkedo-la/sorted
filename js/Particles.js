const NUM_SORTING_PARTICLES = 50;
const NUM_ARRIVAL_PARTICLES = 150;
var vfxArrayList = [];
var sortingVFXtimer = 0;
var penVFXtimer = 0;
var ditchVFXtimer = 0;
var stuckVFXtimer = 0;

var sortingParticles = [];
var penParticles = [];
var ditchParticles = [];
var stuckParticles = [];


function Particle(x, y, xVel, yVel, size, color, life) {
  this.x = x;
  this.y = y;
  this.xVel = xVel;
  this.yVel = yVel;
  this.size = size;
  this.color = color;
  this.life = life;
  this.ang = Math.PI * 2.0 * Math.random();
  this.angVel = (Math.random() - 0.5) * 0.01;
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
  this.life = this.life - 1;
  if (this.life > 0) {
    this.x += this.xVel;
    this.y += this.yVel;
    this.ang += this.angVel;
    this.size += 0.02;
  } else {

  }
}


function makeParticles(num = 10, x, y, colour = 'white', size = 1, life = 40) {
  particleArray = [];
  for (let i = 0; i < num; i++) {
    // let size = 1;
    // let life = 40; // + Math.random() * 10;
    let px = x + (Math.random() * 8) - 4;
    let py = y + (Math.random() * 8) - 4;
    let xVel = (Math.random() * 4) - 2;
    let yVel = (Math.random() * 2) - 1;
    // let colour = TEAM_COLOURS[randomInteger(1, 2)];
    particleArray.push(new Particle(px, py, xVel, yVel, size, colour, life));
  }
  return particleArray;
}


function makeSortingVFX(HatX, HatY) {
  sortingParticles = makeParticles(NUM_SORTING_PARTICLES, HatX, HatY, TEAM_COLOURS[1], 1, 40);
  sortingVFXtimer = 40;
}
function makePenVFX(centreX, centreY) {
  penParticles = makeParticles(NUM_ARRIVAL_PARTICLES, centreX, centreY, TEAM_COLOURS[2], 2, 30);
  penVFXtimer = 40;
}
function makeDitchVFX(centreX, centreY) {
  ditchParticles = makeParticles(NUM_ARRIVAL_PARTICLES, centreX, centreY, '#996633', 2, 30);
  ditchVFXtimer = 40;
}
function makeStuckVFX(centreX, centreY) {
  stuckParticles = makeParticles(NUM_ARRIVAL_PARTICLES, centreX, centreY, '#663300', 2, 30);
  stuckVFXtimer = 40;
}


function moveParticles(particleArray) {
  for (let i = 0; i < particleArray.length; i++) {
    particleArray[i].move();
  }
}

function drawParticles(particleArray) {
  for (let i = 0; i < particleArray.length; i++) {
    particleArray[i].draw();
  }
}