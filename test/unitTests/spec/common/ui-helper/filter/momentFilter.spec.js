describe('momentFilter', () => {

  var $filter;

  beforeEach(module('application'));

  beforeEach(inject((_$filter_) => {
    $filter = _$filter_;
  }));

  describe('momentFilter', () => {
    it('should filter moment', () => {
      var filtered = $filter('moment')(moment('10/02/1981 05:20:25', 'DD/MM/YYYY HH:mm:ss'), 'short');
      expect(filtered).toEqual('10/2/1981 5:20:25');
    });

    it('should filter string', () => {
      var filtered = $filter('moment')('2008-09-15T15:53:00+05:00', 'short');
      expect(filtered).toEqual('15/9/2008 12:53:00');
    });

    it('should filter string using shortDate format', () => {
      var filtered = $filter('moment')('2008-09-15T15:53:00+05:00', 'shortDate');
      expect(filtered).toEqual('15/9/2008');
    });
  });

});
