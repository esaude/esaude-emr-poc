'use strict';

describe("Authentication", function () {
    var currentUserCookie, userService, $cookies, $q, scope;

    beforeEach(module('authentication'));
    beforeEach(module(function ($provide) {
        currentUserCookie = {};
        $cookies = jasmine.createSpyObj('$cookies', ['get']);
        $q = jasmine.createSpyObj('$q', ['defer']);
        $cookies.get.and.callFake(function (cookieName) {
            if (cookieName == Bahmni.Common.Constants.currentUser) {
                return currentUserCookie;
            }
        });
        userService = jasmine.createSpyObj('userService', ['getUser', 'getProviderForUser']);

        var userResponse = {results: [{uuid: "36b6ea1f-3f5a-11e5-b380-0050568236ae"}]};
        var providers = {};

        var getUserPromise = specUtil.createServicePromise('getUser');
        getUserPromise.then = function (successFn) {
            successFn(userResponse);
            return getUserPromise;
        };

        var getProviderForUserPromise = specUtil.createServicePromise('getProviderForUser');
        getProviderForUserPromise.then = function (successFn) {
           successFn(providers);
           return getProviderForUserPromise;
        };

        userService.getUser.and.returnValue(getUserPromise);
        userService.getProviderForUser.and.returnValue(getProviderForUserPromise);

        $provide.value('$cookies', $cookies);
        $provide.value('userService', userService);
        $provide.value('$q', $q);
    }));


    describe("Should aouthenticate", function () {
      it("login must occur with success", inject(['sessionService', '$rootScope', function (sessionService, $rootScope ) {
        var deferrable = jasmine.createSpyObj('deferrable', ['reject', 'promise']);
        $q.defer.and.returnValue(deferrable);
        sessionService.loadCredentials();

        expect(deferrable.reject).not.toHaveBeenCalled();
      }]));

    });

});
