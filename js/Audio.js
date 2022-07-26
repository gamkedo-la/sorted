var musicInitialised = false;
var musicChosen = false;

var musicMenuVolume = 0.4;
var musicGameVolume = 0.05;
var musicMidVolume = 0.1;

var hatVolume = 0.6;

// var callSound = new SoundOverlapsClass("sound/call_1_quiet");
var callSound = new SoundOverlapsClass("sound/dog_whistle_66546");
var hatMoveShortSound = new SoundOverlapsClass("sound/hat_moving_short");
var hatMoveLongSound = new SoundOverlapsClass("sound/hat_moving_long");
// var hatMoveLongSound = new SoundOverlapsClass("sound/hat_clamp_moving");

var calledArrivalSound = new SoundOverlapsClass("sound/clamp_arrival_quiet");
var sentSound = new SoundOverlapsClass("sound/send_short");

var gateSound = new SoundOverlapsClass("sound/gate_close");

var stuckSound = new SoundOverlapsClass("sound/mud_splosh_563659");
var ditchSound = new SoundOverlapsClass("sound/baa08");

var bendLeftSound = new SoundOverlapsClass("sound/bend_left");
var bendRightSound = new SoundOverlapsClass("sound/bend_right");

var haltedSound = new SoundOverlapsClass("sound/duck_quack");
var haltedSound2 = new SoundOverlapsClass("sound/goose_1");

var slowTileSound = new SoundOverlapsClass("sound/woods_quiet_419052");

var pennedSound = new SoundOverlapsClass("sound/baa17");

var wrongpenSound = new SoundOverlapsClass("sound/error_trombone");

var lorryCorrectSound = new SoundOverlapsClass("sound/goat_2");

var lorryWrongSound = new SoundOverlapsClass("sound/lorry_wrong_team");

var rogueSound = new SoundOverlapsClass("sound/woof01");
var rogueSound2 = new SoundOverlapsClass("sound/woof02");

var menuChoiceSound = new SoundOverlapsClass("sound/menu_choice_2");
var menuBackSound = new SoundOverlapsClass("sound/menuback");

var gameMusic = new BackgroundMusicClass();

// on iPad javascript HTML5 doesn't control volume, always plays Maximum 1.0
var victory_music = new SoundOverlapsClass("sound/victory_music_ipad");
// var victory_music = new SoundOverlapsClass("sound/victory_music");


function musicToggle() {
  if (musicInitialised) {
    gameMusic.stopMusic();
    musicInitialised = false;
    buttonDown = null;
  } 
  else {
    gameMusic.loopSong("sound/pastoral_music");
    gameMusic.alterVolume(musicMenuVolume);
    musicInitialised = true;
    musicChosen = true;
    buttonDown = 3;
  }
}


function startMidMusic() {
  if (musicInitialised) {
    // gameMusic.alterVolume(musicMidVolume);
  } 
  else {
    gameMusic.loopSong("sound/pastoral_music");
    gameMusic.alterVolume(musicMidVolume);
    musicInitialised = true;
  }
}

function endMidMusic() {
  if (musicChosen) {
    // gameMusic.alterVolume(musicMenuVolume);
  } 
  else {
    gameMusic.stopMusic();
    musicInitialised = false;
  }
}