var ENV = {
    NODE_ENV: JSON.stringify('dev'),
    PROXY: 'c.dev.8891.com.tw',
    API_HOST: JSON.stringify('c.dev.8891.com.tw')
};

var config = require('./webpack.config.js').env(ENV).assign({
    devServer: {
        disableHostCheck: true,
        historyApiFallback: { //所有的跳转将指向index.html
            index: '/m/index.html'
        },
        proxy: {
            '/api/*': {
                target: 'http://'+process.env.PROXY,
                secure: false,
                host: process.env.PROXY
            },
            '/photoModel-*': {
                target: 'http://'+process.env.PROXY,
                secure: false,
                host: process.env.PROXY
            }
        }
    }
});

module.exports = config;