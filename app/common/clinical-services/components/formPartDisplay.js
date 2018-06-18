(function () {
  'use strict';

  angular
    .module('poc.common.clinicalservices')
    .component('formPartDisplay', {
      controller: FieldReadDirectiveController,
      controllerAs: 'vm',
      bindings: {
        payload: '<',
        formPart: '<',
        validate: '<'
      },
      templateUrl: ' ../common/clinical-services/components/formPartDisplay.html',
      require: {
        formWizard: '?^formWizard'
      }
    });

  FieldReadDirectiveController.$inject = ['$scope'];

  /* @ngInject */
  function FieldReadDirectiveController($scope) {

    var vm = this;

    vm.getVisitedField = getVisitedField;
    vm.isTrueFalseQuestion = isTrueFalseQuestion;
    vm.stringToJson = stringToJson;
    vm.$onInit = onInit;

    function onInit() {
      $scope.$watch('vm.payload', value => {
        if (value) {
          vm.payload = value;
          // This makes the directive re-render itself. Needed when vm.payload is loaded asynchronously.
          vm.formPart = angular.copy(vm.formPart);
        }
      });
    }

    function stringToJson(str) {
      return str ? JSON.parse(str) : str;
    }

    function getVisitedField(fieldUuid) {
      if (!vm.validate) {
        return {
          uuid: fieldUuid,
          valid: true
        };
      }

      return vm.formWizard.getVisitedField(fieldUuid);
    }

    function isTrueFalseQuestion(question) {
      var found = _.find(question, answer => answer.uuid === "e1d81b62-1d5f-11e0-b929-000c29ad1d07" ||
        answer.uuid === "e1d81c70-1d5f-11e0-b929-000c29ad1d07");
      return angular.isDefined(found);
    }

  }

})();
