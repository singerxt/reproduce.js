'use strict';
var interfacer = {};

interfacer.config = {
  buttons: $('.reproduce-interface button')
};

interfacer.clickEvent = function (e) {
  var opt = e.target.dataset.option;

  switch (opt) {
    case 'record':
      window.record();
      break;
    case 'play': 
      window.play();
      break;
    case 'stop': 
      window.stop();
      break;
    case 'getData':
      window.getData();
      break;
    case 'setData':
      window.setData();
      break;
  }
};

interfacer.bindClickEvent = function () {
  this.config.buttons.on('click', this.clickEvent);
};

module.exports = interfacer;
