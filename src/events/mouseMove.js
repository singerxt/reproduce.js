/*global, window, console, module, document, setTimeout */
'use strict';
var mouseMove = {};

mouseMove.data = [];

mouseMove.setInitDate = function () {
  this.getInitDate = Date.now();
};

mouseMove.pushData = function (e) {
  var timeStamp = e.timeStamp - this.getInitDate;
  this.data.push({
    posY: e.y,
    posX: e.x,
    time: timeStamp,
    type: e.type
  });
};

mouseMove.bindMouseMove = function () {
  window.onmousemove = this.pushData.bind(this);
};

mouseMove.record = function () {
  mouseMove.setInitDate();
  mouseMove.bindMouseMove();
};

mouseMove.stop = function () {
  window.onmousemove = null;
};

module.exports = mouseMove;