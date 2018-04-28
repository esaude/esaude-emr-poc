(function () {
  'use strict';

  angular
    .module('poc.common.clinicalservices.formdisplay')
    .component('formField', {
      controller: FormFieldDirectiveController,
      controllerAs: 'vm',
      bindings: {
        field: '<',
        fieldUuid: '<',
        fieldId: '<',
        formParts: '<',
        formLayout: '<',
        patient: '<',
        previousEncounter: '<'
      },
      templateUrl: ' ../poc-common/clinical-services/form-display/views/formField.html'
    });

  FormFieldDirectiveController.$inject = ['$filter', '$scope', 'observationsService', 'conceptService'];

  /* @ngInject */
  function FormFieldDirectiveController($filter, $scope, observationsService, conceptService) {

    var whoCurrentStageuuId = "e27ffd6e-1d5f-11e0-b929-000c29ad1d07";
    var HEIGHT_FORM_FIELD_UUID_ADULT = "e292b558-1d5f-11e0-b929-000c29ad1d07";
    var HEIGHT_FORM_FIELD_UUID_CHILD = "e2939036-1d5f-11e0-b929-000c29ad1d07";
    var HEIGHT_CONCEPT_UUID = "e1e2e934-1d5f-11e0-b929-000c29ad1d07";

    var formLogic = {};
    formLogic.defaultValueIsLastEntry = defaultValueIsLastEntry;
    formLogic.calculateWHOStage = calculateWHOStage;
    formLogic.calculateOnChange = angular.noop;
    formLogic.calculateWithLastObs = angular.noop;

    var vm = this;

    vm.typeahead = {noResults: false};

    vm.searchBySource = searchBySource;
    vm.onBlurSearchBySource = onBlurSearchBySource;

    // Modifying minimum value constraint for height field to prevent reporting
    // less height than previous height, and old OpenMRS meters values
    if (isHeightFormField(vm.field.id) && vm.previousEncounter) {
      vm.previousEncounter.then(function (previousEncounter) {
        if (previousEncounter) {
          previousEncounter.obs.forEach(function (obs) {
            if (obs.concept.uuid === HEIGHT_CONCEPT_UUID) {
              if(obs.value > 2.5)
                vm.field.constraints.min = obs.value/100;
            }
          });
        }
      });
    }

    activate();

    ////////////////

    function activate() {
      $scope.$watch('$parent.$parent.vm.formWizard.submitted', function (value) {
        vm.showMessages = value;
      });

      $scope.$watch('aForm.' + vm.fieldId + '.$valid', function (value) {
        if (angular.isDefined(value)) {
          $scope.$parent.$parent.vm.formWizard.visitedFields[vm.fieldUuid] = {
            uuid: vm.fieldUuid,
            valid: value
          };
        }
      });

      $scope.$watch('vm.formParts', function (value) {
        if (value && value.form) {
          vm.fieldModel = vm.formParts.form.fields[vm.fieldUuid];

          if (!vm.fieldModel.value) {
            loadField()
          }

          if (vm.fieldModel.field.uuid === whoCurrentStageuuId) {
            loadField();
          }

          if (vm.field.dateController) {
            dateController(vm.field.dateController);
          }
        }
      });
    }

    function dateController(param) {
      $scope.$watch('aForm.' + vm.fieldId + '.$viewValue', function (newVal, oldVal) {
        var dateUtil = Bahmni.Common.Util.DateUtil;

        var startDate = vm.formParts.form.fields[param].value;
        var _date = dateUtil.getDateWithoutTime(startDate);
        var date = dateUtil.getDateWithoutTime(new Date());
        var _dateu = dateUtil.getDateWithoutTime(newVal);

        if (newVal !== oldVal && !_.isUndefined(newVal)) {
          if (_dateu > _date) {
            vm.validDate = false;
          } else {
            vm.fieldModel.value = "";
            vm.validDate = true;

          }
        }
      });
    }

    function isHeightFormField(fieldUuid) {
      return fieldUuid === HEIGHT_FORM_FIELD_UUID_ADULT
        || fieldUuid === HEIGHT_FORM_FIELD_UUID_CHILD;
    }

    function defaultValueIsLastEntry(concept) {
      observationsService.getLastValueForConcept(vm.patient.uuid, concept).then(function (value) {
        vm.fieldModel.value = value;
      });
    }

    function loadField() {
      _.forEach(vm.field.logics, function (param, name) {
        formLogic[name](param);
      });
    }

    function calculateWHOStage(param) {

      var whoStages = vm.fieldModel.field.concept.answers;

      var firstField = 0;
      var lastPart = 4;

      comuteWHOStage(firstField, lastPart, whoStages);
    }

    function comuteWHOStage(firstField, lastPart, whoStages) {

      for (var i = 0; i < lastPart; i++) {

        var part = vm.formLayout.parts[i];
        var model = vm.formParts.form.fields[part.fields[firstField].id];

        angular.forEach(model.field.concept.answers, function (answer) {

          if (angular.isDefined(model.value)) {

            if (angular.isDefined(model.value[answer.uuid])) {

              vm.fieldModel.value = _.find(whoStages, function (stage) {
                return stage.uuid === model.field.concept.uuid;
              });

            }
          }

        });
      }
    }

    function searchBySource(term) {
      return conceptService.searchBySource(term, vm.field.searchBySource)
        .then(function (concepts) {
          return $filter('filter')(concepts, {display: term});
        });
    }

    function onBlurSearchBySource() {
      if (vm.typeahead.noResults) {
        vm.fieldModel.value = null;
        vm.typeahead.noResults = false
      }
    }
  }

})();
