describe('TestOrderItemFormController', function () {

  var $componentController, $q, testOrderItem;

  testOrderItem = {
    testOrder: {
      concept: {
        datatype: {display: 'Coded'},
        answers: [
          {
            uuid: '0044c630-9086-11e6-a98e-000c29db4475',
            display: 'Acute Nephritic Syndrome, Focal and Segmental Glomerular Lesions'
          },
          {
            uuid: '00688fdf-9086-11e6-a98e-000c29db4475',
            display: 'Acute Nephritic Syndrome, Diffuse Membranous Glomerulonephritis'
          }
        ]
      }
    },
    value: '0044c630-9086-11e6-a98e-000c29db4475'
  };

  beforeEach(module('lab'));
  beforeEach(inject(function (_$componentController_, _patientService_, _$q_) {
    $componentController = _$componentController_;
    $q = _$q_;
  }));

  describe('$onChanges', function () {

    it('should clone the test order item', function () {

      var ctrl = $componentController('testOrderResultItemForm');

      ctrl.$onChanges({item: {currentValue: testOrderItem}});

      expect(ctrl.$item).not.toBe(testOrderItem);
      expect(ctrl.$item).toEqual(testOrderItem);

    });

    it('should cast numeric datatype to number', function () {

      var ctrl = $componentController('testOrderResultItemForm');

      ctrl.$onChanges({item: {currentValue: {testOrder: {concept: {datatype: {display: 'Numeric'}}}, value: "2"}}});

      expect(ctrl.$item.value).toEqual(2);

    });

  });

  describe('isNumeric', function () {

    it('should return true if the test result item concept is of Numeric datatype', function () {

      var ctrl = $componentController('testOrderResultItemForm');

      ctrl.$onChanges({item: {currentValue: {testOrder: {concept: {datatype: {display: 'Numeric'}}}, value: "2"}}});

      expect(ctrl.isNumeric()).toBe(true);

    });

  });

  describe('hasError', function () {

    it('should return true if the form is in focus, dirty and not valid', function () {

      var ctrl = $componentController('testOrderResultItemForm');

      ctrl.hasFocus = true;
      var hasError = ctrl.hasError({$dirty: true, $valid: false});

      expect(hasError).toBe(true);
    });

  });

  describe('hasSuccess', function () {

    it('should return true if the form is in focus, dirty and valid', function () {

      var ctrl = $componentController('testOrderResultItemForm');

      ctrl.hasFocus = true;
      var hasSuccess = ctrl.hasSuccess({$dirty: true, $valid: true});

      expect(hasSuccess).toBe(true);

    });

  });

  describe('isInvalid', function () {

    it('should return true if the form is dirty, and not valid', function () {

      var ctrl = $componentController('testOrderResultItemForm');

      var isInvalid = ctrl.isInvalid({$dirty: true, $valid: false});

      expect(isInvalid).toBe(true);

    });

  });

  describe('onFocus', function () {

    it('should add flag indicating that the form is focused', function () {

      var ctrl = $componentController('testOrderResultItemForm');

      expect(ctrl.hasFocus).toBeFalsy();

      ctrl.onFocus();

      expect(ctrl.hasFocus).toBe(true);

    });

    it('should show buttons', function () {

      var ctrl = $componentController('testOrderResultItemForm');

      ctrl.showButtons = false;

      ctrl.onFocus({});

      expect(ctrl.showButtons).toBe(true);

    });

  });

  describe('onBlur', function () {

    it('should remove flag indicating that the form is focused', function () {

      var ctrl = $componentController('testOrderResultItemForm', null, {
        item: {
          testOrder: {concept: {datatype: {display: 'Numeric'}}},
          value: "2"
        }
      });

      ctrl.hasFocus = true;

      ctrl.onBlur({});

      expect(ctrl.hasFocus).toBe(false);

    });

    describe('form is not valid', function () {

      it('should reset the value', function () {

        var ctrl = $componentController('testOrderResultItemForm', null, {
          item: {
            testOrder: {concept: {datatype: {display: 'Numeric'}}},
            value: "2"
          }
        });

        ctrl.$item.value = 3;

        ctrl.onBlur({$invalid: true, $setPristine: function () {}});

        expect(ctrl.$item.value).toBe(2);

      });

      it('should is should set form to pristine state', function () {

        var ctrl = $componentController('testOrderResultItemForm', null, {
          item: {
            testOrder: {concept: {datatype: {display: 'Numeric'}}},
            value: "2"
          }
        });

        ctrl.$item.value = 3;

        var $setPristine = jasmine.createSpy('$setPristine');

        ctrl.onBlur({$invalid: true, $setPristine: $setPristine});

        expect($setPristine).toHaveBeenCalled();

      });

      it('should hide buttons', function () {

        var item = {
          testOrder: {concept: {datatype: {display: 'Numeric'}}},
          value: "2"
        };

        var ctrl = $componentController('testOrderResultItemForm', null, {
          item: item
        });

        ctrl.$onChanges({item: {currentValue: item}});

        ctrl.showButtons = true;

        ctrl.onBlur({});

        expect(ctrl.showButtons).toBe(false);

      });

    });
  });


});
