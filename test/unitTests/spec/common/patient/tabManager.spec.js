describe('TabManager', () => {

  var TabManager;

  beforeEach(module('common.patient'));

  beforeEach(inject(_TabManager_ => {
    TabManager = _TabManager_;
  }));

  describe('constructor', () => {

    it('should instantiate steps', () => {

      var tabManager = new TabManager();

      expect(tabManager.steps).toEqual([]);

    });

    it('should initialize current step', () => {

      var tabManager = new TabManager();

      expect(tabManager.current).toEqual(-1);

    });

  });

  describe('addStepDefinition', () => {

    it('should add new step to steps', () => {

      var tabManager = new TabManager();

      tabManager.addStepDefinition('name');

      expect(tabManager.steps).toContain('name');

    });

    describe('subsequent steps', () => {

      it('should not increment current step', () => {

        var tabManager = new TabManager();

        tabManager.addStepDefinition('first');

        tabManager.addStepDefinition('second');

        expect(tabManager.current).toEqual(0);

      });

    });

    describe('first step', () => {

      it('should increment current step', () => {

        var tabManager = new TabManager();

        tabManager.addStepDefinition('name');

        expect(tabManager.current).toEqual(0);

      });

    });

  });

  describe('stepForward', () => {

    it('should step forward', () => {

      var tabManager = new TabManager();

      tabManager.addStepDefinition('first');

      tabManager.addStepDefinition('second');

      tabManager.stepForward();

      expect(tabManager.current).toEqual(1);

    });

    describe('at last step', () => {

      it('should not step forward', () => {

        var tabManager = new TabManager();

        tabManager.addStepDefinition('first');

        tabManager.addStepDefinition('second');

        tabManager.stepForward();

        tabManager.stepForward();

        expect(tabManager.current).toEqual(1);

      });

    });

  });

  describe('stepBackwards', () => {

    it('should step backwards', () => {

      var tabManager = new TabManager();

      tabManager.addStepDefinition('first');

      tabManager.addStepDefinition('second');

      tabManager.current = 1;

      tabManager.stepBackwards();

      expect(tabManager.current).toEqual(0);

    });

    describe('at first step', () => {

      it('should not step backwards', () => {

        var tabManager = new TabManager();

        tabManager.addStepDefinition('first');

        tabManager.addStepDefinition('second');

        tabManager.stepBackwards();

        expect(tabManager.current).toEqual(0);

      });

    });

  });

  describe('goToStep', () => {

    it('should set current step', () => {

      var tabManager = new TabManager();

      tabManager.addStepDefinition('first');

      tabManager.addStepDefinition('second');

      tabManager.goToStep('second');

      expect(tabManager.current).toEqual(1);

    });

    it('should return the step name', () => {

      var tabManager = new TabManager();

      tabManager.addStepDefinition('first');

      tabManager.addStepDefinition('second');

      expect(tabManager.goToStep('second')).toEqual('second');

    });

    it('should throw if step is not defined', () => {

      var tabManager = new TabManager();

      tabManager.addStepDefinition('first');

      tabManager.addStepDefinition('second');

      expect(() => tabManager.goToStep('third')).toThrow(new Error(`Step 'third' not defined`));

    });

  });

  describe('isLastStep', () => {

    it('should return true if given step is last', () => {

      var tabManager = new TabManager();

      tabManager.addStepDefinition('first');

      tabManager.addStepDefinition('second');

      expect(tabManager.isLastStep('second')).toEqual(true);

    });

  });

  describe('isFirstStep', () => {

    it('should return true if given step is first', () => {

      var tabManager = new TabManager();

      tabManager.addStepDefinition('first');

      tabManager.addStepDefinition('second');

      expect(tabManager.isFirstStep('first')).toEqual(true);

    });

  });

});
