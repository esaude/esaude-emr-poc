describe("Observation Filter", function () {
  describe("filter", function() {
    var buildObservation = Bahmni.Tests.observationMother.build;
    var observationFilter;

    beforeEach(function() {
      observationFilter = new Bahmni.Common.Domain.ObservationFilter();
    });


    it("should not void existing observations groups which has mamber with value", function() {
      var observations = [buildObservation({ uuid: '1111', value: null,
        groupMembers: [buildObservation({value: '10', uuid: '2222'})]
      })];

      var filteredObservations = observationFilter.filter(observations);

      expect(filteredObservations.length).toBe(1);
      expect(filteredObservations[0].voided).toBe(false);
      expect(filteredObservations[0].groupMembers[0].voided).toBe(false);
    });

    it("should remove new member observations without value", function() {
      var observation = buildObservation({ uuid: null,
        groupMembers: [buildObservation({value: null, uuid: null}), buildObservation({value: 10, uuid: null})]
      });
      var observations = [observation];

      var filteredObservations = observationFilter.filter(observations);

      expect(filteredObservations.length).toBe(1);
      expect(filteredObservations[0].groupMembers.length).toBe(1);
      expect(filteredObservations[0].groupMembers[0].value).toBe(10);
    });

    it("should remove new member observations which are voided", function() {
      var observation = buildObservation({ uuid: null,
        groupMembers: [buildObservation({value: "something", uuid: null, voided: true}), buildObservation({value: 10, uuid: null})]
      });

      var observations = [observation];

      var filteredObservations = observationFilter.filter(observations);

      expect(filteredObservations.length).toBe(1);
      expect(filteredObservations[0].groupMembers.length).toBe(2);
      expect(filteredObservations[0].groupMembers[0].value).toBe('something');
    });
  });
});
