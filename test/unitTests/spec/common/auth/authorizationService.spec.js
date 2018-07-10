'use strict';

describe('authorizationService', () => {

  var authorizationService, sessionService, $q, $rootScope, $log;

  var session = {
    user: {
      roles: [
        {display: 'Data Manager'},
        {display: 'M and E Coordinator'}
      ],
      privileges: [
        {display: 'Read Vital'},
        {display: 'Patient Dashboard - View Visits Section'}
      ]
    }
  };

  beforeEach(module('authentication'));

  beforeEach(inject((_authorizationService_, _sessionService_, _$q_, _$rootScope_, _$log_) => {
    authorizationService = _authorizationService_;
    sessionService = _sessionService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $log = _$log_;
  }));

  describe('hasRole', () => {

    describe('session available', () => {

      beforeEach(() => {
        spyOn(sessionService, 'getSession').and.callFake(() => $q(resolve => resolve(session)));
      });

      it('should check if logged user has role', () => {

        var hasRole;

        authorizationService.hasRole(['Data Manager']).then(v => {
          hasRole = v;
        });

        $rootScope.$apply();
        expect(hasRole).toBe(true);

      });
    });

    describe('error getting session', () => {

      beforeEach(() => {
        spyOn(sessionService, 'getSession').and.callFake(() => $q((resolve, reject) => reject({data: {error: {message: ''}}})));
        spyOn($log, 'error').and.callFake(() => {});
      });

      it('should log error cause', () => {

        var hasRole;

        authorizationService.hasRole(['Data Manager']).then(v => {
          hasRole = v;
        });

        $rootScope.$apply();
        expect($log.error).toHaveBeenCalled();
        expect(hasRole).toBeUndefined();

      });

    });

  });

  describe('hasPrivilege', () => {

    describe('session available', () => {

      beforeEach(() => {
        spyOn(sessionService, 'getSession').and.callFake(() => $q(resolve => resolve(session)));
      });

      it('should check if logged user has privilege', () => {

        var hasPrivilege;

        authorizationService.hasPrivilege('Patient Dashboard - View Visits Section').then(v => {
          hasPrivilege = v;
        });

        $rootScope.$apply();
        expect(hasPrivilege).toBe(true);

      });
    });

    describe('error getting session', () => {

      beforeEach(() => {
        spyOn(sessionService, 'getSession').and.callFake(() => $q((resolve, reject) => reject({data: {error: {message: ''}}})));
        spyOn($log, 'error').and.callFake(() => {});
      });

      it('should log error cause', () => {

        var hasPrivilege;

        authorizationService.hasPrivilege('Delete Relationships').then(v => {
          hasPrivilege = v;
        });

        $rootScope.$apply();
        expect($log.error).toHaveBeenCalled();
        expect(hasPrivilege).toBeUndefined();

      });

    });

  });

  describe('authorizeApps', () => {

    var apps = [{roles: ['Data Manager']}, {roles: ['Clinical Research Manager']}, {name: 'APP_REGISTRATION'}];

    beforeEach(() => {
      spyOn(sessionService, 'getSession').and.callFake(() => $q(resolve => resolve(session)));
    });


    it('should return apps which logged user is authorized', () => {

      var authApps;

      authorizationService.authorizeApps(apps).then(apps => {
        authApps = apps;
      });

      $rootScope.$apply();
      expect(authApps).toContain({roles: ['Data Manager']});
      expect(authApps).not.toContain({roles: ['Clinical Research Manager']});

    });

    it('should return apps with no role defined', () => {

      var authApps;

      authorizationService.authorizeApps(apps).then(apps => {
        authApps = apps;
      });

      $rootScope.$apply();
      expect(authApps).toContain({name: 'APP_REGISTRATION'});

    });

  });

  describe('authorizeClinicalServices', () => {

    var clinicalServices = [{privilege: 'Vital'}, {privilege: 'Anamnesis'}];

    beforeEach(() => {
      spyOn(sessionService, 'getSession').and.callFake(() => $q(resolve => resolve(session)));
    });

    it('should return clinical services for which logged user has at least one of privileges', () => {

      var authClinicalServices;

      authorizationService.authorizeClinicalServices(clinicalServices).then(services => {
        authClinicalServices = services;
      });

      $rootScope.$apply();
      expect(authClinicalServices).toContain({privilege: 'Vital'});
      expect(authClinicalServices).not.toContain({privilege: 'Anamnesis'});
    });

  });

  describe('isUserAuthorizedForApp', () => {

    beforeEach(() => {
      spyOn(sessionService, 'getSession').and.callFake(() => $q(resolve => resolve(session)));
    });

    it('should return true if user has role authorized for using app', () => {

      const apps = [{id: 'reports', roles: ['Data Manager']}, {roles: ['Clinical Research Manager']}, {name: 'APP_REGISTRATION'}];

      let authorized;
      authorizationService.isUserAuthorizedForApp(apps, 'reports').then(isAuthorized => {
        authorized = isAuthorized;
      });

      $rootScope.$apply();

      expect(authorized).toBe(true);
    });

    it('should return false if user has no role authorized for using app', () => {

      const apps = [{id: 'reports', roles: ['Data Manager']}, {id: 'clinic',roles: ['Clinical Research Manager']}, {name: 'APP_REGISTRATION'}];

      let authorized;
      authorizationService.isUserAuthorizedForApp(apps, 'clinic').then(isAuthorized => {
        authorized = isAuthorized;
      });

      $rootScope.$apply();

      expect(authorized).toBe(false);
    });

  });

});
