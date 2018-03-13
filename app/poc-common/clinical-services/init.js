(function () {
  'use strict';

  angular
    .module('poc.common.clinicalservices', [
      'authentication',
      'bahmni.common.domain',
      'poc.common.clinicalservices.formdisplay',
      'poc.common.clinicalservices.serviceform',
      'ui.router',
      'bahmni.common.uiHelper'
    ]);

})();
