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
        .then(apps => {
          vm.apps = apps.filter(a => a.active && a.id !== vm.currentApp.id);
        })
        .catch(() => {
          notifier.error($filter('translate')('COMMON_ERROR'));
        });
    }

  }

})();
