(function () {
  'use strict';

  angular
    .module('common.patient')
    .directive('movePatient', movePatient);

  movePatient.$inject = [];

  /* @ngInject */
  function movePatient() {
    var directive = {
      bindToController: true,
      controller: MovePatientDirectiveController,
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
        scope.vm.movePatientTo();
      });
    }
  }

  MovePatientDirectiveController.$inject = ['$scope', '$window', 'appService', 'applicationService',
    'localStorageService', 'ngDialog'];

  /* @ngInject */
  function MovePatientDirectiveController($scope, $window, appService, applicationService, localStorageService,
                                          ngDialog) {
    var vm = this;

    vm.apps = [];
    vm.appId = appService.getAppDescriptor().getId();

    vm.$onInit = activate;
    vm.linkApp = linkApp;
    vm.movePatientTo = movePatientTo;

    function activate() {
      applicationService.getApps().then(function (apps) {
        vm.apps = apps;
      });
    }

    function linkApp(url) {
      localStorageService.set('movingPatient', vm.patientUuid);
      $window.location.href = url;
    }

    function movePatientTo() {
      var scope = $scope.$new(true);
      scope.vm = vm;
      ngDialog.open({
        template: '../common/patient/directives/movePatient.html',
        scope: scope,
        width: '60%',
        showClose: false
      });
    }
  }

})();

