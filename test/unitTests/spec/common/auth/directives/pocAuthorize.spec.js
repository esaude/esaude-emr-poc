'use strict';

describe('pocAuthorize', () => {

  var $compile, $rootScope, $q, authorizationService;

  beforeEach(module('authentication', 'templates',  ($provide) => {
    $provide.decorator('pocAuthorizeDirective', ($delegate, authorizationService, $log) => {

      $log.info('pocAuthorizeDirectiveDecorator: decorating pocAuthorizeDirective with authorization.');

      var directive = $delegate[0];

      function link(scope, element, attrs) {
        authorizationService.hasPrivilege(scope.privilege).then(hasPrivilege => {
          scope.authorized = hasPrivilege;
        });
      }

      directive.compile = function () {
        return function (scope, element, attrs) {
          link.apply(this, arguments);
        };
      };

      delete directive.link;
      return $delegate;
    });
  }));

  beforeEach(inject((_$compile_, _authorizationService_, _$rootScope_, _$q_) => {
    $compile = _$compile_;
    authorizationService = _authorizationService_;
    $rootScope = _$rootScope_;
    $q = _$q_;
  }));

  describe('user authorized', () => {

    beforeEach(() => {
      spyOn(authorizationService, 'hasPrivilege').and.callFake(() => $q(resolve => {
        resolve(true);
      }));
    });

    it('shows the contents', () => {

      var element = $compile('<poc-authorize privilege="\'Create Vitals\'"><div>Create Vitals Only!</div></poc-authorize>')($rootScope);

      $rootScope.$digest();
      expect(element.html()).toContain('Create Vitals Only!');
    });

  });

  describe('user not authorized', () => {

    beforeEach(() => {
      spyOn(authorizationService, 'hasPrivilege').and.callFake(() => $q(resolve => {
        resolve(false);
      }));
    });

    it('does not show the contents', () => {

      var element = $compile('<poc-authorize privilege="\'Create Vitals\'"><div>Create Vitals Only!</div></poc-authorize>')($rootScope);

      $rootScope.$digest();
      expect(element.html()).not.toContain('Create Vitals Only!');
    });

    describe('display info', () => {

      it('should display message indicating insufficient privileges', () => {

        var element = $compile('<poc-authorize privilege="\'Create Vitals\'" display-info="true"><div>Create Vitals Only!</div></poc-authorize>')($rootScope);

        $rootScope.$digest();
        expect(element.html()).toContain('INSUFFICIENT_PRIVILEGES');

      });
    });

  });

});
