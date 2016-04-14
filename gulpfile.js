/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */
var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var plumber = require('gulp-plumber'); // eslint-disable-line no-unused-vars

gulp.task('develop', function () {
  nodemon({
    script: 'bin/www',
    ext: 'js jade coffee',
    stdout: false
  });
});

gulp.task('default', [
  'develop'
]);
