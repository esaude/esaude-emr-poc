(function () {
  'use strict';

  angular
    .module('common.patient')
    .component('personAttributeInput', {
      bindings: {
        person: '<',
        attribute: '<'
      },
      controllerAs: 'vm',
      templateUrl: '../common/patient/components/personAttributeInput.html',
    });

})();
