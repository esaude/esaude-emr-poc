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
	  daysOfDurationUnits: daysOfDurationUnits

	};

	Poc.Pharmacy.Constants.Errors = {
	};
})();
