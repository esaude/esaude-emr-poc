'use strict';

describe("Patient", function () {
  var patientFactory, ageFactory, patient;
  beforeEach(module('registration'));
  beforeEach(module('common.patient'));
  var identifiersFactoryMock = jasmine.createSpyObj('identifiers', ['create']);
  beforeEach(module(function ($provide) {
    $provide.value('identifiers', identifiersFactoryMock);
  }));
  beforeEach(inject(['patient', 'age', function (patient, age) {
    patientFactory = patient;
    ageFactory = age;
  }]));
  beforeEach(function () {
    patient = patientFactory.create();

  });
  });
