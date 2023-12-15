const gulp = require('gulp');
const connect = require('gulp-connect');

// Define a task to serve the files
gulp.task('serve', function () {
  connect.server({
    root: './', // Specify the root directory
    livereload: true, // Enable live reloading
    port: 8080, // Specify the port
  });
});

// Define a task to watch for changes and trigger live reloading
gulp.task('watch', function () {
  gulp.watch(['./*.html', './*.css', './*.js'], gulp.series('reload'));
});

// Define a task to reload the server
gulp.task('reload', function (done) {
  connect.reload();
  done();
});

// Define the default task (which starts the server and watches for changes)
gulp.task('default', gulp.series('serve', 'watch'));
