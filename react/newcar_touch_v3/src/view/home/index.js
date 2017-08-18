import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import Toast from 'antd-mobile/lib/toast'
import Carousel from 'antd-mobile/lib/carousel'
import Ajax from '../../utils/ajax'
import '../../resource/css/home.less'
import HotBrand from '../component/hotBrand'
import FootNav from '../component/footNav'
import HotModel from '../component/hotModel'
import ArticleItem from '../component/articleItem'
import SaleItem from '../component/saleItem'
import Lazy from '../component/lazy'
import loadingImg from '../../resource/img/loading.png'
import { getTouchOs } from '../../utils'
import BackTop from '../component/backtop'
import DowloadFoot from '../component/dowloadFoot'
import GoogleAd from '../../utils/googleAd'
import COMMON from '../component/common'

class home extends Component {
	constructor() {
		super()
		this.state = {
			brandData: [],
			modelData: [],
			topicData: [],
			articleData: [],
			articleFlashData: [],
			tabAt: 0,
			articleTabAt: 0,
			saleData: [],
			saleTabAt: 0,
			listedData: [],
			guessData: [],
			movieData: [],
			pictureData: [],
			appData: [],
			adData: [],
			showAppDownload: true
		};
		this.articleNav = [ //文章列表
			{
				type: 'newest',
				name: '最新資訊',
				t: 0
			},
			{
				type: 'try',
				name: '試車文章',
				t: 1
			},
			{
				type: 'hot',
				name: '熱門新聞',
				t: 4
			}
		];
		this.saleNav = [ //銷售排行列表
			{
				name: 'SUV',
				t: 8
			},
			{
				name: '轎車',
				t: 1
			}
		];
		this.handMessage = this.handMessage.bind(this);
	}
	componentWillMount() {
		let self = this;


		self.clearStorage(); //清除其它頁面留下的數據
		self.getInfoBrand(); //請求熱門廠牌
		self.getInfoCar(); //請求熱門車
		window.addEventListener("message", self.handMessage, false);
	}
	componentWillUnmount() {
		Toast.hide();
		window.removeEventListener("message", this.handMessage);
	}
	handMessage(e) {
		let self = this,
			 key = e.message ? "message" : "data",
            data = e[key],
            adData = self.state.adData || [],
            eventName = data.message || 'ignore';

        if (eventName == 'google_ad_ready') {
        	adData.push(data);
            self.setState({
            	adData: adData
            });
        }
	}

	clearStorage() { //清除其它頁面留下的數據
		let self = this,
			data = ['App.Data.newauto', 'App.Filter.newauto', 'App.Data.filterName', 'App.Data.oxadData', 'App.Filter.kw', 'App.Filter.searchAutos', 'App.Filter.searchMovie', 'App.Data.kw'];

		for (var i = 0; i < data.length; i++) {
			localStorage.removeItem(data[i]);
		}
	}

	// 搜索
	keyPress(e) {
		let self = this;

		if (e.charCode == 13) {
			self.search();
		}
	}
	search() {
		let self = this,
			input = self.refs['hp-search-input'],
			val = input.value.replace(/\s+/g,"");

		if (val) {
			let data = {
				kw: val
			}
			localStorage.setItem('App.Data.kw', JSON.stringify(data));
			location.href = Api.index + 'search';
		}else {
			if (self.state.topicData != '') {
				browserHistory.push('/m/show/topic/' + self.state.topicData[0].id);
			}
		}
		return false;

	}

	//熱門
	getInfoBrand() { //請求熱門廠牌數據
		let self = this;

		Ajax.get(Api.old + '/brand/hot').then(function(res) {
			self.setState({
				brandData: res.data
			});
		});
	}
	getInfoCar() { //請求熱門車數據
		let self = this;

		if (self.state.modelData == '') {
			Ajax.get(Api.old + '/model/hot').then(function(res) {
				self.setState({
					modelData: res.data
				});
			});
		}
	}
	tab(i) { //熱門廠牌/按價格/熱門車切換
		let self = this;

		self.setState({
			tabAt: i
		});
	}
	price(min, max) { //點擊按價格
		let self = this,
			data = {
				min_price: min,
				max_price: max
			};

		localStorage.setItem('App.Filter.newauto', JSON.stringify(data));
		location.href = Api.index + 'filterAutos';
	}
	tabAfterChange(index) {
		let self = this;

		self.setState({
			tabAt: index
		});
	}

