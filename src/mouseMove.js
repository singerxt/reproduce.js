/*global require, window, console, module, document, setTimeout */

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
    time: timeStamp
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

mouseMove.play = function () {
  var fakeMouse = document.createElement('div');
  fakeMouse.style.backgroundColor = '#00ff00';
  fakeMouse.style.position = 'fixed';
  fakeMouse.style.top = 0;
  fakeMouse.style.left = 0;
  fakeMouse.style.height = '10px';
  fakeMouse.style.width = '10px';
  fakeMouse.style.zIndex = '99999999999';
  fakeMouse.class = 'fake-mouse';

  document.body.appendChild(fakeMouse);

  console.info('record starting');
  for(var i = 0; i < mouseMove.data.length; i++) {
    (function(index, fakeMouse, mouseMove) {
      setTimeout(function() {
        fakeMouse.style.top = mouseMove.data[index].posY.toString() + 'px';
        fakeMouse.style.top = mouseMove.data[index].posY + 'px';
        fakeMouse.style.left = mouseMove.data[index].posX + 'px';
        if(index === mouseMove.data.length - 1) {
          fakeMouse.parentNode.removeChild(fakeMouse);
          console.info('record completed');
        }
      }, mouseMove.data[index].time);
    })(i, fakeMouse, mouseMove);
  }
};

module.exports = mouseMove;