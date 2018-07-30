const Page = require('./page');

/**
 * Represents the vitals page for adults
 * and includes functionality that facilitates interacting
 * with the page during tests
 */
class VitalsAdultFormPage extends Page {
  constructor() {
    super({
      isLoaded: {
        element: '[name="aForm"]',
        urlPart: '/vitals/adult',
      },
    });

    this._initFieldsProperty();
  }

  /**
   * Fills the vitals form with data
   * @param {number} data.temperature
   * @param {number} data.weight
   * @param {number} data.height
   * @param {number} data.systolicBloodPressure
   * @param {number} data.diastolicBloopPressure
   * @param {number} data.cardiacFrequency
   * @param {number} data.respiratoryRate
   */
  fillForm(data) {
    this.I.fillField(this.fields.temperature, data.temperature);
    this.I.fillField(this.fields.weight, data.weight);
    this.I.fillField(this.fields.height, data.height);
    this.I.fillField(this.fields.systolicBloodPressure, data.systolicBloodPressure);
    this.I.fillField(this.fields.diastolicBloodPressure, data.diastolicBloodPressure);
    this.I.fillField(this.fields.cardiacFrequency, data.cardiacFrequency);
    this.I.fillField(this.fields.respiratoryRate, data.respiratoryRate);
  }

  /** Clicks the next button */
  clickNext() {
    this.I.click('[name="aForm"] button');
  }

  /**
   * Verifies the form data is as expected
   * @param {number} data.temperature
   * @param {number} data.weight
   * @param {number} data.height
   * @param {number} data.systolicBloodPressure
   * @param {number} data.diastolicBloopPressure
   * @param {number} data.cardiacFrequency
   * @param {number} data.respiratoryRate
   */
  verifyForm(data) {
    this.I.see(data.temperature);
    this.I.see(data.weight);
    this.I.see(data.height);
    this.I.see(data.systolicBloodPressure);
    this.I.see(data.diastolicBloodPressure);
    this.I.see(data.cardiacFrequency);
    this.I.see(data.respiratoryRate);
  }

  /** Clicks the confirm button */
  clickConfirm() {
    this.I.click('form-wizard-confirm-part button');

    // Wait a moment for the next page to load
    this.I.waitForInvisible('#overlay', 5);
    this.I.wait(1);
    this.I.waitForInvisible('#overlay', 5);

    const clinicDashboardPage = require('./clinicDashboardPage');
    clinicDashboardPage._init();
    clinicDashboardPage.isLoaded();
    return clinicDashboardPage;
  }

  /** Initializes the data that is used to find fields in the DOM */
  _initFieldsProperty() {
    const getFieldData = (fieldName) => `input[name="${fieldName}"]`;

    this.fields = {
      temperature: getFieldData('Temperatura'),
      weight: getFieldData('Peso'),
      height: getFieldData('Altura'),
      systolicBloodPressure: getFieldData('PressoArterialSistolica'),
      diastolicBloodPressure: getFieldData('PressoArterialDiastolica'),
      cardiacFrequency: getFieldData('FrequenciaCardiaca'),
      respiratoryRate: getFieldData('FrequenciaRespiratria'),
    };
  }
}

module.exports = new VitalsAdultFormPage();
