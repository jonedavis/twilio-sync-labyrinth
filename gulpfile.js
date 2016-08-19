const gulp = require('gulp');
const cssnano = require('gulp-cssnano');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const useref = require('gulp-useref');
const gulpSequence = require('gulp-sequence');
const notify = require('gulp-notify');
const config = require('./gulp.config')();

gulp.task('default', gulpSequence('styles','useref','scripts:desktop','scripts:mobile'));

gulp.task('styles', function () {
    return gulp.src(config.cssSource)
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest(config.cssDestination))
        .pipe(rename({suffix: '.min'}))
        .pipe(cssnano())
        .pipe(gulp.dest(config.cssDestination))
        .pipe(notify({message: 'Styles task complete.'}));
});

gulp.task('useref', function() {
    return gulp.src(config.viewFiles)
        .pipe(useref())
        .pipe(gulp.dest(config.jsDestination))
        .pipe(notify({message: 'Useref task complete.'}));
});

gulp.task('scripts:desktop', function() {
    return gulp.src(config.jsDesktop)
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(config.jsDestination))
        .pipe(notify({message: 'Scripts:desktop task complete.'}));
});

gulp.task('scripts:mobile', function() {
    return gulp.src(config.jsMobile)
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(config.jsDestination))
        .pipe(notify({message: 'Scripts:mobile task complete.'}));
});

gulp.task('watch', function() {
    // Watch styles.css
    gulp.watch(config.cssSource, ['styles']);
    // Watch js files
});