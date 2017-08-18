/*
* 文章列表頁
*/
import Ajax from '../../utils/ajax'


//列表數據
export const ARTICLE_DATA = "ARTICLE_DATA";
export function articleData(data) {
	return {
		type: ARTICLE_DATA,
		payload: data
	}
}

//列表下一頁paging
export const ARTICLE_PAGING = "ARTICLE_PAGING";
export function articlePaging(data) {
	return {
		type: ARTICLE_PAGING,
		payload: data
	}
}

