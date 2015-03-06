var styles = {};

getStylesAsString: function () {
  function () {
    for (var key in validation_messages) {
      var obj = validation_messages[key];
      for (var prop in obj) {
        // important check that this is objects own property 
        // not from prototype prop inherited
        if(obj.hasOwnProperty(prop)){
          alert(prop + " = " + obj[prop]);
        }
      }
    }
  }

  styles.exports = styles;