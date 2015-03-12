(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/mateusz/Desktop/reproduce/node_modules/circular-json/build/circular-json.node.js":[function(require,module,exports){
/*!
Copyright (C) 2013 by WebReflection

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
var
  // should be a not so common char
  // possibly one JSON does not encode
  // possibly one encodeURIComponent does not encode
  // right now this char is '~' but this might change in the future
  specialChar = '~',
  safeSpecialChar = '\\x' + (
    '0' + specialChar.charCodeAt(0).toString(16)
  ).slice(-2),
  escapedSafeSpecialChar = '\\' + safeSpecialChar,
  specialCharRG = new RegExp(safeSpecialChar, 'g'),
  safeSpecialCharRG = new RegExp(escapedSafeSpecialChar, 'g'),

  safeStartWithSpecialCharRG = new RegExp('(?:^|[^\\\\])' + escapedSafeSpecialChar),

  indexOf = [].indexOf || function(v){
    for(var i=this.length;i--&&this[i]!==v;);
    return i;
  },
  $String = String  // there's no way to drop warnings in JSHint
                    // about new String ... well, I need that here!
                    // faked, and happy linter!
;

function generateReplacer(value, replacer, resolve) {
  var
    path = [],
    all  = [value],
    seen = [value],
    mapp = [resolve ? specialChar : '[Circular]'],
    last = value,
    lvl  = 1,
    i
  ;
  return function(key, value) {
    // the replacer has rights to decide
    // if a new object should be returned
    // or if there's some key to drop
    // let's call it here rather than "too late"
    if (replacer) value = replacer.call(this, key, value);

    // did you know ? Safari passes keys as integers for arrays
    // which means if (key) when key === 0 won't pass the check
    if (key !== '') {
      if (last !== this) {
        i = lvl - indexOf.call(all, this) - 1;
        lvl -= i;
        all.splice(lvl, all.length);
        path.splice(lvl - 1, path.length);
        last = this;
      }
      // console.log(lvl, key, path);
      if (typeof value === 'object' && value) {
        lvl = all.push(last = value);
        i = indexOf.call(seen, value);
        if (i < 0) {
          i = seen.push(value) - 1;
          if (resolve) {
            // key cannot contain specialChar but could be not a string
            path.push(('' + key).replace(specialCharRG, safeSpecialChar));
            mapp[i] = specialChar + path.join(specialChar);
          } else {
            mapp[i] = mapp[0];
          }
        } else {
          value = mapp[i];
        }
      } else {
        if (typeof value === 'string' && resolve) {
          // ensure no special char involved on deserialization
          // in this case only first char is important
          // no need to replace all value (better performance)
          value = value .replace(safeSpecialChar, escapedSafeSpecialChar)
                        .replace(specialChar, safeSpecialChar);
        }
      }
    }
    return value;
  };
}

function retrieveFromPath(current, keys) {
  for(var i = 0, length = keys.length; i < length; current = current[
    // keys should be normalized back here
    keys[i++].replace(safeSpecialCharRG, specialChar)
  ]);
  return current;
}

function generateReviver(reviver) {
  return function(key, value) {
    var isString = typeof value === 'string';
    if (isString && value.charAt(0) === specialChar) {
      return new $String(value.slice(1));
    }
    if (key === '') value = regenerate(value, value, {});
    // again, only one needed, do not use the RegExp for this replacement
    // only keys need the RegExp
    if (isString) value = value .replace(safeStartWithSpecialCharRG, specialChar)
                                .replace(escapedSafeSpecialChar, safeSpecialChar);
    return reviver ? reviver.call(this, key, value) : value;
  };
}

function regenerateArray(root, current, retrieve) {
  for (var i = 0, length = current.length; i < length; i++) {
    current[i] = regenerate(root, current[i], retrieve);
  }
  return current;
}

function regenerateObject(root, current, retrieve) {
  for (var key in current) {
    if (current.hasOwnProperty(key)) {
      current[key] = regenerate(root, current[key], retrieve);
    }
  }
  return current;
}

function regenerate(root, current, retrieve) {
  return current instanceof Array ?
    // fast Array reconstruction
    regenerateArray(root, current, retrieve) :
    (
      current instanceof $String ?
        (
          // root is an empty string
          current.length ?
            (
              retrieve.hasOwnProperty(current) ?
                retrieve[current] :
                retrieve[current] = retrieveFromPath(
                  root, current.split(specialChar)
                )
            ) :
            root
        ) :
        (
          current instanceof Object ?
            // dedicated Object parser
            regenerateObject(root, current, retrieve) :
            // value as it is
            current
        )
    )
  ;
}

function stringifyRecursion(value, replacer, space, doNotResolve) {
  return JSON.stringify(value, generateReplacer(value, replacer, !doNotResolve), space);
}

function parseRecursion(text, reviver) {
  return JSON.parse(text, generateReviver(reviver));
}
this.stringify = stringifyRecursion;
this.parse = parseRecursion;
},{}],"/Users/mateusz/Desktop/reproduce/src/events/eventSimulation.js":[function(require,module,exports){
/*global window, console, module, document, setTimeout, $ */
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

eventSim.mouseover = function (x,y,type) {
  var el = document.elementFromPoint(x,y);
  
  if(el === null) {
    return false;
  }

  if(el.className.indexOf('reproduce-hover') === -1 && type === 'mouseover') {
    el.className += ' reproduce-hover';
  } else {
    el.className = el.className.replace('reproduce-hover', '');
    console.log('czemu nie');
  }

  $(el).trigger(type);
};

module.exports = eventSim;
},{}],"/Users/mateusz/Desktop/reproduce/src/events/mouseClick.js":[function(require,module,exports){
/*global require, window, console, module, document, setTimeout */
'use strict';

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
    posX: e.x,
    type: e.type
  });
};

