'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    filesize = require('gulp-filesize'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    del = require('del'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    templateCache = require('gulp-angular-templatecache'),
    less = require('gulp-less'),
    path = require('path'),
    gulpProtractorAngular = require('gulp-angular-protractor'),
    KarmaServer = require('karma').Server,
    shell = require('gulp-shell');

// vars for finding directories
var match = {
  recurse: '**/*'
};

var root = './',
    src = './src/',
    dist = './dist/',
    tmp = './.tmp/',
    tmpBuild = tmp + 'build/',
    test = './test/',
    testRelative = '/test/',
    demos = test + 'manual/';

var srcAll = src + match.recurse,
    distAll = dist +match.recurse,
    demoAll = demos + match.recurse,
    tmpAll = tmpBuild + match.recurse;

var srcJS = src + match.recurse + '.js',
    srcView = src + '/views/'+ match.recurse + '.html',
    srcLess = src + '/less/' + match.recurse + '.less';

var outputJS = 'angular-key-value-editor.js',
    outputTpl = 'compiled-templates.js';

var buildSource = [
  src + '*.js',
  src + 'directives/**/*.js',
  src + 'services/**/*.js'
];

var angularModuleName = 'key-value-editor';

var protocol = 'http://',
    host = 'localhost',
    serverPort = 9005,
    baseUrl = protocol + host + ':' + serverPort;

var concatSource = function(outputDest) {
  return gulp
          .src(buildSource)
          .pipe(concat(outputJS))
          .pipe(filesize())
          .pipe(gulp.dest(outputDest || dist));
};

var minifyDist = function(outputDest) {
  return gulp
          .src(dist + outputJS)
          .pipe(uglify().on('error', gutil.log))
          .pipe(rename({ extname: '.min.js' }))
          .pipe(filesize())
          .pipe(gulp.dest(outputDest || dist));
};

var cacheTemplates = function(outputDest) {
  return gulp
          .src(srcView)
          .pipe(templateCache({
            module: angularModuleName
          }))
          .pipe(rename(outputTpl))
          .pipe(filesize())
          .pipe(gulp.dest(outputDest || dist));
};

var buildCSS = function(outputDest) {
  return gulp
          .src(srcLess)
          .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
          }))
          .pipe(gulp.dest(outputDest || dist));
};

gulp.task('clean', function() {
  return del([distAll, tmpAll], function(err, paths) {
    return gutil.log('cleaned files/folders:\n', paths.join('\n'), gutil.colors.green());
  });
});


gulp.task('jshint', function() {
  return gulp
          .src(srcJS)
          .pipe(jshint())
          .pipe(jshint.reporter(stylish));
});

gulp.task('templates', ['clean'], function () {
  return cacheTemplates();
});

gulp.task('less', ['clean'], function () {
  return buildCSS();
});

gulp.task('build', ['clean','templates', 'jshint', 'less'], function () {
  return concatSource();
});

gulp.task('min', ['build', 'templates'], function() {
  return minifyDist();
});

gulp.task('min-and-reload', ['min'], reload);

gulp.task('serve', function() {
  // https://www.browsersync.io/docs/options
  browserSync({
    port: serverPort,
    server: {
      baseDir: root
    }
   });

   // TODO: live-reloading for demo not working yet.
   gulp.watch([srcAll, distAll, demoAll], ['min-and-reload']);
});


gulp.task('_tmp-build', function() {
  return concatSource(tmpBuild);
});
gulp.task('_tmp-templates', function() {
  return cacheTemplates(tmpBuild);
});

gulp.task('_tmp-less', function() {
  return buildCSS(tmpBuild);
});

gulp.task('_tmp-min', ['_tmp-build', '_tmp-templates', '_tmp-less'], function() {
  return minifyDist(tmpBuild);
});

// at present this task exists for travis to use to before
// running ./validate.sh to diff our dist against ./.tmp/build
// and validate that templates have been cached, js minified, etc.
gulp.task('prep-diff', ['_tmp-min'], function() {
  // nothing here atm.
});

gulp.task('validate-dist', ['prep-diff'], function() {
  // validation script to verify ./dist and ./tmp/build are equals
  shell.task([
    './validate.sh'
  ])();
});

gulp.task('test-e2e', ['serve'], function(callback) {
    gulp
        .src(['example_spec.js'])
        .pipe(gulpProtractorAngular({
            configFile: test + 'protractor.conf.js',
            // baseUrl is needed for tests to navigate via relative paths
            args: ['--baseUrl', baseUrl],
            debug: false,
            autoStartStopServer: true
        }))
        .on('error', function(e) {
            console.log(e);
        })
        .on('end', callback);
});

// for integration testing, uses phantomJS
gulp.task('test-unit', function(done) {
    new KarmaServer({
      configFile:  __dirname  + testRelative + 'karma.conf.js',
      port: serverPort
      // browsers: ['PhantomJS'] - try the firefox default?
    }, done).start();
});

// run all the tests, unit first, then e2e
gulp.task('test', ['test-unit', 'test-e2e'], function() {
  // just runs the other tests
});

// for development, uses Chrome
// equivalent task to `test-unit`, but long running, watching file changes
gulp.task('tdd', function(done) {
  new KarmaServer({
    configFile: __dirname + testRelative + 'karma.conf.js',
    autoWatch: true,
    singleRun: false,
    port: serverPort
  }, done).start();
});

gulp.task('default', ['min', 'serve']);
