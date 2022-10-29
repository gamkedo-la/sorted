const TILE_FIELD = 0;
const TILE_SLOW = 1;
const TILE_STUCK = 2;
const TILE_HALT = 3;
const TILE_BEND_LEFT = 4;
const TILE_BEND_RIGHT = 5;
const TILE_CONVEYOR_LEFT = 6;
const TILE_CONVEYOR_RIGHT = 7;
const TILE_CONVEYOR_UP = 8;
const TILE_CONVEYOR_DOWN = 9;

const TILE_DITCH = 10;
const TILE_PEN_BLUE = 11;
const TILE_PEN_RED = 12;
const FULL_BLUE = 13; // when sheep on pen
const FULL_RED = 14;
const FULL_DITCH = 15;

const TILE_DISTRACT = 16;
const TILE_UNSORT = 17;
const TILE_ROAD = 18;
const TILE_RAILS = 25;

const TILE_NAMES = ['Field', 'Slow', 'Stuck', 'Halt', 'Bend left', 'Bend right', 'Conveyor left', 'Conveyor right', 'Conveyor up', 'Conveyor down', 'Ditch', 'Pen blue', 'Pen red', 'Full pen blue', 'Full pen red', 'Full ditch', 'Distract', 'Unsort', 'Road', 'Centre', 'Yellow flower', 'Blue flower', 'Red flower', 'Bright forbs'];

const YELLOW_FLOWER = 20;
const BLUE_FLOWER = 21;
const RED_FLOWER = 22;
const BRIGHT_GRASS = 23;

var areaGrid = [];
var saveGrid = [];

// level 0 scratchpad for asset integration testing
const LEVEL_NAMES =["Testing", "Call and send", "Bends in field", "Dogs lick paint", "Bo Peep leads up", "Bends and dogs", "Western woods", "Eastern woods", "Carrots tempting", "Final challenge", "Tutorial"];

var levelTitleWidth = 200;
// = Array(NUM_LEVELS);
// for (var i=0; i < NUM_LEVELS; i++) {
//   levelTitleWidth[i] = measure;
// }


const level_0 = [
  25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  18,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
   0,  0,  3,  0,  0,  3,  0,  0,  3,  0,  0,  3,  0,  0,  0,  0,
   0,  0, 20,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
   0,  0,  0,  0,  0,  0,  0,  0,  0, 21,  0,  0,  0,  0,  0,  0,
   0,  0,  0,  3,  0,  0,  3,  0,  0,  3,  0,  0,  3,  0,  0,  0,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
   0,  0,  0, 23,  0,  0,  0,  0,  0,  0,  0,  0,  0, 22,  0,  0,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  10, 11, 10, 10, 11, 10, 10, 11, 12, 10, 10, 12, 10, 10, 12, 10,
];

const level_1 = [
 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25,
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
  25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
   0,  0, 20,  0,  0, 21,  0,  0, 22,  0,  0, 23,  0,  0,  0,  0,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
   0,  4,  1,  0,  3,  5,  0,  0,  0,  0,  4,  1,  1,  1,  1,  0,
   0,  0,  0,  0,  0,  0,  0,  4,  5,  0,  0,  0,  0,  0,  0,  0,
   1,  0,  1,  1,  0,  1,  0,  0,  0,  0,  1,  5,  5,  4,  4,  1,
   1,  0,  5,  4,  0,  1,  1,  0,  0,  1,  1,  0,  0,  0,  0,  1,
   1,  0,  0,  0,  0,  1,  5,  0,  0,  4,  1,  0,  0,  0,  0,  1,
   1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,
  10, 11, 10, 10, 11, 10, 10, 11, 12, 10, 10, 12, 10, 10, 12, 10,
];

const level_3 = [
  25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0,
  0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0,
  0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0,
  0,  0,  0,  0,  0,  0,  7,  0,  0,  6,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 10, 11, 10, 10, 11, 10, 10, 11, 12, 10, 10, 12, 10, 10, 12, 10,
];

const level_4 = [
  25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
   0,  1,  0,  0,  1,  0,  0,  0,  0,  0,  0,  1,  0,  0,  1,  0,
   0,  1,  0,  0,  1,  0,  0,  0,  0,  0,  0,  1,  0,  0,  1,  0,
   0,  1,  0,  0,  1,  0,  0,  0,  0,  0,  0,  1,  0,  0,  1,  0,
   0,  2,  0,  0,  2,  0,  0,  0,  0,  0,  0,  2,  0,  0,  2,  0,
   1,  0,  5,  5,  0,  5,  5,  0,  0,  4,  4,  0,  4,  4,  0,  1,
   5,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  10, 11, 10, 10, 11, 10, 10, 11, 12, 10, 10, 12, 10, 10, 12, 10,
];

