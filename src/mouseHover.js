/*global require, window, console, module, setTimeout */
'use strict';
var mouseHover = {},
    eventSim = require('./eventSimulation');

mouseHover.setInitDate = function () {
  this.getInitDate = Date.now();
};

mouseHover.data = [];

mouseHover.pushData = function (e) {
  var timeStamp = e.timeStamp - this.getInitDate;
  mouseHover.data.push({
    type: e.type,
    target: e.target,
    time: timeStamp,
    posY: e.y,
    posX: e.x
  });
};

mouseHover.record = function () {
  mouseHover.setInitDate();
  window.onmouseover = mouseHover.pushData.bind(this);
};

mouseHover.stop = function () {
  window.onmouseover = null;
};

mouseHover.play = function () {
  for(var i = 0; i < mouseHover.data.length - 1; i++) {
    (function(index, mouseHover, eventSim) {
      setTimeout(function() {
        eventSim.mouseover(mouseHover.data[index].posX, mouseHover.data[index].posY, 'mouseover');
      }, mouseHover.data[index].time);
      setTimeout(function () {
        eventSim.mouseover(mouseHover.data[index].posX, mouseHover.data[index].posY, 'mouseout');
      }, mouseHover.data[index + 1].time - 200);
    })(i, mouseHover, eventSim);
  }
};

module.exports = mouseHover;