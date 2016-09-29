'use strict';

angular.module('bahmni.common.domain')
    .service('commonService', ['encounterService', 'observationsService',
        function (encounterService, observationsService) {

    this.filterRetired = function (entities) {
        return _.filter(entities, function (entity) {
            return !entity.voided;
        });
    };

    this.filterLast = function (entities) {
        return _.filter(entities, function (entity) {
            return !entity.voided;
        });
    };

          this.filterGroupReverse = function (data) {
        var nonRetired = encounterService.filterRetiredEncoounters(data.results);
        var grouped = _.groupBy(nonRetired, function (element) {
            return Bahmni.Common.Util.DateUtil.getDate(element.encounterDatetime);
        });
        var reversed = _.values(grouped).reverse();
        return reversed;
    };

          this.filterGroupReverseFollowupObs = function (concepts, results) {
            var nonRetired = encounterService.filterRetiredEncoounters(results);

            //TODO: Fix null referece
            _.forEach(angular.copy(nonRetired), function (encounter) {
                encounter.obs = observationsService.filterByList(encounter.obs, concepts);
            });
            var filtered = _.filter(nonRetired, function (encounter) {
                return !_.isEmpty(encounter.obs);
            });
            return filtered.reverse();
        };

          this.deferPatient = function (patient) {
            var newPatient = patient;
            return newPatient;
        };

        }]);

