'use strict';

describe("ManageProgramController", function () {

  var $controller, $rootScope, $q, programService;

  beforeEach(module('bahmni.common.uicontrols.programmanagment'));

  beforeEach(inject(function (_$controller_, _$rootScope_, _$q_, _programService_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $q = _$q_;
    programService = _programService_;
  }));


  describe('activate', function () {

    it('should load all programs', function () {

      spyOn(programService, 'getAllPrograms').and.callFake(function () {
        return $q(function (resolve) {
          resolve(allPrograms);
        })
      });

      var ctrl = $controller('ManageProgramController', {$scope: {}});

      expect(programService.getAllPrograms).toHaveBeenCalled();

    });

  });

  var allPrograms = [
    {
      "uuid": "1209df07-b3a5-4295-875f-2f7bae20f86e",
      "name": "program",
      "outcomesConcept": {
        "uuid": "6475249b-b681-4aae-ad6c-a2d580b4be3d",
        "display": "HIV outcomes",
        "setMembers": [
          {
            "uuid": "8a1ab485-e599-4682-8c82-c60ce03c916e",
            "display": "Cured"
          },
          {
            "uuid": "041daad2-198b-4223-aa46-6b23e85776a9",
            "display": "Death"
          }
        ],
        "resourceVersion": "1.9"
      },

      "allWorkflows": [
        {
          "uuid": "6a6c990f-01e2-464b-9452-2a97f0c05c7c",
          "concept": {
            "uuid": "8227f47f-3f10-11e4-adec-0800271c1b75",
            "display": "All_Tests_and_Panels",
            "links": [
              {
                "uri": "NEED-TO-CONFIGURE/ws/rest/v1/concept/8227f47f-3f10-11e4-adec-0800271c1b75",
                "rel": "self"
              }
            ]
          },
          "retired": false,
          "states": [{
            "uuid": "8227f47f-3f10-11e4-adec-0800271c1b75",
            "display": "All_Tests_and_Panels",
            "retired":false
          },{
            "uuid": "8227f47f-3f10-11e4-adec-0800271c1590",
            "display": "VAT_Tests_and_Panels",
            "retired":false

          }],
          "links": [
            {
              "uri": "NEED-TO-CONFIGURE/ws/rest/v1/workflow/6a6c990f-01e2-464b-9452-2a97f0c05c7c",
              "rel": "self"
            }
          ]
        }
      ],
      "links": [
        {
          "uri": "NEED-TO-CONFIGURE/ws/rest/v1/program/1209df07-b3a5-4295-875f-2f7bae20f86e",
          "rel": "self"
        }
      ]
    }
  ];
});
