const NUM_SORTING_PARTICLES = 50;
var particleArray = [];


function Particle(x, y, xVel, yVel, size, color, life) {
  this.x = x;
  this.y = y;
  this.xVel = xVel;
  this.yVel = yVel;
  this.size = size;
  this.color = color;
  this.life = life;
  this.ang = Math.PI*2.0*Math.random();
  this.angVel = (Math.random() - 0.5)* 0.01;
}


Particle.prototype.draw = function() {
  var fade=1.0;
  if(this.life <20){
    fade = this.life/20;
  }
  canvasContext.globalAlpha = fade;
  // console.log(this.x, this.y, this.size, this.color)
  canvasContext.beginPath();
  canvasContext.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
  canvasContext.fillStyle = this.color;
  canvasContext.fill();
  canvasContext.globalAlpha = 1.0;
}


Particle.prototype.move = function() {
  this.life = this.life - 1;
  if(this.life > 0) {
    this.x += this.xVel;
    this.y += this.yVel;
    this.ang += this.angVel;
    this.size += 0.02;
  } else {

  }
}


function makeParticles(num, x, y) {
  particleArray = [];
  for(let i=0; i<num; i++) {
    let size = 1;
    let life = 40; // + Math.random() * 10;
    let px = x + (Math.random() * 8) - 4;
    let py = y + (Math.random() * 8) - 4;
    let xVel = (Math.random() * 4) - 2;
    let yVel = (Math.random() * 2) - 1;
    let color = TEAM_COLOURS[ randomInteger(1,2) ];
    particleArray.push(new Particle(px, py, xVel, yVel, size, color, life));
  }
}

var sortingVFXtimer = 0;
function makeSortingVFX(HatX, HatY) {
  makeParticles(NUM_SORTING_PARTICLES, HatX, HatY);
  sortingVFXtimer = 40;
}


function moveParticles() {
  for (let i=0; i < particleArray.length; i++) {
    particleArray[i].move();
  }
}

function drawParticles() {
  for (let i=0; i < particleArray.length; i++) {
    particleArray[i].draw();
  }
}