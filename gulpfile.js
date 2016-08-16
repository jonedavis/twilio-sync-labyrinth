const gulp = require('gulp');
const cssnano = require('gulp-cssnano');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const notify = require('gulp-notify');
const config = require('./gulp.config')();

gulp.task('styles', function () {
    return gulp.src(config.cssSource)
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest(config.cssDestination))
        .pipe(rename({suffix: '.min'}))
        .pipe(cssnano())
        .pipe(gulp.dest(config.cssDestination))
        .pipe(notify({message: 'Styles task complete.'}));
});

gulp.task('css-watcher', function() {
   gulp.watch([config.cssSource], ['styles']); 
});