import {EventRecorder} from '../core/Event/EventRecorder.js'

/**
 * Recorder
 *
 * @constructor
 */

class Recorder {
  constructor () {
    this._events = ['mousemove', 'click', 'mouseover', 'resize', 'scroll','keydown'];
    this._ERinstances = [];
    this._cameras = [];
    this._data = [];
    this.initInstances();
  }

  /**
   * init EventRecorder istance
   * for each event
   * @returns {undefined}
   */

  initInstances () {
    let obj,
        cam;

    for(let i = 0; i < this._events.length; i++) {
      obj = new EventRecorder(this._events[i]);
      cam = obj.camera();

      this._ERinstances.push(obj);
      this._cameras.push(cam);
    }
  }

  /**
   * Start recording all events
   * @returns {undefined}
   */

  record () {
    console.info(`Reproduce :: Recording ${this._events}`);
    let startTime = Date.now();

    for(let i = 0; i < this._cameras.length; i++) {
      this._cameras[i].record(startTime);
    }
  }

  /**
   * Stop recording all events
   * @returns {undefined}
   */

  stop () {
    console.info(`Reproduce :: Stop Recording ${this._events}`);

    for(let i = 0; i < this._cameras.length; i++) {
      this._cameras[i].stop();
    }
  }

  /**
   * Get all data
   * @returns {Array}
   */

  getData () {
    let arr = [];

    let _comp = function (a,b) {
      if(a.time < b.time) {return -1;}
      if(a.time > b.time) {return 1;}
      return 0;
    };

    for(let i = 0; i < this._ERinstances.length; i++) {
      arr.push(this._ERinstances[i].data);
    }

    arr = [].concat.apply([], arr);
    arr = arr.sort(_comp);
    return arr;
  }
}

export {Recorder}
