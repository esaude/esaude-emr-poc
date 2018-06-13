'use strict';
describe('pocHeader', function () {

  var $componentController, $q, $rootScope, ctrl;

  var $window = {location: {pathname: '', href: ''}};

  var $event = {preventDefault: jasmine.createSpy('preventDefault')};

  beforeEach(module('application', function ($provide) {
    $provide.value('$window', $window);
  }));

  beforeEach(inject(function (_$componentController_, _$q_, _$rootScope_) {
    $componentController = _$componentController_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  beforeEach(function () {
    ctrl = $componentController('pocHeader');
  });

  describe('$onInit', function () {

    it('should listen for login event', function () {

      spyOn($rootScope, '$on');

      ctrl.$onInit();

      expect($rootScope.$on).toHaveBeenCalledWith('event:auth-login', jasmine.anything());

    });

    it('should listen for logout event', function () {

      spyOn($rootScope, '$on');

      ctrl.$onInit();

      expect($rootScope.$on).toHaveBeenCalledWith('event:auth-logout', jasmine.anything());

    });

  });

  describe('$onDestroy', function () {

    it('should deregister login and logout event callbacks', function () {

      var spy = jasmine.createSpy('deregisterOnLogin');

      spyOn($rootScope, '$on').and.returnValue(spy);

      ctrl.$onInit();

      ctrl.$onDestroy();

      expect(spy).toHaveBeenCalledTimes(2);

    });

  });

  describe('goHome', function () {

    it('should navigate to home dashboard', function () {

      ctrl.goHome($event);

      expect($window.location.href).toEqual('/home');

    });

  });

  describe('isHome', function () {

    it('should return true if current page is home', function () {

      $window.location.pathname = '/poc/home/#/dashboard';

      expect(ctrl.isHome()).toEqual(true);

    });
  });

});
