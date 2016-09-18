'use strict';

describe('addressHierarchyService', function () {
  var resultList = [
    {
      "name": "Semi",
      "parent": {
        "name": "Bilaspur",
        "uuid": "uuid-for-bilaspur",
        "parent": {
          "name": "Distr",
          "uuid": "uuid-for-distr",
          "parent": {
            "name": "Chattisgarh",
            "uuid": "uuid-for-chattisgarh",
            "parent": {
              "name": "India",
              "uuid": "uuid-for-India"
            }
          }
        }
      }
    },
    {
      "name": "Semi",
      "uuid": "uuid-for-semi",
      "parent": {
        "name": "Semariya",
        "uuid": "uuid-for-semariya",
        "parent": {
          "name": "Distr",
          "uuid": "uuid-for-distr",
          "parent": {
            "name": "Chattisgarh",
            "uuid": "uuid-for-chattisgarh",
            "parent": {
              "name": "India",
              "uuid": "uuid-for-india"
            }
          }
        }
      }
    }
  ];
  var mockHttp = {defaults:{headers:{common:{'X-Requested-With':'present'}} },
    get:jasmine.createSpy('Http get').and.returnValue(resultList)
  };

  var mockofflineService = jasmine.createSpyObj('offlineService', ['isOfflineApp', 'isAndroidApp']);
  mockofflineService.isOfflineApp.and.returnValue(false);
  mockofflineService.isAndroidApp.and.returnValue(false);

  var mockofflineDbService= jasmine.createSpyObj('offlineDbService', ['searchAddress']);
  mockofflineDbService.searchAddress.and.returnValue(resultList);

  var mockandroidDbService= jasmine.createSpyObj('androidDbService', ['searchAddress']);
  mockandroidDbService.searchAddress.and.returnValue(resultList);


  beforeEach(module('bahmni.registration'));
  beforeEach(module(function ($provide) {
    $provide.value('$http', mockHttp);
    $provide.value('offlineService', mockofflineService);
    $provide.value('androidDbService', mockandroidDbService);
    $provide.value('offlineDbService', mockofflineDbService);
  }));


});
