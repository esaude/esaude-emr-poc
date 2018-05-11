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
      registration: {css: '#registration'},
      social: {css: '#social'},
      vitals: {css: '#vitals'},
      clinic: {css: '#clinic'},
      pharmacy: {css: '#pharmacy'},
      lab: {css: '#lab'},
      report: {css: '#report'},
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

  // Navigates to the registration page
  navigateToRegistrationPage() {
    return this._navigate(this.buttons.registration, './registrationPage.js')
  }

  // Navigates to an app by clicking the app's button
  _navigate(button, newPageFile) {
    this.I.waitForElement(button.css, 5)
    this.I.wait(1)
    this.I.click(button)

    const page = require(newPageFile)
    page._init()
    page.isLoaded()
    return page
  }
}

module.exports = new LoginPage()
