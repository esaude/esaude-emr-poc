var Poc = Poc || {};
Poc.Clinic = Poc.Clinic || {};
( function () {

	var drugTypes = [
		{
			name: "ARV",
			labelKey: "DRUG_TYPE_ARV"
		},
		{
			name: "Non ARV",
			labelKey: "DRUG_TYPE_NON_ARV"
		},
		{
			name: "Prophylaxis",
			labelKey: "DRUG_TYPE_PROPHILAXYS"
		}
	];

	Poc.Clinic.Constants = {
	  ADULT_FOLLOWUP_ENCOUTER_UUID: "e278f956-1d5f-11e0-b929-000c29ad1d07",
	  CHILD_FOLLOWUP_ENCOUNTER_UUID: "e278fce4-1d5f-11e0-b929-000c29ad1d07",
	  LAB_ENCOUNTER_TYPE_UUID: "e2790f68-1d5f-11e0-b929-000c29ad1d07",
	  SYSTOLIC_BLOOD_PRESSURE: "e1e2e3d0-1d5f-11e0-b929-000c29ad1d07",
	  DIASTOLIC_BLOOD_PRESSURE: "e1e2e4e8-1d5f-11e0-b929-000c29ad1d07",
	  WEIGHT_KG: "e1e2e826-1d5f-11e0-b929-000c29ad1d07",
	  HEIGHT_CM: "e1e2e934-1d5f-11e0-b929-000c29ad1d07",
	  TEMPERATURE: "e1e2e70e-1d5f-11e0-b929-000c29ad1d07",
	  drugTypes: drugTypes

	};

	Poc.Clinic.Constants.Errors = {
	};
})();
