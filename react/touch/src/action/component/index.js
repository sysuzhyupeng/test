/*
* 公共组件
*/


/*
* 分享页面
* 调用方法：this.props.actions.cpShareStatus(true)
* 参数true：打开，参数false：关闭
*/
export const CP_SHARE_STATUS = "CP_SHARE_STATUS";
export function cpShareStatus(status) {
	return {
		type: CP_SHARE_STATUS,
		payload: status
	}
}


/*
* 頭部：打開/關閉下拉導航
* 调用方法：this.props.actions.cpHeaderNav(true)
* 参数true：打开，参数false：关闭
*/
export const CP_HEADER_NAV = "CP_HEADER_NAV";
export function cpHeaderNav(status) {
	return {
		type: CP_HEADER_NAV,
		payload: status
	}
}


/*
* 頭部：判斷是否登錄
* 调用方法：this.props.actions.cpHeaderLogin(true)
* 参数true：已登錄，参数false：未登錄
*/
export const CP_HEADER_LOGIN = "CP_HEADER_LOGIN";
export function cpHeaderLogin(status) {
	return {
		type: CP_HEADER_LOGIN,
		payload: status
	}
}


/*
* 
* 调用方法：this.props.actions.filterBrandData(data)
* 
*/
export const FILTER_BRAND_DATA = "FILTER_BRAND_DATA";
export function filterBrandData(data) {
	return {
		type: FILTER_BRAND_DATA,
		payload: data
	}
}


/*
* 打開/關閉城市列表
* 调用方法：this.props.actions.cpCityOpen(true)
* 参数true：打开，参数false：关闭
*/
export const CP_CITY_OPEN = "CP_CITY_OPEN";
export function cpCityOpen(status) {
	return {
		type: CP_CITY_OPEN,
		payload: status
	}
}

/*
* 打開/關閉廠牌列表
* 调用方法：this.props.actions.cpBrandOpen(true)
* 参数true：打开，参数false：关闭
*/
export const CP_BRAND_OPEN = "CP_BRAND_OPEN";
export function cpBrandOpen(status) {
	return {
		type: CP_BRAND_OPEN,
		payload: status
	}
}


/*
* 打開/關閉車款列表
* 调用方法：this.props.actions.cpKindOpen(true)
* 参数true：打开，参数false：关闭
*/
export const CP_KIND_OPEN = "CP_KIND_OPEN";
export function cpKindOpen(status) {
	return {
		type: CP_KIND_OPEN,
		payload: status
	}
}


/*
* 打開/關閉車型列表
* 调用方法：this.props.actions.cpModelOpen(true)
* 参数true：打开，参数false：关闭
*/
export const CP_MODEL_OPEN = "CP_MODEL_OPEN";
export function cpModelOpen(status) {
	return {
		type: CP_MODEL_OPEN,
		payload: status
	}
}


/*
* 文章列表限制條數
* 调用方法：this.props.actions.cpArticleLimit(5)
* 参数true：打开，参数false：关闭
*/
export const CP_ARTICLE_LIMIT = "CP_ARTICLE_LIMIT";
export function cpArticleLimit(number) {
	return {
		type: CP_ARTICLE_LIMIT,
		payload: number
	}
}