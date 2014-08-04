module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        "bower-install-simple": {
            options: {
                color:       true,
                production:  false
            }
        },
        concat: {
            options : {
                separator : ';',
                stripBanners : { block : true }
            },
            js: {
                options: {
                    // define a string to put between each file in the concatenated output
                    separator: "\n"
                },
                // the files to concatenate
                src: [
                    "bower_components/ng-file-upload/angular-file-upload-shim.js",
                    "bower_components/angular/angular.js",
                    "bower_components/ng-file-upload/angular-file-upload.js",
                    "bower_components/angular-route/angular-route.js",
                    "bower_components/ngDialog/js/ngDialog.js",
                    "bower_components/jquery/jquery.js",
                    "bower_components/bootstrap/dist/js/bootstrap.js",
                    "src/js/controller.js"
                ],
                // the location of the resulting JS file
                dest: 'dist/js/<%= pkg.name %>.js'
            },
            css: {
                options: {
                    // define a string to put between each file in the concatenated output
                    separator: "\n"
                },
                // the files to concatenate
                src: [
                    "bower_components/ngDialog/css/ngDialog.css",
                    "bower_components/ngDialog/css/ngDialog-theme-plain.css",
                    "src/css/bootstrap.min.css",
                    "src/css/jumbotron-narrow.css",
                    "src/css/main.css"
                ],
                // the location of the resulting JS file
                dest: 'dist/css/<%= pkg.name %>.css'
            }
        },
        cssmin : {
            options : {
                report : 'gzip'
            },
            minify : {
                expand : true,
                cwd : 'dist/css',
                src : ['<%= pkg.name %>.css'],
                dest : 'public/css',
                ext : '.min.css'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'dist/js/<%= pkg.name %>.js',
                dest: 'public/js/<%= pkg.name %>.min.js'
            }
        },
        copy: {
          main: {
            files: [
              // includes files within path
              {src: 'dist/css/secret-message.css', dest: 'public/css/<%= pkg.name %>.min.css'},

              // includes files within path and its sub-directories
              {src: 'dist/js/secret-message.js', dest: 'public/js/<%= pkg.name %>.min.js'}
            ]
          }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.loadNpmTasks('grunt-ender');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-bower-install-simple');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-wiredep');

    // Default task(s).
    grunt.registerTask('build',     ['bower-install-simple', 'concat', 'cssmin', 'uglify']);
    grunt.registerTask('build-dev', ['bower-install-simple', 'concat', 'copy']);

};

