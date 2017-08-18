import Immutable from "immutable";

import {
	TPLIST_DATA,
	TPLIST_PAGING,
	TPLIST_DATA_SEARCH,
	TPLIST_PAGING_SEARCH,
	TPLIST_SEARCH_HOT,
	TPLIST_SEARCH_SELECTED
} from '../../action/topiclist'

const initialState = Immutable.fromJS({
	tplist_data: '',
	tplist_data_length: '',
	tplist_paging: '',
	tplist_data_search: '',
	tplist_data_search_length: '',
	tplist_paging_search: '',
	tplist_search_selected: ''
});

export default function topic_list(state = initialState, action = {}) {
	switch (action.type) {
		case TPLIST_DATA: {
			state = state.set('tplist_data', action.payload);
			state = state.set('tplist_data_length', action.payload.length);
			break;
		}
		case TPLIST_DATA_SEARCH: {
			state = state.set('tplist_data_search', action.payload);
			state = state.set('tplist_data_search_length', action.payload.length);
			break;
		} 
		case TPLIST_PAGING: {
			state = state.set('tplist_paging', action.payload);
			break;
		}
		case TPLIST_PAGING_SEARCH: {
			state = state.set('tplist_paging_search', action.payload);
			break;
		}
		case TPLIST_SEARCH_HOT: {
			state = state.set('tplist_search_hot', action.payload);
			break;
		}
		case TPLIST_SEARCH_SELECTED: {
			state = state.set('tplist_search_selected', action.payload);
			break;
		}
		default: {
			return state
		}
	}

	return state;
}