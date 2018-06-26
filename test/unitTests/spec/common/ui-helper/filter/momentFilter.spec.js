describe('momentFilter', () => {

  var $filter;

  beforeEach(module('bahmni.common.uiHelper'));

  beforeEach(inject((_$filter_) => {
    $filter = _$filter_;
  }));

  describe('momentFilter', () => {
    it('should filter moment', () => {
      var filtered = $filter('moment')(moment('10/02/1981 05:20:25', 'DD/MM/YYYY HH:mm:ss'), 'short');
      expect(filtered).toEqual('10/02/1981 05:20');
    });

    it('should filter string', () => {
      var filtered = $filter('moment')('2008-09-15T15:53:00+05:00', 'short');
      expect(filtered).toEqual('15/09/2008 12:53');
    });
  });

});
