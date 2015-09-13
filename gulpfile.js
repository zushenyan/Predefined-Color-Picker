// dependences
var gulp = require("gulp");
var sass = require("gulp-sass");
var maps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var babelify = require("babelify");
var browserSync = require("browser-sync").create();
var del = require("del");

// paths
var sassPath = "sass";
var sassFiles = "sass/**/*.scss";
var sassMainFile = "sass/pcp.scss";
var compiledSassPath = "css";
var babelFiles = "babel/**/*.js";
var compiledBabelPath = "src/js";
var jsMainFile = "js/pcp.js";
var htmlFiles = "*.html"

function errorHandler(err){
	console.log(err.toString());
	this.emit("end");
}

ulp.task("clean", function(){
	return del([compiledSassPath, compiledBabelPath]);
});

gulp.task("compileSass", function(){
	return gulp.src(sassMainFile)
		.pipe(maps.init())
		.pipe(sass().on("error", errorHandler))
		.pipe(maps.write("."))
		.pipe(gulp.dest(compiledSassPath))
		.pipe(browserSync.stream());
});

gulp.task("compileBabel", function(){
	return browserify(jsMainFile, { debug: true }) // produce source map by enabling debug = true
		.transform(babelify)
		.bundle()
		.on("error", errorHandler)
		.pipe(source("app.js"))
		.pipe(gulp.dest(compiledBabelPath))
		.pipe(browserSync.stream());
});

gulp.task("watch", function(){
	browserSync.init({
		server: "./"
	})
	gulp.watch(sassFiles, ["compileSass"]);
	gulp.watch(babelFiles, ["compileBabel"]);
	gulp.watch(htmlFiles, browserSync.reload);
})

gulp.task("build", ["clean", "compileSass", "compileBabel"]);
