'use strict';

angular.module('pharmacy')
	.controller('SchedulePatientsController', ['$scope', '$rootScope','cohortService', 'encounterService', function ($scope, $rootScope, cohortService, encounterService) {
	
		(function(){
			cohortService.get(Bahmni.Common.Constants.markedForPickupDrugsToday).success(function (data) {
					console.log(data);
	                $scope.cohortMembers = data.members;
	                $scope.hasSchedules = true;
	                
	                if(!data.members){
	                	return;
	                }

	                $scope.cohortMembers.forEach(function (member) {
	                	encounterService.getEncountersForEncounterType(member.uuid, Bahmni.Common.Constants.dispensationEncounterTypeUuid).success(function (data) {
	                		member.lastEncounter =  _.maxBy(data.results, 'encounterDatetime');
	                	});
	                });
            });

		})();
}]);