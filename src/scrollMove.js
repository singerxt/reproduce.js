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
    time: timeStamp
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

scrollMove.play = function () {
  for(var i = 0; i < scrollMove.data.length; i++) {
    (function(index, scrollMove) {
      setTimeout(function() {
        window.scroll(0, scrollMove.data[index].positionY);
      }, scrollMove.data[index].time);
    })(i, scrollMove);
  }
};

module.exports = scrollMove;