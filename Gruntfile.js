'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    nodeunit: {
      files: ['tests/*_test.js'],
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        camelcase: true,
        forin: true,
        indent: 2,
        newcap: true,
        noarg: true,
        noempty: true,
        nonew: true,
        undef: true,
        node: true,
        unused: true
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        src: ['index.js']
      },
      test: {
        src: ['tests/*.js']
      },
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: ['jshint:lib', 'nodeunit']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:lib','jshint:test', 'nodeunit']
      },
    },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['jshint', 'nodeunit']);

};