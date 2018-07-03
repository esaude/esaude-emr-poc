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
      provenience: { css: 'form select[id=Proveniência]' },
      reference: { css: '#Ponto de Referência' },
      phone1: { css: '#Numero de Telefone 1' },
      phone2: { css: '#Numero de Telefone 2' },
      hivTestDate: { css: '#Data do teste HIV' },
      testType: { css: '#Tipo de teste HIV' },
      testResult: { css: '#Resultado do Teste HIV' }
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
    this.I.click(patient.person.gender == 'F' ? this.translate('COMMON_MALE') : this.translate('COMMON_MALE'));
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

  clickNext(seconds = 5) {
    this.I.click(this.buttons.nextStep);
    this.I.waitForInvisible('#overlay', seconds);
  }

}

module.exports = new RegisterPatientPage();
