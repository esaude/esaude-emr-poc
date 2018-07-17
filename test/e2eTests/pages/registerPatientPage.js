const Page = require('./page');

const LOG_TAG = '[RegisterPatientPage]';

class RegisterPatientPage extends Page {

  constructor() {
    super({
      isLoaded: {
        element: '[id="status-buttons"]',
        urlPart: 'registration/#/patient/new/identifier',
      },
    });

    this.buttons = {
      nextStep: { css: '#next-step' },
      cancel: locate('button').find('span').withText('Cancel'),
      addIdentifier: locate('button').find('span').withText(this.translate('REGISTRATION_ADD_IDENTIFIER')),
      removeIdentifier: locate('button').withAttr({ class: 'btn btn-danger btn-lg' }),
      confirm: { css: '#confirm' },
    };

    this.tabs = {
      identifiers: locate('a').withChild('span').withText('1'),
      name: locate('a').withChild('span').withText('2'),
      gender: locate('a').withChild('span').withText('3'),
      age: locate('a').withChild('span').withText('4'),
      address: locate('a').withChild('span').withText('5'),
      contacts: locate('a').withChild('span').withText('6'),
      testing: locate('a').withChild('span').withText('7'),
    };

    this.fields = {
      nid: 'input[ng-model="pi.identifier"',
      identifierType: { css: 'form select[id=patient_identifier_type]' },
      givenName: { css: '#givenName' },
      familyName: { css: '#patientSurname' },
      nickname: { css: '#Alcunha' },
      birthDate: { css: '#createdDate1' },
      country: { css: '#country' },
      province: { css: '#stateProvince' },
      district: { css: '#countyDistrict' },
      administrativePost: { css: '#address2' },
      locality: { css: '#address6' },
      neighborhood: { css: '#address5' },
      cell: { css: '#address3' },
      street: { css: '#address1' },
      provenience: 'select[id="d10628a7-ba75-4495-840b-bf6f1c44fd2d"]',
      reference: { css: '#Ponto de Referência' },
      phone1: { css: '#Numero de Telefone 1' },
      phone2: { css: '#Numero de Telefone 2' },
      hivTestDate: 'input[id="46e79fce-ba89-4ec9-8f31-2dfd9318d415"',
      hivTestType: 'select[id="ce778a93-66f9-4607-9d80-8794ed127674"]',
      hivTestResult: 'select[id="31cb61f4-3d81-403d-94e9-64cce17a2a00"',
    };

    this.elements = {
      summary: 'patient-confirm-step',
      successElement: '.toast-success'
    };
  }

  // Check additional elements
  isLoaded() {
    super.isLoaded();
    this.I.seeElement(this.tabs.identifiers);
    this.I.seeElement(this.tabs.name);
    this.I.seeElement(this.tabs.gender);
    this.I.seeElement(this.tabs.age);
    this.I.seeElement(this.tabs.address);
    this.I.seeElement(this.tabs.contacts);
    this.I.seeElement(this.tabs.testing);
    this.I.see('NID (SERVICO TARV)');
  }

  fillIdentifierForm(patient) {
    this.I.fillField(this.fields.nid, patient.identifiers[0].identifier3);
  }

  fillNameForm(patient) {
    this.I.fillField(this.fields.givenName, patient.person.names[0].givenName);
    this.I.fillField(this.fields.familyName, patient.person.names[0].familyName);
  }

  selectGender(patient) {
    const genderButton = `label[for="patientGender${patient.person.gender}"]`;
    this.I.click(genderButton);
  }

  fillBirthDateForm(patient) {
    this.I.click(this.fields.birthDate);
    this.I.fillField(this.fields.birthDate, patient.person.birthdate);
    this.I.click('Done');
  }

  fillContactForm(patient) {
    this.I.fillField(this.fields.street, patient.contacts.street);
    this.I.fillField(this.fields.cell, patient.contacts.cell);
    this.I.fillField(this.fields.neighborhood, patient.contacts.neighborhood);
    this.I.fillField(this.fields.locality, patient.contacts.locality);
    this.I.fillField(this.fields.administrativePost, patient.contacts.administrativePost);
    this.I.fillField(this.fields.district, patient.contacts.district);
    this.I.fillField(this.fields.province, patient.contacts.province);
    this.I.fillField(this.fields.country, patient.contacts.country);
  }

  selectProvenience(patient) {
    this.I.selectOption(this.fields.provenience, patient.contacts.provenience);
  }

  fillHIVTestForm(patient) {
    this.I.click(this.fields.hivTestDate);
    this.I.fillField(this.fields.hivTestDate, patient.tests.testDate);
    this.I.click('Done');
    this.I.selectOption(this.fields.hivTestType, patient.tests.testType);
    this.I.selectOption(this.fields.hivTestResult, patient.tests.testResult);
  }

  clickNext(seconds = 5) {
    this.I.click(this.buttons.nextStep);
    this.I.waitForInvisible('#overlay', seconds);
  }

}

module.exports = new RegisterPatientPage();
