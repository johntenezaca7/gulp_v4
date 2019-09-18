// Init Modules
const { series, parallel, src, dest, watch } = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("autoprefixer");
const postcss = require("gulp-postcss");
const replace = require("gulp-replace");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const cssnano = require("cssnano");
const concatCSS = require("gulp-concat-css");
const sass = require("gulp-sass");
const webpackStream = require("webpack-stream");
const webpackConfig = require("./webpack.config");

// File Path Variables
const files = {
  source: {
    scssPath: "./src/scss/styles.scss",
    tsPath: "./src/js/**/*.ts",
    htmlPath: "./public/index.html"
  },
  public: {
    cssPath: "./public/css/",
    jsPath: "./public/js/",
    htmlPath: "./public/"
  },
  watch: {
    scss: "./src/scss/**/*.scss",
    ts: "./src/js/**/*.ts"
  }
}

// Sass Task
function scssTask() {
  return src( files.source.scssPath )
    .pipe( sass() )
    .pipe( dest( files.public.cssPath ));
}

// JS Task
function jsTask() {
  return src( files.source.tsPath )
    .pipe( concat("main.js") )
    .pipe( uglify() )
    .pipe( dest( files.public.jsPath ));
}

function tsTask() {
  return src( files.source.tsPath)
    .pipe( webpackStream( webpackConfig ))
    .pipe( uglify() )
    .pipe( dest( files.public.jsPath ))
}
// Cachebusting Task
const cbString = new Date().getTime();
const cbRegex = /cb=\d+/g;

function cacheBustTask() {
  return src( files.source.htmlPath )
    .pipe( replace( cbRegex, "cb=" + cbString ))
    .pipe( dest( files.public.htmlPath ));
}

// Watch Task
function watchTask() {
  watch( [ files.watch.scss, files.watch.ts ] ,
    parallel( scssTask, tsTask ));
}

// Default Task
exports.default = series(
  parallel( scssTask, tsTask ),
  watchTask
);
