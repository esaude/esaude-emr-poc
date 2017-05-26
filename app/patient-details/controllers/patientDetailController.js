(function () {
  'use strict';

  angular.module('patient.details')
    .controller('DetailPatientController', DetailPatientController);

  DetailPatientController.$inject = ["$scope", "$stateParams", "$location", "$http", "$rootScope", "$compile", "$timeout", "$q"];

  function DetailPatientController($scope, $stateParams, $location, $http, $rootScope, $compile, $timeout, $q) {
    var vm = this;

    vm.patientAttributes = [];
    vm.initAttributes = initAttributes;
    vm.linkDashboard = linkDashboard;
    vm.print = print;

    function initAttributes() {
      vm.patientAttributes = [];
      angular.forEach($scope.patientConfiguration.customAttributeRows(), function (value) {
        angular.forEach(value, function (value) {
          vm.patientAttributes.push(value);
        });
      });
    }

    function linkDashboard() {
      $location.url("/dashboard/" + $stateParams.patientUuid); // path not hash
    }

    // print the demographics info
    function print() {

      var templateUrl = "../patient-details/views/patient-demo-info.html";
      var data = $scope.patient;
      $scope.patient.barcodeOptions = {
        width: 2,
        height: 40,
        quite: 10,
        displayValue: true,
        font: "monospace",
        textAlign: "center",
        fontSize: 10,
        backgroundColor: "",
        lineColor: "#000"
      };


      //you need to transform this piece of code in a service
      var printHtml = function (html) {
        var deferred = $q.defer();
        var hiddenFrame = $('<iframe style="display: none"></iframe>').appendTo('body')[0];

        hiddenFrame.contentWindow.printAndRemove = function () {
          hiddenFrame.contentWindow.print();
          $(hiddenFrame).remove();
        };

        var htmlContent = "<!doctype html>" +
          "<html>" +
          '<body onload="printAndRemove();">' +
          html +
          '</body>' +
          "</html>";

        var doc = hiddenFrame.contentWindow.document.open("text/html", "replace");

        doc.write(htmlContent);
        deferred.resolve();
        doc.close();

        return deferred.promise;
      };

      $http.get(templateUrl).success(function (template) {

        var printScope = angular.extend($rootScope.$new(), data);
        var element = $compile($('<div>' + template + '</div>'))(printScope);

        var waitForRenderAndPrint = function () {
          if (printScope.$$phase || $http.pendingRequests.length) {
            $timeout(waitForRenderAndPrint);
          } else {
            printHtml(element.html());
            printScope.$destroy(); // To avoid memory leaks from scope create by $rootScope.$new()
          }
        };

        waitForRenderAndPrint();
      });
    }
  }
})();
