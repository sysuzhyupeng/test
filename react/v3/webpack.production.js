var ENV = {
    NODE_ENV: JSON.stringify('production'),
    API_HOST: JSON.stringify('c.8891.com.tw')
};

var config = require('./webpack.common.js').env(ENV);

module.exports = config;