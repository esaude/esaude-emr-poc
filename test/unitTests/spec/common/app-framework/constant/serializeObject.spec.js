describe("dateSerializerService", function () {

    var serializeObject;

    beforeEach(module("bahmni.common.appFramework"));

    beforeEach(inject(function (_serializeObject_) {
        serializeObject = _serializeObject_;
    }));

    describe("serialize()", function () {
        it("should serialize empty object", function () {
            var obj = serializeObject({});
            expect(obj).toEqual({});
        });

        it("should serialize null object", function () {
            var obj = serializeObject(null);
            expect(obj).toEqual(null);
        });

        it("should serialize date", function () {
            var obj = serializeObject({ date: moment('18/04/2018 10:30:12', 'DD/MM/YYYY HH:mm:ss').toDate() });
            expect(obj).toEqual({ date: '2018-04-18T10:30:12' });
        });

        it("should serialize date on nested object", function () {
            var objectToSerialize = {
                code: "CODE_01",
                person: {
                    uuid: "UUID_1",
                    birthday: moment('10/02/1981 05:20:25', 'DD/MM/YYYY HH:mm:ss').toDate()
                }
            };
            var obj = serializeObject(objectToSerialize);
            expect(obj).toEqual({
                code: "CODE_01",
                person: {
                    uuid: "UUID_1",
                    birthday: '1981-02-10T05:20:25'
                }
            });
        });

        it("should deep neste object", function () {
            var objectToSerialize = {
                level1: {
                    level2: {
                        level3: {
                            date: moment('10/02/1981 05:20:25', 'DD/MM/YYYY HH:mm:ss').toDate()
                        }
                    }
                }
            };
            var obj = serializeObject(objectToSerialize);
            expect(obj).toEqual({
                level1: {
                    level2: {
                        level3: {
                            date: '1981-02-10T05:20:25'
                        }
                    }
                }
            });
        });

        it("should support moment", function () {
            var obj = serializeObject({ date: moment('18/04/2018 10:30:12', 'DD/MM/YYYY HH:mm:ss') });
            expect(obj).toEqual({ date: '2018-04-18T10:30:12' });
        });

    });

});