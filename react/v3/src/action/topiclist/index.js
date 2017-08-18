/*
* 深度解析列表頁
*/
import Ajax from '../../utils/ajax'
import Toast from 'antd-mobile/lib/toast'


//列表數據
export const TPLIST_DATA = "TPLIST_DATA";
export function tpListData(data) {
	return {
		type: TPLIST_DATA,
		payload: data
	}
}

//列表下一頁paging
export const TPLIST_PAGING = "TPLIST_PAGING";
export function tpListPaging(data) {
	return {
		type: TPLIST_PAGING,
		payload: data
	}
}

//搜索數據
export const TPLIST_DATA_SEARCH = "TPLIST_DATA_SEARCH";
export function tpListDataSearch(data) {
	return {
		type: TPLIST_DATA_SEARCH,
		payload: data
	}
}

//搜索下一頁paging
export const TPLIST_PAGING_SEARCH = "TPLIST_PAGING_SEARCH";
export function tpListPagingSearch(data) {
	return {
		type: TPLIST_PAGING_SEARCH,
		payload: data
	}
}

//更新熱門搜索數據
export const TPLIST_SEARCH_HOT = "TPLIST_SEARCH_HOT";
export function tpListSearchHot(data) {
	return {
		type: TPLIST_SEARCH_HOT,
		payload: data
	}
}


//搜索頁選擇輸入數據
export const TPLIST_SEARCH_SELECTED = "TPLIST_SEARCH_SELECTED";
export function tpListSearchSelected(name) {
	return {
		type: TPLIST_SEARCH_SELECTED,
		payload: name
	}
}

