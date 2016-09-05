'use strict';

describe('LocationService', function () {
  var locationUuids = ["location1", "location2"];

  var getReturnValue = function(params, args){
    if(_.includes(params,"bahmnicore/visitLocation")){
      return {uuid: "visitLocationUuid"}
    }
    else{
      return locationUuids;
    }
  };

  var $http, mockBahmniCookieStore,
    mockHttp = {
      defaults: {
        headers: {
          common: {
            'X-Requested-With': 'present'
          }
        }
      },
      get: jasmine.createSpy('Http get').and.callFake(getReturnValue)
    };

  beforeEach(module('bahmni.common.domain'));
  beforeEach(module(function ($provide) {
    $provide.value('$http', mockHttp);
    $provide.value('$bahmniCookieStore', mockBahmniCookieStore);
  }));

  it('should get locations by tag', inject(['locationService', function(locationService){
    var tag = "tag1";
    var params = { params : { s : 'byTags', q: 'tag1' }, cache : true };

    var results = locationService.getAllByTag(tag);

    expect(mockHttp.get).toHaveBeenCalled();
    expect(mockHttp.get.calls.mostRecent().args[0]).toBe(Bahmni.Common.Constants.locationUrl);
    expect(mockHttp.get.calls.mostRecent().args[1]).toEqual(params);
    expect(results).toBe(locationUuids);
  }]));

  it('should get locations by name', inject(['locationService', function(locationService){
    var name = "name";
    var params = { params : { q: 'name' }, cache : true, withCredentials: false };

    var results = locationService.get(name);

    expect(mockHttp.get).toHaveBeenCalled();
    expect(mockHttp.get.calls.mostRecent().args[0]).toBe(Bahmni.Common.Constants.locationUrl);
    expect(mockHttp.get.calls.mostRecent().args[1]).toEqual(params);
    expect(results).toBe(locationUuids);
  }]));


});
