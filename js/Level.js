// Level tuning

const NUM_LEVELS = 10;

// how are sheep initially located
const PLACING_NAMES = ["Random scatter", "Random cluster", "Manual scatter", "Manual cluster"];
const PLACING_MODE = Array(NUM_LEVELS);
var defaultPlacingMode = 1; // random scatter
PLACING_MODE.fill(defaultPlacingMode);

// constraints on initial placement of sheep
const PLACING_DEPTH = Array(NUM_LEVELS);
var defaultPlacingLowestY = 300; // halfway down field  
PLACING_DEPTH.fill(defaultPlacingLowestY);

// Hat - farmer's clamp - move speed
const HAT_POWER = Array(NUM_LEVELS);
var defaultHatSpeed = 1.0;
HAT_POWER.fill(defaultHatSpeed);

const HAT_FRICTION = Array(NUM_LEVELS);
var defaultHatFriction = 0.94;
HAT_FRICTION.fill(defaultHatFriction);

const HAT_MARGIN = 18; // stops hat going off side edge

// Call a sheep
const ALIGN_LIMIT = 20; // tractor not exactly above sheep

const TRACTOR_SPEED = 3; // speed of sheep moving up

// Level 5
PLACING_DEPTH[5] = 500;

// Level 6
PLACING_DEPTH[6] = 100;