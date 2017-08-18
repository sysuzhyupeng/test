/*
* 比較頁
*/

export const VS_EDIT = "VS_EDIT";
export const VS_SPEC_DATA = "VS_SPEC_DATA";
export const VS_RATING_DATA = "VS_GET_DATA";



//編輯
export function vsEdit(status) {
	return {
		type: VS_EDIT,
		payload: status
	}
}

//獲取數據
export function vsGetData(key) {
	return dispatch => {
		let data = JSON.parse(localStorage.getItem(key)) || [];
		switch(key) {
			case 'specAttr':
				dispatch({
					type: VS_SPEC_DATA,
					payload: data
				})
				break;
			case 'ratingAttr':
				dispatch({
					type: VS_RATING_DATA,
					payload: data
				})
				break;
		}
	}
}