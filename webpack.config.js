const currentTask = process.env.npm_lifecycle_event; //dev or build. we can configure webpack differently whether its a dev or build
const path = require("path");

const postCSSPlugins = [
    require("postcss-import"),
    require("postcss-mixins"),
    require("postcss-simple-vars"), 
    require("postcss-nested"), 
    require("autoprefixer")
]

//any configuration that can be the same or shared between dev and build will live in this object here:
let config = {
  entry: "./app/assets/scripts/App.js",

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader?url=false", { loader: "postcss-loader", options: { postcssOptions: { plugins: postCSSPlugins } } }]
      }
    ]
  }

};


//and any code specific to dev, we can modify the config object in this statement and
//we can set up unique things for the build task within the if statement
if (currentTask == 'dev') {
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

if (currentTask == 'build') {
  config.output = {
    filename: "bundled.js",
    path: path.resolve(__dirname, "dist")
  };
  config.mode = "production";
}

module.exports = config;