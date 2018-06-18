describe('conceptService', () => {

  var conceptService, appService, $http, $q, $log, $rootScope;

  beforeEach(module('bahmni.common.domain'));

  beforeEach(inject((_conceptService_, _appService_, _$q_, _$rootScope_,
                     _$httpBackend_) => {

    conceptService = _conceptService_;
    appService = _appService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $http = _$httpBackend_;
  }));

  it('should fetch the death concept by uuid', () => {

    var query = '/openmrs/ws/rest/v1/systemsetting?q=concept.causeOfDeath&v=custom:value';

    $http.expectGET(query).respond({results: []});

    conceptService.getDeathConcepts();

    $http.flush();
    $http.verifyNoOutstandingExpectation();
    $http.verifyNoOutstandingRequest();
  });

  describe('searchBySource', () => {

    var results = [
      {
        mappings: [{
          conceptReferenceTerm: {
            conceptSource: {
              uuid: 'ICD10'
            }
          }
        }]
      },
      {
        mappings: [{
          conceptReferenceTerm: {
            conceptSource: {
              uuid: 'ICD10'
            }
          }
        }]
      },
      {
        mappings: [{
          conceptReferenceTerm: {
            conceptSource: {
              uuid: 'NOT ICD10'
            }
          }
        }]
      }
    ];

    it('should search for concepts and filter by mapping source', () => {

      var term = 'tuber';
      var source = 'ICD10';

      $http.expectGET('/openmrs/ws/rest/v1/concept?q=' + term + '&source=' + source
        + '&v=custom:(uuid,name,display,mappings:(conceptReferenceTerm:(conceptSource:(uuid))))')
        .respond({results: results});

      var result;
      conceptService.searchBySource(term, source).then(concepts => {
        result = concepts;
      });

      $http.flush();
      expect(result).toContain(results[0]);
      expect(result).toContain(results[1]);
      expect(result).not.toContain(results[2]);

    });

    afterEach(() => {
      $http.verifyNoOutstandingExpectation();
      $http.verifyNoOutstandingRequest();
    });

  });

});
