var audioFormat;
var musicVolume = 0.3;

function setFormat() {
  var audio = new Audio();
  if (audio.canPlayType("audio/mp3")) { // 98.72% of browsers as of 2022
      audioFormat = ".mp3";
  } else {
      audioFormat = ".ogg"; // for the 1% running an obsolete browser
  }
}

function BackgroundMusicClass() {
  var musicSound = null;

  this.loopSong = function(filenameWithPath) {
    setFormat(); // calling to ensure audioFormat is set before needed

    if (musicSound != null) {
      musicSound.pause();
      musicSound = null;
    }
    musicSound = new Audio(filenameWithPath+audioFormat);
    musicSound.loop = true;
    musicSound.volume = musicVolume;
    musicSound.play();
  }

  this.startOrStopMusic = function() {
    if (musicSound.paused) {
      musicSound.play();
    } else {
      musicSound.pause();
    }
  }

  this.stopMusic = function() {
    musicSound.pause();
  }
  this.startMusic = function() {
    musicSound.play();
  }

  this.changeVolume = function(newVolume) {
    musicSound.volume = newVolume;
  }
}

function SoundOverlapsClass(filenameWithPath) {

  setFormat(); // calling this to ensure that audioFormat is set before needed

  var mainSound = new Audio(filenameWithPath+audioFormat);
  var altSound = new Audio(filenameWithPath+audioFormat);

  var altSoundTurn = false;

  this.play = function(volume=1) {
    if (altSoundTurn) { // no "this." prefix since "var" is local/private
      altSound.volume=volume;
      altSound.currentTime = 0;
      altSound.play();
    } else {
      mainSound.volume=volume;
      mainSound.currentTime = 0;
      mainSound.play();
    }
    altSoundTurn = !altSoundTurn; // toggle between true and false
  }

}