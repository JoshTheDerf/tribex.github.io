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
var livereload = require('gulp-livereload');

var jade = require('gulp-jade');
var data = require('gulp-data');

var sass = require('gulp-sass');
var bulkSass = require('gulp-sass-bulk-import');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');

var iceblerg = require('iceblerg');

var tribexBlog = new iceblerg({
  'post-dir': './src/content/posts',
  'template-dir': './src/jade/blog',
  'output-dir': './out/blog',
});


// Task to generate pages.
gulp.task('jade', function() {
  // Build blog first
  tribexBlog.buildModel(function(model) {
    tribexBlog.generate(model);
    gulp.src(['./src/jade/**/*.jade',
      '!./src/jade/includes/**/*.jade',
      '!./src/jade/blog/**/*.jade'
    ])
    .pipe(jade({
      pretty: true,
      data: {
        'iceblerg': model,
      }
    }).on('error', console.log))
    .pipe(gulp.dest('./out/'))
    .pipe(livereload())
  });
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
    .pipe(livereload())
});

// Task to watch source files and run all tasks when files change.
gulp.task('default', function() {
  livereload.listen({
    'basePath': './',
  });
  gulp.watch('./src/**/*.*', ['scss', 'jade']);
  gulp.src('./')
  .pipe(webserver({
    directoryListing: {
      enabled: true,
      path: './',
    },
    open: true,
  }));
});
