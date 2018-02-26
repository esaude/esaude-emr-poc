(function () {
  'use strict';

  angular
    .module('movepatient')
    .directive('movePatient', movePatient)
    .controller('MovePatientController', MovePatientController);

  movePatient.$inject = [];

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

  MovePatientController.$inject = ['$scope', '$window', 'appService', 'applicationService', 'ngDialog'];

  /* @ngInject */
  function MovePatientController($scope, $window, appService, applicationService, ngDialog) {
    var vm = this;

    vm.apps = [];
    vm.appId = appService.getAppDescriptor().getId();

    vm.$onInit = activate;
    vm.linkApp = linkApp;
    vm.showDialog = showDialog;

    function activate() {
      applicationService.getApps().then(function (apps) {
        vm.apps = apps;
      });
    }

    function linkApp(url) {
      $window.location.href = url + '#/mvp/' + vm.patientUuid;
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
