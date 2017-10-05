(function () {
  'use strict';

  angular
    .module('poc.common.clinicalservices.formdisplay')
    .directive('formField', formField);

  formField.$inject = [];

  /* @ngInject */
  function formField() {
    var directive = {
      // TODO: Use vm
      // bindToController: true,
      controller: FormFieldDirectiveController,
      // controllerAs: 'vm',
      restrict: 'AE',
      scope: {
        field: '=',
        fieldUuid: '=',
        fieldId: '=',
        formParts: '=',
        formLayout: '='
      },
      templateUrl: ' ../poc-common/clinical-services/form-display/views/formField.html'
    };
    return directive;

  }

  FormFieldDirectiveController.$inject = ['$http', '$rootScope', '$scope', 'observationsService'];

  /* @ngInject */
  function FormFieldDirectiveController($http, $rootScope, $scope, observationsService) {

    var whoCurrentStageuuId = "e27ffd6e-1d5f-11e0-b929-000c29ad1d07";

    var noOp = function () {
    };

    var formLogic = {};
    formLogic.defaultValueIsLastEntry = defaultValueIsLastEntry;
    formLogic.calculateWHOStage = calculateWHOStage;
    formLogic.calculateOnChange = noOp;
    formLogic.calculateWithLastObs = noOp;

    $scope.isTrueFalseQuestion = isTrueFalseQuestion;
    $scope.getConceptInAnswers = getConceptInAnswers;
    $scope.getConcepts = getConcepts;

    activate();

    ////////////////

    function activate() {
      $scope.$watch('$parent.submitted', function (value) {
        $scope.showMessages = value;
      });

      $scope.$watch('aForm.' + $scope.fieldId + '.$valid', function (value) {
        if (angular.isDefined(value)) {
          $scope.$parent.visitedFields[$scope.fieldUuid] = {
            uuid: $scope.fieldUuid,
            valid: value
          };
        }
      });

      $scope.$watch('formParts', function (value) {
        if (value && value.form) {
          $scope.fieldModel = $scope.formParts.form.fields[$scope.fieldUuid];

          if (!$scope.fieldModel.value) {
            loadField()
          }

          if ($scope.fieldModel.field.uuid === whoCurrentStageuuId) {
            loadField();
          }

          if ($scope.field.dateController) {
            dateController($scope.field.dateController);
          }
        }
      });
    }

    function dateController(param) {
      $scope.$watch('aForm.' + $scope.fieldId + '.$viewValue', function (newVal, oldVal) {
        var dateUtil = Bahmni.Common.Util.DateUtil;

        var startDate = $scope.formParts.form.fields[param].value;
        var _date = dateUtil.getDateWithoutTime(startDate);
        var date = dateUtil.getDateWithoutTime(new Date());
        var _dateu = dateUtil.getDateWithoutTime(newVal);

        if (newVal !== oldVal && !_.isUndefined(newVal)) {
          if (_dateu > _date) {
            $scope.validDate = false;
          } else {
            $scope.fieldModel.value = "";
            $scope.validDate = true;

          }
        }
      });
    }

    function defaultValueIsLastEntry(concept) {
      observationsService.getLastValueForConcept($rootScope.patient.uuid, concept).then(function (value) {
        $scope.fieldModel.value = value;
      });
    }

    function loadField() {
      _.forEach($scope.field.logics, function (param, name) {
        formLogic[name](param);
      });
    }

    function isTrueFalseQuestion(question) {
      var found = _.find(question, function (answer) {


        return answer.uuid === "e1d81b62-1d5f-11e0-b929-000c29ad1d07" ||
          answer.uuid === "e1d81c70-1d5f-11e0-b929-000c29ad1d07";
      });
      return angular.isDefined(found);
    }

    function getConceptInAnswers(answers, conceptUuid) {
      return _.find(answers, function (answer) {
        return answer.uuid === conceptUuid;
      });
    }

    function calculateWHOStage(param) {

      var whoStages = $scope.fieldModel.fieldConcept.concept.answers;

      var firstField = 0;
      var lastPart = 4;

      comuteWHOStage(firstField, lastPart, whoStages);
    }

    function comuteWHOStage(firstField, lastPart, whoStages) {

      for (var i = 0; i < lastPart; i++) {

        var part = $scope.formLayout.parts[i];
        var model = $scope.formParts.form.fields[part.fields[firstField].id];

        angular.forEach(model.fieldConcept.concept.answers, function (answer) {

          if (angular.isDefined(model.value)) {

            if (model.value[answer.uuid] !== "undefined") {

              $scope.fieldModel.value = _.find(whoStages, function (stage) {
                return stage.uuid === model.fieldConcept.concept.uuid;
              });

            }
          }

        });
      }
    }

    function getConcepts(request) {
      if (request.length < 2) return;

      return $http.get(Bahmni.Common.Constants.conceptUrl, {
        params: {
          source: $scope.field.searchBySource,
          q: request,
          v: "custom:(uuid,name,display)"
        }
      })
        .then(function (response) {
          return response.data.results.map(function (concept) {
            return concept;
          });
        });
    }
  }

})();
