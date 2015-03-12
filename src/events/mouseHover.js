'use strict';
var mouseHover = {};

mouseHover.setInitDate = function () {
  this.getInitDate = Date.now();
};

mouseHover.data = [];

mouseHover.pushData = function (e) {
  var timeStamp = e.timeStamp - this.getInitDate;

  mouseHover.data.push({
    type: e.type,
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

module.exports = mouseHover;