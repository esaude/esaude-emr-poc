// Generated on 2015-07-07 using generator-angular 0.12.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'
/* eslint-disable angular/module-getter */
module.exports = function (grunt) {
  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  grunt.loadNpmTasks('grunt-connect-proxy');

  grunt.loadNpmTasks('grunt-string-replace');

  grunt.loadNpmTasks('grunt-zip');

  grunt.loadNpmTasks('grunt-gitinfo');

  // Automatically load required Grunt tasks
  require('jit-grunt')(grunt, {
    useminPrepare: 'grunt-usemin'
  });

  // Define the configuration for all the tasks
  var config = require('./grunt.conf')(grunt);
  grunt.initConfig(config);

  grunt.registerTask('serve', 'Compile then start a connect web server', (target) => {
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

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', (target) => {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('lint', [
    'force:on', // TODO: Allow the task to fail once we've fixed all existing errors
    'eslint',
    'force:off'
  ]);

  grunt.registerTask('test', [
    'lint',
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', 'Build the distributable', (target) => {
    var tasks = [
      'lint',
      'gitinfo',
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
      'string-replace',
      'replace'
    ];

    if(target == 'package') {
      tasks.push('zip');
      return grunt.task.run(tasks);
    } else {
      return grunt.task.run(tasks);
    }
  });

  grunt.registerTask('default', [
    'lint',
    'test',
    'build'
  ]);
};
