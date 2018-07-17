(function () {
  'use strict';

  angular
    .module('common.patient')
    .component('patientAddressStep', {
      bindings: {
        patient: '<',
        form: '<',
        showMessages: '<'
      },
      controller: PatientAddressStepController,
      controllerAs: 'vm',
      require: {
        patientWizard: '^^',
      },
      templateUrl: '../common/patient/components/wizard/steps/patientAddressStep.html',
    });

  /* @ngInject */
  function PatientAddressStepController(configurationService, addressAttributeService) {

    var autocompletedFields = [];

    var addressLevelsNamesInDescendingOrder = [];

    var vm = this;

    vm.addressLevels = [];

    vm.$onInit = $onInit;
    vm.addressFieldSelected = addressFieldSelected;
    vm.getAddressEntryList = getAddressEntryList;
    vm.clearFields = clearFields;

    function $onInit() {
      configurationService.getAddressLevels()
        .then(addressLevels => {
          vm.addressLevels = addressLevels.slice(0).reverse();
          addressLevelsNamesInDescendingOrder = vm.addressLevels.map(addressLevel => addressLevel.addressField);
        });
    }

    function addressFieldSelected(addressFieldName, $item) {
      var parentFields = addressLevelsNamesInDescendingOrder.slice(addressLevelsNamesInDescendingOrder.indexOf(addressFieldName) + 1);
      var parent = $item.parent;
      parentFields.forEach(parentField => {
        if (!parent) return;
        vm.patient.address[parentField] = parent.name;

        parent = parent.parent;
      });
      autocompletedFields = [];
      autocompletedFields.push(addressFieldName);
      autocompletedFields = autocompletedFields.concat(parentFields);
    }

    function getAddressEntryList(addressFieldName, term) {
      return addressAttributeService.search(addressFieldName, term);
    }

    function clearFields(addressFieldName) {
      if (_.includes(autocompletedFields, addressFieldName)) {
        var childFields = autocompletedFields.slice(0, autocompletedFields.indexOf(addressFieldName));
        childFields.forEach(childField => {
          vm.patient.address[childField] = "";
        });
      }
    }
  }

})();
