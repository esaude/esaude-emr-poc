(function () {
  'use strict';

  angular
    .module('authentication')
    .directive('pocAuthorize', pocAuthorize);

  pocAuthorize.$inject = ['authorizationService'];

  function pocAuthorize(authorizationService) {
    var directive = {
      template: '<ng-transclude ng-if="authorized"></ng-transclude>',
      link: link,
      restrict: 'E',
      transclude: true,
      scope: {
        role: '='
      }
    };
    return directive;

    function link(scope) {
      authorizationService.hasRole(scope.role).then(function (hasRole) {
        scope.authorized = hasRole;
      });
    }
  }

})();

