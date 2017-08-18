class GamDaleXMLHttpRequest {
    constructor(opts){
        this.events = {
            READY_STATE_CHANGE: 'readystatechange',
            LOAD_START: 'loadstart',
            PROGRESS: 'progress',
            ABORT: 'abort',
            ERROR: 'error',
            LOAD: 'load',
            TIMEOUT: 'timeout',
            LOAD_END: 'loadend'
        };
        this.baseUrl = 'http://c.dev.8891.com.tw/';
        this.opts = opts || {};
        this.opts["json"] = this.opts["json"] || true;//默认采用json处理
    }
    /**
     * 真正执行发送请求
     * @param url - URL to request
     * @param callback
     * @param method
     * @param data
     * @param sync
     */
    send(url, method, data){

        var requestUrl = url.indexOf('://') > 0 ? url : this.baseUrl + url.replace(/(^\/*)/g,'');
        return new Promise((resolve,reject)=>{
            var xhr = new XMLHttpRequest();
            xhr.timeout = 10000000; //配置超时时间
            var m = method || 'GET';
            data = data ? this.parseData(data) : null;

            //添加版本号
            if (requestUrl.indexOf('?') === -1) {
                requestUrl += '?api=' + Api.version;
            }else {
                requestUrl += '&api=' + Api.version;
            }
            if(m == 'GET' && data){
                requestUrl += '&'+data;
            }

            xhr.open(m, requestUrl, true);

            // Set headers
            xhr.setRequestHeader('Accept', 'application/json, text/javascript, */*; q=0.01');
            xhr.setRequestHeader('Content-Type', this.opts.contentType || 'application/x-www-form-urlencoded; charset=UTF-8');
            // 自定义头部
            if(this.opts.headers) {
                for(var name in this.opts.headers) {
                    var value = this.opts.headers[name];
                    xhr.setRequestHeader(name, value);
                }
            }
            // 跨域访问
            xhr.withCredentials = true;
            // if(this.opts.withCredentials) xhr.withCredentials = true;


            xhr.addEventListener(this.events.LOAD,  ()=>{
                // ==0 for files.
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status==0) {
                    let responseText = '';

                    if (xhr.responseText) {
                        try{
                            responseText =  this.opts.json ? JSON.parse(xhr.responseText) : xhr.responseText;
                            resolve(responseText,xhr);
                        }catch(Exception){
                            reject(this.reject(xhr));
                        }

                    }else{
                        reject(this.reject(xhr));
                    }

                } else {
                    reject(this.reject(xhr));
                }
            });
            // 处理基本事件
            xhr.addEventListener(this.events.ABORT, ()=>{
                return reject(this.reject(xhr));
            });
            xhr.addEventListener(this.events.ERROR, ()=>{
                return reject(this.reject(xhr));
            });
            xhr.addEventListener(this.events.TIMEOUT, ()=>{
                //超时错误
                return reject(this.reject(xhr));
            });

            xhr.send(data);

        }).catch(function () {
            //出现无法解析等异常错误的捕获
            console.log('服务器异常错误，请反馈给相关人员！');
        });
    }

    /**
     * 处理回调.
     * @param xhr
     * @returns {string}
     */
    reject(xhr){
        let responseText = '';
        if (xhr.responseText) {
            try{
                responseText =  this.opts.json ? JSON.parse(xhr.responseText) : xhr.responseText;
            }catch (Exception){
                responseText = {"ErrMsg":"服务器内部错误！"};
            }

        }
        return responseText;
    }

    /**
     * Create get查询
     * @param data
     * @returns {Array}
     */
    parseData(data){
        // JSON
        if(this.opts.contentType=='application/json') return JSON.stringify(data);
        // Query string
        var query = [];
        if(((typeof data).toLowerCase()=='string') || (typeof data).toLowerCase()=='number') {
            query.push(data);
        }else {
            for (var key in data) {
                query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
            }
        }

        return query.join('&');
    }
    /**
     * GET 包裹封装
     * @param url
     * @returns {*}
     */
    get(url){
        return this.send(url);
    }
    /**
     * POST 包裹封装
     * @param url
     * @param data
     * @returns {*}
     */
    post(url,data){
        return this.send(url,'POST',data || {});
    }

}

export default {
    get:function (url,data) {
        return new GamDaleXMLHttpRequest().send(url,"GET",data);
    },
    /**
     * POST 包裹封装
     * @param url
     * @param data
     * @returns {*}
     */
    post(url,data){
        return new GamDaleXMLHttpRequest().send(url,'POST',data || {});
    }
};