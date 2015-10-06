module.exports = function(grunt) {
  // load up all of the necessary grunt plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');



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
      lib: {
        files: { 'client/dist/lib/lib.ug.js': 'client/dist/lib/lib.js' }
      },
      speedTyper: {
        files: {
          'client/dist/scripts/game.js': clientIncludeOrder
        }
      }
    },


    // concat all the js files
    concat: {
      lib: {
        files: {
          'client/dist/lib/lib.js': [
            './client/bower_components/jquery/jquery.min.js',
            './client/bower_components/underscore/underscore-min.js',
            './client/bower_components/backbone/backbone-min.js',
            './client/bower_components/d3/d3.min.js',
            './client/bower_components/socket.io-client/socket.io.js'
          ]
        }
      },

      game: {
        files: {
          // concat all the speed-typer js files into one file
          'client/dist/scripts/game.js': clientIncludeOrder
        }
      }
    },

    // configure the server
    express: {
      dev: {
        options: {
          script: 'server/server.js'
        }
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/integration/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server/server.js'
      }
    },

    shell: {
      prodServer: {

        command: 'git push heroku master',
        options: {
          stdout: true,
          stderr: true,
          failOnError: true
        }
      }
    },

    // create a watch task for tracking
    // any changes to the following files
    watch: {
      gruntfile: {
        files: 'Gruntfile.js'
      },
      client: {
        files: [ 'client/**' ],
        tasks: [ 'build' ]
      },
      server: {
        files: [ 'server/**' ],
        // tasks: [ 'build', 'express:dev', 'casperjs' ],
        tasks: [ 'build', 'test' ],
        options: {
          spawn: false // Restart server
        }
      }
    }
  });

  // grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    // var nodemon = grunt.util.spawn({
    //      cmd: 'grunt',
    //      grunt: true,
    //      args: 'nodemon'
    // });
    // nodemon.stdout.pipe(process.stdout);
    // nodemon.stderr.pipe(process.stderr);

    // grunt.task.run([ 'watch' ]);
  // });

  // Perform a build
  grunt.registerTask('build', [ 'concat', 'uglify' ]);

  // Run all tests once
  grunt.registerTask('test', [ 'express:dev', 'mochaTest' ]);

  // Start watching and run tests when files concathange
  grunt.registerTask('default', [ 'express:dev', 'mochaTest', 'build', 'watch' ]);

  // If the production option has been passed, deploy the app, otherwise run locally
  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {

      grunt.task.run([ 'shell:prodServer' ]);
          } else {
      grunt.task.run([ 'watch' ]);
    }
  });

  // Deployment
  // TODO: Create 'upload' task to upload to heroku
  grunt.registerTask('deploy', [ 'build', 'test', 'upload' ]);
};
