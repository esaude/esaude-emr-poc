describe("dateSerializerService", () => {

    var serializeObject;

    beforeEach(module("bahmni.common.appFramework"));

    beforeEach(inject(_serializeObject_ => {
        serializeObject = _serializeObject_;
    }));

    describe("serialize()", () => {
        it("should serialize empty object", () => {
            var obj = serializeObject({});
            expect(obj).toEqual({});
        });

        it("should serialize null object", () => {
            var obj = serializeObject(null);
            expect(obj).toEqual(null);
        });

        it("should serialize date", () => {
            var obj = serializeObject({ date: moment('18/04/2018 10:30:12', 'DD/MM/YYYY HH:mm:ss').toDate() });
            expect(obj).toEqual({ date: '2018-04-18T10:30:12' });
        });

        it("should serialize date on nested object", () => {
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

        it("should deep neste object", () => {
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

        it("should support moment", () => {
            var obj = serializeObject({ date: moment('18/04/2018 10:30:12', 'DD/MM/YYYY HH:mm:ss') });
            expect(obj).toEqual({ date: '2018-04-18T10:30:12' });
        });

        it("should not have problems with ciclic dependencies", () => {
            var objToSerialize = {
                date: moment('18/04/2018 10:30:12', 'DD/MM/YYYY HH:mm:ss')
            };
            objToSerialize.next = objToSerialize;
            var obj = serializeObject(objToSerialize);
            expect(obj.date).toEqual('2018-04-18T10:30:12');
        });

        it("should not change original object", () => {
            var original = { date: moment('18/04/2018 10:30:12', 'DD/MM/YYYY HH:mm:ss') };
            var obj = serializeObject(original);
            expect(original).toEqual({ date: moment('18/04/2018 10:30:12', 'DD/MM/YYYY HH:mm:ss') });
            expect(obj).toEqual({ date: '2018-04-18T10:30:12' });
        });

    });

});
