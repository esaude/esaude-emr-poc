'use strict';
var Bahmni = Bahmni || {};
Bahmni.Auth = Bahmni.Auth || {};

angular
  .module('authentication', [
    'bahmni.common.domain',
    'LocalStorageModule',
    'ngCookies',
    'pascalprecht.translate',
    'ui.router'
  ]);
