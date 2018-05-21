(function () {
  'use strict';

  angular
    .module('bahmni.common.appFramework')
    .component('apps', {
      controller: AppsController,
      controllerAs: 'vm',
      bindings: {
        onAppSelect: '='
      },
      templateUrl: '../common/app-framework/components/apps.html'
    });

  /* @ngInject */
  function AppsController(appService, applicationService, notifier) {

    var vm = this;

    vm.apps = [];
    vm.currentApp = {};

    vm.$onInit = $onInit;

    function $onInit() {
      vm.currentApp = appService.getAppDescriptor();

      applicationService.getApps()
        .then(function (apps) {
          vm.apps = apps.filter(function (a) { return a.active && a.id !== vm.currentApp.id; });
        })
        .catch(function () {
          notifier.error($filter('translate')('COMMON_ERROR'));
        });
    }

  }

})();
