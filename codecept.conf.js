const fs = require('fs-extra');
const path = require('path');

const gruntConfig = require('./grunt.conf')();

const TestDir = 'test/e2eTests';

const options = gruntConfig.connect.options;
const proxy = gruntConfig.connect.proxies[0];

// Constantly updating config.include with new pages is a pain
// This function adds them automatically
const addPages = (include) => {
  // Read all files in the pages dir
  const pagePaths = fs.readdirSync(`${__dirname}/${TestDir}/pages`);
  
  // Add each file to config.include
  // Skip page.js and anything not ending in .js, like folders
  pagePaths.forEach(pagePath => {
    // We only care about .js files
    // and we don't care about the abstract base class in page.js
    if(!pagePath.endsWith('.js') || pagePath.endsWith('page.js'))
      return;

    // Ex: registrationPage.js
    const pageFilename = path.basename(pagePath);
    
    // Get the name of the page and capitalize the first letter
    // Ex: RegistrationPage
    let pageName = path.basename(pagePath, path.extname(pagePath));
    pageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);

    // Add the page to config.includes so we can reference it in tests
    // After this line config.include will contain a property like...
    // Ex: RegistrationPage: ./test/e2eTests/pages/registrationPage.js
    include[pageName] = `./${TestDir}/pages/${pageFilename}`;
  });

  return include;
};

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
    // Pages in the /pages dir are added automatically
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
};
