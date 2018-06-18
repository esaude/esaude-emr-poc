(() => {
  'use strict';

  angular
    .module('application')
    .run(runBlock);

  runBlock.$inject = ['$document'];

  function runBlock($document) {
    // Prevents CTRL + j from barcode scanner
    $document.keydown(event => {
      if (event.keyCode === 74 && event.ctrlKey) {
        event.preventDefault();
      }
    });
  }

})();
