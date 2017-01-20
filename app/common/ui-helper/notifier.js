
  'use strict';

  angular
    .module('bahmni.common.uiHelper')
    .factory('notifier', notifier);

  function notifier() {

    return  {
      success: success,
      error: error,
      information: information,
      warning: warning
    };

    function success(message) {
      toastr.success(message);
    }

    function error(message) {
      toastr.error(message);
    }

    function information(message) {
      toastr.info(message);
    }

    function warning(title, message) {
      toastr.warning(title, message);
    }
  }

