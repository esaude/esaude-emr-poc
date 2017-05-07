'use strict';

describe("observationsService", function () {
  var mockBackend, observationsService;

  beforeEach(function () {
    module('bahmni.common.domain');
    inject(function (_observationsService_, $httpBackend) {
      observationsService = _observationsService_;
      mockBackend = $httpBackend
    });
  });

});
