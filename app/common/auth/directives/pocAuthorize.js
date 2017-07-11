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
        privilege: '='
      }
    };
    return directive;

    function link(scope) {
      authorizationService.hasPrivilege(scope.privilege).then(function (hasPrivilege) {
        scope.authorized = hasPrivilege;
      });
    }
  }

})();

