// Generated on 2015-07-07 using generator-angular 0.12.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'
module.exports = function (grunt) {
  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  grunt.loadNpmTasks('grunt-connect-proxy');

  grunt.loadNpmTasks('grunt-string-replace');

  grunt.loadNpmTasks('grunt-zip');

  // Automatically load required Grunt tasks
  require('jit-grunt')(grunt, {
    useminPrepare: 'grunt-usemin'
  });

  var serveStatic = require('serve-static');
  var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist'
  };

  var generateReplacement = function () {
      var modules = ['home', 'registration', 'clinic', 'vitals'];
      var replacements = [];

      for (var i in modules) {
          var module = modules[i];
          replacements.push(
            {
              pattern: '<script src="scripts/vendor.' + module + '.min.js"></script>',
              replacement: '<script src="../scripts/vendor.' + module + '.min.js"></script>'
            }
          );
          replacements.push(
            {
              pattern: '<script src="scripts/' + module + '.min.js"></script>',
              replacement: '<script src="../scripts/' + module + '.min.js"></script>'
            }
          );
          replacements.push(
            {
              pattern: '<link rel="stylesheet" href="styles/vendor.' + module + '.min.css">',
              replacement: '<link rel="stylesheet" href="../styles/vendor.' + module + '.min.css">'
            }
          )
      }
      replacements.push(
            {
              pattern: '<link rel="stylesheet" href="styles/main.min.css">',
              replacement: '<link rel="stylesheet" href="../styles/main.min.css">'
            }
      );
      return replacements;

  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
//      bower: {
//        files: ['bower.json'],
//        tasks: ['wiredep']
//      },
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      styles: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0',
        livereload: 35729
      },
      proxies: [
            {
                context: '/openmrs',
                host: 'localhost',
                port: 8080,
                https: true,
                xforward: true
            }
        ],
      livereload: {
        options: {
          open: "http://0.0.0.0:9000/home/",
          middleware: function (connect) {
            return [
              serveStatic('.tmp'),
              connect().use(
                '/bower_components',
                serveStatic('./bower_components')
              ),
              connect().use(
                '/poc_config',
                serveStatic('./poc_config')
              ),
              connect().use(
                '/app/styles',
                serveStatic('./app/styles')
              ),
              serveStatic(appConfig.app),
              proxySnippet
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              serveStatic('.tmp'),
              serveStatic('test'),
              connect().use(
                '/bower_components',
                serveStatic('./bower_components')
              ),
              serveStatic(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: "http://localhost:9000/home/",
          base: '<%= yeoman.dist %>',
          livereload: false,
          middleware: function (connect) {
            return [
              connect().use(
                '/poc_config',
                serveStatic('./poc_config')
              ),
              serveStatic(appConfig.dist),
              proxySnippet
            ];
          }
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish'),
        force: true
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/{,*/}*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/{,*/}*',
            '!<%= yeoman.dist %>/.git{,*/}*',
            'esaude-emr-poc*.zip'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      server: {
        options: {
          map: true
        },
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        ignorePath:  /\.\.\//
      },
      test: {
        devDependencies: true,
        src: '<%= karma.unit.configFile %>',
        ignorePath:  /\.\.\//,
        fileTypes:{
          js: {
            block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
              detect: {
                js: /'(.*\.js)'/gi
              },
              replace: {
                js: '\'{{filePath}}\','
              }
            }
          }
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/scripts/{,*/}*.js',
          '<%= yeoman.dist %>/styles/{,*/}*.css',
          '<%= yeoman.dist %>/styles/fonts/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: ['<%= yeoman.app %>/home/index.html',
             '<%= yeoman.app %>/registration/index.html',
             '<%= yeoman.app %>/vitals/index.html',
             '<%= yeoman.app %>/clinic/index.html'],
      css: '<%= yeoman.app %>/styles/**/*.css',
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/home/index.html',
             '<%= yeoman.dist %>/registration/index.html',
             '<%= yeoman.dist %>/vitals/index.html',
             '<%= yeoman.dist %>/clinic/index.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      js: ['<%= yeoman.dist %>/scripts/{,*/}*.js'],
      options: {
        assetsDirs: [
          '<%= yeoman.dist %>',
          '<%= yeoman.dist %>/styles'
        ],
        patterns: {
          js: [[/(images\/[^''""]*\.(png|jpg|jpeg|gif|webp|svg))/g, 'Replacing references to images']]
        }
      }
    },

     // The following *-min tasks will produce minified files in the dist folder
     // By default, your `index.html`'s <!-- Usemin block --> will take care of
     // minification. These next options are pre-configured if you do not wish
     // to use the Usemin blocks.
     cssmin: {
            minify: {
                expand: true,
                cwd: '<%= yeoman.dist %>/styles/',
                src: ['**/*.css', '!**/*.min.*.css'],
                dest: '<%= yeoman.dist %>/styles/',
                ext: '.min.*.css'
            }
        },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    htmlmin: {
        dist: {
            options: {
                keepClosingSlash:true
            },
            files: [
                {
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    src: [
                        'common/**/*.html',
                        'home/**/*.html',
                        'registration/**/*.html',
                        'vitals/**/*.html',
                        'clinic/**/*.html'
                    ],
                    //src: ['*.html'],
                    dest: '<%= yeoman.dist %>'
                }
            ]
        }
    },
    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'images/{,*/}*.{webp}',
            'styles/fonts/{,*/}*.*',
            'common/application/resources/**/*.json'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: 'bower_components/bootstrap/dist',
          src: 'fonts/*',
          dest: '<%= yeoman.dist %>'
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'copy:styles',
        'imagemin',
        'svgmin'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    },

    //replace javascript url
    'string-replace': {
      inline: {
        files: {
          'dist/': 'dist/**/index.html'
        },
        options: {
          replacements: generateReplacement()
        }
      }
    },

    // Building the distributable package
    zip: {
      'using-router': {
        router: function (filepath) {
          if(filepath.startsWith('dist')) {
            return filepath.replace('dist', 'poc');
          }

          return filepath;
        },
      src: ['dist/**/*', 'poc_config/**/*'],
      dest: 'esaude-emr-poc.zip'
    }
  }

  });

  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run([
        'build',
        'configureProxies',
        'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'autoprefixer:server',
      'configureProxies',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', 'Build the distributable', function(target) {
    var tasks = [
      'clean:dist',
      'useminPrepare',
      'concurrent:dist',
      'autoprefixer',
      'concat',
      'copy:dist',
      'cssmin',
      'usemin',
      'htmlmin',
      'usemin:html',
      'string-replace'
    ];

    if(target == 'package') {
      tasks.push('zip');
      return grunt.task.run(tasks);
    } else {
      return grunt.task.run(tasks);
    }
  });

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
