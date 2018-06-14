'use strict';

describe('sessionService', function () {

  var SESSION_RESOURCE_PATH = '/openmrs/ws/rest/v1/session';

  var CURRENT_USER_COOKIE_KEY = 'user';

  var sessionService, $rootScope, $httpBackend, $cookies, localStorageService, userService, $q, $log, locationService;

  beforeEach(module('authentication'));

  beforeEach(inject(function (_sessionService_, _$httpBackend_, _$cookies_, _$rootScope_, _localStorageService_,
                              _userService_, _$q_, _$log_, _locationService_) {
    sessionService = _sessionService_;
    $httpBackend = _$httpBackend_;
    $cookies = _$cookies_;
    $rootScope = _$rootScope_;
    localStorageService = _localStorageService_;
    userService = _userService_;
    $q = _$q_;
    $log = _$log_;
    locationService = _locationService_;
  }));

  describe('loginUser', function () {

    var loginRequest;
    var user = {username: 'username', uuid: '85a05c5e-1e3d-11e0-acca-000c29d83bf2'};

    beforeEach(function () {
      loginRequest = $httpBackend.expectGET(SESSION_RESOURCE_PATH);
      $cookies.remove(CURRENT_USER_COOKIE_KEY);
    });

    describe('user authenticated', function () {

      var location = {uuid: "8d6c993e-c2cc-11de-8d13-0010c6dffd0f", display: "Local Desconhecido", code: "1020612"};

      beforeEach(function () {
        loginRequest.respond({authenticated: true});
        // TODO: use mock instead of expectGET after refactoring userService.
        $httpBackend.expectGET('/openmrs/ws/rest/v1/user?username='
          + user.username
          + '&v=custom:(username,uuid,person:(uuid,preferredName),privileges:(name,retired),userProperties)')
          .respond({results: [user]});
        // TODO: use mock instead of expectGET after refactoring userService.
        $httpBackend.expectGET('/openmrs/ws/rest/v1/provider?user=' + user.uuid)
          .respond({results: [{uuid: '7c59c517-bfd1-487d-a76f-0b90cd975fd1', display: ''}]});
      });

      it('should save authenticated user in cookie', function () {

        spyOn(locationService, 'getDefaultLocation').and.callFake(function () {
          return $q(function (resolve) {
            return resolve(location);
          });
        });

        sessionService.loginUser(user.username, '');

        $httpBackend.flush();
        expect($cookies.get(CURRENT_USER_COOKIE_KEY)).toEqual(user.username);
      });

      it('should save current location in cookie', function () {
        spyOn(locationService, 'getDefaultLocation').and.callFake(function () {
          return $q(function (resolve) {
            return resolve(location);
          });
        });

        spyOn(localStorageService.cookie, 'set');

        sessionService.loginUser(user.username, '');

        $httpBackend.flush();
        var params = {name: location.display, uuid: location.uuid, code: '1020612'};
        expect(localStorageService.cookie.set).toHaveBeenCalledWith('emr.location', params, 7);
      });

      describe('cannot load default location', function () {

        beforeEach(function () {
          spyOn(locationService, 'getDefaultLocation').and.callFake(function () {
            return $q(function (resolve, reject) {
              return reject('LOGIN_LABEL_LOGIN_ERROR_NO_DEFAULT_LOCATION');
            });
          });

          spyOn($rootScope, '$broadcast').and.callThrough();
        });


        it('should broadcast login required', function () {
          var err;
          sessionService.loginUser(user.username, '').catch(function (error) {
            err = error;
          });
          $httpBackend.flush();
          expect(err).toEqual('LOGIN_LABEL_LOGIN_ERROR_NO_DEFAULT_LOCATION');
          expect($rootScope.$broadcast).toHaveBeenCalled();
        });

      });



    });

    describe('user not authenticated', function () {

      beforeEach(function () {
        loginRequest.respond({authenticated: false});
      });

      it('should not save unauthenticated user in cookie', function () {

        sessionService.loginUser(user.username, '');

        $httpBackend.flush();
        expect($cookies.get(CURRENT_USER_COOKIE_KEY)).toBeUndefined();

      });

    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

  });

  describe('destroy', function () {

    beforeEach(function () {
      $httpBackend.expectDELETE(SESSION_RESOURCE_PATH)
        .respond(null);
    });

    it('should remove current user from cookie', function () {

      $cookies.put(CURRENT_USER_COOKIE_KEY, 'currentUser');

      sessionService.destroy();

      $httpBackend.flush();
      expect($cookies.get(CURRENT_USER_COOKIE_KEY)).toBeUndefined();

    });

    it('should remove current user from $rootScope', function () {

      $rootScope.currentUser = {};

      sessionService.destroy();

      $httpBackend.flush();
      expect($rootScope.currentUser).toBeNull();
    });

    it('should remove emr.location from localStorage', function () {

      localStorageService.cookie.set('emr.location', 'location');

      sessionService.destroy();

      $httpBackend.flush();
      expect(localStorageService.cookie.get('emr.location')).toBeNull();

    });

    it('should broadcast logout event', function () {

      spyOn($rootScope, '$broadcast').and.callThrough();

      sessionService.destroy();

      $httpBackend.flush();

      expect($rootScope.$broadcast).toHaveBeenCalledWith('event:auth-logout');

    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

  });

  describe('getCurrentUser', function () {

    var mockUser = { username: 'Malocy' };

    beforeEach(function () {
    });

    it('should load logged in user details', function () {

      spyOn($cookies, 'get').and.returnValue(mockUser.username);

      spyOn(userService, 'getUser').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({data: {results: [mockUser]}});
        });
      });

      var user;

      sessionService.getCurrentUser().then(function (currentUser) {
        user = currentUser;
      });

      $rootScope.$apply();
      expect(user).toEqual(mockUser);
    });

    describe('failed to get logged in user details', function () {

      beforeEach(function () {
        spyOn($cookies, 'get').and.returnValue(mockUser.username);

        spyOn($log, 'error').and.callFake(function () {
        });
      });

      it('should log error message', function () {

        spyOn(userService, 'getUser').and.callFake(function () {
          return $q(function (resolve, reject) {
            return reject({data: {error: {message: ''}}});
          });
        });

        sessionService.getCurrentUser();
        $rootScope.$apply();
        expect($log.error).toHaveBeenCalled();
      });
    });

    describe('user not logged in', function () {

      it('should return nothing', function () {

        spyOn($cookies, 'get').and.returnValue(null);

        var user;

        sessionService.getCurrentUser().then(function (currentUser) {
          user = currentUser;
        });

        $rootScope.$apply();
        expect(user).toBeNull();
      });

    });
  });

  describe('getCurrentProvider', function () {
    var mockUser = {username: 'Malocy'};
    var mockProvider = {display: '21-6 - Generic Provider'};

    beforeEach(function () {
      $httpBackend
        .expectGET('/openmrs/ws/rest/v1/provider')
        .respond({results: [mockProvider]});

      spyOn(userService, 'getUser').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({data: {results: [mockUser]}});
        });
      });

      spyOn($cookies, 'get').and.returnValue(mockUser.username);
    });

    it('should load provider details for logged in user', function () {
      var provider;

      sessionService.getCurrentProvider().then(function (currentProvider) {
        provider = currentProvider;
      });

      $httpBackend.flush();
      expect(provider).toEqual(mockProvider)
    });

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

  });

  describe('setLocale', function () {

    var locale = 'pt_MZ';

    beforeEach(function () {
      $httpBackend
        .expectPOST('/openmrs/ws/rest/v1/session', {locale: locale})
        .respond();
    });

    it('should set set selected locale', function () {
      sessionService.setLocale(locale);
      $httpBackend.flush();
    });

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

  });

  describe('loadCredentials', function () {

    describe('no current user', function () {

      it('should destroy current session', function () {

        spyOn($cookies, 'get').and.returnValue(null);

        $httpBackend.expectDELETE(SESSION_RESOURCE_PATH)
          .respond(null);

        sessionService.loadCredentials();

        $httpBackend.flush();

      });


      it('should broadcast login required event', function () {

        spyOn($cookies, 'get').and.returnValue(null);

        spyOn($rootScope, '$broadcast').and.callThrough();

        $httpBackend.expectDELETE(SESSION_RESOURCE_PATH)
          .respond(null);

        sessionService.loadCredentials();

        $httpBackend.flush();

        expect($rootScope.$broadcast).toHaveBeenCalled();

      });


    });

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

  });

});
