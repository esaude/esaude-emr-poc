(function () {
  'use strict';

  angular
    .module('clinic')
    .controller('PatientChartController', PatientChartController);

  PatientChartController.$inject = ['$filter', '$stateParams', 'encounterService', 'observationsService',
    'patientService', 'spinner'];

  /* @ngInject */
  function PatientChartController($filter, $stateParams, encounterService, observationsService, patientService, spinner) {

    var chartColors = ['#F44336', '#283593', '#43A047', '#FB8C00', '#46BFBD', '#FDB45C'];
    var chartOptions = {
      legend: {display: true},
      elements: {
        line: {tension: 0.01, spanGaps: true, bezierCurve: true, fill: false},
        point: {radius: 5}
      },
      scales: {
        yAxes: [
          {
            id: 'y-axis-1',
            type: 'linear',
            display: true,
            position: 'left',
            ticks: {max: 80, min: 0, stepSize: 10}
          },
          {
            id: 'serieA',
            type: 'linear',
            display: true,
            position: 'right',
            ticks: {stepSize: 10, min: 40, max: 110}
          }]
      },
      pointDotRadius: 10
    };
    var currentPatient = {};
    var patientUuid = $stateParams.patientUuid;

    var vm = this;
    vm.charts = {
      bmi: {
        colors: chartColors,
        data: [],
        labels: [],
        options: chartOptions,
        series: []
      },
      CD4labResults: {
        colors: chartColors,
        data: [],
        labels: [],
        options: {
          legend: {display: true},
          elements: {
            line: {tension: 0.01, spanGaps: true, bezierCurve: true, fill: false},
            point: {radius: 5}
          },
          scales: {
            yAxes: [
              {
                id: 'y-axis-1',
                type: 'linear',
                display: true,
                position: 'left',
                ticks: {max: 1500, min: 0, stepSize: 100}
              },
              {
                id: 'serieA',
                type: 'linear',
                display: true,
                position: 'right',
                ticks: {stepSize: 10, min: 40, max: 110}
              }]
          },
          pointDotRadius: 10
        },
        series: []
      },
      labResults: {
        colors: chartColors,
        data: [],
        labels: [],
        options: chartOptions,
        series: []
      }
    };

    activate();

    ////////////////

    function activate() {
      var load = getPatient(patientUuid)
        .then(function (patient) {
          currentPatient = patient;
        })
        .then(initLabChart)
        .then(initCD4LabChart);

      spinner.forPromise(load);
    }

    //TODO: Show calcaculated IMC on graph line
    function initImc() {
      var concepts = [
        "e1e2e826-1d5f-11e0-b929-000c29ad1d07",
        "e1e2e934-1d5f-11e0-b929-000c29ad1d07",
        "e1da52ba-1d5f-11e0-b929-000c29ad1d07"
      ];
      var series = [
        $filter('translate')('CLINIC_PATIENT_WEIGHT'),
        $filter('translate')('CLINIC_PATIENT_HEIGHT'),
        $filter('translate')('CLINIC_PATIENT_BMI')
      ];
      var chart = vm.charts.bmi;

      var adultFollowupEncounterUuid = "e278f956-1d5f-11e0-b929-000c29ad1d07";//TODO: use encounterService.getPatientFollowupEncounters
      var childFollowupEncounterUuid = "e278fce4-1d5f-11e0-b929-000c29ad1d07";//TODO: use encounterService.getPatientFollowupEncounters

      //TODO: Fix, show different graphs for adult and child

      var encounterTypeUuid = (currentPatient.age.years >= 15) ? adultFollowupEncounterUuid : childFollowupEncounterUuid;

      return encounterService.getEncountersForEncounterType(patientUuid, encounterTypeUuid).success(function (data) {
        filterObs(data, concepts, series, chart);
      });
    }

    function initCD4LabChart() {
      var labEncounterUuid = "e2790f68-1d5f-11e0-b929-000c29ad1d07";
      var concepts = [
        "e1e68f26-1d5f-11e0-b929-000c29ad1d07",
        "e1d48fba-1d5f-11e0-b929-000c29ad1d07"
      ];
      var series = [
        $filter('translate')('CLINIC_PATIENT_CD4_COUNT'),
        $filter('translate')('CLINIC_PATIENT_CD4_PERCENT')
      ];
      var chart = vm.charts.CD4labResults;

      encounterService.getEncountersForEncounterType(patientUuid, labEncounterUuid).success(function (data) {
        filterObs(data, concepts, series, chart);
      });
    }

    function initLabChart() {
      var labEncounterUuid = "e2790f68-1d5f-11e0-b929-000c29ad1d07";
      var concepts = [
        "e1cdbe88-1d5f-11e0-b929-000c29ad1d07",
        "e1d6247e-1d5f-11e0-b929-000c29ad1d07"
      ];
      var series = [
        $filter('translate')('CLINIC_PATIENT_HGB_COUNT'),
        $filter('translate')('CLINIC_PATIENT_HIV_VIRAL_LOAD')
      ];
      var chart = vm.charts.labResults;

      return encounterService.getEncountersForEncounterType(patientUuid, labEncounterUuid).success(function (data) {
        filterObs(data, concepts, series, chart);
      });
    }

    function filterObs(data, concepts, series, chart) {

      var nonRetired = encounterService.filterRetiredEncoounters(data.results);

      var sliced = _.slice(nonRetired, 0, 9);

      _.forEach(sliced, function (encounter) {
        encounter.obs = observationsService.filterByList(encounter.obs, concepts);
      });
      var filtered = _.filter(sliced, function (encounter) {
        return !_.isEmpty(encounter.obs);
      });
      createChartData(filtered, concepts, series, chart);
    }

    function createChartData(encounters, concepts, series, chart) {
      var data = [];

      _.forEach(encounters, function (encounter) {
        chart.labels.push($filter('date')(encounter.encounterDatetime, "MMM d, y"));
        _.forEach(concepts, function (concept, key) {
          var found = _.find(encounter.obs, function (obs) {
            return obs.concept.uuid === concept;
          });
          if (!data[key]) data[key] = [];
          data[key].push((found) ? found.value : null);
        });
      });

      chart.series = series;
      chart.data = data;
    }

    function getPatient(patientUUID) {
      return patientService
        .getPatient(patientUUID)
        .catch(function () {
          notifier.error($filter('translate')('COMMON_ERROR'));
        });
    }
  }

})();
