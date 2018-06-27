(() => {

  'use strict';

  angular
    .module('application')
    .constant('location', 'emr.location')
    .constant('dateFormat', {
      shortDate: 'dd/MM/yyyy',
      short: "d/M/yyyy H:mm:ss"
    })
    .constant('momentFormat', {
      shortDate: 'D/M/YYYY',
      short: "D/M/YYYY H:mm:ss"
    });

})();
