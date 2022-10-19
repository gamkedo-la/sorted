var callSound = new SoundOverlapsClass("sound/call_1_quiet");
var hatMoveSound = new SoundOverlapsClass("sound/hat_moving_quiet");
var hatMoveLongSound = new SoundOverlapsClass("sound/hat_clamp_moving");

var calledArrivalSound = new SoundOverlapsClass("sound/clamp_arrival_quiet");
var sentSound = new SoundOverlapsClass("sound/send_short");

var gateSound = new SoundOverlapsClass("sound/gate_close");

var stuckSound = new SoundOverlapsClass("sound/mud_splosh_563659");
var ditchSound = new SoundOverlapsClass("sound/baa08");

var bendLeftSound = new SoundOverlapsClass("sound/bend_left");
var bendRightSound = new SoundOverlapsClass("sound/bend_right");

var haltedSound = new SoundOverlapsClass("sound/duck_quack");
var slowTileSound = new SoundOverlapsClass("sound/woods_quiet_419052");

var pennedSound = new SoundOverlapsClass("sound/baa17");
var wrongpenSound = new SoundOverlapsClass("sound/error_trombone");

var rogueSound = new SoundOverlapsClass("sound/woof01");

var menuChoiceSound = new SoundOverlapsClass("sound/menu_choice_2");
var menuBackSound = new SoundOverlapsClass("sound/menuback");

var gameMusic = new BackgroundMusicClass();
var musicInitialised = false;


function musicToggle() {
  if (musicInitialised) {
    gameMusic.stopMusic();
    gameMusic = null;
    musicInitialised = false;
  } else {
    gameMusic.loopSong("sound/pastoral_music");
    musicInitialised = true;
  }
}