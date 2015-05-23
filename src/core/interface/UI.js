import {Recorder} from '../../modules/Recorder.js';
import {Player} from '../../modules/Player.js';

class UI {

  constructor () {
    this.Recorder = new Recorder();
    this.Player = new Player();
  }

  /**
   *
   * @returns {string}
   */

  template () {
    let $temp = '<div class="reproduce-ui"><button class="play">play</button><button class="record">record</button><button class="stop">stop</button></>'
    return $temp;
  }

  /**
   *
   * @returns {undefined}
   */

  appendButtons () {
    let $body = document.querySelector('body');
    $body.insertAdjacentHTML('beforeend',this.template());
  }

  /**
   *
   * @returns {undefined}
   */
  init () {
    this.appendButtons();

    let $buttons = document.querySelectorAll('.reproduce-ui button');


    for(var i = 0; i < $buttons.length; i++) {
      this.click($buttons[i]);
    }
  }

  click ($elem) {
    let that = this;
    $elem.addEventListener('click', function () {
      if(this.className === 'play') {
        that.Recorder.stop();
        that.Player._data = that.Recorder.getData();
        that.Player.play();
      } else if (this.className === 'record') {
        that.Recorder.record();
      } else {
        that.Recorder.stop();
      }
    });
  }
}

export {UI}
