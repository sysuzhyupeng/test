/*
* 文章列表頁
*/
import Ajax from '../../utils/ajax'


//列表數據
export const TESTCAR_DATA = "TESTCAR_DATA";
export function testcarData(data) {
	return {
		type: TESTCAR_DATA,
		payload: data
	}
}

//列表下一頁paging
export const TESTCAR_PAGING = "TESTCAR_PAGING";
export function testcarPaging(data) {
	return {
		type: TESTCAR_PAGING,
		payload: data
	}
}


//列表數據
export const TESTCARSEARCH_DATA = "TESTCARSEARCH_DATA";
export function testcarsearchData(data) {
	return {
		type: TESTCARSEARCH_DATA,
		payload: data
	}
}

//列表下一頁paging
export const TESTCARSEARCH_PAGING = "TESTCARSEARCH_PAGING";
export function testcarsearchPaging(data) {
	return {
		type: TESTCARSEARCH_PAGING,
		payload: data
	}
}

