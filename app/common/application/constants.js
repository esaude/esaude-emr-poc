(function () {

  'use strict';

  angular
    .module('application')
    .constant('TabManager', TabManager)
    .constant('location', 'emr.location')
    .constant('dateFormat', {
      shortDate: 'dd/MM/yyyy',
      short: "d/M/yyyy H:mm:ss"
    });

  //Helps us validate user navigation along the registration tabs
  function TabManager() {

    var tabManager = this;

    tabManager.addStepDefinition = addStepDefinition;
    tabManager.isStepingForward = isStepingForward;
    tabManager.isJumpingMoreThanOneTab = isJumpingMoreThanOneTab;

    function addStepDefinition(name, index) {
      this[name] = index;
    }

    function isStepingForward(fromState, toState) {
      var fromIndex = this[fromState];
      var toIndex = this[toState];
      return ((toIndex - fromIndex) > 0);
    }

    function isJumpingMoreThanOneTab(fromState, toState) {
      var fromIndex = this[fromState];
      var toIndex = this[toState];
      return Math.abs(toIndex - fromIndex) > 1;
    }

    return tabManager;
  }
})();
