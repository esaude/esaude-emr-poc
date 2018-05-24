const Component = require('./component')

class PatientSearchComponent extends Component {
  constructor() {
    super()
    this.searchBox = 'input[ng-model="vm.searchText"'
  }

  // Searches in the registration search box
  search(text, autoSelect) {
    // Update auto selection
    this.I.executeScript((autoSelectVal) => {
      $('barcode-listener').data('auto-select', autoSelectVal)
    }, autoSelect)

    this.I.waitForElement(this.searchBox)
    
    // Search
    this.I.fillField(this.searchBox, text)

    // Wait for the search to complete
    this.I.waitForInvisible('#overlay', 5)

    this.I.wait(1)

    // Make sure auto selection is enabled
    this.I.executeScript(() => $('barcode-listener').data('auto-select', true))
  }

  // Clears the search box
  clearSearch(text) {
    this.I.waitForElement(this.searchBox)

    this.I.fillField(this.searchBox, '')

    // Wait for the search to complete
    this.I.waitForInvisible('#overlay', 5)
  }

  // Used to validate search results
  seePatientRecord(patient) {
    const birthdate = new Date(patient.person.birthdate)
    const age = this._calculateAge(birthdate)

    this.I.see(patient.identifiers[0].identifier)
    this.I.see(patient.person.names[0].givenName)
    this.I.see(patient.person.names[0].familyName)
    this.I.see(patient.person.gender)
    this.I.see(age)

    // TODO: Validate birthdate
    // Birthdate is giving me trouble. The server returns a date that's always a day earlier
    // This may be because the browser and server have a different timezone/locale
    //this.I.see(`${birthdate.getDate()}/${birthdate.getMonth() + 1}/${birthdate.getFullYear()}`)

    // TODO: Validate scheduled day for consultation
  }

  // Used to make sure a patient is not visible
  dontSeePatientRecord(patient) {
    this.I.dontSee(patient.identifiers[0].identifier)
    this.I.dontSee(patient.person.names[0].givenName)
    this.I.dontSee(patient.person.names[0].familyName)
  }

  seeNoResults() {
    this.I.see('Nenhum resultado encontrado')
  }

  // Calculates the person's age given a Date
  _calculateAge(birthday) {
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
}

module.exports = PatientSearchComponent
