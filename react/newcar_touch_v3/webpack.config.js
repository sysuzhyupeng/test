var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin'); //css单独打包
var HtmlWebpackPlugin = require('html-webpack-plugin'); //生成html
var extend = require('extend');

process.env.DEBUG = '';

var config = {


	entry: { //多入口，其实就是产生多个js文件
		app: './main.js', //主文件入口
		lib: './lib.js',
	},

	output: { //入口文件输出配置
		path: "./build",
		filename: '[name].js',
		publicPath: '/m/'
	},

	externals: [
		require('webpack-require-http')
	],

	module: {
	    loaders: [
	        {
	            test: /\.json$/,
	            loader: 'json'
	        },
	        {
	            test: /\.js$/,
	            exclude: /node_modules/,
	            loader: 'babel',
	            query: {
	                presets: ['es2015', 'react']
	            }
	        },
	        {
	            test: /\.css$/,
                exclude: /^node_modules$/,
	            loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
	        },
	        {
	            test: /\.less$/,
                exclude: /^node_modules$/,
	            loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader')
	        },
	        {
	            test:  /\.(png|woff|svg|ttf|eot|jpg|gif)$/,
	            loader: "url-loader?limit=10000" //限制大小小于10k的
	        }
	    ]
	},

	resolve: {
		extensions: ['', '.web.js', '.js', '.json', '.less', '.css'] //后缀名自动补全
	},

	plugins: [
		new ExtractTextPlugin('[name].css'),
        new webpack.DefinePlugin({
            '_env': process.env
        }),
		new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
			template: __dirname + '/src/template/index.tmpl.html',
			inject: true,
			hash: true
		})
	],

	assign: function(newConfig) {
		return extend(true, this, newConfig);
	},

	env: function(newEnv){
		process.env = extend(true, process.env, newEnv);
		return this;
	}

}

module.exports = config;