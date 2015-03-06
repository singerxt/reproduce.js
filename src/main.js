'use strict';
var mouseMove = require('./events/mouseMove'),
    mouseClick = require('./events/mouseClick'),
    scrollMove = require('./events/scrollMove'),
    mouseHover = require('./events/mouseHover'),
    orginalTitle = document.title;

window.record = function record () {
  console.info('recording...');
  mouseClick.record();
  mouseMove.record();
  scrollMove.record();
  mouseHover.record();
  document.title = 'recording...';
};

window.stop = function stop () {
  console.info('stop!');
  mouseClick.stop();
  mouseMove.stop();
  scrollMove.stop();
  mouseHover.stop();
  document.title = orginalTitle;
  
};

window.play = function play () {
  mouseClick.play();
  mouseMove.play(orginalTitle);
  scrollMove.play();
  mouseHover.play();
  document.title = 'playing...';
};

