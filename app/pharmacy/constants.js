var Poc = Poc || {};
Poc.Pharmacy = Poc.Pharmacy || {};
( function () {

	var daysOfDurationUnits = [
		{name: "minutes", uuid: "1e5705ee-10f5-11e5-9009-0242ac110012", days: 0},
		{name: "hours", uuid: "9d956959-10e8-11e5-9009-0242ac110012", days: 0},
		{name: "days", uuid: "9d6f51fb-10e8-11e5-9009-0242ac110012", days: 1},
		{name: "weeks", uuid: "9d96489b-10e8-11e5-9009-0242ac110012", days: 7},
		{name: "months", uuid: "9d96d012-10e8-11e5-9009-0242ac110012", days: 30}
	];

	Poc.Pharmacy.Constants = {
	  daysOfDurationUnits: daysOfDurationUnits,
    filaObsList: {
      posology: "e1de28ae-1d5f-11e0-b929-000c29ad1d07",
      nextPickup: "e1e2efd8-1d5f-11e0-b929-000c29ad1d07",
      regimen: "e1d83e4e-1d5f-11e0-b929-000c29ad1d07",
      quantity: "e1de2ca0-1d5f-11e0-b929-000c29ad1d07"
    }
	};

	Poc.Pharmacy.Constants.Errors = {
	};
})();
