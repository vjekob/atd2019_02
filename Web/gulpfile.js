const gulp = require("gulp");
const del = require("del");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const cleanCss = require("gulp-clean-css");
const sourcemaps = require("gulp-sourcemaps");
const empty = require("gulp-empty");
const babel = require("gulp-babel");

const config = require("./gulpfile.config.json");

const path = {
    source: {
        js: `${config.path.source.root}/${config.path.source.js}`,
        css: `${config.path.source.root}/${config.path.source.css}`
    },
    target: {
        js: `${config.path.target.root}/${config.path.target.js}`,
        css: `${config.path.target.root}/${config.path.target.css}`
    }
};
const bundleJsFileName = `${config.package}.min.js`;
const bundleCssFileName = `${config.package}.min.css`;
const pathBundleJs = `${path.target.js}/${bundleJsFileName}`;
const pathBundleCss = `${path.target.css}/${bundleCssFileName}`;
const globJs = `${path.source.js}/*.js`;
const globCss = `${path.source.css}/*.css`;

const deleteBundleJs = () => del(pathBundleJs, { force: true });
const deleteBundleCss = () => del(pathBundleCss, { force: true });

const bundleJs = prod => () => gulp
    .src(globJs)
    .pipe(prod ? empty() : sourcemaps.init())
    .pipe(concat(bundleJsFileName))
    .pipe(babel({
        presets: ["@babel/preset-env"]
    }))
    .pipe(prod ? uglify() : empty())
    .pipe(sourcemaps.mapSources((sourcePath, file) => `../../../../../../../${sourcePath}`))
    .pipe(prod ? empty() : sourcemaps.write())
    .pipe(gulp.dest(path.target.js));

const bundleCss = prod => () => gulp
    .src(globCss)
    .pipe(concat(bundleCssFileName))
    .pipe(prod ? cleanCss() : empty())
    .pipe(gulp.dest(path.target.css));

const buildJs = prod => gulp.series(deleteBundleJs, bundleJs(prod));
const buildCss = prod => gulp.series(deleteBundleCss, bundleCss(prod));

const watchJs = () => gulp.watch([globJs, `!${pathBundleJs}`], buildJs(false));
const watchCss = () => gulp.watch([globCss, `!${pathBundleCss}`], buildCss(false));

const build = prod => gulp.parallel(buildJs(prod), buildCss(prod));

exports.build = build(false);
exports.prod = build(true);
exports.watch = gulp.parallel(watchJs, watchCss);
