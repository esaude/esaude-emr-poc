
  'use strict';

  angular
    .module('bahmni.common.uiHelper')
    .factory('notifier', notifier);

  function notifier() {

    toastr.options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": true,
      "progressBar": true,
      "positionClass": "toast-top-center",
      "preventDuplicates": false,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "5000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    };

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

