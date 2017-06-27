'use strict';

describe('sessionService', function () {

  var SESSION_RESOURCE_PATH = '/openmrs/ws/rest/v1/session';

  var sessionService, $rootScope, $httpBackend, $cookies, localStorageService;

  beforeEach(module('authentication'));

  beforeEach(inject(function (_sessionService_, _$httpBackend_, _$cookies_, _$rootScope_, _localStorageService_) {
    sessionService = _sessionService_;
    $httpBackend = _$httpBackend_;
    $cookies = _$cookies_;
    $rootScope = _$rootScope_;
    localStorageService = _localStorageService_;
  }));

  describe('loginUser', function () {

    var loginRequest;
    var username = 'username';

    beforeEach(function () {
      loginRequest = $httpBackend.expectGET(SESSION_RESOURCE_PATH);
      $cookies.remove(Bahmni.Common.Constants.currentUser);
    });

    describe('user authenticated', function () {

      beforeEach(function () {
        loginRequest.respond({authenticated: true});
      });

      it('should save authenticated user in cookie', function () {

        sessionService.loginUser(username, '');

        $httpBackend.flush();
        expect($cookies.get(Bahmni.Common.Constants.currentUser)).toEqual(username);
      });

    });

    describe('user not authenticated', function () {

      beforeEach(function () {
        loginRequest.respond({authenticated: false});
      });

      it('should not save unauthenticated user in cookie', function () {

        sessionService.loginUser(username, '');

        $httpBackend.flush();
        expect($cookies.get(Bahmni.Common.Constants.currentUser)).toBeUndefined();

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

      $cookies.put(Bahmni.Common.Constants.currentUser, 'currentUser');

      sessionService.destroy();

      $httpBackend.flush();
      expect($cookies.get(Bahmni.Common.Constants.currentUser)).toBeUndefined();

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
});
