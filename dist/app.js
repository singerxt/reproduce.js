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

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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
                } else if (etype === "resize") {
                  that.ES.resize(data[i]);
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

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

    console.log(qwest);
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
    console.log(definition);
    module.exports = {
      dupa: "dupa"
    };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbWF0ZXVzei9EZXNrdG9wL3JlczYvc3JjL2FwcC5qcyIsIi9Vc2Vycy9tYXRldXN6L0Rlc2t0b3AvcmVzNi9zcmMvY29yZS9FdmVudC9FdmVudFJlY29yZGVyLmpzIiwiL1VzZXJzL21hdGV1c3ovRGVza3RvcC9yZXM2L3NyYy9jb3JlL0V2ZW50L0V2ZW50U2ltdWxhdG9yLmpzIiwiL1VzZXJzL21hdGV1c3ovRGVza3RvcC9yZXM2L3NyYy9jb3JlL2ludGVyZmFjZS9VSS5qcyIsIi9Vc2Vycy9tYXRldXN6L0Rlc2t0b3AvcmVzNi9zcmMvbW9kdWxlcy9QbGF5ZXIuanMiLCIvVXNlcnMvbWF0ZXVzei9EZXNrdG9wL3JlczYvc3JjL21vZHVsZXMvUmVjb3JkZXIuanMiLCIvVXNlcnMvbWF0ZXVzei9EZXNrdG9wL3JlczYvc3JjL21vZHVsZXMvc3R5bGVzLmpzIiwiL1VzZXJzL21hdGV1c3ovRGVza3RvcC9yZXM2L3NyYy92ZW5kb3IvcXdlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUEsWUFBWSxDQUFDOztBQUViLElBRlEsRUFBRSxHQUFBLE9BQUEsQ0FBTyx3QkFBd0IsQ0FBQSxDQUFqQyxFQUFFLENBQUE7O0FBSVYsSUFIUSxhQUFhLEdBQUEsT0FBQSxDQUFPLHFCQUFxQixDQUFBLENBQXpDLGFBQWEsQ0FBQTs7QUFFckIsTUFBTSxDQUFDLEdBQUcsR0FBRyxZQUFZO0FBQ3ZCLE1BQUksQ0FBQyxHQUFHLElBQUksRUFBRSxFQUFFLENBQUM7QUFDakIsTUFBSSxhQUFhLEVBQUUsQ0FBQztBQUNwQixHQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Q0FDVixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lDQ0ksYUFBYTs7Ozs7O0FBTUwsV0FOUixhQUFhLENBTUosU0FBUyxFQUFFOzBCQU5wQixhQUFhOztB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Q3hCLFlBQU0sR0FBQyxRQUFRLENBQUM7QUFDaEIsYUFBTyxHQUFHLENBQUM7S0FDWixDQUFBO0FBQ0QsT0FBRyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDbEIsUUFBSSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDcEIsT0FBRyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDbEIsWUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFDMUIsUUFBSSxFQUFFLElBQUk7QUFDVixTQUFLOzs7Ozs7Ozs7O09BQUUsVUFBUyxFQUFFLEVBQUM7QUFDakIsV0FBSyxHQUFDLEVBQUUsQ0FBQztLQUNWLENBQUE7QUFDRCw2QkFBeUIsRUFBRSxtQ0FBUyxJQUFJLEVBQUM7QUFDdkMsNEJBQXNCLEdBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0tBQzNDO0dBQ0YsQ0FBQztBQUNKLFFBQU0sQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO0FBQ25CLFNBQU8sR0FBRyxDQUFDO0NBRVosQ0FBQSxFQUFFLENBQUMsQ0FBRSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQge1VJfSBmcm9tICcuL2NvcmUvaW50ZXJmYWNlL1VJLmpzJztcbmltcG9ydCB7UHJlcGFyZVN0eWxlc30gZnJvbSAnLi9tb2R1bGVzL3N0eWxlcy5qcyc7XG5cbmdsb2JhbC5hcHAgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBVID0gbmV3IFVJKCk7XG4gIG5ldyBQcmVwYXJlU3R5bGVzKCk7XG4gIFUuaW5pdCgpO1xufTtcblxuXG4iLCIvKipcbiAqIEV2ZW50IFJlY29yZGVyXG4gKlxuICogQEF1dGhvciBNYXRldXN6IMWacGlld2FrXG4gKiBAcGFyYW1zIHtzdHJpbmd9XG4gKiBAcmV0dXJucyB7b2JqZWN0fVxuICovXG5cbmNsYXNzIEV2ZW50UmVjb3JkZXIge1xuXG4gIC8qKlxuICAgKlxuICAgKi9cblxuICBjb25zdHJ1Y3RvciAoZXZlbnRUeXBlKSB7XG4gICAgdGhpcy5fZGF0YSA9IFtdO1xuICAgIHRoaXMuX2luaXREYXRlID0gRGF0ZS5ub3coKTtcbiAgICB0aGlzLl9ldmVudFR5cGUgPSBldmVudFR5cGU7XG4gIH1cblxuICAvKipcbiAgICogUHVzaGluZyBkYXRhIGZyb20gZXZlbnRcbiAgICogdG8gQXJyYXkgb2Ygb2JqZWN0c1xuICAgKiBAcGFyYW1zIHtldmVudH1cbiAgICogQHJldHVybnMge0FycmF5fVxuICAgKi9cblxuICBwdXNoRGF0YSAoZXZlbnQpIHtcbiAgICBsZXQgdGltZVN0YW1wID0gZXZlbnQudGltZVN0YW1wIC0gdGhpcy5faW5pdERhdGU7XG4gICAgdGhpcy5fZGF0YS5wdXNoKHtcbiAgICAgIHBvc1k6IGV2ZW50LnksXG4gICAgICBwb3NYOiBldmVudC54LFxuICAgICAgdGltZTogdGltZVN0YW1wLFxuICAgICAgdHlwZTogZXZlbnQudHlwZSxcbiAgICAgIHdpZHRoOiBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoLFxuICAgICAgcG9zaXRpb25ZOiB3aW5kb3cuc2Nyb2xsWVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBzYXZlZCBkYXRhXG4gICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICovXG5cbiAgZ2V0IGRhdGEgKCkge1xuICAgIHJldHVybiB0aGlzLl9kYXRhO1xuICB9XG5cbiAgLyoqXG4gICAqIFByZXBhcmUgQXBpIGZvciBSZWNvcmRpbmdcbiAgICpcbiAgICogQHJldHVybnMge3tyZWNvcmQ6IEZ1bmN0aW9uLCBzdG9wOiBGdW5jdGlvbn19XG4gICAqL1xuXG4gIGNhbWVyYSAoKSB7XG4gICAgbGV0IHB1c2hEYXRhID0gdGhpcy5wdXNoRGF0YS5iaW5kKHRoaXMpO1xuICAgIGxldCB0aGF0ID0gdGhpcztcbiAgICByZXR1cm4ge1xuICAgICAgcmVjb3JkOiBmdW5jdGlvbiAoc3RhcnRUaW1lKSB7XG4gICAgICAgIHRoYXQuX2luaXREYXRlID0gc3RhcnRUaW1lO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKHRoYXQuX2V2ZW50VHlwZSwgcHVzaERhdGEsIGZhbHNlKTtcbiAgICAgIH0sXG4gICAgICBzdG9wOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIodGhhdC5fZXZlbnRUeXBlLCBwdXNoRGF0YSwgZmFsc2UpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQge0V2ZW50UmVjb3JkZXJ9XG4iLCIvKipcbiAqIEV2ZW50IHNpbXVsYXRvclxuICpcbiAqIEBBdXRob3IgTWF0ZXVzeiDFmnBpZXdha1xuICovXG5cbmNsYXNzIEV2ZW50U2ltdWxhdG9yIHtcblxuICAvKipcbiAgICpcbiAgICovXG5cbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHRoaXMuX2xhc3RNb3VzZU92ZXIgPSB7XG4gICAgICB4OiAwLFxuICAgICAgeTogMFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogU2V0IGNvcnJlY3Qgc2Nyb2xsIHBvc2l0aW9uXG4gICAqIEBwYXJhbSBkYXRhXG4gICAqL1xuXG4gIHNjcm9sbCAoZGF0YSkge1xuICAgIHdpbmRvdy5zY3JvbGwoMCwgZGF0YS5wb3NpdGlvblkpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1vdXNlIG1vdmUgYW5pbWF0aW9uXG4gICAqIEBwYXJhbSBkYXRhXG4gICAqIEBwYXJhbSBlbGVtXG4gICAqL1xuXG4gIG1vdXNlTW92ZSAoZGF0YSwgZWxlbSkge1xuICAgIGVsZW0uc3R5bGUubGVmdCA9IGRhdGEucG9zWCArIDUgKyAncHgnO1xuICAgIGVsZW0uc3R5bGUudG9wID0gZGF0YS5wb3NZICsgNSArICdweCc7XG4gIH1cblxuICAvKipcbiAgICogU2V0IGNvcnJlY3QgPGJvZHk+IHdpZHRoXG4gICAqIEBwYXJhbSBkYXRhXG4gICAqL1xuXG4gIHJlc2l6ZSAoZGF0YSkge1xuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUud2lkdGggPSBkYXRhLndpZHRoICsgJ3B4J1xuICB9XG5cbiAgLyoqXG4gICAqIEVtdWxhdGUgY2xpY2sgZXZlbnRcbiAgICogQG5vdGVzIEZvciBub3cgd2UgZG9uJ3QgaGF2ZSBJRSBzdXBwb3J0XG4gICAqIEBwYXJhbSBkYXRhXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cblxuICBjbGljayAoZGF0YSkge1xuICAgIGxldCAkZWxlbSA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoZGF0YS5wb3NYLCBkYXRhLnBvc1kpLFxuICAgICAgICBvcHRpb25zID0gIHtcbiAgICAgICAgICB2aWV3OiB3aW5kb3csXG4gICAgICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgICAgICBjYW5jZWxhYmxlOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIF9ldmVudCA9IG5ldyBFdmVudCgnY2xpY2snLCBvcHRpb25zKTtcblxuICAgIGlmKCEoJGVsZW0pKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgJGVsZW0uc3R5bGUub3BhY2l0eSA9ICcwLjUnO1xuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAkZWxlbS5zdHlsZS5vcGFjaXR5ID0gJzEnO1xuICAgIH0sMTAwKTtcblxuICAgICRlbGVtLmRpc3BhdGNoRXZlbnQoX2V2ZW50KTtcbiAgfVxuXG4gIG1vdXNlT3ZlciAoZGF0YSkge1xuICAgIGxldCAkZWxlbSA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoZGF0YS5wb3NYLCBkYXRhLnBvc1kpLFxuICAgICAgICAkZWxlbU9sZCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQodGhpcy5fbGFzdE1vdXNlT3Zlci5wb3NYLCB0aGlzLl9sYXN0TW91c2VPdmVyLnBvc1kpLFxuICAgICAgb3B0aW9ucyA9ICB7XG4gICAgICAgIHZpZXc6IHdpbmRvdyxcbiAgICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZVxuICAgICAgfSxcbiAgICAgIF9ldmVudE1vdXNlT3ZlciA9IG5ldyBFdmVudCgnbW91c2VvdmVyJywgb3B0aW9ucyksXG4gICAgICBfZXZlbnRNb3VzZU91dCA9IG5ldyBFdmVudCgnbW91c2VvdXQnLCBvcHRpb25zKTtcblxuICAgICRlbGVtLmNsYXNzTmFtZSArPSAnIHJlcHJvZHVjZS1ob3ZlciAnO1xuICAgICRlbGVtT2xkLmNsYXNzTmFtZSA9ICRlbGVtT2xkLmNsYXNzTmFtZS5yZXBsYWNlKCdyZXByb2R1Y2UtaG92ZXInLCAnJyk7XG4gICAgJGVsZW0uZGlzcGF0Y2hFdmVudChfZXZlbnRNb3VzZU92ZXIpO1xuICAgICRlbGVtT2xkLmRpc3BhdGNoRXZlbnQoX2V2ZW50TW91c2VPdXQpO1xuXG4gICAgdGhpcy5fbGFzdE1vdXNlT3ZlciA9IGRhdGE7XG4gIH1cbn1cblxuZXhwb3J0IHtFdmVudFNpbXVsYXRvcn1cbiIsImltcG9ydCB7UmVjb3JkZXJ9IGZyb20gJy4uLy4uL21vZHVsZXMvUmVjb3JkZXIuanMnO1xuaW1wb3J0IHtQbGF5ZXJ9IGZyb20gJy4uLy4uL21vZHVsZXMvUGxheWVyLmpzJztcblxuY2xhc3MgVUkge1xuXG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICB0aGlzLlJlY29yZGVyID0gbmV3IFJlY29yZGVyKCk7XG4gICAgdGhpcy5QbGF5ZXIgPSBuZXcgUGxheWVyKCk7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG5cbiAgdGVtcGxhdGUgKCkge1xuICAgIGxldCAkdGVtcCA9ICc8ZGl2IGNsYXNzPVwicmVwcm9kdWNlLXVpXCI+PGJ1dHRvbiBjbGFzcz1cInBsYXlcIj5wbGF5PC9idXR0b24+PGJ1dHRvbiBjbGFzcz1cInJlY29yZFwiPnJlY29yZDwvYnV0dG9uPjxidXR0b24gY2xhc3M9XCJzdG9wXCI+c3RvcDwvYnV0dG9uPjwvPidcbiAgICByZXR1cm4gJHRlbXA7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHJldHVybnMge3VuZGVmaW5lZH1cbiAgICovXG5cbiAgYXBwZW5kQnV0dG9ucyAoKSB7XG4gICAgbGV0ICRib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpO1xuICAgICRib2R5Lmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJyx0aGlzLnRlbXBsYXRlKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEByZXR1cm5zIHt1bmRlZmluZWR9XG4gICAqL1xuICBpbml0ICgpIHtcbiAgICB0aGlzLmFwcGVuZEJ1dHRvbnMoKTtcblxuICAgIGxldCAkYnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5yZXByb2R1Y2UtdWkgYnV0dG9uJyk7XG5cblxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCAkYnV0dG9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5jbGljaygkYnV0dG9uc1tpXSk7XG4gICAgfVxuICB9XG5cbiAgY2xpY2sgKCRlbGVtKSB7XG4gICAgbGV0IHRoYXQgPSB0aGlzO1xuICAgICRlbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgaWYodGhpcy5jbGFzc05hbWUgPT09ICdwbGF5Jykge1xuICAgICAgICB0aGF0LlJlY29yZGVyLnN0b3AoKTtcbiAgICAgICAgdGhhdC5QbGF5ZXIuX2RhdGEgPSB0aGF0LlJlY29yZGVyLmdldERhdGEoKTtcbiAgICAgICAgdGhhdC5QbGF5ZXIucGxheSgpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmNsYXNzTmFtZSA9PT0gJ3JlY29yZCcpIHtcbiAgICAgICAgdGhhdC5SZWNvcmRlci5yZWNvcmQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoYXQuUmVjb3JkZXIuc3RvcCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCB7VUl9XG4iLCJpbXBvcnQge0V2ZW50U2ltdWxhdG9yfSBmcm9tICcuLi9jb3JlL0V2ZW50L0V2ZW50U2ltdWxhdG9yLmpzJztcblxuLyoqXG4gKiBFdmVudCBSZWNvcmRlclxuICpcbiAqIEBBdXRob3IgTWF0ZXVzeiDFmnBpZXdha1xuICogQHBhcmFtcyBkYXRhXG4gKi9cblxuY2xhc3MgUGxheWVyIHtcbiAgY29uc3RydWN0b3IgKGRhdGEpIHtcbiAgICB0aGlzLl9kYXRhID0gZGF0YTtcbiAgICB0aGlzLkVTID0gbmV3IEV2ZW50U2ltdWxhdG9yKCk7XG4gIH1cblxuICAvKipcbiAgICogQW5pbWF0aW9uIGxvb3BcbiAgICovXG5cbiAgcGxheSAoKSB7XG4gICAgdGhpcy5jcmVhdGVNb3VzZVBvaW50ZXIoKTtcbiAgICBsZXQgdGhhdCA9IHRoaXM7XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuX2RhdGEubGVuZ3RoOyBpKyspIHtcblxuICAgICAgLyoqXG4gICAgICAgKiBOZWVkIHRvIGNyZWF0ZSBuZXcgc2NvcGVjY1xuICAgICAgICovXG5cbiAgICAgIChmdW5jdGlvbiAoaSwgZGF0YSkge1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBsZXQgZXR5cGUgPSBkYXRhW2ldLnR5cGU7XG5cbiAgICAgICAgICBpZihldHlwZSA9PT0gJ21vdXNlbW92ZScpIHtcbiAgICAgICAgICAgIHRoYXQuRVMubW91c2VNb3ZlKGRhdGFbaV0sIHRoYXQuX3BvaW50ZXIpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZXR5cGUgPT09ICdzY3JvbGwnKSB7XG4gICAgICAgICAgICB0aGF0LkVTLnNjcm9sbChkYXRhW2ldKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGV0eXBlID09PSAnY2xpY2snKSB7XG4gICAgICAgICAgICB0aGF0LkVTLmNsaWNrKGRhdGFbaV0pO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZXR5cGUgPT09ICdtb3VzZW92ZXInKSB7XG4gICAgICAgICAgICB0aGF0LkVTLm1vdXNlT3ZlcihkYXRhW2ldKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGV0eXBlID09PSAncmVzaXplJykge1xuICAgICAgICAgICAgdGhhdC5FUy5yZXNpemUoZGF0YVtpXSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogUmVtb3ZlIG1vdXNlIHBvaW50ZXJcbiAgICAgICAgICAgKiBhZnRlciBhbmltYXRpb25cbiAgICAgICAgICAgKi9cblxuICAgICAgICAgIGlmKGkgPT09IGRhdGEubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgdGhhdC5fcG9pbnRlci5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoYXQuX3BvaW50ZXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxkYXRhW2ldLnRpbWUpXG4gICAgICB9KShpLCB0aGlzLl9kYXRhKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcmV0dXJucyB7dW5kZWZpbmVkfVxuICAgKi9cblxuICBjcmVhdGVNb3VzZVBvaW50ZXIgKCkge1xuICAgIGxldCBwb2ludGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICAvKipcbiAgICAgKiBzZXQgaW5pdGlhbCBzdHlsZXMgZm9yIG1vdXNlIHBvaW50ZXJcbiAgICAgKi9cblxuICAgIHBvaW50ZXIuY2xhc3NOYW1lID0gJ3JlcHJvZHVjZS1wb2ludGVyJztcbiAgICBwb2ludGVyLnN0eWxlLndpZHRoID0gJzIwcHgnO1xuICAgIHBvaW50ZXIuc3R5bGUuaGVpZ2h0ID0gJzIwcHgnO1xuICAgIHBvaW50ZXIuc3R5bGUucG9zaXRpb24gPSAnZml4ZWQnO1xuICAgIHBvaW50ZXIuc3R5bGUudG9wID0gJzEwcHgnO1xuICAgIHBvaW50ZXIuc3R5bGUubGVmdCA9ICcxMHB4JztcbiAgICBwb2ludGVyLnN0eWxlLmJhY2tncm91bmQgPSAndXJsKFwiaW1nL3BvaW50ZXJtLnBuZ1wiKSc7XG5cbiAgICAvKipcbiAgICAgKiBBcHBlbmQgcG9pbnRlclxuICAgICAqL1xuXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChwb2ludGVyKTtcbiAgICB0aGlzLl9wb2ludGVyID0gcG9pbnRlcjtcbiAgfVxufVxuXG5leHBvcnQge1BsYXllcn1cbiIsImltcG9ydCB7RXZlbnRSZWNvcmRlcn0gZnJvbSAnLi4vY29yZS9FdmVudC9FdmVudFJlY29yZGVyLmpzJ1xuXG4vKipcbiAqIEV2ZW50IFJlY29yZGVyXG4gKlxuICogQEF1dGhvciBNYXRldXN6IMWacGlld2FrXG4gKi9cblxuY2xhc3MgUmVjb3JkZXIge1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgdGhpcy5fZXZlbnRzID0gWydtb3VzZW1vdmUnLCAnY2xpY2snLCAnbW91c2VvdmVyJywgJ3Jlc2l6ZScsICdzY3JvbGwnLCdrZXlkb3duJ107XG4gICAgdGhpcy5fRVJpbnN0YW5jZXMgPSBbXTtcbiAgICB0aGlzLl9jYW1lcmFzID0gW107XG4gICAgdGhpcy5fZGF0YSA9IFtdO1xuICAgIHRoaXMuaW5pdEluc3RhbmNlcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIGluaXQgRXZlbnRSZWNvcmRlciBpc3RhbmNlXG4gICAqIGZvciBlYWNoIGV2ZW50XG4gICAqIEByZXR1cm5zIHt1bmRlZmluZWR9XG4gICAqL1xuXG4gIGluaXRJbnN0YW5jZXMgKCkge1xuICAgIGxldCBvYmosXG4gICAgICAgIGNhbTtcblxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLl9ldmVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIG9iaiA9IG5ldyBFdmVudFJlY29yZGVyKHRoaXMuX2V2ZW50c1tpXSk7XG4gICAgICBjYW0gPSBvYmouY2FtZXJhKCk7XG5cbiAgICAgIHRoaXMuX0VSaW5zdGFuY2VzLnB1c2gob2JqKTtcbiAgICAgIHRoaXMuX2NhbWVyYXMucHVzaChjYW0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCByZWNvcmRpbmcgYWxsIGV2ZW50c1xuICAgKiBAcmV0dXJucyB7dW5kZWZpbmVkfVxuICAgKi9cblxuICByZWNvcmQgKCkge1xuICAgIGNvbnNvbGUuaW5mbyhgUmVwcm9kdWNlIDo6IFJlY29yZGluZyAke3RoaXMuX2V2ZW50c31gKTtcbiAgICBsZXQgc3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcblxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLl9jYW1lcmFzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLl9jYW1lcmFzW2ldLnJlY29yZChzdGFydFRpbWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9wIHJlY29yZGluZyBhbGwgZXZlbnRzXG4gICAqIEByZXR1cm5zIHt1bmRlZmluZWR9XG4gICAqL1xuXG4gIHN0b3AgKCkge1xuICAgIGNvbnNvbGUuaW5mbyhgUmVwcm9kdWNlIDo6IFN0b3AgUmVjb3JkaW5nICR7dGhpcy5fZXZlbnRzfWApO1xuXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuX2NhbWVyYXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMuX2NhbWVyYXNbaV0uc3RvcCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYWxsIGRhdGFcbiAgICogQHJldHVybnMge0FycmF5fVxuICAgKi9cblxuICBnZXREYXRhICgpIHtcbiAgICBsZXQgYXJyID0gW107XG5cbiAgICBsZXQgX2NvbXAgPSBmdW5jdGlvbiAoYSxiKSB7XG4gICAgICBpZihhLnRpbWUgPCBiLnRpbWUpIHtyZXR1cm4gLTE7fVxuICAgICAgaWYoYS50aW1lID4gYi50aW1lKSB7cmV0dXJuIDE7fVxuICAgICAgcmV0dXJuIDA7XG4gICAgfTtcblxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLl9FUmluc3RhbmNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgYXJyLnB1c2godGhpcy5fRVJpbnN0YW5jZXNbaV0uZGF0YSk7XG4gICAgfVxuXG4gICAgYXJyID0gW10uY29uY2F0LmFwcGx5KFtdLCBhcnIpO1xuICAgIGFyciA9IGFyci5zb3J0KF9jb21wKTtcbiAgICByZXR1cm4gYXJyO1xuICB9XG59XG5cbmV4cG9ydCB7UmVjb3JkZXJ9XG4iLCIvKipcbiAqXG4gKlxuICovXG5cbmltcG9ydCB7cXdlc3R9IGZyb20gJy4uL3ZlbmRvci9xd2VzdC5qcyc7XG5cbmNsYXNzIFByZXBhcmVTdHlsZXMge1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgY29uc29sZS5sb2cocXdlc3QpO1xuICAgIHRoaXMuJGxpbmtlZENTUyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpbmtbcmVsPVwic3R5bGVzaGVldFwiXScpO1xuICAgIHRoaXMuJGlubGluZWRDU1MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdzdHlsZScpO1xuICAgIHRoaXMucmVwcm9kdWNlQ2xhc3MgPSAnLnJlcHJvZHVjZS1ob3Zlcic7XG4gICAgdGhpcy5wcmVwcm9jZXNzTGlua2VkQ1NTKCk7XG4gIH1cblxuICBwcmVwcm9jZXNzTGlua2VkQ1NTICgpIHtcbiAgICBsZXQgdGhhdCA9IHRoaXM7XG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHRoaXMuJGxpbmtlZENTUy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgd2luZG93LnF3ZXN0LmdldCh0aGlzLiRsaW5rZWRDU1NbaV0uaHJlZikudGhlbihmdW5jdGlvbiAocikge1xuICAgICAgICB0aGF0LnByZXByb2Nlc3NDU1NzdHJpbmcoci50b1N0cmluZygpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW1zIHtzdHJpbmd9XG4gICAqIEByZXR1cm4ge3VuZGVmaW5lZH1cbiAgICovXG5cbiAgcHJlcHJvY2Vzc0NTU3N0cmluZyAoc3RyaW5nKSB7XG4gICAgbGV0IENTU1N0cmluZyA9IHN0cmluZy5yZXBsYWNlKC86aG92ZXIvZywgdGhpcy5yZXByb2R1Y2VDbGFzcyksXG4gICAgICAgIHN0eWxlU2hlZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuXG4gICAgc3R5bGVTaGVldC50eXBlID0gJ3RleHQvY3NzJztcbiAgICBzdHlsZVNoZWV0LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKENTU1N0cmluZykpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc3R5bGVTaGVldCk7XG4gIH1cbn1cblxuZXhwb3J0IHtQcmVwYXJlU3R5bGVzfVxuIiwiLyohIHF3ZXN0IDEuNi4xIChodHRwczovL2dpdGh1Yi5jb20vcHlyc21rL3F3ZXN0KSAqL1xuXG47KGZ1bmN0aW9uKGNvbnRleHQsbmFtZSxkZWZpbml0aW9uKXtcbiAgaWYodHlwZW9mIG1vZHVsZSE9J3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpe1xuICAgIGNvbnNvbGUubG9nKGRlZmluaXRpb24pO1xuICAgIG1vZHVsZS5leHBvcnRzPXtcbiAgICAgIGR1cGE6ICdkdXBhJ1xuICAgIH07XG4gIH1cbiAgZWxzZSBpZih0eXBlb2YgZGVmaW5lPT0nZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpe1xuICAgIGRlZmluZShkZWZpbml0aW9uKTtcbiAgfVxuICBlbHNle1xuICAgIGNvbnRleHRbbmFtZV09ZGVmaW5pdGlvbjtcbiAgfVxuICB9KHRoaXMsJ3F3ZXN0JyxmdW5jdGlvbigpe1xuICB2YXIgd2luPXdpbmRvdyxcbiAgICBkb2M9ZG9jdW1lbnQsXG4gICAgYmVmb3JlLFxuICAvLyBEZWZhdWx0IHJlc3BvbnNlIHR5cGUgZm9yIFhEUiBpbiBhdXRvIG1vZGVcbiAgICBkZWZhdWx0WGRyUmVzcG9uc2VUeXBlPSdqc29uJyxcbiAgLy8gVmFyaWFibGVzIGZvciBsaW1pdCBtZWNoYW5pc21cbiAgICBsaW1pdD1udWxsLFxuICAgIHJlcXVlc3RzPTAsXG4gICAgcmVxdWVzdF9zdGFjaz1bXSxcbiAgLy8gR2V0IFhNTEh0dHBSZXF1ZXN0IG9iamVjdFxuICAgIGdldFhIUj1mdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIHdpbi5YTUxIdHRwUmVxdWVzdD9cbiAgICAgICAgbmV3IFhNTEh0dHBSZXF1ZXN0KCk6XG4gICAgICAgIG5ldyBBY3RpdmVYT2JqZWN0KCdNaWNyb3NvZnQuWE1MSFRUUCcpO1xuICAgIH0sXG4gIC8vIEd1ZXNzIFhIUiB2ZXJzaW9uXG4gICAgeGhyMj0oZ2V0WEhSKCkucmVzcG9uc2VUeXBlPT09JycpLFxuXG4gIC8vIENvcmUgZnVuY3Rpb25cbiAgICBxd2VzdD1mdW5jdGlvbihtZXRob2QsdXJsLGRhdGEsb3B0aW9ucyxiZWZvcmUpe1xuXG4gICAgICAvLyBGb3JtYXRcbiAgICAgIG1ldGhvZD1tZXRob2QudG9VcHBlckNhc2UoKTtcbiAgICAgIGRhdGE9ZGF0YSB8fCBudWxsO1xuICAgICAgb3B0aW9ucz1vcHRpb25zIHx8IHt9O1xuXG4gICAgICAvLyBEZWZpbmUgdmFyaWFibGVzXG4gICAgICB2YXIgbmF0aXZlUmVzcG9uc2VQYXJzaW5nPWZhbHNlLFxuICAgICAgICBjcm9zc09yaWdpbixcbiAgICAgICAgeGhyLFxuICAgICAgICB4ZHI9ZmFsc2UsXG4gICAgICAgIHRpbWVvdXRJbnRlcnZhbCxcbiAgICAgICAgYWJvcnRlZD1mYWxzZSxcbiAgICAgICAgYXR0ZW1wdHM9MCxcbiAgICAgICAgaGVhZGVycz17fSxcbiAgICAgICAgbWltZVR5cGVzPXtcbiAgICAgICAgICB0ZXh0OiAnKi8qJyxcbiAgICAgICAgICB4bWw6ICd0ZXh0L3htbCcsXG4gICAgICAgICAganNvbjogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgIHBvc3Q6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG4gICAgICAgIH0sXG4gICAgICAgIGFjY2VwdD17XG4gICAgICAgICAgdGV4dDogJyovKicsXG4gICAgICAgICAgeG1sOiAnYXBwbGljYXRpb24veG1sOyBxPTEuMCwgdGV4dC94bWw7IHE9MC44LCAqLyo7IHE9MC4xJyxcbiAgICAgICAgICBqc29uOiAnYXBwbGljYXRpb24vanNvbjsgcT0xLjAsIHRleHQvKjsgcT0wLjgsICovKjsgcT0wLjEnXG4gICAgICAgIH0sXG4gICAgICAgIGNvbnRlbnRUeXBlPSdDb250ZW50LVR5cGUnLFxuICAgICAgICB2YXJzPScnLFxuICAgICAgICBpLGosXG4gICAgICAgIHNlcmlhbGl6ZWQsXG4gICAgICAgIHRoZW5fc3RhY2s9W10sXG4gICAgICAgIGNhdGNoX3N0YWNrPVtdLFxuICAgICAgICBjb21wbGV0ZV9zdGFjaz1bXSxcbiAgICAgICAgcmVzcG9uc2UsXG4gICAgICAgIHN1Y2Nlc3MsXG4gICAgICAgIGVycm9yLFxuICAgICAgICBmdW5jLFxuXG4gICAgICAvLyBEZWZpbmUgcHJvbWlzZXNcbiAgICAgICAgcHJvbWlzZXM9e1xuICAgICAgICAgIHRoZW46ZnVuY3Rpb24oZnVuYyl7XG4gICAgICAgICAgICBpZihvcHRpb25zLmFzeW5jKXtcbiAgICAgICAgICAgICAgdGhlbl9zdGFjay5wdXNoKGZ1bmMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZihzdWNjZXNzKXtcbiAgICAgICAgICAgICAgZnVuYy5jYWxsKHhocixyZXNwb25zZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZXM7XG4gICAgICAgICAgfSxcbiAgICAgICAgICAnY2F0Y2gnOmZ1bmN0aW9uKGZ1bmMpe1xuICAgICAgICAgICAgaWYob3B0aW9ucy5hc3luYyl7XG4gICAgICAgICAgICAgIGNhdGNoX3N0YWNrLnB1c2goZnVuYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmKGVycm9yKXtcbiAgICAgICAgICAgICAgZnVuYy5jYWxsKHhocixyZXNwb25zZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZXM7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjb21wbGV0ZTpmdW5jdGlvbihmdW5jKXtcbiAgICAgICAgICAgIGlmKG9wdGlvbnMuYXN5bmMpe1xuICAgICAgICAgICAgICBjb21wbGV0ZV9zdGFjay5wdXNoKGZ1bmMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgZnVuYy5jYWxsKHhocik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZXM7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBwcm9taXNlc19saW1pdD17XG4gICAgICAgICAgdGhlbjpmdW5jdGlvbihmdW5jKXtcbiAgICAgICAgICAgIHJlcXVlc3Rfc3RhY2tbcmVxdWVzdF9zdGFjay5sZW5ndGgtMV0udGhlbi5wdXNoKGZ1bmMpO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2VzX2xpbWl0O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgJ2NhdGNoJzpmdW5jdGlvbihmdW5jKXtcbiAgICAgICAgICAgIHJlcXVlc3Rfc3RhY2tbcmVxdWVzdF9zdGFjay5sZW5ndGgtMV1bJ2NhdGNoJ10ucHVzaChmdW5jKTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlc19saW1pdDtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGNvbXBsZXRlOmZ1bmN0aW9uKGZ1bmMpe1xuICAgICAgICAgICAgcmVxdWVzdF9zdGFja1tyZXF1ZXN0X3N0YWNrLmxlbmd0aC0xXS5jb21wbGV0ZS5wdXNoKGZ1bmMpO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2VzX2xpbWl0O1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgLy8gSGFuZGxlIHRoZSByZXNwb25zZVxuICAgICAgICBoYW5kbGVSZXNwb25zZT1mdW5jdGlvbigpe1xuICAgICAgICAgIC8vIFZlcmlmeSByZXF1ZXN0J3Mgc3RhdGVcbiAgICAgICAgICAvLyAtLS0gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNzI4NzcwNi9pZS05LWphdmFzY3JpcHQtZXJyb3ItYzAwYzAyM2ZcbiAgICAgICAgICBpZihhYm9ydGVkKXtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gUHJlcGFyZVxuICAgICAgICAgIHZhciBpLHJlcSxwLHJlc3BvbnNlVHlwZTtcbiAgICAgICAgICAtLXJlcXVlc3RzO1xuICAgICAgICAgIC8vIENsZWFyIHRoZSB0aW1lb3V0XG4gICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lb3V0SW50ZXJ2YWwpO1xuICAgICAgICAgIC8vIExhdW5jaCBuZXh0IHN0YWNrZWQgcmVxdWVzdFxuICAgICAgICAgIGlmKHJlcXVlc3Rfc3RhY2subGVuZ3RoKXtcbiAgICAgICAgICAgIHJlcT1yZXF1ZXN0X3N0YWNrLnNoaWZ0KCk7XG4gICAgICAgICAgICBwPXF3ZXN0KHJlcS5tZXRob2QscmVxLnVybCxyZXEuZGF0YSxyZXEub3B0aW9ucyxyZXEuYmVmb3JlKTtcbiAgICAgICAgICAgIGZvcihpPTA7ZnVuYz1yZXEudGhlbltpXTsrK2kpe1xuICAgICAgICAgICAgICBwLnRoZW4oZnVuYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IoaT0wO2Z1bmM9cmVxWydjYXRjaCddW2ldOysraSl7XG4gICAgICAgICAgICAgIHBbJ2NhdGNoJ10oZnVuYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IoaT0wO2Z1bmM9cmVxLmNvbXBsZXRlW2ldOysraSl7XG4gICAgICAgICAgICAgIHAuY29tcGxldGUoZnVuYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIEhhbmRsZSByZXNwb25zZVxuICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgIC8vIFZlcmlmeSBzdGF0dXMgY29kZVxuICAgICAgICAgICAgLy8gLS0tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEwMDQ2OTcyL21zaWUtcmV0dXJucy1zdGF0dXMtY29kZS1vZi0xMjIzLWZvci1hamF4LXJlcXVlc3RcbiAgICAgICAgICAgIGlmKCdzdGF0dXMnIGluIHhociAmJiAhL14yfDEyMjMvLnRlc3QoeGhyLnN0YXR1cykpe1xuICAgICAgICAgICAgICB0aHJvdyB4aHIuc3RhdHVzKycgKCcreGhyLnN0YXR1c1RleHQrJyknO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gSW5pdFxuICAgICAgICAgICAgdmFyIHJlc3BvbnNlVGV4dD0ncmVzcG9uc2VUZXh0JyxcbiAgICAgICAgICAgICAgcmVzcG9uc2VYTUw9J3Jlc3BvbnNlWE1MJyxcbiAgICAgICAgICAgICAgcGFyc2VFcnJvcj0ncGFyc2VFcnJvcic7XG4gICAgICAgICAgICAvLyBQcm9jZXNzIHJlc3BvbnNlXG4gICAgICAgICAgICBpZihuYXRpdmVSZXNwb25zZVBhcnNpbmcgJiYgJ3Jlc3BvbnNlJyBpbiB4aHIgJiYgeGhyLnJlc3BvbnNlIT09bnVsbCl7XG4gICAgICAgICAgICAgIHJlc3BvbnNlPXhoci5yZXNwb25zZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYob3B0aW9ucy5yZXNwb25zZVR5cGU9PSdkb2N1bWVudCcpe1xuICAgICAgICAgICAgICB2YXIgZnJhbWU9ZG9jLmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpO1xuICAgICAgICAgICAgICBmcmFtZS5zdHlsZS5kaXNwbGF5PSdub25lJztcbiAgICAgICAgICAgICAgZG9jLmJvZHkuYXBwZW5kQ2hpbGQoZnJhbWUpO1xuICAgICAgICAgICAgICBmcmFtZS5jb250ZW50RG9jdW1lbnQub3BlbigpO1xuICAgICAgICAgICAgICBmcmFtZS5jb250ZW50RG9jdW1lbnQud3JpdGUoeGhyLnJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgZnJhbWUuY29udGVudERvY3VtZW50LmNsb3NlKCk7XG4gICAgICAgICAgICAgIHJlc3BvbnNlPWZyYW1lLmNvbnRlbnREb2N1bWVudDtcbiAgICAgICAgICAgICAgZG9jLmJvZHkucmVtb3ZlQ2hpbGQoZnJhbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgLy8gR3Vlc3MgcmVzcG9uc2UgdHlwZVxuICAgICAgICAgICAgICByZXNwb25zZVR5cGU9b3B0aW9ucy5yZXNwb25zZVR5cGU7XG4gICAgICAgICAgICAgIGlmKHJlc3BvbnNlVHlwZT09J2F1dG8nKXtcbiAgICAgICAgICAgICAgICBpZih4ZHIpe1xuICAgICAgICAgICAgICAgICAgcmVzcG9uc2VUeXBlPWRlZmF1bHRYZHJSZXNwb25zZVR5cGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICB2YXIgY3Q9eGhyLmdldFJlc3BvbnNlSGVhZGVyKGNvbnRlbnRUeXBlKSB8fCAnJztcbiAgICAgICAgICAgICAgICAgIGlmKGN0LmluZGV4T2YobWltZVR5cGVzLmpzb24pPi0xKXtcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VUeXBlPSdqc29uJztcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGVsc2UgaWYoY3QuaW5kZXhPZihtaW1lVHlwZXMueG1sKT4tMSl7XG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlVHlwZT0neG1sJztcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlVHlwZT0ndGV4dCc7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8vIEhhbmRsZSByZXNwb25zZSB0eXBlXG4gICAgICAgICAgICAgIHN3aXRjaChyZXNwb25zZVR5cGUpe1xuICAgICAgICAgICAgICAgIGNhc2UgJ2pzb24nOlxuICAgICAgICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgICAgICAgICBpZignSlNPTicgaW4gd2luKXtcbiAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZT1KU09OLnBhcnNlKHhocltyZXNwb25zZVRleHRdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlPWV2YWwoJygnK3hocltyZXNwb25zZVRleHRdKycpJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGNhdGNoKGUpe1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBcIkVycm9yIHdoaWxlIHBhcnNpbmcgSlNPTiBib2R5IDogXCIrZTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3htbCc6XG4gICAgICAgICAgICAgICAgICAvLyBCYXNlZCBvbiBqUXVlcnkncyBwYXJzZVhNTCgpIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgICAgIC8vIFN0YW5kYXJkXG4gICAgICAgICAgICAgICAgICAgIGlmKHdpbi5ET01QYXJzZXIpe1xuICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlPShuZXcgRE9NUGFyc2VyKCkpLnBhcnNlRnJvbVN0cmluZyh4aHJbcmVzcG9uc2VUZXh0XSwndGV4dC94bWwnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBJRTw5XG4gICAgICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2U9bmV3IEFjdGl2ZVhPYmplY3QoJ01pY3Jvc29mdC5YTUxET00nKTtcbiAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5hc3luYz0nZmFsc2UnO1xuICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLmxvYWRYTUwoeGhyW3Jlc3BvbnNlVGV4dF0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBjYXRjaChlKXtcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2U9dW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgaWYoIXJlc3BvbnNlIHx8ICFyZXNwb25zZS5kb2N1bWVudEVsZW1lbnQgfHwgcmVzcG9uc2UuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3BhcnNlcmVycm9yJykubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgJ0ludmFsaWQgWE1MJztcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICByZXNwb25zZT14aHJbcmVzcG9uc2VUZXh0XTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gRXhlY3V0ZSAndGhlbicgc3RhY2tcbiAgICAgICAgICAgIHN1Y2Nlc3M9dHJ1ZTtcbiAgICAgICAgICAgIHA9cmVzcG9uc2U7XG4gICAgICAgICAgICBpZihvcHRpb25zLmFzeW5jKXtcbiAgICAgICAgICAgICAgZm9yKGk9MDtmdW5jPXRoZW5fc3RhY2tbaV07KytpKXtcbiAgICAgICAgICAgICAgICBwPWZ1bmMuY2FsbCh4aHIscCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgY2F0Y2goZSl7XG4gICAgICAgICAgICBlcnJvcj10cnVlO1xuICAgICAgICAgICAgLy8gRXhlY3V0ZSAnY2F0Y2gnIHN0YWNrXG4gICAgICAgICAgICBpZihvcHRpb25zLmFzeW5jKXtcbiAgICAgICAgICAgICAgZm9yKGk9MDtmdW5jPWNhdGNoX3N0YWNrW2ldOysraSl7XG4gICAgICAgICAgICAgICAgZnVuYy5jYWxsKHhociwgZSwgdXJsKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBFeGVjdXRlIGNvbXBsZXRlIHN0YWNrXG4gICAgICAgICAgaWYob3B0aW9ucy5hc3luYyl7XG4gICAgICAgICAgICBmb3IoaT0wO2Z1bmM9Y29tcGxldGVfc3RhY2tbaV07KytpKXtcbiAgICAgICAgICAgICAgZnVuYy5jYWxsKHhocik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAvLyBIYW5kbGUgZXJyb3JzXG4gICAgICAgIGhhbmRsZUVycm9yPSBmdW5jdGlvbihlKXtcbiAgICAgICAgICBlcnJvcj10cnVlO1xuICAgICAgICAgIC0tcmVxdWVzdHM7XG4gICAgICAgICAgLy8gQ2xlYXIgdGhlIHRpbWVvdXRcbiAgICAgICAgICBjbGVhckludGVydmFsKHRpbWVvdXRJbnRlcnZhbCk7XG4gICAgICAgICAgLy8gRXhlY3V0ZSAnY2F0Y2gnIHN0YWNrXG4gICAgICAgICAgaWYob3B0aW9ucy5hc3luYyl7XG4gICAgICAgICAgICBmb3IoaT0wO2Z1bmM9Y2F0Y2hfc3RhY2tbaV07KytpKXtcbiAgICAgICAgICAgICAgZnVuYy5jYWxsKHhociwgZSwgdXJsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgIC8vIFJlY3Vyc2l2ZWx5IGJ1aWxkIHRoZSBxdWVyeSBzdHJpbmdcbiAgICAgICAgYnVpbGREYXRhPWZ1bmN0aW9uKGRhdGEsa2V5KXtcbiAgICAgICAgICB2YXIgcmVzPVtdLFxuICAgICAgICAgICAgZW5jPWVuY29kZVVSSUNvbXBvbmVudCxcbiAgICAgICAgICAgIHA7XG4gICAgICAgICAgaWYodHlwZW9mIGRhdGE9PT0nb2JqZWN0JyAmJiBkYXRhIT1udWxsKSB7XG4gICAgICAgICAgICBmb3IocCBpbiBkYXRhKSB7XG4gICAgICAgICAgICAgIGlmKGRhdGEuaGFzT3duUHJvcGVydHkocCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgYnVpbHQ9YnVpbGREYXRhKGRhdGFbcF0sa2V5P2tleSsnWycrcCsnXSc6cCk7XG4gICAgICAgICAgICAgICAgaWYoYnVpbHQhPT0nJyl7XG4gICAgICAgICAgICAgICAgICByZXM9cmVzLmNvbmNhdChidWlsdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYoZGF0YSE9bnVsbCAmJiBrZXkhPW51bGwpe1xuICAgICAgICAgICAgcmVzLnB1c2goZW5jKGtleSkrJz0nK2VuYyhkYXRhKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXMuam9pbignJicpO1xuICAgICAgICB9O1xuXG4gICAgICAvLyBOZXcgcmVxdWVzdFxuICAgICAgKytyZXF1ZXN0cztcblxuICAgICAgaWYgKCdyZXRyaWVzJyBpbiBvcHRpb25zKSB7XG4gICAgICAgIGlmICh3aW4uY29uc29sZSAmJiBjb25zb2xlLndhcm4pIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oJ1tRd2VzdF0gVGhlIHJldHJpZXMgb3B0aW9uIGlzIGRlcHJlY2F0ZWQuIEl0IGluZGljYXRlcyB0b3RhbCBudW1iZXIgb2YgcmVxdWVzdHMgdG8gYXR0ZW1wdC4gUGxlYXNlIHVzZSB0aGUgXCJhdHRlbXB0c1wiIG9wdGlvbi4nKTtcbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zLmF0dGVtcHRzID0gb3B0aW9ucy5yZXRyaWVzO1xuICAgICAgfVxuXG4gICAgICAvLyBOb3JtYWxpemUgb3B0aW9uc1xuICAgICAgb3B0aW9ucy5hc3luYz0nYXN5bmMnIGluIG9wdGlvbnM/ISFvcHRpb25zLmFzeW5jOnRydWU7XG4gICAgICBvcHRpb25zLmNhY2hlPSdjYWNoZScgaW4gb3B0aW9ucz8hIW9wdGlvbnMuY2FjaGU6KG1ldGhvZCE9J0dFVCcpO1xuICAgICAgb3B0aW9ucy5kYXRhVHlwZT0nZGF0YVR5cGUnIGluIG9wdGlvbnM/b3B0aW9ucy5kYXRhVHlwZS50b0xvd2VyQ2FzZSgpOidwb3N0JztcbiAgICAgIG9wdGlvbnMucmVzcG9uc2VUeXBlPSdyZXNwb25zZVR5cGUnIGluIG9wdGlvbnM/b3B0aW9ucy5yZXNwb25zZVR5cGUudG9Mb3dlckNhc2UoKTonYXV0byc7XG4gICAgICBvcHRpb25zLnVzZXI9b3B0aW9ucy51c2VyIHx8ICcnO1xuICAgICAgb3B0aW9ucy5wYXNzd29yZD1vcHRpb25zLnBhc3N3b3JkIHx8ICcnO1xuICAgICAgb3B0aW9ucy53aXRoQ3JlZGVudGlhbHM9ISFvcHRpb25zLndpdGhDcmVkZW50aWFscztcbiAgICAgIG9wdGlvbnMudGltZW91dD0ndGltZW91dCcgaW4gb3B0aW9ucz9wYXJzZUludChvcHRpb25zLnRpbWVvdXQsMTApOjMwMDAwO1xuICAgICAgb3B0aW9ucy5hdHRlbXB0cz0nYXR0ZW1wdHMnIGluIG9wdGlvbnM/cGFyc2VJbnQob3B0aW9ucy5hdHRlbXB0cywxMCk6MTtcblxuICAgICAgLy8gR3Vlc3MgaWYgd2UncmUgZGVhbGluZyB3aXRoIGEgY3Jvc3Mtb3JpZ2luIHJlcXVlc3RcbiAgICAgIGk9dXJsLm1hdGNoKC9cXC9cXC8oLis/KVxcLy8pO1xuICAgICAgY3Jvc3NPcmlnaW49aSAmJiBpWzFdP2lbMV0hPWxvY2F0aW9uLmhvc3Q6ZmFsc2U7XG5cbiAgICAgIC8vIFByZXBhcmUgZGF0YVxuICAgICAgaWYoJ0FycmF5QnVmZmVyJyBpbiB3aW4gJiYgZGF0YSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKXtcbiAgICAgICAgb3B0aW9ucy5kYXRhVHlwZT0nYXJyYXlidWZmZXInO1xuICAgICAgfVxuICAgICAgZWxzZSBpZignQmxvYicgaW4gd2luICYmIGRhdGEgaW5zdGFuY2VvZiBCbG9iKXtcbiAgICAgICAgb3B0aW9ucy5kYXRhVHlwZT0nYmxvYic7XG4gICAgICB9XG4gICAgICBlbHNlIGlmKCdEb2N1bWVudCcgaW4gd2luICYmIGRhdGEgaW5zdGFuY2VvZiBEb2N1bWVudCl7XG4gICAgICAgIG9wdGlvbnMuZGF0YVR5cGU9J2RvY3VtZW50JztcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYoJ0Zvcm1EYXRhJyBpbiB3aW4gJiYgZGF0YSBpbnN0YW5jZW9mIEZvcm1EYXRhKXtcbiAgICAgICAgb3B0aW9ucy5kYXRhVHlwZT0nZm9ybWRhdGEnO1xuICAgICAgfVxuICAgICAgc3dpdGNoKG9wdGlvbnMuZGF0YVR5cGUpe1xuICAgICAgICBjYXNlICdqc29uJzpcbiAgICAgICAgICBkYXRhPUpTT04uc3RyaW5naWZ5KGRhdGEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdwb3N0JzpcbiAgICAgICAgICBkYXRhPWJ1aWxkRGF0YShkYXRhKTtcbiAgICAgIH1cblxuICAgICAgLy8gUHJlcGFyZSBoZWFkZXJzXG4gICAgICBpZihvcHRpb25zLmhlYWRlcnMpe1xuICAgICAgICB2YXIgZm9ybWF0PWZ1bmN0aW9uKG1hdGNoLHAxLHAyKXtcbiAgICAgICAgICByZXR1cm4gcDErcDIudG9VcHBlckNhc2UoKTtcbiAgICAgICAgfTtcbiAgICAgICAgZm9yKGkgaW4gb3B0aW9ucy5oZWFkZXJzKXtcbiAgICAgICAgICBoZWFkZXJzW2kucmVwbGFjZSgvKF58LSkoW14tXSkvZyxmb3JtYXQpXT1vcHRpb25zLmhlYWRlcnNbaV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmKCFoZWFkZXJzW2NvbnRlbnRUeXBlXSAmJiBtZXRob2QhPSdHRVQnKXtcbiAgICAgICAgaWYob3B0aW9ucy5kYXRhVHlwZSBpbiBtaW1lVHlwZXMpe1xuICAgICAgICAgIGlmKG1pbWVUeXBlc1tvcHRpb25zLmRhdGFUeXBlXSl7XG4gICAgICAgICAgICBoZWFkZXJzW2NvbnRlbnRUeXBlXT1taW1lVHlwZXNbb3B0aW9ucy5kYXRhVHlwZV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZighaGVhZGVycy5BY2NlcHQpe1xuICAgICAgICBoZWFkZXJzLkFjY2VwdD0ob3B0aW9ucy5yZXNwb25zZVR5cGUgaW4gYWNjZXB0KT9hY2NlcHRbb3B0aW9ucy5yZXNwb25zZVR5cGVdOicqLyonO1xuICAgICAgfVxuICAgICAgaWYoIWNyb3NzT3JpZ2luICYmICFoZWFkZXJzWydYLVJlcXVlc3RlZC1XaXRoJ10peyAvLyBiZWNhdXNlIHRoYXQgaGVhZGVyIGJyZWFrcyBpbiBsZWdhY3kgYnJvd3NlcnMgd2l0aCBDT1JTXG4gICAgICAgIGhlYWRlcnNbJ1gtUmVxdWVzdGVkLVdpdGgnXT0nWE1MSHR0cFJlcXVlc3QnO1xuICAgICAgfVxuXG4gICAgICAvLyBQcmVwYXJlIFVSTFxuICAgICAgaWYobWV0aG9kPT0nR0VUJyAmJiBkYXRhKXtcbiAgICAgICAgdmFycys9ZGF0YTtcbiAgICAgIH1cbiAgICAgIGlmKCFvcHRpb25zLmNhY2hlKXtcbiAgICAgICAgaWYodmFycyl7XG4gICAgICAgICAgdmFycys9JyYnO1xuICAgICAgICB9XG4gICAgICAgIHZhcnMrPSdfX3Q9JysoK25ldyBEYXRlKCkpO1xuICAgICAgfVxuICAgICAgaWYodmFycyl7XG4gICAgICAgIHVybCs9KC9cXD8vLnRlc3QodXJsKT8nJic6Jz8nKSt2YXJzO1xuICAgICAgfVxuXG4gICAgICAvLyBUaGUgbGltaXQgaGFzIGJlZW4gcmVhY2hlZCwgc3RvY2sgdGhlIHJlcXVlc3RcbiAgICAgIGlmKGxpbWl0ICYmIHJlcXVlc3RzPT1saW1pdCl7XG4gICAgICAgIHJlcXVlc3Rfc3RhY2sucHVzaCh7XG4gICAgICAgICAgbWV0aG9kXHQ6IG1ldGhvZCxcbiAgICAgICAgICB1cmxcdFx0OiB1cmwsXG4gICAgICAgICAgZGF0YVx0OiBkYXRhLFxuICAgICAgICAgIG9wdGlvbnNcdDogb3B0aW9ucyxcbiAgICAgICAgICBiZWZvcmVcdDogYmVmb3JlLFxuICAgICAgICAgIHRoZW5cdDogW10sXG4gICAgICAgICAgJ2NhdGNoJ1x0OiBbXSxcbiAgICAgICAgICBjb21wbGV0ZTogW11cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwcm9taXNlc19saW1pdDtcbiAgICAgIH1cblxuICAgICAgLy8gU2VuZCB0aGUgcmVxdWVzdFxuICAgICAgdmFyIHNlbmQ9ZnVuY3Rpb24oKXtcbiAgICAgICAgLy8gR2V0IFhIUiBvYmplY3RcbiAgICAgICAgeGhyPWdldFhIUigpO1xuICAgICAgICBpZihjcm9zc09yaWdpbil7XG4gICAgICAgICAgaWYoISgnd2l0aENyZWRlbnRpYWxzJyBpbiB4aHIpICYmIHdpbi5YRG9tYWluUmVxdWVzdCl7XG4gICAgICAgICAgICB4aHI9bmV3IFhEb21haW5SZXF1ZXN0KCk7IC8vIENPUlMgd2l0aCBJRTgvOVxuICAgICAgICAgICAgeGRyPXRydWU7XG4gICAgICAgICAgICBpZihtZXRob2QhPSdHRVQnICYmIG1ldGhvZCE9J1BPU1QnKXtcbiAgICAgICAgICAgICAgbWV0aG9kPSdQT1NUJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gT3BlbiBjb25uZWN0aW9uXG4gICAgICAgIGlmKHhkcil7XG4gICAgICAgICAgeGhyLm9wZW4obWV0aG9kLHVybCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICB4aHIub3BlbihtZXRob2QsdXJsLG9wdGlvbnMuYXN5bmMsb3B0aW9ucy51c2VyLG9wdGlvbnMucGFzc3dvcmQpO1xuICAgICAgICAgIGlmKHhocjIgJiYgb3B0aW9ucy5hc3luYyl7XG4gICAgICAgICAgICB4aHIud2l0aENyZWRlbnRpYWxzPW9wdGlvbnMud2l0aENyZWRlbnRpYWxzO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBTZXQgaGVhZGVyc1xuICAgICAgICBpZigheGRyKXtcbiAgICAgICAgICBmb3IodmFyIGkgaW4gaGVhZGVycyl7XG4gICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihpLGhlYWRlcnNbaV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBWZXJpZnkgaWYgdGhlIHJlc3BvbnNlIHR5cGUgaXMgc3VwcG9ydGVkIGJ5IHRoZSBjdXJyZW50IGJyb3dzZXJcbiAgICAgICAgaWYoeGhyMiAmJiBvcHRpb25zLnJlc3BvbnNlVHlwZSE9J2RvY3VtZW50JyAmJiBvcHRpb25zLnJlc3BvbnNlVHlwZSE9J2F1dG8nKXsgLy8gRG9uJ3QgdmVyaWZ5IGZvciAnZG9jdW1lbnQnIHNpbmNlIHdlJ3JlIHVzaW5nIGFuIGludGVybmFsIHJvdXRpbmVcbiAgICAgICAgICB0cnl7XG4gICAgICAgICAgICB4aHIucmVzcG9uc2VUeXBlPW9wdGlvbnMucmVzcG9uc2VUeXBlO1xuICAgICAgICAgICAgbmF0aXZlUmVzcG9uc2VQYXJzaW5nPSh4aHIucmVzcG9uc2VUeXBlPT1vcHRpb25zLnJlc3BvbnNlVHlwZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNhdGNoKGUpe31cbiAgICAgICAgfVxuICAgICAgICAvLyBQbHVnIHJlc3BvbnNlIGhhbmRsZXJcbiAgICAgICAgaWYoeGhyMiB8fCB4ZHIpe1xuICAgICAgICAgIHhoci5vbmxvYWQ9aGFuZGxlUmVzcG9uc2U7XG4gICAgICAgICAgeGhyLm9uZXJyb3I9aGFuZGxlRXJyb3I7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlPWZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBpZih4aHIucmVhZHlTdGF0ZT09NCl7XG4gICAgICAgICAgICAgIGhhbmRsZVJlc3BvbnNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICAvLyBPdmVycmlkZSBtaW1lIHR5cGUgdG8gZW5zdXJlIHRoZSByZXNwb25zZSBpcyB3ZWxsIHBhcnNlZFxuICAgICAgICBpZihvcHRpb25zLnJlc3BvbnNlVHlwZSE9J2F1dG8nICYmICdvdmVycmlkZU1pbWVUeXBlJyBpbiB4aHIpe1xuICAgICAgICAgIHhoci5vdmVycmlkZU1pbWVUeXBlKG1pbWVUeXBlc1tvcHRpb25zLnJlc3BvbnNlVHlwZV0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIFJ1biAnYmVmb3JlJyBjYWxsYmFja1xuICAgICAgICBpZihiZWZvcmUpe1xuICAgICAgICAgIGJlZm9yZS5jYWxsKHhocik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gU2VuZCByZXF1ZXN0XG4gICAgICAgIGlmKHhkcil7XG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpeyAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvWERvbWFpblJlcXVlc3RcbiAgICAgICAgICAgIHhoci5zZW5kKG1ldGhvZCE9J0dFVCc/ZGF0YTpudWxsKTtcbiAgICAgICAgICB9LDApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgeGhyLnNlbmQobWV0aG9kIT0nR0VUJz9kYXRhOm51bGwpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICAvLyBUaW1lb3V0L2F0dGVtcHRzXG4gICAgICB2YXIgdGltZW91dD1mdW5jdGlvbigpe1xuICAgICAgICB0aW1lb3V0SW50ZXJ2YWw9c2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgIGFib3J0ZWQ9dHJ1ZTtcbiAgICAgICAgICB4aHIuYWJvcnQoKTtcbiAgICAgICAgICBpZighb3B0aW9ucy5hdHRlbXB0cyB8fCArK2F0dGVtcHRzIT1vcHRpb25zLmF0dGVtcHRzKXtcbiAgICAgICAgICAgIGFib3J0ZWQ9ZmFsc2U7XG4gICAgICAgICAgICB0aW1lb3V0KCk7XG4gICAgICAgICAgICBzZW5kKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICBhYm9ydGVkPWZhbHNlO1xuICAgICAgICAgICAgZXJyb3I9dHJ1ZTtcbiAgICAgICAgICAgIHJlc3BvbnNlPSdUaW1lb3V0ICgnK3VybCsnKSc7XG4gICAgICAgICAgICBpZihvcHRpb25zLmFzeW5jKXtcbiAgICAgICAgICAgICAgZm9yKGk9MDtmdW5jPWNhdGNoX3N0YWNrW2ldOysraSl7XG4gICAgICAgICAgICAgICAgZnVuYy5jYWxsKHhocixyZXNwb25zZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sb3B0aW9ucy50aW1lb3V0KTtcbiAgICAgIH07XG5cbiAgICAgIC8vIFN0YXJ0IHRoZSByZXF1ZXN0XG4gICAgICB0aW1lb3V0KCk7XG4gICAgICBzZW5kKCk7XG5cbiAgICAgIC8vIFJldHVybiBwcm9taXNlc1xuICAgICAgcmV0dXJuIHByb21pc2VzO1xuXG4gICAgfTtcblxuICAvLyBSZXR1cm4gZXh0ZXJuYWwgcXdlc3Qgb2JqZWN0XG4gIHZhciBjcmVhdGU9ZnVuY3Rpb24obWV0aG9kKXtcbiAgICAgIHJldHVybiBmdW5jdGlvbih1cmwsZGF0YSxvcHRpb25zKXtcbiAgICAgICAgdmFyIGI9YmVmb3JlO1xuICAgICAgICBiZWZvcmU9bnVsbDtcbiAgICAgICAgcmV0dXJuIHF3ZXN0KG1ldGhvZCx0aGlzLmJhc2UrdXJsLGRhdGEsb3B0aW9ucyxiKTtcbiAgICAgIH07XG4gICAgfSxcbiAgICBvYmo9e1xuICAgICAgYmFzZTogJycsXG4gICAgICBiZWZvcmU6IGZ1bmN0aW9uKGNhbGxiYWNrKXtcbiAgICAgICAgYmVmb3JlPWNhbGxiYWNrO1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgfSxcbiAgICAgIGdldDogY3JlYXRlKCdHRVQnKSxcbiAgICAgIHBvc3Q6IGNyZWF0ZSgnUE9TVCcpLFxuICAgICAgcHV0OiBjcmVhdGUoJ1BVVCcpLFxuICAgICAgJ2RlbGV0ZSc6IGNyZWF0ZSgnREVMRVRFJyksXG4gICAgICB4aHIyOiB4aHIyLFxuICAgICAgbGltaXQ6IGZ1bmN0aW9uKGJ5KXtcbiAgICAgICAgbGltaXQ9Ynk7XG4gICAgICB9LFxuICAgICAgc2V0RGVmYXVsdFhkclJlc3BvbnNlVHlwZTogZnVuY3Rpb24odHlwZSl7XG4gICAgICAgIGRlZmF1bHRYZHJSZXNwb25zZVR5cGU9dHlwZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgfVxuICAgIH07XG4gIHdpbmRvdy5xd2VzdCA9IG9iajtcbiAgcmV0dXJuIG9iajtcblxufSgpKSk7XG4iXX0=
