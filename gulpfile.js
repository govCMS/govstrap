'use strict';

// *************************
//
// Run 'gulp' to watch directory for changes for images, fonts icons, Sass, etc.
// Or for full site testing run 'gulp test'
//
// *************************


// Include gulp.
const gulp = require('gulp');

// Include plug-ins.
const jshint = require('gulp-jshint');
const imagemin = require('gulp-imagemin');
const compass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const iconfont = require('gulp-iconfont');
const iconfontCss = require('gulp-iconfont-css');
const iconfontTemplate = require('gulp-iconfont-template');
const pa11y = require('gulp-pa11y');
const w3cValidation = require('gulp-w3c-html-validation');
const casperJs = require('gulp-casperjs');
const realFavicon = require('gulp-real-favicon');
const fs = require('fs'); // Used by check-for-favicon-update.
const plumber = require('gulp-plumber'); // For error handling.
const gutil = require('gulp-util'); // For error handling.
const postcss = require('gulp-postcss');
const cssNano = require('cssnano');
const atImport = require('postcss-import');
const autoprefixer = require('autoprefixer');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const modernizr = require('gulp-modernizr');

// Project vars
// URL to test locally.
const localSiteURL = 'http://localhost:3000/';
// Name of the icon font.
const fontName = 'govstrap-icons';
// Favicon related settings.
const faviconColour = '#ffffff';
const faviconBackgroundColour = '#384249';



// ********************************************************************************************************************************************


// Error Handling to stop file watching from dying on an error (ie: Sass compiling).
var onError = function(err) {
  gutil.beep();
  console.log(err);
};


// JS minify.
gulp.task('scripts', function() {
  gulp.src('node_modules/jquery/dist/jquery.min.js')
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(gulp.dest('./js/'));

  gulp.src('node_modules/bootstrap/dist/js/**')
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(gulp.dest('./js/'));

  return gulp.src('./src/js/*.js')
    .pipe(plumber({
      errorHandler: onError
    }))
    // .pipe(gulp.dest('./js/'))
    .pipe(uglify())
    // .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('./js/'));
});


// Modernizr
gulp.task('modernizr', function() {
  gulp.src('./src/js/*.js')
    .pipe(modernizr())
    .pipe(gulp.dest('./js/'))
});


// Optimise favicons.
gulp.task('favicons', function() {
  return gulp.src('./src/favicon/favicons/**/*')
    .pipe(imagemin({
      optimizationLevel: 3
    }))
    .pipe(gulp.dest('./favicons'))
});


// Optimise images.
gulp.task('images', function() {
  return gulp.src('./src/img/**/*')
    .pipe(imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true,
    }))
    .pipe(gulp.dest('./img'))
});


// Compile the Sass.
gulp.task('styles', function() {
  // Register the PostCSS plugins.
  var postcssPlugins = [
    atImport,
    autoprefixer,
    cssNano,
  ];
  // The actual task.
  gulp.src('./src/sass/*.scss')
    // Error handling
    .pipe(plumber({
      errorHandler: onError
    }))
    // Compile the Sass code.
    .pipe(compass({
      sass: './src/sass'
    }))
    // If there's more than one css file outputted, merge them into one.
    // .pipe(concat('./styles.css'))
    // Optimise the CSS.
    .pipe(postcss(postcssPlugins))
    // Output to the css folder.
    .pipe(gulp.dest('./css/'))
    // BrowserSync
    // Note: you need to disable Drupal caching and concatenation or this won't do any good.
    .pipe(browserSync.stream({
      match: '**/*.css'
    }));
});


