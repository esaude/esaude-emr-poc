(function () {
  'use strict';

  angular
    .module('common.patient')
    .factory('reportService', reportService);

  reportService.$inject = ['$rootScope', '$compile', '$timeout', '$http', '$log', '$q', 'translateFilter'];

  function reportService($rootScope, $compile, $timeout, $http, $log, $q, translateFilter) {

    var PATIENT_ARV_PICKUP_HISTORY_TEMPLATE = "../patient-details/views/patient-arv-pickup-history-report.html";

    var PATIENT_DAILY_HOSPITAL_PROCESS_TEMPLATE = "../patient-details/views/patient-daily-hospital-process-report.html";

    var NUMBER_OF_DISPLACEMENT_LINES = 12;
    var WEEKS_IN_MONTH = 4;
    var MONTHS_IN_YEAR = 12;

    return {
      printPatientDailyHospitalProcess: printPatientDailyHospitalProcess,
      printPatientARVPickupHistory: printPatientARVPickupHistory
    };

    ////////////////

    function localizeAddress(address) {
      return {
        line1: translateFilter('ADDRESS_FORMAT_LINE1', {
          street: address.address1,
          cell: address.address3
        }),
        line2: translateFilter('ADDRESS_FORMAT_LINE2', {
          neighborhood: address.address5,
          locality: address.address6,
          district: address.countyDistrict,
          province: address.stateProvince,
          country: address.country
        })
      };
    }

    /**
     * @param {Object} patient
     */
    function printPatientARVPickupHistory(patient) {
      var vm = {};
      vm.patient = patient;
      vm.patient.address.localized = localizeAddress(vm.patient.address);
      vm.months = moment.monthsShort();
      vm.calendar = new Array(WEEKS_IN_MONTH);

      fillCalendar(vm);

      var emptyFilaDisplacement = getEmptyFilaDisplacement();
      vm.filaDisplacements1 = [];
      vm.filaDisplacements2 = [];

      fillDisplacements(vm);

      loadTemplate(PATIENT_ARV_PICKUP_HISTORY_TEMPLATE)
        .then(compileWith(vm))
        .then(printHTML);
    }

    function fill(array, value) {
      for (var i = 0; i < array.length; i++) {
        array[i] = value;
      }
    }

    function padRight(array, size, padValue) {
      var entriesToAdd = size - array.length;
      if (entriesToAdd > 0) {
        for (var i = 1; i <= entriesToAdd; i++) {
          array.push(padValue);
        }
      }
    }

    function fillDisplacements(vm) {
      var allFilaDisplacements = [];
      vm.patient.dispensations.forEach(function (dispensation) {
        var filaDispensations = generateFilaDispensations(dispensation);
        filaDispensations.forEach(function (filaDispensation) {
          allFilaDisplacements.push(filaDispensation);
        });
      });

      if (allFilaDisplacements.length > NUMBER_OF_DISPLACEMENT_LINES) {
        vm.filaDisplacements1 = allFilaDisplacements.slice(0, NUMBER_OF_DISPLACEMENT_LINES);
        vm.filaDisplacements2 = allFilaDisplacements.slice(NUMBER_OF_DISPLACEMENT_LINES);
        var firstDisplacementOfSecondList = vm.filaDisplacements2[0];
        firstDisplacementOfSecondList.dateRowSpanSize = firstDisplacementOfSecondList.remainingRowSpanSize;
      } else {
        vm.filaDisplacements1 = allFilaDisplacements;
      }
      padRight(vm.filaDisplacements1, NUMBER_OF_DISPLACEMENT_LINES, getEmptyFilaDisplacement());
      padRight(vm.filaDisplacements2, NUMBER_OF_DISPLACEMENT_LINES, getEmptyFilaDisplacement());
    }

    function generateFilaDispensations(dispensation) {
      var filaDispensations = [];
      var dispensationItems = dispensation.dispensationItems;
      if (dispensationItems.length > 0) {
        var rowSpanSize = dispensationItems.length;
        var remainingRowSpanSize = rowSpanSize;
        dispensationItems.forEach(function (dispensationItem) {
          var displacement = {
            dateRowSpanSize: rowSpanSize,
            remainingRowSpanSize: remainingRowSpanSize,
            date: dispensationItem.dispensationItemCreationDate,
            medicine: dispensationItem.drugOrder.drug.display,
            quantity: dispensationItem.quantityDispensed,
            dosage: dispensationItem.drugOrder.dose + ' ' + dispensationItem.drugOrder.doseUnits.display + ' ' + dispensationItem.drugOrder.frequency.display,
            nextDisplacement: dispensationItem.dateOfNextPickUp
          };
          filaDispensations.push(displacement);
          rowSpanSize = 0;
          remainingRowSpanSize--;
        });
      }
      return filaDispensations;
    }

    function getEmptyFilaDisplacement() {
      return {
        dateRowSpanSize: 1,
        remainingRowSpanSize: 1,
        date: "",
        medicine: "",
        quantity: "",
        dosage: "",
        nextDisplacement: ""
      };
    }

    function fillCalendar(vm) {

      vm.calendar[0] = new Array(MONTHS_IN_YEAR);
      vm.calendar[1] = new Array(MONTHS_IN_YEAR);
      vm.calendar[2] = new Array(MONTHS_IN_YEAR);
      vm.calendar[3] = new Array(MONTHS_IN_YEAR);
      fill(vm.calendar[0], "");
      fill(vm.calendar[1], "");
      fill(vm.calendar[2], "");
      fill(vm.calendar[3], "");

      var initialCalendarMonth = vm.patient.startDate.getMonth();
      shiftLeft(vm.months, initialCalendarMonth);

      var dates = [];
      vm.patient.dispensations.forEach(function (dispensation) {
        dispensation.dispensationItems.forEach(function (dispensationItem) {
          dates.unshift(new Date(dispensationItem.prescriptionExpirationDate));
        });
      });

      dates.forEach(function (date) {
        var markIndexes = getMarkIndexesForDate(date, initialCalendarMonth);
        vm.calendar[markIndexes.week][markIndexes.month] = "X";
      });
    }

    function getMarkIndexesForDate(date, initialCalendarMonth) {
      var month = date.getMonth() - initialCalendarMonth;
      if (month < 0) {
        month += MONTHS_IN_YEAR;
      }
      var week = Math.ceil(date.getDate() / 7.0);

      //dias posteriores ao dia 28 serão considerados quarta semana
      if (week > WEEKS_IN_MONTH) {
        week = WEEKS_IN_MONTH;
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
        .then(compileWith({patient: patient}))
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
          $log.error('XHR Failed for loadTemplate: ' + error.data);
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
