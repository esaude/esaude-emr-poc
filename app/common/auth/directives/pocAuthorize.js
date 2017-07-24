(function () {
  'use strict';

  angular
    .module('authentication')
    .directive('pocAuthorize', pocAuthorize);

  pocAuthorize.$inject = [];

  function pocAuthorize() {
    var directive = {
      template: '<ng-transclude ng-if="authorized"></ng-transclude>',
      link: link,
      restrict: 'E',
      transclude: true,
      scope: {
        privilege: '='
      }
    };
    return directive;

    /**
     * NOTE: Real implementation is inside pocAuthorizeDirectiveDecorator in module definition.
     * @param scope
     */
    function link(scope) {
      scope.authorized = true;
    }
  }

})();

