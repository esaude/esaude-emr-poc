(function () {
  'use strict';

  angular
    .module('movepatient')
    .directive('movePatient', movePatient)
    .controller('MovePatientController', MovePatientController);

  /* @ngInject */
  function movePatient() {
    var directive = {
      bindToController: true,
      controller: MovePatientController,
      controllerAs: 'vm',
      link: link,
      restrict: 'A',
      scope: {
        patientUuid: '='
      }
    };
    return directive;

    function link(scope, element) {
      element.click(function () {
        if (scope.vm.patientUuid) {
          scope.vm.showDialog();
        }
      });
    }
  }

  /* @ngInject */
  function MovePatientController($scope, $window, ngDialog) {
    var vm = this;

    vm.apps = [];

    vm.linkApp = linkApp;
    vm.showDialog = showDialog;

    function linkApp(app) {
      $window.location.href = app.url + '#/mvp/' + vm.patientUuid;
    }

    function showDialog() {
      var scope = $scope.$new(true);
      scope.vm = vm;
      ngDialog.open({
        template: '../move-patient/directives/movePatient.html',
        scope: scope,
        width: '60%',
        showClose: false
      });
    }
  }

})();
