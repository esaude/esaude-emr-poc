(function () {
  'use strict';

  //Helps us validate user navigation along the registration tabs
  class TabManager {

    constructor() {
      this.steps = [];
      this.current = -1;
    }

    addStepDefinition(name) {
      this.steps.push(name);
      if (this.current === -1) {
        this.current++;
      }
    }

    stepForward() {
      if (this.current < this.steps.length -1) {
        this.current += 1;
      }
      return this.steps[this.current];
    }

    stepBackwards() {
      if (this.current !== 0) {
        this.current -= 1;
      }
      return this.steps[this.current];
    }

    goToStep(name) {
      this.current = this._getStepIndex(name);
      return this.steps[this.current];
    }

    isLastStep(name) {
      return this._getStepIndex(name) === this.steps.length - 1;
    }

    isFirstStep(name) {
      return this._getStepIndex(name) === 0;
    }

    _getStepIndex(name) {
      const i = this.steps.indexOf(name);
      if (i < 0) {
        throw new Error(`Step '${name}' not defined`);
      }
      return i;
    }

    isStepingForward(fromStep, toStep) {
      const fromIndex = this._getStepIndex(fromStep);
      const toIndex = this._getStepIndex(toStep);
      return ((toIndex - fromIndex) > 0);
    }

    isJumpingMoreThanOneTab(fromStep, toStep) {
      const fromIndex = this._getStepIndex(fromStep);
      const toIndex = this._getStepIndex(toStep);
      return Math.abs(toIndex - fromIndex) > 1;
    }

  }

  angular
    .module('common.patient')
    .constant('TabManager', TabManager);

})();
