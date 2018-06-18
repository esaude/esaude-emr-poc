'use strict';

angular.module('bahmni.common.domain')
    .service('commonService', ['encounterService', 'observationsService',
        function (encounterService, observationsService) {

    this.filterRetired = entities => _.filter(entities, entity => !entity.voided);

    this.filterLast = entities => _.filter(entities, entity => !entity.voided);

    this.filterReverse = data => {
        var results = getResultThenCompatible(data);
        var nonRetired = encounterService.filterRetiredEncoounters(results);

        return _.values(nonRetired).reverse();
    };

    this.filterGroupReverse = data => {
        var results = getResultThenCompatible(data);
        var nonRetired = encounterService.filterRetiredEncoounters(results);
        var grouped = _.groupBy(nonRetired, element => Bahmni.Common.Util.DateUtil.getDateWithoutTime(element.encounterDatetime));

        return _.values(grouped).reverse();
    };

    this.findInList = (list, attribute, value) => _.find(list, e => e[attribute] === value);

    this.filterGroupReverseFollowupObs = (concepts, results) => {
        var nonRetired = encounterService.filterRetiredEncoounters(results);

        //TODO: Fix null referece
        _.forEach(nonRetired, encounter => {
                encounter.obs = observationsService.filterByList(encounter.obs, concepts);
        });

        var filtered = _.filter(nonRetired, encounter => !_.isEmpty(encounter.obs));

        return filtered.reverse();
    };

    this.deferPatient = patient => patient;

    this.findByMemberConcept = (group, uuid) => _.find(group, member => member.concept.uuid === uuid);

    function getResultThenCompatible(data) {
        if (data.results) {
            return data.results;
        }
        return data;
    }


}]);

