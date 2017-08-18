importScripts('./idb-keyval.js');

var NEWCAR_API_ENDPOINT = "https://c.8891.com.tw/api/v1/sendPushData";
var pushDefaultTitle = '8891新車';
var pushDefaultBody  = '8891新車-更新快、資料全的新車介紹網站';
var pushDefaultUrl = 'http://c.8891.com.tw';
var pushDefaultIcon = 'img/icon.png';

function showNotification(title, body, icon, data) {
    title = title || pushDefaultTitle ;
    body  = body || pushDefaultBody;
    icon  = icon || pushDefaultIcon
    
    var notificationOptions = {
        body: body,
        icon: icon,
        tag : 'newcar-push',
        data: data
    };
    
    return self.registration.showNotification(title, notificationOptions);
}

self.addEventListener('push', function(event) {

    var ua = navigator.userAgent;
    var now = Date.parse(new Date())/1000;
    if( ua.indexOf("Android") < 0 ){
      return false;
    } else {
      idbKeyval.set('touch-push-time',now);
    }

    if (event.data) {
      var content = event.data.text();
      content = JSON.parse(content);
      var title = content['touchTitle'];
      var body = content['body'];
      var icon = content['icon'];
      var url = content['touchUrl'];
      var data = {url:url};
      return showNotification(title,body,icon,data); 
    } else {
      event.waitUntil(
        fetch(NEWCAR_WEATHER_API_ENDPOINT)
        .then(function(response) {
            if(response.status != 200){
              console.log('Invalid status code from weather API: ' +
                response.status);
              throw new Error('Invalid status code from weather API: ' +
                response.status);
            }
            return response.json();
        })
        .then(function(data) {
            var body = data.data.body;
            var title = data.data.title;
            var data = {url:data.data.touchUrl};
            return showNotification(title,body,'',data); 
        })
        .catch(function(err){

            return showNotification(title,body,'',data);
        })
      ); 
    } 
});

self.addEventListener('notificationclick', function(event) {
  var url = event.notification.data.url;
  event.notification.close();
  var clickResponsePromise = Promise.resolve();
  clickResponsePromise = clients.openWindow(url)
  event.waitUntil(
    Promise.all([
      clickResponsePromise,
    ])
  );
});

self.addEventListener('notificationclose', function(event) {
});
