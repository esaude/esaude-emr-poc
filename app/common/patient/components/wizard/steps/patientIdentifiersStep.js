(function () {
  'use strict';

  angular
    .module('common.patient')
    .component('patientIdentifiersStep', {
      bindings: {
        patient: '<'
      },
      controller: PatientIdentifiersStepController,
      controllerAs: 'vm',
      require: {
        patientWizard: '^^',
      },
      templateUrl: '../common/patient/components/wizard/steps/patientIdentifiersStep.html',
    });

  /* @ngInject */
  function PatientIdentifiersStepController(notifier, patientService, sessionService, translateFilter) {

    var vm = this;

    var NAME = 'identifier';

    vm.$onInit = $onInit;
    vm.addNewIdentifier = addNewIdentifier;
    vm.listRequiredIdentifiers = listRequiredIdentifiers;
    vm.removeIdentifier = removeIdentifier;
    vm.selectIdentifierType = selectIdentifierType;
    vm.setPreferredId = setPreferredId;
    vm.getName = getName;
    vm.shouldShowMessages = shouldShowMessages;

    function $onInit() {

      vm.patientWizard.setCurrentStep(vm);

      getIdentifierTypes().then(identifierTypes => {
        vm.patientIdentifierTypes = identifierTypes;
      });
    }

    function addNewIdentifier() {
      vm.patient.identifiers.push({
        identifier: null, preferred: false,
        // TODO add location when in patientService.createPatientProfile
        location: sessionService.getCurrentLocation().uuid,
        fieldName: randomStr()
      });
    }

    function removeIdentifier(identifier) {
      vm.errorMessage = null;

      _.pull(vm.patient.identifiers, identifier);
    }


    function listRequiredIdentifiers() {
      if (!_.isEmpty(vm.patient.identifiers)) {
        //set identifier fieldName
        _.forEach(vm.patient.identifiers, identifier => {
          identifier.fieldName = identifier.identifierType.display.trim().replace(/[^a-zA-Z0-9]/g, '');
        });
        return;
      }

      getIdentifierTypes().then(identifierTypes => {
        vm.patientIdentifierTypes = identifierTypes;
        _.forEach(identifierTypes, value => {
          if (value.required) {
            var fieldName = value.name.trim().replace(/[^a-zA-Z0-9]/g, '');
            vm.patient.identifiers.push({
              identifierType: value,
              identifier: null, preferred: false,
              location: sessionService.getCurrentLocation().uuid,
              fieldName: fieldName
            });
          }
        });
      });
    }

    function getIdentifierTypes() {
      return patientService.getIdentifierTypes();
    }

    function selectIdentifierType(patientIdentifier) {

      var patientIdentifierType = patientIdentifier.selectedIdentifierType;

      if (patientIdentifierType !== null) {
        //validate already contained
        var found = _.find(vm.patient.identifiers, chr => chr.identifierType && chr.identifierType.display === patientIdentifierType.display);

        if (!found) {
          patientIdentifier.identifierType = patientIdentifierType;

        } else {
          patientIdentifier.selectedIdentifierType = undefined;
          notifier.error(translateFilter('PATIENT_INFO_IDENTIFIER_ERROR_EXISTING'));
        }
      }
    }

    function setPreferredId(identifier) {
      angular.forEach(vm.patient.identifiers, p => {
        if (p.identifierType.uuid !== identifier.identifierType.uuid) {
          p.preferred = false; //set them all to false
        }
      });
    }

    function randomStr(m) {
      var m = m || 9;
      var s = '';
      var r = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      for (var i=0; i < m; i++) {
        s += r.charAt(Math.floor(Math.random()*r.length));
      }
      return s;
    }

    function getName() {
      return NAME;
    }

    function shouldShowMessages() {
      return vm.patientWizard.showMessages;
    }
  }

})();
