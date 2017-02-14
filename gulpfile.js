'use strict';
var source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	path = require('path'),
	gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	cleanCSS = require('gulp-clean-css'),
	browserSync = require('browser-sync').create(),
	browserify = require('browserify'),
	babelify = require('babelify'),
	pug = require('gulp-pug'),
	uglify = require('gulp-uglify');

//----- Config -----//
var build = './build/',
	src = './src/';

// SASS
gulp.task('sass', function() {
	return gulp.src(src + 'scss/style.scss')
		.pipe(sass({
			outputStyle: 'expanded'
		}))
		.pipe(autoprefixer({
			browsers: ['> 1%', 'last 40 versions'],
			cascade: true
		}))
		.pipe(cleanCSS())
		.pipe(gulp.dest(build + 'css/'))
		.pipe(browserSync.stream());
});

// Pug
gulp.task('pug', function() {
	return gulp.src(src + 'pug/index.pug')
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest(build))
		.pipe(browserSync.stream());
});


gulp.task('bundle-js', function() {
	return browserify(src + 'js/demo.js')
		.transform('babelify', { presets: ['es2015', 'react'] })
		.bundle()
		.pipe(source('bundle.min.js'))
		.pipe(buffer())
		// .pipe(uglify())
		.pipe(gulp.dest(build + 'js/'))
		.pipe(browserSync.stream());
});

// Watch
gulp.task('watch', function() {
	browserSync.init({
		server: {
			baseDir: build
		},
		port: 5000
	});
	gulp.watch(src + 'scss/*.scss', gulp.series('sass'));
	gulp.watch([src + 'pug/**/*.pug', src + 'pug/includes/*.pug'], gulp.series('pug'));
	gulp.watch(src + 'js/**/*.js', gulp.series('bundle-js'));
});

// default
gulp.task('default', gulp.series(gulp.parallel('pug', 'sass', 'bundle-js'), 'watch'));
