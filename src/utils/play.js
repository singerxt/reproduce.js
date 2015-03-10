/*global require, window, console, module, document, setTimeout */
'use strict';

var play = {},
    eventSim = require('../events/eventSimulation'),
    CircularJSON = require('circular-json');

play.start = function (data) {
  var fakeMouse = document.createElement('div');
  fakeMouse.style.backgroundColor = '#00ff00';
  fakeMouse.style.position = 'fixed';
  fakeMouse.style.top = 0;
  fakeMouse.style.left = 0;
  fakeMouse.style.height = '4px';
  fakeMouse.style.width = '4px';
  fakeMouse.style.zIndex = '99999999999';
  fakeMouse.class = 'fake-mouse';

  document.body.appendChild(fakeMouse);

  if (data !== undefined) {
    data = CircularJSON.parse(data);
  } else {
    console.warn('data not found!');
    return false;
  }

  for(var i = 0; i < data.length; i++) {
    (function(index, data) {
      setTimeout(function() {
        if (data[index].type === 'mousemove') {
          fakeMouse.style.top = data[index].posY.toString() + 'px';
          fakeMouse.style.top = data[index].posY + 'px';
          fakeMouse.style.left = data[index].posX + 'px';
        } else if (data[index].type === 'resize') {
          document.body.style.width = data[index].width  + 'px';
        } else if (data[index].type === 'click') {
          eventSim.click(data[index].posX, data[index].posY);
        } else if (data[index].type === 'scroll') {
          window.scroll(0, data[index].positionY);
        } else if (data[index].type === 'mouseover') {
          eventSim.mouseover(data[index].posX, data[index].posY, 'mouseover');
        } else if (data[index].type === 'mouseout') {
          eventSim.mouseover(data[index].posX, data[index].posY, 'out');
        }
        
        if(index === data.length - 1) {
          console.log('completed..');
        }
      }, data[index].time);
    })(i, data);
  }
};

module.exports = play;