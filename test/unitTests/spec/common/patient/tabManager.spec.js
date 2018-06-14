describe('TabManager', function () {

  var TabManager;

  beforeEach(module('common.patient'));

  beforeEach(inject(function (_TabManager_) {
    TabManager = _TabManager_;
  }));

  describe('constructor', function () {

    it('should instantiate steps', function () {

      var tabManager = new TabManager();

      expect(tabManager.steps).toEqual([]);

    });

    it('should initialize current step', function () {

      var tabManager = new TabManager();

      expect(tabManager.current).toEqual(-1);

    });

  });

  describe('addStepDefinition', function () {

    it('should add new step to steps', function () {

      var tabManager = new TabManager();

      tabManager.addStepDefinition('name');

      expect(tabManager.steps).toContain('name');

    });

    describe('subsequent steps', function () {

      it('should not increment current step', function () {

        var tabManager = new TabManager();

        tabManager.addStepDefinition('first');

        tabManager.addStepDefinition('second');

        expect(tabManager.current).toEqual(0);

      });

    });

    describe('first step', function () {

      it('should increment current step', function () {

        var tabManager = new TabManager();

        tabManager.addStepDefinition('name');

        expect(tabManager.current).toEqual(0);

      });

    });

  });

  describe('stepForward', function () {

    it('should step forward', function () {

      var tabManager = new TabManager();

      tabManager.addStepDefinition('first');

      tabManager.addStepDefinition('second');

      tabManager.stepForward();

      expect(tabManager.current).toEqual(1);

    });

    describe('at last step', function () {

      it('should not step forward', function () {

        var tabManager = new TabManager();

        tabManager.addStepDefinition('first');

        tabManager.addStepDefinition('second');

        tabManager.stepForward();

        tabManager.stepForward();

        expect(tabManager.current).toEqual(1);

      });

    });

  });

  describe('stepBackwards', function () {

    it('should step backwards', function () {

      var tabManager = new TabManager();

      tabManager.addStepDefinition('first');

      tabManager.addStepDefinition('second');

      tabManager.current = 1;

      tabManager.stepBackwards();

      expect(tabManager.current).toEqual(0);

    });

    describe('at first step', function () {

      it('should not step backwards', function () {

        var tabManager = new TabManager();

        tabManager.addStepDefinition('first');

        tabManager.addStepDefinition('second');

        tabManager.stepBackwards();

        expect(tabManager.current).toEqual(0);

      });

    });

  });

  describe('goToStep', function () {

    it('should set current step', function () {

      var tabManager = new TabManager();

      tabManager.addStepDefinition('first');

      tabManager.addStepDefinition('second');

      tabManager.goToStep('second');

      expect(tabManager.current).toEqual(1);

    });

    it('should return the step name', function () {

      var tabManager = new TabManager();

      tabManager.addStepDefinition('first');

      tabManager.addStepDefinition('second');

      expect(tabManager.goToStep('second')).toEqual('second');

    });

    it('should throw if step is not defined', function () {

      var tabManager = new TabManager();

      tabManager.addStepDefinition('first');

      tabManager.addStepDefinition('second');

      expect(() => tabManager.goToStep('third')).toThrow(new Error(`Step 'third' not defined`));

    });

  });

  describe('isLastStep', function () {

    it('should return true if given step is last', function () {

      var tabManager = new TabManager();

      tabManager.addStepDefinition('first');

      tabManager.addStepDefinition('second');

      expect(tabManager.isLastStep('second')).toEqual(true);

    });

  });

  describe('isFirstStep', function () {

    it('should return true if given step is first', function () {

      var tabManager = new TabManager();

      tabManager.addStepDefinition('first');

      tabManager.addStepDefinition('second');

      expect(tabManager.isFirstStep('first')).toEqual(true);

    });

  });

});
