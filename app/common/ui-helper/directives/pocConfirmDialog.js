(function () {
  'use strict';

  angular
    .module('bahmni.common.uiHelper')
    .directive('pocConfirmDialog', pocConfirmDialog);

  pocConfirmDialog.$inject = ['$rootScope', 'ngDialog'];

  /**
   * A confirmation dialog. Delegates to ngDialog.
   */
  /* @ngInject */
  function pocConfirmDialog($rootScope, ngDialog) {

    var ngDialogOptions = {
      template: '../common/ui-helper/directives/pocConfirmDialog.html',
      scope: $rootScope.$new()
    };

    var directive = {
      bindToController: true,
      controller: ControllerName,
      controllerAs: 'vm',
      link: link,
      restrict: 'A',
      scope: {
        confirm: '&onConfirm',
        cancel: '&onCancel'
      }
    };
    return directive;

    function link(scope, element, attrs) {
      scope.$watch(attrs.pocConfirmDialog, function (value) {
        ngDialogOptions.scope.message = value;
      });

      element.click(function (event) {
        event.preventDefault();
        var promise = ngDialog.openConfirm(ngDialogOptions);
        promise
          .then(function () {
            scope.vm.confirm();
          })
          .catch(function () {
            scope.vm.cancel();
          });
      });
    }
  }

  ControllerName.$inject = [];

  /* @ngInject */
  function ControllerName() {

  }

})();

