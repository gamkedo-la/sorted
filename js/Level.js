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

// const HAT_MARGIN = 18; // stops hat going off side edge

// Call a sheep
// const ALIGN_LIMIT = 20; // tractor not exactly above sheep
const CALL_SPEED = Array(NUM_LEVELS); // speed of sheep moving up
var defaultCallSpeed = 3;
CALL_SPEED.fill(defaultCallSpeed);

// Send a sheep
const SEND_SPEED = Array(NUM_LEVELS);
var defaultSendSpeed = 10;
SEND_SPEED.fill(defaultSendSpeed);

// Sheep mode timeToExpiry
// needs 2 values: minimum and maximum

// Sheep roam speed
const ROAM_SPEED = Array(NUM_LEVELS);
var defaultRoamSpeed = 10;
ROAM_SPEED.fill(defaultRoamSpeed);

// Rogue path
const ROGUE_ROW = Array(10);
var defaultRogueRow = 11;
ROGUE_ROW.fill(defaultRogueRow);

const ROGUE_SPEED = Array(10);
var defaultRogueSpeed = 5;
ROGUE_SPEED.fill(defaultRogueSpeed);

// Level 5
PLACING_DEPTH[5] = 500;
HAT_POWER[5] = 3.0;
CALL_SPEED[5] = 10;
SEND_SPEED[5] = 20;

// Level 6
PLACING_DEPTH[6] = 100;
HAT_POWER[6] = 0.2;
CALL_SPEED[6] = 1;
SEND_SPEED[6] = 4;