(function () {
  'use strict';

  angular
    .module('poc.common.formdisplay')
    .factory('formService', formService);

  formService.$inject = ['$q', '$http', '$log'];

  /* @ngInject */
  function formService($q, $http, $log) {
    var service = {
      getForm: getForm
    };
    return service;

    ////////////////

    function getForm(uuid) {
      return $http.get("/openmrs/ws/rest/v1/form" + "/" + uuid, {
        method: "GET",
        params: {
          v: "custom:(description,display,encounterType,uuid,formFields:(uuid,field:(uuid,selectMultiple,fieldType:(display),concept:(answers,set,setMembers,uuid,datatype:(display)))))"
        },
        withCredentials: true
      }).then(function (response) {
        var form = response.data;
        form.formFields.forEach(function (f) {
          // TODO: This field is not really necessary, should be removed after refactoring all other parts of dynamic
          // forms to not use fieldConcept
          f.fieldConcept = angular.copy(f.field);
        });
        return form;
      });
    }

    function getFormFieldConcept(fieldUUID) {
      return $http.get('/openmrs/ws/rest/v1/field/' + fieldUUID, {
        params: {
          v: "full"
        },
        withCredentials: true
      }).then(function (response) {
        return response.data;
      }).catch(function (error) {
        $log.error('XHR Failed for getFormFieldConcept. ' + error.data);
        return $q.reject(error);
      });
    }
  }

})();
