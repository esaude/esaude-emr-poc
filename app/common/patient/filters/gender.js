angular.module('common.patient')
.filter('gender', $rootScope => genderChar => {
  if (genderChar == null) {
    return "Unknown";
  }
  return $rootScope.genderMap[angular.uppercase(genderChar)];
});
