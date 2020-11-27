"use strict";
module.exports = function (grunt) {
  // Define the configuration for all the tasks

  // Time how long tasks take. Can help when optimizing build times
  require("time-grunt")(grunt);

  // Automatically load required Grunt tasks
  require("jit-grunt")(grunt, {
    useminPrepare: "grunt-usemin",
  });

  // Define the configuration for all the tasks
  grunt.initConfig({
    sass: {
      dist: {
        files: {
          "css/styles.css": "css/styles.scss",
        },
      },
    },
    watch: {
      files: "css/*.scss",
      tasks: ["sass"],
    },
    browserSync: {
      dev: {
        bsFiles: {
          src: ["css/*.css", "*.html", "js/*.js"],
        },
        options: {
          watchTask: true,
          server: {
            baseDir: "./",
          },
        },
      },
    },
    copy: {
      html: {
        files: [
          {
            //for html
            expand: true,
            dot: true,
            cwd: "./",
            src: ["*.html"],
            dest: "dist",
          },
        ],
      },
      fonts: {
        files: [
          {
            //for font-awesome
            expand: true,
            dot: true,
            cwd: "node_modules/font-awesome",
            src: ["fonts/*.*"],
            dest: "dist",
          },
        ],
      },
    },

    clean: {
      build: {
        src: ["dist/"],
      },
    },
    imagemin: {
      dynamic: {
        files: [
          {
            expand: true, // Enable dynamic expansion
            cwd: "./", // Src matches are relative to this path
            src: ["img/*.{png,jpg,gif}"], // Actual patterns to match
            dest: "dist/", // Destination path prefix
          },
        ],
      },
    },
    useminPrepare: {
      foo: {
        dest: "dist",
        src: ["contactus.html", "aboutus.html", "index.html"],
      },
      options: {
        flow: {
          steps: {
            css: ["cssmin"],
            js: ["uglify"],
          },
          post: {
            css: [
              {
                name: "cssmin",
                createConfig: function (context, block) {
                  var generated = context.options.generated;
                  generated.options = {
                    keepSpecialComments: 0,
                    rebase: false,
                  };
                },
              },
            ],
          },
        },
      },
    },

    // Concat
    concat: {
      options: {
        separator: ";",
      },

      // dist configuration is provided by useminPrepare
      dist: {},
    },

    // Uglify
    uglify: {
      // dist configuration is provided by useminPrepare
      dist: {},
    },

    cssmin: {
      dist: {},
    },

    // Filerev
    /*
    What the filerev does is when usemin prepares the main.css and main.js file, filerev adds an additional extension to that main name,
    so that when you prepare a new version of your website and upload it to the web page,
    in case somebody has seen your Website earlier, then their browser might have cashed the main.css and main.js files.
    If you don't attach this filerev, the browser beneath downloads the new version of your web page but it may not download the main.js and main.css file because it finds them already in it's local cache.
    So, your web page may not be rendered correctly.
    So, to deal with the problem, what we do is every time we prepare a new distribution folder, we will add a file revision.
    That's what the filerev stands for, the file revision number, adds a additional extension to the name of those css and js file.
    Now how does this filerev can compute this value?
    It takes the contents of these files and then does some processing and then generates an md5 compressed 20 characters number which will be attached to the main file.
     */
    filerev: {
      options: {
        encoding: "utf8",
        algorithm: "md5",
        length: 20,
      },

      release: {
        // filerev:release hashes(md5) all assets (images, js and css )
        // in dist directory
        files: [
          {
            src: ["dist/js/*.js", "dist/css/*.css"],
          },
        ],
      },
    },

    // Usemin
    // Replaces all assets with their revved version in html and css files.
    // options.assetDirs contains the directories for finding the assets
    // according to their relative paths
    usemin: {
      html: ["dist/contactus.html", "dist/aboutus.html", "dist/index.html"],
      options: {
        assetsDirs: ["dist", "dist/css", "dist/js"],
      },
    },
    /*
    The Grunt "htmlmin" has to be applied after the "usemin" has completed its work.
    The reason why we perform "htmlmin" after we finish "usemin" is because "usemin" will replace all the scripts with the main ".js" file and also all that CSS code concatenated and combined and replaced with the main ".css" file.
    So the "htmlmin" will be performed on the resulting HTML files after "usemin" has completed its work. This is how this works in Grunt.
    */
    htmlmin: {
      // Task
      dist: {
        // Target
        options: {
          // Target options
          collapseWhitespace: true,
        },
        files: {
          // Dictionary of files
          "dist/index.html": "dist/index.html", // 'destination': 'source'
          "dist/contactus.html": "dist/contactus.html",
          "dist/aboutus.html": "dist/aboutus.html",
        },
      },
    },
  });
  grunt.registerTask("css", ["sass"]);
  grunt.registerTask("default", ["browserSync", "watch"]);
  grunt.registerTask("build", [
    "clean",
    "copy",
    "imagemin",
    "useminPrepare",
    "concat",
    "cssmin",
    "uglify",
    "filerev",
    "usemin",
    "htmlmin",
  ]);
};
