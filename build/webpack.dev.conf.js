const ExtractTextPlugin = require('extract-text-webpack-plugin');
const util = require("./util.js");

const devConf = {
    entry: util.getEntryFilename(),

    output: {
        path: util.getOutputFoldername('dev'),
        filename: util.getOutputFilename()
    },
    module: {
        rules: util.getLoader()
    },
    plugins: [
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
