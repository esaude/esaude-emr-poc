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
      // bindToController: true,
      controller: FieldReadDirectiveController,
      // controllerAs: 'vm',
      restrict: 'AE',
      scope: {
        payload: '=',
        formPart: '='
      },
      templateUrl: ' ../poc-common/form-display/views/fieldRead.html'
    };
    return directive;
  }

  FieldReadDirectiveController.$inject = ['$scope', '$rootScope'];

  /* @ngInject */
  function FieldReadDirectiveController($scope, $rootScope) {

    $scope.getFieldValidity = getFieldValidity;
    $scope.isTrueFalseQuestion = isTrueFalseQuestion;
    $scope.stringToJson = stringToJson;

    function stringToJson(str) {
      return str ? JSON.parse(str) : str;
    }

    function getFieldValidity(fieldUuid) {
      if ($rootScope.postAction === "display") {
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

