describe('Factory: home/initialization', function() {
  var initialization, $rootScope, q;

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

  beforeEach(inject(function($injector /*, _initialization_ ,$q */ ) {
    q = $injector.get('$q');
    $rootScope = $injector.get('$rootScope');
    initialization = $injector.get('initialization');
  }));

  it('injection should work correctly', function() {
    $rootScope.$apply();
    expect(initialization).toBeDefined();
  });

  it('should correctly load the default location', function() {
    $rootScope.$apply();
    expect($rootScope.location).toEqual(window.__fixtures__['locationCSMagoe'].results[0]);
  });
});
