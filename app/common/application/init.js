(() => {
  'use strict';

  /**
   * Top level module, application wide configuration goes here.
   * Ideally it should load all the other modules as described here: {@link https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#module-dependencies}.
   * For now we'll let all other modules load this one, because it has as similar end-result.
   */
  angular
    .module('application', [
      'authentication',
      'bahmni.common.uiHelper',
      'ncy-angular-breadcrumb',
      'ui.bootstrap'
    ]);

})();
