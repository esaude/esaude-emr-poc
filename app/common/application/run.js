(function () {
  'use strict';

  angular
    .module('application')
    .run(runBlock);

  runBlock.$inject = ['$document'];

  function runBlock($document) {
    // Prevents CTRL + j from barcode scanner
    $document.keydown(function(event) {
      if (event.keyCode === 74 && event.ctrlKey) {
        console.log('crtl + j');
        event.preventDefault();
      }
    });
  }

})();
