describe('Controller: LoginController', function() {
  beforeEach(module('home'));

  var scope, q, controller, location, sessionService, locationService, stateParams;

  var dummyLocations = {
    "results": [{
      "uuid": "5c303ee9-ca10-43fc-829f-c9e45bb7748e",
      "display": "Angonia",
      "links": [{
        "rel": "self",
        "uri": "NEED-TO-CONFIGURE/ws/rest/v1/location/5c303ee9-ca10-43fc-829f-c9e45bb7748e"
      }]
    }, {
      "uuid": "7fc3f286-15b1-465e-9013-b72916f58b2d",
      "display": "Cahora Bassa",
      "links": [{
        "rel": "self",
        "uri": "NEED-TO-CONFIGURE/ws/rest/v1/location/7fc3f286-15b1-465e-9013-b72916f58b2d"
      }]
    }, {
      "uuid": "7863528a-35dc-453e-a671-73580ef78ba2",
      "display": "Changara",
      "links": [{
        "rel": "self",
        "uri": "NEED-TO-CONFIGURE/ws/rest/v1/location/7863528a-35dc-453e-a671-73580ef78ba2"
      }]
    }]
  };

  beforeEach(inject(function($controller, $rootScope, _$location_, _locationService_, _sessionService_, $q, $stateParams) {
    scope = $rootScope.$new();
    q = $q;
    location = _$location_;
    controller = $controller;
    stateParams = $stateParams;
    sessionService = _sessionService_;
    locationService = _locationService_;

    // mock locationServer.getAllByTag
    spyOn(locationService, 'getAllByTag').and.callFake(function() {
      return {
        success: function(callback) {
          callback(dummyLocations);
        },
        finally: function() {}
      };
    });

    // mock sessionService.loginUser
    spyOn(sessionService, 'loginUser').and.callFake(function(testUser) {
      var defer = $q.defer();

      if (testUser === 'testSuccessUser') {
        defer.resolve();
      } else {
        defer.reject('invalid username or password');
      }

      return defer.promise;
    });

    // mock sessionService.get
    spyOn(sessionService, 'get').and.callFake(function() {
      return {
        success: function(callback) {
          var data = {};
          data.authenticated = false;
          callback(data);
        }
      };
    });

    location.path('/login');
    spyOn(location, 'path').and.callThrough();
  }));

  it('should correctly set $scope.locations', function() {
    // construct controller
    controller('LoginController', {
      $scope: scope,
      $location: location,
      restService: locationService,
      sessionService: sessionService
    });

    expect(scope.locations).toEqual([{
      "uuid": "5c303ee9-ca10-43fc-829f-c9e45bb7748e",
      "display": "Angonia",
      "links": [{
        "rel": "self",
        "uri": "NEED-TO-CONFIGURE/ws/rest/v1/location/5c303ee9-ca10-43fc-829f-c9e45bb7748e"
      }]
    }, {
      "uuid": "7fc3f286-15b1-465e-9013-b72916f58b2d",
      "display": "Cahora Bassa",
      "links": [{
        "rel": "self",
        "uri": "NEED-TO-CONFIGURE/ws/rest/v1/location/7fc3f286-15b1-465e-9013-b72916f58b2d"
      }]
    }, {
      "uuid": "7863528a-35dc-453e-a671-73580ef78ba2",
      "display": "Changara",
      "links": [{
        "rel": "self",
        "uri": "NEED-TO-CONFIGURE/ws/rest/v1/location/7863528a-35dc-453e-a671-73580ef78ba2"
      }]
    }]);
  });

  it('should redirect the user to the landing page on successful login', function() {
    // construct controller
    controller('LoginController', {
      $scope: scope,
      $location: location,
      restService: locationService,
      sessionService: sessionService
    });

    // mock sessionService.loadCredentials (success)
    spyOn(sessionService, 'loadCredentials').and.returnValue(q.when({}));

    scope.loginUser = {
      username: 'testSuccessUser',
      password: 'testSuccessPass',
      currentLocation: 'testSuccessCurrentLocation'
    };

    scope.login();
    scope.$apply();

    expect(sessionService.get).toHaveBeenCalled();
    expect(location.path).toHaveBeenCalledWith('/dashboard');
  });

  it('should stay on page and set $scope.errorMessage on invalid user/pass', function() {
    spyOn(sessionService, 'loadCredentials').and.callThrough();

    // construct controller
    controller('LoginController', {
      $scope: scope,
      $location: location,
      restService: locationService,
      sessionService: sessionService
    });

    scope.loginUser = {
      username: 'testFailureUser',
      password: 'testFailurePass',
      currentLocation: 'testFailureCurrentLocation'
    };

    // perform login
    scope.login();
    scope.$apply();

    expect(sessionService.get).toHaveBeenCalled();
    expect(sessionService.loadCredentials).not.toHaveBeenCalled();
    expect(location.path).not.toHaveBeenCalledWith('/dashboard');
    expect(scope.errorMessage).toEqual('invalid username or password');
  });

  it('should stay on page and set $scope.errorMessage on failure to load credentiala', function() {
    // construct controller
    controller('LoginController', {
      $scope: scope,
      $location: location,
      restService: locationService,
      sessionService: sessionService
    });

    // mock sessionService.loadCredentials (failure)
    spyOn(sessionService, 'loadCredentials').and.callFake(function() {
      return q.reject('failure to load credentials');
    });

    scope.loginUser = {
      username: 'testSuccessUser',
      password: 'testSuccessPass',
      currentLocation: 'testSuccessCurrentLocation'
    };

    // perform login
    scope.login();
    scope.$apply();

    expect(sessionService.get).toHaveBeenCalled();
    expect(location.path).not.toHaveBeenCalledWith('/dashboard');
    expect(scope.errorMessage).toEqual('failure to load credentials');
  });

  it('should redirect to the landing page if we are already logged in', function() {
    // mock sessionService.get
    sessionService.get.and.returnValue({
      success: function(callback) {
        var data = {};
        data.authenticated = true;
        callback(data);
      }
    });

    // construct controller
    controller('LoginController', {
      $scope: scope,
      $location: location,
      restService: locationService,
      sessionService: sessionService
    });

    // mock sessionService.loadCredentials
    spyOn(sessionService, 'loadCredentials').and.returnValue(q.when({}));

    expect(sessionService.get).toHaveBeenCalled();
    expect(location.path).toHaveBeenCalledWith('/dashboard');
  });

  it('should show session expired message if indicated by state', function() {
    stateParams.showLoginMessage = true;

    // construct controller
    controller('LoginController', {
      $scope: scope,
      $location: location,
      restService: locationService,
      sessionService: sessionService
    });

    expect(scope.errorMessage).toEqual('You are not authenticated or your session expired. Please login.');
  });
});
