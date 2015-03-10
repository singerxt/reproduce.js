'use strict';

var mouseMove = require('./events/mouseMove'),
    mouseClick = require('./events/mouseClick'),
    scrollMove = require('./events/scrollMove'),
    mouseHover = require('./events/mouseHover'),
    resize = require('./events/resize'),
    styles = require('./utils/styles'),
    play = require('./utils/play'),
    CircularJSON = require('circular-json'),
    orginalTitle = document.title;

window.onload = function () {
  styles.appendReproduceStyles();
};

window.record = function () {
  console.info('recording...');
  mouseClick.record();
  mouseMove.record();
  scrollMove.record();
  mouseHover.record();
  resize.record();
  document.title = 'recording...';
};

window.stop = function () {
  console.info('stop!');
  mouseClick.stop();
  mouseMove.stop();
  scrollMove.stop();
  mouseHover.stop();
  resize.stop();
  document.title = orginalTitle;
};

window.play = function () {
  var data = getData();
  play.start(data);
};

window.getData = function () {
  var data = [],
      compare = function (a,b) {
        if(a.time < b.time) {return -1;}
        if(a.time > b.time) {return 1;}
        return 0;
      };

  data = data.concat(mouseClick.data, mouseMove.data, scrollMove.data, mouseHover.data, resize.data);
  data = data.sort(compare);
  return CircularJSON.stringify(data);
};

window.setData = function (data) {
  data = CircularJSON.parse(data);
  return data;
};

