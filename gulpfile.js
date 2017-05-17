'use strict'

const gulp = require('gulp');
const sass = require('gulp-sass');
const del = require('del');
const gulpIf = require('gulp-if');
const cssnano = require('gulp-cssnano');
const sourcemap = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const notify = require('gulp-notify');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const myth =require('gulp-myth');
const rename = require("gulp-rename");
const imageResize = require('gulp-image-resize');
const parallel = require('concurrent-transform');
const os = require("os");

const isDevelopment = false;
gulp.task('default', function () { console.log('Hello Gulp!') });

gulp.task('image:Thumb', function () {
    return gulp.src('assets/projects/**/img/**/*.{png,jpg,JPG}')
        .pipe(parallel(
            imageResize({ width : 125 }),
            os.cpus().length
        ))
        .pipe(rename(function (path) { path.basename = "thumb/"+path.basename; }))
        .pipe(gulp.dest('assets/projects/'));
});


gulp.task('image:Intro', function () {
    return gulp.src('assets/projects/**/img/photo/1.{jpg,JPG}')
        .pipe(parallel(
            imageResize({ width : 600}),
            os.cpus().length
        ))
        .pipe(rename(function (path) { path.dirname = path.dirname.split('\\')[0]+"/img_intro/"; }))
        .pipe(gulp.dest('assets/projects/'));
});

gulp.task('image:IntroThumb', function () {
    return gulp.src('assets/projects/**/img/photo/1.{jpg,JPG}')
        .pipe(parallel(
            imageResize({ width : 125}),
            os.cpus().length
        ))
        .pipe(rename(function (path) { path.dirname = path.dirname.split('\\')[0]+"/img_intro/thumb/"; }))
        .pipe(gulp.dest('assets/projects/'));
});

gulp.task('copyProjects', function(){
    return gulp.src('assets/projects/**/*.*')
        .pipe(gulp.dest('public/projects'));
});

gulp.task('clean', function () {
    del('public/js');
    del('public/svg_icons');
    del('public/parts');
    del('public/style');
    del('public/php');
    return del('public/index.html');
});

gulp.task('assets:html', function(){
   return gulp.src('assets/html/**/*.html')
       .pipe(gulp.dest('public'));

});

gulp.task('assets:php', function(){
    return gulp.src('assets/php/**/*.php')
        .pipe(gulp.dest('public/php'));
});

gulp.task('assets', gulp.parallel('assets:html','assets:php'));

gulp.task('scripts:threeJS', function () {
    return gulp.src(['assets/libs/three.min.js','assets/libs/Detector.js', 'assets/libs/OrbitControls.js'])
        .pipe(gulpIf(function(file){return file.basename != 'three.min.js'}, uglify()))
        .pipe(concat('three.min.js'))
        .pipe(gulp.dest('public/js'))
});

gulp.task('scripts:libs', function () {
    return gulp.src(['assets/libs/jquery.min.js','assets/libs/angular.min.js',
        'assets/libs/angular-route.min.js','assets/libs/angular-animate.min.js'])
        .pipe(concat('jq_and_ang.min.js'))
        .pipe(gulp.dest('public/js'))
});

gulp.task('scripts:main', function(){
   return gulp.src(['frontend/js/app.js',
                    'frontend/js/data_service.js',
                    'frontend/js/dictionary_service.js',
                    'frontend/js/filters.js',
                    'frontend/js/controllers.js',
                    'frontend/js/directives.js'])
            .pipe(gulpIf(!isDevelopment, sourcemap.init()))
            .pipe(concat('script.min.js'))
            .pipe(uglify())
            .on('error', notify.onError(function(err) {
                        return { title: "UgLify Eror", message: err.message};
             }))
            .pipe(gulpIf(!isDevelopment, sourcemap.write('.')))
            .pipe(gulp.dest('public/js'))
});
gulp.task('scripts', gulp.parallel('scripts:threeJS','scripts:libs','scripts:main'));


gulp.task('style:bootstrap', function(){
    return gulp.src('node_modules/bootstrap/dist/css/bootstrap.min.css')
        .pipe(gulp.dest('public/style'));
});

gulp.task('style:main', function(){
    return gulp.src('frontend/style/main.scss')
        .pipe(gulpIf(!isDevelopment, sourcemap.init()))
        .pipe(sass())
        .on('error', notify.onError(function(err) {
            return { title: "Style Eror", message: err.message};
        }))
        .pipe(myth())
        .pipe(cssnano())
        .pipe(gulpIf(!isDevelopment, sourcemap.write('.')))
        .pipe(gulp.dest('public/style'));
});

gulp.task('style', gulp.parallel('style:bootstrap', 'style:main'));

gulp.task('watch',function() {
    gulp.watch('frontend/style/**/*.scss', gulp.series('style'));
    gulp.watch('frontend/js/**/*.js', gulp.series('scripts:main'));
    gulp.watch('assets/html/**/*.html', gulp.series('assets:html'));
    gulp.watch('assets/php/**/*.php', gulp.series('assets:php'));
});


gulp.task('build',gulp.series('clean',
    gulp.parallel('assets','scripts', 'style')));


gulp.task('serve', function(){
    browserSync.init({
        server:'public'
    });
    browserSync.watch('public/**/*.*').on('change', gulp.series(browserSync.reload));
});

gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')));
