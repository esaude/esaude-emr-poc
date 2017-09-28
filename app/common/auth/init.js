'use strict';
var Bahmni = Bahmni || {};
Bahmni.Auth = Bahmni.Auth || {};

angular
  .module('authentication', [
    'bahmni.common.config',
    'LocalStorageModule',
    'ngCookies',
    'ui.router'
  ]);
