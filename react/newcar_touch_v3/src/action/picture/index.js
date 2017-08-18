/*
* 圖片列表內容頁
*/
import Ajax from '../../utils/ajax'


//列表數據
export const PICTURE_DATA = "PICTURE_DATA";
export function pictureData(data) {
	return {
		type: PICTURE_DATA,
		payload: data
	}
}

//列表下一頁paging
export const PICTURE_PAGING = "PICTURE_PAGING";
export function picturePaging(data) {
	return {
		type: PICTURE_PAGING,
		payload: data
	}
}

