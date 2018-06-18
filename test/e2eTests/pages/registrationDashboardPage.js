const Page = require('./page');

const LOG_TAG = '[RegistrationDashboardPage]';

class RegistrationDashboardPage extends Page {

  constructor() {
    super({
      isLoaded: {
        element: '[ui-sref="dashboard.program"]',
        urlPart: '/registration/#/dashboard',
      },
      components: ['patientSearch', 'checkIn'],
    });

    this.buttons = {
      nextStep: { css: '#next-step' },
      cancel: locate('button').find('span').withText('Cancel'),
      addIdentifier: locate('button').find('span').withText(this.translate('REGISTRATION_ADD_IDENTIFIER')),
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

  // Verify if the new patient page is loaded
  verifyNewPatientPage() {
    this.I.seeInCurrentUrl('/#/patient/new/identifier');
    this.I.seeElement(this.tabs.identifiers);
    this.I.seeElement(this.tabs.name);
    this.I.seeElement(this.tabs.gender);
    this.I.seeElement(this.tabs.age);
    this.I.seeElement(this.tabs.address);
    this.I.seeElement(this.tabs.contacts);
    this.I.seeElement(this.tabs.testing);
    this.I.see('NID (SERVICO TARV)');
  }
}

module.exports = new RegistrationDashboardPage();
