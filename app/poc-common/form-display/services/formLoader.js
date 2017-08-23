(function () {
  'use strict';

  angular
    .module('poc.common.formdisplay')
    .factory('formLoader', formLoader);

  formLoader.$inject = ['$q', 'formService'];

  /* @ngInject */
  function formLoader($q, formService) {
    var service = {
      load: load
    };
    return service;

    ////////////////

    function load(forms) {
      var formMap = {};

      var loadForms = forms.map(function (form) {
        return formService.getForm(form.formId).then(function (f) {
          formMap[form.id] = f;
        });
      });

      return $q.all(loadForms).then(function () {
        return formMap;
      });
    }
  }

})();
