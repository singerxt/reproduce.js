'use strict';
var mouseMove = require('./mouseMove'),
    mouseClick = require('./mouseClick'),
    scrollMove = require('./scrollMove'),
    mouseHover = require('./mouseHover'),
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

