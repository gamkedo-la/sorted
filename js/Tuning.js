// Level tuning

const NUM_LEVELS = 11;

// how are sheep initially located
const PLACING_NAMES = ["Random scatter", "Random flock", "Manual scatter", "Manual flock"];
const PLACING_MODE = Array(NUM_LEVELS);
var defaultPlacingMode = 0; // random scatter
PLACING_MODE.fill(defaultPlacingMode);

// constraints on initial placement of sheep
const PLACING_DEPTH = Array(NUM_LEVELS);
var defaultPlacingLowestY = 200; // halfway down field
PLACING_DEPTH.fill(defaultPlacingLowestY);

// Hat - farmer's clamp - move speed
const HAT_POWER = Array(NUM_LEVELS);
var defaultHatSpeed = 1.0;
HAT_POWER.fill(defaultHatSpeed);

const HAT_FRICTION = Array(NUM_LEVELS);
var defaultHatFriction = 0.94;
HAT_FRICTION.fill(defaultHatFriction);

const HAT_MAX_SPEED = Array(NUM_LEVELS);
var defaultHatMaxSpeed = 10;
HAT_MAX_SPEED.fill(defaultHatMaxSpeed);

// const HAT_MARGIN = 18; // stops hat going off side edge

// Call a sheep
// const CALL_X_ALIGN = 20; // tractor not exactly above sheep
const CALL_SPEED = Array(NUM_LEVELS); // speed of sheep moving up
var defaultCallSpeed = 7;
CALL_SPEED.fill(defaultCallSpeed);

// Send a sheep
const SEND_SPEED = Array(NUM_LEVELS);
var defaultSendSpeed = 10;
SEND_SPEED.fill(defaultSendSpeed);

// Sheep mode timeToExpiry
// needs 2 values: minimum and maximum
const ROAM_TIME_MIN = Array(NUM_LEVELS);
const ROAM_TIME_MAX = Array(NUM_LEVELS);
const GRAZE_TIME_MIN = Array(NUM_LEVELS);
const GRAZE_TIME_MAX = Array(NUM_LEVELS);

var defaultRoamTimeMin = 30;
var defaultRoamTimeMax = 60;
var defaultGrazeTimeMin = 90;
var defaultGrazeTimeMax = 150;

ROAM_TIME_MIN.fill(defaultRoamTimeMin);
ROAM_TIME_MAX.fill(defaultRoamTimeMax);
GRAZE_TIME_MIN.fill(defaultGrazeTimeMin);
GRAZE_TIME_MAX.fill(defaultGrazeTimeMin);

// sheep roam speed
const ROAM_SPEED = Array(NUM_LEVELS);
var defaultRoamSpeed = 1.0;
ROAM_SPEED.fill(defaultRoamSpeed);

// sheep graze speed (if any)
const GRAZE_SPEED = Array(NUM_LEVELS);
var defaultGrazeSpeed = 0.05;
GRAZE_SPEED.fill(defaultGrazeSpeed);

// on conveyor speed
const CONVEYOR_SPEED = Array(NUM_LEVELS);
var defaultConveyorSpeed = 1.0;
CONVEYOR_SPEED.fill(defaultConveyorSpeed);

// on conveyor speed
const DISTRACTED_TIME = Array(NUM_LEVELS);
var defaultDistractedTime = 180;
DISTRACTED_TIME.fill(defaultDistractedTime);

// Rogue path
const ROGUE_ROW = Array(NUM_LEVELS);
var defaultRogueRow = 11;
ROGUE_ROW.fill(defaultRogueRow);

const ROGUE_SPEED = Array(NUM_LEVELS);
var defaultRogueSpeed = 2;
ROGUE_SPEED.fill(defaultRogueSpeed);
