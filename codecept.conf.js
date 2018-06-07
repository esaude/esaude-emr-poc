const fs = require('fs-extra');
const path = require('path');

const gruntConfig = require('./grunt.conf')();

const TestDir = 'test/e2eTests';

const options = gruntConfig.connect.options;
const proxy = gruntConfig.connect.proxies[0];

// Constantly updating config.include with new pages is a pain
// This function adds them automatically
const addPages = (include) => {
  const pagePaths = fs.readdirSync(`${__dirname}/${TestDir}/pages`);
  pagePaths.forEach(pagePath => {
    // We only care about .js files
    // and we don't care about the abstract base class in page.js
    if(!pagePath.endsWith('.js') || pagePath.endsWith('page.js'))
      return

    // Ex: registrationPage.js
    const pageFilename = path.basename(pagePath);
    
    // Get the name of the page and capitalize the first letter
    // Ex: RegistrationPage
    let pageName = path.basename(pagePath, path.extname(pagePath));
    pageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);

    // Add the page to the includes section
    // so we can reference it in tests
    // Ex: RegistrationPage: ./test/e2eTests/pages/registrationPage.js
    include[pageName] = `./${TestDir}/pages/${pageFilename}`;
  })

  return include;
}

module.exports.config = {
  tests: `./${TestDir}/**/*_test.js`,
  timeout: 10000,
  output: `./${TestDir}/output`,
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
    `./${TestDir}/hooks.js`,
  ],
  include: addPages({
    I: `./${TestDir}/steps_file.js`,
    Data: `./${TestDir}/data.js`,
    Apis: `./${TestDir}/rest/openMrsApis.js`,
  }),
  bootstrap: false,
  mocha: {
    reporterOptions: {
      reportDir: `${TestDir}/reports`,
      reportFilename: 'pocE2E',
      inlineAssets: true,
      reportPageTitle: 'E2E Test Reports',
      reportTitle: 'E2E Test Reports',
    },
  },
  name: 'esaude-emr-poc',
}
