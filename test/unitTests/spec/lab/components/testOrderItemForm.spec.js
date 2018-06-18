describe('TestOrderItemFormController', () => {

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
  beforeEach(inject((_$componentController_, _patientService_, _$q_) => {
    $componentController = _$componentController_;
    $q = _$q_;
  }));

  describe('$onChanges', () => {

    it('should clone the test order item', () => {

      var ctrl = $componentController('testOrderResultItemForm');

      ctrl.$onChanges({item: {currentValue: testOrderItem}});

      expect(ctrl.$item).not.toBe(testOrderItem);
      expect(ctrl.$item).toEqual(testOrderItem);

    });

    it('should cast numeric datatype to number', () => {

      var ctrl = $componentController('testOrderResultItemForm');

      ctrl.$onChanges({item: {currentValue: {testOrder: {concept: {datatype: {display: 'Numeric'}}}, value: "2"}}});

      expect(ctrl.$item.value).toEqual(2);

    });

  });

  describe('isNumeric', () => {

    it('should return true if the test result item concept is of Numeric datatype', () => {

      var ctrl = $componentController('testOrderResultItemForm');

      ctrl.$onChanges({item: {currentValue: {testOrder: {concept: {datatype: {display: 'Numeric'}}}, value: "2"}}});

      expect(ctrl.isNumeric()).toBe(true);

    });

  });

  describe('hasError', () => {

    it('should return true if the form is in focus, dirty and not valid', () => {

      var ctrl = $componentController('testOrderResultItemForm');

      ctrl.hasFocus = true;
      var hasError = ctrl.hasError({$dirty: true, $valid: false});

      expect(hasError).toBe(true);
    });

  });

  describe('hasSuccess', () => {

    it('should return true if the form is in focus, dirty and valid', () => {

      var ctrl = $componentController('testOrderResultItemForm');

      ctrl.hasFocus = true;
      var hasSuccess = ctrl.hasSuccess({$dirty: true, $valid: true});

      expect(hasSuccess).toBe(true);

    });

  });

  describe('isInvalid', () => {

    it('should return true if the form is dirty, and not valid', () => {

      var ctrl = $componentController('testOrderResultItemForm');

      var isInvalid = ctrl.isInvalid({$dirty: true, $valid: false});

      expect(isInvalid).toBe(true);

    });

  });

  describe('onFocus', () => {

    it('should add flag indicating that the form is focused', () => {

      var ctrl = $componentController('testOrderResultItemForm');

      expect(ctrl.hasFocus).toBeFalsy();

      ctrl.onFocus();

      expect(ctrl.hasFocus).toBe(true);

    });

    it('should show buttons', () => {

      var ctrl = $componentController('testOrderResultItemForm');

      ctrl.showButtons = false;

      ctrl.onFocus({});

      expect(ctrl.showButtons).toBe(true);

    });

  });

  describe('onBlur', () => {

    it('should remove flag indicating that the form is focused', () => {

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

    describe('form is not valid', () => {

      it('should reset the value', () => {

        var ctrl = $componentController('testOrderResultItemForm', null, {
          item: {
            testOrder: {concept: {datatype: {display: 'Numeric'}}},
            value: "2"
          }
        });

        ctrl.$item.value = 3;

        ctrl.onBlur({$invalid: true, $setPristine: () => {}});

        expect(ctrl.$item.value).toBe(2);

      });

      it('should is should set form to pristine state', () => {

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

      it('should hide buttons', () => {

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