// SVG files to a font file.
gulp.task('iconFont', function() {
  var runTimestamp = Math.round(Date.now() / 1000);
  return gulp.src(['./src/font-icons/**'])
    .pipe(iconfontCss({
      fontName: fontName,
      path: 'scss',
      targetPath: '../src/sass/_' + fontName + '.scss', // Relative to the path used in gulp.dest()
      fontPath: '/fonts/' // Relative to the site.
    }))
    .pipe(iconfont({
      fontName: fontName, // Required.
      prependUnicode: true, // Recommended option.
      formats: ['ttf', 'eot', 'woff', 'woff2'], // Default, 'woff2' and 'svg' are available.
      timestamp: runTimestamp, // Recommended to get consistent builds when watching files.
      normalize: true, // The provided icons does not have the same height it could lead to unexpected results. Using the normalize option could solve the problem.
      fontHeight: 1001, // Stops the SVG being redrawn like a 3yo did them.. (https://github.com/nfroidure/gulp-iconfont/issues/138)
    }))
    .pipe(gulp.dest('./fonts/'));
});


// Favicons creation
var faviconDataFile = './src/favicon/faviconData.json';
// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
gulp.task('favicon', function(done) {
  realFavicon.generateFavicon({
    masterPicture: './src/favicon/master-favicon.svg',
    dest: './src/favicon/favicons',
    iconsPath: '/favicons/',
    design: {
      ios: {
        pictureAspect: 'noChange',
        assets: {
          ios6AndPriorIcons: false,
          ios7AndLaterIcons: false,
          precomposedIcons: false,
          declareOnlyDefaultIcon: true
        }
      },
      desktopBrowser: {},
      windows: {
        pictureAspect: 'noChange',
        backgroundColor: faviconBackgroundColour,
        onConflict: 'override',
        assets: {
          windows80Ie10Tile: false,
          windows10Ie11EdgeTiles: {
            small: false,
            medium: true,
            big: false,
            rectangle: false
          }
        }
      },
      androidChrome: {
        pictureAspect: 'noChange',
        themeColor: faviconColour,
        manifest: {
          display: 'standalone',
          orientation: 'notSet',
          onConflict: 'override',
          declared: true
        },
        assets: {
          legacyIcon: false,
          lowResolutionIcons: false
        }
      },
      safariPinnedTab: {
        pictureAspect: 'silhouette',
        themeColor: faviconColour
      }
    },
    settings: {
      scalingAlgorithm: 'Mitchell',
      errorOnImageTooSmall: true
    },
    markupFile: faviconDataFile
  }, function() {
    done();
  });
});
// Inject the favicon markups in your HTML pages. You should run
// this task whenever you modify a page. You can keep this task
// as is or refactor your existing HTML pipeline.
// gulp.task('inject-favicon-markups', function() {
// 	return gulp.src([ 'TODO: List of the HTML files where to inject favicon markups' ])
// 		.pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(faviconDataFile)).favicon.html_code))
// 		.pipe(gulp.dest('TODO: Path to the directory where to store the HTML files'));
// });
// Check for updates on RealFaviconGenerator
// (ie: If Apple has just released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your CI.
gulp.task('check-for-favicon-update', function(done) {
  var currentVersion = JSON.parse(fs.readFileSync(faviconDataFile)).version;
  realFavicon.checkForUpdates(currentVersion, function(err) {
    if (err) {
      throw err;
    }
  });
});



// ********************************************************************************************************************************************


// Default gulp task.
gulp.task('default', ['images', 'scripts', 'modernizr', 'styles']);


// Watch changes.
gulp.task('watch', ['images', 'scripts', 'modernizr', 'styles'], function() {
  // Watch for img optim changes.
  gulp.watch('./src/img/**', function() {
    gulp.start('images');
  });
  // Watch for JS changes.
  gulp.watch('./src/js/*.js', function() {
    gulp.start('scripts');
  });
  // Watch for font icon changes.
  gulp.watch('./src/font-icons/**', function() {
    gulp.start('iconFont');
  });
  // Watch for Sass changes.
  gulp.watch('./src/sass/*.scss', function() {
    gulp.start('styles');
  });
  // Watch for master Favicon changes.
  gulp.watch('./src/favicon/master-favicon.svg', function() {
    gulp.start('favicon');
  });
  // Once the favicons are built, create an optimised copy to use.
  gulp.watch('./src/favicon/favicons/**', function() {
    gulp.start('favicons');
  });
});
