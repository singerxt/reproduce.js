/*global require, window, console, module, document, setTimeout */
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
    time: timeStamp
  });
};

resize.bindresize = function () {
  window.onresize = this.pushData.bind(this); //others
};

resize.record = function () {
  resize.setInitDate();
  resize.bindresize();
};

resize.stop = function () {
  document.onscroll = null;
};

resize.play = function () {
  for(var i = 0; i < resize.data.length; i++) {
    (function(index, resize) {
      setTimeout(function() {
        document.body.style.width = resize.data[index].width  + 'px';
      }, resize.data[index].time);
    })(i, resize);
  }
};

module.exports = resize;