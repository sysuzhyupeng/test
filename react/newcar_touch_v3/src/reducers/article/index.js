import Immutable from "immutable";

import {
	ARTICLE_DATA,
	ARTICLE_PAGING,
} from '../../action/article'

const initialState = Immutable.fromJS({
	article_data: '',
	article_paging: '',
	article_data_length:''
});

export default function article(state = initialState, action = {}) {
	switch (action.type) {
		case ARTICLE_DATA: {
			state = state.set('article_data', action.payload);
			state = state.set('article_data_length', action.payload.length);
			break;
		}
		case ARTICLE_PAGING: {
			state = state.set('article_paging', action.payload);
			break;
		}
		default: {
			return state
		}
	}

	return state;
}