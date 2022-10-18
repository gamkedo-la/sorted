// when click/tap UI bar on right side of display
function ui_mousedownHandler() {

  if (gameState == STATE_MENU) {

    for (var i = 0; i < menuButtonLabel.length; i++) {
      // report( buttonRects[i] );
      if (xyIsInRect(uiPos, buttonRects[i])) {
        report('Button down ' + i + ' ' + menuButtonLabel[i], 2)

        switch (menuButtonLabel[i]) {
          case "Play":
            if (!levelRunning) { // otherwise return to level mid-play
              levelRunning = true;
              currentLevel++;
              loadLevel(currentLevel);
              checkGridMatchColsRows();
            }
            gotoPlay("canvasButton");
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

          // not working yet
          case "Quit":
            console.log('Sorry not working yet');
            window.close();
            break;

          // case "Editor":
          //   editMode = true;
          //   break;
        }
      } // if click/tap inside button area
    }
  }

  else if (gameState == STATE_PLAY || gameState == STATE_TUTOR) {

    if (paused) {
      for (var i = 0; i < pauseButtonLabel.length; i++) {
        if (xyIsInRect(uiPos, buttonRects[i])) {
          switch (pauseButtonLabel[i]) {
            case "Resume":
              togglePause();
          }
        }
      }

    } else { // not Paused
      for (var i = 0; i < playButtonLabel.length; i++) {
        if (xyIsInRect(uiPos, buttonRects[i])) {

          if (TOUCH_TEST) {
            report("Clicked inside rect " + playButtonLabel[i], 2);
          }

          switch (playButtonLabel[i]) {
            case "Left":
              player.button_left = true;
              // console.log('button left')
              // player.direction = -1; // left
              // player.keyHeld_left = true;
              break;

            case "Right":
              player.button_right = true;
              // player.keyHeld_right = true;
              // console.log('button right')
              // player.direction = +1; // right
              break;

            case "Call":
              player.keyHeld_call = true;
              break;

            case "Send":
              player.keyHeld_send = true;
              break;

            case "Menu":
              gotoMenu("Play's CanvasButton Menu");
              break;

            case "Pause":
              togglePause();
              break;

            case "End":
              levelEnding();
              // gotoMenu("Play's CanvasButton Quit");
              break;
          }
        }
      }
    }
  }

  // currently only button is return to Menu, but will need
  // extra buttons for Replay and Adavance to next level.
  else if (gameState == STATE_LEVEL_END) {
    for (var i = 0; i < levelEndButtonLabel.length; i++) {
      if (xyIsInRect(uiPos, buttonRects[i])) {
        if (TOUCH_TEST) {
          report("Clicked inside rect", levelEndButtonLabel[i], 1);
        }
        switch (levelEndButtonLabel[i]) {

          case "Menu":
            gotoMenu("LevelEnd's canvasButton Menu");
            break;

          case "Replay":
            gotoReplay("LevelEnd's canvasButton Menu");
            break;

          case "Advance":
            gotoAdvance("LevelEnd's canvasButton Menu");
            break;
        }
      }
    }
  }

  else if (requireButtonGotoMenu()) {
    // could set Menu button at slot [4] or elsewhere
    if (xyIsInRect(uiPos, buttonRects[0])) {
      gotoMenu("button");
    }
  }
} // end of ui_mousedownHandler


///////////////////////////////////////////
function ui_mouseupHandler(evt) {
  // var mousePos = getMousePos(evt);
  if (gameState == STATE_PLAY) {
    for (var i = 0; i < playButtonLabel.length; i++) {
      if (xyIsInRect(mouse, buttonRects[i])) {

        switch (playButtonLabel[i]) {

          case "Left":
            player.button_left = true;
            break;

          case "Right":
            player.button_right = false;
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
    }
  }
}