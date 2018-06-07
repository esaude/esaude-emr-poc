const Component = require('./component')

const LOG_TAG = '[PatientSearchComponent]';

class PatientSearchComponent extends Component {
  constructor() {
    super()
    this.searchBox = 'input[ng-model="vm.searchText"'
  }

  disableAutoSelect() {
    this.I.waitForElement('barcode-listener')
    
    // Update auto selection
    this.I.executeScript(() => {
      $('barcode-listener').data('auto-select', false)
    })
  }

  // Searches in the registration search box
  search(text) {
    this.I.waitForElement(this.searchBox)
    
    // Search
    this.I.fillField(this.searchBox, text)

    // Wait for the search to complete
    this.I.waitForInvisible('#overlay', 5)

    this.I.wait(1)
  }

  clickSearchResult(patient) {
    const patientId = patient.identifiers[0].identifier

    // Make sure the element is visible
    this.I.waitForText(patientId, 5, '.patient-identifier')

    // Find the correct element and click it 
    this.I.executeScript((patientId) => {
      try {
        // Get the div that displays the patient's id
        const patientIdElement = $(`td.patient-identifier:contains('${patientId}')`)
        
        // Get the row element containing the patient id because
        // it's the element we need to click to navigate to the patient's page
        const patientRow = patientIdElement.parent('tr[st-select-row="patient"')
        
        // Click it
        patientRow.click()
      } catch(e) {
        console.log(`Unable to find patient with id ${patientId}. Error: ${e}`)
      }
      
    }, patientId)
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

  // Search for the patient by their id, verify the search result then select it
  searchForPatientByIdAndSelect(patient) {
    const patientId = patient.identifiers[0].identifier;

    this.I.say(`${LOG_TAG} Search for patient by identifier ${patientId}`);
    this.search(patientId);

    this.I.say(`${LOG_TAG} Validate data is visible for patient with id ${patientId}`);
    this.seePatientRecord(patient);

    this.I.say(`${LOG_TAG} Select patient ${patientId}`);
    this.clickSearchResult(patient);
  }

  // Calculates the person's age given a Date
  _calculateAge(birthday) {
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
}

module.exports = PatientSearchComponent
