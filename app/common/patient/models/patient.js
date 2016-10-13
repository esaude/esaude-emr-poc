'use strict';

angular.module('common.patient')
    .factory('patient', ['age', function (age) {
        var create = function () {
            var calculateAge = function () {
                if (this.birthdate) {
                    this.age = age.fromBirthDate(this.birthdate);
                }
                else {
                    this.age = age.create(null, null, null);
                }
            };

            var calculateBirthDate = function () {
                this.birthdate = age.calculateBirthDate(this.age);
            };

            var calculateBirthdateEstimated = function (value) {
                if (value === 'age') {
                    this.birthdateEstimated = true;
                } else {
                    this.birthdateEstimated = false;
                }
                
            };

            var fullNameLocal = function () {
                var givenNameLocal = this.givenNameLocal || this.givenName || "";
                var middleNameLocal = this.middleNameLocal || this.middleName|| "";
                var familyNameLocal = this.familyNameLocal || this.familyName || "";
                return (givenNameLocal.trim() + " " + (middleNameLocal ? middleNameLocal + " " : "" ) + familyNameLocal.trim()).trim();
            };

            var getImageData = function () {
                return this.image && this.image.indexOf('data') === 0 ? this.image.replace("data:image/jpeg;base64,", "") : null;
            };

            return {
                address: {}
                ,age: age.create()
                ,birthdate: null
                ,birthdateEstimated: false
                ,calculateAge: calculateAge
                ,image: '../images/blank-user.gif'
                ,fullNameLocal: fullNameLocal
                ,getImageData: getImageData
                ,relationships: []
                ,newlyAddedRelationships: [{}]
                ,calculateBirthDate: calculateBirthDate
                ,calculateBirthdateEstimated: calculateBirthdateEstimated
                ,identifiers: []
            };
        };

        return {
            create: create
        }
    }]);