	//請求深度解析數據
	getInfoTopic() {
		let self = this;

		if (self.state.topicData == '') {
			Ajax.get(Api.old + '/topic/index', {
				limit: 3
			}).then(function(res) {
				self.setState({
					topicData: res.data
				});
			});
		}
	}

	//文章
	getArticle() {
		var self = this,
			articleNav = self.articleNav;

		for (var i = 0; i < articleNav.length; i++) {
			self.getInfoArticle(articleNav[i].t);
		}
	}
	getInfoArticle(t) { //請求文章數據
		let self = this,
			data = self.state.articleData;

		Ajax.get(Api.base + '/article/', {
			t: t
		}).then(function(res) {
			data.push(res.data);
			self.setState({
				articleData: data
			});
			if (self.state.articleFlashData == '') {
				self.setState({
					articleFlashData: res.data
				})
			}
			Toast.hide();
		}).catch(function() {
			Toast.hide();
		})
	}
	articleTab(i) { //點擊文章切換
		let self = this;

		self.setState({
			articleTabAt: i
		});
	}
	articleAfterChange(index) {
		let self = this;

		self.setState({
			articleTabAt: index
		});
	}

	//銷售排行
	getSale() { //請求銷售排行數據
		let self = this,
			saleNav = self.saleNav;

		for (var i = 0; i < saleNav.length; i++) {
			self.getInfoSale(saleNav[i].t);
		}
	}
	getInfoSale(t) { //請求銷售排行數據
		let self = this,
			data = self.state.saleData;

		Ajax.get(Api.base + '/board/', {
			t: t
		}).then(function(res) {
			data.push(res.data);
			self.setState({
				saleData: data
			});
		})
	}
	saleTab(index) { //點擊銷售排行切換
		let self = this;

		self.setState({
			saleTabAt: index
		});
	}
	saleAfterChange(index) {
		let self = this;

		self.setState({
			saleTabAt: index
		});
	}

	//新車上市
	getListedData() {
		let self = this;

		Ajax.get(Api.base + '/market/list').then(function(res) {
			self.setState({
				listedData: res
			});
		})
	}

	//猜你喜歡
	getGuessData() {
		let self = this;

		Ajax.get(Api.base + '/guess').then(function(res) {
			self.setState({
				guessData: res.data
			});
		})
	}

	//汽車影音
	getMovieData() {
		let self = this;

		Ajax.get(Api.base + '/movie/hot').then(function(res) {
			self.setState({
				movieData: res.data
			});
		})
	}

	//汽車圖庫
	getPictureData() {
		let self = this;

		Ajax.get(Api.base + '/picture/index', {limit: 6}).then(function(res) {
			self.setState({
				pictureData: res.data
			});
		})
	}

	//推薦APP
	getAppData() {
		let self = this;

		Ajax.get(Api.old + '/app/').then(function(res) {
			self.setState({
				appData: res.apps
			});
		})
	}

	//導航點擊統計
	navGa(name) {
		ReactGA.ga('send', 'event', '觸屏版首頁', '導航點擊', name);
	}

