import Immutable from "immutable";

import {
	SUM_KS_YEAR,
	SUM_KS_PK,
	SUM_KIND_INDEX,
	SUM_KIND_I,
	SUM_KIND_M
} from '../../action/sum'

const initialState = Immutable.fromJS({
	sum_ks_year: '',
	sum_ks_pk: '',
	sum_kind_index: '',
	sum_kind_i: '',
	sum_kind_m: ''
});

export default function sum(state = initialState, action = {}) {
	switch (action.type) {
		case SUM_KS_YEAR: {
			state = state.set('sum_ks_year', action.payload);
			break;
		}
		case SUM_KS_PK: {
			state = state.set('sum_ks_pk', action.payload);
			break;
		}
		case SUM_KIND_INDEX: {
			state = state.set('sum_kind_index', action.payload);
			break;
		}
		case SUM_KIND_I: {
			state = state.set('sum_kind_i', action.payload);
			break;
		}
		case SUM_KIND_M: {
			state = state.set('sum_kind_m', action.payload);
			break;
		}
		default: {
			return state
		}
	}
	return state;
}