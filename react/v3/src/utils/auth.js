import Ajax from './ajax'
import Toast from 'antd-mobile/lib/toast'

/**
 * 判斷是否登錄
 */
export function privateConfirm() {
	var r = confirm("請先同意隱私權說明！")
	if (r == true) {
		localStorage.setItem('ReturnUrl', location.href);
		localStorage.setItem('privacyStatus', true);
		location.href = Api.host + '/m/at/master/index/t:helppris';
	};
};
export function loginConfirm() {
	var r = confirm("請先登入帳號！")
	if (r == true) {
		localStorage.setItem('ReturnUrl', location.href);
		location.href = Api.host + '/m/at/user/login';
	};
};
let CHECKLOGINSTATUS = false;
export function hasLogin(successFn, failFn) {
	if(!CHECKLOGINSTATUS) {
        CHECKLOGINSTATUS = true;
        Ajax.post(Api.host + '/newcarapi/u/chkLogin/', {
        	token: localStorage.getItem('accesstoken') || ''
        }).then(function(res) {
			if (res.status == '200') {
            	if (successFn) {
            		successFn(res);
            	}
            }else {
            	if (failFn) {
            		failFn(res);
            	}else if(res.error.type == 'PrivacyPolicyException') {
                    privateConfirm();
                }else {
            		loginConfirm();
            	}
            }
            CHECKLOGINSTATUS = false;
		}).catch(function(rej) {
			Toast.loading('檢查登錄失敗，請檢查網路狀態，再重試！', 3);
			CHECKLOGINSTATUS = false;
			return false;
		});
    } else {
        return false;
    }
}