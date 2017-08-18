
   let PushManager = {
        init : function(){
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/m/service-worker.js').then(this.initialiseState());  
            }
        },
        initialiseState : function(){
            if (!('showNotification' in ServiceWorkerRegistration.prototype)) {  
                console.log('Notifications aren\'t supported.');  
                return;  
            }
            if (!('Notification' in window) || Notification.permission === 'denied') {  
                console.log('The user has blocked notifications.');  
                return;  
            }

            if (!('PushManager' in window)) {  
                console.log('Push messaging isn\'t supported.');  
                return;  
            }
            var _this = this;
            const applicationServerPublicKey = 'BOnmgbGHGhWCZy09uEQ5xG3jk8LrRq7EYTvkouI1ORbeQ5YypNPSiaMXsMCD9QnBtc8ueGRCaIVABf-TCuJQBdY';
            const applicationServerKey = _this.base64UrlToUint8Array(applicationServerPublicKey);
            navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {  
                serviceWorkerRegistration.pushManager.getSubscription().then(function(subscription){
                    if (!subscription) { 
                         _this.gaAnalytics("彈框","出現次數");
                        serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true, applicationServerKey: applicationServerKey})  
                        .then(function(subscription) {  
                            const subscriptionObject = JSON.parse(JSON.stringify(subscription));
                            _this.gaAnalytics("彈框","接受");
                            _this.pushRegisterDevice(subscriptionObject);
                        }).catch(function(e) {  
                            if(Notification.permission === 'default'){
                                _this.gaAnalytics("彈框","關閉");
                            } else if (Notification.permission === 'denied') {  
                                _this.gaAnalytics("彈框","拒絕");
                                console.log('Permission for Notifications was denied');  
                            } else {  
                                console.log('Unable to subscribe to push.');  
                            }  
                        }); 
                    }
                }).catch(function (e) {
                    console.error('Error thrown while unsubscribing from push messaging.', e);
                });
            }); 
        },
        getRegistrationId : function(pushSubscription){
            if (pushSubscription.subscriptionId) {
                return pushSubscription.subscriptionId;
            }
            var endpoint = 'https://android.googleapis.com/gcm/send/';
            parts = pushSubscription.endpoint.split(endpoint);

            if(parts.length > 1){
                return parts[1];
            }
        },
        pushRegisterDevice: function(register){
          fetch( Api.base + "/newSendPushToken",{
                method : 'post',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: "from=1&pushToken="+JSON.stringify(register)
            });
        },
        gaAnalytics: function(a,b){
            if(typeof(ga) == "function"){
                ga('send', 'event', '觸屏版瀏覽器推送', a, b);
            }
        },
        base64UrlToUint8Array: function(base64UrlData) {
            const padding = '='.repeat((4 - base64UrlData.length % 4) % 4);
            const base64 = (base64UrlData + padding)
                .replace(/\-/g, '+')
                .replace(/_/g, '/');

            const rawData = window.atob(base64);
            const buffer = new Uint8Array(rawData.length);

            for (var i = 0; i < rawData.length; ++i) {
                buffer[i] = rawData.charCodeAt(i);
            }
            return buffer;
        }
    };
PushManager.init();