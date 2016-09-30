xdescribe("Obcservation Value Mapper", function () {
  var mapper = Bahmni.Common.Domain.ObservationValueMapper;

  it("should return date value", function () {
    var obs = {type: "Date", value:"2015-12-19", concept: {}};
    expect(mapper.map(obs)).toBe("19-Dec-2015");
  });
});
