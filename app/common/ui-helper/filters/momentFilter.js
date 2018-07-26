(() => {

    'use strict';

    var OBJECT_IS_NOT_A_MOMENT = "Object is not a moment ";

    angular
        .module("bahmni.common.uiHelper")
        .filter("moment", (momentFormat) => {
            return (input, format) => {
                var momentInput = input;
                if (angular.isString(input)) {
                    momentInput = moment(input);
                }
                if (moment.isMoment(momentInput)) {
                    var customFormat = momentFormat[format];
                    return momentInput.format(customFormat);
                }
                throw OBJECT_IS_NOT_A_MOMENT + input;
            };
        });
})();
