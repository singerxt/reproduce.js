(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";

var UI = require("./core/interface/UI.js").UI;

var PrepareStyles = require("./modules/styles.js").PrepareStyles;

global.app = function () {
  var U = new UI();
  new PrepareStyles();
  U.init();
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./core/interface/UI.js":4,"./modules/styles.js":7}],2:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Event Recorder
 *
 * @Author Mateusz Śpiewak
 * @params {string}
 * @returns {object}
 */

var EventRecorder = (function () {

  /**
   *
   */

  function EventRecorder(eventType) {
    _classCallCheck(this, EventRecorder);

    this._data = [];
    this._initDate = Date.now();
    this._eventType = eventType;
  }

  _createClass(EventRecorder, {
    pushData: {

      /**
       * Pushing data from event
       * to Array of objects
       * @params {event}
       * @returns {Array}
       */

      value: function pushData(event) {
        var timeStamp = event.timeStamp - this._initDate;
        this._data.push({
          posY: event.y,
          posX: event.x,
          time: timeStamp,
          type: event.type,
          width: document.body.clientWidth,
          positionY: window.scrollY
        });
      }
    },
    data: {

      /**
       * Get saved data
       * @returns {Array}
       */

      get: function () {
        return this._data;
      }
    },
    camera: {

      /**
       * Prepare Api for Recording
       *
       * @returns {{record: Function, stop: Function}}
       */

      value: function camera() {
        var pushData = this.pushData.bind(this);
        var that = this;
        return {
          record: function record(startTime) {
            that._initDate = startTime;
            document.addEventListener(that._eventType, pushData, false);
          },
          stop: function stop() {
            document.removeEventListener(that._eventType, pushData, false);
          }
        };
      }
    }
  });

  return EventRecorder;
})();

exports.EventRecorder = EventRecorder;

},{}],3:[function(require,module,exports){
"use strict";

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var key in props) {
      var prop = props[key];prop.configurable = true;if (prop.value) prop.writable = true;
    }Object.defineProperties(target, props);
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

var _classCallCheck = function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Event simulator
 *
 * @Author Mateusz Śpiewak
 */

var EventSimulator = (function () {

  /**
   *
   */

  function EventSimulator() {
    _classCallCheck(this, EventSimulator);

    this._lastMouseOver = {
      x: 0,
      y: 0
    };
  }

  _createClass(EventSimulator, {
    scroll: {

      /**
       * Set correct scroll position
       * @param data
       */

      value: function scroll(data) {
        window.scroll(0, data.positionY);
      }
    },
    mouseMove: {

      /**
       * Mouse move animation
       * @param data
       * @param elem
       */

      value: function mouseMove(data, elem) {
        elem.style.left = data.posX + 5 + "px";
        elem.style.top = data.posY + 5 + "px";
      }
    },
    resize: {

      /**
       * Set correct <body> width
       * @param data
       */

      value: function resize(data) {
        document.body.style.width = data.width + "px";
      }
    },
    click: {

      /**
       * Emulate click event
       * @notes For now we don't have IE support
       * @param data
       * @returns {boolean}
       */

      value: function click(data) {
        var $elem = document.elementFromPoint(data.posX, data.posY),
            options = {
          view: window,
          bubbles: true,
          cancelable: true
        },
            _event = new Event("click", options);

        if (!$elem) {
          return false;
        }

        $elem.style.opacity = "0.5";

        setTimeout(function () {
          $elem.style.opacity = "1";
        }, 100);

        $elem.dispatchEvent(_event);
      }
    },
    mouseOver: {
      value: function mouseOver(data) {
        var $elem = document.elementFromPoint(data.posX, data.posY),
            $elemOld = document.elementFromPoint(this._lastMouseOver.posX, this._lastMouseOver.posY),
            options = {
          view: window,
          bubbles: true,
          cancelable: true
        },
            _eventMouseOver = new Event("mouseover", options),
            _eventMouseOut = new Event("mouseout", options);

        $elem.className += " reproduce-hover ";
        $elemOld.className = $elemOld.className.replace("reproduce-hover", "");
        $elem.dispatchEvent(_eventMouseOver);
        $elemOld.dispatchEvent(_eventMouseOut);

        this._lastMouseOver = data;
      }
    }
  });

  return EventSimulator;
})();

exports.EventSimulator = EventSimulator;

},{}],4:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Recorder = require("../../modules/Recorder.js").Recorder;

var Player = require("../../modules/Player.js").Player;

var UI = (function () {
  function UI() {
    _classCallCheck(this, UI);

    this.Recorder = new Recorder();
    this.Player = new Player();
  }

  _createClass(UI, {
    template: {

      /**
       *
       * @returns {string}
       */

      value: function template() {
        var $temp = "<div class=\"reproduce-ui\"><button class=\"play\">play</button><button class=\"record\">record</button><button class=\"stop\">stop</button></>";
        return $temp;
      }
    },
    appendButtons: {

      /**
       *
       * @returns {undefined}
       */

      value: function appendButtons() {
        var $body = document.querySelector("body");
        $body.insertAdjacentHTML("beforeend", this.template());
      }
    },
    init: {

      /**
       *
       * @returns {undefined}
       */

      value: function init() {
        this.appendButtons();

        var $buttons = document.querySelectorAll(".reproduce-ui button");

        for (var i = 0; i < $buttons.length; i++) {
          this.click($buttons[i]);
        }
      }
    },
    click: {
      value: function click($elem) {
        var that = this;
        $elem.addEventListener("click", function () {
          if (this.className === "play") {
            that.Recorder.stop();
            that.Player._data = that.Recorder.getData();
            that.Player.play();
          } else if (this.className === "record") {
            that.Recorder.record();
          } else {
            that.Recorder.stop();
          }
        });
      }
    }
  });

  return UI;
})();

exports.UI = UI;

},{"../../modules/Player.js":5,"../../modules/Recorder.js":6}],5:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var EventSimulator = require("../core/Event/EventSimulator.js").EventSimulator;

/**
 * Event Recorder
 *
 * @Author Mateusz Śpiewak
 * @params data
 */

var Player = (function () {
  function Player(data) {
    _classCallCheck(this, Player);

    this._data = data;
    this.ES = new EventSimulator();
  }

  _createClass(Player, {
    play: {

      /**
       * Animation loop
       */

      value: function play() {
        var _this = this;

        this.createMousePointer();
        var that = this;
        for (var i = 0; i < this._data.length; i++) {
          (function (i) {

            /**
             * Need to create new scopecc
             */

            (function (i, data) {
              setTimeout(function () {
                var etype = data[i].type;

                if (etype === "mousemove") {
                  that.ES.mouseMove(data[i], that._pointer);
                } else if (etype === "scroll") {
                  that.ES.scroll(data[i]);
                } else if (etype === "click") {
                  that.ES.click(data[i]);
                } else if (etype === "mouseover") {
                  that.ES.mouseOver(data[i]);
                }

                /**
                 * Remove mouse pointer
                 * after animation
                 */

                if (i === data.length - 1) {
                  that._pointer.parentNode.removeChild(that._pointer);
                }
              }, data[i].time);
            })(i, _this._data);
          })(i);
        }
      }
    },
    createMousePointer: {

      /**
       *
       * @returns {undefined}
       */

      value: function createMousePointer() {
        var pointer = document.createElement("div");

        /**
         * set initial styles for mouse pointer
         */

        pointer.className = "reproduce-pointer";
        pointer.style.width = "20px";
        pointer.style.height = "20px";
        pointer.style.position = "fixed";
        pointer.style.top = "10px";
        pointer.style.left = "10px";
        pointer.style.background = "url(\"img/pointerm.png\")";

        /**
         * Append pointer
         */

        document.body.appendChild(pointer);
        this._pointer = pointer;
      }
    }
  });

  return Player;
})();

exports.Player = Player;

},{"../core/Event/EventSimulator.js":3}],6:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var EventRecorder = require("../core/Event/EventRecorder.js").EventRecorder;

/**
 * Event Recorder
 *
 * @Author Mateusz Śpiewak
 */

var Recorder = (function () {
  function Recorder() {
    _classCallCheck(this, Recorder);

    this._events = ["mousemove", "click", "mouseover", "resize", "scroll", "keydown"];
    this._ERinstances = [];
    this._cameras = [];
    this._data = [];
    this.initInstances();
  }

  _createClass(Recorder, {
    initInstances: {

      /**
       * init EventRecorder istance
       * for each event
       * @returns {undefined}
       */

      value: function initInstances() {
        var obj = undefined,
            cam = undefined;

        for (var i = 0; i < this._events.length; i++) {
          obj = new EventRecorder(this._events[i]);
          cam = obj.camera();

          this._ERinstances.push(obj);
          this._cameras.push(cam);
        }
      }
    },
    record: {

      /**
       * Start recording all events
       * @returns {undefined}
       */

      value: function record() {
        console.info("Reproduce :: Recording " + this._events);
        var startTime = Date.now();

        for (var i = 0; i < this._cameras.length; i++) {
          this._cameras[i].record(startTime);
        }
      }
    },
    stop: {

      /**
       * Stop recording all events
       * @returns {undefined}
       */

      value: function stop() {
        console.info("Reproduce :: Stop Recording " + this._events);

        for (var i = 0; i < this._cameras.length; i++) {
          this._cameras[i].stop();
        }
      }
    },
    getData: {

      /**
       * Get all data
       * @returns {Array}
       */

      value: function getData() {
        var arr = [];

        var _comp = function _comp(a, b) {
          if (a.time < b.time) {
            return -1;
          }
          if (a.time > b.time) {
            return 1;
          }
          return 0;
        };

        for (var i = 0; i < this._ERinstances.length; i++) {
          arr.push(this._ERinstances[i].data);
        }

        arr = [].concat.apply([], arr);
        arr = arr.sort(_comp);
        return arr;
      }
    }
  });

  return Recorder;
})();

