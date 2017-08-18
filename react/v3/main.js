/* main.js */

{
    let href = location.href,
        search = location.search;
    //廣告默認跳轉，解決IOS9以下帶#會被吞掉問題（c.8891.com.tw/m/show/?/topic/27/9803）
    if (search && search.split('?/')[1]) {
        let link = href.replace('?/', '');
        history.replaceState(null, '', link);
    }else if (search && href.indexOf(search + '#/') != -1) { //解決帶#的廣告跳轉問題
        let link = href.replace(search + '#/', '');
        history.replaceState(null, '', link + search);
    };
     //舊的帶#的鏈接跳轉為不帶#的新鏈接
    if (href.indexOf('show/#/') != -1) {
        let link = href.replace('show/#', 'show');
        history.replaceState(null, '', link);
    }else if (href.indexOf('show/#') != -1) {
        let link = href.replace('show/#', 'show/');
        history.replaceState(null, '', link);
    };
};

{
    if(location.protocol !== "https:" && location.host.indexOf("dev") == -1){
        location.href = location.href.replace(/^http/ig,'https');
    }
};

{
    //從其他地方進入網站的，插入一條歷史記錄，讓用戶點返回回到首頁
    var refe = document.referrer;
    if (refe == '' || refe.indexOf('8891.com.tw/m') == -1) {
        var _href = location.href;
        history.replaceState({}, '', location.origin+'/m/');
        history.pushState({}, '', _href);
    };
};

