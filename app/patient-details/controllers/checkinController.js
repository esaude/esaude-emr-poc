'use strict';

angular.module('patient.details')
        .controller('CheckinController', CheckinController);

CheckinController.$inject = ['$rootScope', 'visitService', 'commonService','$stateParams'];

function CheckinController($rootScope, visitService, commonService, $stateParams) {
    //TODO: Check if vm is needed
    var vm = this;
    var dateUtil = Bahmni.Common.Util.DateUtil;

    (function () {
        //initialize visit info in scope
        var pa
        visitService.search({patient: $stateParams.patientUuid, v: "full"})
            .success(function (data) {
                var nonRetired = commonService.filterRetired(data.results);
                //in case the patient has an active visit
                if (!_.isEmpty(nonRetired)) {
                    var lastVisit = _.maxBy(nonRetired, 'startDatetime');
                    var now = dateUtil.now();
                    //is last visit todays
                    if (dateUtil.parseDatetime(lastVisit.startDatetime) <= now &&
                        dateUtil.parseDatetime(lastVisit.stopDatetime) >= now) {
                        $rootScope.hasVisitToday = true;
                        $rootScope.todayVisit = lastVisit;
                    } else {
                        $rootScope.hasVisitToday = false;
                    }
                }
        });

    })();
}
