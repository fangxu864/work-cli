const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const util = require("./util.js");

const devConf = {

    entry: util.getEntryFilename(),

    output: {
        path: util.getOutputFoldername('production'),
        filename: util.getOutputFilename()
    },

    module: {
        rules: util.getLoader("production")
    },

    plugins: [
        new UglifyJSPlugin({
            uglifyOptions: {
                ie8: true
            }
        }),
        new ExtractTextPlugin({
            filename: util.getOutputFilename("css")
        })
    ],
    resolve: {
        alias: {
            'vue': 'vue/dist/vue.js'
        }
    }

}

module.exports = devConf;
