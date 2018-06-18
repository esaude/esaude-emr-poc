'use strict';

describe('sessionService', () => {

  var SESSION_RESOURCE_PATH = '/openmrs/ws/rest/v1/session';

  var CURRENT_USER_COOKIE_KEY = 'user';

  var sessionService, $rootScope, $httpBackend, $cookies, localStorageService, userService, $q, $log, locationService;

  beforeEach(module('authentication'));

  beforeEach(inject((_sessionService_, _$httpBackend_, _$cookies_, _$rootScope_, _localStorageService_,
                     _userService_, _$q_, _$log_, _locationService_) => {
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

  describe('loginUser', () => {

    var loginRequest;
    var user = {username: 'username', uuid: '85a05c5e-1e3d-11e0-acca-000c29d83bf2'};

    beforeEach(() => {
      loginRequest = $httpBackend.expectGET(SESSION_RESOURCE_PATH);
      $cookies.remove(CURRENT_USER_COOKIE_KEY);
    });

    describe('user authenticated', () => {

      var location = {uuid: "8d6c993e-c2cc-11de-8d13-0010c6dffd0f", display: "Local Desconhecido", code: "1020612"};

      beforeEach(() => {
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

      it('should save authenticated user in cookie', () => {

        spyOn(locationService, 'getDefaultLocation').and.callFake(() => $q(resolve => resolve(location)));

        sessionService.loginUser(user.username, '');

        $httpBackend.flush();
        expect($cookies.get(CURRENT_USER_COOKIE_KEY)).toEqual(user.username);
      });

      it('should save current location in cookie', () => {
        spyOn(locationService, 'getDefaultLocation').and.callFake(() => $q(resolve => resolve(location)));

        spyOn(localStorageService.cookie, 'set');

        sessionService.loginUser(user.username, '');

        $httpBackend.flush();
        var params = {name: location.display, uuid: location.uuid, code: '1020612'};
        expect(localStorageService.cookie.set).toHaveBeenCalledWith('emr.location', params, 7);
      });

      describe('cannot load default location', () => {

        beforeEach(() => {
          spyOn(locationService, 'getDefaultLocation').and.callFake(() => $q((resolve, reject) => reject('LOGIN_LABEL_LOGIN_ERROR_NO_DEFAULT_LOCATION')));

          spyOn($rootScope, '$broadcast').and.callThrough();
        });


        it('should broadcast login required', () => {
          var err;
          sessionService.loginUser(user.username, '').catch(error => {
            err = error;
          });
          $httpBackend.flush();
          expect(err).toEqual('LOGIN_LABEL_LOGIN_ERROR_NO_DEFAULT_LOCATION');
          expect($rootScope.$broadcast).toHaveBeenCalled();
        });

      });



    });

    describe('user not authenticated', () => {

      beforeEach(() => {
        loginRequest.respond({authenticated: false});
      });

      it('should not save unauthenticated user in cookie', () => {

        sessionService.loginUser(user.username, '');

        $httpBackend.flush();
        expect($cookies.get(CURRENT_USER_COOKIE_KEY)).toBeUndefined();

      });

    });

    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

  });

  describe('destroy', () => {

    beforeEach(() => {
      $httpBackend.expectDELETE(SESSION_RESOURCE_PATH)
        .respond(null);
    });

    it('should remove current user from cookie', () => {

      $cookies.put(CURRENT_USER_COOKIE_KEY, 'currentUser');

      sessionService.destroy();

      $httpBackend.flush();
      expect($cookies.get(CURRENT_USER_COOKIE_KEY)).toBeUndefined();

    });

    it('should remove current user from $rootScope', () => {

      $rootScope.currentUser = {};

      sessionService.destroy();

      $httpBackend.flush();
      expect($rootScope.currentUser).toBeNull();
    });

    it('should remove emr.location from localStorage', () => {

      localStorageService.cookie.set('emr.location', 'location');

      sessionService.destroy();

      $httpBackend.flush();
      expect(localStorageService.cookie.get('emr.location')).toBeNull();

    });

    it('should broadcast logout event', () => {

      spyOn($rootScope, '$broadcast').and.callThrough();

      sessionService.destroy();

      $httpBackend.flush();

      expect($rootScope.$broadcast).toHaveBeenCalledWith('event:auth-logout');

    });

    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

  });

  describe('getCurrentUser', () => {

    var mockUser = { username: 'Malocy' };

    beforeEach(() => {
    });

    it('should load logged in user details', () => {

      spyOn($cookies, 'get').and.returnValue(mockUser.username);

      spyOn(userService, 'getUser').and.callFake(() => $q(resolve => resolve({data: {results: [mockUser]}})));

      var user;

      sessionService.getCurrentUser().then(currentUser => {
        user = currentUser;
      });

      $rootScope.$apply();
      expect(user).toEqual(mockUser);
    });

    describe('failed to get logged in user details', () => {

      beforeEach(() => {
        spyOn($cookies, 'get').and.returnValue(mockUser.username);

        spyOn($log, 'error').and.callFake(() => {
        });
      });

      it('should log error message', () => {

        spyOn(userService, 'getUser').and.callFake(() => $q((resolve, reject) => reject({data: {error: {message: ''}}})));

        sessionService.getCurrentUser();
        $rootScope.$apply();
        expect($log.error).toHaveBeenCalled();
      });
    });

    describe('user not logged in', () => {

      it('should return nothing', () => {

        spyOn($cookies, 'get').and.returnValue(null);

        var user;

        sessionService.getCurrentUser().then(currentUser => {
          user = currentUser;
        });

        $rootScope.$apply();
        expect(user).toBeNull();
      });

    });
  });

  describe('getCurrentProvider', () => {
    var mockUser = {username: 'Malocy'};
    var mockProvider = {display: '21-6 - Generic Provider'};

    beforeEach(() => {
      $httpBackend
        .expectGET('/openmrs/ws/rest/v1/provider')
        .respond({results: [mockProvider]});

      spyOn(userService, 'getUser').and.callFake(() => $q(resolve => resolve({data: {results: [mockUser]}})));

      spyOn($cookies, 'get').and.returnValue(mockUser.username);
    });

    it('should load provider details for logged in user', () => {
      var provider;

      sessionService.getCurrentProvider().then(currentProvider => {
        provider = currentProvider;
      });

      $httpBackend.flush();
      expect(provider).toEqual(mockProvider);
    });

    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

  });

  describe('setLocale', () => {

    var locale = 'pt_MZ';

    beforeEach(() => {
      $httpBackend
        .expectPOST('/openmrs/ws/rest/v1/session', {locale: locale})
        .respond();
    });

    it('should set set selected locale', () => {
      sessionService.setLocale(locale);
      $httpBackend.flush();
    });

    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

  });

  describe('loadCredentials', () => {

    describe('no current user', () => {

      it('should destroy current session', () => {

        spyOn($cookies, 'get').and.returnValue(null);

        $httpBackend.expectDELETE(SESSION_RESOURCE_PATH)
          .respond(null);

        sessionService.loadCredentials();

        $httpBackend.flush();

      });


      it('should broadcast login required event', () => {

        spyOn($cookies, 'get').and.returnValue(null);

        spyOn($rootScope, '$broadcast').and.callThrough();

        $httpBackend.expectDELETE(SESSION_RESOURCE_PATH)
          .respond(null);

        sessionService.loadCredentials();

        $httpBackend.flush();

        expect($rootScope.$broadcast).toHaveBeenCalled();

      });


    });

    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

  });

});
