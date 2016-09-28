var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var pump = require('pump');
var cleanCSS = require('gulp-clean-css');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: "app"
    },
  })
});

gulp.task('devtool', ['browserSync'], function (){
  gulp.watch('app/**/*.+(html|css|js)', browserSync.reload);
})

gulp.task('compress-js', function (cb) {
  pump([
        gulp.src('app/js/*.js'),
        gulpIf('*.js', uglify()),
        gulp.dest('dist/js'),
        gulp.src('app/views/js/*.js'),
        gulpIf('*.js', uglify()),
        gulp.dest('dist/views/js')
    ],
    cb
  );
});

gulp.task('minify-css', function(cb) {
  pump([
        gulp.src('app/css/*.css'),
        gulpIf('*.css', cleanCSS({compatibility: 'ie8'})),
        gulp.dest('dist/css'),
        gulp.src('app/views/css/*.css'),
        gulpIf('*.css', cleanCSS({compatibility: 'ie8'})),
        gulp.dest('dist/views/css'),
    ],
    cb
  );
});

gulp.task('images', function(){
  return gulp.src('app/img/**/*.+(png|jpg|gif|svg)')
  .pipe(cache(imagemin()))
  .pipe(gulp.dest('dist/img'))
});

gulp.task('images2', function(){
  return gulp.src('app/views/images/**/*.+(png|jpg|gif|svg)')
  .pipe(cache(imagemin()))
  .pipe(gulp.dest('dist/views/images'))
});

gulp.task('html', function() {
  return gulp.src('app/*.html')
  .pipe(gulp.dest('dist'))
})

gulp.task('html2', function() {
  return gulp.src('app/views/*.html')
  .pipe(gulp.dest('dist/views'))
})

gulp.task('clean:dist', function() {
  return del.sync('dist');
})

gulp.task('distServer', function() {
  browserSync.init({
    server: {
      baseDir: "dist"
    },
  })
});

gulp.task('default', function (callback) {
  runSequence('clean:dist',
    ['compress-js', 'minify-css', 'images', 'images2', 'html', 'html2'], 'distServer',
    callback
  )
})
