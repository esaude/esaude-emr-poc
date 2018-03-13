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

    this.filterReverse = function (data) {
        var nonRetired = encounterService.filterRetiredEncoounters(data.results);
        
        return _.values(nonRetired).reverse();
    };

    this.filterGroupReverse = function (data) {
        var nonRetired = encounterService.filterRetiredEncoounters(data.results);
        var grouped = _.groupBy(nonRetired, function (element) {
            return Bahmni.Common.Util.DateUtil.getDateWithoutTime(element.encounterDatetime);
        });
        
        return _.values(grouped).reverse();
    };

    this.findInList = function (list, attribute, value) {
        return _.find(list, function (e) {
            return e[attribute] === value;
        })
    };

    this.filterGroupReverseFollowupObs = function (concepts, results) {
        var nonRetired = encounterService.filterRetiredEncoounters(results);

        //TODO: Fix null referece
        _.forEach(nonRetired, function (encounter) {
                encounter.obs = observationsService.filterByList(encounter.obs, concepts);
        });

        var filtered = _.filter(nonRetired, function (encounter) {
            return !_.isEmpty(encounter.obs);
        });

        return filtered.reverse();
    };

    this.deferPatient = function (patient) {
      return patient;
    };

    this.findByMemberConcept = function (group, uuid) {
        return _.find(group, function (member) {
            return member.concept.uuid === uuid;
        });
    }

}]);

