'use strict';
// NOTE: consult gulpfile from angular-extension-registry
// for quick tasks to borrow. 

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    filesize = require('gulp-filesize'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    templateCache = require('gulp-angular-templatecache');

gulp.task('clean', function() {
  console.log('TODO: clean');
});

gulp.task('templates', ['clean'], function() {
  console.log('TODO: make templates');
});

gulp.task('build', function() {
  console.log('TODO: build');
});

gulp.task('min', function() {
  console.log('TODO: minify');
});

gulp.task('serve', function() {
  console.log('TODO: serve');
});

gulp.task('default', ['min', 'serve']);