	render() {
		let 			self = this,
				   brandData = self.state.brandData,		//熱門廠牌數據
				   modelData = self.state.modelData,		//熱門車數據
					   tabAt = self.state.tabAt,			//當前索引

				   topicData = self.state.topicData,		//深度解析數據

				 articleData = self.state.articleData,		//文章數據
			articleFlashData = self.state.articleFlashData, //新車快訊數據
				  articleNav = self.articleNav,				//文章列表
				articleTabAt = self.state.articleTabAt,		//當前文章列表索引

					saleData = self.state.saleData,			//銷售排行數據
					 saleNav = self.saleNav,				//銷售排行列表
				   saleTabAt = self.state.saleTabAt,		//當前銷售排行索引

				  listedData = self.state.listedData,		//新車上市數據

				   guessData = self.state.guessData,		//猜你喜歡數據

				   movieData = self.state.movieData,		//汽車影音數據

				 pictureData = self.state.pictureData,		//汽車圖片數據

					 appData = self.state.appData,			//推薦App數據

			   browserSystem = getTouchOs(),				//判斷是安卓/IOS

			   		  adData = self.state.adData,			//廣告數據
			   	adDataResult = [];

			   	//將廣告拆分成兩個版位，每個版位兩個廣告
				for(var i = 0, len = adData.length; i<len; i += 2){
					adDataResult.push(adData.slice(i, i+2));
				}

		return (
			<div>

				<div className="hp-hd clearfix">
					<span className="hp-hd-logo"></span>
					<a href={Api.index + "at/member/index"} className="hp-hd-icon"></a>
					<a href={browserSystem == 'ios' ? 'https://itunes.apple.com/app/id958450485' : 'market://details?id=com.addcn.newcar8891'} className="hp-hd-down" target="_blank">app下載</a>
				</div>

				<DowloadFoot />

				<nav className="hp-nav clearfix" >
					<Link to="/brand" className="hp-nav-item" onClick={() => self.navGa('找車')}>找車</Link>
					<Link to="/testcar/0" className="hp-nav-item" onClick={() => self.navGa('試駕')}>試駕</Link>
					<Link to="/topic" className="hp-nav-item" onClick={() => self.navGa('深度解析')}>深度解析</Link>
					<a href={Api.index + "comment"} className="hp-nav-item" onClick={() => self.navGa('評價')}>評價</a>
					<Link to="/article/hot" className="hp-nav-item" onClick={() => self.navGa('新聞')}>新聞</Link>
					<a href={Api.index + "search/movie"} className="hp-nav-item" onClick={() => self.navGa('影音')}>影音</a>
					<Link to="/order" className="hp-nav-item" onClick={() => self.navGa('預約試駕')}>預約試駕</Link>
					<Link to="/compare/spec" className="hp-nav-item" onClick={() => self.navGa('比較')}>比較</Link>
				</nav>


				<div className="hp-search">
					<input ref="hp-search-input" type="text" placeholder={self.state.topicData != '' ? self.state.topicData[0].title : ''} onKeyPress={(e) => self.keyPress(e)} />
					<span onClick={() => self.search()}>
						<i></i>
					</span>
				</div>


				<div className="hp-tab">
					<ul className="hp-tab-nav clearfix">
						<li className={tabAt == 0 ? "at" : ''} onClick={() => self.tab(0)}>熱門廠牌</li>
						<li className={tabAt == 1 ? "at" : ''}  onClick={() => self.tab(1)}>按價格</li>
						<li className={tabAt == 2 ? "at" : ''}  onClick={() => self.tab(2)}>熱門車</li>
					</ul>
					<div className="hp-tab-main">
						<Carousel
							selectedIndex={tabAt}
							dots={false}
							afterChange={index => self.tabAfterChange(index)}
						>
							<HotBrand data={brandData} more="true" />
							<dl className="hp-tab-price">
								<div className="hp-tab-price-list clearfix">
									<a className="hp-tab-price-item" href="javascript:;" onClick={() => self.price(0, 80)}>80萬以下</a>
									<a className="hp-tab-price-item" href="javascript:;" onClick={() => self.price(80, 100)}>80-100萬</a>
									<a className="hp-tab-price-item" href="javascript:;" onClick={() => self.price(100, 120)}>100-120萬</a>
									<a className="hp-tab-price-item" href="javascript:;" onClick={() => self.price(120, 160)}>120-160萬</a>
									<a className="hp-tab-price-item" href="javascript:;" onClick={() => self.price(160, 200)}>160-200萬</a>
									<a className="hp-tab-price-item" href="javascript:;" onClick={() => self.price(200, 10000)}>200萬以上</a>
								</div>
								<a href={Api.index + "filter"} className="hp-tab-price-more">更多条件</a>
							</dl>
							<HotModel data={modelData} more="true" />
						</Carousel>
					</div>
				</div>


				<Lazy lazyCallBack={() => self.getInfoTopic()}>
					<Title name="深度解析" new="/topic" />
					{ topicData.length != 0 ? <ul className="hp-topic clearfix">
						{topicData.map((v, i) => {
							return <li key={"topic" + i} className="hp-topic-item">
								<Link to={"/show/topic/" + v.id} className="hp-topic-link">
									<img src={ COMMON.fnSetPicSize(v.pc_cover,490,325) } />
									<p>{v.title}</p>
								</Link>
							</li>
						})}
					</ul> : <div className="loadingImg">
						<img src={loadingImg} />
					</div> }
				</Lazy>


				<Lazy lazyCallBack={() => self.getArticle()}>
					<ul className="hp-art-tab clearfix">
						{ articleNav.map((v, i) => {
							return <li key={"articleTab" + i} onClick={() => self.articleTab(i)} className={articleTabAt == i ? "at" : ""}>{v.name}</li>
						})}
					</ul>
					<dl className="hp-art-flash clearfix">
						<dt>新車快訊</dt>
						<dd className="hp-art-swipe">
							<Carousel dots={false} autoplay infinite vertical>
								{articleFlashData.map((v, i) => {
									return <a key={"flash" + i} href={Api.index + 'article/newest'} className="hp-art-swipe-item">{v.title}</a>
								})}
							</Carousel>
						</dd>
					</dl>
					<div className="hp-art-main">
						{ articleData != '' ?
							<Carousel
								selectedIndex={articleTabAt}
								dots={false}
								afterChange={index => self.articleAfterChange(index)}
							>
								{articleData.map((v, i) => {
									return <ArticleItem key={"articleItem" + i} data={v} limit="5" />
								})}
							</Carousel>
						:
							<div className="loadingImg">
								<img src={loadingImg} />
							</div>
						}
					</div>
					<a href={Api.index + 'article/' + articleNav[articleTabAt].type} className="hp-art-more">{"更多" + articleNav[articleTabAt].name}</a>
				</Lazy>


				{ adDataResult[0] && adDataResult[0] != '' ? <div className="mt20">
					<Carousel
						autoplay
						infinite
					>
						{adDataResult[0].map((v, i) => {
							return <a key={'ad' + i} href={v.link} style={{display: 'block', width: '7.5rem', height: '3.1rem'}}>
								<img src={v.img} style={{width: '100%'}} />
							</a>
						})}
					</Carousel>
				</div> : null}


				<Lazy lazyCallBack={() => self.getSale()}>
					<Title name="銷售排行" />
					<ul className="hp-sale-tab clearfix">
						{ saleNav.map((v, i) => {
							return <li key={"saleTab" + i} onClick={() => self.saleTab(i)} className={saleTabAt == i ? "at" : ""}>{v.name + "排行"}</li>
						})}
					</ul>
					<div className="hp-sale-main">
						{ saleData != '' ? <Carousel
							selectedIndex={saleTabAt}
							dots={false}
							afterChange={index => self.saleAfterChange(index)}
						>
							{ saleData.map((v, i) => {
								return <SaleItem key={'saleItem' + i} data={v} limit="5" />
							})}
						</Carousel> : <div className="loadingImg">
							<img src={loadingImg} />
						</div> }
					</div>
				</Lazy>


				<Lazy lazyCallBack={() => self.getListedData()}>
					<Title name="新車上市" />
					<div className="hp-listed">
						{ listedData != '' ? listedData.listed.map((v, i) => {
							return <Link key={"listed" + i} to={"/kindsum/" + v.kind_id} className="hp-listed-item clearfixs">
								<img src={ COMMON.fnSetPicSize(v.thumb,240,160) } className="hp-listed-pic" />
								<div className="hp-listed-title">{v.full_name}</div>
								<div className="hp-listed-price">{v.price}</div>
								<div className="hp-listed-time">{v.date + "上市"}</div>
							</Link>
						}) : <div className="loadingImg">
							<img src={loadingImg} />
						</div> }
					</div>
					<div className="hp-unListed">
						<div className="hp-unListed-inner">
							{ listedData != '' ? listedData.unListed.map((v, i) => {
								return <Link key={"unListed" + i} to={"kindsum" + v.kind_id} className="hp-unListed-item clearfix">
									<i className="hp-unListed-circle"></i>
									<span className="hp-unListed-date">{v.date}</span>
									<p className="hp-unListed-title">{v.full_name}</p>
								</Link>
							}) : null }
						</div>
					</div>
				</Lazy>


				{ adDataResult[1] && adDataResult[1] != '' ? <div className="mt20">
					<Carousel
						autoplay
						infinite
					>
						{adDataResult[1].map((v, i) => {
							return <a key={'ad' + i} href={v.link} style={{display: 'block', width: '7.5rem', height: '3.1rem'}}>
								<img src={v.img} style={{width: '100%'}} />
							</a>
						})}
					</Carousel>
				</div> : null}


				<Lazy lazyCallBack={() => self.getGuessData()}>
					<Title name="猜你喜歡" />
					<div className="hp-guess clearfix">
						{ guessData != '' ? guessData.map((v, i) => {
							return <Link key={"guess" + i} to={"/kindsum/" + v.kind_id} className="hp-guess-item">
								<img src={ COMMON.fnSetPicSize(v.thumb,225,150) } className="hp-guess-img" />
								<div className="hp-guess-title">{v.full_name}</div>
								<div className="hp-guess-price">{v.price}</div>
							</Link>
						}) : <div className="loadingImg">
							<img src={loadingImg} />
						</div> }
					</div>
				</Lazy>


				<Lazy lazyCallBack={() => self.getMovieData()}>
					<Title name="汽車影音" more={Api.index + "search/movie"} />
					<div className="hp-movie clearfix">
						{ movieData != '' ? movieData.map((v, i) => {
							return <a key={"movie" + i} href={Api.index + "at/master/index/article:article/t:3/id:" + v.id} className="hp-movie-item">
								<div className="hp-movie-pic">
									<img src={ v.img_url } className="hp-movie-img" />
									<i className="hp-movie-icon"></i>
								</div>
								<div className="hp-movie-title">{v.title}</div>
							</a>
						}) : <div className="loadingImg">
							<img src={loadingImg} />
						</div> }
					</div>
				</Lazy>


				<Lazy lazyCallBack={() => self.getPictureData()}>
					<Title name="汽車圖庫" />
					<div className="hp-pciture clearfix">
						{ pictureData != '' ? pictureData.map((v, i) => (
							<Link key={"pciture" + i} to={ "kindpic/" + v.kind_id + "/" + v.new_kind_id} className="hp-pciture-item">
								<img src={ COMMON.fnSetPicSize(v.thumb,i==0?470:230,i==0?310:150) } className="hp-pciture-img" />
							</Link>
						)) : <div className="loadingImg">
							<img src={loadingImg} />
						</div> }
					</div>
				</Lazy>


				<Lazy lazyCallBack={() => self.getAppData()}>
					<Title name="推薦APP" />
					<div className="hp-app clearfix">
						{ appData != '' ? appData.map((v, i) => {
							return <a key={"app" + i} href={browserSystem == 'ios' ? v.app_appleUrl : v.app_androidUrl} target="_blank" className="hp-app-item">
								<img src={v.app_icon} className="hp-app-img" />
							</a>
						}) : <div className="loadingImg">
							<img src={loadingImg} />
						</div> }
					</div>
				</Lazy>


				<FootNav />


				<BackTop />


				<GoogleAd gad="div-gpt-ad-1494228065303-0" gadTag="/173427088/觸屏版首頁輪播廣告001" width={680} height={280} />
				<GoogleAd gad="div-gpt-ad-1494228065303-1" gadTag="/173427088/觸屏版首頁輪播廣告002" width={680} height={280} />
				<GoogleAd gad="div-gpt-ad-1494228065303-2" gadTag="/173427088/觸屏版首頁輪播廣告003" width={680} height={280} />
				<GoogleAd gad="div-gpt-ad-1494228065303-3" gadTag="/173427088/觸屏版首頁輪播廣告004" width={680} height={280} />


			</div>
		)
	}
}

//本頁面公用標題
class Title extends Component {
	render() {
		return (
			<div className="hp-title clearfix">
				<span className="hp-title-name">{this.props.name}</span>
				{ this.props.more ? <a href={this.props.more} className="hp-title-more">更多</a> : null }
				{ this.props.new ? <Link to={this.props.new} className="hp-title-more">更多</Link> : null }
				{ this.props.name == "汽車圖庫" ? <Link to="picture/" className="hp-title-more">更多</Link> : null }
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {

	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({

		}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(home)