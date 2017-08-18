import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { persistStore, autoRehydrate } from 'redux-persist'
import rootReducer from '../reducers'

//applyMiddleware来自redux可以包装 store 的 dispatch
//thunk作用是使被 dispatch 的 function 会接收 dispatch 作为参数，并且可以异步调用它
const createStoreWithMiddleware = applyMiddleware(
	thunk
)(createStore)

export default function configStore(initialState) {
	let store = createStoreWithMiddleware(
		rootReducer,
		initialState,
		compose(
			applyMiddleware(thunk),
			window.devToolsExtension ? window.devToolsExtension() : f => f
		)
	);
	persistStore(store)
	//热替换选项
	// if (module.hot) {
	// 	// Enable Webpack hot module replacement for reducers
	// 	module.hot.accept('../reducers', () => {
	// 		const nextRootReducer = require('../reducers').default;
	// 		store.replaceReducer(nextRootReducer)
	// 	})
	// }

	return store
}