'use strict';
var eventSim = {};

eventSim.click = function (x,y){
  var ev = document.createEvent('MouseEvent'),
      el = document.elementFromPoint(x,y);
  
  if(el === undefined) {
    return false;
  }

  el.style.opacity = '0.5';
  setTimeout(function () {
    el.style.opacity = '1.0';
  },200);
  ev.initMouseEvent('click', true, true, window, null, x, y, 0, 0, false, false, false, false, 0, null);
  el.dispatchEvent(ev);
};

eventSim.lastMouseOver = {};

eventSim.mouseover = function (x,y,type) {
  var el = document.elementFromPoint(x,y),
      ev = document.createEvent('MouseEvent');
  if(el === null) {
    return false;
  }

  if(type === 'mouseover') {
    el.className += ' reproduce-hover';
    ev.initMouseEvent('mouseover', true, true, window, null, x, y, 0, 0, false, false, false, false, 0, null);
    el.dispatchEvent(ev);
    ev.initMouseEvent('mouseout', true, true, window, null, x, y, 0, 0, false, false, false, false, 0, null);
    el = document.elementFromPoint(this.lastMouseOver.xPos, this.lastMouseOver.yPos);
    el.className = el.className.replace('reproduce-hover', '');
    el.dispatchEvent(ev);
    this.lastMouseOver = {
      xPos: x,
      yPos: y
    };
  }
};

module.exports = eventSim;