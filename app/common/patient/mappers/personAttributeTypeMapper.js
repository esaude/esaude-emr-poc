(() => {
  'use strict';

  angular
    .module('common.patient')
    .factory('personAttributeTypeMapper', personAttributeTypeMapper);


  /* @ngInject */
  function personAttributeTypeMapper(mandatoryPersonAttributes) {
    return {
      map: map,
    };

    function map(openMrsPersonAttributeTypes) {
      var pocPersonAttributeTypes = openMrsPersonAttributeTypes.map(mrsAttributeType => {

        var attributeType = {
          uuid: mrsAttributeType.uuid,
          sortWeight: mrsAttributeType.sortWeight,
          name: mrsAttributeType.name,
          description: mrsAttributeType.description,
          format: mrsAttributeType.format,
          answers: [],
          required: isRequired(mrsAttributeType)
        };

        if (mrsAttributeType.concept && mrsAttributeType.concept.answers) {
          attributeType.answers = mrsAttributeType.concept.answers.map(mrsAnswer => ({
            description: mrsAnswer.display,
            conceptId: mrsAnswer.uuid
          }));
        }

        return attributeType;
      });

      return pocPersonAttributeTypes;
    }

    function isRequired(mrsAttributeType) {
      var element = _.find(mandatoryPersonAttributes, m => m === mrsAttributeType.name);
      return !!element;
    }
  }
})();
