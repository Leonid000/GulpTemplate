const gulp = require('gulp')
const fileinclude = require('gulp-file-include')
const gulp_file_include = require('gulp-file-include')
const sass = require('gulp-sass')(require('sass'))
const server = require('gulp-server-livereload')
const clean = require('gulp-clean')
const fs = require('fs')
const sourceMaps = require('gulp-sourcemaps')
const group_media = require('gulp-group-css-media-queries')
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')
const webpack = require('webpack-stream')
const babel = require('gulp-babel')
const imagemin = require('gulp-imagemin')
const changed = require('gulp-changed')
// const sassglob = require('gulp-sass-glob') не получилось подключить
const autoprefixer = require('gulp-autoprefixer')
const csso = require('gulp-csso')
const htmlclean = require('gulp-htmlclean')
const webp = require('gulp-webp')
const webpHTML = require('gulp-webp-html')
const webpCSS = require('gulp-webp-css')

gulp.task('js:prod', () => {
    return gulp.src('./src/js/*.js')
        .pipe(babel()) 
        .pipe(webpack(require('../webpack.config.js')))
        .pipe(gulp.dest('./dist/js'))
})


gulp.task('html:prod', () => {
    return gulp.src('./src/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(webpHTML())
        .pipe(htmlclean())
        .pipe(gulp.dest('./dist/'))
})

gulp.task('sass:prod', () => {
    return gulp.src('./src/scss/*.scss')
        .pipe(plumber({
            errorHandler: notify.onError({
                title: 'Styles',
                message: 'Error <%= error.message %> ',
                sound: false
            })
        }))
        .pipe(sourceMaps.init())
        .pipe(autoprefixer())
        .pipe(group_media()) 
        .pipe(sass())
        .pipe(csso())
        .pipe(sourceMaps.write())
        .pipe(gulp.dest('./dist/css/'))
})

gulp.task('images:prod', () => {
    return gulp.src('./src/images/**/*',{encoding: false})
        .pipe(changed('./dist/images/'))
        .pipe(webp())
        .pipe(gulp.dest('./dist/images/'))

        .pipe(gulp.src('./src/images/**/*',{encoding: false}))
        .pipe(changed('./dist/images/'))
        .pipe(imagemin({verbose: true})) 
        .pipe(gulp.dest('./dist/images/'))
})

gulp.task('server:prod', () => {
    return gulp.src("./dist/")
        .pipe(server({
            livereload: true,
            open: true
        }))
})
gulp.task('clean:prod', (done) => {
    if(fs.existsSync('./dist/')){
        return gulp.src('./dist/',{read: false})
        .pipe(clean())
    }   
    done()
})


