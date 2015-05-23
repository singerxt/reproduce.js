/**
 * Event Recorder
 *
 * @Author Mateusz Śpiewak
 * @params {string}
 * @returns {object}
 */

class EventRecorder {

  /**
   *
   */

  constructor (eventType) {
    this._data = [];
    this._initDate = Date.now();
    this._eventType = eventType;
  }

  /**
   * Pushing data from event
   * to Array of objects
   * @params {event}
   * @returns {Array}
   */

  pushData (event) {
    let timeStamp = event.timeStamp - this._initDate;
    this._data.push({
      posY: event.y,
      posX: event.x,
      time: timeStamp,
      type: event.type,
      width: document.body.clientWidth,
      positionY: window.scrollY
    });
  }

  /**
   * Get saved data
   * @returns {Array}
   */

  get data () {
    return this._data;
  }

  /**
   * Prepare Api for Recording
   *
   * @returns {{record: Function, stop: Function}}
   */

  camera () {
    let pushData = this.pushData.bind(this);
    let that = this;
    return {
      record: function (startTime) {
        that._initDate = startTime;
        document.addEventListener(that._eventType, pushData, false);
      },
      stop: function () {
        document.removeEventListener(that._eventType, pushData, false);
      }
    }
  }
}

export {EventRecorder}
