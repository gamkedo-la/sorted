// a way to play random sheep sounds

var baaVolume = 1.0; // volume of sheep sfx when entering pen
const AMBIENT_baaVolume_MAX = 0.05; // quietly
const AMBIENT_baaVolume_MIN = 0.01; // but not too quietly
const AMBIENT_BAA_CHANCE = 0.025; // rarely

var flock_sounds, baa_sounds; // arrays that init on demand

// play when a sheep enters a gate
function random_baa_sound(volume=0.5) {

  if (!baa_sounds) baa_sounds = [
    new SoundOverlapsClass("sound/baa01"),
    new SoundOverlapsClass("sound/baa02"),
    new SoundOverlapsClass("sound/baa03"),
    new SoundOverlapsClass("sound/baa04"),
    new SoundOverlapsClass("sound/baa08"),
    new SoundOverlapsClass("sound/baa09"),
    new SoundOverlapsClass("sound/baa10"),
    new SoundOverlapsClass("sound/baa11"),
    new SoundOverlapsClass("sound/baa12"),
    new SoundOverlapsClass("sound/baa13"),
    new SoundOverlapsClass("sound/baa14"),
    new SoundOverlapsClass("sound/baa15"),
    new SoundOverlapsClass("sound/baa16"),
    new SoundOverlapsClass("sound/baa17"),
    new SoundOverlapsClass("sound/baa18"),
    new SoundOverlapsClass("sound/baa19"),
  ];

  // play one of them randomly
  baa_sounds[Math.floor(Math.random()*baa_sounds.length)].play(volume);
}


// run every update() but only occasionally plays a sound
function flock_ambient_sounds() {

  // group and individual BAA sounds used for random ambience
  if (!flock_sounds) flock_sounds = [
    new SoundOverlapsClass("sound/baa01"),
    new SoundOverlapsClass("sound/baa02"),
    new SoundOverlapsClass("sound/baa03"),
    new SoundOverlapsClass("sound/baa04"),
    new SoundOverlapsClass("sound/baa05"),
    new SoundOverlapsClass("sound/baa06"),
    new SoundOverlapsClass("sound/baa07"),
    new SoundOverlapsClass("sound/baa08"),
    new SoundOverlapsClass("sound/baa09"),
    new SoundOverlapsClass("sound/baa10"),
    new SoundOverlapsClass("sound/baa11"),
    new SoundOverlapsClass("sound/baa12"),
    new SoundOverlapsClass("sound/baa13"),
    new SoundOverlapsClass("sound/baa14"),
    new SoundOverlapsClass("sound/baa15"),
    new SoundOverlapsClass("sound/baa16"),
    new SoundOverlapsClass("sound/baa17"),
    new SoundOverlapsClass("sound/baa18"),
    new SoundOverlapsClass("sound/baa19"),
  ];

  // play one of them randomly
  if (Math.random() < AMBIENT_BAA_CHANCE) {
    let volume = AMBIENT_baaVolume_MIN + Math.random() * (AMBIENT_baaVolume_MAX - AMBIENT_baaVolume_MIN);
    flock_sounds[Math.floor(Math.random()*flock_sounds.length)].play(volume);
  }
}
