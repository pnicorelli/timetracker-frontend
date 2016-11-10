/* eslint "strict": 0 */

var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var util = require('gulp-util');
var ngConfig = require('gulp-ng-config');
var watch = require('gulp-watch');
var Server = require('karma').Server;
var eslint = require('gulp-eslint');
var clean = require('gulp-clean');
var del = require('del');

var sourcemaps = require('gulp-sourcemaps');
var cleanCSS = require('gulp-clean-css');
var surge = require('gulp-surge');

var runSequence = require('run-sequence');
var fs = require('fs');
var handlebars = require('gulp-compile-handlebars');
var rev = require('gulp-rev');
var rename = require('gulp-rename');

var config = require('./gulpconfig.json');


gulp.task('build-vendorJS', function (done) {
  gulp.src(config.vendorsJS)
  .pipe(concat('vendors.js'))
  .pipe(gulp.dest(config.DEST))
  .pipe(uglify())
  .pipe(gulp.dest(config.DEST))
  .on('end', function () {
    return done();
  });
});

gulp.task('moveFiles', function(done){
  // the base option sets the relative root for the set of files,
  // preserving the folder structure
  gulp.src(config.vendorsRequired)
  .pipe(gulp.dest('build/'))
  .on('end', function () {
      return done();
    });
});

gulp.task('build-vendorCSS', ['moveFiles'], function (done) {
  gulp.src(config.vendorsCSS)
  .pipe(concat('vendors.css'))
  .pipe(cleanCSS())
  .pipe(gulp.dest(config.DEST))
  .on('end', function () {
    return done();
  });
});

gulp.task('build-html', function (done) {
  gulp.src(config.htmlSrc)
  .pipe(gulp.dest(config.DEST+'/../view'))
  .on('end', function () {
    return done();
  });
});

gulp.task('build-js', function (done) {
  gulp.src(config.jsSrc)
  .pipe(sourcemaps.init())
  .pipe(concat('bundle.js'))
  .pipe(sourcemaps.write(config.DEST))
  // .pipe(rev())
  .pipe(gulp.dest(config.DEST))
  .on('end', function () {
    return done();
  });
});

gulp.task('build-custom-css', function (done) {
  gulp.src('app/shared/customCss/*.css')
  .pipe(concat('custom.css'))
  .pipe(gulp.dest(config.DEST))
  .on('end', function () {
    return done();
  });
});

gulp.task('build-css', function (done) {
  gulp.src(config.cssSrc)
  .pipe(concat('style.css'))
  .pipe(gulp.dest(config.DEST))
  .on('end', function () {
    return done();
  });
});

gulp.task('build-json', function(done){
  gulp.src(config.jsonSrc)
  .pipe(gulp.dest(config.DEST))
  .on('end', function () {
    return done();
  });
});

gulp.task('build-config', function (done) {
  var target = util.env.target || 'staging';
  console.log('Build for '+target);
  gulp.src(['config/'+target+'.json'])
  .pipe(ngConfig('TimeTracker', { createModule: false }))
  .pipe(rename('config.js'))
  // .pipe(rev())
  .pipe(gulp.dest(config.DEST))
  .on('end', function () {
    return done();
  });
});

gulp.task('versioning', function(done){
  gulp.src([ config.DEST+'/bundle.js', config.DEST+'/config.js', config.DEST+'/style.css', config.DEST+'/custom.css'])
  .pipe(rev())
  .pipe(gulp.dest(config.DEST))
  .pipe(rev.manifest({merge: true}))
  .pipe(gulp.dest(config.DEST))
  .on('end', function () {
    return done();
  });
});

gulp.task('compile-index', function(done){
  var manifest = JSON.parse(fs.readFileSync(config.DEST+'/rev-manifest.json', 'utf8'));
  gulp.src('build/index.hbs')
  .pipe(handlebars(manifest,     { helpers: {
    assetPath: function (path, context) {
      return context.data.root[path];
    }
  }}))
  .pipe(rename('index.html'))
  .pipe(gulp.dest('build'));
  return done();
});

gulp.task('build', function(done){
  runSequence(
    'build-config',
    'build-js',
    'build-html',
    'build-css',
    'build-custom-css',
    'build-json',
    'build-vendorJS',
    'build-vendorCSS',
    'versioning',
    'compile-index',
    done
  );
});

gulp.task('build-watch', function(done){
  runSequence(
    'build-config',
    'build-js',
    'build-html',
    'build-css',
    'build-custom-css',
    'build-json',
    'versioning',
    'compile-index',
    done
  );
});

gulp.task('watch', function(done) {
  gulp.watch([  config.jsSrc,
    config.htmlSrc,
    config.cssSrc,
    config.jsonSrc],
    ['build-watch'],
     done);
  });

  gulp.task('test_ci', ['build'], function (done) {
    new Server({
      configFile: __dirname + '/karma.conf.js',
      singleRun: true
    }, done).start();
  });

  gulp.task('test', ['build'], function (done) {
    new Server({
      configFile: __dirname + '/karma.conf.js'
    }, done).start();
  });

  gulp.task('clean', function () {
    return gulp.src(config.buildLibs, {read: false})
    .pipe(clean());
  });

  gulp.task('lint', function () {
    return gulp.src(config.jsSrc)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
  });


  gulp.task('publish-build-clean', function (done) {
    return del([
      'build/libs/bundle*.*',
      'build/libs/config*.*',
      'build/libs/style*.*',
      'build/libs/custom*.*',
      'build/libs/build*',
      'build/libs/rev-*.*']);
  });

  gulp.task('publish-pre-clean', function (done) {
    return del([
      'build/vendors',
      'build/libs/bundle.js',
      'build/libs/config.js',
      'build/libs/style.css',
      'build/libs/custom.css',
      'build/libs/build*',
      'build/libs/rev-*.*']);
  });

  // gulp.task('publish-clean', function (done) {
  //   return gulp.src(['build/vendors', 'build/libs/bundle-*.js', 'build/libs/config-*.js'], {read: false})
  //   .pipe(clean())
  //   .on('end', function () {
  //       return done();
  //     });
  // });

  gulp.task('surge', [], function () {
    return surge({
      project: './build',
      domain: 'timetracker-alpha.surge.sh'
    });
  });

  gulp.task('publish', function(done){
    runSequence(
      'publish-build-clean',
      'build-config',
      'build-js',
      'build-html',
      'build-css',
      'build-custom-css',
      'build-json',
      'versioning',
      'compile-index',
      'publish-pre-clean',
      'surge',
      done
    );
  });
