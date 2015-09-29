'use strict';

angular.module('registration')
    .controller('CreatePatientController', ['$scope', '$state', 'patient', 'patientService', 
                    'spinner', 'appService', '$http', 'localStorageService',
        function ($scope, $state, patientModel, patientService, spinner, appService, $http, localStorageService) {
                var dateUtil = Bahmni.Common.Util.DateUtil;
                $scope.actions = {};
                $scope.addressHierarchyConfigs = appService.getAppDescriptor().getConfigValue("addressHierarchy");

                (function () {
                    $scope.patient = patientModel.create();
                    $scope.patient.patientIdentifiers = [];
                    $scope.today = dateUtil.getDateWithoutTime(dateUtil.now());
                    //get patient identifier types
                    var searchPromise = patientService.getIdentifierTypes();

                    searchPromise.success(function (data) {
                        $scope.patientIdentifierTypes = data.results;
                    });
                    searchPromise['finally'](function () {
                    });
                })();

                $scope.selectIdentifierType = function () {
                    $scope.errorMessage = null;
                    
                    var patientIdentifierType = $scope.patient.patientIdentifierType;
                    if (patientIdentifierType !== null) {
                        //validate already contained
                        var found = _.find($scope.patient.patientIdentifiers, function (chr) {
                            return chr.type.name === patientIdentifierType.name;
                        });
                        
                        if(found === undefined) {
                            var fieldName = patientIdentifierType.name.trim().replace(/[^a-zA-Z0-9]/g, '');
                            $scope.patient.patientIdentifiers.push({type: patientIdentifierType, identifier: null, preferred: false, location: localStorageService.get("emr.location").uuid, fieldName : fieldName});
                        } else {
                            $scope.errorMessage = "The selected Patient Identifier Type is already contained.";
                        }
                    }
                };

                $scope.removeIdentifier = function (identifier) {
                    $scope.errorMessage = null;
                    
                    _.pull($scope.patient.patientIdentifiers, identifier);
                };

                $scope.setPreferredId = function (identifier) {
                    angular.forEach($scope.patient.patientIdentifiers, function (p) {
                        p.preferred = false; //set them all to false
                    });
                    identifier.preferred = true; //set the clicked one to true
                };
                
                $scope.getDeathConcepts = function () {
                    var deathConcept;
                    var deathConceptValue;
                    $http({
                        url: '/openmrs/ws/rest/v1/systemsetting',
                        method: 'GET',
                        params: {
                            q: 'concept.causeOfDeath',
                            v: 'full'
                        },
                        withCredentials: true,
                        transformResponse: [function(data){
                            deathConcept = JSON.parse(data);
                            deathConceptValue = deathConcept.results[0].value;
                            $http.get(Bahmni.Common.Constants.conceptUrl, {
                                params: {
                                    q: deathConceptValue,
                                    v: 'custom:(uuid,name,set,answers:(uuid,display,name:(uuid,name),retired))'
                                },
                                withCredentials: true
                            }).then(function (results) {
                                $scope.deathConcepts = results.data.results[0]!=null ? results.data.results[0].answers:[];
                                $scope.deathConcepts = filterRetireDeathConcepts($scope.deathConcepts);
                            });
                        }]
                    });
                };
                
                var filterRetireDeathConcepts = function(deathConcepts){
                    return _.filter(deathConcepts,function(concept){
                        return !concept.retired;
                    });
                };
                
                $scope.selectIsDead = function(){
                    if($scope.patient.causeOfDeath != null ||$scope.patient.deathDate != null){
                        $scope.patient.dead = true;
                    }
                };

                $scope.disableIsDead = function(){
                    return ($scope.patient.causeOfDeath != null || $scope.patient.deathDate != null) && $scope.patient.dead;
                };
                
                $scope.initAttributes = function() {
                    $scope.patientAttributes = [];
                    angular.forEach($scope.patientConfiguration.customAttributeRows(), function (value) {
                        angular.forEach(value, function (value) {
                            $scope.patientAttributes.push(value);
                        });
                    });
                };

                $scope.create = function () {
                    var errMsg = Bahmni.Common.Util.ValidationUtil.validate($scope.patient,$scope.patientConfiguration.personAttributeTypes);
                    if(errMsg){
    //                   messagingService.showMessage('formError', errMsg);
                        return;
                    }

                    patientService.create($scope.patient).success(successCallback);
                };

            var successCallback = function (patientProfileData) {
                $scope.patient.uuid = patientProfileData.patient.uuid;
                $scope.patient.name = patientProfileData.patient.person.names[0].display;
                $scope.patient.isNew = true;
                $scope.patient.registrationDate = dateUtil.now();
                $scope.actions.followUpAction(patientProfileData);
                console.log(patientProfileData);
            };

            $scope.afterSave = function () {
//                messagingService.showMessage("info", "Saved");
//                $state.go("patient.edit", {patientUuid: $scope.patient.uuid});
            };
        }]).directive("dynamicName",function($compile){
        return {
            restrict:"A",
            terminal:true,
            priority:1000,
            link:function(scope,element,attrs){
                element.attr('name', scope.$eval(attrs.dynamicName));
                element.removeAttr("dynamic-name");
                $compile(element)(scope);
            }
        };
        }).directive('date', function() {
            return {
               restrict: 'A',
               require: '^ngModel',
               link: function(scope, elm, attrs, ctrl) {
                 var dp = $(elm);

                 dp.datepicker({
                   onSelect: function(dateText) {
                     scope.$apply(function() {
                      ctrl.$setViewValue(dateText);
                     });
                  }
                 });

                 scope.$watch(attrs.ngModel, function(nv) {
                   dp.datepicker('setDate', nv)  
                 });
               }
            }
        }).filter('valueofaddress', function() {
              return function(input, scope) {
                  input = input || '';
                  var value = scope.patient.address[input];

                  return value;
              };
        }).filter('valueofothers', function() {
              return function(input, scope) {
                  var attrubuteName = input.name || '';
                  var value = scope.patient[attrubuteName];
                  
                  if (input.format === "org.openmrs.Concept") {
                      for (var i in input.answers) {
                          var data = input.answers[i];
                          if (data.conceptId === value) {
                              value = data.description;
                              break;
                          }
                      }
                  }         
                  return value;
              };
        });
