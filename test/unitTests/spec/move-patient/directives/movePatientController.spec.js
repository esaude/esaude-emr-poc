'use strict';

describe('MovePatientController', () => {

  var $controller, $q, $rootScope, appService, applicationService, ngDialog;

  beforeEach(module('movepatient'));

  beforeEach(inject((_$controller_, _$q_, _$rootScope_, _applicationService_, _appService_, _ngDialog_) => {
    $controller = _$controller_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    applicationService = _applicationService_;
    appService = _appService_;
    ngDialog = _ngDialog_;
  }));

  beforeEach(() => {
    spyOn(applicationService, 'getApps').and.callFake(() => $q(resolve => resolve([])));
    spyOn(appService, 'getAppDescriptor').and.returnValue({
      getId: () => 1
    });
  });

  describe('showDialog', () => {

    it('should show dialog', () => {

      spyOn(ngDialog, 'open');

      var ctrl = $controller('MovePatientController',{
        $scope: $rootScope.$new()
      });

      ctrl.showDialog();

      expect(ngDialog.open).toHaveBeenCalled();

    });

  });

});
