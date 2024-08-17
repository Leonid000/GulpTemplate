const gulp = require('gulp')

require('./gulp/development.js')
require('./gulp/production.js')

gulp.task('default', gulp.series(
    'clean:dev', 
    gulp.parallel('html:dev', 'sass:dev', 'images:dev', 'js:dev'),
    gulp.parallel('server:dev','watch:dev')

))

gulp.task('dist', gulp.series(
    'clean:prod', 
    gulp.parallel('html:prod', 'sass:prod', 'images:prod', 'js:prod'),
    gulp.parallel('server:prod')

))