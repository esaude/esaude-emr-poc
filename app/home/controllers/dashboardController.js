(function () {
  'use strict';

  angular
    .module('home')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$filter', '$rootScope', '$window', 'applicationService', 'configurations',
    'consultationService', 'localStorageService', 'location', 'locationService', 'spinner'];

  /* @ngInject */
  function DashboardController($filter, $rootScope, $window, applicationService, configurations,
                               consultationService, localStorageService, locationConstant, locationService,
                               spinner) {

    var mLocation = {};

    var vm = this;
    vm.apps = [];

    vm.consultationSummary = {
      labels: [],
      series: [
        $filter('translate')('USER_DASHBOARD_MARKED_CONSULTATIONS'),
        $filter('translate')('USER_DASHBOARD_CHECKED_IN')
      ],
      borderWidth: 5,
      data: [],
      datasetOverride: [
        {
          backgroundColor: 'lightgrey',
          borderColor: 'lightgrey',
          borderWidth: 1,
          pointBackgroundColor: 'lightgrey',
          pointHoverBackgroundColor: 'lightgrey'
        },
        {
          backgroundColor: '#337ab7',
          borderColor: 'lightgrey',
          borderWidth: 1,
          pointBackgroundColor: '#337ab7',
          pointHoverBackgroundColor: '#337ab7'
        }
      ],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: true,
          position: 'bottom'
        },
        scales: {
          yAxes: [{
            type: 'linear',
            ticks: {beginAtZero: true, stepSize: 1}
          }],
          xAxes: [{
            stacked: true
          }]
        }
      }
    };

    vm.linkApp = linkApp;
    vm.onMonthlySummaryClick = onMonthlySummaryClick;
    vm.onWeeklySummaryClick = onWeeklySummaryClick;
    vm.scheduledConsultations = scheduledConsultations;
    vm.checkedIn = checkedIn;
    vm.currentPeriod = currentPeriod;

    activate();

    ////////////////

    function activate() {
      var load = applicationService.getApps().then(function (apps) {
        vm.apps = apps;
      })
        .then(loadDefaultLocation)
        .then(loadConsultationCharts);

      spinner.forPromise(load);
    }

    function linkApp(url) {
      $window.location.href = url;
    }

    function loadDefaultLocation() {
      var configNames = ['defaultLocation'];
      return configurations.load(configNames).then(function () {
        var defaultLocation = configurations.defaultLocation().value;
        if (defaultLocation !== null) {
          return locationService.get(defaultLocation).then(function (data) {
            var location = data.data.results[0];
            if (location) {
              localStorageService.cookie.remove(locationConstant);
              mLocation = {name: location.display, uuid: location.uuid};
              localStorageService.cookie.set(locationConstant, mLocation, 7);
            } else {
              $rootScope.$broadcast('event:auth-loginRequired', 'LOGIN_LABEL_LOGIN_ERROR_INVALID_DEFAULT_LOCATION');
            }
          });
        } else {
          $rootScope.$broadcast('event:auth-loginRequired', 'LOGIN_LABEL_LOGIN_ERROR_NO_DEFAULT_LOCATION');
        }
      });
    }

    function loadConsultationCharts() {
      return consultationService.getWeeklyConsultationSummary(mLocation).then(fillBarChart);
    }

    function getConsultationsAndCheckedInCount(date, summary) {
      var found = summary.find(function (s) {
        return new Date(s.consultationDate).getTime() === date.getTime();
      });
      if (found) {
        var checkedIn = found.patientConsultations.filter(function (c) {
          return c.checkInOnConsultationDate;
        }).length;
        return [found.patientConsultations.length, checkedIn];
      } else {
        return [0, 0];
      }
    }

    function fillBarChart(consultationSummary) {

      var dates = dateRange(consultationSummary.startDate, consultationSummary.endDate);

      vm.consultationSummary.labels = dates.map(function (d) {
        return $filter('date')(d, 'd MMM');
      });

      var data = dates.map(function (d) {
        return getConsultationsAndCheckedInCount(d, consultationSummary.summary);
      });

      vm.consultationSummary.data = _.zip.apply(_, data); //transpose

    }

    /**
     * @param {Date} startDate
     * @param {Date} endDate
     * @returns {Array} dates between startDate end endDate, not including startDate
     */
    function dateRange(startDate, endDate) {
      var diff = moment(endDate).diff(startDate, 'days');
      var range = new Array(diff).fill(0);
      return range.map(function (curr, idx) {
        var newDate = new Date(startDate);
        newDate.setDate(startDate.getDate() + idx + 1);
        return newDate;
      });
    }

    function onMonthlySummaryClick() {
      consultationService.getMonthlyConsultationSummary(mLocation).then(fillBarChart);
    }

    function onWeeklySummaryClick() {
      consultationService.getWeeklyConsultationSummary(mLocation).then(fillBarChart);
    }

    function scheduledConsultations() {
      return vm.consultationSummary.data[0] ? sum(vm.consultationSummary.data[0]) : 0;
    }

    function checkedIn() {
      return vm.consultationSummary.data[1] ? sum(vm.consultationSummary.data[1]) : 0;
    }

    function sum(array) {
      return array.reduce(function (acc, curr) {
        return acc + curr;
      });
    }

    function currentPeriod() {
      return $filter('translate')('USER_DASHBOARD_PERIOD', {
        startDate: vm.consultationSummary.labels[0],
        endDate: vm.consultationSummary.labels[vm.consultationSummary.labels.length - 1]
      });
    }

  }

})();

