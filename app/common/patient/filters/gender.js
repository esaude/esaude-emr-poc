angular.module('common.patient')
.filter('gender', function($rootScope) {
	return function(genderChar) {
        if (genderChar == null) {
            return "Unknown";
        }
        return $rootScope.genderMap[angular.uppercase(genderChar)];
	};
});
