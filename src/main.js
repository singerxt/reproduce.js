'use strict';

var mouseMove = require('./events/mouseMove'),
    mouseClick = require('./events/mouseClick'),
    scrollMove = require('./events/scrollMove'),
    mouseHover = require('./events/mouseHover'),
    resize = require('./events/resize'),
    CircularJSON = require('circular-json'),
    orginalTitle = document.title;

window.record = function record () {
  console.info('recording...');
  mouseClick.record();
  mouseMove.record();
  scrollMove.record();
  mouseHover.record();
  resize.record();
  document.title = 'recording...';
};

window.stop = function stop () {
  console.info('stop!');
  mouseClick.stop();
  mouseMove.stop();
  scrollMove.stop();
  mouseHover.stop();
  resize.stop();
  document.title = orginalTitle;
  
};

window.play = function play () {
  mouseClick.play();
  mouseMove.play(orginalTitle);
  scrollMove.play();
  mouseHover.play();
  resize.play();
  document.title = 'playing...';
};

window.getData = function () {
  var data = {
    mouseClick: mouseClick.data,
    mouseMove: mouseMove.data,
    scrollMove: scrollMove.data,
    mouseHover: mouseHover.data,
    resize: resize.data
  };
  
  return CircularJSON.stringify(data);
};

window.setData = function (data) {
  data = CircularJSON.parse(data);
  console.log(data);
  mouseClick.data = data.mouseClick;
  mouseMove.data = data.mouseMove;
  scrollMove.data  = data.scrollMove;
  mouseHover.data = data.mouseHover;
  resize.data = data.resize;
};

