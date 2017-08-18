import Immutable from "immutable";

import {
	TP_NAV_DATA,
	TP_NAV_FIXED,
	TP_NAV_AT,
	TP_NEXT_STATUS,
	TP_COMMENT_ALL,
	TP_RESPOND,
	TP_COMMENT_DATA_SUCCESS,
	TP_COMMENT_DATA_ALL,
	TP_RESPOND_SEND_SUCCESS,
	TP_PHOTO_STATUS
} from '../../action/topic'

const initialState = Immutable.fromJS({
	tp_nav_at: '',
	tp_next_status: '',
	tp_respond: '',
	tp_comment_data_success: '',
	tp_comment_data_all: ''
});

export default function topic(state = initialState, action = {}) {
	switch (action.type) {
		case TP_NAV_DATA: {
			state = state.set('tp_nav_data', action.payload);
			break;
		}
		case TP_NAV_FIXED: {
			state = state.set('tp_nav_fixed', action.payload);
			break;
		}
		case TP_NAV_AT: {
			state = state.set('tp_nav_at', action.payload);
			break;
		}
		case TP_NEXT_STATUS: {
			state = state.set('tp_next_status', action.payload);
			break;
		}
		case TP_COMMENT_ALL: {
			state = state.set('tp_comment_all', action.payload);
			break;
		}
		case TP_RESPOND: {
			state = state.set('tp_respond', action.payload);
			break;
		}
		case TP_COMMENT_DATA_SUCCESS: {
			state = state.set('tp_comment_data_success', action.res);
			break;
		}
		case TP_COMMENT_DATA_ALL: {
			state = state.set('tp_comment_data_all', action.res);
			break;
		}
		case TP_PHOTO_STATUS: {
			state = state.set('tp_photo_status', action.payload);
			break;
		}
		default: {
			return state
		}
	}

	return state;
}