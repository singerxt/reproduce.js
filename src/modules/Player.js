/**
 * Player
 *
 *
 * @constructor
 * @params {array}
 */

class Player {
  constructor (data) {
    this._data = data;
  }

  /**
   * Animation loop
   */

  play () {
    this.createMousePointer();
    let that = this;
    for(let i = 0; i < this._data.length; i++) {

      /**
       * Need to create new scope
       */

      (function (i, data) {
        setTimeout(function () {
          let etype = data[i].type;

          if(etype === 'mousemove') {
            that.mouseMove(data[i]);
          } else if (etype === 'scroll') {
            that.mouseMove(data[i]);
          }

          /**
           * Remove mouse pointer
           * after animation
           */

          if(i === data.length - 1) {
            this._pointer.parentNode.removeChild(this._pointer);
          }
        },data[i].time)
      })(i, this._data)
    }
  }

  /**
   * Move mouse pinter
   */

  mouseMove (data) {
    this._pointer.style.left = data.posX + 'px';
    this._pointer.style.top = data.posY + 'px';
  };

  /**
   * Scroll animation
   */

  scroll (data) {
    window.scroll(0, data.positionY);
  }

  /**
   *
   * @returns {undefined}
   */

  createMousePointer () {
    var pointer = document.createElement('div');

    /**
     * set initial styles for mouse pointer
     */

    pointer.className = 'reproduce-pointer';
    pointer.style.width = '10px';
    pointer.style.height = '10px';
    pointer.style.position = 'fixed';
    pointer.style.top = '10px';
    pointer.style.left = '10px';
    pointer.style.background = '#99cc00';

    /**
     * Append pointer
     */

    document.body.appendChild(pointer);
    this._pointer = pointer;
  }
}

export {Player}
