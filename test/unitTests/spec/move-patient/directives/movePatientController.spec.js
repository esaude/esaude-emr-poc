'use strict';

describe('MovePatientController', function () {

  var $controller, $q, $rootScope, appService, controller, applicationService;

  beforeEach(module('movepatient'));

  beforeEach(inject(function (_$controller_, _$q_, _$rootScope_, _applicationService_, _appService_) {
    $controller = _$controller_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    applicationService = _applicationService_;
    appService = _appService_;
  }));

  beforeEach(function () {
    spyOn(applicationService, 'getApps').and.callFake(function () {
      return $q(function (resolve) {
        return resolve([]);
      });
    });
    spyOn(appService, 'getAppDescriptor').and.returnValue({
      getId: function () {
        return 1;
      }
    });
  });

  beforeEach(function () {
    controller = $controller('MovePatientController',{
      $scope: $rootScope.$new()
    });
  });

});
