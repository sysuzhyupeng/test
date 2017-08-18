import Immutable from "immutable";

import {
	ORDER_DATA,
	ORDER_PAGING,
	ORDER_CONTACT_DATA,
	ORDER_CONTACT_NAME,
	ORDER_CONTACT_SEX,
	ORDER_CONTACT_TEL
} from '../../action/order'

const initialState = Immutable.fromJS({
	order_data: '',
	order_data_length: '',
	order_contact_data: '',
	order_paging: '',
	order_contact_name: '',
	order_contact_sex: '',
	order_contact_tel: '',
});

export default function order(state = initialState, action = {}) {
	switch (action.type) {
		case ORDER_DATA: {
			state = state.set('order_data', action.payload);
			state = state.set('order_data_length', action.payload.length);
			break;
		}
		case ORDER_CONTACT_DATA: {
			state = state.set('order_contact_data', action.payload);
			break;
		}
		case ORDER_PAGING: {
			state = state.set('order_paging', action.payload);
			break;
		}
		case ORDER_CONTACT_NAME: {
			state = state.set('order_contact_name', action.payload);
			break;
		}
		case ORDER_CONTACT_SEX: {
			state = state.set('order_contact_sex', action.payload);
			break;
		}
		case ORDER_CONTACT_TEL: {
			state = state.set('order_contact_tel', action.payload);
			break;
		}
		default: {
			return state
		}
	}

	return state;
}