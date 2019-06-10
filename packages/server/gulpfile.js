const util = require("util");

const gulp = require("gulp");
const rimraf = require("rimraf");

function clean() {
  return util.promisify(rimraf)("build");
}

function bootstrap() {
  return gulp
    .src(require.resolve("bootstrap/dist/css/bootstrap.min.css"))
    .pipe(gulp.dest("build"));
}

gulp.task("clean", clean);

gulp.task("bootstrap", bootstrap);

gulp.task("default", gulp.series(clean, bootstrap));
