'use strict'

angular.module('bahmni.common.uiHelper').directive("regExpRequire", function() {
  var regexp;
  return {
    restrict: "A",
    link: function(scope, elem, attrs) {
      regexp = eval(attrs.regExpRequire);

      var char;
      elem.on("keypress", function(event) {
        char = String.fromCharCode(event.which);
        if(!regexp.test(elem.val() + char))
          event.preventDefault();
      })
    }
  }

});
