(function () {
  'use strict';

  angular
    .module('home')
    .component('dashboard', {
      controller: DashboardController,
      controllerAs: 'vm',
      templateUrl: '../home/components/dashboard.html'
    });

  /* @ngInject */
  function DashboardController($filter, $window, applicationService, consultationService, sessionService, notifier) {

    var mLocation = sessionService.getCurrentLocation();

    var vm = this;
    vm.apps = [];

    vm.consultationSummary = {
      labels: [],
      series: [
        $filter('translate')('USER_DASHBOARD_CHECKED_IN'),
        $filter('translate')('USER_DASHBOARD_MARKED_CONSULTATIONS')
      ],
      borderWidth: 5,
      data: [],
      datasetOverride: [
        {
          backgroundColor: '#337ab7',
          borderColor: 'lightgrey',
          borderWidth: 1
        },
        {
          backgroundColor: 'lightgrey',
          borderColor: 'lightgrey',
          borderWidth: 1
        }
      ],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: true,
          position: 'bottom',
          reverse: true
        },
        scales: {
          yAxes: [{
            type: 'linear',
            ticks: {beginAtZero: true, stepSize: 1}
          }],
          xAxes: [{
            stacked: true
          }]
        },
        tooltips: {
          // Show scheduled before checkins
          itemSort: (a, b) => b.datasetIndex - a.datasetIndex
        }
      }
    };

    vm.$onInit = $onInit;
    vm.linkApp = linkApp;
    vm.onMonthlySummaryClick = onMonthlySummaryClick;
    vm.onWeeklySummaryClick = onWeeklySummaryClick;
    vm.scheduledConsultations = scheduledConsultations;
    vm.checkedIn = checkedIn;
    vm.currentPeriod = currentPeriod;

    function $onInit() {
      applicationService.getApps()
        .then(apps => {
          vm.apps = apps;
        })
        .then(loadConsultationCharts);
    }

    function linkApp(app) {
      $window.location.href = app.url;
    }

    function loadConsultationCharts() {
      return consultationService.getWeeklyConsultationSummary(mLocation).then(fillBarChart).catch(handleError);
    }

    function getConsultationsAndCheckedInCount(date, summary) {
      var found = summary.find(s => moment(s.consultationDate).isSame(date));
      if (found) {
        var checkedIn = found.patientConsultations.filter(c => c.checkInOnConsultationDate);
        return [checkedIn.length, found.patientConsultations.length];
      } else {
        return [0, 0];
      }
    }

    function fillBarChart(consultationSummary) {

      var dates = dateRange(consultationSummary.startDate, consultationSummary.endDate);

      vm.consultationSummary.labels = dates.map(d => d.format('D MMM'));

      var data = dates.map(d => getConsultationsAndCheckedInCount(d, consultationSummary.summary));

      vm.consultationSummary.data = _.zip.apply(_, data); //transpose

    }

    function handleError(errorData) {
      var dates = dateRange(errorData.consultationSummary.startDate, errorData.consultationSummary.endDate);

      vm.consultationSummary.labels = dates.map(d => d.format('D MMM'));

      notifier.error($filter('translate')('COMMON_MESSAGE_ERROR_ACTION'));
    }

    /**
     * @param {Date} startDate
     * @param {Date} endDate
     * @returns {Array} dates between startDate end endDate, not including startDate
     */
    function dateRange(startDate, endDate) {
      var diff = endDate.diff(startDate, 'days') + 1;
      var range = new Array(diff).fill(0);
      return range.map((curr, idx) => startDate.clone().add(idx, 'days'));
    }

    function onMonthlySummaryClick() {
      consultationService
        .getMonthlyConsultationSummary(mLocation)
        .then(fillBarChart)
        .catch(handleError);
    }

    function onWeeklySummaryClick() {
      consultationService.getWeeklyConsultationSummary(mLocation).then(fillBarChart).catch(handleError);

    }

    function scheduledConsultations() {
      return _.sum(vm.consultationSummary.data[1]);
    }

    function checkedIn() {
      return _.sum(vm.consultationSummary.data[0]);
    }

    function currentPeriod() {
      return $filter('translate')('USER_DASHBOARD_PERIOD', {
        startDate: vm.consultationSummary.labels[0],
        endDate: vm.consultationSummary.labels[vm.consultationSummary.labels.length - 1]
      });
    }

  }

})();

