'use strict';

angular.module('bahmni.common.i18n')
    .provider('$bahmniTranslate', $bahmniTranslateProvider).
    filter('titleTranslate', ['$translate', $translate => input => {
  if (!input) {
    return input;
  }
  if (input.translationKey) {
    return $translate.instant(input.translationKey);
  }
  if (input.dashboardName) {
    return input.dashboardName;
  }
  if (input.title) {
    return input.title;
  }
  if (input.label) {
    return input.label;
  }
  if (input.display) {
    return input.display;
  }
  return null;
}]);

function $bahmniTranslateProvider($translateProvider){
    this.init = options => {
        var preferredLanguage = window.localStorage["NG_TRANSLATE_LANG_KEY"] || "pt";
        $translateProvider.useLoader('mergeLocaleFilesService', options);
        $translateProvider.useSanitizeValueStrategy('escaped');
        $translateProvider.preferredLanguage(preferredLanguage);
        $translateProvider.useLocalStorage();
    };
    this.$get = [() => $translateProvider];
};

$bahmniTranslateProvider.$inject = ['$translateProvider'];
