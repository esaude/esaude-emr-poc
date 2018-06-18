(() => {
  'use strict';

  angular
    .module('bahmni.common.uiHelper')
    .directive('pocConfirmButton', pocConfirmButton);

  pocConfirmButton.$inject = [];

  /**
   * A button that asks for confirmation when clicked.
   */
  /* @ngInject */
  function pocConfirmButton() {
    var directive = {
      templateUrl: '../common/ui-helper/directives/pocConfirmButton.html',
      bindToController: true,
      link: link,
      controller: ControllerName,
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        confirm: '&onConfirm',
        cancel: '&onCancel'
      },
      transclude: true
    };
    return directive;

    function link(scope, iElement, iAttrs) {
      var button = iElement.find('#button');
      //Move class attribute to actual button
      button.attr('class', iAttrs['class']);
      iElement.removeAttr('class');
    }
  }

  ControllerName.$inject = [];

  /* @ngInject */
  function ControllerName() {

  }

})();
