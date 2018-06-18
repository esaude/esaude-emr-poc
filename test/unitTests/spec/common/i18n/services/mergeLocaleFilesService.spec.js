'use strict';

describe('mergeLocaleFilesService', () => {

    var mergeLocaleFilesService, mergeService;
    var _$http;
    var baseFile = {"KEY1" : "This is base key"};
    var customFile = {"KEY1" : "This is custom key"};

    beforeEach(() => {
        module('bahmni.common.i18n');
        module($provide => {
            _$http = jasmine.createSpyObj('$http', ['get']);
            $provide.value('$http', _$http);
            $provide.value('$q', Q);
            $provide.value('mergeService', mergeService);
        });

        mergeService = jasmine.createSpyObj('mergeService', ['merge']);
        inject(_mergeLocaleFilesService_ => {
            mergeLocaleFilesService = _mergeLocaleFilesService_;
        });
    });

    it('merge when both base, custom configs are there', done => {
        _$http.get.and.callFake(param => {
            if(param.indexOf('poc_config') != -1)
                return specUtil.createFakePromise(customFile);
            else
                return specUtil.createFakePromise(baseFile);
        });

        mergeService.merge.and.callFake(() => customFile);

        var promise = mergeLocaleFilesService({app: 'clinical', shouldMerge: true, key: 'en'});

        promise.then(response => {
            expect(response.data.data).toEqual(customFile);
            done();
        });
    });

    it('return both base, custom locales when shouldMerge is false', done => {
        _$http.get.and.callFake(param => {
            if(param.indexOf('poc_config') != -1)
                return specUtil.createFakePromise(customFile);
            else
                return specUtil.createFakePromise(baseFile);
        });

        mergeService.merge.and.callFake(() => customFile);

        var promise = mergeLocaleFilesService({app: 'clinical', shouldMerge: false, key: 'en'});

        promise.then(response => {
            expect(response.data.data).toEqual([ customFile, customFile ]);
            done();
        });
    });
});
