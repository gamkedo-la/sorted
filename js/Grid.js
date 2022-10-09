const TILE_FIELD = 0;
const TILE_SLOW = 1;
const TILE_STUCK = 2;
const TILE_HALT = 3;
const TILE_BEND_LEFT = 4;
const TILE_BEND_RIGHT = 5;
const TILE_CONVEYOR_UP = 8;
const TILE_CONVEYOR_DOWN = 9;
const TILE_CONVEYOR_LEFT = 6;
const TILE_CONVEYOR_RIGHT = 7;
const TILE_DISTRACT = 16;
const TILE_UNSORT = 17;

const TILE_DITCH = 10;
const TILE_PEN_BLUE = 11;
const TILE_PEN_RED = 12;
const FULL_BLUE = 13; // when sheep on pen
const FULL_RED = 14;
const FULL_DITCH = 15;

const TILE_NAMES = ['Field', 'Slow', 'Stuck', 'Halt', 'Bend left', 'Bend right', 'Conveyor left', 'Conveyor right', 'Distract', 'Unsort', 'Road', 'Pen blue', 'Pen red', 'Centre'];

const YELLOW_FLOWER = 20;
const BLUE_FLOWER = 21;
const RED_FLOWER = 22;
const BRIGHT_GRASS = 23;

var areaGrid = [];
var saveGrid = [];

// level 0 scratchpad for asset integration testing
const LEVEL_NAMES =["Testing", "Call and send", "Bends in the field", "Dogs erase paint", "Bo Peep leads up", "Name of Level 5", "Name of Level 6", "Name of Level 7", "Rogue test woof & unsort", "Name of Level 9"];

var levelTitleWidth = 200;
// = Array(NUM_LEVELS);
// for (var i=0; i < NUM_LEVELS; i++) {
//   levelTitleWidth[i] = measure;
// }


const level_0 = [
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0, 20,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0, 21,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0, 23,  0,  0,  0,  0,  0,  0,  0,  0,  0, 22,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 10, 11, 10, 10, 11, 10, 10, 11, 12, 10, 10, 12, 10, 10, 12, 10,
];

const level_1 = [
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 23,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 20,  0,  1,  1,  0,  1,  1,  0,  0,  1,  1,  0,  1,  1, 22,  0,
  0,  0,  1,  1,  0,  1,  1,  0,  0,  1,  1,  0,  1,  1,  0,  0,
  0,  0,  1,  1,  0,  1,  1,  0,  0,  1,  1,  0,  1,  1, 21,  0,
  0,  0,  2,  2,  0,  2,  2,  0,  0,  2,  2,  0,  2,  2,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 10, 11, 10, 10, 11, 10, 10, 11, 12, 10, 10, 12, 10, 10, 12, 10,
];

const level_2 = [
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0, 20,  0,  0, 21,  0,  0, 22,  0,  0, 23,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  4,  5,  0,  4,  5,  0,  0,  0,  0,  4,  5,  0,  4,  5,  0,
  0,  0,  0,  0,  0,  0,  0,  4,  5,  0,  0,  0,  0,  0,  0,  0,
  1,  0,  0,  4,  0,  1,  0,  0,  0,  0,  1,  0,  5,  0,  0,  1,
  1,  0,  0,  0,  0,  1,  0,  0,  0,  0,  1,  0,  0,  0,  0,  1,
  1,  0,  0,  0,  0,  1,  4,  0,  0,  5,  1,  0,  0,  0,  0,  1,
  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,
 10, 11, 10, 10, 11, 10, 10, 11, 12, 10, 10, 12, 10, 10, 12, 10,
];

const level_3 = [
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 10, 11, 10, 10, 11, 10, 10, 11, 12, 10, 10, 12, 10, 10, 12, 10,
];

const level_4 = [
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  4,  4,  0,  4,  4,  0,  0,  5,  5,  0,  5,  5,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 10, 11, 10, 10, 11, 10, 10, 11, 12, 10, 10, 12, 10, 10, 12, 10,
];

const level_5 = [
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  4,  0,  4,  4,  0,  4,  4,  0,  0,  5,  5,  0,  5,  5,  0,  5,
  0,  1,  0,  0,  1,  0,  0,  1,  1,  0,  0,  1,  0,  0,  1,  0,
  0,  1,  0,  0,  1,  0,  0,  1,  1,  0,  0,  1,  0,  0,  1,  0,
  0,  1,  0,  0,  1,  0,  0,  1,  1,  0,  0,  1,  0,  0,  1,  0,
  0,  1,  0,  0,  1,  0,  0,  1,  1,  0,  0,  1,  0,  0,  1,  0,
  5,  5,  0,  0,  5,  0,  0,  5,  4,  0,  0,  4,  0,  0,  4,  4,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 10, 11, 10, 10, 11, 10, 10, 11, 12, 10, 10, 12, 10, 10, 12, 10,
];

const level_6 = [
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  1,  1,  1,  1,  1,  1,  1,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  1,  1,  1,  1,  1,  1,  1,  0,  5,  5,  0,  5,  5,  0,  0,
  0,  1,  1,  1,  1,  1,  1,  1,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  3,  0,  0,  3,  0,  0,  3,  3,  0,  0,  3,  0,  0,  3,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 10, 11, 10, 10, 11, 10, 10, 11, 12, 10, 10, 12, 10, 10, 12, 10,
];

const level_7 = [
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  5,  5,  5,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,  1,  1,  0,
  0,  0,  0,  0,  4,  4,  4,  0,  0,  1,  1,  1,  1,  1,  1,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,  1,  0,  0,
  0,  5,  5,  5,  0,  0,  0,  0,  0,  1,  1,  1,  1,  1,  0,  4,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,  1,  0,  0,
  0,  0,  0,  0,  4,  4,  4,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 10, 11, 10, 10, 11, 10, 10, 11, 12, 10, 10, 12, 10, 10, 12, 10,
];

const level_8 = [
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
   1,  1,  1,  1,  1,  1,  1,  1,  1,  0,  0,  1,  1,  1,  1,  1,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  10, 11, 10, 10, 11, 10, 10, 11, 12, 10, 10, 12, 10, 10, 12, 10,
];

const level_9 = [
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  4,  4,  4,  4,  4,  4,  5,  5,  5,  5,  5,  5,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  6,  6,  6,  6,  6,  6,  7,  7,  7,  7,  7,  7,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 10, 11, 10, 10, 11, 10, 10, 11, 12, 10, 10, 12, 10, 10, 12, 10,
];

// level number 0 bad for UI, and shifting +1 everywhere was awkward
var levelList = [level_0, level_1, level_2, level_3, level_4, level_5, level_6, level_7, level_8, level_9];