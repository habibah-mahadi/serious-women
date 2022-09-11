const currentTask = process.env.npm_lifecycle_event; //dev or build. we can configure webpack differently whether its a dev or build
const path = require("path");
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //extracting the CSS bundle (instead of the main.xxx.js) and separate into traditional CSS file
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); //only use this during build task, not on dev task
const HtmlWebpackPlugin = require('html-webpack-plugin'); //for both dev and build tasks
const fse = require('fs-extra'); //arrays all the html files

const postCSSPlugins = [
    require("postcss-import"),
    require("postcss-mixins"),
    require("postcss-simple-vars"), 
    require("postcss-nested"), 
    require("autoprefixer")
];

//compile images
class RunAfterCompile {
  apply(compiler) {
    compiler.hooks.done.tap('Copy images', function() {
      fse.copySync('./app/assets/images/', './docs/assets/images');
      fse.copySync('./app/assets/fonts/', './docs/assets/fonts');
    })
  }
}

let cssConfig = {
  test: /\.css$/i,
  use: ["css-loader?url=false", { loader: "postcss-loader", options: { postcssOptions: { plugins: postCSSPlugins } } }]
};

//this will return a new array that we can customise. this will include every single file and then its job of filter to say
//only .html
let pages = fse.readdirSync('./app').filter(function (file) {
  return file.endsWith('.html');
}).map(function (page) {
  return new HtmlWebpackPlugin({
    filename: page,
    template: `./app/${page}`
  })
}); //return array of multiple HTML webpack plugins

//any configuration that can be the same or shared between dev and build will live in this object here:
let config = {
  entry: "./app/assets/scripts/App.js",

  // plugins: [new HtmlWebpackPlugin({filename: 'index.html', template: './app/index.html'})], //add index.html into dist
  plugins: pages, 

  module: {
    rules: [
      cssConfig,
      {
        test: /\.js$/,
        exclude: /{node_modules}/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react','@babel/preset-env'] //added react
          }
        }
      }
    ]
  }

};


//and any code specific to dev, we can modify the config object in this statement and
//we can set up unique things for the build task within the if statement
if (currentTask == 'dev') {
  //add an item to beginning of the array
  cssConfig.use.unshift('style-loader');
  config.output = {
    filename: "bundled.js",
    path: path.resolve(__dirname, "app")
  };
  config.mode = "development";

  config.devServer = {
    before: function(app, server) {
      server._watch('./app/**/*.html')
    },
    contentBase: path.join(__dirname, 'app'),
    hot: true,
    port: 3000,
    host: '0.0.0.0'
  }
}

//how web browser caching a file. when we make changes on the scroll.js file, for example, we want to
//create new bundle - they're generated file to have some way have a slightly different filename 
//so the web browser know that its different and that it should re-download from the server
//rather than using its local cache copy
//chunkhash - randomly generated strings of characters.
//new file (with random name) will be built when changes in the js files are made. if no change, no new file is built
//so the old built file should be deleted. use this NPM package: CleanWebpackPlugin
if (currentTask == 'build') {

  // config.module.rules.push({
  //   test: /\.js$/,
  //   exclude: /{node_modules}/,
  //   use: {
  //     loader: 'babel-loader',
  //     options: {
  //       presets: ['@babel/preset-env']
  //     }
  //   }
  // }); //for people who viewing using older web browser, webpack can adjust our JS so that its backward compatible. we still can use modern JS features (e.g. arrow functions, classes) but the generated file will use similar but older features

  cssConfig.use.unshift(MiniCssExtractPlugin.loader);
  config.output = {
    filename: "[name].[chunkhash].js",
    chunkFilename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, "docs")
  };
  config.mode = "production";
  config.optimization = {
    splitChunks: {chunks: 'all'}, //minSize: 1000 (if vendor file is less than 1000 byte, webpack split the code into separate vendor file. default minSize is 20kb)
    minimize: true,
    minimizer: [`...`, new CssMinimizerPlugin()]
  };
  config.plugins.push(
    new CleanWebpackPlugin(), 
    new MiniCssExtractPlugin({filename: 'styles.[chunkhash].css'}),
    new RunAfterCompile() //for images in dist
  );
}

module.exports = config;