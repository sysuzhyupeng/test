import {combineReducers} from 'redux'
import {routerReducer} from 'react-router-redux'

import order from './order'
import topic from './topic'
import article from './article'
import topic_list from './topiclist'
import sum from './sum'
import picture from './picture'
import component from './component'
import compare from './compare'
import testcar from './testcar'

//把所有reducer合併到一個
const rootReducer = combineReducers({
	topic,
	topic_list,
	sum,
	picture,
	component,
	order,
	compare,
	testcar,
	article,
	routing: routerReducer //整合路由
})

export default rootReducer