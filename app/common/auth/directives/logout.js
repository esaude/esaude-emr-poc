(function () {
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
      element.bind('click', function () {
        scope.$apply(function () {
          sessionService.destroy().then(
            function () {
              $window.location = "../home/index.html#/login";
            }
          );
        });
      });
    }
  }

})();
