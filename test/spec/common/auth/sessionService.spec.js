'use strict';

describe('sessionService', function () {

  var SESSION_RESOURCE_PATH = '/openmrs/ws/rest/v1/session';

  var CURRENT_USER_COOKIE_KEY = 'user';

  var sessionService, $rootScope, $httpBackend, $cookies, localStorageService, userService, $q, $log;

  beforeEach(module('authentication'));

  beforeEach(inject(function (_sessionService_, _$httpBackend_, _$cookies_, _$rootScope_, _localStorageService_,
                              _userService_, _$q_, _$log_) {
    sessionService = _sessionService_;
    $httpBackend = _$httpBackend_;
    $cookies = _$cookies_;
    $rootScope = _$rootScope_;
    localStorageService = _localStorageService_;
    userService = _userService_;
    $q = _$q_;
    $log = _$log_;
  }));

  describe('loginUser', function () {

    var loginRequest;
    var username = 'username';

    beforeEach(function () {
      loginRequest = $httpBackend.expectGET(SESSION_RESOURCE_PATH);
      $cookies.remove(CURRENT_USER_COOKIE_KEY);
    });

    describe('user authenticated', function () {

      beforeEach(function () {
        loginRequest.respond({authenticated: true});
      });

      it('should save authenticated user in cookie', function () {

        sessionService.loginUser(username, '');

        $httpBackend.flush();
        expect($cookies.get(CURRENT_USER_COOKIE_KEY)).toEqual(username);
      });

    });

    describe('user not authenticated', function () {

      beforeEach(function () {
        loginRequest.respond({authenticated: false});
      });

      it('should not save unauthenticated user in cookie', function () {

        sessionService.loginUser(username, '');

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
        .respond({});
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

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

  });

  describe('getCurrentUser', function () {

    var mockUser = { username: 'Malocy' };

    beforeEach(function () {
      spyOn($cookies, 'get').and.returnValue(mockUser.username);
    });

    it('should load logged in user details', function () {
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

});
