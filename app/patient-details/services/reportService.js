(function () {
  'use strict';

  angular
    .module('patient.details')
    .factory('reportService', reportService);

  reportService.$inject = ['$rootScope', '$compile', '$timeout', '$http', '$log', '$q', 'encounterService'];

  function reportService($rootScope, $compile, $timeout, $http, $log, $q, encounterService) {

    var PATIENT_ARV_PICKUP_HISTORY_TEMPLATE = "../patient-details/views/patient-arv-pickup-history-report.html";

    var PATIENT_DAILY_HOSPITAL_PROCESS_TEMPLATE = "../patient-details/views/patient-daily-hospital-process-report.html";

    return {
      printPatientDailyHospitalProcess: printPatientDailyHospitalProcess,
      printPatientARVPickupHistory: printPatientARVPickupHistory
    };

    ////////////////

    /**
     * @param {Object} patient
     */
    function printPatientARVPickupHistory(patient) {
      encounterService.getPatientPharmacyEncounters(patient.uuid)
        .then(function (encounters) {
          patient.pickups = encounters;
          return loadTemplate(PATIENT_ARV_PICKUP_HISTORY_TEMPLATE)
        })
        .then(compileWith(patient))
        .then(printHTML);
    }

    /**
     * @param {Object} patient
     */
    function printPatientDailyHospitalProcess(patient) {
      patient.barcodeOptions = {
        width: 2,
        height: 40,
        quite: 10,
        displayValue: true,
        font: "monospace",
        textAlign: "center",
        fontSize: 10,
        backgroundColor: "",
        lineColor: "#000"
      };

      loadTemplate(PATIENT_DAILY_HOSPITAL_PROCESS_TEMPLATE)
        .then(compileWith(patient))
        .then(printHTML);
    }

    /**
     * Generates a hidden iframe containing the html then prints and removes the iframe.
     *
     * @param {String} html
     */
    function printHTML(html) {
      var hiddenFrame = angular.element('<iframe>').css('display', 'none').appendTo('body')[0];

      hiddenFrame.contentWindow.printAndRemove = function () {
        hiddenFrame.contentWindow.print();
        angular.element(hiddenFrame).remove();
      };

      var htmlContent = "<!doctype html>" +
        "<html>" +
          '<body onload="printAndRemove();">' +
            html +
          '</body>' +
        "</html>";

      var doc = hiddenFrame.contentWindow.document.open("text/html", "replace");
      doc.write(htmlContent);
      doc.close();
    }

    /**
     * @param {String} templateUrl
     * @returns {Promise}
     */
    function loadTemplate(templateUrl) {
      return $http.get(templateUrl)
        .then(function (response) {
          return response.data;
        })
        .catch(function (error) {
          $log.error('XHR Failed for loadTemplate. ' + error.data);
          return $q.reject(error);
        });
    }

    /**
     * @param {Object} data
     * @returns {Function} Function returning a promise that will be resolved when the template finishes compiling.
     */
    function compileWith(data) {
      return function (template) {
        var printScope = angular.extend($rootScope.$new(false), data);
        var element = $compile(angular.element('<div>' + template + '</div>'))(printScope);

        return $timeout(function () {
          printScope.$destroy();
          return element.html();
        }, 0, false);
      }
    }
  }

})();
