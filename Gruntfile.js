module.exports = function(grunt) {
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadTasks("tasks");

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    buildDir: "./build",

    clean: ["<%= buildDir %>"],

    browserify: {
      test: {
        files: {
          "<%= buildDir %>/test.js": ["test/test.js"]
        },
        options: {
          debug: true,
          standalone: "doitlive-test"
        }
      },
      dist: {
        files: {
          "<%= buildDir %>/doitlive.js": ["src/index.js"]
        },
        options: {
          transform: [],
          debug: true,
          standalone: "doitlive"
        }
      }
    },

    jshint: {
      options: {
        jshintrc: true
      },
      files: ["src/**/*.js"]
    },

    connect: {
      test: {
        options: {
          port: 8889,
          base: ".",
          directory: "./"
        }
      }
    },

    testee: {
      local: {
        options: {
          urls: ["http://localhost:8889/test/test.html"],
          browsers: ["phantom"]
        }
      }
    }
  });

  grunt.registerTask("test", ["browserify:test", "connect:test", "testee:local"]);

  grunt.registerTask("default", [
    "clean",
    "jshint",
    "test",
    "browserify:dist"
  ]);
};
