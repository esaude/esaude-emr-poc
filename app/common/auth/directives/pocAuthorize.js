(function () {
  'use strict';

  angular
    .module('authentication')
    .directive('pocAuthorize', pocAuthorize);

  pocAuthorize.$inject = [];

  /**
   * A directive that transcludes its children if the current user has the privilege defined in the privilege binding.
   * Note that elements created in the transcluded scope will not be available in the directives parent scope.
   * If you wrap a form with a name binding in this directive the binding will be only available in this directives
   * scope.
   */
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
     * NOTE: Real implementation is inside pocAuthorizeDirectiveDecorator in module config.
     * @param scope
     */
    function link(scope) {
      scope.authorized = true;
    }
  }

})();

