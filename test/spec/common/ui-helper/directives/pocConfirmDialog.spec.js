'use strict';
describe('pocConfirmDialog', function () {

  var $compile, $document, $rootScope, element, message, ngDialog, onConfirm, onCancel;

  beforeEach(module('bahmni.common.uiHelper', 'templates'));

  beforeEach(inject(function (_$compile_, _$document_, _$rootScope_, _ngDialog_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $document = _$document_;
    ngDialog = _ngDialog_;
  }));

  beforeEach(function () {
    message = 'Are you sure?';
    onConfirm = jasmine.createSpy('onConfirm');
    onCancel = jasmine.createSpy('onCancel');

    $rootScope.onConfirm = onConfirm;
    $rootScope.onCancel  = onCancel;

    var html = '<button id="button" poc-confirm-dialog="\'' + message + '\'" on-confirm="onConfirm()" on-cancel="onCancel()" class="btn-danger">Delete</button>';
    element = $compile(html)($rootScope);
    angular.element(document.body).append(element);

    $rootScope.$digest();
  });

  xdescribe('clicked', function () {

    // TODO: for some reason the dialog is not appended to body
    it('should show a modal dialog', function () {

      element.click();

      var dialog = $document.find('.ngdialog')[0];

      expect(dialog).toBeDefined();

    });

  });

});
