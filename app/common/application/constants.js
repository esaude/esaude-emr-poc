(function () {

  'use strict';

  angular
    .module('application')
    .constant('location', 'emr.location')
    .constant('dateFormat', {
      shortDate: 'dd/MM/yyyy',
      short: "d/M/yyyy H:mm:ss"
    });

})();
