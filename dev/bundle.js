(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/mateusz/Desktop/reproduce/src/eventSimulation.js":[function(require,module,exports){
/*global window, console, module, document, setTimeout, $ */
'use strict';
var eventSim = {};

eventSim.click = function (x,y){
  var ev = document.createEvent('MouseEvent'),
      el = document.elementFromPoint(x + 20,y);
  
  /*
   *
   */

  el.style.border = '2px solid #ff00ff';
  el.style.opacity = '0.5';

  setTimeout(function () {
    el.style.opacity = '1.0';
    el.style.border = '';
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
};

eventSim.mouseover = function (x,y,type) {
  var el = document.elementFromPoint(x - 20,y);
  $(el).trigger(type);
};

module.exports = eventSim;
},{}],"/Users/mateusz/Desktop/reproduce/src/main.js":[function(require,module,exports){
'use strict';
var mouseMove = require('./mouseMove'),
    mouseClick = require('./mouseClick'),
    scrollMove = require('./scrollMove'),
    mouseHover = require('./mouseHover');

window.record = function record () {
  console.info('recording...');
  mouseClick.record();
  mouseMove.record();
  scrollMove.record();
  mouseHover.record();
};

window.stop = function stop () {
  console.info('stop!');
  mouseClick.stop();
  mouseMove.stop();
  scrollMove.stop();
  mouseHover.stop();
};

window.play = function play () {
  mouseClick.play();
  mouseMove.play();
  scrollMove.play();
  mouseHover.play();
};


},{"./mouseClick":"/Users/mateusz/Desktop/reproduce/src/mouseClick.js","./mouseHover":"/Users/mateusz/Desktop/reproduce/src/mouseHover.js","./mouseMove":"/Users/mateusz/Desktop/reproduce/src/mouseMove.js","./scrollMove":"/Users/mateusz/Desktop/reproduce/src/scrollMove.js"}],"/Users/mateusz/Desktop/reproduce/src/mouseClick.js":[function(require,module,exports){
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
    target: e.target,
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
},{"./eventSimulation":"/Users/mateusz/Desktop/reproduce/src/eventSimulation.js"}],"/Users/mateusz/Desktop/reproduce/src/mouseHover.js":[function(require,module,exports){
/*global require, window, console, module, setTimeout */
'use strict';
var mouseHover = {},
    eventSim = require('./eventSimulation');

mouseHover.setInitDate = function () {
  this.getInitDate = Date.now();
};

mouseHover.data = [];

mouseHover.pushData = function (e) {
  var timeStamp = e.timeStamp - this.getInitDate;
  mouseHover.data.push({
    type: e.type,
    target: e.target,
    time: timeStamp,
    posY: e.y,
    posX: e.x
  });
};

mouseHover.record = function () {
  mouseHover.setInitDate();
  window.onmouseover = mouseHover.pushData.bind(this);
};

mouseHover.stop = function () {
  window.onmouseover = null;
};

mouseHover.play = function () {
  for(var i = 0; i < mouseHover.data.length - 1; i++) {
    (function(index, mouseHover, eventSim) {
      setTimeout(function() {
        eventSim.mouseover(mouseHover.data[index].posX, mouseHover.data[index].posY, 'mouseover');
      }, mouseHover.data[index].time);
      setTimeout(function () {
        eventSim.mouseover(mouseHover.data[index].posX, mouseHover.data[index].posY, 'mouseout');
      }, mouseHover.data[index + 1].time - 200);
    })(i, mouseHover, eventSim);
  }
};

module.exports = mouseHover;
},{"./eventSimulation":"/Users/mateusz/Desktop/reproduce/src/eventSimulation.js"}],"/Users/mateusz/Desktop/reproduce/src/mouseMove.js":[function(require,module,exports){
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
},{}],"/Users/mateusz/Desktop/reproduce/src/scrollMove.js":[function(require,module,exports){
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
},{}]},{},["/Users/mateusz/Desktop/reproduce/src/main.js"]);
