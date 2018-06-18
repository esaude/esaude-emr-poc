'use strict';

describe('MovePatientController', function () {

  var $controller, $q, $rootScope, appService, applicationService, ngDialog;

  beforeEach(module('movepatient'));

  beforeEach(inject(function (_$controller_, _$q_, _$rootScope_, _applicationService_, _appService_, _ngDialog_) {
    $controller = _$controller_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    applicationService = _applicationService_;
    appService = _appService_;
    ngDialog = _ngDialog_;
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

  describe('showDialog', function () {

    it('should show dialog', function () {

      spyOn(ngDialog, 'open');

      var ctrl = $controller('MovePatientController',{
        $scope: $rootScope.$new()
      });

      ctrl.showDialog();

      expect(ngDialog.open).toHaveBeenCalled();

    });

  });

});
