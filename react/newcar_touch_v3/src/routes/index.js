function indexFn(nextState, replace) { //跳轉到首頁
	location.href = 'https://c.8891.com.tw/m/';
}
function topicFn(nextState, replace) { //舊版深度解析鏈接跳轉到新的
	var search = location.search;
	if (search) {
		replace('/show/topic/' + nextState.params.topicid + search);
	}else {
		replace('/show/topic/' + nextState.params.topicid);
	}
}
function compareFn(nextState, replace) { //舊版比較首頁鏈接跳轉到新的
	replace('/compare/spec/');
}
function vsFn(nextState, replace) { //舊版規格配備比較頁鏈接跳轉到新的
	var search = location.search;
	if (search) {
		replace('/vs/spec/' + nextState.params.kids + search);
	}else {
		replace('/vs/spec/' + nextState.params.kids);
	}
}
export default [
	{
		path: "/",
		getComponents(location, callback) {
			require.ensure([], function (require) {
				callback(null, require('../view/home/index').default)
			})
		}
	},
	{
		path: "/show/",
		onEnter: indexFn
	},
	{
		path: "/topic/search",
		getComponents(location, callback) {
			require.ensure([], function (require) {
				callback(null, require('../view/topiclist/search').default)
			}, 'topic-search')
		}
	},
	{
		path: "/show/topic/:topicid",
		getComponents(location, callback) {
			require.ensure([], function (require) {
				callback(null, require('../view/topic').default)
			}, 'topic-detail')
		}
	},
	{
		path: "/show/topic/:topicid/:k",
		onEnter: topicFn
	},
	{
		path: "/show/articledetails/:type/:id",
		getComponents(location, callback) {
			require.ensure([], function (require) {
				callback(null, require('../view/artdt').default)
			}, 'articledetails')
		}
	},
	{
		path: "/show/articleComment/:type/:id",
		getComponents(location, callback) {
			require.ensure([], function (require) {
				callback(null, require('../view/artdt/all').default)
			}, 'articleComment')
		}
	},
	{
		path: "/topic",
		getComponents(location, callback) {
			require.ensure([], function (require) {
				callback(null, require('../view/topiclist').default)
			}, 'topiclist')
		}
	},
	{
		path: "/order",
		getComponents(location, callback) {
			require.ensure([], function (require) {
				callback(null, require('../view/order').default)
			}, 'order')
		}
	},
	{
		path: "/order/contact",
		getComponents(location, callback) {
			require.ensure([], function (require) {
				callback(null, require('../view/order/contact').default)
			}, 'contact')
		}
	},
	//综述页->综述
	{
		path: "/kindsum/:k",
		getComponents(location, callback) {
			require.ensure([], function (require) {
				callback(null, require('../view/sum/kindsum').default)
			}, 'kindsum')
		}
	},
	//综述页->种类->图片
	{
		path: "/kindpic/:k/:nk",
		getComponents(location, callback) {
			require.ensure([], function (require) {
				callback(null, require('../view/sum/kindpic').default)
			}, 'kindpic')
		}
	},
	//综述页->汽车->图片
	{
		path: "/autopic/:k/:nk",
		getComponents(location, callback) {
			require.ensure([], function (require) {
				callback(null, require('../view/sum/autopic').default)
			}, 'autopic')
		}
	},
	//综述页->年份
	{
		path: "/kindyear/:k",
		getComponents(location, callback) {
			require.ensure([], function (require) {
				callback(null, require('../view/sum/kindyear').default)
			}, 'kindyear')
		}
	},
	//综述页->图片->图片列表组件
	{
		path: "/kindlist",
		getComponents(location, callback) {
			require.ensure([], function (require) {
				callback(null, require('../view/sum/kindlist').default)
			}, 'kindlist')
		}
	},
	//综述页->图片->图片详情
	{
		path: "/kinddetail",
		getComponents(location, callback) {
			require.ensure([], function (require) {
				callback(null, require('../view/sum/kinddetail').default)
			}, 'kinddetail')
		}
	},
	//综述页->图片->图片详情列表
	{
		path: "/kinddetaillist",
		getComponents(location, callback) {
			require.ensure([], function (require) {
				callback(null, require('../view/sum/kinddetaillist').default)
			}, 'kinddetaillist')
		}
	},
	//综述页->咨詢
	{
		path: "/kindarticle/:k",
		getComponents(location, callback) {
			require.ensure([], function (require) {
				callback(null, require('../view/sum/kindarticle').default)
			}, 'kindarticle')
		}
	},
	//综述页->咨詢
	{
		path: "/testcarsearch",
		getComponents(location, callback) {
			require.ensure([], function (require) {
				callback(null, require('../view/testcar/search').default)
			}, 'testcarsearch')
		}
	},
	{
		path: "/compare",
		onEnter: compareFn
	},
	{
		path: "/compare/spec",
		getComponents(location, callback) {
			require.ensure([], function (require) {
				callback(null, require('../view/compare/spec').default)
			}, 'spec')
		}
	},
	{
		path: "/compare/rating",
		getComponents(location, callback) {
			require.ensure([], function (require) {
				callback(null, require('../view/compare/rating').default)
			}, 'rating')
		}
	},
	{
		path: "/vs/:kids",
		onEnter: vsFn
	},
	{
		path: "/vs/spec/:kids",
		getComponents(location, callback) {
			require.ensure([], function (require) {
				callback(null, require('../view/compare/specDetails').default)
			}, 'specDetails')
		}
	},
	{
		path: "/vs/rating/:kids",
		getComponents(location, callback) {
			require.ensure([], function (require) {
				callback(null, require('../view/compare/ratingDetails').default)
			}, 'ratingDetails')
		}
	},
	{
		path: "/vs/rating/:kids/:cid",
		getComponents(location, callback) {
			require.ensure([], function (require) {
				callback(null, require('../view/compare/ratingDetailsSingle').default)
			}, 'ratingDetailsSingle')
		}
	},
	{
		path: "/active/carshow",
		getComponents(location, callback) {
			require.ensure([], function (require) {
				callback(null, require('../view/active/carshow').default)
			}, 'carshow')
		}
	},
	//文章页路由
	{
		path: "/article/:nav",
		getComponents(location, callback) {
			require.ensure([], function (require) {
				callback(null, require('../view/article/index').default)
			}, 'article')
		}
	},
	//汽车图库
	{
		path: "/picture",
		getComponents(location, callback) {
			require.ensure([], function (require) {
				callback(null, require('../view/picture/index').default)
			}, 'picture')
		}
	},
	//汽车图库-搜索厂牌
	{
		path: "/picture/more",
		getComponents(location, callback) {
			require.ensure([], function (require) {
				callback(null, require('../view/picture/more').default)
			}, 'picture')
		}
	},
	//主頁->試駕
	{
		path: "/testcar/:t",
		getComponents(location, callback) {
			require.ensure([], function (require) {
				callback(null, require('../view/testcar/index').default)
			}, 'testcar')
		}
	},
	{
		path: "/brand",
		getComponents(location, callback) {
			require.ensure([], function (require) {
				callback(null, require('../view/filter/brand').default)
			}, 'brand')
		}
	},
	{
		path: "/kind/:b",
		getComponents(location, callback) {
			require.ensure([], function (require) {
				callback(null, require('../view/filter/kind').default)
			}, 'kind')
		}
	},
	{
		path: "/filter(:condition)",
		getComponents(location, callback) {
			require.ensure([], function (require) {
				callback(null, require('../view/filter').default)
			}, 'filter')
		}
	},
	{
		path: "/filter/autos(/:condition)",
		getComponents(location, callback) {
			require.ensure([], function (require) {
				callback(null, require('../view/filter/autos').default)
			}, 'filterAutos')
		}
	},
    {
        //配置404的情况
        path: "*",
        getComponent: (nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../view/404/index').default);
            }, "notFound");
        }
    }
];