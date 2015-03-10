/*global require, window, console, module, document, setTimeout */
'use strict';

var mouseClick = {},
    eventSim = require('./eventSimulation');

mouseClick.setInitDate = function () {
  this.getInitDate = Date.now();
};

mouseClick.data = [];

mouseClick.pushData = function (e) {
  var timeStamp = e.timeStamp - this.getInitDate;

  mouseClick.data.push({
    time: timeStamp,
    posY: e.y,
    posX: e.x,
    type: e.type
  });
};

mouseClick.record = function () {
  mouseClick.setInitDate();
  window.onclick = mouseClick.pushData.bind(this);
};

mouseClick.stop = function () {
  window.onclick = null;
};

module.exports = mouseClick;