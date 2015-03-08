/*global window, console, module, document, setTimeout, $ */
'use strict';
var eventSim = {};

eventSim.click = function (x,y){
  var ev = document.createEvent('MouseEvent'),
      el = document.elementFromPoint(x - 5,y);
  
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

eventSim.mouseover = function (x,y,type) {
  var el = document.elementFromPoint(x - 5,y);
  
  if(el === undefined || typeof el.className.indexOf !== 'function') {
    return false;
  }

  if(el.className.indexOf('reproduce-hover') === -1) {
    el.className += ' reproduce-hover';
  } else {
    el.className = el.className.replace('reproduce-hover', '');
  }

  jQuery(el).trigger(type);
};

module.exports = eventSim;