'use strict';

angular.module('patient.details')
        .controller('CheckinController');

CheckinController.$inject = ['visitService', 'commonService'];

function CheckinController(visitService, commonService) {
    var vm = this;
    var dateUtil = Bahmni.Common.Util.DateUtil;
    
    (function () {
        //initialize visit info in scope
        visitService.search({patient: $scope.patient.uuid, v: "full"})
            .success(function (data) {
                var nonRetired = commonService.filterRetired(data.results);
                //in case the patient has an active visit
                if (!_.isEmpty(nonRetired)) {
                    var lastVisit = _.maxBy(nonRetired, 'startDatetime');
                    var now = dateUtil.now();
                    //is last visit todays
                    if (dateUtil.parseDatetime(lastVisit.startDatetime) <= now && 
                        dateUtil.parseDatetime(lastVisit.stopDatetime) >= now) {
                        vm.hasVisitToday = true;
                        vm.todayVisit = lastVisit;
                    } else {
                        vm.hasVisitToday = false;
                    }
                }
        });
            
    })();
}
