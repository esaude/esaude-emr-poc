"use strict";

angular.module('application').service('applicationServiceMock', function ($http) {
    var appUrl = "../common/application/resources/app.json";

    this.getApps = function ()
    {
        var defer = $.Deferred();
        $http.get(appUrl)
                .success(function (response) {
                    defer.resolve(response);

                })
                .error(function (error) {
                    console.error("The async call has fail to: " + appUrl);
                });
        return defer.promise();
    };
});