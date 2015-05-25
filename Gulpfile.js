// The MIT License (MIT)
//
// Copyright (c) 2015 Joshua Michael Bemenderfer
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// The Gulp build file for my website.

var gulp = require('gulp');
var webserver = require('gulp-webserver');

var jade = require('gulp-jade');
var data = require('gulp-data');

var sass = require('gulp-sass');
var bulkSass = require('gulp-sass-bulk-import');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');


// Task to generate pages.
gulp.task('jade', function() {
  // TODO: Add locals/content insertion
  gulp.src('./src/jade/**/*.jade')
    .pipe(jade({
      locals: null,
    }).on('error', console.log))
    .pipe(gulp.dest('./out/'))
});

// Task to compile scss files.
gulp.task('scss', function() {
  // Don't forget to ignore the components directory. TODO: Make more flexible.
  gulp.src(['./src/scss/**/*.scss', '!./src/scss/**/components/*.scss'])
    .pipe(sourcemaps.init())
    .pipe(bulkSass())
    .pipe(sass({
      includePaths: ['./src/scss/'],
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(minifyCSS())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./out/styles'))
});

// Task to watch source files and run all tasks when files change.
gulp.task('default', function() {
  gulp.watch('./src/**/*.*', ['scss', 'jade'])
  gulp.src('./out')
    .pipe(webserver({
      livereload: true,
      directoryListing: {
        enabled: true,
        path: './',
      },
      open: true,
    }));
});
