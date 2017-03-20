'use strict';

angular.module('pharmacy')
	.controller('SchedulePatientsController', ['$scope', '$rootScope','cohortService', 'encounterService', function ($scope, $rootScope, cohortService, encounterService) {
	
		(function(){
			cohortService.get(Bahmni.Common.Constants.markedForPickupDrugsToday).success(function (data) {
				
	                $scope.cohortMembers = data.members;
	                
	                if(_.isEmpty(data.members)){
	                	return;
	                }

	                $scope.hasSchedules = true;

	                $scope.cohortMembers.forEach(function (member) {
	                	encounterService.getEncountersForEncounterType(member.uuid, Bahmni.Common.Constants.dispensationEncounterTypeUuid).success(function (data) {
	                		member.lastEncounter =  _.maxBy(data.results, 'encounterDatetime');
	                	});
	                });
            });

		})();
}]);