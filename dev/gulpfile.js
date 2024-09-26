// gulp v4.0.2

var m = new Date();
const version =
    m.getUTCFullYear() +
    ("0" + (m.getUTCMonth()+1)).slice(-2) +
    ("0" + m.getUTCDate()).slice(-2) + "." +
    ("0" + m.getUTCHours()).slice(-2) +
    ("0" + m.getUTCMinutes()).slice(-2) +
    ("0" + m.getUTCSeconds()).slice(-2);

const gulp     = require('gulp'),
      fs       = require('fs'),
      sass     = require('gulp-sass')(require('sass')),
      uglify   = require('gulp-uglify'),
      cleanCSS = require('gulp-clean-css'),
      plumber  = require('gulp-plumber'),
      mmq      = require('gulp-merge-media-queries'),
      rename   = require('gulp-rename'),
      strip    = require('gulp-strip-comments'),
      ejs      = require('gulp-ejs'),
      browser  = require('browser-sync');
 
const cleanCSS_1stSettings = 
  { // ref: https://outcloud.blogspot.com/2018/09/Minify-CSS-by-CleanCSS-MergeMediaQuery.html
    level: {
      1: {
        roundingPrecision : 3
      },
      2: {
        removeDuplicateFontRules: true,
        removeDuplicateMediaBlocks: true,
        removeDuplicateRules: true,
        mergeSemantically: true,
        removeUnusedAtRules: true,
        restructureRules: true
      }
    }
  };

const cleanCSS_2ndSettings =
  {
    level: {
      1: {
        all: false,
        removeWhitespace: true
      }
    }
  };

gulp.task("sass", function() {
  return gulp.src("../src/*.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(cleanCSS(cleanCSS_1stSettings))
    .pipe(mmq())
    .pipe(cleanCSS(cleanCSS_2ndSettings))
    .pipe(gulp.dest("../docs/css/"));
});

gulp.task("js", function() {
  return gulp.src("../src/*.js")
    .pipe(plumber())
    .pipe(strip())
    .pipe(uglify())
    .pipe(gulp.dest("../docs/js/"));
});

// watch
gulp.task("watch", (done) => {
  gulp.watch("../src/*.scss",    gulp.task("sass"));
  gulp.watch("../src/*.js",       gulp.task("js"));
  done();
});

gulp.task("serve", (done) => {
  browser({
    server: {
      baseDir: '../docs/',
    },
    ghostMode: false,
    open: 'external',
    notify: false,
  });
  done();
});

// scripts tasks
gulp.task('default', gulp.parallel('watch', 'serve'));

