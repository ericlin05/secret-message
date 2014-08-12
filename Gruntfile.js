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
                    "src/css/superhero.css",
                    "src/css/jumbotron-narrow.css",
                    "src/css/main.css"
                ],
                // the location of the resulting JS file
                dest: 'dist/css/<%= pkg.name %>.css'
            },
            js_dev: {
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
                    "bower_components/bootstrap/dist/js/bootstrap.js"
                ],
                // the location of the resulting JS file
                dest: 'dist/js/<%= pkg.name %>.js'
            },
            css_dev: {
                options: {
                    // define a string to put between each file in the concatenated output
                    separator: "\n"
                },
                // the files to concatenate
                src: [
                    "bower_components/ngDialog/css/ngDialog.css",
                    "bower_components/ngDialog/css/ngDialog-theme-plain.css",
                    "src/css/superhero.css",
                    "src/css/jumbotron-narrow.css"
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
            dev: {
                files: [
                    // includes files within path
                    {src: 'src/css/main.css', dest: 'public/css/main.css'},

                    // includes files within path and its sub-directories
                    {src: 'src/js/controller.js', dest: 'public/js/controller.js'},
                    {src: 'dist/css/<%= pkg.name %>.css', dest: 'public/css/<%= pkg.name %>.css'},
                    {src: 'dist/js/<%= pkg.name %>.js', dest: 'public/js/<%= pkg.name %>.js'},

                    {src: 'src/htaccess/.htaccess_dev', dest: 'public/.htaccess'}
                ]
            },
            'prod': {
                files: [
                    {src: 'src/htaccess/.htaccess', dest: 'public/.htaccess'}
                ]
            }
        },
        rsync: {
            options: {
                args: ["--verbose"],
                exclude: [".git*","*.scss","node_modules","bower_components","data","dist","src",".idea"],
                recursive: true
            },
            dist: {
                options: {
                    src: "./",
                    dest: "../dist"
                }
            },
            prod: {
                options: {
                    src: "../dist/",
                    dest: "/var/www/site",
                    host: "user@staging-host",
                    delete: true // Careful this option could cause data loss, read the docs!
                }
            },
            dev: {
                options: {
                    src: "./",
                    dest: "/home/ericlin/secret-message",
                    host: "ericlin@sandbox-ericlin2.eng",
                    delete: true // Careful this option could cause data loss, read the docs!
                }
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
    grunt.loadNpmTasks('grunt-rsync');

    // Default task(s).
    grunt.registerTask('build',     ['bower-install-simple', 'concat:js', 'concat:css', 'cssmin', 'uglify', 'copy:prod', 'rsync:prod']);
    grunt.registerTask('build-dev', ['bower-install-simple', 'concat:js_dev', 'concat:css_dev', 'copy:dev', 'rsync:dev']);

};

