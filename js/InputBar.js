// when click/tap UI bar on right side of display
function ui_mousedownHandler() {

  if (runMode == GAME_OVER) {
    for (var i = 0; i < gameoverButtonLabel.length; i++) {
      if (xyIsInRect(uiPos, buttonRects[i])) {

        buttonDown = i;

        switch (gameoverButtonLabel[i]) {

          case "Credits":
            gotoCredits("canvasButton");
            break;

          case "Music":
            musicToggle();
            break;

          case "Quit":
            window.close();
            break;
        }
      }
    }
  }

  else if (gameState == STATE_MENU) {

    if (currentLevel > LAST_LEVEL) {
      menuButtonLabel = ["Help", "Music", "Score", "Credits", "Quit"];
      console.log('No more levels!');
      return;
    }

    for (var i = 0; i < menuButtonLabel.length; i++) {
      // report( buttonRects[i] );
      if (xyIsInRect(uiPos, buttonRects[i])) {
        buttonDown = i;
        // report('Button down ' + i + ' ' + menuButtonLabel[i], 2)

        switch (menuButtonLabel[i]) {
          case "Play":
            gotoPlay("canvasButton");
            break;

          case "Tutor":
            gotoGuide("button Guide(Tutorial)")
            break;

          case "Score":
            gotoScore("canvasButton");
            break;

          case "Help":
            gotoHelp("canvasButton");
            break;

          case "Music":
            musicToggle();
            break;

          case "Credits":
            gotoCredits("canvasButton");
            break;

          case "Quit":
            window.close();
            break;

          // case "Editor":
          //   editMode = true;
          //   break;
        }
      } // if click/tap inside button area
    }
  }

  // else if (gameState == STATE_PLAY || gameState == STATE_GUIDE) {
  else if (gameState == STATE_PLAY) {

    if (paused) {
      for (var i = 0; i < pauseButtonLabel.length; i++) {
        if (xyIsInRect(uiPos, buttonRects[i])) {
          // buttonDown = i;
          switch (pauseButtonLabel[i]) {
            case "Go":
              togglePause();
          }
        }
      }
    }

    else { // not Paused
      for (var i = 0; i < playButtonLabel.length; i++) {
        if (xyIsInRect(uiPos, buttonRects[i])) {
          buttonDown = i;
          if (TOUCH_TEST) {
            report("Clicked inside rect " + playButtonLabel[i], 2);
          }

          buttonHeld = playButtonLabel[i];

          switch (playButtonLabel[i]) {
            case "Left":
              player.button_left = true;
              hatDirection(-1);
              hatMoveLongSound.play(hatVolume);
              break;

            case "Right":
              player.button_right = true;
              hatDirection(1);
              hatMoveLongSound.play(hatVolume);
              break;

            case "Call":
              player.keyHeld_call = true;
              break;

            case "Send":
              player.keyHeld_send = true;
              break;

            case "Menu":
              if (gameState == STATE_GUIDE) {
                // levelRunning = false;
                gotoMenu("Guide's button Menu");
              }
              gotoMenu("Play's button Menu");
              break;

            case "Pause":
              togglePause();
              break;

            case "End":
              if (gameState == STATE_PLAY) {
                levelEnding();
              }
              break;
          }
        }
      }
    }
  }

  else if (gameState == STATE_GUIDE) {

    if (paused) {
      for (var i = 0; i < pauseButtonLabel.length; i++) {
        if (xyIsInRect(uiPos, buttonRects[i])) {
          buttonDown = i;
          switch (pauseButtonLabel[i]) {
            case "Go":
              togglePause();
          }
        }
      }
    }

    else { // not Paused
      for (var i = 0; i < playButtonLabel.length; i++) {
        if (xyIsInRect(uiPos, buttonRects[i])) {
          buttonDown = i;
          if (TOUCH_TEST) {
            report("Clicked inside rect " + tutorialButtonLabel[i], 2);
          }

          switch (playButtonLabel[i]) {
            case "Left":
              player.button_left = true;
              hatDirection(-1);
              hatMoveLongSound.play(hatVolume);

              whenTutorialStep2();
              break;

            case "Right":
              player.button_right = true;
              hatDirection(1);
              hatMoveLongSound.play(hatVolume);

              whenTutorialStep2();
              break;

            case "Call":
              player.keyHeld_call = true;
              break;

            case "Send":
              player.keyHeld_send = true;
              break;

            case "Menu":
              // levelRunning = false;
              gotoMenu("Guide's button Menu");
              break;

            case "Pause":
              togglePause();
              break;

            case "End":
              if (tutorStep == 7) {
                tutorStep = 8;
                // levelEndTutorial();
              }
              break;
          }
        }
      }
    }
  }

  // currently only button is return to Menu, but will need
  // extra buttons for Replay and Adavance to next level.
  else if (gameState == STATE_LEVEL_END) {
    for (var i = 0; i < levelendButtonLabel.length; i++) {
      if (xyIsInRect(uiPos, buttonRects[i])) {
        // buttonDown = i;
        if (TOUCH_TEST) {
          report("Clicked inside rect", levelendButtonLabel[i], 1);
        }
        switch (levelendButtonLabel[i]) {

          case "Menu":
            gotoMenu("LevelEnd's canvasButton Menu");
            break;

          case "Replay":
            gotoReplay("LevelEnd's canvasButton Menu");
            break;

          case "Next":
            gotoAdvance("LevelEnd's canvasButton Menu");
            break;

          case "Pause":
            togglePause();
            break;
        }
      }
    }
  }

  else if (gameState == STATE_CREDITS) {
    for (var i = 0; i < creditsButtonLabel.length; i++) {
      if (xyIsInRect(uiPos, buttonRects[i])) {

        switch (creditsButtonLabel[i]) {

          case "Menu":
            goFromCredits("button");
            break;

          case "Pause":
            togglePause();
            break;
        }
      }
    }
  }

  else if (requireButtonGotoMenu()) {
    // could set Menu button at slot [4] or elsewhere
    if (xyIsInRect(uiPos, buttonRects[0])) {
      // buttonDown = i;
      if (gameState == STATE_SCOREBOARD) {
        goFromScore("Scoreboard, button")
      }
      else if (gameState == STATE_HELP) {
        goFromHelp("Scoreboard, button")
      }
      else {
        gotoMenu("Tutorial, button");
      }
    }
  }
} // end of ui_mousedownHandler


///////////////////////////////////////////
function ui_mouseupHandler(evt) {
  // var mousePos = getMousePos(evt);
  // console.log('ui_mouseupHandler')
  if (gameState == STATE_PLAY || gameState == STATE_GUIDE) {

    switch (buttonHeld) {

      case "Left":
        player.button_left = false;
        // hatMoveLongSound.stop();
        break;

      case "Right":
        player.button_right = false;
        // hatMoveLongSound.stop();
        break;

      case "Call":
        player.keyHeld_call = false;
        // not needed if there is a timer before next Call allowed
        break;

      case "Send":
        // code inefficient without setting false, but works
        if (TOUCH_TEST) {
          report("Avoid setting false keyHeld_send via mouseup, because (on Touch devices) true from mousedown gets negated immediately", 1);
        } else {
          player.keyHeld_send = false;
          // report("keyHeld_send = false because not Touch device", 1 );
        }
        break;
    }
  }
  buttonDown = null;
}



