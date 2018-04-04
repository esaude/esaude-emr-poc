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

});
