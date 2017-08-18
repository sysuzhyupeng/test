
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import routes from './src/routes'
import { Router, browserHistory, applyRouterMiddleware, match } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux'
import { useScroll } from 'react-router-scroll'
import configStore from './src/store/configStore'
import 'antd-mobile/dist/antd-mobile.min.css'
import './src/resource/css/main.less'
import './src/utils/htmlFontSize'
import { getOs } from './src/utils'
import useBasename from 'history/lib/useBasename'
import Api from './src/utils/api'
import ReactGA from 'react-ga'
import GoogleTagManager from './src/utils/gtm'


const store = configStore();
const baseurl = '/m'
global.Api = Api;
global.historyUrl = [];    //存儲歷史記錄
global.ReactGA = ReactGA;   //ga
global.getOs = getOs;


ReactGA.initialize('UA-10127157-12');

function appHistory(history) {
    return useBasename(() => history)({
        basename: baseurl
    });
}
const historyFn = syncHistoryWithStore(appHistory(browserHistory),store);
var btn = document.getElementById('addPage_icon');
var Sys = {};
var ua = navigator.userAgent.toLowerCase();
var s;
(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
(s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
(s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
(s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
(s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
if (Sys.safari) {
    setTimeout(function(){
        document.getElementById('addpage').style.display="block";
    },1000)
}
setTimeout(function(){
    document.getElementById('addpage').style.display="none";
},10000)
btn.onclick = function(e){
    document.getElementById('addpage').style.display="none";
}
function logPageView() {
    historyUrl.push(location.href); //存儲歷史記錄
    if (historyUrl.length > 10) {
        historyUrl.shift(); //历史记录太多的话删掉一点，数量自己控制
    }

    // ReactGA.ga('send', 'pageview', global.location.href.replace(Api.host, ''));
    if (location.pathname.indexOf('articledetails') == -1 && location.pathname.indexOf('m/show/topic') == -1) {
        dataLayer.push({'event': 'pageChange', 'virtualPageUrl': global.location.pathname + global.location.search});
    }
}
//设备设置唯一UUID
uuid();
function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    var UUID = localStorage.getItem('UUID');
    if(!UUID) {
        localStorage.setItem('UUID', uuid);
    }
}
render(
    <div>
        <Provider store={store}>
            <Router routes={routes} history={historyFn} onUpdate={logPageView} render={applyRouterMiddleware(useScroll())} />
        </Provider>
        <GoogleTagManager gtmId='GTM-N47BNPG' />
    </div>
    ,
    document.getElementById('container')
);