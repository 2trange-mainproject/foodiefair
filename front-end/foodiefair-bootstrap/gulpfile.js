
// Load plugins
const { src, dest, watch, parallel, series } = require("gulp");
const sass = require('gulp-sass')(require('sass'))
const gulpautoprefixer = require('gulp-autoprefixer');
const browsersync = require("browser-sync").create();
const fileinclude = require('gulp-file-include');
const useref = require('gulp-useref');
const cached = require("gulp-cached");
const gulpIf = require("gulp-if");
const del = require('del');
const npmDist = require('gulp-npm-dist');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const replace = require('gulp-replace');
const gulpTerser = require('gulp-terser');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

// -------------- 프록시 설정 : .html을 없애기 위함----------------------
//  Set up Express server
const gulp = require('gulp');
const express = require('express');

// -------------- ---------------------------------------------------------------

// Paths to project folders
const paths = {
    base:{
        base: './',
        node: './node_modules'
    },
    src:{
        basesrc: './src',
        basesrcfiles: './src/**/*',
        scss: './src/assets/scss/**/*.scss',
        css: './src/assets/css',
        js: './src/assets/js/**/*.js',
        vendorJs: './src/assets/js/vendors/*.js',
        html: './src/**/*.html',
        images: './src/assets/images/**/*',
        fonts: './src/assets/fonts/**/*',
        assets: './src/assets/**/*',
        partials: '.src/partials/**/*'
    },
    temp:{
        basetemp: './.temp'
    },
    dist:{
        basedist: './dist',
        js: './dist/assets/js',
        vendorJs: './dist/assets/js/vendors',
        images: './dist/assets/images',
        css: './dist/assets/css',
        fonts: './dist/assets/fonts',
        libs: './dist/assets/libs'

    }
}


// SCSS 파일을 CSS로 변환하고 소스맵을 생성
function scss(callback) {
    return src(paths.src.scss)
        .pipe(sourcemaps.init())
        .pipe(sass().on("error", sass.logError))
        .pipe(gulpautoprefixer())
        .pipe(sourcemaps.write('.'))
        .pipe(dest(paths.src.css))
        .pipe(browsersync.stream());
    callback();
}

// vendor JS 파일을 압축하고 최종 dist 디렉터리로 이동
function vendorJs(callback) {
    return src(paths.src.vendorJs)
        .pipe(uglify())
        .pipe(dest(paths.dist.vendorJs))
    callback();
}


// 이미지 파일을 최종 dist 디렉터리로 이동
function images(callback) {
    return src(paths.src.images)
        .pipe(dest(paths.dist.images))
    callback();
}


// 폰트 파일을 최종 dist 디렉터리로 이동
function fonts(callback) {
    return src(paths.src.fonts)
        .pipe(dest(paths.dist.fonts))
    callback();
}


// HTML 파일을 처리하고 최종 dist 디렉터리로 이동. 이 과정에서 파일 포함, 노드 모듈 경로 변경, useref 및 최적화가 처리
function html(callback) {
    return src([paths.src.html, '!./src/partials/**/*'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(replace(/src="(.{0,10})node_modules/g, 'src="$1assets/libs'))
        .pipe(replace(/href="(.{0,10})node_modules/g, 'href="$1assets/libs'))
        .pipe(useref())
        .pipe(cached())

        .pipe(gulpIf('*.css', postcss([ autoprefixer(), cssnano() ]))) // PostCSS plugins with cssnano

        .pipe(gulpIf('*.js', gulpTerser()))
        .pipe(dest(paths.dist.basedist))
        .pipe(browsersync.stream());
    callback();
}


// HTML 파일에 대한 파일 포함 처리를 수행하고 .temp 디렉터리에 저장
function fileincludeTask(callback) {
    return src([paths.src.html, '!./src/partials/**/*'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file',
        }))
        .pipe(cached())
        .pipe(dest(paths.temp.basetemp));
    callback();
}


// 노드 모듈에서 필요한 라이브러리를 dist 디렉터리로 복사
function copyLibs(callback) {
    return src(npmDist(),{base: paths.base.node})
        .pipe(dest(paths.dist.libs));
    callback();
}


//  .temp 디렉터리를 삭제
function cleanTemp(callback) {
    del.sync(paths.temp.basetemp);
    callback();
}

// dist 디렉터리를 삭제
function cleanDist(callback) {
    del.sync(paths.dist.basedist);
    callback();
}

const serveStatic = require('serve-static');

// Express 서버를 설정하고 HTML 확장명을 제거하는 미들웨어를 사용하여 로컬 서버를 실행
function browsersyncServe(callback) {
    const app = express();

    // Middleware to remove .html extension
    app.use(function (req, res, next) {
        if (req.path.indexOf('.') === -1) {
            const file = req.path.split('/').pop();
            const fileExt = '.html';
            req.url = req.url.replace(file, file + fileExt);
        }
        next();
    });

    app.use(serveStatic(paths.temp.basetemp));
    app.use(serveStatic(paths.src.basesrc));
    app.use('/node_modules', serveStatic('node_modules'));

    app.listen(3000, function () {
        console.log('Server is running on port 3000');
    });

    callback();
}

//  BrowserSync를 사용하여 브라우저를 새로 고침
function syncReload(callback){
    browsersync.reload();
    callback();
}

// 파일 변경을 감지하고 관련 작업을 실행
function watchTask(){
    watch(paths.src.html, series( fileincludeTask, syncReload));
    watch([paths.src.images, paths.src.fonts, paths.src.vendorJs], series(images, fonts, vendorJs));
    watch([paths.src.scss], series(scss, syncReload));
}

// Default Task Preview
exports.default = series(fileincludeTask, browsersyncServe, watchTask);

// Build Task for Dist
exports.build = series(parallel(cleanDist), html, images, fonts, vendorJs, copyLibs, cleanTemp);

gulp.task('serve', series(fileincludeTask, browsersyncServe, watchTask));

// export tasks
exports.scss = scss
exports.vendorJs = vendorJs
exports.images = images;
exports.fonts = fonts
exports.html = html;
exports.fileincludeTask = fileincludeTask
exports.copyLibs = copyLibs
exports.cleanTemp = cleanTemp
exports.cleanDist = cleanDist