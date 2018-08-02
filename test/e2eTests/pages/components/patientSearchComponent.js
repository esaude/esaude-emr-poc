const Component = require('./component');

const LOG_TAG = '[PatientSearchComponent]';

/**
 * Functions that help tests interact with the patient search bar
 * @extends Component
 */
class PatientSearchComponent extends Component {
  constructor() {
    super();
    this.searchBox = 'input[ng-model="vm.searchText"';
  }

  /**
   * By default the search bar with automatically select the first
   * patient in the results array. This is problem in several scenarios
   * including those that want to verify what's on the page without selecting
   * a patient and those that want to select a result other than the first.
   * This function must be called before searching the disable autoselection
   */
  disableAutoSelect() {
    this.I.waitForElement('barcode-listener', 10);
    
    // Update auto selection
    this.I.executeScript(() => angular.element('barcode-listener').data('auto-select', false));
  }

  /**
   * Searches in the search box
   * @param {string} text - the test to search for
   */
  search(text) {
    this.I.waitForElement(this.searchBox);
    
    // Search
    this.I.fillField(this.searchBox, text);

    // Wait for the search to complete
    this.I.waitForInvisible('#overlay', 5);

    this.I.wait(1);
  }

  /**
   * Clicks the search result associated with the given patient
   * Fails the test if the patient is not in the results
   * @param {object} patient - the patient to click
   */
  clickSearchResult(patient) {
    const patientId = patient.identifiers[0].identifier;

    // Make sure the element is visible
    this.I.waitForText(patientId, 5, '.patient-identifier');

    // Find the correct element and click it 
    this.I.executeScript((patientId) => {
      try {
        // Get the div that displays the patient's id
        const patientIdElement = angular.element(`td.patient-identifier:contains('${patientId}')`);
        
        // Get the row element containing the patient id because
        // it's the element we need to click to navigate to the patient's page
        const patientRow = patientIdElement.parent('tr[st-select-row="patient"');
        
        // Click it
        patientRow.click();
      } catch(e) {
        $log.log(`Unable to find patient with id ${patientId}. Error: ${e}`);
      }
      
    }, patientId);

    this.I.say(`${LOG_TAG} wait for next page to load`);
    this.I.wait(2);
  }

  /** Clears the search box */
  clearSearch() {
    this.I.waitForElement(this.searchBox);

    this.I.fillField(this.searchBox, '');

    // Wait for the search to complete
    this.I.waitForInvisible('#overlay', 5);
  }

  /**
   * Validates the patient's information is visible
   * @param {object} patient - info about the patient to validate
   */
  seePatientRecord(patient) {
    const birthdate = new Date(patient.person.birthdate);
    const age = this._calculateAge(birthdate);

    this.I.see(patient.identifiers[0].identifier);
    this.I.see(patient.person.names[0].givenName);
    this.I.see(patient.person.names[0].familyName);
    this.I.see(patient.person.gender);
    this.I.see(age);

    // TODO: Validate birthdate
    // Birthdate is giving me trouble. The server returns a date that's always a day earlier
    // This may be because the browser and server have a different timezone/locale
    //this.I.see(`${birthdate.getDate()}/${birthdate.getMonth() + 1}/${birthdate.getFullYear()}`)

    // TODO: Validate scheduled day for consultation
  }

  /**
   * Validates that the patient's info is NOT visible
   * @param {object} patient - info about the patient to validate is NOT vissible
   */
  dontSeePatientRecord(patient) {
    this.I.dontSee(patient.identifiers[0].identifier);
    this.I.dontSee(patient.person.names[0].givenName);
    this.I.dontSee(patient.person.names[0].familyName);
  }

  /** Validates that no results are visible */
  seeNoResults() {
    this.I.see('Nenhum resultado encontrado');
  }

  /**
   * Searches for the patient by their id, verifies
   * the search result and then selects the patient
   * @param {object} patient - info about the patient used to search, verify and select
   */
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

module.exports = PatientSearchComponent;
