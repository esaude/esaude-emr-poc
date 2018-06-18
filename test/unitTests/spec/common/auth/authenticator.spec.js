'use strict';

describe('authenticator', () => {

  var authenticator, $rootScope, $q, sessionService;

  beforeEach(module('authentication'));

  beforeEach(inject((_authenticator_, _$rootScope_, _$q_, _sessionService_) => {
    authenticator = _authenticator_;
    $rootScope = _$rootScope_;
    $q = _$q_;
    sessionService = _sessionService_;
  }));

  describe('authenticateUser', () => {

    beforeEach(() => {
      spyOn($rootScope, '$broadcast').and.callThrough();
    });

    describe('user not authenticated', () => {

      beforeEach(() => {
        spyOn(sessionService, 'getSession').and.callFake(() => $q(resolve => resolve({authenticated: false})));
      });

      it('should broadcast event signaling required login', () => {

        authenticator.authenticateUser();

        $rootScope.$apply();
        expect($rootScope.$broadcast).toHaveBeenCalledWith('event:auth-loginRequired', 'LOGIN_LABEL_LOGIN_ERROR_MESSAGE_KEY');
      });

    });

    describe('authentication error', () => {

      beforeEach(() => {
        spyOn(sessionService, 'getSession').and.callFake(() => $q((resolve, reject) => reject({authenticated: true})));
      });

      it('should broadcast event signaling required login', () => {

        authenticator.authenticateUser();

        $rootScope.$apply();
        expect($rootScope.$broadcast).toHaveBeenCalledWith('event:auth-loginRequired', 'LOGIN_LABEL_LOGIN_ERROR_MESSAGE_KEY');
      });

    });

  });

});
