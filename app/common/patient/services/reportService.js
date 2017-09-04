(function () {
  'use strict';

  angular
    .module('common.patient')
    .factory('reportService', reportService);

  reportService.$inject = ['$rootScope', '$compile', '$timeout', '$http', '$log', '$q'];

  function reportService($rootScope, $compile, $timeout, $http, $log, $q) {

    var PATIENT_ARV_PICKUP_HISTORY_TEMPLATE = "../patient-details/views/patient-arv-pickup-history-report.html";

    var PATIENT_DAILY_HOSPITAL_PROCESS_TEMPLATE = "../patient-details/views/patient-daily-hospital-process-report.html";

    var NUMBER_OF_DISPLACEMENT_LINES = 8;
    var WEEKS_IN_MONTH = 4;
    var MONTHS_IN_YEAR = 12;

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
      vm.months = moment.monthsShort();
      vm.calendar = Array(WEEKS_IN_MONTH);

      fillCalendar(vm);

      var emptyFilaDisplacement = getEmptyFilaDisplacement();
      vm.filaDisplacements1 = Array(NUMBER_OF_DISPLACEMENT_LINES);
      vm.filaDisplacements2 = Array(NUMBER_OF_DISPLACEMENT_LINES);
      fill(vm.filaDisplacements1, emptyFilaDisplacement);
      fill(vm.filaDisplacements2, emptyFilaDisplacement);

      fillDisplacements(vm);

      vm.filaDisplacements1[0].dateRowSpanSize = 3;
      vm.filaDisplacements1[1].dateRowSpanSize = 0;
      vm.filaDisplacements1[2].dateRowSpanSize = 0;

      loadTemplate(PATIENT_ARV_PICKUP_HISTORY_TEMPLATE)
        .then(compileWith(vm))
        .then(printHTML);
    }

    function fill(array, value) {
      for (var i = 0; i < array.length; i++) {
        array[i] = value;
      }
    }

    function fillDisplacements(vm) {
      var pickups = vm.patient.pickups;
      var allFilaDisplacements = [];
      pickups.forEach(function (pickup) {
        var filaDisplacement = generateFilaDisplacement(pickup);
        allFilaDisplacements.unshift(filaDisplacement);
      });

      allFilaDisplacements = allFilaDisplacements.reverse();
      allFilaDisplacements.forEach(function (displacement) {
        vm.filaDisplacements1.pop();
        vm.filaDisplacements1.unshift(displacement);
      });
    }

    function generateFilaDisplacement(pickup) {
      var filaDisplacement = getEmptyFilaDisplacement();
      filaDisplacement.date = pickup.encounterDatetime;
      filaDisplacement.displacements[0].medicine = pickup.regimen;
      filaDisplacement.displacements[0].quantity = pickup.quantity;
      filaDisplacement.displacements[0].dosage = pickup.posology;
      filaDisplacement.displacements[0].nextDisplacement = pickup.nextPickup;
      return filaDisplacement;
    }

    function getEmptyFilaDisplacement() {
      return {
        dateRowSpanSize: 1,
        numberOfDisplacements: 1,
        date: "",
        displacements: [{
          medicine: "",
          quantity: "",
          dosage: "",
          nextDisplacement: ""
        }]
      };
    }

    function fillCalendar(vm) {

      vm.calendar[0] = Array(MONTHS_IN_YEAR);
      vm.calendar[1] = Array(MONTHS_IN_YEAR);
      vm.calendar[2] = Array(MONTHS_IN_YEAR);
      vm.calendar[3] = Array(MONTHS_IN_YEAR);
      fill(vm.calendar[0], "");
      fill(vm.calendar[1], "");
      fill(vm.calendar[2], "");
      fill(vm.calendar[3], "");

      var firstPickup = vm.patient.pickups[0];
      var monthOfFirstPickup = firstPickup.encounterDatetime.getMonth();
      shiftLeft(vm.months, monthOfFirstPickup);

      var dates = _.map(vm.patient.prescriptions, 'prescriptionDate');

      dates.forEach(function (date) {
        var markIndexes = getMarkIndexesForDate(date, monthOfFirstPickup);
        vm.calendar[markIndexes.week][markIndexes.month] = "X";
      });
    }

    function getMarkIndexesForDate(date, monthOfFirstPickup) {
      var month = date.getMonth() - monthOfFirstPickup;
      if (month < 0) {
        month += MONTHS_IN_YEAR;
      }
      var week = Math.ceil(date.getDate() / 7.0);

      //dias posteriores ao dia 28 serão considerados quarta semana
      if (week > 4) {
        week = 4;
      }

      //para compatibilizar com a nossa estrura de array onde os indices da semana são entre 0 e 3
      week -= 1;

      return { week: week, month: month };
    }

    function shiftLeft(array, numberOfTimes) {
      for (var i = 1; i <= numberOfTimes; i++) {
        var elementToShift = array.shift();
        array.push(elementToShift);
      }
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
