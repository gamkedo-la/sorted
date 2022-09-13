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
            var nextX = nextColumnCentre(player.x, -1);
            if (nextX > gameCanvas.width) {
              nextX = TILE_W / 2;
            } else if (nextX < 0) {
              nextX = gameCanvas.width - TILE_W / 2;
            }
            player.gotoX = nextX;
            console.log("gotoX " + player.gotoX + " from " + player.x)
            // player.keyHeld_left = true;
            // touchArrowHandling(LEFT);
            break;

          case "Right":
            player.gotoX = nextColumnCentre(player.x, +1);
            console.log("gotoX " + player.gotoX + " from " + player.x)
            // player.keyHeld_right = true;
            // touchArrowHandling(RIGHT);
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


///////////////////////////////////////////
function ui_mouseupHandler(evt) {
  // var mousePos = getMousePos(evt);
  if(gameState ==  STATE_PLAY) {
    for (var i = 0; i < playButtonLabel.length; i++) {
      if (xyIsInRect(mouse, buttonRects[i])) {

        switch (playButtonLabel[i]) {

          case "Left":
            // player.keyHeld_left = false;
            // touchArrowDebug();
            break;

          case "Right":
            break;

          case "Call":
            // player.keyHeld_call = false;
            // not needed since there is a timer before next Call allowed
            break;

          case "Send":
            // code inefficient without setting false, but works
            if(TOUCH_TEST) {
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