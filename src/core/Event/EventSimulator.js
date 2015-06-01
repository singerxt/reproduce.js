/**
 * Event simulator
 *
 * @Author Mateusz Śpiewak
 */

class EventSimulator {

  /**
   *
   */

  constructor () {
    this._lastMouseOver = {
      x: 0,
      y: 0
    };
  }

  /**
   * Set correct scroll position
   * @param data
   */

  scroll (data) {
    window.scroll(0, data.positionY);
  }

  /**
   * Mouse move animation
   * @param data
   * @param elem
   */

  mouseMove (data, elem) {
    elem.style.left = data.posX + 5 + 'px';
    elem.style.top = data.posY + 5 + 'px';
  }

  /**
   * Set correct <body> width
   * @param data
   */

  resize (data) {
    document.body.style.width = data.width + 'px'
  }

  /**
   * Emulate click event
   * @notes For now we don't have IE support
   * @param data
   * @returns {boolean}
   */

  click (data) {
    let $elem = document.elementFromPoint(data.posX, data.posY),
        options =  {
          view: window,
          bubbles: true,
          cancelable: true
        },
        _event = new Event('click', options);

    if(!($elem)) {
      return false;
    }

    $elem.style.opacity = '0.5';

    setTimeout(function () {
      $elem.style.opacity = '1';
    },100);

    $elem.dispatchEvent(_event);
  }

  mouseOver (data) {
    let $elem = document.elementFromPoint(data.posX, data.posY),
        $elemOld = document.elementFromPoint(this._lastMouseOver.posX, this._lastMouseOver.posY),
      options =  {
        view: window,
        bubbles: true,
        cancelable: true
      },
      _eventMouseOver = new Event('mouseover', options),
      _eventMouseOut = new Event('mouseout', options);

    $elem.dispatchEvent(_eventMouseOver);
    $elemOld.dispatchEvent(_eventMouseOut);

    this._lastMouseOver = data;
  }
}

export {EventSimulator}
