const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const clean = require('gulp-clean');
const cssnano = require('gulp-cssnano')
const sourceMaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();

function watchAll() {
browserSync.init({
    server: {
    baseDir: './public'
    }
});

gulp.watch('./src/index.html', html);
gulp.watch('./src/js/*.js', js);
gulp.watch('./src/theme/**/*.scss', styles);
}



function clean_styles() {
return gulp.src('public/resources/css/*.css', { read: false, allowEmpty: true })
    .pipe(clean());
}

function clean_images() {
return gulp.src('./public/resources/images/*', { read: false, allowEmpty: true })
    .pipe(clean());
}

function clean_js() {
return gulp.src('./public/resources/js/*.js', { read: false, allowEmpty: true })
    .pipe(clean());
}

function html(){
return gulp.src('./src/index.html')
.pipe(gulp.dest('./public/'))
.pipe(browserSync.stream());
}

async function styles() {
await clean_styles();
return gulp.src('./src/theme/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cssnano())
    .pipe(gulp.dest('./public/resources/css/'))
    .pipe(browserSync.stream());
}

async function images() {
await clean_images();
return gulp.src('./src/images/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./public/resources/images'))
    .pipe(browserSync.stream());
}

async function js() {
await clean_js();
return gulp.src('./src/js/*.js')
    .pipe(sourceMaps.init())
    .pipe(uglify())
    .pipe(sourceMaps.write())
    .pipe(gulp.dest('./public/resources/js'))
    .pipe(browserSync.stream());
}

exports.clean_styles = clean_styles;
exports.clean_images = clean_images;
exports.clean_js = clean_js;

exports.styles = styles;
exports.images = images;
exports.js = js;
exports.html = html;

exports.watch = watchAll;

exports.build = gulp.series(gulp.parallel(clean_styles, clean_images, clean_js, html), gulp.parallel(styles, images, js));
exports.dev = gulp.series(gulp.parallel(clean_styles, clean_images, clean_js, html), gulp.parallel(styles, images, js), watchAll);
exports.clean = gulp.parallel(clean_images, clean_js, clean_styles);