'use strict';

var styles = {};

styles.appendReproduceStyles = function () {
  var replace,
      stylesString = '',
      styleSheet = document.createElement('style');
      styleSheet.type = 'text/css';

  for (var i = 0; i <= document.styleSheets.length - 1; i++) {
    for(var j = 0; j <= document.styleSheets[i].rules.length - 1; j ++) {
      replace = document.styleSheets[i].rules[j].cssText;
      if(replace.indexOf(':hover') !== -1) {
        replace = replace.replace(':hover', '.reproduce-hover');
        stylesString += replace;
      }
    }
  }

  styleSheet.appendChild(document.createTextNode(stylesString));
  document.body.appendChild(styleSheet);
};

module.exports = styles;