exports.Recorder = Recorder;

},{"../core/Event/EventRecorder.js":2}],7:[function(require,module,exports){
"use strict";

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var key in props) {
      var prop = props[key];prop.configurable = true;if (prop.value) prop.writable = true;
    }Object.defineProperties(target, props);
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

var _classCallCheck = function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 *
 *
 */

var qwest = require("../vendor/qwest.js").qwest;

var PrepareStyles = (function () {
  function PrepareStyles() {
    _classCallCheck(this, PrepareStyles);

    this.$linkedCSS = document.querySelectorAll("link[rel=\"stylesheet\"]");
    this.$inlinedCSS = document.querySelectorAll("style");
    this.reproduceClass = ".reproduce-hover";
    this.preprocessLinkedCSS();
  }

  _createClass(PrepareStyles, {
    preprocessLinkedCSS: {
      value: function preprocessLinkedCSS() {
        var that = this;
        for (var i = 0, len = this.$linkedCSS.length; i < len; i++) {
          window.qwest.get(this.$linkedCSS[i].href).then(function (r) {
            that.preprocessCSSstring(r.toString());
          });
        }
      }
    },
    preprocessCSSstring: {

      /**
       *
       * @params {string}
       * @return {undefined}
       */

      value: function preprocessCSSstring(string) {
        var CSSString = string.replace(/:hover/g, this.reproduceClass),
            styleSheet = document.createElement("style");

        styleSheet.type = "text/css";
        styleSheet.appendChild(document.createTextNode(CSSString));
        document.body.appendChild(styleSheet);
      }
    }
  });

  return PrepareStyles;
})();

exports.PrepareStyles = PrepareStyles;

},{"../vendor/qwest.js":8}],8:[function(require,module,exports){
/*! qwest 1.6.1 (https://github.com/pyrsmk/qwest) */

"use strict";

;(function (context, name, definition) {
  if (typeof module != "undefined" && module.exports) {
    module.exports = definition;
  } else if (typeof define == "function" && define.amd) {
    define(definition);
  } else {
    context[name] = definition;
  }
})(undefined, "qwest", (function () {
  var win = window,
      doc = document,
      before,

  // Default response type for XDR in auto mode
  defaultXdrResponseType = "json",

  // Variables for limit mechanism
  limit = null,
      requests = 0,
      request_stack = [],

  // Get XMLHttpRequest object
  getXHR = function getXHR() {
    return win.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
  },

  // Guess XHR version
  xhr2 = getXHR().responseType === "",

  // Core function
  qwest = (function (_qwest) {
    var _qwestWrapper = function qwest(_x, _x2, _x3, _x4, _x5) {
      return _qwest.apply(this, arguments);
    };

    _qwestWrapper.toString = function () {
      return _qwest.toString();
    };

    return _qwestWrapper;
  })(function (method, url, data, options, before) {

    // Format
    method = method.toUpperCase();
    data = data || null;
    options = options || {};

    // Define variables
    var nativeResponseParsing = false,
        crossOrigin,
        xhr,
        xdr = false,
        timeoutInterval,
        aborted = false,
        attempts = 0,
        headers = {},
        mimeTypes = {
      text: "*/*",
      xml: "text/xml",
      json: "application/json",
      post: "application/x-www-form-urlencoded"
    },
        accept = {
      text: "*/*",
      xml: "application/xml; q=1.0, text/xml; q=0.8, */*; q=0.1",
      json: "application/json; q=1.0, text/*; q=0.8, */*; q=0.1"
    },
        contentType = "Content-Type",
        vars = "",
        i,
        j,
        serialized,
        then_stack = [],
        catch_stack = [],
        complete_stack = [],
        response,
        success,
        error,
        func,

    // Define promises
    promises = {
      then: function then(func) {
        if (options.async) {
          then_stack.push(func);
        } else if (success) {
          func.call(xhr, response);
        }
        return promises;
      },
      "catch": function _catch(func) {
        if (options.async) {
          catch_stack.push(func);
        } else if (error) {
          func.call(xhr, response);
        }
        return promises;
      },
      complete: function complete(func) {
        if (options.async) {
          complete_stack.push(func);
        } else {
          func.call(xhr);
        }
        return promises;
      }
    },
        promises_limit = {
      then: function then(func) {
        request_stack[request_stack.length - 1].then.push(func);
        return promises_limit;
      },
      "catch": function _catch(func) {
        request_stack[request_stack.length - 1]["catch"].push(func);
        return promises_limit;
      },
      complete: function complete(func) {
        request_stack[request_stack.length - 1].complete.push(func);
        return promises_limit;
      }
    },

    // Handle the response
    handleResponse = function handleResponse() {
      // Verify request's state
      // --- https://stackoverflow.com/questions/7287706/ie-9-javascript-error-c00c023f
      if (aborted) {
        return;
      }
      // Prepare
      var i, req, p, responseType;
      --requests;
      // Clear the timeout
      clearInterval(timeoutInterval);
      // Launch next stacked request
      if (request_stack.length) {
        req = request_stack.shift();
        p = qwest(req.method, req.url, req.data, req.options, req.before);
        for (i = 0; func = req.then[i]; ++i) {
          p.then(func);
        }
        for (i = 0; func = req["catch"][i]; ++i) {
          p["catch"](func);
        }
        for (i = 0; func = req.complete[i]; ++i) {
          p.complete(func);
        }
      }
      // Handle response
      try {
        // Verify status code
        // --- https://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
        if ("status" in xhr && !/^2|1223/.test(xhr.status)) {
          throw xhr.status + " (" + xhr.statusText + ")";
        }
        // Init
        var responseText = "responseText",
            responseXML = "responseXML",
            parseError = "parseError";
        // Process response
        if (nativeResponseParsing && "response" in xhr && xhr.response !== null) {
          response = xhr.response;
        } else if (options.responseType == "document") {
          var frame = doc.createElement("iframe");
          frame.style.display = "none";
          doc.body.appendChild(frame);
          frame.contentDocument.open();
          frame.contentDocument.write(xhr.response);
          frame.contentDocument.close();
          response = frame.contentDocument;
          doc.body.removeChild(frame);
        } else {
          // Guess response type
          responseType = options.responseType;
          if (responseType == "auto") {
            if (xdr) {
              responseType = defaultXdrResponseType;
            } else {
              var ct = xhr.getResponseHeader(contentType) || "";
              if (ct.indexOf(mimeTypes.json) > -1) {
                responseType = "json";
              } else if (ct.indexOf(mimeTypes.xml) > -1) {
                responseType = "xml";
              } else {
                responseType = "text";
              }
            }
          }
          // Handle response type
          switch (responseType) {
            case "json":
              try {
                if ("JSON" in win) {
                  response = JSON.parse(xhr[responseText]);
                } else {
                  response = eval("(" + xhr[responseText] + ")");
                }
              } catch (e) {
                throw "Error while parsing JSON body : " + e;
              }
              break;
            case "xml":
              // Based on jQuery's parseXML() function
              try {
                // Standard
                if (win.DOMParser) {
                  response = new DOMParser().parseFromString(xhr[responseText], "text/xml");
                }
                // IE<9
                else {
                  response = new ActiveXObject("Microsoft.XMLDOM");
                  response.async = "false";
                  response.loadXML(xhr[responseText]);
                }
              } catch (e) {
                response = undefined;
              }
              if (!response || !response.documentElement || response.getElementsByTagName("parsererror").length) {
                throw "Invalid XML";
              }
              break;
            default:
              response = xhr[responseText];
          }
        }
        // Execute 'then' stack
        success = true;
        p = response;
        if (options.async) {
          for (i = 0; func = then_stack[i]; ++i) {
            p = func.call(xhr, p);
          }
        }
      } catch (e) {
        error = true;
        // Execute 'catch' stack
        if (options.async) {
          for (i = 0; func = catch_stack[i]; ++i) {
            func.call(xhr, e, url);
          }
        }
      }
      // Execute complete stack
      if (options.async) {
        for (i = 0; func = complete_stack[i]; ++i) {
          func.call(xhr);
        }
      }
    },

    // Handle errors
    handleError = function handleError(e) {
      error = true;
      --requests;
      // Clear the timeout
      clearInterval(timeoutInterval);
      // Execute 'catch' stack
      if (options.async) {
        for (i = 0; func = catch_stack[i]; ++i) {
          func.call(xhr, e, url);
        }
      }
    },

    // Recursively build the query string
    buildData = (function (_buildData) {
      var _buildDataWrapper = function buildData(_x6, _x7) {
        return _buildData.apply(this, arguments);
      };

      _buildDataWrapper.toString = function () {
        return _buildData.toString();
      };

      return _buildDataWrapper;
    })(function (data, key) {
      var res = [],
          enc = encodeURIComponent,
          p;
      if (typeof data === "object" && data != null) {
        for (p in data) {
          if (data.hasOwnProperty(p)) {
            var built = buildData(data[p], key ? key + "[" + p + "]" : p);
            if (built !== "") {
              res = res.concat(built);
            }
          }
        }
      } else if (data != null && key != null) {
        res.push(enc(key) + "=" + enc(data));
      }
      return res.join("&");
    });

    // New request
    ++requests;

    if ("retries" in options) {
      if (win.console && console.warn) {
        console.warn("[Qwest] The retries option is deprecated. It indicates total number of requests to attempt. Please use the \"attempts\" option.");
      }
      options.attempts = options.retries;
    }

    // Normalize options
    options.async = "async" in options ? !!options.async : true;
    options.cache = "cache" in options ? !!options.cache : method != "GET";
    options.dataType = "dataType" in options ? options.dataType.toLowerCase() : "post";
    options.responseType = "responseType" in options ? options.responseType.toLowerCase() : "auto";
    options.user = options.user || "";
    options.password = options.password || "";
    options.withCredentials = !!options.withCredentials;
    options.timeout = "timeout" in options ? parseInt(options.timeout, 10) : 30000;
    options.attempts = "attempts" in options ? parseInt(options.attempts, 10) : 1;

    // Guess if we're dealing with a cross-origin request
    i = url.match(/\/\/(.+?)\//);
    crossOrigin = i && i[1] ? i[1] != location.host : false;

    // Prepare data
    if ("ArrayBuffer" in win && data instanceof ArrayBuffer) {
      options.dataType = "arraybuffer";
    } else if ("Blob" in win && data instanceof Blob) {
      options.dataType = "blob";
    } else if ("Document" in win && data instanceof Document) {
      options.dataType = "document";
    } else if ("FormData" in win && data instanceof FormData) {
      options.dataType = "formdata";
    }
    switch (options.dataType) {
      case "json":
        data = JSON.stringify(data);
        break;
      case "post":
        data = buildData(data);
    }

    // Prepare headers
    if (options.headers) {
      var format = function format(match, p1, p2) {
        return p1 + p2.toUpperCase();
      };
      for (i in options.headers) {
        headers[i.replace(/(^|-)([^-])/g, format)] = options.headers[i];
      }
    }
    if (!headers[contentType] && method != "GET") {
      if (options.dataType in mimeTypes) {
        if (mimeTypes[options.dataType]) {
          headers[contentType] = mimeTypes[options.dataType];
        }
      }
    }
    if (!headers.Accept) {
      headers.Accept = options.responseType in accept ? accept[options.responseType] : "*/*";
    }
    if (!crossOrigin && !headers["X-Requested-With"]) {
      // because that header breaks in legacy browsers with CORS
      headers["X-Requested-With"] = "XMLHttpRequest";
    }

    // Prepare URL
    if (method == "GET" && data) {
      vars += data;
    }
    if (!options.cache) {
      if (vars) {
        vars += "&";
      }
      vars += "__t=" + +new Date();
    }
    if (vars) {
      url += (/\?/.test(url) ? "&" : "?") + vars;
    }

    // The limit has been reached, stock the request
    if (limit && requests == limit) {
      request_stack.push({
        method: method,
        url: url,
        data: data,
        options: options,
        before: before,
        then: [],
        "catch": [],
        complete: []
      });
      return promises_limit;
    }

    // Send the request
    var send = function send() {
      // Get XHR object
      xhr = getXHR();
      if (crossOrigin) {
        if (!("withCredentials" in xhr) && win.XDomainRequest) {
          xhr = new XDomainRequest(); // CORS with IE8/9
          xdr = true;
          if (method != "GET" && method != "POST") {
            method = "POST";
          }
        }
      }
      // Open connection
      if (xdr) {
        xhr.open(method, url);
      } else {
        xhr.open(method, url, options.async, options.user, options.password);
        if (xhr2 && options.async) {
          xhr.withCredentials = options.withCredentials;
        }
      }
      // Set headers
      if (!xdr) {
        for (var i in headers) {
          xhr.setRequestHeader(i, headers[i]);
        }
      }
      // Verify if the response type is supported by the current browser
      if (xhr2 && options.responseType != "document" && options.responseType != "auto") {
        // Don't verify for 'document' since we're using an internal routine
        try {
          xhr.responseType = options.responseType;
          nativeResponseParsing = xhr.responseType == options.responseType;
        } catch (e) {}
      }
      // Plug response handler
      if (xhr2 || xdr) {
        xhr.onload = handleResponse;
        xhr.onerror = handleError;
      } else {
        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4) {
            handleResponse();
          }
        };
      }
      // Override mime type to ensure the response is well parsed
      if (options.responseType != "auto" && "overrideMimeType" in xhr) {
        xhr.overrideMimeType(mimeTypes[options.responseType]);
      }
      // Run 'before' callback
      if (before) {
        before.call(xhr);
      }
      // Send request
      if (xdr) {
        setTimeout(function () {
          // https://developer.mozilla.org/en-US/docs/Web/API/XDomainRequest
          xhr.send(method != "GET" ? data : null);
        }, 0);
      } else {
        xhr.send(method != "GET" ? data : null);
      }
    };

    // Timeout/attempts
    var timeout = (function (_timeout) {
      var _timeoutWrapper = function timeout() {
        return _timeout.apply(this, arguments);
      };

      _timeoutWrapper.toString = function () {
        return _timeout.toString();
      };

      return _timeoutWrapper;
    })(function () {
      timeoutInterval = setTimeout(function () {
        aborted = true;
        xhr.abort();
        if (!options.attempts || ++attempts != options.attempts) {
          aborted = false;
          timeout();
          send();
        } else {
          aborted = false;
          error = true;
          response = "Timeout (" + url + ")";
          if (options.async) {
            for (i = 0; func = catch_stack[i]; ++i) {
              func.call(xhr, response);
            }
          }
        }
      }, options.timeout);
    });

    // Start the request
    timeout();
    send();

    // Return promises
    return promises;
  });

  // Return external qwest object
  var create = function create(method) {
    return function (url, data, options) {
      var b = before;
      before = null;
      return qwest(method, this.base + url, data, options, b);
    };
  },
      obj = {
    base: "",
    before: (function (_before) {
      var _beforeWrapper = function before(_x) {
        return _before.apply(this, arguments);
      };

      _beforeWrapper.toString = function () {
        return _before.toString();
      };

      return _beforeWrapper;
    })(function (callback) {
      before = callback;
      return obj;
    }),
    get: create("GET"),
    post: create("POST"),
    put: create("PUT"),
    "delete": create("DELETE"),
    xhr2: xhr2,
    limit: (function (_limit) {
      var _limitWrapper = function limit(_x) {
        return _limit.apply(this, arguments);
      };

      _limitWrapper.toString = function () {
        return _limit.toString();
      };

      return _limitWrapper;
    })(function (by) {
      limit = by;
    }),
    setDefaultXdrResponseType: function setDefaultXdrResponseType(type) {
      defaultXdrResponseType = type.toLowerCase();
    }
  };
  window.qwest = obj;
  return obj;
})());

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbWF0ZXVzei9EZXNrdG9wL3JlczYvc3JjL2FwcC5qcyIsIi9Vc2Vycy9tYXRldXN6L0Rlc2t0b3AvcmVzNi9zcmMvY29yZS9FdmVudC9FdmVudFJlY29yZGVyLmpzIiwiL1VzZXJzL21hdGV1c3ovRGVza3RvcC9yZXM2L3NyYy9jb3JlL0V2ZW50L0V2ZW50U2ltdWxhdG9yLmpzIiwiL1VzZXJzL21hdGV1c3ovRGVza3RvcC9yZXM2L3NyYy9jb3JlL2ludGVyZmFjZS9VSS5qcyIsIi9Vc2Vycy9tYXRldXN6L0Rlc2t0b3AvcmVzNi9zcmMvbW9kdWxlcy9QbGF5ZXIuanMiLCIvVXNlcnMvbWF0ZXVzei9EZXNrdG9wL3JlczYvc3JjL21vZHVsZXMvUmVjb3JkZXIuanMiLCIvVXNlcnMvbWF0ZXVzei9EZXNrdG9wL3JlczYvc3JjL21vZHVsZXMvc3R5bGVzLmpzIiwiL1VzZXJzL21hdGV1c3ovRGVza3RvcC9yZXM2L3NyYy92ZW5kb3IvcXdlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUEsWUFBWSxDQUFDOztBQUViLElBRlEsRUFBRSxHQUFBLE9BQUEsQ0FBTyx3QkFBd0IsQ0FBQSxDQUFqQyxFQUFFLENBQUE7O0FBSVYsSUFIUSxhQUFhLEdBQUEsT0FBQSxDQUFPLHFCQUFxQixDQUFBLENBQXpDLGFBQWEsQ0FBQTs7QUFFckIsTUFBTSxDQUFDLEdBQUcsR0FBRyxZQUFZO0FBQ3ZCLE1BQUksQ0FBQyxHQUFHLElBQUksRUFBRSxFQUFFLENBQUM7QUFDakIsTUFBSSxhQUFhLEVBQUUsQ0FBQztBQUNwQixHQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Q0FDVixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lDQ0ksYUFBYTs7Ozs7O0FBTUwsV0FOUixhQUFhLENBTUosU0FBUyxFQUFFOzBCQU5wQixhQUFhOztB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QUFNLEdBQUMsUUFBUSxDQUFDO0FBQ2hCLGFBQU8sR0FBRyxDQUFDO0tBQ1osQ0FBQTtBQUNELE9BQUcsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ2xCLFFBQUksRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ3BCLE9BQUcsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ2xCLFlBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDO0FBQzFCLFFBQUksRUFBRSxJQUFJO0FBQ1YsU0FBSzs7Ozs7Ozs7OztPQUFFLFVBQVMsRUFBRSxFQUFDO0FBQ2pCLFdBQUssR0FBQyxFQUFFLENBQUM7S0FDVixDQUFBO0FBQ0QsNkJBQXlCLEVBQUUsbUNBQVMsSUFBSSxFQUFDO0FBQ3ZDLDRCQUFzQixHQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztLQUMzQztHQUNGLENBQUM7QUFDSixRQUFNLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztBQUNuQixTQUFPLEdBQUcsQ0FBQztDQUVaLENBQUEsRUFBRSxDQUFDLENBQUUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHtVSX0gZnJvbSAnLi9jb3JlL2ludGVyZmFjZS9VSS5qcyc7XG5pbXBvcnQge1ByZXBhcmVTdHlsZXN9IGZyb20gJy4vbW9kdWxlcy9zdHlsZXMuanMnO1xuXG5nbG9iYWwuYXBwID0gZnVuY3Rpb24gKCkge1xuICB2YXIgVSA9IG5ldyBVSSgpO1xuICBuZXcgUHJlcGFyZVN0eWxlcygpO1xuICBVLmluaXQoKTtcbn07XG4iLCIvKipcbiAqIEV2ZW50IFJlY29yZGVyXG4gKlxuICogQEF1dGhvciBNYXRldXN6IMWacGlld2FrXG4gKiBAcGFyYW1zIHtzdHJpbmd9XG4gKiBAcmV0dXJucyB7b2JqZWN0fVxuICovXG5cbmNsYXNzIEV2ZW50UmVjb3JkZXIge1xuXG4gIC8qKlxuICAgKlxuICAgKi9cblxuICBjb25zdHJ1Y3RvciAoZXZlbnRUeXBlKSB7XG4gICAgdGhpcy5fZGF0YSA9IFtdO1xuICAgIHRoaXMuX2luaXREYXRlID0gRGF0ZS5ub3coKTtcbiAgICB0aGlzLl9ldmVudFR5cGUgPSBldmVudFR5cGU7XG4gIH1cblxuICAvKipcbiAgICogUHVzaGluZyBkYXRhIGZyb20gZXZlbnRcbiAgICogdG8gQXJyYXkgb2Ygb2JqZWN0c1xuICAgKiBAcGFyYW1zIHtldmVudH1cbiAgICogQHJldHVybnMge0FycmF5fVxuICAgKi9cblxuICBwdXNoRGF0YSAoZXZlbnQpIHtcbiAgICBsZXQgdGltZVN0YW1wID0gZXZlbnQudGltZVN0YW1wIC0gdGhpcy5faW5pdERhdGU7XG4gICAgdGhpcy5fZGF0YS5wdXNoKHtcbiAgICAgIHBvc1k6IGV2ZW50LnksXG4gICAgICBwb3NYOiBldmVudC54LFxuICAgICAgdGltZTogdGltZVN0YW1wLFxuICAgICAgdHlwZTogZXZlbnQudHlwZSxcbiAgICAgIHdpZHRoOiBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoLFxuICAgICAgcG9zaXRpb25ZOiB3aW5kb3cuc2Nyb2xsWVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBzYXZlZCBkYXRhXG4gICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICovXG5cbiAgZ2V0IGRhdGEgKCkge1xuICAgIHJldHVybiB0aGlzLl9kYXRhO1xuICB9XG5cbiAgLyoqXG4gICAqIFByZXBhcmUgQXBpIGZvciBSZWNvcmRpbmdcbiAgICpcbiAgICogQHJldHVybnMge3tyZWNvcmQ6IEZ1bmN0aW9uLCBzdG9wOiBGdW5jdGlvbn19XG4gICAqL1xuXG4gIGNhbWVyYSAoKSB7XG4gICAgbGV0IHB1c2hEYXRhID0gdGhpcy5wdXNoRGF0YS5iaW5kKHRoaXMpO1xuICAgIGxldCB0aGF0ID0gdGhpcztcbiAgICByZXR1cm4ge1xuICAgICAgcmVjb3JkOiBmdW5jdGlvbiAoc3RhcnRUaW1lKSB7XG4gICAgICAgIHRoYXQuX2luaXREYXRlID0gc3RhcnRUaW1lO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKHRoYXQuX2V2ZW50VHlwZSwgcHVzaERhdGEsIGZhbHNlKTtcbiAgICAgIH0sXG4gICAgICBzdG9wOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIodGhhdC5fZXZlbnRUeXBlLCBwdXNoRGF0YSwgZmFsc2UpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQge0V2ZW50UmVjb3JkZXJ9XG4iLCIvKipcbiAqIEV2ZW50IHNpbXVsYXRvclxuICpcbiAqIEBBdXRob3IgTWF0ZXVzeiDFmnBpZXdha1xuICovXG5cbmNsYXNzIEV2ZW50U2ltdWxhdG9yIHtcblxuICAvKipcbiAgICpcbiAgICovXG5cbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHRoaXMuX2xhc3RNb3VzZU92ZXIgPSB7XG4gICAgICB4OiAwLFxuICAgICAgeTogMFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogU2V0IGNvcnJlY3Qgc2Nyb2xsIHBvc2l0aW9uXG4gICAqIEBwYXJhbSBkYXRhXG4gICAqL1xuXG4gIHNjcm9sbCAoZGF0YSkge1xuICAgIHdpbmRvdy5zY3JvbGwoMCwgZGF0YS5wb3NpdGlvblkpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1vdXNlIG1vdmUgYW5pbWF0aW9uXG4gICAqIEBwYXJhbSBkYXRhXG4gICAqIEBwYXJhbSBlbGVtXG4gICAqL1xuXG4gIG1vdXNlTW92ZSAoZGF0YSwgZWxlbSkge1xuICAgIGVsZW0uc3R5bGUubGVmdCA9IGRhdGEucG9zWCArIDUgKyAncHgnO1xuICAgIGVsZW0uc3R5bGUudG9wID0gZGF0YS5wb3NZICsgNSArICdweCc7XG4gIH1cblxuICAvKipcbiAgICogU2V0IGNvcnJlY3QgPGJvZHk+IHdpZHRoXG4gICAqIEBwYXJhbSBkYXRhXG4gICAqL1xuXG4gIHJlc2l6ZSAoZGF0YSkge1xuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUud2lkdGggPSBkYXRhLndpZHRoICsgJ3B4J1xuICB9XG5cbiAgLyoqXG4gICAqIEVtdWxhdGUgY2xpY2sgZXZlbnRcbiAgICogQG5vdGVzIEZvciBub3cgd2UgZG9uJ3QgaGF2ZSBJRSBzdXBwb3J0XG4gICAqIEBwYXJhbSBkYXRhXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cblxuICBjbGljayAoZGF0YSkge1xuICAgIGxldCAkZWxlbSA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoZGF0YS5wb3NYLCBkYXRhLnBvc1kpLFxuICAgICAgICBvcHRpb25zID0gIHtcbiAgICAgICAgICB2aWV3OiB3aW5kb3csXG4gICAgICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgICAgICBjYW5jZWxhYmxlOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIF9ldmVudCA9IG5ldyBFdmVudCgnY2xpY2snLCBvcHRpb25zKTtcblxuICAgIGlmKCEoJGVsZW0pKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgJGVsZW0uc3R5bGUub3BhY2l0eSA9ICcwLjUnO1xuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAkZWxlbS5zdHlsZS5vcGFjaXR5ID0gJzEnO1xuICAgIH0sMTAwKTtcblxuICAgICRlbGVtLmRpc3BhdGNoRXZlbnQoX2V2ZW50KTtcbiAgfVxuXG4gIG1vdXNlT3ZlciAoZGF0YSkge1xuICAgIGxldCAkZWxlbSA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoZGF0YS5wb3NYLCBkYXRhLnBvc1kpLFxuICAgICAgICAkZWxlbU9sZCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQodGhpcy5fbGFzdE1vdXNlT3Zlci5wb3NYLCB0aGlzLl9sYXN0TW91c2VPdmVyLnBvc1kpLFxuICAgICAgb3B0aW9ucyA9ICB7XG4gICAgICAgIHZpZXc6IHdpbmRvdyxcbiAgICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZVxuICAgICAgfSxcbiAgICAgIF9ldmVudE1vdXNlT3ZlciA9IG5ldyBFdmVudCgnbW91c2VvdmVyJywgb3B0aW9ucyksXG4gICAgICBfZXZlbnRNb3VzZU91dCA9IG5ldyBFdmVudCgnbW91c2VvdXQnLCBvcHRpb25zKTtcblxuICAgICRlbGVtLmNsYXNzTmFtZSArPSAnIHJlcHJvZHVjZS1ob3ZlciAnO1xuICAgICRlbGVtT2xkLmNsYXNzTmFtZSA9ICRlbGVtT2xkLmNsYXNzTmFtZS5yZXBsYWNlKCdyZXByb2R1Y2UtaG92ZXInLCAnJyk7XG4gICAgJGVsZW0uZGlzcGF0Y2hFdmVudChfZXZlbnRNb3VzZU92ZXIpO1xuICAgICRlbGVtT2xkLmRpc3BhdGNoRXZlbnQoX2V2ZW50TW91c2VPdXQpO1xuXG4gICAgdGhpcy5fbGFzdE1vdXNlT3ZlciA9IGRhdGE7XG4gIH1cbn1cblxuZXhwb3J0IHtFdmVudFNpbXVsYXRvcn1cbiIsImltcG9ydCB7UmVjb3JkZXJ9IGZyb20gJy4uLy4uL21vZHVsZXMvUmVjb3JkZXIuanMnO1xuaW1wb3J0IHtQbGF5ZXJ9IGZyb20gJy4uLy4uL21vZHVsZXMvUGxheWVyLmpzJztcblxuY2xhc3MgVUkge1xuXG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICB0aGlzLlJlY29yZGVyID0gbmV3IFJlY29yZGVyKCk7XG4gICAgdGhpcy5QbGF5ZXIgPSBuZXcgUGxheWVyKCk7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG5cbiAgdGVtcGxhdGUgKCkge1xuICAgIGxldCAkdGVtcCA9ICc8ZGl2IGNsYXNzPVwicmVwcm9kdWNlLXVpXCI+PGJ1dHRvbiBjbGFzcz1cInBsYXlcIj5wbGF5PC9idXR0b24+PGJ1dHRvbiBjbGFzcz1cInJlY29yZFwiPnJlY29yZDwvYnV0dG9uPjxidXR0b24gY2xhc3M9XCJzdG9wXCI+c3RvcDwvYnV0dG9uPjwvPidcbiAgICByZXR1cm4gJHRlbXA7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHJldHVybnMge3VuZGVmaW5lZH1cbiAgICovXG5cbiAgYXBwZW5kQnV0dG9ucyAoKSB7XG4gICAgbGV0ICRib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpO1xuICAgICRib2R5Lmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJyx0aGlzLnRlbXBsYXRlKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEByZXR1cm5zIHt1bmRlZmluZWR9XG4gICAqL1xuICBpbml0ICgpIHtcbiAgICB0aGlzLmFwcGVuZEJ1dHRvbnMoKTtcblxuICAgIGxldCAkYnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5yZXByb2R1Y2UtdWkgYnV0dG9uJyk7XG5cblxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCAkYnV0dG9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5jbGljaygkYnV0dG9uc1tpXSk7XG4gICAgfVxuICB9XG5cbiAgY2xpY2sgKCRlbGVtKSB7XG4gICAgbGV0IHRoYXQgPSB0aGlzO1xuICAgICRlbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgaWYodGhpcy5jbGFzc05hbWUgPT09ICdwbGF5Jykge1xuICAgICAgICB0aGF0LlJlY29yZGVyLnN0b3AoKTtcbiAgICAgICAgdGhhdC5QbGF5ZXIuX2RhdGEgPSB0aGF0LlJlY29yZGVyLmdldERhdGEoKTtcbiAgICAgICAgdGhhdC5QbGF5ZXIucGxheSgpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmNsYXNzTmFtZSA9PT0gJ3JlY29yZCcpIHtcbiAgICAgICAgdGhhdC5SZWNvcmRlci5yZWNvcmQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoYXQuUmVjb3JkZXIuc3RvcCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCB7VUl9XG4iLCJpbXBvcnQge0V2ZW50U2ltdWxhdG9yfSBmcm9tICcuLi9jb3JlL0V2ZW50L0V2ZW50U2ltdWxhdG9yLmpzJztcblxuLyoqXG4gKiBFdmVudCBSZWNvcmRlclxuICpcbiAqIEBBdXRob3IgTWF0ZXVzeiDFmnBpZXdha1xuICogQHBhcmFtcyBkYXRhXG4gKi9cblxuY2xhc3MgUGxheWVyIHtcbiAgY29uc3RydWN0b3IgKGRhdGEpIHtcbiAgICB0aGlzLl9kYXRhID0gZGF0YTtcbiAgICB0aGlzLkVTID0gbmV3IEV2ZW50U2ltdWxhdG9yKCk7XG4gIH1cblxuICAvKipcbiAgICogQW5pbWF0aW9uIGxvb3BcbiAgICovXG5cbiAgcGxheSAoKSB7XG4gICAgdGhpcy5jcmVhdGVNb3VzZVBvaW50ZXIoKTtcbiAgICBsZXQgdGhhdCA9IHRoaXM7XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuX2RhdGEubGVuZ3RoOyBpKyspIHtcblxuICAgICAgLyoqXG4gICAgICAgKiBOZWVkIHRvIGNyZWF0ZSBuZXcgc2NvcGVjY1xuICAgICAgICovXG5cbiAgICAgIChmdW5jdGlvbiAoaSwgZGF0YSkge1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBsZXQgZXR5cGUgPSBkYXRhW2ldLnR5cGU7XG5cbiAgICAgICAgICBpZihldHlwZSA9PT0gJ21vdXNlbW92ZScpIHtcbiAgICAgICAgICAgIHRoYXQuRVMubW91c2VNb3ZlKGRhdGFbaV0sIHRoYXQuX3BvaW50ZXIpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZXR5cGUgPT09ICdzY3JvbGwnKSB7XG4gICAgICAgICAgICB0aGF0LkVTLnNjcm9sbChkYXRhW2ldKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGV0eXBlID09PSAnY2xpY2snKSB7XG4gICAgICAgICAgICB0aGF0LkVTLmNsaWNrKGRhdGFbaV0pO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZXR5cGUgPT09ICdtb3VzZW92ZXInKSB7XG4gICAgICAgICAgICB0aGF0LkVTLm1vdXNlT3ZlcihkYXRhW2ldKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBSZW1vdmUgbW91c2UgcG9pbnRlclxuICAgICAgICAgICAqIGFmdGVyIGFuaW1hdGlvblxuICAgICAgICAgICAqL1xuXG4gICAgICAgICAgaWYoaSA9PT0gZGF0YS5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICB0aGF0Ll9wb2ludGVyLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhhdC5fcG9pbnRlcik7XG4gICAgICAgICAgfVxuICAgICAgICB9LGRhdGFbaV0udGltZSlcbiAgICAgIH0pKGksIHRoaXMuX2RhdGEpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEByZXR1cm5zIHt1bmRlZmluZWR9XG4gICAqL1xuXG4gIGNyZWF0ZU1vdXNlUG9pbnRlciAoKSB7XG4gICAgbGV0IHBvaW50ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgIC8qKlxuICAgICAqIHNldCBpbml0aWFsIHN0eWxlcyBmb3IgbW91c2UgcG9pbnRlclxuICAgICAqL1xuXG4gICAgcG9pbnRlci5jbGFzc05hbWUgPSAncmVwcm9kdWNlLXBvaW50ZXInO1xuICAgIHBvaW50ZXIuc3R5bGUud2lkdGggPSAnMjBweCc7XG4gICAgcG9pbnRlci5zdHlsZS5oZWlnaHQgPSAnMjBweCc7XG4gICAgcG9pbnRlci5zdHlsZS5wb3NpdGlvbiA9ICdmaXhlZCc7XG4gICAgcG9pbnRlci5zdHlsZS50b3AgPSAnMTBweCc7XG4gICAgcG9pbnRlci5zdHlsZS5sZWZ0ID0gJzEwcHgnO1xuICAgIHBvaW50ZXIuc3R5bGUuYmFja2dyb3VuZCA9ICd1cmwoXCJpbWcvcG9pbnRlcm0ucG5nXCIpJztcblxuICAgIC8qKlxuICAgICAqIEFwcGVuZCBwb2ludGVyXG4gICAgICovXG5cbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHBvaW50ZXIpO1xuICAgIHRoaXMuX3BvaW50ZXIgPSBwb2ludGVyO1xuICB9XG59XG5cbmV4cG9ydCB7UGxheWVyfVxuIiwiaW1wb3J0IHtFdmVudFJlY29yZGVyfSBmcm9tICcuLi9jb3JlL0V2ZW50L0V2ZW50UmVjb3JkZXIuanMnXG5cbi8qKlxuICogRXZlbnQgUmVjb3JkZXJcbiAqXG4gKiBAQXV0aG9yIE1hdGV1c3ogxZpwaWV3YWtcbiAqL1xuXG5jbGFzcyBSZWNvcmRlciB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICB0aGlzLl9ldmVudHMgPSBbJ21vdXNlbW92ZScsICdjbGljaycsICdtb3VzZW92ZXInLCAncmVzaXplJywgJ3Njcm9sbCcsJ2tleWRvd24nXTtcbiAgICB0aGlzLl9FUmluc3RhbmNlcyA9IFtdO1xuICAgIHRoaXMuX2NhbWVyYXMgPSBbXTtcbiAgICB0aGlzLl9kYXRhID0gW107XG4gICAgdGhpcy5pbml0SW5zdGFuY2VzKCk7XG4gIH1cblxuICAvKipcbiAgICogaW5pdCBFdmVudFJlY29yZGVyIGlzdGFuY2VcbiAgICogZm9yIGVhY2ggZXZlbnRcbiAgICogQHJldHVybnMge3VuZGVmaW5lZH1cbiAgICovXG5cbiAgaW5pdEluc3RhbmNlcyAoKSB7XG4gICAgbGV0IG9iaixcbiAgICAgICAgY2FtO1xuXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuX2V2ZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgb2JqID0gbmV3IEV2ZW50UmVjb3JkZXIodGhpcy5fZXZlbnRzW2ldKTtcbiAgICAgIGNhbSA9IG9iai5jYW1lcmEoKTtcblxuICAgICAgdGhpcy5fRVJpbnN0YW5jZXMucHVzaChvYmopO1xuICAgICAgdGhpcy5fY2FtZXJhcy5wdXNoKGNhbSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHJlY29yZGluZyBhbGwgZXZlbnRzXG4gICAqIEByZXR1cm5zIHt1bmRlZmluZWR9XG4gICAqL1xuXG4gIHJlY29yZCAoKSB7XG4gICAgY29uc29sZS5pbmZvKGBSZXByb2R1Y2UgOjogUmVjb3JkaW5nICR7dGhpcy5fZXZlbnRzfWApO1xuICAgIGxldCBzdGFydFRpbWUgPSBEYXRlLm5vdygpO1xuXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuX2NhbWVyYXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMuX2NhbWVyYXNbaV0ucmVjb3JkKHN0YXJ0VGltZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFN0b3AgcmVjb3JkaW5nIGFsbCBldmVudHNcbiAgICogQHJldHVybnMge3VuZGVmaW5lZH1cbiAgICovXG5cbiAgc3RvcCAoKSB7XG4gICAgY29uc29sZS5pbmZvKGBSZXByb2R1Y2UgOjogU3RvcCBSZWNvcmRpbmcgJHt0aGlzLl9ldmVudHN9YCk7XG5cbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5fY2FtZXJhcy5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5fY2FtZXJhc1tpXS5zdG9wKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhbGwgZGF0YVxuICAgKiBAcmV0dXJucyB7QXJyYXl9XG4gICAqL1xuXG4gIGdldERhdGEgKCkge1xuICAgIGxldCBhcnIgPSBbXTtcblxuICAgIGxldCBfY29tcCA9IGZ1bmN0aW9uIChhLGIpIHtcbiAgICAgIGlmKGEudGltZSA8IGIudGltZSkge3JldHVybiAtMTt9XG4gICAgICBpZihhLnRpbWUgPiBiLnRpbWUpIHtyZXR1cm4gMTt9XG4gICAgICByZXR1cm4gMDtcbiAgICB9O1xuXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuX0VSaW5zdGFuY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhcnIucHVzaCh0aGlzLl9FUmluc3RhbmNlc1tpXS5kYXRhKTtcbiAgICB9XG5cbiAgICBhcnIgPSBbXS5jb25jYXQuYXBwbHkoW10sIGFycik7XG4gICAgYXJyID0gYXJyLnNvcnQoX2NvbXApO1xuICAgIHJldHVybiBhcnI7XG4gIH1cbn1cblxuZXhwb3J0IHtSZWNvcmRlcn1cbiIsIi8qKlxuICpcbiAqXG4gKi9cblxuaW1wb3J0IHtxd2VzdH0gZnJvbSAnLi4vdmVuZG9yL3F3ZXN0LmpzJztcblxuY2xhc3MgUHJlcGFyZVN0eWxlcyB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICB0aGlzLiRsaW5rZWRDU1MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaW5rW3JlbD1cInN0eWxlc2hlZXRcIl0nKTtcbiAgICB0aGlzLiRpbmxpbmVkQ1NTID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnc3R5bGUnKTtcbiAgICB0aGlzLnJlcHJvZHVjZUNsYXNzID0gJy5yZXByb2R1Y2UtaG92ZXInO1xuICAgIHRoaXMucHJlcHJvY2Vzc0xpbmtlZENTUygpO1xuICB9XG5cbiAgcHJlcHJvY2Vzc0xpbmtlZENTUyAoKSB7XG4gICAgbGV0IHRoYXQgPSB0aGlzO1xuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB0aGlzLiRsaW5rZWRDU1MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHdpbmRvdy5xd2VzdC5nZXQodGhpcy4kbGlua2VkQ1NTW2ldLmhyZWYpLnRoZW4oZnVuY3Rpb24gKHIpIHtcbiAgICAgICAgdGhhdC5wcmVwcm9jZXNzQ1NTc3RyaW5nKHIudG9TdHJpbmcoKSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtcyB7c3RyaW5nfVxuICAgKiBAcmV0dXJuIHt1bmRlZmluZWR9XG4gICAqL1xuXG4gIHByZXByb2Nlc3NDU1NzdHJpbmcgKHN0cmluZykge1xuICAgIGxldCBDU1NTdHJpbmcgPSBzdHJpbmcucmVwbGFjZSgvOmhvdmVyL2csIHRoaXMucmVwcm9kdWNlQ2xhc3MpLFxuICAgICAgICBzdHlsZVNoZWV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcblxuICAgIHN0eWxlU2hlZXQudHlwZSA9ICd0ZXh0L2Nzcyc7XG4gICAgc3R5bGVTaGVldC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShDU1NTdHJpbmcpKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHN0eWxlU2hlZXQpO1xuICB9XG59XG5cbmV4cG9ydCB7UHJlcGFyZVN0eWxlc31cbiIsIi8qISBxd2VzdCAxLjYuMSAoaHR0cHM6Ly9naXRodWIuY29tL3B5cnNtay9xd2VzdCkgKi9cblxuOyhmdW5jdGlvbihjb250ZXh0LG5hbWUsZGVmaW5pdGlvbil7XG4gIGlmKHR5cGVvZiBtb2R1bGUhPSd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKXtcbiAgICBtb2R1bGUuZXhwb3J0cz1kZWZpbml0aW9uO1xuICB9XG4gIGVsc2UgaWYodHlwZW9mIGRlZmluZT09J2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKXtcbiAgICBkZWZpbmUoZGVmaW5pdGlvbik7XG4gIH1cbiAgZWxzZXtcbiAgICBjb250ZXh0W25hbWVdPWRlZmluaXRpb247XG4gIH1cbiAgfSh0aGlzLCdxd2VzdCcsZnVuY3Rpb24oKXtcbiAgdmFyIHdpbj13aW5kb3csXG4gICAgZG9jPWRvY3VtZW50LFxuICAgIGJlZm9yZSxcbiAgLy8gRGVmYXVsdCByZXNwb25zZSB0eXBlIGZvciBYRFIgaW4gYXV0byBtb2RlXG4gICAgZGVmYXVsdFhkclJlc3BvbnNlVHlwZT0nanNvbicsXG4gIC8vIFZhcmlhYmxlcyBmb3IgbGltaXQgbWVjaGFuaXNtXG4gICAgbGltaXQ9bnVsbCxcbiAgICByZXF1ZXN0cz0wLFxuICAgIHJlcXVlc3Rfc3RhY2s9W10sXG4gIC8vIEdldCBYTUxIdHRwUmVxdWVzdCBvYmplY3RcbiAgICBnZXRYSFI9ZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiB3aW4uWE1MSHR0cFJlcXVlc3Q/XG4gICAgICAgIG5ldyBYTUxIdHRwUmVxdWVzdCgpOlxuICAgICAgICBuZXcgQWN0aXZlWE9iamVjdCgnTWljcm9zb2Z0LlhNTEhUVFAnKTtcbiAgICB9LFxuICAvLyBHdWVzcyBYSFIgdmVyc2lvblxuICAgIHhocjI9KGdldFhIUigpLnJlc3BvbnNlVHlwZT09PScnKSxcblxuICAvLyBDb3JlIGZ1bmN0aW9uXG4gICAgcXdlc3Q9ZnVuY3Rpb24obWV0aG9kLHVybCxkYXRhLG9wdGlvbnMsYmVmb3JlKXtcblxuICAgICAgLy8gRm9ybWF0XG4gICAgICBtZXRob2Q9bWV0aG9kLnRvVXBwZXJDYXNlKCk7XG4gICAgICBkYXRhPWRhdGEgfHwgbnVsbDtcbiAgICAgIG9wdGlvbnM9b3B0aW9ucyB8fCB7fTtcblxuICAgICAgLy8gRGVmaW5lIHZhcmlhYmxlc1xuICAgICAgdmFyIG5hdGl2ZVJlc3BvbnNlUGFyc2luZz1mYWxzZSxcbiAgICAgICAgY3Jvc3NPcmlnaW4sXG4gICAgICAgIHhocixcbiAgICAgICAgeGRyPWZhbHNlLFxuICAgICAgICB0aW1lb3V0SW50ZXJ2YWwsXG4gICAgICAgIGFib3J0ZWQ9ZmFsc2UsXG4gICAgICAgIGF0dGVtcHRzPTAsXG4gICAgICAgIGhlYWRlcnM9e30sXG4gICAgICAgIG1pbWVUeXBlcz17XG4gICAgICAgICAgdGV4dDogJyovKicsXG4gICAgICAgICAgeG1sOiAndGV4dC94bWwnLFxuICAgICAgICAgIGpzb246ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICBwb3N0OiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xuICAgICAgICB9LFxuICAgICAgICBhY2NlcHQ9e1xuICAgICAgICAgIHRleHQ6ICcqLyonLFxuICAgICAgICAgIHhtbDogJ2FwcGxpY2F0aW9uL3htbDsgcT0xLjAsIHRleHQveG1sOyBxPTAuOCwgKi8qOyBxPTAuMScsXG4gICAgICAgICAganNvbjogJ2FwcGxpY2F0aW9uL2pzb247IHE9MS4wLCB0ZXh0Lyo7IHE9MC44LCAqLyo7IHE9MC4xJ1xuICAgICAgICB9LFxuICAgICAgICBjb250ZW50VHlwZT0nQ29udGVudC1UeXBlJyxcbiAgICAgICAgdmFycz0nJyxcbiAgICAgICAgaSxqLFxuICAgICAgICBzZXJpYWxpemVkLFxuICAgICAgICB0aGVuX3N0YWNrPVtdLFxuICAgICAgICBjYXRjaF9zdGFjaz1bXSxcbiAgICAgICAgY29tcGxldGVfc3RhY2s9W10sXG4gICAgICAgIHJlc3BvbnNlLFxuICAgICAgICBzdWNjZXNzLFxuICAgICAgICBlcnJvcixcbiAgICAgICAgZnVuYyxcblxuICAgICAgLy8gRGVmaW5lIHByb21pc2VzXG4gICAgICAgIHByb21pc2VzPXtcbiAgICAgICAgICB0aGVuOmZ1bmN0aW9uKGZ1bmMpe1xuICAgICAgICAgICAgaWYob3B0aW9ucy5hc3luYyl7XG4gICAgICAgICAgICAgIHRoZW5fc3RhY2sucHVzaChmdW5jKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYoc3VjY2Vzcyl7XG4gICAgICAgICAgICAgIGZ1bmMuY2FsbCh4aHIscmVzcG9uc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2VzO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgJ2NhdGNoJzpmdW5jdGlvbihmdW5jKXtcbiAgICAgICAgICAgIGlmKG9wdGlvbnMuYXN5bmMpe1xuICAgICAgICAgICAgICBjYXRjaF9zdGFjay5wdXNoKGZ1bmMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZihlcnJvcil7XG4gICAgICAgICAgICAgIGZ1bmMuY2FsbCh4aHIscmVzcG9uc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2VzO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgY29tcGxldGU6ZnVuY3Rpb24oZnVuYyl7XG4gICAgICAgICAgICBpZihvcHRpb25zLmFzeW5jKXtcbiAgICAgICAgICAgICAgY29tcGxldGVfc3RhY2sucHVzaChmdW5jKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgIGZ1bmMuY2FsbCh4aHIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2VzO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcHJvbWlzZXNfbGltaXQ9e1xuICAgICAgICAgIHRoZW46ZnVuY3Rpb24oZnVuYyl7XG4gICAgICAgICAgICByZXF1ZXN0X3N0YWNrW3JlcXVlc3Rfc3RhY2subGVuZ3RoLTFdLnRoZW4ucHVzaChmdW5jKTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlc19saW1pdDtcbiAgICAgICAgICB9LFxuICAgICAgICAgICdjYXRjaCc6ZnVuY3Rpb24oZnVuYyl7XG4gICAgICAgICAgICByZXF1ZXN0X3N0YWNrW3JlcXVlc3Rfc3RhY2subGVuZ3RoLTFdWydjYXRjaCddLnB1c2goZnVuYyk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZXNfbGltaXQ7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjb21wbGV0ZTpmdW5jdGlvbihmdW5jKXtcbiAgICAgICAgICAgIHJlcXVlc3Rfc3RhY2tbcmVxdWVzdF9zdGFjay5sZW5ndGgtMV0uY29tcGxldGUucHVzaChmdW5jKTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlc19saW1pdDtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgIC8vIEhhbmRsZSB0aGUgcmVzcG9uc2VcbiAgICAgICAgaGFuZGxlUmVzcG9uc2U9ZnVuY3Rpb24oKXtcbiAgICAgICAgICAvLyBWZXJpZnkgcmVxdWVzdCdzIHN0YXRlXG4gICAgICAgICAgLy8gLS0tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzcyODc3MDYvaWUtOS1qYXZhc2NyaXB0LWVycm9yLWMwMGMwMjNmXG4gICAgICAgICAgaWYoYWJvcnRlZCl7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIFByZXBhcmVcbiAgICAgICAgICB2YXIgaSxyZXEscCxyZXNwb25zZVR5cGU7XG4gICAgICAgICAgLS1yZXF1ZXN0cztcbiAgICAgICAgICAvLyBDbGVhciB0aGUgdGltZW91dFxuICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGltZW91dEludGVydmFsKTtcbiAgICAgICAgICAvLyBMYXVuY2ggbmV4dCBzdGFja2VkIHJlcXVlc3RcbiAgICAgICAgICBpZihyZXF1ZXN0X3N0YWNrLmxlbmd0aCl7XG4gICAgICAgICAgICByZXE9cmVxdWVzdF9zdGFjay5zaGlmdCgpO1xuICAgICAgICAgICAgcD1xd2VzdChyZXEubWV0aG9kLHJlcS51cmwscmVxLmRhdGEscmVxLm9wdGlvbnMscmVxLmJlZm9yZSk7XG4gICAgICAgICAgICBmb3IoaT0wO2Z1bmM9cmVxLnRoZW5baV07KytpKXtcbiAgICAgICAgICAgICAgcC50aGVuKGZ1bmMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yKGk9MDtmdW5jPXJlcVsnY2F0Y2gnXVtpXTsrK2kpe1xuICAgICAgICAgICAgICBwWydjYXRjaCddKGZ1bmMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yKGk9MDtmdW5jPXJlcS5jb21wbGV0ZVtpXTsrK2kpe1xuICAgICAgICAgICAgICBwLmNvbXBsZXRlKGZ1bmMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBIYW5kbGUgcmVzcG9uc2VcbiAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAvLyBWZXJpZnkgc3RhdHVzIGNvZGVcbiAgICAgICAgICAgIC8vIC0tLSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMDA0Njk3Mi9tc2llLXJldHVybnMtc3RhdHVzLWNvZGUtb2YtMTIyMy1mb3ItYWpheC1yZXF1ZXN0XG4gICAgICAgICAgICBpZignc3RhdHVzJyBpbiB4aHIgJiYgIS9eMnwxMjIzLy50ZXN0KHhoci5zdGF0dXMpKXtcbiAgICAgICAgICAgICAgdGhyb3cgeGhyLnN0YXR1cysnICgnK3hoci5zdGF0dXNUZXh0KycpJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEluaXRcbiAgICAgICAgICAgIHZhciByZXNwb25zZVRleHQ9J3Jlc3BvbnNlVGV4dCcsXG4gICAgICAgICAgICAgIHJlc3BvbnNlWE1MPSdyZXNwb25zZVhNTCcsXG4gICAgICAgICAgICAgIHBhcnNlRXJyb3I9J3BhcnNlRXJyb3InO1xuICAgICAgICAgICAgLy8gUHJvY2VzcyByZXNwb25zZVxuICAgICAgICAgICAgaWYobmF0aXZlUmVzcG9uc2VQYXJzaW5nICYmICdyZXNwb25zZScgaW4geGhyICYmIHhoci5yZXNwb25zZSE9PW51bGwpe1xuICAgICAgICAgICAgICByZXNwb25zZT14aHIucmVzcG9uc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmKG9wdGlvbnMucmVzcG9uc2VUeXBlPT0nZG9jdW1lbnQnKXtcbiAgICAgICAgICAgICAgdmFyIGZyYW1lPWRvYy5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcbiAgICAgICAgICAgICAgZnJhbWUuc3R5bGUuZGlzcGxheT0nbm9uZSc7XG4gICAgICAgICAgICAgIGRvYy5ib2R5LmFwcGVuZENoaWxkKGZyYW1lKTtcbiAgICAgICAgICAgICAgZnJhbWUuY29udGVudERvY3VtZW50Lm9wZW4oKTtcbiAgICAgICAgICAgICAgZnJhbWUuY29udGVudERvY3VtZW50LndyaXRlKHhoci5yZXNwb25zZSk7XG4gICAgICAgICAgICAgIGZyYW1lLmNvbnRlbnREb2N1bWVudC5jbG9zZSgpO1xuICAgICAgICAgICAgICByZXNwb25zZT1mcmFtZS5jb250ZW50RG9jdW1lbnQ7XG4gICAgICAgICAgICAgIGRvYy5ib2R5LnJlbW92ZUNoaWxkKGZyYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgIC8vIEd1ZXNzIHJlc3BvbnNlIHR5cGVcbiAgICAgICAgICAgICAgcmVzcG9uc2VUeXBlPW9wdGlvbnMucmVzcG9uc2VUeXBlO1xuICAgICAgICAgICAgICBpZihyZXNwb25zZVR5cGU9PSdhdXRvJyl7XG4gICAgICAgICAgICAgICAgaWYoeGRyKXtcbiAgICAgICAgICAgICAgICAgIHJlc3BvbnNlVHlwZT1kZWZhdWx0WGRyUmVzcG9uc2VUeXBlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgdmFyIGN0PXhoci5nZXRSZXNwb25zZUhlYWRlcihjb250ZW50VHlwZSkgfHwgJyc7XG4gICAgICAgICAgICAgICAgICBpZihjdC5pbmRleE9mKG1pbWVUeXBlcy5qc29uKT4tMSl7XG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlVHlwZT0nanNvbic7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBlbHNlIGlmKGN0LmluZGV4T2YobWltZVR5cGVzLnhtbCk+LTEpe1xuICAgICAgICAgICAgICAgICAgICByZXNwb25zZVR5cGU9J3htbCc7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICByZXNwb25zZVR5cGU9J3RleHQnO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAvLyBIYW5kbGUgcmVzcG9uc2UgdHlwZVxuICAgICAgICAgICAgICBzd2l0Y2gocmVzcG9uc2VUeXBlKXtcbiAgICAgICAgICAgICAgICBjYXNlICdqc29uJzpcbiAgICAgICAgICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgICAgICAgICAgaWYoJ0pTT04nIGluIHdpbil7XG4gICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2U9SlNPTi5wYXJzZSh4aHJbcmVzcG9uc2VUZXh0XSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZT1ldmFsKCcoJyt4aHJbcmVzcG9uc2VUZXh0XSsnKScpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBjYXRjaChlKXtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJFcnJvciB3aGlsZSBwYXJzaW5nIEpTT04gYm9keSA6IFwiK2U7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICd4bWwnOlxuICAgICAgICAgICAgICAgICAgLy8gQmFzZWQgb24galF1ZXJ5J3MgcGFyc2VYTUwoKSBmdW5jdGlvblxuICAgICAgICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgICAgICAgICAvLyBTdGFuZGFyZFxuICAgICAgICAgICAgICAgICAgICBpZih3aW4uRE9NUGFyc2VyKXtcbiAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZT0obmV3IERPTVBhcnNlcigpKS5wYXJzZUZyb21TdHJpbmcoeGhyW3Jlc3BvbnNlVGV4dF0sJ3RleHQveG1sJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gSUU8OVxuICAgICAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlPW5ldyBBY3RpdmVYT2JqZWN0KCdNaWNyb3NvZnQuWE1MRE9NJyk7XG4gICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UuYXN5bmM9J2ZhbHNlJztcbiAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5sb2FkWE1MKHhocltyZXNwb25zZVRleHRdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgY2F0Y2goZSl7XG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlPXVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmKCFyZXNwb25zZSB8fCAhcmVzcG9uc2UuZG9jdW1lbnRFbGVtZW50IHx8IHJlc3BvbnNlLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdwYXJzZXJlcnJvcicpLmxlbmd0aCl7XG4gICAgICAgICAgICAgICAgICAgIHRocm93ICdJbnZhbGlkIFhNTCc7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgcmVzcG9uc2U9eGhyW3Jlc3BvbnNlVGV4dF07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEV4ZWN1dGUgJ3RoZW4nIHN0YWNrXG4gICAgICAgICAgICBzdWNjZXNzPXRydWU7XG4gICAgICAgICAgICBwPXJlc3BvbnNlO1xuICAgICAgICAgICAgaWYob3B0aW9ucy5hc3luYyl7XG4gICAgICAgICAgICAgIGZvcihpPTA7ZnVuYz10aGVuX3N0YWNrW2ldOysraSl7XG4gICAgICAgICAgICAgICAgcD1mdW5jLmNhbGwoeGhyLHApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGNhdGNoKGUpe1xuICAgICAgICAgICAgZXJyb3I9dHJ1ZTtcbiAgICAgICAgICAgIC8vIEV4ZWN1dGUgJ2NhdGNoJyBzdGFja1xuICAgICAgICAgICAgaWYob3B0aW9ucy5hc3luYyl7XG4gICAgICAgICAgICAgIGZvcihpPTA7ZnVuYz1jYXRjaF9zdGFja1tpXTsrK2kpe1xuICAgICAgICAgICAgICAgIGZ1bmMuY2FsbCh4aHIsIGUsIHVybCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gRXhlY3V0ZSBjb21wbGV0ZSBzdGFja1xuICAgICAgICAgIGlmKG9wdGlvbnMuYXN5bmMpe1xuICAgICAgICAgICAgZm9yKGk9MDtmdW5jPWNvbXBsZXRlX3N0YWNrW2ldOysraSl7XG4gICAgICAgICAgICAgIGZ1bmMuY2FsbCh4aHIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgLy8gSGFuZGxlIGVycm9yc1xuICAgICAgICBoYW5kbGVFcnJvcj0gZnVuY3Rpb24oZSl7XG4gICAgICAgICAgZXJyb3I9dHJ1ZTtcbiAgICAgICAgICAtLXJlcXVlc3RzO1xuICAgICAgICAgIC8vIENsZWFyIHRoZSB0aW1lb3V0XG4gICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lb3V0SW50ZXJ2YWwpO1xuICAgICAgICAgIC8vIEV4ZWN1dGUgJ2NhdGNoJyBzdGFja1xuICAgICAgICAgIGlmKG9wdGlvbnMuYXN5bmMpe1xuICAgICAgICAgICAgZm9yKGk9MDtmdW5jPWNhdGNoX3N0YWNrW2ldOysraSl7XG4gICAgICAgICAgICAgIGZ1bmMuY2FsbCh4aHIsIGUsIHVybCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAvLyBSZWN1cnNpdmVseSBidWlsZCB0aGUgcXVlcnkgc3RyaW5nXG4gICAgICAgIGJ1aWxkRGF0YT1mdW5jdGlvbihkYXRhLGtleSl7XG4gICAgICAgICAgdmFyIHJlcz1bXSxcbiAgICAgICAgICAgIGVuYz1lbmNvZGVVUklDb21wb25lbnQsXG4gICAgICAgICAgICBwO1xuICAgICAgICAgIGlmKHR5cGVvZiBkYXRhPT09J29iamVjdCcgJiYgZGF0YSE9bnVsbCkge1xuICAgICAgICAgICAgZm9yKHAgaW4gZGF0YSkge1xuICAgICAgICAgICAgICBpZihkYXRhLmhhc093blByb3BlcnR5KHApKSB7XG4gICAgICAgICAgICAgICAgdmFyIGJ1aWx0PWJ1aWxkRGF0YShkYXRhW3BdLGtleT9rZXkrJ1snK3ArJ10nOnApO1xuICAgICAgICAgICAgICAgIGlmKGJ1aWx0IT09Jycpe1xuICAgICAgICAgICAgICAgICAgcmVzPXJlcy5jb25jYXQoYnVpbHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmKGRhdGEhPW51bGwgJiYga2V5IT1udWxsKXtcbiAgICAgICAgICAgIHJlcy5wdXNoKGVuYyhrZXkpKyc9JytlbmMoZGF0YSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVzLmpvaW4oJyYnKTtcbiAgICAgICAgfTtcblxuICAgICAgLy8gTmV3IHJlcXVlc3RcbiAgICAgICsrcmVxdWVzdHM7XG5cbiAgICAgIGlmICgncmV0cmllcycgaW4gb3B0aW9ucykge1xuICAgICAgICBpZiAod2luLmNvbnNvbGUgJiYgY29uc29sZS53YXJuKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKCdbUXdlc3RdIFRoZSByZXRyaWVzIG9wdGlvbiBpcyBkZXByZWNhdGVkLiBJdCBpbmRpY2F0ZXMgdG90YWwgbnVtYmVyIG9mIHJlcXVlc3RzIHRvIGF0dGVtcHQuIFBsZWFzZSB1c2UgdGhlIFwiYXR0ZW1wdHNcIiBvcHRpb24uJyk7XG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9ucy5hdHRlbXB0cyA9IG9wdGlvbnMucmV0cmllcztcbiAgICAgIH1cblxuICAgICAgLy8gTm9ybWFsaXplIG9wdGlvbnNcbiAgICAgIG9wdGlvbnMuYXN5bmM9J2FzeW5jJyBpbiBvcHRpb25zPyEhb3B0aW9ucy5hc3luYzp0cnVlO1xuICAgICAgb3B0aW9ucy5jYWNoZT0nY2FjaGUnIGluIG9wdGlvbnM/ISFvcHRpb25zLmNhY2hlOihtZXRob2QhPSdHRVQnKTtcbiAgICAgIG9wdGlvbnMuZGF0YVR5cGU9J2RhdGFUeXBlJyBpbiBvcHRpb25zP29wdGlvbnMuZGF0YVR5cGUudG9Mb3dlckNhc2UoKToncG9zdCc7XG4gICAgICBvcHRpb25zLnJlc3BvbnNlVHlwZT0ncmVzcG9uc2VUeXBlJyBpbiBvcHRpb25zP29wdGlvbnMucmVzcG9uc2VUeXBlLnRvTG93ZXJDYXNlKCk6J2F1dG8nO1xuICAgICAgb3B0aW9ucy51c2VyPW9wdGlvbnMudXNlciB8fCAnJztcbiAgICAgIG9wdGlvbnMucGFzc3dvcmQ9b3B0aW9ucy5wYXNzd29yZCB8fCAnJztcbiAgICAgIG9wdGlvbnMud2l0aENyZWRlbnRpYWxzPSEhb3B0aW9ucy53aXRoQ3JlZGVudGlhbHM7XG4gICAgICBvcHRpb25zLnRpbWVvdXQ9J3RpbWVvdXQnIGluIG9wdGlvbnM/cGFyc2VJbnQob3B0aW9ucy50aW1lb3V0LDEwKTozMDAwMDtcbiAgICAgIG9wdGlvbnMuYXR0ZW1wdHM9J2F0dGVtcHRzJyBpbiBvcHRpb25zP3BhcnNlSW50KG9wdGlvbnMuYXR0ZW1wdHMsMTApOjE7XG5cbiAgICAgIC8vIEd1ZXNzIGlmIHdlJ3JlIGRlYWxpbmcgd2l0aCBhIGNyb3NzLW9yaWdpbiByZXF1ZXN0XG4gICAgICBpPXVybC5tYXRjaCgvXFwvXFwvKC4rPylcXC8vKTtcbiAgICAgIGNyb3NzT3JpZ2luPWkgJiYgaVsxXT9pWzFdIT1sb2NhdGlvbi5ob3N0OmZhbHNlO1xuXG4gICAgICAvLyBQcmVwYXJlIGRhdGFcbiAgICAgIGlmKCdBcnJheUJ1ZmZlcicgaW4gd2luICYmIGRhdGEgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcil7XG4gICAgICAgIG9wdGlvbnMuZGF0YVR5cGU9J2FycmF5YnVmZmVyJztcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYoJ0Jsb2InIGluIHdpbiAmJiBkYXRhIGluc3RhbmNlb2YgQmxvYil7XG4gICAgICAgIG9wdGlvbnMuZGF0YVR5cGU9J2Jsb2InO1xuICAgICAgfVxuICAgICAgZWxzZSBpZignRG9jdW1lbnQnIGluIHdpbiAmJiBkYXRhIGluc3RhbmNlb2YgRG9jdW1lbnQpe1xuICAgICAgICBvcHRpb25zLmRhdGFUeXBlPSdkb2N1bWVudCc7XG4gICAgICB9XG4gICAgICBlbHNlIGlmKCdGb3JtRGF0YScgaW4gd2luICYmIGRhdGEgaW5zdGFuY2VvZiBGb3JtRGF0YSl7XG4gICAgICAgIG9wdGlvbnMuZGF0YVR5cGU9J2Zvcm1kYXRhJztcbiAgICAgIH1cbiAgICAgIHN3aXRjaChvcHRpb25zLmRhdGFUeXBlKXtcbiAgICAgICAgY2FzZSAnanNvbic6XG4gICAgICAgICAgZGF0YT1KU09OLnN0cmluZ2lmeShkYXRhKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncG9zdCc6XG4gICAgICAgICAgZGF0YT1idWlsZERhdGEoZGF0YSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFByZXBhcmUgaGVhZGVyc1xuICAgICAgaWYob3B0aW9ucy5oZWFkZXJzKXtcbiAgICAgICAgdmFyIGZvcm1hdD1mdW5jdGlvbihtYXRjaCxwMSxwMil7XG4gICAgICAgICAgcmV0dXJuIHAxK3AyLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgIH07XG4gICAgICAgIGZvcihpIGluIG9wdGlvbnMuaGVhZGVycyl7XG4gICAgICAgICAgaGVhZGVyc1tpLnJlcGxhY2UoLyhefC0pKFteLV0pL2csZm9ybWF0KV09b3B0aW9ucy5oZWFkZXJzW2ldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZighaGVhZGVyc1tjb250ZW50VHlwZV0gJiYgbWV0aG9kIT0nR0VUJyl7XG4gICAgICAgIGlmKG9wdGlvbnMuZGF0YVR5cGUgaW4gbWltZVR5cGVzKXtcbiAgICAgICAgICBpZihtaW1lVHlwZXNbb3B0aW9ucy5kYXRhVHlwZV0pe1xuICAgICAgICAgICAgaGVhZGVyc1tjb250ZW50VHlwZV09bWltZVR5cGVzW29wdGlvbnMuZGF0YVR5cGVdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYoIWhlYWRlcnMuQWNjZXB0KXtcbiAgICAgICAgaGVhZGVycy5BY2NlcHQ9KG9wdGlvbnMucmVzcG9uc2VUeXBlIGluIGFjY2VwdCk/YWNjZXB0W29wdGlvbnMucmVzcG9uc2VUeXBlXTonKi8qJztcbiAgICAgIH1cbiAgICAgIGlmKCFjcm9zc09yaWdpbiAmJiAhaGVhZGVyc1snWC1SZXF1ZXN0ZWQtV2l0aCddKXsgLy8gYmVjYXVzZSB0aGF0IGhlYWRlciBicmVha3MgaW4gbGVnYWN5IGJyb3dzZXJzIHdpdGggQ09SU1xuICAgICAgICBoZWFkZXJzWydYLVJlcXVlc3RlZC1XaXRoJ109J1hNTEh0dHBSZXF1ZXN0JztcbiAgICAgIH1cblxuICAgICAgLy8gUHJlcGFyZSBVUkxcbiAgICAgIGlmKG1ldGhvZD09J0dFVCcgJiYgZGF0YSl7XG4gICAgICAgIHZhcnMrPWRhdGE7XG4gICAgICB9XG4gICAgICBpZighb3B0aW9ucy5jYWNoZSl7XG4gICAgICAgIGlmKHZhcnMpe1xuICAgICAgICAgIHZhcnMrPScmJztcbiAgICAgICAgfVxuICAgICAgICB2YXJzKz0nX190PScrKCtuZXcgRGF0ZSgpKTtcbiAgICAgIH1cbiAgICAgIGlmKHZhcnMpe1xuICAgICAgICB1cmwrPSgvXFw/Ly50ZXN0KHVybCk/JyYnOic/JykrdmFycztcbiAgICAgIH1cblxuICAgICAgLy8gVGhlIGxpbWl0IGhhcyBiZWVuIHJlYWNoZWQsIHN0b2NrIHRoZSByZXF1ZXN0XG4gICAgICBpZihsaW1pdCAmJiByZXF1ZXN0cz09bGltaXQpe1xuICAgICAgICByZXF1ZXN0X3N0YWNrLnB1c2goe1xuICAgICAgICAgIG1ldGhvZFx0OiBtZXRob2QsXG4gICAgICAgICAgdXJsXHRcdDogdXJsLFxuICAgICAgICAgIGRhdGFcdDogZGF0YSxcbiAgICAgICAgICBvcHRpb25zXHQ6IG9wdGlvbnMsXG4gICAgICAgICAgYmVmb3JlXHQ6IGJlZm9yZSxcbiAgICAgICAgICB0aGVuXHQ6IFtdLFxuICAgICAgICAgICdjYXRjaCdcdDogW10sXG4gICAgICAgICAgY29tcGxldGU6IFtdXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJvbWlzZXNfbGltaXQ7XG4gICAgICB9XG5cbiAgICAgIC8vIFNlbmQgdGhlIHJlcXVlc3RcbiAgICAgIHZhciBzZW5kPWZ1bmN0aW9uKCl7XG4gICAgICAgIC8vIEdldCBYSFIgb2JqZWN0XG4gICAgICAgIHhocj1nZXRYSFIoKTtcbiAgICAgICAgaWYoY3Jvc3NPcmlnaW4pe1xuICAgICAgICAgIGlmKCEoJ3dpdGhDcmVkZW50aWFscycgaW4geGhyKSAmJiB3aW4uWERvbWFpblJlcXVlc3Qpe1xuICAgICAgICAgICAgeGhyPW5ldyBYRG9tYWluUmVxdWVzdCgpOyAvLyBDT1JTIHdpdGggSUU4LzlcbiAgICAgICAgICAgIHhkcj10cnVlO1xuICAgICAgICAgICAgaWYobWV0aG9kIT0nR0VUJyAmJiBtZXRob2QhPSdQT1NUJyl7XG4gICAgICAgICAgICAgIG1ldGhvZD0nUE9TVCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIE9wZW4gY29ubmVjdGlvblxuICAgICAgICBpZih4ZHIpe1xuICAgICAgICAgIHhoci5vcGVuKG1ldGhvZCx1cmwpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgeGhyLm9wZW4obWV0aG9kLHVybCxvcHRpb25zLmFzeW5jLG9wdGlvbnMudXNlcixvcHRpb25zLnBhc3N3b3JkKTtcbiAgICAgICAgICBpZih4aHIyICYmIG9wdGlvbnMuYXN5bmMpe1xuICAgICAgICAgICAgeGhyLndpdGhDcmVkZW50aWFscz1vcHRpb25zLndpdGhDcmVkZW50aWFscztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gU2V0IGhlYWRlcnNcbiAgICAgICAgaWYoIXhkcil7XG4gICAgICAgICAgZm9yKHZhciBpIGluIGhlYWRlcnMpe1xuICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoaSxoZWFkZXJzW2ldKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gVmVyaWZ5IGlmIHRoZSByZXNwb25zZSB0eXBlIGlzIHN1cHBvcnRlZCBieSB0aGUgY3VycmVudCBicm93c2VyXG4gICAgICAgIGlmKHhocjIgJiYgb3B0aW9ucy5yZXNwb25zZVR5cGUhPSdkb2N1bWVudCcgJiYgb3B0aW9ucy5yZXNwb25zZVR5cGUhPSdhdXRvJyl7IC8vIERvbid0IHZlcmlmeSBmb3IgJ2RvY3VtZW50JyBzaW5jZSB3ZSdyZSB1c2luZyBhbiBpbnRlcm5hbCByb3V0aW5lXG4gICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgeGhyLnJlc3BvbnNlVHlwZT1vcHRpb25zLnJlc3BvbnNlVHlwZTtcbiAgICAgICAgICAgIG5hdGl2ZVJlc3BvbnNlUGFyc2luZz0oeGhyLnJlc3BvbnNlVHlwZT09b3B0aW9ucy5yZXNwb25zZVR5cGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjYXRjaChlKXt9XG4gICAgICAgIH1cbiAgICAgICAgLy8gUGx1ZyByZXNwb25zZSBoYW5kbGVyXG4gICAgICAgIGlmKHhocjIgfHwgeGRyKXtcbiAgICAgICAgICB4aHIub25sb2FkPWhhbmRsZVJlc3BvbnNlO1xuICAgICAgICAgIHhoci5vbmVycm9yPWhhbmRsZUVycm9yO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZT1mdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYoeGhyLnJlYWR5U3RhdGU9PTQpe1xuICAgICAgICAgICAgICBoYW5kbGVSZXNwb25zZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgLy8gT3ZlcnJpZGUgbWltZSB0eXBlIHRvIGVuc3VyZSB0aGUgcmVzcG9uc2UgaXMgd2VsbCBwYXJzZWRcbiAgICAgICAgaWYob3B0aW9ucy5yZXNwb25zZVR5cGUhPSdhdXRvJyAmJiAnb3ZlcnJpZGVNaW1lVHlwZScgaW4geGhyKXtcbiAgICAgICAgICB4aHIub3ZlcnJpZGVNaW1lVHlwZShtaW1lVHlwZXNbb3B0aW9ucy5yZXNwb25zZVR5cGVdKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBSdW4gJ2JlZm9yZScgY2FsbGJhY2tcbiAgICAgICAgaWYoYmVmb3JlKXtcbiAgICAgICAgICBiZWZvcmUuY2FsbCh4aHIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFNlbmQgcmVxdWVzdFxuICAgICAgICBpZih4ZHIpe1xuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXsgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1hEb21haW5SZXF1ZXN0XG4gICAgICAgICAgICB4aHIuc2VuZChtZXRob2QhPSdHRVQnP2RhdGE6bnVsbCk7XG4gICAgICAgICAgfSwwKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgIHhoci5zZW5kKG1ldGhvZCE9J0dFVCc/ZGF0YTpudWxsKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgLy8gVGltZW91dC9hdHRlbXB0c1xuICAgICAgdmFyIHRpbWVvdXQ9ZnVuY3Rpb24oKXtcbiAgICAgICAgdGltZW91dEludGVydmFsPXNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICBhYm9ydGVkPXRydWU7XG4gICAgICAgICAgeGhyLmFib3J0KCk7XG4gICAgICAgICAgaWYoIW9wdGlvbnMuYXR0ZW1wdHMgfHwgKythdHRlbXB0cyE9b3B0aW9ucy5hdHRlbXB0cyl7XG4gICAgICAgICAgICBhYm9ydGVkPWZhbHNlO1xuICAgICAgICAgICAgdGltZW91dCgpO1xuICAgICAgICAgICAgc2VuZCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgYWJvcnRlZD1mYWxzZTtcbiAgICAgICAgICAgIGVycm9yPXRydWU7XG4gICAgICAgICAgICByZXNwb25zZT0nVGltZW91dCAoJyt1cmwrJyknO1xuICAgICAgICAgICAgaWYob3B0aW9ucy5hc3luYyl7XG4gICAgICAgICAgICAgIGZvcihpPTA7ZnVuYz1jYXRjaF9zdGFja1tpXTsrK2kpe1xuICAgICAgICAgICAgICAgIGZ1bmMuY2FsbCh4aHIscmVzcG9uc2UpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LG9wdGlvbnMudGltZW91dCk7XG4gICAgICB9O1xuXG4gICAgICAvLyBTdGFydCB0aGUgcmVxdWVzdFxuICAgICAgdGltZW91dCgpO1xuICAgICAgc2VuZCgpO1xuXG4gICAgICAvLyBSZXR1cm4gcHJvbWlzZXNcbiAgICAgIHJldHVybiBwcm9taXNlcztcblxuICAgIH07XG5cbiAgLy8gUmV0dXJuIGV4dGVybmFsIHF3ZXN0IG9iamVjdFxuICB2YXIgY3JlYXRlPWZ1bmN0aW9uKG1ldGhvZCl7XG4gICAgICByZXR1cm4gZnVuY3Rpb24odXJsLGRhdGEsb3B0aW9ucyl7XG4gICAgICAgIHZhciBiPWJlZm9yZTtcbiAgICAgICAgYmVmb3JlPW51bGw7XG4gICAgICAgIHJldHVybiBxd2VzdChtZXRob2QsdGhpcy5iYXNlK3VybCxkYXRhLG9wdGlvbnMsYik7XG4gICAgICB9O1xuICAgIH0sXG4gICAgb2JqPXtcbiAgICAgIGJhc2U6ICcnLFxuICAgICAgYmVmb3JlOiBmdW5jdGlvbihjYWxsYmFjayl7XG4gICAgICAgIGJlZm9yZT1jYWxsYmFjaztcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgIH0sXG4gICAgICBnZXQ6IGNyZWF0ZSgnR0VUJyksXG4gICAgICBwb3N0OiBjcmVhdGUoJ1BPU1QnKSxcbiAgICAgIHB1dDogY3JlYXRlKCdQVVQnKSxcbiAgICAgICdkZWxldGUnOiBjcmVhdGUoJ0RFTEVURScpLFxuICAgICAgeGhyMjogeGhyMixcbiAgICAgIGxpbWl0OiBmdW5jdGlvbihieSl7XG4gICAgICAgIGxpbWl0PWJ5O1xuICAgICAgfSxcbiAgICAgIHNldERlZmF1bHRYZHJSZXNwb25zZVR5cGU6IGZ1bmN0aW9uKHR5cGUpe1xuICAgICAgICBkZWZhdWx0WGRyUmVzcG9uc2VUeXBlPXR5cGUudG9Mb3dlckNhc2UoKTtcbiAgICAgIH1cbiAgICB9O1xuICB3aW5kb3cucXdlc3QgPSBvYmo7XG4gIHJldHVybiBvYmo7XG5cbn0oKSkpO1xuIl19
