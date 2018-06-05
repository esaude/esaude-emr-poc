var gruntConfig = require('./grunt.conf')()

var options = gruntConfig.connect.options
var proxy = gruntConfig.connect.proxies[0]

module.exports.config = {
  tests: './test/e2eTests/**/*_test.js',
  timeout: 10000,
  output: './test/e2eTests/output',
  helpers: {
    Puppeteer: {
      url: `http://${options.hostname}:${options.port}`,
      driver: 'hosted',
      browser: 'chrome',
      rootElement: 'body',
      show: true,
    },
    REST: {
      endpoint: `http://${proxy.host}:${proxy.port}${proxy.context}/ws/rest/v1`,
      defaultHeaders: {
        'Content-Type': 'application/json',
        Authorization: 'Basic YWRtaW46ZVNhdWRlMTIz'
      },
    },
  },
  hooks: [
    './test/e2eTests/hooks.js',
  ],
  include: {
    I: './test/e2eTests/steps_file.js',

    Data: './test/e2eTests/data.js',

    ClinicDashboardPage: './test/e2eTests/pages/clinicDashboardPage.js',
    DashboardPage: './test/e2eTests/pages/dashboardPage.js',
    LoginPage: './test/e2eTests/pages/loginPage.js',
    RegistrationDashboardPage: './test/e2eTests/pages/registrationDashboardPage.js',
    RegistrationPage: './test/e2eTests/pages/registrationPage.js',

    Apis: './test/e2eTests/rest/openMrsApis.js',
  },
  bootstrap: false,
  mocha: {
    reporterOptions: {
      reportDir: 'test/e2eTests/reports',
      reportFilename: 'pocE2E',
      inlineAssets: true,
      reportPageTitle: 'E2E Test Reports',
      reportTitle: 'E2E Test Reports',
    },
  },
  name: 'esaude-emr-poc',
}