/*
* 深度解析詳情頁
*/
import Ajax from '../../utils/ajax'
import Toast from 'antd-mobile/lib/toast'

export const TP_NAV_DATA = "TP_NAV_DATA";
export const TP_NAV_FIXED = "TP_NAV_FIXED";
export const TP_NAV_AT = "TP_NAV_AT";
export const TP_NEXT_STATUS = "TP_NEXT_STATUS";
export const TP_COMMENT_ALL = 'TP_COMMENT_ALL';

export const TP_RESPOND = "TP_RESPOND";
export const TP_COMMENT_DATA_SUCCESS = "TP_COMMENT_DATA_SUCCESS";
export const TP_COMMENT_DATA_ALL = 'TP_COMMENT_DATA_ALL';

export const TP_PHOTO_STATUS = 'TP_PHOTO_STATUS';



//導航數據
export function tpNavData(data) {
	return {
		type: TP_NAV_DATA,
		payload: data
	}
}

//導航定位
export function tpNavFixed(data) {
	return {
		type: TP_NAV_FIXED,
		payload: data
	}
}

//當前導航位置
export function tpNavAt(num) {
	return {
		type: TP_NAV_AT,
		payload: num
	}
}

//跳轉下一頁中
export function tpNextStatus(status) {
	return {
		type: TP_NEXT_STATUS,
		payload: status
	}
}

//是否在全部留言頁
export function tpAllComment(type) {
	return {
		type: TP_COMMENT_ALL,
		payload: type
	}
}

//回應
export function tpRespond(resParams) {
	return {
		type: TP_RESPOND,
		payload: resParams
	}
}

//獲取評論
export function tpGetComment(data) {
	return dispatch => {
		Ajax.get(Api.base + '/topic/getMessage', data)
		.then(function(res) {
			if (!res.error) {
				if (data.limit) {
					dispatch({
						type: TP_COMMENT_DATA_SUCCESS,
						res: res
					})
				}else {
					dispatch({
						type: TP_COMMENT_DATA_ALL,
						res: res
					})
				}
			}
		})
		.catch(function(rej) {
			Toast.fail(rej, 3);
		});
	}
}

//發送留言
export function tpRespondSend(data, callback) {
	return dispatch => {
		Ajax.post(Api.base + '/topic/addMessage', data)
		.then(function(res) {
			if (res.error && res.error.message) {
				Toast.fail(res.error.message, 3);
			}else {
				callback();
			}
		})
		.catch(function(rej) {
			Toast.fail(rej, 3);
		})
	}
}

//點擊顯示/隱藏圖片輪播
export function tpPhotoStatus(status) {
	return {
		type: TP_PHOTO_STATUS,
		payload: status
	}
}