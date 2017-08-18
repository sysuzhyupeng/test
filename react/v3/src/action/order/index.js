/*
* 預約試駕
*/
import Ajax from '../../utils/ajax'

//列表頁數據
export const ORDER_DATA = "ORDER_DATA";
export function orderData(data) {
	return {
		type: ORDER_DATA,
		payload: data
	}
}

//列表頁數據分頁
export const ORDER_PAGING = "ORDER_PAGING";
export function orderPaging(data) {
	return {
		type: ORDER_PAGING,
		payload: data
	}
}

//列表頁數據
export const ORDER_CONTACT_DATA = "ORDER_CONTACT_DATA";
export function orderContactData(data) {
	return {
		type: ORDER_CONTACT_DATA,
		payload: data
	}
}


//業務聯繫我選擇名字
export const ORDER_CONTACT_NAME = "ORDER_CONTACT_NAME";
export function orderContactName(data) {
	return {
		type: ORDER_CONTACT_NAME,
		payload: data
	}
}
//業務聯繫我選擇性別
export const ORDER_CONTACT_SEX = "ORDER_CONTACT_SEX";
export function orderContactSex(data) {
	return {
		type: ORDER_CONTACT_SEX,
		payload: data
	}
}
//業務聯繫我選擇電話
export const ORDER_CONTACT_TEL = "ORDER_CONTACT_TEL";
export function orderContactTel(data) {
	return {
		type: ORDER_CONTACT_TEL,
		payload: data
	}
}