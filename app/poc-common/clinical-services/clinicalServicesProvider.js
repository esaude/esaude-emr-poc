(function () {
  'use strict';

  angular.module('poc.common.clinicalservices.formdisplay')
    .provider('clinicalServicesService', clinicalServicesProvider);

  clinicalServicesProvider.$inject = ['$stateProvider'];

  function clinicalServicesProvider($stateProvider) {

    this.$get = ClinicalServiceForms;

    ClinicalServiceForms.$inject = ['$http', '$log', '$q', '$state', 'clinicalServicesFormMapper', 'encounterService',
      'visitService'];

    // TODO: force this service to be initialized before calling other methods.
    /* @ngInject */
    function ClinicalServiceForms($http, $log, $q, $state, clinicalServicesFormMapper, encounterService, visitService) {

      var dateUtil = Bahmni.Common.Util.DateUtil;

      var _currentModule = '';
      var _clinicalServices = [];
      var formLayouts = {};

      var service = {
        init: init,
        getFormData: getFormData,
        getFormLayouts: getFormLayouts,
        getClinicalServiceWithEncountersForPatient: getClinicalServicesWithEncountersForPatient,
        loadClinicalServices: loadClinicalServices
      };

      return service;

      ///////////////

      /**
       * Loads clinical services and related form layout then registers the required routes for each form and form parts.
       *
       * NOTE: Don't forget to handle returned promise failure if not using in route resolve.
       *
       * SEE: clinicalServices.json and formLayout.json
       *
       * @param moduleName Name of the module for which clinical services should be loaded.
       */
      function init(moduleName) {

        if (moduleName === '') {
          return $q.reject('No current module set.');
        }

        _currentModule = moduleName;

        return $q.all([service.loadClinicalServices(), loadFormLayouts()]).then(function (result) {
          _clinicalServices = result[0];
          formLayouts = result[1];
          registerRoutes($state, _clinicalServices, formLayouts);
          return service;
        });
      }

      function getFormByService(clinicalService) {

        var cs = findClinicalService(clinicalService);

        if (!cs) {
          return $q.reject();
        }

        return getForm(cs.formId);
      }

      function findClinicalService(clinicalService) {
        var found = _clinicalServices.filter(function (cs) {
          return cs.id === clinicalService.id;
        })[0];

        if (!found) {
          $log.error('Clinical found ' + found + ' not found for module ' + _currentModule + '.');
        }

        return found;
      }

      /**
       * Loads form data with fields, concept answers and encounters for related clinical service.
       *
       * @param patient
       * @param clinicalService
       * @param [encounter] Encounter information to use for filling form data, if not defined last encounter for
       *                    clinicalService param will be used.
       *
       * @returns {Promise}
       */
      function getFormData(patient, clinicalService, encounter) {

        var cs = findClinicalService(clinicalService);

        if (!cs) {
          return $q.reject();
        }

        var representation = "custom:(description,display,encounterType,uuid,formFields:(uuid,required," +
          "field:(uuid,selectMultiple,fieldType:(display),concept:(answers,set,setMembers,uuid,datatype:(display)))))";

        return getClinicalServicesWithEncountersForPatient(patient, cs).then(function (service) {
          return getForm(service.formId, representation).then(function (form) {
            if (service.hasEntryToday) {
              encounter = service.lastEncounterForService;
            }
            var formPayload = clinicalServicesFormMapper.mapFromOpenMRSForm(form, encounter);
            formPayload.service = service;
            return formPayload;
          });
        });
      }

      /**
       * @param {Object} [clinicalService]
       * @returns {Object| Array}
       */
      function getFormLayouts(clinicalService) {

        if (!clinicalService) {
          return formLayouts;
        }

        return formLayouts.filter(function (f) {
          return f.id === clinicalService.id;
        })[0];
      }

      /**
       * Loads clinicalServices for current module.
       *
       * NOTE: As this method will be decorated for authorization, inside clinicalServicesService always refer to it using
       * service.loadClinicalServices.
       *
       * @returns {Promise}
       */
      function loadClinicalServices() {
        return $http.get("/poc_config/openmrs/apps/" + _currentModule + "/clinicalServices.json")
          .then(function (response) {
            return response.data;
          })
          .catch(function (error) {
            $log.error('XHR Failed for loadClinicalServices: ' + error.data);
            return $q.reject(error);
          });
      }

      function loadFormLayouts() {
        return $http.get('/poc_config/openmrs/apps/common/formLayout.json')
          .then(function (response) {
            return response.data;
          })
          .catch(function (error) {
            $log.error('XHR Failed for loadFormLayouts. ' + error.data);
            return $q.reject(error);
          });
      }

      function getForm(uuid, representation) {
        var config = {
          withCredentials: true
        };

        if (representation) {
          config.params = {
            v: representation
          }
        }

        return $http.get("/openmrs/ws/rest/v1/form" + "/" + uuid, config).then(function (response) {
          return response.data;
        });
      }

      /**
       * Returns clinical services with respective encounters.
       *
       * @param {Object} patient
       * @param {Object} [service] The clinical service, if not specified all services will be returned.
       * @returns {Promise}
       */
      function getClinicalServicesWithEncountersForPatient(patient, service) {

        if (service) {
          return getCsWithEncountersForPatient(patient, service);
        }

        var getAll = _clinicalServices.map(function (cs) {
          return getCsWithEncountersForPatient(patient, cs);
        });

        return $q.all(getAll)
          .catch(function (error) {
            $log.error('XHR Failed for getClinicalServicesWithEncountersForPatient: ' + error.data.error.message);
            return $q.reject(error);
          });
      }

      function getCsWithEncountersForPatient(patient, service) {

        var service = angular.copy(service);

        var getTodaysVisit = visitService.getTodaysVisit(patient.uuid);

        return $q.all([getTodaysVisit, getFormByService(service)])
          .then(function (result) {
            var todayVisit = result[0];
            var form = result[1];

            // TODO: use 'getEncounters.then' after getEncountersForEncounterType is properly refactored to handle xhr failures
            return encounterService.getEncountersForEncounterType(patient.uuid, form.encounterType.uuid)
              .then(function (response) {
                var nonVoidedEncounters = encounterService.filterRetiredEncoounters(response.data.results);
                var sortedEncounters = _.sortBy(nonVoidedEncounters, function (encounter) {
                  return moment(encounter.encounterDatetime).toDate();
                }).reverse();

              if (service.markedOn) {
                service.encountersForService = _.filter(sortedEncounters, function (e) {
                  var foundObs = _.find(e.obs, function (o) {
                    return o.concept.uuid === service.markedOn;
                  });
                  return angular.isDefined(foundObs);
                });
              } else {
                service.encountersForService = sortedEncounters;
              }
              service.lastEncounterForService = sortedEncounters[0];
              service.lastEncounterForServiceMarked = service.encountersForService[0];

              if (service.lastEncounterForServiceMarked) {
                if (service.markedOn) {
                  service.lastEncounterForServiceDate = _.find(service.lastEncounterForServiceMarked.obs, function (o) {
                    return o.concept.uuid === service.markedOn;
                  }).value;
                } else {
                  service.lastEncounterForServiceDate = service.lastEncounterForServiceMarked.encounterDatetime;
                }
              }

              service.hasEntryToday = false;
              if (todayVisit && service.lastEncounterForService) {
                service.hasEntryToday = (dateUtil.diffInDaysRegardlessOfTime(todayVisit.startDatetime,
                  service.lastEncounterForService.encounterDatetime) === 0);
              }

              service.list = false;

              return service;
            });
          });
      }
    }

    function registerRoutes($state, clinicalServices, formLayouts) {
      clinicalServices.forEach(function (service) {

        var formLayout = _.find(formLayouts, function (layout) {
          return service.id === layout.id;
        });

        //create main state
        if (!$state.get(formLayout.sufix)) {
          var state = {
            url: service.url + "/:serviceId/:patientUuid",
            views: {},
            resolve: {
              initialization: 'initialization'
            },
            ncyBreadcrumb: {
              skip: true
            },
            params: {
              encounter: null, // used when editing or updating existing encounter for clinical service
              returnState: null
            }
          };
          state.views["layout"] = {
            templateUrl: '../common/application/views/layout.html',
            controller: 'FormController'
          };
          state.views["content@" + formLayout.sufix] = {
            templateUrl: '../poc-common/clinical-services/service-form/views/form-add.html'
          };
          $stateProvider.state(formLayout.sufix, state);
        }

        //create inner states
        formLayout.parts.forEach(function (part) {
          if (!$state.get(formLayout.sufix + part.sref)) {
            var innerState = {
              url: part.sref.replace('.', '/'),
              templateUrl: '../poc-common/clinical-services/form-display/views/form-part-input-template.html',
              resolve: {
                initialization: 'initialization'
              },
              ncyBreadcrumb: {
                skip: true
              }
            };
            $stateProvider.state(formLayout.sufix + part.sref, innerState);
          }
        });

        //confirm inner state
        if (!$state.get(formLayout.sufix + ".confirm")) {
          var confirmState = {
            url: '/confirm',
            templateUrl: '../poc-common/clinical-services/form-display/views/form-confirm-template.html',
            resolve: {
              initialization: 'initialization'
            },
            ncyBreadcrumb: {
              skip: true
            }
          };
          $stateProvider.state(formLayout.sufix + ".confirm", confirmState);
        }

        //create display state
        if (!$state.get(formLayout.sufix + "_display")) {
          var displayState = {
            url: service.url + "/:serviceId/:patientUuid/display",
            views: {},
            resolve: {
              initialization: 'initialization'
            },
            ncyBreadcrumb: {
              skip: true
            },
            params: {
              encounter: null,
              returnState: null
            }
          };
          displayState.views["layout"] = {
            templateUrl: '../common/application/views/layout.html',
            controller: 'FormPrintController',
            controllerAs: 'vm'
          };
          displayState.views["content@" + formLayout.sufix + "_display"] = {
            templateUrl: '../poc-common/clinical-services/service-form/views/form-display.html'
          };
          $stateProvider.state(formLayout.sufix + "_display", displayState);
        }

      });
    }
  }

})();
