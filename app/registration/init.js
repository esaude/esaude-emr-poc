angular.module('registration', ['ngRoute', 'ngCookies', 'ui.router', 'smart-table', 'bahmni.common.uiHelper', 'bahmni.common.config',
                        'bahmni.common.domain', 'bahmni.common.appFramework', 'LocalStorageModule', 'datePicker',
                        'frapontillo.bootstrap-switch', 'bahmni.common.uicontrols.programmanagment', 'serviceform',
                        'ui.checkbox', 'application', 'ngMessages', 'poc.common.clinicalservices', 'common.patient',
                        'pascalprecht.translate', 'bahmni.common.i18n', 'patient.details', 'ui.bootstrap','ui.mask']);
//to be initialized by config inside app.js
//needed in dynamic states
var $stateProviderRef = null;
