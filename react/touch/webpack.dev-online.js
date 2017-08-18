var ENV = {
    NODE_ENV: JSON.stringify('dev-online'),
    PROXY: 'c.8891.com.tw',
    API_HOST: JSON.stringify('c.8891.com.tw')
};

var config = require('./webpack.dev.js').env(ENV).assign({
    devServer: {
        disableHostCheck: true,
        historyApiFallback: { //所有的跳转将指向index.html
            index: '/m/index.html'
        },
        proxy: {
            '/api/*': {
                target: 'http://' + ENV.PROXY,
                secure: false,
                host: ENV.PROXY
            }
        }
    }
});

module.exports = config;