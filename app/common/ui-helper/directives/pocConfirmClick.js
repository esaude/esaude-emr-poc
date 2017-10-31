(function () {
  'use strict';

  angular
    .module('bahmni.common.uiHelper')
    .directive('pocConfirmClick', pocConfirmClick);

  pocConfirmClick.$inject = ['translateFilter'];

  /* @ngInject */
  function pocConfirmClick(translateFilter) {
    var directive = {
      link: link,
      restrict: 'A'
    };
    return directive;

    function link(scope, element, attrs) {
      var msg = attrs.confirmMessage || translateFilter('ARE_YOU_SURE');
      var clickAction = attrs.pocConfirmClick;

      element.bind('click', function () {
        if(attrs.ngCondition) {
          var condition = scope.$eval(attrs.ngCondition);
          if (!condition) {
            var conditionMsg = scope.$eval(attrs.conditionMessage);
            return window.confirm(conditionMsg);
          }
        }
        if (window.confirm(msg)) {
          scope.$apply(clickAction);
        }
      });
    }
  }

})();
