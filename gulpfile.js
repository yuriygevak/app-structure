var gulp = require('gulp');
var config = require('./gulp.config')();
var $ = require('gulp-load-plugins')({lazy: true});
var runSequence = require('run-sequence');
var del = require('del');
/*var bowerFiles = require('main-bower-files');*/
var serve = require('gulp-serve');
var browserSync = require('browser-sync').create();


// ***** tasks *****

gulp.task('default', function() {
    log('Building development');
    runSequence('clean', 'inject', 'watch', 'serve');
});


gulp.task('serve', function() {

    browserSync.init({
        server: config.build
    });
    gulp.watch(config.build).on('change', browserSync.reload);
});


gulp.task('clean', function() {
    var files = config.build + '*';
    clean(files);
});


gulp.task('html', function () {
    gulp.src(config.index)
        .pipe(browserSync.stream());
});


gulp.task('concatCSS', function() {
    log('Compiling sass --> css and concating to styles.ccs');
    return gulp
        .src(config.sass)
        .pipe($.sourcemaps.init())
        .pipe($.sass())
        .pipe($.plumber())
        .pipe($.concat(config.css))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(config.build + 'css'))
        .pipe(browserSync.stream());

});


gulp.task('concatJS', function() {
    log('Concating application"s js-file');
    return gulp.src(config.alljs)
        .pipe($.sourcemaps.init())
        .pipe($.plumber())
        .pipe($.concat(config.js))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(config.build + 'js'))
        .pipe(browserSync.stream());
});


gulp.task('inject', ['concatCSS', 'concatJS'], function() {
    log('Injecting app application"s css-, js-files into the html');
    return gulp.src(config.index)
        .pipe($.inject(gulp.src([config.cssSrc, config.jsSrc], {read: false}), {relative: true}))
        .pipe(gulp.dest(config.build))
        .pipe(browserSync.stream());
});


gulp.task('watch', function () {
    log("Watching application's css, js");
    $.watch([config.alljs, config.html, config.sassWatch, config.index], $.batch(function (events, done) {
        gulp.start('inject', done)
            .pipe(browserSync.stream());
    }));
});


// ***** functions *****

function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}


function clean(path) {
    log('Cleaning: ' + $.util.colors.blue(path));
    del(path);
}