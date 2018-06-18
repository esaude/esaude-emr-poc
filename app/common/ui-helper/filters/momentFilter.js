(() => {

    'use strict';

    var OBJECT_IS_NOT_A_MOMENT = "Object is not a moment ";

    var customFormats = {
        'short': 'DD/MM/YYYY HH:mm'
    };

    angular
        .module("bahmni.common.uiHelper")
        .filter("moment", () => filter);

    function filter(input, format) {
        if (moment.isMoment(input)) {
            var customFormat = customFormats[format];
            if (customFormat) {
                format = customFormat;
            } else if (!format) {
                format = 'DD/MM/YYYY';
            }
            return input.format(format);
        }
        throw OBJECT_IS_NOT_A_MOMENT + input;
    }
})();
