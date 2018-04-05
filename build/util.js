//外部模块
const path = require("path");
const fs = require("fs");
const yargs = require("yargs");
const curCompilePath = yargs.argv._[0]; //当前编译模块的文件名
const ExtractTextPlugin = require('extract-text-webpack-plugin');

//检测文件或者文件夹存在 nodeJS
function fsExistsSync(path) {
    try {
        fs.accessSync(path, fs.F_OK);
    } catch (e) {
        return false;
    }
    return true;
}

/**
 * 生成文件路径的助手函数
 * 
 * @param {string} dir 文件夹名称
 */
function resolve(dir) {
    return path.join(__dirname, "..", dir)
}

/**
 * 获取编译入口的文件名
 */
function getEntryFilename() {
    var nameArr = ["index.js"];
    var curName = '';
    nameArr.forEach(function (item) {
        var curPath = resolve(curCompilePath) + item;
        console.log(curPath);
        if (fsExistsSync(curPath)) {

            curName = curPath
        }
    })
    if (!curName) {
        throw new Error("没有找到入口文件");
    }
    console.log(curName);
    return curName;
}

/**
 * 获取编译出口的文件名
 */
function getOutputFilename(jsOrCss) {
    //找到配置文件
    let buildConfig = require(resolve(curCompilePath) + "build.config.js");
    if (jsOrCss === "css") {
        return buildConfig.outputFilename + "all.css";
    } else {
        return buildConfig.outputFilename + "all.js";
    }
}



/**
 * 获取编译出口的文件夹名
 * 
 * @param {string} env 环境参数 dev|production
 */
function getOutputFoldername(env) {
    //找到配置文件
    let buildConfig = require(resolve(curCompilePath) + "build.config.js");
    let curFolderName = buildConfig.outputFoldername || "";
    let folderName = "";
    switch (env) {
        case "dev":
            folderName = path.join(__dirname, "..", "dist/dev", curFolderName);
            break;
        case "production":
            folderName = path.join(__dirname, "..", "dist/production", curFolderName);
            break;
    }
    return folderName;
}

/**
 * 获取loader
 */
function getLoader(env) {

    return [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader"
        },
        {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: [{
                    loader: 'css-loader',
                    options: {
                        minimize: env === "production" ? true : false
                    }
                }]
            })
        },
        {
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader',
                    options: {
                        minimize: env === "production" ? true : false
                    }
                }, {
                    loader: 'sass-loader'
                }]
            })
        },
        {
            test: /\.vue$/,
            loader: "vue-loader",
            options: {
                loaders: {
                    css: ExtractTextPlugin.extract({
                        fallback: "style-loader",
                        use: ["css-loader"]
                    }),
                    scss: ExtractTextPlugin.extract({
                        fallback: "style-loader",
                        use: ["css-loader", "sass-loader"]
                    })
                }
            }
        },
        {
            test: /\.html|tpl|xtpl$/,
            loader: "html-loader",
            query: {
                minimize: true
            }
        },
        {
            test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
            loader: 'file-loader'
        },
        {
            test : /\.(png|jpe?g|gif)$/,
            loader : 'url-loader?limit=8192&name=images/[name]-[hash].[ext]'
        }
    ]

}


module.exports = {
    getEntryFilename,
    resolve,
    getOutputFoldername,
    getOutputFilename,
    getLoader
}