import {UI} from './core/interface/UI.js';
import {PrepareStyles} from './modules/styles.js';

global.app = function () {
  var U = new UI();
  new PrepareStyles();
  U.init();
};
