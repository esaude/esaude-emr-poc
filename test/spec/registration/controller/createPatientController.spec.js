'use strict';

describe('CreatePatientController', function() {
  var $aController, q, scopeMock, rootScopeMock, stateMock, patientServiceMock, preferencesMock, spinnerMock,
    appServiceMock, ngDialogMock, ngDialogLocalScopeMock, httpBackend, http, sections, identifiersMock;

  beforeEach(module('registration'));
  //beforeEach(module('bahmni.common.models'));

  beforeEach(module(function ($provide) {
    identifiersMock = jasmine.createSpyObj('identifiers', ['create']);
    identifiersMock.create.and.returnValue({
      primaryIdentifier: {
        identifierType: {
          primary: true,
          uuid: "identifier-type-uuid",
          identifierSources: [{
            prefix: "GAN"
          }, {
            prefix: "SEM"
          }]
        }
      }
    });

    $provide.value('identifiers', identifiersMock);

  }));

  beforeEach(
    inject(function ($controller, $rootScope, $q, $httpBackend, $http) {
      $aController = $controller;
      rootScopeMock = $rootScope;
      q = $q;
      scopeMock = rootScopeMock.$new();
      httpBackend = $httpBackend;
      http = $http;
    })
  );

});
