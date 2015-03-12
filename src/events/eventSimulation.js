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


  ev.initMouseEvent(
    'click',
    true /* bubble */, 
    true /* cancelable */,
    window, null,
    x, y, 0, 0, /* coordinates */
    false, false, false, false, /* modifier keys */
    0 /*left*/, 
    null
  );
  el.dispatchEvent(ev);
  el.focus();
};

eventSim.lastMouseOver = {};

eventSim.mouseover = function (x,y,type) {
  var el = document.elementFromPoint(x,y);
  
  if(el === null) {
    return false;
  }

  if(type === 'mouseover') {
    el.className += ' reproduce-hover';
    $(el).trigger('mouseover');

    el = document.elementFromPoint(this.lastMouseOver.xPos, this.lastMouseOver.yPos);
    el.className = el.className.replace('reproduce-hover', '');
    $(el).trigger('mouseout');
    this.lastMouseOver = {
      xPos: x,
      yPos: y
    };
  }
};

module.exports = eventSim;