(function () {
  'use strict';

  angular
    .module('registration')
    .controller('PatientCommonController', PatientCommonController);

  PatientCommonController.$inject = ['$filter', '$scope', '$state', 'conceptService', 'configurations',
    'localStorageService', 'notifier', 'patientAttributeService', 'patientService', 'sessionService', 'spinner',
    'TabManager'];


  /* @ngInject */
  function PatientCommonController($filter, $scope, $state, conceptService, configurations, localStorageService,
                                   notifier, patientAttributeService, patientService, sessionService, spinner,
                                   TabManager) {

    var patientConfiguration = $scope.patientConfiguration;
    var now = new Date();

    // TODO: Remove dependency on $scope!
    var vm = this;
    vm.addressLevels = configurations.addressLevels();
    vm.birthDatepickerOptions = {maxDate: now};
    vm.deathDatepickerOptions = {maxDate: now};
    vm.deathConcepts = [];
    vm.patientAttributes = [];
    vm.patientIdentifierTypes = [];
    vm.patient = $scope.patient;
    vm.srefPrefix = $scope.srefPrefix;

    vm.addNewIdentifier = addNewIdentifier;
    vm.changeTab = changeTab;
    vm.deceasedPatient = deceasedPatient;
    vm.deletePatient = deletePatient;
    vm.disableIsDead = disableIsDead;
    vm.getAutoCompleteList = getAutoCompleteList;
    vm.getDataResults = getDataResults;
    vm.getDeathConcepts = getDeathConcepts;
    vm.listRequiredIdentifiers = listRequiredIdentifiers;
    vm.removeIdentifier = removeIdentifier;
    vm.selectIdentifierType = selectIdentifierType;
    vm.selectIsDead = selectIsDead;
    vm.setPreferredId = setPreferredId;
    vm.stepForward = stepForward;
    vm.filterPersonAttributesForCurrStep = filterPersonAttributesForCurrStep;
    vm.filterPersonAttributesForDetails = filterPersonAttributesForDetails;


    var tabManager = new TabManager();
    tabManager.addStepDefinition(vm.srefPrefix + "identifier", 1);
    tabManager.addStepDefinition(vm.srefPrefix + "name", 2);
    tabManager.addStepDefinition(vm.srefPrefix + "gender", 3);
    tabManager.addStepDefinition(vm.srefPrefix + "age", 4);
    tabManager.addStepDefinition(vm.srefPrefix + "address", 5);
    tabManager.addStepDefinition(vm.srefPrefix + "other", 6);
    tabManager.addStepDefinition(vm.srefPrefix + "testing", 7);

    activate();

    ////////////////

    function activate() {

      angular.forEach(patientConfiguration.customAttributeRows(), function (value) {
        angular.forEach(value, function (value) {
          vm.patientAttributes.push(value);
        });
      });

      var load = getIdentifierTypes().then(function (identifierTypes) {
        vm.patientIdentifierTypes = identifierTypes;
        return vm.getDeathConcepts();
      });

      spinner.forPromise(load);
    }

    function successCallback() {
      notifier.success($filter('translate')('COMMON_MESSAGE_SUCCESS_ACTION_COMPLETED'));
    }
    function failureCallback() {
      notifier.error($filter('translate')('COMMON_MESSAGE_ERROR_ACTION'));
    }


    function disableIsDead() {
      // return null;
      return (vm.patient.causeOfDeath !== null || vm.patient.deathDate !== null) && vm.patient.dead;
    }


    function getAutoCompleteList(attributeName, query, type) {
      return patientAttributeService.search(attributeName, query, type);
    }


    function getDataResults(data) {
      return data.results;
    }


    function getDeathConcepts() {
      return conceptService.getDeathConcepts()
        .then(function(deathConcepts) {
          vm.deathConcepts = deathConcepts;
        }).catch(function(error) {
            //this line invokes a notification on registration loading...need to change the call from activate
          // notifier.error(($filter('translate')('COMMON_MESSAGE_ERROR_ACTION')));
      });
    }

    function deceasedPatient() {
      var patientState = {
        dead: true,
        causeOfDeath: vm.patient.causeOfDeath.uuid,
        deathDate:vm.patient.deathDate
      };
      patientService.updatePerson(vm.patient.uuid, patientState)
        .then(successCallback)
        .catch(failureCallback);
      $(function () {
        $('#deletePatientModal').modal('toggle');
      });
    }

    function deletePatient() {
      patientService.voidPatient(vm.patient.uuid, vm.deleteReason)
        .then(successCallback, failureCallback);
      $(function () {
        $('#deletePatientModal').modal('toggle');
      });
    }

    function listRequiredIdentifiers() {
      if (!_.isEmpty(vm.patient.identifiers)) {
        //set identifier fieldName
        _.forEach(vm.patient.identifiers, function (identifier) {
          identifier.fieldName = identifier.identifierType.display.trim().replace(/[^a-zA-Z0-9]/g, '');
        });
        return;
      }

      getIdentifierTypes().then(function (identifierTypes) {
        vm.patientIdentifierTypes = identifierTypes;
        _.forEach(identifierTypes, function (value) {
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


    function removeIdentifier(identifier) {
      vm.errorMessage = null;

      _.pull(vm.patient.identifiers, identifier);
    }


    function selectIdentifierType(patientIdentifier) {

      var patientIdentifierType = patientIdentifier.selectedIdentifierType;

      if (patientIdentifierType !== null) {
        //validate already contained
        var found = _.find(vm.patient.identifiers, function (chr) {
          return chr.identifierType && chr.identifierType.display === patientIdentifierType.display;
        });

        if (!found) {
          patientIdentifier.identifierType = patientIdentifierType;

        } else {
          patientIdentifier.selectedIdentifierType = undefined;
          notifier.error($filter('translate')('PATIENT_INFO_IDENTIFIER_ERROR_EXISTING'));
        }
      }
    }

    //TODO: Find and use a library that does this.
    function randomStr(m) {
      var m = m || 9;
      var s = '';
      var r = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      for (var i=0; i < m; i++) {
        s += r.charAt(Math.floor(Math.random()*r.length));
      }
      return s;
    }

    function addNewIdentifier() {
      vm.patient.identifiers.push({
        identifier: null, preferred: false,
        location: sessionService.getCurrentLocation().uuid,
        fieldName: randomStr()
      });
    }

    function selectIsDead() {
      if (vm.patient.causeOfDeath !== null || vm.patient.deathDate !== null) {
        vm.patient.dead = true;
      }
    }


    function setPreferredId(identifier) {
      angular.forEach(vm.patient.identifiers, function (p) {
        if (p.identifierType.uuid !== identifier.identifierType.uuid) {
          p.preferred = false; //set them all to false
        }
      });
    }

    function stepForward(sref, validity) {
      if (validity) {
        vm.showMessages = false;
        $state.go(vm.srefPrefix + sref);
      } else {
        vm.showMessages = true;
      }
    }

    function getIdentifierTypes() {
      return patientService.getIdentifierTypes();
    }

    function changeTab (form, sref) {
      var toStateName = vm.srefPrefix + sref;
      var currentStateName = $state.current.name;

      var stepingForward = tabManager.isStepingForward(currentStateName, toStateName);
      var jumpingMoreThanOneTab = tabManager.isJumpingMoreThanOneTab(currentStateName, toStateName);

      if (!stepingForward || (stepingForward && !jumpingMoreThanOneTab && form.$valid)) {
        vm.showMessages = false;
        $state.go(toStateName);
      } if (stepingForward && jumpingMoreThanOneTab) {
        notifier.warning("", $filter('translate')('FOLLOW_SEQUENCE_OF_TABS'));
      } else {
        vm.showMessages = true;
      }
    }

    function filterPersonAttributesForCurrStep (attributes, stepConfigAttrs) {
      return patientService.filterPersonAttributesForCurrStep (attributes, stepConfigAttrs);
    }

    function filterPersonAttributesForDetails (attributes, stepConfigAttrs) {
      return patientService.filterPersonAttributesForDetails (attributes, stepConfigAttrs);
    }

  }

})();
