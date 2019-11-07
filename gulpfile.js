var gulp = require('gulp');
var gulpif = require('gulp-if');
var autoprefixer = require('gulp-autoprefixer');
var htmlreplace = require('gulp-html-replace');
var cssmin = require('gulp-cssmin');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var less = require('gulp-less');
var plumber = require('gulp-plumber');
var clean = require('gulp-clean');
var hb = require('gulp-hb');
var rename = require("gulp-rename");
var proxy = require('http-proxy-middleware');
var cleanCSS = require('gulp-clean-css');
let uglify = require('gulp-uglify-es').default;

var production = process.env.NODE_ENV === 'production';
console.log(production)
/*
 |--------------------------------------------------------------------------
 | Compile LESS stylesheets.
 |--------------------------------------------------------------------------
 */

//使用connect启动一个Web服务器
gulp.task('connect', function () {
    connect.server({
        root: 'build',
        port: 8080,
        livereload: true,
        middleware: function (connect, opt) {
            return [
                proxy('/api', {
                    target: 'https://www.huiyidabai.cn',
                    changeOrigin: true
                })
            ]
        }
    });
});

gulp.task('clean', function () {
    // return gulp.src('build', {read: false})
    //            .pipe(clean());
});

gulp.task('static', function () {
    gulp.src(['src/assets/img/**/*'])
        .pipe(connect.reload())
        .pipe(gulp.dest('build/assets/img'));

    gulp.src(['src/assets/fonts/**/*'])
        .pipe(connect.reload())
        .pipe(gulp.dest('build/assets/fonts'));
});


gulp.task('js', function () {
        gulp.src([
            "src/assets/js/utils.js",
            "src/assets/js/wx.js",
            "src/assets/lib/animate.js",
            "src/assets/js/mustache.js",
            "src/assets/js/conf.js",
            "src/assets/js/lCalendar.js",
            "src/assets/js/index-dialog.js",
            "src/assets/js/pay.js",
        ])
        .pipe(gulpif(production, uglify()))
        .pipe(gulpif(production, concat('app.js')))
        .pipe(gulp.dest('build/assets/js'));

    gulp.src('src/assets/js/*.js')
        .pipe(gulpif(production, uglify()))
        .pipe(connect.reload())
        .pipe(gulp.dest('build/assets/js'));

    gulp.src('src/assets/lib/*.js')
        .pipe(connect.reload())
        .pipe(gulp.dest('build/assets/lib/'));
});

gulp.task('html', function () {

    gulp.src('./src/assets/html/*')
        .pipe(rename(function (path) { 
            path.extname = ".html"
        }))
        .pipe(gulp.dest('build/assets/html'));

    gulp.src('./src/index.html')
        .pipe(gulpif(production, htmlreplace({
            'js': 'assets/js/app.js'
        })))
        .pipe(gulp.dest('build/'));
});

gulp.task('styles', function () {
    return gulp.src(['src/assets/css/*.less', 'src/assets/css/*.css'])
        .pipe(plumber())
        // .pipe(less())
        .pipe(autoprefixer())
        .pipe(gulpif(production, cleanCSS()))
        .pipe(gulpif(production, cssmin()))
        .pipe(gulp.dest('build/assets/css'))
        .pipe(connect.reload())
});

gulp.task('watch', function () {
    gulp.watch(['src/**/*.js', 'src/**/*.less', 'src/**/*.css', 'src/**/*.hbs'], ['styles', 'js', 'html', 'static']);
});

gulp.task('default', ['clean', 'connect', 'styles', 'js', 'html', 'static', 'watch']);

gulp.task('build', ['clean', 'styles', 'js', 'html', 'static']);