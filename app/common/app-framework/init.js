var Bahmni = Bahmni || {};
Bahmni.Common = Bahmni.Common || {};
Bahmni.Common.AppFramework = Bahmni.Common.AppFramework || {};

angular
  .module('bahmni.common.appFramework', [
    'authentication',
    'angular-loading-bar',
    'bahmni.common.uiHelper'
  ]);
