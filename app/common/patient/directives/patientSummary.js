'use strict';

angular.module('common.patient').directive('patientSummary', () => {
    var link = ($scope, elem, attrs) => {
        $scope.showPatientDetails = false;
        $scope.togglePatientDetails = () => {
            $scope.showPatientDetails = !$scope.showPatientDetails;
        };

        $scope.onImageClick = () => {
            if($scope.onImageClickHandler) {
                $scope.onImageClickHandler();
            }
        };
    };

    return {
        restrict: 'E',
        templateUrl: '../common/patient/header/views/patientSummary.html',
        link: link,
        required: 'patient',
        scope: {
            patient: "=",
            bedDetails: "=",
            onImageClickHandler: "&"
        }
    };
});
