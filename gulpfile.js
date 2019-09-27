const gulp = require('gulp')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const notify = require('gulp-notify')
const plumber = require('gulp-plumber')
const imagemin = require('gulp-imagemin')
const mozjpeg = require('imagemin-mozjpeg')
const pngquant = require('imagemin-pngquant')
const changed = require('gulp-changed')


const paths = {
  scssSrc: './scss/**/*.scss',
  imgSrc: 'src/images/**/*',
  outCss: 'css/',
  outImg: 'assets/images'
}

// sass
function sassTask() {
  return gulp
    .src(paths.scssSrc, {
      sourcemaps: false
    })
    .pipe(
      plumber({
        errorHandler: notify.onError('<%= error.message %>')
      })
    )

    .pipe(
      sass({
        outputStyle: 'compressed'
      })
    )
    .pipe(
      autoprefixer({
        cascade: false
      })
    )
    .pipe(
      gulp.dest(paths.outCss, {
        sourcemaps: './sourcemaps'
      })
    )
}



// img
function imgTask() {
  return gulp
    .src(paths.imgSrc)
    .pipe(changed(paths.outImg))
    .pipe(
      imagemin(
        [
          mozjpeg({
            quality: 80 //画像圧縮率
          }),
          pngquant({
            quality: [.7, .85],
            speed: 1
          })
        ],
        {
          verbose: true
        }
      )
    )
    .pipe(gulp.dest(paths.outImg))
}

// watch
function watchTask(done) {
  gulp.watch(paths.scssSrc, gulp.parallel(sassTask))
  gulp.watch(paths.imgSrc, gulp.parallel(imgTask))
  done()
}

// scripts tasks
gulp.task('default', gulp.parallel(watchTask, sassTask, imgTask))
