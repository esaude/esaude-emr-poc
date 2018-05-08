describe('pocConfirmButton', function () {

  var element, onConfirm, onCancel, $compile, $rootScope;

  beforeEach(module('bahmni.common.uiHelper', 'templates'));

  beforeEach(inject(function (_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  beforeEach(function () {
    onConfirm = jasmine.createSpy();
    onCancel = jasmine.createSpy();

    $rootScope.onConfirm = onConfirm;
    $rootScope.onCancel  = onCancel;

    var html = '<poc-confirm-button on-confirm="onConfirm()" on-cancel="onCancel()" class="btn-danger">Delete</poc-confirm-button>';
    element = $compile(html)($rootScope);

    $rootScope.$digest();
  });


  it('should show a button with given class and transcluded content', function () {

    var button = element.find('button#button');

    expect(button.hasClass('btn-danger')).toBe(true);
    expect(button.hasClass('ng-hide')).toBe(false);
    expect(button.html()).toContain('Delete');

  });

  describe('clicked', function () {

    var button, confirmation;

    beforeEach(function () {
      button = element.find('button#button');
      confirmation = element.find('.confirmation');
    });

    it('should show confirm and cancel buttons', function () {

      expect(confirmation.hasClass('ng-hide')).toBe(true);

      button.click();

      expect(confirmation.hasClass('ng-hide')).toBe(false);

    });

    describe('confirmed', function () {

      var confirmBtn;

      beforeEach(function () {
        confirmBtn = confirmation.find('.btn-danger');
        button.click();
      });

      it('should call on-confirm binding', function () {

        confirmBtn.click();

        expect(onConfirm).toHaveBeenCalled();

      });

    });


    describe('canceled', function () {

      var cancelBtn;

      beforeEach(function () {
        cancelBtn = confirmation.find('.btn-warning');
        button.click();
      });

      it('should call on-cancel binding', function () {

        cancelBtn.click();

        expect(onCancel).toHaveBeenCalled();

      });

      it('should hide confirm and cancel buttons', function () {

        expect(confirmation.hasClass('ng-hide')).toBe(false);

        cancelBtn.click();

        expect(confirmation.hasClass('ng-hide')).toBe(true);

      });

      it('should hide confirm and cancel buttons', function () {

        expect(confirmation.hasClass('ng-hide')).toBe(false);

        cancelBtn.click();

        expect(confirmation.hasClass('ng-hide')).toBe(true);

      });

    });
  });

});
