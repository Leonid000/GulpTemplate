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


gulp.task('js:dev', () => {
    return gulp.src('./src/js/*.js')
        // .pipe(babel()) 
        .pipe(webpack(require('./../webpack.config.js')))
        .pipe(gulp.dest('./build/js'))
})


gulp.task('html:dev', () => {
    return gulp.src('./src/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./build/'))
})

gulp.task('sass:dev', () => {
    return gulp.src('./src/scss/*.scss')
        .pipe(plumber({
            errorHandler: notify.onError({
                title: 'Styles',
                message: 'Error <%= error.message %> ',
                sound: false
            })
        }))
        .pipe(sourceMaps.init())
        .pipe(sass())
        // .pipe(group_media()) // Обьеденяет медиазапросы 
        .pipe(sourceMaps.write())
        .pipe(gulp.dest('./build/css/'))
})

gulp.task('images:dev', () => {
    return gulp.src('./src/images/**/*',{encoding: false})
        .pipe(changed('./build/images/'))
        .pipe(imagemin({verbose: true}))
        .pipe(gulp.dest('./build/images/'))
})

gulp.task('server:dev', () => {
    return gulp.src("./build/")
        .pipe(server({
            livereload: true,
            open: true
        }))
})
gulp.task('clean:dev', (done) => {
    if(fs.existsSync('./build/')){
        return gulp.src('./build/',{read: false})
        .pipe(clean())
    }   
    done()
})
gulp.task('watch:dev', () => {
    gulp.watch('./src/scss/**/*.scss',gulp.parallel('sass:dev'))
    gulp.watch('./src/**/*.html', gulp.parallel('html:dev'))
    gulp.watch('./src/images/**/*', gulp.parallel('images:dev'))
    gulp.watch('./src/js/**/*.js', gulp.parallel('js:dev'))
})

