var ENV = {
    NODE_ENV: JSON.stringify('dev'),
    PROXY: 'c.dev.8891.com.tw',
    API_HOST: JSON.stringify('c.dev.8891.com.tw')
};

var config = require('./webpack.common.js').env(ENV);

module.exports = config;