'use strict';

describe('pocAuthorize', function () {

  var $compile, $rootScope, $q, authorizationService;

  beforeEach(module('authentication'));

  beforeEach(inject(function (_$compile_, _authorizationService_, _$rootScope_, _$q_) {
    $compile = _$compile_;
    authorizationService = _authorizationService_;
    $rootScope = _$rootScope_;
    $q = _$q_;
  }));

  describe('user authorized', function () {

    beforeEach(function () {
      spyOn(authorizationService, 'hasRole').and.callFake(function () {
        return $q(function (resolve) {
          resolve(true);
        })
      });
    });

    it('shows the contents', function () {

      var element = $compile('<poc-authorize role="\'Data Manager\'"><div>Data Manager Only!</div></poc-authorize>')($rootScope);

      $rootScope.$digest();
      expect(element.html()).toContain('Data Manager Only!');
    });

  });

  describe('user not authorized', function () {

    beforeEach(function () {
      spyOn(authorizationService, 'hasRole').and.callFake(function () {
        return $q(function (resolve) {
          resolve(false);
        })
      });
    });

    it('does not show the contents', function () {

      var element = $compile('<poc-authorize role="\'Data Manager\'"><div>Data Manager Only!</div></poc-authorize>')($rootScope);

      $rootScope.$digest();
      expect(element.html()).not.toContain('Data Manager Only!');
    });

  });

});
