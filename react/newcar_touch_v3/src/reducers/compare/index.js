import Immutable from "immutable";

import {
	VS_EDIT,
	VS_SPEC_DATA,
	VS_RATING_DATA
} from '../../action/compare'

const initialState = Immutable.fromJS({
	vs_edit: ''
});

export default function compare(state = initialState, action = {}) {
	switch (action.type) {
		case VS_EDIT: {
			state = state.set('vs_edit', action.payload);
			break;
		}
		case VS_SPEC_DATA: {
			state = state.set('vs_spec_data', action.payload);
			break;
		}
		case VS_RATING_DATA: {
			state = state.set('vs_rating_data', action.payload);
			break;
		}
		default: {
			return state
		}
	}

	return state;
}