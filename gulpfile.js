'use strict';

var gulp = require('gulp');
//var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var compass = require('gulp-compass');
var rename = require('gulp-rename');
var path = require('path');
var cssmin = require('gulp-minify-css');

gulp.task('build', ['sass:compress', 'js:compress'], function () {

});

gulp.task('sass:compress', function() {
    console.log(path.join(__dirname, 'assets'));
    gulp.src('./sass/**/*.scss')
        .pipe(compass({
            project: path.join(__dirname, ''),
            sass: 'sass'
        }))
        .pipe(cssmin())
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('js:compress', function() {
    return gulp.src('directive.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});
