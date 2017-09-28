(function () {
  'use strict';

  angular
    .module('common.patient')
    .factory('patient', patient);

  patient.$inject = ['age'];

  /* @ngInject */
  function patient(age) {
    var patient = {
      create: create
    };
    return patient;

    ////////////////

    function create() {

      return {
        address: {}
        , age: age.create()
        , birthdate: null
        , birthdateEstimated: false
        , calculateAge: calculateAge
        , image: '../images/blank-user.gif'
        , fullNameLocal: fullNameLocal
        , getImageData: getImageData
        , relationships: []
        , newlyAddedRelationships: [{}]
        , calculateBirthDate: calculateBirthDate
        , identifiers: []
      };

      function updateAge(birthdate) {
        if (birthdate) {
          return age.fromBirthDate(birthdate);
        }
        else {
          return age.create(null, null, null);
        }
      }

      function calculateAge() {
        this.age = updateAge(this.birthdate);
        this.birthdateEstimated = false;
      }

      function calculateBirthDate() {
        this.birthdate = age.calculateBirthDate(this.age);
        this.age = updateAge(this.birthdate);
        this.birthdateEstimated = true;
      }

      function fullNameLocal() {
        var givenNameLocal = this.givenNameLocal || this.givenName || "";
        var middleNameLocal = this.middleNameLocal || this.middleName || "";
        var familyNameLocal = this.familyNameLocal || this.familyName || "";
        return (givenNameLocal.trim() + " " + (middleNameLocal ? middleNameLocal + " " : "" ) + familyNameLocal.trim()).trim();
      }

      function getImageData() {
        return this.image && this.image.indexOf('data') === 0 ? this.image.replace("data:image/jpeg;base64,", "") : null;
      }

    }
  }

})();
