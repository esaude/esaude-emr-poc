(function () {
  'use strict';

  /**
   * This module provides a way of moving a patient between module dashboards. It configures a route to capture the
   * patients UUID and a transition hook that redirects to the dashboard state.
   */
  angular
    .module('movepatient', [
      'bahmni.common.appFramework',
      'ngDialog',
      'ui.router'
    ]);
})();
