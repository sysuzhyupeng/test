/* 一些常用的JS、工具 */

/**
 * 判斷對象是否為空
 */
export function isNullObj(obj) {
	for(var i in obj){
		if(obj.hasOwnProperty(i)){
			return false;
		}
	}
	return true;
}

/**
 * 判斷觸屏版是安卓還是IOS
 */
export function getTouchOs() {
	var sys;
	if(navigator.userAgent.match("Android")){
		sys = "android";
	}else if(navigator.userAgent.match("iPhone")){
		sys = "ios";
	}else if(navigator.userAgent.match("iPad")){
		sys = "iPad";
	};
	return sys;
}

/**
 * 判斷是否是APP
 */
export function getOs() {
	return global.Bridge ? global.Bridge.os() : false;
}

/**
 * 对象序列化（转url参数）
 */
export function param(obj) {
	let query = [];
	for (var key in obj) {
		query.push(encodeURIComponent(key) + '=' + obj[key]);
	}
	return query.join('&');
}