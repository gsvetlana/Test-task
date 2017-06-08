'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    rigger = require('gulp-rigger'),
    cleanCSS = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

var path = {
    public: {
        html: 'public/',
        css: 'public/css/',
        img: 'public/img/',
        fonts: 'public/fonts/'
    },

    src: {
        html: 'src/*.html',
        style: 'src/style/main.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },

    watch: {
        html: 'src/**/*.html',
        style: 'src/style/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    }
};

var config = {
    server: {
        baseDir: "./public"
    },

    notify: false,
    tunnel: true,
    host: 'localhost',
    port: 9000
};

gulp.task('html:build', function() {
    return gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.public.html))
        .pipe(reload({stream: true}));
});

gulp.task('style:build', function() {
    return gulp.src(path.src.style)
        .pipe(sass().on('error', sass.logError))
        .pipe(prefixer())
        .pipe(cleanCSS())
        .pipe(gulp.dest(path.public.css))
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function() {
    return gulp.src(path.src.img)
        .pipe(imagemin())
        .pipe(gulp.dest(path.public.img))
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.public.fonts))
});

gulp.task('build', [
    'html:build',
    'style:build',
    'fonts:build',
    'image:build'
]);

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('default', ['build', 'webserver', 'watch']);
