/* Api.js */

let Api = { 'version': '2.9.5' };
Api.host = location.protocol + '//' + (_env.API_HOST || 'c.dev.8891.com.tw');
Api.local = '/m';
Api.index = Api.host + '/m/';
Api.base = Api.host + '/api/v1';
Api.old = Api.host + '/api/v2';

export default Api;