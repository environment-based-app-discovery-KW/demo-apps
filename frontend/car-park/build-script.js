#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const tar = require('tar');
const rimraf = require('rimraf');
const execSync = require('child_process').execSync;
const webpack = require("webpack");
const packageJson = require('./package.json');
const SRC_DIR = path.join(__dirname, '/src');
const fileName = packageJson.name + '-' + packageJson.version + '-build';
const BUILD_DIR = path.join(__dirname, '/' + fileName);

// 创建空的build目录
if (fs.existsSync(BUILD_DIR)) {
  rimraf.sync(BUILD_DIR);
}
fs.mkdirSync(BUILD_DIR);

// 运行npm shrinkwrap以获得所有依赖的版本
execSync("npm shrinkwrap", { stdio: [0, 1, 2] });

// 读取shrinkwrap信息
let shrinkWrapJson = JSON.parse(fs.readFileSync('./npm-shrinkwrap.json', { encoding: "UTF8" }));

function buildApp() {
  return new Promise((resolve, reject) => {
    // 给app代码做build
    const entry = {};
    entry.app = SRC_DIR;
    const externals = {};

    Object.keys(shrinkWrapJson.dependencies).forEach(_ => {
      let ver = shrinkWrapJson.dependencies[_].version;
      let depName = _ + "_" + ver;
      externals[_] = {
        window: ["$deps", depName],
      };
    });

    let appBuildConf = {
      context: __dirname,
      entry,
      externals,
      output: {
        path: BUILD_DIR,
        filename: '[name].js',
        libraryTarget: "window",
      },
      resolve: {
        extensions: ['.js', '.jsx'],
      },
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
            },
          }, {
            test: /\.css$/,
            use: [
              { loader: "style-loader" },
              { loader: "css-loader" },
            ],
          },
        ],
      },
      plugins: [
        new webpack.optimize.UglifyJsPlugin({
          compress: { warnings: false },
        })],
    };

    webpack(appBuildConf, (err, stats) => {
      if (err || stats.hasErrors()) {
        reject(err || stats.hasErrors());
      }
      resolve();
    });
  });
}

function buildDeps() {
  return new Promise((resolve, reject) => {
    // 给依赖项做build
    const entry = {};
    const externals = {};
    const deps = {};

    Object.keys(shrinkWrapJson.dependencies).forEach(_ => {
      // 只有在packageJson中出现的dependency才打包
      if (!packageJson.dependencies[_]) {
        return;
      }
      let ver = shrinkWrapJson.dependencies[_].version;
      let depName = _ + "_" + ver;
      entry[depName] = "./node_modules/" + _;
      deps[_] = ver;
    });

    const depsBuildConf = {
      context: __dirname,
      entry,
      externals: externals,
      output: {
        path: BUILD_DIR,
        filename: 'deps/[name].js',
        library: ['$deps', '[name]'],
      },
      plugins: [
        new webpack.optimize.UglifyJsPlugin({
          compress: { warnings: false },
        })],
    };

    const meta = {
      name: packageJson.name,
      version: packageJson.version,
      description: packageJson.description,
      deps,
    };

    fs.writeFileSync(path.join(BUILD_DIR, "meta.json"), JSON.stringify(meta, null, 4), { encoding: "UTF8" });

    webpack(depsBuildConf, (err, stats) => {
      if (err || stats.hasErrors()) {
        reject(err || stats.hasErrors());
      }
      resolve();
    });
  });
}

buildApp().then(() => {
  buildDeps().then(() => {
    tar.c({
      gzip: true,
      portable: true,
      file: fileName + '.tar.gz',
      cwd: BUILD_DIR
    }, fs.readdirSync(BUILD_DIR)).then(() => {
      rimraf(BUILD_DIR, () => {
        console.log("Build complete");
      });
    });
  });
});
