import {EventSimulator} from '../core/Event/EventSimulator.js';

/**
 * Event Recorder
 *
 * @Author Mateusz Śpiewak
 * @params data
 */

class Player {
  constructor (data) {
    this._data = data;
    this.ES = new EventSimulator();
  }

  /**
   * Animation loop
   */

  play () {
    this.createMousePointer();
    let that = this;
    for(let i = 0; i < this._data.length; i++) {

      /**
       * Need to create new scopecc
       */

      (function (i, data) {
        setTimeout(function () {
          let etype = data[i].type;

          if(etype === 'mousemove') {
            that.ES.mouseMove(data[i], that._pointer);
          } else if (etype === 'scroll') {
            that.ES.scroll(data[i]);
          } else if (etype === 'click') {
            that.ES.click(data[i]);
          } else if (etype === 'mouseover') {
            that.ES.mouseOver(data[i]);
          } else if (etype === 'resize') {
            that.ES.resize(data[i]);
          }

          /**
           * Remove mouse pointer
           * after animation
           */

          if(i === data.length - 1) {
            that._pointer.parentNode.removeChild(that._pointer);
          }
        },data[i].time)
      })(i, this._data)
    }
  }

  /**
   *
   * @returns {undefined}
   */

  createMousePointer () {
    let pointer = document.createElement('div');

    /**
     * set initial styles for mouse pointer
     */

    pointer.className = 'reproduce-pointer';
    pointer.style.width = '20px';
    pointer.style.height = '20px';
    pointer.style.position = 'fixed';
    pointer.style.top = '10px';
    pointer.style.left = '10px';
    pointer.style.background = 'url("img/pointerm.png")';

    /**
     * Append pointer
     */

    document.body.appendChild(pointer);
    this._pointer = pointer;
  }
}

export {Player}
