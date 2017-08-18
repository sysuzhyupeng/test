import {
	CP_SHARE_STATUS,
	CP_HEADER_NAV,
	CP_HEADER_LOGIN,
	CP_CITY_OPEN,
	CP_BRAND_OPEN,
	CP_KIND_OPEN,
	CP_MODEL_OPEN,
	CP_ARTICLE_LIMIT
} from '../../action/component'


import Immutable from "immutable";

const initialState = Immutable.fromJS({
	cp_share_status: '',
	filter_brand_data: '',
	cp_city_open: false,
	cp_brand_open: false,
	cp_kind_open: false,
	cp_model_open: false
});

export default function component(state = initialState, action = {}) {
	switch (action.type) {
		case CP_SHARE_STATUS: {
			state = state.set('cp_share_status', action.payload);
			break;
		}
		case CP_HEADER_NAV: {
			state = state.set('cp_header_nav', action.payload);
			break;
		}
		case CP_HEADER_LOGIN: {
			state = state.set('cp_header_login', action.payload);
			break;
		}
		case CP_CITY_OPEN: {
			state = state.set('cp_city_open', action.payload);
			break;
		}
		case CP_BRAND_OPEN: {
			state = state.set('cp_brand_open', action.payload);
			break;
		}
		case CP_KIND_OPEN: {
			state = state.set('cp_kind_open', action.payload);
			break;
		}
		case CP_MODEL_OPEN: {
			state = state.set('cp_model_open', action.payload);
			break;
		}
		case CP_ARTICLE_LIMIT: {
			state = state.set('cp_article_limit', action.payload);
			break;
		}
		default: {
			return state
		}
	}
	return state;
}