/**
 *
 *
 */

import {qwest} from '../vendor/qwest.js';

class PrepareStyles {
  constructor () {
    console.log(qwest);
    this.$linkedCSS = document.querySelectorAll('link[rel="stylesheet"]');
    this.$inlinedCSS = document.querySelectorAll('style');
    this.reproduceClass = '.reproduce-hover';
    this.preprocessLinkedCSS();
  }

  preprocessLinkedCSS () {
    let that = this;
    for (let i = 0, len = this.$linkedCSS.length; i < len; i++) {
      window.qwest.get(this.$linkedCSS[i].href).then(function (r) {
        that.preprocessCSSstring(r.toString());
      });
    }
  }

  /**
   *
   * @params {string}
   * @return {undefined}
   */

  preprocessCSSstring (string) {
    let CSSString = string.replace(/:hover/g, this.reproduceClass),
        styleSheet = document.createElement('style');

    styleSheet.type = 'text/css';
    styleSheet.appendChild(document.createTextNode(CSSString));
    document.body.appendChild(styleSheet);
  }
}

export {PrepareStyles}
