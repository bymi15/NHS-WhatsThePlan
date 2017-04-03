// Karma configuration
// Generated on Fri Mar 31 2017 02:19:54 GMT+0100 (GMT Daylight Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      '../www/lib/ionic/js/ionic.bundle.js',
      '../www/lib/angular-mocks/angular-mocks.js',
      '../www/lib/firebase/firebase.js',
      '../www/lib/firebase/angularfire.min.js',
      '../www/lib/firebase/initFirebase.js',
      '../www/lib/moment/min/moment.min.js',
      '../www/lib/angular-moment/angular-moment.min.js',
      '../www/lib/underscore/underscore-min.js',
      '../www/lib/angular-underscore-module/angular-underscore-module.js',
      '../www/lib/ion-datetime-picker/release/ion-datetime-picker.min.js',
      'http://cdnjs.cloudflare.com/ajax/libs/validate.js/0.11.1/validate.min.js',
      '../www/js/app.js',
      '../www/js/controllers.js',
      '../www/js/services.js',
      '../www/js/directives.js',
      '../www/js/routes.js',
      'unit-tests/*.js',
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    // Produce test report
    reporters: ['progress', 'html'],

    htmlReporter: {
      outputFile: 'units.html'
    }

  })
}