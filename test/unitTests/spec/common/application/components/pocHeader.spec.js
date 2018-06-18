'use strict';
describe('pocHeader', () => {

  var $componentController, $q, $rootScope, ctrl;

  var $window = {location: {pathname: '', href: ''}};

  var $event = {preventDefault: jasmine.createSpy('preventDefault')};

  beforeEach(module('application', $provide => {
    $provide.value('$window', $window);
  }));

  beforeEach(inject((_$componentController_, _$q_, _$rootScope_) => {
    $componentController = _$componentController_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  beforeEach(() => {
    ctrl = $componentController('pocHeader');
  });

  describe('$onInit', () => {

    it('should listen for login event', () => {

      spyOn($rootScope, '$on');

      ctrl.$onInit();

      expect($rootScope.$on).toHaveBeenCalledWith('event:auth-login', jasmine.anything());

    });

    it('should listen for logout event', () => {

      spyOn($rootScope, '$on');

      ctrl.$onInit();

      expect($rootScope.$on).toHaveBeenCalledWith('event:auth-logout', jasmine.anything());

    });

  });

  describe('$onDestroy', () => {

    it('should deregister login and logout event callbacks', () => {

      var spy = jasmine.createSpy('deregisterOnLogin');

      spyOn($rootScope, '$on').and.returnValue(spy);

      ctrl.$onInit();

      ctrl.$onDestroy();

      expect(spy).toHaveBeenCalledTimes(2);

    });

  });

  describe('goHome', () => {

    it('should navigate to home dashboard', () => {

      ctrl.goHome($event);

      expect($window.location.href).toEqual('/home');

    });

  });

  describe('isHome', () => {

    it('should return true if current page is home', () => {

      $window.location.pathname = '/poc/home/#/dashboard';

      expect(ctrl.isHome()).toEqual(true);

    });
  });

});
