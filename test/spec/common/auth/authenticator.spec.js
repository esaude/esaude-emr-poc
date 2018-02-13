'use strict';

describe('authenticator', function () {

  var authenticator, $rootScope, $q, sessionService;

  beforeEach(module('authentication'));

  beforeEach(inject(function (_authenticator_, _$rootScope_, _$q_, _sessionService_) {
    authenticator = _authenticator_;
    $rootScope = _$rootScope_;
    $q = _$q_;
    sessionService = _sessionService_;
  }));

  describe('authenticateUser', function () {

    beforeEach(function () {
      spyOn($rootScope, '$broadcast').and.callThrough();
    });

    describe('user not authenticated', function () {

      beforeEach(function () {
        spyOn(sessionService, 'getSession').and.callFake(function () {
          return $q(function (resolve) {
            return resolve({authenticated: false});
          });
        });
      });

      it('should broadcast event signaling required login', function () {

        authenticator.authenticateUser();

        $rootScope.$apply();
        expect($rootScope.$broadcast).toHaveBeenCalledWith('event:auth-loginRequired', 'LOGIN_LABEL_LOGIN_ERROR_MESSAGE_KEY');
      });

    });

    describe('authentication error', function () {

      beforeEach(function () {
        spyOn(sessionService, 'getSession').and.callFake(function () {
          return $q(function (resolve, reject) {
            return reject({authenticated: true});
          });
        });
      });

      it('should broadcast event signaling required login', function () {

        authenticator.authenticateUser();

        $rootScope.$apply();
        expect($rootScope.$broadcast).toHaveBeenCalledWith('event:auth-loginRequired', 'LOGIN_LABEL_LOGIN_ERROR_MESSAGE_KEY');
      });

    });

  });

});
