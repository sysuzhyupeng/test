/*
* 綜述頁
*/

export const SUM_KS_YEAR = "SUM_KS_YEAR";
export const SUM_KS_PK = "SUM_KS_PK";
export const SUM_KIND_INDEX = "SUM_KIND_INDEX";
export const SUM_KIND_I = "SUM_KIND_I";
export const SUM_KIND_M = "SUM_KIND_M";



//導航數據
export function sumKsYear(num) {
	return {
		type: SUM_KS_YEAR,
		payload: num
	}
}

//比較個數是否大於0
export function sumKsPk(status) {
	return {
		type: SUM_KS_PK,
		payload: status
	}
}

//比較個數是否大於0
export function sumKindIndex(status) {
	return {
		type: SUM_KIND_INDEX,
		payload: status
	}
}

//比較個數是否大於0
export function sumKindI(status) {

	return {
		type: SUM_KIND_I,
		payload: status
	}
}

//比較個數是否大於0
export function sumKindM(status) {
	return {
		type: SUM_KIND_M,
		payload: status
	}
}

