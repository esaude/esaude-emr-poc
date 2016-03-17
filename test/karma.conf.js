// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2015-07-07 using
// generator-karma 1.0.0

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    // as well as any additional frameworks (requirejs/chai/sinon/...)
    frameworks: [
      "jasmine"
    ],

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'bower_components/moment/moment.js',
      'bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
      'bower_components/jquery-ui/ui/jquery-ui.js',
      'bower_components/keyboard/dist/js/jquery.keyboard.min.js',
      'bower_components/keyboard/dist/layouts/keyboard-layouts-combined.min.js',
      'bower_components/keyboard/dist/layouts/keyboard-layouts-greywyvern.min.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/Chart.js/Chart.min.js',
      'bower_components/angular-chart.js/dist/angular-chart.min.js',
      'bower_components/ng-clip/dest/ng-clip.min.js',
      'bower_components/angular-local-storage/dist/angular-local-storage.min.js',
      'bower_components/zeroclipboard/dist/ZeroClipboard.min.js',
      // endbower
      // application dependencies
      'app/common/application/init.js',
      'app/common/application/services/applicationService.js',
      'app/common/ui-helper/init.js',
      'app/common/ui-helper/spinner.js',
      'app/common/auth/init.js',
      'app/common/auth/user.js',
      'app/common/auth/userService.js',
      'app/common/auth/authentication.js',
      'app/common/domain/init.js',
      'app/common/domain/services/locationService.js',
      'app/common/app-framework/init.js',
      'app/common/app-framework/models/appDescriptor.js',
      'app/common/app-framework/services/appService.js',
      // application files to test
      'app/home/**/*.js',
      // test files
      'test/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [],

    preprocessors: {
      'app/**/*.js': ['coverage']
    },

    reporters: ['progress', 'coverage'],

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
      "karma-phantomjs-launcher",
      "karma-jasmine",
      "karma-coverage"
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
  });
};
