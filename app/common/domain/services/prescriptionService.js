(function () {
  'use strict';

  angular
    .module('bahmni.common.domain')
    .factory('prescriptionService', prescriptionService);

  prescriptionService.$inject = ['encounterService', 'conceptService', 'appService', '$http', '$q', '$log'];

  function prescriptionService(encounterService, conceptService, appService, $http, $q, $log) {
    return {
      getPatientNonDispensedPrescriptions: getPatientNonDispensedPrescriptions,
      create: create,
      getPatientPrescriptions: getPatientPrescriptions
    };

    ////////////////

    /**
     * Returns prescriptions not fully dispensed for patient.
     *
     * @param {String} patientUuid
     * @returns {Promise}
     */
    function getPatientNonDispensedPrescriptions(patientUuid) {
      return $http.get(Bahmni.Common.Constants.prescriptionUrl, {

        params: {
          patient: patientUuid,
          v: "full"
        },

        withCredentials: true
      }).then(function (response) {
        return _.map(response.data.results, prescriptionMapper);
      }).catch(function (error) {
        $log.error('XHR Failed for getPatientNonDispensedPrescriptions. ' + error.data);
        return $q.reject(error);
      });
    }

    /**
     * Creates a prescription.
     *
     * @param {Object} prescription Prescription to create.
     * @returns {Promise}
     */
    function create(prescription) {
      return $http.post(Bahmni.Common.Constants.prescriptionUrl, prescription, {
        withCredentials: true,
        headers: {"Accept": "application/json", "Content-Type": "application/json"}
      }).then(function (response) {
        return response.data;
      }).catch(function (error) {
        $log.error('XHR Failed for create. ' + error.data);
        return $q.reject();
      });
    }

    /**
     * Returns prescriptions for patient.
     *
     * @param {Object} patient The patient.
     * @returns {Promise}
     */
    // TODO: There should be only one service that loads patient prescriptions, this and getPatientNonDispensedPrescriptions should be merged.
    function getPatientPrescriptions(patient) {

      var representation = "custom:(uuid,encounterDatetime,orders:(action,drug:(display,uuid),dose,doseUnits:(uuid),frequency:(uuid,display),route:(uuid),duration,durationUnits:(uuid),dosingInstructions),obs:(value:(display),concept:(uuid,display)))";

      var followupEncounters = encounterService.getPatientFollowupEncounters(patient, representation);
      var prescriptionConvSetConcept = conceptService.getPrescriptionConvSetConcept();

      return $q.all([followupEncounters, prescriptionConvSetConcept])
        .then(function (values) {
          return legacyPrescriptionMapper(values[0], values[1]);
        })
        .catch(function (error) {
          $log.error('XHR Failed for getPatientPrescriptions. ' + error.data);
          return $q.reject(error);
        });
    }

    /**
     * Maps pharmacy-api Prescription.
     *
     * @param prescription
     */
    function prescriptionMapper(prescription) {
      prescription.prescriptionDate = new Date(prescription.prescriptionDate);
      return prescription;
    }

    /**
     *
     */
    function legacyPrescriptionMapper(encounters, prescriptionConvSetMembers) {

      if (encounters.length === 0) {
        return []
      }

      var pocMappingPrescriptionDate = "488e6803-c7db-43b2-8911-8d5d2a8472fd";

      var fieldModels = angular.copy(Bahmni.Common.Constants.drugPrescriptionConvSet);

      var drugMapping = appService.getAppDescriptor().getDrugMapping()[0];

      var dateUtil = Bahmni.Common.Util.DateUtil;

      for (var key in fieldModels) {
        var fieldModel = fieldModels[key];
        var members = angular.copy(prescriptionConvSetMembers);
        fieldModel.model = _.find(members, function (element) {
          return element.uuid === fieldModel.uuid;
        });
      }

      var prescription = {};

      //get todays entry
      var lastEncounter = _.maxBy(encounters, "encounterDatetime");
      if (dateUtil.diffInDaysRegardlessOfTime(lastEncounter.encounterDatetime, dateUtil.now()) === 0) {
        prescription.todaysEncounter = lastEncounter;
        prescription.hasEntryToday = true;
        //find pocMappingPrescriptionDate concept
        var markedOnInfo = _.find(lastEncounter.obs, function (o) {
          return o.concept.uuid === pocMappingPrescriptionDate;
        });

        if (!_.isUndefined(markedOnInfo)) prescription.hasServiceToday = true;
      }

      var filteredEncounters = _.filter(encounters, function (e) {
        var foundObs = _.find(e.obs, function (o) {
          return o.concept.uuid === pocMappingPrescriptionDate;
        });
        return angular.isDefined(foundObs);
      });

      //create list of existing encounters with active orders
      prescription.encounterOrders = [];
      _.forEach(filteredEncounters, function (encounter) {

        //avoid encounters with no orders
        if (_.isEmpty(encounter.orders)) {
          return;
        }

        //check if encounter has at least one active order
        //TODO: This should be included in a call to the pharmacy module via rest
        var activeOrder = _.find(encounter.orders, function (order) {
          return order.action === "NEW";
        });

        //avoid terminaded prescriptions
        if (!activeOrder) {
          return;
        }

        //start composing orders
        var prescriptionDateObs = _.find(encounter.obs, function (o) {
          return o.concept.uuid === pocMappingPrescriptionDate;
        });

        var encounterOrder = {
          prescriptionDatetime: prescriptionDateObs.value,
          orders: []
        };

        _.forEach(encounter.orders, function (savedOrder) {
          var order = {};
          order.drug = savedOrder.drug;
          order.doseAmount = savedOrder.dose;
          order.dosingUnits = swapObsToConceptAnswer(savedOrder.doseUnits.uuid, fieldModels.dosingUnits.model.answers);
          order.dosgeFrequency = savedOrder.frequency;
          order.drugRoute = swapObsToConceptAnswer(savedOrder.route.uuid, fieldModels.drugRoute.model.answers);
          order.duration = savedOrder.duration;
          order.durationUnits = swapObsToConceptAnswer(savedOrder.durationUnits.uuid, fieldModels.durationUnits.model.answers);
          order.dosingInstructions = swapObsToConceptAnswer(savedOrder.dosingInstructions, fieldModels.dosingInstructions.model.answers);

          //check if drug is ARV type
          var arvRepr = drugMapping.arvDrugs[savedOrder.drug.uuid];

          if (arvRepr) {
            order.isArv = true;
            //find and swap arv plan
            var arvPlan = _.find(encounter.obs, function (o) {
              return o.concept.uuid === Bahmni.Common.Constants.drugPrescriptionConvSet.artPlan.uuid;
            });
            if (arvPlan) {
              order.arvPlan = swapObsToConceptAnswer(arvPlan.value.uuid,
                fieldModels.artPlan.model.answers);
            }
            //find and swap plan interupted reason
            var interruptedReason = _.find(encounter.obs, function (o) {
              return o.concept.uuid === Bahmni.Common.Constants.drugPrescriptionConvSet.interruptedReason.uuid;
            });
            if (interruptedReason) {
              order.interruptedReason = swapObsToConceptAnswer(interruptedReason.value.uuid,
                fieldModels.interruptedReason.model.answers);
              order.isPlanInterrupted = true;
            }
            //find and swap plan change reason
            var changeReason = _.find(encounter.obs, function (o) {
              return o.concept.uuid === Bahmni.Common.Constants.drugPrescriptionConvSet.changeReason.uuid;
            });
            if (changeReason) {
              order.changeReason = swapObsToConceptAnswer(changeReason.value.uuid,
                fieldModels.changeReason.model.answers);
            }
          }

          encounterOrder.orders.push(order);

        });

        prescription.encounterOrders.push(encounterOrder);

      });

      return prescription;

    }

    function swapObsToConceptAnswer(obs, conceptAnswers) {
      return _.find(conceptAnswers, function (answer) {
        return obs === answer.uuid;
      });
    }

  }

})();
