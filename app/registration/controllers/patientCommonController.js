(function () {
  'use strict';

  angular
    .module('registration')
    .controller('PatientCommonController', PatientCommonController);

  PatientCommonController.$inject = ['$rootScope', '$scope', '$http', '$state', 'patientAttributeService', 'patientService',
    'localStorageService', 'spinner', 'notifier', '$filter'];

  /* @ngInject */
  function PatientCommonController($rootScope, $scope, $http, $state, patientAttributeService, patientService, localStorageService,
                                   spinner, notifier, $filter) {

    var dateUtil = Bahmni.Common.Util.DateUtil;
    var patientConfiguration = $scope.patientConfiguration;

    // TODO: Remove dependency on $scope!
    var vm = this;
    vm.patient = $scope.patient;
    vm.patientAttributes = [];
    vm.patientIdentifierTypes = [];
    vm.srefPrefix = $scope.srefPrefix;
    vm.today = dateUtil.getDateWithoutTime(dateUtil.now());

    vm.disableIsDead = disableIsDead;
    vm.getAutoCompleteList = getAutoCompleteList;
    vm.getDataResults = getDataResults;
    vm.getDeathConcepts = getDeathConcepts;
    vm.filterRetireDeathConcepts = filterRetireDeathConcepts;
    vm.listRequiredIdentifiers = listRequiredIdentifiers;
    vm.removeIdentifier = removeIdentifier;
    vm.selectIdentifierType = selectIdentifierType;
    vm.addNewIdentifier = addNewIdentifier;
    vm.selectIsDead = selectIsDead;
    vm.setPreferredId = setPreferredId;
    vm.stepForward = stepForward;

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
      });

      spinner.forPromise(load);
    }


    function disableIsDead() {
      return (vm.patient.causeOfDeath !== null || vm.patient.deathDate !== null) && vm.patient.dead;
    }


    function getAutoCompleteList(attributeName, query, type) {
      return patientAttributeService.search(attributeName, query, type);
    }


    function getDataResults(data) {
      return data.results;
    }


    function getDeathConcepts() {
      var deathConcept;
      var deathConceptValue;
      $http({
        url: '/openmrs/ws/rest/v1/systemsetting',
        method: 'GET',
        params: {
          q: 'concept.causeOfDeath',
          v: 'full'
        },
        withCredentials: true,
        transformResponse: [function (data) {
          deathConcept = JSON.parse(data);
          deathConceptValue = deathConcept.results[0].value;
          $http.get(Bahmni.Common.Constants.conceptUrl, {
            params: {
              q: deathConceptValue,
              v: 'custom:(uuid,name,set,answers:(uuid,display,name:(uuid,name),retired))'
            },
            withCredentials: true
          }).then(function (results) {
            vm.deathConcepts = results.data.results[0] !== null ? results.data.results[0].answers : [];
            vm.deathConcepts = filterRetireDeathConcepts(vm.deathConcepts);
          });
        }]
      });
    }


    function filterRetireDeathConcepts(deathConcepts) {
      return _.filter(deathConcepts, function (concept) {
        return !concept.retired;
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
              location: localStorageService.cookie.get("emr.location").uuid,
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
    };

    //TODO: Find and use a library that does this.
    function randomStr(m) {
      var m = m || 9;
      var s = '';
      var r = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      for (var i=0; i < m; i++) {
        s += r.charAt(Math.floor(Math.random()*r.length));
      }
      return s;
    };

    function addNewIdentifier() {
      vm.patient.identifiers.push({
          identifier: null, preferred: false,
          location: localStorageService.cookie.get("emr.location").uuid,
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


    $scope.tabManager = new TabManager();
    if ($state.current.name.startsWith("newpatient")) {
      $scope.tabManager.addStepDefinition("newpatient.identifier", 1);
      $scope.tabManager.addStepDefinition("newpatient.name", 2);
      $scope.tabManager.addStepDefinition("newpatient.gender", 3);
      $scope.tabManager.addStepDefinition("newpatient.age", 4);
      $scope.tabManager.addStepDefinition("newpatient.address", 5);
      $scope.tabManager.addStepDefinition("newpatient.other", 6);
    } else {
      $scope.tabManager.addStepDefinition("editpatient.identifier", 1);
      $scope.tabManager.addStepDefinition("editpatient.name", 2);
      $scope.tabManager.addStepDefinition("editpatient.gender", 3);
      $scope.tabManager.addStepDefinition("editpatient.age", 4);
      $scope.tabManager.addStepDefinition("editpatient.address", 5);
      $scope.tabManager.addStepDefinition("editpatient.other", 6);
    }

    //Since "aForm.$valid" is only available on angular expressions/directives
    //we are using this hack to make its value available as a member of the controller
    $scope.formCurrentlyValid = false;
    $scope.$watch("aForm.$valid", function (newValue) {
      $scope.formCurrentlyValid = newValue;
    })

    //Prevents the user from changing registration tabs while the current tab has invalid data
    $scope.$on('$stateChangeStart',
      function(event, toState, toParams, fromState, fromParams){
        var stepingForward = $scope.tabManager.isStepingForward(fromState, toState);
        var jumpingMoreThanOneTab = $scope.tabManager.isJumpingMoreThanOneTab(fromState, toState);

        console.info("Debug");

        if (!stepingForward || (stepingForward && !jumpingMoreThanOneTab && $scope.formCurrentlyValid)) {
          vm.showMessages = false;
        } else {
          event.preventDefault();
          vm.showMessages = true;
        }
      });
  }

})();

//Helps us validate user navigation along the registration tabs
function TabManager() {
  this.addStepDefinition = function (name, index) {
    this[name] = index;
  }

  this.isStepingForward = function (fromState, toState) {
    var fromIndex = this[fromState.name];
    var toIndex = this[toState.name];
    var stepingForward = (toIndex - fromIndex) > 0;
    return stepingForward;
  }

  this.isJumpingMoreThanOneTab = function (fromState, toState) {
    var fromIndex = this[fromState.name];
    var toIndex = this[toState.name];
    var jumpingMoreThanOneTab = Math.abs(toIndex - fromIndex) > 1;
    return jumpingMoreThanOneTab;
  }

  return this;
}

