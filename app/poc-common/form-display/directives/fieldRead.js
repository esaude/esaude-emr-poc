(function () {
  'use strict';

  angular
    .module('poc.common.formdisplay')
    .directive('fieldRead', fieldRead);

  fieldRead.$inject = [];

  /* @ngInject */
  function fieldRead() {
    var directive = {
      // TODO: Use vm
      bindToController: true,
      controller: FieldReadDirectiveController,
      controllerAs: 'vm',
      restrict: 'AE',
      scope: {
        payload: '=',
        formPart: '=',
        displaying: '='
      },
      templateUrl: ' ../poc-common/form-display/views/fieldRead.html'
    };
    return directive;
  }

  FieldReadDirectiveController.$inject = ['$scope'];

  /* @ngInject */
  function FieldReadDirectiveController($scope) {

    var vm = this;

    vm.getFieldValidity = getFieldValidity;
    vm.isTrueFalseQuestion = isTrueFalseQuestion;
    vm.stringToJson = stringToJson;
    vm.$onInit = onInit;

    function onInit() {
      $scope.$watch('vm.payload', function (value) {
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

    function getFieldValidity(fieldUuid) {
      if (vm.displaying) {
        return {
          uuid: fieldUuid,
          valid: true
        };
      }

      return $scope.$parent.visitedFields[fieldUuid];
    }

    function isTrueFalseQuestion(question) {
      var found = _.find(question, function (answer) {
        return answer.uuid === "e1d81b62-1d5f-11e0-b929-000c29ad1d07" ||
          answer.uuid === "e1d81c70-1d5f-11e0-b929-000c29ad1d07";
      });
      return angular.isDefined(found);
    }

  }

})();

