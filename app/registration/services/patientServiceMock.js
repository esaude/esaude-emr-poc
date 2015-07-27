"use strict";

angular.module('registration').service('patientServiceMock', function () {
    var currPatient = null;
    
    this.getCurrPatient = function () {
        return currPatient;
    };
    
    this.setCurrPatient = function (currPatient) {
        this.currPatient = currPatient;
    };
    
    this.getPatients = function () {
        return patients;
    };
    
    this.getPatientByUuid = function (patientUuid) {
        
        for(var i in patients) {
            var patient = patients[i];
            
            if(patient.uuid === patientUuid) {
                return patient;
            }
        }
        return null;
    };

    var patients = [
        {id: 1, givenName: "Charlyn", familyName: "Berube", nid: "00000000/00/0001", uuid: "001", gender: "F", birthdate: "1982-10-01"},
        {id: 2, givenName: "Merle", familyName: "Mundell", nid: "00000000/00/0002", uuid: "002", gender: "M", birthdate: "1986-10-01"},
        {id: 3, givenName: "Samual", familyName: "Mcphatter", nid: "00000000/00/0003", uuid: "003", gender: "M", birthdate: "1980-10-01"},
        {id:4, givenName: "Junita", familyName: "Blount", nid: "00000000/00/0004", uuid: "004", gender: "F", birthdate: "1990-10-01"},
        {id: 5, givenName: "Marci", familyName: "Ostrander", nid: "00000000/00/0005", uuid: "005", gender: "F", birthdate: "2000-10-01"},
        {id: 6, givenName: "Birdie", familyName: "Digiovanni", nid: "00000000/00/0006", uuid: "006", gender: "F", birthdate: "1982-10-01"},
        {id: 7, givenName: "Carrie", familyName: "Hynd", nid: "00000000/00/0007", uuid: "007", gender: "F", birthdate: "2001-10-01"},
        {id: 8, givenName: "Gillian", familyName: "Jenkinson", nid: "00000000/00/0008", uuid: "008", gender: "M", birthdate: "1981-10-01"},
        {id: 9, givenName: "Isaac", familyName: "Patin", nid: "00000000/00/0009", uuid: "009", gender: "M", birthdate: "1991-10-01"},
        {id: 10, givenName: "Elsie", familyName: "Southwell", nid: "00000000/00/0010", uuid: "010", gender: "F", birthdate: "1972-10-01"},
        {id: 11, givenName: "Son", familyName: "Miyashiro", nid: "00000000/00/0011", uuid: "011", gender: "M", birthdate: "1987-10-01"},
        {id: 12, givenName: "Youlanda", familyName: "Vita", nid: "00000000/00/0012", uuid: "012", gender: "F", birthdate: "2004-10-01"},
        {id: 13, givenName: "Shavonne", familyName: "Racine", nid: "00000000/00/0013", uuid: "013", gender: "F", birthdate: "1994-10-01"},
        {id: 14, givenName: "Laurine", familyName: "Uvalle", nid: "00000000/00/0014", uuid: "014", gender: "F", birthdate: "1998-10-01"},
        {id: 15, givenName: "Porfirio", familyName: "Reams", nid: "00000000/00/0015", uuid: "015", gender: "M", birthdate: "1989-10-01"},
        {id: 16, givenName: "Versie", familyName: "Starks", nid: "00000000/00/0016", uuid: "016", gender: "F", birthdate: "2002-10-01"},
        {id: 17, givenName: "Janny", familyName: "Gunderman", nid: "00000000/00/0017", uuid: "017", gender: "F", birthdate: "1999-10-01"},
        {id: 18, givenName: "Mathilda", familyName: "Minaya", nid: "00000000/00/0018", uuid: "018", gender: "F", birthdate: "2009-10-01"},
        {id: 19, givenName: "Arden", familyName: "Gargiulo", nid: "00000000/00/0019", uuid: "019", gender: "M", birthdate: "1980-10-01"},
        {id: 20, givenName: "Corey", familyName: "Strozier", nid: "00000000/00/0020", uuid: "020", gender: "M", birthdate: "1997-10-01"},
        {id: 21, givenName: "Gaylord", familyName: "Jacko", nid: "00000000/00/0021", uuid: "021", gender: "M", birthdate: "1988-10-01"},
        {id: 22, givenName: "Alayna", familyName: "Sergio", nid: "00000000/00/0022", uuid: "022", gender: "F", birthdate: "1999-10-01"},
        {id: 23, givenName: "Felisha", familyName: "Saari", nid: "00000000/00/0023", uuid: "023", gender: "F", birthdate: "2003-10-01"},
        {id: 24, givenName: "Lovetta", familyName: "Basden", nid: "00000000/00/0024", uuid: "024", gender: "F", birthdate: "1990-10-01"},
        {id: 25, givenName: "Britni", familyName: "Song", nid: "00000000/00/0025", uuid: "025", gender: "F", birthdate: "1984-10-01"},
        {id: 26, givenName: "Kattie", familyName: "Haider", nid: "00000000/00/0026", uuid: "026", gender: "F", birthdate: "1998-10-01"},
        {id: 27, givenName: "Rhiannon", familyName: "Alberto", nid: "00000000/00/0027", uuid: "027", gender: "M", birthdate: "1990-10-01"},
        {id: 28, givenName: "Ula", familyName: "Maples", nid: "00000000/00/0028", uuid: "028", gender: "M", birthdate: "1981-10-01"},
        {id: 29, givenName: "Lenita", familyName: "Lipman", nid: "00000000/00/0029", uuid: "029", gender: "F", birthdate: "1989-10-01"}
    ];
});