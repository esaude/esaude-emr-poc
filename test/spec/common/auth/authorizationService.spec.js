'use strict';

describe('authorizationService', function () {

  var authorizationService, sessionService, $q, $rootScope, $log;

  var session = {
    user: {
      roles: [
        {display: 'Data Manager'},
        {display: 'M and E Coordinator'}
      ],
      privileges: [
        {display: 'Get Forms'},
        {display: 'Patient Dashboard - View Visits Section'}
      ]
    }
  };

  beforeEach(module('authentication'));

  beforeEach(inject(function (_authorizationService_, _sessionService_, _$q_, _$rootScope_, _$log_) {
    authorizationService = _authorizationService_;
    sessionService = _sessionService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $log = _$log_;
  }));

  describe('hasRole', function () {

    describe('session available', function () {

      beforeEach(function () {
        spyOn(sessionService, 'getSession').and.callFake(function () {
          return $q(function (resolve) {
            return resolve(session);
          });
        });
      });

      it('should check if logged user has role', function () {

        var hasRole;

        authorizationService.hasRole('Data Manager').then(function (v) {
          hasRole = v;
        });

        $rootScope.$apply();
        expect(hasRole).toBe(true);

      });
    });

    describe('error getting session', function () {

      beforeEach(function () {
        spyOn(sessionService, 'getSession').and.callFake(function () {
          return $q(function (resolve, reject) {
            return reject();
          });
        });
        spyOn($log, 'error').and.callFake(function () {});
      });

      it('should log error cause', function () {

        var hasRole;

        authorizationService.hasRole('Data Manager').then(function (v) {
          hasRole = v;
        });

        $rootScope.$apply();
        expect($log.error).toHaveBeenCalled();
        expect(hasRole).toBeUndefined();

      });

    });

  });

  describe('hasPrivilege', function () {

    describe('session available', function () {

      beforeEach(function () {
        spyOn(sessionService, 'getSession').and.callFake(function () {
          return $q(function (resolve) {
            return resolve(session);
          });
        });
      });

      it('should check if logged user has privilege', function () {

        var hasPrivilege;

        authorizationService.hasPrivilege('Patient Dashboard - View Visits Section').then(function (v) {
          hasPrivilege = v;
        });

        $rootScope.$apply();
        expect(hasPrivilege).toBe(true);

      });
    });

    describe('error getting session', function () {

      beforeEach(function () {
        spyOn(sessionService, 'getSession').and.callFake(function () {
          return $q(function (resolve, reject) {
            return reject();
          });
        });
        spyOn($log, 'error').and.callFake(function () {});
      });

      it('should log error cause', function () {

        var hasPrivilege;

        authorizationService.hasPrivilege('Delete Relationships').then(function (v) {
          hasPrivilege = v;
        });

        $rootScope.$apply();
        expect($log.error).toHaveBeenCalled();
        expect(hasPrivilege).toBeUndefined();

      });

    });

  });
});
