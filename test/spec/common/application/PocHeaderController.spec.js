'use strict';
describe('PocHeaderController', function () {

  var $controller, $q, $rootScope, ctrl;

  var $window = {location: {pathname: '', href: ''}};

  var $event = {preventDefault: jasmine.createSpy('preventDefault')};

  beforeEach(module('application', function ($provide) {
    $provide.value('$window', $window);
  }));

  beforeEach(inject(function (_$controller_, _$q_, _$rootScope_) {
    $controller = _$controller_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  beforeEach(function () {
    ctrl = $controller('PocHeaderController');
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
