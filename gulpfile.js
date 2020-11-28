"use strict";

var gulp = require("gulp"),
  sass = require("gulp-sass"),
  browserSync = require("browser-sync"),
  del = require("del"),
  imagemin = require("gulp-imagemin"),
  uglify = require("gulp-uglify"),
  usemin = require("gulp-usemin"),
  rev = require("gulp-rev"),
  cleanCss = require("gulp-clean-css"),
  flatmap = require("gulp-flatmap"),
  htmlmin = require("gulp-htmlmin");

// configure sass task
gulp.task("sass", function () {
  return gulp
    .src("./css/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("./css"));
});
// configure saas watch task
gulp.task("sass:watch", function () {
  gulp.watch("./css/*.scss", ["sass"]);
});
// configure browser-sync task
gulp.task("browser-sync", function () {
  var files = ["./*.html", "./css/*.css", "./img/*.{png,jpg,gif}", "./js/*.js"];
  browserSync.init(files, {
    server: {
      baseDir: "./",
    },
  });
});

// Default task
gulp.task("default", ["browser-sync"], function () {
  gulp.start("sass:watch");
});

// Clean task
gulp.task("clean", function () {
  return del(["dist"]);
});
// copyfonts task
gulp.task("copyfonts", function () {
  gulp
    .src("./node_modules/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*")
    .pipe(gulp.dest("./dist/fonts"));
});

// Images
gulp.task("imagemin", function () {
  return gulp
    .src("img/*.{png,jpg,gif}")
    .pipe(
      imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })
    )
    .pipe(gulp.dest("dist/img"));
});
/*
What does flatmap do?
Flatmap takes these multiple htmlfiles and then starts up parallel pipelines for each one of these htmlfiles.
Each one of them going through the same set of steps and then finally, converging and copying it into the destination folder.
So as you can see in our current folder, we have got contactus.html, aboutus.html, and index.html.
All three of them need to be processed.
So, the flatmap allows us to process these in parallel, starting up the same set of pipe for each of these files.
*/
gulp.task("usemin", function () {
  return gulp
    .src("./*.html")
    .pipe(
      flatmap(function (stream, file) {
        return stream.pipe(
          usemin({
            css: [rev()],
            html: [
              function () {
                return htmlmin({ collapseWhitespace: true });
              },
            ],
            js: [uglify(), rev()],
            inlinejs: [uglify()],
            inlinecss: [cleanCss(), "concat"],
          })
        );
      })
    )
    .pipe(gulp.dest("dist/"));
});
gulp.task("build", ["clean"], function () {
  gulp.start("copyfonts", "imagemin", "usemin");
});
