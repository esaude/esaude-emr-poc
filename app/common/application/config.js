(function () {
  'use strict';

  angular
    .module('application')
    .config(applicationModuleConfig);

  applicationModuleConfig.$inject = ['$provide', '$breadcrumbProvider', 'uibDatepickerConfig', 'uibDatepickerPopupConfig',
    'dateFormat'];

  /* @ngInject */
  function applicationModuleConfig($provide, $breadcrumbProvider, uibDatepickerConfig, uibDatepickerPopupConfig,
                                   dateFormat) {
    $provide.decorator('applicationService', applicationServiceAuthorizationDecorator);


    // Breadcrumb config
    $breadcrumbProvider.setOptions({
      templateUrl: '/common/application/views/breadcrumb.html'
    });

    // Datepicker config
    uibDatepickerConfig.datepickerMode = 'month';
    uibDatepickerConfig.showWeeks = false;
    uibDatepickerConfig.startingDay = 1;
    uibDatepickerPopupConfig.datepickerPopup = dateFormat.shortDate;

    $provide.decorator('dateFilter', dateFilterDecorator);
  }

  applicationServiceAuthorizationDecorator.$inject = ['$delegate', 'authorizationService', '$log'];

  /* @ngInject */
  function applicationServiceAuthorizationDecorator($delegate, authorizationService, $log) {

    $log.info('applicationServiceAuthorizationDecorator: decorating applicationService with authorization.');

    var getApps = $delegate.getApps;

    function getAuthorizedApps() {
      return getApps().then(function (applications) {
        return authorizationService.authorizeApps(applications);
      });
    }

    $delegate.getApps = getAuthorizedApps;
    return $delegate;
  }

  dateFilterDecorator.$inject = ['$delegate', 'dateFormat'];

  function dateFilterDecorator($delegate, dateFormat) {

    var originalFilter = $delegate;

    function decoratedDateFilter(date, format, timezone) {
      if (!format || format === 'shortDate') {
        format = dateFormat.shortDate;
      } else if (format === 'short') {
        format = dateFormat.short;
      }
      return originalFilter(date, format, timezone);
    }

    return decoratedDateFilter;
  }


})();
