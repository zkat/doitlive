module.exports = function(grunt) {
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks("grunt-mocha-test");

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    buildDir: "./build",

    clean: ["<%= buildDir %>"],

    browserify: {
      dist: {
        files: {
          '<%= buildDir %>/doitlive.js': ['src/index.js']
        },
        options: {
          transform: [],
          debug: true
        }
      }
    },

    jshint: {
      options: {
        jshintrc: true
      },
      files: ["src/**/*.js"]
    },

    mochaTest: {
      test: {
        options: {
          reporter: "spec"
        },
        src: ["src/**/*test.js"]
      }
    }
  });

  grunt.registerTask("default", [
    "clean",
    "jshint",
    "mochaTest",
    "browserify:dist"
  ]);
};
