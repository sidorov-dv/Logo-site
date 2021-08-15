const {src, dest, parallel, series, watch} = require('gulp'); //gulp main
const browserSync                          = require('browser-sync').create(); //browser
const concat                               = require('gulp-concat'); //merge
const uglify                               = require('gulp-uglify-es').default; //minimize
const sass                                 = require('gulp-sass');//sass
const autoprefixer                         = require('gulp-autoprefixer'); //autoprefixer
const cleancss                             = require('gulp-clean-css'); //format css
const imagemin                             = require('gulp-imagemin'); //min image
const newer                                = require('gulp-newer'); //watch minimize image
const del                                  = require('del'); //delete files

function browsersync() {
    browserSync.init({server: {baseDir: 'app/'}, notify: false, online: true})
}

function scripts() {
    return src('app/js/main.js')
       // .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js/'))
        .pipe(browserSync.stream())
}
//'node_modules/jquery/dist/jquery.min.js'
function styles() {
    return src('app/scss/main.scss')
        .pipe(sass().on('error', sass.logError))
       // .pipe(concat('app.min.css'))
        .pipe(autoprefixer({overrideBrowserslist: ['last 3 versions'], grid: false}))
        .pipe(cleancss(({level:{1:{specialComments:0}}, format: 'beautify'})))
        .pipe(dest('app/css/'))
        .pipe(browserSync.stream())
}

function images() {
    return src(['app/media/jpg/**/*', 'app/media/png/**/*', 'app/media/svg/**/*'], {base: 'app/media'})
        .pipe(newer('app/media/dest'))
        .pipe(imagemin())
        .pipe(dest('app/media/dest'))
}

function cleanimg() {
    return del('app/media/dest/**/*', {force: true})
}

function cleandist() {
    return del('docs/**/*', {force: true})
}

function buildcopy() {
    return src(['app/fonts/**/*',
                'app/css/**/*',
                'app/js/**/*',
                'app/media/dest/**/*',
                'app/*.html'], {base: 'app'})
        .pipe(dest('docs'))
}

function startwatch() {
    watch('app/scss/**/*', styles);
    watch('app/js/**/*', scripts);
    watch('app/**/*.html').on('change', browserSync.reload);
    watch(['app/media/jpg/**/*', 'app/media/png/**/*', 'app/media/svg/**/*'], images)
}

//'!app/js/*.min.js'

exports.browsersync = browsersync; 
exports.scripts     = scripts;
exports.styles      = styles;
exports.images      = images;
exports.cleanimg    = cleanimg;
exports.build       = series(cleandist, styles, scripts, images, buildcopy);

//images

exports.default     = parallel(styles, scripts, browsersync, startwatch);