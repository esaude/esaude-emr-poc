(function () {
  'use strict';

  angular
    .module('authentication')
    .directive('pocAuthorize', pocAuthorize);

  pocAuthorize.$inject = [];

  function pocAuthorize() {
    var directive = {
      templateUrl: '../common/auth/directives/pocAuthorize.html',
      link: link,
      restrict: 'E',
      transclude: true,
      scope: {
        privilege: '=',
        displayInfo: '='
      }
    };
    return directive;

    /**
     * NOTE: Real implementation is inside pocAuthorizeDirectiveDecorator in module config.
     * @param scope
     */
    function link(scope) {
      scope.authorized = true;
    }
  }

})();

