Bahmni = Bahmni || {};
Bahmni.Tests = Bahmni.Tests || {};

Bahmni.Tests.tehsilMother = {
    build: () => ({
      "name": "Bilaspur",
      "parent": {
        "name": "Distr",
        "parent": {
          "name": "Chattisgarh"
        }
      }
    })
};

Bahmni.Tests.villageMother = {
    build: () => ({
      "name": "argaav",
      "parent": Bahmni.Tests.tehsilMother.build()
    })
};

Bahmni.Tests.genUUID = () => (Math.random() * Math.pow(10, 16)).toString();

Bahmni.Tests.openMRSConceptMother = {
    build: conceptData => {
        var concept = {
            uuid: conceptData.uuid || Bahmni.Tests.genUUID(),
            name: { name: conceptData.name || "conceptName"},
            datatype: {name: conceptData.dataType || "N/A"},
            set: conceptData.set,
            setMembers: conceptData.setMembers || [],
            hiNormal: conceptData.hiNormal,
            lowNormal: conceptData.lowNormal
        };
        return concept;
    }
};

Bahmni.Tests.conceptMother = {
    build: conceptData => {
        var defaultConcept = {
            uuid: Bahmni.Tests.genUUID(),
            name: "conceptName",
            dataType: "N/A",
            set: false,
            voided: false,
            conceptClass: 'Misc'
        };
        return angular.extend(defaultConcept, conceptData);
    }
};

Bahmni.Tests.observationMother = {
    build: observationData => {
        var defaultObservation = {
            uuid: Bahmni.Tests.genUUID(),
            groupMembers: [],
            concept: Bahmni.Tests.conceptMother.build()
        };

        return angular.extend(defaultObservation, observationData);
    }
};

Bahmni.Tests.drugOrderViewModelMother = {
    build: (treatmentConfig, drugOrderViewModelData, encounterDate) => {
        var defaultModel = new Bahmni.Clinical.DrugOrderViewModel(treatmentConfig, drugOrderViewModelData);
        defaultModel.instructions = "Before Meals";
        defaultModel.duration = "10";
        defaultModel.scheduledDate = "21/12/2014";
        defaultModel.quantity = "12";
        defaultModel.quantityUnit = "Capsule";
        defaultModel.drug = {
            "form": "Tablet",
            "uuid": "8d7e3dc0-f4ad-400c-9468-5a9e2b1f4230",
            "strength": null,
            "name": "calpol 500mg"
        };
        defaultModel.encounterDate = encounterDate;
        return defaultModel;
    },
    buildWith: (treatmentConfig, drugOrderViewModelData) => { // TODO : Mujir/Bharti - remove this, use the method with encounterDate
        return buildWith(treatmentConfig, drugOrderViewModelData, undefined);
    },
    buildWith: (treatmentConfig, drugOrderViewModelData, encounterDate) => {
        var defaultModel = new Bahmni.Clinical.DrugOrderViewModel(treatmentConfig, drugOrderViewModelData, encounterDate);

        defaultModel.instructions = drugOrderViewModelData.instructions || "Before Meals";
        defaultModel.duration = drugOrderViewModelData.duration || "10";
        defaultModel.durationUnits = drugOrderViewModelData.durationUnits || "Day(s)";
        defaultModel.scheduledDate = drugOrderViewModelData.scheduledDate || "21/12/2014";
        defaultModel.quantity = drugOrderViewModelData.quantity || "12";
        defaultModel.quantityUnit = drugOrderViewModelData.quantityUnit || "Capsule";
        defaultModel.isEditAllowed = drugOrderViewModelData.isEditAllowed || false;
        defaultModel.effectiveStartDate = drugOrderViewModelData.effectiveStartDate || "21-12-2014";
        defaultModel.effectiveStopDate = drugOrderViewModelData.effectiveStopDate || "06-12-2014";
        defaultModel.drug = {
            "form": drugOrderViewModelData.drug.form ||"Tablet",
            "uuid": drugOrderViewModelData.drug.uuid || "8d7e3dc0-f4ad-400c-9468-5a9e2b1f4230",
            "strength": drugOrderViewModelData.drug.strength || null,
            "name": drugOrderViewModelData.drug.name ||"calpol 500mg"
        };
        defaultModel.uuid = drugOrderViewModelData.uuid || null;
        defaultModel.previousOrderUuid = drugOrderViewModelData.previousOrderUuid || null;
        defaultModel.encounterDate = drugOrderViewModelData.encounterDate||null;
        return defaultModel;
    }
};
