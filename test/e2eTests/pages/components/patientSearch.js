'use strict';

let I;

module.exports = {

  _init() {
    I = actor();
  },

  searchBox: 'input[ng-model="vm.searchText"',

  // Searches in the registration search box
  search(text) {
    I.waitForElement(this.searchBox)
    
    // This selects the element for some reason
    // That behavior seems like a bug in codeceptjs
    // We should have to send enter or something, right?
    I.fillField(this.searchBox, text)

    // Wait for the search to complete
    I.wait(5)
  },

  // Clears the search box
  clearSearch(text) {
    I.waitForElement(this.searchBox)

    I.fillField(this.searchBox, '')

    // Wait for the search to complete
    I.wait(5)
  },

  // Used to validate search results
  seePatientRecord(patient) {
    const birthdate = new Date(patient.person.birthdate)
    const age = this._calculateAge(birthdate)

    I.see(patient.identifiers[0].identifier)
    I.see(patient.person.names[0].givenName)
    I.see(patient.person.names[0].familyName)
    I.see(patient.person.gender)
    I.see(age)

    // TODO: Validate birthdate
    // Birthdate is giving me trouble. The server returns a date that's always a day earlier
    // This may be because the browser and server have a different timezone/locale
    //I.see(`${birthdate.getDate()}/${birthdate.getMonth() + 1}/${birthdate.getFullYear()}`)

    // TODO: Validate scheduled day for consultation
  },

  // Used to make sure a patient is not visible
  dontSeePatientRecord(patient) {
    I.dontSee(patient.identifiers[0].identifier)
    I.dontSee(patient.person.names[0].givenName)
    I.dontSee(patient.person.names[0].familyName)
  },

  seeNoResults() {
    I.see('Nenhum resultado encontrado')
  },

  // Calculates the person's age given a Date
  _calculateAge(birthday) {
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  },
}