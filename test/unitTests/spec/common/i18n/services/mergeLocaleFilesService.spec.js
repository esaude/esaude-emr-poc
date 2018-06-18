'use strict';

describe('mergeLocaleFilesService', function () {

  var mergeLocaleFilesService, mergeService;
  var _$http;
  var baseFile = {"KEY1": "This is base key"};
  var customFile = {"KEY1": "This is custom key"}, $rootScope, $httpBackend;

  beforeEach(module('bahmni.common.i18n'));

  beforeEach(inject((_mergeLocaleFilesService_, _$rootScope_, _mergeService_, _$httpBackend_) => {
    mergeLocaleFilesService = _mergeLocaleFilesService_;
    $rootScope = _$rootScope_;
    mergeService = _mergeService_;
    $httpBackend = _$httpBackend_;
  }));

  it('merge when both base, custom configs are there', () => {

    $httpBackend.expectGET('/poc_config/openmrs/i18n/common/locale_en.json').respond(baseFile);

    $httpBackend.expectGET('/poc_config/openmrs/i18n/clinical/locale_en.json').respond(customFile);

    spyOn(mergeService, 'merge').and.returnValue(customFile);

    var res;
    mergeLocaleFilesService({app: 'clinical', shouldMerge: true, key: 'en'}).then(response => {
      res = response;
    });

    $rootScope.$apply();

    $httpBackend.flush();

    expect(res).toEqual(customFile);

  });

  it('return both base, custom locales when shouldMerge is false', () => {

    $httpBackend.expectGET('/poc_config/openmrs/i18n/common/locale_en.json').respond(baseFile);

    $httpBackend.expectGET('/poc_config/openmrs/i18n/clinical/locale_en.json').respond(customFile);

    spyOn(mergeService, 'merge').and.returnValue(customFile);

    var res;
    mergeLocaleFilesService({app: 'clinical', shouldMerge: false, key: 'en'}).then(response => {
      res = response;
    });

    $rootScope.$apply();

    $httpBackend.flush();

    expect(res).toEqual([baseFile, customFile]);

  });

});
