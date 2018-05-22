// Karma configuration
// Generated on Fri May 18 2018 14:13:57 GMT+0300 (EEST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ["jasmine", "karma-typescript", 'jasmine-dom-matchers'],


    // list of files / patterns to load in the browser
    files: [
      { pattern: "scripts/**/*.ts" },
      { pattern: "tests/**/*.ts" },
    ],

    karmaTypescriptConfig: {
      compilerOptions: {
          module: "commonjs"
      },
      tsconfig: "./tsconfig.json",
    },

    client: {
      //If false, Karma will not remove iframes upon the completion of running the tests
      clearContext:false,
      //karma-html configuration
      karmaHTML: {
        source: [
          //indicate 'index.html' file that will be loaded in the browser
          //the 'index' tag will be used to get the access to the Document object of 'index.html'
          {src:'./index.html', tag:'index'}
        ],
        auto: true
      }
    },

    // list of files / patterns to exclude
    exclude: [
      'scripts/main.ts'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        "**/*.ts": "karma-typescript" // *.tsx for React Jsx
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ["progress", "karma-typescript", 'karmaHTML'],

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
