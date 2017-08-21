angular
  .module('vitals',
    [
      'application',
      'bahmni.common.appFramework',
      'bahmni.common.config',
      'bahmni.common.domain',
      'bahmni.common.i18n',
      'bahmni.common.uicontrols.programmanagment',
      'bahmni.common.uiHelper',
      'common.patient',
      'datePicker',
      'frapontillo.bootstrap-switch',
      'LocalStorageModule',
      'ngCookies',
      'ngDialog',
      'ngMessages',
      'ngRoute',
      'pascalprecht.translate',
      'patient.details',
      'poc.common.clinicalservices',
      'serviceform',
      'smart-table',
      'ui.checkbox',
      'ui.router',
    ]
  );
//to be initialized by config inside app.js
//needed in dynamic states
var $stateProviderRef = null;
