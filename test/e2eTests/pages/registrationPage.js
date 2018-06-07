const Page = require('./page')

class RegistrationPage extends Page {

  constructor() {
    super({
      isLoaded: {
        element: '[ng-app="registration"]',
        urlPart: '/registration',
      },
      components: ['patientSearch'],
    })

    this.translator = require('./../translator.js')

    this.buttons = {
      newPatient: { css: '#new-patient' },
      nextStep: { css: '#next-step' },
      cancel: locate('button').find('span').withText('Cancel'),
      addIdentifier: locate('button').find('span').withText('Adicionar Identificador'),
    }

    // TODO: add css locators to this links in the app
    this.tabs = {
      identifiers: locate('a').withText(this.translator.localize('IDENTIFIERS')),
      name: locate('a').withText(this.translator.localize('NAME')),
      gender: locate('a').withText(this.translator.localize('GENDER')),
      age: locate('a').withText(this.translator.localize('AGE')),
      address: locate('a').withText(this.translator.localize('ADDRESS')),
      other: locate('a').withText(this.translator.localize('CONTACTS')),
      testing: locate('a').withText(this.translator.localize('HIV_TESTING'))
    }

    this.fields = {
      nid: 'input[ng-model="pi.identifier"',
      identifierType: { css: 'form select[id=patient_identifier_type]' }
    }

  }

  // Go to new Patient page
  initRegistration() {
    this.I.waitForElement(this.buttons.newPatient)
    this.I.click(this.buttons.newPatient);

    // Wait for the page to load
    this.I.wait(1)

    this.I.seeInCurrentUrl('/#/patient/new/identifier')

    this.I.seeElement(this.tabs.identifiers)
    this.I.seeElement(this.tabs.name)
    this.I.seeElement(this.tabs.gender)
    this.I.seeElement(this.tabs.age)
    this.I.seeElement(this.tabs.address)
    this.I.seeElement(this.tabs.other)
    this.I.seeElement(this.tabs.testing)

    this.I.see('NID (SERVICO TARV)')

  }

  // Cancel the registration
  cancelRegistration() {
    this.I.click(this.buttons.cancel)
    this.isLoaded()
  }
}

module.exports = new RegistrationPage()