(() => {
  'use strict';

  angular
    .module('authentication')
    .directive('logOut', logOut);

  logOut.$inject = ['sessionService', '$window'];

  function logOut(sessionService, $window) {
    var directive = {
      link: link
    };
    return directive;

    function link(scope, element, attrs) {
      element.bind('click', () => {
        scope.$apply(() => {
          sessionService.destroy().then(
            () => {
              $window.location = "../home/index.html#/login";
            }
          );
        });
      });
    }
  }

})();
