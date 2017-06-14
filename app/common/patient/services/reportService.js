(function () {
  'use strict';

  angular
    .module('common.patient')
    .factory('reportService', reportService);

  reportService.$inject = ['$rootScope', '$compile', '$timeout', '$http', '$log', '$q'];

  function reportService($rootScope, $compile, $timeout, $http, $log, $q) {

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
      var vm = {};
      vm.patient = patient;
      vm.calendar = [[]];

      // Builds week of month x month calendar
      var WEEKS_IN_MONTH = 4;
      var months = moment.monthsShort();
      var dates = _.map(patient.prescriptions, 'prescriptionDate');
      for (var i = 0; i < WEEKS_IN_MONTH; i++) {
        vm.calendar[i] = [];
        for (var j = 0; j < months.length; j++) {
          var found = false;
          for (var d = 0; d < dates.length; d++) {
            if (dates[d].getMonth() === j
                  && Math.min(Math.floor(dates[d].getDate() / 7), 3) === i)
              found = true;
          }
          vm.calendar[i][j] = found ? "X" : "";
        }
      }
      vm.calendar.unshift(months);

      loadTemplate(PATIENT_ARV_PICKUP_HISTORY_TEMPLATE)
        .then(compileWith(vm))
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
      var hiddenFrame = angular.element('<iframe>')
        .css('width', '0')
        .css('height', '0')
        .appendTo('body')[0];

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
