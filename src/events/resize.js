/*global window, module, document */
'use strict';
var resize = {};

resize.data = [];

resize.setInitDate = function () {
  this.getInitDate = Date.now();
};

resize.pushData = function (e) {
  var timeStamp = e.timeStamp - this.getInitDate;
  this.data.push({
    width: window.innerWidth,
    time: timeStamp,
    type: e.type
  });
};

resize.bindresize = function () {
  window.onresize = this.pushData.bind(this); //others
  this.pushData({
    timeStamp: 0,
    type: 'resize'
  });
};

resize.record = function () {
  resize.setInitDate();
  resize.bindresize();
};

resize.stop = function () {
  document.onscroll = null;
};

module.exports = resize;