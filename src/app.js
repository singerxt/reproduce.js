import {UI} from './core/interface/UI.js'

global.app = function () {
  var U = new UI();
  U.init();
};
