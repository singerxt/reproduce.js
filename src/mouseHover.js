/*global require, window, console, module, document, setTimeout */
var mouseHover = {},
    eventSim = require('./eventSimulation');

mouseHover.setInitDate = function () {
  this.getInitDate = Date.now();
};

mouseHover.data = [];

mouseHover.pushData = function (e) {
  var timeStamp = e.timeStamp - this.getInitDate;
  console.log(e.type);
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
  window.onmouseout = mouseHover.pushData.bind(this);
};

mouseHover.stop = function () {
  window.onmouseover = null;
  window.onmouseout = null;
};

mouseHover.play = function () {
  for(var i = 0; i < mouseHover.data.length; i++) {
    (function(index, mouseHover, eventSim) {
      setTimeout(function() {
        eventSim.mouseover(mouseHover.data[index].posX, mouseHover.data[index].posY, mouseHover.data[index].type);
      }, mouseHover.data[index].time);
    })(i, mouseHover, eventSim);
  }
};

module.exports = mouseHover;