// dependences
var gulp = require("gulp");
var sass = require("gulp-sass");
var maps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
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
var babelMainFile = "babel/pcp.js";
var compiledBabelPath = "js";
var jsFileBundle = "pcp.js";
var jsFileMinBundle = "pcp.min.js";
var htmlFiles = "*.html"

var debug = true;

function errorHandler(err){
	console.log(err.toString());
	this.emit("end");
}

gulp.task("clean", function(){
	return del([compiledSassPath, compiledBabelPath]);
});

gulp.task("compileSass", function(){
	return gulp.src(sassMainFile)
		.pipe(maps.init())
		.pipe(sass().on("error", errorHandler))
		.pipe(maps.write("."))
		.pipe(gulp.dest(compiledSassPath));
});

gulp.task("compileBabel", function(){
	return browserify(babelMainFile, { debug: debug }) // produce source map by enabling debug = true
		.transform(babelify)
		.bundle()
		.on("error", errorHandler)
		.pipe(source(jsFileBundle))
		.pipe(gulp.dest(compiledBabelPath));
});

gulp.task("minifyJs", ["compileBabel"], function(){
	return gulp.src(compiledBabelPath + "/" + jsFileBundle)
		.pipe(uglify())
		.pipe(rename(jsFileMinBundle))
		.pipe(gulp.dest(compiledBabelPath));
});

gulp.task("watch",  ["clean", "compileSass", "compileBabel"], function(){
	browserSync.init({
		server: "./"
	})
	gulp.watch(sassFiles, ["compileSass"]).on("change", browserSync.reload);
	gulp.watch(babelFiles, ["compileBabel"]).on("change", browserSync.reload);
	gulp.watch(htmlFiles, browserSync.reload);
})

gulp.task("build", ["clean", "compileSass", "minifyJs"]);
