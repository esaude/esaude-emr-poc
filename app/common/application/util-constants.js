(function () {

  'use strict';

  angular
    .module('application')
    .constant('TabManager', TabManager);

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
      var stepingForward = (toIndex - fromIndex) > 0;
      return stepingForward;
    }

    function isJumpingMoreThanOneTab(fromState, toState) {
      var fromIndex = this[fromState];
      var toIndex = this[toState];
      var jumpingMoreThanOneTab = Math.abs(toIndex - fromIndex) > 1;
      return jumpingMoreThanOneTab;
    }

    return tabManager;
  }
})();
