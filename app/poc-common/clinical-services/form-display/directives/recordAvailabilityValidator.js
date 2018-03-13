'use strict';

angular.module('poc.common.clinicalservices.formdisplay')
.directive('recordAvailabilityValidator', ['$http', function ($http) {

    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            var url = attrs.recordAvailabilityValidator;

            function setAsAvailable(bool) {
                ngModel.$setValidity('available', bool);
            }

            ngModel.$parsers.push(function (value) {
                if (!value || value.length == 0)
                    return;

                setAsAvailable(false);

                $http.get('/openmrs' + url, {
                    method: "GET",
                    params:{q: value},
                    withCredentials: true
                }).success(function (data) {
                    if (!_.isEmpty(data.results)) {
                        setAsAvailable(false);
                    } else {
                        setAsAvailable(true);
                    }
                });

                return value;
            });
        }
    };
}]);
