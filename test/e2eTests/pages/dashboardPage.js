const Page = require('./page');

class DashboardPage extends Page {

  constructor() {
    super({
      isLoaded: {
        element: '[ng-app="home"]',
        urlPart: '/home/',
      },
    });

    this.buttons = {
      clinic: {css: '#clinic'},
      lab: {css: '#lab'},
      pharmacy: {css: '#pharmacy'},
      registration: {css: '#registration'},
      report: {css: '#report'},
      social: {css: '#social'},
      vitals: {css: '#vitals'},
    };


  }

  // Navigates to the clinic page
  navigateToClinicPage() {
    return this._navigate(this.buttons.clinic, 'clinicPage.js');
  }

  // Navigates to the lab page
  navigateToLabPage() {
    return this._navigate(this.buttons.lab, 'labPage.js');
  }

  // Navigates to the pharmacy page
  navigateToPharmacyPage() {
    return this._navigate(this.buttons.pharmacy, 'pharmacyPage.js');
  }

  // Navigates to the registration page
  navigateToRegistrationPage() {
    return this._navigate(this.buttons.registration, 'registrationPage.js');
  }

  // Navigates to the report page
  navigateToReportPage() {
    return this._navigate(this.buttons.report, 'reportPage.js');
  }

  // Navigates to the social page
  navigateToSocialPage() {
    return this._navigate(this.buttons.social, 'socialPage.js');
  }

  // Navigates to the vitals page
  navigateToVitalsPage() {
    return this._navigate(this.buttons.vitals, 'vitalsPage.js');
  }

  // Navigates to an app by clicking the app's button
  _navigate(button, newPageFile) {
    this.I.waitForElement(button.css, 5);
    this.I.wait(1);
    this.I.click(button);

    const page = require(`./${newPageFile}`);
    page._init();
    page.isLoaded();
    return page;
  }
}

module.exports = new DashboardPage();
