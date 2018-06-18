// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2015-07-07 using
// generator-karma 1.0.0

module.exports = config => {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../../',

    // testing framework to use (jasmine/mocha/qunit/...)
    // as well as any additional frameworks (requirejs/chai/sinon/...)
    frameworks: [
      'jasmine',
      'angular-filesort'
    ],

    // list of files / patterns to load in the browser
    files: [
      // bower libraries
      // bower:js
      'bower_components/q/q.js',
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/moment/moment.js',
      'bower_components/moment-timezone/moment-timezone.js',
      'bower_components/keyboard/dist/js/jquery.keyboard.min.js',
      'bower_components/keyboard/dist/js/jquery.keyboard.extension-all.min.js',
      'bower_components/keyboard/dist/layouts/keyboard-layouts-combined.min.js',
      'bower_components/keyboard/dist/layouts/keyboard-layouts-greywyvern.min.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/chart.js/dist/Chart.js',
      'bower_components/angular-chart.js/dist/angular-chart.js',
      'bower_components/angular-smart-table/dist/smart-table.js',
      'bower_components/jquery-cookie/jquery.cookie.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/lodash/dist/lodash.js',
      'bower_components/angular-local-storage/dist/angular-local-storage.js',
      'bower_components/zeroclipboard/dist/ZeroClipboard.js',
      'bower_components/angular-translate/angular-translate.js',
      'bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
      'bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
      'bower_components/angular-translate-storage-local/angular-translate-storage-local.js',
      'bower_components/angular-translate-handler-log/angular-translate-handler-log.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-smart-table/dist/smart-table.js',
      'bower_components/bootstrap-switch/dist/js/bootstrap-switch.js',
      'bower_components/angular-bootstrap-switch/dist/angular-bootstrap-switch.js',
      'bower_components/ng-clip/src/ngClip.js',
      'bower_components/zeroclipboard/dist/ZeroClipboard.js',
      'bower_components/angular-bootstrap-checkbox/angular-bootstrap-checkbox.js',
      'bower_components/angular-messages/angular-messages.js',
      'bower_components/select2/select2.js',
      'bower_components/angular-ui-select2/src/select2.js',
      'bower_components/angular-ui-mask/dist/mask.js',
      'bower_components/angular-barcode/dist/angular-barcode.js',
      'bower_components/angular-barcode-listener/angular-barcode-listener.js',
      'bower_components/ng-dialog/js/ngDialog.js',
      'bower_components/toastr/toastr.js',
      'bower_components/angular-breadcrumb/dist/angular-breadcrumb.js',
      'bower_components/angular-loading-bar/build/loading-bar.js',

      // endbower
      // application files
      'app/**/*.js',
      'app/home/**/*.js',
      'app/common/**/*.js',
      'app/**/*.html',
      // fixtures
      'test/unitTests/fixtures/**/*.json',
      //test utils
      'test/unitTests/spec/support/**/*.js',
      // test files
      'test/unitTests/spec/**/*.js'
    ],

    angularFilesort: {
      whitelist: [
        'app/**/*.js'
      ]
    },

    // list of files / patterns to exclude
    exclude: [],

    preprocessors: {
      'app/**/*.js': ['coverage'],
      'test/unitTests/fixtures/**/*.json': ['json_fixtures'],
      'app/**/*.html': ['ng-html2js']
    },

    jsonFixturesPreprocessor: {
      stripPrefix: 'test/fixtures/'
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'app/',
      prependPrefix: '../',
      moduleName: 'templates'
    },

    reporters: ['spec', 'coverage'],

    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/'
    },

    // web server port
    port: 9001,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'ChromeHeadless'
    ],

    // Which plugins to enable
    plugins: [
      'karma-jasmine',
      'karma-coverage',
      'karma-spec-reporter',
      'karma-json-fixtures-preprocessor',
      'karma-angular-filesort',
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-ng-html2js-preprocessor'
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--no-sandbox',
          '--headless',
          '--disable-gpu',
          '--disable-translate',
          '--disable-extensions',
          '--remote-debugging-port=9222' // Without a remote debugging port, Google Chrome exits immediately.
        ]
      }
    }
  });
};
