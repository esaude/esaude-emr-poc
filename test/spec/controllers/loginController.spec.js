describe('Controller: LoginController', function() {
  beforeEach(module('home'));

  var scope, q, controller, location, sessionService, stateParams;

  beforeEach(inject(function($controller, $rootScope, _$location_, _sessionService_, $q, $stateParams) {
    scope = $rootScope.$new();
    q = $q;
    location = _$location_;
    controller = $controller;
    stateParams = $stateParams;
    sessionService = _sessionService_;



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

  it('should redirect the user to the landing page on successful login', function() {
    // construct controller
    controller('LoginController', {
      $scope: scope,
      $location: location,
      sessionService: sessionService
    });

    // mock sessionService.loadCredentials (success)
    spyOn(sessionService, 'loadCredentials').and.returnValue(q.when({}));

    scope.loginUser = {
      username: 'testSuccessUser',
      password: 'testSuccessPass'
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
      sessionService: sessionService
    });

    scope.loginUser = {
      username: 'testFailureUser',
      password: 'testFailurePass'
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
      sessionService: sessionService
    });

    // mock sessionService.loadCredentials (failure)
    spyOn(sessionService, 'loadCredentials').and.callFake(function() {
      return q.reject('failure to load credentials');
    });

    scope.loginUser = {
      username: 'testSuccessUser',
      password: 'testSuccessPass'
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
      sessionService: sessionService
    });

    expect(scope.errorMessage).toEqual('You are not authenticated or your session expired. Please login.');
  });
});
