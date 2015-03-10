/*global require, window, console, module, document, setTimeout */
'use strict';
var scrollMove = {};

scrollMove.data = [];

scrollMove.setInitDate = function () {
  this.getInitDate = Date.now();
};

scrollMove.pushData = function (e) {
  var timeStamp = e.timeStamp - this.getInitDate;
  this.data.push({
    positionY: window.scrollY,
    time: timeStamp,
    type: e.type
  });
};

scrollMove.bindscrollMove = function () {
  document.onscroll = this.pushData.bind(this); //others
};

scrollMove.record = function () {
  scrollMove.setInitDate();
  scrollMove.bindscrollMove();
};

scrollMove.stop = function () {
  document.onscroll = null;
};

module.exports = scrollMove;