'use strict';

angular.module('patient.details')
        .controller('DetailPatientController', ["$scope", "$stateParams", "$location", "$http", "$rootScope", "$compile", "$timeout", "$q",
                function($scope, $stateParams, $location, $http, $rootScope, $compile, $timeout, $q) {
            var patientUuid;
    
            (function () {
                patientUuid = $stateParams.patientUuid;
            })();
            
            $scope.initAttributes = function() {
                $scope.patientAttributes = [];
                angular.forEach($scope.patientConfiguration.customAttributeRows(), function (value) {
                    angular.forEach(value, function (value) {
                        $scope.patientAttributes.push(value);
                    });
                });
            };
            
            $scope.linkDashboard = function() {
                $location.url("/dashboard/" + patientUuid); // path not hash
            };
                    
            // print the demographics info
            $scope.print = function(){
                
                var templateUrl = "../patient-details/views/patient-demo-info.html";
                var data = $scope.patient;
                
                //you need to transform this piece of code in a service
                var printHtml = function (html) {
                    var deferred = $q.defer();
                    var hiddenFrame = $('<iframe style="display: none"></iframe>').appendTo('body')[0];

                    hiddenFrame.contentWindow.printAndRemove = function() {
                        hiddenFrame.contentWindow.print();
                        $(hiddenFrame).remove();
                    };

                    var htmlContent = "<!doctype html>"+
                                "<html>"+
                                    '<body onload="printAndRemove();">' +
                                        html +
                                    '</body>'+
                                "</html>";

                    var doc = hiddenFrame.contentWindow.document.open("text/html", "replace");

                    doc.write(htmlContent);
                    deferred.resolve();
                    doc.close();

                    return deferred.promise;
                };
        
                $http.get(templateUrl).success(function(template){

                    var printScope = angular.extend($rootScope.$new(), data);
                    var element = $compile($('<div>' + template + '</div>'))(printScope);

                    var waitForRenderAndPrint = function() {
                        if(printScope.$$phase || $http.pendingRequests.length) {
                            $timeout(waitForRenderAndPrint);
                        } else {
                            printHtml(element.html());
                            printScope.$destroy(); // To avoid memory leaks from scope create by $rootScope.$new()
                        }
                    };

                    waitForRenderAndPrint();
                });
        }
        }]);