mouseClick.record = function () {
  mouseClick.setInitDate();
  window.onclick = mouseClick.pushData.bind(this);
};

mouseClick.stop = function () {
  window.onclick = null;
};

module.exports = mouseClick;
},{"./eventSimulation":"/Users/mateusz/Desktop/reproduce/src/events/eventSimulation.js"}],"/Users/mateusz/Desktop/reproduce/src/events/mouseHover.js":[function(require,module,exports){
/*global require, window, console, module, setTimeout */
'use strict';
var mouseHover = {};

mouseHover.setInitDate = function () {
  this.getInitDate = Date.now();
};

mouseHover.data = [];

mouseHover.pushData = function (e) {
  var timeStamp = e.timeStamp - this.getInitDate;
  if(e.type === 'mouseout') {
    console.log('mouseout');
  }

  mouseHover.data.push({
    type: e.type,
    time: timeStamp,
    posY: e.y,
    posX: e.x
  });
};

mouseHover.record = function () {
  mouseHover.setInitDate();
  window.onmouseover = mouseHover.pushData.bind(this);
  window.onmouseout = mouseHover.pushData.bind(this);
};

mouseHover.stop = function () {
  window.onmouseover = null;
};

module.exports = mouseHover;
},{}],"/Users/mateusz/Desktop/reproduce/src/events/mouseMove.js":[function(require,module,exports){
/*global, window, console, module, document, setTimeout */
'use strict';
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
    time: timeStamp,
    type: e.type
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

module.exports = mouseMove;
},{}],"/Users/mateusz/Desktop/reproduce/src/events/resize.js":[function(require,module,exports){
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
    time: timeStamp,
    type: e.type
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

module.exports = resize;
},{}],"/Users/mateusz/Desktop/reproduce/src/events/scrollMove.js":[function(require,module,exports){
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
    time: timeStamp,
    type: e.type
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

module.exports = scrollMove;
},{}],"/Users/mateusz/Desktop/reproduce/src/main.js":[function(require,module,exports){
'use strict';

var mouseMove = require('./events/mouseMove'),
    mouseClick = require('./events/mouseClick'),
    scrollMove = require('./events/scrollMove'),
    mouseHover = require('./events/mouseHover'),
    resize = require('./events/resize'),
    styles = require('./utils/styles'),
    play = require('./utils/play'),
    CircularJSON = require('circular-json'),
    orginalTitle = document.title;

window.onload = function () {
  styles.appendReproduceStyles();
};

window.record = function () {
  console.info('recording...');
  mouseClick.record();
  mouseMove.record();
  scrollMove.record();
  mouseHover.record();
  resize.record();
  document.title = 'recording...';
};

window.stop = function () {
  console.info('stop!');
  mouseClick.stop();
  mouseMove.stop();
  scrollMove.stop();
  mouseHover.stop();
  resize.stop();
  document.title = orginalTitle;
};

window.play = function () {
  var data = getData();
  play.start(data);
};

window.getData = function () {
  var data = [],
      compare = function (a,b) {
        if(a.time < b.time) {return -1;}
        if(a.time > b.time) {return 1;}
        return 0;
      };

  data = data.concat(mouseClick.data, mouseMove.data, scrollMove.data, mouseHover.data, resize.data);
  data = data.sort(compare);
  return CircularJSON.stringify(data);
};

window.setData = function (data) {
  data = CircularJSON.parse(data);
  return data;
};


},{"./events/mouseClick":"/Users/mateusz/Desktop/reproduce/src/events/mouseClick.js","./events/mouseHover":"/Users/mateusz/Desktop/reproduce/src/events/mouseHover.js","./events/mouseMove":"/Users/mateusz/Desktop/reproduce/src/events/mouseMove.js","./events/resize":"/Users/mateusz/Desktop/reproduce/src/events/resize.js","./events/scrollMove":"/Users/mateusz/Desktop/reproduce/src/events/scrollMove.js","./utils/play":"/Users/mateusz/Desktop/reproduce/src/utils/play.js","./utils/styles":"/Users/mateusz/Desktop/reproduce/src/utils/styles.js","circular-json":"/Users/mateusz/Desktop/reproduce/node_modules/circular-json/build/circular-json.node.js"}],"/Users/mateusz/Desktop/reproduce/src/utils/play.js":[function(require,module,exports){
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
          fakeMouse.style.top = (data[index].posY + 10) + 'px';
          fakeMouse.style.left = (data[index].posX + 10) + 'px';
        } else if (data[index].type === 'resize') {
          document.body.style.width = data[index].width  + 'px';
        } else if (data[index].type === 'click') {
          eventSim.click(data[index].posX, data[index].posY);
        } else if (data[index].type === 'scroll') {
          window.scroll(0, data[index].positionY);
        } else if (data[index].type === 'mouseover') {
          eventSim.mouseover(data[index].posX, data[index].posY, 'mouseover');
        } else if (data[index].type === 'mouseout') {
          eventSim.mouseover(data[index].posX, data[index].posY, 'mouseout');
        }
        
        if(index === data.length - 1) {
          console.log('completed..');
        }
      }, data[index].time);
    })(i, data);
  }
};

module.exports = play;
},{"../events/eventSimulation":"/Users/mateusz/Desktop/reproduce/src/events/eventSimulation.js","circular-json":"/Users/mateusz/Desktop/reproduce/node_modules/circular-json/build/circular-json.node.js"}],"/Users/mateusz/Desktop/reproduce/src/utils/styles.js":[function(require,module,exports){
'use strict';

var styles = {};

styles.appendReproduceStyles = function () {
  var replace,
      stylesString = '',
      styleSheet = document.createElement('style');
      styleSheet.type = 'text/css';

  for (var i = 0; i <= document.styleSheets.length - 1; i++) {
    for(var j = 0; j <= document.styleSheets[i].rules.length - 1; j ++) {
      replace = document.styleSheets[i].rules[j].cssText;
      if(replace.indexOf(':hover') !== -1) {
        replace = replace.replace(':hover', '.reproduce-hover');
        stylesString += replace;
      }
    }
  }

  styleSheet.appendChild(document.createTextNode(stylesString));
  document.body.appendChild(styleSheet);
};

module.exports = styles;
},{}]},{},["/Users/mateusz/Desktop/reproduce/src/main.js"]);
