'use strict';

var mouseMove = require('./events/mouseMove'),
    mouseClick = require('./events/mouseClick'),
    scrollMove = require('./events/scrollMove'),
    mouseHover = require('./events/mouseHover'),
    resize = require('./events/resize'),
    styles = require('./utils/styles'),
    CircularJSON = require('circular-json'),
    orginalTitle = document.title;

window.onload = function () {
  styles.appendReproduceStyles();
};

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
  var helper,
  data = {
    mouseClick: mouseClick.data,
    mouseMove: mouseMove.data,
    scrollMove: scrollMove.data,
    mouseHover: mouseHover.data,
    resize: resize.data
  };

  helper = CircularJSON.stringify(data);
  helper = helper.replace(/\"/g, '\"');
  return CircularJSON.stringify(helper);
};

window.setData = function (data) {
  data = CircularJSON.parse(data);
  mouseClick.data = data.mouseClick;
  mouseMove.data = data.mouseMove;
  scrollMove.data  = data.scrollMove;
  mouseHover.data = data.mouseHover;
  resize.data = data.resize;
};

