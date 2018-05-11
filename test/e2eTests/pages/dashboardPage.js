const Page = require('./page')

class LoginPage extends Page {

  constructor() {
    super({
      loaded: {
        element: '#home-link',
        inUrl: '/dashboard',
      },
    })

    this.buttons = {
      clinic: {css: '#clinic'},
      lab: {css: '#lab'},
      pharmacy: {css: '#pharmacy'},
      registration: {css: '#registration'},
      report: {css: '#report'},
      social: {css: '#social'},
      vitals: {css: '#vitals'},
    }

    this.dropdown = {
      hamburgerButton: {css: '.dropdown-toggle'},
      logoutButton: {css: 'a[log-out]'},
    }
  }

  // Logs the user out
  logout() {
    // WaitForElement doesn't seem to work, so waiting for an arbitrary
    // amount of time for the hamburger button to appear
    this.I.wait(3)

    this.I.click(this.dropdown.hamburgerButton)
    this.I.click(this.dropdown.logoutButton)

    // Helps the caller detect whether logout was
    // successful or not
    return {
      // If logout was successful we should be taken to the home page
      successful() {
        const loginPage = require('./loginPage')
        loginPage.isLoaded()
        return loginPage
      },
    }
  }

  // Navigates to the clinic page
  navigateToClinicPage() {
    return this._navigate(this.buttons.clinic, 'clinicPage.js')
  }

  // Navigates to the lab page
  navigateToLabPage() {
    return this._navigate(this.buttons.lab, 'labPage.js')
  }

  // Navigates to the pharmacy page
  navigateToPharmacyPage() {
    return this._navigate(this.buttons.pharmacy, 'pharmacyPage.js')
  }

  // Navigates to the registration page
  navigateToRegistrationPage() {
    return this._navigate(this.buttons.registration, 'registrationPage.js')
  }

  // Navigates to the report page
  navigateToReportPage() {
    return this._navigate(this.buttons.report, 'reportPage.js')
  }

  // Navigates to the social page
  navigateToSocialPage() {
    return this._navigate(this.buttons.social, 'socialPage.js')
  }

  // Navigates to the vitals page
  navigateToVitalsPage() {
    return this._navigate(this.buttons.vitals, 'vitalsPage.js')
  }

  // Navigates to an app by clicking the app's button
  _navigate(button, newPageFile) {
    this.I.waitForElement(button.css, 5)
    this.I.wait(1)
    this.I.click(button)

    const page = require(`./${newPageFile}`)
    page._init()
    page.isLoaded()
    return page
  }
}

module.exports = new LoginPage()
