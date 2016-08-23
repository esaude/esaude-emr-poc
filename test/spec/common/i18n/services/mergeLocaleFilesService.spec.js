'use strict';

describe('mergeLocaleFilesService', function () {

    var mergeLocaleFilesService, mergeService;
    var _$http;
    var baseFile = {"KEY1" : "This is base key"};
    var customFile = {"KEY1" : "This is custom key"};

    beforeEach();

    it('merge when both base, custom configs are there', function(done){
        _$http.get.and.callFake(function(param) {
            if(param.indexOf('poc_config') != -1)
                return specUtil.createFakePromise(customFile);
            else
                return specUtil.createFakePromise(baseFile);
        });

        mergeService.merge.and.callFake(function() {
            return customFile;
        });

        var promise = mergeLocaleFilesService({app: 'clinical', shouldMerge: true, key: 'en'});

        promise.then(function valueOf(response) {
            expect(response.data.data).toEqual(customFile);
            done();
        });
    });

    it('return both base, custom locales when shouldMerge is false', function(done){
        _$http.get.and.callFake(function(param) {
            if(param.indexOf('poc_config') != -1)
                return specUtil.createFakePromise(customFile);
            else
                return specUtil.createFakePromise(baseFile);
        });

        mergeService.merge.and.callFake(function() {
            return customFile;
        });

        var promise = mergeLocaleFilesService({app: 'clinical', shouldMerge: false, key: 'en'});

        promise.then(function valueOf(response) {
            expect(response.data.data).toEqual([ customFile, customFile ]);
            done();
        });
    });
});
