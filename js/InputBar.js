// when click/tap UI bar on right side of display
function ui_mousedownHandler() {
  if (gameState == STATE_MENU) {

    for (var i = 0; i < menuButtonLabel.length - 1; i++) {
      // report( buttonRects[i] );
      if (xyIsInRect(uiPos, buttonRects[i])) {
        report('Button down ' + i + ' ' + menuButtonLabel[i], 2)

        switch (menuButtonLabel[i]) {
          case "Play":
            if(!levelRunning) { // otherwise return to level mid-play
              levelRunning = true;
              playLevel++;
              currentLevel = playLevel;
              loadLevel(playLevel);
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

  else if (gameState == STATE_PLAY) {
    for (var i = 0; i < playButtonLabel.length; i++) {
      if (xyIsInRect(uiPos, buttonRects[i])) {

        if(TOUCH_TEST) {
          report("Clicked inside rect " + playButtonLabel[i], 2);
        }

        switch (playButtonLabel[i]) {
          case "Left":
            player.keyHeld_left = true;
            touchArrowHandling(LEFT);
            break;

          case "Right":
            player.keyHeld_right = true;
            touchArrowHandling(RIGHT);
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
        }
      }
    }
  }

  // currently only button is return to Menu, but will need
  // extra buttons for Replay and Adavance to next level.
  else if (gameState == STATE_LEVEL_OVER) {
    for (var i = 0; i < playButtonLabel.length; i++) {
      if (xyIsInRect(uiPos, buttonRects[i])) {
        if(TOUCH_TEST) {
          report("Clicked inside rect", playButtonLabel[i], 1);
        }
        switch (playButtonLabel[i]) {
          case "Menu":
            gotoMenu("LevelOver's CanvasButton Menu");
            break;
        }
      }
    }
  }

  else if (requireButtonGotoMenu()) {
    // could set Menu button at slot [4] or elsewhere
    if (xyIsInRect(uiPos, buttonRects[0])) {
      gameState = STATE_MENU;
      gotoMenu("DesignLevel's CanvasButton Menu");
    }
  }
} // end of ui_mousedownHandler