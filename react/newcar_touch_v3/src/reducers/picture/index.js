import Immutable from "immutable";

import {
	PICTURE_DATA,
	PICTURE_PAGING,
} from '../../action/picture'

const initialState = Immutable.fromJS({
	picture_data: '',
	picture_paging: '',
});

export default function picture(state = initialState, action = {}) {
	switch (action.type) {
		case PICTURE_DATA: {
			state = state.set('picture_data', action.payload);
			break;
		}
		case PICTURE_PAGING: {
			state = state.set('picture_paging', action.payload);
			break;
		}
		default: {
			return state
		}
	}

	return state;
}