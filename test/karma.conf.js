// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2015-07-07 using
// generator-karma 1.0.0

module.exports = function (config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

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
      'bower_components/jquery/dist/jquery.min.js',
      'bower_components/angular/angular.min.js',
      'bower_components/bootstrap/dist/js/bootstrap.min.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
      'bower_components/moment/min/moment.min.js',
      'bower_components/jquery-ui/ui/minified/jquery-ui.min.js',
      'bower_components/keyboard/dist/js/jquery.keyboard.min.js',
      'bower_components/keyboard/dist/layouts/keyboard-layouts-combined.min.js',
      'bower_components/keyboard/dist/layouts/keyboard-layouts-greywyvern.min.js',
      'bower_components/angular-route/angular-route.min.js',
      'bower_components/angular-ui-router/release/angular-ui-router.min.js',
      'bower_components/Chart.js/Chart.min.js',
      'bower_components/angular-chart.js/dist/angular-chart.min.js',
      'bower_components/angular-smart-table/dist/smart-table.min.js',
      'bower_components/keyboard/dist/js/jquery.keyboard.extension-all.min.js',
      'bower_components/jquery-cookie/jquery.cookie.js',
      'bower_components/angular-cookies/angular-cookies.min.js',
      'bower_components/lodash/dist/lodash.min.js',
      'bower_components/angular-local-storage/dist/angular-local-storage.min.js',
      'bower_components/ng-clip/dest/ng-clip.min.js',
      'bower_components/zeroclipboard/dist/ZeroClipboard.min.js',
      'bower_components/angular-translate/angular-translate.min.js',
      'bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
      'bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.min.js',
      'bower_components/angular-translate-storage-local/angular-translate-storage-local.js',
      'bower_components/angular-translate-handler-log/angular-translate-handler-log.min.js',
      'bower_components/angular-mocks/angular-mocks.js',

      'bower_components/angular-smart-table/dist/smart-table.min.js',
      'bower_components/angular-datepicker/dist/angular-datepicker.min.js',
      'bower_components/bootstrap-switch/dist/js/bootstrap-switch.min.js',
      'bower_components/angular-bootstrap-switch/dist/angular-bootstrap-switch.min.js',
      'bower_components/ng-clip/dest/ng-clip.min.js',
      'bower_components/zeroclipboard/dist/ZeroClipboard.min.js',
      'bower_components/angular-bootstrap-checkbox/angular-bootstrap-checkbox.js',
      'bower_components/angular-messages/angular-messages.min.js',
      'bower_components/d3/d3.min.js',
      'bower_components/nvd3/build/nv.d3.min.js',
      'bower_components/angularjs-nvd3-directives/dist/angularjs-nvd3-directives.min.js',
      'bower_components/select2/select2.min.js',
      'bower_components/angular-ui-select2/src/select2.js',

      // endbower
      // bundled libraries
      'lib/modernizr.custom.80690.js',
      // application files
      'app/**/*.js',
      'app/common/**/*.js',
      // fixtures
      'test/fixtures/**/*.json',
      //test utils
      'test/spec/support/**/*.js',
      // test files
      'test/spec/**/*.js'
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
      'test/fixtures/**/*.json': ['json_fixtures']
    },

    jsonFixturesPreprocessor: {
      stripPrefix: 'test/fixtures/'
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
      'PhantomJS'
    ],

    // Which plugins to enable
    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-coverage',
      'karma-spec-reporter',
      'karma-json-fixtures-preprocessor',
      'karma-angular-filesort'
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
