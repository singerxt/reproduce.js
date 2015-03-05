var mouseMove = require('./mouseMove'),
    mouseClick = require('./mouseClick'),
    scrollMove = require('./scrollMove'),
    mouseHover = require('./mouseHover');

window.record = function record () {
  console.info('recording...');
  mouseClick.record();
  mouseMove.record();
  scrollMove.record();
  mouseHover.record();
};

window.stop = function stop () {
  console.info('stop!');
  mouseClick.stop();
  mouseMove.stop();
  scrollMove.stop();
  mouseHover.stop();
};

window.play = function play () {
  mouseClick.play();
  mouseMove.play();
  scrollMove.play();
  mouseHover.play();
};

