describe('Factory: home/initialization', function() {
  var initialization, $rootScope, q, $httpBackend;

  beforeEach(module('home'));

  // mock the configurations service
  beforeEach(module(function($provide) {
    // mock configurations
    $provide.value('configurations', {
      load: function() {
        var p = q.defer();
        p.resolve(window.__fixtures__['defaultLocationSetting']);
        return p.promise;
      },

      defaultLocation: function() {
        return window.__fixtures__['defaultLocationSetting'].results[0];
      }
    });

    // mock locationService
    $provide.value('locationService', {
      get: function() {
        var p = q.defer();
        p.resolve({
          data: window.__fixtures__['locationCSMagoe']
        });
        return p.promise;
      }
    });
  }));

  beforeEach(inject(function($injector) {
    q = $injector.get('$q');
    $rootScope = $injector.get('$rootScope');
    initialization = $injector.get('initialization');
    $httpBackend = $injector.get('$httpBackend');
  }));

  it('injection should work correctly', function() {
    // mock backend & ensure it gets called
    $httpBackend.expectGET("../i18n/home/locale_en.json")
      .respond({
        data: window.__fixtures__['local_en']
      });

    $rootScope.$apply();

    expect(initialization).toBeDefined();
  });

  it('should correctly load the default location', function() {
    // mock backend & ensure it gets called
    $httpBackend.expectGET("../i18n/home/locale_en.json")
      .respond({
        data: window.__fixtures__['local_en']
      });

    $rootScope.$apply();

    expect($rootScope.location).toEqual(window.__fixtures__['locationCSMagoe'].results[0]);
  });
});
