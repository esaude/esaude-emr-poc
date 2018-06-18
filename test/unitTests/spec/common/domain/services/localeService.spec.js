'use strict';

describe('localeService', () => {

    var localeService;
    var _$http;
    var localesList = "en, es, fr";
    var defaultLocale = "pt";

    beforeEach(() => {
        module('bahmni.common.domain');
        module($provide => {
            _$http = jasmine.createSpyObj('$http', ['get']);
            $provide.value('$http', _$http);
        });

        inject(_localeService_ => {
            localeService = _localeService_;
        });
    });

    it('should fetch allowed list of locales', done => {
        _$http.get.and.callFake(param => specUtil.respondWith({"data": localesList}));

        localeService.allowedLocalesList().then(response => {
            expect(response.data).toEqual(localesList);
            done();
        });
    });

    it('should fetch default locale', done => {
        _$http.get.and.callFake(param => specUtil.respondWith({"data": defaultLocale}));

        localeService.defaultLocale().then(response => {
            expect(response.data).toEqual(defaultLocale);
            done();
        });
    });
});
