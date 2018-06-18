var Bahmni = Bahmni || {};
Bahmni.Tests = Bahmni.Tests || {};

Bahmni.Tests.openMRSConceptHelper = {
	getConceptByName: (concepts, conceptName) => {
        var foundConcept = concepts.filter(concept => concept.name.name === conceptName)[0];
        if(foundConcept) return foundConcept;
        concepts.forEach(concept => {
            if(!foundConcept) foundConcept = Bahmni.Tests.openMRSConceptHelper.getConceptByName(concept.setMembers, conceptName);
        });
        return foundConcept;
    },

    mapToConcept: openMRSConcept => ({uuid: openMRSConcept.uuid, name: openMRSConcept.name.name})
};
