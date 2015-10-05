module.exports = function(grunt) {
  // load up all of the necessary grunt plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-casperjs');
  grunt.loadNpmTasks('grunt-mocha');


  // in what order should the files be concatenated
  var clientIncludeOrder = require('./include.conf.js');

  // grunt setup
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // create a task called clean, which
    // deletes all files in the listed folders
    clean: {
      dist: 'dist/*',
      results: 'results/*'
    },

    // what files should be linted
    jshint: {
      gruntfile: 'Gruntfile.js',
      client: clientIncludeOrder,
      server: 'server/**/*.js',
      options: {
        globals: {
          eqeqeq: true
        }
      }
    },

    // uglify the files
    uglify: {
      speedTyper: {
        files: {
          'dist/client/scripts/game.js': clientIncludeOrder
        }
      }
    },

    // copy necessary files to our dist folder
    copy: {
      // create a task for client files
      client: {
        // Copy everything but the to-be-concatenated todo JS files
        src: [ 'client/**', '!client/scripts/todo/**' ],
        dest: 'dist/'
      },
      // create a task for server files
      server: {
        src: [ 'server/**' ],
        dest: 'dist/'
      }
    },

    // concat all the js files
    concat: {
      lib: {
        files: {
          'dist/client/lib/lib.js': [
            './bower_components/jquery/jquery.min.js',
            './bower_components/underscore/underscore.js',
            './bower_components/backbone/backbone.js',
            './bower_components/d3/d3.min.js',
            './bower_components/socket.io-client/socket.io.js'
          ]
        }
      },
      game: {
        files: {
          // concat all the todo js files into one file
          'dist/client/scripts/game.js': clientIncludeOrder
        }
      }
    },

    // configure the server
    express: {
      dev: {
        options: {
          script: 'dist/server/server.js'
        }
      }
    },

    // configure karma
    karma: {
      options: {
        configFile: 'karma.conf.js',
        reporters: ['progress', 'coverage']
      },
      // Watch configuration
      watch: {
        background: true,
        reporters: ['progress']
      },
      // Single-run configuration for development
      single: {
        singleRun: true,
      },
      // Single-run configuration for CI
      ci: {
        singleRun: true,
        coverageReporter: {
          type: 'lcov',
          dir: 'results/coverage/'
        }
      }
    },

    // create a watch task for tracking
    // any changes to the following files
    watch: {
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: 'jshint:gruntfile'
      },
      client: {
        files: [ 'client/**' ],
        // tasks: [ 'build', 'karma:watch:run', 'casperjs' ]
        tasks: [ 'build', 'karma:watch:run' ]
      },
      server: {
        files: [ 'server/**' ],
        // tasks: [ 'build', 'express:dev', 'casperjs' ],
        tasks: [ 'build', 'express:dev' ],
        options: {
          spawn: false // Restart server
        }
      },
      unitTests: {
        files: [ 'test/unit/**/*.js' ],
        tasks: [ 'karma:watch:run' ]
      },
      integrationTests: {
        files: [ 'test/integration/**/*.js' ],
        tasks: [ 'karma:watch:run' ]
      }
    }
  });

  // Perform a build
  grunt.registerTask('build', [ 'jshint', 'clean', 'copy', 'concat', 'uglify']);

  // Run client tests once
  grunt.registerTask('testClient', [ 'karma:single' ]);

  // Run server tests once
  // TODO: Backend team create task
  grunt.registerTask('testServer', [ 'karma:single' ]);

  // Run all tests once
  grunt.registerTask('test', [ 'testClient', 'teste2e']);

  // Run all tests once
  grunt.registerTask('ci', [ 'karma:ci', 'express:dev', 'casperjs' ]);

  // Start watching and run tests when files change
  grunt.registerTask('default', [ 'build', 'express:dev', 'karma:watch:start', 'watch' ]);
};