const level_5 = [
  25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
   4,  0,  4,  4,  0,  4,  4,  0,  0,  5,  5,  0,  5,  5,  0,  5,
   0,  1,  0,  0,  1,  0,  0,  1,  1,  0,  0,  1,  0,  0,  1,  0,
   0,  1,  0,  0,  1,  0,  0,  1,  1,  0,  0,  1,  0,  0,  1,  0,
   0,  1,  0,  0,  1,  0,  0,  1,  1,  0,  0,  1,  0,  0,  1,  0,
   0,  1,  0,  0,  1,  0,  0,  1,  1,  0,  0,  1,  0,  0,  1,  0,
   5,  5,  0,  0,  5,  0,  0,  0,  0,  0,  0,  4,  0,  0,  4,  4,
   0,  0,  0,  0,  0,  5,  0,  5,  4,  0,  4,  0,  0,  0,  0,  0,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  10, 11, 10, 10, 11, 10, 10, 11, 12, 10, 10, 12, 10, 10, 12, 10,
];

const level_6 = [
  25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
   0,  1,  1,  1,  1,  1,  1,  1,  0,  0,  0,  0,  0,  0,  0,  0,
   0,  1,  1,  1,  1,  1,  1,  1,  0,  0,  0,  3,  0,  0,  3,  0,
   0,  1,  1,  1,  1,  1,  1,  1,  1,  0,  0,  0,  0,  0,  0,  0,
   0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0,  0,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  4,  4,  0,  0,  0,  0,
   0,  3,  0,  4,  3,  0,  4,  3,  0,  0,  0,  0,  4,  4,  0,  0,
   0,  0,  4,  0,  0,  4,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  10, 11, 10, 10, 11, 10, 10, 11, 12, 10, 10, 12, 10, 10, 12, 10,
];

const level_7 = [
  25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  5,  5,  5,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,  1,  1,  0,
  0,  0,  0,  0,  4,  4,  1,  0,  0,  1,  1,  1,  1,  1,  1,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,  1,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,  1,  0,  4,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,  1,  0,  0,
  0,  0,  0,  0,  4,  4,  5,  0,  0,  4,  4,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
 10, 11, 10, 10, 11, 10, 10, 11, 12, 10, 10, 12, 10, 10, 12, 10,
];

const level_8 = [
  25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
   4,  0,  4,  0,  4,  0,  4,  0,  4,  0,  4,  0,  4,  0,  4,  0,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
   1,  1,  1,  1,  1,  1,  1,  1,  1,  0,  0,  1,  1,  1,  1,  1,
   1,  0,  0,  1,  0,  0,  7,  0,  0,  6,  0,  0,  1,  0,  0,  1,
   7,  0,  0,  7,  0,  0,  0,  0,  0,  0,  0,  0,  6,  0,  0,  6,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  10, 11, 10, 10, 11, 10, 10, 11, 12, 10, 10, 12, 10, 10, 12, 10,
];

const level_9 = [
  25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
   4,  0,  0,  0,  0,  0,  0,  3,  3,  0,  0,  0,  0,  0,  0,  5,
   0,  4,  1,  1,  1,  5,  1,  1,  1,  1,  4,  1,  1,  1,  5,  0,
   0,  0,  4,  1,  1,  1,  5,  1,  1,  4,  1,  1,  1,  5,  0,  0,
   0,  0,  0,  4,  0,  0,  0,  0,  0,  0,  0,  0,  5,  0,  0,  0,
   0,  0,  0,  0,  4,  0,  0,  0,  0,  0,  0,  5,  0,  0,  0,  0,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
   7,  0,  0,  0,  0,  4,  0,  0,  0,  0,  5,  0,  0,  0,  0,  6,
   0,  0,  4,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  5,  0,  0,
  10, 11, 10, 10, 11, 10, 10, 11, 12, 10, 10, 12, 10, 10, 12, 10,
];

// for Tutorial
const level_10 = [
  25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
   0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0,
   0,  0,  5,  5,  0,  5,  5,  0,  0,  4,  4,  0,  4,  4,  0,  0,
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  10, 11, 10, 10, 11, 10, 10, 11, 12, 10, 10, 12, 10, 10, 12, 10,
];

// level number 0 bad for UI, and shifting +1 everywhere was awkward
var levelList = [level_0, level_1, level_2, level_3, level_4, level_5, level_6, level_7, level_8, level_9, level_10];