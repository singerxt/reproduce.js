/**
 *
 */

class EventSimulator {
  constructor () {
    this._lastMouseOver = {};
  }

  scroll (data) {
    window.scroll(0, data.positionY);
  }

  mouseMove (data, elem) {
    elem.style.left = data.posX + 'px';
    elem.style.top = data.posY + 'px';
  }

  resize (data) {
    document.body.style.width = data.width + 'px'
  }

  mouseEvent (data) {
    let opt = {
      pointerX: data.posX,
      pointerY: data.posY,
      button: 0,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      metaKey: false,
      bubbles: true,
      cancelable: true
    },
      $elem = document.elementFromPoint(data.posX, data.posY);



  }
}
