import Immutable from "immutable";

import {
	TESTCAR_DATA,
	TESTCAR_PAGING,
	TESTCARSEARCH_DATA,
	TESTCARSEARCH_PAGING,
} from '../../action/testcar'

const initialState = Immutable.fromJS({
	testcar_data: '',
	testcar_paging: '',
	testcarsearch_data: '',
	testcarsearch_paging: '',
});

export default function testcar(state = initialState, action = {}) {
	switch (action.type) {
		case TESTCAR_DATA: {
			state = state.set('testcar_data', action.payload);
			break;
		}
		case TESTCAR_PAGING: {
			state = state.set('testcar_paging', action.payload);
			break;
		}
		case TESTCARSEARCH_DATA: {
			state = state.set('testcarsearch_data', action.payload);
			break;
		}
		case TESTCARSEARCH_PAGING: {
			state = state.set('testcarsearch_paging', action.payload);
			break;
		}
		default: {
			return state
		}
	}

	return state;
}