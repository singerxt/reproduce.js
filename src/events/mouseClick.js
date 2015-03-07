/*global require, window, console, module, document, setTimeout */
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
    posX: e.x
  });
};

mouseClick.record = function () {
  mouseClick.setInitDate();
  window.onclick = mouseClick.pushData.bind(this);
};

mouseClick.stop = function () {
  window.onclick = null;
};

mouseClick.play = function () {
  for(var i = 0; i < mouseClick.data.length; i++) {
    (function(index, mouseClick, eventSim) {
      setTimeout(function() {
        eventSim.click(mouseClick.data[index].posX, mouseClick.data[index].posY);
      }, mouseClick.data[index].time);
    })(i, mouseClick, eventSim);
  }
};

module.exports = mouseClick;