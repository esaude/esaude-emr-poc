(function () {
  'use strict';

  angular
    .module('authentication')
    .directive('btnUserInfo', btnUserInfo);

  function btnUserInfo() {
    var directive = {
      link: link,
      restrict: 'CA'
    };
    return directive;

    function link(scope, element, attrs) {
      element.bind('click', function (event) {
        $(this).next().toggleClass('active');
        event.stopPropagation();
      });
      $(document).find('body').bind('click', function () {
        $(element).next().removeClass('active');
      });
    }
  }

})();
