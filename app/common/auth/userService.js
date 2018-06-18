angular.module('authentication')
    .service('userService', ['$rootScope', '$http', function ($rootScope, $http) {

        this.getUser = userName => $http.get("/openmrs/ws/rest/v1/user", {
          method: "GET",
          params: {
            username: userName,
            v: "custom:(username,uuid,person:(uuid,preferredName),privileges:(name,retired),userProperties)"
          },
          cache: false
        });

      //TODO: Unused definition, to be removed after testing phase
        // this.savePreferences = function () {
        //     var user = $rootScope.currentUser.toContract();
        //     return $http.post("/openmrs/ws/rest/v1/user/" + user.uuid, {"uuid": user.uuid, "userProperties": user.userProperties}, {
        //         withCredentials: true
        //     }).then(function (response) {
        //             $rootScope.currentUser.userProperties = response.data.userProperties;
        //         });
        // };

        this.getProviderForUser = uuid => $http.get("/openmrs/ws/rest/v1/provider", {
          method: "GET",
          params: {
            user: uuid
          },
          cache: false
        });

    }]);
